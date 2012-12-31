
$(document).ready(function(){
	 $("body").css("overflow", "hidden");
	
	var xmlMsg = XmlUtil.loadXml("Appointment.xml");
	displayAppointments(xmlMsg);
	
	$('#question').click(function() {		
		$('#questionnaires').slideToggle('slow');
	});
	
	$('#diagnostic').click(function() {		
		$('#daignosticTest').slideToggle('slow');
	});
	
	$('#appointment').click(function() {		
		$('#appoinmentFields').slideToggle('slow');
		$('#appointmentfields').hide();
	});
	
	$('#appointmentTab1').click(function() {		
		$('#appointmentfields').slideToggle('slow');
	});
	
	$('#financial').click(function() {		
		$('#transaction').slideToggle('slow');
		$('#feesDetails').hide();
	});
	
	$('#fees').click(function() {		
		$('#feesDetails').slideToggle('slow');
	});
	
	$('#addQuestionnaires').click(function() {
		/*var question = $('#addQuestionType').html();
		$("#questionnaires").append('<div>'+question+'</div>');
		$("#division1").html("Personal Questionnaires");
		$('#questionnaires').append('<div class="ui-grid-a"><fieldset class="ui-grid-a"><div id="questionType" class="ui-block-a ui-body-b"><fieldset class="ui-grid-a">'
				+'<div id="division1" class="ui-block-b">Personal Questionnaires</div><div id="division2" class="ui-block-b">included</div></fieldset></div>'
				+'<div class="ui-block-b" id="button"><a href="#" data-role="button" id="delete" data-theme="a" data-icon="delete" data-iconpos="notext"></a></div>'		
				+'</fieldset></div>');*/
		$('#questionnaires').show();
		});
	
	 $('#remove').click(function() {
		    $('#addQuestionType').remove();
		  });
	
});


function displayAppointments(xmlMsg) {
	var encounterNode = null;
	var encounterNodeNum = null;
	var encounterDate = null;
	var process = null;
	var physician = null;
	var appointmentDate = null;
	var reason = null;
	var patient = null;
	var comments = null;
	
	var encounterNodeNum=xmlMsg.getElementsByTagName("encounter").length;
	
	/* for(var i=1; i<=encounterNodeNum; i++) { */
	encounterNode = XmlUtil.find(xmlMsg.childNodes[0], 'id', 'E1');
	// alert(XmlUtil.xmlToString(encounterNode));
	encounterDate = XmlUtil.attr (XmlUtil.findByName(encounterNode, "encounterDate", true), 'value');
	process = XmlUtil.text(XmlUtil.findByName(encounterNode, "process", true));
	physician = XmlUtil.text(XmlUtil.findByName(encounterNode, "physician", true));
	appointmentDate = XmlUtil.attr (XmlUtil.findByName(encounterNode, "appointmentDate", true), 'value');
	reason = XmlUtil.text(XmlUtil.findByName(encounterNode, "reason", true));
	patient = XmlUtil.text(XmlUtil.findByName(encounterNode, "patient", true));
	
	var schedule = 	getSchedule(encounterDate);
	$('#encounter').html(schedule);
	$('#process').html(process);
	$('#physician').html(physician);
	$('#appointmentDate').html(appointmentDate);
	$('#consultant').html(physician);
	$('#reason').html(reason);
	$('#patient').html(patient);
	
	/* } */
}

function getSchedule(date){
	var monthNames=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	var yy = date.substring(0,4);
	var dt = date.substring(4,6);
	var mm = date.substring(6,8);
	var hr = date.substring(8,10);
	var min = date.substring(10,12);
	
	var mon = mm.substring(0, 1);
	if(mon!=="0"){
		var month = mm;
	}
	else{
		month=mm.substring(1, 2);
	}
	
	var monthName = monthNames[month-1];
	
	var meridiem = null;
	if(hr<=12){
		meridiem = "AM"
	}
	else{
		meridiem = "PM"
	}
	var time = hr+":"+min+" "+meridiem;
	var schedule = dt+" "+monthName+" "+yy+" "+time;
	return schedule;
}

