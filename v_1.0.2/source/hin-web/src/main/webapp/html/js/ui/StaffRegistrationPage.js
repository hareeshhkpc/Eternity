var HIN;
if (!HIN)
	HIN = {};
HIN.StaffRegistrationPage = function(appController, pageHolder) {
	staffRegistrationPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "staffRegistrationPage";// pageHolder;
	this.uiInstance = null;
	this.page = null;
	this.roleMessageTypeScript = null;
	this.newRegistration = true;
};

HIN.StaffRegistrationPage.prototype.init = function(callback, page) {
	this.page = page;

	if (callback) {
		callback(page);
	}/*
		 * if (staffRegistrationPage.processDefinition.initializeScript &&
		 * !staffRegistrationPage.processDefinition.initializeScriptExecuted) {
		 * staffRegistrationPage.processDefinition.initializeScriptExecuted =
		 * true; var processScript = new ProcessScript('StaffRegistration',
		 * staffRegistrationPage.processDefinition,
		 * staffRegistrationPage.appController, idGenerator);
		 * staffRegistrationPage.appController.getComponent("RenderingEngine")
		 * .showPageLoading( staffRegistrationPage.processDefinition.processName + "
		 * script processing");
		 * 
		 * processScript
		 * .loadScript(staffRegistrationPage.processDefinition.initializeScript);
		 * processScript.initialize(); processScript.stepOpen('Step2',
		 * function() { alert("Step2 is open"); var messageTypeObjects =
		 * staffRegistrationPage.selectedStep .getMessageTypes();
		 * page.addMessageTypes(page, messageTypeObjects);
		 * 
		 * staffRegistrationPage.appController.getComponent("RenderingEngine")
		 * .hidePageLoading();
		 * 
		 * if (callback) callback(page); }); } else if (callback) {
		 * callback(page); }
		 */
}

HIN.StaffRegistrationPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("StaffRegistrationPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;

	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.StaffRegistrationPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.StaffRegistrationPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	// alert("addCompleteHandler");
	appController.getComponent("Context").setStaff(message.messageId);
	var id = staffRegistrationPage.processDefinition.id;
	if (id == null || id.length == 0)
		addNew = true

	if (addNew) {
		// Create Default Role

		staffRegistrationPage.page
				.createMessage(
						"ROLE_EMPLOYEE",
						null,
						message,
						null,
						function(newMessage, conceptLookup, message) {
							var object = new Object();
							object.message = message;
							staffRegistrationPage.page
									.getMessageScript(
											newMessage,
											object,
											function(messageTypeScript, object,
													newMessage) {
												var message = object.message;
												var messageType = staffRegistrationPage.processDefinition
														.getStep("Step2")
														.getMessageTypeByType(
																"ROLE_EMPLOYEE");

												var title = message.title;
												if (!title)
													title = messageType.title;
												if (!newMessage.title)
													newMessage.title = title;
												var roleTitle = title;
												/* alert("title : " + title); */
												messageTypeScript.initialize();
												staffRegistrationPage.roleMessageTypeScript = messageTypeScript;
												/*
												 * messageTypeScript.fillData("messageTitle",
												 * title)
												 */

												messageType
														.addMessage(newMessage)
												this.appController
														.getComponent("Context")
														.setRoleId(
																newMessage.messageId);
												// Create Default Permission

												staffRegistrationPage.page
														.createMessage(
																"ROLE_PERMISSION",
																null,
																message,
																null,
																function(
																		newMessage,
																		conceptLookup,
																		message) {
																	var object = new Object();
																	object.message = message;
																	staffRegistrationPage.page
																			.getMessageScript(
																					newMessage,
																					object,
																					function(
																							messageTypeScript,
																							object,
																							newMessage) {
																						var message = object.message;
																						var messageType = staffRegistrationPage.processDefinition
																								.getStep(
																										"Step3")
																								.getMessageTypeByType(
																										"ROLE_PERMISSION");
																						var title = message.title;
																						if (!title)
																							title = roleTitle
																									+ " Permission";
																						if (!newMessage.title)
																							newMessage.title = title;
																						/*
																						 * alert("title : " +
																						 * title);
																						 */
																						messageTypeScript
																								.initialize();
																						messageTypeScript
																								.fillData(
																										"messageTitle",
																										title)

																						messageType
																								.addMessage(newMessage)

																					});
																}, null);

											});
						}, null);

		/*
		 * this.appController.getComponent("Context").setRoleId(message.messageId);
		 * rolesPage.page.createMessage("ROLE_PERMISSION", null, message, null,
		 * rolesPage.messageCreationComplete, null);
		 */
	}
};

