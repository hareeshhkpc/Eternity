var HIN;
if (!HIN)
	HIN = {};
HIN.MeasurePage = function(appController, pageHolder) {
	measurePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "measurePage";// pageHolder;
	this.page = null;
	this.packageId = null;
	this.packageMessage = null;
};

HIN.MeasurePage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};
HIN.MeasurePage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("MeasurePage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = false;
	// uiGenerator.hideAddIcon();
	//uiGenerator.hideRemoveIcon();

};
HIN.MeasurePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.MeasurePage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {
	//measurePage.getNewProgram();
	/*
	 * measurePage.packageMessage = message; var packageMessageType =
	 * messageType; var conceptVO = uiGenerator.conceptVO; var instance =
	 * uiGenerator; if (addNew) { measurePage.packageId = message.messageId;
	 * measurePage.page .lookupPackageSelectionHandler( instance, conceptVO,
	 * null, function(messageObjects) {
	 * 
	 * for ( var index = 0; index < messageObjects.length; index++) {
	 * measurePage.packageMessage .addDependendMessage(messageObjects[index]); }
	 * 
	 * var selectedTypeName = conceptVO.getDescription() //
	 * alert(selectedTypeName); var searchCriteria = { "property" :
	 * "conceptClasses.name", "value" : selectedTypeName, "category" : "Service" };
	 * 
	 * instance.dataLayer .fetchConceptByClassName( searchCriteria,
	 * function(conceptServiceLookups) { for ( var index = 0; index <
	 * conceptServiceLookups.length; index++) { var conceptLookup =
	 * conceptServiceLookups[index]; var conceptVO = conceptLookup
	 * .getConcept(conceptLookup .getName()); conceptVO.partOfPackage = true;
	 * var type = conceptVO .getAttribute("MessageType"); var form = conceptVO
	 * .getAttribute("MessageForm"); var selectedTypeName = conceptVO
	 * .getDescription();// conceptVO.getName(); if (type && form) {
	 * 
	 * var innerStep = measurePage.processDefinition
	 * .getHiddenStep("InnerStepPackage-" + measurePage.packageMessage.id); if
	 * (!innerStep) { innerStep = factoryClass
	 * .createHiddenStep("InnerStepPackage-" + measurePage.packageMessage.id);
	 * measurePage.processDefinition .addStep(innerStep); }
	 * 
	 * var messageType = innerStep .getMessageTypeByType(type); if
	 * (!messageType) { messageType = factoryClass .createMessageType( type,
	 * "Service", form, type); innerStep .addMessageType(messageType); } var
	 * message = uiGenerator .creatMessage(); message.title = selectedTypeName;
	 * messageType .addMessage(message); messageType.category = "Service";
	 * measurePage.placeHolder = 'packageOrder-' +
	 * measurePage.packageMessage.id; measurePage .serviceLoadHandler(type); } } },
	 * instance);
	 * 
	 * }); } else {
	 * 
	 * if (message.messageType == AppConstants.XPaths.Package.MESSAGE_TYPE) {
	 * var messageId = ""; var description = "";
	 * measurePage.getPackageServiceMessageID(message); } }
	 */


};

