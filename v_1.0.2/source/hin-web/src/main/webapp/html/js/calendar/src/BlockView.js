fcViews.block = BlockView;

function BlockView(element, calendar) {
	var t = this;

	// exports
	t.render = render;
	t.renderBasic = renderBasic;
	t.setHeight = setHeight;
	t.setWidth = setWidth;
	t.clearEvents = clearEvents;
	t.renderEvents = renderEvents;
	// currentView = element;
	// imports
	// AgendaView.call(t, element, calendar, 'block');
	var opt = t.opt;
	var createBlockAppointment = this.createBlockAppointment;
	var viewName = "block";
	t.getDaySegmentContainer = function() {
		return daySegmentContainer
	};

	//View.call(t, element, calendar, viewName);
	//OverlayManager.call(t);
	//SelectionManager.call(t);
	// BasicEventRenderer.call(t);

	var opt = t.opt;
	var trigger = t.trigger;
	// var clearEvents = t.clearEvents;
	// currentView.renderEvents(events, modifiedEventID);
	// currentView.eventsDirty = false;
	var renderOverlay = t.renderOverlay;
	var clearOverlays = t.clearOverlays;
	var daySelectionMousedown = t.daySelectionMousedown;
	var formatDate = calendar.formatDate;

	// locals

	var head;
	var headCells;
	var body;
	var bodyRows;
	var bodyCells;
	var bodyFirstCells;
	var bodyCellTopInners;
	var daySegmentContainer;

	var viewWidth;
	var viewHeight;
	var colWidth;

	var rowCnt, colCnt;
	var coordinateGrid;
	var hoverListener;
	var colContentPositions;

	var rtl, dis, dit;
	var firstDay;
	var nwe;
	var tm;
	var colFormat;
	var message = null;
	var messageAndUIBinder = null;

	function render(date, delta) {

		//var start = cloneDate(date, true);
		// var end = addDays(cloneDate(start), 1);
		//t.title = "Blocking Appointment";
		//renderBasic();
	}

	function renderBasic() {

		//updateOptions();
		var firstTime = !body;
		if (firstTime) {
			buildSkeleton();
		} else {
			clearEvents();
			//updateMessages();
		}

	}
	function updateOptions() {
		rtl = opt('isRTL');
		if (rtl) {
			dis = -1;
			dit = colCnt - 1;
		} else {
			dis = 1;
			dit = 0;
		}
		firstDay = opt('firstDay');
		nwe = opt('weekends') ? 0 : 1;
		tm = opt('theme') ? 'ui' : 'fc';
		colFormat = opt('columnFormat');
	}
	function buildSkeleton() {
		var s;
		var table;
		s = $("<div id='block_timeslot' class='ui-align-text fc-view-block block-timeslot'></div>");
		s
				.append('<div class="block_reasone"><div class="ui-appointment-block-label">Reason</div><div class="ui-appointment-textbox">' + '<div id="comment" dataField="true" isEditor="true" editorLabel="" pathFields="" tagName="code" editorType ="CDInplace" dataType="CD"></div> ' + '</div></div>');
		s
				.append('<div class="block_color"><div class="ui-appointment-block-label">Color</div><div class="ui-appointment-textbox">' + '<div isEditor="true" editorLabel="" pathFields="" tagName="reasonCode" editorType ="ColorPicker" dataType="CD"></div>' + '</div></div>');
		s
				.append('<div class="FromDate"><div class="ui-appointment-block-label">Time</div><div class="ui-appointment-block-textbox">' + '<div isEditor="true" editorLabel="" pathFields="" tagName="effectiveTime" dataType="IVL_TS" editorType="IVL_TS" ' + "configParams=\"[{name:'data-options',value:'slidebox'}]\"></div></div></div>");

		var submitBtn = $('<div class="ui-process-button taskOutcome" style="margin-top:21px;" > Finish <img src="images/finish.png"/></div>');

		submitBtn.bind('click', function() {
			var appointmentVO = new HIN.AppointmentVO();
			//alert("Xml Msg : "+XmlUtil.xmlToString(message.message));
			appointmentVO.setMessage(message.message);
			if (appointmentVO.comment != null && appointmentVO.start != null
					&& appointmentVO.end != null && parseDate(appointmentVO.start).getTime()>new Date().getTime()) {
				appController.getComponent("RenderingEngine").showPageLoading(
						"Block Message Updating");
				var messageObjects = [ message ];
				var parameters = [ messageObjects ];
				appController.getComponent("DataLayer").createOrUpdateTasks(
						parameters);
				calendar.changeView("month");
				calendar.fullCalendar('renderEvent',appointmentVO);				
			} else {
				notificationmsg.error("Message not updated. Please try.");
			}
		});
		var btn = $('<div class="actionBtn"></div>').append(submitBtn);
		s.append(btn);

		table = $(s).appendTo(element);
		head = table.find('thead');
		headCells = head.find('th');
		body = table.find('tbody');
		bodyRows = body.find('tr');
		bodyCells = body.find('td');
		bodyFirstCells = bodyCells.filter(':first-child');
		bodyCellTopInners = bodyRows.eq(0).find('div.fc-day-content div');

		markFirstLast(head.add(head.find('tr'))); // marks first+last tr/th's
		markFirstLast(bodyRows); // marks first+last td's
		bodyRows.eq(0).addClass('fc-first'); // fc-last is done in
		// updateCells

		dayBind(bodyCells);

		updateMessages();
	}
	function updateMessages() {
		var dataLayer = appController.getComponent("DataLayer");
		var appointmentMessageType = AppConstants.XPaths.Appointment.MESSAGE_TYPE;
		message = null;
		dataLayer.createMessageByType(appointmentMessageType,
				function(messageObj) {
					message = messageObj;
					messageAndUIBinder = null;
					messageAndUIBinder = new MessageAndUIBinder(
							"block_timeslot", message.msg,
							AppConstants.XPaths.Appointment.MESSAGE_TYPE);
					if (messageAndUIBinder) {
						var lookupHandler = appController
								.getComponent("DataLayer").lookupHandler;
						messageAndUIBinder.loadDataOntoForm(lookupHandler);

						var fields = "consultant,employmentStaff";
						var type = "II";
						var tagName = "id";
						var pathFields = fields.split(',');
						var instanceObject = [ "SUBSCRIBER_ID",
								AppConstants.XPaths.Appointment.BLOCK_CODE,
								null ];
						messageAndUIBinder.writeValueToMessage(tagName,
								pathFields, type, instanceObject);

						messageAndUIBinder.bindFieldEvents();
						$(messageAndUIBinder.parentContainerID).trigger(
								"change");

					}
				}, null);
	}

	function dayBind(days) {
		days.click(dayClick).mousedown(daySelectionMousedown);
	}

	function dayClick(ev) {
		if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
			var index = parseInt(this.className.match(/fc\-day(\d+)/)[1]); // TODO:
			// maybe
			// use
			// .data
			var date = indexDate(index);
			trigger('dayClick', this, date, true, ev);
		}
	}
	function setHeight(height) {
		$(element).css('height', height);
	}
	function setWidth(width) {
		$(element).css('width', width);
	}
	function clearEvents() {
		//reportEventClear();
		// getDaySegmentContainer().empty();
		// getSlotSegmentContainer().empty();
	}
	function renderEvents(events, modifiedEventID) {

	}
}