var HIN;
if (!HIN)
	HIN = {};
/**
 * Process Definition
 * 
 * Process definition is nothing but define the process of a module. It follows
 * a hierarchy like ProcessDefinition -> Steps -> MessageTypes -> Messages
 * 
 */
HIN.ProcessDefinition = function ProcessDefinition() {
	/** id holds the process definition's id. */
	this.id = "";
	/** processName holds the name of the process definition. */
	this.processName = null;
	/** description holds the description of the process definition. */
	this.description = null;

	this.scripts = [];
	/** steps holds the steps of the process definition. */
	this.steps = [];
	/** status holds the status of the process definition. */
	this.status = null;
	/**
	 * initializeScript holds the initializeScript of the process definition.
	 */
	this.initializeScript = null;
	/**
	 * initializeScriptExecuted holds true or false value , whether
	 * initializeScriptExecuted or not.
	 */
	this.initializeScriptExecuted = false;
};
/**
 * getStep method return the step object based on the stepName.
 * 
 * @param stepName :
 *            Its is a string hold the step name.
 * @returns {Step}
 */
HIN.ProcessDefinition.prototype.getStep = function(stepName) {
	for ( var index = 0; index < this.steps.length; index++) {
		// alert(stepName + "==" + this.steps[index].stepName);
		if (stepName == this.steps[index].stepName) {
			return this.steps[index];
		}
	}
	return null;
};

HIN.ProcessDefinition.prototype.getHiddenStep = function(stepName) {
	for ( var index = 0; index < this.steps.length; index++) {
		// alert(stepName + "==" + this.steps[index].stepName);
		if ("Hidden_" + stepName == this.steps[index].stepName) {
			return this.steps[index];
		}
	}
	return null;
};
/**
 * The getSteps method return all the steps
 * 
 * @returns {Step[]}
 */
HIN.ProcessDefinition.prototype.getSteps = function() {
	return this.steps;
};
/*
 * HIN.ProcessDefinition.prototype.setMessageId1 = function(stepName, type,
 * messageIndex, messageId) { // alert(stepName + " , " + type + " , " +
 * messageIndex + " , " + messageId) var step = this.getStep(stepName); if
 * (step) { var message = step.getMessage(messageIndex); alert("setMessageId :
 * "+message); if (message) { // alert(message.messageId) message.messageId =
 * messageId; return message; } else { alert("Message is not found in " +
 * stepName); return null; } } else { alert(stepName + "is not defined in " +
 * this.processName); return null; } };
 */
/*
 * HIN.ProcessDefinition.prototype.setMessageId = function(stepName, type,
 * messageIndex, messageId) { // alert(stepName + " , " + type + " , " +
 * messageIndex + " , " + messageId) var step = this.getStep(stepName); if
 * (step) { // step.getMessageTypeNames();
 * 
 * var messageType = step.getMessageTypeByType(type); //
 * alert(messageType.type); if (messageType) { var message =
 * messageType.getMessage(messageIndex); if (message) { //
 * alert(message.messageId) message.messageId = messageId; } else { message =
 * messageType.createEmptyMessage(messageId); message.messageId = messageId; //
 * alert(message) if (!message) alert("Message is not found in " + stepName);
 * return null; } } else { alert("MessageType is not found in " + stepName);
 * return null; } } else { alert(stepName + "is not defined in " +
 * this.processName); return null; } return message; };
 */
/**
 * The insertMessage method will insert the message into the provided stepName
 * and message type under the process definition
 * 
 * @param stepName :
 *            Its a string hold the step name.
 * @param type :
 *            Its a string which hold the value of message type
 * @param message :
 *            Its an object of message class.
 * @returns {void}
 */
HIN.ProcessDefinition.prototype.insertMessage = function(stepName, type,
		message) {
	// alert(stepName + " , " + type + " , " + messageIndex + " , " + messageId)
	var step = this.getStep(stepName);
	if (step) {
		// step.getMessageTypeNames();

		var messageType = step.getMessageTypeByType(type);
		// alert(messageType.type);
		if (messageType) {

			var messageObj = messageType.createEmptyMessage(message.messageId);
			messageObj.title = message.title;
			// alert(message)
			if (!messageObj)
				alert("Message is not found in " + stepName);
			return messageObj;
		} else {
			alert("MessageType is not found in " + stepName);
			return null;
		}
	} else {
		alert(stepName + "is not defined in " + this.processName);
		return null;
	}
	return messageObj;
};

