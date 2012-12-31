var HIN;
if (!HIN)
	HIN = {};
HIN.UITable = function(instanceId, appController, uiSelectedStep,
		uiPlaceholder, uiMessageType, callback, page) {
	this.instanceId = instanceId;
	this.appController = appController;
	this.dataLayer = this.appController.getComponent("DataLayer");
	this.uiSelectedStep = uiSelectedStep;
	this.uiPlaceholder = uiPlaceholder;
	this.uiProcessDefinition = null;
	this.uiMessages = [];
	this.formScripts = [];
	this.uiCurrentMessage = null;
	this.uiGroupHeaderMap = new HIN.HashMap();
	this.uiMessageIndex = 0;
	this.callback = callback;
	this.addNew = false;
	this.sortType = "messageType";
	this.sortBy = null;
	ui = this;
	this.mainHeader = "block";

	this.tableHeaders = null;
	this.tableFormat = false;
	this.tableEmptyRow = '';

	this.uiMessageTypes = [];
	this.uiMessageType = uiMessageType;
	this.messagTypeSelectionArray = [];
	this.singleForm = false;
	this.formRender = false;
	this.addInitialHandler = null;
	this.addCompleteHandler = null;
	this.removeCompleteHandler = null;

	this.messageIndex = 0;
	this.lookup = true;

	this.selectedMessage = null;
	this.selectedTask = null;

	this.category = null;
	this.lookupSelectionHandler = null;
	this.conceptLookup = null;
	this.createMessageTypeHandler = null;
	this.page = page;
	this.innerPage = false;
	this.conceptServiceLookups = null;

	/**
	 * UI TABLE
	 */
	this.categories = null;
	this.uiCategoriesIndex = 0;
	this.uiTableGroupHeader = [];
	this.uiTableInstance = true;
	this.lookupData = [];
	this.removeMessageHandler = null;
	this.uiFinanceTypes = [];
	this.uiFinanceTypeIndex = 0;
	this.uiMessagesMap = new HIN.HashMap();
	this.uiLookups = null;
	this.uiLookupsIndex = 0;
	this.looupsRender = false;
	this.htmlString = null;
	this.messageTypeJsString = null;
	this.formTypeJsString = null;

};

HIN.UITable.prototype.getPage = function() {
	this.page = appController.getComponent("RenderingEngine")
			.getChildComponent("Form").getPage();
};

HIN.UITable.prototype.load = function() {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	this.page = page;
	this.uiProcessDefinition = appController.getComponent("RenderingEngine")
			.getChildComponent("Process").getProcessDefinition();
	this.uiSelectedStep = appController.getComponent("RenderingEngine")
			.getChildComponent("Form").selectedStep;
	var instance = this.page.uiInstances.get(this.instanceId).value;
	appController.getComponent("RenderingEngine").openModalDialog(
			"Loading Client Report");
	var categories = this.categories;
	if (categories.length === 1) {
		instance.dataLayer.loadAllConceptServices(categories[0],
				instance.loadLookupsOnTable, instance);
	} else if (categories.length > 1) {
		this.createMultipleGruopTable(instance);
	}

};

HIN.UITable.prototype.createMultipleGruopTable = function(instance) {
	var categories = instance.categories;
	var category = categories[instance.uiCategoriesIndex];
	instance.dataLayer.loadAllConceptServices(category,
			instance.loadLookupsOnTable, instance);
};

HIN.UITable.prototype.loadLookupsOnTable = function(lookUps, instance) {
	if (lookUps.json.length > 0) {
		lookUps.addConecpts();
		instance.lookupData.push(lookUps);
		instance.uiLookupsIndex = 0;
		instance.uiLookups = lookUps;
		instance.generateUITableHeader(lookUps, instance);
		instance.generateUITable(instance);
	} else {
		if (instance.uiCategoriesIndex < instance.categories.length - 1) {
			instance.uiCategoriesIndex++;
			instance.createMultipleGruopTable(instance);
		} else {
			instance.uiPageCallBack(instance);
		}
	}
};

