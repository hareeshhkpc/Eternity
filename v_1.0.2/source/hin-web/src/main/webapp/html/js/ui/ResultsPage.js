var HIN;
if (!HIN)
	HIN = {};
HIN.ResultsPage = function(appController, pageHolder) {
	resultsPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "resultsPage";
	this.subMessageTypes = [];
	this.placeHolder = null;
	this.page = null;
	this.innerMessageTypeIndex = 0;
	this.headers = [];
	this.categories = [];
	this.tableGroupHeader = [];
	this.finaceTypes = [];
};

HIN.ResultsPage.prototype.init = function(callback, page) {
	this.page = page;
	/*
	 * var messageType = factoryClass.createMessageType(
	 * "POSA_MT920000HT03_Hormones", "RestorationOfHormones", "HORMONES_FORM",
	 * "Restoration Of Hormones"); messageType.category = "Drug";
	 * resultsPage.subMessageTypes.push(messageType);
	 */

	/*
	 * messageType = factoryClass.createMessageType(
	 * "POSA_MT920000HT03_Supplements", "AdvancedSupplementation",
	 * "SUPPLEMENTS_FORM", "Advanced Supplementation"); messageType.category =
	 * "Drug"; resultsPage.subMessageTypes.push(messageType);
	 */

	if (callback) {
		callback(page);
	}
};

HIN.ResultsPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {

	uiGenerator.formRender = false;
	// uiGenerator.singleForm = true;
	/*
	 * uiGenerator.hideMainHeader();
	 */
	uiGenerator.hideAddIcon();
	// uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();
	/*
	 * uiGenerator.hideMainHeader(); uiGenerator.hideAddIcon();
	 * uiGenerator.hideSubHeader(); uiGenerator.hideRemoveIcon();
	 */

};
HIN.ResultsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.ResultsPage.prototype.addCompleteHandler = function(addNew, messageType,
		message, instance) {
	// return;
	if (messageType.type == "POCD_MT000040UV_ConsultationView") {

		$('#inner-uiform-' + message.id)
				.find('[identifier="togglePage"]')
				.each(
						function() {
							if ($(this).attr('id') == 'togglePage9') {
								// resultsPage.innerMessageTypeIndex = 0;
								var innerStep = resultsPage.processDefinition
										.getHiddenStep("InnerStep");
								if (!innerStep) {
									innerStep = factoryClass
											.createHiddenStep("InnerStep");
									resultsPage.processDefinition
											.addStep(innerStep);
								}
								// alert(innerStep);
								var type = "POSA_MT920000HT03_Hormones";
								var messageType = innerStep
										.getMessageTypeByType(type);

								if (!messageType) {
									messageType = factoryClass
											.createMessageType(type, "Hormone",
													"HORMONES_GRID_FORM",
													"Restoration Of Hormones");
									innerStep.addMessageType(messageType);
								}
								resultsPage.headers = ["Hormone","Dose","How often","When to take"];
								messageType.category = "Hormones";
								resultsPage.placeHolder = 'drugOrder';
								resultsPage.categories = ["Hormones"];
								resultsPage.tableGroupHeader = [ ];
								resultsPage.finaceTypes = ["Fee","Cost"];
								resultsPage.drugLoadHandler(type);
							}
							if ($(this).attr('id') == 'togglePage11') {
								var innerStep = resultsPage.processDefinition
										.getHiddenStep("InnerStep");
								if (!innerStep) {
									innerStep = factoryClass
											.createHiddenStep("InnerStep");
									resultsPage.processDefinition
											.addStep(innerStep);
								}
								// alert(innerStep);
								var type = "POSA_MT920000HT03_Supplements";
								var messageType = innerStep
										.getMessageTypeByType(type);

								if (!messageType) {
									messageType = factoryClass
											.createMessageType(
													"POSA_MT920000HT03_Supplements",
													"Supplementation",
													"SUPPLEMENTS_GRID_FORM",
													"Advanced Supplementation");
									innerStep.addMessageType(messageType);
								}
								messageType.typeName = "Supplements";
								messageType.category = "Supplements";
								resultsPage.placeHolder = 'supplementOrder';
								resultsPage.headers = ["Supplement","Dose","How often","When to take"];
								resultsPage.categories = ["Anti_Aging","HormoneBooster","Cardio_Support","Diet_Control"];
								resultsPage.tableGroupHeader = ["Anti-aging","Hormones Booster","Cardio Support","Diet Control"];
								resultsPage.finaceTypes = ["Fee","Cost"];
								resultsPage.drugLoadHandler(type);
							}

						});
	}
};

HIN.ResultsPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.ResultsPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.ResultsPage.prototype.taskHandler = function(message, taskVO, instance) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	for ( var index = 0; index < page.uiInstances.length(); index++) {
		var map = page.uiInstances.getItemAt(index);
		var uiGenerator = map.value;
		 if (uiGenerator.innerPage) {
			var messages = uiGenerator.uiMessages;
			if (messages) {
				// alert("msg found: " + messages.length);
				for ( var messagIndex = 0; messagIndex < messages.length; messagIndex++) {
					var messageObject = messages[messagIndex];
					message.addDependendMessage(messageObject);
					// alert("msg: " + messageObject);
				}
			}
		}
	}

	var processObjects = [ resultsPage.processDefinition ];
	instance.processTask(processObjects);

};

