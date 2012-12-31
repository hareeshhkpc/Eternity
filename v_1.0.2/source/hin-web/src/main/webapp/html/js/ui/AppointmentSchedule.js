var HIN;
if (!HIN)
	HIN = {};
HIN.AppointmentSchedule = function() {
	appointmentSchedule = this;
};
HIN.AppointmentSchedule = function(id, newScheduleFlag, callback) {
	this.year = new Date().getFullYear();
	this.month = new Date().getMonth();
	this.day = new Date().getDay();
	this.scheduledData = [];
	this.data2 = {};
	this.inputdata = {};
	this.scheduledDate = null;
	this.id = id;
	this.appointmentVO = new HIN.AppointmentVO();
	this.newScheduleFlag = newScheduleFlag;
	this.callback = callback;
	this.defaultView = 'month';
	// this.dayToShow = 3;
	appointmentSchedule = this;
	this.calendarDataCallback = null;
	this.loaded = false;
	this.backPage = null;
	this.newId = 111111;
	this.height = $(window).height();
	appController.getComponent("RenderingEngine").showPageLoading(
			"Calendar creating instance");
};

HIN.AppointmentSchedule.prototype.getEventData = function() {
	return {
		events : this.scheduledData
	};
};
/*******************************************************************************
 * Update the comment messages from the calendar.
 */
HIN.AppointmentSchedule.prototype.updateMessageEvent = function(event) {
	// alert("before : "+event.start+" --->>> "+event.end);
	appController.getComponent("RenderingEngine").showPageLoading(
			"Calendar Message Updating");
	var messageObj = event.msgObject;
	// alert("after : "+XmlUtil.xmlToString(event.message));
	/*
	 * var message = event.message; var comment = event.comment; var messageObj =
	 * event.msgObject; var msg = event.msg;
	 * 
	 * var xPath = AppConstants.XPaths.Appointment.UPDATE_COMMENTS;
	 * XmlUtil.updateXmlUsingpath(messageObj.message, xPath, comment); // var
	 * instance = [ event.msg ];
	 * 
	 * //alert("Task :"+messageObj.taskVO); //alert("Message Type
	 * :"+messageObj.messageType); //alert("Xml Msg :
	 * "+XmlUtil.xmlToString(messageObj.message));
	 */
	var messageObjects = [ messageObj ];
	var parameters = [ messageObjects ];
	appController.getComponent("DataLayer").createOrUpdateTasks(parameters);

	// appController.getComponent("DataLayer").createOrUpdateTasks(instance);
	// alert("After : "+XmlUtil.xmlToString(messageObj.message));
	appController.getComponent("RenderingEngine").hidePageLoading();
};
HIN.AppointmentSchedule.prototype.updateDateMessageEvent = function(event) {
	appController.getComponent("RenderingEngine").showPageLoading(
			"Calendar Message Updating");
	var messageObj = event.msgObject;
	var messageObjects = [ messageObj ];
	var parameters = [ messageObjects ];
	appController.getComponent("DataLayer").createOrUpdateTasks(parameters);
	appController.getComponent("RenderingEngine").hidePageLoading();
};

HIN.AppointmentSchedule.prototype.setupStartAndEndTimeFields = function(
		$startTimeField, $endTimeField, calEvent, timeslotTimes) {

	for ( var i = 0; i < timeslotTimes.length; i++) {
		var startTime = timeslotTimes[i].start;
		var endTime = timeslotTimes[i].end;
		var startSelected = "";
		if (startTime.getTime() === calEvent.start.getTime()) {
			startSelected = "selected=\"selected\"";
		}
		var endSelected = "";
		if (endTime.getTime() === calEvent.end.getTime()) {
			endSelected = "selected=\"selected\"";
		}
		$startTimeField.append("<option value=\"" + startTime + "\" "
				+ startSelected + ">" + timeslotTimes[i].startFormatted
				+ "</option>");
		$endTimeField.append("<option value=\"" + endTime + "\" " + endSelected
				+ ">" + timeslotTimes[i].endFormatted + "</option>");

	}
	$endTimeOptions = $endTimeField.find("option");
	$startTimeField.trigger("change");
};

