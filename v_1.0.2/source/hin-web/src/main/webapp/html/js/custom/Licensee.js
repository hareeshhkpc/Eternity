/**
 * Licensee is a child component of Rendering Engine which is used to register
 * organizations
 */

function Licensee(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Licensee";

	this.loadUI = loadUI;
	this.renderingEngine = renderingEngine;
	var licensee = this;

	var userProcesses = [];

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside licensee event handler: " + event.type);
		if (event.type == AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			appController.getComponent("RenderingEngine").showPageLoading(
					"Fetching Licensee data");
			var subscriberId = searchVO.id;
			if (!subscriberId) {
				var selectedOrganizationVO = renderingEngine.getComponent(
						"Context").getSelectedOrganizationVO();
				if (selectedOrganizationVO) {
					subscriberId = selectedOrganizationVO.subscriberId;
				}

				/*
				 * var selectedOrganizationVO = new selectedOrganizationVO();
				 * selectedOrganizationVO.subscriberId=subscriberId;
				 * renderingEngine.getComponent("Context").setSelectedOrganizationVO(selectedOrganizationVO);
				 */
			}
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.LICENSEE_HOME_PAGE_FETCH_DATA,
					subscriberId, renderingEngine, licensee);

		} else if (event.type == AppConstants.Event.LICENSEE_HOME_PAGE_FILL_DATA) {
			renderingEngine.getComponent("Context").clearSearchContext();
			var selectedOrganizationVO = renderingEngine
					.getComponent("Context").getSelectedOrganizationVO();
			var subscriberId = selectedOrganizationVO.subscriberId;
			loadLicenseeNavigationLine(selectedOrganizationVO.name + " Home");
			userProcesses = renderingEngine.getComponent("DataLayer")
					.getUserProcesses(subscriberId);
			/* renderingEngine.getComponent("Context").setOrganization(subscriberId); */
			loadHomeUI();
		} else if (event.type == AppConstants.Event.LICENSEE_HOME_PAGE_BIND_EVENT) {

			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('licensee-home-bg');

			bindHomeEvents();
		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_BIND_EVENT) {

		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_ERROR) {

		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_FILL_DATA) {

		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_LOAD_EVENT) {

		}
	}
	;

	function loadUI() {
		/**
		 * set searchVO.
		 */
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);
		
		renderingEngine.getComponent("Context").clearSearchContext();
		renderingEngine.getComponent("Context")
				.clearSelectedOrganizationVOContext();
		renderingEngine.getChildComponent("NavigationLine")
				.removeNavigationLine();
		var organizationVO = renderingEngine.getComponent("Context")
				.getOrganizationVO();
		renderingEngine.getComponent("Context").setSelectedOrganizationVO(
				organizationVO);
		
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();// new
		if (!searchVO)
			searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.LICENSEE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/licenseeSearch";
		searchVO.role = "licensee";
		searchVO.messageType = "COCT_MT150000HT04";
		searchVO.placeHolder = "Licensee Search";
		renderingEngine.getComponent("Context").setSearchVO(searchVO);

		licensee.renderingEngine
				.loadPage(
						"pages/search/search.html",
						"search",
						AppConstants.Event.SEARCH_PAGE_BIND_EVENTS,
						function() {
							var selectedOrganizationVO = appController
									.getComponent("Context")
									.getSelectedOrganizationVO();
							if (selectedOrganizationVO) {
								var searchVO = licensee.renderingEngine
										.getComponent("Context").getSearchVO();// new
								if (searchVO) {
									searchVO.id = selectedOrganizationVO.subscriberId;
								}

								// alert("id :" + searchVO.id);
								var subscriberId = searchVO.id;
								if (subscriberId) {
									// alert("licensee : " + subscriberId);

									renderingEngine
											.fireEvent(AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT);
									/*
									 * licensee.renderingEngine .getEventQueue()
									 * .postEvent(
									 * AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT,
									 * {}, licensee.renderingEngine, licensee);
									 */
								}
							}
						});
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.registerClickEvent('newLicensee', loadProcess);
		// alert(screen.height);

		// alert(screen.height);
		/* $('.left-side-content').css('height', '525px'); */

		// loadHomeUI();
	}
	;

	;
	function loadHomeUI() {
		// alert("loadHomeUI");
		renderingEngine.showPageLoading("Binding home page");
		renderingEngine.loadPage("pages/licensee/home.html", "form",
				AppConstants.Event.LICENSEE_HOME_PAGE_BIND_EVENT);

		/*
		 * $('.left-side-content').css('height', '525px');
		 * $('.right-side-content').css('height', '525px');
		 * $('.ui-left-top').css('height', '450px');
		 * $('#mcs_container').css('height', '394px');
		 * $(".dragger_container").css('height', '390px');
		 * renderingEngine.getChildComponent("Search").mCustomScrollbars();
		 */
	}
	;

	function bindHomeEvents() {
		var selectedOrganizationVO = renderingEngine.getComponent("Context")
				.getSelectedOrganizationVO();
		renderingEngine.setLeftHeaderInfo(selectedOrganizationVO.name);
		var processId = 0;
		var processName = null;

		if (userProcesses) {
			for ( var index = 0; index < userProcesses.length; index++) {
				var userProcess = userProcesses[index];

				var count = userProcess.count();
				if (userProcess.processName == "Administration") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#administration').attr("processId", processId);
				}

				if (userProcess.processName == "Account") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#account').attr("processId", processId);
				}
				if (userProcess.processName == "Staff") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#staff').attr("processId", processId);
				}
				if (userProcess.processName == "Products") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#products').attr("processId", processId);
				}
				if (userProcess.processName == "LicenseeRegistration") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#profile').attr("processId", processId);
				}
			}
			renderingEngine.closeModalDialog();
		}

		renderingEngine.iconChange();
		$('#administration').unbind("click", loadProcess);
		$('#administration').bind("click", loadProcess);

		$('#account').unbind("click", loadProcess);
		$('#account').bind("click", loadProcess);

		$('#staff').unbind("click", loadProcess);
		$('#staff').bind("click", loadProcess);

		$('#products').unbind("click", loadProcess);
		$('#products').bind("click", loadProcess);

		$('#profile').unbind("click", loadProcess);
		$('#profile').bind("click", loadProcess);

		renderingEngine.hidePageLoading();
	}
	;

	function loadProcess() {

		var leftHeaderInfo = $(this).attr("leftHeaderInfo");
		var formName = $(this).attr("formName");
		var processName = $(this).attr("processName");
		var processId = $(this).attr("processId");
		if (this.id == "newLicensee") {
			renderingEngine.getComponent("Context").clearNavigationMap();
			leftHeaderInfo = "New Licensee";
		}
		if (formName == "Staff") {
			renderingEngine
					.fireEvent(AppConstants.Event.STAFF_PAGE_INITIALIZED);
		} else {

			if (leftHeaderInfo)
				renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
			renderingEngine.setFormName(formName);
			renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
						processName : processName,
						type : "NewProcess",
						processId : processId
					}, renderingEngine, licensee);
		}
	}
	;

	this.loadLicenseeHome = loadLicenseeHome;
	function loadLicenseeHome() {
		renderingEngine.openModalDialog("Licensee home page loading");
		renderingEngine.slideLeft();
		renderingEngine.fireEvent(AppConstants.Event.LICENSEE_PAGE_INITIALIZED);
	}
	;

	function loadLicenseeNavigationLine(navigationName) {
		renderingEngine.getUIDimensions();
		renderingEngine.getComponent("Context").clearNavigationMap();
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine.setNavigationLine(navigationName);
		$('#' + navigationLineId).unbind("click", loadLicenseeHome);
		$('#' + navigationLineId).bind("click", loadLicenseeHome);
	}
	;
}
