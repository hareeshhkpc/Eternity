var HIN;
if (!HIN)
	HIN = {};
HIN.LicenseePaymentPage = function(appController, pageHolder) {
	licenseePaymentPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "licenseePaymentPage";// pageHolder;
	this.showTotalText = false;
	this.totalInvoiceAmount = 0;
	this.messageObjects = [];
	this.above90 = 0;
	this.above60 = 0;
	this.above30 = 0;
	this.below30 = 0;
	this.processUpdate = true;
	this.finishClicked = false;
};

HIN.LicenseePaymentPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.LicenseePaymentPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {

	// alert("LicenseePaymentPage pageBeforeLoad : " + uiGenerator);
	// uiGenerator.hideMainHeader();
	// uiGenerator.hideAddIcon();
	// uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.actions = false;
	uiGenerator.finishTitleOnly = true;
	uiGenerator.taskHandler = licenseePaymentPage.taskHandler;
	// alert("MessageTypeName: " + messageType.typeName);
	if (messageType.typeName == "OutstandingInvoices") {
		uiGenerator.actions = false;
		uiGenerator.tableHeaders = licenseePaymentPage
				.getAccountBalanceHeader();
		uiGenerator.hideAddIcon();
		uiGenerator.hideRemoveIcon();

		// uiGenerator.hideSubHeader();
	} else if (messageType.typeName == "NewPayment") {
		uiGenerator.actions = true;
		uiGenerator.tableHeaders = licenseePaymentPage.getNewPaymentHeader();

	} else { // alert("Empyt");

	}

};

HIN.LicenseePaymentPage.prototype.pageAfterLoad = function(page) {

	var messages = licenseePaymentPage.processDefinition.getStep("Step5")
			.getMessageTypeByType("FIAB_MT020000HT02").getMessages();
	var exist = true;
	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		if (message.transactionType != AppConstants.TransactionType.LICENSEEINVOICE) {
			$('#inner-uiform-' + message.id).css('display', 'none');
		}
		if (message.transactionType == AppConstants.TransactionType.LICENSEEINVOICE) {
			if (!exist) {
				$('#inner-uiform-' + message.id).css('display', 'none');
			}
			exist = false;
		}

	}

	var currentDueAmount = $("#inner-uiform-" + message.id).find("#currentDue")
			.val();
	var amount30daysOld = $("#inner-uiform-" + message.id).find("#30days")
			.val();
	var amount60daysOld = $("#inner-uiform-" + message.id).find("#60days")
			.val();
	var amount90daysOld = $("#inner-uiform-" + message.id).find("#90days")
			.val();

	var totalDueAmount = licenseePaymentPage.above90
			+ licenseePaymentPage.above60 + licenseePaymentPage.above30
			+ licenseePaymentPage.below30;

	var licenseeVO = appController.getComponent("Context").getLicenseeVO();
	if (licenseeVO) {
		var data = parseFloat(totalDueAmount)
				* parseFloat(licenseeVO.exchangeRate);
		if (isNaN(data)) {
			data = 0;
		}
		$('fieldset[amountParent=LicenseeOutstandingAccountBalance]').find(
				'#convertedAmt').text(
				data.toFixed(2) + " " + licenseeVO.currencyCode);
		/*
		 * appController.getComponent("DataLayer").currencyConvert(
		 * totalDueAmount, "", licenseeVO.currencyCode, licenseeVO.exchangeRate,
		 * function(data) { $('fieldset[amountParent=accountBalance]').find(
		 * '#convertedAmt').text( data.toFixed(2) + " " +
		 * licenseeVO.currencyCode); });
		 */
	}
};
HIN.LicenseePaymentPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;

	// alert("addInitialHandler");
};

HIN.LicenseePaymentPage.prototype.addCompleteHandler = function(addNew,
		messageType, message, uiGenerator) {
	if (messageType.typeName == "OutstandingInvoices") {
		/* licenseePaymentPage.loadComplete(message); */

	} else if (messageType.typeName == "NewPayment") {
		uiGenerator.actions = true;
		if (!this.showTotalText) {
			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="total"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);
			this.showTotalText = true;
		}
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').unbind(
				'keyup', licenseePaymentPage.addTotal);
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').bind(
				'keyup', licenseePaymentPage.addTotal);
	}

};

