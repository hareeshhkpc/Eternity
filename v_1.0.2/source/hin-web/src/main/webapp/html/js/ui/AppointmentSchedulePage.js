var HIN;
if (!HIN)
	HIN = {};
HIN.AppointmentSchedulePage = function(appController, pageHolder) {
	appointmentSchedulePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "appointmentSchedulePage";
	this.page = null;
};

HIN.AppointmentSchedulePage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {

	// uiGenerator.taskHandler = taskHandler;
	// HIN.UIGenerator.instances.put(id, uiGenerator);
	uiGenerator.lookup = false;
	uiGenerator.formRender = false;
	if (this.processDefinition.processName != "Appointments") {
		uiGenerator.singleForm = true;
		uiGenerator.formRender = true;
		uiGenerator.hideMainHeader();
		uiGenerator.hideAddIcon();
		uiGenerator.hideSubHeader();
		//uiGenerator.hideRemoveIcon();
	}
	uiGenerator.hideRemoveIcon();
	// uiGenerator.load(sortType, sortBy);
	/*
	 * uiGenerator.hideMainHeader(); uiGenerator.hideAddIcon();
	 * uiGenerator.hideSubHeader(); uiGenerator.hideRemoveIcon();
	 */

};
HIN.AppointmentSchedulePage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.AppointmentSchedulePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.AppointmentSchedulePage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {

	// alert("Measure addCompleteHandler : " + addNew + " \n " +messageType+ "
	// \n "+message.id+ " \n "+message.messageIndex);
			
	if(appointmentSchedulePage.selectedStep.stepName){
		var selectedId = 'child_' + appointmentSchedulePage.selectedStep.stepName+ '_form';
		var calendarDiv = $('<div id="calendarPage" style="display:none;"></div>');
		if (!$('#calendarPage').attr("id")) {
			$("#" + selectedId).after(calendarDiv);
		}
		$('#' + selectedId).find('[editorType="Calendar"]')
		.attr("page", selectedId);
	}
};

HIN.AppointmentSchedulePage.prototype.removeCompleteHandler = function(
		messageType, message) {
	// alert("removeCompleteHandler"+message.id);
};

HIN.AppointmentSchedulePage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.AppointmentSchedulePage.prototype.taskHandler = function(message, taskVO,
		instance) {

	var patientVO = appController.getComponent("Context").getPatientVO();
	if (patientVO) {
		var dataLayer = appController.getComponent("DataLayer");
		/*
		 * var dependendMessage = dataLayer
		 * .getMessageObject(patientVO.subscriberId);
		 */
		var dependendMessage = factoryClass.createMessage();
		dependendMessage.messageId = patientVO.subscriberId;
		dependendMessage.message = patientVO.message;
		dependendMessage.msg = patientVO.msg;
		dependendMessage.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
		/*
		 * dataLayer.processMessage(message, null, function(messageId, msg,
		 * regMessage) { message.addDependendMessage(regMessage);
		 * alert(regMessage.taskVO); var object = new Object(); object.instance =
		 * instance; object.message = message;
		 * appointmentSchedulePage.page.getMessageScript(regMessage, object,
		 * appointmentSchedulePage.fillData); }, false);
		 */
		dataLayer.getMessageTask(dependendMessage.messageId, dependendMessage,
				dataLayer.getMessageInternal, function(messageId, msg,
						regMessage) {
					message.addDependendMessage(regMessage);
					var object = new Object();
					object.instance = instance;
					object.message = message;
					appointmentSchedulePage.page.getMessageScript(regMessage,
							object, appointmentSchedulePage.fillData);

				}, false);

	}

};
HIN.AppointmentSchedulePage.prototype.fillData = function(messageTypeScript,
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
	var processObjects = [ appointmentSchedulePage.processDefinition ];
	instance.processTask(processObjects);
};
