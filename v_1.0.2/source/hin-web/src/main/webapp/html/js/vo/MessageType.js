var HIN;
if (!HIN)
	HIN = {};
/**
 * MessageType
 * 
 * it holds the message type information like type, typeName, different
 * messages, status , state , queryString ,category, transactionType , finished
 * and also the UI should be render based on the formHtml property against a
 * message type.
 * 
 */

HIN.MessageType = function MessageType() {

	/**
	 * state holds the state of the step like 'read','empty'or 'unread',
	 * 'current'. 'read' : If all the messages are read(finished) under the step
	 * then it should be 'read'. 'empty' : There is no messages under the step.
	 * 'current' : At least one message and the status not read.
	 * 
	 */
	this.state = null;
	/** type holds the type of the message type like 'PRPA_MT201000HT03' */
	this.type = null;
	/**
	 * typeName holds the typeName of the message type like 'Diagnostic Test',
	 * which have same typeName will come under a single group
	 */
	this.typeName = null;

	/**
	 * formHtml holds the name of the html which should be render in UI
	 */
	this.formHtml = null;
	/** messages holds the messages under the message type */
	this.messages = [];
	/** title holds the title of the message type */
	this.title = null;
	// this.messageGroups = new HIN.HashMap();
	this.sortBy = "messageType";
	this.sortType = null;
	/**
	 * status holds the status of the step like 'ACTIVE' or 'INACTIVE' , based
	 * on the status the UI will be decide to show/hide.
	 */
	this.status = "ACTIVE";
	/**
	 * queryString holds the query which will retrieve the messages based on the
	 * query which is applicable only for dynamic process definition
	 */
	this.queryString = null;

	/**
	 * category holds the category like service,drug,role etc nothing but
	 * concept class.Adding a message through UI which will depend on the
	 * concept.
	 */
	this.category = null;
	this.transactionType = null;
	this.finished = false;
	this.headerView = true;
};

HIN.MessageType.prototype.addMessageGroup = function(key) {

	if (this.messageGroups.get(key) == null) {
		this.messageGroups.put(key, 1)
	} else {
		var map = this.messageGroups.get(key);
		map.value = map.value + 1;
	}

};
/**
 * addMessage method will add the message under the message type.
 * 
 * @param message :
 *            Its an object of message class.
 * @returns {void}
 * 
 */
HIN.MessageType.prototype.addMessage = function(message) {
	if (!this.isMessageExist(message)) {
		message.messageType = this.type;
		message.messageForm = this.formHtml;
		message.messageTypeName = this.typeName;
		// message.title = this.title;
		this.messages.push(message);
	}
	// else {
	// alert("MessageType TODO message.messageId " + message.messageId);
	// }
	return message;
};

HIN.MessageType.prototype.insertMessage = function(index, message) {
	if (!this.isMessageExist(message)) {
		message.messageType = this.type;
		message.messageForm = this.formHtml;
		message.messageTypeName = this.typeName;
		// message.title = this.title;
		this.messages.insert(index, message);
	}
	// else {
	// alert("MessageType TODO message.messageId " + message.messageId);
	// }
	return message;
};
/*
 * HIN.MessageType.prototype.addSelectedMessage = function(message) {
 * 
 * alert("Before Size : " + this.messages.length + " : " + this.type + " : " +
 * this.typeName); alert("Push : " + message);
 * 
 * var selecton = message.type + '-' + message.formHtml + ',' +
 * message.typeName;// message.title; message.selectionArray.push(selecton);
 * this.messages.push(message); // alert(message); alert("After Size : " +
 * this.messages.length); return message; };
 * 
 * HIN.MessageType.prototype.addNewMessage = function(message) {
 * 
 * alert("Before Size : " + this.messages.length + " : " + this.type + " : " +
 * this.typeName); alert("Push : " + message);
 * 
 * var selecton = this.type + '-' + this.formHtml + ',' + this.typeName;//
 * message.title; message.messageType = this.type; message.messageForm =
 * this.formHtml; // message.groupName = this.type; message.title = this.title; //
 * message.header = this.typeName; message.selectionArray.push(selecton);
 * this.messages.push(message); // alert(message); alert("After Size : " +
 * this.messages.length); return message; };
 */
