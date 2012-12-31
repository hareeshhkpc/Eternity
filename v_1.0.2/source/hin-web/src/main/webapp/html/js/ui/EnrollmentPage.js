var HIN;
if (!HIN)
	HIN = {};
/**
 * EnrollmentPage is sub class of page which is the entry point of the step,
 * which knows the current process definition, selected step etc.
 */
HIN.EnrollmentPage = function(appController, pageHolder) {
	enrollmentPage = this;
	this.appController = appController;
	/**
	 * processDefinition holds the current selected process definition. Its an
	 * object of processdefinition.
	 */
	this.processDefinition = null;
	this.messageTypes = [];
	/**
	 * selectedStep holds the current selected step. Its an object of step
	 */
	this.selectedStep = null;
	this.pageHolder = "enrollmentPage";// pageHolder;
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.uiInstances = null;
	this.page = null;
	this.callback = null;
	this.processScript = null;
};
/**
 * init method will trigger from base class.Here in init method have the
 * following business logic. It retrieves the relevant data from the context and
 * it loads and execute the initialize script as per the process definition
 * using the process script API. The callback will be triggered from process
 * script API and execute the business or ui logic which is implemented.
 * 
 * @param callback :
 *            Its a function which will be called after the init.
 * @param page :
 *            Its an object of page.
 * @returns {void}
 */
