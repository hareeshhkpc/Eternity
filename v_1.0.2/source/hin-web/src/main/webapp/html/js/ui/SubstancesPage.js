var HIN;
if (!HIN)
	HIN = {};
HIN.SubstancesPage = function(appController, pageHolder) {
	substancesPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "substancePage";
	this.page = null;
};

HIN.SubstancesPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.SubstancesPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = false;
	// alert("SubstancesPage pageBeforeLoad : " + uiGenerator);
	/*
	 * uiGenerator.hideMainHeader(); uiGenerator.hideAddIcon();
	 * uiGenerator.hideSubHeader(); uiGenerator.hideRemoveIcon();
	 */

};
HIN.SubstancesPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.SubstancesPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {

	$("#inner-uiform-" + message.id).append('<div id="subId-' + message.id + '"></div>');
	// alert("addCompleteHandler" + messageType);

	substancesPage.createChartUI(message);

	$("#inner-uiform-" + message.id).find('[dataField="true"]').live("change",function() {
				// alert('in change');
				substancesPage.createChartUI(message);
	});
};

/*HIN.SubstancesPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup, message) {
	// alert("message"+XmlUtil.xmlToString(message.message));

	if (conceptLookup && !message.isFinanced()) {
		var className = conceptLookup.getClassName();
		var concept = conceptLookup.getName();
		var financeMessageType = "FIAB_MT020000HT02";
		if (className == "Service" || className == "Drug") {
			substancesPage.page.createMessage(financeMessageType,
					conceptLookup, message,
					substancesPage.messageCreationComplete);
		}
	}

};*/

/*HIN.SubstancesPage.prototype.messageCreationComplete = function(newMessage,
		conceptLookup, message) {
	// alert("messageCreationComplete : " + message.messageId);
	message.addDependendMessage(newMessage);
	var messageType = newMessage.messageType;
	if (conceptLookup && messageType == "FIAB_MT020000HT02") {
		substancesPage.page.initialize(newMessage);
		substancesPage.page.fillParticipants(newMessage);
		substancesPage.page.fillFeeMessage(messageType, newMessage,
				conceptLookup, substancesPage.loadDependendForm);
	}
};

HIN.SubstancesPage.prototype.loadDependendForm = function(message) {
	var messageTypeObj = substancesPage.selectedStep
			.getMessageTypeByType(message.messageType);

	if (messageTypeObj) {
		message.title = messageTypeObj.title;
		messageTypeObj.addMessage(message)
		var instanceId = substancesPage.groupHeaderMap
				.get(messageTypeObj.typeName).value;
		var uiInstance = substancesPage.uiInstances.get(instanceId).value;
		if (uiInstance) {
			message.instanceId = uiInstance.instanceId;
			uiInstance.addMessage(message);
			uiInstance.loadNewUIForms();
		}
	}
};*/

HIN.SubstancesPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.SubstancesPage.prototype.taskHandler = function(message, taskVO, instance) {
	var processObjects = [ substancesPage.processDefinition ];
	instance.processTask(processObjects);
};