HIN.UITable.prototype.generateUITable = function(instance) {
	if (instance.uiLookupsIndex < instance.uiLookups.json.length) {
		var conceptName = instance.uiLookups.json[instance.uiLookupsIndex].name;
		var description = instance.uiLookups.json[instance.uiLookupsIndex].description;
		var conceptVO = instance.uiLookups.getConcept(conceptName);
		if (conceptVO) {
			var uiMessageObject = instance.uiMessagesMap.get(description);
			if (uiMessageObject) {
				var uiMessage = uiMessageObject.value;
				instance.generateEmptyUITable(conceptVO, instance);
				instance.createUITableForm(conceptName, uiMessage, instance);
			} else {
				instance.generateEmptyUITable(conceptVO, instance);
				instance.uiLookupsIndex++;
				instance.generateUITable(instance);
			}
		}
	} else if (instance.uiCategoriesIndex < instance.categories.length - 1) {
		$(
				'#tableGroupHeader' + instance.instanceId
						+ instance.uiCategoriesIndex).trigger('create');
		instance.uiLookups = null;
		instance.uiCategoriesIndex++;
		instance.createMultipleGruopTable(instance);
	} else {
		instance.uiPageCallBack(instance);
	}
};

HIN.UITable.prototype.uiPageCallBack = function(instance) {
	$(".chkConcept").click(function() {
		instance.onSelectOfCheckBox(this, instance);
	});
	instance.looupsRender = true;
	instance.categories = [];
	instance.uiTableGroupHeader = [];
	instance.uiLookups = null;
	appController.getComponent("RenderingEngine").closeModalDialog();
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	instance.callback(page);
};

HIN.UITable.prototype.generateUITableHeader = function(lookUps, instance) {
	var lookupsLength = lookUps.json.length;
	if (instance.uiTableGroupHeader.length > 0) {
		var tableGroupHeader = instance.createUITableWithGroupHeader(
				instance.instanceId, instance.uiMessageType,
				instance.uiCategoriesIndex, instance.tableHeaders,
				instance.uiTableGroupHeader, lookupsLength);
		$('#' + instance.uiPlaceholder).append(tableGroupHeader);
	} else {
		var tableGroupHeaders = instance.createUITableHeaders(
				instance.instanceId, instance.uiMessageType,
				instance.uiCategoriesIndex, instance.tableHeaders);
		$('#' + instance.uiPlaceholder).append(tableGroupHeaders);
	}
};

HIN.UITable.prototype.generateEmptyUITable = function(conceptVO, instance) {
	$('#tableGroupHeader' + instance.instanceId + instance.uiCategoriesIndex)
			.append(instance.createUITableRow(conceptVO));
	$('#tableGroupHeader' + instance.instanceId + instance.uiCategoriesIndex)
			.trigger('create');
};

HIN.UITable.prototype.onSelectOfCheckBox = function(checkObj, uiInstance) {
	var instance = uiInstance;

	var conceptName = $(checkObj).attr("conceptName");
	var description = $(checkObj).attr("description");
	var selecetedConceptVO = instance.getConceptDataFromLookups(conceptName,
			instance);
	if ($(checkObj).attr("checked") != "checked") {
		$(checkObj).removeAttr("checked");
		var tableEmptyColumns = instance.tableEmptyRow + instance.tableEmptyRow
				+ instance.tableEmptyRow;
		var parentDiv = $(checkObj).closest('[wrapper="true"]')[0];
		var id = $(checkObj).attr("messageId");
		$("#tableFormHolder" + id).html(tableEmptyColumns);
		var message = instance.getMessage(id);
		if (message) {
			instance.removeMessageHandler(instance.uiMessageType,
					message.messageId, instance);
			instance.deleteMessage(id);
		}
	} else {
		var selectedMessage = instance.createMessageToLookups(
				selecetedConceptVO, instance);
		var instanceId = selectedMessage.instanceId;
		$(checkObj).attr("instanceId", instanceId);
		var messageId = selectedMessage.id;
		$(checkObj).attr("messageId", messageId);
		instance.formRender = true;
		$(checkObj).attr("checked", "checked");
		var parentDiv = $(checkObj).closest('[wrapper="true"]')[0];
		$(parentDiv).find('[role="tableFormHolder"]').attr('id',
				'tableFormHolder' + messageId);
		if (!selectedMessage.rendered) {
			instance.processDependentMessages(selectedMessage,
					selecetedConceptVO, instance);
		}
	}
};

