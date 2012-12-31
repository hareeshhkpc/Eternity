 function APPOINTMENT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.physicianHandler = physicianHandler;
	this.colorPickerHandler = colorPickerHandler;
	this.messageTitle = "";

	function initialize() {

		try {
			//alert("initialize");
			//var message = thisObject.message;
			/*var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			if (messageAndUIBinder) {
				messageAndUIBinder.addEditorListener("physicianListener",
						physicianHandler);
				messageAndUIBinder.addEditorListener("colorPickerListener",
						colorPickerHandler);
			}*/
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("physicianChange","physicianListener",
						physicianHandler);
				message.messageAndUIBinder.addEditorListener("colorPickerChange","colorPickerListener",
						colorPickerHandler);
			}
			
			thisObject.messageTitle = XmlUtil.getXPathResult(message.message,"//PRPA_MT410001HT02/reasonCode/code",XPathResult.STRING_TYPE);
			thisObject.messageTitle = (thisObject.messageTitle && thisObject.messageTitle.stringValue) ? thisObject.messageTitle.stringValue: "";
			//alert("messageTitle: "+messageTitle);

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");
			//var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			//if (messageAndUIBinder) {
				//var selectedText = $("#"+messageAndUIBinder.parentContainerID).find('#colorValue');
			
			/*var messageTitle = XmlUtil.getXPathResult(message.message,"//PRPA_MT410001HT02/reasonCode/code",XPathResult.STRING_TYPE);

			messageTitle = (messageTitle && messageTitle.stringValue) ? messageTitle.stringValue: "";
			
			alert("messageTitle: "+messageTitle);*/
			
				//var selectedText = $("#"+messageAndUIBinder.parentContainerID).find('#colorValue');
		//	$("#inner-uiform-" + message.id).find('#colorValue').css("background-color",thisObject.messageTitle);
		//	$("#inner-uiform-" + message.id).find('#colorValue').css("color",thisObject.messageTitle);
			var messageAndUIBinder = message.messageAndUIBinder;
			$("#inner-uiform-" + message.id).find("#colorValue").css(
					"background-color", thisObject.messageTitle);
			$("#inner-uiform-" + message.id).find("#colorValue").css("color",
					thisObject.messageTitle);
			var value = $("#inner-uiform-" + message.id)
					.find("#PNDisplayValue").attr("value");
			$("#inner-uiform-" + message.id).find("#pPhysician").attr("value",
					value);
		
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
	function physicianHandler(physicianVo) {
		//alert("physicianHandler :" + physicianVo);
		appController.getComponent("Context").setConsultant(physicianVo.physicianId);
		appController.getComponent("Context").setPhysicianVO(physicianVo);
	}
	;
	function colorPickerHandler(data){
		//alert("colorPickerHandler :"+data);
	};

};