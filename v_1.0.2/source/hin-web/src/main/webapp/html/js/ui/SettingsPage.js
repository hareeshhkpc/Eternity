var HIN;
if (!HIN)
	HIN = {};
HIN.SettingsPage = function(appController, pageHolder) {
	settingsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "settingsPage";// pageHolder;
	this.page = null;
};

HIN.SettingsPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.SettingsPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("SettingsPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();
};
HIN.SettingsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.SettingsPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler");
};

HIN.SettingsPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.SettingsPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.SettingsPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler" + XmlUtil.xmlToString(message.message));
	var organizationVO = appController.getComponent("Context")
			.getSelectedOrganizationVO();
	if (organizationVO) {
		var dataLayer = appController.getComponent("DataLayer");
		var dependendMessage = factoryClass.createMessage();
		dependendMessage.messageId = organizationVO.subscriberId;
		dependendMessage.message = organizationVO.message;
		dependendMessage.msg = organizationVO.msg;
		dependendMessage.messageType = AppConstants.XPaths.Organization.MESSAGE_TYPE;

		dataLayer.getMessageTask(dependendMessage.messageId, dependendMessage,
				dataLayer.getMessageInternal, function(messageId, msg,
						orgMessage) {
					message.addDependendMessage(orgMessage);
					var object = new Object();
					object.instance = instance;
					object.message = message;
					settingsPage.page.getMessageScript(orgMessage, object,
							settingsPage.fillData);
					var organizationVO = settingsPage.appController
							.getComponent("Context")
							.getSelectedOrganizationVO();
					if (!organizationVO)
						organizationVO = new HIN.OrganizationVO();
					organizationVO.setMessage(orgMessage);
					settingsPage.appController.getComponent(
							"Context")
							.setSelectedOrganizationVO(organizationVO);
				}, false);

	}
	
	
};

HIN.SettingsPage.prototype.fillData = function(messageTypeScript, object,
		dependendMessage) {
	var instance = object.instance;
	var message = object.message;
	messageTypeScript.fillData('licenseeId', message.messageId);

	$('#inner-uiform-' + message.id).find("#licenseeSettingsForm1").validationEngine('attach', {isOverflown:true, overflownDIV:".ui-left-side-forms", autoHidePrompt: true, autoHideDelay: 5000});
	$('#inner-uiform-' + message.id).find("#licenseeSettingsForm2").validationEngine('attach', {isOverflown:true, overflownDIV:".ui-left-side-forms", autoHidePrompt: true, autoHideDelay: 5000});
	if ($('#inner-uiform-' + message.id).find('#licenseeSettingsForm1').validationEngine('validate') && $('#inner-uiform-' + message.id).find('#licenseeSettingsForm2').validationEngine('validate')) {
		var processObjects = [ settingsPage.processDefinition ];
		instance.processTask(processObjects);
	}
		$('#inner-uiform-' + message.id).find('.formError').css("margin-top", "-60px");
		$('#inner-uiform-' + message.id).find("#licenseeSettingsForm1").validationEngine('detach');
		$('#inner-uiform-' + message.id).find("#licenseeSettingsForm2").validationEngine('detach');

};
