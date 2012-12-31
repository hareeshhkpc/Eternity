var HIN;
if (!HIN)
	HIN = {};
HIN.CollectionPage = function(appController, pageHolder) {
	collectionPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "collectionPage";// pageHolder;
	this.showTotalText = false;
	this.totalInvoiceAmount = 0;
	this.messageObjects = [];
	this.above90 = 0;
	this.above60 = 0;
	this.above30 = 0;
	this.below30 = 0;
	this.balance = 0;
	this.totalDueAmount = 0;
	this.processUpdate = true;
	this.finishClicked = false;
	this.settled = false;
	this.invoiceMessageMap = new HIN.HashMap();
	this.serviceCheckFlag = false;
	this.receiptMessage = null;
	this.generatedReceiptId = null;
	this.receiptCreated = false;
	this.selectedItems = [];
	this.receiptGenerated = false;
	this.paymentAdvaiceMap = new HIN.HashMap();
	this.newlyAddedMessages=[];
};

HIN.CollectionPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.CollectionPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {

	// alert("CollectionPage pageBeforeLoad : " + uiGenerator);
	// uiGenerator.hideMainHeader();
	// uiGenerator.hideAddIcon();
	// uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.actions = false;
	uiGenerator.taskHandler = collectionPage.taskHandler;
	uiGenerator.finishTitleOnly = true;
	// alert("MessageTypeName: " + messageType.typeName);
	if (messageType.typeName == "AccountBalance") {
		uiGenerator.actions = false;
		uiGenerator.tableHeaders = collectionPage.getAccountBalanceHeader();
		uiGenerator.hideAddIcon();
		uiGenerator.hideRemoveIcon();
		var messages = messageType.getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			messages[messageIndex].readOnly = true;
		}
		// uiGenerator.hideSubHeader();
	} else if (messageType.typeName == "NewPayment") {
		var messageTypeObj = collectionPage.selectedStep
				.getMessageTypeByTypeName("NewPayment");
		/*
		 * if (!messageTypeObj || messageTypeObj.getMessages().length == 0) {
		 * uiGenerator.hideAddIcon(); }
		 */
		uiGenerator.actions = true;
		uiGenerator.tableHeaders = collectionPage.getNewPaymentHeader();

	} else {

	}

};

HIN.CollectionPage.prototype.pageAfterLoad = function(page) {

	collectionPage.totalDueAmount = collectionPage.above90
			+ collectionPage.above60 + collectionPage.above30
			+ collectionPage.below30;
	// collectionPage.totalInvoiceAmount += parseFloat(totalDueAmount);
	$('fieldset[amountParent=accountBalance]').find('input[tagName=amt]').val(
			collectionPage.totalDueAmount.toFixed(2));
	$('#90days').val(collectionPage.above90.toFixed(2));
	$('#60days').val(collectionPage.above60.toFixed(2));
	$('#30days').val(collectionPage.above30.toFixed(2));
	$('#currentDue').val(collectionPage.below30.toFixed(2));
	var messages = collectionPage.processDefinition.getStep("Step3")
			.getMessageTypeByType("FIAB_MT020000HT02").getMessages();
	var exist = true;
	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		if (message.transactionType != AppConstants.TransactionType.INVOICE
				&& message.messageTypeName != "NewPayment") {
			$('#inner-uiform-' + message.id).css('display', 'none');
		}
		if (message.transactionType == AppConstants.TransactionType.INVOICE
				&& message.messageTypeName != "NewPayment") {
			if (!exist) {
				$('#inner-uiform-' + message.id).css('display', 'none');
			}
			exist = false;
		}
	
	}
	var messages = collectionPage.processDefinition.getStep("Step3")
	.getMessageTypeByTypeName("NewPayment").getMessages();
	
	var licenseeVO = appController.getComponent("Context").getLicenseeVO();
	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		if (message.messageTypeName == "NewPayment") {
			var value = XmlUtil.getXPathResult(message.msg.getXML(),
					'message/FIAB_MT020000HT02/amt[1]/value',
					XPathResult.STRING_TYPE);
			var obj = new Object();
			obj.actualValue = value.stringValue;
			
			if(obj.actualValue) {
				if(licenseeVO){
					var data = parseFloat(obj.actualValue) * parseFloat(licenseeVO.exchangeRate);
					$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('#UsdAmt').text(data.toFixed(2) + " " + licenseeVO.currencyCode);
				}
			}
			collectionPage.paymentAdvaiceMap.put(message.messageId, obj);

		}
	}
	var licenseeVO = appController.getComponent("Context").getLicenseeVO();
	if (licenseeVO) {
		var data = parseFloat(collectionPage.totalDueAmount)
				* parseFloat(licenseeVO.exchangeRate);
		$('fieldset[amountParent=accountBalance]').find('#convertedAmt').text(
				data.toFixed(2) + " " + licenseeVO.currencyCode);

	}
	collectionPage.toggleGenerateReceiptIcon(true);
};
HIN.CollectionPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;

	// alert("addInitialHandler");
};

HIN.CollectionPage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {
	if (messageType.typeName == "AccountBalance") {

		if (message.transactionType == "Invoice") {
			collectionPage.loadComplete(message);
		}

	} else if (messageType.typeName == "NewPayment") {
		uiGenerator.actions = true;
		if (!this.showTotalText) {
			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:81.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:15.8%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="paymentTotal"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);
			this.showTotalText = true;
		}
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').unbind(
				'keyup', collectionPage.addTotal);
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').bind(
				'keyup', collectionPage.addTotal);
	}
	$('#inner-uiform-' + message.id).find('input[id=chk]').val(
			message.messageId);

};

