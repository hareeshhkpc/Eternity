var HIN;
if (!HIN)
	HIN = {};
HIN.StepPage = function(appController, pageHolder) {
	stepPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "stepPage";
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.page = null;
};

HIN.StepPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.StepPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = false;
	uiGenerator.lookup = false;
};
HIN.StepPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.StepPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("Measure addCompleteHandler : " + selectedStep);
	selectedStep = this.appController.getComponent("RenderingEngine")
			.getChildComponent("Form").selectedStep;
	var selectedId = 'child_' + selectedStep.stepName + '_form';
	if (!$('#calendarPage').attr("id")) {
		$("#" + selectedId).after(
				'<div id="calendarPage" style="display: none"></div>');
	}
	$('#' + selectedId).find('[editorType="Calendar"]')
			.attr("page", selectedId);
};

HIN.StepPage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.StepPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.StepPage.prototype.taskHandler = function(message, taskVO, instance) {

	var patientVO = appController.getComponent("Context").getPatientVO();
	if (patientVO) {
		var dependendMessage = factoryClass.createMessage();
		dependendMessage.messageId = patientVO.subscriberId;
		dependendMessage.message = patientVO.message;
		dependendMessage.msg = patientVO.msg;
		dependendMessage.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
		message.addDependendMessage(dependendMessage);
		var object = new Object();
		object.instance = instance;
		object.message = message;
		stepPage.page.getMessageScript(dependendMessage, object,
				stepPage.fillData);
	}

};
HIN.StepPage.prototype.fillData = function(messageTypeScript, object,
		dependendMessage) {
	var instance = object.instance;
	var message = object.message;
	var xml = message.message;
	var appointmentVO = new HIN.AppointmentVO();
	appointmentVO.setMessage(xml);
	//TODO put consultant id and add consultantVo in context - Refer programVO
	messageTypeScript.fillData('consultantId', appointmentVO.doctorId);
	//alert("Message xml : " + XmlUtil.xmlToString(dependendMessage.msg.getXML()));
	var processObjects = [ stepPage.processDefinition ];
	instance.processTask(processObjects);
};