HIN.SubstancesPage.prototype.createChartUI = function(message) {

	var height1 = "100";
	var height23 = "100";
	var often = "0";
	var doseTextBoxInt = "";
	var textbox1 = "0";

	// dose text box calculations
	var doseTextBoxValue = $("#inner-uiform-" + message.id).find("#select-dose1").val();
	// alert("doseTextBoxValue: "+doseTextBoxValue);
	if (doseTextBoxValue.length > 0) {
		var dose = doseTextBoxValue.split(" ");

		if (dose.length > 0) {
			textbox1 = dose[0];
			// alert("textbox1: "+textbox1);
			doseTextBoxInt = parseInt(doseTextBoxValue);
			height1 = (100 - (doseTextBoxInt * 0.085));
		}
	}

	// howOften text box calculations
	var howOftenValue = $("#inner-uiform-" + message.id).find("#select-dose2").attr('value');
	// alert("len: "+howOftenValue.length+" val:"+howOftenValue);
	if (howOftenValue.length > 0) {
		if (howOftenValue == "SID") {
			often = "1";
		} else if (howOftenValue == "BID") {
			often = "2";
		} else if (howOftenValue == "TID") {
			often = "3";
		} else if (howOftenValue == "QID") {
			often = "4";
		}
		// alert("often: "+often);
		height23 = (100 - (doseTextBoxInt * 0.085 * often));
	}

	createChart(height1, height23, textbox1, often);

	function createChart(height1, height23, doseTextBoxValue, howOftenValue) {
		// alert("doseTextBoxValue: "+doseTextBoxValue);
		var xmlNode = XmlUtil.loadXml("charts/SubstanceGraph.xml");
		var pathNode = "m 50," + height1 + " 130,0";
		var pathNode1 = "m 180," + height23 + " 130,0";
		var pathNode2 = "m 310," + height23 + " 130,0";
		

		var graphHeight = 160 - (height23);
		var gheight = 40 - (height23);
		var yColUpHeight = -15 + (height23);
		var yColDownHeight = 130 - (height23);
		//alert("yRowUpHeight: "+yRowUpHeight+ "yRowDownHeight: "+yRowDownHeight);
		
		
		if (graphHeight > 140) {
			var graphTransformHgt = "translate(20," + gheight + ")";
			var yColNode1 = "m 50,"+ yColUpHeight + " 0,"+ yColDownHeight;
			var yColNode2 = "m 180,"+ yColUpHeight + " 0,"+ yColDownHeight;
			var yColNode3 = "m 310,"+ yColUpHeight + " 0,"+ yColDownHeight;
			var yColNode4 = "m 440,"+ yColUpHeight + " 0,"+ yColDownHeight;
			
			var svgNode = XmlUtil.find(xmlNode, "id", "svgId");
			XmlUtil.attr(svgNode, "height", graphHeight);

			var gNode = XmlUtil.find(xmlNode, "id", "gId");
			XmlUtil.attr(gNode, "transform", graphTransformHgt);
			
			var yCol1 = XmlUtil.find(xmlNode, "id", "yCol1");
			XmlUtil.attr(yCol1, "d", yColNode1);
			
			var yCol2 = XmlUtil.find(xmlNode, "id", "yCol2");
			XmlUtil.attr(yCol2, "d", yColNode2);
			
			var yCol3 = XmlUtil.find(xmlNode, "id", "yCol3");
			XmlUtil.attr(yCol3, "d", yColNode3);
			
			var yCol4 = XmlUtil.find(xmlNode, "id", "yCol4");
			XmlUtil.attr(yCol4, "d", yColNode4);
		}

		var subNode = XmlUtil.find(xmlNode, "id", "yminId");
		XmlUtil.attr(subNode, "d", pathNode);
		// alert(XmlUtil.xmlToString(subNode));

		var subNode1 = XmlUtil.find(xmlNode, "id", "yminId1");
		XmlUtil.attr(subNode1, "d", pathNode1);

		var subNode2 = XmlUtil.find(xmlNode, "id", "yminId2");
		XmlUtil.attr(subNode2, "d", pathNode2);

		var rectNode1 = XmlUtil.find(xmlNode, "id", "rect1");
		XmlUtil.attr(rectNode1, "y", height1);
		XmlUtil.attr(rectNode1, "height", 100 - height1);

		var rectNode2 = XmlUtil.find(xmlNode, "id", "rect2");
		XmlUtil.attr(rectNode2, "y", height23);
		XmlUtil.attr(rectNode2, "height", 100 - height23);

		var rectNode3 = XmlUtil.find(xmlNode, "id", "rect3");
		XmlUtil.attr(rectNode3, "y", height23);
		XmlUtil.attr(rectNode3, "height", 100 - height23);

		var scaleNode2 = XmlUtil.find(xmlNode, "id", "label1");
		XmlUtil.attr(scaleNode2, "y", height1 - 5);
		XmlUtil.text(scaleNode2, doseTextBoxValue + ' MG');

		var scaleNode1 = XmlUtil.find(xmlNode, "id", "label2");
		XmlUtil.attr(scaleNode1, "y", height23 - 5);
		XmlUtil.text(scaleNode1, parseInt(doseTextBoxValue) * often + ' MG');

		var scaleNode3 = XmlUtil.find(xmlNode, "id", "label3");
		XmlUtil.attr(scaleNode3, "y", height23 - 5);
		
		var scaleNode4 = XmlUtil.find(xmlNode, "id", "label4");
		XmlUtil.attr(scaleNode4, "y", height23 );

		$("#subId-" + message.id).html(XmlUtil.xmlToString(xmlNode));
	}
	;
};
