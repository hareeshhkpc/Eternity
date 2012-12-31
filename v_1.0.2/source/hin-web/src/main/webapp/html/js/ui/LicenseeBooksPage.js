var HIN;
if (!HIN)
	HIN = {};
HIN.LicenseeBooksPage = function(appController, pageHolder) {
	licenseeBooksPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "licenseeBooksPage";// pageHolder;
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
};

HIN.LicenseeBooksPage.prototype.init = function(callback, page) {
	this.page = page;
	if (callback) {
		callback(page);
	}
};

HIN.LicenseeBooksPage.prototype.pageBeforeLoad = function(messageType,
		uiGenerator) {
//	uiGenerator.hideRemoveIcon();
	uiGenerator.tableFormat = true;
	uiGenerator.lookup = false;
	uiGenerator.formRender = true;
	uiGenerator.finishTitleOnly=true;
	uiGenerator.tableHeaders = licenseeBooksPage.getServiceTableHeader();
};

HIN.LicenseeBooksPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.LicenseeBooksPage.prototype.addCompleteHandler = function(addNew,
		messageType, message, uiGenerator) {
	/*
	 * if (addNew) { if (messageType.typeName == "NewServices") {
	 * licenseeBooksPage.page.getMessageScript(message, null, function(
	 * messageTypeScript, object, message) { var transactionType =
	 * AppConstants.TransactionType.SERVICE_FEE; var transactionStatus =
	 * AppConstants.TransactionStatus.ORDERED;
	 * messageTypeScript.fillData('transactionType', transactionType);
	 * messageTypeScript.fillData('transactionStatus', transactionStatus); }); }
	 * if (messageType.typeName == "NewProducts") {
	 * licenseeBooksPage.page.getMessageScript(message, null, function(
	 * messageTypeScript, object, message) { var transactionType =
	 * AppConstants.TransactionType.PRODUCT_FEE; var transactionStatus =
	 * AppConstants.TransactionStatus.ORDERED;
	 * messageTypeScript.fillData('transactionType', transactionType);
	 * messageTypeScript.fillData('transactionStatus', transactionStatus); }); } }
	 * 
	 * $('#inner-uiform-' + message.id).find('input[id=chk]').val(
	 * message.messageId);
	 */
};

/*
 * HIN.LicenseeBooksPage.prototype.taskHandler = function(message, taskVO,
 * instance) { // alert("taskHandler"); };
 */

