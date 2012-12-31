
function View(element, calendar, viewName) {
	var t = this;

	// exports
	t.element = element;
	t.calendar = calendar;
	t.name = viewName;
	t.opt = opt;
	t.trigger = trigger;
	// t.setOverflowHidden = setOverflowHidden;
	t.isEventDraggable = isEventDraggable;
	t.isEventResizable = isEventResizable;
	t.reportEvents = reportEvents;
	t.eventEnd = eventEnd;
	t.reportEventElement = reportEventElement;
	t.reportEventClear = reportEventClear;
	t.eventElementHandlers = eventElementHandlers;
	t.showEvents = showEvents;
	t.hideEvents = hideEvents;
	t.eventDrop = eventDrop;
	t.eventResize = eventResize;
	t.createBlockSlot = createBlockSlot;
	// t.title
	// t.start, t.end
	// t.visStart, t.visEnd

	// imports
	var defaultEventEnd = t.defaultEventEnd;
	var normalizeEvent = calendar.normalizeEvent; // in EventManager
	var reportEventChange = calendar.reportEventChange;
	var viewClickEvents = calendar.viewClickEvents;
	var createCommentPosition = calendar.createCommentPosition;
	var removeBlockSlot = calendar.removeBlockSlot;
	var gotoNext = calendar.gotoNext;
	var gotoPrevious = calendar.gotoPrevious;
	var eventEditComment = calendar.eventEditComment;
	var updatedEvent = calendar.updatedEvent;

	// locals
	var eventsByID = {};
	var eventElements = [];
	var eventElementsByID = {};
	var options = calendar.options;
	var noOfevent = {};
	var defaultView = null;	
	if(calendar.options.defaultView=='month'){
		defaultView = calendar.options.defaultView;
	}
	function opt(name, viewNameOverride) {
		var v = options[name];
		if (typeof v == 'object') {
			return smartProperty(v, viewNameOverride || viewName);
		}
		return v;
	}

	function trigger(name, thisObj) {
		return calendar.trigger.apply(calendar, [ name, thisObj || t ].concat(
				Array.prototype.slice.call(arguments, 2), [ t ]));
	}

	/*
	function setOverflowHidden(bool) {
		element.css('overflow', bool ? 'hidden' : '');
	}
	 */

	function isEventDraggable(event) {
		return isEventEditable(event) && !opt('disableDragging');
	}

	function isEventResizable(event) { // but also need to make sure the seg.isEnd == true
		return isEventEditable(event) && !opt('disableResizing');
	}

	function isEventEditable(event) {
		event.editable = !(event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE);
		return firstDefined(event.editable, (event.source || {}).editable,
				opt('editable'));
	}

	/* Event Data
	------------------------------------------------------------------------------*/

	// report when view receives new events
	function reportEvents(events) { // events are already normalized at this point
		eventsByID = {};
		var i, len = events.length, event;
		noOfevent = events;
		for (i = 0; i < len; i++) {
			event = events[i];
			if (eventsByID[event._id]) {
				eventsByID[event._id].push(event);
			} else {
				eventsByID[event._id] = [ event ];
			}
		}
	}

	// returns a Date object for an event's end
	function eventEnd(event) {
		return event.end ? cloneDate(event.end) : defaultEventEnd(event);
	}

	/* Event Elements
	------------------------------------------------------------------------------*/

	// report when view creates an element for an event
	function reportEventElement(event, element) {
		eventElements.push(element);
		if (eventElementsByID[event._id]) {
			eventElementsByID[event._id].push(element);
		} else {
			eventElementsByID[event._id] = [ element ];
		}
	}

	function reportEventClear() {
		eventElements = [];
		eventElementsByID = {};
	}

	// attaches eventClick, eventMouseover, eventMouseout
	function eventElementHandlers(event, eventElement) {
		eventElement
				.click(
						function(ev) {
							if (!eventElement.hasClass('ui-draggable-dragging')
									&& !eventElement
											.hasClass('ui-resizable-resizing')) {
								return trigger('eventClick', this, event, ev);
							}
						}).hover( function(ev) {
					trigger('eventMouseover', this, event, ev);
				}, function(ev) {
					trigger('eventMouseout', this, event, ev);
				});
		if (event.isCurrent == true) {
			eventElement.find(".fc-event-draggable").draggable( {
				grid : [ 20, 20 ]
			});// Dragable at tuch screen
			// eventElement.find(".fc-event-draggable").bind("mouseover",draggable2);//Dragable
			// at tuch screen
		}

		eventElement.find("img.move_arrow_left").click( function() {
			gotoPrevious(event);
		});
		eventElement.find("img.move_arrow_right").click( function() {
			gotoNext(event);
		});
		eventElement.find("img.finish-button").click( function() {			
			viewClickEvents(event,eventElement);
		});
		eventElement.find('.fc-click-event-none').click( function() {
			redirectToPatient(event.patientId, event.title);
		});

		eventElement.find(".fc-event-inner").mouseover( function() {
			if (event.isCurrent == false)
				eventElement.find(".editCommentImage").show();
		});
		eventElement.find(".fc-event-inner").mouseover( function() {
			if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE)
				eventElement.find(".btn-close-slot").show();
		});
		eventElement.find(".fc-event-inner").mouseout( function() {
			eventElement.find(".editCommentImage").hide();
		});
		eventElement.find(".fc-event-inner").mouseout( function() {
			eventElement.find(".btn-close-slot").hide();
		});
		eventElement.find(".editCommentImage").click( function() {
			createCommentPosition(event, eventElement);
		});
		eventElement.find(".btn-close-slot").click( function() {
			//createCommentPosition(event, eventElement);
			removeBlockSlot(event, eventElement);
		});
		eventElement.find(".fc-event-time").click( function() {
			calendar.reScheduleEvent(event);
		});		
	}

	function showEvents(event, exceptElement) {
		eachEventElement(event, exceptElement, 'show');
	}

	function hideEvents(event, exceptElement) {
		eachEventElement(event, exceptElement, 'hide');
	}

	function eachEventElement(event, exceptElement, funcName) {
		var elements = eventElementsByID[event._id], i, len = elements.length;
		for (i = 0; i < len; i++) {
			if (!exceptElement || elements[i][0] != exceptElement[0]) {
				elements[i][funcName]();
			}
		}
	}
	function blinkit(el){
		intrvl=0;
		for(nTimes=0;nTimes<3;nTimes++){
			intrvl += 1000;
			setTimeout("document.bgColor='#0000FF';",intrvl);
			intrvl += 1000;
			setTimeout("document.bgColor='#FFFFFF';",intrvl);
		}
	}

	/* Event Modification Reporting
	---------------------------------------------------------------------------------*/

	function eventDrop(e, event, dayDelta, minuteDelta, allDay, ev, ui) {
		var oldAllDay = event.allDay;
		var eventId = event._id;	
		if (event.isCurrent == true || defaultView=='month'){
			moveEvents(eventsByID[eventId], dayDelta, minuteDelta, allDay);
		}
		trigger('eventDrop', e, event, dayDelta, minuteDelta, allDay,
				function() {
					// TODO: investigate cases where this inverse technique might not work
				moveEvents(eventsByID[eventId], -dayDelta, -minuteDelta,
						oldAllDay);
				reportEventChange(event);
			}, ev, ui);
		reportEventChange(event);
	}

	function eventResize(e, event, dayDelta, minuteDelta, ev, ui) {
		var eventId = event._id;
		if (event.isCurrent == true || defaultView=='month'){
			elongateEvents(eventsByID[eventId], dayDelta, minuteDelta);
		}
		trigger('eventResize', e, event, dayDelta, minuteDelta, function() {
			// TODO: investigate cases where this inverse technique might not work
				elongateEvents(eventsByID[eventId], -dayDelta, -minuteDelta);
				reportEventChange(event);
			}, ev, ui);
		reportEventChange(event);
	}

	/* Event Modification Math
	---------------------------------------------------------------------------------*/

	function moveEvents(events, dayDelta, minuteDelta, allDay) {
		var year = new Date().getFullYear();
		var month = new Date().getMonth();
		var day = new Date().getDate();
		var cminute = new Date().getMinutes();
		var minute = Math.round(cminute / 15) * 15;
		var hour = new Date().getHours();
		var tDate = parseDate(CommonUtil.dateFormat(
				new Date(year, month, day,hour,minute), "fullDateTime"));
		
		minuteDelta = minuteDelta || 0;
		for ( var e, len = events.length, i = 0; i < len; i++) {
			e = events[i];
			var start = cloneDate(e.start);
			var end = cloneDate(e.end);
			if (allDay !== undefined) {
				e.allDay = allDay;
			}
			addMinutes(addDays(e.start, dayDelta, true), minuteDelta);
			if (e.end) {
				e.end = addMinutes(addDays(e.end, dayDelta, true), minuteDelta);
			}
			
			/**
			 * 
			 * Override restricted
			 */
			e = overloading(e, start, end);
			if (!(e.start.getTime() > tDate.getTime())) {
				e.start = parseDate(e.start);
				e.end = parseDate(e.end);
				var dif = e.end.getTime()-e.start.getTime();
				e.start = tDate;
				e.end = new Date(tDate.getTime()+dif);
			}
			updatedEvent(e);
			normalizeEvent(e, options);
		}
	}
	function overloading(e, start, end) {
		for (i = 0; i < noOfevent.length; i++) {
			var event = noOfevent[i];
			var flag = false;
			var flag2 = false;
			e.start = parseDate(e.start);
			e.end = parseDate(e.end);
			event.end = parseDate(event.end);
			event.start = parseDate(event.start);
			if (event.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE 
					&& event.end != null && event.id != e.id) {
				if (!(e.end.getTime() > event.end.getTime())
						&& (e.end.getTime() > event.start.getTime())) {
					flag = true;
				}
				if ((event.end.getTime() > e.start.getTime())
						&& (event.start.getTime() < e.end.getTime())) {

					flag2 = true;
				}
				if (flag || flag2) {
					var dif = e.end.getTime()-e.start.getTime();
					//e.start = start;
					//e.end = end;
					e.start = cloneDate(event.end);
					e.end = new Date(event.end.getTime()+dif);
				}
			}
		}
		return e;
	}

	function elongateEvents(events, dayDelta, minuteDelta) {
		var tDate = parseDate(CommonUtil.dateFormat(new Date(), "fullDateTime"));
		minuteDelta = minuteDelta || 0;
		for ( var e, len = events.length, i = 0; i < len; i++) {
			e = events[i];
			var start = cloneDate(e.start);
			var end = cloneDate(e.end);
			e.end = addMinutes(addDays(eventEnd(e), dayDelta, true),
					minuteDelta);			
			e = overloading(e, start, end);			
			normalizeEvent(e, options);
		}
		
	}
	function draggable2() {
		var offset = null;
		var start = function(e) {
			var orig = e.originalEvent;
			var pos = $(this).position();
			offset = {
				x : orig.changedTouches[0].pageX - pos.left,
				y : orig.changedTouches[0].pageY - pos.top
			};
		};
		var moveMe = function(e) {
			e.preventDefault();
			var orig = e.originalEvent;
			$(this).css( {
				top : orig.changedTouches[0].pageY - offset.y,
				left : orig.changedTouches[0].pageX - offset.x
			});
		};
		this.bind("touchstart", start);
		this.bind("touchmove", moveMe);
	}
	;
	function createBlockSlot(slotElement){
		//alert(slotElement);
		calendar.fullCalendar('renderEvent',slotElement);	
	}

}
