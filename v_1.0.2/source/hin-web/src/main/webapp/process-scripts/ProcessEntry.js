var HIN;
if (!HIN)
	HIN = {};
/**
 * ProcessEntry is the entry point of dynamic process definition. Based on the
 * process definition it queries all the messages under the message type against
 * the step.
 */
HIN.ProcessEntry = function(appController, processName, callback) {
	this.appController = appController;
	this.context = this.appController.getComponent("Context");
	this.stepsQueueIndex = 0;
	/**
	 * steps holds steps of the processDefinition.
	 */
	this.steps = null;
	this.step = null;
	/**
	 * processDefinition holds dynamic processDefinition instance based on the
	 * processName.
	 */
	this.processDefinition = null;
	this.subscriberId = -1;
	/** processName holds which the name of process need to be created. */
	this.processName = processName;
	HIN.ProcessEntry.instances = new HIN.HashMap();
	HIN.ProcessEntry.instances.put(-1, this);
	/** patientId holds current selected patient id. */
	this.patientId = null;
	this.callback = callback;
	this.discountMessageMap = new HIN.HashMap();
};

HIN.ProcessEntry.prototype.processInitialization = function() {

};

/*
 * HIN.ProcessEntry.prototype.fetchProcessInstance = function() { //
 * alert("fetchProcessInstance"); this.appController.getComponent("DataLayer")
 * .getProcessDefinitionByProcessName(this.processName,
 * this.getProcessInstance); };
 */
/**
 * Provides the dynamically queried messages filled process definition instance
 * based on the process name.
 */
HIN.ProcessEntry.prototype.getProcessInstance = function() {

	this.processDefinition = this.appController.getComponent("DataLayer")
			.getNewProcessDefinitionInstance(this.processName);
	if (this.processDefinition) {
		this.loadProcessInstance();
	} else {
		alert(this.processName + " is not found");
	}
	/*
	 * if (processDefinition) { // alert("getProcessInstance" +
	 * processDefinition); processDefinition.id = ""; var processEntry =
	 * HIN.ProcessEntry.instances.get(-1).value; processEntry.processDefinition =
	 * processDefinition; processEntry.loadProcessInstance(); } else {
	 * alert(this.processName + " is not found"); }
	 */
};

HIN.ProcessEntry.prototype.loadProcessInstance = function() {
	if (this.context.getUserVo()) {
		this.subscriberId = this.context.getUserVo().subscriberId;

		var patientId = this.context.getPatient();
		this.patientId = patientId;

		this.steps = this.processDefinition.getSteps();
		this.loadSteps();
	} else if (this.processDefinition) {
		if (this.processDefinition.initializeScript) {
			// alert("TODO processDefinition.initializeScript");
		}
		this.callback(this.processDefinition);
	}
};

/**
 * Iterate the active steps and make the query against each step.
 */
HIN.ProcessEntry.prototype.loadSteps = function() {

	if (this.stepsQueueIndex < this.steps.length) {
		this.step = this.steps[this.stepsQueueIndex];
		this.stepsQueueIndex++;

		if (this.step.status == "ACTIVE"
				&& (this.processDefinition.processName == "Accounts"
						|| this.processDefinition.processName == "Appointments" || this.processDefinition.processName == "LicenseeAccounts" || this.processDefinition.processName == "Relations")) {
			this.createQueries(this.step);
		} else {
			this.loadSteps();
		}
	} else {
		// alert($.toJSON(this.processDefinition));
		this.callback(this.processDefinition);
	}
};

/**
 * As per the process definition it create queries and load the messages.
 */
HIN.ProcessEntry.prototype.createQueries = function(step) {
	// alert("StepName : " + step.stepName);
	var query = new HIN.Query();
	query.id = this.patientId;
	var queryHashMap = new HIN.HashMap();
	var messageTypes = step.getMessageTypes();
	for ( var index = 0; index < messageTypes.length; index++) {
		var queryString = "";// subscriberId = " + this.subscriberId;
		if (messageTypes[index].queryString) {
			if (this.processDefinition.processName == "LicenseeAccounts") {
				var orgId = appController.getComponent("Context")
						.getSelectedOrganizationVO().subscriberId;
				queryString = messageTypes[index].queryString
						+ " +organizationId:" + orgId;
			} else {
				queryString = messageTypes[index].queryString
						+ " +subscriberId:" + this.patientId;
			}
		}
		// query.addCondition(messageTypes[index].type, queryString);
		if (messageTypes[index].status == AppConstants.Status.ACTIVE) {
			queryHashMap.put(messageTypes[index].type, queryString);
		}

		if (this.processDefinition.processName == "Accounts") {
			if (step.stepName == "Step1") {
				// alert("Accounts Step 1");
			} else if (step.stepName == "Step2") {
				// alert("Accounts Step 2");
			} else if (step.stepName == "Step3") {
				// alert("Accounts Step 3");
			}
		}

	}
	this.loadStepMessages(queryHashMap, step);
};

