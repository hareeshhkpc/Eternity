/**
 * ROLE_USER.
 */

function ROLE_USER(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	
	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

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
			/* EMPID */

			/*var roleMessage = appController.getComponent("Context")
					.getFromContext("role");

			if (roleMessage) {
				var XmlFragment = XmlUtil.findByName(roleMessage, "message",
						true);
				var XmlSubFragment = XmlUtil.findByName(XmlFragment,
						"ROLE_USER", true);
				var id = XmlUtil.findByName(XmlSubFragment, "id", true);
				var messageId = XmlUtil.attr(id, "extension");
				//alert(messageId);

				var fields = "";
				var type = "II";
				var tagName = "id";
				var pathFields = fields.split(',');

				var instanceObject = [ 'HIN_MSG_ID', messageId, null ];

				if (thisObject.logger)
					thisObject.logger.logTest("Instance: " + instanceObject);

				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject, false);
		/*	}*/
			
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			// alert("Hi Before
			// :"+XmlUtil.xmlToString(messageAndUIBinder.messageObject
			// .getXML()));
			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);
			// alert("Hi After");
			if (!node) {
				throw "No valid subscriber ID in Message: PRPA_MT201000HT03";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];

			var instanceObject = [ 'HIN_MSG_ID', messageId, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			appController.getComponent("Context").setRoleId(messageId);
			
			appController.getComponent("Context").setRoleId(messageId);
			
			/* SUBSCRIBER_ID */

			var user = appController.getComponent("Context").getUser();
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var instanceObject = [ 'SUBSCRIBER_ID', user, null ];
			appController.getComponent("Context").setSubscriberId(user);
			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
			/* ROLE_NAME */
			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'ROLE_NAME', 'user', null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			// Batch update of EMPID & ROLE_NAME
			messageAndUIBinder.createMessageObjects(pathFields, tagName);

			fields = "providerOrganization";
			type = "ON";
			tagName = "name";
			pathFields = fields.split(',');
			instanceObject = [ null, "HIN", null ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
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
