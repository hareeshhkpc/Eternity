var HIN;
if (!HIN)
	HIN = {};
/**
 * Page
 * 
 * Page is base class which is the entry point of the step, which knows the
 * which is current process definition, selected step etc. It have the following
 * events like init, pageBeforeLoad,pageAfterLoad,pageResized. loadUI is entry
 * point of the UI creation this method can be implement based on the UI design.
 * Also it provides methods like addInitialHandler,addCompleteHandler,
 * removeCompleteHandler,lookupSelectionHandler, taskHandler, refreshHandler,
 * singleHandler, clearHandler, cancelHandler, finishCompleteHandler etc will be
 * trigger from the ui generator based on the actions and it will propagate the
 * step page methods.
 */
HIN.Page = function(appController, pageHolder) {
	// var page = this;
	this.appController = appController;
	/** processDefinition holds the current selected process definition. */
	this.processDefinition = null;
	this.messageTypes = [];
	/** selectedStep holds the current selected step. */
	this.selectedStep = null;
	this.groupHeaderMap = new HIN.HashMap();
	this.messageTypeIndex = 0;
	this.pageHolder = pageHolder;
	/*
	 * this.pageBeforeLoad = null; this.pageCreate = null; this.pageAfterLoad =
	 * null;
	 */
	/** stepPage holds the current selected step page. */
	this.stepPage = null;
	this.uiInstances = new HIN.HashMap();
	this.lastOpenedFormId = null;
	this.currentUIInstance = null;

};
/**
 * init method will initializes the page and it will trigger to the sub class
 * page init method if it is implemented and also initialize variables , execute
 * any initialize script etc inside this method.
 * 
 * @returns {void}
 */
HIN.Page.prototype.init = function() {
	this.uiInstances.clearItems();
	this.groupHeaderMap.clearItems();
	this.messageTypes.splice(0, this.messageTypes.length);
	this.messageTypeIndex = 0;

	this.loadProcessDefinition();
	if (this.stepPage) {
		this.stepPage.processDefinition = this.processDefinition;
		this.stepPage.appController = this.appController;
		this.stepPage.selectedStep = this.selectedStep;
		this.stepPage.messageTypes = this.messageTypes;
		this.stepPage.groupHeaderMap = this.groupHeaderMap;
		this.stepPage.uiInstances = this.uiInstances;
	}

	if (this.stepPage.init)
		this.stepPage.init(this.loadUI, this);
};

HIN.Page.prototype.loadProcessDefinition = function() {

	this.processDefinition = this.appController.getComponent("RenderingEngine")
			.getChildComponent("Process").getProcessDefinition();

	this.selectedStep = this.appController.getComponent("RenderingEngine")
			.getChildComponent("Form").selectedStep;
	var messageTypeObjects = this.selectedStep.getMessageTypes();
	for ( var index = 0; index < messageTypeObjects.length; index++) {
		this.messageTypes.push(messageTypeObjects[index]);
	}
	// this.messageTypes = this.selectedStep.getMessageTypes();

};

HIN.Page.prototype.setStepPage = function(stepPage) {
	this.stepPage = stepPage;
	this.pageHolder = stepPage.pageHolder;
};
/**
 * pageBeforeLoad method will trigger from the loadUI method. The current
 * selected step have multiple message types and each message type have same
 * type name or different as per the process definition.UI is generating or
 * grouping the messages based on the type name.Hence pageBeforeLoad method
 * provide ui instance which have all the messages under the same group.This
 * will be varying based on the ui implementation.
 * 
 * @param messageType :
 *            Its an object of messageType.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.Page.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("pageBeforeLoad");
	if (this.stepPage)
		this.stepPage.pageBeforeLoad(messageType, uiGenerator);

};

/**
 * pageAfterLoad method will trigger once the page ui is rendered. *
 * 
 * @param page :
 *            Its an object of page.
 * @returns {void}
 */
