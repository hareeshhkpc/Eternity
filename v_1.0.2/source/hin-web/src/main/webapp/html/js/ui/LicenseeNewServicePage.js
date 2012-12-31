var HIN;
if (!HIN)
	HIN = {};
HIN.LicenseeNewServicePage = function(appController, pageHolder) {
	licenseeNewServicePage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "licenseeNewServicePage";// pageHolder;
	this.uiInstance = null;
	this.groupHeaderMap = null;
	this.uiInstances = null;
	this.page = null;
	this.serviceTotalRender = false;
	this.otherFeeTotalRender = false;
	this.serviceCheckFlag = false;
	this.otherFeeCheckFlag = false;
	this.serviceCostTotalRender = false;
	this.invoiceMessageMap = new HIN.HashMap();
	this.serviceMessageMap = new HIN.HashMap();
	this.invoiceCreated = false;
	this.invoiceMessage = null;
	this.discountMessage = null;
	this.processUpdate = true;
	this.finishClicked = false;
	this.invoicedMessageObjects = [];
};

HIN.LicenseeNewServicePage.prototype.init = function(callback, page) {
	this.page = page;
	if (licenseeNewServicePage.haveDiscountMessage()) {
		if (callback) {
			callback(page);
		}
	} else {
		this.createDiscountMessage(callback, page);
	}
};
HIN.LicenseeNewServicePage.prototype.haveDiscountMessage = function(page) {
	var messageTypes = licenseeNewServicePage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.transactionType.toLowerCase() == "LICENSEEDISCOUNT"
					.toLowerCase()) {
				this.discountMessage = message;
				licenseeNewServicePage.loadComplete();
				return true;
			}
		}
	}
	return false;
}

HIN.LicenseeNewServicePage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.finishTitleOnly = true;
	if (messageType.typeName == "Services") {
		uiGenerator.tableHeaders = licenseeNewServicePage
				.getServiceTableHeader();
	} else if (messageType.typeName == "OtherFees") {
		uiGenerator.tableHeaders = licenseeNewServicePage
				.getOtherFeeTableHeader();
	}

};
HIN.LicenseeNewServicePage.prototype.pageAfterLoad = function(page) {
	licenseeNewServicePage.toggleGenerateInvoiceIcon(true);
};
/*
 * HIN.LicenseeNewServicePage.prototype.pageAfterLoad = function(page) {
 * 
 * var messageTypes = licenseeNewServicePage.selectedStep.getMessageTypes(); for (
 * var messageTypeIndex = 0; messageTypeIndex < messageTypes.length;
 * messageTypeIndex++) { var messages =
 * messageTypes[messageTypeIndex].getMessages(); for ( var messageIndex = 0;
 * messageIndex < messages.length; messageIndex++) {
 * licenseeNewServicePage.loadComplete(); } } };
 */

HIN.LicenseeNewServicePage.prototype.createDiscountMessage = function(callBack,
		page) {
	this.appController.getComponent("DataLayer").createMessageByType(
			"FIAB_MT020000HT02",
			function(messageObj) {
				messageObj.transactionType = "LICENSEEDISCOUNT";
				messageObj.messageForm = "LICENSEE_DISCOUNT_FORM";
				messageObj.insertBeforeFooter = true;
				var messageType = licenseeNewServicePage.page.selectedStep
						.getMessageTypeByTypeName("Services");
				messageType.addMessage(messageObj);
				licenseeNewServicePage.discountMessage = messageObj;
				if (callBack)
					callBack(page);
			});
};

