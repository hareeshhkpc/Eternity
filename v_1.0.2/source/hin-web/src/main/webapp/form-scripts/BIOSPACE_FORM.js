function BIOSPACE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.uploadHandler = uploadHandler;
	this.getFieldIdList = getFieldIdList;
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;

	function initialize() {

		try {

			if (thisObject.message && thisObject.message.messageAndUIBinder) {
				thisObject.message.messageAndUIBinder.addEditorListener("upload", "uploadListener", thisObject.uploadHandler);
				
			}

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			// alert("onLoad");
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value", patientId);
			
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

	function getFieldIdList() {
		var fieldIdList = [];

		fieldIdList.push([ "PQInplaceDisplayValue40", "biospaceText40" ]);

		for ( var i = 1; i <= 39; i++) {
			fieldIdList
					.push([ "PQInplaceDisplayValue" + i, "biospaceText" + i ]);
		}

		return fieldIdList;

	}

	function uploadHandler(extractedValues) {
		var fieldIdList = thisObject.getFieldIdList();
		try {
			eval('var data=' + extractedValues);
		} catch (error) {
			console.log("Invalid JSON extractedValues from the  BIOSPACE: "
					+ extractedValues);
			return;
		}

		var count = 0;
		try {
			$.each(data, function(key, value) {
				var fieldDetails = [];
				if (key >= 5) {
					fieldDetails = fieldIdList[count];
					count += 1;
					var editorObj = thisObject.messageAndUIBinder
							.geteditor(fieldDetails[1]);
					var field = editorObj.getField(fieldDetails[0]);
					field.val(value.value).trigger('change');
				}
			});
		} catch (jsonError) {
			console
					.log("error in iterating over the extracted values in BIOSPACE: "
							+ jsonError);
		}
	}

};