/**
 * addStep method will add the step under the process definition
 * 
 * @param step :
 *            Its an object of step class.
 * @returns {void}
 * 
 */
HIN.ProcessDefinition.prototype.addStep = function(step) {
	if (step.status == "ACTIVE")
		this.steps.push(step);
};

/*
 * HIN.ProcessDefinition.prototype.addMessage = function(stepName, message) { //
 * alert("added"); var step = this.getStep(stepName);
 * 
 * var message = new HIN.Message(); message.messageIndex = formVO.messageIndex;
 * message.messageId = ""; message.message = ""; message.messageStatus =
 * "Pending"; message.messageType = formVO.messageType; message.messageForm =
 * formVO.formName; message.messageTypeName = formVO.typeName;
 * 
 * 
 * var step = this.getStep(stepName); var messageType =
 * step.getMessageType(type); messageType.addMessage(message); var
 * messageTypeName = step.getMessageTypeName(type);
 * messageTypeName.addMessage(message);
 * 
 * alert(stepName + " : " + type); var step = this.getStep(stepName); var
 * messageType = step.getMessageType(type); var messages =
 * messageType.getMessages(); alert("Message Size : " + messages.length);
 * 
 * 
 * 
 * for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) { if
 * (stepName == this.steps[stepIndex].stepName) { var messageTypes =
 * this.steps[stepIndex].messageTypes; for ( var messageTypeIndex = 0;
 * messageTypeIndex < this.steps[stepIndex].messageTypes.length;
 * messageTypeIndex++) { if (messageType ==
 * this.steps[stepIndex].messageTypes[messageTypeIndex].type) { alert("add
 * messageType : " + messageType + " : messageIndex = " + messageIndex); var
 * messageVO = new HIN.Message(); messageVO.messageIndex = messageIndex;
 * messageVO.messageId = ""; messageVO.message = ""; messageVO.messageStatus =
 * "Pending"; // messageVO.messageType = messageType; messageVO.messageForm =
 * messageForm;
 * alert(this.steps[stepIndex].messageTypes[messageTypeIndex].messages);
 * this.steps[stepIndex].messageTypes[messageTypeIndex].messages
 * .push(messageVO); return messageVO; } } } } return null; };
 */

/*
 * HIN.ProcessDefinition.prototype.getGroupByGroupNameMessages = function() {
 * 
 * var groupNameMap = new HIN.HashMap();
 * 
 * for ( var index = 0; index < this.steps.length; index++) { var selectionArray =
 * []; var messages = this.steps[index].getMessages() for ( var messageIndex =
 * 0; messageIndex < messages.length; messageIndex++) {
 * messages[messageIndex].groupName = messages[messageIndex].groupName
 * .replace(/\s+/g, '_'); var groupName = messages[messageIndex].groupName; var
 * title = messages[messageIndex].title; var messageForm =
 * messages[messageIndex].messageForm; var messageType =
 * messages[messageIndex].messageType;
 * 
 * if (!groupNameMap.get(groupName) && title.indexOf("< Add") == -1) {
 * selectionArray = messages[messageIndex].selectionArray;
 * groupNameMap.put(groupName, messages[messageIndex]); } if (title.indexOf("<
 * Add") == -1) { var selecton = messageType + '-' + messageForm + ',' + title;
 * if (!this.existSelection(selectionArray, selecton)) {
 * selectionArray.push(selecton); } } } } return groupNameMap; };
 * HIN.ProcessDefinition.prototype.existSelection = function(selectionArray,
 * selection) { for ( var index = 0; index < selectionArray.length; index++) {
 * if (selection == selectionArray[index]) { return true; } } return false; };
 */
HIN.ProcessDefinition.prototype.optimize = function() {
	// return;

	// remove unwanted attribute from message object
	// this.initializeScript = "";

	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var messageTypes = this.steps[stepIndex].getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messages = messageTypes[messageTypeIndex].getMessages();
			// alert("Messages : " + messages.length);
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				messages[messageIndex].optimize();
			}
		}
		this.steps[stepIndex].optimize();
		/*
		 * this.steps[stepIndex].messageTypeNames.splice(0,
		 * this.steps[stepIndex].messageTypeNames.length);
		 */
	}
};