HIN.LicenseeNewServicePage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.LicenseeNewServicePage.prototype.addCompleteHandler = function(addNew,
		messageType, message, uiGenerator) {
	/*
	 * if (addNew) { if (messageType.typeName == "NewServices") {
	 * licenseeNewServicePage.page.getMessageScript(message, null, function(
	 * messageTypeScript, object, message) { var transactionType =
	 * AppConstants.TransactionType.SERVICE_FEE; var transactionStatus =
	 * AppConstants.TransactionStatus.ORDERED;
	 * messageTypeScript.fillData('transactionType', transactionType);
	 * messageTypeScript.fillData('transactionStatus', transactionStatus); }); }
	 * if (messageType.typeName == "NewProducts") {
	 * licenseeNewServicePage.page.getMessageScript(message, null, function(
	 * messageTypeScript, object, message) { var transactionType =
	 * AppConstants.TransactionType.PRODUCT_FEE; var transactionStatus =
	 * AppConstants.TransactionStatus.ORDERED;
	 * messageTypeScript.fillData('transactionType', transactionType);
	 * messageTypeScript.fillData('transactionStatus', transactionStatus); }); } }
	 */

	$('#inner-uiform-' + message.id).find('input[id=chk]').val(
			message.messageId);

};

HIN.LicenseeNewServicePage.prototype.removeCompleteHandler = function(
		messageType, message) {
	licenseeNewServicePage.calculateTotal();
	// alert("removeCompleteHandler");
};
/*
 * HIN.LicenseeNewServicePage.prototype.taskHandler = function(message, taskVO,
 * instance) { // alert("taskHandler"); };
 */

HIN.LicenseeNewServicePage.prototype.getServiceTableHeader = function() {
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
	tableHeader += 'style="width:31.3%">Service Provider</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.1%">Amount</div> ';

	return tableHeader;
}

HIN.LicenseeNewServicePage.prototype.getOtherFeeTableHeader = function() {
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
	tableHeader += 'style="width:31.3%">Comments</div> ';
	tableHeader += '<div ';
	tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
	tableHeader += 'style="width:12.1%">Amount</div> ';

	return tableHeader;
}

HIN.LicenseeNewServicePage.prototype.taskHandler = function(message, taskVO,
		instance) {
	alert("taskHandler");
	return;

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var serviceChecked = false;
	var messageObjects = [];
	var messageTypes = licenseeNewServicePage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.status == AppConstants.Status.ACTIVE) {
				for ( var index = 0; index < licenseeNewServicePage.invoiceMessageMap
						.length(); index++) {
					var map = licenseeNewServicePage.invoiceMessageMap
							.getItemAt(index);
					if (map.value === true) {
						serviceChecked = true;
						var messageId = map.key;
						if (messageId == message.messageId) {
							page.fillParticipants(message);
							page.complete(message);
							messageObjects.push(message);
						}
					}
				}

			}
		}
	}
	if (!serviceChecked) {
		notificationmsg.info("Please select service or product");
	}
	// licenseeNewServicePage.saveProcess();
	if (invoiceMessage) {// TODO logic need to be change
		messageObjects.push(invoiceMessage);
	}
	if (messageObjects.length > 0) {
		var parameters = [ messageObjects ];
		licenseeNewServicePage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}

};

