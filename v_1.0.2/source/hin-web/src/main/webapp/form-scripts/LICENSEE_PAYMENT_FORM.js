function LICENSEE_PAYMENT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;
	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.addTotal = addTotal;

	function initialize() {

		try {
			// alert("initialize : " + thisObject.uiGenerator);

			/*
			 * if (thisObject.uiGenerator) thisObject.uiGenerator.tableHeaders =
			 * thisObject .getServiceTableHeader();
			 */
		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {	
			var uiGenerator = thisObject.uiGenerator;
			// alert("UIgenerator: " + uiGenerator.instanceId);
			// createDiscountRow('footer-' + uiGenerator.instanceId);
			$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('input[tagName=amt]')
					.unbind('keyup', addTotal);
			$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('input[tagName=amt]')
					.bind('keyup', addTotal);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			//alert("Unload form");

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function addTotal() {
		var sum = 0;
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').each(
				function() {
					sum = sum + parseFloat($(this).val());
				});
		$('#total').val(sum);
		var licenseeVO = appController.getComponent("Context").getLicenseeVO();
		if(licenseeVO){
				var data = parseFloat($(this).val()) * parseFloat(licenseeVO.exchangeRate);
			//appController.getComponent("DataLayer").currencyConvert($(this).val(), "USD", licenseeVO.currencyCode, licenseeVO.exchangeRate, function(data) {
				$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('#UsdAmt').text(data.toFixed(2) + " " + licenseeVO.currencyCode);
			//});
		}	
	}
	;

};