HIN.EnrollmentPage.prototype.init = function(callback, page) {
	// alert("page");
	this.page = page;
	this.callback = callback;

	var programVo = enrollmentPage.appController.getComponent("Context")
			.getProgramVO(programVo);

	var patientVO = enrollmentPage.appController.getComponent("Context")
			.getPatientVO();

	var organizationVO = enrollmentPage.appController.getComponent("Context")
			.getOrganizationVO();

	// alert("patientVO:"+patientVO);

	// alert("init : " + programVo);
	if (this.selectedStep.getMessageTypes().length > 3) {
		if (enrollmentPage.callback)
			enrollmentPage.callback(enrollmentPage.page);
	} else {

		if (!programVo) {
			if (enrollmentPage.callback)
				enrollmentPage.callback(enrollmentPage.page);
		} else if (!enrollmentPage.processScript
				|| !enrollmentPage.processScript.executed) {

			// alert("code : " + programVo.code);

			enrollmentPage.processScript = new ProcessScript(
					'DemographicsAndBackground',
					enrollmentPage.processDefinition,
					enrollmentPage.appController, idGenerator);
			enrollmentPage.processScript.parameter.programCode = programVo.code;
			enrollmentPage.processScript.parameter.gender = patientVO.gender;
			enrollmentPage.processScript.parameter.regionCode = organizationVO.regionCode;
			enrollmentPage.appController.getComponent("RenderingEngine")
					.showPageLoading(programVo.code + " loading");
			enrollmentPage.appController.getComponent("RenderingEngine")
					.openModalDialog(programVo.code + " loading");
			enrollmentPage.appController.getComponent("RenderingEngine")
					.openModalDialog(organizationVO.country + " loading");

			enrollmentPage.processScript
					.loadScript(enrollmentPage.processDefinition.initializeScript);
			enrollmentPage.processScript.initialize();
			enrollmentPage.processScript
					.stepOpen(
							'Step5',
							function() {
								// alert("Step 5 is open");
								var messageTypeObjects = enrollmentPage.selectedStep
										.getMessageTypes();
								enrollmentPage.page
										.addMessageTypes(enrollmentPage.page,
												messageTypeObjects);

								for ( var index = 0; index < messageTypeObjects.length; index++) {
									var msgTypeObj = messageTypeObjects[index];
									msgTypeObj.state = 1;

									if (msgTypeObj.type == "FIAB_MT020000HT02") {
										// alert(msgTypeObj.type);
										var messages = msgTypeObj.getMessages();
										for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
											messages[messageIndex].messageTypeCompeletionTempStatus = 1;
											if (messages[messageIndex].financeType == AppConstants.XPaths.Finance.COST) {
												messages[messageIndex].formView = false;
											}
										}

									}

									if (msgTypeObj.type == "POCD_MT000040UV_ClientReportView"
											|| msgTypeObj.type == "POCD_MT000040UV_ResultsView"
											|| msgTypeObj.type == "POCD_MT000040UV_PhComm_IN"
											|| msgTypeObj.type == "POCD_MT000040UV_PhComm_NU") {
										msgTypeObj.headerView = false;
										var messages = msgTypeObj.getMessages();
										// alert("Enroll length : " +
										// messages.length);
										if (messages.length == 1) {
											// alert(messages[0]);
											messages[0].formView = false;
										}
									}
								}

								enrollmentPage.appController.getComponent(
										"RenderingEngine").hidePageLoading();
								enrollmentPage.appController.getComponent(
										"RenderingEngine").closeModalDialog();
								/*
								 * enrollmentPage.appController.getComponent("Context")
								 * .setChosenProgram(null);
								 */
								enrollmentPage.processScript.executed = true;
								if (enrollmentPage.callback)
									enrollmentPage
											.callback(enrollmentPage.page);
							});
		} else {
			if (enrollmentPage.callback)
				enrollmentPage.callback(enrollmentPage.page);
		}
	}
};
HIN.EnrollmentPage.prototype.loadedProgramMessage = function(messageId, msg,
		message) {

	if (msg
			&& (!enrollmentPage.processScript || !enrollmentPage.processScript.executed)) {
		enrollmentPage.processScript = new ProcessScript(
				'DemographicsAndBackground', enrollmentPage.processDefinition,
				enrollmentPage.appController, idGenerator);
		enrollmentPage.appController.getComponent("RenderingEngine")
				.showPageLoading(
						enrollmentPage.processDefinition.processName
								+ " script processing");
		enrollmentPage.processScript
				.loadScript(enrollmentPage.processDefinition.initializeScript);
		enrollmentPage.processScript.initialize();
		enrollmentPage.processScript
				.stepOpen(
						'Step5',
						function() {
							// alert("Step 5 is open");
							var messageTypeObjects = enrollmentPage.selectedStep
									.getMessageTypes();
							enrollmentPage.page.addMessageTypes(
									enrollmentPage.page, messageTypeObjects);

							for ( var index = 0; index < messageTypeObjects.length; index++) {
								var msgTypeObj = messageTypeObjects[index];
								msgTypeObj.state = 1;

								if (msgTypeObj.type == "FIAB_MT020000HT02") {
									// alert(msgTypeObj.type);
									var messages = msgTypeObj.getMessages();
									for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
										messages[messageIndex].messageTypeCompeletionTempStatus = 1;
										if (messages[messageIndex].financeType == AppConstants.XPaths.Finance.COST) {
											messages[messageIndex].formView = false;
										}
										messages[messageIndex].readOnly = true;
									}

								}
								// alert(msgTypeObj.type);
								if (msgTypeObj.type == "POCD_MT000040UV_ClientReportView"
										|| msgTypeObj.type == "POCD_MT000040UV_ResultsView"
										|| msgTypeObj.type == "POCD_MT000040UV_PhComm_IN"
										|| msgTypeObj.type == "POCD_MT000040UV_PhComm_NU") {
									msgTypeObj.headerView = false;
									var messages = msgTypeObj.getMessages();
									// alert("length : " + messages.length);
									if (messages.length == 1) {
										// alert(messages[0]);
										messages[0].formView = false;
									}
								}
							}

							enrollmentPage.appController.getComponent(
									"RenderingEngine").hidePageLoading();

							enrollmentPage.processScript.executed = true;
							if (enrollmentPage.callback)
								enrollmentPage.callback(enrollmentPage.page);
						});
	} else {
		if (enrollmentPage.callback)
			enrollmentPage.callback(enrollmentPage.page);
	}

};