HIN.UITable.prototype.processDependentMessages = function(uiMessage, conceptVO,
		uiInstance) {
	var instance = uiInstance;
	var selectedMessage = uiMessage;
	var selecetedConceptVO = conceptVO;
	if (instance.uiFinanceTypeIndex < instance.uiFinanceTypes.length) {
		var uiFinanceType = instance.uiFinanceTypes[instance.uiFinanceTypeIndex];
		instance.addDependentMessage(selectedMessage, selecetedConceptVO,
				uiFinanceType, instance)
	} else {
		instance.uiFinanceTypeIndex = 0;
		instance.loadUIMessageForm(selectedMessage, instance.formRender,
				instance.loadUIForm, instance.addCompleteHandler, null,
				instance);

	}
};

HIN.UITable.prototype.addDependentMessage = function(uiMessage, conceptVO,
		uiFinanceType, uiInstance) {
	var instance = uiInstance;
	var selectedMessage = uiMessage;
	var selecetedConceptVO = conceptVO;
	var dataLayer = appController.getComponent("DataLayer");
	appController
			.getComponent("DataLayer")
			.createMessageByType(
					AppConstants.XPaths.Finance.MESSAGE_TYPE,
					function(message) {
						selectedMessage.addDependendMessage(message);
						var financeType = uiFinanceType;
						var amt = selecetedConceptVO.getAttribute(financeType);
						var concept = selecetedConceptVO.getName();
						var className = selecetedConceptVO
								.getMessageTypeClassName();
						var messageTypeScript = new MessageTypeScript(
								message.msg, message.messageType,
								instance.appController);
						dataLayer
								.loadData(
										"JS_" + message.messageType,
										{},
										function(data) {
											messageTypeScript.loadScript(data);
											messageTypeScript.initialize();
											var formattedDate = formatDate(
													new Date(), 'yyyy-MM-dd');
											messageTypeScript.fillData(
													'effectiveTime',
													formattedDate);

											messageTypeScript.fillData('amt',
													amt);
											var components = [ {
												'quantity' : 1,
												'unitPrice' : amt,
												'netAmount' : amt
											} ];
											messageTypeScript
													.fillData(
															'financialTransactionChargeDetail',
															components);

											components = [ {
												'concept' : selecetedConceptVO
														.getName(),
												'description' : selecetedConceptVO
														.getDescription()
											} ];
											var transactionType = null;
											if (className == "Drug") {
												if (financeType == "Fee")
													transactionType = AppConstants.TransactionType.PRODUCT_FEE;
												else if (financeType == "Cost")
													transactionType = AppConstants.TransactionType.PRODUCT_COST;
												messageTypeScript.fillData(
														'drug', components);
											}

											messageTypeScript.fillData(
													'transactionType',
													transactionType);
											messageTypeScript
													.fillData(
															'transactionStatus',
															AppConstants.TransactionStatus.ORDERED);

											instance.uiFinanceTypeIndex++;
											instance.processDependentMessages(
													selectedMessage,
													selecetedConceptVO,
													instance);
										});
					});

};
HIN.UITable.prototype.createMessageToLookups = function(conceptVO, instance) {
	var message = factoryClass.createMessage();
	message.instanceId = instance.instanceId;
	message.title = conceptVO.description;
	message.renderUI = false;
	message.description = conceptVO.description;
	message.messageType = conceptVO.getAttribute("MessageType");
	message.messageForm = conceptVO.getAttribute("MessageForm");
	instance.addMessage(message);
	return message;
};

HIN.UITable.prototype.getConceptDataFromLookups = function(conceptName,
		instance) {
	var categoriesLookupsArray = instance.lookupData;
	for ( var index = 0; index < categoriesLookupsArray.length; index++) {
		var categoryLookups = categoriesLookupsArray[index];
		var conceptVO = categoryLookups.getConcept(conceptName);
		if (conceptVO) {
			return conceptVO;
		}
	}

};

