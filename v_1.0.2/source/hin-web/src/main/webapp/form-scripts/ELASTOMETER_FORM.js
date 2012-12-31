function ELASTOMETER_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.messageType = message.messageType;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.series = new Array();
	this.id = null;
	
	this.loadChart = loadChart;
	this.getAge = getAge;
	this.onLoadComplete_ELASTOMETER = onLoadComplete_ELASTOMETER;
	this.loadPathData =loadPathData;

	function initialize() {

		try {
			//alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad"+"\n messageType:"+thisObject.messageType+"\n message:"+thisObject.message);
			thisObject.onLoadComplete_ELASTOMETER(thisObject.messageType, thisObject.message);
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	
	function onLoadComplete_ELASTOMETER(messageType, message) {

		var testTitle = new Array();
		var testValue = null;
		if (message.message) {
			// alert("age" + age);
			var reviewMsg = XmlUtil.getXPathResult(message.message,
					"message/POLB_MT004000HT01_Elastometer");
			var comp = reviewMsg.iterateNext();
			components = XmlUtil.findByName(comp, "referenceRange", false);
			for (i = 0; i < components.length; i++) {
				var observationEvent = XmlUtil.findByName(components[i],
						"interpretationRange", true);
				var codeNode = XmlUtil.findByName(observationEvent, "code", true);
				var codeValue = XmlUtil.findByName(codeNode, "code", true);
				if (i == 0)
					testValue = XmlUtil.text(codeValue);
			}
			$('#inner-uiform-' + message.id).append(
					'<div id="chartElastometer' + message.id + '"></div>');
			$('#inner-uiform-' + message.id).find("#commentsValue2").val(
					thisObject.getAge());

			thisObject.loadChart(messageType, message, testTitle,
					testValue, thisObject.getAge());
		} /*
			 * else { //alert("age" + age); $('#inner-uiform-' + message.id).append( '<div
			 * id="chartElastometer' + message.id + '"></div>'); $('#inner-uiform-' +
			 * message.id).find("#commentsValue2").val(age); }
			 */
		$(".ui-input-text").keyup(
				function() {
					$('#chartElastometer').html('');
					$('#inner-uiform-' + message.id).append(
							'<div id="chartElastometer' + message.id + '"></div>');
					testValue = new Array();
					// alert("keyUp" + $(this).val());
					if ($(this).val()) {
						thisObject.loadChart(messageType, message,
								testTitle, $(this).val(), thisObject.getAge());
					} else {
						thisObject.loadChart(messageType, message,
								testTitle, 0, thisObject.getAge());
					}
				});

	};
	
	function getAge() {
		var today = new Date();
		var nowyear = today.getFullYear();
		var patientVO = this.appController.getComponent("Context").getPatientVO();
		var dob = patientVO.dob;
		dob = dob.split("-");
		return nowyear - dob[0];
	};
	function loadChart(messageType, message,
			testTitle, percentage, age) {		
		var value = (percentage <= 100) ? percentage: 100;
		
		this.id = message.id;
		var testValue = new Array();
		switch (true) {
		case (age < 20):
			testValue[0] = value;
			break;
		case (age >= 20 && age <= 29):
			testValue[1] = value;
			break;
		case (age >= 30 && age <= 39):
			testValue[2] = value;
			break;
		case (age >= 40 && age <= 49):
			testValue[3] = value;
			break;
		case (age >= 50 && age <= 59):
			testValue[4] = value;
			break;
		case (age >= 60):
			testValue[5] = value;
			break;
		default:
			alert("default");
		}
		for ( var j = 0; j <= 5; j++) {
			if (!testValue[j])
				testValue[j] = 0;
		}
		this.series = new Array();
		var colorArray = new Array();
		var rangeArray = new Array();
		colorArray.push("orange");
		rangeArray.push("20");
		var test = {
			data : testValue,
			color : colorArray,
			title : testTitle,
			range : rangeArray
		};
		this.series.push(test);
		var chartdata = new HIN.ChartVO();
		chartdata.testData = this.series;
		chartdata.patientId = '1234';
		chartdata.testDate = new Date();
		chartdata.testType = 'Elastometer';
		chartdata.ymin = 50;// thi ymin and chart ymin should be equal
		chartdata.ymax = 350;
		var json = $.toJSON(chartdata);
		// alert("json" + json);
		thisObject.loadPathData(json);
	};
	
	function loadPathData(json) {
		appController.getComponent("DataLayer").loadChartData(json, createChart, this.series);
	};
	
	function createChart(data, series) {
		var chartData = new HIN.ChartData();
		var patientVO = appController.getComponent("Context").getPatientVO();
		var stringData = chartData.getElastometerChart(data, series,
				thisObject.id, patientVO.name, thisObject.getAge());
		$('#chartElastometer' + thisObject.id).html(stringData);
	};
	
	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

};