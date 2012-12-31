function ProcessScript(processDefName, processDefinition, appController,
		idGenerator) {
	var thisObject = this;

	this.idGenerator = idGenerator;
	this.processDefName = processDefName;
	this.appController = appController;
	this.process = null;
	this.processDef = processDefinition;
	this.executed = false;
	this.parameter = new Object();

	this.loadScript = function(scriptString) {
		try {
			var scriptToRun = scriptString
					+ '; thisObject.process = new '
					+ thisObject.processDefName
					+ '(thisObject.processDef, thisObject.appController,thisObject.idGenerator,this.parameter);'
			thisObject.log(scriptToRun);
			eval(scriptToRun);
		} catch (error) {
			thisObject.log(error);
		}
	};

	this.initialize = function() {
		if (thisObject.process && thisObject.process.initialize) {
			thisObject.process.initialize();
		}
	};

	this.createMessage = function(messageType) {
		if (thisObject.process && thisObject.process.createMessage) {
			thisObject.process.createMessage(messageType);
		}
	};

	this.removeMessage = function(messageId) {
		if (thisObject.process && thisObject.process.removeMessage) {
			thisObject.process.removeMessage(messageId);
		}
	};

	this.finishMessage = function(messageId) {
		if (thisObject.process && thisObject.process.finishMessage) {
			thisObject.process.finishMessage(messageId);
		}
	};

	this.stepOpen = function(stepName, callbackAfterStepOpen) {
		if (thisObject.process && thisObject.process.stepOpen) {
			thisObject.process.stepOpen(stepName, callbackAfterStepOpen);
		}
	};

	this.stepClose = function(stepName) {
		if (thisObject.process && thisObject.process.stepClose) {
			thisObject.process.stepClose(stepName);
		}
	};

	this.finishProcess = function() {
		if (thisObject.process && thisObject.process.finishProcess) {
			thisObject.process.finishProcess();
		}
	};

	this.destroy = function() {

	};

	this.log = function(message) {
		// alert(message);
	};
};