HIN.ProcessDefinition.prototype.updateMessageStatus = function() {

	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var step = this.steps[stepIndex];
		step.messageGroups.clearItems();
		var messageTypes = step.getMessageTypes();

		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageType = messageTypes[messageTypeIndex];

			var count = messageType.getMessages().length;
			if (count > 0) {
				// alert(messageType.title + " : " + count);
				step.addMessageGroup(messageType, count);
			}

			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				var messageAndUIBinder = message.messageAndUIBinder;
				if (!messageAndUIBinder)
					messageAndUIBinder = new MessageAndUIBinder(null,
							message.msg, message.messageType);
				if (message.msg) {
					/*
					 * alert("Message xml : " +
					 * XmlUtil.xmlToString(message.msg.getXML()));
					 */
					message.messageProcessCompeletionStatus = messageAndUIBinder
							.getIdRootValue("MESSAGE_STATUS");

				}
			}
		}
	}

};

/*
 * HIN.ProcessDefinition.prototype.updateStatus = function() { for ( var
 * stepIndex = 0; stepIndex < this.steps.length; stepIndex++) { var messageTypes =
 * this.steps[stepIndex].getMessageTypes(); var empty = true; var stepCompleted =
 * true;
 * 
 * for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length;
 * messageTypeIndex++) { var messageType = messageTypes[messageTypeIndex]; var
 * messageTypeCompleted=null; if(messageType.finished!=null){
 * messageTypeCompleted=messageType.finished; }else{ messageTypeCompleted =
 * true; } var messages = messageType.getMessages(); if (messageType.state>=0) {
 * for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
 * empty = false; var message = messages[messageIndex]; if
 * (message.messageProcessCompeletionStatus!=null && messageType.state >
 * message.messageProcessCompeletionStatus) { stepCompleted = false;
 * messageTypeCompleted = false; } else { message.readOnly = true; } } }else{
 * stepCompleted = false; messageTypeCompleted = false; }
 * messageType.finished=messageTypeCompleted; } if (empty) {
 * this.steps[stepIndex].state = "unread"; } else if (stepCompleted) {
 * this.steps[stepIndex].state = "read"; } else { this.steps[stepIndex].state =
 * "current"; } this.steps[stepIndex].updateMessageGroup(); } };
 */

HIN.ProcessDefinition.prototype.updateStatus = function() {
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var messageTypes = this.steps[stepIndex].getMessageTypes();
		var empty = true;
		var stepCompleted = true;
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageTypeCompleted = true;
			var messageType = messageTypes[messageTypeIndex];
			if (this.steps[stepIndex].stepName == "Step4") {
				// alert(messageType);
			}
			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				empty = false;
				var message = messages[messageIndex];

				/*
				 * if (this.steps[stepIndex].stepName == "Step4" &&
				 * messageType.type == "POCD_MT000040UV_PhComm_NU")
				 */
				/*
				 * if (this.steps[stepIndex].stepName == "Step2" &&
				 * messageType.type == "POLB_MT004000HT01_ABI") {
				 * alert(messageType.state + " : " +
				 * message.messageTypeCompeletionTempStatus + " : " +
				 * message.messageProcessCompeletionStatus); }
				 */

				if (messageType.state >= 0) {
					if (messageType.state > message.messageProcessCompeletionStatus) {
						stepCompleted = false;
						messageTypeCompleted = false;
					} else {

						// messageProcessCompeletionStatus completed
						// message.readOnly = true;
					}
				} else {
					stepCompleted = false;
					messageTypeCompleted = false;
				}
			}

			messageType.finished = messageTypeCompleted;
			if (empty) {
				messageType.finished = false;
			}
		}
		if (empty) {
			this.steps[stepIndex].state = "unread";
		} else if (stepCompleted) {
			this.steps[stepIndex].state = "read";
		} else {
			this.steps[stepIndex].state = "current";
		}
		this.steps[stepIndex].updateMessageGroup();
	}
};
HIN.ProcessDefinition.prototype.removeMessage = function(messageId) {
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var messageTypes = this.steps[stepIndex].getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageType = messageTypes[messageTypeIndex];
			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				if (messageType.messageId == message.messageId) {
					messages.remove(messageIndex);
					break;
				}

			}
		}

	}
};