/**
 * pageBeforeLoad method will trigger from the base class and customize the code
 * as per the business logic.
 * 
 * @param messageType :
 *            Its an object of messageType.
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.EnrollmentPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	/*
	 * alert("EnrollmentPage pageBeforeLoad : " + uiGenerator + " : " +
	 * messageType.type);
	 */
	// alert(messageType.category + " : " + messageType.typeName);
	uiGenerator.singleButton = true;
	uiGenerator.formRender = false;
	uiGenerator.formExpandable = false;
	if (messageType.type == "PRPA_MT410001HT02"
			|| messageType.type == "FIAB_MT020000HT02") {
		uiGenerator.lookup = false;
		uiGenerator.formExpandable = true;
		if (messageType.type == "FIAB_MT020000HT02") {
			var messages = messageType.getMessages();
			for ( var index = 0; index < messages.length; index++) {
				if (messages[index].financeType == AppConstants.XPaths.Finance.COST) {
					messages[index].formView = false;
				}
				messages[index].readOnly = true;
			}
		}
	}
	uiGenerator.hideAddIcon();
	uiGenerator.hideRemoveIcon();
	/* alert(messageType.typeName); */
	if (messageType.type == "PRPA_MT410001HT02"
			|| messageType.typeName == "Diagnostic_Tests") {

		if (messageType.typeName == "Diagnostic_Tests") {
			var messageTypes = enrollmentPage.selectedStep.getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messages = messageTypes[messageTypeIndex].getMessages()
				for ( var index = 0; index < messages.length; index++) {
					messages[index].addNew = true;
				}
			}
		}
		uiGenerator.showRemoveIcon();
	}

	if (messageType.type == "POCD_MT000040UV_ClientReportView"
			|| messageType.type == "POCD_MT000040UV_ResultsView"
			|| messageType.type == "POCD_MT000040UV_PhComm_IN"
			|| messageType.type == "POCD_MT000040UV_PhComm_NU") {
		messageType.headerView = false;

	}

	/*
	 * if (messageType.type == "POCD_MT000040UV_AWARENESS_QUESTIONNAIRE" ||
	 * messageType.type == "POCD_MT000040UV_CULTURE_QUESTIONNAIRE" ||
	 * messageType.type == "POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE" ||
	 * messageType.type == "POCD_MT000040UV_ENVIRONMENT_QUESTIONNAIRE") {
	 * uiGenerator.category = "Questionnaire"; }
	 */

	if (messageType.type == "FIAB_MT020000HT02") {
		messageType.title = "Fees";
		uiGenerator.formRender = true;
		uiGenerator.tableFormat = true;
		uiGenerator.tableHeaders = enrollmentPage.getServiceTableHeader();
	}

	/*
	 * if (uiGenerator.formExpandable && messageType.type ==
	 * "POLB_MT004000HT01_BloodTest") { var page =
	 * appController.getComponent("RenderingEngine")
	 * .getChildComponent("Form").getPage(); if
	 * (!enrollmentPage.page.bloodLookUp) { enrollmentPage.page.bloodLookUp =
	 * true; enrollmentPage.page.appController.getComponent("DataLayer")
	 * .loadAllConceptServices("Blood Tests",
	 * enrollmentPage.page.bloodTestLookUpHandler, null); } }
	 */

};
/**
 * addCompleteHandler method will trigger from the UI form.E.g. Add a new form
 * by clicking on the add icon from the UI or load an existing form and it will
 * differentiate by the property addNew, true means newly added.
 * 
 * @param uiGenerator :
 *            Its an object of uiGenerator.
 * @returns {void}
 */
