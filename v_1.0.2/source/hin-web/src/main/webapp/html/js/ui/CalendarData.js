var HIN;
if (!HIN)
	HIN = {};
HIN.CalendarData = function() {	
	this.listOfAppointment = {};
	this.year = new Date().getFullYear();
	this.month = new Date().getMonth();
	this.day = new Date().getDate();
	this.lookupValue = {};
	calendarData = this;
	
};
HIN.CalendarData.prototype.getData = function(){
	var listOfAppointment = {};
	var appointmentVO = new HIN.AppointmentVO();
	appointmentVO.id = 10;
	appointmentVO.title = 'New Calendar';
	appointmentVO.start = new Date(this.year, this.month, this.day, new Date().getHours(), new Date().getMinutes());
	appointmentVO.end = new Date(this.year, this.month, this.day, new Date().getHours()+1,  new Date().getMinutes());
	listOfAppointment[0] = appointmentVO;
	
	appointmentVO = new HIN.AppointmentVO();
	appointmentVO.id = 101;
	appointmentVO.title = 'Meeting'; 
	appointmentVO.start = new Date(this.year, this.month, this.day, 10, 30);
	appointmentVO.end = new Date(this.year, this.month, this.day, 11, 30);
	listOfAppointment[1] = appointmentVO;
	
	appointmentVO = new HIN.AppointmentVO();
	appointmentVO.id = 102;
	appointmentVO.title = 'Lunch';
	appointmentVO.start = new Date(this.year, this.month, this.day, 12, 0);
	appointmentVO.end = new Date(this.year, this.month, this.day, 13, 0);
	listOfAppointment[2] = appointmentVO;
	
	appointmentVO = new HIN.AppointmentVO();
	appointmentVO.id = 103;
	appointmentVO.title = 'Birthday Party';
	appointmentVO.start = new Date(this.year, this.month, this.day + 1, 14, 0);
	appointmentVO.end = new Date(this.year, this.month, this.day + 1, 15, 0);
	listOfAppointment[3] = appointmentVO;
	
	appointmentVO = new HIN.AppointmentVO();
	appointmentVO.id = 104;
	appointmentVO.title = 'Suroj,30 year,Heart Patient';
	appointmentVO.start = new Date(this.year, this.month, this.day - 1, 14, 0);
	appointmentVO.end = new Date(this.year, this.month, this.day - 1, 15, 0);
	listOfAppointment[4] = appointmentVO;
	return listOfAppointment;
};
HIN.CalendarData.prototype.getLookupData = function(){
	this.lookupValue = [{value: "22",label: "Sreekumar" }, 
	                    {value: "23",label: "Abdul Kahar"},
	                    {value: "24",label: "Madhu" }, 
	                    {value: "25",label: "Perumal"},
	                    {value: "26",label: "Suresh" }, 
	                    {value: "27",label: "Manju"},
	                    {value: "28",label: "Ashutosh Ashish" }, 
	                    {value: "29",label: "Sunanda Hangoraki"},
	                    {value: "30",label: "Swetha Murthy" }, 
	                    {value: "31",label: "Alaa Al Aswad"},
	                    {value: "32",label: "Anu Radhakrishnan" }, 
	                    {value: "33",label: "Bhanu Vinay Teja Bonam"},
	                    {value: "34",label: "Balakumar Annan Krishnanrao" }, 
	                    {value: "35",label: "Chandra Sekhar Kandru"},
	                    {value: "36",label: "Pramod C" }, 
	                    {value: "37",label: "Mariadass Dass"}];
	return this.lookupValue;
};
HIN.CalendarData.prototype.getFullLookupData = function(){
	return 	[ {
			id : 1,
			title : 'All Day Event',
			start : new Date(this.year, this.month, 1),
			color : 'gray',
			// backgroundColor: 'red',
			textColor : 'white',
			borderColor : '#000'
		}, {
			id : 2,
			title : 'Long Event',
			start : new Date(this.year, this.month, this.day - 5),
			end : new Date(this.year, this.month, this.day - 2)
		}, {
			id : 3,
			title : 'Repeating Event',
			start : new Date(this.year, this.month, this.day - 3, 16, 0),
			end : new Date(this.year, this.month, this.day - 3, 16, 30),
			allDay : false
		}, {
			id : 4,
			title : 'Repeating Event',
			start : new Date(this.year, this.month, this.day + 4, 16, 0),
			end : new Date(this.year, this.month, this.day + 4, 16, 30),
			allDay : false
		}, {
			id : 5,
			title : 'Meeting',
			start : new Date(this.year, this.month, this.day, 10, 30),
			end : new Date(this.year, this.month, this.day, 11, 30),
			allDay : false
		}, {
			id : 6,
			title : 'Lunch',
			start : new Date(this.year, this.month, this.day, 12, 0),
			end : new Date(this.year, this.month, this.day, 13, 0),
			img:'images/user.png',
			allDay : false
		}, {
			id : 7,
			title : 'Birthday Party',
			start : new Date(this.year, this.month, this.day + 1, 19, 0),
			end : new Date(this.year, this.month, this.day + 1, 20, 30),
			img:'images/user.png',
			allDay : false
		}, {
			id : 8,
			title : 'Click for Google',
			start : new Date(this.year, this.month,this.day + 1, 20),
			end : new Date(this.year, this.month, this.day + 1,21),
			url : 'http://google.com/',
			img:'images/user.png',
			allDay : false
		}, {
			id : 8,
			title : 'New Schedule',
			start : new Date(this.year, this.month, this.day, new Date().getHours(), new Date().getMinutes()),
			end : new Date(this.year, this.month, this.day, new Date().getHours()+1, new Date().getMinutes()),
			img:'images/user.png',
			allDay : false
		} ];
};
