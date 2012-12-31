function DISCOUNT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.chargeHandler = chargeHandler;
	this.fillcharge = fillcharge;
	this.discountAmountHandler = discountAmountHandler;
	this.fillDiscountAmount = fillDiscountAmount;
	this.summerFunction = summerFunction;
	this.getDiscountAmount = getDiscountAmount;
	this.getInterestAmount = getInterestAmount;
	this.onComboChange = onComboChange;
	this.discountTotal = discountTotal;
	this.option = "";
	this.discountAmount = 0;
	this.interestAmount = 0;

	function initialize() {

		try {

			/* alert("initialize : " + thisObject.uiGenerator); */

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

			/* alert("Onload..."); */

			var uiGenerator = thisObject.uiGenerator;
			var message = thisObject.message;
			//alert("message.addNew" + message.addNew);
			/*if (!message.addNew) {
				$("#inner-uiform-" + message.id).find('select option:selected')
						.each(
								function() {
									var value = $(this).val();
									$("#inner-uiform-" + message.id).find(
											'input[tagname=netAmt]').attr(
											'discountType', value);
								});

				thisObject.discountTotal();
			}*/

			// alert(message);
			/* summerFunction(); */
			/*
			 * $("#inner-uiform-" + message.id).find(
			 * 'input[id=MOInplaceDisplayValue]').unbind('keyup',
			 * summerFunction); $("#inner-uiform-" + message.id).find(
			 * 'input[id=MOInplaceDisplayValue]').bind('keyup', summerFunction);
			 */

			$("#inner-uiform-" + message.id).find('select[id=select-choice0]')
					.unbind('change', onComboChange);
			$("#inner-uiform-" + message.id).find('select[id=select-choice0]')
					.bind('change', onComboChange);

			$("#inner-uiform-" + message.id).find(
					'input[id=MOInplaceDisplayValue]').unbind('keyup',
					discountTotal);
			$("#inner-uiform-" + message.id).find(
					'input[id=MOInplaceDisplayValue]').bind('keyup',
					discountTotal);

			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("charge",
						"chargeListener", chargeHandler);
				message.messageAndUIBinder.addEditorListener("discount",
						"discountAmountListener", discountAmountHandler);
			}

			// createDiscountRow('footer-' + uiGenerator.instanceId);
			// createDiscountRow(message.id);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			/* alert("Unload form") */
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
	}
	;

	function discountAmountHandler() {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var object = new Object();
		page.getMessageScript(thisObject.message, object,
				thisObject.fillDiscountAmount);

	}
	;

	function fillDiscountAmount(messageTypeScript, object, message) {
		var amount = $("#inner-uiform-" + message.id).find(
				'#MOInplaceDisplayValue').val();
		messageTypeScript.fillData('amt', amount);
	}
	;
	function summerFunction() {
	}
	;

	function getDiscountAmount(discountMessage) {
		var amt = XmlUtil
				.getXPathResult(
						discountMessage.message,
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
						XPathResult.STRING_TYPE);
		var chargeType = XmlUtil
				.getXPathResult(
						discountMessage.message,
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
						XPathResult.STRING_TYPE);
		// alert("chargeType" + chargeType.stringValue);
		if (chargeType.stringValue == "Discount") {
			// alert("discount");
			thisObject.discountAmount += parseInt(amt.stringValue);
			// alert("discountAmount" + discountAmount);

		} else if (chargeType.stringValue == "Interest") {
			// alert("Interest");
			thisObject.interestAmount += parseInt(amt.stringValue);
			// alert("interestAmount" + interestAmount);

		}

		// alert(amt.stringValue);
		return parseInt(amt.stringValue);

	}
	;

	function onComboChange() {
		var value = $(this).val();
		// var parentDiv =$(this).closest('[wrapper="true"]')[0];
		$("#inner-uiform-" + message.id).find('input[tagname=netAmt]').attr(
				'discountType', value);
		discountTotal();

	}
	;

	function discountTotal() {
		var invoiceAmount = 0;
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var invoiceId = XmlUtil.getXPathResult(thisObject.message.message,
				'//FIAB_MT020000HT02/id[4]/extension', XPathResult.STRING_TYPE);
		var msg = appController.getComponent("DataLayer").getMsg(
				invoiceId.stringValue);
		if (msg) {
			var amt = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/amt[1]/value',
					XPathResult.STRING_TYPE);
			invoiceAmount = parseFloat(amt.stringValue);

			var invoicemessageType = thisObject.message.messageTypeName;
			var discountAmount = 0;
			var interestAmount = 0;
			var appliedDiscountAmount = 0;
			$("#uiform-sub-head" + thisObject.uiGenerator.instanceId).find(
					'input[tagName=netAmt]').each(function() {
				var amountValue = 0;
				if ($(this).val())
					amountValue = $(this).val();

				var discountType = $(this).attr('discounttype');
				if (discountType == "Discount") {
					discountAmount += parseFloat(amountValue);
				}
				if (discountType == "Interest") {
					interestAmount += parseFloat(amountValue);
				}

			});
			// accountPage.discountAmount = discountAmount;
			// accountPage.interestAmount = interestAmount;
			if (parseFloat(discountAmount) > parseFloat(invoiceAmount)) {
				discountAmount = invoiceAmount;
				appController
						.getComponent("RenderingEngine")
						.openPromptModalDialog(
								"Discount amount is greater than invoice amount",
								function(result) {
									// alert(result);
								});
			}
			appliedDiscountAmount = ((parseFloat(invoiceAmount) + parseFloat(interestAmount)) - parseFloat(discountAmount));
			$('#invoiceDiscountAmount' + invoicemessageType).val(
					parseFloat(appliedDiscountAmount).toFixed(2));
		}
	}
	;
	function getInterestAmount() {
	}
	;

	/*
	 * function getSelectOption(){ alert("sss"+$(this).val(); };
	 */

};