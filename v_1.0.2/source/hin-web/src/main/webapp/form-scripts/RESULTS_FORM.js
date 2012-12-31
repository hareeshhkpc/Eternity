function RESULTS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	var patientVo = this.appController.getComponent("Context").getPatientVO(
			patientVo);
	var programVo = this.appController.getComponent("Context").getProgramVO(
			programVo);

	this.reportRenderer = null;
	this.reportRenderer = new ReportRenderer();
	this.reportModel = new HIN.ReportModel(appController, patientVo, programVo,
			thisObject.reportRenderer);

	this.loadPage = loadPage;
	this.getResults = getResults;
	this.loadReport = loadReport;
	this.loadResults = loadResults;

	this.observationVOs = null;
	this.gender = null;

	this.results_pageIdArray = new Array();
	this.resultFormClickHandler = resultFormClickHandler;

	function initialize() {

		try {

			if (patientVo) {
				thisObject.gender = patientVo.gender;
			}

			thisObject.results_pageIdArray.push("");
			thisObject.results_pageIdArray.push("");
			thisObject.results_pageIdArray.push("");
			thisObject.results_pageIdArray.push("results_togglePage3");
			thisObject.results_pageIdArray.push("results_togglePage4");
			thisObject.results_pageIdArray.push("results_togglePage5");
			thisObject.results_pageIdArray.push("results_togglePage6");
			thisObject.results_pageIdArray.push("results_togglePage7");
			thisObject.results_pageIdArray.push("results_togglePage8");
			thisObject.results_pageIdArray.push("results_togglePage9");
			thisObject.results_pageIdArray.push("results_togglePage10");
			thisObject.results_pageIdArray.push("results_togglePage11");
			thisObject.results_pageIdArray.push("results_togglePage12");

			for ( var newID = 3; newID <= 12; newID++) {
				$('#results_page' + newID).hide();
			}

			$(".results_pageClass").unbind('click',
					thisObject.resultFormClickHandler);
			$(".results_pageClass").bind('click',
					thisObject.resultFormClickHandler);

			// alert("initialize");
			thisObject.reportModel.setConfigurations();

			thisObject.getResults();

		} catch (error) {
			console.log("Error ResultsForm.initialize(): " + error);
			/* alert("Error in form initialize script: " + error); */
			/*appController
					.getComponent("RenderingEngine")
					.openPromptModalDialog(
							"Date Of Birth Require, Please enter Date Of Birth",
							function(result) {
								// alert(result);
							});
			notificationmsg.success("Date Of Birth Is Not Available");*/
		}

	}
	;

	function onLoad(callback) {

		try {
			// alert("onLoad");

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function getResults() {
		var patientId = null;
		var patientVO = this.appController.getComponent("Context").getPatientVO();
		if (patientVO) {
			patientId = patientVO.subscriberId;
		}
		if (!patientId)
			return;

		var query = new HIN.Query();
		query.id = patientId;

		var messageTypeMap = thisObject.reportModel.fetchMessageTypeMap();

		var queryHashMap = new HIN.HashMap();
		var key = null;
		var messageType = null;
		for ( var index = 0; index < messageTypeMap.length(); index++) {
			queryString = "";
			var map = messageTypeMap.getItemAt(index);
			messageType = map.key;
			queryHashMap.put(messageType, queryString);
		}

		
		var page = this.appController.getComponent("RenderingEngine")
		.getChildComponent("Form").getPage();
		
		page.getProcessDefinitionMessages(page,function(data){loadResults(data, messageTypeMap);});
		
	/*	this.appController.getComponent("DataLayer").getMessages(patientId,
				queryHashMap, function(data) {
					// alert("data:\n"+ data);
					thisObject.loadResults(data, messageTypeMap)
				}, true);
*/
	}
	;

	function loadResults(data, messageTypeMap) {
		// alert("data.length: " + data.length);
		for ( var index = 0; index < data.length; index++) {
			var message = new HIN.Message();
			message.messageId = data[index].messageId;
			message.messageStatus = data[index].messageStatus;
			message.messageType = data[index].messageType;
			message.message = XmlUtil.xmlToString(data[index].message);
			// alert("messageType: \n"+message.messageType);
			var map = messageTypeMap.get(message.messageType);
			if (map) {
				var object = map.value;

				var reportType = object.reportType;
				if (reportType == "consultation"
						|| reportType == "consultation4"
						|| reportType == "consultation5") {
					object.messages.push(message);
				} else {
					thisObject.reportModel.calculateTestValue(message);
				}
			}
		}
		thisObject.loadReport();
	}
	;

	function loadReport() {

		// loads results pages
		var hormonePage = null;

		if (thisObject.gender == "M") {
			hormonePage = 10;
			$("#results_togglePage10").css("display", "none");
		} else if (thisObject.gender == "F") {
			hormonePage = 9;
			$("#results_togglePage9").css("display", "none");
		} else {
			console.log("gender not defined");
		}
		for (pageIndex = 1; pageIndex <= 12; pageIndex++) {
			if (pageIndex != 3 && pageIndex != hormonePage && pageIndex != 2) {
				var pageId = "page" + pageIndex;
				thisObject.reportRenderer = new ReportRenderer();
				var svgDoc = thisObject.reportModel.loadPage(pageId, "results");
				$('#results_' + pageId).append(XmlUtil.xmlToString(svgDoc));
			} else if (pageIndex == 2) {
				var pageId = "page" + pageIndex;
				var pageUri = "../client-report/" + pageId + ".svg";
				var xmlNode = XmlUtil.loadXml(pageUri);
				$('#results_' + pageId).append(XmlUtil.xmlToString(xmlNode));
			}

		}

		var pageId = "page3";
		thisObject.reportRenderer = new ReportRenderer();
		var svgDoc = thisObject.reportModel.loadPage(pageId, "results");
		$('#results_' + pageId).append(XmlUtil.xmlToString(svgDoc));

	}
	;

	function loadPage(pageId, pageType) {
	}
	;

	var pagesMap = new HIN.HashMap();

	function createPageObject(page) {
	}

	function getScore(page) {
	}

	var integral = 0;
	function getEScore() {
	}

	function getData(page) {
	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function resultFormClickHandler() {
		// alert("in meth");
		var index = thisObject.results_pageIdArray.indexOf($(this).attr('id'));
		var currentPage = "results_page" + index;
		/*
		 * var page = appController.getComponent("RenderingEngine")
		 * .getChildComponent("Form").getPage();
		 */
		if (thisObject.lastOpenPage == null) {
			thisObject.lastOpenPage = currentPage;
			$('#' + currentPage).slideToggle('slow');
		} else {
			if (thisObject.lastOpenPage == currentPage) {
				$('#' + thisObject.lastOpenPage).slideToggle('slow');
				thisObject.lastOpenPage = null;
			} else {
				$('#' + thisObject.lastOpenPage).slideToggle('slow');
				$('#' + currentPage).slideToggle('slow');
				thisObject.lastOpenPage = currentPage;
			}

		}

	}

};