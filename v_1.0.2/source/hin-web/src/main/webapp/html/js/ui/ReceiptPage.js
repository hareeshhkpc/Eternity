function loadReceiptMessage(msg, appController,disMsg) {
	// alert("loadMessage : " + XmlUtil.xmlToString(msg.getXML())); 
	var component;
	// var transDetails;
	var patientName;
	var physicianName;
	/* var date; */
	var invoiceNo;
	var amtNode;
	var patientNameNode;
	var physicianNameNode;
	var invcNode;
	var amt;
	var pnm;
	var physician;
	var products;
	var invc;
	var total;
	var components = new Array();
	var pertinentInformation = new Array();
	var serviceTitle = new Array();
	var serviceAmt = new Array();
	var productTitle = new Array();
	var description;
	this.packageNames = [];
	this.x = 0;

	component = XmlUtil.getXPathResult(msg.getXML(),
			"message/FIAB_MT020000HT02");
	if (component) {
		var comp = component.iterateNext();
	}

	var productNode = XmlUtil.getXPathResult(msg.getXML(),
			"message/FIAB_MT020000HT02");
	if (productNode) {
		var proComp = productNode.iterateNext();
	}

	components = XmlUtil.findByName(comp, "component", false);
	pertinentInformation = XmlUtil.findByName(comp, "pertinentInformation",
			false);

	products = XmlUtil.findByName(proComp, "pertinentInformation", true);

	var pertinentProductInfo = XmlUtil.findByName(products,
			"substanceAdministrationOrder", false);
	this.mainArray = [];
	for (i = 0; i < components.length; i++) {

		var financialTrans = XmlUtil.findByName(components[i],
				"financialTransactionChargeDetail", true);

		var uniqueID = XmlUtil.findByName(financialTrans, "id", true);
		var rootID = XmlUtil.findByName(uniqueID, "root", true);
		var amountId = XmlUtil.text(rootID);

		var amount = XmlUtil.findByName(financialTrans, "netAmt", true);
		var netAmount = XmlUtil.findByName(amount, "value", true);
		var amountValue = XmlUtil.text(netAmount);
		var pertinentInfo = XmlUtil.findByName(pertinentInformation[i],
				"observationOrder", true);

		for (j = 0; j < components.length; j++) {

			var pertinentInfo = XmlUtil.findByName(pertinentInformation[j],
					"observationOrder", true);
			var codeName = XmlUtil.findByName(pertinentInfo, "code", true);
			var title = XmlUtil.findByName(codeName, "displayName", true);
			var code = XmlUtil.findByName(codeName, "code", true);
			var serviceID = XmlUtil.findByName(pertinentInfo, "id", true);
			var serviceRoot = XmlUtil.findByName(serviceID, "root", true);
			var codeName = XmlUtil.findByName(pertinentInfo, "code", true);
			var code = XmlUtil.findByName(codeName, "code", true);
			if (serviceRoot) {
				var serviceIds = XmlUtil.text(serviceRoot);
				// alert("serviceId: "
				// +XmlUtil.text(serviceRoot));
				var serviceTitle = XmlUtil.text(title);
				if (serviceIds == amountId) {
					this.packageNames.push({
						amt : amountValue,
						title : XmlUtil.text(code),
						description : serviceTitle
					});
					this.mainArray.push({
						amt : amountValue,
						title : serviceTitle,
					});

				}
			}

		}// for j

	}// for i


	
	var patientVO = appController.getComponent("Context").getPatientVO();
	if(patientVO)
		patientName = patientVO.name;

	/*physicianNameNode = XmlUtil
			.getXPathResult(
					msg.getXML(),
					"message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given", XPathResult.STRING_TYPE);
	physicianName = (physicianNameNode && physicianNameNode.stringValue) ? physicianNameNode.stringValue:"";*/

	// physician Prefix Name
	var physicianNamePrefix = XmlUtil
			.getXPathResult(
					msg.getXML(),
					'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/prefix',
					XPathResult.STRING_TYPE);

	// physician Given Name
	var physicianNameGiven = XmlUtil
			.getXPathResult(
					msg.getXML(),
					'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given',
					XPathResult.STRING_TYPE);

	// physician Family Name
	var physicianNameFamily = XmlUtil
			.getXPathResult(
					msg.getXML(),
					'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/family',
					XPathResult.STRING_TYPE);

	// physician Suffix Name
	var physicianNameSuffix = XmlUtil
			.getXPathResult(
					msg.getXML(),
					'message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/suffix',
					XPathResult.STRING_TYPE);
	physicianNamePrefix = (physicianNamePrefix && physicianNamePrefix.stringValue) ? physicianNamePrefix.stringValue
			: "";
	physicianNameGiven = (physicianNameGiven && physicianNameGiven.stringValue) ? physicianNameGiven.stringValue
			: "";
	physicianNameFamily = (physicianNameFamily && physicianNameFamily.stringValue) ? physicianNameFamily.stringValue
			: "";
	physicianNameSuffix = (physicianNameSuffix && physicianNameSuffix.stringValue) ? physicianNameSuffix.stringValue
			: "";

	physicianName = physicianNamePrefix + " " + physicianNameGiven + " "
			+ physicianNameFamily + " " + physicianNameSuffix;
	
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var fullDate = day + '/' + month + '/' + year;

	amtNode = XmlUtil.getXPathResult(msg.getXML(),
			"message/FIAB_MT020000HT02/amt/value");
	if (amtNode) {
		amt = amtNode.iterateNext();
		total = XmlUtil.text(amt);
	}


	$('#patientName').html(patientName);
	$('#doctorName').html(physicianName);
	$('#invoiceDate').html(fullDate);
	$("#print").hover(
			function() {
				$('#print').removeClass('print-icon-link').addClass(
						'print-icon-link-hover')
			},
			function() {
				$('#print').removeClass('print-icon-link-hover').addClass(
						'print-icon-link')
			});

	$('#print').unbind('click', function() {

	});

	$('#print')
			.bind(
					'click',
					function() {

						$('#print').removeClass('print-icon-link');
						var invoiceContentprint = document
								.getElementById('invoicePage');
						//alert("invoiceContentprint.innerHTML: " + invoiceContentprint.innerHTML);
						var popupWin = window.open('', '_blank',
								'width=300,height=300');
						popupWin.document.open();
						popupWin.document
								.write('<html> <head><link rel="stylesheet" href="../html/js/jquery.mobile-1.1.1.min.css" />'
										+ '<link rel="stylesheet" href="../html/css/mobile.css" type="text/css" />'
										+ '<link rel="stylesheet" href="../html/css/invoice.css" type="text/css" />'
										+ '<link rel="stylesheet" media="print" href="../html/css/invoicePrint.css" /><style>@media print { body {font-family:arial;font-size:10px;} }</style>'
										+ '</head><body onload="window.print()">'
										+ invoiceContentprint.innerHTML
										+ '</body></html>');
						popupWin.document.close();

					});
	loadPackageServices(0);
};
function loadPackageServices(index) {

	if (index < this.packageNames.length) {
		getPackageServices(this.packageNames[index], function(data) {
			for (j in data) {
				var serviceName = data[j].title;
				var serviceNameBlock = null;
				if (j == 0) {
					serviceNameBlock = loadDescription(this.x, data[j].title,
							true);
				} else {
					serviceNameBlock = loadDescription(this.x, data[j].title,
							false);
				}
				$('#serviceDetails').append(serviceNameBlock);
				var cost = data[j].amt;
				var costBlock = loadAmount(cost);
				$('#amt' + this.x).append(costBlock);
				this.x++;
			}
			index++;
			loadPackageServices(index);
		});
	}
};
function getPackageServices(packageName, callback) {

	appController.getComponent("DataLayer").loadAllConceptServices(
			packageName.title,
			function(allConceptServiceLookup, object) {

				var subServices = [];

				if (packageName.title) {
					subServices.push({
						amt : packageName.amt,
						title : packageName.title
					});
				} else {
					subServices.push({
						amt : packageName.amt,
						title : packageName.description
					});
				}
				var conceptLookUp = new HIN.ConceptLookup(
						allConceptServiceLookup);
				/* var con = allConceptServiceLookup.getConcept(packageName); */

				for (index in allConceptServiceLookup.getAllServices()) {
					var concept = allConceptServiceLookup
							.getConcept(allConceptServiceLookup
									.getAllServices()[index].value);
					var Fee = concept.getAttribute("Fee");

					subServices.push({
						amt : "",
						title : concept.name
					});
					/* alert("name" + $.toJSON(concept)); */
					/*
					 * for (j in concept.conceptAttributes) { if
					 * (concept.conceptAttributes[j].key == "Fee") {
					 * subServices.push({ amt :
					 * concept.conceptAttributes[j].value, title : }) } }
					 */
				}
				if (callback)
					callback(subServices);
			}, null);

};

function loadDescription(index, description, status) {
	if (description) {
		if (status) {
			var label = '<div class="description" style="padding-left:9px; height:10%; float:left">';
			label += '<div>';
			label += description;
			label += '</div>';
			label += '</div>';
			label += '<div id="amt' + index + '">';
			label += '</div>';
		} else {
			var label = '<div class="description" style="padding-left:9px; height:10%; float:left">';
			label += '<div>---';
			label += description;
			label += '</div>';
			label += '</div>';
			label += '<div id="amt' + index + '">';
			label += '</div>';
		}

	}
	return label;
}

function loadAmount(amount) {
	var label = '<div class="amount" style="width:30%; height:10%; float:left">';
	label += '<div class="amount_val">';
	if (amount)
		label += parseFloat(amount).toFixed(2);
	else
		label += "";
	label += '</div></div>';
	return label;
}

