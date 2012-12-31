var HIN;
if (!HIN)
	HIN = {};
HIN.WelcomePage = function(appController, pageHolder) {
	welcomePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "welcomePage";// pageHolder;	
};

HIN.WelcomePage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.WelcomePage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("WelcomePage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.WelcomePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");	
};

HIN.WelcomePage.prototype.addCompleteHandler = function(addNew, messageType, message) {
	// alert("addCompleteHandler");
	welcomePage.fillInformation();	
	/*var page = appController.getComponent("RenderingEngine").getChildComponent("Form").getPage();
	page.pageResized();*/
};

HIN.WelcomePage.prototype.removeCompleteHandler = function(messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.WelcomePage.prototype.lookupSelectionHandler = function(instance, conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.WelcomePage.prototype.taskHandler = function(message, taskVO, instance) {
	var processObjects = [ welcomePage.processDefinition ];
	instance.processTask(processObjects);
};

HIN.WelcomePage.prototype.fillInformation = function() {
	// alert("fillInformation");
};