HIN.EnrollmentPage.prototype.addInitialHandler = function(uiGenerator) {
	/*
	 * if (messageType.type == "PRPA_MT410001HT02" || messageType.type ==
	 * "FIAB_MT020000HT02") { uiGenerator.formExpandable = true; }
	 */
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

HIN.EnrollmentPage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {
	uiGenerator.singleButton = true;
	/*
	 * alert("addCompleteHandler " + messageType + " , Finished : " +
	 * message.finished);
	 */
	selectedStep = this.appController.getComponent("RenderingEngine")
			.getChildComponent("Form").selectedStep;
	var selectedId = 'child_' + selectedStep.stepName + '_form';
	$("#" + selectedId).after(
			'<div id="calendarPage" style="display: none"></div>');
	$('#' + selectedId).find('[editorType="Calendar"]')
			.attr("page", selectedId);

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
HIN.EnrollmentPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

/*
 * HIN.EnrollmentPage.prototype.lookupSelectionHandler = function(instance,
 * conceptLookup, message) {
 * 
 * if (conceptLookup && !message.isFinanced()) { var className =
 * conceptLookup.getClassName(); var concept = conceptLookup.getName(); if
 * (className == "Service") {
 * enrollmentPage.page.createMessage("FIAB_MT020000HT02", conceptLookup,
 * message, enrollmentPage.messageCreationComplete); } } };
 */

/**
 * taskHandler method will trigger by clicking on the finish button from the UI.
 * Customize the code as per the business logic.
 * 
 * @param message :
 *            Its an object of message.
 * @param taskVO :
 *            Its an object of taskVO.
 * @param instance :
 *            Its an object of uigenerator.
 * @returns {void}
 * 
 */
HIN.EnrollmentPage.prototype.taskHandler = function(message, taskVO, instance) {

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	var messageObjects = [];
	var messageTypes = enrollmentPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.status == AppConstants.Status.ACTIVE) {
				page.initialize(message);
				page.fillParticipants(message);
				page.complete(message);
				messageObjects.push(message);
			}
		}
	}

	var programVo = enrollmentPage.appController.getComponent("Context")
			.getProgramVO(programVo);
	var chosenProgram = programVo.code;
	// alert(chosenProgram);
	enrollmentPage.processHandler(enrollmentPage.appController.getComponent(
			"DataLayer").getNewProcessDefinitionInstance(chosenProgram),
			messageObjects);
};

