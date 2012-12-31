var HIN;
if (!HIN)
	HIN = {};
HIN.AccountsPage = function(appController, pageHolder) {
	accountPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "accountPage";// pageHolder;
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.uiInstances = null;
	this.page = null;
	this.serviceTotalRender = false;
	this.productTotalRender = false;
	this.serviceCheckFlag = false;
	this.productCheckFlag = false;
	this.serviceCostTotalRender = false;
	this.invoiceMessageMap = new HIN.HashMap();
	this.invoiceCreated = false;
	this.invoiceMessage = null;
	this.messageObjects = [];
	this.invoicedMessageObjects = [];
	this.processUpdate = true;
	this.finishClicked = false;
	this.generatedInvoiceId = null;
	this.discountAmount = 0;
	this.interestAmount = 0;
	this.finalAmount = 0;
	this.showTotalText = false;
	this.invoiceMessageTypeName = null;
	this.selectedItems = [];
	this.showAddToInvoice = false;
	this.paymentAdvice = null;
	this.finalInvoiceAmount = 0.0;
	this.invoiceGenerated = false;
	var invoiceNumber = null;

};

HIN.AccountsPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.AccountsPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {

	// alert("AccountsPage pageBeforeLoad : " + uiGenerator);
	// uiGenerator.hideMainHeader();
	// uiGenerator.hideAddIcon();
	// uiGenerator.hideSubHeader();
	// uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.taskHandler = accountPage.taskHandler;
	uiGenerator.finishTitleOnly = true;
	accountPage.serviceTotalRender = false;

	if (messageType.typeName == "NewServices") {
		uiGenerator.tableHeaders = accountPage.getServiceTableHeader();
	} else if (messageType.typeName == "NewProducts") {
		uiGenerator.tableHeaders = accountPage.getProductTableHeader();
	} else if (messageType.typeName == "UnpaidInvoice"
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
			uiGenerator.showRemoveIcon();
		}

		uiGenerator.showRemoveIcon();
		uiGenerator.actions = true;
		uiGenerator.customRenderer = true;
		uiGenerator.customRendererForm = "DISCOUNT_FORM";
		uiGenerator.tableHeaders = accountPage.getUnpaidInvoiceHeader();
		uiGenerator.customTitleRenderer = true;
		uiGenerator.customTitle = "Discount";
	}

};

HIN.AccountsPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.AccountsPage.prototype.addCompleteHandler = function(addNew, messageType,
		message, uiGenerator) {
	var temp = messageType.typeName;

	if (addNew) {
		if (messageType.typeName == "NewServices") {
			accountPage.page.getMessageScript(message, null, function(
					messageTypeScript, object, message) {
				var transactionType = AppConstants.TransactionType.SERVICE_FEE;
				var transactionStatus = AppConstants.TransactionStatus.ORDERED;
				messageTypeScript.fillData('transactionType', transactionType);
				messageTypeScript.fillData('transactionStatus',
						transactionStatus);
			});
		}
		if (messageType.typeName == "NewProducts") {
			accountPage.page.getMessageScript(message, null, function(
					messageTypeScript, object, message) {
				var transactionType = AppConstants.TransactionType.PRODUCT_FEE;
				var transactionStatus = AppConstants.TransactionStatus.ORDERED;
				messageTypeScript.fillData('transactionType', transactionType);
				messageTypeScript.fillData('transactionStatus',
						transactionStatus);
			});
		}
		if (messageType.typeName == "UnpaidInvoice"
				&& message.messageForm == "DISCOUNT_FORM") {
			var unpaidMessage = null;
			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				unpaidMessage = messages[messageIndex];
				if (unpaidMessage.messageForm == "INVOICE_FORM"
						|| messageIndex == 0)
					break;
			}

			unpaidMessage.addDependendMessage(message);
			var invoiceId = accountPage.getInvoiceID(unpaidMessage);

			var messageAndUIBinder = message.messageAndUIBinder;
			messageAndUIBinder.updateId("INVOICE_ID", invoiceId);
			messageAndUIBinder.updateId("TRANSACTION_TYPE",
					AppConstants.TransactionStatus.DISCOUNT);
			messageAndUIBinder.updateId("TRANSACTION_STATUS", "UNPAID");
			message.transactionType = "DISCOUNT";

			if (accountPage.invoiceMessageTypeName != temp) {
				accountPage.showTotalText = true;
			}
			if (accountPage.showTotalText && temp != "Accounthistory") {
				accountPage.invoiceMessageTypeName = temp;
				var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
				totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
				totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="invoiceDiscountAmount'
						+ temp
						+ '"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';
				$('#footer-' + uiGenerator.instanceId).append(totalBlock);
				accountPage.showTotalText = false;
			}

		}
	}

	if (messageType.typeName != "UnpaidInvoice"
			&& accountPage.invoiceMessage == null)
		accountPage.toggleAddToInvoiceIcon(true);

	$('#inner-uiform-' + message.id).find('input[id=chk]').val(
			message.messageId);
};

