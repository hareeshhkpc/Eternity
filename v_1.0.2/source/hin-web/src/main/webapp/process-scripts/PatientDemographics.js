var HIN;
if (!HIN)
	HIN = {};

HIN.PatientDemographics = function(appController) {
	this.appController = appController;
	this.context = this.appController.getComponent("Context");
	this.stepsQueueIndex = 0;
	this.steps = null;
	this.step = null;
	this.demographicsAndBackgroundProcessDefinition = this.appController
			.getComponent("DataLayer").createProcessDefinition(
					"DemographicsAndBackground");
	/*
	 * this.selectedStep = appController.getComponent("RenderingEngine")
	 * .getChildComponent("Form").selectedStep;
	 */
	this.subscriberId = -1;
	this.callback = null;
	HIN.PatientDemographics.instances = new HIN.HashMap();
	HIN.PatientDemographics.instances.put(-1, this);
	var searchVO = this.appController.getComponent("Context").getSearchVO();
	if (searchVO)
		this.patientId = searchVO.id;

};

HIN.PatientDemographics.prototype.loadProcessInstance = function(callback) {
	if (this.context.getUserVo()) {
		this.subscriberId = this.context.getUserVo().subscriberId;
		this.steps = this.demographicsAndBackgroundProcessDefinition.getSteps();
		this.callback = callback;
		this.loadSteps();
	}
};

HIN.PatientDemographics.prototype.loadSteps = function() {

	if (this.stepsQueueIndex < this.steps.length) {
		this.step = this.steps[this.stepsQueueIndex];
		this.stepsQueueIndex++;
		this.loadMessages(this.step);
	} else {
		// alert($.toJSON(this.demographicsAndBackgroundProcessDefinition));
		this.callback(this.demographicsAndBackgroundProcessDefinition);
	}
};

HIN.PatientDemographics.prototype.loadMessages = function(step) {
	// alert("StepName : " + step.stepName);
	var queryHashMap = new HIN.HashMap();
	var messageTypes = step.getMessageTypes();
	for ( var index = 0; index < messageTypes.length; index++) {
		var queryString = "";// subscriberId = " + this.subscriberId;
		queryHashMap.put(messageTypes[index].type, queryString);
	}

	/*
	 * for ( var mapIndex = 0; mapIndex < queryHashMap.length(); mapIndex++) {
	 * var map = queryHashMap.getItemAt(mapIndex); alert(map.key + " ," +
	 * map.value); }
	 */

	this.loadStepMessages(queryHashMap, step);
};

HIN.PatientDemographics.prototype.loadStepMessages = function(queryHashMap,
		step) {
	// alert("loadStepMessages : " + this.step);
	var patientDemographics = HIN.PatientDemographics.instances.get(-1).value;
	$.getJSON("/hin-web/rest/getMessageList", {
		patientId : this.patientId,
		conditionMap : $.toJSON(queryHashMap)
	}, function(data) {
		patientDemographics.fillStepMessages(data, step)
	});

};

HIN.PatientDemographics.prototype.fillStepMessages = function(data, step) {

	var patientDemographics = HIN.PatientDemographics.instances.get(-1).value;
	for ( var index = 0; index < data.length; index++) {
		var message = new HIN.Message();

		message.messageId = data[index].messageId;
		alert("messageId : " + message.messageId + " length : "
				+ message.messageId.length);
		if (message.messageId && message.messageId.length > 0) {

			message.messageStatus = data[index].messageStatus;
			message.messageType = data[index].messageType;
			message.id = idGenerator.getId();
		
			var messageTypes = step.getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				if (message.messageType == messageTypes[messageTypeIndex].type) {
					message.messageForm = messageTypes[messageTypeIndex].formHtml;
					message.messageTypeName = messageTypes[messageTypeIndex].typeName;
					// alert("fillStepMessages : " + message);
					messageTypes[messageTypeIndex].addMessage(message);
					break;
				}
			}
		}
	}
	var messageTypes = step.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messageType = messageTypes[messageTypeIndex];
		var typeNameMap = patientDemographics.step.typeNameMap;
		for ( var typeNameMapIndex = 0; typeNameMapIndex < typeNameMap.length(); typeNameMapIndex++) {
			var map = typeNameMap.getItemAt(typeNameMapIndex);
			if (map.key == messageType.typeName) {
				var messageTypeName = new HIN.MessageTypeName();
				messageTypeName.state = messageType.state;
				messageTypeName.type = messageType.type;
				messageTypeName.typeName = messageType.typeName;
				messageTypeName.formHtml = messageType.formHtml;
				messageTypeName.sortType = messageType.typeName;
				messageTypeName.messageType = messageType;
				messageTypeName.title = messageType.title;
				messageTypeName.processName = patientDemographics.demographicsAndBackgroundProcessDefinition.processName;
				messageTypeName.stepName = patientDemographics.step.stepName;

				step.addMessageTypeName(messageTypeName);
				break;

			}
		}
	}

	var stepName = patientDemographics.appController.getComponent(
			"RenderingEngine").getChildComponent("Form").selectedStep.stepName;
	if (stepName == step.stepName) {
		patientDemographics.appController.getComponent("RenderingEngine")
				.getChildComponent("Form").selectedStep = step;
	}

	patientDemographics.loadSteps();

};
