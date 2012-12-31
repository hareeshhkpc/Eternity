/**
 * Class MessageLoader - Used to load the message in the UI and save the data
 * back to the message
 * 
 * @returns MessageAndUIBinder
 * @author Administrator
 */
function MessageAndUIBinder(parentContainerID, messageObject, messageTypeID) {

	var messageAndUIBinder = this;
	this.parentContainerID = parentContainerID;
	this.messageObject = messageObject;
	this.messageTypeID = messageTypeID;
	this.nodeCollection = [];

	// Lookup handler to load and display all lookups of this message

	this.lookupHandler = null;
	this.properties = new Object();
	var bindPhysicianLookups = new Array();
	var bindServiceLookups = new Array();
	var physicianLookupMap = new HIN.HashMap();
	var serviceLookupMap = new HIN.HashMap();
	this.callback = false;

	this.editorXmlApi = new EditorXmlApi();
	this.editorSMOValueApi = new EditorSMOValueApi();
	this.editorUIApi = new EditorUIApi(messageAndUIBinder);

	var fieldMap = [];
	var eventListeners = [];
	this.updateItems = new Array();
	this.editorMap = new HIN.HashMap();
	/**
	 * used to bind all the fields in the Dom which have the attribute
	 * dataField="true"
	 */
	this.bindFieldEvents = function() {
		// alert("bind");
		$('#' + messageAndUIBinder.parentContainerID)
				.find('[dataField="true"]').unbind('change',
						messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID)
				.find('[dataField="true"]').bind('change',
						messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID)
				.find('[hasToggle="true"]').unbind('click',
						messageAndUIBinder.editorUIApi.toggleEditor);
		$('#' + messageAndUIBinder.parentContainerID)
				.find('[hasToggle="true"]').bind('click',
						messageAndUIBinder.editorUIApi.toggleEditor);
		$('#' + messageAndUIBinder.parentContainerID).find(
				'span[dataField="true"]').unbind('DOMSubtreeModified',
				messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID).find(
				'span[dataField="true"]').bind('DOMSubtreeModified',
				messageAndUIBinder.updateFieldValueToMessage);

		$('#' + messageAndUIBinder.parentContainerID).find('[uiRole="editor"]').find("#SubEditor").find('input[dataField="true"]').unbind('keyup',messageAndUIBinder.updateFieldValueToMainField);
		$('#' + messageAndUIBinder.parentContainerID).find('[uiRole="editor"]').find("#SubEditor").find('input[dataField="true"]').bind('keyup',messageAndUIBinder.updateFieldValueToMainField);
		$('#' + messageAndUIBinder.parentContainerID).find('[uiRole="editor"]').find("#SubEditor").find('select[dataField="true"]').unbind('change',messageAndUIBinder.updateFieldValueToMainField);
		$('#' + messageAndUIBinder.parentContainerID).find('[uiRole="editor"]').find("#SubEditor").find('select[dataField="true"]').bind('change',messageAndUIBinder.updateFieldValueToMainField);
	};
	
	/**
	 * keyup and keydown and onChange on any sub field in the DOM with the attribute dataField="true"
	 * this method is executed, this method concatenates all sub fields values 
	 * and updates main field.
	 */
	this.updateFieldValueToMainField = function() {
		var editor = $(this).closest('[uiRole="editor"]')[0];
		var isEditorDiv = $(editor).closest('[isEditor="true"]');
		var editorType = $(isEditorDiv).attr('editorType');
		var subEditor = $(editor).find("#SubEditor").html();
		if(subEditor)
			messageAndUIBinder.editorUIApi.getEditoValues(editor, editorType);
	}
	
	/**
	 * On change of any field in the DOM with the attribute dataField="true"
	 * this method is executed, field values are fetched and an "instanceObject"
	 * is updated with these values This "instanceObject" is passed to
	 * writeValueToMessage() to update the XML
	 */
	this.updateFieldValueToMessage = function() {
		var parentDiv = $(this).closest('[uiRole="editor"]')[0];// $('#'+parentContainerID);
		var isEditorDiv = $(parentDiv).closest('[isEditor="true"]');
		if (isEditorDiv && isEditorDiv.length > 0) {
			isEditorDiv = isEditorDiv[0];
		}
		if (isEditorDiv && $(isEditorDiv).attr('groupId')) {
			var groupId = $(isEditorDiv).attr('groupId');

			// Empty the nodeCollection in first place
			messageAndUIBinder.nodeCollection = [];
			var pathFields = null;
			var tagName = null;

			// We got a groupId. Need to collect xml nodes of all othem and make
			// a batch write to the message.
			$('#' + messageAndUIBinder.parentContainerID).find(
					'[groupId=' + groupId + ']').each(
					function(key, uiField) {
						var fieldInEditor = $(uiField).find(
								'[dataField="true"]')[0];

						pathFields = $(fieldInEditor).attr('pathFields').split(
								',');
						tagName = $(fieldInEditor).attr('tagName');

						var writeImmediate = false;
						messageAndUIBinder.updateSingleFieldToMessage(
								fieldInEditor, writeImmediate);
					});

			// Batch update message
			// alert("nodeCollection: " +
			// messageAndUIBinder.nodeCollection.length);

			// Batch update of EMPID & ROLE_NAME
			messageAndUIBinder.createMessageObjects(pathFields, tagName);
		} else {
			var writeImmediate = true;
			messageAndUIBinder.updateSingleFieldToMessage(this, writeImmediate);
		}
	};

	this.updateSingleFieldToMessage = function(fieldInEditor, writeImmediate) {
		var thisID = $(fieldInEditor).attr('id');
		var value = $(fieldInEditor).val();
		var type = $(fieldInEditor).attr('dataType');
		var tagName = $(fieldInEditor).attr('tagName');
		var fields = $(fieldInEditor).attr('fields').split(',');
		var parentDiv = $(fieldInEditor).closest('[uiRole="editor"]')[0];// $('#'+parentContainerID);
		var pathFields = $(fieldInEditor).attr('pathFields').split(',');
		var labelField = $(fieldInEditor).attr('labelField');

		if (labelField) {
			$('#' + messageAndUIBinder.parentContainerID)
					.find('#' + labelField).trigger("change");
		}

		var instanceObject = [];
		var nullSet = true;
		var image = false;

		$
				.each(
						fields,
						function(key, fieldId) {

							image = false;
							if ($(parentDiv).find('#' + fieldId).attr("type") == "file") {
								image = true;
								var oFReader = new FileReader(), rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;
								var oFile = document.getElementById(fieldId).files[0];

								if (!rFilter.test(oFile.type)) {
									alert("You must select a valid image file!");
									return;
								}

								oFReader.readAsDataURL(oFile);
								oFReader.onload = function(oFREvent) {
									$(parentDiv)
											.find('#' + fieldId + "Box")
											.attr("src", oFREvent.target.result);
									instanceObject
											.push((fieldId === 'null') ? null
													: oFREvent.target.result);

									$
											.each(
													instanceObject,
													function(key, value) {
														if (value
																&& value !== null
																|| $
																		.trim(value) !== '') {
															nullSet = false;
														}
													});

									if (nullSet === true) {
										instanceObject = [ {
											'nullFlavor' : 'NI'
										} ];
									}

									messageAndUIBinder.writeValueToMessage(
											tagName, pathFields, type,
											instanceObject, writeImmediate);
								};
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'text'
									|| $(parentDiv).find('#' + fieldId).attr(
											'type') == 'hidden'
									|| $(parentDiv).find('#' + fieldId).attr(
											'type') == 'multiple'
									|| $(parentDiv).find('#' + fieldId).attr(
											'type') == 'password') {
								// instanceObject.push((fieldId === 'null') ?
								// null: $(parentDiv).find('#' +
								// fieldId).val());

								if ($(parentDiv).find('#' + fieldId).attr(
										'multiple') == 'multiple') {
									var options = $(parentDiv).find(
											'#' + fieldId).find('option');
									/*
									 * $.each(options,function(index, option){
									 * if($(option).attr("selected")){
									 * instanceObject.push((fieldId === 'null') ?
									 * null: $(option).val());
									 * 
									 * if(type === 'CVList'){
									 * instanceObject.push((fieldId === 'null') ?
									 * null: $(option).val()); } } });
									 */
									$(parentDiv)
											.find('select option:selected')
											.each(
													function() {
														instanceObject
																.push((fieldId === 'null') ? null
																		: $(
																				this)
																				.val());

														if (type === 'CVList') {
															instanceObject
																	.push((fieldId === 'null') ? null
																			: $(
																					this)
																					.val());
														}
													});

								} else {
									instanceObject
											.push((fieldId === 'null') ? null
													: $(parentDiv).find(
															'#' + fieldId)
															.val());
								}
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'date') {
								instanceObject.push((fieldId === 'null') ? null
										: $(parentDiv).find('#' + fieldId)
												.val());
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'label'
									&& type === 'CVList') {
								instanceObject.push($(parentDiv).find(
										'#' + fieldId).text());
								instanceObject.push($(parentDiv).find(
										'#' + fieldId).text());
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'label') {
								instanceObject.push($(parentDiv).find(
										'#' + fieldId).text());
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'checkbox'
									&& type === 'CVList') {
								if ($(parentDiv).find('#' + fieldId).is(
										":checked")) {
									instanceObject.push($(parentDiv).find(
											'#' + fieldId).val());
									instanceObject.push($(parentDiv).find(
											'#' + fieldId).val());
								} else {
									instanceObject.push(null);
									instanceObject.push(null);
								}
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'checkbox'
									&& type === 'II') {
								if ($(parentDiv).find('#' + fieldId).is(
										":checked")) {
									instanceObject.push('1');

								} else {
									instanceObject.push('0');

								}
							}

							/* CHECK BOX UPDATE XML */
							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'checkbox') {
								// alert("in check box: "+ $(parentDiv).find('#'
								// + fieldId).val());
								if ($(parentDiv).find('#' + fieldId).is(
										":checked")) {
									instanceObject.push($(parentDiv).find(
											'#' + fieldId).val());
								} else {
									instanceObject.push(null);
								}
							}

							else if ($(parentDiv).find('#' + fieldId).attr(
									'type') == 'radio') {
								// alert("in radio");
								if ($(parentDiv).find('#' + fieldId).is(
										':checked')) {
									instanceObject.push($(parentDiv).find(
											'#' + fieldId).val());

									if ($(parentDiv).find('#' + fieldId).attr(
											'dataType') == 'CVList') {
										instanceObject.push($(parentDiv).find(
												'#' + fieldId).val());
									}
								}
								/*
								 * else { instanceObject.push(null); }
								 */
							}

							else {
								instanceObject.push((fieldId === 'null') ? null
										: $(parentDiv).find('#' + fieldId)
												.text());
							}

						});

		if (image == false) {
			$.each(instanceObject, function(key, value) {
				if (value && value !== null || $.trim(value) !== '') {
					nullSet = false;
				}
			});

			if (nullSet === true) {
				instanceObject = [ {
					'nullFlavor' : 'NI'
				} ];
			}

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, writeImmediate);
		}
	};

	/**
	 * Used to create the the Xml node to be updated to the message, it calls
	 * the get XML methods based on the datatype of the node to be created
	 * 
	 * @param :
	 *            tagName: Name of the node to be created pathFields: Path where
	 *            the node has to be updated (varies based on the config file
	 *            used) type: dataType of the node being updated instanceObject:
	 *            Object that contains the values retrieved from the UI
	 *            writeImmediate: Whether to write the value immediately to
	 *            message or keep in nodeCollection
	 */
	this.writeValueToMessage = function(tagName, pathFields, type,
			instanceObject, writeImmediate) {
		// alert("in write");
		messageAndUIBinder.checkInstanceObject(instanceObject, tagName);
		var node = instanceObject;
		var methodName = ('get' + type + 'Xml');

		/*
		 * if (methodName in messageAndUIBinder) { try { eval('node =
		 * messageAndUIBinder.' + methodName + '(tagName, instanceObject)'); }
		 * catch (error) { // Error occured. Better return return; } }
		 */

		if (writeImmediate != undefined && writeImmediate === false) {
			// Push the node to write as batch
			messageAndUIBinder.nodeCollection.push({
				node : node,
				type : type,
				pathFields : pathFields
			});
		} else {
			messageAndUIBinder.createMessageObjects(pathFields, tagName, node,
					type);
		}

	}

	/**
	 * retrieves the node from the message based on the on the tagName and
	 * pathField, calls the get object method based on the dataType, where the
	 * values from the xml node are update to an object
	 * 
	 * @param: tagName: name of the tag to be found in the message pathFields:
	 *         Path at which the node has to be found in the message type: Data
	 *         type of the node to be found
	 * @return : returns teh "instanceObject" which has all the values retrieved
	 *         from the XML Node
	 */
	this.readValueFromMessage = function(tagName, pathFields, type, node) {
		var instanceObject = [];

		if (node === null) {
			console
					.log("null returned from messageAndUIBinder.readMessageObjects()");
			return instanceObject;
		}

		var methodName = ('get' + type + 'SMOValue');

		if (methodName in messageAndUIBinder.editorSMOValueApi) {
			try {
				eval('instanceObject = messageAndUIBinder.editorSMOValueApi.'
						+ methodName + '(node)');
			} catch (error) {
				instanceObject = [];
			}
		}

		// messageAndUIBinder.checkInstanceObject(instanceObject, tagName);

		return instanceObject;
	};

	this.checkInstanceObject = function(instanceObject, tagName) {
		var inst = "";
		$(instanceObject).each(function(key, val) {
			inst += val + ",";
		});
	}

	/**
	 * creats the UI by loading all the editors
	 * 
	 * @param: lookupHandler : an object of lookupHandler.js, this helps in
	 *         loading the lookups after editor load
	 */
	this.loadDataOntoForm = function(lookupHandler, properties,
			callbackAferLoadingData) {
		// alert("in load");
		var editors = [];
		messageAndUIBinder.lookupHandler = lookupHandler;
		if (properties) {
			messageAndUIBinder.properties = properties;
		}

		if (callbackAferLoadingData) {
			messageAndUIBinder.callback = true;
		}

		/*
		 * editors = $('#' +
		 * messageAndUIBinder.parentContainerID).find('[isEditor="true"]');
		 */

		$('#' + messageAndUIBinder.parentContainerID).find('[isEditor="true"]')
				.each(function() {
					if ($(this).attr("rendered") === 'true') {

					} else {
						editors.push($(this));
					}

				});

		if (editors && editors.length > 0) {
			processEditors(0, editors);
		}

		/**
		 * iterates through "editorsArray" and calls the loadEditor() to load
		 * the editor
		 * 
		 * @param index :
		 *            index for the "editorsArray"
		 * @param editorsArray :
		 *            Its an array of HTML Fragments which contain the attribute
		 *            isEditor="true"
		 */
		function processEditors(index, editorsArray) {
			/*
			 * if($(editorsArray[index]).attr("rendered") === 'true'){ return; }
			 */

			loadEditor(editorsArray[index++], function() {
				if (index < editorsArray.length) {
					processEditors(index, editorsArray);
				} else {
				}
			});
		}

		/**
		 * loads the editor for HTML Fragment based on its "editorType"
		 * 
		 * @param editorObject :
		 *            HTML Fragment which has the required info for the editor
		 *            to load
		 * @param callbackAfterEditorLoad :
		 *            callBack function being after each editor load
		 */
		function loadEditor(editorObject, callbackAfterEditorLoad) {
			var dataType = $(editorObject).attr('dataType');
			var editorType = $(editorObject).attr('editorType');
			var configParams = $(editorObject).attr('configParams');
			var editorId = $(editorObject).attr('id');

			try {
				eval('var configParamsObj=' + configParams);
			} catch (error) {
				alert("Invalid JSON config params from the form: "
						+ configParams);
				return;
			}

			var methodName = ('get' + editorType + 'UI');

			var editorObj = "";
			if (methodName in messageAndUIBinder.editorUIApi) {
				try {
					eval('editorObj = new messageAndUIBinder.editorUIApi.'
							+ methodName + '(editorObject, configParamsObj)');
					if (editorId) {
						messageAndUIBinder.editorMap.put(editorId, editorObj);
					}
					// alert("editorMap: "+messageAndUIBinder.editorMap)

				} catch (error) {
					alert("Error in calling editorUI method: " + error);
					return;
				}

			}

			if ($(editorObject).attr('editorType') == 'Grid') {
				var pathField = $(editorObject).attr('pathFields').split(',');
				var tagName = $(editorObject).attr('tagName');
				var pathFields = '';
				var found = [];
				var res;

				for ( var j = 0; j < pathField.length; j++) {
					if (pathField[j] && pathField[j] !== "")
						pathFields += pathField[j] += "/";
				}

				var xpath = "//" + pathFields + tagName;
				var result = XmlUtil.getXPathResult(
						messageAndUIBinder.messageObject.getXML(), xpath,
						XPathResult.ORDERED_NODE_ITERATOR_TYPE);

				while (res = result.iterateNext()) {
					found.push(res);
				}

				for ( var i = 0; i < (found.length - 1); i++) {
					$(editorObject).find("#addButton").trigger("click");
				}

			}

			if (callbackAfterEditorLoad) {
				callbackAfterEditorLoad();
			}
		}

		/**
		 * binding the fields, to load look up values
		 */
		messageAndUIBinder.bindLookups(callbackAfterLookupLoading);

		function processGroupFields(groupIdMap) {
			$
					.each(
							groupIdMap,
							function(index, groupId) {

								var fieldGroupArray = $(
										'#'
												+ messageAndUIBinder.parentContainerID)
										.find('[groupId=' + groupId + ']');

								// alert("fieldGroupArray:
								// "+fieldGroupArray.length+" groupId:
								// "+groupId);

								if (fieldGroupArray.length > 0) {
									var groupEle = fieldGroupArray[0];
									var fieldInEditor = $(groupEle).find(
											'[dataField="true"]')[0];

									/*
									 * to make sure the editor is loaded brfore
									 * loadDataToEditor() is called
									 */
									if (fieldInEditor) {
										var type = $(groupEle).attr('dataType');
										var tagName = $(groupEle).attr(
												'tagName');
										var pathFields = $(groupEle).attr(
												'pathFields');
										if (pathFields) {
											pathFields = pathFields.split(',');
										} else {
											pathFields = [];
										}
										messageAndUIBinder.nodeCollection = messageAndUIBinder
												.readMessageObjects(pathFields,
														tagName);

										$
												.each(
														fieldGroupArray,
														function(key, uiField) {
															// alert("in each "
															// +
															// messageAndUIBinder.nodeCollection);
															var fieldInEditor = $(
																	uiField)
																	.find(
																			'[dataField="true"]')[0];
															var node = null;
															var instanceObject = null;

															var type = $(
																	fieldInEditor)
																	.attr(
																			'dataType');
															var tagName = $(
																	fieldInEditor)
																	.attr(
																			'tagName');
															var pathFields = $(
																	fieldInEditor)
																	.attr(
																			'pathFields')
																	.split(',');
															if (messageAndUIBinder.nodeCollection) {
																// alert("messageAndUIBinder.nodeCollection:
																// "+
																// messageAndUIBinder.nodeCollection.length);

																if (fieldGroupArray.length == 1) {
																	node = messageAndUIBinder.nodeCollection[0];
																} else {
																	node = messageAndUIBinder.nodeCollection[key];
																}

															}

															if (node) {
																instanceObject = messageAndUIBinder
																		.readValueFromMessage(
																				tagName,
																				pathFields,
																				type,
																				node);

																// alert("instanceObject:
																// "+instanceObject);

																messageAndUIBinder.fieldMap = [];
																messageAndUIBinder
																		.loadDataToEditor(
																				uiField,
																				instanceObject);
															}

														});
									}
								}
							});

		}

		/**
		 * loads the data from the the message to each html fragment from the
		 * DOM that has the attr isEditor="true"
		 */
		function callbackAfterLookupLoading() {
			var fieldGroupArray = [];
			var editors = [];
			var groupIdMap = [];

			var readOnly = messageAndUIBinder.properties.readOnly;

			if (readOnly && readOnly === true) {
				$('#' + messageAndUIBinder.parentContainerID)
						.find('[dataField="true"]')
						.each(
								function(index, field) {

									if ($(field).attr('type') == 'multiple') {
										$(field).find('option').each(
												function(index, val) {
													$(val).attr("disabled",
															"disabled");
												});
									} else if ($(field).attr('data-role') == 'datebox') {
										$(field).removeAttr('data-role');
										$(field).removeAttr('data-options');
										// $(field).trigger('refresh');
										var htmlFrag = $(field);
										var parent = $(field).closest(
												'[class="ui-align-text"]');
										$(parent).html(htmlFrag);
										$(parent).trigger('create');

									} else {
										$(field).attr("disabled", "disabled");
									}

								});

				$('#' + messageAndUIBinder.parentContainerID).find(
						'[hasToggle="true"]').each(function(index, field) {
					$(field).attr("disabled", "disabled");

				});
			}

			$('#' + messageAndUIBinder.parentContainerID).find(
					'[isEditor="true"]').each(function(key, editor) {
				if ($(editor).attr('groupId')) {

					if (groupIdMap.indexOf($(editor).attr('groupId')) > -1) {

					} else {
						groupIdMap.push($(editor).attr('groupId'));
					}

				} else {
					editors.push(editor);
				}
			});

			processGroupFields(groupIdMap);

			$.each(editors, function() {
				var instanceObject = null;

				var type = $(this).attr('dataType');
				var tagName = $(this).attr('tagName');
				// var pathFields = $(this).attr('pathFields').split(',');
				var pathFields = $(this).attr('pathFields');

				// alert("pathFields:"+pathFields)

				if (pathFields) {
					pathFields = pathFields.split(',');
				} else {
					pathFields = [];
				}

				node = messageAndUIBinder.readMessageObjects(pathFields,
						tagName);

				node = (AppUtil.isArray(node)) ? node[0] : node;

				instanceObject = messageAndUIBinder.readValueFromMessage(
						tagName, pathFields, type, node);
				// alert("instanceObject: "+instanceObject);
				messageAndUIBinder.fieldMap = [];
				messageAndUIBinder.loadDataToEditor($(this), instanceObject);
			});

			try {
				$('#' + messageAndUIBinder.parentContainerID).find('select')
						.selectmenu('refresh', true);
			} catch (e) {

			}

			loadEditorValues();

		}
		;

		/**
		 * To bind all the fields in the Dom which have the attribute
		 * dataField="true"
		 */
		messageAndUIBinder.bindFieldEvents();

		if (messageAndUIBinder.callback) {
			messageAndUIBinder.callback = false;
			callbackAferLoadingData();
		}

		/**
		 * Added to load the value into the display text box on load of the
		 * message
		 */
		function loadEditorValues() {
			$('#' + messageAndUIBinder.parentContainerID).find(
					'[isEditor="true"]')
					.each(
							function() {
								var editor = $(this);
								editor.attr("rendered", "true");
								var editorFragment = $(this).find(
										"[uiRole='editor']")[0];

								if (editorFragment) {
									var editorType = editor.attr("editorType");
									messageAndUIBinder.editorUIApi
											.getEditoValues(editorFragment,
													editorType);
								}
							});
		}
		;
	};

	/**
	 * Loades data to each editor from the from the meaasge XML
	 * 
	 * @param htmlFragment :
	 *            HTML Fragment which contains the editor.
	 */
	this.loadDataToEditor = function(htmlFragment, instanceObject) {
		var containerType = $(htmlFragment).attr("containerType");
		
		var tinyMCEObj = null;
		var editorId = null;
		var fieldId = null
		var editorObj = null;
		var templateId = null;
		var emailType = null;
		
		if(containerType){
			editorId = $(htmlFragment).attr("id");
			templateId = $(htmlFragment).attr("templateId");
			fieldId = $(htmlFragment).find('[ dataField="true"]').attr('id');
			emailType = $(htmlFragment).attr("emailType");
			editorObj = messageAndUIBinder.geteditor(editorId);
			messageAndUIBinder.editorUIApi.insertRichTextEditor(onInitTinyMCE, fieldId);	
		}
		
		function onInitTinyMCE(){
			tinyMCEObj = editorObj.getField(fieldId);
			//alert("emailType: " + emailType);
			messageAndUIBinder.loadDataToIframe(tinyMCEObj,htmlFragment, emailType);
			$(document.getElementById(fieldId+'_ifr').contentWindow.document).blur(function() {
				messageAndUIBinder.updateIframeContentToMessage(tinyMCEObj,htmlFragment);
			});
		}
		
		var editorFragment = htmlFragment;
		$(editorFragment)
				.find('[dataField="true"]')
				.each(
						function() {
							var pathFields = $(this).attr("pathFields");
							if (pathFields != null) {
								/*
								 * $('#'
								 * +messageAndUIBinder.parentContainerID).find('[dataField="true"]').each(function(){
								 */
								var thisID = $(this).attr('id');
								var type = $(this).attr('dataType');
								var tagName = $(this).attr('tagName');
								var fields = ($(this).attr('fields') != "") ? $(
										this).attr('fields').split(',')
										: [];
								var pathFields = $(this).attr('pathFields')
										.split(',');
								var dateFormatFunction = $(this).attr(
										'dateFormatFunction');
								var fieldMapKey = $(this).attr('pathFields')
										+ $(this).attr('tagName')
										+ $(this).attr('fields');

								if (messageAndUIBinder.fieldMap
										.indexOf(fieldMapKey) > -1) {
									return;
								} else {
									messageAndUIBinder.fieldMap
											.push(fieldMapKey);
								}

								if (instanceObject
										&& instanceObject.length === 1) {
									return; // only nullFlavor
								}

								$
										.each(
												fields,
												function(key, fieldId) {
													var fieldValue = instanceObject[key + 1];

													// Date Formatting
													if (dateFormatFunction
															&& dateFormatFunction !== null
															&& dateFormatFunction !== ''
															&& fieldValue
															&& fieldValue != '') {
														try {
															eval('fieldValue = '
																	+ dateFormatFunction
																	+ '(new Date('
																	+ fieldValue
																	+ '))');
														} catch (error) {
															// Error happened
															// while calling the
															// formatter
															// function. Revert
															// back the value
															fieldValue = instanceObject[key + 1];
														}
													}

													var fieldObject = $(
															editorFragment)
															.find('#' + fieldId);

													if ($(fieldObject).attr(
															"type") == 'text'
															|| $(fieldObject)
																	.attr(
																			'type') == 'hidden'
															|| $(fieldObject)
																	.attr(
																			'type') == 'password') {
														if ($(fieldObject)
																.attr('type') == 'password') {
															$(
																	"#PasswordExtension")
																	.attr(
																			"value",
																			fieldValue);
														}

														$(fieldObject).attr(
																"value",
																fieldValue);

														// alert("fieldValue:
														// "+fieldValue);

														/*
														 * Condition added to to
														 * update the value in
														 * search box
														 */
														if ($(fieldObject)
																.attr(
																		'placeholder')) {
															$(fieldObject)
																	.attr(
																			"placeholder",
																			fieldValue);
															/*
															 * $(fieldObject).attr(
															 * "value",
															 * fieldValue);
															 */
														}

														if ($(fieldObject)
																.attr('type') == 'hidden'
																&& $(
																		fieldObject)
																		.attr(
																				'dataType') == 'CVList') {
															$(fieldObject)
																	.trigger(
																			'change');
														}
													}

													if ($(fieldObject).attr(
															"type") == 'multiple') {
														var comboId = $(
																fieldObject)
																.attr("id");

														if (fieldValue) {
															if ($(fieldObject)
																	.attr(
																			"multiple") == 'multiple') {
																fieldValue = instanceObject;

																$
																		.each(
																				fieldValue,
																				function(
																						key,
																						value) {
																					$(
																							editorFragment)
																							.find(
																									'select#'
																											+ comboId
																											+ ' option[value='
																											+ value
																											+ ']')
																							.attr(
																									"selected",
																									"selected");
																				});

															} else {
																$(
																		editorFragment)
																		.find(
																				'select#'
																						+ comboId
																						+ ' option[value='
																						+ fieldValue
																						+ ']')
																		.attr(
																				"selected",
																				"selected");
															}
														}
													}

													if ($(fieldObject).attr(
															"type") == 'file') {
														$(editorFragment)
																.find(
																		'#'
																				+ fieldId
																				+ 'Box')
																.attr("src",
																		fieldValue);
													}

													if ($(fieldObject).attr(
															"type") == 'label') {
														if (fieldValue
																&& (fieldId == "EDLanguage")) {
															fieldValue = fieldValue
																	.toString()
														}
														$(fieldObject).text(
																fieldValue);
													}

													if ($(fieldObject).attr(
															"type") == 'date') {
														$(fieldObject).attr(
																"value",
																fieldValue);
													}
													/*
													 * dataFormat: [null, key,
													 * value, key2, value2,...]
													 */
													if ($(fieldObject).attr(
															"type") == 'checkbox'
															&& type == 'CVList') {
														// pick the key from
														// instanceObject array
														var currentFieldValue = instanceObject[(key
																+ key + 1)];
														if (currentFieldValue == $(
																fieldObject)
																.val()
																.toLowerCase()) {
															$(fieldObject)
																	.attr(
																			"checked",
																			"checked");
														}
													}

													if ($(fieldObject).attr(
															"type") == 'checkbox'
															&& type == 'II') {
														var currentFieldValue = instanceObject[(key + 1)];
														if (currentFieldValue == 1) {
															$(fieldObject)
																	.attr(
																			"checked",
																			"checked");
														}
													}

													if ($(fieldObject).attr(
															'type') == 'radio') {
														var group = $(
																fieldObject)
																.closest(
																		'[uiRole="editor"]')[0];

														$(group)
																.find(
																		'[dataField="true"]')
																.each(
																		function() {
																			if ($(
																					this)
																					.attr(
																							'value') === $
																					.trim(fieldValue)) {
																				$(
																						this)
																						.attr(
																								'checked',
																								"checked")
																						.checkboxradio(
																								"refresh");
																			}
																		});
													}

													if ($(fieldObject).attr(
															"type") == 'checkbox') {
														$(
																'#'
																		+ messageAndUIBinder.parentContainerID)
																.find(
																		'[dataField="true"]')
																.each(
																		function() {
																			if (fieldValue) {
																				if (fieldValue
																						.toLowerCase() == $(
																						this)
																						.val()
																						.toLowerCase()) {
																					$(
																							this)
																							.attr(
																									"checked",
																									"checked");
																				}
																			}
																		});

													}
													if ($(fieldObject).attr(
															'editorType') == 'EDFileAttachment') {
														if ($(editorFragment)
																.find(
																		"#EDReference")
																.attr("value")) {
															var mediaType = $(
																	editorFragment)
																	.find(
																			'#EDMediaType')
																	.attr(
																			"value");
															var typeSize = mediaType
																	.split(',');
															$(editorFragment)
																	.find(
																			'#EDMediaTypeSize')
																	.text(
																			typeSize[1]);
															$(editorFragment)
																	.find(
																			'#EDMediaTypeType')
																	.text(
																			typeSize[0]);

															$(editorFragment)
																	.find(
																			"#EDfileAttach")
																	.css(
																			"display",
																			"block");
															$(editorFragment)
																	.find(
																			'#openButton')
																	.button(
																			'enable');
															$(editorFragment)
																	.find(
																			'#downloadButton')
																	.button(
																			'enable');
														}
													}

												});

								// Check boxes generated dynamically by lookup
								// binding are handled here
								if ($(this).attr('lookupControlType') == 'checkBox') {
									$(this)
											.find('input[type="checkbox"]')
											.each(
													function() {

														var checkItem = $(this);
														$
																.each(
																		instanceObject,
																		function(
																				key,
																				value) {
																			if (value == $(
																					checkItem)
																					.val())
																				$(
																						checkItem)
																						.attr(
																								"checked",
																								"checked");
																		});
													});
								}
							}
						});
	}

	/**
	 * Loads the look up values
	 * 
	 * @param callbackAfterLookupLoading
	 */
	this.bindLookups = function(callbackAfterLookupLoading) {
		var lookups = [];

		$('#' + messageAndUIBinder.parentContainerID).find(
				'[dataField="true" ]').each(function(key, value) {
			if ($(this).attr("lookupControlType")) {
				lookups.push([ {
					name : 'conceptClass',
					value : $(this).attr('conceptClass')
				}, {
					name : 'type',
					value : $(this).attr("lookupControlType")
				}, {
					name : 'elementId',
					value : $(this).attr('id')
				} ]);
			}
		});

		messageAndUIBinder.lookupHandler.callbackAfterLookupLoading = callbackAfterLookupLoading;

		/**
		 * call to lookupHandler.js to load the look ups
		 */
		messageAndUIBinder.lookupHandler.lookUp($('#'
				+ messageAndUIBinder.parentContainerID), lookups);
	};

	/**
	 * creates a msg object with the node to be appended
	 * 
	 * @param objectArray :
	 *            array of elements in the path fields
	 * @param fieldName :
	 *            Name of the tag
	 * @param fieldValue :
	 *            Node to be appended
	 * @returns returns the msg obj
	 */
	this.createMessageObjects = function(objectArray, fieldName, fieldValue,
			type) {
		var obj = null;

		if (fieldValue != undefined && typeof (fieldValue) === 'object'/*
																		 * &&
																		 * AppUtil.isArray(fieldValue)
																		 * ===
																		 * false
																		 */) {
			obj = messageAndUIBinder.getSMOForPathField(objectArray);
			// obj.setValue(fieldName, fieldValue);
			if (obj) {
				messageAndUIBinder.setSMOValue(obj, fieldName, fieldValue,
						type, false);
			}
		} else {
			var samePathField = true;
			var path = messageAndUIBinder.nodeCollection[0].pathFields;
			for ( var i = 0; i < messageAndUIBinder.nodeCollection.length; i++) {
				var node = messageAndUIBinder.nodeCollection[i];
				var curPath = node.pathFields.join(",");
				var firstPath = path.join(",");
				if (curPath !== firstPath) {
					samePathField = false;
					break;
				}
			}

			if (samePathField === true) {
				obj = messageAndUIBinder.getSMOForPathField(path);
				if (obj) {
					obj.clearValue(fieldName);
				}
			}

			for ( var i = 0; i < messageAndUIBinder.nodeCollection.length; i++) {
				var node = messageAndUIBinder.nodeCollection[i];
				obj = messageAndUIBinder.getSMOForPathField(node.pathFields);
				if (obj) {
					messageAndUIBinder.setSMOValue(obj, fieldName, node.node,
							node.type, true);
				}
			}
			// obj.setValue(fieldName, messageAndUIBinder.nodeCollection);
		}

		//alert("Message xml in M&UIB: \n" + XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));

		return obj;

	};

	this.getSMOForPathField = function(pathField) {
		var obj = messageAndUIBinder.messageObject
				.findObject(messageAndUIBinder.messageTypeID);
		if (!obj || obj.length < 1) {
			obj = messageAndUIBinder.messageObject
					.createObject(messageAndUIBinder.messageTypeID);
		} else {
			obj = obj[0];
		}

		var subObj = null;

		if (!obj || obj.length < 1) {
			return obj;
		}

		$.each(pathField, function(key, value) {
			if (!value || value === null || value == "") {
				return;
			}

			// Create node occurances (if not existing)
			messageAndUIBinder.createNodeAtIndex(pathField[key], obj);

			subObj = obj.findObject(pathField[key]);
			if (!subObj || subObj.length < 1) {
				subObj = obj.createObject(pathField[key]);
				// console.log("Node doesn't exist: " + pathField[key]);
			} else {
				subObj = subObj[0];
			}
			obj = subObj;
		});
		return obj;
	};

	this.setSMOValue = function(smoObject, fieldName, fieldValue, type, isArray) {
		var smoValueObject = smoObject.getValue(fieldName);
		if (isArray === true) {
			smoValueObject = smoObject.getNewValue(fieldName);
		} else {
			smoValueObject = (AppUtil.isArray(smoValueObject) && smoValueObject.length > 0) ? smoValueObject[0]
					: smoObject.getNewValue(fieldName);
		}

		$.each(fieldValue, function(key, value) {
			if (!value || value === null || value == undefined) {
				fieldValue[key] = "";
			}
		});

		var clearingMethod = ('clear' + type + 'SMOValue');
		if (clearingMethod in messageAndUIBinder.editorSMOValueApi
				&& typeof (smoValueObject) === 'object') {
			try {
				eval('node = messageAndUIBinder.editorSMOValueApi.'
						+ clearingMethod + '(smoValueObject, fieldValue)');
			} catch (error) {
				alert("Error while calling " + clearingMethod + ": " + error);
				return;
			}
		}

		var methodName = ('set' + type + 'SMOValue');
		if (methodName in messageAndUIBinder.editorSMOValueApi
				&& typeof (smoValueObject) === 'object') {
			try {
				eval('node = messageAndUIBinder.editorSMOValueApi.'
						+ methodName + '(smoValueObject, fieldValue)');
			} catch (error) {

				alert("Error while calling " + methodName + ": " + error);

				return;
			}
		}
	};

	this.createNodeAtIndex = function(nodeNameWithIndex, parentMessageObject) {

		if (!nodeNameWithIndex || nodeNameWithIndex == null
				|| nodeNameWithIndex == '') {
			return;
		}

		var bracketIndex = nodeNameWithIndex.indexOf('[');
		if (bracketIndex < 0) {
			// no index information, just return for normal procedure
			return;
		}

		var nodeName = nodeNameWithIndex.substring(0, bracketIndex);
		var index = nodeNameWithIndex.substring(bracketIndex);
		index = index.substring(1, index.indexOf(']'));
		index = parseInt(index);
		for ( var i = 1; i <= index; i++) {
			var subObj = parentMessageObject.findObject(nodeName + '[' + i
					+ ']');
			if (!subObj || subObj.length < 1) {
				subObj = parentMessageObject.createObject(nodeName);
			}
		}

	}

	/**
	 * retrieves the node from the message based on the on the pathFields and
	 * tagName
	 * 
	 * @param objectArray :
	 *            elements in the pathFields
	 * @param fieldName :
	 *            tagName of the element to be retrieved
	 * @returns : XML Node
	 */
	this.readMessageObjects = function(objectArray, fieldName) {
		var obj = messageAndUIBinder.messageObject
				.findObject(messageAndUIBinder.messageTypeID);
		if (!obj || obj.length < 1) {
			return null;
		} else {
			obj = obj[0];
		}

		var subObj = null;

		$.each(objectArray, function(key, value) {
			if (!value || value === null || value == "") {
				return null;
			}
			subObj = obj.findObject(objectArray[key]);
			if (!subObj || subObj.length < 1) {
				if (key == (objectArray.length - 1)) {
					subObj = null;
					obj = null;
					return null;
				}
				subObj = obj;
			} else {
				subObj = subObj[0];
			}
			obj = subObj;
		});

		/*
		 * for(var key=0; key < objectArray.length ; key++) { value=
		 * objectArray[key]; if (!value || value === null || value == "") {
		 * return null; } subObj = obj.findObject(objectArray[key]); if (!subObj ||
		 * subObj.length < 1) { return null; } else { subObj = subObj[0]; } obj =
		 * subObj; }
		 */

		obj = (!obj || obj == null) ? null : obj.getValue(fieldName);

		return obj;
	};

	this.fillAutoComplete = function(data) {
		for ( var index = 0, i = 0; index < data.length; index++) {
			var value = data[index].subscriberId;
			var label = data[index].name;
			if (value != null && value.length > 0) {
				physicianLookupMap.put(label, value);
				bindPhysicianLookups[i++] = label;
			}
		}
		// alert(page+" lookup :"+bindPhysicianLookups.length);

	};

	this.fillServiceAutoComplete = function(data) {
		for ( var index = 0, i = 0; index < data.length; index++) {
			var value = data[index].subscriberId;
			var label = data[index].name;
			if (value != null && value.length > 0) {
				serviceLookupMap.put(label, value);
				bindServiceLookups[i++] = label;
			}
		}
		// alert(page+" lookup :"+bindServiceLookups.length);

	};

	this.makeQueryForCassandra = function() {
		var context = appController.getComponent("Context");
		var queryString = "";
		if (context) {
			var consultantId = context.getConsultant();
			// alert("consultantId : "+consultantId);
			var subscriberId = context.getUserVo().subscriberId;
			if (consultantId)
				queryString = consultantId;
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			// alert("queryString:"+queryString);
			query.addCondition(AppConstants.XPaths.Appointment.MESSAGE_TYPE,
					queryString);
			appController.getComponent("Context").setCalendarQuery(query);
			// alert("query : "+query);
		}
	};

	this.makeQueryForLucene = function() {
		var context = appController.getComponent("Context");
		var queryString = "";
		if (context) {
			var consultantId = context.getConsultant();
			// alert("consultantId : "+consultantId);
			var subscriberId = context.getUserVo().subscriberId;
			if (consultantId)
				queryString = consultantId;
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			// alert("queryString:"+queryString);
			query.addCondition(AppConstants.XPaths.Appointment.MESSAGE_TYPE,
					queryString);
			appController.getComponent("Context").setCalendarQuery(query);
			// alert("query : "+query);
		}
	};

	this.updateId = function(tag, data) {
		var fields = "";
		var type = "II";
		var tagName = "id";
		var pathFields = fields.split(',');
		// var updateItems = new Array();

		var node = messageAndUIBinder.readMessageObjects(pathFields, tagName);
		if (!node) {
			throw "";
		}

		if (AppUtil.isArray(node)) {
			$.each(node,
					function(key, value) {
						var instanceObject = messageAndUIBinder
								.readValueFromMessage(tagName, pathFields,
										type, value);
						if (tag != instanceObject[1]) {
							instanceObject = [ instanceObject[1],
									instanceObject[2], null ];
						} else {
							instanceObject = [ tag, data, null ];
						}
						if (messageAndUIBinder.updateItems
								.indexOf(instanceObject[0]) < 0) {
							messageAndUIBinder.updateItems
									.push(instanceObject[0]);
							messageAndUIBinder.writeValueToMessage(tagName,
									pathFields, type, instanceObject, false);
						}
					});
		}

		if (messageAndUIBinder.updateItems.indexOf(tag) < 0) {
			var instanceObject = [ tag, data, null ];
			messageAndUIBinder.updateItems.push(instanceObject[0]);
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
		}

		messageAndUIBinder.createMessageObjects(pathFields, tagName);
	};

	this.getIdRootValue = function(root) {
		var value = "";
		var fields = "";
		var type = "II";
		var tagName = "id";
		var pathFields = fields.split(',');

		var node = messageAndUIBinder.readMessageObjects(pathFields, tagName);
		if (!node) {
			throw "";
		}
		if (AppUtil.isArray(node)) {
			for ( var key = 0; key < node.length; key++) {
				value = node[key];
				var instanceObject = messageAndUIBinder.readValueFromMessage(
						tagName, pathFields, type, value);
				if (instanceObject[1] == root) {
					value = instanceObject[2];
					break;
				} else {
					value = "";
				}
			}
		}
		return value;
	};

	this.addEditorListener = function(instanceId, eventName, listener) {
		var event = new Object();
		event.name = eventName;
		event.listener = listener;

		eventListeners.push({
			instanceId : instanceId,
			event : event
		});

		/*
		 * eventListeners.push({ name : eventName, listener : listener });
		 */
	}

	this.getEditorListener = function(instanceId, eventName) {
		var result = null;
		for ( var i = 0; i < eventListeners.length; i++) {
			if (eventListeners[i].instanceId == instanceId) {
				var event = eventListeners[i].event;
				result = event.listener;
				break;
			}
		}

		/*
		 * for (i = 0; i <= eventListeners.length; i++) {
		 * 
		 * if (eventListeners[i].name == eventName) {
		 * 
		 * result = eventListeners[i].listener; break; } }
		 */
		return result;
	}

	this.geteditor = function(editorId, fieldId) {
		var editorObj = messageAndUIBinder.editorMap.get(editorId).value;
		return editorObj;
	}
	
	this.loadDataToIframe = function(tinyMCEObj,htmlFragment, emailType){
		var tagName = $(htmlFragment).attr('tagName');
		var pathFields = $(htmlFragment).attr('pathFields').split(',');
		var type = 	$(htmlFragment).attr('dataType');
		var instanceObject  = null;
		
		tinyMCEObj.setProgressState(1); 
        window.setTimeout(function() {
        	tinyMCEObj.setProgressState(0);
        	
        	var node = messageAndUIBinder.readMessageObjects(pathFields,tagName);
			node = (AppUtil.isArray(node)) ? node[0] : node;

			if(node){
				instanceObject = messageAndUIBinder.readValueFromMessage(tagName, pathFields, type, node);
				tinyMCEObj.setContent(instanceObject[1]);
			}else{
				appController.getComponent("DataLayer").emailTemplate(emailType, function(data){
					if(data){
						tinyMCEObj.setContent(data);
					}
				});
			}
        }, 3000);
		
		
		
	} 
	
	this.updateIframeContentToMessage = function(tinyMCEObj,htmlFragment){
			var tagName = $(htmlFragment).attr('tagName');
			var pathFields = $(htmlFragment).attr('pathFields').split(',');
			var type = 	$(htmlFragment).attr('dataType');
			var instanceObject  = null;
			var writeImmediate = true;
		
		
		     tinyMCEObj.setProgressState(1); 
	        window.setTimeout(function() {
	        	tinyMCEObj.setProgressState(0); 
	                //alert(tinyMCEObj.getContent());
	                var iframeContent = tinyMCEObj.getContent();
	                instanceObject = [iframeContent];
	                
	            	messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject, writeImmediate);
	        }, 3000);
	}
	
}