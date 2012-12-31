var HIN;
if (!HIN)
	HIN = {};
/**
 * PatientRegistrationPage is sub class of page which is the entry point of the
 * step, which knows the current process definition, selected step etc.
 */
HIN.PatientRegistrationPage = function(appController, pageHolder) {
	patientRegistrationPage = this;
	this.appController = appController;
	/** processDefinition holds the current selected process definition. */
	this.processDefinition = null;
	this.messageTypes = [];
	/** selectedStep holds the current selected step. */
	this.selectedStep = null;
	this.pageHolder = "patientRegistrationPage";// pageHolder;
	this.uiInstance = null;
	this.page = null;
	this.newRegistration = true;
};
/**
 * init method will trigger from base class. Here in init method have the
 * following business logic. It retrieves the relevant data from the context and
 * it loads and execute the initialize script as per the process definition
 * using the process script API. The callback will be triggered from process
 * script API and execute the business or ui logic which is implemented. *
 * 
 * @param callback :
 *            Its a function which will be called after the init.
 * @param page :
 *            Its an object of page.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.init = function(callback, page) {
	this.page = page;

	var patientRegistrationProcessDefinition = patientRegistrationPage.appController
			.getComponent("Context").getPatientRegistrationProcessDefinition();
	if (patientRegistrationProcessDefinition == null) {
		patientRegistrationPage.appController.getComponent("Context")
				.setPatientRegistrationProcessDefinition(
						patientRegistrationProcessDefinition);
	} else {
		patientRegistrationPage.newRegistration = false
	}

	// alert(page);
	if (patientRegistrationPage.newRegistration == true
			&& patientRegistrationPage.processDefinition.initializeScript
			&& !patientRegistrationPage.processDefinition.initializeScriptExecuted) {
		patientRegistrationPage.processDefinition.initializeScriptExecuted = true;
		var processScript = new ProcessScript('PatientRegistration',
				patientRegistrationPage.processDefinition,
				patientRegistrationPage.appController, idGenerator);
		patientRegistrationPage.appController.getComponent("RenderingEngine")
				.showPageLoading(
						patientRegistrationPage.processDefinition.processName
								+ " script processing");

		// alert(patientRegistrationPage.processDefinition.initializeScript);
		processScript
				.loadScript(patientRegistrationPage.processDefinition.initializeScript);
		processScript.initialize();
		processScript.stepOpen('Step1', function() {
			// alert("Step1 is open");
			var messageTypeObjects = patientRegistrationPage.selectedStep
					.getMessageTypes();
			page.addMessageTypes(page, messageTypeObjects);
			/*
			 * for ( var index = 0; index < messageTypeObjects.length; index++) {
			 * enrollmentPage.messageTypes.push(messageTypeObjects[index]); }
			 */
			patientRegistrationPage.appController.getComponent(
					"RenderingEngine").hidePageLoading();

			if (callback)
				callback(page);
		});
	} else if (callback) {
		callback(page);
	}
};

/**
 * pageBeforeLoad method will trigger from the base class and customize the code
 * as per the business logic. *
 * 
 * @param messageType :
 *            Its an object of messageType.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("PatientRegistrationPage pageBeforeLoad : " + uiGenerator);

	if (messageType.type != AppConstants.XPaths.Registrtion.MESSAGE_TYPE) {
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			message.messageTypeCompeletionTempStatus = messageType.state;
			message.renderUI = false;
		}
	}

	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};

/**
 * addInitialHandler method will trigger from the base class and customize the
 * code as per the business logic.
 * 
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

/**
 * addCompleteHandler method will trigger from the UI form.E.g. Add a new form
 * by clicking on the add icon from the UI or load an existing form and it will
 * differentiate by the property addNew, true means newly added.
 * 
 * @param addNew :
 *            Its a boolean value.
 * @param messageType :
 *            Its an object of messageType.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	/* alert("addCompleteHandler : " + message.messageId); */
	appController.getComponent("Context").setPatient(message.messageId);
};

