function ACCOUNT_BALANCE_FORM(message, appController, uiGenerator) {
	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;
	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.accountBalanceFormLoadComplete = accountBalanceFormLoadComplete;
	this.getAmountDetails = getAmountDetails;
	this.currentDate = currentDate;
	this.inDays=inDays;

	function initialize() {

		try {

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			/*
			 * getAmountDetails(); accountBalanceFormLoadComplete();
			 */
			var uiGenerator = thisObject.uiGenerator;
			// alert("UIgenerator: " + uiGenerator.instanceId);
			// createDiscountRow('footer-' + uiGenerator.instanceId);
			/*
			 * $('fieldset[amountParent=payment]').find('input[tagName=amt]')
			 * .unbind('keyup', addTotal);
			 * $('fieldset[amountParent=payment]').find('input[tagName=amt]')
			 * .bind('keyup', addTotal);
			 */
			/*
			 * if (message.messageAndUIBinder) { message.messageAndUIBinder
			 * .addEditorListener("discount", "discountAmountListener",
			 * accountBalanceListenerHandler); }
			 */

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
			/* alert("Unload form"); */

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function accountBalanceFormLoadComplete() {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var collectionPage = page.stepPage;
		/*
		 * var totalDueAmount = $("#inner-uiform-" + message.id).find(
		 * "#MOInplaceDisplayValue").val();
		 */
		// alert("1: " + totalDueAmount);
		var currentDueAmount = $("#inner-uiform-" + message.id).find(
				"#currentDue").val();

		var amount30daysOld = $("#inner-uiform-" + message.id).find("#30days")
				.val();
		var amount60daysOld = $("#inner-uiform-" + message.id).find("#60days")
				.val();
		var amount90daysOld = $("#inner-uiform-" + message.id).find("#90days")
				.val();

		// alert("90: " + collectionPage.above90 +" :60: "+
		// collectionPage.above60 + " :30: " +collectionPage.above30 + " :b30: "
		// + collectionPage.below30);
		var totalDueAmount = collectionPage.above90 + collectionPage.above60
				+ collectionPage.above30 + collectionPage.below30;
		// alert(totalDueAmount);
		// collectionPage.totalInvoiceAmount += parseFloat(totalDueAmount);
		$('fieldset[amountParent=accountBalance]').find('input[tagName=amt]')
				.val(totalDueAmount.toFixed(2));
		$('#90days').val(collectionPage.above90.toFixed(2));
		$('#60days').val(collectionPage.above60.toFixed(2));
		$('#30days').val(collectionPage.above30.toFixed(2));
		$('#currentDue').val(collectionPage.below30.toFixed(2));

	}

	function getAmountDetails() {
		var messageId = message.messageId;
		// alert("MESSAGEID: " + messageId)
		var msg = collectionPage.appController.getComponent("DataLayer")
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

		var presentDate = currentDate();
		presentDate = new Date(presentDate);

		var dateDiff = inDays(messageDate, presentDate);

		if (dateDiff >= 90) {
			collectionPage.above90 += parseFloat(amount);
		} else if (dateDiff >= 60 && dateDiff < 90) {
			collectionPage.above60 += parseFloat(amount);
		} else if (dateDiff >= 30 && dateDiff < 60) {
			collectionPage.above30 += parseFloat(amount);
			collectionPage.above30.toFixed(2);
		} else if (dateDiff < 30) {
			collectionPage.below30 += parseFloat(amount);
			collectionPage.below30.toFixed(2);
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