HIN.CollectionPage.prototype.removeCompleteHandler = function(messageType,
		message) {
	var sum = 0;
	$('fieldset[amountParent=payment]').find('input[tagName=amt]').each(
			function() {
				sum = sum + parseFloat($(this).val());
			});
	$('#total').val(sum);
};

HIN.CollectionPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.CollectionPage.prototype.getAccountBalanceHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box" style="width: 100%"> ';
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

HIN.CollectionPage.prototype.getNewPaymentHeader = function() {

	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="border-right:0px;width:3%"><input type="checkbox" data-role="none" id="chkhead" value="" /></div>';
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:15.3%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.2%">Payment Method</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:27.4%">Reference/Comments</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.3%">Total Due</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-f ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:15.8%;float:left;">Converted Amount</div> ';
	return tableHeader;
}
HIN.CollectionPage.messageIndex = 0;
HIN.CollectionPage.prototype.singleHandler = function(typeName, instance) {
	/* alert($('#total').val()); */
	// alert($.toJSON(collectionPage.invoiceMessageMap));
	collectionPage.finishClicked = true;
	collectionPage.settled = false;
	var messageObjects = [];
	collectionPage.messageObjects=[];
	var messageTypes = collectionPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.status == AppConstants.Status.ACTIVE) {
				// alert("messageTypeName=======" + message.messageTypeName);
				/*
				 * if (parseFloat($('#total').val()) ==
				 * parseFloat(collectionPage.totalDueAmount)) {
				 */
				collectionPage.settled = true;
				if (message.messageTypeName == typeName) {
					var messageAndUIBinder = new MessageAndUIBinder(null,
							message.msg, message.messageType);
					messageAndUIBinder.updateId("TRANSACTION_STATUS",
							AppConstants.TransactionStatus.UNPAID);
					messageAndUIBinder.updateId("TRANSACTION_TYPE",
							AppConstants.TransactionType.PAYMENT);

					collectionPage.messageObjects.push(message);

					/*
					 * alert("Message xml : " +
					 * XmlUtil.xmlToString(message.message));
					 */

					/*
					 * alert("Message xml : " +
					 * XmlUtil.xmlToString(message.message));
					 */

				}
				/* } */

				if (message.messageTypeName == 'UnpaidInvoice') {
					// alert("collection UnpaidInvoice");
				}

			}
		}
	}
	if (collectionPage.receiptCreated) {
		for ( var index = 0; index < collectionPage.invoiceMessageMap.length(); index++) {
			var map = collectionPage.invoiceMessageMap.getItemAt(index);
			if (map.value === true) {
				var messageId = map.key;
				var msgObj = collectionPage.appController.getComponent(
						"DataLayer").getMessageObject(messageId);
				var messageAndUIBinder = new MessageAndUIBinder(null,
						msgObj.msg, msgObj.messageType);
				messageAndUIBinder.updateId("TRANSACTION_STATUS", "PAID");
				messageAndUIBinder.updateId("TRANSACTION_TYPE",
						AppConstants.TransactionType.PAYMENT);
				//collectionPage.messageObjects.push(msgObj);
			}
		}

		collectionPage.messageObjects.push(collectionPage.receiptMessage);
		var paidMessageObjects = [];
		paidMessageObjects.push(collectionPage.receiptMessage);
		collectionPage.getInvoiceMessageDetail(collectionPage.receiptMessage);
	}
	HIN.CollectionPage.messageIndex = 0;
	// messageObjects = collectionPage.messageObjects;
	// collectionPage.updateInvoiceMessage(paidMessageObjects);
	collectionPage.createPayments(collectionPage.messageObjects);

};


HIN.CollectionPage.prototype.createPayments = function(messageObjects) {
	
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	day = (day < 10) ? '0' + day : day;
	month = (month < 10) ? '0' + month : month;
	var fullDate = year + '-' + month + '-' + day + " "
			+ date.getHours() + ":" + date.getMinutes() + ":"
			+ date.getSeconds();
	
	if (HIN.CollectionPage.messageIndex < messageObjects.length) {
		var message = messageObjects[HIN.CollectionPage.messageIndex];
		HIN.CollectionPage.messageIndex++;
		var map = collectionPage.paymentAdvaiceMap.get(message.messageId);
		if (map) {
			var obj = map.value;
			if (obj.reminderValue!=null && obj.reminderValue > 0) {
				collectionPage.appController.getComponent("DataLayer")
						.createMessageByType(
								AppConstants.XPaths.Finance.MESSAGE_TYPE,
								function(messageObject) {
									collectionPage.messageObjects
											.push(messageObject);
									collectionPage.newlyAddedMessages.push(messageObject);
									var page = collectionPage.appController.getComponent("RenderingEngine").getChildComponent(
									"Form").getPage();
									page.getMessageScript(messageObject, messageObjects,
											function(messageTypeScript,
													messageObjects, newMessage){
										 	messageTypeScript.initialize();
											messageTypeScript.fillData('amt', obj.reminderValue);
											messageTypeScript.fillData('effectiveTime', fullDate);
											messageTypeScript.fillData('transactionType',
													AppConstants.TransactionType.PAYMENTADVICE);
											messageTypeScript.fillData('transactionStatus',
													AppConstants.TransactionStatus.UNPAID);
											collectionPage.createPayments(messageObjects);
									 });
										


								

								});

			}else{
				collectionPage.createPayments(messageObjects);
			}
		} else {
			collectionPage.createPayments(messageObjects);
		}
	} else {
		if (messageObjects && messageObjects.length > 0) {
			var cacheManager = appController.getComponent("DataLayer").cacheManager;
			cacheManager.renderProcessUpdate = !collectionPage.processUpdate;
			cacheManager.syncToCouch = true;
			var processObjects = [];
			processObjects.push(collectionPage.processDefinition);
			var parameters = [ messageObjects, processObjects ];
			collectionPage.appController.getComponent("DataLayer")
					.createOrUpdateTasks(parameters);

		} else {
			var cacheManager = appController.getComponent("DataLayer").cacheManager;
			cacheManager.renderProcessUpdate = !collectionPage.processUpdate;
			cacheManager.syncToCouch = true;
			var processObjects = [];
			var messageObjects = [];
			processObjects.push(collectionPage.processDefinition);
			var parameters = [ messageObjects, processObjects ];
			collectionPage.appController.getComponent("DataLayer")
					.createOrUpdateTasks(parameters);

		}
	}

};