HIN.Page.prototype.pageAfterLoad = function(page) {
	// alert("pageBeforeLoad");
	if (this.stepPage && this.stepPage.pageAfterLoad)
		this.stepPage.pageAfterLoad(page);
	var selectedId = 'child_' + this.stepPage.selectedStep.stepName + '_form';

	$("#" + selectedId).unbind("resizable", this.pageResized);
	$("#" + selectedId).bind("resizable", this.pageResized);
};

/**
 * pageResized method will trigger whenever the page resized.
 * 
 * @returns {void}
 */
HIN.Page.prototype.pageResized = function() {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (page.stepPage) {
		var selectedId = 'child_' + page.stepPage.selectedStep.stepName
				+ '_form';
		var currentHeight = $("#" + selectedId).css('height');
		if (currentHeight) {
			currentHeight = currentHeight
					.substring(0, currentHeight.length - 2);
			var calculatedHeight = parseInt(currentHeight) + 75;
			var actualHeight = appController.getComponent("RenderingEngine")
					.getChildComponent("Resize").getHeight();

			if (calculatedHeight > actualHeight) {

				$(".left-side-content").css('height', calculatedHeight);// 'auto');
			} else {
				$(".left-side-content").css('height', actualHeight);// 'auto');
			}
		}
	}
};
/**
 * loadUI method will trigger after init method, it initiate to load the ui.
 * 
 * @param page :
 *            Its an object of page.
 * @returns {void}
 */
HIN.Page.prototype.loadUI = function(page) {
	/* alert("loadUI"); */
	if (!page)
		page = this;

	if (page.messageTypeIndex < page.messageTypes.length) {
		var messageType = page.messageTypes[page.messageTypeIndex];
		messageType.typeName = messageType.typeName.replace(/\s+/g, '_');
		var sortType = messageType.type;
		var sortBy = messageType.typeName;
		// alert(sortType + " : " + sortBy);
		/*
		 * if (sortBy != 'NewServices' && sortBy != 'NewProducts' && sortBy !=
		 * 'ServiceCost' && sortBy != 'OtherFees' && sortBy != 'Products') {
		 * $('#divSecondary').hide(); $('.ui-left-side-forms').css('width',
		 * '99%'); }
		 */
		page.messageTypeIndex++;
		var id = idGenerator.getId();
		/* alert("sortBy : " + sortBy); */
		if (sortBy == "Program") {
			page.loadUI(page);
		} else {

			var map = page.groupHeaderMap.get(sortBy);

			if (map == null) {
				page.createUIInstance(page, sortType, sortBy, messageType);
			} else {

				var id = map.value;
				var uiGenerator = page.uiInstances.get(id).value;

				var messageTypeObj = uiGenerator
						.getMessageType(messageType.type);
				if (!messageTypeObj) {
					uiGenerator.addMessageType(messageType);
					// messageType.addMessage(message);
				}

				var messages = messageType.getMessages();

				for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
					var message = messages[messageIndex];

					message.rendered = false;
					message.instanceId = id;
					// uiGenerator.uiMessages.push(message);
					uiGenerator.addMessage(message);
					if (messageTypeObj)
						messageTypeObj.addMessage(message);

				}
				uiGenerator.loadUIForms();
			}
		}

	} else {
		// alert("Completed");
		page.pageAfterLoad(page);
	}
};

/**
 * createUIInstance method will create the ui instance, it will renders the UI
 * for each message forms under the selected step. *
 * 
 * @param page :
 *            Its an object of page.
 * @param sortType :
 *            Its a string value of message type
 * @param sortType :
 *            Its a string value of message type name
 * @param messageType :
 *            Its an object of messageType.
 * @returns {void}
 */