HIN.LicenseePaymentPage.prototype.removeCompleteHandler = function(messageType,
		message) {
	// alert("removeCompleteHandler");
};

HIN.LicenseePaymentPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

/*
 * HIN.LicenseePaymentPage.prototype.taskHandler = function(message, taskVO,
 * instance) { // alert("taskHandler"); };
 */

HIN.LicenseePaymentPage.prototype.getAccountBalanceHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box" style="width: 100%"> ';
	/*
	 * tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	 * tableHeader += 'style="width:3%"><input type="checkbox" data-role="none"
	 * id="chkhead" value="" /></div>';
	 */
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:15%">90 Days</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">60 Days</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">30 Days</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">Current Dues</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">Total Dues</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-f ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.7%;float:left;">Converted Amount</div> ';
	return tableHeader;
}

HIN.LicenseePaymentPage.prototype.getNewPaymentHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-c ui-accounting-box" style="width: 100%"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="width:15%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-b ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">Payment Method</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:31%">Reference/Comments</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15%">Total Due</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.7%;float:left;">Converted Amount</div> ';
	return tableHeader;
}
HIN.LicenseePaymentPage.prototype.singleHandler = function(typeName, instance) {
	licenseePaymentPage.finishClicked = true;
	var messageObjects = [];
	var messageTypes = licenseePaymentPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.status == AppConstants.Status.ACTIVE) {

				// alert("messageTypeName=======" + message.messageTypeName);
				if (message.messageTypeName == typeName) {
					/*
					 * alert("Message xml : " +
					 * XmlUtil.xmlToString(message.message));
					 */

					licenseePaymentPage.messageObjects
							.push(messages[messageIndex]);

					var messageAndUIBinder = new MessageAndUIBinder(null,
							message.msg, message.messageType);
					messageAndUIBinder.updateId("TRANSACTION_STATUS",
							AppConstants.TransactionStatus.PAID);
					messageAndUIBinder.updateId("TRANSACTION_TYPE",
							AppConstants.TransactionType.LICENSEEPAYMENT);

					// licenseePaymentPage.paidInvoice(message);

					/*
					 * var messageAndUIBinder = new MessageAndUIBinder(null,
					 * message, message.messageType);
					 * messageAndUIBinder.updateId("TRANSACTION_STATUS",
					 * AppConstants.TransactionStatus.PAID);
					 */

				}

				if (message.messageTypeName == 'UnpaidInvoice') {
					// alert("collection UnpaidInvoice");
				}

			}
		}
	}
	var messageObjects = licenseePaymentPage
			.getInvoiceMessageDetail(licenseePaymentPage.messageObjects);
	/*
	 * var messageObj =
	 * licenseePaymentPage.updateInvoiceMessage(messageObjects);
	 */
	// alert("messageObj" + $.toJSON(messageObj));