HIN.ResultsPage.prototype.pageAfterLoad = function(page) {
	// alert($.toJSON(resultsPage.processDefinition));
};

HIN.ResultsPage.prototype.createMessageTypeHandler = function(page,
		messageType, message, addCompleteHandler) {
	if (!page)
		page = this;
	var map = page.groupHeaderMap.get(messageType.typeName);
	if (map) {
		var id = map.value;
		var sortBy = messageType.typeName;
		var uiGenerator = page.uiInstances.get(id).value;
		uiGenerator.formRender = true;
		var messageTypeObj = uiGenerator.getMessageType(messageType.type);
		if (!messageTypeObj) {
			uiGenerator.addMessageType(messageType);
			messageType.addMessage(message);
		} else {
			messageTypeObj.addMessage(message);
		}
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			// if (message.instanceId == -1) {
			uiGenerator.addMessage(message);
			// }
		}
		uiGenerator.generateUI(message, addCompleteHandler);
		// uiGenerator.loadUIForms();
		// uiGenerator.addMessage(message);
		/*
		 * alert("createMessageTypeHandler : " + uiMessageType);
		 * uiGenerator.addNew = false; uiGenerator.loadUIForms();
		 */

	} else {
		alert("TODO createMessageTypeHandler");
		// messageTypeObj.addMessage(message);
		// page.uiSelectedStep.addMessageType(messageTypeObj);
	}

};

HIN.ResultsPage.prototype.drugLoadHandler = function(type) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	// var messageType = resultsPage.subMessageTypes.shift();
	var innerStep = resultsPage.processDefinition.getHiddenStep("InnerStep");
	if (innerStep) {
		var messageType = innerStep.getMessageTypeByType(type);
		if (messageType) {

			var id = idGenerator.getId();
			var uiTable = new HIN.UITable(id, appController,
					page.selectedStep, resultsPage.placeHolder, messageType,
					resultsPage.drugLoadHandler, page);
			page.uiInstances.put(id, uiTable);
			uiTable.formRender = true;
			uiTable.innerPage = true;
			uiTable.tableHeaders = resultsPage.headers;
			uiTable.categories = resultsPage.categories;
			uiTable.uiTableGroupHeader = resultsPage.tableGroupHeader;
			uiTable.uiFinanceTypes = resultsPage.finaceTypes;
			var sortBy = messageType.typeName;
			page.groupHeaderMap.put(sortBy, id);
			uiTable.createMessageTypeHandler = resultsPage.createMessageTypeHandler;
			var messages = messageType.getMessages();

			// alert("Messages Length :" + messages.length);
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				//alert("drugLoad:"+message);
				message.rendered = true;
				message.renderUI = true;
				uiTable.addMessage(message);
				uiTable.uiMessagesMap.put(message.title,message);
			}
			// alert("message:"+messages.length);
			uiTable.addCompleteHandler = resultsPage.addInnerCompleteHandler;
			uiTable.lookupSelectionHandler = resultsPage.page.lookupSelectionHandler;
			uiTable.removeMessageHandler = resultsPage.removeMessageHandler;
			uiTable.load();
		}
	}
};

HIN.ResultsPage.prototype.addInnerCompleteHandler = function(addNew,
		messageType, message, instance) {
	// alert('inner-uiform-' + message.id);
	var innerStep = resultsPage.processDefinition.getHiddenStep("InnerStep");
	if (innerStep) {
		var messageTypeObject = innerStep
				.getMessageTypeByType(messageType.type);
		messageTypeObject.addMessage(message);
		// alert(message + " : " + instance.innerPage);
	}

};

HIN.ResultsPage.prototype.removeMessageHandler = function(messageType, messageId, instance) {
	var messages = appController.getComponent("RenderingEngine").getChildComponent(
	"Form").getPage().processDefinition.getHiddenStep("InnerStep").getMessageTypeByType(messageType.type).messages;
	/*if (innerStep) {
		var messageTypeObject = innerStep
				.getMessageTypeByType(messageType.type);
		var messages = messageTypeObject.messages;*/
		var deleteIndex = -1;
		for(var index = 0;index<messages.length;index++){
			var message = messages[index];
			if (messageId == message.messageId) {
				deleteIndex = index;
				break;
			}
		}
		if (deleteIndex != -1) {
			var msgType=appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage().processDefinition.getHiddenStep("InnerStep").getMessageTypeByType(messageType.type);
			msgType.messages=[];
			//delete messages[deleteIndex];
			messages.splice(deleteIndex);
			msgType.messages = messages;
		}
		
		//messageTypeObject.messages = messages;
	/*}*/
	
	//alert(resultsPage.processDefinition.getHiddenStep("InnerStep").getMessageTypeByType(messageType.type).messages[deleteIndex].length);
};