HIN.Page.prototype.createUIInstance = function(page, sortType, sortBy,
		messageType) {
	var id = idGenerator.getId();
	page.groupHeaderMap.put(sortBy, id);
	page.pageHolder = 'child_' + page.selectedStep.stepName + '_form';
	/* alert(page.pageHolder); */
	$('#' + page.pageHolder).append(
			"<div id='inner-form-" + sortBy + "Placeholder-" + id + "'></div>");
	// var selectionArray = getSelectionList(formVO.title);
	var uiGenerator = new HIN.UIGenerator(id, appController, page.selectedStep,
			'inner-form-' + sortBy + 'Placeholder-' + id, messageType,
			page.loadUI, page);

	if (!uiGenerator.getMessageType(messageType))// Added
		uiGenerator.addMessageType(messageType);

	page.uiInstances.put(id, uiGenerator);
	uiGenerator.formRender = true;

	page.pageBeforeLoad(messageType, uiGenerator);
	uiGenerator.createMessageTypeHandler = page.createMessageTypeHandler;
	var messages = messageType.getMessages();
	for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
		var message = messages[messageIndex];
		message.instanceId = id;
		message.rendered = false;
		uiGenerator.addMessage(message);
	}

	uiGenerator.addInitialHandler = page.addInitialHandler;
	uiGenerator.addCompleteHandler = page.addCompleteHandler;
	uiGenerator.removeCompleteHandler = page.removeCompleteHandler;
	uiGenerator.lookupSelectionHandler = page.lookupSelectionHandler;

	if (page.stepPage.taskHandler)
		uiGenerator.taskHandler = page.stepPage.taskHandler;

	if (page.stepPage.refreshHandler)
		uiGenerator.refreshHandler = page.stepPage.refreshHandler;

	if (page.stepPage.singleHandler)
		uiGenerator.singleHandler = page.stepPage.singleHandler;

	if (page.stepPage.clearHandler)
		uiGenerator.clearHandler = page.stepPage.clearHandler;

	if (page.stepPage.cancelHandler)
		uiGenerator.cancelHandler = page.stepPage.cancelHandler;

	if (page.stepPage.lookupSelectionValidateHandler)
		uiGenerator.lookupSelectionValidateHandler = page.stepPage.lookupSelectionValidateHandler;

	if (page.stepPage.finishCompleteHandler)
		uiGenerator.finishCompleteHandler = page.stepPage.finishCompleteHandler;

	uiGenerator.load(sortType, sortBy);
}

HIN.Page.prototype.createMessageTypeHandler = function(page, messageType,
		message, addCompleteHandler) {
	// alert(messageType.typeName);
	if (!page)
		page = this;
	var map = page.groupHeaderMap.get(messageType.typeName);
	if (map) {
		var id = map.value;
		var sortBy = messageType.typeName;
		var uiGenerator = page.uiInstances.get(id).value;
		uiGenerator.formRender = true;
		uiGenerator.uiMessageType = messageType;
		var messageTypeObj = uiGenerator.getMessageType(messageType.type);
		if (!messageTypeObj) {
			uiGenerator.addMessageType(messageType);
			messageType.addMessage(message);
		} else {
			messageTypeObj.addMessage(message);
		}
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			uiGenerator.addMessage(message);
		}
		uiGenerator.generateUI(message, addCompleteHandler);
	} else {
		alert("TODO createMessageTypeHandler");
	}

};

/**
 * addInitialHandler method will trigger from the UI, it can handle the UI
 * stuffs and business logic in step page.
 * 
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */

HIN.Page.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (page.stepPage.addInitialHandler) {
		page.stepPage.addInitialHandler(uiGenerator);
	} else {
		alert("addInitialHandler not implemented in " + page.stepPage);
	}
};

/**
 * addCompleteHandler method will trigger from the UI, it can handle the UI
 * stuffs and business logic in step page. 
 * 
 * @param addNew :
 *            Its a boolean value.
 * @param messageType :
 *            Its an object of messageType.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 * 
 */
HIN.Page.prototype.addCompleteHandler = function(addNew, messageType, message,
		uiGenerator) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	if (message.msg) {
		if (addNew) {
			try {
				page.initialize(message);
			} catch (e) {
				alert("initialize is failed. ");
			}

		}
		try {
			page.fillParticipants(message);
		} catch (e) {
			alert("fillParticipants is failed. ");
		}
	}

	if (page.stepPage.addCompleteHandler) {
		page.stepPage.addCompleteHandler(addNew, messageType, message,
				uiGenerator);
	} else {
		alert("addCompleteHandler not implemented in " + page.stepPage);
	}

};

