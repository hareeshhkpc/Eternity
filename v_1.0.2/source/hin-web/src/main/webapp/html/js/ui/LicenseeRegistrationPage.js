var HIN;
if (!HIN)
	HIN = {};
HIN.LicenseeRegistrationPage = function(appController, pageHolder) {
	licenseeRegistrationPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "licenseeRegistrationPage";// pageHolder;
	this.uiInstance = null;
	this.page = null;
};

HIN.LicenseeRegistrationPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback)
		callback(page);
	/*
	 * // alert(page); if
	 * (licenseeRegistrationPage.processDefinition.initializeScript &&
	 * !licenseeRegistrationPage.processDefinition.initializeScriptExecuted) {
	 * licenseeRegistrationPage.processDefinition.initializeScriptExecuted =
	 * true; var processScript = new ProcessScript('LicenseeRegistration',
	 * licenseeRegistrationPage.processDefinition,
	 * licenseeRegistrationPage.appController, idGenerator);
	 * licenseeRegistrationPage.appController.getComponent("RenderingEngine")
	 * .showPageLoading( licenseeRegistrationPage.processDefinition.processName + "
	 * script processing"); //
	 * alert(licenseeRegistrationPage.processDefinition.initializeScript);
	 * processScript
	 * .loadScript(licenseeRegistrationPage.processDefinition.initializeScript);
	 * processScript.initialize(); processScript.stepOpen('Step1', function() { //
	 * alert("Step1 is open"); var messageTypeObjects =
	 * licenseeRegistrationPage.selectedStep .getMessageTypes();
	 * page.addMessageTypes(page, messageTypeObjects);
	 * 
	 * for ( var index = 0; index < messageTypeObjects.length; index++) {
	 * enrollmentPage.messageTypes.push(messageTypeObjects[index]); }
	 * 
	 * licenseeRegistrationPage.appController.getComponent(
	 * "RenderingEngine").hidePageLoading();
	 * 
	 * if (callback) callback(page); }); } else if (callback) { callback(page); }
	 */
}

HIN.LicenseeRegistrationPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("LicenseeRegistrationPage pageBeforeLoad : " + uiGenerator);

	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.LicenseeRegistrationPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.LicenseeRegistrationPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	/* alert("addCompleteHandler : " + message.messageId); */
	appController.getComponent("Context").setOrganization(message.messageId);
};

HIN.LicenseeRegistrationPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.LicenseeRegistrationPage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.LicenseeRegistrationPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	// alert("taskHandler");
	$('#inner-uiform-' + message.id).find("#licenseeRegistrationForm").validationEngine('attach', {isOverflown:true, autoHidePrompt: true, autoHideDelay: 5000});
	if ($('#inner-uiform-' + message.id).find('#licenseeRegistrationForm').validationEngine('validate')) {
		licenseeRegistrationPage.uiInstance = instance;
		licenseeRegistrationPage.saveProfile();
	}
	$('#inner-uiform-' + message.id).find('.formError').css("margin-top", "-60px");
	$('#inner-uiform-' + message.id).find("#licenseeRegistrationForm").validationEngine('detach');
};

HIN.LicenseeRegistrationPage.prototype.saveProfile = function() {
	var messageId = licenseeRegistrationPage.appController.getComponent(
			"Context").getOrganization();
	// alert(messageId);
	try {
		if (messageId) {
			var messageObject = licenseeRegistrationPage.appController
					.getComponent("DataLayer").getMessageObject(messageId);
			var messageXml = messageObject.message;
			var msg = messageObject.msg;
			/*licenseeRegistrationPage.appController.getComponent("Context")
					.deleteFromContext();
			licenseeRegistrationPage.appController.getComponent("Context")
					.addInContext("registration", messageXml);*/
			var organizationVO = licenseeRegistrationPage.appController
					.getComponent("Context").getSelectedOrganizationVO();
			if (!organizationVO)
				organizationVO = new HIN.OrganizationVO();
			organizationVO.setMsg(msg);
			organizationVO.setMessage(messageXml);
			licenseeRegistrationPage.appController.getComponent("Context")
					.setSelectedOrganizationVO(organizationVO);
			licenseeRegistrationPage.appController.getComponent(
					"RenderingEngine").setLeftHeaderInfo(organizationVO.name);
		}
		var processObjects = [];
		licenseeRegistrationPage.appController.getComponent("DataLayer").validateUser(organizationVO.userName, function(data) {
			if(!data){
				licenseeRegistrationPage.processDefinition.id = "";
				processObjects.push(licenseeRegistrationPage.processDefinition);
				licenseeRegistrationPage.uiInstance.processTask(processObjects);
			}else {
				licenseeRegistrationPage.appController.getComponent("RenderingEngine").openPromptModalDialog(
						"Organization's User Name already exists. Please use another User Name",
						function() {
						});
			}
		});

	} catch (e) {
		alert("Message Script error : " + e);
	}

};
