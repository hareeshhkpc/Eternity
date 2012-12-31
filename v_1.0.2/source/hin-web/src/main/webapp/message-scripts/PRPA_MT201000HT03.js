/**
 * PRPA_MT201000HT03.
 */

function PRPA_MT201000HT03(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

	this.complete = complete;
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

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: PRPA_MT201000HT03";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];

			/*
			 * Need to write HIN_MSG_ID, SUBSCRIBER_ID, USERNAME and PASSWORD
			 * into message as batch operation
			 */
			// Write HIN_MSG_ID
			instanceObject = [ 'HIN_MSG_ID', messageId, null ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			// subscriberId is the messageId
			var subscriberId = messageId;

			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'SUBSCRIBER_ID', subscriberId, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			var userNameValue = XmlUtil.getXPathResult(
					messageAndUIBinder.messageObject.getXML(),
					AppConstants.XPaths.PRPA_MT201000HT03.USERNAME,
					XPathResult.STRING_TYPE);
			var userName = (userNameValue && userNameValue.stringValue) ? userNameValue.stringValue
					: "";

			if (userName) {
				instanceObject = [ 'USERNAME', userName, null ];
			} else {
				instanceObject = [ 'USERNAME', null, null ];
			}

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			var passwordValue = XmlUtil.getXPathResult(
					messageAndUIBinder.messageObject.getXML(),
					AppConstants.XPaths.PRPA_MT201000HT03.PASSWORD,
					XPathResult.STRING_TYPE);
			var password = (passwordValue && passwordValue.stringValue) ? passwordValue.stringValue
					: "";
			if (password) {
				instanceObject = [ 'PASSWORD', password, null ];
			} else {
				instanceObject = [ 'PASSWORD', null, null ];
			}
			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			messageAndUIBinder.createMessageObjects(pathFields, tagName);
			/*
			 * END: write HIN_MSG_ID, SUBSCRIBER_ID, USERNAME and PASSWORD into
			 * message as batch operation
			 */

			fields = "assigningOrganization";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');
			var orgId = appController.getComponent("Context")
					.getSelectedOrganizationVO().subscriberId;
			if (orgId) {
				instanceObject = [ 'SUBSCRIBER_ID', orgId, null ];
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

			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			var processDefinition = page.processDefinition.processName;

			if (processDefinition == 'PatientRegistration') {
				// nameUse ,private phone number and email address
				fields = "identifiedPerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');
				instanceObject = [ 'L', null, null, null, null ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);

				messageAndUIBinder.nodeCollection = [];
				var pathFields = null;
				var tagName = null;

				fields = "identifiedPerson";
				type = "TEL";
				tagName = "telecom";
				pathFields = fields.split(',');

				instanceObject = [ 'MobP', null ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject, false);

				instanceObject = [ 'EmailP', null ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject, false);
				messageAndUIBinder.createMessageObjects(pathFields, tagName);
			}

			/* UPDATING ORGANISATION DETAILS */
			/*
			 * if (orgId) { thisObject.messageAndUIBinder
			 * .updateId("ORGANIZATION_ID", orgId); }
			 */

			console.log("OrganizationID: " + orgId);

		} catch (error) {
			console.log("Error in Script `PRPA_MT201000HT03`:" + error);

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
			fields = "";
			type = "IVL_TS";
			tagName = "effectiveTime";
			pathFields = fields.split(',');

			$.each(values, function(key, value) {
				instanceObject = [ value.low, value.high ];
				thisObject.messageAndUIBinder.writeValueToMessage(tagName,
						pathFields, type, instanceObject);
			});
		}

		if (key === 'telecom') {
			fields = "identifiedPerson";
			type = "TEL";
			tagName = "telecom";
			pathFields = fields.split(',');

			$.each(values, function(key, value) {
				instanceObject = [ value.use, value.value ];
				thisObject.messageAndUIBinder.writeValueToMessage(tagName,
						pathFields, type, instanceObject);
			});
		}

		if (key === 'programId') {
			thisObject.messageAndUIBinder.updateId('PROGRAM_ID', values);
		}

		if (key === 'consultantId') {
			thisObject.messageAndUIBinder.updateId('CONSULTANT_ID', values);
		}
		if (key === 'messageTitle') {
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}
		if (key === 'setDefaultUser') {
			try {
				thisObject.messageAndUIBinder.updateId('USERNAME', values);
			
			} catch (error) {
				alert("Error while setting user password" + error);
			}

		}
		if(key === 'setDefaultPassword'){
			thisObject.messageAndUIBinder.updateId('PASSWORD',
					values);
		}
	}

	function fillParticipants() {
	}
	;

};
