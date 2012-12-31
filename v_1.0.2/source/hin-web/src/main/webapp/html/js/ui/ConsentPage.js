var HIN;
if (!HIN)
	HIN = {};
HIN.ConsentPage = function(appController, pageHolder) {
	consentPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "consentPage";// pageHolder;
};

HIN.ConsentPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.ConsentPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("ConsentPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ConsentPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	 //alert("addInitialHandler");
};

HIN.ConsentPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	//alert("addCompleteHandler: " + messageType);
	consentPage.fillConsentInformation(message);
};

HIN.ConsentPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.ConsentPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.ConsentPage.prototype.taskHandler = function(message, taskVO, instance) {
	//alert(XmlUtil.xmlToString(message.message));
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var object = new Object();
	object.instance = instance;
	page.getMessageScript(message, object, consentPage.fillMessageStatus);
};

HIN.ConsentPage.prototype.fillMessageStatus = function(messageTypeScript,
		object, message) {
	var messageStatus = XmlUtil.getXPathResult(message.message,
			"//POCD_MT000040UV_ConsentForm/id[root='MSG_STATUS']/extension");
	var statusNode = messageStatus.iterateNext();
	
	XmlUtil.text(statusNode, 'Signed');

	var messageObjects = [ message ];
	var processObjects = [ consentPage.processDefinition ];
	var parameters = [ messageObjects, processObjects ];
	consentPage.appController.getComponent("DataLayer").createOrUpdateTasks(parameters);
};

HIN.ConsentPage.prototype.fillConsentInformation = function(message) {

	var messageStatus = XmlUtil.getXPathResult(message.message,
			"//POCD_MT000040UV_ConsentForm/id[root='MSG_STATUS']/extension",
			XPathResult.STRING_TYPE);
	var fileMsgId = $("#EDReference").attr("value");
	if(!fileMsgId){

	/*messageStatus = (messageStatus && messageStatus.stringValue) ? messageStatus.stringValue
			: "";*/

		/*var registrationMessage = appController.getComponent("Context")
				.getFromContext("registration");

		if (registrationMessage) {
			var xmlNode = XmlUtil
					.loadXml("/hin-web/resources/consent-form/consent_page1_new.xml");
			var XmlFragment = XmlUtil.findByName(registrationMessage,
					"message", true);
			var XmlSubFragment = XmlUtil.findByName(XmlFragment,
					"PRPA_MT201000HT03", true);
			var identifiedPerson = XmlUtil.findByName(XmlSubFragment,
					"identifiedPerson", true);
			var assigningOrganization = XmlUtil.findByName(XmlSubFragment,
					"assigningOrganization", true);

			
			var clientNumber = XmlUtil.getXPathResult(registrationMessage,
					"message/PRPA_MT201000HT03/identifiedPerson/asIdentifications/id/extension",
					XPathResult.STRING_TYPE);
			clientNumber = clientNumber.stringValue;

			var name = XmlUtil.findByName(identifiedPerson, "name", true);
			var prefix = XmlUtil.findByName(name, "prefix", true);
			var family = XmlUtil.findByName(name, "family", true);
			var given = XmlUtil.findByName(name, "given", true);
			var suffix = XmlUtil.findByName(name, "suffix", true);
			var patientName = null;
			if (prefix) {
				patientName = XmlUtil.text(prefix);
			}
			if (given) {
				if (patientName) {
					patientName = patientName + " " + XmlUtil.text(given);
				} else {
					patientName = XmlUtil.text(given);
				}
			}
			if (family) {
				if (patientName) {
					patientName = patientName + " " + XmlUtil.text(family);
				} else {
					patientName = XmlUtil.text(family);
				}
			}
			if (suffix) {
				if (patientName) {
					patientName = patientName + " " + XmlUtil.text(suffix);
				} else {
					patientName = XmlUtil.text(suffix);
				}
			}
			var birthTimeNode = XmlUtil.getXPathResult(registrationMessage,
					AppConstants.XPaths.SUBSCRIBER_BIRTH_TIME,
					XPathResult.STRING_TYPE);
			if (birthTimeNode) {
				var birthTime = birthTimeNode.stringValue;
				var dobNode = XmlUtil.find(xmlNode, "id", "tspan3025");
				XmlUtil.text(dobNode, birthTime);
			}
			
			var nameNode = XmlUtil.find(xmlNode, "id", "tspan3017");
			XmlUtil.text(nameNode, patientName);

			var clientStaticNode = XmlUtil.find(xmlNode, "id", "tspan3033");
			XmlUtil.text(clientStaticNode, clientNumber);
			$("#EDSpan").append(XmlUtil.xmlToString(xmlNode));
			$("#EDSpan").trigger("change");			
		}*/
		var patientVO = appController.getComponent("Context").getPatientVO();
		if (patientVO) {
			var xmlNode = XmlUtil
					.loadXml("/hin-web/resources/consent-form/consent_page1_new.xml");
			var patientName = patientVO.name;
			if (patientVO.dob){
				var dobNode = XmlUtil.find(xmlNode, "id", "tspan3025");
				XmlUtil.text(dobNode, patientVO.dob);
			}
			if(patientVO.name){
				var nameNode = XmlUtil.find(xmlNode, "id", "tspan3017");
				XmlUtil.text(nameNode, patientVO.name);
			}
			if(patientVO.membershipId){
				var clientStaticNode = XmlUtil.find(xmlNode, "id", "tspan3033");
				XmlUtil.text(clientStaticNode, patientVO.membershipId);
			}
			$("#EDSpan").append(XmlUtil.xmlToString(xmlNode));
			$("#EDSpan").trigger("change");	
		}
	}
	
	$("#printIcon").hover(function() {
		$('#printIcon').removeClass('print-icon-link').addClass('print-icon-link-hover')
	}, function() {
		$('#printIcon').removeClass('print-icon-link-hover').addClass('print-icon-link')
	});
	
	$('#printIcon').unbind(
			'click',
			function() {
				
			});
	$('#printIcon').bind(
			'click',
			function() {
				$('#printIcon').removeClass('print-icon-link').addClass('print-icon-link-onpress');
				var consentContentprint = document
				.getElementById('consentContent');
				if($("#EDReference").attr("value")){
					consentContentprint = document
					.getElementById('displayFile');
				}			
				var popupWin = window.open('', '_blank',
						'width=300,height=300');
				popupWin.document.open();
				popupWin.document
						.write('<html><body onload="window.print()">'
								+ consentContentprint.innerHTML
								+ '</html>');
				popupWin.document.close();						
			});
	
	var patientId = consentPage.appController.getComponent("Context").getPatient();
	$('#patientId').attr("value",patientId);

}