HIN.AccountsPage.prototype.getInvoiceID = function(unpaidMessage) {

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

/*
 * HIN.AccountsPage.prototype.taskHandler = function(message, taskVO, instance) { //
 * alert("taskHandler"); };
 */

HIN.AccountsPage.prototype.getServiceTableHeader = function() {
	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="border-right:0px;width:3%"><input type="checkbox" data-role="none" id="chkhead" value="" /></div>';
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:16%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:30%">Service</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:31.3%">Consultant</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.1%">Amount</div> ';

	return tableHeader;
}

HIN.AccountsPage.prototype.getProductTableHeader = function() {
	var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
	tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
	tableHeader += 'style="width:3%"><input type="checkbox" data-role="none" id="chkhead2" value="" /></div>';
	tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
	tableHeader += 'style="width:16%">Date</div>';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:46.9%">Product</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.3%">Quantity</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:14.2%">Amount</div> ';
	return tableHeader;
}

HIN.AccountsPage.prototype.getUnpaidInvoiceHeader = function() {

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

HIN.AccountsPage.prototype.taskHandler = function(message, taskVO, instance) {

};

HIN.AccountsPage.prototype.singleHandler = function(typeName, instance) {
	// alert("singleHandler");
	accountPage.finishClicked = true;
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var messageObjects = [];
	invoicedMessageObjects = [];

	if (accountPage.invoiceCreated == true
			&& accountPage.invoiceGenerated == false) {
		notificationmsg.info("Please generate invoice");
		return;
	}

	if (accountPage.invoiceCreated == true
			&& accountPage.invoiceGenerated == true) {
		accountPage.generatedInvoiceId = null;
		// for ( var index = 0; index < accountPage.invoiceMessageMap.length();
		// index++) {

		for ( var index = 0; index < accountPage.selectedItems.length; index++) {
			var messageId = accountPage.selectedItems[index];
			var map = accountPage.invoiceMessageMap.get(messageId);
			if (map)
				map.value = true;
			var indexNum = parseInt(index + 1);

			if (map.value === true) {

				var messageId = map.key;
				var message = accountPage.appController.getComponent(
						"DataLayer").getMessageObject(messageId);
				messageObjects.push(message);
				invoicedMessageObjects.push(message);
			}
		}
		

		if (accountPage.invoiceMessage) {// TODO logic need to be change
			accountPage.getFinalInvoiceAmount();
			// create payment advice message
			accountPage.page.createMessage("FIAB_MT020000HT02", null, null,
					null, accountPage.paymentMessageCreationComplete, null);
			messageObjects.push(accountPage.invoiceMessage);
		}
		accountPage.invoiceCreated = false;
	} else {
		var messageTypes = accountPage.selectedStep.getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageType = messageTypes[messageTypeIndex];
			// if (messageType.typeName == typeName) {
			var messages = messageType.getMessages();
			for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
				var message = messages[messageIndex];
				if (message.status == AppConstants.Status.ACTIVE) {
					page.fillParticipants(message);
					page.complete(message);
					messageObjects.push(message);
				}
			}
			// }
		}
	}
	if (accountPage.paymentAdvice) {// TODO logic need to be change
		messageObjects.push(accountPage.paymentAdvice);
	}
	// accountPage.saveProcess();
	// alert("messageObjects : " + messageObjects.length);
	// return;
	if (messageObjects.length > 0) {

		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		cacheManager.renderProcessUpdate = false;
		cacheManager.syncToCouch = true;
		var processObjects = [];
		processObjects.push(accountPage.processDefinition);
		var parameters = [ messageObjects, processObjects ];
		accountPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}

};

HIN.AccountsPage.prototype.refreshHandler = function(instance) {

};

HIN.AccountsPage.prototype.cancelHandler = function(instance) {
	// alert("cancelHandler");
	if (accountPage.invoiceMessage) {
		$("#child_Step1_form").show();
		$("#child_top_Step1_form").html("");
		$("#child_top_Step1_form").hide();
		// accountPage.invoiceMessage = null;
		accountPage.invoiceGenerated = false;
		accountPage.toggleGenerateInvoiceIcon(true);
		accountPage.toggleCancelButton(false);
	}
};