/**
 * Query the all messages using datalayer API.
 */
HIN.ProcessEntry.prototype.loadStepMessages = function(queryHashMap, step) {

	var patientId = "";
	if (this.patientId) {
		patientId = this.patientId;
	}
	// alert("loadStepMessages : " + patientId);

	/* var query = $.toJSON(queryHashMap); */
	// alert(query);
	var messageRequired = false;
	var processEntry = HIN.ProcessEntry.instances.get(-1).value;
	if (processEntry.processDefinition.processName == "Accounts"
			|| processEntry.processDefinition.processName == "LicenseeAccounts") {
		messageRequired = true;
		
		this.appController.getComponent("DataLayer").getMessages(patientId,
				queryHashMap, function(data) {
					processEntry.fillStepMessages(data, step)
				}, messageRequired);
		
	}else if(processEntry.processDefinition.processName == "Relations"){
		var startDate = new Date();
		startDate.setHours(00,00,00);
		var endDate = new Date();
		endDate.setDate(endDate.getDate() + 7);
		
		var conditionMap = new HIN.HashMap();
		var queryString = " +(subscriberId:" + patientId + ")";
		//alert("1: " + startDate.getTime() + " 2: " + endDate.getTime())
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/messageSearchWithCondtion";
		searchVO.id = patientId;
		searchVO.max = 100;
		searchVO.filterColumn = "effectiveTimeTo";
		searchVO.fromDate = startDate.getTime();
		searchVO.toDate = endDate.getTime();
		searchVO.queryString = queryString;
		searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;

		appController.getComponent("DataLayer").fetchLuceneMessages(searchVO,
				conditionMap, function(data){
			processEntry.fillStepMessages(data, step)
		});
	}
	else{
		this.appController.getComponent("DataLayer").getMessages(patientId,
				queryHashMap, function(data) {
					processEntry.fillStepMessages(data, step)
				}, messageRequired);
	}
	
	/*
	 * $.getJSON("/hin-web/rest/getMessageList", { patientId : patientId,
	 * conditionMap : query, messageRequired : false }, function(data) {
	 * processEntry.fillStepMessages(data, step) });
	 */

};

/**
 * Queried messages to be filled to the corresponding step based on the process
 * definition.
 */
