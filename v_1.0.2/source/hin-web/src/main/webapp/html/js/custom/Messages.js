/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Messages(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Messages";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var messages = this;
	var appendSearchDiv = "userList";
	var selectedUser = null;
	var searchFromText = "Patient Search";
	/* Function definitions */

	function eventHandler(event) {
		// alert("inside login event handler: " + event.type);
		if (event.type == AppConstants.Event.MESSAGES_PAGE_BIND_EVENTS) {
			searchPageBindEvents();
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.MESSAGES_WEBSOCKET_LOGIN_EVENTS, {},
					renderingEngine, messages);
		} else if (event.type == AppConstants.Event.PROGRAM_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.PROGRAM_PAGE_ERROR) {

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

		renderingEngine.loadPage("pages/messages/template.html", "form",
				AppConstants.Event.MESSAGES_PAGE_BIND_EVENTS);
		var userVo = renderingEngine.getComponent("Context").getUserVo();
		// alert(""+userVo);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.MESSAGES_USER_LOGGEDIN, {
					profileId : userVo.subscriberId,
					name : userVo.userName
				}, renderingEngine, messages);
	}
	;
	this.searchPageBindEvents = searchPageBindEvents;
	function searchPageBindEvents() {
		renderingEngine.getComponent("Context").clearSelectedProfileContext();
		$("#searchData").keyup( function(event) {
			searchData(event);
		});
		$('#searchData').focus();
		if (searchFromText) {
			$("#searchData").attr('placeholder', searchFromText);
		}
	}
	;
	this.searchData = searchData;
	function searchData(event) {
		var listId = appendSearchDiv;
		var searchVO = messages.getSearchVo();
		searchVO.value = $("#searchData").val().replace(/^\s+|\s+$/g, "");
		if (searchVO.value.length >= searchVO.min || event.keyCode === 32) {
			$("#" + appendSearchDiv).hide();
			mCustomScrollbars();
			searchVO.max = (event.keyCode === 32 && searchVO.value.length <= 0) ? 6
					: 4;
			processSearchData(searchVO);
		} else if (searchVO.value.length <= 0) {
			clearSearchList();
		} else {
			$("#" + listId).html("");
		}
	}
	;
	this.getSearchVo = getSearchVo;
	function getSearchVo() {
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "patient";
		searchVO.messageType = "PRPA_MT201000HT03";
		searchVO.placeHolder = "Patient Search";
		return searchVO;
	}
	;
	this.processSearchData = processSearchData;
	function processSearchData(searchVO) {
		var conditionMap = new HIN.HashMap();
		conditionMap.put("organizationId", renderingEngine.getComponent(
				"Context").getSelectedOrganizationVO().subscriberId);
		renderingEngine.showPageLoading("Searching");
		searchVO = getSearchQuery(searchVO);
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.getComponent("DataLayer").search(searchVO,
				conditionMap, searchPageResponse);
	}
	;
	this.searchPageResponse = searchPageResponse;
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
	this.userSearchResult = userSearchResult;
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
	this.listNotificationTemplate = listNotificationTemplate;
	function listNotificationTemplate(result, searchVO, listId) {
		if (result.length < 0) {
			var listNotification = listNotificationSubTemplate(
					"zero results found", listId);
			$("#" + listId).append(listNotification);
		}
	}
	this.searchTemplate = searchTemplate;
	function searchTemplate(listId, key, value, searchVO) {
		if (!value.imageBase64) {
			value.imageBase64 = "images/user.png";
			typeBaseSearchTemplate(listId, key, value, searchVO);

		} else {
			typeBaseSearchTemplate(listId, key, value, searchVO);
		}
		$("#" + listId + key).click( function() {
			//$("#searchData").val('');
				// $("#" + listId).html('');
				mCustomScrollbars();
				onSelect(appendSearchDiv + key, value.subscriberId);
				navigateProfile(key, value, listId);
			});

		var patientId = renderingEngine.getComponent("Context")
				.getSelectedProfile();
		if (patientId == value.subscriberId) {
			onSelect(listId + key, value.subscriberId);
		}
	}
	;
	this.typeBaseSearchTemplate = typeBaseSearchTemplate;
	function typeBaseSearchTemplate(listId, key, value, searchVO) {
		var resultListTemplate = "";
		resultListTemplate = searchSubTemplate(listId, key, value);
		$("#" + listId).append(resultListTemplate);

	}
	;
	this.searchSubTemplate = searchSubTemplate;
	function searchSubTemplate(listId, key, value) {
		var resultList = '<li style="margin-bottom:2px; padding:3px;border-radius:4px;" class="ui-shadow-inset" data-theme="c" id="';
		resultList += listId;
		resultList += key;
		resultList += '"><a href="#"><div class="ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit"><div class="ui-search-image"><img style="max-width:100%;" src="';
		resultList += value.imageBase64;
		resultList += '"></div><b><div class="ui-search-list">';
		resultList += value.name;
		resultList += '</b><br><div id="status';
		resultList += key;
		resultList += '">&nbsp;</div><br></div></a><div class="ui-li-aside inactive"><strong></strong></div></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow"></span></div></a></li>';
		return resultList;
	}
	;
	this.onSelect = onSelect;
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
	this.listNotificationSubTemplate = listNotificationSubTemplate;
	function listNotificationSubTemplate(message, listId) {
		var listNotification = '<li id="fetchmoreuser_';
		listNotification += listId;
		listNotification += '" data-theme="c" style="color: #000000;position:relative;left:0px;width:90%;" class="ui-corner-all ui-li ui-li-static ui-list-bottom shadow"><div class="ui-arrow-position">';
		listNotification += message;
		listNotification += '</div> </li>';
		return listNotification;
	}
	;
	this.navigateProfile = navigateProfile;
	function navigateProfile(key, value, listId) {
		renderingEngine.getComponent("Context").setCheckinState(value.state);
		var selectedUserID = value.subscriberId.replace(/\s+/g, '_');
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		searchVO.id = value.subscriberId;
		searchVO.displayValue = value.name;
		renderingEngine.getComponent("Context").setSelectedProfile(
				value.subscriberId);
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		mCustomScrollbars();
		$("#" + appendSearchDiv).show();
		renderingEngine.setFormName("Patient Chat");
		$("#" + appendSearchDiv).show();
		renderingEngine.showPageLoading("Patient chat page loading");
		/*
		 * renderingEngine.getEventQueue().postEvent(
		 * AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT, {}, renderingEngine,
		 * search);
		 */
		createChatElement(key, value);
	}
	;
	this.mCustomScrollbars = mCustomScrollbars;
	function mCustomScrollbars() {
		$("#mcs_container").mCustomScrollbar("vertical", 0, "easeOutCirc", 0,
				"auto", "yes", "yes", 0);
		if (jQuery.browser.mobile == true) {
			$("#mcs_container").mCustomScrollbarMobile("vertical", 200, 5);
		}
	}
	;
	this.getSearchQuery = getSearchQuery;
	function getSearchQuery(searchVO) {
		/*if (searchVO.type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH) {
			searchVO.queryString = getPatientSearchSubQuery(searchVO);
		} else if (searchVO.type == AppConstants.SearchType.STAFF_PROFILE_SEARCH) {
			searchVO.queryString = getStaffSearchSubQuery(searchVO);
		} else if (searchVO.type == AppConstants.SearchType.LICENSEE_SEARCH) {
			searchVO.queryString = getLicenseeSearchSubQuery(searchVO);
		}*/
		searchVO.queryString = getPatientSearchSubQuery(searchVO);
		return searchVO;
	}
	;
	this.getPatientSearchSubQuery = getPatientSearchSubQuery;
	function getPatientSearchSubQuery(searchVO) {
		var searchValues = searchVO.value.split(" ");
		var organizationID = renderingEngine.getComponent("Context")
				.getSelectedOrganizationVO().subscriberId;
		var subQuery = "";

		if (searchVO.value.length <= 0) {
			$("#searchData").val('');
			subQuery = "+Role:" + searchVO.role + " +subscriberType:"
					+ searchVO.messageType + " +organizationId:"
					+ organizationID + " +alldoc:all";
		} else if (searchValues.length === 1) {
			subQuery = "+Role:" + searchVO.role + " +subscriberType:"
					+ searchVO.messageType + " +((+organizationId:"
					+ organizationID + " +(givenName:" + searchValues[0]
					+ "* familyName:" + searchValues[0] + "* suffixName:"
					+ searchValues[0] + "*))(  membershipId:" + searchValues[0]
					+ "))";
		} else if (searchValues.length === 2) {
			subQuery = "+Role:" + searchVO.role + " +subscriberType:"
					+ searchVO.messageType + " +((+organizationId:"
					+ organizationID + " +(+givenName:" + searchValues[0]
					+ " +(givenName:" + searchValues[1] + "* familyName:"
					+ searchValues[1] + "* suffixName:" + searchValues[1]
					+ "*)))(  membershipId:" + searchValues[0] + "))";
		} else if (searchValues.length === 3) {
			subQuery = "+Role:" + searchVO.role + " +subscriberType:"
					+ searchVO.messageType + " +((+organizationId:"
					+ organizationID + " +(+givenName:" + searchValues[0]
					+ " +familyName:" + searchValues[1] + " +(givenName:"
					+ searchValues[2] + "* familyName:" + searchValues[2]
					+ "* suffixName:" + searchValues[2]
					+ "*)))(  membershipId:" + searchValues[0] + "))";
		}
		return subQuery;
	}
	;
	this.clearSearchList = clearSearchList;
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
		$("#" + appendSearchDiv).show();
		mCustomScrollbars();
	}
	;
	function createTab(name) {
		var element = $('<div class="easyui-tabs" style="width:904px;height:208px;">');
		var tabElement = $('<div title="' + name + '" class="chat-element">'
				+ name + '</div>');
		tabElement.appendTo(element);
		$('#charting').append(element);
	}
	this.createChatElement = createChatElement;
	function createChatElement(key, value) {
		var subscriberId = (value.subscriberId).replace(/\-/g, '_');
		if ($('#' + subscriberId).html() == null) {
			var element = $('<div class="easyui-tabs" id="' + subscriberId + '">');
			var tabElement = $('<div id="chatheader_' + subscriberId
					+ '" title="' + value.name
					+ '" class="chat-element chat-redious-all">' + value.name
					+ '</div>');
			tabElement.click( function() {
				renderingEngine.getComponent("Context").setProfileVO(value);
				renderingEngine.getEventQueue().postEvent(
						AppConstants.Event.MESSAGES_OPEN_CONTACT_EVENTS, {
							profileId : subscriberId,
							name : value.name
						}, renderingEngine, messages);
			});
			var removeElement = $('<span id="remove_' + subscriberId + '" class="removeIcon"></span>');
			removeElement.click( function() {
				element.remove();
			});
			removeElement.appendTo(element);
			var element2 = $('<div id="chat2_' + subscriberId + '" class="chat-head" style="display:none"></div>');
			tabElement.appendTo(element);
			element2.appendTo(element);
			$('#charting').append(element);
		} else {
			$('#chatheader_' + subscriberId)
					.click(
							function() {
								renderingEngine
										.getEventQueue()
										.postEvent(
												AppConstants.Event.MESSAGES_OPEN_CONTACT_EVENTS,
												{
													profileId : subscriberId
												}, renderingEngine, messages);
							});
		}
	}

}
