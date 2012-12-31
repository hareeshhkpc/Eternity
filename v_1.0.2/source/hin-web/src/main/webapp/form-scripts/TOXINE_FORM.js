function TOXINE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.messageType = message.messageType;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	
	this.onLoadComplete_ToxinePanel = onLoadComplete_ToxinePanel;
	this.toxinUploadHandler = toxinUploadHandler;
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;

	function initialize() {

		try {
			//alert("initialize");
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.toxinUploadHandler);
			}

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");
			thisObject.onLoadComplete_ToxinePanel(thisObject.messageType, message);
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onLoadComplete_ToxinePanel(messageType, message) {
		var codeArray = new Array();
		var referenceRangeArray = new Array();
		var resultArray = new Array();
		component = XmlUtil.getXPathResult(message.message,
				"message/POLB_MT004000HT01_ToxinePanel");
		if (component) {
			var comp = component.iterateNext();
		}
		component2 = XmlUtil.findByName(comp, "component2", false);
		for (i in component2) {
			var observationEvent = XmlUtil.findByName(component2[i],
					"observationEvent", true);
			var codeNode = XmlUtil.findByName(observationEvent, "code", true);
			var code = XmlUtil.findByName(codeNode, "code", true);
			var codeValue = XmlUtil.text(code);
			codeArray.push(codeValue);
			var referenceRangeNode = XmlUtil.findByName(observationEvent,
					"referenceRange", true);
			var interpretationRangeNode = XmlUtil.findByName(
					referenceRangeNode, "interpretationRange", true);
			var valueNode = XmlUtil.findByName(interpretationRangeNode,
					"value", true);
			var rangeCode = XmlUtil.findByName(valueNode, "code", true);
			var referenceRange = XmlUtil.text(rangeCode);
			referenceRangeArray.push(referenceRange);

			var resultNode = XmlUtil
					.findByName(observationEvent, "value", true);
			var resultValueNode = XmlUtil.findByName(resultNode, "value", true);
			var resultValue = XmlUtil.text(resultValueNode);
			resultValue = resultValue ? resultValue : 0;
			resultArray.push(resultValue);
			$('#inner-uiform-' + message.id).find('#PQInplaceDisplayValue' + i)
					.live(
							'keyup',
							function() {
								var resultValue = $(this).val();
								var testId = $(this).attr('idsuffix');
								var rangeId = calculateReferenceRange(
										resultValue,
										referenceRangeArray[testId], testId);
								$('#inner-uiform-' + message.id).find(
										"#referenceRangeId"
												+ $(this).attr('idsuffix'))
										.css("width", rangeId);
							});

			var toxineRange = calculateReferenceRange(resultValue,
					referenceRange, i);
			$('#inner-uiform-' + message.id).find("#referenceRangeId" + i).css(
					"width", toxineRange);
		}
		function calculateReferenceRange(resultValue, referenceRangeId, testId) {
			var value = 114.7
			if (testId == 20) {
				resultValue = (resultValue >= 35 && resultValue <= 225) ? resultValue
						: 0;
				value = 57.3;
				referenceRangeId = 35;
			} else {
				var SplitValue = referenceRangeId.split(" ");
				referenceRangeId = SplitValue[1];
			}
			var width = (resultValue / referenceRangeId) * value;
			return ((width <= 344.0 && width >= 0) ? width : 344.0);
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
	
	function toxinUploadHandler(extractedValues){
			try {
				eval('var data=' + extractedValues);
			} catch (error) {
				console.log("Invalid JSON extractedValues from the TOXIN: "+ extractedValues);
				return;
			}
			
			
			
			try{
				$.each(data,function(key,value){
					label  = value.name;
					result = value.value;
					if(label){
						label = $.trim(label);
					}
					
					var formId = $('#inner-uiform-' + message.id).find("#"+label).attr('id');
					if(formId){
						var editorObj = thisObject.messageAndUIBinder.geteditor(formId);
						var idSuffix = $("#inner-uiform-" + message.id).find('#'+formId).attr('idSuffix');
						var field = editorObj.getField('PQInplaceDisplayValue'+idSuffix);
						field.val(result).trigger('change');
					}
					
				});
			}catch(jsonError){
				console.log("error in iterating over the extracted values in TOXIN: " + jsonError);
			}
	}	


};