/**
 * POCD_MT000040UV_Program.
 */

function POCD_MT000040UV_Package(appController, messageAndUIBinder, logger) {

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
			/* UPDATING SUBSCRIBER_ID */
			var fields = "recordTarget,patientRole,patient";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var patient = appController.getComponent("Context").getPatient();
			var instanceObject = [ 'SUBSCRIBER_ID', patient, null ];

			if (thisObject.logger)
				thisObject.logger.logTest("Instance: " + instanceObject);

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject);

			/* UPDATING CONSULTANT DETAILS*/
			var physicianVO = appController.getComponent("Context").getPhysicianVO();
			fields = "participation,assignedEntity";
			type = "II";
			tagName = "id";
			pathFields = fields.split(',');
			//var consultantId = appController.getComponent("Context").getConsultant();
			instanceObject = [ 'CONSULTANT_ID', physicianVO.physicianId, null ];

			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			
			fields = "participation,assignedEntity,assignedPerson";
			type = "PN";
			tagName = "name";
			pathFields = fields.split(',');
			var instanceObject = [ null, physicianVO.prefixName,
			           			physicianVO.familyName, physicianVO.givenName,
			           			physicianVO.suffixName ];

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
			type = "TS";
			tagName = "effectiveTime";
			pathFields = fields.split(',');

			instanceObject = [ values ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,
					pathFields, type, instanceObject);
		}

		if (key === 'code') {
			/*fields = "component,structuredBody,component,section";
			type = "CD";
			tagName = "code";
			pathFields = fields.split(',');*/

			// 0 th index will have messge Id and the 1st index will have service Name
			/*instanceObject = [ values[0], values[1] ];
			thisObject.messageAndUIBinder.writeValueToMessage(tagName,pathFields, type, instanceObject,false);*/
			
			// 0 th index will have messge Id and the 1st index will have service Name
			$.each(values,function(index,msgDetails){
				fields = "component,structuredBody,component,section["+(index+1)+"]";
				type = "CD";
				tagName = "code";
				pathFields = fields.split(',');
				instanceObject = [msgDetails[0],msgDetails[1]];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
			});
		}
		if(key === 'messageTitle'){
			thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
		}
	}

	function fillParticipants() {

	}
	;

};
