var HIN;
if (!HIN)
	HIN = {};
/**
 * Message
 * 
 * it holds the message information like messageId, message (stringfied xml),
 * msg (xml doc),messageType, messageStatus , messageForm , messageTypeName,
 * title, description,transactionType ,transactionStatus, finished, readOnly,
 * taskVO and also the UI should be render based on the formHtml property
 * against a message type.
 * 
 */
HIN.Message = function Message() {

	this.instanceId = -1;

	this.id = 0;
	this.messageIndex = 0;
	/** messageId holds the message's id. */
	this.messageId = null;

	/** message holds the xml string based on the message. */
	this.message = null;

	this.messageStatus = null;
	/** messageType holds the message type. */
	this.messageType = null;
	/** messageForm holds the name of the html which should be render in UI. */
	this.messageForm = null;
	/**
	 * messageTypeName holds the type name , based on this message type will
	 * group the messages.
	 */
	this.messageTypeName = null;
	/*
	 * this.groupName = null; this.title = null; this.header = null; this.empty =
	 * false;
	 */
	/** title holds the title of the message. */
	this.title = null;
	/** description holds the description of the message. */
	this.description = null;

	this.selectionArray = [];

	/** taskVO holds the task information against the message. */
	this.taskVO = null;

	/**
	 * messageAndUIBinder hold the ui rendering and event handling against the
	 * form input controls
	 */
	this.messageAndUIBinder = null;

	this.rendered = false;

	/** readOnly holds the true or false value base on the ui component act. */
	this.readOnly = false;

	/**
	 * status holds the status of the message like 'ACTIVE' or 'INACTIVE' ,
	 * based on the status the UI will be decide to show/hide.
	 */
	this.status = AppConstants.Status.ACTIVE;

	this.dependendMessageProcessed = false;

	/**
	 * dependendMessages holds the dependendMessages under the message ,
	 * collection of messages.
	 */
	this.dependendMessages = [];

	/**
	 * initializeScriptExecuted holds true or false value , whether
	 * initializeScriptExecuted or not
	 */
	this.initializeScriptExecuted = false;

	/** msg holds the message document xml based on the message. */
	this.msg = null;

	this.sync = false;

	/** transactionType holds the transactionType of the message. */
	this.transactionType = null;
	/** transactionStatus holds the transactionStatus of the message. */
	this.transactionStatus = null;

	/**
	 * renderUI holds the true or false, once it renders the value make it
	 * false.
	 */
	this.renderUI = true;
	/**
	 * finished holds true or false value, based on this which will identify
	 * completed or not.
	 */
	this.finished = false;

	this.newTask = false;

	this.partOfPackage = false;

	this.packageId = null;

	/**
	 * formView hold true or false value,based on this UI will be decide to
	 * show/hide form.
	 */
	this.formView = true;

	this.messageTypeCompeletionTempStatus = 0;

	this.messageProcessCompeletionStatus = 0;

	this.addNew = false;

	this.financeType = null;

	/**
	 * deletable hold true or false value,based on this UI will be decide to
	 * provide delete option or not.
	 */
	this.deletable = false;

	this.insertBeforeFooter = false;
};

/**
 * addDependendMessage method will add the message under the message.
 * 
 * @param message :
 *            Its an object of message
 * @return {void}
 */
HIN.Message.prototype.addDependendMessage = function(message) {
	if (!this.isDependendMessagesExist(message)) {
		this.dependendMessages.push(message);
	}
};

/**
 * removeDependendMessages method will remove all messages under the message.
 */
HIN.Message.prototype.removeDependendMessages = function() {
	if (this.dependendMessages)
		this.dependendMessages.splice(0, this.dependendMessages.length);
};

/**
 * markAsObsolete method will change the message status to 'OBSOLETE'.
 */
HIN.Message.prototype.markAsObsolete = function() {
	this.status = AppConstants.Status.OBSOLETE;
	this.markDependendMessagesAsObsolete();
};

/**
 * markDependendMessagesAsObsolete method will change all dependend messages
 * status to 'OBSOLETE'.
 */
HIN.Message.prototype.markDependendMessagesAsObsolete = function() {
	if (this.dependendMessages) {
		for ( var index = 0; index < this.dependendMessages.length; index++) {
			this.dependendMessages[index].status = AppConstants.Status.OBSOLETE;
		}
	}
};

/**
 * isDependendMessagesExist method will return true or false based on the
 * message which is passed as parameter to the method.
 * 
 * @param message :
 *            Its an object of message.
 * @returns {Boolean}
 */
HIN.Message.prototype.isDependendMessagesExist = function(message) {
	if (this.dependendMessages) {
		for ( var index = 0; index < this.dependendMessages.length; index++) {
			if (this.dependendMessages[index].messageId == message.messageId) {
				return true;
			}
		}
	}
};
/**
 * removeDependendMessage method will remove the dependend message under the
 * message.
 * 
 * @param message :
 *            Its an object of message.
 * @returns {Boolean}
 */
HIN.Message.prototype.removeDependendMessage = function(message) {
	if (this.isDependendMessagesExist(message)) {
		// var messages = this.getMessages();
		this.dependendMessages = removeDependendArray(this.dependendMessages,
				message)
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

function removeDependendArray(arr) {
	var what, a = arguments, L = a.length, ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) != -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

/**
 * setInitializeScriptExecuted method will set true or false value.
 * 
 * @param initializeScriptExecuted :
 *            Its a boolean value.
 * @returns {void}
 */
HIN.Message.prototype.setInitializeScriptExecuted = function(
		initializeScriptExecuted) {
	this.initializeScriptExecuted = initializeScriptExecuted;
};

/**
 * isInitializeScriptExecuted method will return true or false.
 * 
 * @returns {Boolean}
 */

HIN.Message.prototype.isInitializeScriptExecuted = function() {
	/*
	 * if (this.taskVO == null && !this.initializeScriptExecuted) return false;
	 */
	return this.initializeScriptExecuted;
	// return this.taskVO == null ? false : true;
};

HIN.Message.prototype.isFinanced = function() {
	return this.taskVO == null ? false : true;
};

HIN.Message.prototype.optimize = function() {
	/*
	 * this.groupName = null; this.title = null; this.header = null; this.empty =
	 * false;
	 */
	this.message = null;
	this.selectionArray = [];
	this.taskVO = null;
	this.messageAndUIBinder = null;
	this.msg = null;
};
HIN.Message.prototype.toString = function() {
	return "  \r\n Message : [" + this.instanceId + " , " + this.messageId
			+ " , " + this.messageType + " , " + this.messageStatus + ", "
			+ this.messageTypeName + ", " + this.messageForm + ", "
			+ this.renderUI + ", messageTypeCompeletionTempStatus : "
			+ this.messageTypeCompeletionTempStatus + ", "
			+ this.messageProcessCompeletionStatus + ", " + this.finished
			+ ", " + "]";
};