/**
 * removeCompleteHandler method will trigger from the UI form.E.g. Delete a form
 * by clicking on the delete icon from the UI. *
 * 
 * @param messageTypeName :
 *            Its a string value.
 * @param message :
 *            Its an object of message.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.PatientRegistrationPage.prototype.lookupSelectionHandler = function(
		instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};
/**
 * taskHandler method will trigger by clicking on the finish button from the UI.
 * Customize the code as per the business logic. *
 * 
 * @param message :
 *            Its an object of message.
 * @param taskVO :
 *            Its an object of taskVO.
 * @param instance :
 *            Its an object of uigenerator.
 * @returns {void}
 */
HIN.PatientRegistrationPage.prototype.taskHandler = function(message, taskVO,
		instance) {

	$('#inner-uiform-' + message.id).find("#patientRegistrationForm")
			.validationEngine('attach', {
				isOverflown : true,
				autoHidePrompt : true,
				autoHideDelay : 5000
			});
	if ($('#inner-uiform-' + message.id).find('#patientRegistrationForm')
			.validationEngine('validate')) {
		patientRegistrationPage.uiInstance = instance;
		patientRegistrationPage.saveProfile(message);
	}

	$('#inner-uiform-' + message.id).find('.formError').css("margin-top",
			"-60px");
	$('#inner-uiform-' + message.id).find("#patientRegistrationForm")
			.validationEngine('detach');

};
function customValidation(field, rules, i, options){
	rules.autoHideDelay = 5000;
	var editor = $(field).closest('[uirole="editor"]')[0];
	var selectedContact = $(editor).find("#TELvalue").attr("value");
	if(!selectedContact){
		return '* This field is required';
	}else{
		var option = $(editor).find("#select-telecomUse option:selected");
		if($(option).val() == "EmailP" || $(option).val() == "EmailB"){
			var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
			if(!pattern.test(selectedContact)){
				return '* Invalid email address';
			}	
		}
	}
}

HIN.PatientRegistrationPage.prototype.saveProfile = function(message) {
	var messageId = patientRegistrationPage.appController.getComponent(
			"Context").getPatient();
	patientRegistrationPage.appController.getComponent("Context")
			.setCheckinState("false");
	patientRegistrationPage.appController.getComponent("RenderingEngine")
			.getChildComponent("Search").onSelect(null);
	// alert(messageId + " : " + message.messageId);
	try {
		if (messageId) {
			var messageXml = patientRegistrationPage.appController
					.getComponent("DataLayer").getMessageXml(messageId);
			/*
			 * patientRegistrationPage.appController.getComponent("Context")
			 * .deleteFromContext();
			 * patientRegistrationPage.appController.getComponent("Context")
			 * .addInContext("registration", messageXml);
			 */
			patientRegistrationPage.appController.getComponent("Context")
					.clearAppointmentVOContext();
			var patientVO = patientRegistrationPage.appController.getComponent(
					"Context").getPatientVO();
			if (!patientVO)
				patientVO = new HIN.PatientVO();
			// alert(messageXml);
			patientVO.setMsg(message.msg);
			patientVO.setMessage(messageXml);
			// alert(patientVO);
			patientRegistrationPage.appController.getComponent("Context")
					.setPatientVO(patientVO);
			patientRegistrationPage.appController.getComponent(
					"RenderingEngine").setLeftHeaderInfo(patientVO.name);
		}

		// createDemographicsAndBackgroundProcessInstance();

		var messages = patientRegistrationPage.processDefinition.getStep(
				"Step1").getMessageTypeByType(
				AppConstants.XPaths.Registrtion.MESSAGE_TYPE).getMessages();
		var subscriberId = "";
		if (messages.length > 0) {
			subscriberId = messages[0].messageId;
			patientRegistrationPage.page.complete(messages[0]);
			patientRegistrationPage.page.fillData(messages[0],
					"setDefaultUser", patientVO.givenName);
			patientRegistrationPage.page.fillData(messages[0],
					"setDefaultPassword", patientVO.givenName + "123");
			
			
			// alert("Message xml : " +
			// XmlUtil.xmlToString(messages[0].message));

		}

		messages = patientRegistrationPage.processDefinition.getStep("Step1")
				.getMessageTypeByType(
						AppConstants.XPaths.Role.PATIENT_MESSAGE_TYPE)
				.getMessages();

		if (messages.length > 0) {
			var messageId = messages[0].messageId;
			var msg = messages[0].msg;

			patientRegistrationPage.appController.getComponent("DataLayer").messageMap
					.put(messageId, msg);

			patientRegistrationPage.page.initialize(messages[0]);
			patientRegistrationPage.page.fillParticipants(messages[0]);
			patientRegistrationPage.page.complete(messages[0]);

		}

		messages = patientRegistrationPage.processDefinition.getStep("Step1")
				.getMessageTypeByType(
						AppConstants.XPaths.Permission.MESSAGE_TYPE)
				.getMessages();

		if (messages.length > 0) {
			var messageId = messages[0].messageId;
			var msg = patientRegistrationPage.appController
					.getComponent("DataLayer").messageMap.get(messageId).value;
			var messageId = messages[0].messageId;
			var msg = messages[0].msg;

			patientRegistrationPage.appController.getComponent("DataLayer").messageMap
					.put(messageId, msg);

			patientRegistrationPage.page.initialize(messages[0]);
			patientRegistrationPage.page.fillData(messages[0],
					"patientPermission","");
			
			patientRegistrationPage.page.fillParticipants(messages[0]);
			patientRegistrationPage.page.complete(messages[0]);

		}

		var messageObjects = [];
		var messageTypes = patientRegistrationPage.selectedStep
				.getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messages = messageTypes[messageTypeIndex].getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				if (message.status == AppConstants.Status.ACTIVE) {
					messageObjects.push(messages[messageIndex]);
					// alert(messages[messageIndex]);
				}
			}
		}

		patientRegistrationPage.processHandler(
				patientRegistrationPage.appController.getComponent("DataLayer")
						.getNewProcessDefinitionInstance(
								"DemographicsAndBackground"), messageObjects);
	} catch (e) {
		alert("Message Script error : " + e);
	}

};