HIN.AccountsPage.prototype.addToInvoice = function() {

	// alert("Service: " + accountPage.serviceCheckFlag + " Product: " +
	// accountPage.productCheckFlag);
	accountPage.selectedItems = [];
	if (accountPage.productCheckFlag === true
			|| accountPage.serviceCheckFlag === true) {

		accountPage.appController.getComponent("DataLayer")
				.createMessageByType(AppConstants.XPaths.Finance.MESSAGE_TYPE,
						accountPage.messageCreationComplete)
		/*
		 * accountPage.page.createMessage("FIAB_MT020000HT02", null, null, null,
		 * accountPage.messageCreationComplete, null);
		 */
	} else {
		notificationmsg.info("Please select service or product");
	}
}

HIN.AccountsPage.prototype.messageCreationComplete = function(newMessage) {
	accountPage.page.getMessageScript(newMessage, null,
			accountPage.fillNewInvoice);
};

HIN.AccountsPage.prototype.fillNewInvoice = function(messageTypeScript, object,
		newMessage) {
	// var invoiceMsgProxy = ??; // Get the object of MessageTypeScript here
	// loaded with FIAB_MT020000HT02 script
	// alert("messageTypeScript: " + messageTypeScript);
	// alert("fillNewInvoice: " + XmlUtil.xmlToString(newMessage.msg.getXML()));

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
	for ( var index = 0; index < accountPage.invoiceMessageMap.length(); index++) {
		var map = accountPage.invoiceMessageMap.getItemAt(index);
		var indexNum = parseInt(index + 1);

		if (map.value === true) {

			var messageId = map.key;
			map.value = false;
			accountPage.selectedItems.push(messageId);
			var messageObject = accountPage.appController.getComponent(
					"DataLayer").getMessageObject(messageId);
			var msg = accountPage.appController.getComponent("DataLayer")
					.getMsg(messageId);

			// alert("msg" + msg.getConfig().getArtifactId());
			var messageAndUIBinder = new MessageAndUIBinder(null, msg, msg
					.getConfig().getArtifactId());
			messageAndUIBinder.updateId("TRANSACTION_STATUS",
					AppConstants.TransactionStatus.INVOICED);

			// alert("Selected MEssage: " + index +
			// XmlUtil.xmlToString(msg.getXML()));

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

			serviceCode = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/pertinentInformation/observationOrder/code/code',
							XPathResult.STRING_TYPE);
			serviceCode = (serviceCode && serviceCode.stringValue) ? serviceCode.stringValue : "";
			//serviceCode = serviceCode.stringValue;
			// alert("serviceCode"+ serviceCode)

			serviceDescription = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/pertinentInformation/observationOrder/code/displayName',
							XPathResult.STRING_TYPE);
			serviceDescription = (serviceDescription && serviceDescription.stringValue) ? serviceDescription.stringValue : "";
			//serviceDescription = serviceDescription.stringValue;

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
			product = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/pertinentInformation/substanceAdministrationOrder/consumable/materialMedProduct/manufacturedMaterialKind/code/code/text()',
							XPathResult.STRING_TYPE);
			// alert("Product: " + product.stringValue);

			if (product.stringValue != '') {
				// alert("Product: " + product.stringValue);
				products.push({
					concept : product.stringValue,
					description : product.stringValue,
					'indexNumber' : indexNum
				});

			}
			page.hideForm(messageObject);
		}
	}
	accountPage.finalAmount = total;
	messageTypeScript.initialize();
	messageTypeScript
			.fillData('financialTransactionChargeDetail', chargeDetail);
	messageTypeScript.fillData('amt', total);
	messageTypeScript.fillData('effectiveTime', fullDate);
	messageTypeScript.fillData('consultant', consultants);
	messageTypeScript.fillData('patient', patients);
	messageTypeScript.fillData('service', services);
	messageTypeScript.fillData('drug', products);
	messageTypeScript.fillData('transactionType',
			AppConstants.TransactionType.INVOICE);

	var messageAndUIBinder = new MessageAndUIBinder(null, newMessage.msg,
			newMessage.msg.getConfig().getArtifactId());
	messageAndUIBinder.updateId("TRANSACTION_STATUS",
			AppConstants.TransactionStatus.UNPAID);

	newMessage.transactionType = AppConstants.TransactionType.INVOICE;
	newMessage.transactionStatus = AppConstants.TransactionStatus.UNPAID;

	// alert("MESSAGE: " + XmlUtil.xmlToString(newMessage.msg.getXML()));
	accountPage.invoiceMessage = newMessage;
	accountPage.invoiceCreated = true;

	var processDefinition = accountPage.processDefinition;
	var step1 = processDefinition.getStep("Step1");
	var unpaidInvoiceMessageType = step1
			.getMessageTypeByTypeName("UnpaidInvoice");

	if (!unpaidInvoiceMessageType) {
		unpaidInvoiceMessageType = factoryClass.createMessageType(
				AppConstants.XPaths.Finance.MESSAGE_TYPE, "UnpaidInvoice",
				"INVOICE_FORM", "Unpaid Invoice");
	}

	unpaidInvoiceMessageType.formHtml = "INVOICE_FORM";

	var map = page.groupHeaderMap.get(unpaidInvoiceMessageType.typeName);
	if (map) {
		var id = map.value;
		var uiGenerator = page.uiInstances.get(id).value;
		uiGenerator.customRenderer = false;
		var messageTypeObj = uiGenerator
				.getMessageType(unpaidInvoiceMessageType.type);
		messageTypeObj.formHtml = unpaidInvoiceMessageType.formHtml;
	}

	newMessage.messageForm = "INVOICE_FORM";
	newMessage.transactionType = "";
	newMessage.title = unpaidInvoiceMessageType.title;

	unpaidInvoiceMessageType.headerView = true;
	unpaidInvoiceMessageType.addMessage(newMessage);

	/*
	 * alert("unpaidInvoiceMessageType : " + unpaidInvoiceMessageType);
	 * alert("newMessage : " + newMessage);
	 */

	page.loadForm(unpaidInvoiceMessageType);
	step1.addMessageGroup(unpaidInvoiceMessageType, 1);

	accountPage.toggleAddToInvoiceIcon(false);
	accountPage.toggleGenerateInvoiceIcon(true);
	accountPage.unCheckForcely(false);

};

