/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function User(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "User";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var user = this;

	var userProcesses = [];

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside user event handler: " + event.type);
		if (event.type == AppConstants.Event.USER_HOME_PAGE_LOAD_EVENT) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			appController.getComponent("RenderingEngine").showPageLoading(
					"Fetching User data");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.USER_HOME_PAGE_FETCH_DATA, searchVO.id,
					renderingEngine, user);

		} else if (event.type == AppConstants.Event.USER_HOME_PAGE_FILL_DATA) {
			renderingEngine.getComponent("Context").clearSearchContext();
			var staffVO = renderingEngine.getComponent("Context").getStaffVo();
			var subscriberId = staffVO.subscriberId;
			userProcesses = renderingEngine.getComponent("DataLayer")
					.getUserProcesses(subscriberId);
			/* renderingEngine.getComponent("Context").setStaff(subscriberId); */
			loadHomeUI();
		} else if (event.type == AppConstants.Event.USER_HOME_PAGE_BIND_EVENT) {

			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('user-home-bg');

			bindHomeEvents();
		} else if (event.type == AppConstants.Event.ON_ENTITY_STATE_CHANGE) {
			checkinState(event.data.result.statevalue);
			/*
			 * renderingEngine.getEventQueue().postEvent(
			 * AppConstants.Event.PATIENT_PAGE_INITIALIZED, {}, renderingEngine,
			 * user);
			 */

			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.FETCH_CHECKEDIN_PATIENTS, {},
					renderingEngine, user);

		} else if (event.type == AppConstants.Event.PATIENT_PAGE_BIND_EVENT) {

		} else if (event.type == AppConstants.Event.PATIENT_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.PATIENT_PAGE_ERROR) {

		} else if (event.type == AppConstants.Event.PATIENT_PAGE_FILL_DATA) {

		} else if (event.type == AppConstants.Event.PATIENT_PAGE_LOAD_EVENT) {

		}
		/*
		 * else if (event.type ==
		 * AppConstants.Event.PATIENT_WORK_FLOW_PAGE_BIND_EVENT) {
		 * 
		 * $('.registration') .live( 'click', function(event) {
		 * 
		 * renderingEngine .fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		 * renderingEngine .setFormName("New Patient Registration");
		 * renderingEngine.getChildComponent("Form")
		 * .setMessageType("PRPA_IN203000HT04");
		 * alert(renderingEngine.getChildComponent("Form") .getMessageType());
		 * renderingEngine .fireEvent(AppConstants.Event.FORM_PAGE_INITIALIZED);
		 * }); }
		 */
	}
	;

	function loadUI() {
		/**
		 * set searchVO.
		 */
		/*
		 * var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		 * if (!searchVO) searchVO = new HIN.SearchVO(); searchVO.type =
		 * AppConstants.SearchType.STAFF_PROFILE_SEARCH; searchVO.serverURI =
		 * "/hin-web/rest/search/entitySearchWithCondtion"; searchVO.role =
		 * "employee"; searchVO.messageType = "PRPA_MT201000HT03";
		 * renderingEngine.getComponent("Context").setSearchVO(searchVO);
		 * 
		 * renderingEngine.loadPage("pages/search/search.html", "search",
		 * AppConstants.Event.SEARCH_PAGE_BIND_EVENTS);
		 * renderingEngine.setLeftHeaderInfo("");
		 * renderingEngine.registerClickEvent('newUser', loadProcess);
		 */
		// alert(screen.height);
		// alert(screen.height);
		$('.left-side-content').css('height', '525px');
		//$('.right-side-content').css('display', 'none');
		

		loadHomeUI();
	}
	;

	;
	function loadHomeUI() {
		// alert("loadHomeUI");
		renderingEngine.showPageLoading("Binding home page");
		renderingEngine.loadPage("pages/user/home.html", "form",
				AppConstants.Event.USER_HOME_PAGE_BIND_EVENT);
		$('.left-side-content').css('height', '525px');
		$('.right-side-content').css('height', '525px');
		$('.ui-left-top').css('height', '450px');

	}
	;
	function bindHomeEvents() {
		loadProcess();

		renderingEngine.hidePageLoading();
	}
	;

	/*
	 * function loadProcess() {
	 * 
	 * var leftHeaderInfo = $(this).attr("leftHeaderInfo"); var formName =
	 * $(this).attr("formName"); var processName = $(this).attr("processName");
	 * var processId = $(this).attr("processId"); if (this.id == "newUser")
	 * leftHeaderInfo = "New User"; if (leftHeaderInfo)
	 * renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
	 * renderingEngine.setFormName(formName);
	 * renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
	 * renderingEngine.getEventQueue().postEvent(
	 * AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, { processName : processName,
	 * type : "NewProcess", processId : processId }, renderingEngine, user); } ;
	 */
	function entityStateChanged() {
		var stateValue = $(this).attr("state");
		var patientId = renderingEngine.getComponent("Context").getPatient();
		var date = new Date();
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var hour = date.getHours();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var year = date.getFullYear()
		var currentTime = year + "/" + month + "/" + day + " " + hour + ":"
				+ min + ":" + sec;
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.ENTITY_STATE_CHANGE, {
					entityid : patientId,
					state : "checkedin",
					statevalue : stateValue,
					time : currentTime
				}, renderingEngine, user);

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

	function loadProcess() {
		// alert("loadProcess");
		var userVo = renderingEngine.getComponent("Context").getUserVo();
		var leftHeaderInfo = "My Profile";// $(this).attr("leftHeaderInfo");
		var formName = "Profile";// $(this).attr("formName");
		var processName = "Profile";// $(this).attr("processName");
		var processId = userVo.profileProcessInstanceID;// $(this).attr("processId");
		//alert("loadProcess : " + processId);
		if (leftHeaderInfo)
			renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
		renderingEngine.setFormName(formName);
		renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
					processName : processName,
					type : "NewProcess",
					processId : processId
				}, renderingEngine, user);
	}
	;
	/*
	 * function loadProcess() { renderingEngine.setLeftHeaderInfo("New
	 * Patient"); renderingEngine.setFormName("Patient Registration");
	 * renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
	 * renderingEngine.getEventQueue().postEvent(
	 * AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, { processName :
	 * "PatientRegistration", type : "NewProcess" }, renderingEngine, user); } ;
	 */

	// PatientRegistration"//AgeManagementProgram"//Monitor"//DemographicsAndBackground"//"Accounts"
}