/*	if (messageObjects.length > 0) {
		var parameters = [ messageObjects ];
		licenseePaymentPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}*/
	
	
	if (messageObjects && messageObjects.length > 0) {

		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		cacheManager.renderProcessUpdate = !licenseePaymentPage.processUpdate;
		cacheManager.syncToCouch = true;
		var processObjects = [];
		processObjects.push(licenseePaymentPage.processDefinition);
		var parameters = [ messageObjects, processObjects ];
		licenseePaymentPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);

	} else {
		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		cacheManager.renderProcessUpdate = !licenseePaymentPage.processUpdate;
		cacheManager.syncToCouch = true;
		var processObjects = [];
		var messageObjects = [];
		processObjects.push(licenseePaymentPage.processDefinition);
		var parameters = [ messageObjects, processObjects ];
		licenseePaymentPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);

	}
};
HIN.LicenseePaymentPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	/*
	 * return; var messageObjects = []; var messageTypes =
	 * licenseePaymentPage.selectedStep.getMessageTypes(); for ( var
	 * messageTypeIndex = 0; messageTypeIndex < messageTypes.length;
	 * messageTypeIndex++) { var messages =
	 * messageTypes[messageTypeIndex].getMessages(); for ( var messageIndex = 0;
	 * messageIndex < messages.length; messageIndex++) { var message =
	 * messages[messageIndex]; if (message.status == AppConstants.Status.ACTIVE) { //
	 * alert("messageTypeName=======" + message.messageTypeName); if
	 * (message.messageTypeName == 'NewPayment') {
	 * 
	 * alert("Message xml : " + XmlUtil.xmlToString(message.message));
	 * 
	 * 
	 * licenseePaymentPage.messageObjects.push(messages[messageIndex]);
	 * 
	 * var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
	 * message.messageType); messageAndUIBinder.updateId("TRANSACTION_STATUS",
	 * AppConstants.TransactionStatus.PAID);
	 * messageAndUIBinder.updateId("TRANSACTION_TYPE",
	 * AppConstants.TransactionType.PAYMENT); //
	 * licenseePaymentPage.paidInvoice(message);
	 * 
	 * 
	 * var messageAndUIBinder = new MessageAndUIBinder(null, message,
	 * message.messageType); messageAndUIBinder.updateId("TRANSACTION_STATUS",
	 * AppConstants.TransactionStatus.PAID); }
	 * 
	 * if (message.messageTypeName == 'UnpaidInvoice') { // alert("collection
	 * UnpaidInvoice"); } } } } var messageObjects =
	 * licenseePaymentPage.getInvoiceMessageDetail(messageObjects); var
	 * messageObj = licenseePaymentPage.updateInvoiceMessage(messageObjects); //
	 * alert("messageObj" + $.toJSON(messageObj)); if (messageObjects.length >
	 * 0) { var parameters = [ messageObjects ];
	 * licenseePaymentPage.appController.getComponent("DataLayer")
	 * .createOrUpdateTasks(parameters); }
	 */
};

HIN.LicenseePaymentPage.prototype.inDays = function(d1, d2) {

	var t1 = d1.getTime();
	var t2 = d2.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000));
}

HIN.LicenseePaymentPage.prototype.currentDate = function() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var day = (day < 10) ? '0' + day : day;
	var month = (month < 10) ? '0' + month : month;
	var fullDate = year + '-' + month + '-' + day;
	return fullDate;
};

HIN.LicenseePaymentPage.prototype.inMonths = function(d1, d2) {
	var d1Y = d1.getFullYear();
	var d2Y = d2.getFullYear();
	var d1M = d1.getMonth();
	var d2M = d2.getMonth();

	return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
}

HIN.LicenseePaymentPage.prototype.loadComplete = function(message) {

	/*
	 * var messageId = message.messageId; // alert("MESSAGEID: " + messageId)
	 * var msg =
	 * licenseePaymentPage.appController.getComponent("DataLayer").getMsg(
	 * messageId); // alert("MESSAGE: " + XmlUtil.xmlToString(msg.getXML()));
	 * var dateTime = XmlUtil.getXPathResult(msg.getXML(),
	 * 'message/FIAB_MT020000HT02/effectiveTime/value',
	 * XPathResult.STRING_TYPE); var messageDate = dateTime.stringValue;
	 * 
	 * var amount = XmlUtil.getXPathResult(msg.getXML(),
	 * 'message/FIAB_MT020000HT02/amt[1]/value', XPathResult.STRING_TYPE);
	 * 
	 * var amount = amount.stringValue; messageDate = new Date(messageDate); //
	 * alert("messageDate: " + messageDate); var presentDate =
	 * licenseePaymentPage.currentDate(); presentDate = new Date(presentDate); //
	 * alert("presentDate: " + presentDate);
	 * 
	 * var dateDiff = licenseePaymentPage.inDays(messageDate, presentDate); //
	 * alert("DATEDIFF: " + dateDiff); if (dateDiff >= 90) {
	 * licenseePaymentPage.above90 += parseInt(amount); } else if (dateDiff >=
	 * 60 && dateDiff < 90) { licenseePaymentPage.above60 += parseInt(amount); }
	 * else if (dateDiff >= 30 && dateDiff < 60) { licenseePaymentPage.above30 +=
	 * parseInt(amount); } else if (dateDiff < 30) { licenseePaymentPage.below30 +=
	 * parseInt(amount); }
	 * 
	 */
};