/**
 * removeCompleteHandler method will trigger from the UI, it can handle the UI
 * stuffs and business logic in step page.
 * 
 * @param messageType :
 *            Its an object of messageType.
 * @param message :
 *            Its an object of message.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.Page.prototype.removeCompleteHandler = function(messageType, message,
		uiGenerator) {

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	var messageForm = message.messageForm;

	var formScript = appController.getComponent("RenderingEngine")
			.getFormScript(messageForm);
	if (!formScript) {
		formScript = uiGenerator.getFormScript(message.id);
	}

	if (formScript) {
		formScript.onUnLoad();
	}

	if (page.stepPage.removeCompleteHandler) {
		page.stepPage.removeCompleteHandler(messageType, message, uiGenerator);
	} else {
		alert("removeCompleteHandler not implemented in " + page.stepPage);
	}
};

/**
 * finishCompleteHandler method will trigger from the UI, it can handle the UI
 * stuffs and business logic in step page.
 * 
 * @returns {void}
 */
HIN.Page.prototype.finishCompleteHandler = function() {
	// alert("finishCompleteHandler");
	appController.getComponent("RenderingEngine").hidePageLoading();
	appController.getComponent("RenderingEngine").closeModalDialog();
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (page.currentUIInstance) {
		page.currentUIInstance.finishCompleteHandler(page);
	}

	if (page.stepPage && page.stepPage.finishCompleteHandler)
		this.stepPage.finishCompleteHandler(page);

}

HIN.Page.prototype.lookupPackageSelectionHandler = function(instance,
		conceptLookup, message, callback) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (conceptLookup) {
		var className = conceptLookup.getMessageTypeClassName();
		var concept = conceptLookup.getName();
		var messageObjects = [];
		var financeMessageType = "FIAB_MT020000HT02";
		var feeObject = new Object();
		feeObject.financeType = "Fee";
		page
				.createMessage(
						financeMessageType,
						conceptLookup,
						message,
						feeObject,
						page.messageCreationComplete,
						function(feeMessage) {
							messageObjects.push(feeMessage);
							// alert("Fee Created " + feeMessage);

							page.initialize(feeMessage);
							page.fillParticipants(feeMessage);
							page
									.fillFinanceMessage(
											financeMessageType,
											feeMessage,
											conceptLookup,
											feeObject,
											function(message) {

												/*
												 * alert("Fee Created " +
												 * XmlUtil
												 * .xmlToString(message.message));
												 */

												if (className == "Package") {
													var costObject = new Object();
													costObject.financeType = "Cost";
													page
															.createMessage(
																	financeMessageType,
																	conceptLookup,
																	message,
																	costObject,
																	page.messageCreationComplete,
																	function(
																			costMessage) {
																		messageObjects
																				.push(costMessage);
																		page
																				.initialize(costMessage);
																		page
																				.fillParticipants(costMessage);
																		page
																				.fillFinanceMessage(
																						financeMessageType,
																						costMessage,
																						conceptLookup,
																						costObject,
																						function(
																								message) {

																							/*
																							 * alert("Cost
																							 * Created " +
																							 * XmlUtil
																							 * .xmlToString(message.message));
																							 */
																							if (callback)
																								callback(messageObjects);
																						},
																						null);

																		// alert("Cost
																		// Created
																		// " +
																		// costMessage);

																	});
												}

											}, null);

						});

	}
};

/**
 * lookupSelectionHandler method will trigger from the UI, it handles the
 * finance related messages.
 * 
 * @param instance :
 *            Its an object of uiGenerator.
 * @param conceptLookup :
 *            Its an object of conceptLookup.
 * @param message :
 *            Its an object of message.
 * 
 * @returns {void}
 */
