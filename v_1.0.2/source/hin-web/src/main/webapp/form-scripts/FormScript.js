/**
 * FormScript which control the form which is rendered in UI. It provides the
 * following events like to loadScript, initialize, onLoad, reRender and
 * onUnLoad.
 * 
 * @param message
 * @param appController
 * @param uiGenerator
 * @returns {FormScript}
 */
function FormScript(message, appController, uiGenerator) {
	var thisObject = this;
	/**
	 * message holds the message object.
	 */
	this.message = message;
	/**
	 * messageForm holds the name of the form.
	 */
	this.messageForm = message.messageForm;
	this.appController = appController;

	/**
	 * formScriptObject holds the instance of loaded form script object.
	 */
	this.formScriptObject = null;

	/**
	 * uiGenerator holds instance of ui object.
	 */
	this.uiGenerator = uiGenerator;
	/*
	 * if (!this.messageAndUIBinder) this.messageAndUIBinder = new
	 * MessageAndUIBinder('', messageObject, messageType); else
	 * this.messageAndUIBinder = messageAndUIBinder;
	 */

	/**
	 * It instantiate form object base on the message form using eval()
	 * expression.
	 */
	this.loadScript = function(scriptString) {
		try {

			var scriptToRun = scriptString
					+ '; thisObject.formScriptObject = new '
					+ thisObject.messageForm
					+ '(thisObject.message, thisObject.appController, thisObject.uiGenerator /* No logger */);'
			// thisObject.log(scriptToRun);
			eval(scriptToRun);
		} catch (error) {
			thisObject.log(error);
		}
	};

	/**
	 * Trigger the initialize method implemented in the loaded form script.
	 */
	this.initialize = function() {
		try {
			if (thisObject.formScriptObject
					&& thisObject.formScriptObject.initialize) {
				thisObject.formScriptObject.initialize();
			} else {
				throw "Method initialize() not found in "
						+ thisObject.messageForm + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageForm
					+ ".initialize(): " + error);
		}
	};

	/**
	 * Trigger the onLoad method implemented in the loaded form script.
	 */
	this.onLoad = function(callback) {
		try {
			if (thisObject.formScriptObject
					&& thisObject.formScriptObject.onLoad) {
				thisObject.formScriptObject.onLoad(callback);
			} else {
				throw "Method onLoad() not found in " + thisObject.messageForm
						+ " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageForm + ".onLoad(): "
					+ error);
		}
	};
	/**
	 * Trigger the reRender method implemented in the loaded form script.
	 */
	this.reRender = function(callback) {
		try {
			if (thisObject.formScriptObject
					&& thisObject.formScriptObject.reRender) {
				thisObject.formScriptObject.reRender(callback);
			} else {
				throw "Method onLoad() not found in " + thisObject.messageForm
						+ " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageForm + ".onLoad(): "
					+ error);
		}
	};

	/**
	 * Trigger the onUnLoad method implemented in the loaded form script.
	 */
	this.onUnLoad = function(callback) {
		try {
			if (thisObject.formScriptObject
					&& thisObject.formScriptObject.onUnLoad) {
				thisObject.formScriptObject.onUnLoad(callback);
			} else {
				throw "Method onUnLoad() not found in "
						+ thisObject.messageForm + " script";
			}
		} catch (error) {
			thisObject.log("Error in " + thisObject.messageForm
					+ ".onUnLoad(): " + error);
		}
	};

	this.log = function(message) {
		// alert(message);
		console.log(message);
	};
};