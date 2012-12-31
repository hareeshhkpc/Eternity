function WELCOME_BOOKING_FORM(message, appController, uiGenerator) {

	var thisObject = this;
	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

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
			var patientVO = appController.getComponent("Context").getPatientVO();
			var appointmentVO = appController.getComponent("Context").getAppointmentVO();
			if (patientVO) {
				var patientName = patientVO.name;
				var doctorName = null, lowTime = null, highTime = null, appointmentDate = null;
				
				if (appointmentVO) {
					doctorName = appointmentVO.doctor;
					lowTime = formatDate(appointmentVO.start, 'hh:mm:ss');
					appointmentDate = formatDate(appointmentVO.start, 'yyyy-MM-dd');
					highTime = formatDate(appointmentVO.end, 'hh:mm:ss');
					
				}

				/*var emailContent = '<table id="stage" style="width:100%;font-family:Calibri;margin:0 auto;"><tr><td style=""></td><td style="width:40%;">'
						+ '<img src="http://94.200.191.2/letter/Images/misc-eternitylogosmall.png" style="margin:0 auto;">'
						+ '</td><td></td></tr><tr><td></td><td colspan="2"></td></tr><tr><td style="width:20%"> <!--img src="http://94.200.191.2/letter/Images/Artwork-dna.png" /-->'
						+ '</td><td colspan="2" style="font-size:18px;padding:10px;line-height:28px;text-align:justify">Dear <span id="patientName"></span><br /><br />'
						+ 'Eternity Medicine Institute would like to remind you of your upcoming appointment:<br /><br /><span style="color:#56004e;font-weight:bold">Date:</span>'
						+ '<span id="appointmentDate"></span><br /><span style="color:#56004e;font-weight:bold">Time:</span> <span id="appointmentTime"></span><br />'
						+ '<span style="color:#56004e;font-weight:bold">Doctor:</span> <span id="doctorName"></span><br /><br />We look forward to seeing you soon, for your convenience please find attached our location map.<br /><br /><span style="color:#56004e;font-weight:bold">If this is your first appointment with Eternity Medicine Institute, please come to the appointment 12 hours fasting</span>; only drinking water. Refreshments will be provided upon completion of your blood draw.<br /><br />Also, Eternity Medicine Institute is a program based medical center and does not accept insurance. If you would like to claim your doctor consultation or blood tests, we kindly ask that you bring your claim form with you to your appointment. Our doctors will be happy to fill the medical visit information for you.<br /><br />For additional information or if you have any questions please don\'t hesitate to contact us:<br /><br /><img src="http://94.200.191.2/letter/Images/misc-contactinfo.png" /><br /><br />Yours in Health,<br /><br />Eternity Medicine Institute, Dubai</td></tr></table>';
*/
				
				var isEmailAvailable = patientVO.isEmailAvailable;
				var emailAddress = patientVO.emailAddress;
				
				var licenseeVO = appController.getComponent("Context")
						.getLicenseeVO();

				if (licenseeVO) {
					var emailContent = licenseeVO.emailContent;
					
					var patientNamePlaceHolder = "${PATIENT_NAME}";
					var appointmentNamePlaceHolder = "${APPOINTMETN_DATE}";
					var appointmentTimePlaceHolder = "${APPOINTMETN_TIME}";
					var doctorNamePlaceHolder = "${DOCTOR_NAME}";
					
					emailContent = emailContent.replace(patientNamePlaceHolder,patientName);
					emailContent = emailContent.replace(appointmentNamePlaceHolder,appointmentDate);
					emailContent = emailContent.replace(doctorNamePlaceHolder,doctorName);
					if (lowTime || highTime)
						emailContent = emailContent.replace(appointmentTimePlaceHolder,lowTime + " to " + highTime);

					$("#EDSpan").append(emailContent);
					
					/*$("#patientName").append(patientName + ",");
					$("#appointmentDate").append(appointmentDate);
					if (lowTime || highTime)
						$("#appointmentTime").append(
								lowTime + " to " + highTime);
					$("#doctorName").append(doctorName);*/

					$("#sendEmail").hover(
							function() {
								$('#sendEmail').removeClass('send-icon-link')
										.addClass('send-icon-link-hover');
							},
							function() {
								$('#sendEmail').removeClass(
										'send-icon-link-hover').addClass(
										'send-icon-link');
							});
					$('#sendEmail').live('click', function() {
										if (isEmailAvailable && appointmentVO) {

											$('#sendEmail').removeClass(
													'send-icon-link').addClass(
													'send-icon-link-onpress');
											$("#EDSpan").trigger("change");
											message = $("#EDSpan").html();

											appController
													.getComponent("DataLayer")
													.sendEmail(
															emailAddress,
															message,
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
										} else if (!appointmentVO) {
											notificationmsg
													.error("Please take an appointment");
										} else if (!isEmailAvailable) {
											notificationmsg
													.error("No email provided");
										}
									});

					$
							.each(
									licenseeVO.licenseeAttachmentName,
									function(key, value) {
										$("#attachment")
												.append(
														'<img src="images/attachment.png" style="float:left;"/><div style="width:15%;word-wrap: break-word;float:left;">'
																+ value
																+ '</div>');
									});

				}
			}

			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			page.pageResized();

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