HIN.AccountsPage.prototype.calculateDiscount = function(message) {
	if (message.transactionType == "DISCOUNT") {
		var dependentMessage = message;
		var msg = accountPage.appController.getComponent("DataLayer").getMsg(
				dependentMessage.messageId);
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
			accountPage.discountAmount += parseFloat(amount.stringValue);
		}
		if (chargeType.stringValue == "Interest") {
			accountPage.interestAmount += parseFloat(amount.stringValue);
		}
	}
};

HIN.AccountsPage.prototype.generateInvoice = function() {
	if (!accountPage.invoiceMessage) {
		notificationmsg
				.info("Please select service or product and add to invoice");
	} else {
		accountPage.invoiceGenerated = true;
		accountPage.toggleGenerateInvoiceIcon(false);
		accountPage.toggleCancelButton(true);
		if (!accountPage.generatedInvoiceId)
			appController.getComponent("DataLayer").getInvoiceId(
					accountPage.updateInvoiceId)
		else
			accountPage.updateInvoiceId(accountPage.generatedInvoiceId);
	}

}
HIN.AccountsPage.prototype.updateInvoiceId = function(invoiceId) {
	accountPage.generatedInvoiceId = invoiceId;
	// accountPage.calculateDiscount();
	/*
	 * var processDefinition = accountPage.processDefinition; var step1 =
	 * processDefinition.getStep("Step1"); var unpaidInvoiceMessageType = step1
	 * .getMessageTypeByTypeName("UnpaidInvoice"); var messages =
	 * unpaidInvoiceMessageType.getMessages(); if (messages.length > 0) {
	 */
	var invoiceMessage = accountPage.invoiceMessage;// messages[0];
	if (invoiceMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null,
				invoiceMessage.msg, invoiceMessage.messageType);
		messageAndUIBinder.updateId("INVOICE_ID", invoiceId);

		accountPage.openInvoice(invoiceMessage);
	}

	// accountPage.invoiceMessage = invoiceMessage;

	// }

}
HIN.AccountsPage.prototype.openInvoice = function(invoiceMessage) {
	
	msg = invoiceMessage.msg;
	/* onclick of Invoice icon */
	// alert("Account: " + XmlUtil.xmlToString(msg.getXML()))
	// $("#child_Step1_form").html("");
	var organizationVO = appController.getComponent("Context")
			.getOrganizationVO();
	var address = organizationVO.addr;
	var organizationName = organizationVO.name;
	var telecom = organizationVO.telecom;
	var invoiceId;
	
	if (invoiceMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null,
				invoiceMessage.msg, invoiceMessage.messageType);
		invoiceId = messageAndUIBinder.getIdRootValue("INVOICE_ID");
	}
	
	this.invoiceNumber =  invoiceId;
	
	var invoiceForm = '<div  data-role="content" data-theme="d">';
	invoiceForm += '<fieldset class="ui-grid-a">';
	invoiceForm += '<div style="width: 86%;float-left" class="ui-block-a">';
	invoiceForm += '<div id="invoicePage" class="borderHeight" style="border:1px solid #E9E7ED;border-radius: 0.4em 0.4em 0.4em 0.4em; margin-left:5px;">';
	invoiceForm += '<div class="ui-grid-b" style="padding:15px">';
	invoiceForm += '<div class="ui-block-a" style="width:35%;float:left;"><img  src="images/logo.jpg" class="image"></div>';
	invoiceForm += '<div class="ui-block-b"  style="width:50%;float:left;">';
	invoiceForm += '<div>';
	invoiceForm += '<div id="hospitalName">' + organizationName + '<br>';
	invoiceForm += address + '<br>';
	invoiceForm += telecom;
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="ui-block-c"  style="width:15%;float:left; margin-top: -23px;"><h2>INVOICE</h2></div>';
	invoiceForm += '</div>';
	invoiceForm += '<!-- middle portion -->';
	invoiceForm += '<div  class="ui-grid-b" style="padding:15px">';
	invoiceForm += '<div class="ui-block-a" style="width:36%;float:left;"><div style="font-weight:bold;">To: <label id="patientName">Patient Name</label></div></div>';
	invoiceForm += '<div class="ui-block-b"  style="width:36%;float:left;">';
	invoiceForm += '<div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="ui-block-c"  style="width:26%;float:left;">';
	invoiceForm += '<div>Invoice Number :&nbsp;<label id="invoiceNo">'
			+ invoiceId + '</label></div>';
	invoiceForm += '<div><div class="commonDiv" >Date :</div><div class="commonDiv" style="width:11px;">&nbsp;&nbsp;</div><div ><label id="invoiceDate">Date</label></div></div>';
	invoiceForm += '<div><div class="commonDiv" >Doctor :</div><div class="commonDiv" style="width:7px">&nbsp;</div><div style="float:left"><label id="doctorName">Physician Name</label></div></div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<!-- table -->';
	invoiceForm += '<div id="tableHeight" style="height:276px">';
	invoiceForm += '<div class="service_des" style="width:68%;margin-left:10px;float:left">';
	invoiceForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;text-align:center;">Description</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="service_amt" style="width:30%; float:left">';
	invoiceForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;text-align:center">Amount in USD</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="main_dev" style="width:98.1%;margin-left:10px;float:left;border:1px solid">';
	invoiceForm += '<div id="serviceDetails"> </div>';
	invoiceForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	invoiceForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	invoiceForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	invoiceForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	invoiceForm += '</div>';

	var dependendMessages = invoiceMessage.dependendMessages;
	accountPage.discountAmount = 0;
	accountPage.interestAmount = 0;
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
			accountPage.discountAmount += parseInt(amount.stringValue);
		}
		if (chargeType.stringValue == "Interest") {
			accountPage.interestAmount += parseInt(amount.stringValue);
		}
	}
	var chargeType = null;

	var discountTotal = 0;
	var total = accountPage.finalAmount;
	if (accountPage.discountAmount > accountPage.interestAmount) {
		discountTotal = accountPage.discountAmount - accountPage.interestAmount;
		total = total - discountTotal;
	}

	if (accountPage.discountAmount < accountPage.interestAmount) {
		discountTotal = accountPage.interestAmount - accountPage.discountAmount;
		total = total + discountTotal;

	}

	if (accountPage.discountAmount > 0) {
		invoiceForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
		invoiceForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Discount</div></span>';
		invoiceForm += '</div>';
		invoiceForm += '<div class="discount_amt" style="width:30%; float:left;">';
		invoiceForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount">'
				+ accountPage.discountAmount + '</label></div></span>';
		invoiceForm += '</div>';
	}
	if (accountPage.interestAmount > 0) {
		invoiceForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
		invoiceForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Interest</div></span>';
		invoiceForm += '</div>';
		invoiceForm += '<div class="discount_amt" style="width:30%; float:left;">';
		invoiceForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount">'
				+ accountPage.interestAmount + '</label></div></span>';
		invoiceForm += '</div>';
	}
	invoiceForm += '<div class="total" style="width:68.1%;margin-left:10px; height: 7%; float:left;height:55px;">';
	invoiceForm += '<span style="padding-left:10px; padding-top:20px;position:relative;top:8px"><div class="total_txt">Total</div></span>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="total_amt" style="width:30%; float:left;height:57px">';
	invoiceForm += '<span style="padding-left:10px"><div class="amount_txt" style="position:relative;top:1px;"><label id="total">'
			+ total + '</label></div></span>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div style="width:10% ;padding-left:40px;float-left" class="ui-block-b">';
	invoiceForm += '<div id="print" class="other print-icon-link" ></div><div>Print</div>';
	invoiceForm += '</div>';
	invoiceForm += '</fieldset>';
	invoiceForm += '</div>';

	$("#child_Step1_form").hide();
	$("#child_top_Step1_form").show();
	$("#child_top_Step1_form").append(invoiceForm);
	$("#child_top_Step1_form").trigger("create");

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
	loadMessage(msg, appController); /* To load a Invoice message */

}

