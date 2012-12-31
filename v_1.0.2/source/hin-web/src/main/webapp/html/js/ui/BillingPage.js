var HIN;
if (!HIN)
	HIN = {};
HIN.BillingPage = function(appController, pageHolder) {
	billingPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.page = null;
	this.selectedStep = null;
	this.pageHolder = "billingPage";// pageHolder;
	this.discountComboRender = false;
	this.discountRowRendered = false;
	this.invoiceID = null;
	this.invoiceAmount = 0;
	this.showTotalText = false;
	this.discountAmount = 0;
	this.interestAmount = 0;
};

HIN.BillingPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.BillingPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {

	// alert("BillingPage pageBeforeLoad : " + uiGenerator);
	// uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	// uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.finishTitleOnly = true;
	/*
	 * $('#uiform-sub-head' + uiGenerator.instanceId) .append( '<div id="aaaa"
	 * style="float:right;width:100%;border:0px solid #000000;padding:0px"><input
	 * type="text" id="billingPageTotalAmount" value="0"/></div>');
	 */

	// uiGenerator.singleButton = true;
	// alert("MessageTypeName: " + messageType.typeName);
	messageType.headerView = false;
	uiGenerator.actions = false;
	if (messageType.typeName == "UnpaidInvoice"
			|| messageType.typeName.indexOf("UnpaidInvoice-") > -1) {
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			messages[messageIndex].title = messageType.typeName;
		}
		// alert(messageType.typeName);
		if (messages.length == 0) {
			messageType.headerView = false;
		} else {
			messageType.headerView = true;
			uiGenerator.showAddIcon();
		}

		uiGenerator.showRemoveIcon();
		uiGenerator.actions = true;
		uiGenerator.customRenderer = true;
		uiGenerator.customRendererForm = "DISCOUNT_FORM";
		uiGenerator.tableHeaders = billingPage.getInvoiceHeader();
		uiGenerator.customTitleRenderer = true;
		uiGenerator.customTitle = "Discount";
	} else if (messageType.typeName == "Accounthistory") {
		messageType.headerView = true;
		// alert("Account History");
		uiGenerator.actions = false;
		/*
		 * uiGenerator.tableFormat = false; uiGenerator.formRender = false;
		 */
		uiGenerator.hideAddIcon();
		uiGenerator.tableHeaders = billingPage.getHistoryHeader();
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			messages[messageIndex].readOnly = true;
		}

	}

};

HIN.BillingPage.prototype.pageAfterLoad = function(page) {
	var messageTypes = billingPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			var invoiceAmount = XmlUtil.getXPathResult(message.message,
					'message/FIAB_MT020000HT02/amt[1]/value',
					XPathResult.STRING_TYPE);
			var invoiceAmount = invoiceAmount.stringValue;
			billingPage.loadComplete(message.id, invoiceAmount);
		}
	}

};
HIN.BillingPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.BillingPage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {

	var temp = messageType.typeName;
	var invoiceId = null;
	if (addNew) {
		var messages = messageType.getMessages();
		if (messages && messages.length > 0) {
			var unpaidMessage = messages[0];
			unpaidMessage.addDependendMessage(message);
		}
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (messageIndex == 0) {
				unpaidMessage = message;
				invoiceId = billingPage.getInvoiceID(unpaidMessage);
			} else {

				var messageAndUIBinder = new MessageAndUIBinder(null,
						message.msg, message.msg.getConfig().getArtifactId());
				messageAndUIBinder.updateId("INVOICE_ID", invoiceId);
				messageAndUIBinder.updateId("TRANSACTION_TYPE",
						AppConstants.TransactionStatus.DISCOUNT);
				messageAndUIBinder.updateId("TRANSACTION_STATUS", "UNPAID");
				message.transactionType = "DISCOUNT";

			}
		}
	}

	if (billingPage.invoiceMessageTypeName != temp) {
		billingPage.showTotalText = true;
	}
	if (!addNew && billingPage.showTotalText && temp != "Accounthistory") {
		billingPage.invoiceMessageTypeName = temp;
		var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
		totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
		totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="invoiceDiscountAmount'
				+ temp
				+ '"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';
		$('#footer-' + uiGenerator.instanceId).append(totalBlock);
		billingPage.showTotalText = false;
	}

};

