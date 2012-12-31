var HIN;
if (!HIN)
	HIN = {};
HIN.MonitorMeasurePage = function(appController, pageHolder) {
	monitorMeasurePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "monitorMeasurePage";// pageHolder;
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.uiInstances = null;
	this.page = null;
};

HIN.MonitorMeasurePage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.MonitorMeasurePage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	uiGenerator.formRender = false;
	uiGenerator.hideRemoveIcon();
};

HIN.MonitorMeasurePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;

};

HIN.MonitorMeasurePage.prototype.addCompleteHandler = function(addNew,
		messageType, message) {

};

HIN.MonitorMeasurePage.prototype.removeCompleteHandler = function(
		messageTypeName, message) {
	// alert("removeCompleteHandler");
};

HIN.MonitorMeasurePage.prototype.taskHandler = function(message, taskVO,
		instance) {
	monitorMeasurePage.uiInstance = instance;
	var processObjects = [ monitorMeasurePage.processDefinition ];
	if (monitorMeasurePage.bloodTest == true) {
		if (taskVO) {
			monitorMeasurePage.uiInstance.processTask(processObjects);
		} else {
			var conceptNames = null;
			var messageXml = XmlUtil.findByName(message.message, "message",
					true);
			var fragment = XmlUtil.findByName(messageXml,
					"POLB_MT004000HT01_BloodTest", true);
			var component2 = XmlUtil.findByName(fragment, "component2", true);
			var i;
			if (component2) {
				component2 = XmlUtil.findByName(fragment, "component2", false);
				for (i = 0; i < component2.length; i++) {
					var displayName = XmlUtil.getXPathResult(message.message,
							"message/POLB_MT004000HT01_BloodTest/component2["
									+ (i + 1) + "]/observationEvent/code/code",
							XPathResult.STRING_TYPE);
					displayName = displayName.stringValue;
					if (displayName && displayName.length > 0) {
						if (conceptNames)
							conceptNames = conceptNames + ',' + displayName;
						else
							conceptNames = displayName;
					}
				}
			}
			/*
			 * monitorMeasurePage.appController.getComponent("DataLayer")
			 * .fetchConceptByNames(conceptNames, monitorMeasurePage.getLookup,
			 * message);
			 */
			monitorMeasurePage.uiInstance.processTask(processObjects);
		}
	} else {
		monitorMeasurePage.uiInstance.processTask(processObjects);
	}
};
