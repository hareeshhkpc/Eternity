var HIN;
if (!HIN)
	HIN = {};
HIN.RemindersPage = function(appController, pageHolder) {
	remindersPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "remindersPage";
	this.page = null;
};

HIN.RemindersPage.prototype.pageBeforeLoad = function(messageType,
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
	uiGenerator.hideAddIcon();
	uiGenerator.hideRemoveIcon();
};
HIN.RemindersPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.RemindersPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.RemindersPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {		
	if(remindersPage.selectedStep.stepName){
		var selectedId = 'child_' + remindersPage.selectedStep.stepName+ '_form';
		var calendarDiv = $('<div id="calendarPage" style="display:none;"></div>');
		if (!$('#calendarPage').attr("id")) {
			$("#" + selectedId).after(calendarDiv);
		}
		$('#' + selectedId).find('[editorType="Calendar"]')
		.attr("page", selectedId);
	}
};

HIN.RemindersPage.prototype.removeCompleteHandler = function(
		messageType, message) {
	// alert("removeCompleteHandler"+message.id);
};

HIN.RemindersPage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.RemindersPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	//alert(XmlUtil.xmlToString(message.message));

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
		 * remindersPage.page.getMessageScript(regMessage, object,
		 * remindersPage.fillData); }, false);
		 */
		dataLayer.getMessageTask(dependendMessage.messageId, dependendMessage,
				dataLayer.getMessageInternal, function(messageId, msg,
						regMessage) {
					message.addDependendMessage(regMessage);
					var object = new Object();
					object.instance = instance;
					object.message = message;
					remindersPage.page.getMessageScript(regMessage,
							object, remindersPage.fillData);

				}, false);

	}

};
HIN.RemindersPage.prototype.fillData = function(messageTypeScript,
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
	var processObjects = [ remindersPage.processDefinition ];
	instance.processTask(processObjects);
};