HIN.Page.prototype.lookupSelectionHandler = function(instance, conceptLookup,
		message) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (page.stepPage.lookupSelectionHandler) {
		page.stepPage.lookupSelectionHandler(instance, conceptLookup, message);
	}

	if (conceptLookup && !message.isFinanced()
			&& !conceptLookup.isPartOfPackage()) {
		var className = conceptLookup.getMessageTypeClassName();
		var concept = conceptLookup.getName();
		var financeMessageType = "FIAB_MT020000HT02";
		if (className == "Service" || className == "Drug") {
			if (concept == "Blood Test") {
				/*
				 * if (page.stepPage.messageCreationComplete)
				 * page.createMessage(financeMessageType, conceptLookup,
				 * message, page.stepPage.messageCreationComplete);
				 */
			} else {
				var feeObject = new Object();
				feeObject.financeType = "Fee";
				page.createMessage(financeMessageType, conceptLookup, message,
						feeObject, page.messageCreationComplete, function(
								newMessage) {
							/* alert("Fee Created " + newMessage); */
							if (className == "Service") {
								var costObject = new Object();
								costObject.financeType = "Cost";
								page.createMessage(financeMessageType,
										conceptLookup, message, costObject,
										page.messageCreationComplete, function(
												newMessage) {
											/*
											 * alert("Cost Created " +
											 * newMessage);
											 */
											instance.loadAlllookups(null,
													instance);
										});
							}
						});

			}
		} else {
			// alert("Class Not Found : " + instance);
			instance.loadAlllookups(null, instance);
		}
	} else {
		// alert("Class Not Found : " + instance);
		instance.loadAlllookups(null, instance);
	}
};

HIN.Page.prototype.messageCreationComplete = function(newMessage,
		conceptLookup, message, object, callback) {
	// alert(message.messageId);
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (message)
		message.addDependendMessage(newMessage);
	var messageType = newMessage.messageType;
	if (conceptLookup && messageType == "FIAB_MT020000HT02") {
		page.initialize(newMessage);
		page.fillParticipants(newMessage);
		page.fillFinanceMessage(messageType, newMessage, conceptLookup, object,
				page.loadDependendForm, callback);
	}
};

HIN.Page.prototype.loadDependendForm = function(message, callback) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var stepPage = page.stepPage;
	var messageTypeObj = stepPage.selectedStep
			.getMessageTypeByType(message.messageType);

	if (messageTypeObj) {
		// alert(XmlUtil.xmlToString(message.msg.getXML()));
		message.title = messageTypeObj.title;
		messageTypeObj.addMessage(message)
		var instanceId = stepPage.groupHeaderMap.get(messageTypeObj.typeName).value;
		var uiInstance = stepPage.uiInstances.get(instanceId).value;
		if (uiInstance) {
			message.instanceId = uiInstance.instanceId;
			uiInstance.addMessage(message);
			uiInstance.loadNewUIForms();
		}
	}
	if (callback) {
		callback(message);
	}
};

HIN.Page.prototype.addMessageTypes = function(page, messageTypeObjects) {
	for ( var index = 0; index < messageTypeObjects.length; index++) {
		var messageTypeObj = messageTypeObjects[index];
		// alert(messageTypeObj);
		if (!page.isExistMessageType(page, messageTypeObj))
			page.messageTypes.push(messageTypeObj);
		else {

			var messages = messageTypeObj.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				if (!messageTypeObj.isMessageExist(messages[messageIndex])) {
					messageTypeObj.addMessage(messages[messageIndex]);
				}
			}

		}
	}
};
HIN.Page.prototype.isExistMessageType = function(page, messageTypeObject) {
	for ( var messageTypeIndex = 0; messageTypeIndex < page.messageTypes.length; messageTypeIndex++) {
		if (page.messageTypes[messageTypeIndex].type == messageTypeObject.type) {
			return true;
		}
	}
	return false;
};

HIN.Page.prototype.createMessage = function(messageType, conceptLookup,
		message, object, callback, innerCallbak) {
	// alert("createMessage : " + messageType);
	var dataLayer = this.appController.getComponent("DataLayer");
	dataLayer.loadConfig(messageType, function(configDoc) {
		var msgApiObj = configDoc.createMessage();
		dataLayer.config = configDoc;
		dataLayer.generateId(function(messageId, msg) {
			var messageObj = factoryClass.createMessage();
			messageObj.messageId = messageId;
			messageObj.msg = msg
			messageObj.messageType = messageType;
			messageObj.message = msg.getXML();
			if (callback)
				callback(messageObj, conceptLookup, message, object,
						innerCallbak);
		}, msgApiObj);
	});
};

