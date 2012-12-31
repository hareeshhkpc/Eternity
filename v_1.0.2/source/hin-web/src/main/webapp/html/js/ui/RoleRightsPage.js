var HIN;
if (!HIN)
	HIN = {};
HIN.RoleRightsPage = function(appController, pageHolder) {
	roleRightsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "roleRightsPage";
	this.uiInstance = null;
	this.lastOpenPage = null;

};

HIN.RoleRightsPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};
HIN.RoleRightsPage.prototype.pageAfterLoad = function(page) {
	appController.getComponent("DataLayer")
			.getAllRollNames(
					function(data) {
						var roleNames = data.roleNames;
						// $('#select-choice0').val(data);

						$('#select-choice0').append(
								"<option value=''>Select</option>");
						$.each(roleNames, function(key, value) {
							$('#select-choice0').append(
									"<option value='" + value + "'>" + value
											+ "</option>");

						});

						$('select').selectmenu('refresh', true);
					});

};
HIN.RoleRightsPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("RoleRightsPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.RoleRightsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.RoleRightsPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {};

HIN.RoleRightsPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.RoleRightsPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.RoleRightsPage.prototype.taskHandler = function(message, taskVO, instance) {
	alert("message" + XmlUtil.xmlToString(message.message));
	var processObjects = [ roleRightsPage.processDefinition ];
	instance.processTask(processObjects);

};