function CONSULTATION_TOXIN_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.messageTypeMap = new HIN.HashMap();
	this.calculateAge = calculateAge;
	this.getMessageTypeIndicatorValues = getMessageTypeIndicatorValues;
	this.GREY = "#CCCCCC";
	this.GREEN = "#8dc642";
	this.ORANGE = "#e8c237";
	this.RED = "#9B1F21";
	var gender = null;
	var genderIndex = 0;
	var bioFatConstant;
	var bioFatRefRange_Green;
	var bioFatRefRange_Orange;

	var currentAge = null;
	var dob = null;
	function initialize() {

		var patientVo = thisObject.appController.getComponent("Context")
				.getPatientVO(patientVo);
		if (patientVo) {
			gender = patientVo.gender;
			dob = patientVo.dob;
			if (dob) {
				dob = new Date(dob);
				var newdate = formatDate(dob, "dd/MM/yyyy");
				currentAge = calculateAge(newdate);
			}
		}

		if (gender == "M") {
			genderIndex = 0;
			bioFatConstant = "15";
			bioFatRefRange_Green = 20;
			bioFatRefRange_Orange = 25;
		} else {
			genderIndex = 1;
			bioFatConstant = "20";
			bioFatRefRange_Green = 25;
			bioFatRefRange_Orange = 30;
		}
		putMessageType(
				"POLB_MT004000HT01_ToxinePanel",
				[ "Aluminum", "Arsenic", "Cadmium", "Lead", "Mercury" ],
				[
						"message/POLB_MT004000HT01_ToxinePanel/component2[1]/observationEvent/value/value",
						"message/POLB_MT004000HT01_ToxinePanel/component2[3]/observationEvent/value/value",
						"message/POLB_MT004000HT01_ToxinePanel/component2[7]/observationEvent/value/value",
						"message/POLB_MT004000HT01_ToxinePanel/component2[10]/observationEvent/value/value",
						"message/POLB_MT004000HT01_ToxinePanel/component2[11]/observationEvent/value/value" ],
				[ "100-(x/2.3)", "100-((x-68)*33.3)", "100-(x*33.3)",
						"100-(x*10)", "100-(x*4)" ],
				[
						"(x<35?thisObject.GREEN:(x<=195?thisObject.ORANGE:thisObject.RED))",
						"(x<117?thisObject.GREEN:(x<=166?thisObject.ORANGE:thisObject.RED))",
						"(x<1?thisObject.GREEN:(x<=2?thisObject.ORANGE:thisObject.RED))",
						"(x<2?thisObject.GREEN:(x<=14?thisObject.ORANGE:thisObject.RED))",
						"(x<4?thisObject.GREEN:(x<=17?thisObject.ORANGE:thisObject.RED))" ],
				[ "<35", "<117", "<1", "<2", "<4" ], [ "16", "16", "16", "26",
						"26" ]);

		putMessageType(
				"POLB_MT004000HT01_BloodTest",
				[ "CA-125", "CEA", "AFP", "PSA", "HCG", "CA15-3" ],
				[
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CA_125']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CEA']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_AFP']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_PSA']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_HCG']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CA15_3']/value/value/text()" ],
				[

						[ "100-((x-12)*7.14)", "100-(x*12.5)",
								"100-((x-8)*8.33)", "100-(x*14.2)",
								"100-(x*12.5)", "100-((x-25)*10)" ],
						[ "100-((x-12)*7.14)", "100-(x*12.5)",
								"100-((x-8)*8.33)", "100-(x*14.2)",
								"100-(x*12.5)", "100-((x-25)*10)" ] ],
				[
						[
								"(x<17?thisObject.GREEN:(x<22?thisObject.ORANGE:thisObject.RED))",// CA-125
								"(x<4?thisObject.GREEN:(x<6?thisObject.ORANGE:thisObject.RED))",// CEA
								"(x<12?thisObject.GREEN:(x<16?thisObject.ORANGE:thisObject.RED))",// AFP
								"(x<3.5?thisObject.GREEN:(x<=4?thisObject.ORANGE:thisObject.RED))",// PSA
								"(x<4?thisObject.GREEN:(x<6?thisObject.ORANGE:thisObject.RED))",// HCG
								"(x<28?thisObject.GREEN:(x<32?thisObject.ORANGE:thisObject.RED))" ],
						[
								"(x<17?thisObject.GREEN:(x<22?thisObject.ORANGE:thisObject.RED))",// CA-125
								"(x<4?thisObject.GREEN:(x<6?thisObject.ORANGE:thisObject.RED))",// CEA
								"(x<12?thisObject.GREEN:(x<16?thisObject.ORANGE:thisObject.RED))",// AFP
								"(x<3.5?thisObject.GREEN:(x<=4?thisObject.ORANGE:thisObject.RED))",// PSA
								"(x<4?thisObject.GREEN:(x<6?thisObject.ORANGE:thisObject.RED))",// HCG
								"(x<28?this.GREEN:(x<32?this.ORANGE:this.RED))" ] ],
				[ [ "<17", "<4", "<12", "<3.5", "<4", "<28" ],
						[ "<17", "<4", "<12", "<3.5", "<4", "<28" ] ], [ "1",
						"1", "1", "1", "1", "1" ]);

		getResults();
		try {

			// alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function putMessageType(type, testNames, xPaths, formulas, rangeColors,
			idealScores, weightings, reportType) {
		var object = new Object();
		object.testNames = testNames;
		object.xPaths = xPaths;
		object.formulas = formulas;

		object.reportType = reportType;
		object.rangeColors = rangeColors;
		object.idealScores = idealScores;
		object.values = [];
		object.colors = [];
		object.weightings = weightings;
		object.scores = [];
		object.idealScore = null;
		object.value = null;
		object.color = null;
		object.messages = [];

		// alert(reportType);
		thisObject.messageTypeMap.put(type, object);

	}
	;

	function getResults() {
		var patientId = null;
		var patientVO = appController.getComponent("Context").getPatientVO();
		if (patientVO) {
			patientId = patientVO.subscriberId;
		}
		if (!patientId)
			return;

		var query = new HIN.Query();
		query.id = patientId;

		var queryHashMap = new HIN.HashMap();
		var key = null;
		var messageType = null;
		for ( var index = 0; index < thisObject.messageTypeMap.length(); index++) {
			queryString = "";
			var map = thisObject.messageTypeMap.getItemAt(index);
			messageType = map.key;
			queryHashMap.put(messageType, queryString);
		}

		/*
		 * this.appController.getComponent("DataLayer").getMessages(patientId,
		 * queryHashMap, function(data) { loadResults(data) }, true);
		 */

		var messageTypeList = [];
		messageTypeList.push("POLB_MT004000HT01_ToxinePanel");
		messageTypeList.push("POLB_MT004000HT01_BloodTest");
		var page = this.appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		page.getProcessDefinitionMessagesForMessageTypes(page, messageTypeList,
				function(data) {
					loadResults(data);
				});

	}
	;

	function loadResults(data) {
		// alert("data.length: " + data.length);
		for ( var index = 0; index < data.length; index++) {
			var message = new HIN.Message();
			message.messageId = data[index].messageId;
			message.messageStatus = data[index].messageStatus;
			message.messageType = data[index].messageType;
			message.message = XmlUtil.xmlToString(data[index].message);
			// alert(message.message);
			var map = thisObject.messageTypeMap.get(message.messageType);
			if (map) {
				var object = map.value;
				object.messages.push(message);
				calculateTestValue(message);

			}
		}

		var indicatorObjects = [];

		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_ToxinePanel", 0));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_ToxinePanel", 1));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_ToxinePanel", 2));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_ToxinePanel", 3));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_ToxinePanel", 4));

		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 0));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 1));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 2));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 3));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 4));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 5));

		var Object1 = null;
		var Object2 = null;
		var Object3 = null;
		var Object1val = null;
		var Object2val = null;
		var Object3val = null;

		for ( var index = 0; index < indicatorObjects.length; index++) {

			var indicatorObject = indicatorObjects[index];
			if (!indicatorObject.value || indicatorObject.value.length == 0) {
				continue;
			}

			if (indicatorObject.color == "#9B1F21") {
				if (Object1 == null) {
					Object1 = indicatorObject;

				} else if (Object2 == null) {
					Object2 = indicatorObject;

				} else if (Object3 == null) {
					Object3 = indicatorObject;

				}

				if (parseFloat(Object1.value) > parseFloat(indicatorObject.value)) {
					if (Object3) {
						Object3 = Object2;
					}
					Object2 = Object1;
					Object1 = indicatorObject;
				} else if (Object2 != null
						&& parseFloat(Object2.value) > parseFloat(indicatorObject.value)) {
					Object3 = Object2;
					Object2 = indicatorObject;
				} else if (Object3 != null
						&& parseFloat(Object3.value) > parseFloat(indicatorObject.value)) {
					Object3 = indicatorObject;
				}
			}
		}

		updateIndicators(Object1, Object2, Object3);

	}
	;

	function updateIndicators(indicatorObject1, indicatorObject2,
			indicatorObject3) {
		var coordinates = [ {
			"x_rect" : 150,
			"x_circle" : 120,
			"x1_line" : 140,
			"x2_line" : 160,
			"x_circle_small" : 160,
			"x_standard" : 160,
			"x_text" : 105
		} ];
		var score_Array = [ indicatorObject1, indicatorObject2,
				indicatorObject3 ];
		loadConsultationPage("toxinIndicator", coordinates, score_Array);

	}

	function calculateTestValue(message) {
		var j = 0;
		if (message.message) {
			var msg = XmlUtil.stringToXml(message.message);
			var messageType = message.messageType;
			/* alert("Message xml : " + message.message); */

			var map = thisObject.messageTypeMap.get(messageType);
			if (map) {

				var object = map.value;

				var xPaths = null;
				var formulas = null
				var rangeColors = null;
				var weightings = null;
				var idealScores = null;

				if (messageType == "POLB_MT004000HT01_Biospace") {
					xPaths = object.xPaths[genderIndex];
					formulas = object.formulas[genderIndex];
					rangeColors = object.rangeColors[genderIndex];
					weightings = object.weightings[genderIndex];
					object.idealScores = object.idealScores[genderIndex];
				} else if (messageType == "POLB_MT004000HT01_FitnessTest") {
					xPaths = object.xPaths[genderIndex];
					formulas = object.formulas;
					rangeColors = object.rangeColors;
					weightings = object.weightings;
				} else if (messageType == "POLB_MT004000HT01_BloodTest") {
					xPaths = object.xPaths;
					formulas = object.formulas[genderIndex];
					rangeColors = object.rangeColors[genderIndex];
					weightings = object.weightings;
					object.idealScores = object.idealScores[genderIndex];
				} else {
					xPaths = object.xPaths;
					formulas = object.formulas;
					rangeColors = object.rangeColors;
					weightings = object.weightings;
				}

				for ( var index = 0; index < xPaths.length; index++) {

					if (xPaths[index] && xPaths[index].length > 0) {

						var score = null;
						var node = null;
						var x = 0;
						if (messageType == "POLB_MT004000HT01_BloodTest"
								|| messageType == "POLB_MT004000HT01_Biospace"
								|| messageType == "POLB_MT004000HT01_CNS"
								|| messageType == "POLB_MT004000HT01_Thyroflex") {
							x = XmlUtil.getXPathResult(msg, xPaths[index],
									XPathResult.STRING_TYPE);
							x = x.stringValue;
							x = parseFloat(x);

							// alert(messageType + ": " + x);
						} else {
							score = XmlUtil.getXPathResult(msg, xPaths[index]);
							node = score.iterateNext();
							if (node) {
								x = XmlUtil.text(node);
								x = parseFloat(x);
							}
						}

						// alert(x);
						var regDeci = /^[0-9]+(\.[0-9]+)+$/;
						if (regDeci.test(x) == true) {
							object.values.push(x.toFixed(1));
						} else {
							object.values.push(x);

						}
						// object.values.push(x);
						// object.values.push(x.toFixed(1));

						if (rangeColors[index] && rangeColors[index].length > 0) {
							object.colors.push(eval(rangeColors[index]));
						} else {
							object.colors.push("");
						}

						if (index == 0) {
							// object.value = object.values[index];
							object.value = x;
							object.color = object.colors[index];
							object.score = object.scores[index];

						}

						if (formulas[index] && formulas[index].length > 0) {
							/*
							 * if (x > 100) { x = 100; }
							 */
							var calculatedValue = Math
									.round(eval(formulas[index]));
							// alert("calculatedValue: "+ calculatedValue);
							if (calculatedValue > 100) {
								calculatedValue = 100;

							}

							object.scores.push(calculatedValue
									* weightings[index]);

						} else {
							object.scores.push("0");
						}

					} else {
						object.values.push("");
						object.colors.push("");
						object.scores.push("0");
					}

				}
			}
		}
	}
	;

	function getMessageTypeIndicatorValues(messageType, index) {
		var object = thisObject.messageTypeMap.getItem(messageType);
		if (object) {
			var indicatorObject = new Object();
			indicatorObject.testName = object.testNames[index];
			indicatorObject.idealScore = object.idealScores[index];
			indicatorObject.value = object.values[index];
			indicatorObject.color = object.colors[index];
			indicatorObject.score = object.scores[index];
			indicatorObject.worstScore = object.worstScore;
			return indicatorObject;
		}

		return null;
	}
	;

	function onLoad(callback) {

		try {
			// alert("onLoad");

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function calculateAge(dob) {
		var date1 = new Date();
		var date2 = new Date(dob);
		var pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // Regex to validate date
		if (pattern.test(dob)) {
			var y1 = date1.getFullYear(); // getting current year
			var y2 = date2.getFullYear(); // getting dob year
			var age = y1 - y2; // calculating age
			return age;
		} else {
			console
					.log("Invalid date format. Please Input in (dd/mm/yyyy) format!");
			return false;
		}
	}
	;

};