HIN.AccountsPage.prototype.finishCompleteHandler = function() {
	if (accountPage.processUpdate == false
			|| accountPage.finishClicked == false) {
		return;
	}

	var renderingEngine = appController.getComponent("RenderingEngine");
	var processDefinition = accountPage.processDefinition;

	var step1 = processDefinition.getStep("Step1");
	var newServicesMessageType = step1.getMessageTypeByTypeName("NewServices");
	var newServicesMessages = newServicesMessageType.getMessages();
	var newProductMessageType = step1.getMessageTypeByTypeName("NewProducts");
	var newProductMessages = newProductMessageType.getMessages();
	
	if (accountPage.invoiceMessage) {
		var removedCount = 0;

		for ( var messageIndex = 0; messageIndex < invoicedMessageObjects.length; messageIndex++) {
			var removed = newServicesMessageType
					.removeMessage(invoicedMessageObjects[messageIndex]);
			if (removed)
				removedCount++;
		}

		if (invoicedMessageObjects && invoicedMessageObjects.length > 0) {
			step1
					.updateMessageGroupByType(newServicesMessageType,
							removedCount);
		}
		removedCount = 0;

		for ( var messageIndex = 0; messageIndex < invoicedMessageObjects.length; messageIndex++) {
			var removed = newProductMessageType
					.removeMessage(invoicedMessageObjects[messageIndex]);
			if (removed)
				removedCount++;
		}

		if (invoicedMessageObjects && invoicedMessageObjects.length > 0) {
			step1.updateMessageGroupByType(newProductMessageType, removedCount);
		}

		var messageTypes = step1.getMessageTypes();

		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			if (messageTypes[messageTypeIndex].typeName
					.indexOf("UnpaidInvoice") > -1) {
				var messageType = messageTypes[messageTypeIndex];
				messageType.removeAllMessages();
				step1.removeMessageGroup(messageType);
			}

		}

		/*
		 * var step2 = processDefinition.getStep("Step2"); var messageTypes =
		 * step2.getMessageTypes(); var messageType = null; var typeName = null;
		 * var nextTypeName = null; var count = 1; var insertIndex = 0; var
		 * newMessageType = null; for ( var messageTypeIndex = 0;
		 * messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		 * 
		 * if (messageTypes[messageTypeIndex].typeName
		 * .indexOf("UnpaidInvoice-No-") > -1) {
		 * 
		 * messageType = messageTypes[messageTypeIndex]; } else { insertIndex =
		 * messageTypeIndex;
		 * 
		 * break; } } if (messageType) { typeName = messageType.typeName;
		 * 
		 * if (typeName) { count = typeName.substr(typeName.lastIndexOf("-") +
		 * 1, typeName.length); // UnpaidInvoice-No- count = parseInt(count) +
		 * 1; } nextTypeName = "UnpaidInvoice-No-" + count; newMessageType =
		 * factoryClass.createMessageType(messageType.type, nextTypeName,
		 * messageType.formHtml, messageType.title); } else { nextTypeName =
		 * "UnpaidInvoice-No-" + count; newMessageType =
		 * factoryClass.createMessageType(
		 * AppConstants.XPaths.Finance.MESSAGE_TYPE, nextTypeName,
		 * "INVOICE_FORM", "Unpaid Invoice"); }
		 * 
		 * newMessageType.addMessage(accountPage.invoiceMessage);
		 * step2.insertMessageType(insertIndex, newMessageType);
		 * step2.addMessageGroup(newMessageType, 1);
		 */

		// alert(nextTypeName);
		var step3 = processDefinition.getStep("Step3");
		var messageType = step3.getMessageTypeByTypeName("AccountBalance");
		if (messageType) {
			var messageObject = factoryClass.createMessage();
			messageObject.messageId = accountPage.invoiceMessage.messageId;
			messageObject.transactionType = accountPage.invoiceMessage.transactionType;
			messageObject.transactionStatus = accountPage.invoiceMessage.transactionStatus;
			messageType.addMessage(messageObject);
			step3.addMessageGroup(messageType, 1);
		}

		messageType = step3.getMessageTypeByTypeName("NewPayment");
		if (messageType) {
			messageType.addMessage(accountPage.paymentAdvice);
			step3.addMessageGroup(messageType, 1);
		}

	}
	
	var cacheManager = appController.getComponent("DataLayer").cacheManager;
	cacheManager.renderProcessUpdate = true;
	appController.getComponent("RenderingEngine").getChildComponent("Process")
			.updateProcess();
	accountPage.finishClicked = false;
	
	var patientId = appController.getComponent("Context").getPatientVO().subscriberId;
	accountPage.appController.getComponent("DataLayer").convertToPdf( patientId, accountPage.invoiceMessage.messageId, this.invoiceNumber);

};