HIN.LicenseePaymentPage.prototype.addTotal = function() {
	var sum = 0;
	$('fieldset[amountParent=payment]').find('input[tagName=amt]').each(
			function() {
				if (!isNaN(parseInt($(this).val()))) {
					sum += parseInt($(this).val());
				}
			});

	/* $('#total').val(licenseePaymentPage.totalInvoiceAmount); */
}

HIN.LicenseePaymentPage.prototype.paidInvoice = function(message) {

	alert("Message xml : " + XmlUtil.xmlToString(message.message));

	/*
	 * var chargeDetail = [];
	 * 
	 * consultant = XmlUtil .getXPathResult( msg.getXML(),
	 * 'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given',
	 * XPathResult.STRING_TYPE); // alert("Consultant: " +
	 * consultant.stringValue);
	 * 
	 * consultants.push({ name : consultant.stringValue });
	 * 
	 * messageTypeScript.initialize(); messageTypeScript
	 * .fillData('financialTransactionChargeDetail', chargeDetail);
	 * messageTypeScript.fillData('amt', total);
	 * messageTypeScript.fillData('effectiveTime', fullDate);
	 * messageTypeScript.fillData('consultant', consultants);
	 * messageTypeScript.fillData('patient', patients);
	 * messageTypeScript.fillData('service', services);
	 * messageTypeScript.fillData('drug', products);
	 * messageTypeScript.fillData('transactionType',
	 * AppConstants.TransactionType.INVOICE);
	 * 
	 * var messageAndUIBinder = new MessageAndUIBinder(null, newMessage.msg,
	 * newMessage.msg.getConfig().getArtifactId());
	 * messageAndUIBinder.updateId("TRANSACTION_STATUS",
	 * AppConstants.TransactionStatus.UNPAID);
	 */

	// alert("MESSAGE: " + XmlUtil.xmlToString(newMessage.msg.getXML()));
};
/*
 * HIN.LicenseePaymentPage.prototype.getDiscountMessages = function() { var
 * discountArray = new Array(); var messages =
 * licenseePaymentPage.processDefinition.getStep("Step3")
 * .getMessageTypeByType("FIAB_MT020000HT02").getMessages(); for ( var
 * messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
 * var message = messages[messageTypeIndex]; var msgObj =
 * licenseePaymentPage.appController
 * .getComponent("DataLayer").getMessageObject(message.messageId); if
 * (message.transactionType = "DISCOUNT") {
 * 
 * discountArray.push(message.messageId); } } return discountArray;
 *  };
 * 
 * HIN.LicenseePaymentPage.prototype.getDiscountAndInterestAmount = function(
 * invoiceId, invoiceAmount) { var discountArray =
 * licenseePaymentPage.getDiscountMessages(); var discountAmount = 0; var
 * interestAmount = 0; for (index in discountArray) { var discountMessageId =
 * discountArray[index]; var msg =
 * licenseePaymentPage.appController.getComponent("DataLayer")
 * .getMsg(discountMessageId); var extension =
 * XmlUtil.getXPathResult(msg.getXML(),
 * "//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
 * XPathResult.STRING_TYPE);
 *  // alert("extension" + extension.stringValue + "invoiceId=" + // invoiceId);
 * if (invoiceId == extension.stringValue) { // alert("equal" + invoiceId +
 * "invoiceId2" + extension); var msg =
 * licenseePaymentPage.appController.getComponent(
 * "DataLayer").getMsg(discountMessageId); var chargeType = XmlUtil
 * .getXPathResult( msg.getXML(),
 * '//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
 * XPathResult.STRING_TYPE); var amount = XmlUtil .getXPathResult( msg.getXML(),
 * '//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
 * XPathResult.STRING_TYPE); // alert("chargeType=" + chargeType.stringValue); //
 * alert("discountamt=" + parseInt(amount.stringValue)); if
 * (chargeType.stringValue == "Discount") { discountAmount +=
 * parseInt(amount.stringValue); } if (chargeType.stringValue == "Interest") {
 * interestAmount += parseInt(amount.stringValue); } } } var finalAmount =
 * (invoiceAmount - discountAmount) + interestAmount; return finalAmount;
 *  };
 */
