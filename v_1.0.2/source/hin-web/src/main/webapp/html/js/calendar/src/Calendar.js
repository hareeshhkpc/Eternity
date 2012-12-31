function Calendar(element, options, eventSources) {
	var t = this;

	// exports
	t.options = options;
	t.render = render;
	t.destroy = destroy;
	t.refetchEvents = refetchEvents;
	t.reportEvents = reportEvents;
	t.reportEventChange = reportEventChange;
	t.rerenderEvents = rerenderEvents;
	t.changeView = changeView;
	t.select = select;
	t.back = back;
	t.block = block;
	t.physician = physician;
	t.unselect = unselect;
	t.prev = prev;
	t.next = next;
	t.prevYear = prevYear;
	t.nextYear = nextYear;
	t.today = today;
	t.gotoDate = gotoDate;
	t.incrementDate = incrementDate;
	t.formatDate = function(format, date) {
		return formatDate(format, date, options)
	};
	t.formatDates = function(format, date1, date2) {
		return formatDates(format, date1, date2, options)
	};
	t.getDate = getDate;
	t.getView = getView;
	t.option = option;
	t.trigger = trigger;
	t.viewClickEvents = viewClickEvents;
	t.gotoNext = gotoNext;
	t.gotoPrevious = gotoPrevious;
	t.eventEditComment = eventEditComment;
	t.createCommentPosition = createCommentPosition;
	t.createBlockCommentPosition = createBlockCommentPosition;
	t.removeBlockSlot = removeBlockSlot;
	t.createBlockAppointment = createBlockAppointment;
	t.updatedEvent = updatedEvent;
	t.clickToMoveEvent = clickToMoveEvent;
	t.createBlockEvent = createBlockEvent;
	t.onSelectPhysician = onSelectPhysician;
	t.reScheduleEvent = reScheduleEvent;

	// imports
	EventManager.call(t, options, eventSources);
	var isFetchNeeded = t.isFetchNeeded;
	var fetchEvents = t.fetchEvents;

	// locals
	var _element = element[0];
	var header;
	var headerElement;
	var content;
	var tm; // for making theme classes
	var currentView;
	var viewInstances = {};
	var elementOuterWidth;
	var suggestedViewHeight;
	var absoluteViewElement;
	var resizeUID = 0;
	var ignoreWindowResize = 0;
	var date = new Date();
	var events = [];
	var _dragElement;
	var onChangeSchedule = options.onChangeSchedule;
	var changeState = options.changeState;
	var finishClickEvents = options.finishClickEvents;
	var timeSlot = options.scrollSlot;
	var newAppointment = options.newAppointment;
	var editMessageEvent = options.editMessageEvent;
	var addNewSlot = options.addNewSlot;
	var blockReasone;
	var blockId = 11007;
	var reranderPhysician = options.reranderPhysician;

	/*
	 * Main Rendering
	 * -----------------------------------------------------------------------------
	 */
	date = parseDate(options.selectedDate);
	setYMD(date, options.year, options.month, options.date);

	function render(inc) {
		if (!content) {
			initialRender();
		} else {
			calcSize();
			markSizesDirty();
			markEventsDirty();
			renderView(inc);
		}
	}
	function viewClickEvents(event, eventElement) {
		if (event.id == blockId) {
			createBlockCommentPosition(event, eventElement);
		} else {
			finishClickEvents(event);
		}
	}
	function eventEditComment(event) {
		editMessageEvent(event);
		return;
	}

	function initialRender() {
		tm = options.theme ? 'ui' : 'fc';
		element.addClass('fc');
		if (options.isRTL) {
			element.addClass('fc-rtl');
		}
		if (options.theme) {
			element.addClass('ui-widget');
		}
		content = $("<div class='fc-content' style='position:relative'/>")
				.prependTo(element);
		header = new Header(t, options);
		headerElement = header.render();
		if (headerElement) {
			element.prepend(headerElement);
		}
		changeView(options.defaultView);
		$(window).resize(windowResize);
		// needed for IE in a 0x0 iframe, b/c when it is resized, never triggers
		// a windowResize
		if (!bodyVisible()) {
			lateRender();
		}
	}

	// called when we know the calendar couldn't be rendered when it was initialized,
	// but we think it's ready now
	function lateRender() {
		setTimeout( function() { // IE7 needs this so dimensions are calculated correctly
					if (!currentView.start && bodyVisible()) { // !currentView.start makes sure this never happens more than once
						renderView();
					}
				}, 0);
	}

	function destroy() {
		$(window).unbind('resize', windowResize);
		header.destroy();
		content.remove();
		element.removeClass('fc fc-rtl ui-widget');
	}

	function elementVisible() {
		return _element.offsetWidth !== 0;
	}

	function bodyVisible() {
		return $('body')[0].offsetWidth !== 0;
	}
	function onSelectPhysician(){
		//renderView();
		var flag = false;
		var fromDate = currentView.start;
		var endDate = currentView.end;
		if (fromDate < new Date()) {
			fromDate = new Date();
		}
		if(options.defaultView == 'month') {
			/*var physicianVO = new HIN.PhysicianVO();
			physicianVO.name = "All Physicians";
			physicianVO.physicianId = "";
			appController.getComponent("Context").setPhysicianVO(physicianVO);*/
			flag = true;
		}else{
			var appVo = appController.getComponent("Context").getPhysicianVO();
			if(appVo && appVo.physicianId){
				header.updatePhysician(appVo.name);		
				appController.getComponent("Context").setConsultant(appVo.physicianId);
			}
		}
		reranderPhysician(flag,fromDate,endDate);
	}
	function reScheduleEvent(event){
		if (options.defaultView == 'month' 
			&& (currentView.name == 'agendaWeek' || currentView.name == 'agendaDay')) {
			if(event.reScheduled==true){
				event.reScheduled = false;
				event.start = parseDate(event.start);
				event.end = parseDate(event.end);
				reportEventChange(event);
			}else{
				removereSchedule();
				event.reScheduled = true;
			}		
			rerenderEvents(event.id);
		}
	}
	function removereSchedule(){
		var i, even, len = events.length;
		for (i = 0; i < len; i++) {
			even = events[i];
			if (even.reScheduled==true) {
				even.reScheduled = false;				
				return;
			}
		}
	}

	/* View Rendering
	-----------------------------------------------------------------------------*/

	// TODO: improve view switching (still weird transition in IE, and FF has
	// whiteout problem)
	function changeView(newViewName) {
		if (!currentView || newViewName != currentView.name) {
			ignoreWindowResize++; // because setMinHeight might change the
			// height before render (and subsequently
			// setSize) is reached

			unselect();

			var oldView = currentView;
			var newViewElement;

			if (oldView) {
				(oldView.beforeHide || noop)(); // called before changing
				// min-height. if called after,
				// scroll state is reset (in
				// Opera)
				setMinHeight(content, content.height());
				oldView.element.hide();

			} else {
				setMinHeight(content, 1); // needs to be 1 (not 0) for IE7, or
				// else view dimensions
				// miscalculated
			}
			content.css('overflow', 'hidden');
			currentView = viewInstances[newViewName];
			if (currentView) {
				currentView.element.show();
			} else {
				currentView = viewInstances[newViewName] = new fcViews[newViewName](
						newViewElement = absoluteViewElement = $(
								"<div class='fc-view fc-view-" + newViewName
										+ "' style='position:absolute'/>")
								.appendTo(content), t // the calendar object
				);
			}

			if (oldView) {
				header.deactivateButton(oldView.name);
			}
			header.activateButton(newViewName);
			// alert("selectedWeek: "+selectedWeek);
			renderView(); // after height has been set, will make
			// absoluteViewElement's position=relative, then set
			// to null
			/*
			 * if (!oldView && selectedWeek != 0) { for ( var i = 0; i <
			 * selectedWeek; i++) { renderView(1); } }
			 */
			content.css('overflow', '');
			if (oldView) {
				setMinHeight(content, 1);
			}

			if (!newViewElement) {
				(currentView.afterShow || noop)(); // called after setting
				// min-height/overflow, so
				// in final scroll state
				// (for Opera)
			}

			ignoreWindowResize--;
		}
	}

	function renderView(inc) {
		if (elementVisible()) {
			ignoreWindowResize++; // because renderEvents might temporarily
			// change the height before setSize is
			// reached

			unselect();

			if (suggestedViewHeight === undefined) {
				calcSize();
			}
			var forceEventRender = false;
			if (!currentView.start || inc || date < currentView.start
					|| date >= currentView.end) {
				// view must render an entire new date range (and refetch/render events)
				currentView.render(date, inc || 0); // responsible for clearing
				// events
				setSize(true);
				forceEventRender = true;
			} else if (currentView.sizeDirty) {
				// view must resize (and rerender events)
				currentView.clearEvents();
				setSize();
				forceEventRender = true;
			} else if (currentView.eventsDirty) {
				currentView.clearEvents();
				forceEventRender = true;
			}
			//currentView.showData();// new Added Data
			// Retrive the selected Date between
			// Only for main Calendar
			updateTodayTitle();
			onSelectPhysician();
			if (options.defaultView == 'month') {
				if (currentView.name == 'agendaWeek'
						|| currentView.name == 'agendaDay') {
					header.enableButton('block');
				} else {
					header.disableButton('block');
					header.activeId = 0;
					header.deactivateButton('block');
				}
			}
			/*if (options.defaultView == 'month') {
			//if (currentView.name) {
				if (currentView.name == 'agendaWeek'
						|| currentView.name == 'agendaDay') {
					header.enableButton('block');
				} else {
					header.disableButton('block');
				}
				var appCal = new HIN.AppointmentSchedule();
				var fromDate = currentView.start;
				if (fromDate < new Date()) {
					fromDate = new Date();
				}
				var calendar = $('#calendarPage');
				if (options.defaultView == 'month'){
					calendar = $('#appcalendar');
				}
				//getAppointmentData(t,fromDate,currentView.end);
				appCal.currentViewLoadHandler(calendar, fromDate,
						currentView.end);
			}
*/
			currentView.sizeDirty = false;
			currentView.eventsDirty = false;
			updateEvents(forceEventRender);

			elementOuterWidth = element.outerWidth();

			header.updateTitle(currentView.title);
			var today = new Date();
			if (today >= currentView.start && today < currentView.end) {
				header.disableButton('today');
			} else {
				header.enableButton('today');
			}

			ignoreWindowResize--;
			currentView.trigger('viewDisplay', _element);
			scrollToHour();
		}

	}
	function updateTodayTitle(){
		if (currentView.name == 'agendaWeek'){
			header.updateTodayTitle("Current Week");
		}else if(currentView.name == 'agendaDay'){
			header.updateTodayTitle("Day");
		}else if(currentView.name == 'month'){
			header.updateTodayTitle("Current Month");
		}
	}

	function scrollToHour() {
		var hour = timeSlot;
		var $scrollable = $(currentView.element).find("#scroll-slots");
		var $target = $(currentView.element).find(
				".fc-slot" + (hour - AppConstants.XPaths.Appointment.MIN_TIME)
						* 4);
		// alert(hour+""+$target.html()+""+currentView.element.html());
		$target.scroll();
		$scrollable.animate( {
			scrollTop : 0
		}, 0, function() {
			var targetOffset = $target.offset().top;
			var scroll = targetOffset - $scrollable.offset().top
					- $target.outerHeight();
			$scrollable.animate( {
				scrollTop : scroll
			}, 500);
		});
	}

	/* Resizing
	-----------------------------------------------------------------------------*/

	function updateSize() {
		markSizesDirty();
		if (elementVisible()) {
			calcSize();
			setSize();
			unselect();
			currentView.clearEvents();
			currentView.renderEvents(events);
			currentView.sizeDirty = false;
			if(options.defaultView == 'agendaWeek'){
				//events.push(newAppointment);
			}
		}
		
	}

	function markSizesDirty() {
		$.each(viewInstances, function(i, inst) {
			inst.sizeDirty = true;
		});
	}

	function calcSize() {
		if (options.contentHeight) {
			suggestedViewHeight = options.contentHeight;
		} else if (options.height) {
			suggestedViewHeight = options.height
					- (headerElement ? headerElement.height() : 0)
					- vsides(content);
		} else {
			suggestedViewHeight = Math.round(content.width()
					/ Math.max(options.aspectRatio, .5));
		}
	}

	function setSize(dateChanged) { // todo: dateChanged?
		ignoreWindowResize++;
		currentView.setHeight(suggestedViewHeight, dateChanged);
		if (absoluteViewElement) {
			absoluteViewElement.css('position', 'relative');
			absoluteViewElement = null;
		}
		currentView.setWidth(content.width(), dateChanged);
		ignoreWindowResize--;
	}

	function windowResize() {
		if (!ignoreWindowResize) {
			if (currentView.start) { // view has already been rendered
				var uid = ++resizeUID;
				setTimeout( function() { // add a delay
							if (uid == resizeUID && !ignoreWindowResize
									&& elementVisible()) {
								if (elementOuterWidth != (elementOuterWidth = element
										.outerWidth())) {
									ignoreWindowResize++; // in case the
									// windowResize
									// callback changes
									// the height
									updateSize();
									currentView.trigger('windowResize',
											_element);
									ignoreWindowResize--;
								}
							}
						}, 200);
			} else {
				// calendar must have been initialized in a 0x0 iframe that has just been resized
				lateRender();
			}
		}
	}

	/* Event Fetching/Rendering
	-----------------------------------------------------------------------------*/

	// fetches events if necessary, rerenders events if necessary (or if forced)
	function updateEvents(forceRender) {
		if (!options.lazyFetching
				|| isFetchNeeded(currentView.visStart, currentView.visEnd)) {
			refetchEvents();
		} else if (forceRender) {
			rerenderEvents();
		}
	}

	function refetchEvents() {
		fetchEvents(currentView.visStart, currentView.visEnd); // will call
		// reportEvents
	}

	// called when event data arrives
	function reportEvents(_events) {
		events = _events;
		rerenderEvents();
	}

	// called when a single event's data has been changed
	function reportEventChange(event) {// event is change from eventID	
		rerenderEvents(event.id);		
		var currentObj = event;
		date = currentObj.start;
		if (options.isDBUpdateonDrag && currentObj.isCurrent == false && options.defaultView=='month') {
			var $scrollable = $(currentView.element).find("#scroll-slots");
			var parentContainerID = $scrollable.find("#dragable-" + currentObj.id)
					.attr("id");
			var message = currentObj.msg;
			var messageAndUIBinder = new MessageAndUIBinder(parentContainerID,
					message, AppConstants.XPaths.Appointment.MESSAGE_TYPE);
			if (messageAndUIBinder) {
				var lookupHandler = appController.getComponent("DataLayer").lookupHandler;
				messageAndUIBinder.loadDataOntoForm(lookupHandler);
				messageAndUIBinder.bindFieldEvents();

				var fields = "";
				var type = "IVL_TS";
				var tagName = "effectiveTime";
				var pathFields = fields.split(',');
				currentObj.start = CommonUtil.dateFormat(parseDate(currentObj.start),
						"fullDateTime");
				currentObj.end = CommonUtil.dateFormat(parseDate(currentObj.end),
						"fullDateTime");
				instanceObject = [ currentObj.start, currentObj.end ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject);
				messageAndUIBinder.bindFieldEvents();
				$(messageAndUIBinder.parentContainerID).trigger("change");
			}
			currentObj.start = parseDate(currentObj.start);
			currentObj.end = parseDate(currentObj.end);			
			onChangeSchedule(currentObj);	
		}
	}

	// attempts to rerenderEvents
	function rerenderEvents(modifiedEventID) {
		markEventsDirty();
		if (elementVisible()) {
			currentView.clearEvents();
			currentView.renderEvents(events, modifiedEventID);
			currentView.eventsDirty = false;
		}
	}

	function markEventsDirty() {
		$.each(viewInstances, function(i, inst) {
			inst.eventsDirty = true;
		});
	}

	/* Selection
	-----------------------------------------------------------------------------*/

	function select(start, end, allDay) {
		currentView.select(start, end, allDay === undefined ? true : allDay);
	}

	function unselect() { // safe to be called before renderView
		if (currentView) {
			currentView.unselect();
		}
	}

	/* Date
	-----------------------------------------------------------------------------*/

	function prev() {
		date = currentView.start;
		renderView(-1);
	}

	function next() {
		date = currentView.start;
		renderView(1);
	}

	function prevYear() {
		addYears(date, -1);
		renderView();
	}

	function nextYear() {
		addYears(date, 1);
		renderView();
	}

	function today() {
		date = new Date();
		renderView();
	}

	function back() {
		changeState();
	}

	function block() {
		var physicianVO = appController.getComponent("Context").getPhysicianVO();
		if(!physicianVO.physicianId){
			header.physicianAlart("Select Physician");
			return;
		}
		header.enableDisableButton('block');
		// alert("Block"+header.activeId);
	}
	function physician() {
		header.selectPhysician();
	}
	

	function gotoDate(year, month, dateOfMonth) {
		if (year instanceof Date) {
			date = cloneDate(year); // provided 1 argument, a Date
		} else {
			setYMD(date, year, month, dateOfMonth);
		}
		renderView();
	}

	function incrementDate(years, months, days) {
		if (years !== undefined) {
			addYears(date, years);
		}
		if (months !== undefined) {
			addMonths(date, months);
		}
		if (days !== undefined) {
			addDays(date, days);
		}
		renderView();
	}

	function getDate() {
		return cloneDate(date);
	}

	/* Misc
	-----------------------------------------------------------------------------*/

	function getView() {
		return currentView;
	}

	function option(name, value) {
		if (value === undefined) {
			return options[name];
		}
		if (name == 'height' || name == 'contentHeight'
				|| name == 'aspectRatio') {
			options[name] = value;
			updateSize();
		}
	}

	function trigger(name, thisObj) {
		if (options[name]) {
			return options[name].apply(thisObj || _element,
					Array.prototype.slice.call(arguments, 2));
		}
	}
	function updatedEvent(event) {
		if (options.defaultView != 'month') {	
			event.start = parseDate(event.start);
			event.end = parseDate(event.end);
			timeSlot = (event.start).getHours();
			date = event.start;
		}
	}

	function gotoNext(event) {
		var moveTo = moveTimeMillis();
		event.start = new Date(parseDate(event.start).getTime() + moveTo);
		event.end = new Date(parseDate(event.end).getTime() + moveTo);
		timeSlot = (event.start).getHours();
		renderView(1);
		// next()
	}
	function gotoPrevious(event) {
		var moveTo = moveTimeMillis();
		event.start = new Date(parseDate(event.start).getTime() - moveTo);
		event.end = new Date(parseDate(event.end).getTime() - moveTo);
		timeSlot = (event.start).getHours();
		renderView(-1);
		// prev();
	}
	function moveTimeMillis() {
		var moveTo = 0;
		if (currentView.name == "month") {
			moveTo = MILLIS_IN_MONTH;
		} else if (currentView.name == "agendaWeek") {
			moveTo = MILLIS_IN_WEEK;
		} else if (currentView.name == "agendaDay") {
			moveTo = MILLIS_IN_DAY;
		}
		return moveTo;
	}

	var MILLIS_IN_DAY = 86400000;
	var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;
	var MILLIS_IN_MONTH = MILLIS_IN_DAY * 30;

	/*
	 * External Dragging
	 * ------------------------------------------------------------------------
	 */

	if (options.droppable) {
		$(document).bind(
				'dragstart',
				function(ev, ui) {
					var _e = ev.target;
					var e = $(_e);
					if (!e.parents('.fc').length) { // not already inside a calendar
						var accept = options.dropAccept;
						if ($.isFunction(accept) ? accept.call(_e, e) : e
								.is(accept)) {
							_dragElement = _e;
							currentView.dragStart(_dragElement, ev, ui);
						}
					}
				}).bind('dragstop', function(ev, ui) {
			if (_dragElement) {
				currentView.dragStop(_dragElement, ev, ui);
				_dragElement = null;
			}
		});
	}
	
	/**
	 * Comments update
	 * @param event
	 * @param element
	 * @return
	 */
	
	
	function createCommentPosition(event, element) {
		var hour = (event.start).getHours();
		var day = (event.start).getDay();
		var cssArrow = "";
		var position = false, revTop = 0;
		var $scrollable = $(currentView.element).find("#scroll-slots");
		var top = $scrollable.find("#dragable-" + event.id).css("top");
		revTop = parseInt(top);
		var height = $scrollable.find("#dragable-" + event.id).css("height");
		top = parseInt(top) - 95;
		if (top < 0) {
			top = 0;
			position = true;
			top += parseInt(height) + (revTop + 6);
		}
		var left = $scrollable.find("#dragable-" + event.id).css("left");
		left = parseInt(left);
		var width = $scrollable.find("#dragable-" + event.id).css("width");
		width = parseInt(width);
		if ((day == 5 || day == 6) && (currentView.name != "agendaDay")) {
			left = left - 200;
			cssArrow = "margin: -2px 0 0 245px;";
			if (position) {
				cssArrow = "margin: -14px 0 0 200px;";
			}
		} else {
			if (position) {
				cssArrow = "margin: -14px 0 0 13px;";
			}
		}
		var bgStyle = event.backgroundColor != undefined ? "background-color:" + event.backgroundColor :"";
		var commentsWidth = "";
		if (currentView.name == "agendaDay") {
			commentsWidth = "width:" + (width - 100) + "px";
		}

		var selector = $("<div id='comments-area' class='appointment-comments'></div>");
		var commentPosition = $('<div id="formCommentContent" class="parentFormdemographicsForm formComment" style="position: absolute; z-index:100;top: '
				+ top
				+ 'px; left: '
				+ left
				+ 'px; margin-top: 0px;opacity:1;"> '
				+ '<img title="Close" src="js/calendar/images/close.png" class="closeCommentImage"></img>'
				+ '<div class="formCommentContent" style="'
				+ bgStyle
				+ ';'
				+ commentsWidth
				+ ';">'
				+ '<div id="topArroy" class="formCommentArrow" style="'
				+ cssArrow
				+ '"> </div>'
				+ '<div id="commentTextbox"> Reason'
				+ '<div id="comment" dataField="true" isEditor="true" editorLabel="" pathFields="" tagName="code" editorType ="CDInplace" dataType="CD"/></div> '
				+ '<br>'
				+ '<div class="ui-process-button taskOutcome" style="width:45%;margin-top:-13px;" >Comment Finish <img src="images/finish.png"/></div></div>'
				+ '<div id="downArroy" class="formCommentArrow" style="'
				+ cssArrow + '"> </div>' + '</div>');
		var commentHtml = "";
		var i = 0;
		if (!position) {
			for (i = 10; i > 0; i--) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ ';"></div>';
			}
			commentPosition.find('#topArroy').remove();
			commentPosition.find('#downArroy').append(commentHtml);
		} else {
			for (i = 1; i < 11; i++) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ ';box-shadow:0 0 0;"></div>';
			}
			commentPosition.find('#downArroy').remove();
			commentPosition.find('#topArroy').append(commentHtml);
		}

		commentPosition.find(".closeCommentImage").bind("click", function() {
			$(this).fadeOut(150, function() {
				// remove prompt once invisible
					// $(this).parent('.formCommentOuter').remove();
					// $(this).remove();
					commentPosition.remove();
				});
		});
		var buttonUI = commentPosition.find("div.ui-process-button");
		buttonUI.hover( function() {
			$(this).css('background', '#8d007f');
		}, function() {
			$(this).css('background', '#6B1E64');
		});
		if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE) {
			var xPath = AppConstants.XPaths.Appointment.UPDATE_COMMENTS;
			XmlUtil.updateXmlUsingpath(event.msgObject.message, xPath, '');
		}
		buttonUI
				.bind(
						"click",
						function() {
							var messageObj = event.msgObject;
							// var messageObj = event.msg;
							/*
							 * alert("Xml Msg : " +
							 * XmlUtil.xmlToString(messageObj.message));
							 */

							if (messageObj.message != null) {
								var value = XmlUtil
										.getXPathResult(
												messageObj.message,
												AppConstants.XPaths.Appointment.COMMENTS,
												XPathResult.STRING_TYPE);
								if (!value.stringValue) {
									notificationmsg
											.error("Please write comment.");
									return;
								}
								event.comment = (value && value.stringValue) ? value.stringValue
										: event.comment;

								element.find(".physician-comment").html(
										event.comment);
								if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE) {
									var updatedCode = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
									var messageObj = event.msgObject;
									var xPath = AppConstants.XPaths.Appointment.MESSAGE_TITLE;
									XmlUtil.updateXmlUsingpath(
											messageObj.message, xPath,
											updatedCode);
									if (removeSelectedEvent(event)) {
										commentPosition.remove();										
										currentView.clearEvents();
										currentView.renderEvents(events);
										eventEditComment(event);
										
									}
								} else {
									commentPosition.remove();
									eventEditComment(event);									
								}

							}
						});

		if ($scrollable.find('#comments-area').html() != null) {
			$scrollable.find('#comments-area').html('');
			$scrollable.find('#comments-area').append(commentPosition);
		} else {
			commentPosition.appendTo(selector);
			$scrollable.append(selector);

		}

		var parentContainerID = $scrollable.find(".parentFormdemographicsForm").attr(
				"id");

		var message = event.msg;
		//var message = event.msgObject;
		var messageAndUIBinder = new MessageAndUIBinder(parentContainerID,
				message, AppConstants.XPaths.Appointment.MESSAGE_TYPE);
		if (messageAndUIBinder) {
			var lookupHandler = appController.getComponent("DataLayer").lookupHandler;
			messageAndUIBinder.loadDataOntoForm(lookupHandler);
			messageAndUIBinder.bindFieldEvents();
			$(messageAndUIBinder.parentContainerID).trigger("change");
		}
	}
	/***
	 * When remove the blocked slot.
	 */
	function removeBlockSlot(event){
		var hour = (event.start).getHours();
		var day = (event.start).getDay();
		var cssArrow = "";
		var position = false, revTop = 0;
		var $scrollable = $(currentView.element).find("#scroll-slots");
		var top = $scrollable.find("#dragable-" + event.id).css("top");
		revTop = parseInt(top);
		var height = $scrollable.find("#dragable-" + event.id).css("height");
		top = parseInt(top) - 95;
		if (top < 0) {
			top = 0;
			position = true;
			top += parseInt(height) + (revTop + 6);
		}
		var left = $scrollable.find("#dragable-" + event.id).css("left");
		left = parseInt(left);
		var width = $scrollable.find("#dragable-" + event.id).css("width");
		width = parseInt(width);
		if ((day == 5 || day == 6) && (currentView.name != "agendaDay")) {
			left = left - 200;
			cssArrow = "margin: -2px 0 0 245px;";
			if (position) {
				cssArrow = "margin: -14px 0 0 200px;";
			}
		} else {
			if (position) {
				cssArrow = "margin: -14px 0 0 13px;";
			}
		}
		var bgStyle = event.backgroundColor != undefined ? "background-color:" + event.backgroundColor :"";
		var commentsWidth = "";
		if (currentView.name == "agendaDay") {
			commentsWidth = "width:" + (width - 100) + "px";
		}

		var selector = $("<div id='comments-area' class='appointment-comments'></div>");
		var commentPosition = $('<div id="formCommentContent" class="parentFormdemographicsForm formComment" style="position: absolute; z-index:100;top: '
				+ top
				+ 'px; left: '
				+ left
				+ 'px; margin-top: 0px;opacity:1;"> '
				+ '<img title="Close" src="js/calendar/images/close.png" class="closeCommentImage"></img>'
				+ '<div class="formCommentContent" style="'
				+ bgStyle
				+ ';'
				+ commentsWidth
				+ ';">'
				+ '<div id="topArroy" class="formCommentArrow" style="'
				+ cssArrow
				+ '"> </div>'
				+ '<div id="commentTextbox"> <h3>Do you want to Remove the block.</h3>'
				+ '<br></div>'
				+ '<div class="ui-cancel-button taskOutcome" style="width:40%;margin-top:-13px;" >Cancel <img src="images/cross.png"/></div>'
				+ '<div class="ui-process-button taskOutcome" style="width:40%;margin-top:-27px;" >Finish <img src="images/finish.png"/></div></div>'
				+ '<div id="downArroy" class="formCommentArrow" style="'
				+ cssArrow + '"> </div>' + '</div>');
		var commentHtml = "";
		var i = 0;
		if (!position) {
			for (i = 10; i > 0; i--) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ ';"></div>';
			}
			commentPosition.find('#topArroy').remove();
			commentPosition.find('#downArroy').append(commentHtml);
		} else {
			for (i = 1; i < 11; i++) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ ';box-shadow:0 0 0;"></div>';
			}
			commentPosition.find('#downArroy').remove();
			commentPosition.find('#topArroy').append(commentHtml);
		}

		commentPosition.find(".closeCommentImage").bind("click", function() {
			$(this).fadeOut(150, function() {
				// remove prompt once invisible
					// $(this).parent('.formCommentOuter').remove();
					// $(this).remove();
					commentPosition.remove();
				});
		});
		var buttonUI = commentPosition.find("div.ui-process-button");
		var cancelBtn = commentPosition.find("div.ui-cancel-button");
		buttonUI.hover( function() {
			$(this).css('background', '#8d007f');
		}, function() {
			$(this).css('background', '#6B1E64');
		});
		cancelBtn.hover(function(){$(this).css('background', '#8d007f');},function(){$(this).css('background', '#6B1E64');});
		cancelBtn.bind("click",function(){
			commentPosition.remove();
		});
		if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE) {
			var xPath = AppConstants.XPaths.Appointment.UPDATE_COMMENTS;
			XmlUtil.updateXmlUsingpath(event.msgObject.message, xPath, '');
		}
		buttonUI
				.bind(
						"click",
						function() {
							var messageObj = event.msgObject;
							if (messageObj.message != null) {								
								if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE) {
									var updatedCode = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
									var messageObj = event.msgObject;
									var xPath = AppConstants.XPaths.Appointment.MESSAGE_TITLE;
									XmlUtil.updateXmlUsingpath(
											messageObj.message, xPath,
											updatedCode);
									if (removeSelectedEvent(event)) {
										commentPosition.remove();										
										currentView.clearEvents();
										currentView.renderEvents(events);
										eventEditComment(event);
										
									}
								} 
							}
						});

		if ($scrollable.find('#comments-area').html() != null) {
			$scrollable.find('#comments-area').html('');
			$scrollable.find('#comments-area').append(commentPosition);
		} else {
			commentPosition.appendTo(selector);
			$scrollable.append(selector);

		}

		var parentContainerID = $scrollable.find(".parentFormdemographicsForm").attr(
				"id");

		var message = event.msg;
		//var message = event.msgObject;
		var messageAndUIBinder = new MessageAndUIBinder(parentContainerID,
				message, AppConstants.XPaths.Appointment.MESSAGE_TYPE);
		if (messageAndUIBinder) {
			var lookupHandler = appController.getComponent("DataLayer").lookupHandler;
			messageAndUIBinder.loadDataOntoForm(lookupHandler);
			messageAndUIBinder.bindFieldEvents();
			$(messageAndUIBinder.parentContainerID).trigger("change");
		}
	}
	
	function removeSelectedEvent(event) {
		var i, even, len = events.length;
		for (i = 0; i < len; i++) {
			even = events[i];
			if ((typeof (even) == 'object') && (even.id === event.id)) {
				events.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	/**
	 * Create the block message
	 * @param event
	 * @param eventElement
	 * @return
	 */

	function createBlockCommentPosition(event, eventElement) {
		var physicianVO = appController.getComponent("Context").getPhysicianVO();
		if(!physicianVO.physicianId){
			header.physicianAlart("Select Physician");
			return;
		}
		var hour = parseDate(event.start).getHours();
		var day = parseDate(event.start).getDay();
		var cssArrow = "";
		var position = false, revTop = 0;
		var $scrollable = $(currentView.element).find("#scroll-slots");
		var top = $scrollable.find("#dragable-" + event.id).css("top");
		var height = $scrollable.find("#dragable-" + event.id).css("height");
		revTop = parseInt(top);
		// top = parseInt(top) - 75;
		if (event.id == blockId){
			top = parseInt(top) - 150;
		}else{
			top = parseInt(top) - 75;
		}
		if (top < 0) {
			top = 0;
			position = true;
			top += parseInt(height) + (revTop + 6);
		}

		var left = $scrollable.find("#dragable-" + event.id).css("left");
		left = parseInt(left);
		var width = $scrollable.find("#dragable-" + event.id).css("width");
		width = parseInt(width);

		var bgStyle = event.backgroundColor != undefined ? "background-color:" + event.backgroundColor :"";
		if (position) {
			if ((day == 5 || day == 6) && (currentView.name != "agendaDay")) {
				left = left - 200;
				cssArrow = "margin: -14px 0 8px 200px;";
			} else {
				cssArrow = "margin: -14px 0 8px 13px;";
			}
			cssArrow += "box-shadow: 0 0 0 #444444;";
			bgStyle = "box-shadow: 0 6px 6px #000000;";
		} else {
			if ((day == 5 || day == 6) && (currentView.name != "agendaDay")) {
				left = left - 200;
				cssArrow = "margin: 22px 0 0 245px;";
			}
		}

		var commentsWidth = "";
		if (currentView.name == "agendaDay") {
			commentsWidth = "width:" + (width - 100) + "px";
		}

		var selector = $("<div id='blocking-area' class='appointment-comments'></div>");
		var blockCommentPosition = $('<div id="formBlockCommentContent" class="parentFormdemographicsForm formComment" style="position: absolute; z-index:100;top: '
				+ top
				+ 'px; left: '
				+ left
				+ 'px; margin-top: 0px;opacity:1;"> '
				+ '<img title="Close" src="js/calendar/images/close.png" class="closeCommentImage"></img>'
				+ '<div class="formBlockCommentContent" style="'
				+ bgStyle
				+ ';'
				+ commentsWidth
				+ ';">'
				+ '<div id="topArroy" class="formBlockCommentArrow" style="'
				+ cssArrow
				+ '"> </div>'
				+ '<div id="commentTextbox"> Reason'
				+ '<div id="comment" dataField="true" isEditor="true" editorLabel="" pathFields="" tagName="code" editorType ="CDInplace" dataType="CD"/></div>'
				+ '<div id="colorTextbox"> Color'
				+ '<div isEditor="true" editorLabel="" pathFields="" tagName="reasonCode" editorType ="ColorPicker" dataType="CD"></div>'
				+ '<br></div> '
				+ '<div class="ui-process-button taskOutcome" style="width:45%;margin-top:-13px;" >Comment Finish <img src="images/finish.png"/></div>'
				+ '<div id="downArroy" class="formBlockCommentArrow" style="'
				+ cssArrow + '"> </div>' + '</div>');

		var commentHtml = "";
		var i = 0;
		if (!position) {
			for (i = 10; i > 0; i--) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ '"></div>';
			}
			blockCommentPosition.find('#topArroy').remove();
			blockCommentPosition.find('#downArroy').append(commentHtml);
		} else {
			for (i = 1; i < 11; i++) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ 'box-shadow:0 0 0;"></div>';
			}
			blockCommentPosition.find('#downArroy').remove();
			blockCommentPosition.find('#topArroy').append(commentHtml);
		}

		blockCommentPosition.find(".closeCommentImage").bind("click",
				function() {
					$(this).fadeOut(150, function() {
						// remove prompt once invisible
							// $(this).parent('.formCommentOuter').remove();
							// $(this).remove();
							blockCommentPosition.remove();
						});
				});
		var buttonUI = blockCommentPosition.find("div.ui-process-button");
		buttonUI.hover( function() {
			$(this).css('background', '#8d007f');
		}, function() {
			$(this).css('background', '#6B1E64');
		});

		buttonUI
				.bind(
						"click",
						function() {
							var messageObj = event.msgObject;
							if (messageObj.message != null) {
								var value = XmlUtil
										.getXPathResult(
												messageObj.message,
												AppConstants.XPaths.Appointment.COMMENTS,
												XPathResult.STRING_TYPE);
								event.comment = (value && value.stringValue) ? value.stringValue
										: event.comment;
								var value = XmlUtil.getXPathResult(messageObj.message,
										AppConstants.XPaths.Appointment.REASONCODE,
										XPathResult.STRING_TYPE);
								event.backgroundColor = (value && value.stringValue) ? value.stringValue
										: event.backgroundColor;	
								
								eventElement.find(".physician-comment").html(
										event.comment);
								event.start = parseDate(event.start);
								event.end = parseDate(event.end);
								blockCommentPosition.remove();								
								event.start = parseDate(event.start);
								event.end = parseDate(event.end);								
								currentView.clearEvents();								
								events = updateSelectedEvent(events, event);
								currentView.renderEvents(events);
								eventEditComment(event);
							}
						});

		if ($scrollable.find('#blocking-area').html() != null) {
			$scrollable.find('#blocking-area').html('');
			$scrollable.find('#blocking-area').append(blockCommentPosition);
		} else {
			blockCommentPosition.appendTo(selector);
			$scrollable.append(selector);

		}

		var parentContainerID = $scrollable.find(".parentFormdemographicsForm")
				.attr("id");

		var message = event.msg;
		// var message = event.msgObject;
		var messageAndUIBinder = new MessageAndUIBinder(parentContainerID,
				message, AppConstants.XPaths.Appointment.MESSAGE_TYPE);
		if (messageAndUIBinder) {
			var lookupHandler = appController.getComponent("DataLayer").lookupHandler;
			messageAndUIBinder.loadDataOntoForm(lookupHandler);

			// Update for blocked physician
			var fields = "consultant,employmentStaff";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');
			if(physicianVO.physicianId){
				var instanceObject = [ "SUBSCRIBER_ID",physicianVO.physicianId, null ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
						instanceObject);
			
				var fields = "consultant,employmentStaff,employeePerson";
				var type = "PN";
				var tagName = "name";
				var pathFields = fields.split(',');
				var instanceObject = [ null, physicianVO.prefixName,
						 physicianVO.givenName,physicianVO.familyName,
						physicianVO.suffixName ];
				messageAndUIBinder.writeValueToMessage(tagName, pathFields,
						type, instanceObject)
			}	
			// Update for effectiveTime
			var fields = "";
			var type = "IVL_TS";
			var tagName = "effectiveTime";
			var pathFields = fields.split(',');
			event.start = CommonUtil.dateFormat(parseDate(event.start),
					"fullDateTime");
			event.end = CommonUtil.dateFormat(parseDate(event.end),
					"fullDateTime");
			instanceObject = [ event.start, event.end ];
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
					instanceObject);
			event.start = parseDate(event.start);
			event.end = parseDate(event.end);
			var orgId = appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
			messageAndUIBinder.updateId("ORGANIZATION_ID", orgId);
			var blockCode = AppConstants.XPaths.Appointment.BLOCK_CODE;
			messageAndUIBinder.updateId('MSG_TITLE', blockCode);
			messageAndUIBinder.bindFieldEvents();
			$(messageAndUIBinder.parentContainerID).trigger("change");
		}
		//event.msg = messageAndUIBinder.messageObject;
	}
	function updateSelectedEvent(events, event) {
		var i, even, len = events.length, slotEvents = [];
		for (i = 0; i < len; i++) {
			even = events[i];
			if ((typeof (even) == 'object') && (even.id == event.id)) {
				even.id = idGenerator.getId();
				even.isCurrent = true;
				even.start = parseDate(even.start);
				even.end = parseDate(even.end);
				even.editable = false;
				even.messageTitle = AppConstants.XPaths.Appointment.BLOCK_CODE;
				slotEvents.push(even);
			} else {
				slotEvents.push(even);
			}
		}
		return slotEvents;
	}
	function createBlockAppointment() {
	}
	
	function clickToMoveEvent(date) {	
		
		if (options.defaultView != 'month') {
			var i=0,event,len=events.length,newId = 111111,flag=false;
			for(i=0;i< len;i++){
				event = events[i];
				if(event.id==newId){	
					flag = true
				}
			}
			if(!flag){
				events.push(newAppointment);
			}
			currentView.renderUpdateEvent(events, date);
		}
		if (options.defaultView == 'month' 
			&& (currentView.name == 'agendaWeek' || currentView.name == "agendaDay")) {
			currentView.renderUpdateEvent(events, date);
		}
	}
	function createBlockEvent(event) {
		removeEvent();
	}
	function createBlockEvent(date) {
		if (options.defaultView != 'month') {
			return;
		}
		if (header.activeId == 0) {
			var i, even, len = events.length;
			for (i = 0; i < len; i++) {
				even = events[i];
				if (even.id == blockId) {
					events.splice(i, 1);
					currentView.renderEvents(events);
					return;
				}
			}
			return;
		}
		var i, even, len = events.length;
		for (i = 0; i < len; i++) {
			even = events[i];
			if (even.id == blockId) {
				currentView.renderUpdateEvent(events, date);
				return;
			}
		}

		var start = cloneDate(date)
		var endDate = new Date(start.getFullYear(), start.getMonth(), start
				.getDate(), start.getHours() + 1, start.getMinutes());
		var dataLayer = appController.getComponent("DataLayer");
		var appointmentMessageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
		var message = null;
		var appointmentVO = new HIN.AppointmentVO();
		dataLayer
				.createMessageByType(
						appointmentMessageType,
						function(messageObj) {
							message = messageObj;
							appointmentVO.setMessage(message.message);
							appointmentVO.id = blockId;
							appointmentVO.setMsg(message.msg);
							appointmentVO.setMsgObject(messageObj);
							appointmentVO.comment = 'Blocking Slot';
							appointmentVO.start = start;
							appointmentVO.end = endDate;
							appointmentVO.isCurrent = true;
							appointmentVO.editable = true;
							appointmentVO.messageTitle = AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE;
							appointmentVO.className.push('fc-event-draggable');
							events.push(appointmentVO);
							currentView.renderSlotBlockSelection(events,
									appointmentVO);
						}, null);

	}	
}