HIN.LicenseeBooksPage.prototype.getServiceTableHeader = function() {
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

HIN.LicenseeBooksPage.prototype.removeCompleteHandler = function(messageType,
		message) {
	// alert("removeCompleteHandler");
};

HIN.LicenseeBooksPage.prototype.taskHandler = function(message, taskVO,
		instance) {
	alert("taskHandler");
	return;

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var serviceChecked = false;
	var messageObjects = [];
	var messageTypes = licenseeBooksPage.selectedStep.getMessageTypes();
	for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
		var messages = messageTypes[messageTypeIndex].getMessages();
		for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
			var message = messages[messageIndex];
			if (message.status == AppConstants.Status.ACTIVE) {
				for ( var index = 0; index < licenseeBooksPage.invoiceMessageMap
						.length(); index++) {
					var map = licenseeBooksPage.invoiceMessageMap
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
	// licenseeBooksPage.saveProcess();
	if (invoiceMessage) {// TODO logic need to be change
		messageObjects.push(invoiceMessage);
	}
	if (messageObjects.length > 0) {
		var parameters = [ messageObjects ];
		licenseeBooksPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}

};

HIN.LicenseeBooksPage.prototype.singleHandler = function(typeName, instance) {
	// alert("singleHandler");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var messageObjects = [];

	if (licenseeBooksPage.invoiceCreated == true) {

		for ( var index = 0; index < licenseeBooksPage.invoiceMessageMap
				.length(); index++) {
			var map = licenseeBooksPage.invoiceMessageMap.getItemAt(index);
			var indexNum = parseInt(index + 1);

			if (map.value === true) {

				var messageId = map.key;
				var message = licenseeBooksPage.appController.getComponent(
						"DataLayer").getMessageObject(messageId);
				messageObjects.push(message);
			}
		}
		if (licenseeBooksPage.invoiceMessage) {// TODO logic need to be
													// change
			messageObjects.push(licenseeBooksPage.invoiceMessage);
		}
		licenseeBooksPage.invoiceCreated = false;
	} else {

		var messageTypes = licenseeBooksPage.selectedStep.getMessageTypes();
		for ( var messageTypeIndex = 0; messageTypeIndex < messageTypes.length; messageTypeIndex++) {
			var messageType = messageTypes[messageTypeIndex];
			if (messageType.typeName == typeName) {
				var messages = messageType.getMessages();
				for ( var messageIndex = 0; messageIndex < messages.length; messageIndex++) {
					var message = messages[messageIndex];
					if (message.status == AppConstants.Status.ACTIVE) {
						page.fillParticipants(message);
						page.complete(message);
						messageObjects.push(message);
					}
				}
			}
		}
	}
	// licenseeBooksPage.saveProcess();
	// alert("messageObjects : " + messageObjects.length);
	// return;

	if (messageObjects.length > 0) {
		var parameters = [ messageObjects ];
		licenseeBooksPage.appController.getComponent("DataLayer")
				.createOrUpdateTasks(parameters);
	}

};

HIN.LicenseeBooksPage.prototype.refreshHandler = function(instance) {
	// alert("refreshHandler : " + instance);
	var messages = instance.getMessages();
	for ( var index = 0; index < messages.length; index++) {
		// alert(messages[index]);
	}
};

HIN.LicenseeBooksPage.prototype.addToInvoice = function() {

	// alert("Service: " + licenseeBooksPage.serviceCheckFlag + " Product: "
	// +
	// licenseeBooksPage.productCheckFlag);
	if (licenseeBooksPage.productCheckFlag === true
			|| licenseeBooksPage.serviceCheckFlag === true) {

		licenseeBooksPage.page.createMessage("FIAB_MT020000HT02", null,
				null, null, licenseeBooksPage.messageCreationComplete, null);
	}
}

HIN.LicenseeBooksPage.prototype.messageCreationComplete = function(
		newMessage, conceptLookup, message) {
	licenseeBooksPage.page.getMessageScript(newMessage, null,
			licenseeBooksPage.fillNewInvoice);
};

HIN.LicenseeBooksPage.prototype.fillNewInvoice = function(messageTypeScript,
		object, newMessage) {
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

	for ( var index = 0; index < licenseeBooksPage.invoiceMessageMap
			.length(); index++) {
		var map = licenseeBooksPage.invoiceMessageMap.getItemAt(index);
		var indexNum = parseInt(index + 1);

		if (map.value === true) {

			var messageId = map.key;
			var msg = licenseeBooksPage.appController.getComponent(
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

			consultant = XmlUtil
					.getXPathResult(
							msg.getXML(),
							'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given',
							XPathResult.STRING_TYPE);
			// alert("Consultant: " + consultant.stringValue);
			consultant = (consultant && consultant.stringValue) ? consultant.stringValue : "";
			consultants.push({
				name : consultant.stringValue
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
			patient = patientGiven.stringValue + ' '
					+ patientFamily.stringValue + ' '
					+ patientSuffix.stringValue;
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

	// alert("MESSAGE: " + XmlUtil.xmlToString(newMessage.msg.getXML()));

	$('#divSecondary').hide();
	$('#divPrimary').css('width', '100%');
	licenseeBooksPage.invoiceMessage = newMessage;
	licenseeBooksPage.invoiceCreated = true;
	licenseeBooksPage.openInvoice(newMessage.msg);

};

HIN.LicenseeBooksPage.prototype.openInvoice = function(msg) {
	/* onclick of Invoice icon */
	// alert("Account: " + XmlUtil.xmlToString(msg.getXML()))
	$("#child_Step1_form").html("");

	var organizationVO = appController.getComponent("Context")
			.getSelectedOrganizationVO();
	var address = organizationVO.addr;
	var organizationName = organizationVO.name;
	var telecom = organizationVO.telecom;

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
	invoiceForm += '<div>Invoice Number :&nbsp;<label id="invoiceNo">no</label></div>';
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
	loadMessage(msg); /* To load a Invoice message */

}
