function CONSULTATION_LIFELONG_FORM(message, appController, uiGenerator) {

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
				"POLB_MT004000HT01_CNS",
				[ "Composite memory", "Psychomotor speed", "Reaction time",
						"Complex attention", "Cognitive flexibility",
						"Processing speed", "Executive functioning" ],
				[
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Composite Memory']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Psychomotor Speed']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Reaction Time*']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Complex Attention*']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Cognitive Flexibility']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Processing Speed']/value/value/text()",
						"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Executive Functioning']/value/value/text()" ],
				[ "x", "x", "100-x", "x", "x", "x", "x" ],
				[
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))",
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))",
						"(x<10?thisObject.GREEN:(x<21?thisObject.ORANGE:thisObject.RED))",
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))",
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))",
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))",
						"(x<80?thisObject.RED:(x<91?thisObject.ORANGE:thisObject.GREEN))" ],
				[ "74-100", "74-100", "0-24", "74-100", "74-100", "74-100",
						"74-100" ], [ "16", "", "26", "", "", "26", "16" ]);

		putMessageType(
				"POLB_MT004000HT01_Heartmath",
				[ "ANS HRV" ],
				[ "message/POLB_MT004000HT01_Heartmath/component2/observationEvent[3]/value/value" ],
				[ "x" ],
				[ "(x<50?thisObject.RED:(x<=70?thisObject.ORANGE:thisObject.GREEN))" ],
				[ "70-100" ], [ "16" ]);

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
		messageTypeList.push("POLB_MT004000HT01_CNS");
		messageTypeList.push("POLB_MT004000HT01_Heartmath");
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

		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 0));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 1));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 2));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 3));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 4));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 5));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CNS", 6));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_Heartmath", 0));

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
		loadConsultationPage("lifeLongIndicator", coordinates, score_Array);

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