HIN.Page.prototype.initialize = function(message, callback) {

	if (!message.isInitializeScriptExecuted()) {
		message.setInitializeScriptExecuted(true);

		var msg = message.msg;
		var messageTypeScript = new MessageTypeScript(msg, message.messageType,
				this.appController);
		var dataLayer = this.appController.getComponent("DataLayer");
		dataLayer.loadData("JS_" + message.messageType, {}, function(jsString) {

			try {
				messageTypeScript.loadScript(jsString);
				messageTypeScript.initialize();
				if (callback) {
					callback(messageTypeScript);
				}
			} catch (e) {
				alert("Message Script for type " + message.messageType
						+ " is not found or initialize is failed : " + e);
			}
		});
	}

};

HIN.Page.prototype.fillParticipants = function(message, callback) {
	var msg = message.msg;
	var messageTypeScript = new MessageTypeScript(msg, message.messageType,
			this.appController);

	var dataLayer = this.appController.getComponent("DataLayer");
	dataLayer.loadData("JS_" + message.messageType, {}, function(jsString) {

		try {
			messageTypeScript.loadScript(jsString);
			messageTypeScript.fillParticipants();

		} catch (e) {
			alert("Message Script for type " + message.messageType
					+ " is not found : " + e);
		}

	});
};
/*
 * HIN.Page.prototype.fillData = function(messageType, message, conceptLookup,
 * callback) {
 * 
 * var msg = message.msg; var messageTypeScript = new MessageTypeScript(msg,
 * message.messageType, this.appController); var dataLayer =
 * this.appController.getComponent("DataLayer"); dataLayer.loadData("JS_" +
 * message.messageType, {}, function(jsString) { try {
 * messageTypeScript.loadScript(jsString);
 * 
 * if (callback) callback(messageType, message, conceptLookup,
 * messageTypeScript); } catch (e) { alert("Message Script for type " +
 * message.messageType + " is not found : " + e); } }); };
 */

HIN.Page.prototype.fillData = function(message, key, values, callback) {

	var msg = message.msg;
	var messageTypeScript = new MessageTypeScript(msg, message.messageType,
			this.appController);
	var dataLayer = this.appController.getComponent("DataLayer");
	dataLayer.loadData("JS_" + message.messageType, {}, function(jsString) {
		try {
			messageTypeScript.loadScript(jsString);
			messageTypeScript.fillData(key, values);
			if (callback)
				callback(messageTypeScript);
		} catch (e) {
			alert("Message Script for type " + message.messageType
					+ " is not found : " + e);
		}
	});
};

HIN.Page.prototype.getMessageScript = function(message, object, callback) {
	// alert("getMessageScript");
	var msg = message.msg;
	var messageTypeScript = new MessageTypeScript(msg, message.messageType,
			this.appController);
	var dataLayer = this.appController.getComponent("DataLayer");
	dataLayer.loadData("JS_" + message.messageType, {}, function(jsString) {
		try {
			messageTypeScript.loadScript(jsString);
			if (callback)
				callback(messageTypeScript, object, message);
		} catch (e) {
			alert("Message Script for type " + message.messageType
					+ " is not found : " + e);
		}
	});
};

HIN.Page.prototype.complete = function(message) {

	var msg = message.msg;
	var messageTypeScript = new MessageTypeScript(msg, message.messageType,
			this.appController);

	var dataLayer = this.appController.getComponent("DataLayer");
	dataLayer.loadData("JS_" + message.messageType, {}, function(jsString) {

		try {
			messageTypeScript.loadScript(jsString);
			messageTypeScript.complete();

		} catch (e) {
			alert("Message Script for type " + message.messageType
					+ " is not found : " + e);
		}
	});

};

