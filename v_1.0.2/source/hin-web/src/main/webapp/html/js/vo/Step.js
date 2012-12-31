var HIN;
if (!HIN)
	HIN = {};
/**
 * Step
 * 
 * it holds the step information like stepName, groupName, description,
 * different message types , status , state and also the UI should be render
 * based on the formHtml property against a step.
 * 
 */
HIN.Step = function Step() {
	/** stepName holds the name of the step */
	this.stepName = null;
	/**
	 * groupName holds the groupName of the step.Step which have same groupName
	 * will come under a single group
	 */
	this.groupName = null;
	/** shortDescription holds the shortDescription of the step */
	this.shortDescription = null;
	/** longDescription holds the longDescription of the step */
	this.longDescription = null;
	/** messageTypes holds the messageTypes under the step */
	this.messageTypes = [];
	/**
	 * formHtml holds the entry page of the step and it should refer a page UI
	 * component with suffix 'Page' For e.g. formHtml is defined as
	 * 'PatientRegistration' under the step in process definition , then UI
	 * component name should be 'PatientRegistrationPage.js'
	 */
	this.formHtml = null;
	this.messageTypeIndex = 0;
	this.messageGroups = new HIN.HashMap();
	this.typeNameMap = new HIN.HashMap();

	/**
	 * state holds the state of the step like 'read','empty'or 'unread',
	 * 'current'. 'read' : If all the messages are read(finished) under the step
	 * then it should be 'read'. 'empty' : There is no messages under the step.
	 * 'current' : At least one message and the status not read.
	 * 
	 */
	this.state = "unread";
	/**
	 * status holds the status of the step like 'ACTIVE' or 'INACTIVE' , based
	 * on the status the UI will be decide to show/hide.
	 */
	this.status = "ACTIVE";
	this.initializeScript = null;
	this.initializeScriptExecuted = false;
	/**
	 * stepStatusInfo holds the true o false value. Based on the stepStatusInfo
	 * the UI will be decide to show/hide the status information like message
	 * type count under the step etc.
	 */

	this.stepStatusInfo = true;
};

HIN.Step.prototype.addMessageGroup = function(messageType, count) {

	var object = new Object();
	object.messageType = messageType;
	object.count = count;

	var key = messageType.title;

	if (this.messageGroups.get(key) == null) {
		this.messageGroups.put(key, object)
	} else {
		var map = this.messageGroups.get(key);
		var object = map.value;
		object.count = parseInt(object.count) + count;
		// map.value = map.value + count;
	}

};

HIN.Step.prototype.updateMessageGroupByType = function(messageType, count) {

	var key = messageType.title;
	var map = this.messageGroups.get(key);
	if (map) {
		var object = map.value;
		object.count = parseInt(object.count) - count;
		// map.value =object;
		if (parseInt(object.count) == 0) {
			this.messageGroups.removeItem(key);
		}
	}
};

HIN.Step.prototype.removeMessageGroup = function(messageType) {

	var key = messageType.title;

	if (this.messageGroups.get(key)) {
		this.messageGroups.removeItem(key);
	}

};

HIN.Step.prototype.clearMessageGroup = function() {
	this.messageGroups.clearItems();
};

HIN.Step.prototype.updateMessageGroup = function() {
	var messageTypes = this.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messageType = messageTypes[messageTypeIndex];
		var map = this.messageGroups.get(messageType.title);
		if (map) {
			var object = map.value;
			if (object)
				object.messageType.finished = messageType.finished;
		} /*
			 * else { var object = new Object(); object.messageType =
			 * messageType; object.count = 1; object.messageType.finished =
			 * messageType.finished; this.addMessageGroup(messageType, object); }
			 */
	}
}

HIN.Step.prototype.removeAllMessageTypes = function() {
	// this.messageTypes.splice(0, this.messageTypes.length);
	for ( var index = 0, l = this.messageTypes.length; index < l; index++) {
		this.messageTypes.splice(index);
	}
};

HIN.Step.prototype.removeMessageType = function(typeName) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		if (typeName == this.messageTypes[messageTypeIndex].typeName) {
			var messageType = this.messageTypes[messageTypeIndex];
			this.messageTypes.splice(messageTypeIndex, 1);
			return messageType;
		}
	}
};

HIN.Step.prototype.getMessageType = function(messageType) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		if (messageType.type == this.messageTypes[messageTypeIndex].type)
			return this.messageTypes[messageTypeIndex];
	}

};
/**
 * getMessageTypeByType method will return the message type based on the type
 * which passed as parameter to the method.
 * 
 * @param type :
 *            Its a string which hold the value of message type
 * @return {MessageType}
 */

HIN.Step.prototype.getMessageTypeByType = function(type) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		if (type == this.messageTypes[messageTypeIndex].type)
			return this.messageTypes[messageTypeIndex];
	}

};

HIN.Step.prototype.getMessageTypeByTypeName = function(typeName) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		if (typeName == this.messageTypes[messageTypeIndex].typeName)
			return this.messageTypes[messageTypeIndex];
	}

};

/**
 * getMessageTypes method will return all the message types under this step.
 * 
 * @return {MessageType []}
 */