HIN.LicenseeNewServicePage.prototype.singleHandler = function(typeName,
		instance) {
	// alert("singleHandler");
	licenseeNewServicePage.finishClicked = true;
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var messageObjects = [];
	invoicedMessageObjects=[];

	if (licenseeNewServicePage.invoiceCreated == true) {

		for ( var index = 0; index < licenseeNewServicePage.invoiceMessageMap
				.length(); index++) {
			var map = licenseeNewServicePage.invoiceMessageMap.getItemAt(index);
			var indexNum = parseInt(index + 1);

			if (map.value === true) {

				var messageId = map.key;
				var message = licenseeNewServicePage.appController
						.getComponent("DataLayer").getMessageObject(messageId);
				messageObjects.push(message);
				invoicedMessageObjects.push(message);
			}
		}
		if (licenseeNewServicePage.invoiceMessage) {// TODO logic need to be
			// change
			messageObjects.push(licenseeNewServicePage.invoiceMessage);
		}
		licenseeNewServicePage.invoiceCreated = false;
	} else {

		var messageTypes = licenseeNewServicePage.selectedStep
				.getMessageTypes();
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
	// licenseeNewServicePage.saveProcess();
	// alert("messageObjects : " + messageObjects.length);
	// return;

	if (messageObjects.length > 0) {
		/*var parameters = [ messageObjects ];
		licenseeNewServicePage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);*/
		
		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		cacheManager.renderProcessUpdate = false;
		cacheManager.syncToCouch = true;
		var processObjects = [];
		processObjects.push(licenseeNewServicePage.processDefinition);
		var parameters = [ messageObjects, processObjects ];
		licenseeNewServicePage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}

};

HIN.LicenseeNewServicePage.prototype.refreshHandler = function(instance) {
	// alert("refreshHandler : " + instance);
	var messages = instance.getMessages();
	for ( var index = 0; index < messages.length; index++) {
		// alert(messages[index]);
	}
};

HIN.LicenseeNewServicePage.prototype.addToInvoice = function() {

	// alert("Service: " + licenseeNewServicePage.serviceCheckFlag + " Product:
	// "
	// +
	// licenseeNewServicePage.otherFeeCheckFlag);
	if (licenseeNewServicePage.otherFeeCheckFlag === true
			|| licenseeNewServicePage.serviceCheckFlag === true) {

		licenseeNewServicePage.page.createMessage("FIAB_MT020000HT02", null,
				null, null, licenseeNewServicePage.messageCreationComplete,
				null);
	}
}

HIN.LicenseeNewServicePage.prototype.messageCreationComplete = function(
		newMessage, conceptLookup, message) {
	licenseeNewServicePage.page.getMessageScript(newMessage, null,
			licenseeNewServicePage.fillNewInvoice);
};

HIN.LicenseeNewServicePage.prototype.fillNewInvoice = function(
		messageTypeScript, object, newMessage) {
	// var invoiceMsgProxy = ??; // Get the object of MessageTypeScript here
	// loaded with FIAB_MT020000HT02 script
	// alert("messageTypeScript: " + messageTypeScript);
	var chargeDetail = [];
	var services = [];
	var total = 0;
	var serviceCode = "";
	var serviceDescription = "";
	var consultants = [];
	var patients = [];
	var products = [];
	var effectiveTimes = [];

	for ( var index = 0; index < licenseeNewServicePage.invoiceMessageMap
			.length(); index++) {
		var map = licenseeNewServicePage.invoiceMessageMap.getItemAt(index);
		var indexNum = parseInt(index + 1);

		if (map.value === true) {

			var messageId = map.key;
			var msg = licenseeNewServicePage.appController.getComponent(
					"DataLayer").getMsg(messageId);

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
			var fullDate = year + '-' + month + '-' + day;

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

			consultant = consultantPrefix + " " + consultantGiven + " "
					+ consultantFamily + " " + consultantSuffix;
			// alert("Consultant: " + consultant.stringValue);

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

		}
	}
	if (licenseeNewServicePage.discountMessage != null) {
		var invoiceId = licenseeNewServicePage.getMessageID(newMessage);
		licenseeNewServicePage.page.getMessageScript(
				licenseeNewServicePage.discountMessage, null, function(
						discountMessageTypeScript, object, disMessage) {
					discountMessageTypeScript.fillData("transactionType",
							"DISCOUNT");
					discountMessageTypeScript.fillData("transactionStatus",
							"UNPAID");
					var discountMessageAndUIBinder = new MessageAndUIBinder(
							null, disMessage.msg, disMessage.msg.getConfig()
									.getArtifactId());
					discountMessageAndUIBinder
							.updateId("INVOICE_ID", invoiceId);

					/* alert("Message" + XmlUtil.xmlToString(message.message)); */
				})

		var chargeType = XmlUtil
				.getXPathResult(
						licenseeNewServicePage.discountMessage.msg.getXML(),
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
						XPathResult.STRING_TYPE);
		var amount = XmlUtil
				.getXPathResult(
						licenseeNewServicePage.discountMessage.msg.getXML(),
						'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/netAmt/value',
						XPathResult.STRING_TYPE);
		if (chargeType != null && chargeType.stringValue == "Discount") {
			total -= parseInt(amount.stringValue);
		} else if (chargeType != null && chargeType.stringValue == "Interest") {
			total += parseInt(amount.stringValue);
		}
	}
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
			AppConstants.TransactionType.LICENSEEINVOICE);

	var messageAndUIBinder = new MessageAndUIBinder(null, newMessage.msg,
			newMessage.msg.getConfig().getArtifactId());
	messageAndUIBinder.updateId("TRANSACTION_STATUS",
			AppConstants.TransactionStatus.UNPAID);

	// alert("MESSAGE: " + XmlUtil.xmlToString(newMessage.msg.getXML()));

	$('#divSecondaryStep1').hide();
	$('#divPrimaryStep1').css('width', '100%');
	licenseeNewServicePage.invoiceMessage = newMessage;
	licenseeNewServicePage.invoiceCreated = true;
	licenseeNewServicePage.generateInvoice();

};
HIN.LicenseeNewServicePage.prototype.generateInvoice = function() {
	appController.getComponent("DataLayer").getLicenseeInvoiceId(
			licenseeNewServicePage.updateInvoiceId)

};
HIN.LicenseeNewServicePage.prototype.updateInvoiceId = function(invoiceId) {
	var invoiceMessage =	licenseeNewServicePage.invoiceMessage;
	if (invoiceMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null,
				invoiceMessage.msg, invoiceMessage.messageType);
		messageAndUIBinder.updateId("INVOICE_ID", invoiceId);
	}
	licenseeNewServicePage.openInvoice(invoiceMessage);
};
HIN.LicenseeNewServicePage.prototype.openInvoice = function(invoiceMessage) {
	msg=invoiceMessage.msg;
	/* onclick of Invoice icon */
	// alert("Account: " + XmlUtil.xmlToString(msg.getXML()))
	$("#child_Step1_form").html("");

	var organizationVO = appController.getComponent("Context")
			.getSelectedOrganizationVO();
	var address = organizationVO.addr;
	var organizationName = organizationVO.name;
	var telecom = organizationVO.telecom;
	var invoiceId;
	if (invoiceMessage.msg) {
		var messageAndUIBinder = new MessageAndUIBinder(null, invoiceMessage.msg,
				invoiceMessage.messageType);
		invoiceId = messageAndUIBinder
				.getIdRootValue("INVOICE_ID");
	}
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
	invoiceForm += '<div class="ui-block-b"  style="width:24%;float:left;">';
	invoiceForm += '<div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="ui-block-c"  style="width:40%;float:left;">';
	invoiceForm += '<div>Invoice Number :&nbsp;<label id="invoiceNo">'+invoiceId+'</label></div>';
	invoiceForm += '<div><div class="commonDiv" >Date :</div><div class="commonDiv" style="width:77px">&nbsp;&nbsp;</div><div ><label id="invoiceDate">Date</label></div></div>';
	invoiceForm += '<div><div class="commonDiv" >Doctor :</div><div class="commonDiv" style="width:64px">&nbsp;</div><div style="float:left"><label id="doctorName">Physician Name</label></div></div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div>&nbsp;</div>';
	invoiceForm += '<!-- table -->';
	invoiceForm += '<div id="tableHeight" style="height:276px">';
	invoiceForm += '<div class="service_des" style="width:68%;margin-left:10px;float:left">';
	invoiceForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;">Description</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="service_amt" style="width:30%; float:left">';
	invoiceForm += '<div class="colHeading" style="padding-left:10px;font-weight:bold;">Amount</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="main_dev" style="width:98.1%;margin-left:10px;float:left;border:1px solid">';
	invoiceForm += '<div id="serviceDetails"> </div>';
	invoiceForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	invoiceForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	invoiceForm += '<div class="description" style="padding-left:9px; height:10%; float:left"><div>&nbsp; </div></div>';
	invoiceForm += '<div class="amount" style="width:30%; height:10%; float:left"><div class="amount_val">&nbsp;</div></div>';
	invoiceForm += '</div>';

	var chargeType = XmlUtil
			.getXPathResult(
					licenseeNewServicePage.discountMessage.msg.getXML(),
					'//FIAB_MT020000HT02/component/financialTransactionChargeDetail/id/extension',
					XPathResult.STRING_TYPE);
	if (chargeType != null && chargeType.stringValue != null
			&& chargeType.stringValue != "") {
		if (chargeType.stringValue.toLowerCase() == "DISCOUNT".toLowerCase()) {
			invoiceForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
			invoiceForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Discount</div></span>';
			invoiceForm += '</div>';
			invoiceForm += '<div class="discount_amt" style="width:30%; float:left;">';
			invoiceForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount"></label></div></span>';
			invoiceForm += '</div>';
		} else if (chargeType.stringValue.toLowerCase() == "INTEREST"
				.toLowerCase()) {
			invoiceForm += '<div class="discount" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
			invoiceForm += '<span style="padding-left:10px; padding-top:20px"><div class="discount_txt">Interest</div></span>';
			invoiceForm += '</div>';
			invoiceForm += '<div class="discount_amt" style="width:30%; float:left;">';
			invoiceForm += '<span style="padding-left:10px"><div class="discount_amount_txt"><label id="dicount"></label></div></span>';
			invoiceForm += '</div>';
		}
	}
	invoiceForm += '<div class="total" style="width:68.1%;margin-left:10px; height: 7%; float:left">';
	invoiceForm += '<span style="padding-left:10px; padding-top:20px"><div class="total_txt">Total</div></span>';
	invoiceForm += '</div>';
	invoiceForm += '<div class="total_amt" style="width:30%; float:left">';
	invoiceForm += '<span style="padding-left:10px"><div class="amount_txt"><label id="total"></label></div></span>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '</div>';
	invoiceForm += '<div style="width:10% ;padding-left:40px;float-left" class="ui-block-b">';
	invoiceForm += '<div id="print" class="other print-icon-link" ></div><div>Print</div>';
	invoiceForm += '</div>';
	invoiceForm += '</fieldset>';
	invoiceForm += '</div>';

	$("#child_Step1_form").append(invoiceForm);
	$("#child_Step1_form").trigger("create");

	var tHeight = $("#tableHeight").css("height");
	tHeight = tHeight.substring(0, tHeight.length - 2);
	var finalHeight = parseInt(tHeight);

	if (finalHeight >= 276) {
		$('.borderHeight').css('height', 'auto');
	}
	loadMessage(msg, appController, licenseeNewServicePage.discountMessage.msg); /*
																					 * To
																					 * load
																					 * a
																					 * Invoice
																					 * message
																					 */

}