HIN.AccountsPage.prototype.removeCompleteHandler = function(messageType,
		message, uiGenerator) {
	if (messageType.typeName == "UnpaidInvoice") {
		/* alert(message.transactionType); */
		if (message.transactionType != "DISCOUNT") {
			/* alert("removeCompleteHandler : " + messageType); */
			var processDefinition = accountPage.processDefinition;
			var step1 = processDefinition.getStep("Step1");
			var messageTypes = step1.getMessageTypes();
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
				if (messageTypes[messageTypeIndex].typeName
						.indexOf("UnpaidInvoice") > -1) {
					var messageType = messageTypes[messageTypeIndex];
					messageType.removeAllMessages();
					step1.removeMessageGroup(messageType);
					// step1.removeMessageType(messageType.typeName);
					page.hideSection(messageType, message);
				}

			}
			// page.groupHeaderMap.removeItem(messageType.typeName);

			for ( var index = 0; index < accountPage.selectedItems.length; index++) {
				var messageId = accountPage.selectedItems[index];
				var map = accountPage.invoiceMessageMap.get(messageId);
				/*
				 * if (map) map.value = true;
				 */
				var messageObject = accountPage.appController.getComponent(
						"DataLayer").getMessageObject(messageId);
				page.showForm(messageObject);
			}
			accountPage.unCheckForcely(true);
			accountPage.productCheckFlag = false;
			accountPage.serviceCheckFlag = false;
			accountPage.invoiceMessage = null;
			accountPage.selectedItems = [];
			accountPage.toggleGenerateInvoiceIcon(false);
			accountPage.toggleAddToInvoiceIcon(true);
			$('#footer-' + uiGenerator.instanceId).html("");
			accountPage.showTotalText = true;

		} else {
			if (accountPage.invoiceMessage)
				accountPage.invoiceMessage.removeDependendMessage(message);
			// $('#invoiceDiscountAmount').val();
		}
	}
};

