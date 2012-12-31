/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function AppCalendar(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "AppCalendar";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var appcalendar = this;

	var userProcesses = [];

	/* Function definitions */

	function eventHandler(event) {
		/*
		if (event.type == AppConstants.Event.CALENDAR_HOME_PAGE_LOAD_EVENT) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			appController.getComponent("RenderingEngine").showPageLoading("Fetching AppCalendar data");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.CALENDAR_HOME_PAGE_FETCH_DATA,
					searchVO.id, renderingEngine, appcalendar);

		} else if (event.type == AppConstants.Event.CALENDAR_HOME_PAGE_FILL_DATA) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			var userId = searchVO.id;
			userProcesses = renderingEngine.getComponent("DataLayer")
					.getUserProcesses(userId);
			renderingEngine.getComponent("Context").setPatient(userId);
			loadHomeUI();
		} else if (event.type == AppConstants.Event.CALENDAR_HOME_PAGE_BIND_EVENT) {

			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('appcalendar-home-bg');

			bindHomeEvents();
		} else if (event.type == AppConstants.Event.ON_ENTITY_STATE_CHANGE) {
			checkinState(event.data.result.statevalue);

			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.FETCH_CHECKEDIN_PATIENTS, {},
					renderingEngine, appcalendar);

		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_BIND_EVENT) {

		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_ERROR) {

		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_FILL_DATA) {

		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_LOAD_EVENT) {

		}
		*/
	}
	;

	function loadUI() {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if(!searchVO)
			searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.CALENDAR_SEARCH;// "profilesearch";
		//searchVO.serverURI = "/hin-web/rest/search/patientsearch";
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.getChildComponent("NavigationLine").removeNavigationLine();
		renderingEngine.loadPage("pages/search/search.html", "search",
				AppConstants.Event.SEARCH_PAGE_BIND_EVENTS);
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.registerClickEvent('weekCalendar', loadCalendar);
		renderingEngine.registerClickEvent('monthCalendar', loadCalendar);
		$('.left-side-content').css('height', '525px');
	
	}
	;
	
	function loadHomeUI() {
		// alert("loadHomeUI");
		renderingEngine.showPageLoading("Binding home page");
		renderingEngine.loadPage("pages/appcalendar/home.html", "form",
				AppConstants.Event.CALENDAR_HOME_PAGE_BIND_EVENT);
		
		$('.left-side-content').css('height', '525px');
		$('.right-side-content').css('height', '525px');
		$('.ui-left-top').css('height', '450px');
		$('#mcs_container').css('height', '394px');
		$(".dragger_container").css('height','390px');
		renderingEngine.getChildComponent("Search").mCustomScrollbars();
	}
	;
	
	function loadCalendar(data){
		var text = $(this).find("span.ui-btn-text").text();
		renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.CALENDAR_PAGE_FILL_DATA,
					{day:text.toUpperCase()}, renderingEngine, appcalendar);	
			
	};
	
	function loadProcess() {

		var leftHeaderInfo = $(this).attr("leftHeaderInfo");
		var formName = $(this).attr("formName");
		var processName = $(this).attr("processName");
		var processId = $(this).attr("processId");
		if (this.id == "newPatient")
			leftHeaderInfo = "New AppCalendar";
		if (leftHeaderInfo)
			renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
		renderingEngine.setFormName(formName);
		renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
					processName : processName,
					type : "NewProcess",
					processId : processId
				}, renderingEngine, appcalendar);
	}
	;
	function entityStateChanged() {
		var stateValue = $(this).attr("state");
		var appcalendarId = renderingEngine.getComponent("Context").getPatient();
		var date = new Date();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var hour = date.getHours();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var year = date.getFullYear()
		var currentTime = year+"/"+month+"/"+day+" "+hour+":"+min+":"+sec;
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.ENTITY_STATE_CHANGE, {
					entityid : appcalendarId,
					state : "checkedin",
					statevalue : stateValue,
					time:currentTime
				}, renderingEngine, appcalendar);

	}
	function checkinState(checkinstate) {
		if (checkinstate == "false") {
			$('#checkin').show();
			$('#checkout').hide();
		} else {
			$('#checkin').hide();
			$('#checkout').show();
		}
	}
	function loadAppointments() {
		renderingEngine
				.fireEvent(AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED);
	}
	/*
	 * function loadProcess() { renderingEngine.setLeftHeaderInfo("New
	 * AppCalendar"); renderingEngine.setFormName("AppCalendar Registration");
	 * renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
	 * renderingEngine.getEventQueue().postEvent(
	 * AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, { processName :
	 * "PatientRegistration", type : "NewProcess" }, renderingEngine, appcalendar); } ;
	 */

	// PatientRegistration"//AgeManagementProgram"//Monitor"//DemographicsAndBackground"//"Accounts"
}
