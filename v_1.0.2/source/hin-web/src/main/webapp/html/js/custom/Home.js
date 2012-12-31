/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Home(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Home";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var home = this;
	var userVo = null;
	/* Function definitions */

	function eventHandler(event) {
		// alert("inside login event handler: " + event.type);
		if (event.type == AppConstants.Event.HOME_PAGE_BIND_EVENTS) {
			userVo = renderingEngine.getComponent("Context").getUserVo();
			// renderingEngine.loadHeaderInfo("Home",userVo.userName);
			// var topHeight = $('.ui-left-top').css('height');
			var hHeight = $(window).height() + 10;
			// alert(hHeight);
			$('.loginscreen').css('height', hHeight);
			$('#home-data').css('margin-top', hHeight - 450);

			$("#welcome").html('');
			$("#user_role").html('');
			$("#welcome").append("Welcome " + userVo.userName);
			$("#user_role").append("you are logged on as ");
			$.each(userVo.roles, function(key, value) {
				if (key == 0) {
					$("#user_role").append(
							value.charAt(0).toUpperCase() + value.slice(1));
				} else if (key > 0) {
					$("#user_role").append(
							", " + value.charAt(0).toUpperCase()
									+ value.slice(1));
				}
				
				if(value == 'PATIENT'){
					$('#patientCalendarIcon').css("display", "block");
					$('#productsIcon').css("display", "block");
					$('#messagesIcon').css("display", "block");
					$('#documentsIcon').css("display", "block");
					$('#resultsIcon').css("display", "block");
				}
				
			});

			$.each(userVo.privileges, function(key, value) {
				$('#' + value.toLowerCase() + "Icon").css("display", "block");
			});
			bindEvents();
			$('#logout').live(
					'click',
					function(event) {
						/*
						 * renderingEngine.clearHeaderInfo(); renderingEngine
						 * .fireEvent(AppConstants.Event.LOGIN_PAGE_INITIALIZED);
						 */
						renderingEngine.getComponent("DataLayer")
								.removeCachedLoginInfo("loginInfo");
						window.location.href = "/hin-web/html/";
					});

		} else if (event.type == AppConstants.Event.HOME_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.HOME_PAGE_ERROR) {

		} else if (event.type == AppConstants.Event.HOME_PAGE_FILL_DATA) {

		}

	}
	;

	function loadUI() {
		renderingEngine.loadPage("pages/home/home.html", "form",
				AppConstants.Event.HOME_PAGE_BIND_EVENTS);

	}
	;

	function bindEvents() {
		// userVo.privileges.push("licensee");
		/*
		 * renderingEngine.setHeaderInfo("", userVo.userName + " - " +
		 * userVo.roles + " at Eternity Medical Institute");
		 */
		var orgnizationName = renderingEngine.getComponent("Context")
				.getOrganizationVO().name;
		if (orgnizationName) {
			renderingEngine.setHeaderInfo("", userVo.userName + " - "
					+ userVo.roles + " " + "at" + " " + orgnizationName);
		} else {
			renderingEngine.setHeaderInfo("", userVo.userName + " - "
					+ userVo.roles);
		}

		// alert("userVo.privileges :"+userVo.privileges);

		renderingEngine.iconChange();

		if (userVo.privileges) {
			$.each(userVo.privileges, function(key, value) {
				var id = value.toLowerCase() + "Icon";
				if (id == "profileIcon") {
					$('#profileIcon').unbind("click", loadUserHome);
					$('#profileIcon').bind("click", loadUserHome);
				} else if (id == "patientsIcon") {
					$('#patientsIcon').unbind("click", loadPatientHome);
					$('#patientsIcon').bind("click", loadPatientHome);
				} else if (id == "calendarIcon") {
					$('#calendarIcon').find('div').unbind("click",
							loadCalendarHome);
					$('#calendarIcon').find('div').bind("click",
							loadCalendarHome);
				} else if (id == "archiveIcon") {
					$('#archiveIcon').unbind("click", loadArchiveHome);
					$('#archiveIcon').bind("click", loadArchiveHome);
				} else if (id == "statisticsIcon") {
					$('#statisticsIcon').unbind("click", loadStatisticsHome);
					$('#statisticsIcon').bind("click", loadStatisticsHome);
				} else if (id == "libraryIcon") {
					$('#libraryIcon').unbind("click", connectLibrary);
					$('#libraryIcon').bind("click", connectLibrary);
				} else if (id == "administrationIcon") {
					$('#administrationIcon').unbind("click",
							loadAdministrationHome);
					$('#administrationIcon').bind("click",
							loadAdministrationHome);
				} else if (id == "licenseesIcon") {
					$('#licenseesIcon').unbind("click", loadLicenseeHome);
					$('#licenseesIcon').bind("click", loadLicenseeHome);
				}
			});
			/*$('#profileIcon').unbind("click", loadUserHome);
			$('#profileIcon').bind("click", loadUserHome);

			$('#documentsIcon').unbind("click", loadDocumentHome);
			$('#documentsIcon').bind("click", loadDocumentHome);

			$('#productsIcon').unbind("click", loadProductHome);
			$('#productsIcon').bind("click", loadProductHome);

			$('#documentsIcon').unbind("click", loadDocumentHome);
			$('#documentsIcon').bind("click", loadDocumentHome);

			$('#administrationIcon').unbind("click", loadAdministrationHome);
			$('#administrationIcon').bind("click", loadAdministrationHome);

			$('#messagesIcon').unbind("click", loadMessagesHome);
			$('#messagesIcon').bind("click", loadMessagesHome);

			$('#resultsIcon').unbind("click", loadChartsHome);
			$('#resultsIcon').bind("click", loadChartsHome);*/
			
			
			$('#roleDefinitionIcon').unbind("click", loadRoleDefinitionHome);
			$('#roleDefinitionIcon').bind("click", loadRoleDefinitionHome);
		}
		
		$.each(userVo.roles, function(key, value) {
			if(value == 'PATIENT'){
				//var id = value.toLowerCase() + "Icon";
				//if (id == "patientCalendarIcon") {
					$('#patientCalendarIcon').unbind("click", loadPatientCalendarHome);
					$('#patientCalendarIcon').bind("click", loadPatientCalendarHome);
				//} else if (id == "productsIcon") {
					$('#productsIcon').unbind("click", loadProductHome);
					$('#productsIcon').bind("click", loadProductHome);
				//}else if (id == "messagesIcon") {
					$('#messagesIcon').unbind("click", loadMessagesHome);
					$('#messagesIcon').bind("click", loadMessagesHome);
				//}else if (id == "documentsIcon") {
					$('#documentsIcon').unbind("click", loadDocumentHome);
					$('#documentsIcon').bind("click", loadDocumentHome);
				//}else if (id == "resultsIcon") {
					$('#resultsIcon').unbind("click", loadChartsHome);
					$('#resultsIcon').bind("click", loadChartsHome);
				//}
			}
		});

		$('.settings').unbind("click", loadSettingsHome);
		$('.settings').bind("click", loadSettingsHome);

	}
	this.loadPatientCalendarHome = loadPatientCalendarHome;
	function loadPatientCalendarHome(){
			commonEvent("patientCalendar");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PATIENT_CALENDAR_PAGE_INITIALIZED, {},
					renderingEngine, home);
	};

	function administrationIcon() {
		commonEvent("administration");
		renderingEngine.fireEvent(AppConstants.Event.STAFF_PAGE_INITIALIZED);
	}
	;
	function loadAdministrationHome() {
		commonEvent("administration");
		renderingEngine.fireEvent(AppConstants.Event.STAFF_PAGE_INITIALIZED);
	}
	;

	this.loadLicenseeHome = loadLicenseeHome;
	function loadLicenseeHome() {
		commonEvent("licensees");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.LICENSEE_PAGE_INITIALIZED, {},
				renderingEngine, home);
	}
	;
	this.loadPatientHome = loadPatientHome;
	function loadPatientHome() {
		commonEvent("patients");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PATIENT_PAGE_INITIALIZED, {},
				renderingEngine, home);
	}
	;

	this.loadUserHome = loadUserHome;
	function loadUserHome() {
		commonEvent("user");
		/* loadProcess(); */
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.USER_PAGE_INITIALIZED, {}, renderingEngine,
				home);
	}
	;

	this.loadCalendarHome = loadCalendarHome;
	function loadCalendarHome() {
		commonEvent("calendar");
		renderingEngine
				.fireEvent(AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED);// CALENDAR_PAGE_INITIALIZED
	}
	;
	this.loadArchiveHome = loadArchiveHome;
	function loadArchiveHome() {
		commonEvent("archive");
		renderingEngine
				.fireEvent(AppConstants.Event.TEST_RESULTS_PAGE_INITIALIZED);
	}
	;
	this.loadStatisticsHome = loadStatisticsHome;
	function loadStatisticsHome() {
		commonEvent("statistics");
		renderingEngine
				.fireEvent(AppConstants.Event.STATISTICS_PAGE_INITIALIZED);
	}
	;

	function commonEvent(id) {
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.loadPage("pages/navigation/navigation.html",
				"navigation", AppConstants.Event.NAVIGATION_PAGE_BIND_EVENTS);
		renderingEngine.getComponent("Context").setNavigationId(id);
		// changeTextBold(id);
	}
	;

	// Function to connect Alfresco.
	function connectLibrary() {
		commonEvent("library");
		$('#left-side').removeClass("left-side-content left-side-bg");
		$('#form').removeClass("left-side-content");
		$('#left-side').css("width", "100%");
		$('#right').remove();
		renderingEngine.setFormName("Library");
		renderingEngine.loadPage("pages/library/template.html", "form", null);
	}
	;

	function changeTextBold(id) {
		for ( var index = 0; index < navigationList.length; index++) {
			if (navigationList[index] == id) {
				$("#" + navigationList[index]).css("font-weight", "bold");
			} else {
				$("#" + navigationList[index]).css("font-weight", "normal");
			}
		}
	}
	;

	this.loadSettingsHome = loadSettingsHome;
	function loadSettingsHome() {
		if ($('.settings').attr("pageOpen") == "SettingPage") {
			renderingEngine.fireEvent(AppConstants.Event.HOME_PAGE_INITIALIZED);
			$('.settings').attr("pageOpen", "HomePage");
		} else {
			commonEvent("settings");
			renderingEngine
					.fireEvent(AppConstants.Event.SETTINGS_PAGE_INITIALIZED);
			$('.settings').attr("pageOpen", "SettingPage");
		}
	}
	;
	this.loadDocumentHome = loadDocumentHome;
	function loadDocumentHome() {
		commonEvent("documents");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.DOCUMENT_PAGE_INITIALIZED,
				AppConstants.DocumentType.DOCUMENTS, renderingEngine, home);

	}
	;

	this.loadProductHome = loadProductHome;
	function loadProductHome() {
		commonEvent("products");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PRODUCTS_PAGE_INITIALIZED, {},
				renderingEngine, home);

	}
	;

	this.loadChartsHome = loadChartsHome;
	function loadChartsHome() {
		commonEvent("results");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.DOCUMENT_PAGE_INITIALIZED,
				AppConstants.DocumentType.RESULTS, renderingEngine, home);

	}
	;
	this.loadMessagesHome = loadMessagesHome;
	function loadMessagesHome() {
		commonEvent("messages");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.MESSAGES_PAGE_INITIALIZED,
				AppConstants.DocumentType.RESULTS, renderingEngine, home);

	}
	;
	this.loadRoleDefinitionHome = loadRoleDefinitionHome;
	function loadRoleDefinitionHome() {		
		commonEvent("roleDefinition");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.ROLEDEFINITION_PAGE_INITIALIZED, {},
				renderingEngine, home);
	}
	;

}
