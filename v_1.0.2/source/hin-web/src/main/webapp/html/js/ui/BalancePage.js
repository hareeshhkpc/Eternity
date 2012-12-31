var HIN;
if (!HIN)
	HIN = {};
HIN.BalancePage = function(appController, pageHolder) {
	balancePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.page = null;
	this.selectedStep = null;
	this.pageHolder = "balancePage";// pageHolder;
	this.invoiceID = null;
	this.invoiceAmount = 0;
	this.discountAmount = 0;
	this.interestAmount = 0;
	this.showTotalText = false;
	this.totalDebitAmount = 0.0;
};

HIN.BalancePage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.BalancePage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.hideAddIcon();
	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.actions = false;
	uiGenerator.finish = false;
	uiGenerator.taskHandler = balancePage.taskHandler;
	// alert("messageType" + messageType.typeName);
	if (messageType.typeName == "Balance") {
		var messages = messageType.getMessages();
		/* alert(messages.length); */
		for ( var index = 0; index < messages.length; index++) {
			var message = messages[index];
			if (message.transactionType == "Invoice") {
				// alert(message.transactionType);
				message.messageForm = "BALANCE_FORM";
			}
		}

		uiGenerator.tableHeaders = balancePage.getBalanceHeader();

	}

};

HIN.BalancePage.prototype.pageAfterLoad = function(page) {
	var sum = 0;
	$('fieldset[amountParent=debit]').find('input[tagName=amt]').each(
			function() {
				sum = sum + parseFloat($(this).val());
			});
	$('#totalDebit').val(sum);

	sum = 0;
	$('fieldset[amountParent=credit]').find('input[tagName=amt]').each(
			function() {
				sum = sum + parseFloat($(this).val());
			});
	$('#totalCredit').val(sum);

};
HIN.BalancePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.BalancePage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {
	// alert("transactionType" + message.transactionType);

	if (message.transactionType == AppConstants.TransactionType.INVOICE) {
		// alert("inside invoice");
		balancePage.calculateDiscount(message);
	}

	if (messageType.typeName == "Balance") {
		uiGenerator.actions = true;
		if (!this.showTotalText) {
			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;width:100%">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:67.3%;"><label class="ui-total-label">Balance</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:15%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="totalDebit"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" value="0" /></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:15%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="totalCredit"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" value="0" /></div></fieldset>';
			$('#footer-' + uiGenerator.instanceId).append(totalBlock);
			this.showTotalText = true;
		}
	}
};

HIN.BalancePage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.BalancePage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

/*
 * HIN.BalancePage.prototype.taskHandler = function(message, taskVO, instance) { //
 * alert("taskHandler"); };
 */

HIN.BalancePage.prototype.taskHandler = function(message, taskVO, instance) {
	return;
};

HIN.BalancePage.prototype.singleHandler = function(typeName, instance) {

};

HIN.BalancePage.prototype.getBalanceHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-c ui-accounting-box" style="width: 100%"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="width:24%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:41.4%">Description</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">Debit</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%;float:left;">Credit</div> ';
	return tableHeader;
};
HIN.BalancePage.prototype.calculateDiscount = function(message) {
	var invoiceAmount = XmlUtil.getXPathResult(message.msg.getXML(),
			'message/FIAB_MT020000HT02/amt[1]/value', XPathResult.STRING_TYPE);
	var finalAmount = balancePage.getDiscountAndInterestAmount(
			message.messageId, invoiceAmount.stringValue);
	// alert("finalAmount" + finalAmount);
	$('#inner-uiform-' + message.id).find('input[tagName=amt]')
			.val(finalAmount);
};

HIN.BalancePage.prototype.getDiscountAndInterestAmount = function(invoiceId,
		invoiceAmount) {
	var discountArray = balancePage.getDiscountMessages();
	var discountAmount = 0;
	var interestAmount = 0;
	var extension = "";
	for (index in discountArray) {		
		var message = XmlUtil.stringToXml(discountArray[index]);		
		try {
			extension = XmlUtil.getXPathResult(message,
					"//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
					XPathResult.STRING_TYPE);
		} catch (e) {
			alert("error" + e)
		}
		/*alert("invoiceId" + invoiceId + "extension.stringValue"
				+ extension.stringValue);*/
		if (invoiceId == extension.stringValue) {
			// alert("equal" + invoiceId + "invoiceId2" + extension);
			var chargeType = XmlUtil
					.getXPathResult(
							message,
							'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
							XPathResult.STRING_TYPE);
			var amount = XmlUtil
					.getXPathResult(
							message,
							'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
							XPathResult.STRING_TYPE);
			// alert("chargeType=" + chargeType.stringValue);
			// alert("discountamt=" + parseFloat(amount.stringValue));
			if (chargeType.stringValue == "Discount") {
				discountAmount += parseFloat(amount.stringValue);
			}
			if (chargeType.stringValue == "Interest") {
				interestAmount += parseFloat(amount.stringValue);
			}
		}
	}
	var finalAmount = (invoiceAmount - discountAmount) + interestAmount;
	return finalAmount;

};

HIN.BalancePage.prototype.getDiscountMessages = function() {
	var discountArray = new Array();	
	var messageTypes = balancePage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];			
			// alert("message.transactionType" + message.transactionType);
			if (message.transactionType == AppConstants.TransactionStatus.DISCOUNT) {
				if (XmlUtil.xmlToString(message.message) !=undefined && XmlUtil.xmlToString(message.message)!=null){					
					discountArray.push(XmlUtil.xmlToString(message.message));
				}
				else{					
					discountArray.push(message.message);
				}
			}

		}
	}	
	return discountArray;

};
