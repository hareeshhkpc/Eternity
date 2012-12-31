/**
 * Class to represent the View of Message Configuration functionality. It renders different Views as required by the 
 * response received from the server. The view that it renders include 
 * - List of existing Message Configurations with version.
 * - To upload a new RMIM (only interaction schemas and its related/included schemas as a ZIP file at this point)
 * - List of RMIMs which are already imported where user can choose one and created a new Message Configuration
 * - Class view of a selected Message Type
 * - Field view of a selected Class in the Message Type
 * - Property view of a selected Field/Class
 * @returns Object of ConfigView
 */
function ConfigView() {
	var configView = this;
	this.currentAction = "";
	this.configManager = new ConfigManager();
	
	this.className = "ConfigView";

	this.requestListExistingMessagesTypes = requestListExistingMessagesTypes;
	this.listExistingMessagesTypes = listExistingMessagesTypes;
	this.requestMessageClassView = requestMessageClassView;
	this.showClassVieiwOfMessagesType = showClassVieiwOfMessagesType;
	this.selectionHandler = selectionHandler;
	this.changeMarkerImage = changeMarkerImage;
	this.showFieldsViewOfSelectedClass = showFieldsViewOfSelectedClass;
	this.showPropertyView = showPropertyView;
	this.updateSelectionOnConfigurationTree = updateSelectionOnConfigurationTree;
	this.showMessageBox = showMessageBox;
	this.goBackToPreviousPage = goBackToPreviousPage;
	
	/**
	 * Request to the server to list all message types which are already 
	 * imported and readily availale for configuration
	 */
	function requestListExistingMessagesTypes(){
		//show the page loader           
		$.mobile.showPageLoadingMsg();
		
		configView.configManager.loadAllExistingMessageTypes(listExistingMessagesTypes);
	}
	
	/**
	 * The response handler to render the existing message types.
	 * @param resp The response object got from the server. This contains
	 * List<ConfigMsgType>
	 */
	function listExistingMessagesTypes(resp){
		debugLog($.toJSON(resp), true);
		
		$('#config-existing-configs').show();		
		$('#config-existing-configs').html('');
		
		var list = $('#dummyConfigList').clone();
		list = $(list).attr('id', 'configList');
		list = $(list).css('display', 'block');
		$('#config-existing-configs').append($(list));
		$(list).html('');
		
		$.each(resp, function(key, value) {
			var item = $('#dummyConfigList').find('#listItem').clone();
			item = $(item).attr('id', 'listItem' + key);
			$(item).find('#listItemLink').attr('id', 'listItemLink' + key);
			$(item).find('#listItemHeader').attr('id', 'listItemHeader' + key);
			$(item).find('#listItemPara1').attr('id', 'listItemPara1' + key);
			$(item).find('#listItemPara2').attr('id', 'listItemPara2' + key);	
			$('#config-existing-configs').find('#configList').append($(item));
			
			//Update data
			//$(item).find('#listItemLink' + key).attr('href', 'javascript:alert("You selected: ' + value..metaInfo.artifactID + '");');
			//$(item).find('#listItemLink' + key).attr('message-type', value.metaInfo.artifactID);
			$(item).find('#listItemLink' + key).attr('object-path', key);
			$(item).find('#listItemLink' + key).attr('href', 'javascript:void(0);');
			$(item).find('#listItemLink' + key).unbind('click').bind('click',function(){
				var msgIndex = $(this).attr('object-path');
				configView.requestMessageClassView(msgIndex);
			});
			$(item).find('#listItemHeader' + key).html(value.metaInfo.artifactID);
			$(item).find('#listItemPara1' + key).html('The message type is of type ' + value.metaInfo.artifactID);
			$(item).find('#listItemPara2' + key).html('Publisher: HL7');
		});
		
		// Initialize the page (apply the styles)
		$('#config-existing-configs-page').page();
		$('#config-existing-configs').trigger("create");
		
		// Navigate to existing message configs page
		$.mobile.changePage( $('#config-existing-configs-page'), { transition: "slide" } );
		
		//hide the page loader           
		$.mobile.hidePageLoadingMsg();
	}
	
	/**
	 * Request to the server for giving back a class view of the selected messageType.
	 * @param messageType The selected message type/artifact ID
	 */
	function requestMessageClassView(messageType){
		//show the page loader           
		$.mobile.showPageLoadingMsg();
		
		configView.configManager.loadClassViewOfMessageType(messageType, showClassVieiwOfMessagesType);
	}
	
	/**
	 * Handler to render the Class View of the selected message type. It shows a TREE view of Root class and all
	 * its Participations/ActRelationships/Roles
	 * @param resp The HL7MessageConfiguration object from the server having Root class and its associated children
	 */
	function showClassVieiwOfMessagesType(resp){
		debugLog($.toJSON(resp), true);
		
		$('#config-class-view').show();		
		//$('#config-class-view').html('');
		
		// Load the mockup
		$('#config-class-view').html('');
		
		$('#config-class-view-page').find('#saveButton').unbind('click').bind('click',function(){
			alert($.toJSON(configView.configManager.configOut));
			configView.configManager.saveConfiguration(function(){
				alert("Saved");
			});
		});
		
		var root = $('#rootItem').clone();
		$(root).attr("id", "root1");
		$('#config-class-view').append($(root));
		$(root).find('a').html(resp.configClass.label);
		$(root).find('img').attr('object-path', 'configClass');
		$(root).find('a').attr('object-path', 'configClass');
		
		// Render checked or unchecked image matching to the current selection of this object
		configView.changeMarkerImage($(root).find('img[object-type="selection"]'), ('selected' in resp.configClass && resp.configClass.selected == true) ? true : false);
		
		// Bind click event on the class name so that we can show its fields' view
		$(root).find('a').unbind('click').bind('click',showFieldsViewOfSelectedClass);
		
		$.each(resp.configClass.classes, function(key, value) {
			//alert("Classes: key = " + key + ", " + $.toJSON(value));
			var item = null;
			// If the item is the first item in the list, apply different styles
			if(key == 0 && resp.configClass.classes.length > 1){
				item = $('#firstItem').clone();
			}
			
			// If the item is in the middle of the items in the list, apply different styles
			else if(key > 0 && key < (resp.configClass.classes.length - 1)){
				item = $('#middleItem').clone();
			}
			
			// If the item is the last item in the list, apply different styles
			else if(resp.configClass.classes.length === (key + 1)){
				item = $('#lastItem').clone();
			}
			$(item).attr("id", $(item).attr('id') + key);
			$('#config-class-view').append($(item));
			$(item).find('a').html(value.label);
			$(item).find('img').attr('object-path', 'configClass.classes[' + key + ']');		
			$(item).find('a').attr('object-path', 'configClass.classes[' + key + ']');
			
			// Render checked or unchecked image matching to the current selection of this object
			configView.changeMarkerImage($(item).find('img[object-type="selection"]'), ('selected' in value && value.selected == true) ? true : false);
			
			// Bind click event on the class name so that we can show its fields' view
			$(item).find('a').unbind('click').bind('click', showFieldsViewOfSelectedClass);
		});	
		
		// If only one item in the classes list, adjust its top so that the vertical line will touch the root class
		// DIV id 'lastItem0' will come only when there is one item in the 'classes' collection
		$('#lastItem0').css("margin-top", "-8px");//.css("border", "1px solid black");
		
		// Bind click on the 'tick mark' images. Irrespective of the class level (root or children), the event is bound to all images
		// and it makes use of the 'object-path' property to identify the object in the response object, then makes the 'selected'
		// property of that object to either 'true' or 'false'
		$('#config-class-view').find('img[object-type="selection"]').unbind('click').bind('click',function(){			
			configView.selectionHandler($(this));
		});
		
		// Initialize the page (apply the styles)
		$('#config-class-view-page').page();
		$('#config-class-view').trigger("create");
		
		// Navigate to existing message configs page
		$.mobile.changePage( $('#config-class-view-page'), { transition: "slide", reloadPage: true } );
		
		//hide the page loader           
		$.mobile.hidePageLoadingMsg();
	}
	
	function selectionHandler(selectedObject){
		var sel = 'configView.configManager.configOut.' + $(selectedObject).attr('object-path') + '.selected';
		//alert("Sel: " + sel);
		var selVal = null;
		try{
			selVal = eval(sel);
			//alert("Sel: " + sel + ", Value: " + selVal);
		} catch(e){
			alert("Error while evaluating expression: " + e);
			return;
		}
		if(selVal && selVal == true){
			try{
				sel += ' = false';
				//alert("Sel: " + sel);
				selVal = eval(sel);
				//alert("Sel: " + sel + ", Value: " + selVal);				
			} catch(e){
				alert("Error while evaluating expression: " + e);
				return;
			}
			configView.changeMarkerImage(selectedObject, false);
		} else {
			try{
				sel += ' = true';
				//alert("Sel: " + sel);
				selVal = eval(sel);
				//alert("Sel: " + sel + ", Value: " + selVal);
			} catch(e){
				alert("Error while evaluating expression: " + e);
				return;
			}
			configView.changeMarkerImage(selectedObject, true);
		}
		
		// propagate the selection throught the child tree
		var sel = 'configView.configManager.configOut.' + objectPath;
		try{
			alert("Sel: " + sel);
			selVal = eval(sel);
			alert("Sel: " + sel + ", Value: " + selVal);	
			
			updateSelectionOnConfigurationTree(selVal);
		} catch(e){
			alert("Error while evaluating expression: " + e);
			return;
		}
	}
	
	function updateSelectionOnConfigurationTree(selectedObject){
		// To be implemented
	}
	
	function changeMarkerImage(selectedObject, checkOrUncheck){
		if(checkOrUncheck === true)
			$(selectedObject).attr('src', '../images/1332935657_tick_circle.png');
		else
			$(selectedObject).attr('src', '../images/1332935649_tick.png');
	}
	
	/**
	 * Renders a Fields' view of a selected class (Act/Entity/Participation/Role/ActRelationship/RoleLink), with option 
	 * to choose from them.
	 * @param selectedObject DOM element on which the event is bound. This DOM element should contain an 
	 * object path to the selected class in the response object (ie., in HL7MessageConfiguration). Theh object path to the actual object
	 * is given in attribute 'object-path' which is evaluated as follows.
	 * eg: 'configClass' will be evaluated as 'configView.configManager.configOut.configClass' using an 'eval' function.
	 *     'configClass.classes[2]' will be evaluated as 'configView.configManager.configOut.configClass.classes[2]' using an 'eval' function,
	 *     where 'configView.configManager.configOut' refers to the response object received from server (HL7MessageConfiguration) in
	 *     this case.
	 */
	function showFieldsViewOfSelectedClass(){
		//show the page loader           
		$.mobile.showPageLoadingMsg();
		
		var objPath = $(this).attr('object-path');
		var sel = 'configView.configManager.configOut.' + objPath;
		//alert("Sel: " + sel);
		
		var selVal = null;
		try{
			selVal = eval(sel);
			//alert($.toJSON(selVal));
		} catch(e){
			alert("Error while evaluating expression: " + e);
			return;
		}
		
		$('#config-field-view').show();		
		
		$('#config-field-view-page').find('#saveButton').unbind('click').bind('click', function(){
			alert($.toJSON(configView.configManager.configOut));
		});
		
		$('#config-field-view-page').find('#headerLabel').html(selVal.label);
		
		if('rimType' in selVal && selVal.rimType === 'ACT' && "fields" in selVal){
			//alert("Act fields");
			// Load the mockup
			$('#config-field-view').html('');
			
			$.each(selVal.fields, function(key, value) {
				var item = $('#fieldView').clone();
				$(item).attr("id", $(item).attr('id') + key);
				$(item).find('#fieldItem').attr("id", $(item).find('#fieldItem').attr('id') + key);
				$(item).find('#fieldGrouper').remove();
				$('#config-field-view').append($(item));
				$(item).find('a').html(value.label);
				$(item).find('img').attr('object-path', objPath + '.fields[' + key + ']');
				$(item).find('a').attr('object-path', objPath + '.fields[' + key + ']');		
				$(item).find('a').attr('object-parent-path', objPath);
				
				// Render checked or unchecked image matching to the current selection of this object
				configView.changeMarkerImage($(item).find('img[object-type="selection"]'), ('selected' in value && value.selected == true) ? true : false);
				
				// Bind click event on the class name so that we can show its fields' view
				$(item).find('a').unbind('click').bind('click', showPropertyView);
			});	
		} 
		
		// Participation
		else if('rimType' in selVal && selVal.rimType === 'PARTICIPATION' && ("fields" in selVal || "classes" in selVal)){
			
			// Load the mockup
			$('#config-field-view').html('');
			
			// Own fields
			if("fields" in selVal && selVal.fields.length > 0){
				
				var view = $('#fieldView').clone();
				$(view).attr("id", $(view).attr('id') + "1");
				$(view).find('#fieldItem').remove();
				$('#config-field-view').append($(view));
				$(view).find('#fieldGrouper').attr('id', 'fieldGrouper1');
				$(view).find('#fieldGrouper1').html('Participation - ' + selVal.label);
				
				$.each(selVal.fields, function(key, value) {
					var item = $('#fieldView').find('#fieldItem').clone();
					$(item).attr("id", $(item).attr('id') + key);
					$(view).append($(item));
					$(item).find('a').html(value.label);
					$(item).find('img').attr('object-path', objPath + '.fields[' + key + ']');
					$(item).find('a').attr('object-path', objPath + '.fields[' + key + ']');		
					$(item).find('a').attr('object-parent-path', objPath);
					
					// Render checked or unchecked image matching to the current selection of this object
					configView.changeMarkerImage($(item).find('img[object-type="selection"]'), ('selected' in value && value.selected == true) ? true : false);
					
					// Bind click event on the class name so that we can show its fields' view
					$(item).find('a').unbind('click').bind('click', showPropertyView);
				});
			}
			
			if(!("classes" in selVal) || selVal.classes.length < 1){
				// Nothing to display as Role
				return;
			}
			var role = selVal.classes[0];
			
			// Role
			if('rimType' in role && role.rimType === 'ROLE' && "fields" in role){
				
				view = $('#fieldView').clone();
				$(view).attr("id", $(view).attr('id') + "2");
				$(view).find('#fieldItem').remove();
				$('#config-field-view').append($(view));
				$(view).find('#fieldGrouper').attr('id', 'fieldGrouper2');
				$(view).find('#fieldGrouper2').html('Role - ' + role.label);
				
				// Role fields
				$.each(role.fields, function(key, value) {
					var item = $('#fieldView').find('#fieldItem').clone();
					$(item).attr("id", $(item).attr('id') + key);
					$(view).append($(item));
					$(item).find('a').html(value.label);
					$(item).find('img').attr('object-path', objPath + '.classes[0].fields[' + key + ']');
					$(item).find('a').attr('object-path', objPath + '.classes[0].fields[' + key + ']');		
					$(item).find('a').attr('object-parent-path', objPath + '.classes[0]');
					
					// Render checked or unchecked image matching to the current selection of this object
					configView.changeMarkerImage($(item).find('img[object-type="selection"]'), ('selected' in value && value.selected == true) ? true : false);
					
					// Bind click event on the class name so that we can show its fields' view
					$(item).find('a').unbind('click').bind('click', showPropertyView);
				});
			}
			
			if(!("classes" in role) || role.classes.length < 1){
				// Nothing to display as entity
				return;
			}
			
			var entities = role.classes;
			
			$.each(entities, function(ekey, evalue) {
				//Entity
				if('rimType' in evalue && evalue.rimType === 'ENTITY' && "fields" in evalue){
					
					view = $('#fieldView').clone();
					$(view).attr("id", $(view).attr('id') + "3" + ekey);
					$(view).find('#fieldItem').remove();
					$('#config-field-view').append($(view));
					$(view).find('#fieldGrouper').attr('id', 'fieldGrouper3' + ekey);
					$(view).find('#fieldGrouper3' + ekey).html('Entity - ' + evalue.label);
					
					// Entiry fields
					$.each(evalue.fields, function(key, value) {
						var item = $('#fieldView').find('#fieldItem').clone();
						$(item).attr("id", $(item).attr('id') + ekey + "" + key);
						$(view).append($(item));
						$(item).find('a').html(value.label);
						$(item).find('img').attr('object-path', objPath + '.classes[0].classes[' + ekey + '].fields[' + key + ']');
						$(item).find('a').attr('object-path', objPath + '.classes[0].classes[' + ekey + '].fields[' + key + ']');	
						$(item).find('a').attr('object-parent-path', objPath + '.classes[0].classes[' + ekey + ']');
						
						// Render checked or unchecked image matching to the current selection of this object
						configView.changeMarkerImage($(item).find('img[object-type="selection"]'), ('selected' in value && value.selected == true) ? true : false);
						
						// Bind click event on the class name so that we can show its fields' view
						$(item).find('a').unbind('click').bind('click', showPropertyView);
					});
				}
			});
		}
		else {
			var msg = $('#message-no-fields').clone();
			$(msg).attr('id', 'message-no-fields1');
			$('#config-field-view').html($(msg));
			$(msg).show();			
		}
		
		// Bind click on the 'tick mark' images. Irrespective of the class level (root or children), the event is bound to all images
		// and it makes use of the 'object-path' property to identify the object in the response object, then makes the 'selected'
		// property of that object to either 'true' or 'false'
		$('#config-field-view').find('img[object-type="selection"]').unbind('click').bind('click', function(){			
			configView.selectionHandler($(this));
		});
		
		// Initialize the page (apply the styles)
		$('#config-field-view-page').page();
		$('#config-field-view').trigger("create");
		
		// Navigate to existing message configs page
		$.mobile.changePage( $('#config-field-view-page'), { transition: "slide" } );
		
		//hide the page loader           
		$.mobile.hidePageLoadingMsg();
	}
	
	function showPropertyView(){
		//show the page loader           
		$.mobile.showPageLoadingMsg();
		
		var objPath = $(this).attr('object-path');
		var objParentPath = $(this).attr('object-parent-path');
		var sel = 'configView.configManager.configOut.' + objPath;
		var selParent = 'configView.configManager.configOut.' + objParentPath;
		//alert("Sel: " + sel + "\nParent: " + selParent);
		
		var selVal = selParentVal = null;
		try {
			selVal = eval(sel);
			selParentVal = eval(selParent);
			//alert("Sel: " + $.toJSON(selVal) + ", Parent: " + $.toJSON(selParentVal));
		} catch(e) {
			alert("Error while evaluating expression: " + e);
			return;
		}
		
		$('#config-property-view').show();
		
		var prop = $('#propertyForm').clone();
		$('#config-property-view').html($(prop));
		$(prop).attr('id', 'propertyForm1');
		$(prop).show();
		
		$('#config-property-view-page').find('#headerLabel').html(selParentVal.label + ' - ' + selVal.label);
		$('#config-property-view-page').find('#propertyHeadItem').html(selVal.label);
		$('#config-property-view-page').find('#attrName').html(selVal.label);
		
		$('#config-property-view-page').find('#saveButton').unbind('click').bind('click', function(){
			alert($.toJSON(configView.configManager.configOut));
		});
		
		$('#config-property-view-page').find('#label').val(selVal.label);
		$('#config-property-view-page').find('#displayOrder').val('30');
		
		$('#config-property-view-page').find('#cardinality').val(selVal.minOccurs + '..' + selVal.maxOccurs);
		
		// Bind for Save and Cancel 
		$('#config-property-view-page').find('#btnPropertySave').attr('property-path', sel);
		$('#config-property-view-page').find('#btnPropertySave').click(function(){
			var path = $(this).attr('property-path');
			//alert("Path: " + path);
			try {
				var prop = eval(sel);
				//alert("prop: " + $.toJSON(prop));
				
				prop.label = $('#config-property-view-page').find('#label').val();
				prop.inputControl = $('#config-property-view-page').find('#inputControl').val();
				prop.displayOrder = $('#config-property-view-page').find('#displayOrder').val();
				var cardinality = $('#config-property-view-page').find('#cardinality').val();
				if(cardinality != null && cardinality != '' && /^\d+[\.]{2}[-]?\d+$/.test(cardinality)){
					var minMax = cardinality.split('..');
					if(minMax && minMax.length === 2){
						prop.minOccurs = minMax[0];
						prop.maxOccurs = minMax[1];
					}
				}	
				else {
					configView.showMessageBox('propertyForm1', "Wrong format of Cardinality. \nEg: 0..-1, 1..10, 0..1 etc", function(){
						configView.goBackToPreviousPage();
					});
				}
				//alert("prop: " + $.toJSON(prop));
			} catch(e) {
				alert("Error while evaluating expression: " + e);
				return;
			}
		});
		
		// Initialize the page (apply the styles)
		$('#config-property-view-page').page();
		$('#config-property-view').trigger("create");
		
		$('#config-property-view-page').find('#displayOrder').val(selVal.displayOrder).slider('refresh');
		
		// Navigate to existing message configs page
		$.mobile.changePage( $('#config-property-view-page'), { transition: "slide" } );
		
		//hide the page loader           
		$.mobile.hidePageLoadingMsg();
	}
	
	function goBackToPreviousPage(){
		var previousPage = $.mobile.activePage.data('ui.prevPage');
		$.mobile.changePage(previousPage.attr('id'), 'slide', true, true);
	}
	
	function showMessageBox(idOfParent, message, okFunction, cancelFunction){
		 $('#' + idOfParent).simpledialog({
			'mode' : 'bool',
			'prompt' : message,
			'useModal': true,
			'buttons' : {
				'OK': {
					click: okFunction
				}/*,
				'Cancel': {
					click: cancelFunction,
					icon: "delete",
					theme: "c"
				}*/
			}
		});
	}
	
	/**
	 * Logs to an HTML DIV if one with the id 'debugdiv' is available on the page. Ignored otherwise.
	 * @param what The message to log
	 * @param clearFirst Given 'true' will clear the existing logs before logging 'what'
	 */
	function debugLog(what, clearFirst){
		/*if(clearFirst === true){
			$('#messageJson').text(what);
		}
		else {
			$('#messageJson').text($('#messageJson').text() + "\n" + what);
		}*/
	}
}