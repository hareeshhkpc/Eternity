/**
 * Staff is a child component of Rendering Engine which is used to register a
 * Staff for an organization
 */

function Staff(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Staff";

	this.loadUI = loadUI;
	this.renderingEngine = renderingEngine;
	var staff = this;

	var userProcesses = [];

	this.loadLicenseeHomeIcon = loadLicenseeHomeIcon;

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside staff event handler: " + event.type);
		if (event.type == AppConstants.Event.STAFF_HOME_PAGE_LOAD_EVENT) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			appController.getComponent("RenderingEngine").showPageLoading(
					"Fetching Staff data");

			var subscriberId = searchVO.id;
			if (!subscriberId) {
				var staffVO = renderingEngine.getComponent("Context")
						.getStaffVo();
				if (staffVO)
					subscriberId = staffVO.subscriberId;
			}
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.STAFF_HOME_PAGE_FETCH_DATA,
					subscriberId, renderingEngine, staff);

		} else if (event.type == AppConstants.Event.STAFF_HOME_PAGE_FILL_DATA) {
			renderingEngine.getComponent("Context").clearSearchContext();
			var staffVO = renderingEngine.getComponent("Context").getStaffVo();
			var subscriberId = staffVO.subscriberId;
			userProcesses = renderingEngine.getComponent("DataLayer")
					.getUserProcesses(subscriberId);
			/* renderingEngine.getComponent("Context").setStaff(subscriberId); */
			loadHomeUI();
		} else if (event.type == AppConstants.Event.STAFF_HOME_PAGE_BIND_EVENT) {

			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('staff-home-bg');

			bindHomeEvents();
		}
	}
	;

	function loadUI() {
		/**
		 * set searchVO.
		 */
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if (!searchVO)
			searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.STAFF_PROFILE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "employee";
		searchVO.messageType = "PRPA_MT201000HT03";
		searchVO.placeHolder = "Staff Search"
		renderingEngine.getComponent("Context").setSearchVO(searchVO);

		staff.renderingEngine
				.loadPage(
						"pages/search/search.html",
						"search",
						AppConstants.Event.SEARCH_PAGE_BIND_EVENTS,
						function() {
							var selectedOrganizationVO = appController
									.getComponent("Context")
									.getSelectedOrganizationVO();
							if (selectedOrganizationVO) {
								var organizationId = selectedOrganizationVO.subscriberId;
								if (organizationId) {
									//alert(organizationId);
									$('#staffLicenseeHomeIcon').show();
									$('#staffLicenseeHomeIcon').unbind("click",
											staff.loadLicenseeHomeIcon);
									$('#staffLicenseeHomeIcon').bind("click",
											staff.loadLicenseeHomeIcon);
									$("#staffLicenseeHomeIcon")
											.hover(
													function() {
														$(
																'#staffLicenseeHomeIcon')
																.removeClass(
																		'home-icon-link')
																.addClass(
																		'home-icon-link-hover');
													},
													function() {
														$(
																'#staffLicenseeHomeIcon')
																.removeClass(
																		'home-icon-link-hover')
																.addClass(
																		'home-icon-link');
													});
								}
							}
						});
		loadStaffNavigationLine("Staffs");
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.registerClickEvent('newStaff', loadProcess);
		// alert(screen.height);

		// alert(screen.height);
		$('.left-side-content').css('height', '525px');
		renderingEngine.closeModalDialog();
		// loadHomeUI();
	}
	;

	function loadHomeUI() {
		// alert("loadHomeUI");
		renderingEngine.showPageLoading("Binding home page");
		renderingEngine.loadPage("pages/staff/home.html", "form",
				AppConstants.Event.STAFF_HOME_PAGE_BIND_EVENT);
		$('.left-side-content').css('height', '525px');
		$('.right-side-content').css('height', '525px');
		$('.ui-left-top').css('height', '450px');

	}
	;
	function bindHomeEvents() {
		var staffVO = renderingEngine.getComponent("Context").getStaffVo();
		renderingEngine.setLeftHeaderInfo(staffVO.name);
		loadStaffNavigationLine("Staffs");
		loadStaffHomeNavigationLine("Staff Home");
		$('#staffLicenseeHomeIcon').show();
		var processId = 0;
		var processName = null;

		if (userProcesses) {
			for ( var index = 0; index < userProcesses.length; index++) {
				var staffProcess = userProcesses[index];

				var count = staffProcess.count();
				/*
				 * if (staffProcess.processName == "Profile") { processName =
				 * staffProcess.processName; processId =
				 * staffProcess.processIds[0]; $('#profile').attr("processId",
				 * processId); } else
				 */
				if (staffProcess.processName == "StaffRegistration") {
					processName = staffProcess.processName;
					processId = staffProcess.processIds[0];
					$('#profile').attr("processId", processId);
				}
			}
		}
		$('#profile').unbind("click", loadProcess);
		$('#profile').bind("click", loadProcess);
		renderingEngine.closeModalDialog();
	}
	;

	function loadProcess() {
		var leftHeaderInfo = $(this).attr("leftHeaderInfo");
		var formName = $(this).attr("formName");
		var processName = $(this).attr("processName");
		var processId = $(this).attr("processId");
		if (this.id == "newStaff") {
			loadStaffNavigationLine("Staffs");
			leftHeaderInfo = "New Staff";
		}
		if (leftHeaderInfo)
			renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
		renderingEngine.setFormName(formName);
		renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
					processName : processName,
					type : "NewProcess",
					processId : processId
				}, renderingEngine, staff);
		$('#staffLicenseeHomeIcon').hide();
	}
	;
	function loadAppointments() {
		renderingEngine
				.fireEvent(AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED);
	}
	
	function loadStaffsHome(){
		renderingEngine.openModalDialog("Staffs page loading");
		renderingEngine.slideLeft();
		staff.renderingEngine
		.fireEvent(AppConstants.Event.STAFF_PAGE_INITIALIZED);
	}
	;

	function loadStaffHome() {
		renderingEngine.openModalDialog("Staff home page loading");
		renderingEngine.slideLeft();
		renderingEngine
				.fireEvent(AppConstants.Event.STAFF_HOME_PAGE_LOAD_EVENT);
	}
	;
	function loadLicenseeHomeIcon() {
		//alert("loadLicenseeHomeIcon");
		/*
		 * staff.renderingEngine.getEventQueue().postEvent(
		 * AppConstants.Event.LICENSEE_PAGE_INITIALIZED, {},
		 * staff.renderingEngine, staff);
		 */
		staff.renderingEngine
				.fireEvent(AppConstants.Event.LICENSEE_PAGE_INITIALIZED);
	}
	;

	function loadStaffHomeNavigationLine(navigationName) {
		renderingEngine.getUIDimensions();
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine.setNavigationLine(navigationName);
		$('#' + navigationLineId).unbind("click", loadStaffHome);
		$('#' + navigationLineId).bind("click", loadStaffHome);
	}
	;
	
	function loadStaffNavigationLine(navigationName){
		renderingEngine.getUIDimensions();
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine.setNavigationLine(navigationName);
		$('#' + navigationLineId).unbind("click", loadStaffsHome);
		$('#' + navigationLineId).bind("click", loadStaffsHome);
	}
	;
}
