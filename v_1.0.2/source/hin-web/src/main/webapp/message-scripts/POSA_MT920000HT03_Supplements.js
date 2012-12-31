/**
 * POSA_MT920000HT03_Supplements.
 */

function POSA_MT920000HT03_Supplements(appController, messageAndUIBinder, logger) {
	
	var thisObject = this;
	
	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	this.complete=complete;
	
	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;
	
	function complete(instance, callBack) {
		//alert(thisObject);

		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		if (instance && callBack) {
			//alert("Ready to call : " + instance);
			callBack(instance);
		}

	}
	
	
	function initialize() {
		
		if(thisObject.logger)
			thisObject.logger.logTest('XML Before: \n' + XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		
		try{
			var fields = "subject,patient,patientPerson";	
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			
			var patient=appController.getComponent("Context").getPatient();;
			var instanceObject = ['SUBSCRIBER_ID', patient, null];
	
			if(thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
	
			/*fields = "author,employmentStaff,employeePerson";	
			type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			instanceObject = [userId, null, null];
			
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);*/
			
			/* UPDATING ORGANISATION  DETAILS*/
			var orgId = appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
			thisObject.messageAndUIBinder.updateId("ORGANIZATION_ID", orgId);

			
		}catch(error){
			if (thisObject.logger){
				thisObject.logger.logTest("Error in message init script: " + error);
			}
			if(console && console.log){
				console.log("Error in message init script: " + error);
			}
		}
		
		if(thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n' + XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
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
		
		if(key === 'code'){
			fields = "";	
			type = "CD";
			tagName = "code";
			pathFields = fields.split(',');
			
			instanceObject = [values];			
			thisObject.messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			
			//alert("1: "+XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));
		}
		
		if(key === 'doseCheckQuantity'){
			fields = "";	
			type = "RTO_PQ_PQ";
			tagName = "doseCheckQuantity";
			pathFields = fields.split(',');
			
			$.each(values, function(key, value){
				instanceObject = [value.numerator, value.denominator];			
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
