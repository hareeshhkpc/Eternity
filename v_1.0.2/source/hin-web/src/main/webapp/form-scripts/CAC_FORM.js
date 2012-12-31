function CAC_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.cacCalculation = cacCalculation;

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
			//alert("onLoad");
			
			var id = thisObject.message.id;

			/*$('#inner-uiform-' + id)
					.find(
							'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue3,#PQInplaceDisplayValue4')
					.unbind('change', thisObject.cacCalculation);
			$('#inner-uiform-' + id)
					.find(
							'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue3,#PQInplaceDisplayValue4')
					.bind('change', thisObject.cacCalculation);*/
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function cacCalculation() {/*
		var id = thisObject.message.id;
		var sum = 0;
		var numStr = 0;
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue1').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			sum += parseFloat(numStr);
		}
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue2').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			sum += parseFloat(numStr);
		}
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue3').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			sum += parseFloat(numStr);
		}
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue4').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			sum += parseFloat(numStr);
		}
		sum = Math.round(sum * Math.pow(10, 2)) / Math.pow(10, 2);
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue5").attr("value",
				sum);
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue5").trigger(
				'change');
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue7").attr("value",
				sum);
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue7").trigger(
				'change');
	*/}
	;
	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

};