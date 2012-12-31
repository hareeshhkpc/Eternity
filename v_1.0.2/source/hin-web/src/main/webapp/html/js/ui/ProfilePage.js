var HIN;
if (!HIN)
	HIN = {};
HIN.ProfilePage = function(appController, pageHolder) {
	profilePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "profilePage";
	this.uiInstance = null;
	this.groupHeaderMap = null;
};

HIN.ProfilePage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.ProfilePage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ProfilePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.ProfilePage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("Measure addCompleteHandler : " + messageType);

};

HIN.ProfilePage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.ProfilePage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.ProfilePage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");
	var processObjects = [ profilePage.processDefinition ];
	instance.processTask(processObjects);
};
