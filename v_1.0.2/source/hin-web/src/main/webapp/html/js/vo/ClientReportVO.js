var HIN;
if (!HIN)
	HIN = {};

HIN.ClientReportVO = function(appController) {
	var thisObject = this;
	//this.appController = appController;
	this.svgContent = "";
	this.patientID = "";
	this.testValue = "";
	this.inflamationMessages = "";
	
};


HIN.ClientReportVO.prototype.setTestValue = function() {
	this.inflamationMessages = ["POLB_MT004000HT01_CAC"/*, "POLB_MT004000HT01_MCG", "POLB_MT004000HT01_SphygmoCor", "POLB_MT004000HT01_IMT", 
	                            "POLB_MT004000HT01_Bioclip"*/];
	for(i in this.inflamationMessages){
		var messageType = this.inflamationMessages[i];
		alert(messageType);
		if(messageType=="POLB_MT004000HT01_CAC"){
			var value = "";
			//var calculatedValue = calculateTestValue(message, value);
			
			var calciumCode = XmlUtil.getXPathResult(message, "message/POLB_MT004000HT01_CAC/component2["+ 7 + "]/observationEvent/value/value",
					XPathResult.STRING_TYPE);
			calciumCode = calciumCode.stringValue;
			alert("calciumCode: " + calciumCode);
			alert("inside");
		}
		
	}
};

HIN.ClientReportVO.prototype.toString = function() {
	return "[" + this.svgContent + " , " + this.patientID + "]";
};

HIN.ClientReportVO.prototype.setMessage = function() {
	var patientId = null;
	var patientVO = thisObject.appController.getComponent(
			"Context").getPatientVO(patientVO);
	if (patientVO) {
		patientId = patientVO.subscriberId;
	}
	if (!patientId)
		return;
	//alert(patientId);
	var query = new HIN.Query();
	query.id = patientId;

	var queryHashMap = new HIN.HashMap();
	var messageTypes = [ "POLB_MT004000HT01_CAC" ];
	for ( var index = 0; index < messageTypes.length; index++) {
		queryString = "";
		queryHashMap.put(messageTypes[index], queryString);
	}

	thisObject.appController.getComponent("DataLayer").getMessages(patientId,
			queryHashMap, function(data) {
				thisObject.loadResults(data)
			}, true);
	
	for ( var index = 0; index < data.length; index++) {
		var message = new HIN.Message();
		message.messageId = data[index].messageId;
		message.messageStatus = data[index].messageStatus;
		message.messageType = data[index].messageType;
		message.message = data[index].message;
		alert(message);
		alert("msg: \n"+message.message);
	}

};


HIN.ClientReportVO.prototype.calculateTestValue = function(message, testValue) {
	var calculatedValue;
	if(message=="POLB_MT004000HT01_CAC"){
		calculatedValue = 100-(testValue*5); 
	}else if(message=="POLB_MT004000HT01_MCG"){
		calculatedValue = 100-(testValue*10); 
	}
	else if(message=="POLB_MT004000HT01_SphygmoCor"){
		calculatedValue = 100-((testValue-60)*2); 
	}
	return calculatedValue;
};
