/**
 * Class MessageLoader - Used to load the message in the UI and save the data
 * back to the message
 * 
 * @returns messageLoader
 * @author Administrator
 */
function MessageLoader(parentContainerID, messageObject, messageTypeID) {

	var messageLoader = this;
	
	this.parentContainerID = parentContainerID;
	this.messageObject = messageObject;
	this.messageTypeID = messageTypeID;
	
	this.loadDataOntoForm = loadDataOntoForm;
	this.readValueFromMessage = readValueFromMessage;
	
	function readValueFromMessage(tagName, pathFields, type, node) {
		var instanceObject = [];

		if (node === null) {
			console.log("null returned from messageLoader.readMessageObjects()");
			return instanceObject;
		}

		var methodName = ('get' + type + 'Object');

		if (methodName in messageLoader) {
			try {
				eval('instanceObject = messageLoader.' + methodName
						+ '(node)');
			} catch (error) {
				instanceObject = [];
			}
		}
		
		//messageLoader.checkInstanceObject(instanceObject, tagName);
		
		return instanceObject;
	};

	function loadDataOntoForm(lookupHandler) {
		messageLoader.lookupHandler = lookupHandler;
		
		//alert("XML:\n" + XmlUtil.xmlToString(messageLoader.messageObject.getXML()));
		
		editors = $('#' + messageLoader.parentContainerID).find('[isEditor="true"]');
		if(editors && editors.length > 0){
			processEditors(0, editors);
		}

		/**
		 * iterates through "editorsArray" and calls the loadEditor() to load the editor 
		 * @param index : index for the "editorsArray" 
		 * @param editorsArray : Its an array of HTML Fragments which contain the attribute isEditor="true"
		 */
		function processEditors(index, editorsArray){
			loadEditor(editorsArray[index++], function(){
				if(index < editorsArray.length){
					processEditors(index, editorsArray);
				}
				else{
					
					
				}
			});
		}

		/**
		 * loads the editor for HTML Fragment based on its "editorType"
		 * @param editorObject : HTML Fragment which has the required info for the editor to load 
		 * @param callbackAfterEditorLoad : callBack function being after each editor load 
		 */
		function loadEditor(editorObject, callbackAfterEditorLoad) {
			var dataXPath     = $(editorObject).attr('dataXPath');
			var dateFormatFunction = $(editorObject).attr('dateFormatFunction');
			
			//alert("dataXPath: " + dataXPath);
			
			var value = XmlUtil.getXPathResult(messageLoader.messageObject.getXML(), dataXPath, XPathResult.STRING_TYPE);
			//alert("value: " + value);
			
			value = (value && value.stringValue) ? value.stringValue : "";
			//alert("value: " + value);
			var tmpValue = value;
			//alert(dateFormatFunction+" : "+value);
			// Date Formatting
			if (dateFormatFunction && dateFormatFunction !== null && dateFormatFunction !== '' && value && value != '') {
				try {
					eval('value = '+ dateFormatFunction + '('+ value + ')');
				} catch (error) {
					// Error happened while calling the formatter function. Revert back the value
					value = tmpValue;
				}
			}
			/*if(value==null||value==""){
				value="-";
			}*/
			// update to ui
			$(editorObject).text(value);
			
			if(callbackAfterEditorLoad){
				callbackAfterEditorLoad();
			}
		}
	};
};