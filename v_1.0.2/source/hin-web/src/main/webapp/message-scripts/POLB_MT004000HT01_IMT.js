/**
 * POLB_MT004000HT01_IMT.
 */

function POLB_MT004000HT01_IMT(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	this.complete = complete;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

	function complete(instance, callBack) {
		// alert(thisObject);

		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		if (instance && callBack) {
			// alert("Ready to call : " + instance);
			callBack(instance);
		}

	}

	function initialize() {

		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		try {
			var fields = "recordTarget,patient,patientPerson";

			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var patient = appController.getComponent("Context").getPatient();
			var instanceObject = [ 'SUBSCRIBER_ID', patient, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			/*
			 * var registrationMessage = appController.getComponent("Context")
			 * .getFromContext("registration"); var use = null, prefix = null,
			 * family = null, given = null, suffix = null; if
			 * (registrationMessage) { var XmlFragment =
			 * XmlUtil.findByName(registrationMessage, "message", true); var
			 * XmlSubFragment = XmlUtil.findByName(XmlFragment,
			 * "PRPA_MT201000HT03", true); var identifiedPerson =
			 * XmlUtil.findByName(XmlSubFragment, "identifiedPerson", true); var
			 * name = XmlUtil.findByName(identifiedPerson, "name", true); use =
			 * XmlUtil.findByName(name, "use", true); prefix =
			 * XmlUtil.findByName(name, "prefix", true); family =
			 * XmlUtil.findByName(name, "family", true); given =
			 * XmlUtil.findByName(name, "given", true); suffix =
			 * XmlUtil.findByName(name, "suffix", true); if (prefix) prefix =
			 * XmlUtil.text(prefix); if (family) family = XmlUtil.text(family);
			 * if (given) given = XmlUtil.text(given); if (suffix) suffix =
			 * XmlUtil.text(suffix); var desc =
			 * XmlUtil.findByName(identifiedPerson, "desc", true); var thumbnail =
			 * XmlUtil.findByName(desc, "thumbnail", true); if (thumbnail)
			 * thumbnail = XmlUtil.text(thumbnail); }
			 */
			var patientVO = appController.getComponent("Context")
					.getPatientVO();
			if (patientVO) {
				fields = "recordTarget,patient,patientPerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
				instanceObject = [ patientVO.nameType, patientVO.prefixName,
						patientVO.givenName, patientVO.familyName,
						patientVO.suffixName ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);
			}

			fields = "";
			type = "IVL_TS";
			tagName = "effectiveTime";
			pathFields = fields.split(',');
			instanceObject = [ new Date().getTime(), new Date().getTime(), null ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			/* UPDATING ORGANISATION DETAILS */
			var orgId = appController.getComponent("Context")
					.getSelectedOrganizationVO().subscriberId;
			thisObject.messageAndUIBinder.updateId("ORGANIZATION_ID", orgId);

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

		if (key === 'effectiveTime') {
			$.each(values, function(key, value) {
				fields = "";
				type = "IVL_TS";
				tagName = "effectiveTime";
				pathFields = fields.split(',');

				instanceObject = [ value.low, value.high ];
				thisObject.messageAndUIBinder.writeValueToMessage(tagName,
						pathFields, type, instanceObject);

				// alert("1:
				// "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
			});
		}

		if (key === 'code') {
			fields = "";
			type = "CD";
			tagName = "code";
			pathFields = fields.split(',');

			instanceObject = [ values ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,
					pathFields, type, instanceObject);

			// alert("2:
			// "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}
		if (key === 'messageTitle') {
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}

		/* UPDATING PACKAGE_ID */
		if (key === 'packageId') {
			thisObject.messageAndUIBinder.updateId('PACKAGE_ID', values);
		}
	}

	function fillParticipants() {

	}
	;

};
