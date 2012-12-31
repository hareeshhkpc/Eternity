function Archive(renderingEngine) {

	this.eventHandler = eventHandler;
	this.className = "Archive";

	this.loadUI = loadUI;
	this.fetchMessageTypes = fetchMessageTypes;
	this.loadPatientHomePage = loadPatientHomePage;
	this.messageTypeListManage = messageTypeListManage;
	this.fetchNextMessage = fetchNextMessage;
	// this.fetchMessageTypes = fetchMessageTypes;
	var archive = this;
	var appController = appController;
	var selectedUserList = new Array();
	var selectedUser = null;
	var selectedMessageTypeList = new Array();
	var selectedMessageType = new Array();
	var selectedPatientList = new Array();
	var selectedPatient = new Array();
	var patientIdList = new Array();

	var result = null;
	var index = null;
	function eventHandler(event) {
		if (event.type == AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_RESPONSE) {
			index = 0;
			archiveSearchResultTemplate(event.data.result, index);
		}/*
			 * else if (event.type ==
			 * AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_RESPONSE &&
			 * $("#archiveSearchData").val().length > 0) {
			 * archiveSearchTemplate(event.data.result); }
			 */else if (event.type == AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS_RESPONSE) {
			appendWithMessageTypes(event.data.result);
		} else if (event.type == AppConstants.Event.ARCHIVE_SEARCH_PAGE_BIND_EVENTS) {
			renderingEngine.showPageLoading("Active search page binding");
			$("#archiveSearchData").keyup(function() {
				archiveSearchData(1);
			});
			$("#fetchtestresult").click(
					function() {
						$("#daterangeselect").css({
							"display" : "block"
						});
						appendTestResult($("#messageTypeName").attr(
								"indexfolder"), $("#messageTypeName").attr(
								"artifactid"), "", "");
					});
			$("#fetchmorepatient").click(function() {
				archiveSearchData(2);
			});
			$("#fetchmoretests").click(function() {
				var messageType = $("#messageTypeName").attr("indexfolder");
				fetchMessageTypes(2, messageType);
			});
			$("#prev")
					.click(
							function() {
								var searchVO = renderingEngine.getComponent(
										"Context").getSearchVO();
								searchVO.max = 4;
								renderingEngine.getComponent("Context")
										.setSearchVO(searchVO);
								selectedMessageTypeList = [];
								selectedMessageType = [];
								var index = $(".msgtype").attr('id').substring(
										6);
								var messageType = renderingEngine.getComponent(
										"Context").getMessageType();
								if (index > 0) {
									var i = Number(index) - 1;
									$("#appendmessagetype").html('');
									$("#appendmessagetype")
											.append(
													'<div class="msgtype" id=msgTyp'
															+ i
															+ '><label indexfolder="'
															+ messageType[i].name
															+ '" id="messageTypeName" style="font-weight:bold;">'
															+ messageType[i].description
															+ '</label></div>');
									fetchMessageTypes(1, messageType[i].name);
								}
							});
			$("#next")
					.click(
							function() {
								var searchVO = renderingEngine.getComponent(
										"Context").getSearchVO();
								searchVO.max = 4;
								renderingEngine.getComponent("Context")
										.setSearchVO(searchVO);
								selectedMessageTypeList = [];
								selectedMessageType = [];
								var index = $(".msgtype").attr('id').substring(
										6);
								var messageType = renderingEngine.getComponent(
										"Context").getMessageType();
								if (index < messageType.length - 1) {
									var i = Number(index) + 1;
									$("#appendmessagetype").html('');
									$("#appendmessagetype")
											.append(
													'<div class="msgtype" id=msgTyp'
															+ i
															+ '><label indexfolder="'
															+ messageType[i].name
															+ '" id="messageTypeName" style="font-weight:bold;">'
															+ messageType[i].description
															+ '</label></div>');
									fetchMessageTypes(1, messageType[i].name);
								}
							});
			$("#toDate").change(
					function() {
						$('#tests').nextAll().remove();
						appendTestResult($("#messageTypeName").attr(
								"indexfolder"), $("#messageTypeName").attr(
								"artifactid"), null, null);
					});
			$("#fromDate").click(function() {
				$("#calenderOuter").css({
					"display" : "block"
				});
				$("#fromDateCalendar").css({
					"display" : "block"
				});
			});
			$("#toDate").click(function() {
				$("#calenderOuter").css({
					"display" : "block"
				});
				$("#toDateCalendar").css({
					"display" : "block"
				});
			});
			selectedMessageTypeList = [];
			selectedMessageType = [];
			selectedPatientList = [];
			selectedPatient = [];
			fetchMessageDomain();
			renderingEngine.hidePageLoading();
			$('#patientHomeIconArchive').unbind('click', loadPatientHomePage);
			$('#patientHomeIconArchive').bind('click', loadPatientHomePage);
		} else if (event.type == AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPE_RESPONSE) {
			updateWithMessageDomains(event.data.result);
		}
	}
	;

	/*
	 * Manage the selected patient list to fetch archive message AND change the
	 * color of the selected patients
	 */
	function managePatientList(key, value) {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if (selectedPatientList[key] == null) {
			$("#pat" + key).css({
				"background" : "#61135A"
			});
			$("#pat" + key).css({
				"color" : "#FFFFFF"
			});
			selectedPatientList[key] = key;
			selectedPatient[key] = value;
		} else {
			delete selectedPatientList[key];
			delete selectedPatient[key];
			$("#pat" + key).css({
				"background" : "#FFFFFF"
			});
			$("#pat" + key).css({
				"color" : "#000000"
			});
		}
		searchVO.patientId = selectedPatient;
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
	}
	;

	function loadPatientHomePage() {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.type = AppConstants.SearchType.PATIENT_PROFILE_SEARCH;
		renderingEngine.getComponent("Context").setBackToPatientHome(true);
		renderingEngine.fireEvent(AppConstants.Event.PATIENT_PAGE_INITIALIZED);
		
	};
	
	/*
	 * Add or remove message type list to fetch the archive message AND change
	 * the color on selection of messagetype
	 */
	function messageTypeListManage(key, value) {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if (selectedMessageTypeList[key] == null) {
			$("#tes" + key).css({
				"background" : "#61135A"
			});
			$("#tes" + key).css({
				"color" : "#FFFFFF"
			});
			selectedMessageTypeList[key] = key;
			selectedMessageType[key] = value;
		} else {
			delete selectedMessageTypeList[key];
			delete selectedMessageType[key];
			$("#tes" + key).css({
				"background" : "#FFFFFF"
			});
			$("#tes" + key).css({
				"color" : "#000000"
			});
		}
		searchVO.testName = selectedMessageType;
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
	}
	;

	function appendTestResult(messageType, artifactId, fromDate, toDate) {
		// CLEAR ALL THE MESSAGES AND LOAD THE NEW MESSAGES
		$('#MessageViews').nextAll('div').remove();
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		// SET THE DATE IN THE DATE RANGE
		var to = new Date();
		if (toDate == "") {
			toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate(),
					23, 59, 0);
		} else {
			toDate = new Date($("#todatecalendar").val());
			toDate.setHours(23, 59, 59);
		}
		if (fromDate == "") {
			fromDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
			fromDate.setDate(fromDate.getDate() - 6);
		} else {
			fromDate = new Date($("#fromdatecalendar").val());
		}
		searchVO.serverURI = "/hin-web/rest/search/archivetestsearch";
		searchVO.fromDate = fromDate.getTime();
		searchVO.toDate = toDate.getTime();
		searchVO.artifactId = artifactId;
		searchVO.messageType = messageType;
		searchVO.type = AppConstants.SearchType.ARCHIVE_TEST_RESULT_SEARCH;
		searchVO.patientId1 = renderingEngine.getComponent("Context")
				.getPatientVO().subscriberId;
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		if (true) {
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_PROCESSED, {
						searchVO : searchVO
					}, renderingEngine, archive);
		} else {
		}
		$("#fromdatecalendar").parent().removeClass().addClass(
				'ui-input-datebox');
		$("#fromdatecalendar").parent().css({
			"width" : "100%",
			"margin-top" : "-5px"
		});

		$("#fromdatecalendar").val(CommonUtil.dateFormat(fromDate, "longDate"));
		$("#todatecalendar").parent().removeClass()
				.addClass('ui-input-datebox');
		$("#todatecalendar").parent().css({
			"width" : "100%",
			"margin-top" : "-5px"
		});
		$("#todatecalendar").val(CommonUtil.dateFormat(toDate, "longDate"));
	}
	;

	function loadUI() {
		var searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.ARCHIVE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "patient";
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.loadPage("pages/testresult/archivesearch.html",
				"search", AppConstants.Event.ARCHIVE_SEARCH_PAGE_BIND_EVENTS);

	}
	;
	/* FILL WITH SEARCHED PATIENTS NAME */
	function archiveSearchTemplate(result) {
		$('#tests').nextAll().remove()
		$("#searchlistlist").html("");
		$.each(result, function(key, value) {
			$("#searchlistlist").append(
					'<li id=pat' + key + '><b>' + value.name + '</b></li>');
			$("#pat" + key).click(function() {
				managePatientList(key, value.subscriberId);
			});
		});
		$("#searchlistlist").listview("refresh");
	}
	;
	/* Fetch messageTypes for current messageTypeDomain */
	function fetchMessageTypes(max, messageType) {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.max = searchVO.max * max;
		searchVO.messageType = messageType;
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS, {
					searchVO : searchVO
				}, renderingEngine, archive);
	}
	;

	/* FETCH MESSAGE FROM CASSANDRA FOR THE MESSAGEID */
	function archiveSearchResultTemplate(result, index) {
		this.result = result;
		if (result != null && result.length > index) {
			var messageIdAndMessageType = result[index].split(",");
			renderingEngine.getComponent("DataLayer")
					.getMessageForSearchResult(messageIdAndMessageType[0],
							messageIdAndMessageType[1],
							messageIdAndMessageType[2],
							archive.fetchNextMessage);
		}
	}
	;

	/* BIND THE MESSAGE DATA WITH THE UI */
	function fetchNextMessage(messageId, messageObj, patientId) {
		var patientNameDiv = $('#MessageViews').find(
				'#' + messageObj.getConfig().getArtifactId()).find(
				'#patientNameDiv').clone();
		var messageBodyDiv = $('#MessageViews').find(
				'#' + messageObj.getConfig().getArtifactId()).find(
				'#messageBodyDiv').clone();
		$(patientNameDiv).attr("id", 'testResult' + patientId);
		$(messageBodyDiv).attr("id", 'tests' + messageId);

		var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
		if ($("#testResult" + patientId).length != 0) {
			// $('#testResult' + patientId).append($(tests));
			$('#testResult' + patientId).after($(messageBodyDiv));
			var msgBinder = new MessageLoader('tests' + messageId, messageObj,
					messageObj.getConfig().getArtifactId());
			msgBinder.loadDataOntoForm(lookupHandler);
		} else {
			$(
					'<div id="testResultOuter' + patientId
							+ '" class="ui-archive-header-outer"></div>')
					.appendTo('#archiveData')
			$(patientNameDiv).appendTo('#testResultOuter' + patientId);

			$(messageBodyDiv).appendTo('#testResultOuter' + patientId);

			var msgBinder = new MessageLoader('testResult' + patientId,
					messageObj, messageObj.getConfig().getArtifactId());
			msgBinder.loadDataOntoForm(lookupHandler);

			msgBinder = new MessageLoader('tests' + messageId, messageObj,
					messageObj.getConfig().getArtifactId());
			msgBinder.loadDataOntoForm(lookupHandler);
		}

		index = index + 1;
		archiveSearchResultTemplate(this.result, index);
	}
	;

	/* APPEND THE MESSAGE TYPE LIST OF THE CURRENT MESSAGE DOMAIN */
	function appendWithMessageTypes(result) {
		selectedMessageTypeList = [];
		selectedMessageType = [];
		$("#xmlcontent").html("");
		if (result != null) {
			$
					.each(
							result,
							function(key, value) {
								if (value != null) {
									var indexFolder = "";
									var artifactId = "";
									for ( var i = 0; i < value.conceptAttributes.length; i++) {
										if (value.conceptAttributes[i].key == 'MessageType') {
											artifactId = value.conceptAttributes[i].value;
										} else if (value.conceptAttributes[i].key == 'indexFolder') {
											indexFolder = value.conceptAttributes[i].value;
										}
									}
									$("#xmlcontent").append(
											'<li id=tes' + key + '><b>'
													+ value.description
													+ '</b></li>');
									$("#tes" + key).click(
											function() {
												messageTypeListManage(key,
														indexFolder + ","
																+ artifactId);
											});
								}
							});
			$("#xmlcontent").listview("refresh");
		}
	}
	;

	/* FETCH THE MESSAGE DOMAINS FROM CONCEPT */
	function fetchMessageDomain() {
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPES, {},
				renderingEngine, archive);
	}
	;

	/* FETCH PATIENT DETAILS ON KEY PRESS */
	function archiveSearchData(max) {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		var searchValue = $("#archiveSearchData").val();
		searchVO.value = searchValue.replace(/^\s+|\s+$/g, "");
		searchVO.max = searchVO.max * max;
		searchVO.fromDate = "";
		searchVO.messageType = "PRPA_MT201000HT03";
		if (searchVO.value.length >= searchVO.min) {
			var conditionMap = new HIN.HashMap();
			searchVO.queryString = "+Role:" + "patient" + " +subscriberType:"
					+ searchVO.messageType + " +(givenName:" + searchVO.value
					+ "* familyName:" + searchVO.value + "*)";
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_PROCESSED, {
						searchVO : searchVO,
						conditionMap : conditionMap
					}, renderingEngine, archive);
		} else if (searchVO.value.length <= 0) {
			selectedMessageTypeList = [];
			selectedMessageType = [];
			selectedPatientList = [];
			selectedPatient = [];
			patientIdList = [];
			$("#searchlistlist").html("");
			fetchMessageDomain();
		}
	}
	;

	/* APPEND MESSAGE DOMAINS TO THE SLIDER */
	function updateWithMessageDomains(result) {
		$("#appendmessagetype").html("");
		if (typeof (result) == 'object' && result != '') {
			$("#appendmessagetype")
					.append(
							'<div class="msgtype" id=msgTyp'
									+ 0
									+ '><label indexfolder="'
									+ result[0].name
									+ '" id="messageTypeName" style="font-weight:bold;">'
									+ result[0].description + '</label></div>');
			fetchMessageTypes(1, result[0].name);
		} else {

		}
	}
	;
}