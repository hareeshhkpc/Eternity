function CONSULTATION_GENETICS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;


	function initialize() {

		try {
			var coordinates = [ {
				"x_rect" : 150,
				"x_circle" : 120,
				"x1_line" : 140,
				"x2_line" : 160,
				"x_circle_small" : 160,
				"x_standard" : 160,
				"x_text" : 105
			} ];
			var score_Array = [ 80, 100, 80 ];
			loadConsultationPage("geneticsIndicator", coordinates, score_Array);
			
			//alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");

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