HIN.StaffRegistrationPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.StaffRegistrationPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.StaffRegistrationPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	$('#inner-uiform-' + message.id).find("#staffRegistrationForm")
			.validationEngine('attach', {
				isOverflown : true,
				autoHidePrompt : true,
				autoHideDelay : 5000
			});
	if ($('#inner-uiform-' + message.id).find('#staffRegistrationForm')
			.validationEngine('validate')) {
		staffRegistrationPage.uiInstance = instance;
		if (staffRegistrationPage.processDefinition.id != null
				&& staffRegistrationPage.processDefinition.id.length > 0) {
			var processObjects = [ staffRegistrationPage.processDefinition ];
			instance.processTask(processObjects);
		} else {
			staffRegistrationPage.saveProfile();

		}
	}
	$('#inner-uiform-' + message.id).find('.formError').css("margin-top",
			"-60px");
	$('#inner-uiform-' + message.id).find("#staffRegistrationForm")
			.validationEngine('detach');
};

HIN.StaffRegistrationPage.prototype.saveProfile = function() {
	try {

		var messageId = staffRegistrationPage.appController.getComponent(
				"Context").getStaff();
		if (messageId) {
			var messageXml = staffRegistrationPage.appController.getComponent(
					"DataLayer").getMessageXml(messageId);
			/*
			 * staffRegistrationPage.appController.getComponent("Context")
			 * .deleteFromContext();
			 * staffRegistrationPage.appController.getComponent("Context")
			 * .addInContext("registration", messageXml);
			 */
			var staffVo = staffRegistrationPage.appController.getComponent(
					"Context").setStaffVo(staffVo);
			if (!staffVo)
				staffVo = new HIN.StaffVO();
			staffVo.setMessage(messageXml);
			staffRegistrationPage.appController.getComponent("Context")
					.setStaffVo(staffVo);
			staffRegistrationPage.appController.getComponent("RenderingEngine")
					.setLeftHeaderInfo(staffVo.givenName);
		}

		// Assigning staff details to Role.
		if (staffRegistrationPage.roleMessageTypeScript) {
			staffRegistrationPage.roleMessageTypeScript.initialize();
		}

		var messageObjects = [];
		var steps = staffRegistrationPage.processDefinition.getSteps();
		for ( var stepIndex = 0; stepIndex < steps.length; stepIndex++) {
			var step = steps[stepIndex];
			var messageTypes = step.getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messages = messageTypes[messageTypeIndex].getMessages();
				for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
					var message = messages[messageIndex];
					if (message.status == AppConstants.Status.ACTIVE) {
						messageObjects.push(messages[messageIndex]);
						// alert(messages[messageIndex]);
					}
					message.deletable = true;
				}
			}
		}

		staffRegistrationPage.processDefinition.id = "";

		var processObjects = [];
		
		staffRegistrationPage.appController.getComponent("DataLayer").validateUser(staffVo.userName, function(data) {
			if(!data){
				staffRegistrationPage.processHandler(
						staffRegistrationPage.appController.getComponent("DataLayer")
								.getNewProcessDefinitionInstance(
										"Profile"), messageObjects);
				
				/*processObjects.push(staffRegistrationPage.processDefinition);
				var parameters = [ messageObjects, processObjects ];
				staffRegistrationPage.appController.getComponent("DataLayer")
						.createOrUpdateTasks(parameters);*/
			} else {
				staffRegistrationPage.appController.getComponent("RenderingEngine").openPromptModalDialog(
						"User Name already exists. Please use another User Name",
						function() {
						});
			}
		});

	} catch (e) {
		alert("Message Script error : " + e);
	}
};

HIN.StaffRegistrationPage.prototype.processHandler = function(
		profileProcessDefinition, messageObjects) {

	var processObjects = [];
	var messageId = staffRegistrationPage.appController.getComponent(
			"Context").getStaff();
	/* alert("messageId : " + messageId)*/
	staffRegistrationPage.processDefinition.id = "";
	processObjects.push(staffRegistrationPage.processDefinition);

	profileProcessDefinition.id = "";
	profileProcessDefinition.insertMessage("Step1",
			"PRPA_MT201000HT03", messageObjects[0]);
	processObjects.push(profileProcessDefinition);

	var parameters = [ messageObjects, processObjects ];
	staffRegistrationPage.appController.getComponent("DataLayer")
			.createOrUpdateTasks(parameters);

	staffRegistrationPage.newRegistration = false;
	staffRegistrationPage.appController.getComponent("Context")
			.setStaffRegistrationProcessDefinition(null);
};