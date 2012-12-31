var HIN;
if (!HIN)
	HIN = {};
HIN.RoleDefinitionPage = function(appController, pageHolder) {
	roleDefinitionPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "roleDefinitionPage";
	this.uiInstance = null;
	this.lastOpenPage = null;

};

HIN.RoleDefinitionPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};
HIN.RoleDefinitionPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	// alert("RoleDefinitionPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.RoleDefinitionPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.RoleDefinitionPage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {
	// alert("addCompleteHandler");

};

HIN.RoleDefinitionPage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.RoleDefinitionPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.RoleDefinitionPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	var processObjects = [ roleDefinitionPage.processDefinition ];
	instance.processTask(processObjects);

};