HIN.Step.prototype.getMessageTypes = function() {
	return this.messageTypes;
};

/**
 * addMessageType method will add the message type under the step.
 * 
 * @param messageType :
 *            Its an object of MessageType
 * @return {void}
 */
HIN.Step.prototype.addMessageType = function(messageType) {
	if (messageType.status == "ACTIVE") {
		this.messageTypes.push(messageType);
		if (!this.typeNameMap.get(messageType.title))
			this.typeNameMap.put(messageType.title, messageType.type);
		// alert(messageType);
		if (messageType.getMessages().length > 0) {
			var count = messageType.getMessages().length;
			/*
			 * var object = new Object(); object.messageType = messageType;
			 * object.count = messageType.getMessages().length;
			 * object.messageType.finished = messageType.finished;
			 */
			// this.addMessageGroup(messageType, count);
		}

	}
};

HIN.Step.prototype.insertMessageType = function(index, messageType) {
	if (messageType.status == "ACTIVE") {
		var arrayToInsert = [ messageType ];

		Array.prototype.splice.apply(this.messageTypes, [ index, 0 ]
				.concat(arrayToInsert));
		// this.messageTypes.insert(index, messageType);
		if (!this.typeNameMap.get(messageType.title))
			this.typeNameMap.put(messageType.title, messageType.type);
		// alert(messageType);
		if (messageType.getMessages().length > 0) {
			var count = messageType.getMessages().length;
			/*
			 * var object = new Object(); object.messageType = messageType;
			 * object.count = messageType.getMessages().length;
			 * object.messageType.finished = messageType.finished;
			 */
			// this.addMessageGroup(messageType, count);
		}

	}
};

/**
 * isMessageTypeExist method will return true or false based on the message type
 * which is passed as parameter to the method.
 * 
 * @param type :
 *            Its a string which hold the value of message type
 * @returns {Boolean}
 */
HIN.Step.prototype.isMessageTypeExist = function(type) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		if (type == this.messageTypes[messageTypeIndex].type)
			return this.messageTypes[messageTypeIndex];
	}
	return null;
};

HIN.Step.prototype.getMessage = function(message) {
	var messageType = this.isMessageTypeExist(message.messageType);
	if (messageType) {
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var messageObject = messages[messageIndex];
			if (messageObject.id == message.id) {
				return messageObject;
			}
		}
	}
};

HIN.Step.prototype.removeMessage = function(message) {
	var messageType = this.isMessageTypeExist(message.messageType);
	if (messageType) {
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var messageObject = messages[messageIndex];
			if (messageObject.messageId == message.messageId) {
				messages.splice(messageIndex); // alert("removed");
				return true;
			}
		}
	}
	/*
	 * var messageTypes = this.getMessageTypes(); for ( var messageTypeIndex =
	 * 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) { var
	 * messageType = messageTypes[messageTypeIndex]; var messages =
	 * messageType.getMessages(); for ( var messageIndex = 0; messageIndex <
	 * messages.length; messageIndex++) { var message = messages[messageIndex];
	 * if (messageId == message.messageId) { messages.splice(messageIndex); //
	 * alert("removed"); return true; } } }
	 */
	return false;
};

HIN.Step.prototype.getState = function() {

	var messageTypes = this.getMessageTypes();
	var read = true;
	var empty = true;
	/*
	 * if (messageTypes.length == 0) { empty = true; }
	 */
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messageType = messageTypes[messageTypeIndex];
		var messages = messageType.getMessages();
		if (messages.length > 0) {
			empty = false;
			// break;
		}

		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (messageType.state != message.messageStatus) {
				read = false;
				break;
			}

		}
		if (!read)
			break;

	}
	if (empty) {
		this.state = "unread";
	} else if (read) {
		this.state = "read";
	} else {
		this.state = "current";
	}
	/* alert("Step : " + this.state) */
	return this.state;
};

HIN.Step.prototype.isFinished = function(currentMessage) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		var messageType = this.messageTypes[messageTypeIndex];
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.finished == false
					&& message.messageTypeName == currentMessage.messageTypeName
					&& message.messageId != currentMessage.messageId) {
				return false;
			}
		}
	}
	return true;
};
/*
 * Pakage finance is attached with all service under that package,one service is
 * finished then remove the depend finance from other service
 */
HIN.Step.prototype.removeDependendMessages = function(currentMessage) {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		var messageType = this.messageTypes[messageTypeIndex];
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.partOfPackage == true
					&& message.packageId != null
					&& message.messageTypeName == currentMessage.messageTypeName
					&& message.messageId != currentMessage.messageId
					&& message.packageId == currentMessage.packageId) {
				message.removeDependendMessages();
			}
		}
	}

};

HIN.Step.prototype.optimize = function() {
	for ( var messageTypeIndex = 0; messageTypeIndex < this.messageTypes.length; messageTypeIndex++) {
		var messageType = this.messageTypes[messageTypeIndex];
		messageType.optimize();
	}
	// this.messageGroups = null;
	// this.typeNameMap = null;
};

HIN.Step.prototype.toString = function() {
	return "[" + this.stepName + " , " + this.messageTypes + "]";
};
