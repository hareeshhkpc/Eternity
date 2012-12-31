
function indicatorTest(){
module("indicatortest");
test( 'indicators',function() { 

var obj =  new ReportRenderer("","");
 ok(obj.createRectangle("red","7","5"),'ticked'); 
	
});
}

