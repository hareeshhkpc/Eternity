/**
 * LICENSEE.
 */

function LICENSEE(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	
	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;

	/*this.run = run;*/
	this.complete = complete;

	/*function run() {

		//alert("reg run");
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
				throw "No valid subscriber ID in Message: LICENSEE";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];

			 // Need to write HIN_MSG_ID, SUBSCRIBER_ID, USERNAME and PASSWORD into message as batch operation
			// Write HIN_MSG_ID
			instanceObject = [ 'HIN_MSG_ID', messageId, null ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);

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
		
	}*/

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

			/**  MESSAGE_ID */ 			
			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);

			if (!node) {
				throw "No valid subscriber ID in Message: LICENSEE";
			}

			var instanceObject = messageAndUIBinder.readValueFromMessage(
					tagName, pathFields, type,
					(AppUtil.isArray(node)) ? node[0] : node);

			var messageId = instanceObject[2];

			instanceObject = [ 'HIN_MSG_ID', messageId, null ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
			
			var subsciberId = messageId;
			
			/**  SUBSCRIBER_ID */ 
			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'SUBSCRIBER_ID', subsciberId, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);
			
			/**  PASSWORD */ 
			fields = "";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			instanceObject = [ 'PASSWORD', null, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject, false);

			messageAndUIBinder.createMessageObjects(pathFields, tagName);
			
			/**  REGION */ 
			/*var regionName = appController.getComponent("Context").getSelectedOrganizationVO().regionName;
			var regionCode = appController.getComponent("Context").getSelectedOrganizationVO().regionCode;
			
			fields = "";	
			type = "CE";
			tagName = "code";
			pathFields = fields.split(',');

			instanceObject = [regionCode, 'REGION', regionName];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);*/

			//alert(XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));

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
		
	}
	
	function fillParticipants() {
		
	}

};