HIN.CollectionPage.prototype.taskHandler = function(message, taskVO, instance) {
};

HIN.CollectionPage.prototype.inDays = function(d1, d2) {

	var t1 = d1.getTime();
	var t2 = d2.getTime();

	return parseInt((t2 - t1) / (24 * 3600 * 1000));
}

HIN.CollectionPage.prototype.currentDate = function() {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var day = (day < 10) ? '0' + day : day;
	var month = (month < 10) ? '0' + month : month;
	var fullDate = year + '-' + month + '-' + day;
	return fullDate;
};

HIN.CollectionPage.prototype.inMonths = function(d1, d2) {
	var d1Y = d1.getFullYear();
	var d2Y = d2.getFullYear();
	var d1M = d1.getMonth();
	var d2M = d2.getMonth();

	return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
}

HIN.CollectionPage.prototype.loadComplete = function(message) {
	var amount = 0;
	var messageId = message.messageId;
	// alert("MESSAGEID: " + messageId)
	var msg = collectionPage.appController.getComponent("DataLayer").getMsg(
			messageId);
	// alert("MESSAGE: " + XmlUtil.xmlToString(msg.getXML()));
	var dateTime = XmlUtil.getXPathResult(msg.getXML(),
			'message/FIAB_MT020000HT02/effectiveTime/value',
			XPathResult.STRING_TYPE);

	var messageDate = dateTime.stringValue;
	var arrayDate = messageDate.split(" ");
	messageDate = arrayDate[0];

	var baseAmount = XmlUtil.getXPathResult(msg.getXML(),
			"//FIAB_MT020000HT02/id[root='INVOICE_AMOUNT']/extension",
			XPathResult.STRING_TYPE);
	if (baseAmount.stringValue) {
		amount = baseAmount.stringValue;
	} else {
		var invoiceAmount = XmlUtil.getXPathResult(message.msg.getXML(),
				'message/FIAB_MT020000HT02/amt[1]/value',
				XPathResult.STRING_TYPE);
		var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
				message.msg.getConfig().getArtifactId());
		messageAndUIBinder
				.updateId("INVOICE_AMOUNT", invoiceAmount.stringValue);
		collectionPage.messageObjects.push(message);
		amount = invoiceAmount.stringValue;
	}
	messageDate = new Date(messageDate);

	var presentDate = collectionPage.currentDate();
	presentDate = new Date(presentDate);

	var dateDiff = collectionPage.inDays(messageDate, presentDate);

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
};

HIN.CollectionPage.prototype.addTotal = function() {
	var sum;
	$('fieldset[amountParent=payment]').find('input[tagName=amt]').each(
			function() {
				sum += parseInt($(this).val());
			});

	/* $('#total').val(collectionPage.totalInvoiceAmount); */
}

HIN.CollectionPage.prototype.paidInvoice = function(message) {

};

HIN.CollectionPage.prototype.getDiscountMessages = function() {
	var discountArray = new Array();
	var messages = collectionPage.processDefinition.getStep("Step3")
			.getMessageTypeByType("FIAB_MT020000HT02").getMessages();
	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		var msgObj = collectionPage.appController.getComponent("DataLayer")
				.getMessageObject(message.messageId);
		if (message.transactionType == AppConstants.TransactionStatus.DISCOUNT) {
			discountArray.push(message.messageId);
		}
	}
	return discountArray;

};

