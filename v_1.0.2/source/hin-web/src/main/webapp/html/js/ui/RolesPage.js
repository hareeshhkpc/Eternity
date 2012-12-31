var HIN;
if (!HIN)
	HIN = {};
HIN.RolesPage = function(appController, pageHolder) {
	rolesPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "rolesPage";// pageHolder;
	this.page = null;
};

HIN.RolesPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.RolesPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// if (this.processDefinition.processName != "Profile") {
	uiGenerator.category = "Role";
	uiGenerator.lookup = true;
	uiGenerator.formRender = false;
	/*
	 * uiGenerator.singleForm = true; uiGenerator.hideMainHeader();
	 * uiGenerator.hideAddIcon(); uiGenerator.hideSubHeader();
	 * uiGenerator.hideRemoveIcon();
	 */
	// }
	// alert("RolesPage pageBeforeLoad : " + uiGenerator);
	/*
	 * uiGenerator.hideMainHeader(); uiGenerator.hideAddIcon();
	 * uiGenerator.hideSubHeader(); uiGenerator.hideRemoveIcon();
	 */

};
HIN.RolesPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.RolesPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	/*
	 * alert("Message xml : " + XmlUtil.xmlToString(message.message));
	 * alert("addCompleteHandler");
	 */
	if (addNew) {
		message.deletable = true;
		this.appController.getComponent("Context").setRoleId(message.messageId);
		rolesPage.page.createMessage("ROLE_PERMISSION", null, message, null,
				rolesPage.messageCreationComplete, null);
	}
};

HIN.RolesPage.prototype.messageCreationComplete = function(newMessage,
		conceptLookup, message) {
	var object = new Object();
	object.message = message;
	rolesPage.page.getMessageScript(newMessage, object,
			rolesPage.fillNewPermission);
};

HIN.RolesPage.prototype.fillNewPermission = function(messageTypeScript, object,
		newMessage) {
	var message = object.message;
	var title = message.title;
	newMessage.title = title + " Permission";
	/* alert("title : " + title); */
	messageTypeScript.fillData('userPermission');
	/* messageTypeScript.fillData("messageTitle", title) */
	var messageType = rolesPage.processDefinition.getStep("Step3")
			.getMessageTypeByType("ROLE_PERMISSION");
	messageType.addMessage(newMessage);
	message.addDependendMessage(newMessage);

	/*
	 * var messages = messageType.getMessages(); for ( var index = 0; index <
	 * messages.length; index++) { alert(messages[index].title); }
	 */

};

HIN.RolesPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.RolesPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};
HIN.RolesPage.prototype.lookupSelectionValidateHandler = function(instance,
		conceptLookup) {
	if (conceptLookup) {
		var messageType = conceptLookup.getAttribute("MessageType");
		var messageForm = conceptLookup.getAttribute("MessageForm");
		var messageTypeName = conceptLookup.getAttribute("MessageTypeName");
		var selectedTypeName = conceptLookup.getName();

		var messageTypeObj = instance.getMessageType(messageType);

		if (!messageTypeObj) {
			messageTypeObj = factoryClass.createMessageType(messageType,
					messageTypeName, messageForm, selectedTypeName);
			rolesPage.selectedStep.addMessageType(messageTypeObj);
		}

		var length = messageTypeObj.getMessages().length;
		if (length == 0 && instance && messageType && messageForm
				&& selectedTypeName) {

			var object = new Object();
			object.uiMessageIndex = -1;
			object.messageType = messageType;
			object.messageForm = messageForm;
			object.selectedTypeName = selectedTypeName;
			instance.createUIForm(object, instance.addCompleteHandler, null);

			/*
			 * instance.createUIForm(-1, messageType, messageForm,
			 * selectedTypeName, instance.addCallback);
			 */
		} else {
			alert("this role is already assigned");
		}
	}

};

HIN.RolesPage.prototype.taskHandler = function(message, taskVO, instance) {
	var processObjects = [ rolesPage.processDefinition ];
	instance.processTask(processObjects);
};