HIN.AppointmentSchedule.prototype.loadFullCalendar = function(data) {
	appController.getComponent("RenderingEngine").showPageLoading(
			"Loading Fullcalendar");
	var widowHeight = 0;
	var newAppointment = null;
	var year = new Date().getFullYear();
	var month = new Date().getMonth();
	var day = new Date().getDate();
	var cminute = new Date().getMinutes();
	var minute = Math.round(cminute / 15) * 15;
	var scrollSlot = new Date().getHours();
	var dataFlag = false;
	this.appointmentVO = new HIN.AppointmentVO();
	this.appointmentVO.start = CommonUtil.dateFormat(new Date(year, month, day,
			scrollSlot, cminute), "isoDateTime");
	appointmentSchedule.scheduledData = [];
	if (data != undefined && data != null) {
		if ($.isArray(data)) {
			dataFlag = true;
			appointmentSchedule.scheduledData = data;
			appointmentSchedule.loaded = true;
		} else {
			this.appointmentVO = data;
			this.appointmentVO.id = appointmentSchedule.newId;// idGenerator.getId();
			// this.appointmentVO.backgroundColor = '#26370C';
			appointmentSchedule.newScheduleFlag = false;
			this.defaultView = 'agendaWeek';
			scrollSlot = parseDate(this.appointmentVO.start).getHours();

			appointmentSchedule.appointmentVO = this.appointmentVO;
			newAppointment = this.appointmentVO;
			appointmentSchedule.scheduledData.push(this.appointmentVO);
		}
		widowHeight = this.height - 225;
	}

	if (appointmentSchedule.newScheduleFlag) {
		this.appointmentVO = new HIN.AppointmentVO();
		this.appointmentVO.id = appointmentSchedule.newId;
		this.appointmentVO.isCurrent = true;
		this.appointmentVO.title = 'New Appointment';
		this.appointmentVO.backgroundColor = '#26370C';
		this.appointmentVO.start = CommonUtil.dateFormat(new Date(year, month,
				day, new Date().getHours(), minute), "isoDateTime");
		this.defaultView = 'agendaWeek';
		this.appointmentVO.end = CommonUtil.dateFormat(new Date(year, month,
				day, new Date().getHours() + 1, minute), "isoDateTime");
		var physicianVO = appController.getComponent("Context")
				.getPhysicianVO();
		if (physicianVO) {
			this.appointmentVO.doctorId = physicianVO.physicianId;
			this.appointmentVO.doctor = physicianVO.name;
		}
		var patientId = appController.getComponent("Context")
				.getSelectedProfile();
		if (patientId) {
			this.appointmentVO.patientId = patientId;
		}
		var organizationId = appController.getComponent("Context")
				.getSelectedOrganizationVO().subscriberId;

		appointmentSchedule.appointmentVO = this.appointmentVO;
		newAppointment = this.appointmentVO;
		appointmentSchedule.scheduledData.push(this.appointmentVO);
		widowHeight = this.height - 225;
		// alert("Length
		// :"+appController.getComponent("Context").currentScheduledMap.size());
	} else {
		widowHeight = this.height - 160;
	}

	if ($('#' + appointmentSchedule.id).html() !== '') {
		$('#' + appointmentSchedule.id).html('');
		appointmentSchedule.loaded = false;
	}
	var centerBtn = AppConstants.XPaths.Appointment.MAIN_HEADING_BUTTON;
	var isSelectable = false;

	if (this.appointmentVO.isCurrent) {
		centerBtn = AppConstants.XPaths.Appointment.APP_HEADING_BUTTON;
		isSelectable = false;
	}

	$('#' + appointmentSchedule.id)
			.fullCalendar(
					{
						newAppointment : newAppointment,
						scrollSlot : scrollSlot,
						selectedDate : appointmentSchedule.appointmentVO.start,
						defaultView : this.defaultView,
						selectable : isSelectable,
						selectHelper : true,
						// /weekends: false,
						height : widowHeight,/* 700 */
						contentHeight : widowHeight,// 500,
						aspectRatio : 2,
						weekMode : 'variable',
						header : {
							left : 'title',
							center : centerBtn,
							right : 'today prev,next back'
						/*
						 * left : 'title', center :
						 * 'month,agendaWeek,basicWeek,agendaDay,basicDay',
						 * right : 'today prevYear,prev,next,nextYear back'
						 */
						/*
						 * left: 'prev,next today back', center: 'title', right:
						 * 'month,agendaWeek,agendaDay'
						 */
						},
						editable : true,
						disableDragging : false,
						disableResizing : false,
						dragOpacity : 1,/* .5, */
						// /dragOpacity: { agendaWeek: .1 },
						dragRevertDuration : 100,
						isDBUpdateonDrag : AppConstants.XPaths.Appointment.IS_DBUPDATE_ONDRAG,
						allDaySlot : false,
						allDayText : 'ALLDAY',
						firstHour : 10,
						slotMinutes : AppConstants.XPaths.Appointment.SLOT_MINUTES,
						defaultEventMinutes : 45,
						// /axisFormat: "Hmm",
						// /allDayDefault: false,
						/*
						 * titleFormat: { month: "'hey!'" },
						 */
						columnFormat : {
							month : "dddd"
						// agenda: "ddd M/d!!!" // BUG: this wont work. agenda
						// doesn't
						// override our default for 'week'
						},
						timeFormat : "hh(:mm)[TT]{ - hh(:mm)TT}",
						// timeFormat: { agendaWeek: "'YO'" },

						minTime : AppConstants.XPaths.Appointment.MIN_TIME,
						maxTime : AppConstants.XPaths.Appointment.MAX_TIME,
						// dayClick: function(date) {
						// console.log(date);
						// },
						// isRTL: true,

						eventColor : '#73166F',
						eventTextColor : 'white',
						eventBorderColor : 'black',
						// eventBackgroundColor: 'red',
						onChangeSchedule : function(event) {
							appointmentSchedule.updateDateMessageEvent(event);
						},
						editMessageEvent : function(event) {
							appointmentSchedule.updateMessageEvent(event);
						},
						changeState : function() {
							// alert("backPage : " +
							// appointmentSchedule.backPage);
							if (appointmentSchedule.backPage) {
								$("#" + appointmentSchedule.id).hide();
								$('#' + appointmentSchedule.backPage).show();
							} else {
								appointmentSchedule.renderPatient();
							}

						},
						reranderPhysician : function(flag, fromDate, endDate) {
							if (flag) {
								appointmentSchedule.currentViewLoadHandler(
										$('#' + appointmentSchedule.id),
										fromDate, endDate);
							} else {
								appointmentSchedule.calendarAfterLoadHandler(
										$('#' + appointmentSchedule.id),
										fromDate, endDate);
							}
						},
						finishClickEvents : function(event) {
							appointmentSchedule.updateScheduledDate(event);
						},
						events : (dataFlag ? appointmentSchedule.scheduledData
								: null)
					});

	if (!appointmentSchedule.loaded && (!dataFlag)
			&& appointmentSchedule.defaultView != 'month') {
		// alert("Inside : "+appointmentSchedule.loaded);
		appointmentSchedule.loaded = true;
		// appointmentSchedule.calendarAfterLoadHandler(calendar);
	}

};