HIN.UITable.prototype.loadUIForms = function(instance) {
	if (instance) {
		if (instance.uiMessageIndex < instance.uiMessages.length) {
			var message = instance.uiMessages[instance.uiMessageIndex];
			if (message.status == AppConstants.Status.ACTIVE
					&& message.renderUI) {
				instance.createUITableForm(message, instance);
			}
		} else {
			appController.getComponent("RenderingEngine").closeModalDialog();
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			this.callback(page);
		}
	}
};

HIN.UITable.prototype.createUITableForm = function(conceptName, message,
		instance) {
	var massegeTitle = message.title;
	var parentId = instance.uiPlaceholder;
	var conceptName = $("#" + conceptName).attr('conceptName');
	var description = $("#" + conceptName).attr("description");
	$("#" + conceptName).attr("checked", "checked");
	var instanceId = message.instanceId;
	$("#" + conceptName).attr("instanceId", instanceId);
	var messageId = message.id;
	$("#" + conceptName).attr("messageId", messageId);
	var parentDiv = $("#" + conceptName).closest('[wrapper="true"]')[0];
	$(parentDiv).find('[role="tableFormHolder"]').attr('id',
			'tableFormHolder' + message.id);
	instance.loadUIMessageForm(message, instance.formRender,
			instance.loadUIForm, null, null, instance);
};

HIN.UITable.prototype.createUITableRow = function(conceptVO) {
	var description = conceptVO.description;
	var attributeDose = conceptVO.getAttribute("DoseConceptClass");
	attributeDose = (attributeDose) ? attributeDose : "";

	var id = conceptVO.name;
	id = id.replace(/\s+/g, '_');
	id = (id) ? $.trim(id) : "";
	this.tableEmptyRow = '<div  class="tableChildHeader">';
	this.tableEmptyRow += '<div class="tableChildHeaderTitle"></div></div>';

	var tableRowHeader = '<div id="tableChildGroupHeader" wrapper="true" class="tableChildHeaderRow">';
	tableRowHeader += '<div class="tableChildHeader">';
	tableRowHeader += '<div class="ui-input-check-box">';
	tableRowHeader += '<input type="checkbox"  class="chkConcept" value="" id="'
			+ id
			+ '" conceptName="'
			+ conceptVO.name
			+ '" description="'
			+ conceptVO.description + '">';
	tableRowHeader += '</div>';
	tableRowHeader += '<div class="tableChildHeaderTitle">';
	tableRowHeader += description;
	tableRowHeader += '</div></div>';
	tableRowHeader += '<div id="" role="tableFormHolder" dynamicConceptClass="'
			+ attributeDose + '">';
	tableRowHeader += this.tableEmptyRow;
	tableRowHeader += this.tableEmptyRow;
	tableRowHeader += this.tableEmptyRow;
	tableRowHeader += '</div></div>';
	return tableRowHeader;
};

HIN.UITable.prototype.loadUIForm = function(message, formRender, data,
		addCompleteHandler, callbackHandler) {
	if (formRender) {
		var instanceId = message.instanceId;
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var instance = page.uiInstances.get(instanceId).value;

		var conceptClass = $('#tableFormHolder' + message.id).attr(
				'dynamicConceptClass');
		$('#tableFormHolder' + message.id).html(data);

		if (conceptClass) {
			$('#tableFormHolder' + message.id).find(
					'[conceptClass="dynamicConcept"]').attr(
					'dynamicConceptClass', conceptClass);
		} else {
			$('#tableFormHolder' + message.id).find(
					'[conceptClass="dynamicConcept"]').css('display', 'none');
			$('#tableFormHolder' + message.id).find(
					'[conceptClass="userDefined"]').css('display', 'inline');
		}

		$(
				'#tableGroupHeader' + instance.instanceId
						+ instance.uiCategoriesIndex).trigger('create');

		instance.dataLayer.processMessage(message, "", function(messageId, msg,
				messageObj) {
			var instance = page.uiInstances.get(message.instanceId).value;
			if (instance)
				instance.uiMessageCreated(messageId, msg, message,
						instance.addCompleteHandler, callbackHandler);
		});
	}
};

