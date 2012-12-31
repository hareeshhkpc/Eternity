/**
 * ROLE_PERMISSION.
 */

function ROLE_PERMISSION(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;
	this.setUserPermission=setUserPermission;

	/*this.run = run;*/
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
				throw "No valid message ID generated";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];
			
			var instanceObject = ['HIN_MSG_ID', messageId, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var user = this.appController.getComponent("Context").getSubscriberId();
			var instanceObject = [ 'SUBSCRIBER_ID', user, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
						
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var instanceObject = [ 'ROLE_NAME', this.appController.getComponent("Context").getRoleId(), null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
			
			messageAndUIBinder.createMessageObjects(pathFields, tagName);

			/*fields = "providerOrganization";
			type = "ON";
			var tagName = "name";
			var pathFields = fields.split(',');
			var orgId = appController.getComponent("Context").getOrganizationVO().subscriberId;
			instanceObject = [ 'SUBSCRIBER_ID', orgId, null ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);*/

			fields = "permission";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'CALENDAR', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[2]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'ARCHIVE', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[3]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PATIENTS', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[4]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'STATISTICS', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[5]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LIBRARY', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[6]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'ADMINISTRATION', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[7]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LICENSEES', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[8]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PROFILE', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			/* UPDATING ORGANISATION  DETAILS*/
			var orgId = appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
			thisObject.messageAndUIBinder.updateId("ORGANIZATION_ID", orgId);

		} catch (error) {
			alert("error : " + error);
			if (thisObject.logger) {
				thisObject.logger.logTest("Error in message init script: "
						+ error);
			}
			if (console && console.log) {
				console.log("Error in message init script: " + error);
			}
		}

		/*alert("Role permission : "
				+ XmlUtil
						.xmlToString(messageAndUIBinder.messageObject.getXML()));*/

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
	}
	
	
	function setUserPermission() {
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
				throw "No valid message ID generated";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];
			
			var instanceObject = ['HIN_MSG_ID', messageId, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var user = this.appController.getComponent("Context").getSubscriberId();
			var instanceObject = [ 'SUBSCRIBER_ID', user, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
						
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var instanceObject = [ 'ROLE_NAME', this.appController.getComponent("Context").getRoleId(), null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
			
			messageAndUIBinder.createMessageObjects(pathFields, tagName);

			/*fields = "providerOrganization";
			type = "ON";
			var tagName = "name";
			var pathFields = fields.split(',');
			var orgId = appController.getComponent("Context").getOrganizationVO().subscriberId;
			instanceObject = [ 'SUBSCRIBER_ID', orgId, null ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);*/
			
			fields = "permission";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'CALENDAR', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[2]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'ARCHIVE', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[3]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PATIENTS', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[4]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'STATISTICS', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[5]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LIBRARY', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[6]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'ADMINISTRATION', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[7]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LICENSEES', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[8]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PROFILE', 1, 'HIN' ];
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);


		} catch (error) {
			alert("error : " + error);
			if (thisObject.logger) {
				thisObject.logger.logTest("Error in message init script: "
						+ error);
			}
			if (console && console.log) {
				console.log("Error in message init script: " + error);
			}
		}

		/*alert("Role permission : "
				+ XmlUtil
						.xmlToString(messageAndUIBinder.messageObject.getXML()));*/

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

		if (key === 'statusCode') {
			fields = "";
			type = "CS";
			tagName = "statusCode";
			pathFields = fields.split(',');

			instanceObject = [ values ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,
					pathFields, type, instanceObject);

			// alert("1:
			// "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}

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

			// alert("2:
			// "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}
		if(key === 'messageTitle'){
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}
		
		if(key === 'programId'){
			thisObject.messageAndUIBinder.updateId('PROGRAM_ID', values);
		}
		if(key==='userPermission'){
			setUserPermission();
		}
			
		if(key==='patientPermission'){
			setPatientPermission();
		}
	}
	function setPatientPermission() {
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
				throw "No valid message ID generated";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];
			
			var instanceObject = ['HIN_MSG_ID', messageId, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var user = this.appController.getComponent("Context").getSubscriberId();
			var instanceObject = [ 'SUBSCRIBER_ID', user, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
						
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var instanceObject = [ 'ROLE_NAME', this.appController.getComponent("Context").getRoleId(), null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject,false);
			
			messageAndUIBinder.createMessageObjects(pathFields, tagName);

			
			fields = "permission";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'CALENDAR', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

			fields = "permission[1]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'DOCUMENTS', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);



			fields = "permission[2]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'RESULTS', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);


			
			fields = "permission[3]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PROFILE', 1, 'HIN' ];
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[4]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'PRODUCTS', 1, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[5]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LIBRARY', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[6]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'ADMINISTRATION', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[7]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'LICENSEES', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "permission[8]";
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			instanceObject = [ 'STATISTICS', 0, 'HIN' ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);


		} catch (error) {
			alert("error : " + error);
			if (thisObject.logger) {
				thisObject.logger.logTest("Error in message init script: "
						+ error);
			}
			if (console && console.log) {
				console.log("Error in message init script: " + error);
			}
		}

		/*alert("Role permission : "
				+ XmlUtil
						.xmlToString(messageAndUIBinder.messageObject.getXML()));*/

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
	}
	function fillParticipants() {

	}
	;

};