HIN.ProcessEntry.prototype.fillStepMessages = function(data, step) {

	var processEntry = HIN.ProcessEntry.instances.get(-1).value;

	if (processEntry.processDefinition.processName == "Accounts") {
		// processEntry.customRender(data, step);
	}

	if (data) {
		// alert(step.stepName + " : " + data.length)
		for ( var index = 0; index < data.length; index++) {
			var message = new HIN.Message();

			message.messageId = data[index].messageId;

			/*
			 * alert("messageId : " + message.messageId + " length : " +
			 * message.length);
			 */

			if (message.messageId && message.messageId.length > 0) {

				message.messageStatus = data[index].messageStatus;
				message.messageType = data[index].messageType;
				message.transactionType = data[index].transactionType;
				message.transactionStatus = data[index].transactionStatus;
				message.id = idGenerator.getId();
				message.finished = data[index].finished;// true;
				message.message = data[index].message;// true;
				/*
				 * alert(message.messageId + " : " + message.transactionType + " : " +
				 * message.transactionStatus);
				 */

				

				var messageTypes = step.getMessageTypes();

				for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
					var messageType = messageTypes[messageTypeIndex];
					message.messageForm = messageType.formHtml;
					message.messageTypeName = messageType.typeName;
					message.title = messageType.title;

					if (message.messageType == messageType.type) {
						// alert(messageType.typeName);
						if (processEntry.processDefinition.processName == "Accounts") {
							if (message.transactionType == "DISCOUNT") {
								if (step.stepName == "Step4") {
									message.formView = false;
								}
								processEntry.addToDisountMessageMap(message);

							}

							if (messageType.getMessages().length > 0
									&& messageType.typeName
											.indexOf("UnpaidInvoice") > -1) {
								continue;
							}
						}

						if (messageType.transactionType) {
							if (message.transactionType == messageType.transactionType) {
								if (!messageType.isMessageExist(message))
									messageType.addMessage(message);
								break;
							}

						} else {
							if (!messageType.isMessageExist(message))
								messageType.addMessage(message);
							break;
						}
					}
				}
			}
		}
		if (processEntry.processDefinition.processName == "Accounts") {
			processEntry.addDisountMessages(step);
		}

	}
	var messageTypes = step.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messageType = messageTypes[messageTypeIndex]
		var count = messageType.getMessages().length;
		if (count > 0) {
			// alert(messageType.title + " : " + count);
			step.addMessageGroup(messageType, count);
		}
	}
	if (step.initializeScript) {
		// alert("TODO : step.initializeScript");
	}
	processEntry.loadSteps();

};
/*
HIN.ProcessEntry.prototype.customRender = function(data, step) {
	var processEntry = HIN.ProcessEntry.instances.get(-1).value;
	if (data) {
		var messageTypeObjects = [];
		// alert(step.stepName + " : " + data.length)
		var count = 0;
		for ( var index = 0; index < data.length; index++) {
			var message = new HIN.Message();

			message.messageId = data[index].messageId;

			if (message.messageId && message.messageId.length > 0) {

				message.messageStatus = data[index].messageStatus;
				message.messageType = data[index].messageType;
				message.transactionType = data[index].transactionType;
				message.transactionStatus = data[index].transactionStatus;
				message.id = idGenerator.getId();
				message.finished = data[index].finished;// true;
				message.message = data[index].message;// true;
				var messageTypes = step.getMessageTypes();

				if (processEntry.processDefinition.processName == "Accounts") {
					if (step.stepName == "Step1") {
						alert(message)
						alert(message.messageId + " : " + message.messageStatus
								+ " : " + message.transactionType + ":"
								+ message.transactionStatus);
					}
				}

				for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
					var messageType = messageTypes[messageTypeIndex];
					if (processEntry.processDefinition.processName == "Accounts") {
						if (step.stepName == "Step2"
								&& messageType.typeName == "UnpaidInvoice"
								&& message.transactionType == AppConstants.TransactionType.INVOICE) {
							count++;

							
							 * alert("Step 2 : " + messageType.typeName + " : " +
							 * message.transactionType);
							 
							if (count > 0) {
								messageType.status = AppConstants.Status.INACTIVE;
								var messageTypeObj = factoryClass
										.createMessageType(messageType.type,
												"UnpaidInvoice-No-" + (count),
												messageType.formHtml,
												messageType.title);
								messageTypeObj.transactionType = messageType.transactionType;
								// step.addMessageType(messageTypeObj);
								// alert(messageTypeObj.transactionType);
								messageTypeObjects.push(messageTypeObj);
							}

						}
					}
				}
			}
		}
		if (processEntry.processDefinition.processName == "Accounts") {
			if (step.stepName == "Step2") {
				var messageTypeObj = step.removeMessageType("UnpaidInvoice");
				messageTypeObj = step.removeMessageType("Accounthistory");
				messageTypeObjects.push(messageTypeObj);
			}

			for ( var index = 0; index < messageTypeObjects.length; index++) {
				step.addMessageType(messageTypeObjects[index]);
			}
		}
	}
};
*/
HIN.ProcessEntry.prototype.getInvoiceID = function(message) {
	// alert((message.message));
	// alert("Message xml : " + XmlUtil.xmlToString(message.message));
	var msg = XmlUtil.stringToXml(message.message);
	var extension = XmlUtil.getXPathResult(msg,
			"//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
			XPathResult.STRING_TYPE);
	if (extension)
		return extension.stringValue;
	return 0;

};

HIN.ProcessEntry.prototype.addToDisountMessageMap = function(message) {
	var processEntry = HIN.ProcessEntry.instances.get(-1).value;
	var invoiceId = processEntry.getInvoiceID(message);
	var map = processEntry.discountMessageMap.get(invoiceId);
	var messages = [];
	var exist = false;
	if (map && map.value) {
		messages = map.value;
		for ( var index = 0; index < messages.length; index++) {
			if (messages[index].messageId == message.messageId) {
				exist = true;
				break;
			}
		}
		if (exist == false) {
			messages.push(message);
		}

	} else {
		messages.push(message);
		processEntry.discountMessageMap.put(invoiceId, messages)
	}

	// alert(invoiceId);
	// processEntry.addDisountMessage(step, invoiceId, message);
}

HIN.ProcessEntry.prototype.addDisountMessages = function(step) {

	var processEntry = HIN.ProcessEntry.instances.get(-1).value;

	for ( var index = 0; index < processEntry.discountMessageMap.length(); index++) {
		var map = processEntry.discountMessageMap.getItemAt(index);
		if (map && map.value) {
			var invoiceId = map.key;
			var messageType = processEntry.getInvoiceMessageType(step,
					invoiceId)

			var messages = map.value;
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				// alert("discountMessage : " + messages.length);
				var discountMessage = messages[messageIndex];
				if (messageType && !messageType.isMessageExist(discountMessage)) {
					messageType.addMessage(discountMessage);
					// alert(invoiceId + " : " + discountMessage.message);
				}
			}
		}
	}
};

HIN.ProcessEntry.prototype.getInvoiceMessageType = function(step, invoiceId) {
	var messageTypes = step.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messageType = messageTypes[messageTypeIndex];
		var message = messageType.getMessage(invoiceId);
		if (message) {
			return messageType;
		}
	}
	return null;
};
