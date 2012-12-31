var HIN;
if (!HIN)
	HIN = {};
HIN.SignUpPage = function(appController, pageHolder) {
	signUpPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "signUpPage";
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.uiInstance = null;
	this.page = null;
};

HIN.SignUpPage.prototype.init = function(callback, page) {
	this.page = page;
	// alert(page);
	if (signUpPage.processDefinition.initializeScript
			&& !signUpPage.processDefinition.initializeScriptExecuted) {
		signUpPage.processDefinition.initializeScriptExecuted = true;
		var processScript = new ProcessScript('SignUp',
				signUpPage.processDefinition, signUpPage.appController,
				idGenerator);
		signUpPage.appController.getComponent("RenderingEngine")
				.showPageLoading(
						signUpPage.processDefinition.processName
								+ " script processing");

		// alert(signUpPage.processDefinition.initializeScript);
		processScript.loadScript(signUpPage.processDefinition.initializeScript);
		processScript.initialize();
		processScript.stepOpen('Step1', function() {
			// alert("Step1 is open");
			var messageTypeObjects = signUpPage.selectedStep.getMessageTypes();
			page.addMessageTypes(page, messageTypeObjects);
			/*
			 * for ( var index = 0; index < messageTypeObjects.length; index++) {
			 * enrollmentPage.messageTypes.push(messageTypeObjects[index]); }
			 */
			signUpPage.appController.getComponent("RenderingEngine")
					.hidePageLoading();

			if (callback)
				callback(page);
		});
	} else {
		if (callback)
			callback(page);
	}

}

HIN.SignUpPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("SignUpPage pageBeforeLoad : " + messageType);
	signUpPage.appController.getComponent("Context").setSignUp(true)

	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.SignUpPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
}

HIN.SignUpPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	appController.getComponent("Context").setUser(message.messageId);
	// alert("addCompleteHandler");
};

HIN.SignUpPage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.SignUpPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.SignUpPage.prototype.taskHandler = function(message, taskVO, instance) {
	$("#signUpForm").validationEngine('attach', {
		isOverflown : true,
		autoHidePrompt : true,
		autoHideDelay : 5000
	});

	if ($('#signUpForm').validationEngine('validate')) {
		// signUpPage.saveSignUpProfile(message, taskVO, instance);
		signUpPage.uiInstance = instance;
		if (signUpPage.processDefinition.id != null
				&& signUpPage.processDefinition.id.length > 0) {
			var processObjects = [ signUpPage.processDefinition ];
			instance.processTask(processObjects);
		} else {
			signUpPage.saveSignUpProfile(message, taskVO, instance);

		}
	}

	$('.formError').css("margin-top", "-60px");
	$("#signUpForm").validationEngine('detach');
};

