function PACKAGE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	function initialize() {

		try {
			// alert("PACKAGE_FORM initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {

			var id = thisObject.message.id;
			var instanceId = uiGenerator.instanceId;
			$('#uiform-sub-head' + instanceId).find(
					'#inner-sub-uiform-head' + id).find('#inner-uiform-' + id)
					.find('#packageOrder').append(
							'<div id="packageOrder-' + id + '">');

			//alert(instanceId + " : " + id);
			// alert("PACKAGE_FORM onLoad " + id);

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