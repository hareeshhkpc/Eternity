/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Navigation(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Navigation";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var navigation = this;
	var navigationId = "";
	var navigationList = [];
	this.changeTextBold = changeTextBold;

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside navigation event handler: " + event.type);
		if (event.type == AppConstants.Event.NAVIGATION_PAGE_BIND_EVENTS) {
			// alert("inside navigation event handler: " + event.type);
			var userVo = renderingEngine.getComponent("Context").getUserVo();
			$('#home').css('display', 'inline')
			$.each(userVo.privileges, function(key, value) {
				$('#' + value.toLowerCase()).css("display", "inline");
			});
			
			$('#homeIcon').unbind("click", loadHomeIcon);
			$('#homeIcon').bind("click", loadHomeIcon);

			$('#home').unbind("click", loadHome);
			$('#home').bind("click", loadHome);

			if (userVo.privileges) {
				navigationList = [];
				$.each(userVo.privileges, function(key, value) {
					var id = value.toLowerCase();
					navigationList.push(id);
					if (id === "home") {
						$('#home').unbind("click", loadHome);
						$('#home').bind("click", loadHome);
					} else if (id === "patients") {
						$('#patients').unbind("click", loadPatientHome);
						$('#patients').bind("click", loadPatientHome);
					} else if (id === "calendar") {
						$('#calendar').unbind("click", loadCalendarHome);
						$('#calendar').bind("click", loadCalendarHome);
					} else if (id === "archive") {
						$('#archive').unbind("click", loadArchiveHome);
						$('#archive').bind("click", loadArchiveHome);
					} else if (id == "statistics") {
						$('#statistics').unbind("click", loadStatisticsHome);
						$('#statistics').bind("click", loadStatisticsHome);
					} else if (id === "library") {
						$('#library').unbind("click", loadLibraryHome);
						$('#library').bind("click", loadLibraryHome);
					} else if (id === "licensees") {
						$('#licensees').unbind("click", loadLicenseeHome);
						$('#licensees').bind("click", loadLicenseeHome);
					} else if (id === "documents") {
						$('#documents').unbind("click", loadDocumentHome);
						$('#documents').bind("click", loadDocumentHome);
					} else if (id === "messages") {
						$('#messages').unbind("click", loadMessagesHome);
						$('#messages').bind("click", loadMessagesHome);
					}
				});
				
				$('#messages').unbind("click", loadMessagesHome);
				$('#messages').bind("click", loadMessagesHome);
				navigationList.push("messages");
				
				$('#settings').unbind("click", loadSettingsHome);
				$('#settings').bind("click", loadSettingsHome);
			}
			changeTextBold(renderingEngine.getComponent("Context")
					.getNavigationId());
		}
	}

	function loadHomeIcon() {
		renderingEngine
				.fireEvent(AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT);
	}
	;
	this.loadHome = loadHome;
	function loadHome() {
		changeTextBold("home");
		 renderingEngine.getComponent("Context").clearContext();
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.HOME_PAGE_INITIALIZED, {}, renderingEngine,
				navigation);
	}
	;
	this.loadPatientHome = loadPatientHome;
	function loadPatientHome() {
		changeTextBold("patients");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PATIENT_PAGE_INITIALIZED, {},
				renderingEngine, navigation);
	}
	;
	this.loadLicenseeHome = loadLicenseeHome;
	function loadLicenseeHome() {
		changeTextBold("licensees");
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.LICENSEE_PAGE_INITIALIZED, {},
				renderingEngine, navigation);
	}
	;
	this.loadCalendarHome = loadCalendarHome;
	function loadCalendarHome() {
		changeTextBold("calendar");
		var searchVO = new HIN.SearchVO();
		searchVO.fromDate = new Date();
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.fireEvent(AppConstants.Event.CALENDAR_PAGE_INITIALIZED);
	}
	;
	this.loadArchiveHome = loadArchiveHome;
	function loadArchiveHome() {
		changeTextBold("archive");
		renderingEngine
				.fireEvent(AppConstants.Event.TEST_RESULTS_PAGE_INITIALIZED);
	}
	;
	this.loadStatisticsHome = loadStatisticsHome;
	function loadStatisticsHome() {
		changeTextBold("statistics");
		renderingEngine
				.fireEvent(AppConstants.Event.STATISTICS_PAGE_INITIALIZED);
	}
	;
	this.loadSettingsHome = loadSettingsHome;
	function loadSettingsHome() {
		changeTextBold("settings");
		renderingEngine.fireEvent(AppConstants.Event.SETTINGS_PAGE_INITIALIZED);
	}
	;
	
	this.loadDocumentHome = loadDocumentHome;
	function loadDocumentHome(){
		changeTextBold("documents");
		renderingEngine.fireEvent(AppConstants.Event.DOCUMENT_PAGE_INITIALIZED);
	}
	this.loadMessagesHome = loadMessagesHome;
	function loadMessagesHome(){
		changeTextBold("messages");
		renderingEngine.fireEvent(AppConstants.Event.MESSAGES_PAGE_INITIALIZED);
	}

	this.loadLibraryHome = loadLibraryHome;
	function loadLibraryHome() {
		changeTextBold("library");
		$('#left-side').removeClass("left-side-content left-side-bg");
		$('#form').removeClass("left-side-content");
		$('#left-side').css("width", "100%");
		$('#right').remove();
		renderingEngine.setFormName("Library");
		renderingEngine.loadPage("pages/library/template.html", "form", null);
	}
	;

	function changeTextBold(id) {
		var msgStr = id.charAt(0).toUpperCase() + id.substring(1, id.length);
		renderingEngine.setFormName(msgStr);
		renderingEngine.showPageLoading("Preparing " + msgStr + " UI.");
		for ( var index = 0; index < navigationList.length; index++) {
			if (navigationList[index] == id) {
				$("#" + navigationList[index]).css("font-weight", "bold");
			} else {
				$("#" + navigationList[index]).css("font-weight", "normal");
			}
		}
	}
	;

	function loadUI() {

	}
	;

}
