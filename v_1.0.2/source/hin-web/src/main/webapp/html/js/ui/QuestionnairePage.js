var HIN;
if (!HIN)
	HIN = {};
HIN.QuestionnairePage = function(appController, pageHolder) {
	questionnairePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "questionnairePage";// pageHolder;
};

HIN.QuestionnairePage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.QuestionnairePage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	uiGenerator.formRender = false;
	messageType.category = 'Questionnaire';
	//uiGenerator.hideAddIcon();
	/*
	 * uiGenerator.hideMainHeader(); uiGenerator.hideAddIcon();
	 * uiGenerator.hideSubHeader(); uiGenerator.hideRemoveIcon();
	 */

};
HIN.QuestionnairePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.QuestionnairePage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	// alert("Questionnaire addCompleteHandler : " + message.messageType);

};

HIN.QuestionnairePage.prototype.removeCompleteHandler = function(messageType,
		message) {
	// alert("removeCompleteHandler");
};

HIN.QuestionnairePage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.QuestionnairePage.prototype.taskHandler = function(message, taskVO,
		instance) {
	var processObjects = [ questionnairePage.processDefinition ];
	instance.processTask(processObjects);
};