HIN.LicenseePaymentPage.prototype.getInvoiceMessageDetail = function(
		messageObjects) {
	var invoiceArray = new Array();

	var messages = licenseePaymentPage.processDefinition.getStep("Step5")
			.getMessageTypeByType("FIAB_MT020000HT02").getMessages();

	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		if (message.transactionType = AppConstants.TransactionType.LICENSEEINVOICE) {
			var msgObj = licenseePaymentPage.appController.getComponent(
					"DataLayer").getMessageObject(message.messageId);
			var messageId = message.messageId;

			// alert("MESSAGEID: " + messageId)
			var msg = licenseePaymentPage.appController.getComponent(
					"DataLayer").getMsg(messageId);
			// alert("MESSAGE: " + XmlUtil.xmlToString(msg.getXML()));
			var dateTime = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/effectiveTime/value',
					XPathResult.STRING_TYPE);
			var messageDate = dateTime.stringValue;
			var arrayDate = messageDate.split(" ");
			messageDate = arrayDate[0];

			var baseAmount = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/amt[1]/value',
					XPathResult.STRING_TYPE);

			var amount = baseAmount.stringValue;
			/*
			 * var amount =
			 * licenseePaymentPage.getDiscountAndInterestAmount(messageId,
			 * invoiceAmount);
			 */
			// licenseePaymentPage.totalInvoiceAmount += parseInt(amount);
			messageDate = new Date(messageDate);
			var presentDate = licenseePaymentPage.currentDate();
			presentDate = new Date(presentDate);

			var dateDiff = licenseePaymentPage.inDays(messageDate, presentDate);

			if (dateDiff >= 90) {
				invoiceArray.push({
					messageId : messageId,
					priority : 1,
					invoiceAmount : amount
				});

			} else if (dateDiff >= 60 && dateDiff < 90) {
				invoiceArray.push({
					messageId : messageId,
					priority : 2,
					invoiceAmount : amount
				});

			} else if (dateDiff >= 30 && dateDiff < 60) {
				invoiceArray.push({
					messageId : messageId,
					priority : 3,
					invoiceAmount : amount
				});

			} else if (dateDiff < 30) {
				invoiceArray.push({
					messageId : messageId,
					priority : 4,
					invoiceAmount : amount
				});

			}

		}
		licenseePaymentPage.priorityWiseCollection(invoiceArray);

	}
	return licenseePaymentPage.messageObjects;
};