HIN.UITable.prototype.uiMessageCreated = function(messageId, msg,
		uiCurrentMessage, addCompleteHandler, callbackHandler) {
	this.uiMessageCreationCompleteHandler(messageId, msg, uiCurrentMessage,
			addCompleteHandler, this, callbackHandler);
	this.uiFinanceTypeIndex = 0;
	if (!this.looupsRender) {
		this.uiLookupsIndex++;
		this.generateUITable(this);
	}

};

HIN.UITable.prototype.uiMessageCreationCompleteHandler = function(messageId,
		msg, uiCurrentMessage, addCompleteHandler, instance, callbackHandler) {
	uiCurrentMessage.messageId = messageId;
	if (msg) {
		uiCurrentMessage.msg = msg;
		uiCurrentMessage.message = msg.getXML();
	}
	this.uiCurrentMessage = uiCurrentMessage;
	if (instance.formRender && !uiCurrentMessage.rendered) {
		instance
				.loadAndExecuteMessagScript(
						uiCurrentMessage,
						instance,
						function(messageTypeScript) {
							var properties = new Object();
							properties.readOnly = uiCurrentMessage.readOnly;
							var finished = uiCurrentMessage.finished;
							instance
									.loadDataOntoForm(
											instance,
											uiCurrentMessage,
											properties,
											messageTypeScript,
											function() {
												instance
														.loadAndExecuteFormScript(
																instance,
																uiCurrentMessage,
																function() {
																	if (callbackHandler)
																		callbackHandler(uiCurrentMessage);

																	if (addCompleteHandler) {
																		addCompleteHandler(
																				instance.addNew,
																				instance.uiMessageType,
																				uiCurrentMessage,
																				instance);
																	}

																	if (instance.lookupSelectionHandler
																			&& !uiCurrentMessage.dependendMessageProcessed) {
																		uiCurrentMessage.dependendMessageProcessed = true;
																		instance
																				.lookupSelectionHandler(
																						instance,
																						instance.conceptLookup,
																						uiCurrentMessage);
																	}

																	uiCurrentMessage.rendered = true;

																	$('#main')
																			.trigger(
																					'create');

																});
											});
						});

	}

};

HIN.UITable.prototype.loadAndExecuteMessagScript = function(uiCurrentMessage,
		instance, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");

	var messageTypeScript = renderingEngine
			.getMessageScript(uiCurrentMessage.messageType);

	if (!messageTypeScript) {
		messageTypeScript = new MessageTypeScript(uiCurrentMessage.msg,
				uiCurrentMessage.messageType, instance.appController,
				uiCurrentMessage.messageAndUIBinder);
		if(!instance.messageTypeJsString){
		instance.dataLayer
				.loadData(
						"JS_" + uiCurrentMessage.messageType,
						{},
						function(jsString) {
							instance.messageTypeJsString = jsString;
							instance.executeMessagScript(jsString,messageTypeScript,uiCurrentMessage,instance,callback);
						});
		}else{
			instance.executeMessagScript(instance.messageTypeJsString , messageTypeScript,uiCurrentMessage,instance,callback);
		}
	} else {
		messageTypeScript.messageAndUIBinder = uiCurrentMessage.messageAndUIBinder;
		if (!uiCurrentMessage.isInitializeScriptExecuted()) {
			uiCurrentMessage.setInitializeScriptExecuted(true);
			messageTypeScript.initialize();
		}
		if (!uiCurrentMessage.taskVO)
			messageTypeScript.fillParticipants();
	}
};

HIN.UITable.prototype.executeMessagScript = function(jsString,messageTypeScript,uiCurrentMessage,
		instance, callback) {
	try {
		if (jsString) {
			messageTypeScript.loadScript(jsString);
			if (!uiCurrentMessage
					.isInitializeScriptExecuted()) {
				uiCurrentMessage
						.setInitializeScriptExecuted(true);
				messageTypeScript.initialize();

			}
			if (!uiCurrentMessage.taskVO)
				messageTypeScript.fillParticipants();

			var title = instance.uiCurrentMessage.title;
			if (!title)
				title = instance.getTitle();
			if (title != null)
				messageTypeScript.fillData(
						"messageTitle", title);

		}
		if (callback) {
			callback(messageTypeScript);
		}

	} catch (e) {
		alert("Message Script for type "
				+ uiCurrentMessage.messageType
				+ " is not found : " + e);
		renderingEngine.hidePageLoading();
		renderingEngine.closeModalDialog();
	}
}
;


