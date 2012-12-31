 function PRODUCT_REMINDERS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	function initialize() {

		try {

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {
		try {
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
			
			var PatientVO = appController.getComponent("Context").getPatientVO();
			var appointmentVO = appController.getComponent("Context").getAppointmentVO();
			var userVO = appController.getComponent("Context").getUserVo();

			var emailId = null;
			var isEmailAvailable = PatientVO.isEmailAvailable;
			if(isEmailAvailable){
				emailId = PatientVO.emailAddress[0];
			}
			$("#inner-uiform-" + message.id).find('#sendEmail').live('click', function() {
				var messageContent = $("#inner-uiform-" + message.id).find("#messageContent");
				var fieldId = $(messageContent).find('[ dataField="true"]').attr('id');
				var tinyMCEObj = tinyMCE.get(fieldId);
				var mailContent = tinyMCEObj.getContent();
	
				if (isEmailAvailable) {
					alert(emailId + ", " + mailContent);

					$('#sendEmail').removeClass(
							'send-icon-link').addClass(
							'send-icon-link-onpress');

					appController
							.getComponent("DataLayer")
							.sendEmail(
									emailId,
									mailContent,
									"sunanda@gmail.com",
									"sunanda",
									null,
									function(data) {
										alert(data);
										if (data == "success") {
											notificationmsg
													.success("Email sent successfully");
										} else {
											notificationmsg
													.error("Email sending failed");
										}
									});
			} else if (!appointmentVO) {
					notificationmsg
							.error("Please take an appointment");
				} else if (!isEmailAvailable) {
					notificationmsg
							.error("No email provided");
				}
			});
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