HIN.EnrollmentPage.prototype.processHandler = function(
		chosenProgramProcessDefinition, messageObjects) {

	// alert(chosenProgramProcessDefinition);

	var processObjects = [];
	processObjects.push(enrollmentPage.processDefinition);

	chosenProgramProcessDefinition.id = "";

	var programVo = enrollmentPage.appController.getComponent("Context")
			.getProgramVO(programVo);
	if (programVo) {
		var enrstep = enrollmentPage.processDefinition.getStep("Step5");
		if (enrstep) {
			var enrMessagTypes = enrstep.getMessageTypes();
			if (enrMessagTypes) {
				for ( var enrMessagTypeIndex = 0; enrMessagTypeIndex < enrMessagTypes.length; enrMessagTypeIndex++) {
					var enrMessageType = enrMessagTypes[enrMessagTypeIndex];
					// AgeManagementProgram
					// enrMessageType.state = 1;
					if (programVo.code == "AgeManagementProgram"
							|| programVo.code == "BHRTProgram") {
						if (enrMessageType.category == "Questionnaire") {
							enrollmentPage.updateProcessDefinition(
									chosenProgramProcessDefinition, "Step1",
									enrMessageType);
						} else if (enrMessageType.category == "Service") {
							if (enrMessageType.type == "POCD_MT000040UV_PhEx") {
								enrollmentPage.updateProcessDefinition(
										chosenProgramProcessDefinition,
										"Step3", enrMessageType);
							} else {
								enrollmentPage.updateProcessDefinition(
										chosenProgramProcessDefinition,
										"Step2", enrMessageType);
							}
						} else if (enrMessageType.category == "review"
								|| enrMessageType.category == "Consultation") {
							enrollmentPage.updateProcessDefinition(
									chosenProgramProcessDefinition, "Step4",
									enrMessageType);
						} else if (enrMessageType.category == "ClientReport") {
							enrollmentPage.updateProcessDefinition(
									chosenProgramProcessDefinition, "Step5",
									enrMessageType);
							enrollmentPage.updateProcessDefinition(
									chosenProgramProcessDefinition, "Step7",
									enrMessageType);
						}
					} else {
						alert("Unknown program :" + programVo.code);
					}

				}
			}
		}
	}
	// alert($.toJSON(chosenProgramProcessDefinition));

	processObjects.push(chosenProgramProcessDefinition);
	var parameters = [ messageObjects, processObjects ];
	enrollmentPage.appController.getComponent("DataLayer").createOrUpdateTasks(
			parameters);

};
/*
 * HIN.EnrollmentPage.prototype.messageCreationComplete = function(newMessage,
 * conceptLookup, message) { var messageType = newMessage.messageType; if
 * (conceptLookup && messageType == "FIAB_MT020000HT02") {
 * enrollmentPage.page.initialize(newMessage);
 * enrollmentPage.page.fillParticipants(newMessage);
 * enrollmentPage.page.fillFeeMessage(messageType, newMessage, conceptLookup,
 * enrollmentPage.loadDependendForm); } };
 * 
 * HIN.EnrollmentPage.prototype.loadDependendForm = function(message) { var
 * messageTypeObj = enrollmentPage.selectedStep
 * .getMessageTypeByType(message.messageType);
 * 
 * if (messageTypeObj) { // alert(XmlUtil.xmlToString(message.msg.getXML()));
 * message.title = messageTypeObj.title; messageTypeObj.addMessage(message) var
 * instanceId = enrollmentPage.groupHeaderMap
 * .get(messageTypeObj.typeName).value; var uiInstance =
 * enrollmentPage.uiInstances.get(instanceId).value; if (uiInstance) {
 * message.instanceId = uiInstance.instanceId; uiInstance.addMessage(message);
 * uiInstance.loadNewUIForms(); } } };
 */
HIN.EnrollmentPage.prototype.getServiceTableHeader = function() {
	var tableHeader = '<fieldset class="ui-grid-d ui-fee-accounting-box"> ';
	/*
	 * tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	 * tableHeader += 'style="width:3%"><input type="checkbox" data-role="none"
	 * id="chkhead" value="" /></div>';
	 */
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:16%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:30%">Service</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:31.3%">Consultant</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.1%">Amount</div> ';
	return tableHeader;
};

HIN.EnrollmentPage.prototype.getProductTableHeader = function() {
	var tableHeader = '<fieldset class="ui-grid-c ui-accounting-box"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="width:16%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-b ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:49.9%">Product</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.3%">Quality</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:14.2%">Amount</div> ';
	return tableHeader;
};

HIN.EnrollmentPage.prototype.updateProcessDefinition = function(
		chosenProgramProcessDefinition, stepName, enrMessageType) {
	var step = chosenProgramProcessDefinition.getStep(stepName);
	var messageTypes = step.getMessageTypes();
	var messageType = step.getMessageType(enrMessageType);
	if (!messageType) {
		messageType = factoryClass.createMessageType(enrMessageType.type,
				enrMessageType.typeName, enrMessageType.formHtml,
				enrMessageType.title);
		messageType.state = 2;
		step.addMessageType(messageType);
	}
	var messages = enrMessageType.getMessages();
	for ( var index = 0; index < messages.length; index++) {
		/*
		 * messages[index].finished = false; if (messages[index].taskVO)
		 * messages[index].taskVO.outCome = "";
		 */
		messages[index].newTask = true;
		// alert("newTask " + messages[index].newTask);

		messageType.addMessage(messages[index]);
	}
	return messageType;
};