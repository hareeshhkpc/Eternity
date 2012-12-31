function ABI_FORM(message, appController, uiGenerator) {
	
	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.abiCalculation = abiCalculation;

	function initialize() {

		try {
			// alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			var id = thisObject.message.id;

			$('#inner-uiform-' + id)
					.find(
							'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue4,#PQInplaceDisplayValue5')
					.unbind('change', thisObject.abiCalculation);
			$('#inner-uiform-' + id)
					.find(
							'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue4,#PQInplaceDisplayValue5')
					.bind('change', thisObject.abiCalculation);
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function abiCalculation() {
		var id = thisObject.message.id;

		var sum = 0;
		var rightAnklePressure = 0;
		var leftAnklePressure = 0;
		var rightArmPressure = 0;
		var leftArmPressure = 0;
		var rightABI = 0;
		var leftABI = 0;
		var numStr = 0;

		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue1').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			rightArmPressure = numStr;
		}
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue2').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			rightAnklePressure = numStr;
		}

		rightABI = (rightAnklePressure / rightArmPressure);
		var newnumber = Math.round(rightABI * Math.pow(10, 2))
				/ Math.pow(10, 2);

		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue3").attr("value",
				parseFloat(newnumber));
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue3").trigger(
				'change');

		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue4').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			leftArmPressure = numStr;
		}
		numStr = $('#inner-uiform-' + id).find('#PQInplaceDisplayValue5').val();
		numStr = (numStr === null || numStr.length < 1) ? '0' : numStr;
		if (!isNaN(numStr)) {
			leftAnklePressure = numStr;
		}

		leftABI = (leftAnklePressure / leftArmPressure);
		var newnumber1 = Math.round(leftABI * Math.pow(10, 2))
				/ Math.pow(10, 2);

		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue6").attr("value",
				parseFloat(newnumber1));
		$('#inner-uiform-' + id).find("#PQInplaceDisplayValue6").trigger(
				'change');
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