/**
 * getMessages method will return all the messages under this message type.
 * 
 * @returns {Message[]}
 */
HIN.MessageType.prototype.getMessages = function() {
	return this.messages;
};

/*
 * HIN.MessageType.prototype.getMessage = function(messageIndex) {
 * 
 * for ( var index = 0; index < this.messages.length; index++) { if
 * (messageIndex == this.messages[index].messageIndex) return
 * this.messages[index]; } };
 */

/**
 * getMessage method will return the message under this message type based on
 * the messageId which is passed as parameter to the method.
 * 
 * @param messageId :
 *            Its a string which hold the id of message
 * @return {Message}
 */
HIN.MessageType.prototype.getMessage = function(messageId) {

	for ( var index = 0; index < this.messages.length; index++) {
		if (this.messages[index].messageId == messageId) {
			return this.messages[index];
		}
	}
	return null;
};
/**
 * removeAllMessages method will remove all the messages under the message type.
 * 
 * @return {void}
 */

HIN.MessageType.prototype.removeAllMessages = function() {
	// this.messages.splice(0, this.messages.length);
	for ( var index = 0, l = this.messages.length; index < l; index++) {
		this.messages.splice(index);
	}
	/*
	 * for ( var index = 0; index < this.messages.length; index++) {
	 * this.removeMessage(this.messages, this.messages[index]); }
	 */
};

HIN.MessageType.prototype.setMessages = function(messageTypes) {
	for (i = 0; i < messageTypes.length; i++) {
		var msg = messageTypes[i].getMessage();
		this.messages.push(msg);
	}
};

HIN.MessageType.prototype.createEmptyMessage = function(messageId) {
	// alert(this.messages)
	if (!this.messages || this.messages.length == 0) {
		var message = factoryClass.createMessage();

		/*
		 * var id = idGenerator.getId(); message = new HIN.Message();
		 * message.instanceId = id;// instanceId message.messageStatus =
		 * "Pending";
		 */
		message.messageType = this.type;
		message.messageForm = this.formHtml;
		// message.header = "New " + message.messageForm;
		// message.id = id;
		message.messageId = messageId;
		// message.messageIndex = message.id;
		return this.addMessage(message);
		;
	} else {
		alert("Message is not created in MessageTypeName");
		return null;
	}

};

HIN.MessageType.prototype.getMessagTypeSelectionArray = function() {
	return null;
};

/**
 * isMessageExist method will return true or false based on the message which is
 * passed as parameter to the method. *
 * 
 * @param message :
 *            Its an object of message
 * @return {Boolean}
 */
HIN.MessageType.prototype.isMessageExist = function(message) {
	// alert("Length : " + this.messages.length);
	for ( var messageIndex = 0; messageIndex < this.messages.length; messageIndex++) {
		// alert(this.messages[messageIndex].messageId + " == " + messageId)
		if ((message.messageId != null && this.messages[messageIndex].messageId == message.messageId)
				|| this.messages[messageIndex].id == message.id) {
			return true;
		}
	}
	return false;
};

/**
 * removeMessage method will remove the message under the message type.
 * 
 * @param message :
 *            Its an object of message
 * @return {Boolean}
 */

HIN.MessageType.prototype.removeMessage = function(message) {
	if (this.isMessageExist(message)) {
		// var messages = this.getMessages();
		this.messages = removeArray(this.messages, message)
		/*
		 * for ( var messageIndex = 0; messageIndex < messages.length;
		 * messageIndex++) { var messageObject = messages[messageIndex]; if
		 * (messageObject.messageId == message.messageId) {
		 * messages.splice(messageIndex); // alert("removed"); return true; } }
		 */
		return true;
	}
	return false;
};

function removeArray(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) != -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

HIN.MessageType.prototype.optimize = function() {
	for ( var messageIndex = 0; messageIndex < this.messages.length; messageIndex++) {
		var message = this.messages[messageIndex];
		message.optimize();
	}
	// this.messageGroups = null;
	// this.typeNameMap = null;
};

HIN.MessageType.prototype.toString = function() {
	return " \r\n Message Type : [ Type : " + this.type + " , Type Name"
			+ this.typeName + " , Message Form : " + this.formHtml
			+ ", Message Title : " + this.title + ", Header View : "
			+ +this.headerView + ", Finished : " + this.finished + "]";
};