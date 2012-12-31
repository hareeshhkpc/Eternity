function CONSULTATION_INFLAMMATION_FORM(message, appController, uiGenerator) {

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
				"POLB_MT004000HT01_CAC",
				[ "CAC" ],
				[ "message/POLB_MT004000HT01_CAC/component2[7]/observationEvent/value/value" ],
				[ "100 - (x / 1.66)" ],
				[ "(x<=9?thisObject.GREEN:(x<=100?thisObject.ORANGE:thisObject.RED))" ],
				[ "0" ], [ "1" ]);

		putMessageType(
				"POLB_MT004000HT01_MCG",
				[ "MCG" ],
				[ "message/POLB_MT004000HT01_MCG/component2/observationEvent[4]/text/thumbnail" ],
				[ "100 - (x * 10)" ],
				[ "(x<2?thisObject.GREEN:(x<5?thisObject.ORANGE:thisObject.RED))" ],
				[ "0" ], [ "26" ]);

		putMessageType(
				"POLB_MT004000HT01_SphygmoCor",
				[ "SphygmoCor" ],
				[ "message/POLB_MT004000HT01_SphygmoCor/component2/observationEvent[2]/value/value" ],
				[ "100 - ((x - 60) * 2)" ],
				[ "(x<50?thisObject.RED:(x==50||x<60?thisObject.ORANGE:(x==60||x<=80?thisObject.GREEN:(x==81||x<=90?thisObject.ORANGE:thisObject.RED))))" ],
				[ "60-80" ], [ "16" ]);

		putMessageType(
				"POLB_MT004000HT01_IMT",
				[ "IMT" ],
				[ "message/POLB_MT004000HT01_IMT/component2[6]/observationEvent/value/value" ],
				[ "100 - x" ],
				[ "(x<26?thisObject.GREEN:(x<75?thisObject.ORANGE:thisObject.RED))" ],
				[ "<25" ], [ "26" ]);

		// IMT HeartSmart

		putMessageType(
				"POLB_MT004000HT01_IMT_HearSmart",
				[ "IMT", "IMT", "IMT" ],
				[
						"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[1]/text/thumbnail",
						"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[2]/text/thumbnail",
						"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[3]/text/thumbnail" ],
						[],
				[ "(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))",
						"(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))",
						"(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))" ], [
						"A", "A", "A" ], [ "26", "26", "26" ]);

		putMessageType(
				"POLB_MT004000HT01_Bioclip",
				[ "Bioclip" ],
				[ "message/POLB_MT004000HT01_Bioclip/component2[1]/observationEvent/value/value" ],
				[ "(x>currentAge?100:(x==currentAge?65:25))" ],
				[ "(x<currentAge?thisObject.GREEN:(x==currentAge?thisObject.ORANGE:thisObject.RED))" ],
				[ "<" + currentAge ], [ "16" ]);

		putMessageType(
				"POLB_MT004000HT01_BloodTest",
				[ "CRP-hs", "Homocysteine", "TNF", "PAI-1", "Fibrinogen",
						"Ferritin" ],
				[
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_High-Sensitivity_C_Reactive_Protein']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Homocysteine']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_TNF']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_PAI-1']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Fibrinogen']/value/value/text()",
						"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Ferritin']/value/value/text()" ],
				[

						[ "100 - (x * 33.3)", "100- ((x-5) * 7.69)",
								"100 - ((x-6) * 16.6)",
								"100 - ((x-242) * 4.16)",
								"100 - ((x-250) * 1.33)",
								"100 - ((x-275) / 1.15)" ],
						[ "100 - (x * 33.3)", "100- ((x-5) * 7.69)",
								"100 - ((x-6) * 16.6)",
								"100 - ((x-242) * 4.16)",
								"100 - ((x-250) * 1.33)",
								"100 - ((x-275) / 1.15)" ] ],
				[
						[
								"(x<1?thisObject.GREEN:(x<4?thisObject.ORANGE:thisObject.RED))", // CRP-hs
								"(x<11?thisObject.GREEN:(x<14?thisObject.ORANGE:thisObject.RED))",// Homocysteine
								"(x<8?thisObject.GREEN:(x<11?thisObject.ORANGE:thisObject.RED))",// TNF
								"(x<235?thisObject.GREEN:(x<261?thisObject.ORANGE:thisObject.RED))",// PAI-1
								"(x<275?thisObject.GREEN:(x<301?thisObject.ORANGE:thisObject.RED))",// Fibrinogen
								"(x<300?thisObject.GREEN:(x<366?thisObject.ORANGE:thisObject.RED))" ],
						[
								"(x<1?thisObject.GREEN:(x<4?thisObject.ORANGE:thisObject.RED))", // CRP-hs
								"(x<11?thisObject.GREEN:(x<14?thisObject.ORANGE:thisObject.RED))",// Homocysteine
								"(x<8?thisObject.GREEN:(x<11?thisObject.ORANGE:thisObject.RED))",// TNF
								"(x<235?thisObject.GREEN:(x<261?thisObject.ORANGE:thisObject.RED))",// PAI-1
								"(x<275?thisObject.GREEN:(x<301?thisObject.ORANGE:thisObject.RED))",// Fibrinogen
								"(x<300?thisObject.GREEN:(x<366?thisObject.ORANGE:thisObject.RED))" ] ],
				[ [ "<1", "5-10", "<8", "<250", "<275", "<300" ],
						[ "1", "10", "8", "250", "275", "300" ] ], [ "16", "1",
						"1", "1", "1", "1" ]);

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
		messageTypeList.push("POLB_MT004000HT01_CAC");
		messageTypeList.push("POLB_MT004000HT01_MCG");
		messageTypeList.push("POLB_MT004000HT01_SphygmoCor");
		messageTypeList.push("POLB_MT004000HT01_IMT");
		messageTypeList.push("POLB_MT004000HT01_IMT_HearSmart");
		messageTypeList.push("POLB_MT004000HT01_Bioclip");
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

		var imtPanasonic = new Object();
		var imtHeartSmart1 = new Object();
		var imtHeartSmart2 = new Object();
		var imtHeartSmart3 = new Object();
		var imtHeartSmart = new Object();
		var imtIndicatorObject = new Object();
		var imtHeartSmartIndicatorValue = 0;

		imtPanasonic = getMessageTypeIndicatorValues("POLB_MT004000HT01_IMT", 0);
		imtHeartSmart1 = getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 0);
		imtHeartSmart2 = getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 1);
		imtHeartSmart3 = getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 2);

		var imtDinominator = [];
		if(imtHeartSmart1.value){
			imtIndicatorObject.value = imtHeartSmart1.value;
			imtDinominator.push(imtHeartSmart1.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue + imtHeartSmart1.value;
		}
		
		if(imtHeartSmart2.value){
			imtIndicatorObject.value = imtHeartSmart2.value;
			imtDinominator.push(imtHeartSmart2.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue + imtHeartSmart2.value;
		}
		
		if(imtHeartSmart3.value){
			imtIndicatorObject.value = imtHeartSmart3.value;
			imtDinominator.push(imtHeartSmart3.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue + imtHeartSmart3.value;
		}
		
		imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue/imtDinominator.length;
		
		/*imtHeartSmartIndicatorValue = (imtHeartSmart1.value
				+ imtHeartSmart2.value + imtHeartSmart3.value) / 3;*/
		
		var regDeci = /^[0-9]+(\.[0-9]+)+$/;
		if (regDeci.test(imtHeartSmartIndicatorValue) == true) {
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
					.toFixed(1);
		}

		if (imtPanasonic.value && imtHeartSmart3.value) {
			imtIndicatorObject = imtPanasonic;
		} else if (imtPanasonic.value && !imtHeartSmart3.value) {
			imtIndicatorObject = imtPanasonic;
		} else if (!imtPanasonic.value && imtHeartSmart3.value) {
			var x = imtHeartSmartIndicatorValue;
			x = eval("(x<=10?10:(x==10.1||x<=25?25:(x<=25.1||x<=40?40:(x<=40.1||x<=65?65:100))))");
			var weight = 26;
			var imtIndicatorColor;

			imtIndicatorColor = eval("(x==100?'#8dc642':(x==65?'#e8c237':'#9B1F21'))");
			
			x = eval("(x==10?'E':(x==25?'D':(x==40?'C':(x==65?'B':'A'))))");

			imtIndicatorObject.testName = "IMT";
			imtIndicatorObject.idealScore = "A";
			imtIndicatorObject.value = x;
			imtIndicatorObject.color = imtIndicatorColor;
		}

		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_CAC", 0));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_MCG", 0));
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_SphygmoCor", 0));

		indicatorObjects.push(imtIndicatorObject);
		indicatorObjects.push(getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_Bioclip", 0));

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

		// alert("" + indicatorObjects);
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

		// alert(Object1 + " ," + Object2 + "," + Object3);
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
		loadConsultationPage("inflammationIndicator", coordinates, score_Array);

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
				var testNames = null;
				var xPaths = null;
				var formulas = null
				var rangeColors = null;
				var weightings = null;
				var idealScores = null;

				if (messageType == "POLB_MT004000HT01_Biospace") {
					testNames = object.testNames;
					xPaths = object.xPaths[genderIndex];
					formulas = object.formulas[genderIndex];
					rangeColors = object.rangeColors[genderIndex];
					weightings = object.weightings[genderIndex];
					object.idealScores = object.idealScores[genderIndex];
				} else if (messageType == "POLB_MT004000HT01_FitnessTest") {
					testNames = object.testNames;
					xPaths = object.xPaths[genderIndex];
					formulas = object.formulas;
					rangeColors = object.rangeColors;
					weightings = object.weightings;
				} else if (messageType == "POLB_MT004000HT01_BloodTest") {
					testNames = object.testNames;
					xPaths = object.xPaths;
					formulas = object.formulas[genderIndex];
					rangeColors = object.rangeColors[genderIndex];
					weightings = object.weightings;
					object.idealScores = object.idealScores[genderIndex];
				} else {
					testNames = object.testNames;
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
								if (messageType != "POLB_MT004000HT01_IMT_HearSmart") {
									x = parseFloat(x);
								}
							}
						}
						
						if (messageType == "POLB_MT004000HT01_IMT_HearSmart") {
							 //alert("value: " + x);
							if (x == "Normal" || x == "None Observed") {
								x = 100;
							} else if (x == "Mild" || x == "Early Buildup"
									|| x == "Nominal") {
								x = 65;
							} else if (x == "Moderate" || x == "Calcified"
									|| x == "Less than 30%") {
								x = 40;
							} else if (x == "Significant" || x == "Mixed"
									|| x == "Between 30%-50%") {
								x = 25;
							} else if (x == "Critical Significant" || x == "Soft"
									|| x == "Greater than 50%") {
								x = 10;
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
							object.testName = object.testNames[index];
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