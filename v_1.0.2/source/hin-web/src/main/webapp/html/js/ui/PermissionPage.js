var HIN;
if (!HIN)
	HIN = {};
HIN.PermissionPage = function(appController, pageHolder) {
	permissionPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "permissionPage";// pageHolder;
};

HIN.PermissionPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = true;
	/*
	 * uiGenerator.lookup = false; uiGenerator.singleForm = true;
	 * uiGenerator.hideMainHeader();
	 */
	uiGenerator.hideAddIcon();
	/* uiGenerator.hideSubHeader(); */
	uiGenerator.hideRemoveIcon();
	// uiGenerator.emptyForm = true;

};

HIN.PermissionPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.PermissionPage.prototype.addInitialHandler = function(uiGenerator) {
	// uiGenerator.formRender = true;

	/* alert("addInitialHandler"); */
};

HIN.PermissionPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler" + messageType);
};

HIN.PermissionPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler"+messageTypeName);
};

HIN.PermissionPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {

	// alert("lookupSelectionHandler");
};
HIN.PermissionPage.prototype.lookupSelectionValidateHandler = function(
		instance, conceptLookup) {

};

HIN.PermissionPage.prototype.taskHandler = function(message, taskVO, instance) { //
	var processObjects = [ permissionPage.processDefinition ];
	instance.processTask(processObjects);
};