HIN.AppointmentSchedule.prototype.updateScheduledDate = function(calEvent) {
	this.appointmentVO = calEvent;
	this.appointmentVO.id = idGenerator.getId();
	this.appointmentVO.start = CommonUtil.dateFormat(parseDate(calEvent.start),
			"fullDateTime");
	this.appointmentVO.end = CommonUtil.dateFormat(parseDate(calEvent.end),
			"fullDateTime");
	appController.getComponent("Context").currentScheduledMap.put(
			this.appointmentVO.doctorId, this.appointmentVO);
	if (this.callback) {
		this.callback(this.appointmentVO);
	}

};

HIN.AppointmentSchedule.prototype.calendarAfterLoadHandler = function(calendar,
		fromDate, toDate) {
	var context = null;
	var query = null;
	if (appController) {
		context = appController.getComponent("Context");
		if (context)
			var blockcode = AppConstants.XPaths.Appointment.BLOCK_CODE;
		var blocknonecode = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
		var organizationId = context.getSelectedOrganizationVO().subscriberId;
		var queryString = "+(alldoc:all) +(organizationId:" + organizationId
				+ ")";
		var consultantId = context.getConsultant();
		var conditionMap = new HIN.HashMap();
		if (consultantId) {
			queryString = queryString + " +(consultant:" + consultantId
					+ ") -(messageTitle:" + blocknonecode + ")";
		} else {
			queryString = queryString + " -(messageTitle:" + blocknonecode
					+ ")";
		}
		/***********************************************************************
		 * var date = parseDate(appointmentSchedule.appointmentVO.start);
		 * 
		 * var conDate = new Date(new Date().getFullYear(), new
		 * Date().getMonth(), new Date().getDate()-date.getDay(), new
		 * Date().getHours(), new Date().getMinutes());
		 * 
		 * if(date.getDate()==new Date().getDate() && date.getMonth()==new
		 * Date().getMonth()){ date = new Date(new Date().getFullYear(), new
		 * Date().getMonth(), new Date().getDate(), new Date().getHours(), new
		 * Date() .getMinutes()); }else if(date.getDay() > new Date().getDay() &&
		 * (date.getDay()-new Date().getDay())<6){ date = new Date(new
		 * Date().getFullYear(), new Date().getMonth(), new Date().getDate(),
		 * new Date().getHours(), new Date().getMinutes()); }else if(conDate>new
		 * Date()){ date = conDate; }
		 */

		var subscriberId = context.getUserVo().subscriberId;
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/messageSearchWithCondtion";
		searchVO.id = subscriberId;
		searchVO.max = 100;
		// searchVO.filterColumn = "effectiveTimeFrom";
		searchVO.filterColumn = "effectiveTimeTo";
		searchVO.fromDate = fromDate.getTime();
		searchVO.toDate = toDate.getTime();
		searchVO.queryString = queryString;
		searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
		appController.getComponent("DataLayer").fetchLuceneMessages(searchVO,
				conditionMap, renderCalendar);
	}
	function renderCalendar(data) {
		// alert("Inside calendarAfterLoadHandler : " + data);
		appController.getComponent("RenderingEngine").showPageLoading(
				"Scheduled data fetched.");
		calendar.fullCalendar('removeEvents');
		if (data) {
			for ( var messageIndex = 0; messageIndex < data.length; messageIndex++) {
				if (data[messageIndex].message != null) {
					var message = factoryClass.createMessage();
					message.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
					message.message = data[messageIndex].message;
					message.messageId = data[messageIndex].messageId;
					retrieveData(message);
				}
			}

			$.each(appointmentSchedule.scheduledData, function(index, value) {
				calendar.fullCalendar('renderEvent', value, true);
			});
		} else {
			$.each(appointmentSchedule.scheduledData, function(index, value) {
				calendar.fullCalendar('renderEvent', value, true);
			});
		}
	}
	function retrieveData(message) {
		// alert("retrieveData :"+message);
		var dataLayer = appController.getComponent("DataLayer");
		var messageXML = message.message;
		if (!message.msg) {
			dataLayer.getMessageInternal(message, function(messageId, msg,
					message) {
				updateMessage(message, messageXML);
			}, true);
		} else {
			updateMessage(message, messageXML);
		}
	}
	;
	function updateMessage(message, messageXML) {
		// alert("updateMessage :"+message);
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer
				.getMessageTask(
						message.messageId,
						message,
						dataLayer.getMessageInternal,
						function(messageId, msg, message) {
							var appointmentVO = new HIN.AppointmentVO();
							appointmentVO.setMsg(msg);
							appointmentVO.setMsgObject(message);
							if (messageXML) {
								var msg = XmlUtil.stringToXml(messageXML);
								appointmentVO.setMessage(msg);
								var selectedDate = parseDate(appointmentSchedule.appointmentVO.start);
								var selectedEnd = parseDate(appointmentSchedule.appointmentVO.end);
								if (appointmentVO.start != null
										&& appointmentVO.end != null
										&& selectedDate.getTime() != parseDate(
												appointmentVO.start).getTime()) {
									calendar.fullCalendar('renderEvent',
											appointmentVO, true);
									if ((appointmentSchedule.physicianId == appointmentVO.physicianId)
											&& (selectedDate.getTime() == parseDate(
													appointmentVO.start)
													.getTime())
											|| (selectedDate.getTime() > parseDate(
													appointmentVO.start)
													.getTime() && selectedDate
													.getTime() < parseDate(
													appointmentVO.end)
													.getTime())
											|| (selectedDate.getTime() < parseDate(
													appointmentVO.start)
													.getTime() && parseDate(
													appointmentVO.start)
													.getTime() < selectedEnd
													.getTime())) {

										var dif = selectedEnd.getTime()
												- selectedDate.getTime()
										appointmentSchedule.appointmentVO.start = parseDate(appointmentVO.end);
										appointmentSchedule.appointmentVO.end = new Date(
												parseDate(appointmentVO.end)
														.getTime()
														+ dif);
										calendar
												.fullCalendar(
														'renderEvent',
														appointmentSchedule.appointmentVO,
														true);
									}
								}
							}

						}, false);
	}
	;
	appController.getComponent("RenderingEngine").hidePageLoading();
};

