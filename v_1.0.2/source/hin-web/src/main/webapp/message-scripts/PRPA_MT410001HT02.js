/**
 * PRPA_MT410001HT02.
 */

function PRPA_MT410001HT02(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;

	this.complete = complete;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

	function complete(instance, callBack) {

		/*
		 * alert(' Complete After init script XML: \n' + XmlUtil
		 * .xmlToString(messageAndUIBinder.messageObject.getXML()));
		 */

		if (instance && callBack) {
			// alert("Ready to call : " + instance);
			callBack(instance);
		}

	}
	;

	function initialize() {
		// alert("initialize ");
		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		try {
			var fields = "subject,patient";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var patient = appController.getComponent("Context").getPatient();

			// alert("initialize patient : " + patient);
			var instanceObject = [ 'SUBSCRIBER_ID', patient, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "subject,patient,patientPerson";
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			/*var registrationMessage = appController.getComponent("Context")
					.getFromContext("registration");
			if (registrationMessage) {
				var XmlFragment = XmlUtil.findByName(registrationMessage,
						"message", true);
				var XmlSubFragment = XmlUtil.findByName(XmlFragment,
						"PRPA_MT201000HT03", true);
				var identifiedPerson = XmlUtil.findByName(XmlSubFragment,
						"identifiedPerson", true);
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
			if(patientVO){
				var fields = "subject,patient,patientPerson";
				var type = "PN";
				var tagName = "name";
				var pathFields = fields.split(',');
				var instanceObject = [ patientVO.nameType, patientVO.prefixName, patientVO.givenName, patientVO.familyName, patientVO.suffixName ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
				
				var fields = "subject,patient,patientPerson";
				var type = "ED";
				var tagName = "desc";
				var pathFields = fields.split(',');
				var instanceObject = [ patientVO.image ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
			}

			var physicianVO = appController.getComponent("Context").getPhysicianVO();
			if (physicianVO) {
				var fields = "consultant,employmentStaff";
				var type = "II";
				var tagName = "id";
				var pathFields = fields.split(',');

				var instanceObject = [ "SUBSCRIBER_ID",
						physicianVO.physicianId, null ];

				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);

				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);

				var fields = "consultant,employmentStaff,employeePerson";
				var type = "PN";
				var tagName = "name";
				var pathFields = fields.split(',');
				var instanceObject = [ null, physicianVO.prefixName,
						 physicianVO.givenName,physicianVO.familyName,
						physicianVO.suffixName ];
				//alert("physicianVO:" + physicianVO);
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);
			}
			
			/* UPDATING ORGANISATION  DETAILS*/
			var orgId = appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
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
	;

	function fillData(key, values) {
		// alert("fillData ");
		var fields = "";
		var type = "";
		var tagName = "";
		var pathFields = null;
		var instanceObject = [];
		// alert("key :" + key);
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
		if (key === 'messageTitle') {
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}
	}
	;

	function fillParticipants() {
		// alert("fillParticipants ");
		// Filling data only from xml not from seted data.
		/*
		 * var fields = "consultant,employmentStaff"; var type = "II"; var
		 * tagName = "id"; var pathFields = fields.split(','); var consultant =
		 * appController.getComponent("Context").getConsultant(); //
		 * alert("complete : " + consultant); var instanceObject = [ consultant,
		 * null, null ];
		 * 
		 * if (thisObject.logger) thisObject.logger.logTest("Instance: " +
		 * instanceObject);
		 * 
		 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
		 * instanceObject);
		 * 
		 * var fields = "consultant,employmentStaff,employeePerson"; var type =
		 * "PN"; var tagName = "name"; var pathFields = fields.split(','); var
		 * name = appController.getComponent("Context").getConsultantName(); var
		 * instanceObject = [ null, null, null, name ];
		 * 
		 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
		 * instanceObject);
		 */
	}
	;

};
