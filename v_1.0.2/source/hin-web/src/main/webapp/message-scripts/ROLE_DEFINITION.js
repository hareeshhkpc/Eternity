/**
 * ROLE_PATIENT.
 */

function ROLE_DEFINITION(appController, messageAndUIBinder, logger) {

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
			var organizationName = appController.getComponent("Context").getSelectedOrganizationVO().name;
			var organizationType = appController.getComponent("Context").getSelectedOrganizationVO().organizationType;
			var staffVo = appController.getComponent("Context").getStaffVo();
			var patient = appController.getComponent("Context").getPatient();
			appController.getComponent("Context").setSubscriberId(patient);
			
			/* STAFF_NAME */
			if(staffVo){
				fields = "patientPerson";
				type = "PN";
				tagName = "name";
				pathFields = fields.split(',');

				instanceObject = [staffVo.nameType, staffVo.prefix, staffVo.given , staffVo.family , staffVo.suffix];

				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);

				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
			}
			
			/* MESSAGE_ID */
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
			var instanceObject = [ 'HIN_MSG_ID', messageId, organizationName ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			appController.getComponent("Context").setRoleId(messageId);

			/* SUBSCRIBER_ID */
			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'SUBSCRIBER_ID', patient, organizationName ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
			
			/* EMPID */
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			var instanceObject = [ 'EMPID', null, organizationName ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
			
			/* ROLE_NAME */
			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'ROLE_NAME', 'PATIENT', organizationName ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);			

			// Batch update of MESSAGE_ID, SUBSCRIBER_ID, EMPLOYEE_ID & ROLE_NAME
			messageAndUIBinder.createMessageObjects(pathFields, tagName);			
			
			fields = "providerOrganization";
			type = "ON";
			tagName = "name";
			pathFields = fields.split(',');
			//alert("organizationType: "+organizationType+" organizationName:"+organizationName);
			instanceObject = [ organizationType, organizationName ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			
			/* UPDATING ORGANISATION  DETAILS*/
			var orgId = appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
			//alert("orgId: "orgId);
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
	 * @param key An identifier that determines where the data should go. It maps to some pathField.
	 * @param values Can be a single value or an array of values which can go to the same pathField
	 */
	function fillData(key, values) {
		var fields = "";	
		var type = "";
		var tagName = "";
		var pathFields = null;
		var instanceObject = [];
		
		if(key === 'statusCode'){
			fields = "";	
			type = "CS";
			tagName = "statusCode";
			pathFields = fields.split(',');
			
			instanceObject = [values];			
			thisObject.messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			
			//alert("1: "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}
		
		if(key === 'effectiveTime'){
			fields = "";	
			type = "IVL_TS";
			tagName = "effectiveTime";
			pathFields = fields.split(',');
			
			$.each(values, function(key, value){
				instanceObject = [value.low, value.high];			
				thisObject.messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			});
			
			//alert("2: "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}
		if(key === 'messageTitle'){
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}
	}


	function fillParticipants(){
			
	};

};
