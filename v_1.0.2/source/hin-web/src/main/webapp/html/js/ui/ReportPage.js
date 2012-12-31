var HIN;
if (!HIN)
	HIN = {};
HIN.ReportPage = function(appController, pageHolder) {
	reportPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "reportPage";
	this.uiInstance = null;
	this.page = null;

};

HIN.ReportPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};
HIN.ReportPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("ReportPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.singleButton = true;
	uiGenerator.refresh = false;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ReportPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.ReportPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler");
	/*
	 * if (message.messageType === 'POCD_MT000040UV_PhysicalExamination') {
	 * reportPage.page.onLoadComplete_PhysicalExamination(messageType, message); }
	 */
};

HIN.ReportPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.ReportPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.ReportPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");
	/*
	 * reportPage.uiInstance = instance; reportPage.saveProcess();
	 */

	/*
	 * var processObjects = [ reportPage.processDefinition ];
	 * instance.processTask(processObjects);
	 */
	var processDefinition = reportPage.processDefinition;
	
	appController
	.getComponent("RenderingEngine")
	.openPromptOkCancelModalDialog(
			"Do you want to Reset Client Report after saving?",
			function(result) {
				if (result == true) {
					if (processDefinition) {
						processDefinition.clear();
						var cacheManager = appController
								.getComponent("DataLayer").cacheManager;
						cacheManager.renderProcessUpdate = true;// true;
						cacheManager.syncToCouch = true;
						var messageObjects = [];
						var processObjects = [];
						processObjects.push(processDefinition);
						var parameters = [ messageObjects,
								processObjects ];
						appController.getComponent("DataLayer")
								.createOrUpdateTasks(parameters);
					}
				}
			});


};

HIN.ReportPage.prototype.clearHandler = function() {
	// alert("clearHandler");
	var processDefinition = reportPage.processDefinition;
	// alert(processDefinition.processName);
	// return;
	appController
			.getComponent("RenderingEngine")
			.openPromptOkCancelModalDialog(
					"Once reset the report then all data become archived",
					function(result) {
						if (result == true) {
							if (processDefinition) {
								processDefinition.clear();
								var cacheManager = appController
										.getComponent("DataLayer").cacheManager;
								cacheManager.renderProcessUpdate = true;// true;
								cacheManager.syncToCouch = true;
								var messageObjects = [];
								var processObjects = [];
								processObjects.push(processDefinition);
								var parameters = [ messageObjects,
										processObjects ];
								appController.getComponent("DataLayer")
										.createOrUpdateTasks(parameters);
							}
						}
					});

};

HIN.ReportPage.prototype.finishCompleteHandler = function() {
	/*
	 * return; var renderingEngine =
	 * appController.getComponent("RenderingEngine"); var processDefinition =
	 * reportPage.processDefinition; alert(processDefinition.id) alert("Report
	 * Complete handler");
	 * appController.getComponent("DataLayer").getProcessDefinitionInstance(
	 * processDefinition.id, function(updatedProcessDefinition) {
	 * appController.getComponent("RenderingEngine")
	 * .getChildComponent("Process").setProcessDefinition(
	 * updatedProcessDefinition); appController.getComponent("RenderingEngine")
	 * .getChildComponent("Process").updateProcessView(); });
	 */
	
};

/*
 * HIN.ReportPage.prototype.saveProcess = function() {
 * 
 * var subscriberId = reportPage.appController.getComponent("Context")
 * .getUserVo().subscriberId; var processName =
 * reportPage.processDefinition.processName; var id = subscriberId + "_" +
 * processName; appController.getComponent("DataLayer").addProcess(id,
 * reportPage.processDefinition); if (reportPage.uiInstance)
 * reportPage.uiInstance.processTask(); };
 */

