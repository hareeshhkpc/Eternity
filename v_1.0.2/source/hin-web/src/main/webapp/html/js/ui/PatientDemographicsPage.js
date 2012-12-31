var HIN;
if (!HIN)
	HIN = {};
HIN.PatientDemographicsPage = function(appController, pageHolder) {
	patientDemographicsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "patientDemographicsPage";
	this.uiInstance = null;
};
HIN.PatientDemographicsPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.PatientDemographicsPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("PatientDemographicsPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;

	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.PatientDemographicsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.PatientDemographicsPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	// alert("addCompleteHandler");
	patientDemographicsPage.appController.getComponent("Context").setPatient(
			message.messageId);
	var patientVO = patientDemographicsPage.appController.getComponent(
			"Context").getPatientVO();
	if (patientVO) {
		patientVO.setMsg(message.msg);
		patientVO.setMessage(message.msg.getXML());
	}
	if (message.messageId) {
		var messageXml = patientDemographicsPage.appController.getComponent(
				"DataLayer").getMessageXml(message.messageId);
		patientDemographicsPage.appController.getComponent("Context")
				.deleteFromContext();
		patientDemographicsPage.appController.getComponent("Context")
				.addInContext("registration", messageXml);
	}

};

HIN.PatientDemographicsPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.PatientDemographicsPage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.PatientDemographicsPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	var checkinstate = patientDemographicsPage.appController.getComponent(
			"Context").getCheckinState();
	if (checkinstate == "transfer") {
		patientDemographicsPage.appController.getComponent("Context")
				.setCheckinState("false");
	}

	var patientVO = patientDemographicsPage.appController.getComponent(
			"Context").getPatientVO();
	if (patientVO) {
		patientVO.setMsg(message.msg);
		patientVO.setMessage(message.msg.getXML());
	}

	$('#inner-uiform-' + message.id).find("#demographicsForm")
			.validationEngine('attach', {
				isOverflown : true,
				autoHidePrompt : true,
				autoHideDelay : 5000
			});
	if ($('#inner-uiform-' + message.id).find('#demographicsForm')
			.validationEngine('validate')) {
		var processObjects = [ patientDemographicsPage.processDefinition ];
		instance.processTask(processObjects);
	}

	$('#inner-uiform-' + message.id).find('.formError').css("margin-top",
			"-60px");
	$('#inner-uiform-' + message.id).find("#demographicsForm")
			.validationEngine('detach');

};

HIN.PatientDemographicsPage.prototype.toString = function() {
	return " \r\n PatientDemographicsPage : [" + this.pageHolder + "]";
};
