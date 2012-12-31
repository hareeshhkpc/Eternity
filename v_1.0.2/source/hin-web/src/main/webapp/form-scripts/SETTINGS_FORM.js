function SETTINGS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	function initialize() {

		try {
			// alert("initialize");

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			
			 

		} catch (error) {
			alert("Error in form initialize  script: " + error);
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