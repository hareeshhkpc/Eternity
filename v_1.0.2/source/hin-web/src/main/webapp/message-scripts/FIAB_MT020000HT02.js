/**
 * FIAB_MT020000HT02.
 */

function FIAB_MT020000HT02(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	this.complete = complete;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

	
	function initialize() {
		if (thisObject.logger)
			thisObject.logger
					.logTest('XML Before: \n'+ XmlUtil.xmlToString(thisObject.messageAndUIBinder.messageObject.getXML()));

		 /* UPDATING SUBSCRIBER_ID */
		var fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,subject,patient,patientPerson";
		var type = "II";
		var tagName = "id";
		var pathFields = fields.split(',');
		var patient = appController.getComponent("Context").getPatient();

		var instanceObject = [ 'SUBSCRIBER_ID', patient, null ];

		if (thisObject.logger)
			thisObject.logger.logTest("Instance: " + instanceObject);

		messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
				instanceObject);

		 /* UPDATING ORGANISATION  DETAILS*/
		var orgId = appController.getComponent("Context")
				.getSelectedOrganizationVO().subscriberId;
		thisObject.messageAndUIBinder.updateId("ORGANIZATION_ID", orgId);

		try {
			/*var registrationMessage = appController.getComponent("Context").getFromContext("registration");
			var use = null, prefix = null, family = null, given = null, suffix = null;
			 if (registrationMessage) {
				var XmlFragment = XmlUtil.findByName(registrationMessage,"message", true);
				var XmlSubFragment = XmlUtil.findByName(XmlFragment,"PRPA_MT201000HT03", true);
				var identifiedPerson = XmlUtil.findByName(XmlSubFragment,"identifiedPerson", true);
				var name = XmlUtil.findByName(identifiedPerson, "name", true);
				use = XmlUtil.findByName(name, "use", true);
				prefix = XmlUtil.findByName(name, "prefix", true);
				family = XmlUtil.findByName(name, "family", true);
				given = XmlUtil.findByName(name, "given", true);
				suffix = XmlUtil.findByName(name, "suffix", true);
				if (prefix)
					prefix = XmlUtil.text(prefix);
				if (family)
					family = XmlUtil.text(family);
				if (given)
					given = XmlUtil.text(given);
				if (suffix)
					suffix = XmlUtil.text(suffix);
				var desc = XmlUtil.findByName(identifiedPerson, "desc", true);
				var thumbnail = XmlUtil.findByName(desc, "thumbnail", true);
				if (thumbnail)
					thumbnail = XmlUtil.text(thumbnail);
			}*/
			var patientVO = appController.getComponent(
					"Context").getPatientVO();
			 /* UPDATING CONSULTANT DETAILS*/
			if(patientVO){
				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,subject,patient,patientPerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
				instanceObject = [ patientVO.nameType, patientVO.prefixName, patientVO.givenName, patientVO.familyName, patientVO.suffixName ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject);
			}
			
			var physicianVO = appController.getComponent("Context").getPhysicianVO();
			if(physicianVO){
				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
				type = "II";
				tagName = "id";
				pathFields = fields.split(',');
			
				instanceObject = [ 'SUBSCRIBER_ID', physicianVO.physicianId, null ];
	
				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);
	
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
	
				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
		
				var instanceObject = [ null, physicianVO.prefixName,
						physicianVO.givenName, physicianVO.familyName,
						physicianVO.suffixName ];
	
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			}
			
			//alert("Message Initialize: "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		} catch (error) {
			if (thisObject.logger) {
				thisObject.logger.logTest("Error in message init script: "
						+ error);
			}
			if (console && console.log) {
				console.log("Error in message init script: " + error);
			}
		}

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
	}

	/**
	 * Fill data in to the message.
	 * 
	 * @param key
	 *            An identifier that determines where the data should go. It
	 *            maps to some pathField.
	 * @param values
	 *            Can be a single value or an array of values which can go to
	 *            the same pathField
	 */
	function fillData(key, values) {
		var fields = "";
		var type = "";
		var tagName = "";
		var pathFields = null;
		var instanceObject = [];

		// Fill the amount
		if (key === 'amt') {
			fields = "";
			type = "MO";
			tagName = "amt";
			pathFields = fields.split(',');

			// Expecting only one value
			instanceObject = [ values ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,pathFields, type, instanceObject);
			// alert(XmlUtil.xmlToString(thisObject.messageAndUIBinder.messageObject.getXML()));
		}

		if (key === 'effectiveTime') {
			fields = "";
			type = "TS";
			tagName = "effectiveTime";
			pathFields = fields.split(',');

			// Expecting only one value
			instanceObject = [ values ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,
					pathFields, type, instanceObject);

		}

		if (key === 'financialTransactionChargeDetail') {

			$
					.each(values,
							function(index, value) {
								fields = "component[" + (index + 1)
										+ "],financialTransactionChargeDetail";
								type = "RTO_PQ_PQ";
								tagName = "unitQuantity";
								pathFields = fields.split(',');

								// Expecting 0th item as the unitQuantity
								instanceObject = [ value.quantity,
										value.quantity, null ];
								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);

								type = "RTO_MO_PQ";
								tagName = "unitPriceAmt";
								pathFields = fields.split(',');

								// Expecting 1st item as the unitPriceAmt
								instanceObject = [ value.unitPrice,
										value.unitPrice, null ];
								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);

								type = "II";
								tagName = "id";
								pathFields = fields.split(',');

								// Expecting 1st item as the unitPriceAmt
								instanceObject = [ value.indexNumber,
										value.indexNumber, null ];
								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);

								type = "MO";
								tagName = "netAmt";
								pathFields = fields.split(',');

								// Expecting 2nd item as the amt
								instanceObject = [ value.netAmount ];
								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);
							});
		}

		if (key === 'service') {
			$.each(values,
					function(key, value) {
						fields = "pertinentInformation[" + (key + 1)
								+ "],observationOrder";
						type = "CD";
						tagName = "code";
						pathFields = fields.split(',');

						// Expecting only one value
						instanceObject = [ values[key].description,
								values[key].concept ];

						thisObject.messageAndUIBinder.writeValueToMessage(
								tagName, pathFields, type, instanceObject);

						/** ********************************************************* */

						type = "II";
						tagName = "id";
						pathFields = fields.split(',');

						// Expecting only one value
						instanceObject = [ values[key].indexNumber,
								values[key].indexNumber ];

						thisObject.messageAndUIBinder.writeValueToMessage(
								tagName, pathFields, type, instanceObject);
						/** *********************************************************** */

					});
		}

		if (key === 'drug') {

			$
					.each(
							values,
							function(key, value) {
								fields = "pertinentInformation,substanceAdministrationOrder["
										+ (key + 1) + "]";
								fields += ",consumable,materialMedProduct,manufacturedMaterialKind";
								// alert(fields)
								type = "CE";
								tagName = "code";
								pathFields = fields.split(',');

								// Expecting only one value
								instanceObject = [ values[key].description,
										values[key].concept ];

								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);

								/** ********************************************************* */

								type = "II";
								tagName = "id";
								pathFields = fields.split(',');

								// Expecting only one value
								instanceObject = [ values[key].indexNumber,
										values[key].indexNumber ];

								thisObject.messageAndUIBinder
										.writeValueToMessage(tagName,
												pathFields, type,
												instanceObject);
								/** *********************************************************** */
							});
		}

		// values = [{'Name': consultantname}]
		if (key === 'consultant') {

			$
					.each(
							values,
							function(key, value) {
								// fields = "pertinentInformation[" + (key + 1)
								// + "],observationOrder";
								fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant["
										+ (key + 1) + "],";
								fields += "employmentStaff,employeePerson";
								// alert("Fields " + fields)
								type = "PN";
								tagName = "name";
								pathFields = fields.split(',');
								// Expecting only one value
								instanceObject = [ "", "", values[key].name ];

								thisObject.messageAndUIBinder.writeValueToMessage(tagName,pathFields, type,instanceObject);
							});

		}

		// values = [{'Name': patientname}]
		if (key === 'patient') {

			$
					.each(
							values,
							function(key, value) {
								// fields = "pertinentInformation[" + (key + 1)
								// + "],observationOrder";
								fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,subject,";
								fields += "patient,patientPerson";

								type = "PN";
								tagName = "name";
								pathFields = fields.split(',');

								// Expecting only one value
								instanceObject = [ values[key].name ];

								thisObject.messageAndUIBinder.writeValueToMessage(tagName,pathFields, type,instanceObject);
							});
		}

		// values = [{key: value}]
		if (key === 'transactionType') {
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}
			// alert("values: "+values);
			thisObject.messageAndUIBinder.updateId("TRANSACTION_TYPE", values);
		}
		
		if (key === 'messageTitle') {
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}

		// transactionStatus
		// values = [{key: value}]
		if (key === 'transactionStatus') {
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}

			thisObject.messageAndUIBinder
					.updateId("TRANSACTION_STATUS", values);
		}
		if (key === 'invoiceAmount') {
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}

			thisObject.messageAndUIBinder.updateId("INVOICE_AMOUNT", values);
		}
		
		if (key === 'discount') {
			alert("discount");
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}
			// alert("values: "+values);
			thisObject.messageAndUIBinder.updateId("DISCOUNT", values);
		}
		
		if (key === 'interest') {
			alert("interest");
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}
			// alert("values: "+values);
			thisObject.messageAndUIBinder.updateId("INTEREST", values);
		}
		
		
		if (key === 'charge') {
			thisObject.messageAndUIBinder.updateId('CHARGE', values);
		}
		
		if(key === 'SUBSCRIBER_ID'){
			var fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,subject,patient,patientPerson";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var instanceObject = [ 'SUBSCRIBER_ID', values ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject);
		}
		
		if(key === 'PRODUCT_NAME'){
			var fields = "pertinentInformation,substanceAdministrationOrder,consumable,materialMedProduct,manufacturedMaterialKind";
			var type = "CE";
			var tagName = "code";
			var pathFields = fields.split(',');
			var instanceObject = [ values.description, values.name ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject);
		}

	}

	function fillParticipants() {
		try {
			//alert("fillParticipants");

			/*var fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var consultant = appController.getComponent("Context")
					.getConsultant();
			if (consultant) {
				instanceObject = [ 'SUBSCRIBER_ID', consultant, null ];

				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);

				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);

				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
				var name = appController.getComponent("Context")
						.getConsultantName();
				instanceObject = [ null, null, null, name ];

				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);*/
			var physicianVO = appController.getComponent("Context").getPhysicianVO();
			if(physicianVO){
				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
				type = "II";
				tagName = "id";
				pathFields = fields.split(',');
			
				instanceObject = [ 'SUBSCRIBER_ID', physicianVO.physicianId, null ];
			
				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);
			
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
			
				fields = "postingTo,patientAccount,pertinentInformation,encounterEvent,consultant,employmentStaff,employeePerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
			
				var instanceObject = [ null, physicianVO.prefixName,
						 physicianVO.givenName, physicianVO.familyName,
						physicianVO.suffixName ];
			
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
			}
		} catch (error) {
			if (thisObject.logger) {
				thisObject.logger.logTest("Error in message init script: "
						+ error);
			}
			if (console && console.log) {
				console.log("Error in message init script: " + error);
			}
		}
	}
	;

	function complete(instance, callBack) {
		// alert(thisObject);

		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		var fields = "component[1],financialTransactionChargeDetail[1]";
		var type = "MO";
		var tagName = "netAmt";
		var pathFields = fields.split(',');

		var node = messageAndUIBinder.readMessageObjects(pathFields, tagName);

		if (!node) {
			throw "No valid subscriber ID in Message: PRPA_MT201000HT03";
		}

		node = (AppUtil.isArray(node)) ? node[0] : node;
		var instanceObject = thisObject.messageAndUIBinder
				.readValueFromMessage(tagName, pathFields, type, node);

		var netAmt = instanceObject[1];

		thisObject.fillData('amt', netAmt);

		/*
		 * alert('Finance After complete script XML: \n' + XmlUtil
		 * .xmlToString(messageAndUIBinder.messageObject.getXML()));
		 */

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		if (instance && callBack) {
			// alert("Ready to call : " + instance);
			callBack(instance);
		}

	}

};
