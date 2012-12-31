/**
 * POLB_MT004000HT01_BloodTest.
 */

function POLB_MT004000HT01_BloodTest(appController, messageAndUIBinder, logger) {

	var thisObject = this;
	var doc = null;
	this.appController = appController;
	this.messageAndUIBinder = messageAndUIBinder;
	this.logger = logger;
	//this.run = run;
	this.complete = complete;

	this.initialize = initialize;
	this.fillData = fillData;
	this.fillParticipants = fillParticipants;
	var bloodTestLookUp = new Array();

	function complete(instance, callBack) {
		if (thisObject.logger)
			thisObject.logger.logTest('XML Before: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));

		if (thisObject.logger)
			thisObject.logger.logTest('After init script XML: \n'
					+ XmlUtil.xmlToString(messageAndUIBinder.messageObject
							.getXML()));
		if (instance && callBack) {
			callBack(instance);
		}
	}

	function initialize() {
		//alert("initialize");
		if (thisObject.logger) {
			thisObject.logger.logTest(thisObject.logger.param.v2XmlDoc);
			doc = thisObject.logger.param.v2XmlDoc;
		}
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

			/*var registrationMessage = appController.getComponent("Context")
					.getFromContext("registration");
			var use = null, prefix = null, family = null, given = null, suffix = null;
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
			
			if (doc) {
				var XmlDataFragment = XmlUtil.findByName(doc, "ORU_R01", true);
				var subXmlFragment = XmlUtil.findByName(XmlDataFragment,
						"ORU_R01.RESPONSE", true);
				var subFragment = XmlUtil.findByName(subXmlFragment,
						"ORU_R01.ORDER_OBSERVATION", true);
				var fragment = XmlUtil.findByName(subFragment,
						"ORU_R01.OBSERVATION", false);
				
				/** For Patient's name **/
				var patientFragment = XmlUtil.findByName(subXmlFragment,
						"ORU_R01.PATIENT", true);
				var pidFragment = XmlUtil.findByName(patientFragment, "PID",
						true);
				var pid5Fragment = XmlUtil.findByName(pidFragment, "PID.5",
						true);
				var familyFragment = XmlUtil.findByName(pid5Fragment, "XPN.1",
						true);
				var givenFragment = XmlUtil.findByName(pid5Fragment, "XPN.2",
						true);
				var prefixFragment = XmlUtil.findByName(pid5Fragment, "XPN.3",
						true);
				var fields = "specimen,specimen,sourcePerson";
				var type = "PN";
				var tagName = "name";
				var pathFields = fields.split(',');
				var instanceObject = [ '', XmlUtil.text(prefixFragment),
						XmlUtil.text(familyFragment),
						XmlUtil.text(givenFragment) ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);

				var pid7Fragment = XmlUtil.findByName(pidFragment, "PID.7",
						true);
				var TS1Fragment = XmlUtil
						.findByName(pid7Fragment, "TS.1", true);

				var visitFragment = XmlUtil.findByName(patientFragment,
						"ORU_R01.VISIT", true);
				var pv1Fragment = XmlUtil
						.findByName(visitFragment, "PV1", true);
				var pv13Fragment = XmlUtil.findByName(pv1Fragment, "PV1.3",
						true);
				var pv14Fragment = XmlUtil.findByName(pv13Fragment, "PL.4",
						true);
				var hd1Fragment = XmlUtil
						.findByName(pv14Fragment, "HD.1", true);
				var hd2Fragment = XmlUtil
						.findByName(pv14Fragment, "HD.2", true);

				fields = "specimen,specimen,sourcePerson";
				type = "II";
				tagName = "id";
				pathFields = fields.split(',');
				instanceObject = [ XmlUtil.text(TS1Fragment),
						XmlUtil.text(hd2Fragment), XmlUtil.text(hd1Fragment) ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);

				var i, j = 1;
				for (i = 0; i < fragment.length; i++) {
					var obxFragment = XmlUtil.findByName(fragment[i], "OBX",
							true);

					var obx3Fragment = XmlUtil.findByName(obxFragment, "OBX.3",
							true);
					var codeValueFragment = XmlUtil.findByName(obx3Fragment,
							"CE.1", true);
					var codeDisplayFragment = XmlUtil.findByName(obx3Fragment,
							"CE.2", true);
					fields = "component2[" + j + "],observationEvent";
					type = "CD";
					tagName = "code";
					pathFields = fields.split(',');
					instanceObject = [ XmlUtil.text(codeDisplayFragment),
							XmlUtil.text(codeValueFragment), '' ];
					messageAndUIBinder.writeValueToMessage(tagName, pathFields,
							type, instanceObject);

					
					var valueText = XmlUtil.findByName(obxFragment, "OBX.5",
							true);
					fields = "component2[" + j + "],observationEvent";
					type = "PQ";
					tagName = "value";
					pathFields = fields.split(',');
					instanceObject = [ XmlUtil.text(valueText), '', '' ];
					messageAndUIBinder.writeValueToMessage(tagName, pathFields,
							type, instanceObject);
					
					/*var tsFragment = XmlUtil.findByName(obxFragment, "OBX.14", true);
					var effectiveTimeFragment = XmlUtil.findByName(tsFragment, "TS.1", true);
					fields = "component2[" + j + "],observationEvent";	
					type = "IVL_TS";
					tagName = "effectiveTime";
					pathFields = fields.split(',');
					instanceObject = [XmlUtil.text(effectiveTimeFragment), '', ''];
			    	messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);*/
			    	

					var interpretation = XmlUtil.findByName(obxFragment,
							"OBX.8", true);
					fields = "component2[" + j + "],observationEvent";
					type = "CE";
					tagName = "interpretationCode";
					pathFields = fields.split(',');
					instanceObject = [ XmlUtil.text(interpretation), '', '' ];
					messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);

					
					var interpretationValue = XmlUtil.findByName(obxFragment, "OBX.6", true);
					var interpretationCodeValue = XmlUtil.findByName(interpretationValue, "CE.1", true);
					fields = "component2["
							+ j
							+ "],observationEvent,referenceRange,interpretationRange";
					type = "PQ";
					tagName = "value";
					pathFields = fields.split(',');
					instanceObject = [ XmlUtil.text(interpretationCodeValue), '', '' ];
					messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);


					var refInterpretationCode = XmlUtil.findByName(obxFragment, "OBX.7", true);
					fields = "component2["
							+ j
							+ "],observationEvent,referenceRange,interpretationRange";
					type = "CE";
					tagName = "interpretationCode";
					pathFields = fields.split(',');
					instanceObject = [ XmlUtil.text(refInterpretationCode), '',
							'' ];
					messageAndUIBinder.writeValueToMessage(tagName, pathFields,
							type, instanceObject);

					j++;
				}
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
			if(key === 'messageTitle'){
				thisObject.messageAndUIBinder.updateId('MSG_TITLE', values);
			}
			
		       /* UPDATING PACKAGE_ID */
			if(key === 'packageId'){
				thisObject.messageAndUIBinder.updateId('PACKAGE_ID', values);
			}
			
			if(key === 'component2'){
				//alert("@@: "+values.length);
				$.each(values,function(index,units){
					var unit = "";
					var refRange = "";
					if (units[2]) {
						//alert("units[2]: "+units[2]);
						$.each(units[2],function(count, conceptAttr) {
							if (conceptAttr) {
								if (conceptAttr.key == 'UnitOfMeasure') {
									unit = conceptAttr.value;
									//alert("unit:"+unit);
									fields = "component2["+(index+1)+"],observationEvent,referenceRange,interpretationRange";
									type = "CE";
									tagName = "interpretationCode";
									pathFields = fields.split(',');
									if(unit){
										instanceObject = [unit,null];
									}else{
										instanceObject = [null,null];
									}
									messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
								}
								if (conceptAttr.key == 'ReferenceRange') {
									refRange = conceptAttr.value;
									//alert("refRange: "+refRange);
									fields = "component2["+(index+1)+"],observationEvent,referenceRange,interpretationRange";
									type = "PQ";
									tagName = "value";
									pathFields = fields.split(',');
									if(refRange){
										instanceObject = [refRange,null];
									}else{
										instanceObject = [null,null];
									}
									messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
								}
							}

						});

					}
					
					if(units[0]){
						fields = "component2["+(index+1)+"],observationEvent";
						type = "CD";
						tagName = "code";
						pathFields = fields.split(',');
						instanceObject = [units[0],null];
						messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
					}
					
				});
				
				/*alert("values:"+values.length);
				$.each(values,function(index,unit){
				//alert("interpretationCode: "+unit);
				fields = "component2["+unit[1]+"],observationEvent,referenceRange,interpretationRange";
				type = "CE";
				tagName = "interpretationCode";
				pathFields = fields.split(',');
				instanceObject = [unit[0],null];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
				});*/
			}
			/*if(key === 'value'){
				alert("values2:"+values.length);
				$.each(values,function(index,range){
				//alert("value: "+range);
				fields = "component2["+range[1]+"],observationEvent,referenceRange,interpretationRange";
				type = "PQ";
				tagName = "value";
				pathFields = fields.split(',');
				instanceObject = [range[0],null];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject);
				});
			}*/
			
			
		//}
	}
	;
	
	function fillParticipants() {

	}
	;

};