HIN.AppointmentSchedule.prototype.retrieveData = function(message, callBack) {
	var dataLayer = appController.getComponent("DataLayer");
	var messageXML = message.message;
	if (!message.msg) {
		dataLayer.getMessageInternal(message,
				function(messageId, msg, message) {
					appointmentSchedule.updateMessage(message, messageXML,
							callBack);
				}, true);
	} else {
		appointmentSchedule.updateMessage(message, messageXML, callBack);
	}

};
HIN.AppointmentSchedule.prototype.updateMessage = function(message, messageXML,
		callBack) {
	var dataLayer = appController.getComponent("DataLayer");
	dataLayer.getMessageTask(message.messageId, message,
			dataLayer.getMessageInternal, function(messageId, msg, message) {
				var appointmentVO = new HIN.AppointmentVO();
				appointmentVO.setMsg(msg);
				appointmentVO.setMsgObject(message);
				if (messageXML) {
					var msg = XmlUtil.stringToXml(messageXML);
					appointmentVO.setMessage(msg);
					callBack(appointmentVO);
					// if
					// (parseDate(appointmentSchedule.appointmentVO.start).getTime()
					// != parseDate(
					// appointmentVO.start).getTime()) {

					// }
				}

			}, false);
};

HIN.AppointmentSchedule.prototype.renderPatient = function(patientId,
		displayName) {

	var renderingEngine = null;
	var searchVO = null;
	if (appController) {
		renderingEngine = appController.getComponent("RenderingEngine");
		renderingEngine.showPageLoading("Patient home page loading");
		context = renderingEngine.getComponent("Context");
		if (context)
			searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if (searchVO) {
			searchVO.id = patientId;
			searchVO.displayValue = displayName;
		} else {
			searchVO = new HIN.SearchVO();
			searchVO.id = patientId;
			searchVO.displayValue = displayName;
		}
		searchVO.type = AppConstants.SearchType.PATIENT_PROFILE_SEARCH;
		// alert(searchVO.displayValue +" : else searchVO.displayValue :
		// "+searchVO.type);

		if (renderingEngine) {
			/*
			 * renderingEngine
			 * .fireEvent(AppConstants.Event.PATIENT_PAGE_INITIALIZED);
			 */
			renderingEngine.getComponent("Context").setSearchVO(searchVO);
			renderingEngine
					.fireEvent(AppConstants.Event.CALENDAR_PAGE_INITIALIZED);
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT, {},
					renderingEngine, this);
		}
	}
};
HIN.AppointmentSchedule.prototype.renderSelectedDate = function(selectedDate) {
	if (appController) {
		renderingEngine = appController.getComponent("RenderingEngine");
		if (renderingEngine) {
			var searchVO = new HIN.SearchVO();
			searchVO.fromDate = selectedDate;
			renderingEngine.getComponent("Context").setSearchVO(searchVO);
			renderingEngine
					.fireEvent(AppConstants.Event.CALENDAR_PAGE_INITIALIZED);

		}
	}
	// alert("selectedDate :"+selectedDate);
};