HIN.AccountsPage.prototype.toggleAddToInvoiceIcon = function(show) {

	if (show == true) {
		$('#imgInvoice' + accountPage.selectedStep.stepName).show();
		$('#imgInvoiceText' + accountPage.selectedStep.stepName).show();
	} else {
		$('#imgInvoice' + accountPage.selectedStep.stepName).hide();
		$('#imgInvoiceText' + accountPage.selectedStep.stepName).hide();
	}

	$('#imgInvoice' + accountPage.selectedStep.stepName).unbind('click',
			accountPage.addToInvoice);
	$('#imgInvoice' + accountPage.selectedStep.stepName).bind('click',
			accountPage.addToInvoice);
};

HIN.AccountsPage.prototype.toggleGenerateInvoiceIcon = function(show) {

	if (show == true) {
		$('#imgGenerateInvoice' + accountPage.selectedStep.stepName).show();
		$('#imgGenerateInvoiceText' + accountPage.selectedStep.stepName).show();
	} else {
		$('#imgGenerateInvoice' + accountPage.selectedStep.stepName).hide();
		$('#imgGenerateInvoiceText' + accountPage.selectedStep.stepName).hide();
	}

	$('#imgGenerateInvoice' + accountPage.selectedStep.stepName).unbind(
			'click', accountPage.generateInvoice);
	$('#imgGenerateInvoice' + accountPage.selectedStep.stepName).bind('click',
			accountPage.generateInvoice);
};
HIN.AccountsPage.prototype.updateIcons = function(uiGenerator) {

	$('#divSecondary' + uiGenerator.uiSelectedStep.stepName).show();
	$('#divPrimary' + uiGenerator.uiSelectedStep.stepName).css('width', '93%');
	/*
	 * $('#divSecondary').show(); $('#divPrimary').css('width', '93%');
	 */
	$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).unbind('click',
			accountPage.addToInvoice);
	$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).bind('click',
			accountPage.addToInvoice);

	$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName).unbind(
			'click', accountPage.generateInvoice);
	$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName).bind(
			'click', accountPage.generateInvoice);
};