HIN.BillingPage.prototype.removeCompleteHandler = function(messageType, message) {
	// alert("removeCompleteHandler");
};

HIN.BillingPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

/*
 * HIN.BillingPage.prototype.taskHandler = function(message, taskVO, instance) { //
 * alert("taskHandler"); };
 */

HIN.BillingPage.prototype.getInvoiceHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box" style="width: 100%"> ';
	/*
	 * tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	 * tableHeader += 'style="width:3%"><input type="checkbox" data-role="none"
	 * id="chkhead" value="" /></div>';
	 */
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:29%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:10%">Age</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:41.3%">Comments</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.1%">Amount</div> ';
	return tableHeader;
}

HIN.BillingPage.prototype.getHistoryHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box" style="width: 100%"> ';
	/*
	 * tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	 * tableHeader += 'style="width:3%"><input type="checkbox" data-role="none"
	 * id="chkhead" value="" /></div>';
	 */
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:29.7%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:32.7%">Comments</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:18.8%">Status</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:11.8%">Amount</div> ';
	return tableHeader;
}

HIN.BillingPage.prototype.messageCreated = function(newMessage, conceptLookup,
		message) {

	billingPage.page.getMessageScript(newMessage, null,
			billingPage.createInvoiceMessage);

}

HIN.BillingPage.prototype.createInvoiceMessage = function(messageTypeScript,
		object, newMessage) {

	var services = [];
	var serviceValue = $('#selectDiscount').val();
	var disAmt = $('#disAmt').val();
	services.push({
		concept : serviceValue,
		description : serviceValue,
	});

	messageTypeScript.initialize();
	messageTypeScript.fillData('service', services);
	messageTypeScript.fillData('amt', disAmt);
	messageTypeScript.fillData('transactionType', serviceValue);
	var messageAndUIBinder = new MessageAndUIBinder(null, newMessage.msg,
			newMessage.msg.getConfig().getArtifactId());
	messageAndUIBinder.updateId("INVOICE_ID", billingPage.invoiceID);
	// alert("INVOICE MESSAGE: " +
	// XmlUtil.xmlToString(newMessage.msg.getXML()));

}

HIN.BillingPage.prototype.taskHandler = function(message, taskVO, instance) {
	return;
};

HIN.BillingPage.prototype.singleHandler = function(typeName, instance) {

	var messageObjects = [];
	var unpaidInvoiceAmount = 0;
	var unpaidMessage = null;
	var messageTypes = billingPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		billingPage.discountAmount = 0;
		billingPage.interestAmount = 0;
		if (messageTypes[messageTypeIndex].typeName
				.indexOf("UnpaidInvoice-No-") > -1
				&& messageTypes[messageTypeIndex].typeName != "Accounthistory") {
			messageType = messageTypes[messageTypeIndex];
			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				if (messageIndex == 0) {
					unpaidMessage = message;
					var invoiceMsg = billingPage.appController.getComponent(
							"DataLayer").getMsg(message.messageId);
					unpaidInvoiceAmount = XmlUtil.getXPathResult(invoiceMsg
							.getXML(),
							'//message/FIAB_MT020000HT02/amt[1]/value',
							XPathResult.STRING_TYPE);
				}

				if (message.transactionType == "DISCOUNT") {
					var dependentMessage = message;
					var msg = billingPage.appController.getComponent(
							"DataLayer").getMsg(dependentMessage.messageId);
					var chargeType = XmlUtil
							.getXPathResult(
									dependentMessage.msg.getXML(),
									'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
									XPathResult.STRING_TYPE);
					var amount = XmlUtil
							.getXPathResult(
									dependentMessage.msg.getXML(),
									'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
									XPathResult.STRING_TYPE);

					if (chargeType.stringValue == "Discount") {
						billingPage.discountAmount += parseInt(amount.stringValue);
					}
					if (chargeType.stringValue == "Interest") {
						billingPage.interestAmount += parseInt(amount.stringValue);
					}

				}

			}
			var finalAmount = ((parseInt(unpaidInvoiceAmount.stringValue) + parseInt(billingPage.interestAmount)) - parseInt(billingPage.discountAmount));
			var messageAndUIBinder = new MessageAndUIBinder(null,
					unpaidMessage.msg, unpaidMessage.msg.getConfig()
							.getArtifactId());
			messageAndUIBinder.updateId("INVOICE_AMOUNT", finalAmount);
			messageObjects.push(unpaidMessage);
		}

	}
	if (messageObjects.length > 0) {
		var parameters = [ messageObjects ];
		billingPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}
};

