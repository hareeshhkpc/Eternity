function DEMOGRAPHICS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	function initialize() {
		try {
			var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			if (messageAndUIBinder) {
				messageAndUIBinder
						.addEditorListener("identification",
								"identificationListener",
								identificationListenerHandler);
			}

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}
	}
	;

	function identificationListenerHandler(eventApi) {
		var fieldName = eventApi.fieldName;
		if (eventApi.isSelected) {
			eventApi.getField(fieldName).attr("value", "");
			eventApi.getField(fieldName).attr("readonly", "readonly");
			var membershipValue = appController.getComponent("Context")
					.getPatientVO().membershipId;
			var editorFrag = eventApi.getField(fieldName).closest(
					'[grideditortype="IICombo"]')[0];
			var extensions = $(editorFrag).find('[id="IIComboRoot"]');
			var value = "";
			$(extensions).each(
					function() {
						var editorFragment = $(this).closest(
								'[uiRole="editor"]')[0];
						var option = $(editorFragment).find(
								"#IIComboRoot option:selected");
						if ($(option).text() == "Eternity Membership ID") {
							value = value
									+ $(editorFragment).find(
											"#IIComboExtension").attr("value");
						}

					});
			if (!value) {
				if (membershipValue) {
					eventApi.getField(fieldName).attr("value", membershipValue);
				}
			}

		} else {
			eventApi.getField(fieldName).attr("readonly", false);
		}
	}

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
};