HIN.PatientRegistrationPage.prototype.processHandler = function(
		demographicsAndBackgroundProcessDefinition, messageObjects) {

	var processObjects = [];
	var messageId = patientRegistrationPage.appController.getComponent(
			"Context").getPatient();
	// alert("messageId : " + messageId)
	patientRegistrationPage.processDefinition.id = "";
	processObjects.push(patientRegistrationPage.processDefinition);

	demographicsAndBackgroundProcessDefinition.id = "";
	var messageObj = demographicsAndBackgroundProcessDefinition.insertMessage(
			"Step1", AppConstants.XPaths.Registrtion.MESSAGE_TYPE,
			messageObjects[0]);
	messageObj.setInitializeScriptExecuted(true);
	processObjects.push(demographicsAndBackgroundProcessDefinition);

	var profileProcessDefinition = patientRegistrationPage.appController
			.getComponent("DataLayer").getNewProcessDefinitionInstance(
					"Profile");
	profileProcessDefinition.id = "";
	var messageType = profileProcessDefinition.getStep("Step1")
			.getMessageTypeByType(AppConstants.XPaths.Registrtion.MESSAGE_TYPE);
	messageType.addMessage(messageObjects[0]);

	messageType = profileProcessDefinition
			.getStep("Step2")
			.getMessageTypeByType(AppConstants.XPaths.Role.PATIENT_MESSAGE_TYPE);
	messageType.addMessage(messageObjects[1]);

	messageType = profileProcessDefinition.getStep("Step3")
			.getMessageTypeByType(AppConstants.XPaths.Permission.MESSAGE_TYPE);
	messageType.addMessage(messageObjects[2]);
	processObjects.push(profileProcessDefinition);

	var parameters = [ messageObjects, processObjects ];
	patientRegistrationPage.appController.getComponent("DataLayer")
			.createOrUpdateTasks(parameters);

	patientRegistrationPage.newRegistration = false;
	patientRegistrationPage.appController.getComponent("Context")
			.setPatientRegistrationProcessDefinition(null);
};