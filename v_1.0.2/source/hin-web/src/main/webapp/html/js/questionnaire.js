

function bindEvents(id1, id2, id3){
	$('#'+id1).click(function(){
		var value = $("#"+id3).html();
		if(value > 0){
			value = value-1;
			$("#"+id3).html(value);
		}
	});
	$('#'+id2).click(function(){
		var value = $("#"+id3).html();
		if(value < 10){
			value =parseInt(value)+1;
			$("#"+id3).html(value);
		}
	});
}

$(document).ready(function(){

	$("body").css("overflow", "auto");

	$('#scrollDown').click(function() {  
		pageScroll();
	});
	$('#scrollDown').click(function() { pageScroll(); });
	  
	  $('#scrollUp').click(function() { clearTimeout(scrolldelay);
	 $("body").scrollTop(0);
	 });
	 

	bindEvents("decrement", "increment", "numeric");
	bindEvents("decrementHealth", "incrementHealth", "numericHealth");


	$('#MedicationsToggle').click(function() {
		$('#Medications').slideToggle('slow');

	});

	$('#SurgeriesToggle').click(function(){
		$('#Surgeries').slideToggle('slow');
	});	 
	$('#HospitalizationsToggle').click(function(){
		$('#Hospitalizations').slideToggle('slow');
	});

	$('#FamilyHealthHistoryToggle').click(function() {
		$('#FamilyHealthHistory').slideToggle('slow');

	});
	$('#HealthHabitsToggle').click(function() {
		$('#HealthHabits').slideToggle('slow');

	});
	$('#OtherProblemsToggle').click(function() {
		$('#OtherProblems').slideToggle('slow');			
	});
	$('#lastExam').after( $( "<div id=lowDatePicker style='display:none'/>" ).datepicker({ altField: "#" +$('#lastExam').attr( "id" ), showOtherMonths: true }) );
	$('#lastExam').click(function(){
		
		$('#lowDatePicker').slideToggle("slow");
	})

	updateXml();

});

function pageScroll() {

	window.scrollBy(0,50); // horizontal and vertical scroll increments
	scrolldelay = setTimeout('pageScroll()',0); // 0 -->time in milliseconds
	
}

function updateXml(){

/*	alert("healthHabitPlainContent : "+ $("#healthHabitPlainContent").html());
	*/
	var xmlNode = XmlUtil.loadXml("POCD_MT000040HT01.xml");
	var valueXml = XmlUtil.find(xmlNode, "id", "xid11");
	var textarea=$("#textarea").val();
	var a= XmlUtil.find(xmlNode, "id", "xid27");
	XmlUtil.text(a,textarea);
	
	
	$('.childhood').each(function(i, val) {
		// alert($(this).attr("id"));

		if( $(val).is(':checked')) {


			/*alert("id found : " + $(val).attr("name"));*/
			var	checkbox = XmlUtil.find(valueXml, "code", $(val).attr("name")); 
			var originalText = XmlUtil.findByName(checkbox,"originalText",true);
			XmlUtil.text(originalText,"selected");
		}
	});

	var hospital=["Year","Reason","Hospital"];
	var surgeriesXml= XmlUtil.find(xmlNode, "id", "xid31");

	for(var i=1;i<4;i++)
	{
		var surgeriesFind= XmlUtil.find(surgeriesXml, "code", "entry"+i);
		$(hospital).each(function(index, value){
			var surgeriesTextBox=$("#surgeriesTextBox"+i+(index+1)).val();
			var surgYear  = XmlUtil.find(surgeriesFind, "code", value);
			XmlUtil.text(surgYear,surgeriesTextBox);
		});		
	}

	var hospitalxml= XmlUtil.find(xmlNode, "id", "xid35");
	for(var i=1;i<4;i++)
	{
		var hospitalization= XmlUtil.find(hospitalxml, "code", "entry"+i);
		$(hospital).each(function(index, value){

			var hospitalizationsTextBox=$("#hospitalizationsTextBox"+i+(index+1)).val();
			var hospYear  = XmlUtil.find(hospitalization, "code", value);
			XmlUtil.text(hospYear,hospitalizationsTextBox);
		});		
	}

	var med= ["Name the Drug", "Strength", "Frequency Taken"];
	var medXml= XmlUtil.find(xmlNode, "id", "xid40");
	for(var i=1;i<7;i++)
	{
		var medEntryXml = XmlUtil.find(medXml, "code", "entry"+i);
		$(med).each(function(index, value){
			var medicationsTextBox = $("#medicationsTextBox"+i+(index+1)).val();
			var medNameXml = XmlUtil.find(medEntryXml, "code", value);
			XmlUtil.text(medNameXml,medicationsTextBox);
		});		
	}

	var allergy= ["Name the Drug", "Reaction You Had"];
	var allergyXml= XmlUtil.find(xmlNode, "id", "xid44");
	for(var i=1;i<4;i++)
	{
		var allergyEntry = XmlUtil.find(allergyXml, "code", "entry"+i);
		$(allergy).each(function(index, value){
			var allergiesTextBox = $("#allergiesTextBox"+i+(index+1)).val();
			var allergyName = XmlUtil.find(allergyEntry, "code", value);
			XmlUtil.text(allergyName,allergiesTextBox);
		});		
	}

	function ageSignificant(id1,id2,headerName)
	{
		var ageXml = XmlUtil.find(xmlNode, "id", "xid49");
		var FatherXml = XmlUtil.find(ageXml, "code", headerName);
		var col1Xml = XmlUtil.find(FatherXml, "code", "AGE");
		var significantAge = $("#"+id1).val();
		XmlUtil.text(col1Xml,significantAge);
		var col2Xml = XmlUtil.find(FatherXml, "code", "SIGNIFICANT HEALTH PROBLEMS");
		var significantIssues = $("#"+id2).val();
		XmlUtil.text(col2Xml,significantIssues);
	}

	ageSignificant("significantTextbox11","significantTextbox21","Father");
	ageSignificant("significantTextbox12","significantTextbox22","Mother");
	ageSignificant("significantTextbox13","significantTextbox23","Siblings");
	ageSignificant("significantTextbox31","significantTextbox41","Grandmother");
	ageSignificant("significantTextbox32","significantTextbox42","Grandfather");

	var familyXml = XmlUtil.find(xmlNode, "id", "xid49");
	checkbox("family",familyXml);

	var healthXml=XmlUtil.find(xmlNode,"id","xid54");
	checkbox("health",healthXml);

	function checkbox(classname, node)
	{
		$('.'+ classname).each(function(i, val) {
			if( $(val).is(':checked')) {
		/*		alert("id found : " + $(val).attr("name"));*/
				var	familyCheckbox = XmlUtil.find(node, "code", $(val).attr("name")); 
				var originalText = XmlUtil.findByName(familyCheckbox,"originalText",true);
				XmlUtil.text(originalText,"selected");
			}
		});
	}

	var otherXml = XmlUtil.find(xmlNode, "id", "xid71");
	$('.other').each(function(i, val) {
		if( $(val).is(':checked')) {
/*			alert("id found : " + $(val).attr("name"));
		*/	var	otherCheckbox = XmlUtil.find(otherXml, "code", $(val).attr("name")); 
			var originalText = XmlUtil.findByName(otherCheckbox,"originalText",true);
			XmlUtil.text(originalText,"selected");
		}
	});
/*	alert("full xml :"+XmlUtil.xmlToString(xmlNode));*/


}
