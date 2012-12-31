function Search(renderingEngine) {

	this.eventHandler = eventHandler;
	this.className = "Search";

	this.loadUI = loadUI;
	this.searchPageBindEvents = searchPageBindEvents;
	this.searchPageResponse = searchPageResponse;
	this.searchData = searchData;
	this.checkedinPatientResult = checkedinPatientResult;
	this.userSearchResult = userSearchResult;
	this.searchTemplate = searchTemplate;
	this.checkedinPatientTemplate = checkedinPatientTemplate;
	this.searchSubTemplate = searchSubTemplate;
	this.licenseeSearchSubTemplate = licenseeSearchSubTemplate;
	this.checkedinPatientSubTemplate = checkedinPatientSubTemplate;
	this.listNotificationTemplate = listNotificationTemplate;
	this.onSelect = onSelect;
	this.mCustomScrollbars = mCustomScrollbars;
	this.createCalendarHeader = createCalendarHeader;
	this.fillCalenderData = fillCalenderData;
	this.calendarTemplate = calendarTemplate;
	var currentAppList = new Array();

	var search = this;
	var selectedUser = null;
	var scheduledData = [];
	var appendCheckinDiv = "checkedinlist";
	var appendSearchDiv = "userList";
	var defaultFromDate = new Date();
	var viewTypeDays = AppConstants.Day.TODAY;

	/**
	 * Handles event from Application controller
	 * 
	 */
	function eventHandler(event) {
		if (event.type == AppConstants.Event.SEARCH_PAGE_BIND_EVENTS) {
			searchPageBindEvents();
		} else if (event.type == AppConstants.Event.SEARCH_PAGE_RESPONSE) {
			searchPageResponse(event.data.result);
		} else if (event.type == AppConstants.Event.SEARCH_PAGE_ERROR) {

		} else if (event.type == AppConstants.Event.FILL_CHECKEDIN_PATIENTS) {
			checkedinPatientResult(event.data.result);
		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_FILL_DATA) {
			renderingEngine.showPageLoading("Preparing search event");
			var days = AppConstants.Day.TODAY;
			var tillDate = 1;
			if(event.data.day == AppConstants.Day.MONTH){
				days = AppConstants.Day.MONTH;
				tillDate = 30;
			}else{
				days = AppConstants.Day.WEEK;
				tillDate = 7;
			}
			calendarQuery(tillDate,days);
		}
	}
	;

	/**
	 * Bind events to all search elements
	 * 
	 */
	function searchPageBindEvents() {
		renderingEngine.getComponent("Context").clearSelectedProfileContext();
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		$("#searchData").keyup(function(event) {
			searchData(event);
		});
		$('#searchData').focus();
		/*
		 * $("#searchData").click(function(event) { clearSearchList(); });
		 */
		if (searchVO.placeHolder) {
			$("#searchData").attr('placeholder', searchVO.placeHolder);
		}
		if (searchVO.type == AppConstants.SearchType.CALENDAR_SEARCH) {
			/*******************************************************************
			 * Set the organization id
			 */
			renderingEngine.getComponent("Context")
					.clearSelectedOrganizationVOContext();
			var organizationVO = renderingEngine.getComponent("Context")
					.getOrganizationVO();
			renderingEngine.getComponent("Context").setSelectedOrganizationVO(
					organizationVO);

			var date = parseDate(searchVO.fromDate);
			renderingEngine.showPageLoading("Load scheduled data");
			if (!date) {
				date = new Date();
			}
			search.defaultFromDate = date;
			createCalendarHeader();
		} else if (searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH) {
			searchVO.max = 100;
			var organizationId = renderingEngine.getComponent("Context")
					.getSelectedOrganizationVO().subscriberId;
			var entityState = new HIN.EntityState();
			entityState.state = "checkedin";
			entityState.statevalue = "true";
			entityState.assigningOrganizationID = organizationId;

			var conditionMap = new HIN.HashMap();
			conditionMap.put("organizationId", renderingEngine.getComponent(
					"Context").getSelectedOrganizationVO().subscriberId);
			renderingEngine.showPageLoading("Searching");
			renderingEngine.getComponent("DataLayer")
					.fetchCheckedinPatient(searchVO, entityState, conditionMap,
							checkedinPatientResult);
		}
	}
	;

	/**
	 * Response by search page after successfully data retrieved from server.
	 * 
	 */
	function searchPageResponse(data) {
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		renderingEngine.hidePageLoading();
		var searchValue = $("#searchData").val();
		if (searchVO.value == searchValue.replace(/^\s+|\s+$/g, "")) {
			if ($("#searchData").val().length >= 0) {
				userSearchResult(data);
			}
			appController.getComponent("RenderingEngine").fireEvent(
					AppConstants.Event.RESIZE);
		}
	}
	;

	/**
	 * As user types capture data from input box.
	 */
	function searchData(event) {
		var listId = appendSearchDiv;
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.value = $("#searchData").val().replace(/^\s+|\s+$/g, "");
		if (searchVO.value.length >= searchVO.min || event.keyCode === 32) {
			$("#" + appendCheckinDiv).hide();
			mCustomScrollbars();
			searchVO.max = (event.keyCode === 32 && searchVO.value.length <= 0 ) ? 6 : 4;
			processSearchData(searchVO);
		} else if (searchVO.value.length <= 0) {
			clearSearchList();
		} else {
			$("#" + listId).html("");
		}
	}
	;

	/**
	 * Load the search page.
	 */
	function loadUI() {
		renderingEngine.loadPage("pages/home/home.html", "form",
				AppConstants.Event.HOME_PAGE_BIND_EVENTS);
	}
	;

	/**
	 * Result of checkedIn patients.
	 * 
	 * @param result
	 */
	function checkedinPatientResult(result) {
		var listId = appendCheckinDiv;
		if (result && result.length > 0) {
			var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			$("#" + listId).html("");
			clearSearchList();
			$.each(result, function(index, value) {
				var key = value.subscriberId.replace(/\s+/g, '_');
				if (key) {
					checkedinPatientTemplate(listId, key, value);
				}
				$('.timestamp').cuteTime();
				$.fn.cuteTime.settings.refresh = 1000;

			});
			var listNotification = listNotificationSubTemplate(
					"no more checkedin patient", listId)
			$("#" + listId).append(listNotification);
		} else {
			var listNotification = listNotificationSubTemplate(
					"no checkedin patient", listId)
			$("#" + listId).html(listNotification);
		}
		$("#" + listId).trigger('create');
		mCustomScrollbars();
		renderingEngine.hidePageLoading();
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);

	}
	;

	/**
	 * Result of searched users.
	 * 
	 * @param result
	 */
	function userSearchResult(result) {
		var listId = appendSearchDiv;
		if (!result)
			return;
		$("#" + listId).show();
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		$("#" + listId).html("");
		$.each(result, function(index, value) {
			var key = value.subscriberId.replace(/\s+/g, '_');
			if (key) {
				searchTemplate(listId, key, value, searchVO);
			}

		});
		listNotificationTemplate(result, searchVO, listId);
	}
	;

	/**
	 * Create a UI to display search results.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 * @param searchVO
	 */
	function searchTemplate(listId, key, value, searchVO) {
		if (!value.imageBase64) {
			value.imageBase64 = "images/user.png";
			typeBaseSearchTemplate(listId, key, value, searchVO);

		} else {
			typeBaseSearchTemplate(listId, key, value, searchVO);
		}
		$("#" + listId + key).click(function() {
			$("#searchData").val('');
			$("#" + listId).html('');
			mCustomScrollbars();
			onSelect(appendCheckinDiv + key, value.subscriberId);
			navigateProfile(value, listId);
		});

		var patientId = renderingEngine.getComponent("Context")
				.getSelectedProfile();
		if (patientId == value.subscriberId) {
			onSelect(listId + key, value.subscriberId);
		}
	}
	;

	/**
	 * Create UI based on the type of search.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 * @param searchVO
	 */
	function typeBaseSearchTemplate(listId, key, value, searchVO) {
		var resultListTemplate = "";
		if (searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH
				|| searchVO.type == AppConstants.SearchType.STAFF_PROFILE_SEARCH) {
			resultListTemplate = searchSubTemplate(listId, key, value);
		} else if (searchVO.type == AppConstants.SearchType.LICENSEE_SEARCH) {
			resultListTemplate = licenseeSearchSubTemplate(listId, key, value);
		}
		$("#" + listId).append(resultListTemplate);

	}
	;

	/**
	 * Create sub templates to display search result.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 * @returns {String}
	 */
	function searchSubTemplate(listId, key, value) {
		var resultList = '<li class="ui-corner-all ui-shadow-inset" data-theme="c" id="';
		resultList += listId;
		resultList += key;
		resultList += '"><a href="#"><div class="ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit"><div class="ui-search-image"><img style="max-width:100%;" src="';
		resultList += value.imageBase64;
		resultList += '"></div><b><div class="ui-search-list">';
		resultList += value.name;
		resultList += '</b><br><div id="status';
		resultList += key;
		resultList += '">&nbsp;</div><br></div></a><div class="ui-li-aside ui-search-timeslot"><strong></strong></div></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></a></li>';
		return resultList;
	}
	;

	/**
	 * Create sub templates to display licensee search result.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 * @returns {String}
	 */
	function licenseeSearchSubTemplate(listId, key, value) {
		var resultList = '<li class="ui-corner-all ui-shadow-inset" data-theme="c" id="';
		resultList += listId;
		resultList += key;
		resultList += '"><a href="#"><div class="ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit"><div class="ui-search-image"><img style="max-width:100%;" src="';
		resultList += value.imageBase64;
		resultList += '"></div><b><div class="ui-search-list">';
		resultList += value.name;
		resultList += '</b><br>';
		resultList += value.telecom;
		resultList += '<div id="status';
		resultList += key;
		resultList += '">&nbsp;</div><br></div></a><div class="ui-li-aside ui-search-timeslot"><strong></strong></div></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></a></li>';
		return resultList;
	}
	;

	/**
	 * Create UI to display checkedIn patient template.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 */
	function checkedinPatientTemplate(listId, key, value) {
		if (value.imageBase64 == "" && value.state == "true") {
			value.imageBase64 = "images/user.png";
			var resultList = checkedinPatientSubTemplate(listId, key, value);
			$("#" + listId).append(resultList);
		} else if (value.imageBase64 !== "" && value.state == "true") {
			var resultList = checkedinPatientSubTemplate(listId, key, value);
			$("#" + listId).append(resultList);
		}
		$("#" + listId + key).click(function() {
			onSelect(listId + key);
			navigateProfile(value, listId);
		});

		var patientId = renderingEngine.getComponent("Context")
				.getSelectedProfile();
		if (patientId == value.subscriberId) {
			onSelect(listId + key);
		}
	}
	;

	/**
	 * Create sub templates to display checkedin patients results.
	 * 
	 * @param listId
	 * @param key
	 * @param value
	 * @returns {String}
	 */
	function checkedinPatientSubTemplate(listId, key, value) {
		var resultList = '<li class="ui-corner-all ui-shadow-inset" data-theme="c" id="';
		resultList += listId;
		resultList += key;
		resultList += '"><a href="#"><div class="ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit"><div class="ui-search-image"><img src="';
		resultList += value.imageBase64;
		resultList += '" style="max-width:100%;"></div><b><div class="ui-search-list">';
		resultList += value.name;
		resultList += '</b><br><div id="status';
		resultList += key;
		resultList += '">&nbsp;checked in</div><br></div></a><div class="ui-li-aside ui-search-timeslot"><strong class="timestamp">';
		resultList += value.timeLapse;
		resultList += '</strong></div></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></a></li>';
		return resultList;
	}
	;

	/**
	 * Create calender UI.
	 * 
	 * @param flag
	 * @param listId
	 * @param index
	 * @param value
	 */
	function calendarTemplate(flag, listId, index, value) {
		var fDate = parseDate(CommonUtil.dateFormat(parseDate(value.start),
				"mediumDate"));
		var eliment = "";
		if (!flag) {
			eliment = calendarHeaderEliment(index, value);
			$("#" + listId).append(eliment);
		}
		eliment = calendarEliment(index, value);

		$("#" + listId).append(eliment);
		// For blocking time
		if (value.messageTitle === AppConstants.XPaths.Appointment.BLOCK_CODE) {
			return;
		}
		$("#" + appendCheckinDiv + value.id).click(
				function() {
					if (value.patientId == null) {
						/*
						 * notificationmsg .success("User Id is undefined,Unable
						 * to Process.");
						 */
						return;
					}
					onSelect(appendCheckinDiv + value.id);

					renderingEngine.getComponent("Context").setConsultant(
							value.doctorId);
					renderingEngine.getComponent("Context").setConsultantName(
							value.doctor);

					var userVO = new HIN.UserVO();
					userVO.subscriberId = value.patientId;
					userVO.name = value.title;
					userVO.state = true;
					navigateProfile(userVO, listId);
				});

	}
	;

	/**
	 * Create subtemplate for calendar UI.
	 * 
	 * @param index
	 * @param value
	 * @returns {String}
	 */
	function calendarEliment(index, value) {
		var image = value.img != null ? value.img : "images/user.png";
		if(value.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE){
			image = "images/doctor.png";
		}
		var ajaxCss = value.messageTitle != AppConstants.XPaths.Appointment.BLOCK_CODE ? "data-theme='d'"
				: '';
		var title = value.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE ? value.comment
				: value.title;
		var calenderList = "<li class='ui-btn ui-li' "
				+ ajaxCss
				+ " id='"
				+ appendCheckinDiv
				+ value.id
				+ "' > "
				+ "<div class='ui-li'><div class='ui-btn-text'><a href='#' class='ui-li ui-link-inherit'><div class='ui-search-image'>"
				+ "<img src='"
				+ image
				+ "' style='max-width:100%;'></div><b><div class='ui-search-list'> "
				+ title
				+ "</b><br><div id='consoltant"
				+ index
				+ "'>"
				+ value.doctor
				+ "</div><div id='reason"
				+ index
				+ "'>"
				+ CommonUtil.dateFormat(parseDate(value.start, false),
						"shortTime")
				+ " - "
				+ CommonUtil.dateFormat(parseDate(value.end, false),
						"shortTime") + "</div></div></a>" + "</div></div>"
				+ "</li>";
		return calenderList;
	}
	;

	/**
	 * create calendarHeaderEliment for calender UI.
	 * 
	 * @param index
	 * @param value
	 * @returns {String}
	 */
	function calendarHeaderEliment(index, value) {
		var calenderList = "<div class='date-diffarence'><span>"
				+ CommonUtil.dateFormat(parseDate(value.start), "fullDate")
				+ "</span></div>";

		return calenderList;
	}
	;

	/**
	 * Create template to display notifications
	 * 
	 * @param result
	 * @param searchVO
	 * @param listId
	 */
	function listNotificationTemplate(result, searchVO, listId) {
		if (result.length >= searchVO.max) {
			var listNotification = listNotificationSubTemplate(
					"see more results", listId)
			$("#" + listId).append(listNotification);
			$("#fetchmoreuser_" + listId).click(
					function() {
						var searchValue = $("#searchData").val();
						var searchVO = renderingEngine.getComponent("Context")
								.getSearchVO();
						searchVO.value = searchValue.replace(/^\s+|\s+$/g, "");
						searchVO.max = searchVO.max + 50;
						processSearchData(searchVO);
					});
		} else if (result.length > 0) {
			var listNotification = listNotificationSubTemplate(
					"no more results", listId);
			$("#" + listId).append(listNotification);
		} else if (searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH
				|| searchVO.type == AppConstants.SearchType.STAFF_PROFILE_SEARCH
				|| searchVO.type == AppConstants.SearchType.LICENSEE_SEARCH) {
			var listNotification = listNotificationSubTemplate(
					"zero results found", listId);
			$("#" + listId).append(listNotification);
		}
		$("#" + listId).trigger('create');
		mCustomScrollbars();
	}
	;

	/**
	 * create subtemplate to display notification UI.
	 * 
	 * @param message
	 * @param listId
	 * @returns {String}
	 */
	function listNotificationSubTemplate(message, listId) {
		var listNotification = '<li id="fetchmoreuser_';
		listNotification += listId;
		listNotification += '" data-theme="c" style="color: #000000;position:relative;left:0px;width:90%;" class="ui-corner-all ui-li ui-li-static ui-list-bottom shadow"><div class="ui-arrow-position">';
		listNotification += message;
		listNotification += '</div> </li>';
		return listNotification;
	}
	;

	/*
	 * function processSearchData(searchVO) { alert("searchVO: " + searchVO); }
	 */

	/**
	 * Write search Queries and rise request to server and query data.
	 * 
	 * @param searchVO
	 */
	function processSearchData(searchVO) {
		var conditionMap = new HIN.HashMap();
		renderingEngine.showPageLoading("Searching");
		searchVO = getSearchQuery(searchVO);
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.getComponent("DataLayer").search(searchVO,
				conditionMap, searchPageResponse);
	}
	;

	/**
	 * On click of selected profile navigate in to his profile details
	 */
	function navigateProfile(value, listId) {
		renderingEngine.getComponent("Context").setCheckinState(value.state);
		var selectedUserID = value.subscriberId.replace(/\s+/g, '_');
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.id = value.subscriberId;
		searchVO.displayValue = value.name;
		renderingEngine.getComponent("Context").setSelectedProfile(
				value.subscriberId);
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		mCustomScrollbars();
		$("#" + appendCheckinDiv).show();
		if (searchVO.type == AppConstants.SearchType.CALENDAR_SEARCH
				|| searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH) {
			renderingEngine.setFormName("Patient Home");
			$("#" + appendCheckinDiv).show();
			renderingEngine.openModalDialog("Patient home page loading");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT, {},
					renderingEngine, search);
		} else if (searchVO.type == AppConstants.SearchType.STAFF_PROFILE_SEARCH) {
			renderingEngine.setFormName("Staff Home");
			renderingEngine.openModalDialog("Staff home page loading");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.STAFF_HOME_PAGE_LOAD_EVENT, {},
					renderingEngine, search);
		} else if (searchVO.type == AppConstants.SearchType.LICENSEE_SEARCH) {
			renderingEngine.setFormName("Licensee Home");
			renderingEngine.openModalDialog("Licensee home page loading");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT, {},
					renderingEngine, search);
		}
	}
	;

	/**
	 * On selection of any profile change the background color.
	 * 
	 * @param key
	 * @param selectedUserID
	 */
	function onSelect(key, selectedUserID) {
		if (selectedUser == null || selectedUser == key) {
			$("#" + key).addClass('ui-search-current');
			$("#" + key + " .ui-search-list").css('color', '#ffffff');
			$("#" + key + " .ui-search-timeslot").css('color', '#ffffff');
			selectedUser = key;
		} else {
			$("#" + selectedUser).removeClass('ui-search-current');
			$("#" + selectedUser + " .ui-search-list").css('color', '#6E1766');
			$("#" + selectedUser + " .ui-search-timeslot").css('color',
					'#6E1766');
			$("#" + key).addClass('ui-search-current');
			$("#" + key + " .ui-search-list").css('color', '#ffffff');
			$("#" + key + " .ui-search-timeslot").css('color', '#ffffff');
			selectedUser = key;
		}

	}
	;

	/**
	 * Custom scrollbar for extra results.
	 */
	function mCustomScrollbars() {

		$("#mcs_container").mCustomScrollbar("vertical", 0, "easeOutCirc", 0,
				"auto", "yes", "yes", 0);
	}
	;
	/*
	 * function searchHeight(){ var sHeight = $(window).height();
	 * 
	 * $("#mcs_container").animate({ height : sHeight - 140 }, 200);
	 * 
	 * $('#mcs_container').find(".dragger_container").css('height', sHeight -
	 * 140);
	 * 
	 * mCustomScrollbars(); }
	 */
	/**
	 * Creates calendar handler
	 */
	function createCalendarHeader() {
		var date = search.defaultFromDate;
		$("#checkedinlist").removeClass("searchlist")
				.addClass("cal-searchlist");
		$(".search").removeClass("search").addClass("calendar-search");

		$("#searchData").remove();
		var html = '<ul class="ui-listview ui-listview-inset ui-corner-all ui-btn-icon-right ui-li-has-arrow">'
				+ '<li class="ui-li ui-li-divider ui-bar-f ui-corner-top">'
				+ '<div class="ui-li" style="cursor:pointer;width:90%;">'
				+ CommonUtil.dateFormat(date, "fullDay").toUpperCase()
				+ '<br>'
				+ CommonUtil.dateFormat(date, "longDate").toUpperCase()
				+ '</div>'
				+ '<span class="ui-icon ui-icon-grid ui-icon-shadow" style="cursor:pointer;">&nbsp;</span>'
				+ '</li></ul>';

		$("div.calendar-search").html(html);
		$("div.calendar-search").find('div.ui-li').unbind("click",
				createCalenderDiv);
		$("div.calendar-search").find('div.ui-li').bind("click",
				createCalenderDiv);
		$("div.calendar-search").find('span.ui-icon-shadow').bind("click",
				showCalender);
		calendarQuery(1,AppConstants.Day.TODAY);
		
		
		/*
		 * renderingEngine.getComponent("DataLayer").fetchMessages(query,
		 * fillCalenderData);
		 */
	}
	;
	
	
	function calendarQuery(tillDate,viewType){
		search.viewTypeDays = viewType;
		var date = search.defaultFromDate;
		var context = renderingEngine.getComponent("Context");
		if (context) {
			var blocknonecode = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
			var conditionMap = new HIN.HashMap();
			var d = new Date(date.getFullYear(), date.getMonth(), date
					.getDate(), date.getHours(), date.getMinutes());
			var subscriberId = context.getUserVo().subscriberId;
			var organizationId = context.getSelectedOrganizationVO().subscriberId;

			var searchVO = new HIN.SearchVO();
			searchVO.serverURI = "/hin-web/rest/search/messageSearchWithCondtion";
			searchVO.id = subscriberId;
			searchVO.max = 100;
			searchVO.queryString = "+(alldoc:all) -(messageTitle:"
					+ blocknonecode + ") +(organizationId:" + organizationId
					+ ")";
			// searchVO.filterColumn = "effectiveTimeFrom";
			searchVO.filterColumn = "effectiveTimeTo";
			searchVO.fromDate = new Date(d.getTime()).getTime();
			searchVO.toDate = new Date(d.getTime() + (86400000*tillDate)).getTime();

			searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;// "PRPA_MT410001HT02";
			renderingEngine.getComponent("DataLayer").fetchLuceneMessages(
					searchVO, conditionMap, fillCalenderData);
		}
	}

	/**
	 * Create calendar div.
	 * 
	 * @param day
	 */
	function createCalenderDiv(day) {
		renderingEngine.showPageLoading("Preparing search div.");
		if (typeof day == 'object') {
			day = AppConstants.Day.TODAY;
		}
		$("div.search").find('[id="rightCalHeading"]').text(day);
		$('#' + appendCheckinDiv).html('');
		var MILLIS_IN_DAY = 86400000;
		var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;
		scheduledData.sort(dmyOrder);
		var prevDay = "";
		var flag = false;
		currentAppList = new Array();
		var nextWeekMilisecond = new Date().getTime() + MILLIS_IN_WEEK;
		$.each(scheduledData,
				function(index, value) {
					var appointmentVO = new HIN.AppointmentVO();

					appointmentVO = value;
					/*
					 * var fDate = parseDate(CommonUtil.dateFormat(
					 * parseDate(appointmentVO.start), "mediumDate")); var tDate =
					 * parseDate(CommonUtil.dateFormat(new Date(),
					 * "mediumDate"));
					 */

					var fDate = parseDate(appointmentVO.start);
					var tDate = parseDate(new Date());

					/*
					 * if (tDate.getDate() > fDate.getDate()) { return; }
					 */
					if (appointmentVO.start
							&& typeof (appointmentVO.start) == 'object') {
						appointmentVO.start = CommonUtil.dateFormat(
								appointmentVO.start, "fullDateTime");
					}
					if (appointmentVO.start
							&& typeof (appointmentVO.end) == 'object') {
						appointmentVO.end = CommonUtil.dateFormat(
								appointmentVO.end, "fullDateTime");
					}

					if (fDate.getDate() === prevDay
							|| fDate.getDate() === search.defaultFromDate
									.getDate()) {
						prevDay = fDate.getDate();
						flag = true;
					} else {
						prevDay = fDate.getDate();
						flag = false;
					}
					if (fDate.getDate() === search.defaultFromDate.getDate()) {
						currentAppList.push(appointmentVO);
						calendarTemplate(flag, appendCheckinDiv, index,
								appointmentVO);
						return;
					} else if (day === AppConstants.Day.MONTH) {
						currentAppList.push(appointmentVO);
						calendarTemplate(flag, appendCheckinDiv, index,
								appointmentVO);
						return;
					} else if (day === AppConstants.Day.WEEK
							&& nextWeekMilisecond >= fDate.getTime()) {
						currentAppList.push(appointmentVO);
						calendarTemplate(flag, appendCheckinDiv, index,
								appointmentVO);
						return;
					}

				});

		// searchHeight();
		mCustomScrollbars();
		renderingEngine.hidePageLoading();
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);

	}
	;

	var dateRE = /^(\d{2})[\/\- ](\d{2})[\/\- ](\d{4})/;
	/**
	 * Formatt date order.
	 * 
	 * @param a
	 * @param b
	 * @returns {Number}
	 */
	function dmyOrder(vo1, vo2) {

		if (vo1 && vo1.start && vo2 && vo2.start) {
			if (typeof (vo1.start) == 'object') {
				vo1.start = CommonUtil.dateFormat(vo1.start, "fullDateTime");
			}
			if (typeof (vo2.start) == 'object') {
				vo2.start = CommonUtil.dateFormat(vo2.start, "fullDateTime");
			}
			var a = (vo1.start).replace(dateRE, "$3$2$1");
			var b = (vo2.start).replace(dateRE, "$3$2$1");
			if (a > b)
				return 1;
			if (a < b)
				return -1;
			return 0;
		} else {
			return 0;
		}
	}
	;

	/**
	 * returns week in a month.
	 * 
	 * @param date
	 * @returns
	 */
	function getWeekOfMonth(date) {
		var month = date.getMonth(), firstWeekday = new Date(
				date.getFullYear(), month, 1).getDay(), offsetDate = date
				.getDate()
				+ firstWeekday - 1, week = Math.floor(offsetDate / 7), weekInMilliseconds = 7
				* 24 * 60 * 60 * 1000;
		return week === 4 ? week
				+ (month !== new Date(date.getTime() + weekInMilliseconds)
						.getMonth()) : week;
	}
	;

	/**
	 * Show Calendar.
	 * 
	 * @param data
	 */
	var appointmentSchedule = null;
	function showCalender(data) {
		renderingEngine
				.fireEvent(AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED);

		/*
		 * appointmentSchedule = new HIN.AppointmentSchedule("form", false,
		 * function(appointmentVO) { });
		 * 
		 * appointmentSchedule.loadFullCalendar(currentAppList);
		 * renderingEngine.hidePageLoading();
		 */
	}
	;

	/**
	 * fill calendar data
	 * 
	 * @param data
	 */
	function fillCalenderData(data) {
		renderingEngine.showPageLoading("Retrived message");
		// alert("data"+data);
		if (data) {
			scheduledData = [];
			for ( var messageIndex = 0; messageIndex < data.length; messageIndex++) {
				if (data[messageIndex] != null) {
					var message = data[messageIndex];
					var message = factoryClass.createMessage();
					message.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
					message.message = data[messageIndex].message;
					message.messageId = data[messageIndex].messageId;
					retrieveCalendarData(message)
				}
			}
			$("#" + appendCheckinDiv).show();
			$("#" + appendCheckinDiv).html('');
			createCalenderDiv(search.viewTypeDays);
		}
		renderingEngine.hidePageLoading();
	}
	;

	/**
	 * create quries.
	 */
	function makeQuery() {
		var context = renderingEngine.getComponent("Context");
		var queryString = "";
		var tDate = parseDate(CommonUtil.dateFormat(new Date(), "mediumDate"));
		if (context) {
			// var consultantId = context.getConsultant();
			var subscriberId = context.getUserVo().subscriberId;
			// if (consultantId)
			queryString = "id = SUBSCRIBER_ID and effectiveTimeFrom>="
					+ (new Date().getTime() - 86400000);// 86400000
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			query.addCondition(AppConstants.XPaths.Appointment.MESSAGE_TYPE,
					queryString);
			// alert("queryString :"+queryString);
			renderingEngine.getComponent("Context").setCalendarQuery(query);
		}

	}
	;

	/**
	 * get appointment from lucene.
	 */
	function getAppointmentsFromLucene() {
		var conditionMap = new HIN.HashMap();
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/getMessageList";
		searchVO.role = "doctor";
		searchVO.filterColumn = "effectiveTimeFrom";
		searchVO.fromDate = new Date().getTime() - 86400000;
		searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;// "PRPA_MT401000HT02";
	}
	;

	/**
	 * retrieve clalender date.
	 * 
	 * @param message
	 */
	function retrieveCalendarData(message) {
		var appointmentVO = new HIN.AppointmentVO();
		var messageXML = message.message;
		if (messageXML) {
			msg = XmlUtil.stringToXml(messageXML);
			if (msg) {
				appointmentVO.setMessage(msg);
				if (appointmentVO.patientId != ''
						|| appointmentVO.patientId != undefined
						|| appointmentVO.doctorId != '') {
					scheduledData.push(appointmentVO);
				}
			}
		} else {
			// alert("TO DO");
		}
	}
	;

	function clearSearchList() {
		var searchInput = $("#searchData").val().replace(/^\s+|\s+$/g, "");
		var listId = appendSearchDiv;
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		var selectedUserID = renderingEngine.getComponent("Context")
				.getSelectedProfile();
		mCustomScrollbars();
		$("#" + listId).html('');
		$("#searchData").val('');
		if (selectedUserID) {
			selectedUserID = selectedUserID.replace(/\s+/g, '_');
			onSelect(appendCheckinDiv + selectedUserID);
		}
		$("#" + appendCheckinDiv).show();
		mCustomScrollbars();
	}
	;

	function getSearchQuery(searchVO) {
		if (searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH) {
			searchVO.queryString = getPatientSearchSubQuery(searchVO);
		} else if (searchVO.type == AppConstants.SearchType.STAFF_PROFILE_SEARCH) {
			searchVO.queryString = getStaffSearchSubQuery(searchVO);
		} else if (searchVO.type == AppConstants.SearchType.LICENSEE_SEARCH) {
			searchVO.queryString = getLicenseeSearchSubQuery(searchVO);
		}
		return searchVO;
	}
	;
	
	function getPatientSearchSubQuery(searchVO){
		var searchValues = searchVO.value.split(" ");
		var organizationID = renderingEngine.getComponent("Context").getSelectedOrganizationVO().subscriberId;
		var subQuery = "";
		
		if(searchVO.value.length<=0){
			$("#searchData").val('');
			subQuery = "+Role:"+ searchVO.role+ " +subscriberType:"+ searchVO.messageType+ " +organizationId:"+ organizationID +  " +alldoc:all";
		}else if(searchValues.length === 1){
			subQuery = "+Role:"+ searchVO.role+ " +subscriberType:"+ searchVO.messageType+ " +((+organizationId:"+ organizationID+ " +(givenName:" + searchValues[0] + "* familyName:"+ searchValues[0] + "* suffixName:" +searchValues[0]+ "*))(  membershipId:" + searchValues[0] + "))";
		}else if(searchValues.length === 2){
			subQuery = "+Role:"+ searchVO.role+ " +subscriberType:"+ searchVO.messageType+" +((+organizationId:"+ organizationID+ " +(+givenName:" + searchValues[0] + " +(givenName:"+searchValues[1]+"* familyName:"+ searchValues[1] + "* suffixName:" +searchValues[1]+ "*)))(  membershipId:" + searchValues[0] + "))";
		}else if(searchValues.length === 3){
			subQuery ="+Role:"+ searchVO.role+ " +subscriberType:"+ searchVO.messageType+" +((+organizationId:"+ organizationID+ " +(+givenName:" + searchValues[0] + " +familyName:" + searchValues[1] + " +(givenName:"+searchValues[2]+"* familyName:"+ searchValues[2] + "* suffixName:" +searchValues[2]+ "*)))(  membershipId:" + searchValues[0] + "))";
		}
		return subQuery;
	}
	;
	
	function getStaffSearchSubQuery(searchVO){
		var searchValues = searchVO.value.split(" ");
		var organizationID = renderingEngine.getComponent("Context").getSelectedOrganizationVO().subscriberId;
		var subQuery = "";
		
		if(searchVO.value.length<=0){
			$("#searchData").val('');
			subQuery = "+(Role:"+ searchVO.role+ " Role:user Role:doctor) +subscriberType:"+ searchVO.messageType+ " +organizationId:"+ organizationID +  " +alldoc:all";
		}else if(searchValues.length === 1){
			subQuery = "+(Role:"+ searchVO.role+ " Role:user Role:doctor) +subscriberType:"+ searchVO.messageType+ " +organizationId:"+ organizationID+ " +(givenName:" +  searchValues[0] + "* familyName:"+  searchValues[0] + "* suffixName:" +  searchValues[0]+ "*)";
		}else if(searchValues.length === 2){
			subQuery = "+(Role:"+ searchVO.role+ " Role:user Role:doctor) +subscriberType:"+ searchVO.messageType+ " +organizationId:"+ organizationID+ " +(+givenName:" + searchValues[0] + " +(givenName:"+searchValues[1]+"* familyName:"+ searchValues[1] + "* suffixName:" +searchValues[1]+ "*))";
		}else if(searchValues.length === 3){
			subQuery = "+(Role:"+ searchVO.role+ " Role:user Role:doctor) +subscriberType:"+ searchVO.messageType+ " +organizationId:"+ organizationID+ " +(+givenName:" + searchValues[0] + " +familyName:" + searchValues[1] + " +(givenName:"+searchValues[2]+"* familyName:"+ searchValues[2] + "* suffixName:" +searchValues[2]+ "*))";
		}
		return subQuery;
	}
	
	function getLicenseeSearchSubQuery(searchVO){
		var searchValues = searchVO.value.split(" ");
		var organizationID = renderingEngine.getComponent("Context").getSelectedOrganizationVO().subscriberId;
		var subQuery = "";
		
		if(searchVO.value.length<=0){
			$("#searchData").val('');
			subQuery = "+subscriberType:"+ searchVO.messageType + " +alldoc:all";
		}else if(searchValues.length == 1){
			subQuery = "+subscriberType:"+ searchVO.messageType + " +(namePrefix:"+ searchValues[0] +"* nameSuffix:" + searchValues[0]+ "*)";
		}else if(searchValues.length == 2){
			subQuery = "+subscriberType:"+ searchVO.messageType + " +(+namePrefix:"+ searchValues[0] + " +(namePrefix:"+ searchValues[1] +"* nameSuffix:" + searchValues[1]+ "*))";
		}else if(searchValues.length == 3){
			subQuery = "+subscriberType:"+ searchVO.messageType + " +(+namePrefix:"+ searchValues[0] +" +namePrefix:"+ searchValues[1] +" +(namePrefix:"+ searchValues[2] +"* nameSuffix:" + searchValues[2]+ "*))";
		}else if(searchValues.length == 4){
			subQuery = "+subscriberType:"+ searchVO.messageType + " +(+namePrefix:"+ searchValues[0] +" +namePrefix:"+ searchValues[1] +" +namePrefix:"+ searchValues[2] +" +(namePrefix:"+ searchValues[3] +"* nameSuffix:" + searchValues[3]+ "*))";
		}
		return subQuery;
	}
	;

}