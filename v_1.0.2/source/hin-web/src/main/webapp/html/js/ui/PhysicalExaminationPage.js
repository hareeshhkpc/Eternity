var HIN;
if (!HIN)
	HIN = {};
HIN.PhysicalExaminationPage = function(appController, pageHolder) {
	physicalExaminationPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "physicalExaminationPage";
	this.uiInstance = null;
	this.page = null;

};

HIN.PhysicalExaminationPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};
HIN.PhysicalExaminationPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("PhysicalExaminationPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.PhysicalExaminationPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.PhysicalExaminationPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler");
	/*if (message.messageType === 'POCD_MT000040UV_PhysicalExamination') {
		physicalExaminationPage.page.onLoadComplete_PhysicalExamination(messageType, message);
	}*/
};

HIN.PhysicalExaminationPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.PhysicalExaminationPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.PhysicalExaminationPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");
/*	physicalExaminationPage.uiInstance = instance;
	physicalExaminationPage.saveProcess();*/

	var processObjects = [ physicalExaminationPage.processDefinition ];
	instance.processTask(processObjects);
	
};

/*HIN.PhysicalExaminationPage.prototype.saveProcess = function() {

	var subscriberId = physicalExaminationPage.appController.getComponent("Context")
			.getUserVo().subscriberId;
	var processName = physicalExaminationPage.processDefinition.processName;
	var id = subscriberId + "_" + processName;
	appController.getComponent("DataLayer").addProcess(id,
			physicalExaminationPage.processDefinition);
	if (physicalExaminationPage.uiInstance)
		physicalExaminationPage.uiInstance.processTask();
};*/

