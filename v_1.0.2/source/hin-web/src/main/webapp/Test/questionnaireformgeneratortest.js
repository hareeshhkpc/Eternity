
function questionnaireTest(){
module("questionnaireformgeneratortest"); 
test( 'content generating',function() { 
var obj =  new HIN.QuestionnaireFormGenerator();
ok(obj.generateUI(1,1,"What?", ""), 'content is generated'); 
ok(obj.appendTotalUI(""),'total appended');
	
});

}