HIN.LicenseeNewServicePage.prototype.getMessageID = function(message) {

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

HIN.LicenseeNewServicePage.prototype.loadComplete = function() {
	$('#select-choice0').change(function() {
		licenseeNewServicePage.calculateTotal(licenseeNewServicePage.getSum());
	})

	$('#MOInplaceDisplayValue').keyup(function() {
		licenseeNewServicePage.calculateTotal(licenseeNewServicePage.getSum());
	})

}
HIN.LicenseeNewServicePage.prototype.calculateTotal = function() {
	sum = licenseeNewServicePage.getSum();
	var selectType = $('#select-choice0').val();
	var netAmt = sum;
	// var discountAmount = parseInt($('#MOInplaceDisplayValue').val());
	if (this.discountMessage != null) {
		var discountAmount = $('#discountAmt').find('#MOInplaceDisplayValue')
				.val();
		// var discountAmount = parseInt($('#discountAmt').val());
		if (!isNaN(discountAmount) && sum > 0
				&& discountAmount.stringValue != "") {
			if (selectType) {
				if (selectType.toLowerCase() == 'DISCOUNT'.toLowerCase()) {
					netAmt = parseInt(sum - discountAmount);
				} else {
					netAmt = parseInt(sum) + parseInt(discountAmount);
				}

			}
		}
	}
	if (!isNaN(netAmt)) {
		$('#total1').val(netAmt);
	}
}
HIN.LicenseeNewServicePage.prototype.getSum = function() {
	var netAmt = 0;
	for ( var index = 0; index < licenseeNewServicePage.serviceMessageMap
			.length(); index++) {
		var map = licenseeNewServicePage.serviceMessageMap.getItemAt(index);
		var indexNum = parseInt(index + 1);
		if (map.value === true) {
			var messageId = map.key;
			if (map.value) {
				var message = licenseeNewServicePage.appController
						.getComponent("DataLayer").getMessageObject(messageId);
				// (XmlUtil.xmlToString(message.msg.getXML()));
				var value = XmlUtil.getXPathResult(message.msg.getXML(),
						'message/FIAB_MT020000HT02/amt/value',
						XPathResult.STRING_TYPE);
				if (value) {
					// alert(value.stringValue);
					netAmt = netAmt + parseInt(value.stringValue);
				}
			}

		}
	}
	return netAmt;
}

HIN.LicenseeNewServicePage.prototype.finishCompleteHandler = function() {
	if (licenseeNewServicePage.processUpdate == false
			|| licenseeNewServicePage.finishClicked == false) {
		return;
	}
	var renderingEngine = appController.getComponent("RenderingEngine");
	var processDefinition = licenseeNewServicePage.processDefinition;

	var step1 = processDefinition.getStep("Step1");
	var newServicesMessageType = step1.getMessageTypeByTypeName("Services");
	var newServicesMessages = newServicesMessageType.getMessages();
	var newOtherFeeMessageType = step1.getMessageTypeByTypeName("OtherFees");
	var newProductMessages = newOtherFeeMessageType.getMessages();

	if (licenseeNewServicePage.invoiceMessage) {

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
			var removed = newOtherFeeMessageType
					.removeMessage(invoicedMessageObjects[messageIndex]);
			if (removed)
				removedCount++;
		}

		if (invoicedMessageObjects && invoicedMessageObjects.length > 0) {
			step1.updateMessageGroupByType(newOtherFeeMessageType, removedCount);
		}

		// alert(nextTypeName);

		var step5 = processDefinition.getStep("Step5");
		var messageType = step5.getMessageTypeByTypeName("OutstandingInvoices");
		if (messageType) {
			var messageObject = factoryClass.createMessage();
			messageObject.messageId = licenseeNewServicePage.invoiceMessage.messageId;
			messageObject.transactionType =AppConstants.TransactionType.LICENSEEINVOICE;
			messageObject.transactionStatus = AppConstants.TransactionStatus.UNPAID;
			/*
			 * alert(messageObject.transactionType + ":" +
			 * messageObject.transactionStatus);
			 */
			messageType.addMessage(messageObject);
			step5.addMessageGroup(messageType, 1);
		}

	}
	var cacheManager = appController.getComponent("DataLayer").cacheManager;
	cacheManager.renderProcessUpdate = true;
	appController.getComponent("RenderingEngine").getChildComponent("Process")
			.updateProcess();
	licenseeNewServicePage.finishClicked = false;
}

HIN.LicenseeNewServicePage.prototype.toggleGenerateInvoiceIcon = function(show) {

	if (show == true) {
		$('#imgGenerateInvoice' + licenseeNewServicePage.selectedStep.stepName).show();
		$('#imgGenerateInvoiceText' + licenseeNewServicePage.selectedStep.stepName).show();
	} else {
		$('#imgGenerateInvoice' + licenseeNewServicePage.selectedStep.stepName).hide();
		$('#imgGenerateInvoiceText' + licenseeNewServicePage.selectedStep.stepName).hide();
	}

	$('#imgGenerateInvoice' + licenseeNewServicePage.selectedStep.stepName).unbind(
			'click', licenseeNewServicePage.addToInvoice);
	$('#imgGenerateInvoice' + licenseeNewServicePage.selectedStep.stepName).bind('click',
			licenseeNewServicePage.addToInvoice);
};
