/**
 * Manipulate the message document using MessageTypeScript.It provides the
 * following methods like to loadScript, initialize, fillData, fillParticipants
 * and complete.
 * 
 * @param messageObject
 * @param messageType
 * @param appController
 * @param messageAndUIBinder
 * @returns {MessageTypeScript}
 */
function MessageTypeScript(messageObject, messageType, appController,
		messageAndUIBinder) {
	var thisObject = this;

	/**
	 * messageType holds the type of the message.
	 */
	this.messageType = messageType;
	this.appController = appController;

	/**
	 * messageScriptObject holds the instance of loaded messagetype script
	 * object.
	 */
	this.messageScriptObject = null;

	if (!messageAndUIBinder)
		this.messageAndUIBinder = new MessageAndUIBinder('', messageObject,
				messageType);
	else
		this.messageAndUIBinder = messageAndUIBinder;

	/**
	 * It instantiate messageScript object base on the message type using eval()
	 * expression.
	 */
	this.loadScript = function(scriptString) {
		try {

			var scriptToRun = scriptString
					+ '; thisObject.messageScriptObject = new '
					+ thisObject.messageType
					+ '(thisObject.appController, thisObject.messageAndUIBinder /* No logger */);'
			// thisObject.log(scriptToRun);
			eval(scriptToRun);
		} catch (error) {
			thisObject.log(error);
		}
	};

	this.run = function() {
		try {
			if (thisObject.messageScriptObject
					&& thisObject.messageScriptObject.run) {
				thisObject.messageScriptObject.run();
			} else {
				throw "Method run() not found in " + thisObject.messageType
						+ " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageType + ".run(): "
					+ error);
		}
	};

	/**
	 * Trigger the initialize method implemented in the loaded message script.
	 */
	this.initialize = function() {
		try {
			if (thisObject.messageScriptObject
					&& thisObject.messageScriptObject.initialize) {
				thisObject.messageScriptObject.initialize();
			} else {
				throw "Method initialize() not found in "
						+ thisObject.messageType + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageType
					+ ".initialize(): " + error);
		}
	};

	/**
	 * Trigger the fillData method implemented in the loaded message script.
	 */
	this.fillData = function(key, values) {
		try {
			if (thisObject.messageScriptObject
					&& thisObject.messageScriptObject.fillData) {
				thisObject.messageScriptObject.fillData(key, values);
			} else {
				throw "Method fillData() not found in "
						+ thisObject.messageType + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageType
					+ ".fillData(): " + error);
		}
	};

	/**
	 * Trigger the fillParticipants method implemented in the loaded message
	 * script.
	 */
	this.fillParticipants = function() {
		try {
			if (thisObject.messageScriptObject
					&& thisObject.messageScriptObject.fillParticipants) {
				thisObject.messageScriptObject.fillParticipants();
			} else {
				throw "Method fillParticipants() not found in "
						+ thisObject.messageType + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageType
					+ ".fillParticipants(): " + error);
		}
	};

	/**
	 * Trigger the complete method implemented in the loaded message script.
	 */
	this.complete = function(instance, callBack) {
		try {
			if (thisObject.messageScriptObject
					&& thisObject.messageScriptObject.complete) {
				thisObject.messageScriptObject.complete(instance, callBack);
			} else {
				throw "Method complete() not found in "
						+ thisObject.messageType + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageType
					+ ".complete(): " + error);
		}
	};

	this.log = function(message) {
		// alert(message);
		console.log(message);
	};
};