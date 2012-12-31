
function BasicEventRenderer() {
	var t = this;
	
	
	// exports
	t.renderEvents = renderEvents;
	t.renderUpdateEvent = renderUpdateEvent;
	t.compileDaySegs = compileSegs; // for DayEventRenderer
	t.clearEvents = clearEvents;
	t.bindDaySeg = bindDaySeg;
	
	
	// imports
	DayEventRenderer.call(t);
	var opt = t.opt;
	var trigger = t.trigger;
	//var setOverflowHidden = t.setOverflowHidden;
	var isEventDraggable = t.isEventDraggable;
	var isEventResizable = t.isEventResizable;
	var reportEvents = t.reportEvents;
	var reportEventClear = t.reportEventClear;
	var eventElementHandlers = t.eventElementHandlers;
	var showEvents = t.showEvents;
	var hideEvents = t.hideEvents;
	var eventDrop = t.eventDrop;
	var getDaySegmentContainer = t.getDaySegmentContainer;
	var getHoverListener = t.getHoverListener;
	var renderDayOverlay = t.renderDayOverlay;
	var clearOverlays = t.clearOverlays;
	var getRowCnt = t.getRowCnt;
	var getColCnt = t.getColCnt;
	var renderDaySegs = t.renderDaySegs;
	var resizableDayEvent = t.resizableDayEvent;
	var updatedMonthEvent = t.updatedMonthEvent;
	
	
	
	/* Rendering
	--------------------------------------------------------------------*/
	
	
	function renderEvents(events, modifiedEventId) {
		reportEvents(events);
		renderDaySegs(compileSegs(events), modifiedEventId);
	}
	function renderUpdateEvent(events,date) {
		var i, event,len = events.length, dayEvents = [], slotEvents = [],modifiedEventId;
		for (i = 0; i < len; i++) {
			event = events[i];
			if(event.isCurrent == true && event.messageTitle != AppConstants.XPaths.Appointment.BLOCK_CODE && event.end!=null){
				var diff = event.end.getTime() - event.start.getTime();
				var newDate = new Date(date.getFullYear(), date.getMonth(), date
						.getDate(), event.start.getHours(), event.start.getMinutes());
				if(newDate.getTime()>new Date().getTime()){	
					cloneStart = cloneDate(event.start);
					cloneEnd = cloneDate(event.end);
					event.start = cloneDate(newDate);
					event.end = new Date(newDate.getTime()+diff);
					if(checkForOverlop(events,event)){						
						slotEvents.push(event);
						updatedMonthEvent(event);
					}else{
						modifiedEventId = event.id;
						event.start = cloneDate(event.end);
						event.end = new Date(event.start.getTime()+diff);
						slotEvents.push(event);
					}
				}else{
					slotEvents.push(event);
				}
			}else{
				slotEvents.push(event);
			}
		}
		renderDaySegs(compileSegs(slotEvents), modifiedEventId);
	}
	function checkForOverlop(events,event){
		var i, slot,slotStart,len = events.length;
		for (i = 0; i < len; i++) {
			slot = events[i];
			slotStart =  cloneDate(slot.start);
			if(slot.id !=event.id && slot.start!=null 
					&& slot.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE){
				var d1 = slotStart.getTime();
				var d2 = event.start.getTime();	
				slot.start = parseDate(slot.start);
				slot.end = parseDate(slot.end);
				if((slot.start.getTime()>event.start.getTime() && slot.start.getTime() < event.end.getTime())
						|| (event.start.getTime()>slot.start.getTime() && event.start.getTime() < slot.end.getTime())
						|| (d1==d2)){
					return false;
				}
			}
		}
		return true;
	}
	
	function clearEvents() {
		reportEventClear();
		getDaySegmentContainer().empty();
	}
	
	
	function compileSegs(events) {
		var rowCnt = getRowCnt(),
			colCnt = getColCnt(),
			d1 = cloneDate(t.visStart),
			d2 = addDays(cloneDate(d1), colCnt),
			visEventsEnds = $.map(events, exclEndDay),
			i, row,
			j, level,
			k, seg,
			segs=[];
		for (i=0; i<rowCnt; i++) {
			row = stackSegs(sliceSegs(events, visEventsEnds, d1, d2));
			for (j=0; j<row.length; j++) {
				level = row[j];
				for (k=0; k<level.length; k++) {
					seg = level[k];
					seg.row = i;
					seg.level = j; // not needed anymore
					segs.push(seg);
				}
			}
			addDays(d1, 7);
			addDays(d2, 7);
		}
		return segs;
	}
	
	
	function bindDaySeg(event, eventElement, seg) {
		if (isEventDraggable(event)) {
			draggableDayEvent(event, eventElement);
		}
		if (seg.isEnd && isEventResizable(event)) {
			resizableDayEvent(event, eventElement, seg);
		}
		eventElementHandlers(event, eventElement);
			// needs to be after, because resizableDayEvent might stopImmediatePropagation on click
	}
	
	
	
	/* Dragging
	----------------------------------------------------------------------------*/
	
	
	function draggableDayEvent(event, eventElement) {
		var hoverListener = getHoverListener();
		var dayDelta;
		eventElement.draggable({
			zIndex: 9,
			delay: 50,
			opacity: opt('dragOpacity'),
			revertDuration: opt('dragRevertDuration'),
			start: function(ev, ui) {
				trigger('eventDragStart', eventElement, event, ev, ui);
				hideEvents(event, eventElement);
				hoverListener.start(function(cell, origCell, rowDelta, colDelta) {
					eventElement.draggable('option', 'revert', !cell || !rowDelta && !colDelta);
					clearOverlays();
					if (cell) {
						//setOverflowHidden(true);
						dayDelta = rowDelta*7 + colDelta * (opt('isRTL') ? -1 : 1);
						renderDayOverlay(
							addDays(cloneDate(event.start), dayDelta),
							addDays(exclEndDay(event), dayDelta)
						);
					}else{
						//setOverflowHidden(false);
						dayDelta = 0;
					}
				}, ev, 'drag');
			},
			stop: function(ev, ui) {
				hoverListener.stop();
				clearOverlays();
				trigger('eventDragStop', eventElement, event, ev, ui);
				if (dayDelta) {
					eventDrop(this, event, dayDelta, 0, event.allDay, ev, ui);
				}else{
					eventElement.css('filter', ''); // clear IE opacity side-effects
					showEvents(event, eventElement);
				}
				//setOverflowHidden(false);
			}
		});
	}


}
