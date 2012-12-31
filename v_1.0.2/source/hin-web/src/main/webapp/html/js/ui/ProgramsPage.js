var HIN;
if (!HIN)
	HIN = {};
HIN.ProgramsPage = function(appController, pageHolder) {
	programsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "programsPage";
	this.page = null;
	this.uiInstance = null;
	this.groupHeaderMap = null;
};

HIN.ProgramsPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.ProgramsPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ProgramsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.ProgramsPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("Measure addCompleteHandler : " + messageType);
	// alert("addCompleteHandler : " + XmlUtil.xmlToString(message.message));
	if (message.messageType == "POCD_MT000040UV_Program") {
		var programVo = null
		programVo = programsPage.appController.getComponent("Context")
				.getProgramVO();
		if (!programVo) {
			programVo = new HIN.ProgramVO();
			programsPage.appController.getComponent("Context").setProgramVO(
					programVo);
		}
		programVo.setMsg(message.msg);
		programVo.setMessage(message.message);
		programsPage.programSelection(message);
	}
};

HIN.ProgramsPage.prototype.programSelection = function(message) {
	this.appController.getComponent("DataLayer").loadAllConceptServices(
			"eternity_programs",
			function(data) {
				var conceptPrograms = [];
				for (i in data.json) {
					conceptPrograms.push([ data.json[i].name,
							data.json[i].description,
							data.json[i].conceptAttributes,
							data.json[i].smallIcon,
							data.json[i].shortName ]);
				}
				
				fragment = $('#inner-uiform-' + message.id).find('[nameType="shortName"]');
				$(conceptPrograms).each(function(i, value) {
					if (value != null) {
						$(fragment[i]).show();
						$(fragment[i]).attr("program", value[0]);
						$(fragment[i]).find('[nameType="name"]').html(value[1]);
						$(fragment[i]).find('[image="smallIcon"]').attr("src","data:image/jpg;base64," + value[3]);
					}
				});
				
				
				$('#inner-uiform-' + message.id).find('[nameType="shortName"]')
						.each(
								function(index, program) {
									if ($(program).attr("program")
											&& ($(program).attr(
													"program") == $(
													"#CDProgramsCode")
													.attr("value"))) {
										$(program)
												.find(
														".ui-cursor-point")
												.addClass(
														"program-highlight");
									}
								});
			});
};

HIN.ProgramsPage.prototype.removeCompleteHandler = function(messageType,
		message) {
	// alert("removeCompleteHandler");
};

HIN.ProgramsPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {

	// alert("lookupSelectionHandler");
};

HIN.ProgramsPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");

	var programVo = new HIN.ProgramVO();
	programVo.setMsg(message.msg);
	programVo.setMessage(message.msg.getXML());
	programsPage.appController.getComponent("Context").setProgramVO(programVo);

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
		programsPage.page.getMessageScript(dependendMessage, object,
				programsPage.fillData);
	}

};

HIN.ProgramsPage.prototype.fillData = function(messageTypeScript, object,
		dependendMessage) {
	var instance = object.instance;
	var message = object.message;
	messageTypeScript.fillData('programId', message.messageId);

	// alert("Message xml : " +
	// XmlUtil.xmlToString(dependendMessage.msg.getXML()));
	var processObjects = [ programsPage.processDefinition ];
	instance.processTask(processObjects);
};