HIN.CollectionPage.prototype.getDiscountAndInterestAmount = function(invoiceId,
		invoiceAmount) {
	var discountArray = collectionPage.getDiscountMessages();
	var discountAmount = 0;
	var interestAmount = 0;
	for (index in discountArray) {
		var discountMessageId = discountArray[index];
		var msg = collectionPage.appController.getComponent("DataLayer")
				.getMsg(discountMessageId);
		var extension = XmlUtil.getXPathResult(msg.getXML(),
				"//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
				XPathResult.STRING_TYPE);

		// alert("extension" + extension.stringValue + "invoiceId=" +
		// invoiceId);
		if (invoiceId == extension.stringValue) {
			// alert("equal" + invoiceId + "invoiceId2" + extension);
			var msg = collectionPage.appController.getComponent("DataLayer")
					.getMsg(discountMessageId);
			var chargeType = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
							XPathResult.STRING_TYPE);
			var amount = XmlUtil
					.getXPathResult(
							msg.getXML(),
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
HIN.CollectionPage.prototype.getInvoiceMessageDetail = function(messageObjects) {
	var invoiceArray = new Array();
	var messages = collectionPage.processDefinition.getStep("Step3")
			.getMessageTypeByType("FIAB_MT020000HT02").getMessages();

	for ( var messageTypeIndex = 0; messageTypeIndex < messages.length; messageTypeIndex++) {
		var message = messages[messageTypeIndex];
		if (message.transactionType = "Invoice") {
			var msgObj = collectionPage.appController.getComponent("DataLayer")
					.getMessageObject(message.messageId);
			var messageId = message.messageId;
			var msg = collectionPage.appController.getComponent("DataLayer")
					.getMsg(messageId);
			// alert("MESSAGE: " + XmlUtil.xmlToString(msg.getXML()));
			var dateTime = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/effectiveTime/value',
					XPathResult.STRING_TYPE);
			var messageDate = dateTime.stringValue;

			var arrayDate = messageDate.split(" ");
			messageDate = arrayDate[0];

			var baseAmount = XmlUtil.getXPathResult(msg.getXML(),
					"//FIAB_MT020000HT02/id[root='INVOICE_AMOUNT']/extension",
					XPathResult.STRING_TYPE);
			/* var amount = baseAmount.stringValue; */
			var amount = baseAmount.stringValue;

			messageDate = new Date(messageDate);
			var presentDate = collectionPage.currentDate();
			presentDate = new Date(presentDate);

			var dateDiff = collectionPage.inDays(messageDate, presentDate);

			// setting priority based on invoice age
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

	}
	collectionPage.priorityWiseCollection(invoiceArray);
	return collectionPage.messageObjects;

};

HIN.CollectionPage.prototype.updateMessage = function(messageId, invoiceAmount,
		paymentAmount) {
	// invoiceAmount===>patient actual invoice amount
	// paymentAmount===>collection amount
	// alert("invoiceAmount" + invoiceAmount + "paymentAmount" + paymentAmount);
	var msgObj = collectionPage.appController.getComponent("DataLayer")
			.getMessageObject(messageId);
	var messageAndUIBinder = new MessageAndUIBinder(null, msgObj.msg,
			msgObj.messageType);
	/*
	 * var step1 = collectionPage.processDefinition.getStep("Step1"); var
	 * messageTypes = step1.getMessageTypes(); for ( var messageTypeIndex = 0;
	 * messageTypeIndex < messageTypes.length; messageTypeIndex++) { //
	 * alert(messageTypes[messageTypeIndex]); if
	 * (messageTypes[messageTypeIndex].typeName .indexOf("UnpaidInvoice-No-") >
	 * -1) { msgObj = messageTypes[messageTypeIndex].getMessage(messageId) if
	 * (msgObj) { msgObj.msg = messageObject.msg; break; } } }
	 */
	/*
	 * var messageAndUIBinder = new MessageAndUIBinder(null, msgObj.msg,
	 * msgObj.messageType);
	 */
	if (parseFloat(invoiceAmount) <= parseFloat(paymentAmount)) {
		// paymentAmount is sufficiant to close invoice
		var discountArray = collectionPage.getDiscountMessages();
		// mark discount messages to PAID
		for (index in discountArray) {
			var discountMessageId = discountArray[index];
			var msg = collectionPage.appController.getComponent("DataLayer")
					.getMsg(discountMessageId);
			var discountMsgObj = collectionPage.appController.getComponent(
					"DataLayer").getMessageObject(discountMessageId);
			var extension = XmlUtil.getXPathResult(msg.getXML(),
					"//FIAB_MT020000HT02/id[root='INVOICE_ID']/extension",
					XPathResult.STRING_TYPE);
			if (messageId == extension.stringValue) {
				var discountMessageAndUIBinder = new MessageAndUIBinder(null,
						discountMsgObj.msg, discountMsgObj.messageType);
				discountMessageAndUIBinder.updateId("TRANSACTION_STATUS",
						"PAID");
				discountMsgObj.transactionStatus = "PAID";
				collectionPage.messageObjects.push(discountMsgObj);
			}
		}
		// mark invoice message to PAID
		messageAndUIBinder.updateId("TRANSACTION_STATUS", "PAID");
		msgObj.transactionStatus = "PAID";

		var step3 = collectionPage.processDefinition.getStep("Step3");
		var accountBalanceMessageType = step3
				.getMessageTypeByTypeName("AccountBalance");
		var accountBalanceMessage = accountBalanceMessageType
				.getMessage(msgObj.messageId);
		if (accountBalanceMessage)
			accountBalanceMessage.transactionStatus = "PAID";

		collectionPage.messageObjects.push(msgObj);
		paymentAmount -= invoiceAmount;
		/* collectionPage.balance = paymentAmount; */
	} else {
		/*
		 * paymentAmount is not sufficient to close invoice,so deduct amount
		 * from invoice,and update remaining balance amount.
		 */
		var remainingAmount = invoiceAmount - paymentAmount;
		collectionPage.balance = remainingAmount;
		paymentAmount = 0;
		// Expecting only one value
		messageAndUIBinder.updateId("INVOICE_AMOUNT", remainingAmount);
		collectionPage.messageObjects.push(msgObj);
	}

	// return remaining payment amount.
	return paymentAmount;

};

// making payment based on invoice age
HIN.CollectionPage.prototype.priorityWiseCollection = function(invoiceArray) {
	var receiptMessage = collectionPage.receiptMessage;
	var invoiceAmount = XmlUtil.getXPathResult(receiptMessage.msg.getXML(),
			'message/FIAB_MT020000HT02/amt[1]/value', XPathResult.STRING_TYPE);
	// alert("receiptSmount" + invoiceAmount.stringValue);
	var paymentAmount = invoiceAmount.stringValue;
	// alert("invoiceArray" + $.toJSON(invoiceArray));
	for ( var priority = 1; priority <= 4; priority++) {
		for (index in invoiceArray) {
			if (invoiceArray[index].priority == priority) {
				// returns paymentAmount after deducting from invoice
				paymentAmount = collectionPage.updateMessage(
						invoiceArray[index].messageId,
						invoiceArray[index].invoiceAmount, paymentAmount);
			}
		}
	}

};

HIN.CollectionPage.prototype.finishCompleteHandler = function() {
	if (collectionPage.processUpdate == false
			|| collectionPage.finishClicked == false
	/* || collectionPage.settled == false */) {
		return;
	}
	/*
	 * var renderingEngine = appController.getComponent("RenderingEngine"); var
	 * processDefinition = collectionPage.processDefinition;
	 * 
	 * var step3 = processDefinition.getStep("Step3"); var newPaymentMessageType =
	 * step3.getMessageTypeByTypeName("NewPayment"); var newPaymentMessages =
	 * newPaymentMessageType.getMessages();
	 * 
	 * var step2 = processDefinition.getStep("Step2"); var
	 * accounthistoryMessageType = step2
	 * .getMessageTypeByTypeName("Accounthistory");
	 * 
	 * for ( var index = 0; index < newPaymentMessages.length; index++) { var
	 * message = newPaymentMessages[index];
	 * accounthistoryMessageType.addMessage(message); }
	 * step2.addMessageGroup(accounthistoryMessageType,
	 * newPaymentMessages.length); newPaymentMessageType.removeAllMessages();
	 * step3.removeMessageGroup(newPaymentMessageType);
	 * 
	 * if (collectionPage.balance == 0) { // alert(collectionPage.balance); var
	 * messageTypes = step2.getMessageTypes(); for ( var messageTypeIndex = 0;
	 * messageTypeIndex < messageTypes.length; messageTypeIndex++) { //
	 * alert(messageTypes[messageTypeIndex]); if
	 * (messageTypes[messageTypeIndex].typeName .indexOf("UnpaidInvoice-No-") >
	 * -1) { messageTypes[messageTypeIndex].removeAllMessages(); step2
	 * .removeMessageType(messageTypes[messageTypeIndex].typeName);
	 * step2.removeMessageGroup(messageTypes[messageTypeIndex]); } }
	 * 
	 * var accountBalanceMessageType = step3
	 * .getMessageTypeByTypeName("AccountBalance");
	 * accountBalanceMessageType.removeAllMessages();
	 * step3.removeMessageGroup(accountBalanceMessageType); } else { var
	 * messageTypes = step2.getMessageTypes(); for ( var messageTypeIndex = 0;
	 * messageTypeIndex < messageTypes.length; messageTypeIndex++) { var
	 * messageType = messageTypes[messageTypeIndex]; if
	 * (messageType.typeName.indexOf("UnpaidInvoice-No-") > -1) { var messages =
	 * messageType.getMessages(); var paid = true; var removedCount = 0; for (
	 * var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
	 * 
	 * alert(messages[messageIndex].transactionType + " : " +
	 * messages[messageIndex].transactionStatus);
	 * 
	 * removedCount++; if (messages[messageIndex].transactionStatus != "PAID") {
	 * paid = false; } } if (paid == true) { alert("Paid : " + paid);
	 * messageTypes[messageTypeIndex].removeAllMessages();
	 * step2.removeMessageType(messageType.typeName); //
	 * step2.removeMessageGroup(messageType);
	 * step2.updateMessageGroupByType(messageType, removedCount); var
	 * accountBalanceMessageType = step3
	 * .getMessageTypeByTypeName("AccountBalance"); var accountBalanceMessages =
	 * accountBalanceMessageType .getMessages(); removedCount = 0; for ( var
	 * messageIndex = 0; messageIndex < accountBalanceMessages.length;
	 * messageIndex++) { if
	 * (accountBalanceMessages[messageIndex].transactionStatus == "PAID") {
	 * accountBalanceMessageType
	 * .removeMessage(accountBalanceMessages[messageIndex]); removedCount++; } }
	 * step3.updateMessageGroupByType(accountBalanceMessageType, removedCount); } } } }
	 */
	/*
	 * for ( var messageIndex = 0; messageIndex <
	 * collectionPage.invoicedMessageObjects.length; messageIndex++) { var
	 * message = collectionPage.invoicedMessageObjects[messageIndex];
	 * alert("transactionType" + message.transactionType + "transactionStatus" +
	 * message.transactionStatus); if (message.transactionType =
	 * AppConstants.TransactionType.INVOICE && message.transactionStatus ==
	 * "PAID") { } }
	 */
	var cacheManager = appController.getComponent("DataLayer").cacheManager;
	cacheManager.renderProcessUpdate = true;
	appController.getComponent("RenderingEngine").getChildComponent("Process")
			.updateProcess();

	collectionPage.finishClicked = false;

};
HIN.CollectionPage.prototype.toggleGenerateReceiptIcon = function(show) {

	if (show == true) {
		$('#imgReceipt' + collectionPage.selectedStep.stepName).show();
		$('#imgReceiptText' + collectionPage.selectedStep.stepName).show();
	} else {
		$('#imgReceipt' + collectionPage.selectedStep.stepName).hide();
		$('#imgReceiptText' + collectionPage.selectedStep.stepName).hide();
	}

	$('#imgReceipt' + collectionPage.selectedStep.stepName).unbind('click',
			collectionPage.generateInvoice);
	$('#imgReceipt' + collectionPage.selectedStep.stepName).bind('click',
			collectionPage.generateReceipt);
};
HIN.CollectionPage.prototype.generateReceipt = function() {
	var selected = false;
	for ( var index = 0; index < collectionPage.invoiceMessageMap.length(); index++) {
		var map = collectionPage.invoiceMessageMap.getItemAt(index);
		if (map.value === true) {
			selected = true;
			break;
		}

	}
	if (selected) {
		collectionPage.receiptGenerated = true;
		collectionPage.appController.getComponent("DataLayer")
				.createMessageByType(AppConstants.XPaths.Finance.MESSAGE_TYPE,
						collectionPage.messageCreationComplete);
	} else {
		notificationmsg.info("Please select any payments.");
	}

	/*
	 * if (!collectionPage.receiptMessage) {
	 * 
	 * 
	 * 
	 * notificationmsg .info("Please make payment entry."); } else { }
	 */

}
HIN.CollectionPage.prototype.messageCreationComplete = function(newMessage) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	page.getMessageScript(newMessage, null, collectionPage.createNewReceipt);
};

HIN.CollectionPage.prototype.createNewReceipt = function(messageTypeScript,
		object, newMessage) {
	var chargeDetail = [];
	var services = [];
	var total = 0;
	var serviceCode = "";
	var serviceDescription = "";
	var consultants = [];
	var patients = [];
	var products = [];
	var effectiveTimes = [];
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	for ( var index = 0; index < collectionPage.invoiceMessageMap.length(); index++) {
		var map = collectionPage.invoiceMessageMap.getItemAt(index);
		var indexNum = parseInt(index + 1);

		if (map.value === true) {

			var messageId = map.key;

			collectionPage.selectedItems.push(messageId);
			var messageObject = collectionPage.appController.getComponent(
					"DataLayer").getMessageObject(messageId);
			var msg = collectionPage.appController.getComponent("DataLayer")
					.getMsg(messageId);

			// alert("msg" + msg.getConfig().getArtifactId());
			var messageAndUIBinder = new MessageAndUIBinder(null, msg, msg
					.getConfig().getArtifactId());
			messageAndUIBinder.updateId("TRANSACTION_STATUS",
					AppConstants.TransactionStatus.INVOICED);

			// alert("messageId :" + messageId);
			var value = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/amt[1]/value',
					XPathResult.STRING_TYPE);
			// alert("value: " + value.stringValue);
			value = (value && value.stringValue) ? value.stringValue : "";

			var date = new Date();
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			day = (day < 10) ? '0' + day : day;
			month = (month < 10) ? '0' + month : month;
			var fullDate = year + '-' + month + '-' + day + " "
					+ date.getHours() + ":" + date.getMinutes() + ":"
					+ date.getSeconds();

			if (value) {
				chargeDetail.push({
					'quantity' : 1,
					'unitPrice' : value,
					'netAmount' : value,
					'indexNumber' : indexNum
				});
			}
			var map = collectionPage.paymentAdvaiceMap.get(messageId);
			if (map) {
				var obj = map.value;
				obj.paidValue = value;
				obj.reminderValue = parseFloat(obj.actualValue)
						- parseFloat(value);
			}
			if (!value) {
				var value2 = XmlUtil
						.getXPathResult(
								msg.getXML(),
								'message/FIAB_MT020000HT02/component/financialTransactionChargeDetail/unitPriceAmt/numerator/value',
								XPathResult.STRING_TYPE);
				// alert("value2: " + value2.stringValue);
				value2 = (value2 && value2.stringValue) ? value2.stringValue
						: "";

				var qty = XmlUtil
						.getXPathResult(
								msg.getXML(),
								'message/FIAB_MT020000HT02/component/financialTransactionChargeDetail/unitQuantity/numerator/value',
								XPathResult.STRING_TYPE);
				// alert("qty: " + qty.stringValue);
				qty = (qty && qty.stringValue) ? qty.stringValue : "";
				var uPrice = value2 / qty;
				if (value2) {
					chargeDetail.push({
						'quantity' : qty,
						'unitPrice' : uPrice,
						'netAmount' : value2,
						'indexNumber' : indexNum
					});
				}
			}

			if (!value) {
				value = value2;
			}
			// alert("VAL..." + value)
			if (!isNaN(value)) {
				total += new Number(value);
			}

			this.

			serviceCode = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/derivationExpr/thumbnail',
					XPathResult.STRING_TYPE);
			
			//serviceCode = (serviceCode && serviceCode.stringValue) ? serviceCode.stringValue : "";
			//serviceCode = serviceCode.stringValue;
			// alert("serviceCode"+ serviceCode)

			serviceDescription = XmlUtil.getXPathResult(msg.getXML(),
					'message/FIAB_MT020000HT02/derivationExpr/thumbnail',
					XPathResult.STRING_TYPE);
			serviceDescription = (serviceDescription && serviceDescription.stringValue) ? serviceDescription.stringValue : "";
			//serviceDescription = serviceDescription.stringValue;
			
			if (serviceCode == '') {
				serviceCode = "PAYMENT";
				serviceDescription = "PAYMENT";
			}

			if (serviceCode != '') {
				// alert("serviceDescription: " + serviceDescription);
				services.push({
					concept : serviceCode,
					description : serviceDescription,
					'indexNumber' : indexNum
				});

			}

			// concultant Prefix Name
			var consultantPrefix = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/prefix',
							XPathResult.STRING_TYPE);

			// concultant Given Name
			var consultantGiven = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given',
							XPathResult.STRING_TYPE);

			// concultant Family Name
			var consultantFamily = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/family',
							XPathResult.STRING_TYPE);

			// concultant Suffix Name
			var consultantSuffix = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/suffix',
							XPathResult.STRING_TYPE);
			consultantPrefix = (consultantPrefix && consultantPrefix.stringValue) ? consultantPrefix.stringValue
					: "";
			consultantGiven = (consultantGiven && consultantGiven.stringValue) ? consultantGiven.stringValue
					: "";
			consultantFamily = (consultantFamily && consultantFamily.stringValue) ? consultantFamily.stringValue
					: "";
			consultantSuffix = (consultantSuffix && consultantSuffix.stringValue) ? consultantSuffix.stringValue
					: "";

			// alert(consultantPrefix +":"+ consultantGiven +":"+
			// consultantFamily +":"+ consultantSuffix);
			consultant = consultantPrefix + " " + consultantGiven + " "
					+ consultantFamily + " " + consultantSuffix;

			consultants.push({
				name : consultant
			});

			// Given name
			patientGiven = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/given',
							XPathResult.STRING_TYPE);
			// family
			patientFamily = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/family',
							XPathResult.STRING_TYPE);
			// suffix
			patientSuffix = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/suffix',
							XPathResult.STRING_TYPE);
			
			
			patient = (patientGiven && patientGiven.stringValue) ? patientGiven.stringValue : "" + ' '
					+ (patientFamily && patientFamily.stringValue) ? patientFamily.stringValue : "" + ' '
					+ (patientSuffix && patientSuffix.stringValue) ? patientSuffix.stringValue : "";
			// alert("Patient: " + patient.stringValue);

			patients.push({
				name : patient
			});
			/* alert("msg.getXML()" + XmlUtil.xmlToString(msg.getXML())); */
			/*
			 * product = XmlUtil .getXPathResult( msg.getXML(),
			 * 'message/FIAB_MT020000HT02/pertinentInformation/substanceAdministrationOrder/consumable/materialMedProduct/manufacturedMaterialKind/code/code/text()',
			 * XPathResult.STRING_TYPE); // alert("Product: " +
			 * product.stringValue);
			 * 
			 * if (product.stringValue != '') { // alert("Product: " +
			 * product.stringValue); products.push({ concept :
			 * product.stringValue, description : product.stringValue,
			 * 'indexNumber' : indexNum }); }
			 */
			page.hideForm(messageObject);
		}
	}
	collectionPage.finalAmount = total;
	messageTypeScript.initialize();
	messageTypeScript
			.fillData('financialTransactionChargeDetail', chargeDetail);
	messageTypeScript.fillData('amt', total);
	messageTypeScript.fillData('effectiveTime', fullDate);
	messageTypeScript.fillData('consultant', consultants);
	messageTypeScript.fillData('patient', patients);
	messageTypeScript.fillData('service', services);
	// messageTypeScript.fillData('drug', products);
	messageTypeScript.fillData('transactionType',
			AppConstants.TransactionType.RECEIPT);

	var messageAndUIBinder = new MessageAndUIBinder(null, newMessage.msg,
			newMessage.msg.getConfig().getArtifactId());
	messageAndUIBinder.updateId("TRANSACTION_STATUS",
			AppConstants.TransactionStatus.PAID);

	newMessage.transactionType = AppConstants.TransactionType.INVOICE;
	newMessage.transactionStatus = AppConstants.TransactionStatus.UNPAID;

	// alert("MESSAGE: " + XmlUtil.xmlToString(newMessage.msg.getXML()));
	collectionPage.receiptMessage = newMessage;

	collectionPage.toggleGenerateReceiptIcon(false);
	if (!collectionPage.generatedReceiptId)
		appController.getComponent("DataLayer").getReceiptId(
				collectionPage.updateReceiptId)
	else
		collectionPage.updateReceiptId(collectionPage.generatedReceiptId);
};
HIN.CollectionPage.prototype.updateReceiptId = function(receiptId) {
	collectionPage.generatedReceiptId = receiptId;

	var receiptMessage = collectionPage.receiptMessage;// messages[0];
	if (receiptMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null,
				receiptMessage.msg, receiptMessage.messageType);
		messageAndUIBinder.updateId("RECEIPT_ID", receiptId);
		collectionPage.receiptCreated = true;
		collectionPage.openReceipt(receiptMessage);
	}

}