HIN.Page.prototype.fillFinanceMessage = function(messageType, message,
		conceptLookup, object, callback, innerCallbak) {
	var financeType = object.financeType;

	var amt = conceptLookup.getAttribute(financeType);
	var concept = conceptLookup.getName();
	var dataLayer = this.appController.getComponent("DataLayer");
	var className = conceptLookup.getMessageTypeClassName();
	messageTypeScript = new MessageTypeScript(message.msg, messageType,
			this.appController);
	dataLayer.loadData("JS_" + messageType, {}, function(data) {

		messageTypeScript.loadScript(data);
		messageTypeScript.initialize();

		message.financeType = financeType;

		var formattedDate = formatDate(new Date(), 'yyyy-MM-dd');

		messageTypeScript.fillData('effectiveTime', formattedDate);

		messageTypeScript.fillData('amt', amt);

		var components = [ {
			'quantity' : 1,
			'unitPrice' : amt,
			'netAmount' : amt
		} ];
		messageTypeScript.fillData('financialTransactionChargeDetail',
				components);

		components = [ {
			'concept' : conceptLookup.getName(),
			'description' : conceptLookup.getDescription()
		} ];

		var transactionType = null;
		if (className == "Service" || className == "Package") {
			if (financeType == "Fee")
				transactionType = AppConstants.TransactionType.SERVICE_FEE;
			else if (financeType == "Cost")
				transactionType = AppConstants.TransactionType.SERVICE_COST;
			messageTypeScript.fillData('service', components);
		} else if (className == "Drug") {
			if (financeType == "Fee")
				transactionType = AppConstants.TransactionType.PRODUCT_FEE;
			else if (financeType == "Cost")
				transactionType = AppConstants.TransactionType.PRODUCT_COST;
			messageTypeScript.fillData('drug', components);
		}

		messageTypeScript.fillData('transactionType', transactionType);
		messageTypeScript.fillData('transactionStatus',
				AppConstants.TransactionStatus.ORDERED);

		if (callback)
			callback(message, innerCallbak);
	});
};

HIN.Page.prototype.fetchConceptByName = function(name, callback, object) {
	this.appController.getComponent("DataLayer").fetchConceptByName(name,
			callback, object);
};

HIN.Page.prototype.getInvoiceID = function(message) {
	var extension = XmlUtil.getXPathResult(message.message,
			"//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
			XPathResult.STRING_TYPE);
	if (extension)
		return extension.stringValue;
	return 0;

};

HIN.Page.prototype.toString = function() {
	return " \r\n Page : [" + this.pageHolder + "]";
};

HIN.Page.prototype.getProcessDefinitionMessages = function(page, callBack) {
	this.getMessagesForIdList(this.getProcessMessageIdList(page), callBack);
};

HIN.Page.prototype.getProcessDefinitionMessagesForMessageTypes = function(page,
		messageTypeList, callBack) {
	this.getMessagesForIdList(this.getProcessMessageIdListForMessageTypes(page,
			messageTypeList), callBack);
};

HIN.Page.prototype.getMessagesForIdList = function(IdList, callBack) {
	if (messageObjects != null && messageObjects.length > 0) {
		messageObjects.splice(0, messageObjects.length);
	}
	index = 0;
	messageObjects = IdList;
	return this.getMessages(callBack);
};

var messageObjects = [];
var index = 0;
HIN.Page.prototype.getMessages = function(callBack) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (index < messageObjects.length) {
		var messageObject = messageObjects[index];
		index++;
		this.appController.getComponent("DataLayer").getMessageInternal(
				messageObject, function() {
					page.getMessages(callBack);
				}, true);
	} else {
		if (callBack) {
			callBack(messageObjects);
		}
	}

};

HIN.Page.prototype.getProcessMessageIdList = function(page) {
	var messageObjectList = [];
	if (page.processDefinition) {
		var steps = page.processDefinition.getSteps();
		for ( var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
			var messageTypes = steps[stepIndex].getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messages = messageTypes[messageTypeIndex].getMessages();
				for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
					if (messages[messageIndex].messageId != null) {
						messageObjectList.push(messages[messageIndex]);
					}
				}
			}

		}
	}
	return messageObjectList;
};

