/**
 * COCT_MT150000HT04.
 */

function COCT_MT150000HT04(appController, messageAndUIBinder, logger) {

	var thisObject = this;

	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	
	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;
	this.complete = complete;
	/*this.run = run;*/

	
	/*function run() {

		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		try{

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			
			var node = messageAndUIBinder.readMessageObjects(pathFields, tagName);
			
			//alert("Node(s):" + XmlUtil.xmlToString(node));
	
			if(!node){
				throw "No valid subscriber ID in Message: COCT_MT150000HT04";
			}
			
			var instanceObject = messageAndUIBinder.readValueFromMessage(tagName, pathFields, type, (AppUtil.isArray(node)) ? node[0] : node);
			//alert("instanceObject: " + instanceObject);
			
			var messageId = instanceObject[2];
			
			//	Need to write HIN_MSG_ID, SUBSCRIBER_ID into message as batch operation 	
			// Write HIN_MSG_ID
			instanceObject = ['HIN_MSG_ID', messageId, null];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
						
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			instanceObject = ['SUBSCRIBER_ID', messageId, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			instanceObject = ['USERNAME', null, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			instanceObject = ['PASSWORD', null, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			
			
			
			
			messageAndUIBinder.createMessageObjects(pathFields, tagName);
			//	End: Write HIN_MSG_ID, SUBSCRIBER_ID into message as batch operation 	
			
			
		}catch(error){
			if (thisObject.logger){
				thisObject.logger.logTest("Error in message init script: " + error);
			}
			if(console && console.log){
				console.log("Error in message init script: " + error);
			}
		}		
		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		
	} */

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
		try{

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			
			var node = messageAndUIBinder.readMessageObjects(pathFields, tagName);
			
			//alert("Node(s):" + XmlUtil.xmlToString(node));
	
			if(!node){
				throw "No valid subscriber ID in Message: COCT_MT150000HT04";
			}
			
			var instanceObject = messageAndUIBinder.readValueFromMessage(tagName, pathFields, type, (AppUtil.isArray(node)) ? node[0] : node);
			//alert("instanceObject: " + instanceObject);
			
			var messageId = instanceObject[2];
			
			/*	Need to write HIN_MSG_ID, SUBSCRIBER_ID into message as batch operation 	*/
			// Write HIN_MSG_ID
			instanceObject = ['HIN_MSG_ID', messageId, null];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
						
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			instanceObject = ['SUBSCRIBER_ID', messageId, null];

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			var userNameValue = XmlUtil.getXPathResult(messageAndUIBinder.messageObject
					.getXML(), AppConstants.XPaths.COCT_MT150000HT04.USERNAME,
					XPathResult.STRING_TYPE);
			var userName = (userNameValue && userNameValue.stringValue) ? userNameValue.stringValue
					: "";

			if (userName) {
				instanceObject = [ 'USERNAME', userName, null ];
			} else {
				instanceObject = [ 'USERNAME', null, null ];
			}

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);
			
			fields = "";	
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');

			// Subscriber ID is the message ID itself
			var passwordValue = XmlUtil.getXPathResult(messageAndUIBinder.messageObject
					.getXML(), AppConstants.XPaths.COCT_MT150000HT04.PASSWORD,
					XPathResult.STRING_TYPE);
			var password = (passwordValue && passwordValue.stringValue) ? passwordValue.stringValue
					: "";
			if (password) {
				instanceObject = [ 'PASSWORD', password, null ];
			} else {
				instanceObject = [ 'PASSWORD', null, null ];
			}

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, false);

			messageAndUIBinder.createMessageObjects(pathFields, tagName);
			/*	End: Write HIN_MSG_ID, SUBSCRIBER_ID into message as batch operation 	*/
			
			
			fields = "";	
			type = "CE";
			tagName = "code";
			pathFields = fields.split(',');

			var RegionCodeValue = XmlUtil.getXPathResult(messageAndUIBinder.messageObject
					.getXML(), AppConstants.XPaths.Organization.REGION_CODE,
					XPathResult.STRING_TYPE);
			var RegionCode = (RegionCodeValue && RegionCodeValue.stringValue) ? RegionCodeValue.stringValue
					: "";

			var RegionNameValue = XmlUtil.getXPathResult(messageAndUIBinder.messageObject
					.getXML(), AppConstants.XPaths.Organization.REGION_NAME,
					XPathResult.STRING_TYPE);
			var RegionName = (RegionNameValue && RegionNameValue.stringValue) ? RegionNameValue.stringValue
					: "";

			if(RegionCode || RegionName){
				instanceObject = [RegionCode, 'REGION', RegionName];
			}else{
				instanceObject = [null, 'REGION', null];
			}

			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			/*alert(XmlUtil.xmlToString(messageAndUIBinder.messageObject
					.getXML()));*/
			
		}catch(error){
			if (thisObject.logger){
				thisObject.logger.logTest("Error in message init script: " + error);
			}
			if(console && console.log){
				console.log("Error in message init script: " + error);
			}
		}		
		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		/*alert('END of script XML: \n'
				+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
						.getXML()));*/
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
			
			if(key === 'telecom'){
				$.each(values, function(key, value){
					fields = "";	
					type = "TEL";
					tagName = "telecom";
					pathFields = fields.split(',');
					
					instanceObject = [value.use, value.value];			
					thisObject.messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			   });
			}
			if(key === 'messageTitle'){
				thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
			}
			
			if(key === 'licenseeId'){
				thisObject.messageAndUIBinder.updateId('LICENSEE_ID', values);
			}
	 }


	function fillParticipants(){
			
	};

};