HIN.BillingPage.prototype.getInvoiceID = function(unpaidMessage) {

	var message = unpaidMessage;
	// alert("Message xml : " + XmlUtil.xmlToString(message.message));

	component = XmlUtil.getXPathResult(message.message,
			"message/FIAB_MT020000HT02");
	if (component) {
		var comp = component.iterateNext();
	}
	components = XmlUtil.findByName(comp, "component", false);

	sids = XmlUtil.findByName(comp, "id", false);

	for (i = 0; i < components.length; i++) {

		var searchID = XmlUtil.findByName(sids[i], "root", true);

		var extension = XmlUtil.findByName(sids[i], "extension", true);

		var idValue = XmlUtil.text(searchID);
		var extensionValue = XmlUtil.text(extension);

		if (idValue == 'HIN_MSG_ID') {
			return extensionValue;
		}
	}

};

HIN.BillingPage.prototype.inDays = function(d1, d2) {
	var t2 = d2.getTime();
	var t1 = d1.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000));
}

HIN.BillingPage.prototype.inWeeks = function(d1, d2) {
	var t2 = d2.getTime();
	var t1 = d1.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
}

HIN.BillingPage.prototype.inMonths = function(d1, d2) {
	var d1Y = d1.getFullYear();
	var d2Y = d2.getFullYear();
	var d1M = d1.getMonth();
	var d2M = d2.getMonth();

	return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
}

HIN.BillingPage.prototype.inYears = function(d1, d2) {
	return d2.getFullYear() - d1.getFullYear();
}
HIN.BillingPage.prototype.loadComplete = function(id, invoiceAmount) {

	var sum = invoiceAmount;

	$('fieldset[amountParent=invoice]').find('input[tagname=amt]').each(
			function() {
				if (this.value) {
					$(this).parents('[amountParent=invoice]').find(
							'input[tagname=amt]').val(
							parseFloat(this.value).toFixed(2));
				}
			});

	$('fieldset[amountParent=invoice]').find('input[tagname=effectiveTime]')
			.each(
					function() {
						if (this.value) {
							try{
							var dString = this.value;
							var age = $.cuteTime(dString);
							$(this).parents('[amountParent=invoice]').find(
									'input[id=invoiceAge]').val(age);
							}catch(error){
								console.log("Error in billing age calculation. Method loadComplete :"+error);
							}
						}
					})

	// discount on change

	$('#selectDiscount').change(function() {

		var discountAmount = parseInt($('#disAmt').val());
		if (discountAmount) {
			if (this.value == 'DISCOUNT') {
				var netAmt = parseInt(sum - discountAmount);
			} else {
				var netAmt = parseInt(sum) + parseInt(discountAmount);
			}
			$('#disTotalAmt').val(netAmt);
		} else {
			$('#disTotalAmt').val(null);
		}
	})

	$('#disAmt').keyup(function() {

		var selectType = $('#selectDiscount').val();
		var discountAmount = parseInt($('#disAmt').val());
		// alert(selectType)
		if (!isNaN(discountAmount)) {
			if (selectType) {
				if (selectType == 'DISCOUNT') {
					var netAmt = parseInt(sum - discountAmount);
				} else {
					var netAmt = parseInt(sum) + parseInt(discountAmount);
				}
				$('#disTotalAmt').val(netAmt);
			}
		} else {
			$('#disTotalAmt').val(null);
		}
	})

}