HIN.Page.prototype.getProcessMessageIdListForMessageTypes = function(page,
		messageTypeList) {
	var messageObjectList = [];
	if (page.processDefinition) {
		var steps = page.processDefinition.getSteps();
		for ( var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
			var messageTypes = steps[stepIndex].getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				if (this.isMessageTypeinList(messageTypes[messageTypeIndex],
						messageTypeList)) {
					var messages = messageTypes[messageTypeIndex].getMessages();
					for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
						if (messages[messageIndex].messageId != null) {
							messageObjectList.push(messages[messageIndex]);
						}
					}
				}
			}

		}
	}
	return messageObjectList;
};

HIN.Page.prototype.isMessageTypeinList = function(messageType, messageTypeList) {
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypeList.length; messageTypeIndex++) {
		if (messageType.type === messageTypeList[messageTypeIndex]) {
			return true;
		}
	}
	return false;
};

/*
 * HIN.Page.prototype.getUIInstance = function(messageType) { var page =
 * appController.getComponent("RenderingEngine").getChildComponent(
 * "Form").getPage(); var map =
 * page.groupHeaderMap.get(messageType.messageTypeName); var sortType =
 * messageType.type; var sortBy = messageType.typeName; if (map) { var id =
 * map.value; return page.uiInstances.get(id).value; } return null; };
 */

HIN.Page.prototype.loadForm = function(messageType) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.groupHeaderMap.get(messageType.typeName);
	var sortType = messageType.type;
	var sortBy = messageType.typeName;
	if (map) {
		var id = map.value;
		var uiGenerator = page.uiInstances.get(id).value;
		uiGenerator.customRenderer = false;
		/*
		 * uiInstance.loadNewUIForm(messageType.type, messageType.formHtml,
		 * messageType.typeName);
		 */

		var messageTypeObj = uiGenerator.getMessageType(messageType.type);
		if (!messageTypeObj) {
			uiGenerator.addMessageType(messageType);
			// messageType.addMessage(message);
		}

		var messages = messageType.getMessages();

		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];

			message.rendered = false;
			message.instanceId = id;
			// uiGenerator.uiMessages.push(message);
			uiGenerator.addNew = false;
			uiGenerator.addMessage(message);
			if (messageTypeObj)
				messageTypeObj.addMessage(message);

		}
		uiGenerator.loadUIForms();
		uiGenerator.showSection(uiGenerator, messageType);
		uiGenerator.customRenderer = true;

	} else {
		page.createUIInstance(page, sortType, sortBy, messageType);
	}
};

HIN.Page.prototype.unLoadForm = function(messageType, message) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.groupHeaderMap.get(messageType.typeName);
	if (map) {
		var id = map.value;
		var uiInstance = page.uiInstances.get(id).value;
		if (uiInstance) {
			uiInstance.removeUIForm(uiInstance.instanceId, message.id);
		}
	}
};

HIN.Page.prototype.hideForm = function(message) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.groupHeaderMap.get(message.messageTypeName);
	if (map) {
		var id = map.value;
		var uiInstance = page.uiInstances.get(id).value;
		if (uiInstance) {
			uiInstance.hideUIForm(uiInstance.instanceId, message.id);
		}
	}
};
HIN.Page.prototype.showForm = function(message) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.groupHeaderMap.get(message.messageTypeName);
	if (map) {
		var id = map.value;
		var uiInstance = page.uiInstances.get(id).value;
		if (uiInstance) {
			uiInstance.showUIForm(uiInstance.instanceId, message.id);
		}
	}
};

HIN.Page.prototype.hideSection = function(messageType, message) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.groupHeaderMap.get(messageType.typeName);

	if (map) {
		var id = map.value;
		var uiInstance = page.uiInstances.get(id).value;
		if (uiInstance) {
			uiInstance.hideSection(uiInstance, messageType);
		}
	}
};