HIN.MeasurePage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.MeasurePage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.MeasurePage.prototype.taskHandler = function(message, taskVO, instance) {

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	/*
	 * for ( var index = 0; index < page.uiInstances.length(); index++) { var
	 * map = page.uiInstances.getItemAt(index);
	 * 
	 * var uiGenerator = map.value; if (uiGenerator.innerPage) { var messages =
	 * uiGenerator.uiMessages; if (messages) { // alert("msg found: " +
	 * messages.length); for ( var messagIndex = 0; messagIndex <
	 * messages.length; messagIndex++) { var dependentMessageObject =
	 * messages[messagIndex];
	 * message.addDependendMessage(dependentMessageObject); // alert("msg: " +
	 * messageObject); if (!dependentMessageObject.msg) {
	 * measurePage.appController .getComponent("DataLayer")
	 * .createMessageByType( dependentMessageObject.messageType,
	 * function(messageObj) { dependentMessageObject.messageId =
	 * messageObj.messageId; dependentMessageObject.msg = messageObj.msg;
	 * dependentMessageObject.message = messageObj.message; measurePage.page
	 * .getMessageScript( dependentMessageObject, null, function(
	 * messageTypeScript, object, dependentMessageObject) { messageTypeScript
	 * .initialize();
	 * 
	 * var title = dependentMessageObject.title; if (title != null)
	 * messageTypeScript .fillData( "messageTitle", title);
	 * 
	 * });
	 * 
	 * }); } }
	 * 
	 * measurePage.page .getMessageScript( message, null,
	 * function(messageTypeScript, object, dependentMessageObject) { if
	 * (message.messageType == AppConstants.XPaths.Package.MESSAGE_TYPE) { var
	 * dependentMessageObjects = message.dependendMessages; var values = []; for (
	 * var messagIndex = 0; messagIndex < dependentMessageObjects.length;
	 * messagIndex++) { var dependentMessageObject =
	 * dependentMessageObjects[messagIndex]; if
	 * (dependentMessageObject.messageType !=
	 * AppConstants.XPaths.Finance.MESSAGE_TYPE) { var messageId =
	 * dependentMessageObject.messageId; var title =
	 * dependentMessageObject.title; alert(messageId + "," + title); var value = [
	 * messageId, title ]; values.push(value); } } if (values.length > 0) {
	 * messageTypeScript.fillData('code', values); } alert("Message xml : " +
	 * XmlUtil .xmlToString(message.msg .getXML())); } }); } } }
	 */

	var processObjects = [ measurePage.processDefinition ];
	instance.processTask(processObjects);

};

HIN.MeasurePage.prototype.createMessageTypeHandler = function(page,
		messageType, message, addCompleteHandler) {
	// alert("MeasurePage");
	// alert(messageType.typeName);
	if (!page)
		page = this;
	var map = page.groupHeaderMap.get(messageType.typeName);
	if (map) {
		var id = map.value;
		var sortBy = messageType.typeName;
		var uiGenerator = page.uiInstances.get(id).value;
		uiGenerator.formRender = true;
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
			// if (message.instanceId == -1) {
			uiGenerator.addMessage(message);
			// }
		}
		uiGenerator.generateUI(message, addCompleteHandler, function() {
			// alert("did");
		});

	} else {
		alert("TODO createMessageTypeHandler");
		// messageTypeObj.addMessage(message);
		// page.uiSelectedStep.addMessageType(messageTypeObj);
	}

};

HIN.MeasurePage.prototype.serviceLoadHandler = function(type) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	// var messageType = measurePage.subMessageTypes.shift();
	var innerStep = measurePage.processDefinition
			.getHiddenStep("InnerStepPackage-" + measurePage.packageMessage.id);
	if (innerStep) {
		var messageType = innerStep.getMessageTypeByType(type);
		if (messageType) {

			var id = idGenerator.getId();
			var uiGenerator = new HIN.UIGenerator(id, appController,
					page.selectedStep, measurePage.placeHolder, messageType,
					measurePage.serviceLoadHandler, page);
			page.uiInstances.put(id, uiGenerator);
			uiGenerator.formRender = false;
			uiGenerator.innerPage = true;
			uiGenerator.packagePage = true;
			uiGenerator.hideMainHeader();
			uiGenerator.hideAddIcon();
			uiGenerator.hideRemoveIcon();

			var sortBy = messageType.typeName;
			page.groupHeaderMap.put(sortBy, id);
			uiGenerator.createMessageTypeHandler = measurePage.createMessageTypeHandler;
			var messages = messageType.getMessages();

			// alert("Messages Length :" + messages.length);
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				// message.id = idGenerator.getId();
				// if (message.instanceId == -1) {
				/* alert("createUIInstance : " + message); */
				message.rendered = false;
				uiGenerator.addMessage(message);
				// }
			}

			uiGenerator.addCompleteHandler = measurePage.addInnerCompleteHandler;
			uiGenerator.lookupSelectionHandler = measurePage.page.lookupSelectionHandler;
			uiGenerator.load();
		}
	}
};