HIN.SignUpPage.prototype.saveSignUpProfile = function(message, taskVO, instance) {
	signUpPage.uiInstance = instance;

/*	var messages = signUpPage.processDefinition.getStep("Step1")
			.getMessageTypeByType("PRPA_MT201000HT03").getMessages();
	var subscriberId = "";*/
	try {
	/*	if (messages.length > 0) {
			subscriberId = messages[0].messageId;
			signUpPage.page.complete(messages[0]);
		}

		messages = signUpPage.processDefinition.getStep("Step1")
				.getMessageTypeByType("ROLE_USER").getMessages();
		var roleTitle = "";
		if (messages.length > 0) {
			var messageId = messages[0].messageId;
			var msg = messages[0].msg;

			signUpPage.appController.getComponent("DataLayer").messageMap.put(
					messageId, msg);

			signUpPage.page.initialize(messages[0]);
			signUpPage.page.fillParticipants(messages[0]);
			signUpPage.page.complete(messages[0]);
			var object = new Object();
			object.message = messages[0];
			signUpPage.page.getMessageScript(messages[0], object, function(
					messageTypeScript, object, newMessage) {
				var title = messages[0].title;
				roleTitle = title;
				messageTypeScript.fillData("messageTitle", title);
			});

		}

		messages = signUpPage.processDefinition.getStep("Step1")
				.getMessageTypeByType("ROLE_PERMISSION").getMessages();

		if (messages.length > 0) {
			var messageId = messages[0].messageId;
			var msg = signUpPage.appController.getComponent("DataLayer").messageMap
					.get(messageId).value;
			var messageId = messages[0].messageId;
			var msg = messages[0].msg;

			signUpPage.appController.getComponent("DataLayer").messageMap.put(
					messageId, msg);

			signUpPage.page.initialize(messages[0]);
			signUpPage.page.fillParticipants(messages[0]);
			signUpPage.page.complete(messages[0]);
			var object = new Object();
			object.message = messages[0];
			signUpPage.page.getMessageScript(messages[0], object, function(
					messageTypeScript, object, newMessage) {
				var title = messages[0].title;
				if (!title)
					title = roleTitle + " Permission";
				if (!newMessage.title)
					newMessage.title = title;
				messageTypeScript.fillData("messageTitle", title);
				messageTypeScript.fillData('userPermission');

			});

		}*/

		var regMessage = message;
		var messages = signUpPage.processDefinition.getStep("Step1")
				.getMessageTypeByType("ROLE_USER").getMessages();

		if (messages.length > 0) {
			var roleMessage = messages[0];
			signUpPage.page
					.getMessageScript(
							roleMessage,
							regMessage,
							function(messageTypeScript, regMessage, roleMessage) {
								messageTypeScript.fillData("SUBSCRIBER_ID",
										regMessage.messageId);

								messages = signUpPage.processDefinition
										.getStep("Step1").getMessageTypeByType(
												"ROLE_PERMISSION")
										.getMessages();

								if (messages.length > 0) {
									var permissionMessage = messages[0];
									signUpPage.page
											.getMessageScript(
													permissionMessage,
													regMessage,
													function(messageTypeScript,
															regMessage,
															permissionMessage) {
														messageTypeScript
																.fillData(
																		"SUBSCRIBER_ID",
																		regMessage.messageId);
														var messageObjects = [];
														var messageTypes = signUpPage.selectedStep
																.getMessageTypes();
														for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
															var messages = messageTypes[messageTypeIndex]
																	.getMessages();
															for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
																var message = messages[messageIndex];
																if (message.status == AppConstants.Status.ACTIVE) {
																	messageObjects
																			.push(messages[messageIndex]);
																	// alert(messages[messageIndex]);
																}
															}
														}
														
														signUpPage
																.processHandler(
																		signUpPage.appController
																				.getComponent(
																						"DataLayer")
																				.getNewProcessDefinitionInstance(
																						"Profile"),
																		messageObjects);

													});
								}
							});

		}

	} catch (e) {
		alert("Message Script error : " + e);
	}

};

HIN.SignUpPage.prototype.processHandler = function(profileProcessDefinition,
		messageObjects) {
	var processObjects = [];

	var messageId = signUpPage.appController.getComponent("Context").getUser();
	var userVo = new HIN.UserVO();
	userVo.subscriberId = messageId;
	appController.getComponent("Context").setUserVo(userVo);
	signUpPage.processDefinition.id = "";

	processObjects.push(signUpPage.processDefinition);

	profileProcessDefinition.id = "";
	/*
	 * profileProcessDefinition.insertMessage("Step1", "PRPA_MT201000HT03",
	 * messageId);
	 */
	
	message = null;
	var roleMessageId = 0;
	var permissionId = 0;
	for ( var messageIndex = 0; messageIndex < messageObjects.length; messageIndex++) {
		message = messageObjects[messageIndex];
		if (message.messageType == "PRPA_MT201000HT03") {
			profileProcessDefinition.insertMessage("Step1",
					"PRPA_MT201000HT03", message);
			userVo.setMsg(message);
			userVo.setMessage(message.message);
			
		} else if (message.messageType == "ROLE_USER") {
			roleMessageId = message.messageId;
			profileProcessDefinition.insertMessage("Step2", "ROLE_USER",
					message);
		} else if (message.messageType == "ROLE_PERMISSION") {
			profileProcessDefinition.insertMessage("Step3", "ROLE_PERMISSION",
					message);
			permissionId = message.messageId;
		}
	}
	
	signUpPage.appController.getComponent("DataLayer").validateUser(userVo.userName, function(data) {
		if(!data){
			processObjects.push(profileProcessDefinition);
			var parameters = [ messageObjects, processObjects ];
			signUpPage.appController.getComponent("DataLayer").createOrUpdateTasks(
					parameters);
		} else {
			signUpPage.appController.getComponent("RenderingEngine").openPromptModalDialog(
					"User Name already exists. Please use another User Name",
					function() {
					});
		}
	});
	
	/*
	 * profileProcessDefinition.insertMessage("Step2", "ROLE_USER",
	 * roleMessageId); profileProcessDefinition.insertMessage("Step3",
	 * "ROLE_PERMISSION", permissionId);
	 */

	
};

HIN.SignUpPage.prototype.toString = function() {
	return " \r\n StepPage : [" + this.pageHolder + "]";
};
