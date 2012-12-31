function HEART_MATH_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.messageType = message.messageType;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.createHeartMathUI = createHeartMathUI;
	this.checkTotalRange = checkTotalRange;

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
			thisObject.createHeartMathUI(message.messageType, message);
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function createHeartMathUI(messageType,
			message) {

		substanceMsg = XmlUtil
				.getXPathResult(
						message.message,
						"message/POLB_MT004000HT01_Heartmath/component2/observationEvent[1]/value/value");
		var substanceNode = substanceMsg.iterateNext();
		var lowInputValue = XmlUtil.text(substanceNode, "value", true);
		loadSubHeartMathUI(lowInputValue, "lowCoherance");

		substanceMsg = XmlUtil
				.getXPathResult(
						message.message,
						"message/POLB_MT004000HT01_Heartmath/component2/observationEvent[2]/value/value");
		var substanceNode = substanceMsg.iterateNext();
		var medInputValue = XmlUtil.text(substanceNode, "value", true);
		loadSubHeartMathUI(medInputValue, "medCoherance");

		substanceMsg = XmlUtil
				.getXPathResult(
						message.message,
						"message/POLB_MT004000HT01_Heartmath/component2/observationEvent[3]/value/value");
		var substanceNode = substanceMsg.iterateNext();
		var heighInputValue = XmlUtil.text(substanceNode, "value", true);
		loadSubHeartMathUI(heighInputValue, "highCoherance");

		$('#inner-uiform-' + message.id)
				.find(
						'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue3')
				.die('keyup', loadHeartMathUI);

		$('#inner-uiform-' + message.id)
				.find(
						'#PQInplaceDisplayValue1,#PQInplaceDisplayValue2,#PQInplaceDisplayValue3')
				.live('keyup', loadHeartMathUI);

		
		function loadHeartMathUI() {
			thisObject.checkTotalRange(this);
			var inputValue = $(this).val();
			var coheranceID = "";
			if ($(this).attr('id') == 'PQInplaceDisplayValue1') {
				coheranceID = "lowCoherance";
			} else if ($(this).attr('id') == 'PQInplaceDisplayValue2') {
				coheranceID = "medCoherance";
			} else if ($(this).attr('id') == 'PQInplaceDisplayValue3') {
				coheranceID = "highCoherance";
			}
			loadSubHeartMathUI(inputValue, coheranceID);

		}

		function loadSubHeartMathUI(inputValue, coheranceID) {
			if (inputValue <= 150) {
				var height = 1.54 * inputValue + 9;
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"height", height);
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"margin-top", 250 - height);
			} else if (inputValue > 150) {
				var height = 1.54 * 100 + 9;
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"height", height);
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"margin-top", 250 - height);
			} else {
				var height = 9;
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"height", height);
				$('#inner-uiform-' + message.id).find("#" + coheranceID).css(
						"margin-top", 250 - height);
			}
		}

	};
	
	function checkTotalRange(htmlFragment){
		var id = $(htmlFragment).attr("id");
		var value = $("#inner-uiform-" + thisObject.message.id).find("#"+id).val();
		
		if(parseInt(value) > 150){
			notificationmsg.success("Enter a value less than 150");
			$("#inner-uiform-" + thisObject.message.id).find("#"+id).val("");			
			value = 0;
		}
		
		
		var lowText = $("#inner-uiform-" + thisObject.message.id).find("#PQInplaceDisplayValue1").val();
		var medText = $("#inner-uiform-" + thisObject.message.id).find("#PQInplaceDisplayValue2").val();
		var highText = $("#inner-uiform-" + thisObject.message.id).find("#PQInplaceDisplayValue3").val();
		var total = 0;
		
		if(parseInt(lowText)){
			total = parseInt(lowText);
		}
		if(parseInt(medText)){
			total += parseInt(medText);
		}
		if(parseInt(highText)){
			total += parseInt(highText);
		}
		
		
		if(parseInt(total) > 150){
			notificationmsg.success("SUM of Low, Med, High should be less than 150");
			$(htmlFragment).val("");
		}
	};
	
	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

};