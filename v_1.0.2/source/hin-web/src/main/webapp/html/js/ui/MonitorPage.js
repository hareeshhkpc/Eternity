var HIN;
if (!HIN)
	HIN = {};
HIN.MonitorPage = function(appController, pageHolder) {
	monitorPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "monitorPage";
	this.uiInstance = null;
	this.page = null;

};

HIN.MonitorPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);

	}
};
HIN.MonitorPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.MonitorPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.MonitorPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler");
	/*
	 * if (message.messageType === 'POCD_MT000040UV_PhysicalExamination') {
	 * physicalExaminationPage.page.onLoadComplete_PhysicalExamination(messageType,
	 * message); }
	 */
};

HIN.MonitorPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.MonitorPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.MonitorPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");
	/*
	 * physicalExaminationPage.uiInstance = instance;
	 * physicalExaminationPage.saveProcess();
	 */

};

/*
 * HIN.MonitorPage.prototype.saveProcess = function() {
 * 
 * var subscriberId =
 * physicalExaminationPage.appController.getComponent("Context")
 * .getUserVo().subscriberId; var processName =
 * physicalExaminationPage.processDefinition.processName; var id = subscriberId +
 * "_" + processName; appController.getComponent("DataLayer").addProcess(id,
 * physicalExaminationPage.processDefinition); if
 * (physicalExaminationPage.uiInstance)
 * physicalExaminationPage.uiInstance.processTask(); };
 */