HIN.MeasurePage.prototype.addInnerCompleteHandler = function(addNew,
		messageType, message, instance) {
	// alert('inner-uiform-' + message.id);
	// alert("Message xml : " + XmlUtil.xmlToString(message.msg.getXML()));
	var packageId = measurePage.getPackageID(message);
	// alert(packageId);
	if (!packageId) {
		measurePage.page.getMessageScript(message, null, function(
				messageTypeScript, object, message) {
			messageTypeScript.fillData('packageId', measurePage.packageId);
			/*
			 * alert("Message xml : " +
			 * XmlUtil.xmlToString(message.msg.getXML()));
			 */
			/*
			 * var values = [ message.messageId, message.title ]; var
			 * packageMessage = measurePage.packageMessage;
			 * measurePage.page.getMessageScript(packageMessage, null, function(
			 * messageTypeScript, object, packageMessage) {
			 * messageTypeScript.fillData('code', values);
			 * 
			 * alert("Message xml : " + XmlUtil .xmlToString(packageMessage.msg
			 * .getXML()));
			 * 
			 * });
			 */

		});

	}
	var innerStep = measurePage.processDefinition
			.getHiddenStep("InnerStepPackage-" + measurePage.packageMessage.id);
	if (innerStep) {
		var messageTypeObject = innerStep
				.getMessageTypeByType(messageType.type);
		messageTypeObject.addMessage(message);
		// alert(message + " : " + instance.innerPage);
	}

};

HIN.MeasurePage.prototype.getPackageID = function(message) {
	// alert("Message xml : " + XmlUtil.xmlToString(message.message));
	// var msg = XmlUtil.stringToXml(message.message);
	var extension = XmlUtil.getXPathResult(message.message, "//"
			+ message.messageType + "/id[root='PACKAGE_ID']/extension",
			XPathResult.STRING_TYPE);
	if (extension)
		return extension.stringValue;
	return 0;

};

HIN.MeasurePage.prototype.getPackageServiceMessageID = function(message) {
	// alert("Message xml : " + XmlUtil.xmlToString(message.message));
	// var msg = XmlUtil.stringToXml(message.message);
	/*
	 * var messageId = XmlUtil .getXPathResult( message.message,
	 * "//POCD_MT000040UV_Package/component/structuredBody/component/section/code/code",
	 * XPathResult.STRING_TYPE); if (messageId) //return messageId.stringValue;
	 * messageId = messageId.stringValue;
	 */
	var codeNode = null;
	var codeNodeList = XmlUtil
			.getXPathResult(
					message.message,
					"//POCD_MT000040UV_Package/component/structuredBody/component/section/code",
					XPathResult.ORDERED_NODE_ITERATOR_TYPE);

	while (codeNode = codeNodeList.iterateNext()) {
		var messageIdNode = XmlUtil.findByName(codeNode, 'code', true);
		var messageId = XmlUtil.text(messageIdNode);

		var serviceNameNode = XmlUtil.findByName(codeNode, 'displayName', true);
		var serviceName = XmlUtil.text(serviceNameNode);

		// alert("messageId: " + messageId + " serviceName:" + serviceName);
	}

	return 0;

};

HIN.MeasurePage.prototype.getNewProgram = function() {
	var processName = 'DemographicsAndBackground';
	var scriptName = 'DemographicScript';
	var stepName = "Step5";

	var dataLayer = measurePage.appController.getComponent("DataLayer");
	dataLayer.getProcessDefinitionByProcessName(processName, function(procDef) {
		process = new ProcessScript(processName, procDef, appController,
				idGenerator);
		loadData('/process-scripts/' + scriptName + '.js', {}, function(data) {
			alert(data);

			process.loadScript(data);
			process.parameter.programCode = "AgeManagementProgram";
			process.initialize();
			alert("initialized : " + process.parameter.programCode);
			process.stepOpen(stepName, function(processDefinition) {
				alert(stepName + " is open");
				var displayResultHtml = ""
				var step = processDefinition.getStep(stepName);
				var messageTypes = step.getMessageTypes();

			});
		});
	});
};