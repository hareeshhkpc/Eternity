 function APPOINTMENT_REMINDERS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.physicianHandler = physicianHandler;
	/*this.colorPickerHandler = colorPickerHandler;*/
	this.messageTitle = "";

	function initialize() {

		try {
			// alert("initialize");
			// var message = thisObject.message;
			/*
			 * var message = thisObject.message; var messageAndUIBinder =
			 * message.messageAndUIBinder; if (messageAndUIBinder) {
			 * messageAndUIBinder.addEditorListener("physicianListener",
			 * physicianHandler);
			 * messageAndUIBinder.addEditorListener("colorPickerListener",
			 * colorPickerHandler); }
			 */
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("physicianChange","physicianListener",
						physicianHandler);
				message.messageAndUIBinder.addEditorListener("colorPickerChange","colorPickerListener",
						colorPickerHandler);
			}
			
			thisObject.messageTitle = XmlUtil.getXPathResult(message.message,"//PRPA_MT410001HT02/reasonCode/code",XPathResult.STRING_TYPE);
			thisObject.messageTitle = (thisObject.messageTitle && thisObject.messageTitle.stringValue) ? thisObject.messageTitle.stringValue: "";
			// alert("messageTitle: "+messageTitle);

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {
		try {
			var messageAndUIBinder = message.messageAndUIBinder;
			$("#inner-uiform-" + message.id).find("#colorValue").css(
					"background-color", thisObject.messageTitle);
			$("#inner-uiform-" + message.id).find("#colorValue").css("color",
					thisObject.messageTitle);
			var value = $("#inner-uiform-" + message.id)
					.find("#PNDisplayValue").attr("value");
			$("#inner-uiform-" + message.id).find("#pPhysician").attr("value",
					value);
			
			$("#inner-uiform-" + message.id).find("#sendEmail").hover(
					function() {
						$("#inner-uiform-" + message.id).find('#sendEmail').removeClass('send-icon-link')
								.addClass('send-icon-link-hover');
					},
					function() {
						$("#inner-uiform-" + message.id).find('#sendEmail').removeClass(
								'send-icon-link-hover').addClass(
								'send-icon-link');
					});
			
			var patientVO = appController.getComponent("Context").getPatientVO();
			var appointmentVO = new HIN.AppointmentVO();
			appointmentVO.setMessage(message.message);
			var licenseeVO = appController.getComponent("Context").getLicenseeVO();
			var isEmailAvailable = null;
			
			if(patientVO){
				isEmailAvailable = patientVO.isEmailAvailable;
				
				if(licenseeVO){
					if(isEmailAvailable){
						var emailAddress = patientVO.emailAddress;
						var emailContent = licenseeVO.emailProductContent;
						
						var patientName = patientVO.name;
						var doctorName = null, lowTime = null, highTime = null, appointmentDate = null;
						
						if (appointmentVO) {
							doctorName = appointmentVO.doctor;
							lowTime = formatDate(appointmentVO.start, 'hh:mm:ss');
							appointmentDate = formatDate(appointmentVO.start, 'yyyy-MM-dd');
							highTime = formatDate(appointmentVO.end, 'hh:mm:ss');
							
							var patientNamePlaceHolder = "${PATIENT_NAME}";
							var appointmentNamePlaceHolder = "${APPOINTMETN_DATE}";
							var appointmentTimePlaceHolder = "${APPOINTMETN_TIME}";
							var doctorNamePlaceHolder = "${DOCTOR_NAME}";
							
							emailContent = emailContent.replace(patientNamePlaceHolder,patientName);
							emailContent = emailContent.replace(appointmentNamePlaceHolder,appointmentDate);
							emailContent = emailContent.replace(doctorNamePlaceHolder,doctorName);
							if (lowTime || highTime)
								emailContent = emailContent.replace(appointmentTimePlaceHolder,lowTime + " to " + highTime);
						}
						
						var parentId = 'inner-sub-uiform-head' + message.id;
						
						$('#' + parentId).find('#sendEmail').live('click', function() {
							$('#' + parentId).find('#sendEmail').removeClass('send-icon-link').addClass('send-icon-link-onpress');
							
								/*$("#inner-uiform-" + message.id).find("#EDTextareaText1").text(emailContent);
								$("#inner-uiform-" + message.id).find("#EDTextareaText1").trigger("change");*/
	
								appController
										.getComponent("DataLayer")
										.sendEmail(
												emailAddress,
												emailContent,
												licenseeVO.licenseeEmail,
												licenseeVO.licenseePassword,
												licenseeVO.licenseeAttachment,
												function(data) {
													if (data == "success") {
														notificationmsg
																.success("Email sent successfully");
													} else {
														notificationmsg
																.error("Email sending failed");
													}
												});
						if (!appointmentVO) {
								notificationmsg
										.error("Please take an appointment");
							} else if (!isEmailAvailable) {
								notificationmsg
										.error("No email provided");
							}
						});
					}
				}
			}
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
		// alert("physicianHandler :" + physicianVo);
		appController.getComponent("Context").setConsultant(physicianVo.physicianId);
		appController.getComponent("Context").setPhysicianVO(physicianVo);
	}
	;
	function colorPickerHandler(data){
		// alert("colorPickerHandler :"+data);
	};

};