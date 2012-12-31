function CONSULTATION_SUPPLEMENTATION_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.messageTypeMap = new HIN.HashMap();
	this.getMessageTypeIndicatorValues = getMessageTypeIndicatorValues;
	var currentAge = null;
	var gender = null;
	var genderIndex = 0;
	this.GREY = "#CCCCCC";
	this.GREEN = "#8dc642";
	this.ORANGE = "#e8c237";
	this.RED = "#9B1F21";

	function initialize() {

		putMessageType(
				"POLB_MT004000HT01_BloodTest",
				[ "Hemoglobin", "Total protein", "Albumen", "Globulin",
						"Magnesium", "Calcium", "Uric Acid", "Vitamin B12",
						"Ferritin" ],
				[
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Hemoglobin']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Protein-Total']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Albumin']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Globulin']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Magnesium']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Calcium']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Uric_Acid']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Vitamin_B12']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Ferritin']/value/value/text()" ],
				[

						[ "((x-7) * 12.5)", "((x-3) * 20)", "((x-1) * 16.6)",
								"((x-1) * 33.33)", "(x * 40)",
								"100 - ((x-8.5) * 18.1)", "x", "((x-190)/8)",
								"100 - ((x-275) / 1.15)" ],
						[ "((x-7) * 12.5)", "((x-3) * 20)", "((x-1) * 16.6)",
								"((x-1) * 33.33)", "(x * 40)",
								"100 - ((x-8.5) * 18.1)", "x", "((x-190)/8)",
								"100 - ((x-275) / 1.15)" ] ],
				[
						[
								"(x<11?thisObject.RED:(x<=13?thisObject.ORANGE:thisObject.GREEN))",// Hemoglobin
								"(x<5?thisObject.RED:(x<=6?thisObject.ORANGE:thisObject.GREEN))",// Totalprotein
								"(x<3?thisObject.RED:(x<=5?thisObject.ORANGE:thisObject.GREEN))",// Albumen
								"(x<2?thisObject.RED:(x<=3?thisObject.ORANGE:thisObject.GREEN))",// Globulin
								"(x<1.3?thisObject.RED:(x<=2?thisObject.ORANGE:thisObject.GREEN))",// Magnesium
								"(x<6?thisObject.RED:(x==6||x<=8.4?thisObject.ORANGE:(x==8.5||x<=10.5?thisObject.GREEN:(x==10.6||x<=11?thisObject.ORANGE:thisObject.RED))))",// Calcium
								"(x<4.5?thisObject.GREEN:(x<5.6?thisObject.ORANGE:thisObject.RED))",// UricAcid
								"(x<200?thisObject.RED:(x<=900?thisObject.ORANGE:thisObject.GREEN))",// VitaminB12
								"(x<300?thisObject.GREEN:(x<366?thisObject.ORANGE:thisObject.RED))" ],
						[
								"(x<11?thisObject.RED:(x<=13?thisObject.ORANGE:thisObject.GREEN))",// Hemoglobin
								"(x<5?thisObject.RED:(x<=6?thisObject.ORANGE:thisObject.GREEN))",// Totalprotein
								"(x<3?thisObject.RED:(x<=5?thisObject.ORANGE:thisObject.GREEN))",// Albumen
								"(x<2?thisObject.RED:(x<=3?thisObject.ORANGE:thisObject.GREEN))",// Globulin
								"(x<1.3?thisObject.RED:(x<=2?thisObject.ORANGE:thisObject.GREEN))",// Magnesium
								"(x<6?thisObject.RED:(x==6||x<=8.4?thisObject.ORANGE:(x==8.5||x<=10.5?thisObject.GREEN:(x==10.6||x<=11?thisObject.ORANGE:thisObject.RED))))",// Calcium
								"(x<4.5?thisObject.GREEN:(x<5.6?thisObject.ORANGE:thisObject.RED))",// UricAcid
								"(x<200?thisObject.RED:(x<=900?thisObject.ORANGE:thisObject.GREEN))",// VitaminB12
								"(x<300?thisObject.GREEN:(x<366?thisObject.ORANGE:thisObject.RED))" ] ],
				[
						[ ">13", ">6", ">5", ">3", ">2", "8.5-10.5", "<4.5",
								">970", "<300" ],
						[ ">13", ">6", ">5", ">3", ">2", "8.5-10.5", "<4.5",
								">970", "<300" ] ], [ "1", "16", "16", "1",
						"26", "1", "1", "16", "1" ]);

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

		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 1));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 2));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 3));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 4));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 5));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 6));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 7));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_BloodTest", 8));
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
		loadConsultationPage("supplemetIndicator", coordinates, score_Array);

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

};