HIN.UITable.prototype.loadAndExecuteFormScript = function(instance,
		uiCurrentMessage, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");
	try {

		var formScript = instance.getFormScript(uiCurrentMessage.id);

		if (!formScript) {

			formScript = new FormScript(uiCurrentMessage,
					instance.appController, instance);
			instance.addFormScript(formScript);
			/*if(!instance.formTypeJsString){
			instance.dataLayer.loadData("FS_" + uiCurrentMessage.messageForm,
					{}, function(jsString) {
						instance.formTypeJsString = jsString;
						//instance.executeFormScript(jsString,formScript,instance,uiCurrentMessage, callback);
						if (callback) {
							callback(formScript);
						}
					});
			}else{
				//instance.executeFormScript(instance.formTypeJsString,formScript,instance,uiCurrentMessage, callback);
				if (callback) {
					callback(formScript);
				}
			}*/
			if (callback) {
				callback(formScript);
			}
		} else if (formScript) {
			formScript.message = uiCurrentMessage;
			formScript.uiGenerator = instance;
			//formScript.initialize();
			//formScript.onLoad();

			renderingEngine.fireEvent(AppConstants.Event.RESIZE);

			if (callback) {
				callback(formScript);
			}
		}

	} catch (e) {
		renderingEngine.hidePageLoading();
		renderingEngine.closeModalDialog();
		alert("Form Script" + messageForm + " is not found : " + e);

	}
};

HIN.UITable.prototype.executeFormScript = function(jsString,formScript,instance,
		uiCurrentMessage, callback) {
	try {
		if (jsString) {
			formScript.loadScript(jsString);
			formScript.initialize();
			formScript.onLoad();
		}
		if (callback) {
			callback(formScript);
		}
	} catch (e) {
		alert("Form Script" + uiCurrentMessage.messageForm
				+ " is not found : " + e);

	}
}
;

HIN.UITable.prototype.loadDataOntoForm = function(instance, uiCurrentMessage,
		properties, messageTypeScript, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");
	try {
		var finished = uiCurrentMessage.finished;
		var uiInstance = instance;
		uiCurrentMessage.messageAndUIBinder = new MessageAndUIBinder(
				'tableFormHolder' + uiCurrentMessage.id, uiCurrentMessage.msg,
				uiCurrentMessage.messageType);
		var lookupHandler = instance.dataLayer.lookupHandler;
		uiCurrentMessage.messageAndUIBinder.loadDataOntoForm(lookupHandler,
				properties, function() {
					if (callback)
						callback();
				});
	} catch (e) {
		renderingEngine.hidePageLoading();
		renderingEngine.closeModalDialog();
		alert("MessageAndUIBinder loadDataOntoForm " + e);
		instance.appController.getComponent("RenderingEngine")
				.hidePageLoading();
	}
};

HIN.UITable.prototype.createUITableHeaders = function(instanceId, messageType,
		uiCategoriesIndex, tableHeaders) {
	var id = instanceId;
	var typeName = messageType.type;
	var tableGroupHeader = '<div id="tableGroupHeader' + id + uiCategoriesIndex
			+ '" class="tableHeaderRow">';
	for ( var index = 0; index < tableHeaders.length; index++) {
		tableGroupHeader += '<div  class="tableHeader" style="background-color:#54184f; border: 1px solid #54184f">';
		tableGroupHeader += '<div class="tableHeaderText" style="text-align:center; color:#fff;">';
		tableGroupHeader += tableHeaders[index];
		tableGroupHeader += '</div>';
		tableGroupHeader += '</div>';
	}
	tableGroupHeader += '</div>';
	return tableGroupHeader;
};

