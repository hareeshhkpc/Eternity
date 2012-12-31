/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function AppSchedule(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "AppSchedule";

	this.loadUI = loadUI;
	this.makeQuery = makeQuery;

	var renderingEngine = renderingEngine;
	var appSchedule = this;
	var appointmentSchedule = null;

	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var day = new Date().getDate();
	var data = null;

	/*
	 * var date = new Date(); var day = date.getDate(); var month =
	 * date.getMonth(); var y = date.getFullYear();
	 */
	/* Function definitions */

	function eventHandler(event) {
		//alert("inside login event handler: " + event.type);
		if (event.type == AppConstants.Event.APP_SCHEDULE_PAGE_FILL_DATA) {

		} else if (event.type == AppConstants.Event.APP_SCHEDULE_PAGE_BIND_EVENTS) {
			showCalendar();
			// loadCalendar();
		} else if (event.type == AppConstants.Event.APP_SCHEDULE_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.APP_SCHEDULE_PAGE_ERROR) {

		}
	}
	;

	function loadUI() {
		renderingEngine.getComponent("Context")
				.clearSelectedOrganizationVOContext();
		var organizationVO = renderingEngine.getComponent("Context")
				.getOrganizationVO();
		renderingEngine.getComponent("Context").setSelectedOrganizationVO(
				organizationVO);
		renderingEngine.showPageLoading("Loading app-schedule.html..");
		renderingEngine.loadPage("pages/appschedule/appschedule.html", "form",
				AppConstants.Event.APP_SCHEDULE_PAGE_BIND_EVENTS);
		/*
		 * renderingEngine.loadPage("pages/navigation/navigation.html",
		 * "navigation", AppConstants.Event.NAVIGATION_PAGE_BIND_EVENTS);
		 */
		// renderingEngine.setLeftHeaderInfo("Appointment Scheduled");
		renderingEngine.setFormName("Appointment Schedule");
	}
	;

	function showCalendar() {
		makeQuery();
		renderingEngine.showPageLoading("Loading Calender");
		appointmentSchedule = new HIN.AppointmentSchedule("appcalendar", false,
				function(appointmentVO) {
				});
		/*
		 * if(!appointmentSchedule){ appointmentSchedule= new
		 * HIN.AppointmentSchedule("appcalendar",null, function( appointmentVO) {
		 * }); }
		 */
		appointmentSchedule.loaded = false;
		appointmentSchedule.loadFullCalendar();// loadCalendar();
	}
	;

	function makeQuery() {
		var context = appController.getComponent("Context");
		if (context) {
			var subscriberId = context.getUserVo().subscriberId;
			context.setConsultant("");
			var queryString = "";// " 'effectiveTimeFrom' > '2012-07-08
									// 11:37:19:27'";
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			query.addCondition("PRPA_MT410001HT02", queryString);
			appController.getComponent("Context").setCalendarQuery(query);
			// alert(query);
		}
	}

}