HIN.CollectionPage.prototype.openReceipt = function(receiptMessage) {
	collectionPage.toggleGenerateReceiptIcon(false);
	msg = receiptMessage.msg;
	/* onclick of Invoice icon */
	// alert("Account: " + XmlUtil.xmlToString(msg.getXML()))
	// $("#child_Step1_form").html("");
	var organizationVO = appController.getComponent("Context")
			.getOrganizationVO();
	var address = organizationVO.addr;
	var organizationName = organizationVO.name;
	var telecom = organizationVO.telecom;
	var receiptId;
	// alert("address: " + address + " :organizationName: " + organizationName +
	// " :telecom: " + telecom);
	if (receiptMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null,
				receiptMessage.msg, receiptMessage.messageType);
		receiptId = messageAndUIBinder.getIdRootValue("RECEIPT_ID");
	}
	var receiptForm = '<div  data-role="content" data-theme="d">';
	receiptForm += '<fieldset class="ui-grid-a">';
	receiptForm += '<div style="width: 86%;float-left" class="ui-block-a">';
	receiptForm += '<div id="invoicePage" class="borderHeight" style="border:1px solid #E9E7ED;border-radius: 0.4em 0.4em 0.4em 0.4em; margin-left:5px;">';
	receiptForm += '<div class="ui-grid-b" style="padding:15px">';
	receiptForm += '<div class="ui-block-a" style="width:35%;float:left;"><img  src="images/logo.jpg" class="image"></div>';
	receiptForm += '<div class="ui-block-b"  style="width:50%;float:left;">';
	receiptForm += '<div>';
	receiptForm += '<div id="hospitalName">' + organizationName + '<br>';
	receiptForm += address + '<br>';
	receiptForm += telecom;
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '<div class="ui-block-c"  style="width:15%;float:left; margin-top: -23px;"><h2>RECEIPT</h2></div>';
	receiptForm += '</div>';
	receiptForm += '<!-- middle portion -->';
	receiptForm += '<div  class="ui-grid-b" style="padding:15px">';
	receiptForm += '<div class="ui-block-a" style="width:36%;float:left;"><div style="font-weight:bold;">To: <label id="patientName">Patient Name</label></div></div>';
	receiptForm += '<div class="ui-block-b"  style="width:36%;float:left;">';
	receiptForm += '<div>';
	receiptForm += '<div>&nbsp;</div>';
	receiptForm += '<div>&nbsp;</div>';
	receiptForm += '<div>&nbsp;</div>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '<div class="ui-block-c"  style="width:26%;float:left;">';
	receiptForm += '<div>Invoice Number :&nbsp;<label id="invoiceNo">'
			+ receiptId + '</label></div>';
	receiptForm += '<div><div class="commonDiv" >Date :</div><div class="commonDiv" style="width:11px;">&nbsp;&nbsp;</div><div ><label id="invoiceDate">Date</label></div></div>';
	receiptForm += '<div><div class="commonDiv" >Doctor :</div><div class="commonDiv" style="width:7px">&nbsp;</div><div style="float:left"><label id="doctorName">Physician Name</label></div></div>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '<div>&nbsp;</div>';
	receiptForm += '<!-- table -->';
	receiptForm += '<div id="tableHeight" style="height:276px">';
	receiptForm += '<div class="service_des" style="width:68%;margin-left:10px;float:left">';
	receiptForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;text-align:center;">Description</div>';
	receiptForm += '</div>';
	receiptForm += '<div class="service_amt" style="width:30%; float:left">';
	receiptForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;text-align:center">Amount in USD</div>';
	receiptForm += '</div>';
	receiptForm += '<div class="main_dev" style="width:98.1%;margin-left:10px;float:left;border:1px solid">';
	receiptForm += '<div id="serviceDetails"> </div>';
	receiptForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	receiptForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	receiptForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	receiptForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	receiptForm += '</div>';

	var dependendMessages = receiptMessage.dependendMessages;
	collectionPage.discountAmount = 0;
	collectionPage.interestAmount = 0;
	for ( var index = 0; index < dependendMessages.length; index++) {
		var dependendMessage = dependendMessages[index];
		var chargeType = XmlUtil
				.getXPathResult(
						dependendMessage.msg.getXML(),
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
						XPathResult.STRING_TYPE);
		var amount = XmlUtil
				.getXPathResult(
						dependendMessage.msg.getXML(),
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
						XPathResult.STRING_TYPE);
		if (chargeType.stringValue == "Discount") {
			collectionPage.discountAmount += parseInt(amount.stringValue);
		}
		if (chargeType.stringValue == "Interest") {
			collectionPage.interestAmount += parseInt(amount.stringValue);
		}
	}
	var chargeType = null;

	var discountTotal = 0;
	var total = collectionPage.finalAmount;
	if (collectionPage.discountAmount > collectionPage.interestAmount) {
		discountTotal = collectionPage.discountAmount
				- collectionPage.interestAmount;
		total = total - discountTotal;
	}

	if (collectionPage.discountAmount < collectionPage.interestAmount) {
		discountTotal = collectionPage.interestAmount
				- collectionPage.discountAmount;
		total = total + discountTotal;

	}

	if (collectionPage.discountAmount > 0) {
		receiptForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
		receiptForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Discount</div></span>';
		receiptForm += '</div>';
		receiptForm += '<div class="discount_amt" style="width:30%; float:left;">';
		receiptForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount">'
				+ collectionPage.discountAmount + '</label></div></span>';
		receiptForm += '</div>';
	}
	if (collectionPage.interestAmount > 0) {
		receiptForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
		receiptForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Interest</div></span>';
		receiptForm += '</div>';
		receiptForm += '<div class="discount_amt" style="width:30%; float:left;">';
		receiptForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount">'
				+ collectionPage.interestAmount + '</label></div></span>';
		receiptForm += '</div>';
	}
	receiptForm += '<div class="total" style="width:68.1%;margin-left:10px; height: 7%; float:left;height:55px;">';
	receiptForm += '<span style="padding-left:10px; padding-top:20px;position:relative;top:8px"><div class="total_txt">Total</div></span>';
	receiptForm += '</div>';
	receiptForm += '<div class="total_amt" style="width:30%; float:left;height:57px">';
	receiptForm += '<span style="padding-left:10px"><div class="amount_txt" style="position:relative;top:1px;"><label id="total">'
			+ total + '</label></div></span>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '</div>';
	receiptForm += '<div style="width:10% ;padding-left:40px;float-left" class="ui-block-b">';
	receiptForm += '<div id="print" class="other print-icon-link" ></div><div>Print</div>';
	receiptForm += '</div>';
	receiptForm += '</fieldset>';
	receiptForm += '</div>';

	$("#child_Step3_form").hide();
	$("#child_top_Step3_form").show();
	$("#child_top_Step3_form").append(receiptForm);
	$("#child_top_Step3_form").trigger("create");

	var tHeight = $("#tableHeight").css("height");
	tHeight = tHeight.substring(0, tHeight.length - 2);
	var finalHeight = parseInt(tHeight);

	if (finalHeight >= 276) {
		$('.borderHeight').css('height', 'auto');
	}

	var licenseeVO = appController.getComponent("Context").getLicenseeVO();
	if (licenseeVO) {
		var data = parseFloat(total) * parseFloat(licenseeVO.exchangeRate);
		$('#total').html(
				(parseFloat(total)).toFixed(2)
						+ ' <div style="position: relative; left: 15px;">('
						+ data.toFixed(2) + " " + licenseeVO.currencyCode
						+ ')</div>');
	}

	loadReceiptMessage(msg, appController); /* To load a Receipt message */
	collectionPage.toggleGenerateReceiptIcon(false);
}