HIN.UITable.prototype.createUITableWithGroupHeader = function(instanceId,
		messageType, uiCategoriesIndex, tableHeaders, uiTableGroupHeader,
		lookupsLength) {
	var tableGroupHeaderHieght = lookupsLength * 46.8 + 33;
	var tableGroupHeaders = '<div class="tableGroup">';
	tableGroupHeaders += '<div class="tableGroupHeader-box" style="height:'
			+ tableGroupHeaderHieght + 'px">';
	tableGroupHeaders += '<div  class="tableGroupHeader">';
	tableGroupHeaders += uiTableGroupHeader[uiCategoriesIndex];
	tableGroupHeaders += '</div></div>'
	tableGroupHeaders += '<div id="tableGroupHeader' + instanceId
			+ uiCategoriesIndex + '" class="tableHeaderRow">';
	for ( var index = 0; index < tableHeaders.length; index++) {
		tableGroupHeaders += '<div  class="tableHeader" style="background-color:#54184f; border: 1px solid #54184f">';
		tableGroupHeaders += '<div class="tableHeaderText" style="text-align:center; color:#fff;">';
		tableGroupHeaders += tableHeaders[index];
		tableGroupHeaders += '</div>';
		tableGroupHeaders += '</div>';
	}
	tableGroupHeaders += '</div>';
	return tableGroupHeaders;

};

HIN.UITable.prototype.loadUIMessageForm = function(message, formRender, func,
		addCompleteHandler, callbackHandler, instance) {
	var messageForm = message.messageForm;
	var dataLayer = appController.getComponent("DataLayer");

	if (formRender) {
		if (!instance.htmlString) {
			dataLayer.loadData("FM_" + messageForm, {}, function(htmlString) {
				try {
					instance.htmlString = htmlString;
					if (func)
						func(message, formRender, htmlString,
								addCompleteHandler, callbackHandler);
					appController.getComponent("RenderingEngine").fireEvent(
							AppConstants.Event.RESIZE);
					appController.getComponent("RenderingEngine")
							.hidePageLoading();

				} catch (e) {
					alert("Form " + messageForm + " is not found : " + e);
					if (func)
						func(message, formRender, htmlString,
								addCompleteHandler, callbackHandler);
					appController.getComponent("RenderingEngine").fireEvent(
							AppConstants.Event.RESIZE);
					appController.getComponent("RenderingEngine")
							.hidePageLoading();
				}

			});
		} else {
			if (func)
				func(message, formRender, instance.htmlString,
						addCompleteHandler, callbackHandler);
			appController.getComponent("RenderingEngine").fireEvent(
					AppConstants.Event.RESIZE);
			appController.getComponent("RenderingEngine").hidePageLoading();
		}
	} else {
		this.uiFinanceTypeIndex = 0;
		if (!this.looupsRender) {
			this.uiLookupsIndex++;
			this.generateUITable(this);
		}
	}
};

HIN.UITable.prototype.addMessage = function(message) {
	if (!this.getMessage(message.id)) {
		message.instanceId = this.instanceId;
		message.rendered = false;
		this.uiMessages.push(message);
	} else {
		alert("Exist : " + message.id);
	}
};

HIN.UITable.prototype.getMessage = function(id) {
	for ( var index = 0; index < this.uiMessages.length; index++) {
		if (this.uiMessages[index].id == id) {
			return this.uiMessages[index];
		}
	}
};

HIN.UITable.prototype.getMessages = function() {
	return this.uiMessages;
};

HIN.UITable.prototype.deleteMessage = function(id) {
	var deleteIndex = -1;
	for ( var index = 0; index < this.uiMessages.length; index++) {
		if (this.uiMessages[index].id == id) {
			deleteIndex = index;
			break;
		}
	}
	if (deleteIndex != -1) {
		this.uiMessages.splice(deleteIndex);
	}
};

HIN.UITable.prototype.addFormScript = function(formScript) {
	this.formScripts.push(formScript);
};

HIN.UITable.prototype.getFormScript = function(id) {
	for ( var index = 0; index < this.formScripts.length; index++) {
		if (this.formScripts[index].message.id == id) {
			return this.formScripts[index];
		}
	}
};

HIN.UITable.prototype.deleteFormScript = function(id) {
	var deleteIndex = -1;
	for ( var index = 0; index < this.formScripts.length; index++) {
		if (this.formScripts[index].id == id) {
			deleteIndex = index;
			break;
		}
	}
	if (deleteIndex != -1) {
		this.formScripts.splice(deleteIndex);
	}
};

HIN.UITable.prototype.loadAlllookups = function(conceptServiceLookups, instance) {

};
