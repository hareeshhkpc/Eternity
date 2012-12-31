function LICENSEE_OUTSTANDING_INVOICES_FORM(message, appController, uiGenerator) {
	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;
	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.accountBalanceListenerHandler = accountBalanceListenerHandler;

	function initialize() {

		try {

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			getAmountDetails();
			accountBalanceFormLoadComplete();

			var uiGenerator = thisObject.uiGenerator;
			// alert("UIgenerator: " + uiGenerator.instanceId);
			// createDiscountRow('footer-' + uiGenerator.instanceId);
			/*
			 * $('fieldset[amountParent=payment]').find('input[tagName=amt]')
			 * .unbind('keyup', addTotal);
			 * $('fieldset[amountParent=payment]').find('input[tagName=amt]')
			 * .bind('keyup', addTotal);
			 */

			if (message.messageAndUIBinder) {
				message.messageAndUIBinder
						.addEditorListener("discount",
								"discountAmountListener",
								accountBalanceListenerHandler);
			}

			/*
			 * if (amount) { alert("amount:" + amount); $("#inner-uiform-" +
			 * message.id).find("#MOInplaceDisplayValue") .trigger('change'); }
			 */
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			alert("Unload form");

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function accountBalanceListenerHandler() {
		alert("In accountBalanceListenerHandler");
	}

	function accountBalanceFormLoadComplete() {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var licenseePaymentPage = page.stepPage;
		/*
		 * var totalDueAmount = $("#inner-uiform-" + message.id).find(
		 * "#MOInplaceDisplayValue").val();
		 */
		var currentDueAmount = $("#inner-uiform-" + message.id).find(
				"#currentDue").val();

		var amount30daysOld = $("#inner-uiform-" + message.id).find("#30days")
				.val();
		var amount60daysOld = $("#inner-uiform-" + message.id).find("#60days")
				.val();
		var amount90daysOld = $("#inner-uiform-" + message.id).find("#90days")
				.val();
		
		//alert("90: " + licenseePaymentPage.above90 +" :60: "+ licenseePaymentPage.above60 + " :30: " +licenseePaymentPage.above30 + " :b30: " + licenseePaymentPage.below30);
		var totalDueAmount = licenseePaymentPage.above90 + licenseePaymentPage.above60
				+ licenseePaymentPage.above30 + licenseePaymentPage.below30;
		//alert(totalDueAmount);
		//licenseePaymentPage.totalInvoiceAmount += parseFloat(totalDueAmount);
		$('fieldset[amountParent=LicenseeOutstandingAccountBalance]').find('input[tagName=amt]')
				.val(totalDueAmount.toFixed(4));
		$('#90days').val(licenseePaymentPage.above90.toFixed(4));
		$('#60days').val(licenseePaymentPage.above60.toFixed(4));
		$('#30days').val(licenseePaymentPage.above30.toFixed(4));
		$('#currentDue').val(licenseePaymentPage.below30.toFixed(4));
		
	/*	var licenseeVO = appController.getComponent("Context").getLicenseeVO();
		if(licenseeVO){
			appController.getComponent("DataLayer").currencyConvert(totalDueAmount, "",
					licenseeVO.currencyCode, licenseeVO.exchangeRate, function(data) {
				$('fieldset[amountParent=LicenseeOutstandingAccountBalance]').find('#cvtAmt').text(data.toFixed(4) + " " + licenseeVO.currencySymbol);
			});
		}*/

	}

	function getAmountDetails() {
		var messageId = message.messageId;
		// alert("MESSAGEID: " + messageId)
		var msg = licenseePaymentPage.appController.getComponent("DataLayer")
				.getMsg(messageId);
		// alert("MESSAGE: " + XmlUtil.xmlToString(msg.getXML()));
		var dateTime = XmlUtil.getXPathResult(msg.getXML(),
				'message/FIAB_MT020000HT02/effectiveTime/value',
				XPathResult.STRING_TYPE);
		var messageDate = dateTime.stringValue;
		var arrayDate = messageDate.split(" ");
		messageDate = arrayDate[0];

		var amount = XmlUtil.getXPathResult(msg.getXML(),
				'message/FIAB_MT020000HT02/amt[1]/value',
				XPathResult.STRING_TYPE);

		var amount = amount.stringValue;
		messageDate = new Date(messageDate);
		// alert("messageDate: " + messageDate);
		
		
		var presentDate = currentDate();
		presentDate = new Date(presentDate);

		var dateDiff = inDays(messageDate, presentDate);
		if (dateDiff >= 90) {
			licenseePaymentPage.above90 += parseFloat(amount);
		} else if (dateDiff >= 60 && dateDiff < 90) {
			licenseePaymentPage.above60 += parseFloat(amount);
		} else if (dateDiff >= 30 && dateDiff < 60) {
			licenseePaymentPage.above30 += parseFloat(amount);
			licenseePaymentPage.above30.toFixed(4);
		} else if (dateDiff < 30) {
			licenseePaymentPage.below30 += parseFloat(amount);
			licenseePaymentPage.below30.toFixed(4);
		}
	}

	function currentDate() {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var day = (day < 10) ? '0' + day : day;
		var month = (month < 10) ? '0' + month : month;
		var fullDate = year + '-' + month + '-' + day;
		return fullDate;
	}

	function inDays(d1, d2) {

		var t1 = d1.getTime();
		var t2 = d2.getTime();

		return parseInt((t2 - t1) / (24 * 3600 * 1000));

	}

};