HIN.LicenseePaymentPage.prototype.updateMessage = function(messageId, amount,
		totalAmount) {
	var msgObj = licenseePaymentPage.appController.getComponent("DataLayer")
			.getMessageObject(messageId);
	var messageAndUIBinder = new MessageAndUIBinder(null, msgObj.msg,
			msgObj.messageType);
	if (parseInt(amount) <= parseInt(totalAmount)) {
		// alert("finishing invoice");
		/*
		 * var discountArray = licenseePaymentPage.getDiscountMessages(); for
		 * (index in discountArray) { var discountMessageId =
		 * discountArray[index]; var msg =
		 * licenseePaymentPage.appController.getComponent(
		 * "DataLayer").getMsg(discountMessageId); var discountMsgObj =
		 * licenseePaymentPage.appController
		 * .getComponent("DataLayer").getMessageObject( discountMessageId); var
		 * extension = XmlUtil.getXPathResult(msg.getXML(),
		 * "//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
		 * XPathResult.STRING_TYPE);
		 * 
		 * alert("extension" + extension.stringValue + "invoiceId=" +
		 * messageId);
		 * 
		 * if (messageId == extension.stringValue) { var
		 * discountMessageAndUIBinder = new MessageAndUIBinder(null,
		 * discountMsgObj.msg, discountMsgObj.messageType);
		 * discountMessageAndUIBinder.updateId("TRANSACTION_STATUS", "PAID");
		 * licenseePaymentPage.messageObjects.push(discountMsgObj); } }
		 */

		messageAndUIBinder.updateId("TRANSACTION_STATUS", "PAID");
		licenseePaymentPage.messageObjects.push(msgObj);
		totalAmount -= amount;
	} else {
		var remainingAmount = amount - totalAmount;

		totalAmount = 0;
		fields = "";
		type = "MO";
		tagName = "amt";
		pathFields = fields.split(',');
		// Expecting only one value
		instanceObject = [ remainingAmount ];
		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);
		licenseePaymentPage.messageObjects.push(msgObj);
	}

	// alert("totalAmount" + totalAmount);
	return totalAmount;

};

HIN.LicenseePaymentPage.prototype.priorityWiseCollection = function(
		invoiceArray) {
	var totalAmount = $('fieldset[amountParent=payment]').find(
			'input[tagName=amt]').val();
	for ( var priority = 1; priority <= 4; priority++) {
		for (index in invoiceArray) {
			if (invoiceArray[index].priority == priority) {
				totalAmount = licenseePaymentPage.updateMessage(
						invoiceArray[index].messageId,
						invoiceArray[index].invoiceAmount, totalAmount);
			}
		}
	}

};

HIN.LicenseePaymentPage.prototype.finishCompleteHandler = function() {
	if (licenseePaymentPage.processUpdate == false
			|| licenseePaymentPage.finishClicked == false) {
		return;
	}
	var renderingEngine = appController.getComponent("RenderingEngine");
	var processDefinition = licenseePaymentPage.processDefinition;

	var step5 = processDefinition.getStep("Step5");
	var newPaymentMessageType = step5.getMessageTypeByTypeName("NewPayment");
	var newPaymentMessages = newPaymentMessageType.getMessages();

	var step4 = processDefinition.getStep("Step4");
	var booksReceivablesMessageType = step4
			.getMessageTypeByTypeName("Receivables");

	for ( var index = 0; index < newPaymentMessages.length; index++) {
		var message = newPaymentMessages[index];
		booksReceivablesMessageType.addMessage(message);
	}
	step4.addMessageGroup(booksReceivablesMessageType,
			newPaymentMessages.length);
	newPaymentMessageType.removeAllMessages();
	step5.removeMessageGroup(newPaymentMessageType);

	if (licenseePaymentPage.balance == 0) {
		var accountBalanceMessageType = step5
				.getMessageTypeByTypeName("OutstandingInvoices");
		accountBalanceMessageType.removeAllMessages();
		step5.removeMessageGroup(accountBalanceMessageType);
	} else {
		var accountBalanceMessageType = step5
				.getMessageTypeByTypeName("OutstandingInvoices");
		var accountBalanceMessages = accountBalanceMessageType.getMessages();
		removedCount = 0;
		for ( var messageIndex = 0; messageIndex < accountBalanceMessages.length; messageIndex++) {
			if (accountBalanceMessages[messageIndex].transactionStatus == "PAID") {
				accountBalanceMessageType
						.removeMessage(accountBalanceMessages[messageIndex]);
				removedCount++;
			}
		}
		step5.updateMessageGroupByType(accountBalanceMessageType, removedCount);
	}
	var cacheManager = appController.getComponent("DataLayer").cacheManager;
	cacheManager.renderProcessUpdate = true;
	appController.getComponent("RenderingEngine").getChildComponent("Process")
			.updateProcess();

	licenseePaymentPage.finishClicked = false;

};
