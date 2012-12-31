function CONSULTATION_EXERCISE_FORM(message, appController, uiGenerator) {

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
				"POLB_MT004000HT01_Biospace",
				[ "Body fat" ],
				[ "message/POLB_MT004000HT01_Biospace/component2/observationEvent[code/code='Percent Body Fat']/value/value/text()" ],
				[
						[ "100 - ((x - 15) * 33.3)", "100 - ((x - 15) * 33.3)" ],
						[ "100 - ((x - 20) * 33.3)", "100 - ((x - 20) * 33.3)" ] ],
				[
						[
								"(x<4?thisObject.RED:(x==4||x<5?thisObject.ORANGE:(x==5||x<=20?thisObject.GREEN:(x==21||x<=25?thisObject.ORANGE:thisObject.RED))))",
								"(x<4?thisObject.RED:(x==4||x<5?thisObject.ORANGE:(x==5||x<=20?thisObject.GREEN:(x==21||x<=25?thisObject.ORANGE:thisObject.RED))))" ],
						[
								"(x<12?thisObject.RED:(x==12||x<15?thisObject.ORANGE:(x==15||x<=25?thisObject.GREEN:(x==26||x<=30?thisObject.ORANGE:thisObject.RED))))",
								"(x<12?thisObject.RED:(x==12||x<15?thisObject.ORANGE:(x==15||x<=25?thisObject.GREEN:(x==26||x<=30?thisObject.ORANGE:thisObject.RED))))" ] ],
				[ [ "15-20", "15-20" ], [ "20-25", "20-25" ] ], [
						[ "26", "1" ], [ "26", "1" ] ]);

		putMessageType(
				"POLB_MT004000HT01_FitnessTest",
				[ "Body fat", "Strength", "Strength", "Flexibility",
						"Bone density", "Posture", "Balance", "Metabolic (VO2)" ],
				[
						[
								"message/POLB_MT004000HT01_FitnessTest/component2[1]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[3]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[5]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[7]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[15]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[9]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[11]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[13]/observationEvent/value/value" ],
						[
								"message/POLB_MT004000HT01_FitnessTest/component2[2]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[4]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[6]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[8]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[16]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[10]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[12]/observationEvent/value/value",
								"message/POLB_MT004000HT01_FitnessTest/component2[14]/observationEvent/value/value" ] ],
				[ "100-((x-" + bioFatConstant + ")*33.3)",
						"(x>12?100:(x>8?65:25))", "x", "", "x", "x",
						"(x>16?100:(x>10?65:25))", "(x<100?100:(x<120?65:25))" ],

				[
						"(x<" + bioFatRefRange_Green + "?thisObject.GREEN:(x<"
								+ bioFatRefRange_Orange
								+ "?thisObject.ORANGE:thisObject.RED))",
								"(x<8?thisObject.RED:(x<13?thisObject.ORANGE:thisObject.GREEN))",
								"(x<18?thisObject.RED:(x<31?thisObject.ORANGE:thisObject.GREEN))",
								"(x==25?thisObject.RED:(x==65?thisObject.ORANGE:thisObject.GREEN))",
								"(x==25?thisObject.GREEN:(x==65?thisObject.ORANGE:thisObject.RED))",
								"(x==25?thisObject.RED:(x==65?thisObject.ORANGE:thisObject.GREEN))",
								"(x<10?thisObject.RED:(x<16?thisObject.ORANGE:thisObject.GREEN))",
								"(x<100?thisObject.GREEN:(x<120?thisObject.ORANGE:thisObject.RED))"],
				[ bioFatRefRange_Green, ">12", ">12", "Good", "", "Good",
						">16", "<100" ], [ "1", "26", "26", "16", "1", "16",
						"16", "26" ]);
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
		messageTypeList.push("POLB_MT004000HT01_Biospace");
		messageTypeList.push("POLB_MT004000HT01_FitnessTest");
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

		var pushUps = new Object();
		var sitUps = new Object();
		var strengthIndicatorObject = new Object();

		pushUps = thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 1);
		sitUps = thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 2);
		if (pushUps.value > sitUps.value) {
			strengthIndicatorObject = pushUps;
		} else {
			strengthIndicatorObject = sitUps;
		}

		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_Biospace", 0));
		indicatorObjects.push(strengthIndicatorObject);

		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 3));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 4));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 5));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 6));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 7));

		var Object1 = null;
		var Object2 = null;
		var Object3 = null;
		var Object1val = null;
		var Object2val = null;
		var Object3val = null;

		for ( var index = 0; index < indicatorObjects.length; index++) {

			var indicatorObject = indicatorObjects[index];
			// alert(indicatorObject.value);
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
		loadConsultationPage("exerciseIndicator", coordinates, score_Array);

	}

	function calculateTestValue(message) {
		var j = 0;
		if (message.message) {
			var msg = XmlUtil.stringToXml(message.message);
			var messageType = message.messageType;
			// alert("Message xml : " + message.message);

			var map = thisObject.messageTypeMap.get(messageType);
			if (map) {

				var object = map.value;

				var xPaths = null;
				var formulas = null
				var rangeColors = null;
				var weightings = null;
				var idealScores = null;

				if (messageType == "POLB_MT004000HT01_Biospace") {
					xPaths = object.xPaths;
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