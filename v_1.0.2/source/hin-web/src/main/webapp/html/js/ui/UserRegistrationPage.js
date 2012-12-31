var HIN;
if (!HIN)
	HIN = {};
HIN.UserRegistrationPage = function(appController, pageHolder) {
	userRegistrationPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "userRegistrationPage";// pageHolder;
	this.uiInstance = null;
};
HIN.UserRegistrationPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.UserRegistrationPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("UserRegistrationPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;

	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.UserRegistrationPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.UserRegistrationPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	appController.getComponent("Context").setPatient(message.messageId);
	messageId = message.messageId;
	/*var patientVO = patientDemographicsPage.appController.getComponent(
			"Context").getPatientVO();
	if (patientVO) {
		patientVO.setMsg(message.msg);
		patientVO.setMessage(message.msg.getXML());
	}*/
};

HIN.UserRegistrationPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.UserRegistrationPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.UserRegistrationPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	// alert("taskHandler");
	userRegistrationPage.uiInstance = instance;
	// alert("taskHandler : " + message);
	userRegistrationPage.saveProfile();
};

HIN.UserRegistrationPage.prototype.saveProfile = function() {
	var messageId = userRegistrationPage.appController.getComponent("Context")
			.getPatient();
	if (messageId) {
		var messageXml = userRegistrationPage.appController.getComponent(
				"DataLayer").getMessageXml(messageId);
		/*userRegistrationPage.appController.getComponent("Context")
				.deleteFromContext();
		userRegistrationPage.appController.getComponent("Context")
				.addInContext("registration", messageXml);*/
		var patientVO = userRegistrationPage.appController.getComponent(
				"Context").setPatientVO(patientVO);
		if (!patientVO)
			patientVO = new HIN.PatientVO();
		patientVO.setMessage(messageXml);
		userRegistrationPage.appController.getComponent("Context")
				.setPatientVO(patientVO);
		userRegistrationPage.appController.getComponent("RenderingEngine")
				.setLeftHeaderInfo(patientVO.givenName);
	}
	// createDemographicsAndBackgroundProcessInstance();

	userRegistrationPage.processHandler(userRegistrationPage.appController
			.getComponent("DataLayer").getNewProcessDefinitionInstance(
					"DemographicsAndBackground"));

};

HIN.UserRegistrationPage.prototype.processHandler = function(
		demographicsAndBackgroundProcessDefinition) {

	/*
	 * staffRegistrationProcessDefinition = appController.getComponent(
	 * "RenderingEngine").getChildComponent("Process") .getProcessDefinition();
	 */
	userRegistrationPage.processDefinition.id = "";
	// staffRegistrationProcessDefinition.optimize();
	/*
	 * alert("staffRegistrationProcessDefinition : " +
	 * $.toJSON(staffRegistrationProcessDefinition));
	 */
	var subscriberId = userRegistrationPage.appController.getComponent(
			"Context").getStaffVo().subscriberId;
	var processName = userRegistrationPage.processDefinition.processName;
	var id = subscriberId + "_" + processName;
	userRegistrationPage.appController.getComponent("DataLayer").addProcess(id,
			userRegistrationPage.processDefinition)

	var step = userRegistrationPage.processDefinition.getStep("Step1");
	var messageType = step.getMessageTypeByType("PRPA_MT201000HT03");
	var message = messageType.getMessage(messageId);
	demographicsAndBackgroundProcessDefinition.id = "";
	demographicsAndBackgroundProcessDefinition.insertMessage("Step1",
			"PRPA_MT201000HT03", message.messageId);
	demographicsAndBackgroundProcessDefinition.optimize();
	/*
	 * alert("demographicsAndBackgroundProcessDefinition " +
	 * $.toJSON(demographicsAndBackgroundProcessDefinition));
	 */
	id = subscriberId + "_"
			+ demographicsAndBackgroundProcessDefinition.processName;
	userRegistrationPage.appController.getComponent("DataLayer").addProcess(id,
			demographicsAndBackgroundProcessDefinition);

	if (userRegistrationPage.uiInstance)
		userRegistrationPage.uiInstance.processTask();
};