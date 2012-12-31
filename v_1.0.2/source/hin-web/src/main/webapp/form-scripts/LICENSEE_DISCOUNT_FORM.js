function LICENSEE_DISCOUNT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.chargeHandler = chargeHandler;
	this.fillcharge = fillcharge;
	this.discountAmountHandler = discountAmountHandler;
	this.fillDiscountAmount = fillDiscountAmount;
	this.option = "";
	this.discountAmount = 0;
	this.interestAmount = 0;

	function initialize() {

		try {

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			var message = thisObject.message;
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			var licenseeNewServicePage = page.stepPage;
			$("#inner-uiform-" + message.id).find(
					'input[id=MOInplaceDisplayValue]').bind('change',
					licenseeNewServicePage.calculateTotal());
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("charge",
						"chargeListener", chargeHandler);
				message.messageAndUIBinder.addEditorListener("discount",
						"discountAmountListener", discountAmountHandler);
			}

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function chargeHandler() {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var object = new Object();
		page
				.getMessageScript(thisObject.message, object,
						thisObject.fillcharge);
	}

	function fillcharge(messageTypeScript, object, message) {
		var extension = "";
		var options = $("#inner-uiform-" + message.id).find('#select-choice')
				.find('option');
		$("#inner-uiform-" + message.id).find('select option:selected').each(
				function() {
					extension = $(this).val();
				});
		messageTypeScript.fillData('charge', extension);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var licenseeNewServicePage = page.stepPage;
		licenseeNewServicePage.calculateTotal();
	}
	;

	function discountAmountHandler() {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var object = new Object();
		page.getMessageScript(message, object, thisObject.fillDiscountAmount);

	}
	;

	function fillDiscountAmount(messageTypeScript) {
		var amount = $("#inner-uiform-" + message.id).find(
				'#MOInplaceDisplayValue').val();
		messageTypeScript.fillData('amt', amount);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var licenseeNewServicePage = page.stepPage;
		licenseeNewServicePage.calculateTotal();
	}
	;

};