HIN.ProcessDefinition.prototype.removeAllMessages = function() {
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var messageTypes = this.steps[stepIndex].getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageType = messageTypes[messageTypeIndex];
			messageType.removeAllMessages();
		}

	}
};

HIN.ProcessDefinition.prototype.clear = function(callback) {
	// this.removeAllMessages();
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var step = this.steps[stepIndex];
		// alert(step.stepName);

		/*
		 * if (step.stepName == "Step2") { step.removeAllMessageTypes(); } else
		 */if (step.stepName == "Step2" || step.stepName == "Step3"
				|| step.stepName == "Step4" || step.stepName == "Step5"
				|| step.stepName == "Step7"
				|| step.stepName == "Hidden_InnerStep") {
			var messageTypes = step.getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messageType = messageTypes[messageTypeIndex];

				if (step.stepName == "Step2" || step.stepName == "Step4"
						|| step.stepName == "Step3" || step.stepName == "Step5"
						|| step.stepName == "Step7") {
					var messages = messageType.getMessages();
					for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
						var message = messages[messageIndex];
						/* alert(message.messageType); */
						message.messageId = null;
						message.message = null;
						message.msg = null;
						message.finised = false;
						message.taskVO = null;
						message.messageAndUIBinder = null;
						message.rendered = false;
						message.readOnly = false;
						message.status = AppConstants.Status.ACTIVE;
						message.dependendMessageProcessed = false;
						message.dependendMessages = [];
						message.initializeScriptExecuted = false;
						message.messageProcessCompeletionStatus = 0;
						message.sync = false;
						message.transactionType = null;
						message.transactionStatus = null;
						message.renderUI = true;
						message.finished = false;
						message.newTask = false;
						message.partOfPackage = false;
						message.formView = true;
					}
				}
				if (step.stepName == "Step2" || step.stepName == "Step3") {
					// messageType.removeAllMessages();
					var messageTypeObjects = [];
					for ( var i = 0; i < this.steps[stepIndex].messageTypes.length; i++) {
						this.steps[stepIndex].messageTypes[i]
								.removeAllMessages();
						this.steps[stepIndex].messageTypes[i].messages = [];
						var messageType = this.steps[stepIndex].messageTypes[i];
						messageTypeObjects.push(messageType);

					}
					this.steps[stepIndex].clearMessageGroup();
					this.steps[stepIndex].removeAllMessageTypes();
					this.steps[stepIndex].messageTypes = [];
					for ( var i = 0; i < messageTypeObjects.length; i++) {

						messageTypeObjects[i].finished = false;
						this.steps[stepIndex]
								.removeMessageGroup(messageTypeObjects[i]);
						this.steps[stepIndex].messageTypes
								.push(messageTypeObjects[i]);
					}
				}

			}
		}
		// this.steps[stepIndex].messageTypes = [];
	}
	// this.steps = [];
	if (callback) {
		callback();
	}
};

HIN.ProcessDefinition.prototype.isCleared = function() {
	// this.removeAllMessages();
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var step = this.steps[stepIndex];
		// alert(step.stepName);
		if (step.stepName == "Step2") {
			var messageTypes = step.getMessageTypes();

			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messageType = messageTypes[messageTypeIndex];
				var messages = messageType.getMessages();
				for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
					var message = messages[messageIndex];
					var partOfPackage = message.partOfPackage;
					if (partOfPackage == true) {
						return false;
					}

				}
			}
			return true;
		}

	}
};

HIN.ProcessDefinition.prototype.gerMessagesCount = function(stepName) {
	var length = 0;
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var step = this.steps[stepIndex];
		// alert(step.stepName);
		if (step.stepName == stepName) {
			var messageTypes = step.getMessageTypes();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				var messageType = messageTypes[messageTypeIndex];

				var messages = messageType.getMessages();
				length += messages.length;
			}
		}
	}
	return length;
};