HIN.AppointmentSchedule.prototype.currentViewLoadHandler = function(calendar,
		fromDate, todate) {
	var context = null;
	var query = null;
	if (appController) {
		context = appController.getComponent("Context");
		var blockcode = AppConstants.XPaths.Appointment.BLOCK_CODE;
		var blocknonecode = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
		var organizationId = context.getSelectedOrganizationVO().subscriberId;
		var queryString = "+(alldoc:all) +(organizationId:" + organizationId
				+ ")";
		var consultantId = context.getConsultant();
		var conditionMap = new HIN.HashMap();
		if (consultantId) {
			queryString = queryString + " +(consultant:" + consultantId
					+ ") -(messageTitle:" + blocknonecode + ")";
		} else {
			queryString = queryString + " -(messageTitle:" + blocknonecode
					+ ")";
		}
		var d = new Date(new Date().getFullYear(), new Date().getMonth(),
				new Date().getDate(), new Date().getHours(), new Date()
						.getMinutes());
		var subscriberId = context.getUserVo().subscriberId;
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/messageSearchWithCondtion";
		searchVO.id = subscriberId;
		searchVO.max = 100;
		searchVO.filterColumn = "effectiveTimeTo";
		searchVO.fromDate = fromDate.getTime();
		searchVO.toDate = todate.getTime();
		searchVO.queryString = queryString;
		searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
		appController.getComponent("DataLayer").fetchLuceneMessages(searchVO,
				conditionMap, renderCalendar);
	}
	function renderCalendar(data) {
		calendar.fullCalendar('removeEvents');
		if (data) {
			for ( var messageIndex = 0; messageIndex < data.length; messageIndex++) {
				if (data[messageIndex].message != null) {
					var message = factoryClass.createMessage();
					message.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
					message.message = data[messageIndex].message;
					message.messageId = data[messageIndex].messageId;
					retrieveData(message);
				}
			}
			$.each(appointmentSchedule.scheduledData, function(index, value) {
				if (typeof (value.start) == 'object') {
					value.start = CommonUtil.dateFormat(parseDate(value.start),
							"isoDateTime");
					value.end = CommonUtil.dateFormat(parseDate(value.end),
							"isoDateTime");
				}
				calendar.fullCalendar('renderEvent', value);
			});

		}
	}
	function retrieveData(message) {

		var dataLayer = appController.getComponent("DataLayer");
		var messageXML = message.message;
		if (!message.msg) {
			dataLayer.getMessageInternal(message, function(messageId, msg,
					message) {
				updateMessage(message, messageXML);
			}, true);
		} else {
			updateMessage(message, messageXML);
		}

	}

	function updateMessage(message, messageXML) {
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer
				.getMessageTask(
						message.messageId,
						message,
						dataLayer.getMessageInternal,
						function(messageId, msg, message) {
							var appointmentVO = new HIN.AppointmentVO();
							appointmentVO.setMsg(msg);
							appointmentVO.setMsgObject(message);
							if (messageXML) {
								var msg = XmlUtil.stringToXml(messageXML);
								appointmentVO.setMessage(msg);
								var selectedDate = parseDate(appointmentSchedule.appointmentVO.start);
								var selectedEnd = parseDate(appointmentSchedule.appointmentVO.end);
								if (appointmentVO.start != null
										&& appointmentVO.end != null) {
									calendar.fullCalendar('renderEvent',
											appointmentVO);
								}
							}
						}, false);

	}

};

