function PatientCalendar(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "PatientCalendar";
	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var patientCalendarObj = this;
	this.subscriberId = null;
	this.monthNames = new Array("January", "February", "March", "April", "May",
			"June", "July", "August", "September", "October", "November",
			"December");
	
	/* Function definitions */
	function eventHandler(event) {
		if (event.type == AppConstants.Event.PATIENT_CALENDAR_PAGE_BIND_EVENTS) {
			var userVO = renderingEngine.getComponent("Context").getUserVo();
			if (userVO){
				//alert("userVO.subscriberId: "+userVO);
				patientCalendarObj.subscriberId = userVO.subscriberId;
				loadMessage(userVO);
			}
		} else if (event.type == AppConstants.Event.PATIENT_CALENDAR_HOME_FILL_DATA_EVENT) {

		}
	}
	;

	function loadUI() {
		renderingEngine.loadPage("pages/patientCalendar/patientCalendar.html", "form",
				AppConstants.Event.PATIENT_CALENDAR_PAGE_BIND_EVENTS);
	}
	;
	
	function loadMessage() {
		var uiWrapper = "", table = null, index = 0,date = null;
		uiWrapper = $("<div id='yearcalendar'></div>");

		var  currentYear = $("#yearDisplay").attr('currentYear');
		//alert("currentYear: "+currentYear);
		
		if(currentYear){
			year = currentYear;
		}else{
			var date = new Date();
			year = date.getFullYear();
		}
		
		var tableHeader = createHeader(year);
		$(uiWrapper).append(tableHeader);
		
		$(uiWrapper).find('#previous').unbind('click',changeYear);
		$(uiWrapper).find('#previous').bind('click',changeYear);
		$(uiWrapper).find('#next').unbind('click',changeYear);
		$(uiWrapper).find('#next').bind('click',changeYear);

		table = '<table id="monthDisplay" width="85%" style="float:right;"> ';
		var month = 0;
		for (index = 0; index < 3; index++, month += 4) {
			table += createLiDiv(month);
		}
		table += "</table>";
		uiWrapper.append(table);
		
		getData(uiWrapper,year);
		
		var element = $.find(".yearcalendarDiv");
		var calendarElement = $(element).html(uiWrapper);//uiWrapper.appendTo(element);
		
		appController.getComponent("RenderingEngine").fireEvent(AppConstants.Event.RESIZE);
	}
	
	function getData(uiWrapper,year){
		var startDate = new Date();
		startDate.setFullYear(year);
		startDate.setMonth(0);
		startDate.setDate(1);
		//alert("startDate: " + new Date(startDate));

		var endDate = new Date();
		endDate.setFullYear(year);
		endDate.setMonth(11);
		endDate.setDate(31);
		//alert("endDate: " + new Date(endDate));

		var app = new HIN.AppointmentSchedule();
		var dateArray = new Array();
		var appointmentMap = new HIN.HashMap();
		var monthMap = new HIN.HashMap();
		app.yearCalendarLoadHandler(patientCalendarObj.subscriberId,startDate,endDate,function(data) {
			 $.each(data, function(index, appointmentVO) {
				var dateTimeStamp = new Date(appointmentVO.start).getTime();
				dateArray.push(dateTimeStamp);
				appointmentMap.put(dateTimeStamp, appointmentVO);
				
				var monthAppVOArray = new Array();
				//alert(appointmentVO.start.getMonth());
				var month = monthMap.get(appointmentVO.start.getMonth());
				if (typeof (month) === 'object'&& month != null) {
					monthAppVOArray = monthMap.get(appointmentVO.start.getMonth()).value;
					monthAppVOArray.push(dateTimeStamp);
				}else{
					var test = new Array(); 
					test.push(dateTimeStamp);
					monthMap.put(appointmentVO.start.getMonth(), [dateTimeStamp]);
				}
				
			}); 

			for(var monthValue = 0; monthValue < 12; monthValue++){
				var month = monthMap.get(monthValue);
				//alert('month: '+month);
				if (typeof (month) === 'object'&& month != null) {
					var monthAppVOArray = new Array();
					monthAppVOArray = monthMap.get(monthValue).value;
					var length = monthAppVOArray.length;
					
					var sortedArray = monthAppVOArray.sort();
					if(length <= 2){
						for(var dateCount = 0; dateCount < 2 ;){
							date = sortedArray[dateCount];
							
							if(sortedArray[dateCount] == sortedArray[(dateCount+1)]){
								dateCount +=1;
							}
							
							var obj = appointmentMap.get(date);
							if (typeof (obj) === 'object'&& obj != null) {
								var appointmentVO = appointmentMap.get(date).value;
								var month = appointmentVO.start.getMonth();
								var month_class = "appointment-wrapper"+ month;
								var appointmentDetails = getAppointmentDetails(appointmentVO);
								uiWrapper.find("#"+ month_class).append(appointmentDetails);
								
								 
								uiWrapper.find('[navigate="chat"]').click(function(){
									navigateToChat();
								});
							}
							 dateCount += 1;
					    }
					}else{
						// to make sure appoinments are not repeated
						var appointmentList = new Array();
						for(var i = 0;i < sortedArray.length; i++){
							
							if(sortedArray[i] == sortedArray[(i+1)]){
								appointmentList.push(sortedArray[i]);
								i += 1;
							}else{
								appointmentList.push(sortedArray[i]);
							}
						}
						for(var dateCount = appointmentList.length-2; dateCount < appointmentList.length;){
							date = sortedArray[dateCount];
							
							var obj = appointmentMap.get(date);
							if (typeof (obj) === 'object'&& obj != null) {
								var appointmentVO = appointmentMap.get(date).value;
								var month = appointmentVO.start.getMonth();
								var month_class = "appointment-wrapper"+ month;
								var appointmentDetails = getAppointmentDetails(appointmentVO);
								uiWrapper.find("#"+ month_class).append(appointmentDetails);
								
								 
								uiWrapper.find('[navigate="chat"]').click(function(){
									navigateToChat();
								});
							}
							dateCount += 1;
					    }
					}
					
				}
			}
		});
	}
	
	function createLiDiv(month) {
		var table = "<tr>";
		for (index = 0; index < 4; index++) {
			table += getElement(month + index);
		}
		table += "</tr>";
		return table;
	}
	function getElement(month) {
		var td = '<td style="width:24%;"><div class="month-header" id="month-'+month+'">'+patientCalendarObj.monthNames[month]+' </div><div id="appointment-wrapper'+month+'" class="appointment-wrapper"></div></td><td></td>'
		return td;
	}
	
	function createHeader(year){
		var tableHeader = '<table id="yearDisplay" width="100%">'
			+ '<tr><td><div class="ui-grid-b">'
			+ '<div class="ui-block-a" style="text-align:right;width:42%"><div class="ui-block-a" style="text-align:left;font-weight:bold">Appointments</div></div><div class="ui-block-b">'
			+ '<div class="ui-grid-b">'
			+ '<div class="ui-block-a" style="text-align:right;width:45%"><img src="images/previous.png" id="previous"/></div>'
			+ '<div class="ui-block-b" style="text-align:center;width:20%;position:relative;top:2px;font-size:22px;" id="fullYearDisplay">'+year+'</div>'
			+ '<div class="ui-block-c"  style="text-align:left"><img src="images/next.png" id="next"/></div>'
			+ '</div></div>	</div></td></tr></table><br/>';
			
		return tableHeader;
	}
	
	function getAppointmentDetails(appointmentVO){
		//alert("gege: "+appointmentVO.comment);
		var date = appointmentVO.start;
		var day = date.getDate();
		var monthIndex = date.getMonth();
		var month = patientCalendarObj.monthNames[monthIndex];
		var hours = date.getHours();
		var min = date.getMinutes();
		var consultant ="";
		doctor = $.trim(appointmentVO.doctor);
		var appointmentReason = "";
		var comment = appointmentVO.comment;
		
		var dateTime = day+' '+ month +' '+' '+ hours + ':'+ min;
		
		if(doctor.length > 1){
			consultant ='Consultant: '+ doctor;
		}else{
			consultant = "";
		}

		if(appointmentVO.comment){
			appointmentReason = comment;
		}else{
			appointmentReason = "";
		}
		
		/* var appointmentView = '<div class="appointment-details-finish ui-round-corner view-'+monthIndex+'"><div class="data-align" id="dateTime">'+dateTime+'</div><div class="data-align" id="consultant">'+consultant+'</div><div class="data-align" id="appointment-reason">'+appointmentReason+'</div></div>';
		return appointmentView; */
		var appointmentView = "";
		if(date > new Date()){
		var	appointmentView = '<div navigate="chat" class="appointment-details-pending ui-round-corner view-'+monthIndex+'"><div class="data-align" id="dateTime">'+dateTime+'</div><div class="data-align" id="consultant">'+consultant+'</div><div class="data-align" id="appointment-reason">'+appointmentReason+'</div></div>';
		}else{
			appointmentView = '<div  navigate="chat" class="appointment-details-finish ui-round-corner view-'+monthIndex+'"><div class="data-align" id="dateTime">'+dateTime+'</div><div class="data-align" id="consultant">'+consultant+'</div><div class="data-align" id="appointment-reason">'+appointmentReason+'</div></div>';	
		}
		return appointmentView;
	}
	
	function changeYear(){
		var id = $(this).attr('id');
		if(id == 'previous'){
			var year = $("#yearcalendar").find("#fullYearDisplay").html();
			$("#yearcalendar").find("#fullYearDisplay").html(parseInt(year)-1);
			$("#yearcalendar").find("#yearDisplay").attr('currentYear',parseInt(year)-1);
		}else if(id == 'next'){
			var year = $("#yearcalendar").find("#fullYearDisplay").html();
			$("#yearcalendar").find("#fullYearDisplay").html(parseInt(year)+1);
			$("#yearcalendar").find("#yearDisplay").attr('currentYear',parseInt(year)+1);
		}
		loadMessage();
	}
	
	function navigateToChat(){
		//alert('clicked');
		renderingEngine.fireEvent(AppConstants.Event.MESSAGES_PAGE_INITIALIZED);
	}

}