HIN.AccountsPage.prototype.unCheckForcely = function(checked) {

	if (checked == false) {
		$("#total1").val(0);
		$("#total2").val(0);
	} else {
		$("#chkhead").attr('checked', false);
		$("#chkhead2").attr('checked', false);
		for ( var index = 0; index < accountPage.selectedItems.length; index++) {
			var messageId = accountPage.selectedItems[index];
			var message = accountPage.appController.getComponent("DataLayer")
					.getMessageObject(messageId);
			var divs = $('#inner-uiform-' + message.id);
			$(divs).find('input[id=chk]').attr("checked", false);
			// $(divs).find('input[id=chk]').trigger('click');
			// alert('triggered');
		}
	}

}

HIN.AccountsPage.prototype.toggleCancelButton = function(show) {

	if (show)
		$('#' + accountPage.selectedStep.stepName + '_pageActions').find(
				'.cancel').show();
	else
		$('#' + accountPage.selectedStep.stepName + '_pageActions').find(
				'.cancel').hide();
};

HIN.AccountsPage.prototype.paymentMessageCreationComplete = function(
		newMessage, conceptLookup, message) {
	accountPage.page.getMessageScript(newMessage, null,
			accountPage.fillNewPaymentAdvice);
};

HIN.AccountsPage.prototype.fillNewPaymentAdvice = function(messageTypeScript,
		object, newMessage) {
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	day = (day < 10) ? '0' + day : day;
	month = (month < 10) ? '0' + month : month;
	var fullDate = year + '-' + month + '-' + day + " "
			+ date.getHours() + ":" + date.getMinutes() + ":"
			+ date.getSeconds();
	
	messageTypeScript.initialize();
	messageTypeScript.fillData('amt', accountPage.finalInvoiceAmount);
	messageTypeScript.fillData('transactionType',
			AppConstants.TransactionType.PAYMENTADVICE);
	messageTypeScript.fillData('effectiveTime', fullDate);
	messageTypeScript.fillData('transactionStatus',
			AppConstants.TransactionStatus.UNPAID);
	newMessage.transactionType = AppConstants.TransactionType.PAYMENTADVICE;
	newMessage.transactionStatus = AppConstants.TransactionStatus.UNPAID;

	accountPage.paymentAdvice = newMessage;
	/*
	 * alert("paymentAdviceMessage: " +
	 * XmlUtil.xmlToString(newMessage.msg.getXML()));
	 */
};
HIN.AccountsPage.prototype.getFinalInvoiceAmount = function() {
	var invoiceAmount = XmlUtil.getXPathResult(accountPage.invoiceMessage.msg
			.getXML(), '//message/FIAB_MT020000HT02/amt[1]/value',
			XPathResult.STRING_TYPE);
	var dependentMessages = accountPage.invoiceMessage.dependendMessages;
	accountPage.finalInvoiceAmount = 0.0;
	accountPage.interestAmount = 0.0;
	accountPage.discountAmount = 0.0;
	for ( var index = 0; index < dependentMessages.length; index++) {
		var message = dependentMessages[index];
		accountPage.calculateDiscount(message);
	}
	accountPage.finalInvoiceAmount = ((parseFloat(invoiceAmount.stringValue) + parseFloat(accountPage.interestAmount)) - parseFloat(accountPage.discountAmount));
	var messageAndUIBinder = new MessageAndUIBinder(null,
			accountPage.invoiceMessage.msg, accountPage.invoiceMessage.msg
					.getConfig().getArtifactId());
	messageAndUIBinder.updateId("INVOICE_AMOUNT",
			accountPage.finalInvoiceAmount);
	messageAndUIBinder.updateId("INTEREST", accountPage.interestAmount);
	messageAndUIBinder.updateId("DISCOUNT", accountPage.discountAmount);
}