HIN.AppointmentSchedule.prototype.yearCalendarLoadHandler = function(patientId,
		fromDate, toDate, callback) {
	var context = null;
	var query = null;
	var allApp = new Array();
	var AppointmentCallback = callback;
	var conditionMap = new HIN.HashMap();
	var dataCount = 0;
	var dataArray = new Array;
	if (appController) {
		context = appController.getComponent("Context");
		var queryString = " +(subscriberId:" + patientId + ")";

		// var subscriberId = context.getUserVo().subscriberId;
		var searchVO = new HIN.SearchVO();
		searchVO.serverURI = "/hin-web/rest/search/messageSearchWithCondtion";
		searchVO.id = patientId;
		searchVO.max = 100;
		// searchVO.filterColumn = "effectiveTimeFrom";
		searchVO.filterColumn = "effectiveTimeTo";
		searchVO.fromDate = fromDate.getTime();
		searchVO.toDate = toDate.getTime();
		searchVO.queryString = queryString;
		searchVO.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
		appController.getComponent("DataLayer").fetchLuceneMessages(searchVO,
				conditionMap, loadData);
		// return allApp;

	}
	function loadData(data) {
		dataArray = data;
		dataCount = 0;
		renderCalendar(dataCount);
	}
	function renderCalendar(messageIndex) {
		if (messageIndex < dataArray.length) {
			if (dataArray[messageIndex].message != null) {
				var message = factoryClass.createMessage();
				message.messageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
				message.message = dataArray[messageIndex].message;
				message.messageId = dataArray[messageIndex].messageId;
				retrieveData(message);
			}
		} else {
			if (AppointmentCallback) {
				AppointmentCallback(allApp);
			}
		}
	}
	;
	function retrieveData(message) {
		// alert("retrieveData :"+message);
		var dataLayer = appController.getComponent("DataLayer");
		var messageXML = message.message;
		if (!message.msg) {
			dataLayer.getMessageInternal(message, function(messageId, msg,
					message) {
				updateMessage(message, messageXML);
			}, true);
		} else {
			updateMessage(message, messageXML);
		}
	}
	;
	function updateMessage(message, messageXML) {
		// alert("updateMessage :"+message);
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer.getMessageTask(message.messageId, message,
				dataLayer.getMessageInternal,
				function(messageId, msg, message) {
					var appointmentVO = new HIN.AppointmentVO();
					appointmentVO.setMsg(msg);
					appointmentVO.setMsgObject(message);
					if (messageXML) {
						var msg = XmlUtil.stringToXml(messageXML);
						appointmentVO.setMessage(msg);
						if (appointmentVO.start != null
								&& appointmentVO.end != null) {
							allApp.push(appointmentVO);
							// alert("allApp: "+allApp.length);
						}
					}

				}, false);
		renderCalendar(dataCount++);
	}
	;
};