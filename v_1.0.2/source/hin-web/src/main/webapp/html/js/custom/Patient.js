/**
 * Patient is a child component of Rendering Engine which displays the patient
 * home page to user and sends same information to rendering engine for further
 * processing.
 */

function Patient(renderingEngine) {

	/**
	 * Handles the events from components
	 * 
	 * @param event
	 */
	this.eventHandler = eventHandler;
	this.className = "Patient";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var patient = this;
	/**
	 * userProcesses holds the process information against the patient
	 */
	var userProcesses = [];

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside patient event handler: " + event.type);

		/*
		 * renderingEngine.getEventQueue().postEvent(AppConstants.Event.RESIZE,
		 * {}, renderingEngine, patient);
		 */
		if (event.type == AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT) {
			// alert("inside patient event handler: " + event.type);
			var subscriberId = null;
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			appController.getComponent("RenderingEngine").showPageLoading(
					"Fetching Patient data");
			if (searchVO)
				subscriberId = searchVO.id;

			if (!subscriberId) {
				var patientVO = renderingEngine.getComponent("Context")
						.getPatientVO();
				if (patientVO)
					subscriberId = patientVO.subscriberId;

			}

			if (subscriberId) {
				loadPatientNavigationLine();
				// alert("subscriberId : " + subscriberId);
				renderingEngine.getEventQueue().postEvent(
						AppConstants.Event.PATIENT_HOME_PAGE_FETCH_DATA,
						subscriberId, renderingEngine, patient);
			}

		} else if (event.type == AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA) {
			renderingEngine.getComponent("Context").clearSearchContext();
			var patientVO = renderingEngine.getComponent("Context")
					.getPatientVO();
			var subscriberId = patientVO.subscriberId;
			userProcesses = renderingEngine.getComponent("DataLayer")
					.getUserProcesses(subscriberId);
			// renderingEngine.getComponent("Context").setPatient(subscriberId);
			loadHomeUI();
		} else if (event.type == AppConstants.Event.PATIENT_HOME_PAGE_BIND_EVENT) {

			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('patient-home-bg');

			bindHomeEvents();
		} else if (event.type == AppConstants.Event.ON_ENTITY_STATE_CHANGE) {
			changeCheckinState(event.data.result);

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

	/**
	 * Load the html page and bind the ui events.
	 */
	function loadUI() {
		/*
		 * set searchVO.
		 */
		renderingEngine.getComponent("Context").clearSearchContext();
		renderingEngine.getComponent("Context")
				.clearSelectedOrganizationVOContext();
		renderingEngine.getChildComponent("NavigationLine")
				.removeNavigationLine();
		var organizationVO = renderingEngine.getComponent("Context")
				.getOrganizationVO();
		renderingEngine.getComponent("Context").setSelectedOrganizationVO(
				organizationVO);

		var searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.PATIENT_PROFILE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "patient";
		searchVO.messageType = "PRPA_MT201000HT03";
		searchVO.placeHolder = "Patient Search";
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		searchVO.assigningOrganizationID = renderingEngine.getComponent(
				"Context").getSelectedOrganizationVO().subscriberId;
		renderingEngine.loadPage("pages/search/search.html", "search",
				AppConstants.Event.SEARCH_PAGE_BIND_EVENTS);

		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.registerClickEvent('newPatient', loadProcess);
		/*
		 * appController.getComponent("RenderingEngine").fireEvent(
		 * AppConstants.Event.RESIZE);
		 */
		if (renderingEngine.getComponent("Context").getBackToPatientHome() == true) {
			renderingEngine
					.fireEvent(AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT);
			renderingEngine.getComponent("Context").setBackToPatientHome(false);
			appController.getComponent("RenderingEngine").fireEvent(
					AppConstants.Event.RESIZE);
		} else {

			appController.getComponent("RenderingEngine").fireEvent(
					AppConstants.Event.RESIZE);
		}
		// loadHomeUI();

	}
	;

	/**
	 * Load the home page and bind the ui events.
	 */
	function loadHomeUI() {
		// alert("loadHomeUI");
		renderingEngine.showPageLoading("Binding home page");
		renderingEngine.loadPage("pages/patient/home.html", "form",
				AppConstants.Event.PATIENT_HOME_PAGE_BIND_EVENT);

		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);

		/*
		 * renderingEngine.getEventQueue().postEvent(AppConstants.Event.HOME_PAGE_RESIZE,
		 * {}, renderingEngine, patient);
		 */

	}
	;
	/**
	 * Bind the home page ui components events.
	 */
	function bindHomeEvents() {
		var patientVO = renderingEngine.getComponent("Context").getPatientVO();
		renderingEngine.setLeftHeaderInfo(patientVO.name);
		// alert("patientVO : " + patientVO);
		/*
		 * var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		 * renderingEngine.setLeftHeaderInfo(searchVO.displayValue);
		 */
		// alert(searchVO.id+"displayValue : "+searchVO.displayValue);
		var processId = 0;
		var processName = null;

		if (userProcesses) {
			for ( var index = 0; index < userProcesses.length; index++) {
				var userProcess = userProcesses[index];

				var count = userProcess.count();
				if (userProcess.processName == "DemographicsAndBackground") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#demographics').attr("processId", processId);
				} else if (userProcess.processName == "AgeManagementProgram"
						|| userProcess.processName == "BHRTProgram") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#programs').attr("processName", userProcess.processName);
					$('#programs').attr("processId", processId);
					$('#programs').attr("formName", userProcess.processName);

					/*
					 * $('#programs').find(".patient-home-text").html(
					 * userProcess.processName);
					 */

					// $('#programs').find(".count").html('[' + count + ']');
				} else if (userProcess.processName == "Monitor") {
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#monitor').attr("processId", processId);
					// $('#monitor').find(".count").html('[' + count + ']');
				}
				// alert(processName);
				else if (userProcess.processName == "ProgressReport") {
					// alert(userProcess.processName);
					processName = userProcess.processName;
					processId = userProcess.processIds[0];
					$('#progressReport').attr("processId", processId);
					// $('#monitor').find(".count").html('[' + count + ']');
				}
			}
			// $('#programs').attr("processName", "AgeManagementProgram");
		}

		renderingEngine.iconChange();
		/*
		 * $('#demographics').live( 'click', function(event) {
		 * 
		 * renderingEngine.setLeftHeaderInfo("Patient Name");
		 * renderingEngine.setFormName("Demographics And Background");
		 * renderingEngine.getEventQueue().postEvent(
		 * AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, { processName :
		 * "DemographicsAndBackground", processId : processId },
		 * renderingEngine, patient); });
		 */

		$('#demographics').unbind("click", loadProcess);
		$('#demographics').bind("click", loadProcess);

		$('#appointment').unbind('click', loadProcess);
		$('#appointment').bind('click', loadProcess);

		$('#accounts').unbind('click', loadProcess);
		$('#accounts').bind('click', loadProcess);

		$('#programs').unbind('click', loadProcess);
		$('#programs').bind('click', loadProcess);

		/*
		 * $('#monitor').unbind('click', loadProcess);
		 * $('#monitor').bind('click', loadProcess);
		 */

		/*
		 * $('#progressReport').unbind('click', loadProgressReport);
		 * $('#progressReport').bind('click', loadProgressReport);
		 */

		$('#progressReport').unbind('click', loadDocuments);
		$('#progressReport').bind('click', loadDocuments);
		
		$('#relations').unbind('click', loadProcess);
		$('#relations').bind('click', loadProcess);

		$('#checkinPatient').unbind('click', entityStateChanged);
		$('#checkinPatient').bind('click', entityStateChanged);

		$('#checkoutPatient').unbind('click', entityStateChanged);
		$('#checkoutPatient').bind('click', entityStateChanged);
		var checkinstate = renderingEngine.getComponent("Context")
				.getCheckinState();
		checkinState(checkinstate);
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);
		renderingEngine.closeModalDialog();
	}
	;

	/**
	 * Load the process based on the selected process definition from the
	 * patient dashboard.
	 */
	function loadProcess() {

		var leftHeaderInfo = $(this).attr("leftHeaderInfo");
		var formName = $(this).attr("formName");
		var processName = $(this).attr("processName");
		if (processName) {
			var processId = $(this).attr("processId");
			if (this.id == "newPatient") {
				leftHeaderInfo = "New Patient";
				renderingEngine.getComponent("Context").clearNavigationMap();
				renderingEngine.getComponent("Context").clearPhysicianContext();
				renderingEngine.getComponent("Context").clearPatientVOContext();
			}
			if (leftHeaderInfo)
				renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
			renderingEngine.fireEvent(AppConstants.Event.CLEAR_CONTEXT);
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
						processName : processName,
						type : "NewProcess",
						processId : processId
					}, renderingEngine, patient);
		}
	}
	;

	function entityStateChanged() {
		var stateValue = $(this).attr("state");
		var patientId = renderingEngine.getComponent("Context").getPatient();
		var date = new Date();
		var currentTime = formatDate(date, 'yyyy/MM/dd HH:mm:ss');
		var organizationId = renderingEngine.getComponent("Context")
				.getSelectedOrganizationVO().subscriberId;
		var entityState = new HIN.EntityState();
		entityState.entityid = patientId;
		entityState.state = "checkedin";
		entityState.statevalue = stateValue;
		entityState.time = currentTime;
		entityState.assigningOrganizationID = organizationId;
		patientId = patientId.replace(/\s+/g, '_');
		renderingEngine.getComponent("Context").setSelectedProfile(patientId);
		renderingEngine.getComponent("DataLayer").changeEntityState(
				entityState, changeCheckinState);
	}
	;

	function checkinState(checkinstate) {
		var isPatientTransfer = renderingEngine.getComponent("Context")
				.getIsPatientTransfer();
		if (checkinstate == "true") {
			$('#checkin').hide();
			$('#checkout').show();
		} else if (checkinstate == "false") {
			$('#checkin').show();
			$('#checkout').hide();
		} else if (checkinstate == "transfer") {
			$('#checkin').hide();
			$('#checkout').hide();
		} else {
			$('#checkin').show();
			$('#checkout').hide();
		}
	}
	;

	function loadAppointments() {
		renderingEngine
				.fireEvent(AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED);
	}
	;

	function updateCheckedinPatient() {
		var organizationId = renderingEngine.getComponent("Context")
				.getSelectedOrganizationVO().subscriberId;
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.queryString = "";
		searchVO.max = 100;
		var conditionMap = new HIN.HashMap();
		conditionMap.put("organizationId", organizationId);
		var callback = renderingEngine.getChildComponent("Search").checkedinPatientResult;
		var entityState = new HIN.EntityState();
		entityState.state = "checkedin";
		entityState.statevalue = "true";
		entityState.assigningOrganizationID = organizationId;

		renderingEngine.getComponent("DataLayer").fetchCheckedinPatient(
				searchVO, entityState, conditionMap, callback);

	}
	;

	function changeCheckinState(checkinstate) {
		renderingEngine.getComponent("Context").setCheckinState(
				checkinstate.statevalue);
		checkinState(checkinstate.statevalue);
		updateCheckedinPatient();
	}
	;

	/*
	 * function loadProgressReport() { renderingEngine
	 * .fireEvent(AppConstants.Event.TEST_RESULTS_PAGE_INITIALIZED); } ;
	 */
	this.loadDocuments = loadDocuments;
	function loadDocuments() {
		renderingEngine.loadDocument();
		// renderingEngine.slideRight();

		/*
		 * renderingEngine.getEventQueue().postEvent(
		 * AppConstants.Event.DOCUMENT_PAGE_INITIALIZED,
		 * AppConstants.DocumentType.DOCUMENTS, renderingEngine, patient);
		 */
		// renderingEngine.hidePageLoading();
		/*
		 * loadPage("pages/documents/documents.html", "form",
		 * AppConstants.Event.DOCUMENT_PAGE_INITIALIZED);
		 */
	}
	;

	this.loadPatientsHome = loadPatientsHome;
	function loadPatientsHome() {
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PATIENT_PAGE_INITIALIZED, {},
				renderingEngine, patient);
	}
	;

	this.loadPatientHome = loadPatientHome;
	function loadPatientHome() {
		renderingEngine.openModalDialog("Patient home page loading");
		$(".left-side-content").addClass("patient-home-bg").removeClass(
				"document-home-bg");
		renderingEngine.slideLeft();
		renderingEngine
				.fireEvent(AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT);
	}
	;

	function loadPatientNavigationLine() {
		renderingEngine.getUIDimensions();
		renderingEngine.getComponent("Context").clearNavigationMap();
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine.setNavigationLine("Patient Home");
		$('#' + navigationLineId).unbind("click", loadPatientHome);
		$('#' + navigationLineId).bind("click", loadPatientHome);
	}
	;
	/*
	 * function loadProcess() { renderingEngine.setLeftHeaderInfo("New
	 * Patient"); renderingEngine.setFormName("Patient Registration");
	 * renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
	 * renderingEngine.getEventQueue().postEvent(
	 * AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, { processName :
	 * "PatientRegistration", type : "NewProcess" }, renderingEngine, patient); } ;
	 */

	// PatientRegistration"//AgeManagementProgram"//Monitor"//DemographicsAndBackground"//"Accounts"
}
