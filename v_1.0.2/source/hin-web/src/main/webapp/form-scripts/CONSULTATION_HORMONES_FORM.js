function CONSULTATION_HORMONES_FORM(message, appController, uiGenerator) {

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
				"POLB_MT004000HT01_Thyroflex",
				[ "Thyroid" ],
				[ "message/POLB_MT004000HT01_Thyroflex/component2/observationEvent[code/code='REFLEX TIME']/value/value/text()" ],
				[ "100-((x-50)/1)" ],
				[ "(x<=100?thisObject.GREEN:(x<=136?thisObject.ORANGE:thisObject.RED))" ],
				[ "52-100" ], [ "26" ]);

		putMessageType(
				"POLB_MT004000HT01_BloodTest",
				[ "Testosterone", "Progesterone", "Estradiol", "DHT",
						"Pregnenolone", "Cortisol", "Insulin", "VitD3", "DHEA",
						"IgF", "Estrogen" ],
				[
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Total_Testosterone']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Progesterone']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Estradiol_(E2)']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_DHT']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Pregnenolone']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Cortisol']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Insulin']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_VitD3']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Dehydroepiandrosterone-Sulfate']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_IGF']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Estrogen']/value/value/text()" ],

				[

						[ "((x - 120) / 7.8)", "x * 57.1", "100 - (x * 1.42)",
								"100-((x-250)/9)", "(x*13.3)", "100-(x*14.2)",
								"100 - ((x-10) * 1.11)", "((x-160) / 0.36)",
								"((x-50) / 3.3)", "x" ],
						[ "(x * 1.1)", "(x * 14.2)", "x", "x", "(x*13.3)",
								"100-(x*14.2)", "100 - ((x-10) * 1.11)",
								"((x-160) / 0.36)", "((x-50) / 3.3)",
								"((x-20)*2.5)" ] ],
				[
						[
								"(x<180?thisObject.RED:(x==180||x<=700?thisObject.ORANGE:(x==701||x<=1100?thisObject.GREEN:(x==1101||x<=1250?thisObject.ORANGE:thisObject.RED))))",// Testosterone
								"(x<0.15?thisObject.RED:(x==0.15||x<=0.9?thisObject.ORANGE:(x==1||x<=2?thisObject.GREEN:(x==2.1||x<=5?thisObject.ORANGE:thisObject.RED))))",// Progesterone
								"(x<50?thisObject.GREEN:(x<58?thisObject.ORANGE:thisObject.RED))",// Estradiol
								"(x<100?thisObject.RED:(x==100||x<=249?thisObject.ORANGE:(x==250||x<=799?thisObject.GREEN:(x==800||x<=990?thisObject.ORANGE:thisObject.RED))))",// DHT
								"thisObject.GREY",// Pregnenolone
								"(x<2.5?thisObject.RED:(x==2.5||x<=4.9?thisObject.ORANGE:(x==5||x<=12?thisObject.GREEN:(x==12.1||x<=20?thisObject.ORANGE:thisObject.RED))))",// Cortisol
								"(x<1?thisObject.RED:(x==1||x<=1.9?thisObject.ORANGE:(x==2||x<=4.9?thisObject.GREEN:(x==5||x<=10?thisObject.ORANGE:thisObject.RED))))",// Insulin
								"(x<50?thisObject.RED:(x==50||x<=74?thisObject.ORANGE:(x==75||x<=99?thisObject.GREEN:(x==100||x<=150?thisObject.ORANGE:thisObject.RED))))",// VitaminD3
								"(x<250?thisObject.RED:(x==250||x<=349?thisObject.ORANGE:(x==355||x<=449?thisObject.GREEN:(x==450||x<=500?thisObject.ORANGE:thisObject.RED))))",// DHEA
								"(x<99?thisObject.RED:(x==99||x<=225?thisObject.ORANGE:(x==226||x<=380?thisObject.GREEN:(x==381||x<=400?thisObject.ORANGE:thisObject.RED))))",// IgF
								"(x<50?thisObject.RED:(x==50||x<=89?thisObject.ORANGE:(x==90||x<=950?thisObject.GREEN:(x==951||x<=1250?thisObject.ORANGE:thisObject.RED))))" ],
						[
								"(x<3?thisObject.RED:(x==3||x<=5?thisObject.ORANGE:(x==6||x<=84?thisObject.GREEN:(x==85||x<=100?thisObject.ORANGE:thisObject.RED))))",// Testosterone
								"(x<1?thisObject.RED:(x==1||x<=2?thisObject.ORANGE:(x==2.1||x<=86?thisObject.GREEN:(x==87||x<=100?thisObject.ORANGE:thisObject.RED))))",// Progesterone
								"(x<50?thisObject.GREEN:(x<58?thisObject.ORANGE:thisObject.RED))",// Estradiol
								"(x<100?thisObject.RED:(x==100||x<=249?thisObject.ORANGE:(x==250||x<=799?thisObject.GREEN:(x==800||x<=990?thisObject.ORANGE:thisObject.RED))))",// DHT
								"thisObject.GREY",// Pregnenolone
								"(x<2.5?thisObject.RED:(x==2.5||x<=4.9?thisObject.ORANGE:(x==5||x<=12?thisObject.GREEN:(x==12.1||x<=20?thisObject.ORANGE:thisObject.RED))))",// Cortisol
								"(x<1?thisObject.RED:(x==1||x<=1.9?thisObject.ORANGE:(x==2||x<=4.9?thisObject.GREEN:(x==5||x<=10?thisObject.ORANGE:thisObject.RED))))",// Insulin
								"(x<50?thisObject.RED:(x==50||x<=74?thisObject.ORANGE:(x==75||x<=99?thisObject.GREEN:(x==100||x<=150?thisObject.ORANGE:thisObject.RED))))",// VitaminD3
								"(x<250?thisObject.RED:(x==250||x<=349?thisObject.ORANGE:(x==355||x<=449?thisObject.GREEN:(x==450||x<=500?thisObject.ORANGE:thisObject.RED))))",// DHEA
								"(x<99?thisObject.RED:(x==99||x<=225?thisObject.ORANGE:(x==226||x<=380?thisObject.GREEN:(x==381||x<=400?thisObject.ORANGE:thisObject.RED))))",// IgF
								"(x<50?thisObject.RED:(x==50||x<=89?thisObject.ORANGE:(x==90||x<=950?thisObject.GREEN:(x==951||x<=1250?thisObject.ORANGE:thisObject.RED))))" ] ],
				[
						[ ">700", "1-1.15", "0-50", "250-800", "", "5.1-7.5",
								"0-4.9", "40-100", ">450", "241-380", ">50" ],
						[ ">90", ">5", "0-50", "250-800", "", "5.1-7.5",
								"0-4.9", "40-100", ">450", "241-380", ">50" ] ],
				[ "26", "16", "16", "1", "1", "16", "1", "1", "1", "1", "16" ]);

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
		messageTypeList.push("POLB_MT004000HT01_Thyroflex");
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
			var map = thisObject.messageTypeMap.get(message.messageType);
			if (map) {
				var object = map.value;
				object.messages.push(message);
				calculateTestValue(message);

			}
		}

		var indicatorObjects = [];

		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_Thyroflex", 0));
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
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 6));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 7));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 8));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 9));
		indicatorObjects.push(thisObject.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 10));

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
		loadConsultationPage("restorationHormonIndicator", coordinates,
				score_Array);

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