var HIN;
if (!HIN)
	HIN = {};
HIN.AppointmentsPage = function(appController, pageHolder) {
	appointmentsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "appointmentsPage";
	this.page = null;
};

HIN.AppointmentsPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	uiGenerator.lookup = false;
	uiGenerator.formRender = false;
	if (this.processDefinition.processName != "Relations") {
		uiGenerator.singleForm = true;
		uiGenerator.formRender = true;
		uiGenerator.hideMainHeader();
		uiGenerator.hideAddIcon();
		uiGenerator.hideSubHeader();
		//uiGenerator.hideRemoveIcon();
	}
	uiGenerator.hideRemoveIcon();
};
HIN.AppointmentsPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.AppointmentsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.AppointmentsPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {			
	if(appointmentsPage.selectedStep.stepName){
		var selectedId = 'child_' + appointmentsPage.selectedStep.stepName+ '_form';
		var calendarDiv = $('<div id="calendarPage" style="display:none;"></div>');
		if (!$('#calendarPage').attr("id")) {
			$("#" + selectedId).after(calendarDiv);
		}
		$('#' + selectedId).find('[editorType="Calendar"]')
		.attr("page", selectedId);
	}
};

HIN.AppointmentsPage.prototype.removeCompleteHandler = function(
		messageType, message) {
	// alert("removeCompleteHandler"+message.id);
};

HIN.AppointmentsPage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.AppointmentsPage.prototype.taskHandler = function(message, taskVO,
		instance) {
//alert(message.message);
	var patientVO = appController.getComponent("Context").getPatientVO();
	if (patientVO) {
		var dataLayer = appController.getComponent("DataLayer");
		var dependendMessage = factoryClass.createMessage();
		dependendMessage.messageId = patientVO.subscriberId;
		dependendMessage.message = patientVO.message;
		dependendMessage.msg = patientVO.msg;
		dependendMessage.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
		dataLayer.getMessageTask(dependendMessage.messageId, dependendMessage,
				dataLayer.getMessageInternal, function(messageId, msg,
						regMessage) {
					message.addDependendMessage(regMessage);
					var object = new Object();
					object.instance = instance;
					object.message = message;
					appointmentsPage.page.getMessageScript(regMessage,
							object, appointmentsPage.fillData);

				}, false);

	}

};
HIN.AppointmentsPage.prototype.fillData = function(messageTypeScript,
		object, dependendMessage) {
	var instance = object.instance;
	var message = object.message;
	var xml = message.message;
	// TODO put consultant id and add consultantVo in context - Refer programVO
	var appointmentVO = new HIN.AppointmentVO();
	appointmentVO.setMessage(xml);
	appController.getComponent("Context").setAppointmentVO(appointmentVO);
	appController.getComponent("Context").setAppointment(xml);

	messageTypeScript.fillData('consultantId', appointmentVO.doctorId);
	// alert("Message xml : " +
	// XmlUtil.xmlToString(dependendMessage.msg.getXML()));
	var processObjects = [ appointmentsPage.processDefinition ];
	instance.processTask(processObjects);
};
