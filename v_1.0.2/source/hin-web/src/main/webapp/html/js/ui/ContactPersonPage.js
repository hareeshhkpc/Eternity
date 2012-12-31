var HIN;
if (!HIN)
	HIN = {};
HIN.ContactPersonPage = function(appController, pageHolder) {
	contactPersonPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "contactPersonPage";// pageHolder;
	this.uiInstance = null;
	this.newRegistration = true;
};

HIN.ContactPersonPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
}

HIN.ContactPersonPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("ContactPersonPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;

	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ContactPersonPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.ContactPersonPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	if (message.messageProcessCompeletionStatus < messageType.state
			&& message.dependendMessages.length == 0) {
		// Create Default Role
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer.createMessageByType("ROLE_EMPLOYEE", function(roleMessage) {
			message.addDependendMessage(roleMessage);
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			page.getMessageScript(roleMessage, null, function(
					messageTypeScript, object, roleMessage) {
				messageTypeScript.initialize();
				/*
				 * alert("Message xml : " + XmlUtil
				 * .xmlToString(roleMessage.message));
				 */
				dataLayer.createMessageByType("ROLE_PERMISSION", function(
						permissionMessage) {
					message.addDependendMessage(permissionMessage);
					page.getMessageScript(permissionMessage, null, function(
							messageTypeScript, object, permissionMessage) {
						messageTypeScript.initialize();
						/*messageTypeScript.fillData('userPermission');*/
						/*
						 * alert("Message xml : " + XmlUtil
						 * .xmlToString(permissionMessage.message));
						 */
					});
				});
			});
		});
	}

};

HIN.ContactPersonPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.ContactPersonPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.ContactPersonPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	contactPersonPage.uiInstance = instance;
	contactPersonPage.saveProfile(message);

};

HIN.ContactPersonPage.prototype.saveProfile = function(message) {
	var messageId = message.messageId
	var messageObject = null;
	if (messageId) {
		messageObject = contactPersonPage.appController.getComponent(
				"DataLayer").getMessageObject(messageId);
	}
	contactPersonPage.processHandler(contactPersonPage.appController
			.getComponent("DataLayer").getNewProcessDefinitionInstance(
					"Profile"), messageObject);
};

HIN.ContactPersonPage.prototype.processHandler = function(
		profileProcessDefinition, messageObject) {

	var processObjects = [];
	var messageId = contactPersonPage.appController.getComponent("Context")
			.getStaff();
	/* alert("messageId : " + messageId) */
	contactPersonPage.processDefinition.id = "";
	processObjects.push(contactPersonPage.processDefinition);

	profileProcessDefinition.id = "";
	profileProcessDefinition.insertMessage("Step1", "PRPA_MT201000HT03",
			messageObject);
	processObjects.push(profileProcessDefinition);

	contactPersonPage.uiInstance.processTask(processObjects);

	contactPersonPage.newRegistration = false;
	contactPersonPage.appController.getComponent("Context")
			.setContactPersonProcessDefinition(null);
};
