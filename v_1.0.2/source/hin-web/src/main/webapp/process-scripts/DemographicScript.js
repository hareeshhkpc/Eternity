function DemographicsAndBackground(processDefinition, appController,
		idGenerator, parameter) {
	var thisObject = this;

	// alert("Inside DemographicsAndBackground");

	this.processDefinition = processDefinition;
	this.appController = appController;
	this.idGenerator = idGenerator;
	this.dataLayer = appController.getComponent("DataLayer");

	this.enrollStpName = 'Step5';
	/*
	 * this.appointmentMessageType = 'PRPA_MT410001HT02'; this.feesMessageType =
	 * 'FIAB_MT020000HT02_FEES'; this.count = 0;
	 * 
	 * this.cacMessageType = 'POXX_MT111000HT02_CAC';
	 */

	this.messageTypes = [];
	this.messageTypeQueue = 0;
	this.callBackAfterScript = null;

	this.messageCreationMap = new HIN.HashMap();
	this.messageCreationMapQueue = 0;

	this.objects = [];
	this.objectQueue = 0;
	this.financeObjects = [];
	this.parameter = parameter;

	this.initialize = function(callBackFunction) {

		// thisObject.log("initialize : " + thisObject.processDefinition);

		// thisObject.parameter.programCode = "BHRTProgram";

		var feeObject = new Object();
		feeObject.messageType = 'FIAB_MT020000HT02';
		feeObject.conceptName = 'Fee';
		feeObject.category = "Finance";
		feeObject.lookup = false;
		thisObject.financeObjects.push(feeObject);

		var costObject = new Object();
		costObject.messageType = 'FIAB_MT020000HT02';
		costObject.conceptName = 'Cost';
		costObject.category = "Finance";
		costObject.lookup = false;
		thisObject.financeObjects.push(costObject);

	};

	this.programInitialize = function() {

		var chosenProgram = null;
		var gender = null;
		var regionCode = null;
		if (thisObject.parameter && thisObject.parameter.programCode) {
			chosenProgram = thisObject.parameter.programCode;
			gender = thisObject.parameter.gender;
			regionCode = thisObject.parameter.regionCode;
			if (!chosenProgram)
				chosenProgram = chosenProgram;
		}
		// alert("Script chosenProgram :" + chosenProgram);
		var none = [];
		if (chosenProgram == "AgeManagementProgram") {
			var messageTypeName = "Fees";
			thisObject.addToMessageCreationMap("POCD_MT000040UV_Program",
					"AgeManagementProgram", messageTypeName,
					"eternity_programs", true, thisObject.financeObjects);
			messageTypeName = "Appointment";
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			/*
			 * there are 3 appointments for a program, first is 2weeks from
			 * now,2nd is 3months from now and 3rd is 3months and 2weeks from
			 * now
			 */
			/*
			 * thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
			 * 'Appointment', messageTypeName, "Others", true, none);
			 */

			messageTypeName = "Diagnostic Tests";
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_IMT',
					'IMT_per_use', messageTypeName, "Service", true, none);

			thisObject.addToMessageCreationMap(
					'POLB_MT004000HT01_IMT_HearSmart', 'IMT_HEARTSMART',
					messageTypeName, "Service", true, none);

			thisObject.addToMessageCreationMap('POLB_MT004000HT01_Bioclip',
					'BioClip', messageTypeName, "Service", true, none);
			thisObject
					.addToMessageCreationMap('POLB_MT004000HT01_Thyroflex',
							'Thyroflex_per_use', messageTypeName, "Service",
							true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_MCG', 'MCG',
					messageTypeName, "Service", true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_SphygmoCor',
					'SphygmoCor', messageTypeName, "Service", true, none);

			thisObject.addToMessageCreationMap('POLB_MT004000HT01_CAC',
					'Calcium Score_EBCT Scanner', messageTypeName, "Service",
					true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_Biospace',
					'Biospace', messageTypeName, "Service", true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_ToxinePanel',
					'TOXINE', messageTypeName, "Service", true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_FitnessTest',
					'FITNESS_TEST', messageTypeName, "Service", true, none);

			/*
			 * thisObject.addToMessageCreationMap('POLB_MT004000HT01_BloodTest',
			 * 'Premiere_Age_Management_Blood_Panel', messageTypeName,
			 * "Service", true, none);
			 * thisObject.addToMessageCreationMap('POLB_MT004000HT01_BloodTest',
			 * 'Premiere_Age_Management_Blood_Panel', messageTypeName,
			 * "Service", true, none);
			 */

			if (regionCode === "USA") {
				if (gender == 'F') {
					thisObject.addToMessageCreationMap(
							'POLB_MT004000HT01_BloodTest',
							'AMP_USA_Female_Panel', messageTypeName, "Service",
							true, none);
				} else {
					thisObject.addToMessageCreationMap(
							'POLB_MT004000HT01_BloodTest',
							'AMP_USA_Male_Panel', messageTypeName, "Service",
							true, none);
				}
			} else {
				if (gender == 'F') {
					thisObject.addToMessageCreationMap(
							'POLB_MT004000HT01_BloodTest',
							'FemaleAgeManagementBloodPanel', messageTypeName,
							"Service", true, none);
				} else {
					thisObject.addToMessageCreationMap(
							'POLB_MT004000HT01_BloodTest',
							'MaleAgeManagementBloodPanel', messageTypeName,
							"Service", true, none);
				}

			}
			messageTypeName = "Physical Examination";
			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhEx',
					'PhysicalExamination', messageTypeName, "Service", true,
					none);

			messageTypeName = "Questionnaire";
			thisObject.addToMessageCreationMap(
					'POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE',
					'Cardio Metabolic Health Assessment', messageTypeName,
					"Questionnaire", true, none);

			/*
			 * thisObject.addToMessageCreationMap(
			 * 'POCD_MT000040UV_AWARENESS_QUESTIONNAIRE', 'Awareness
			 * Questionnaire', messageTypeName, "Questionnaire", true, none);
			 */

			/* added details for Results */
			messageTypeName = "Results";
			thisObject.addToMessageCreationMap('POCD_MT000040UV_ResultsView',
					'Results-REVIEW_FORM', messageTypeName, "review", true,
					none);

			/* added details for Consultation */
			messageTypeName = "Consultation";

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_IN',
					'CONSULTATION_Inflammation', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_NU',
					'CONSULTATION_Nutrition', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_TO',
					'CONSULTATION_Toxin', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_EX',
					'CONSULTATION_Exercise', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_GE',
					'CONSULTATION_Genetics', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POSA_MT920000HT03_HormonesRpt',
					'CONSULTATION_RestorationOfHormones', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap(
					'POSA_MT920000HT03_SupplementsRpt',
					'CONSULTATION_AdvancedSupplementation', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_LI',
					'CONSULTATION_LifeLong', messageTypeName, "Consultation",
					true, none);

			/* added details for Client Report */
			messageTypeName = "Client Report";
			thisObject.addToMessageCreationMap(
					'POCD_MT000040UV_ClientReportView', 'Client Report',
					messageTypeName, "ClientReport", true, none);

		} else if (chosenProgram == "CardioMetabolic") {
			thisObject.addToMessageCreationMap("POCD_MT000040UV_Program",
					"CARDIO-METABOLIC", "eternity_programs", true,
					thisObject.financeObjects);

			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', "Others", true, none);

			thisObject.addToMessageCreationMap('POLB_MT004000HT01_Elastometer',
					'Elastometer', "Service", true, none);
		} else if (chosenProgram == "BHRTProgram") {

			/*
			 * var messageTypeName = "Fees";
			 * thisObject.addToMessageCreationMap("POCD_MT000040UV_Program",
			 * "BHRTProgram", messageTypeName, "eternity_programs", true,
			 * thisObject.financeObjects);
			 * 
			 * messageTypeName = "Appointment";
			 * thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
			 * 'Appointment', messageTypeName, "Others", true, none);
			 * thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
			 * 'Appointment', messageTypeName, "Others", true, none);
			 * thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
			 * 'Appointment', messageTypeName, "Others", true, none);
			 * 
			 * messageTypeName = "Diagnostic Tests";
			 * 
			 * if (gender == 'M') { thisObject.addToMessageCreationMap(
			 * 'POLB_MT004000HT01_BloodTest', 'MaleHormonePanel',
			 * messageTypeName, "Service", true, none); } else {
			 * thisObject.addToMessageCreationMap(
			 * 'POLB_MT004000HT01_BloodTest', 'FemaleHormonePanel',
			 * messageTypeName, "Service", true, none); } thisObject
			 * .addToMessageCreationMap('POLB_MT004000HT01_Thyroflex',
			 * 'Thyroflex_per_use', messageTypeName, "Service", true, none);
			 * thisObject.addToMessageCreationMap('POLB_MT004000HT01_Biospace',
			 * 'Biospace', messageTypeName, "Service", true, none);
			 */

			var messageTypeName = "Fees";
			thisObject.addToMessageCreationMap("POCD_MT000040UV_Program",
					"BHRTProgram", messageTypeName, "eternity_programs", true,
					thisObject.financeObjects);
			messageTypeName = "Appointment";
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
					'Appointment', messageTypeName, "Others", true, none);
			/*
			 * there are 3 appointments for a program, first is 2weeks from
			 * now,2nd is 3months from now and 3rd is 3months and 2weeks from
			 * now
			 */
			/*
			 * thisObject.addToMessageCreationMap("PRPA_MT410001HT02",
			 * 'Appointment', messageTypeName, "Others", true, none);
			 */

			messageTypeName = "Diagnostic Tests";

			if (gender == 'M') {
				thisObject.addToMessageCreationMap(
						'POLB_MT004000HT01_BloodTest', 'MaleHormonePanel',
						messageTypeName, "Service", true, none);
			} else {
				thisObject.addToMessageCreationMap(
						'POLB_MT004000HT01_BloodTest', 'FemaleHormonePanel',
						messageTypeName, "Service", true, none);
			}
			thisObject
					.addToMessageCreationMap('POLB_MT004000HT01_Thyroflex',
							'Thyroflex_per_use', messageTypeName, "Service",
							true, none);
			thisObject.addToMessageCreationMap('POLB_MT004000HT01_Biospace',
					'Biospace', messageTypeName, "Service", true, none);

			messageTypeName = "Physical Examination";
			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhEx',
					'PhysicalExamination', messageTypeName, "Service", true,
					none);

			messageTypeName = "Questionnaire";
			thisObject.addToMessageCreationMap(
					'POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE',
					'Cardio Metabolic Health Assessment', messageTypeName,
					"Questionnaire", true, none);

			/*
			 * thisObject.addToMessageCreationMap(
			 * 'POCD_MT000040UV_AWARENESS_QUESTIONNAIRE', 'Awareness
			 * Questionnaire', messageTypeName, "Questionnaire", true, none);
			 */

			/* added details for Results */
			messageTypeName = "Results";
			thisObject.addToMessageCreationMap('POCD_MT000040UV_ResultsView',
					'Results-REVIEW_FORM', messageTypeName, "review", true,
					none);

			/* added details for Consultation */
			messageTypeName = "Consultation";

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_IN',
					'CONSULTATION_Inflammation', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_NU',
					'CONSULTATION_Nutrition', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_TO',
					'CONSULTATION_Toxin', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_EX',
					'CONSULTATION_Exercise', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_GE',
					'CONSULTATION_Genetics', messageTypeName, "Consultation",
					true, none);

			thisObject.addToMessageCreationMap('POSA_MT920000HT03_HormonesRpt',
					'CONSULTATION_RestorationOfHormones', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap(
					'POSA_MT920000HT03_SupplementsRpt',
					'CONSULTATION_AdvancedSupplementation', messageTypeName,
					"Consultation", true, none);

			thisObject.addToMessageCreationMap('POCD_MT000040UV_PhComm_LI',
					'CONSULTATION_LifeLong', messageTypeName, "Consultation",
					true, none);

			/* added details for Client Report */
			messageTypeName = "Client Report";
			thisObject.addToMessageCreationMap(
					'POCD_MT000040UV_ClientReportView', 'Client Report',
					messageTypeName, "ClientReport", true, none);

		} else {
			alert(" Please choose a program");// ChosenProgram [ " +
			// chosenProgram + " ] not
			// found");
		}

	};

	this.processHandler = function(processDefinition) {
		// alert($.toJSON(processDefinition));
	};

	this.addToMessageCreationMap = function(messageType, conceptName,
			messageTypeName, category, lookup, financeObjects) {

		// alert("conceptName:" + conceptName);

		var object = new Object();
		object.messageType = messageType;
		object.conceptName = conceptName;
		object.messageTypeName = messageTypeName;
		object.category = category;
		object.lookup = lookup;
		thisObject.messageCreationMap.put(object, financeObjects);

	}

	this.stepOpen = function(stepName, callBackAfterScript) {

		if (stepName === thisObject.enrollStpName) {
			thisObject.callBackAfterScript = callBackAfterScript;
			thisObject.programInitialize();
			thisObject.startMessageCreation();
		}
	};

	this.startMessageCreation = function() {

		if (thisObject.messageCreationMapQueue < thisObject.messageCreationMap
				.length()) {
			var map = thisObject.messageCreationMap
					.getItemAt(thisObject.messageCreationMapQueue);
			thisObject.messageCreationMapQueue++;
			thisObject.objectQueue = 0;
			var object = map.key;
			thisObject.objects = map.value;
			thisObject.createNewMessage(object, null, thisObject.messageCreate);
		} else {
			if (thisObject.callBackAfterScript) {
				thisObject.callBackAfterScript(thisObject.processDefinition);
			}
		}
	}

	this.messageCreate = function(conceptLookup) {

		/*
		 * alert(thisObject.messageTypeQueue + "<" +
		 * thisObject.messageTypes.length);
		 */
		if (thisObject.objectQueue < thisObject.objects.length) {
			thisObject.objectQueue++;
			thisObject.createNewMessage(
					thisObject.objects[thisObject.objectQueue - 1],
					conceptLookup, function() {
						// alert("Message Created.");
						thisObject.messageCreate(conceptLookup);
					});
		} else {
			thisObject.startMessageCreation();
		}
	}

	this.createNewMessage = function(object, conceptLookup, callback) {

		// if call from startMessageCreation then object should be there
		var messageType = object.messageType;
		var conceptName = object.conceptName;
		var messageTypeName = object.messageTypeName;
		var category = object.category;
		var lookup = object.lookup;

		/*
		 * if (!messageType) { messageType = object; } else { lookup = true; }
		 */
		// alert("creating NewMessage: " + messageType + " lookup : " + lookup);
		if (messageType == "POCD_MT000040UV_Program") {
			thisObject.fetchLookup(category, conceptName, null, null, null,
					conceptLookup, callback);
		} else {

			thisObject.dataLayer
					.loadConfig(
							messageType,
							function(configDoc) {
								var message = configDoc.createMessage();
								thisObject.dataLayer.config = configDoc;
								thisObject.dataLayer
										.generateId(
												function(msgId, msgApiObj,
														messageObj) {

													// Add the current
													// appointment to process
													// definition
													var msgTypeObj = thisObject.processDefinition
															.getStep(
																	thisObject.enrollStpName)
															.getMessageTypeByType(
																	messageType);

													if (!msgTypeObj) {
														msgTypeObj = new HIN.MessageType();
														msgTypeObj.type = messageType;
														msgTypeObj.typeName = messageTypeName;
														messageObj.title = msgTypeObj.title;
														thisObject.processDefinition
																.getStep(
																		thisObject.enrollStpName)
																.addMessageType(
																		msgTypeObj);

													}
													// messageObj.newTask =
													// true;

													if (messageType == "FIAB_MT020000HT02") {
														if (conceptName == "Fee")
															messageObj.financeType = AppConstants.XPaths.Finance.FEE;
														else
															messageObj.financeType = AppConstants.XPaths.Finance.COST;
													}

													/*
													 * if (messageType ==
													 * "FIAB_MT020000HT02" &&
													 * conceptName == "Cost") { //
													 * alert(messageType + " : " +
													 * conceptName);
													 * messageObj.renderUI =
													 * false;
													 * messageObj.formView =
													 * false; } if (messageType ==
													 * "POCD_MT000040UV_ClientReportView" &&
													 * conceptName == "Client
													 * Report") { //
													 * alert(messageType + " : " +
													 * conceptName);
													 * messageObj.renderUI =
													 * false;
													 * messageObj.formView =
													 * false; }
													 */

													if (category)
														msgTypeObj.category = category;

													if (conceptName)
														msgTypeObj.title = conceptName;
													else
														msgTypeObj.title = msgTypeObj.type;

													messageObj.title = msgTypeObj.title;

													if (lookup) {
														thisObject.fetchLookup(
																category,
																conceptName,
																msgTypeObj,
																msgId, message,
																conceptLookup,
																callback)
													} else {
														msgTypeObj
																.addMessage(messageObj);
														thisObject.fillMessage(
																msgTypeObj,
																message,
																conceptLookup,
																callback,
																object);
													}

												}, message);
							});
		}
	};

	this.fetchLookup = function(category, conceptName, msgTypeObj, msgId,
			message, conceptLookup, callback) {
		// alert(category + " , " + conceptName);
		if (category && conceptName) {

			var object = new Object();
			object.msgTypeObj = msgTypeObj;
			object.msgId = msgId;
			object.callback = callback;
			object.message = message;
			object.category = category;
			thisObject.appController.getComponent("DataLayer")
					.fetchConceptByName(conceptName, thisObject.getLookup,
							object);
		}/*
			 * else { thisObject .fillMessage(msgTypeObj, message,
			 * conceptLookup, callback); }
			 */
	}

	this.getLookup = function(conceptLookup, object) {
		// alert("Concept : " + conceptLookup.getDescription());
		var msgTypeObj = object.msgTypeObj;
		var msgId = object.msgId;
		var message = object.message;
		var callback = object.callback;
		var category = object.category;
		// alert("getLookup :" + msgTypeObj);
		// alert("getLookup :" + object.category);

		if (conceptLookup && conceptLookup.getName()) {

			var messageType = conceptLookup.getAttribute("MessageType");
			var messageForm = conceptLookup.getAttribute("MessageForm");
			// var typeName = conceptLookup.getAttribute("MessageTypeName");
			var title = conceptLookup.getDescription();

			if (msgTypeObj) {
				msgTypeObj.type = messageType;
				msgTypeObj.formHtml = messageForm;
				msgTypeObj.title = title;
				// msgTypeObj.typeName = typeName;
				var id = thisObject.idGenerator.getId();
				var messageObj = new HIN.Message();
				messageObj.id = id;
				messageObj.messageId = msgId;
				messageObj.message = message.getXML();
				messageObj.msg = message;
				messageObj.title = msgTypeObj.title;
				if (category == "Service")
					messageObj.partOfPackage = true;
				if (messageType != "FIAB_MT020000HT02")
					messageObj.addNew = true;
				// alert(messageObj.title + " : " + messageObj.partOfPackage);
				msgTypeObj.addMessage(messageObj);
				thisObject.fillMessage(msgTypeObj, message, conceptLookup,
						callback);
			} else if (callback) {
				callback(conceptLookup);
			}
		} else {
			if (callback)
				callback(null);
		}

	};

	this.fillMessage = function(messageType, message, conceptLookup, callback,
			object) {

		// alert("fillMessage : " + messageType.type + " : " + conceptLookup);
		if (messageType.type == "FIAB_MT020000HT02") {
			// message.title = messageType.typeName = "ServiceFee";
			thisObject.fillFeeMessage(messageType, message, conceptLookup,
					callback, object);
		} else if (messageType.type == "PRPA_MT410001HT02") {
			thisObject.fillAppointmentMessage(messageType, message,
					conceptLookup, callback);
		} else {
			// alert(messageType.type);
			messageTypeScript = new MessageTypeScript(message,
					messageType.type, this.appController);
			thisObject.dataLayer.loadData("JS_" + messageType.type, {},
					function(data) {
						// alert("Script loaded");
						messageTypeScript.loadScript(data);
						// messageTypeScript.initialize();

						if (callback)
							callback(conceptLookup);
					});

			// if (callback) callback(conceptLookup);

		}

	};

	this.fillFeeMessage = function(messageType, message, conceptLookup,
			callback, object) {
		var concept = conceptLookup.getName();
		var className = conceptLookup.getMessageTypeClassName();
		var conceptName = "Fee";
		if (object)
			conceptName = object.conceptName;
		var amt = conceptLookup.getAttribute(conceptName);// Fee or Cost;

		messageTypeScript = new MessageTypeScript(message, messageType.type,
				this.appController);
		thisObject.dataLayer
				.loadData(
						"JS_" + messageType.type,
						{},
						function(data) {
							// alert("Script loaded");
							messageTypeScript.loadScript(data);
							messageTypeScript.initialize();

							// alert("initialized");

							var formattedDate = formatDate(new Date(),
									'yyyy-MM-dd');
							// alert("formattedDate: " + formattedDate);
							messageTypeScript.fillData('effectiveTime',
									formattedDate);

							messageTypeScript.fillData('amt', amt);

							// alert("XML:\n" +
							// XmlUtil.xmlToString(message.getXML()));

							var components = [ {
								'quantity' : 1,
								'unitPrice' : amt,
								'netAmount' : amt
							} ];
							messageTypeScript.fillData(
									'financialTransactionChargeDetail',
									components);

							components = [ {
								'concept' : conceptLookup.getName(),
								'description' : conceptLookup.getDescription()
							} ];
							// alert(concept);
							messageTypeScript.fillData('service', components);

							var transactionType = null;
							//alert("className : " + className);
							if (className == "Service"
									|| className == "Package") {
								transactionType = AppConstants.TransactionType.SERVICE_FEE;
								if (conceptName == "Cost")
									transactionType = AppConstants.TransactionType.SERVICE_COST;
							} else if (className == "Drug") {
								transactionType = AppConstants.TransactionType.PRODUCT_FEE;
								if (conceptName == "Cost")
									transactionType = AppConstants.TransactionType.PRODUCT_COST;

							}

							messageTypeScript.fillData('transactionType',
									transactionType);
							messageTypeScript.fillData('transactionStatus',
									AppConstants.TransactionStatus.ORDERED);

							// alert("XML:\n" +
							// XmlUtil.xmlToString(message.getXML()));

							if (callback)
								callback(conceptLookup);
						});
	};
	this.fillCostMessage = function(messageType, message, conceptLookup,
			callback) {
		var cost = conceptLookup.getAttribute("Cost");
		// alert("Cost : " + cost);
		if (callback)
			callback(conceptLookup);
	};
	this.fillAppointmentMessage = function(messageType, message, conceptLookup,
			callback) {

		/*
		 * var messageAndUIBinder = new MessageAndUIBinder('', message,
		 * messageType.type); var appointmentTime = getTime(); var fields = "";
		 * var type = "IVL_TS"; var tagName = "effectiveTime"; var pathFields =
		 * fields.split(','); var lowAppTime = appointmentTime[0]; var
		 * highAppTime = appointmentTime[1] instanceObject = [ lowAppTime,
		 * highAppTime, null ];
		 * 
		 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
		 * instanceObject);
		 */
		var appointmentTime = getTime();
		var lowAppTime = appointmentTime[0];
		var highAppTime = appointmentTime[1];
		messageTypeScript = new MessageTypeScript(message, messageType.type,
				this.appController);
		thisObject.dataLayer.loadData("JS_" + messageType.type, {}, function(
				data) {
			// alert("Script loaded");
			messageTypeScript.loadScript(data);
			messageTypeScript.initialize();
			// alert("initialized");

			// alert("XML:\n" + XmlUtil.xmlToString(message.getXML()));

			var components = [ {
				'low' : lowAppTime,
				'high' : highAppTime
			} ];
			messageTypeScript.fillData('effectiveTime', components);

			// alert("XML:\n" + XmlUtil.xmlToString(message.getXML()));
			messageTypeScript.complete();
			// alert("XML:\n" + XmlUtil.xmlToString(message.getXML()));
			if (callback)
				callback(conceptLookup);
		});

		/*
		 * if (callback) callback(conceptLookup);
		 */
	};

	/*
	 * this.fillAppointmentFeeMessage = function(messageType, message,
	 * conceptLookup, callback) { var fee = conceptLookup.getAttribute("Fee"); //
	 * alert("Fee : " + fee); var messageAndUIBinder = new
	 * MessageAndUIBinder('', message, messageType.type);
	 * 
	 * var fields = ""; var type = "TS"; var tagName = "effectiveTime"; var
	 * pathFields = fields.split(','); instanceObject = [ getCurrentTime(),
	 * null, null ];
	 * 
	 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
	 * instanceObject);
	 * 
	 * var fields = "component,financialTransactionChargeDetail"; var type =
	 * "RTO_PQ_PQ"; var tagName = "unitQuantity"; var pathFields =
	 * fields.split(','); var numerator = 1; var denominator = 1; instanceObject = [
	 * numerator, denominator, null ];
	 * 
	 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
	 * instanceObject);
	 * 
	 * var fields = "component,financialTransactionChargeDetail"; var type =
	 * "RTO_MO_PQ"; var tagName = "unitPriceAmt"; var pathFields =
	 * fields.split(','); var numerator = 1 * fee; var denominator = 1 * fee;
	 * instanceObject = [ numerator, denominator, null ];
	 * 
	 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
	 * instanceObject);
	 * 
	 * var fields = "component,financialTransactionChargeDetail"; var type =
	 * "MO"; var tagName = "netAmt"; var pathFields = fields.split(',');
	 * instanceObject = [ fee, null, null ];
	 * 
	 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
	 * instanceObject); if (callback) callback(conceptLookup); };
	 */
	/*
	 * this.createMessage = function(messageType, callBackFunction) { //
	 * alert("createMessage : " + messageType);
	 * DemographicsAndBackground.loadConfig(messageType, function(msgBinder) { //
	 * alert("msgBinder: " + msgBinder); if (callBackFunction)
	 * callBackFunction(msgBinder); }); };
	 */

	var appointmentCount = 0;
	function getTime() {
		var appointmentTime = new Array();
		appointmentCount++;

		var date = new Date();
		var min = date.getMinutes();
		var minute = Math.round(min / 15) * 15;
		var curretntDate = new Date(date.getFullYear(), date.getMonth(), date
				.getDate(), date.getHours(), minute);

		var appointmentLowDate = "";
		if (appointmentCount == 1) {
			appointmentLowDate = new Date(curretntDate.getTime() + 1000 * 60
					* 60 * 24 * 7 * 2);
		} else if (appointmentCount == 2) {
			appointmentLowDate = new Date(curretntDate.getTime() + 1000 * 60
					* 60 * 24 * 30 * 3);
		} else {
			appointmentLowDate = new Date(curretntDate.getTime() + 1000 * 60
					* 60 * 24 * 30 * 3 + 1000 * 60 * 60 * 24 * 7 * 2);
		}

		var appointmenthighDate = new Date(
				appointmentLowDate.getTime() + 1000 * 60 * 15);

		appointmentTime[0] = formatDate(appointmentLowDate,
				'yyyy-MM-dd HH:mm:ss');
		appointmentTime[1] = formatDate(appointmenthighDate,
				'yyyy-MM-dd HH:mm:ss');
		return appointmentTime;
	}
	;

	function getCurrentTime() {
		var date = new Date();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var hour = date.getHours();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var year = date.getFullYear()
		var currentTime = year + "/" + month + "/" + day + " " + hour + ":"
				+ min + ":" + sec;
		return currentTime;
	}
	;

	this.log = function(message) {
		alert(message);
	}

};