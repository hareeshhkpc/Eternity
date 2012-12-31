function CLIENT_REPORT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	var patientVo = this.appController.getComponent("Context").getPatientVO(
			patientVo);
	// alert("patientVo: " + patientVo);
	var programVo = this.appController.getComponent("Context").getProgramVO(
			programVo);

	this.reportRenderer = null;
	this.reportRenderer = new ReportRenderer();
	this.reportModel = new HIN.ReportModel(appController, patientVo, programVo,
			thisObject.reportRenderer);

	this.checkForGender = checkForGender;
	this.loadChartPage = loadChartPage;
	this.getChartData = getChartData;
	this.getResults = getResults;
	this.loadReport = loadReport;
	this.loadResults = loadResults;
	this.printReport = printReport;
	this.checkForGrayedOut = checkForGrayedOut;
	this.getXAxisData = getXAxisData;

	this.observationVOs = null;
	var gender = null;
	var svgStringContent = "";
	var svgContentInitialiser = false;
	this.getHeartSmartValue = getHeartSmartValue;
	this.imtHeartSmartValues = [];
	this.calculateImtValue = calculateImtValue;
	this.getHeartSmartAndImtXAxisData = getHeartSmartAndImtXAxisData;
	this.checkForheartSmartAndImtGrayedOut = checkForheartSmartAndImtGrayedOut;

	function initialize() {

		try {

			if (patientVo) {
				gender = patientVo.gender;
			}

			thisObject.reportModel.setConfigurations();

			thisObject.getResults();

			$("#printClientReport").hover(
					function() {
						$('#printClientReport').removeClass('print-icon-link')
								.addClass('print-icon-link-hover')
					},
					function() {
						$('#printClientReport').removeClass(
								'print-icon-link-hover').addClass(
								'print-icon-link')
					}).click(function() {
				$("#printClientReport").removeClass(this);
				$("#printClientReport").addClass('print-icon-link-press');
			});

			$("#downloadClientReport").hover(
					function() {
						$('#downloadClientReport').removeClass(
								'download-icon-link').addClass(
								'download-icon-link-hover')
					},
					function() {
						$('#downloadClientReport').removeClass(
								'download-icon-link-hover').addClass(
								'download-icon-link')
					}).click(
					function() {
						$("#downloadClientReport").removeClass(this);
						$("#downloadClientReport").addClass(
								'download-icon-link-press');
					});

			$('#printClientReport').bind('click', function() {
				printReport();
			});

			$('#printClientReport').unbind('click', function() {

			});

			$("#downloadAsPdf").hover(function() {

			}, function() {

			});

			$('#downloadAsPdf').bind('click', function() {
				downloadClientReport();
			});

			$('#downloadAsPdf').unbind('click', function() {

			});

		} catch (error) {
			console.log("Error ClientReport.initialize(): " + error);

			/* alert("Error in form initialize script: " + error); */
			/*
			 * appController .getComponent("RenderingEngine")
			 * .openPromptModalDialog( "Date Of Birth Require, Please enter Date
			 * Of Birth", function(result) { // alert(result); });
			 */
			// notificationmsg.success("Date Of Birth Is Not Available");
		}

	}
	;

	function printReport() {

		var clientReportContent = document
				.getElementById('client_mainHeaderDivId');
		var popupWin = window.open('', '_blank',
				'width=744.09448819,height=1052.3622047');
		popupWin.document.open();
		popupWin.document.write('<html><body onload="window.print()">'
				+ clientReportContent.innerHTML + '</html>');
		popupWin.document.close();

	}
	;

	function downloadClientReport() {
		this.appController.getComponent("DataLayer").downloadClientReportPDF(
				svgStringContent);
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
		var patientVO = appController.getComponent("Context").getPatientVO();
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

		page.getProcessDefinitionMessages(page, function(data) {
			loadResults(data, messageTypeMap);
		});

		/*
		 * this.appController.getComponent("DataLayer").getMessages(patientId,
		 * queryHashMap, function(data) { // alert("data:\n"+ data);
		 * thisObject.loadResults(data, messageTypeMap) }, true);
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

		appController.getComponent("RenderingEngine").openModalDialog(
				"Loading Client Report");
		// loads results pages
		var hormonePage = null;

		if (gender == "M") {
			hormonePage = 10;
		} else if (gender == "F") {
			hormonePage = 9;
		} else {
			console.log("gender not defined");
		}
		for (pageIndex = 1; pageIndex <= 12; pageIndex++) {
			if (pageIndex != 3 && pageIndex != hormonePage && pageIndex != 2) {
				var pageId = "page" + pageIndex;
				thisObject.reportRenderer = new ReportRenderer();
				var svgDoc = thisObject.reportModel.loadPage(pageId, "results");

				if (svgContentInitialiser == false) {
					svgStringContent += XmlUtil.xmlToString(svgDoc);
					svgContentInitialiser = true;
				} else {
					svgStringContent += "SVGSPLITTER"
							+ XmlUtil.xmlToString(svgDoc);
				}

				// svgStringContent = XmlUtil.xmlToString(svgDoc);
				$('#client_' + pageId).html(XmlUtil.xmlToString(svgDoc));
			} else if (pageIndex == 2) {
				var pageId = "page" + pageIndex;
				var pageUri = "../client-report/" + pageId + ".svg";
				var xmlNode = XmlUtil.loadXml(pageUri);
				svgStringContent += "SVGSPLITTER"
						+ XmlUtil.xmlToString(xmlNode);
				$('#client_' + pageId).html(XmlUtil.xmlToString(xmlNode));
			}

		}

		var pageId = "page3";
		thisObject.reportRenderer = new ReportRenderer();
		var svgDoc = thisObject.reportModel.loadPage(pageId, "results");
		svgStringContent += "SVGSPLITTER" + XmlUtil.xmlToString(svgDoc);
		$('#client_' + pageId).html(XmlUtil.xmlToString(svgDoc));

		// loads consultation pages
		for (pageIndex = 1; pageIndex <= 6; pageIndex++) {
			var pageId = "consultation" + pageIndex;
			thisObject.reportRenderer = new ReportRenderer();
			var svgDoc = thisObject.reportModel
					.loadPage(pageId, "consultation");
			svgStringContent += "SVGSPLITTER" + XmlUtil.xmlToString(svgDoc);
			$('#' + pageId).html(XmlUtil.xmlToString(svgDoc));
		}

		// load charts
		for (pageIndex = 1; pageIndex <= 1; pageIndex++) {
			var pageId = "charts" + pageIndex;
			thisObject.loadChartPage(pageId, "chartReport");
		}
		appController.getComponent("RenderingEngine").closeModalDialog();
	}
	;

	function loadChartPage(pageId, pageType) {
		var strengthArray = [];
		var bodyFatArray = [];
		var testosteron = [];
		var estrodiol = [];
		var progesteron = [];

		if (pageType == "chartReport") {
			if (pageId == "charts1") {
				this.imtHeartSmartValues = [ {
					"name" : "Normal",
					"value" : "1"
				}, {
					"name" : "Mild",
					"value" : "2"
				}, {
					"name" : "Moderate",
					"value" : "3"
				}, {
					"name" : "Significant",
					"value" : "4"
				}, {
					"name" : "Critical Significant",
					"value" : "5"
				}, {
					"name" : "None Observed",
					"value" : "1"
				}, {
					"name" : "Early Buildup",
					"value" : "2"
				}, {
					"name" : "Calcified",
					"value" : "3"
				}, {
					"name" : "Mixed",
					"value" : "4"
				}, {
					"name" : "Soft",
					"value" : "5"
				}, {
					"name" : "None Observed",
					"value" : "1"
				}, {
					"name" : "Nominal",
					"value" : "2"
				}, {
					"name" : "Less than 30%",
					"value" : "3"
				}, {
					"name" : "Between 30%-50%",
					"value" : "4"
				}, {
					"name" : "Greater than 50%",
					"value" : "5"
				} ];
				var observationArray = new Array();
				observationArray.push({
					messageType : "POLB_MT004000HT01_CAC",
					testName : "CACCalciumScore"
				}, {
					messageType : "POLB_MT004000HT01_MCG",
					testName : "MCGScore"
				}, {
					messageType : "POLB_MT004000HT01_SphygmoCor",
					testName : "SphygmoCor_AorticPP"
				}, {
					messageType : "POLB_MT004000HT01_IMT",
					testName : "imtPercentile"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_CRP"
				}, {
					messageType : "POLB_MT004000HT01_PAI1",
					testName : ""
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Testosterone"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Cholesterol"
				}, {
					messageType : "POLB_MT004000HT01_Biospace",
					testName : "biospace_BodyFat"
				}, {
					messageType : "POLB_MT004000HT01_FitnessTest",
					testName : "FitnessTest_Male_StrengthPushUps"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Glycosylated Haemoglobin"
				}, {
					messageType : "POLB_MT004000HT01_FitnessTest",
					testName : "FitnessTest_Male_BoneDensity"
				}, {
					messageType : "POLB_MT004000HT01_Thyroflex",
					testName : "Thyroflex_Thyroid-Sulfate"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Vitamin_B12"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Magnesium"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Dehydroepiandrosterone-Sulfate"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Estrogen"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_VitD3"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_PAI-1"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "bloodTest_Progesterone"
				}, {
					messageType : "POLB_MT004000HT01_Heartmath",
					testName : "heartMat_HighValue"
				}, {
					messageType : "POLB_MT004000HT01_ToxinePanel",
					testName : "toxine_Aluminum"
				}, {
					messageType : "POLB_MT004000HT01_ToxinePanel",
					testName : "toxine_Cadmium"
				}, {
					messageType : "POLB_MT004000HT01_ToxinePanel",
					testName : "toxine_Lead"
				}, {
					messageType : "POLB_MT004000HT01_Biospace",
					testName : "biospace_Weight"
				}, {
					messageType : "POLB_MT004000HT01_CNS",
					testName : "CNSVS_CompositeMemory"
				}, {
					messageType : "POLB_MT004000HT01_IMT_HearSmart",
					testName : "IMT_HeartSmart_Intima_Media_Thickness"
				}, {
					messageType : "POLB_MT004000HT01_IMT_HearSmart",
					testName : "IMT_HeartSmart_Plaque_Character"
				}, {
					messageType : "POLB_MT004000HT01_IMT_HearSmart",
					testName : "IMT_HeartSmart_Percent_Stenosis"
				}, {
					messageType : "POLB_MT004000HT01_BloodTest",
					testName : "Blood_Estradiol_(E2)"
				});
				var observationVO = new HIN.ObservationVO();
				for (t in observationArray) {
					var object = new Object();
					object.messageType = observationArray[t].messageType;
					object.testName = observationArray[t].testName;
					observationVO.observationTests.push(object);
				}
				var observationObject = new HIN.ChartData();
				observationObject
						.getObservationValue(
								observationVO,
								function(observationVOsData) {
									thisObject.observationVOs = observationVOsData;

									if (checkForGender()) {
										strengthArray = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps"),
											color : [ "#92d050" ],
											title : [ "Strength" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps"),
											range : [ "0", "12" ],
											scale : [ "0", "200" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps")
										};

										bodyFatArray = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat"),
											color : [ "orange" ],
											title : [ "% Body fat" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat"),
											range : [ "5", "20" ],
											scale : [ "0", "80" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat")

										};

										testosteron = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone"),
											color : [ "orange" ],
											title : [ "Testosterone" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone"),
											range : [ "700", "850" ],
											scale : [ "0", "3000" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone")

										};

										estrodiol = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"Blood_Estradiol_(E2)"),
											color : [ "#92d050" ],
											title : [ "Estradiol" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"Blood_Estradiol_(E2)"),
											range : [ "0", "50" ],
											scale : [ "0", "800" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"Blood_Estradiol_(E2)")
										};

										progesteron = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone"),
											color : [ "#3b618e" ],
											title : [ "Progesterone" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone"),
											range : [ "1", "2" ],
											scale : [ "0", "800" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone")

										};

									} else {

										strengthArray = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps"),
											color : [ "#92d050" ],
											title : [ "Strength" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps"),
											range : [ "0", "30" ],
											scale : [ "0", "200" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Male_StrengthPushUps")
										};

										bodyFatArray = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat"),
											color : [ "orange" ],
											title : [ "% Body fat" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat"),
											range : [ "15", "25" ],
											scale : [ "0", "80" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_Biospace",
															"biospace_BodyFat")

										};

										testosteron = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone"),
											color : [ "orange" ],
											title : [ "Testosterone" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone"),
											range : [ "5", "84" ],
											scale : [ "0", "1300" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Testosterone")

										};

										estrodiol = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Estrogen"),
											color : [ "#92d050" ],
											title : [ "Estrogen" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Estrogen"),
											range : [ "90", "950" ],
											scale : [ "0", "1300" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Estrogen")
										};

										progesteron = {
											data : thisObject
													.getChartData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone"),
											color : [ "#3b618e" ],
											title : [ "Progesterone" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone"),
											range : [ "2", "86" ],
											scale : [ "0", "1300" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_BloodTest",
															"bloodTest_Progesterone")

										};

									}

									var series = [ {
										"chart1" : [
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_CAC",
																	"CACCalciumScore"),
													color : [ "orange" ],
													title : [ "CAC" ],
													range : [ "0", "10" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_CAC",
																	"CACCalciumScore"),
													scale : [ "0", "500" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_CAC",
																	"CACCalciumScore")
												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_MCG",
																	"MCGScore"),
													color : [ "#92d050" ],
													title : [ "MCG" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_MCG",
																	"MCGScore"),
													range : [ "0", "1" ],
													scale : [ "0", "15" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_MCG",
																	"MCGScore")
												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_SphygmoCor",
																	"SphygmoCor_AorticPP"),
													color : [ "#3b618e" ],
													title : [ "SphygmoCor" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_SphygmoCor",
																	"SphygmoCor_AorticPP"),
													range : [ "60", "80" ],
													scale : [ "0", "200" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_SphygmoCor",
																	"SphygmoCor_AorticPP")
												},
												{
													data : thisObject
															.getHeartSmartValue(
																	"POLB_MT004000HT01_IMT",
																	"POLB_MT004000HT01_IMT_HearSmart"),
													color : [ "#f37122" ],
													title : [ "IMT" ],
													xAxisData : thisObject
															.getHeartSmartAndImtXAxisData(
																	"POLB_MT004000HT01_IMT",
																	"POLB_MT004000HT01_IMT_HearSmart"),
													range : [ "0", "25" ],
													scale : [ "0", "100" ],
													grayedOutColor : thisObject
															.checkForheartSmartAndImtGrayedOut(
																	"POLB_MT004000HT01_IMT",
																	"POLB_MT004000HT01_IMT_HearSmart")
												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_CRP"),
													color : [ "#8dc642" ],
													title : [ "CRP" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_CRP"),
													range : [ "0", "1" ],
													scale : [ "0", "200" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_CRP")
												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_PAI-1"),
													color : [ "#4881be" ],
													title : [ "PAI1" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_PAI-1"),
													range : [ "0", "30" ],
													scale : [ "0", "1000" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_PAI-1")
												} ],
										"chart2" : [
												bodyFatArray,
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Glycosylated Haemoglobin"),
													color : [ "#92d050" ],
													title : [ "HbA1C" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Glycosylated Haemoglobin"),
													range : [ "3", "5" ],
													scale : [ "0", "200" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Glycosylated Haemoglobin")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Cholesterol"),
													color : [ "#3b618e" ],
													title : [ "LDL-Cholesterol" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Cholesterol"),
													range : [ "0", "100" ],
													scale : [ "0", "1000" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Cholesterol")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Aluminum"),
													color : [ "#f37122" ],
													title : [ "Aluminum" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Aluminum"),
													range : [ "0", "35" ],
													scale : [ "0", "500" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Aluminum")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Lead"),
													color : [ "#8dc642" ],
													title : [ "Lead" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Lead"),
													range : [ "0", "2" ],
													scale : [ "0", "300" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Lead")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Cadmium"),
													color : [ "#4881be" ],
													title : [ "Cadmium" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Cadmium"),
													range : [ "0", "1" ],
													scale : [ "0", "100" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_ToxinePanel",
																	"toxine_Cadmium")
												} ],
										"chart3" : [
												{
													data : [],/*
																 * thisObject
																 * .getChartData(
																 * "POLB_MT004000HT01_Biospace",
																 * "biospace_Weight"),
																 */
													color : [ "orange" ],
													title : [ "weight" ],
													xAxisData : [],
													range : [ "40", "80" ],
													scale : [ "0", "200" ],
													grayedOutColor : [ "#a7a9ac" ]

												},
												strengthArray,
												{
													data : [ 0 ],/*
																	 * thisObject
																	 * .getChartData(
																	 * "POLB_MT004000HT01_FitnessTest",
																	 * "FitnessTest_Male_BoneDensity"),
																	 */
													color : [ "#3b618e" ],
													title : [ "Bone density" ],
													xAxisData : [],/*
																	 * thisObject
																	 * .getXAxisData(
																	 * "POLB_MT004000HT01_FitnessTest",
																	 * "FitnessTest_Male_BoneDensity")
																	 */
													range : [ "0", "0.5" ],
													grayedOutColor : [ "#a7a9ac" ]
												/*
												 * thisObject
												 * .checkForGrayedOut(
												 * "POLB_MT004000HT01_FitnessTest",
												 * "FitnessTest_Male_BoneDensity")
												 */

												},
												{
													data : [ 0 ],
													color : [ "#f37122" ],
													title : [ "CRS" ],
													xAxisData : [],
													range : [ "0", "0.5" ],
													grayedOutColor : [ "#a7a9ac" ]

												},
												{
													data : [ 0 ],
													color : [ "#8dc642" ],
													title : [ "Genetic Existence Screen" ],
													xAxisData : [],
													range : [ "0", "0.5" ],
													grayedOutColor : [ "#a7a9ac" ]

												},
												{
													data : [ 0 ],
													color : [ "#4881be" ],
													title : [ "Telemore length" ],
													xAxisData : [],
													range : [ "0", "0.5" ],
													grayedOutColor : [ "#a7a9ac" ]

												} ],
										"chart4" : [
												testosteron,
												estrodiol,
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Dehydroepiandrosterone-Sulfate"),
													color : [ "#3b618e" ],
													title : [ "DHEA" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Dehydroepiandrosterone-Sulfate"),
													range : [ "350", "450" ],
													scale : [ "0", "1000" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Dehydroepiandrosterone-Sulfate")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate"),
													color : [ "#f37122" ],
													title : [ "Thyroid" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate"),
													range : [ "0", "100" ],
													scale : [ "0", "800" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate")

												} ],
										"chart5" : [
												testosteron,
												estrodiol,
												progesteron,
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate"),
													color : [ "#f37122" ],
													title : [ "Thyroid" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate"),
													range : [ "0", "100" ],
													scale : [ "0", "800" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_Thyroflex",
																	"Thyroflex_Thyroid-Sulfate")

												} ],
										"chart6" : [
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_VitD3"),
													color : [ "orange" ],
													title : [ "Vitamin D3" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_VitD3"),
													range : [ "75", "100" ],
													scale : [ "0", "500" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_VitD3")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Magnesium"),
													color : [ "#92d050" ],
													title : [ "Magnesium" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Magnesium"),
													range : [ "8", "11" ],
													scale : [ "0", "150" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Magnesium")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Vitamin_B12"),
													color : [ "#3b618e" ],
													title : [ "Vit B12" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Vitamin_B12"),
													range : [ "250", "750" ],
													scale : [ "0", "3000" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_BloodTest",
																	"bloodTest_Vitamin_B12")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_CNS",
																	"CNSVS_CompositeMemory"),
													color : [ "#f37122" ],
													title : [ "CNS-VS" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_CNS",
																	"CNSVS_CompositeMemory"),
													range : [ "90", "100" ],
													scale : [ "0", "150" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_CNS",
																	"CNSVS_CompositeMemory")

												},
												{
													data : thisObject
															.getChartData(
																	"POLB_MT004000HT01_Heartmath",
																	"heartMat_HighValue"),
													color : [ "#8dc642" ],
													title : [ "ANS - ewave" ],
													xAxisData : thisObject
															.getXAxisData(
																	"POLB_MT004000HT01_Heartmath",
																	"heartMat_HighValue"),
													range : [ "70", "100" ],
													scale : [ "0", "100" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_Heartmath",
																	"heartMat_HighValue")
												} ]
									} ];

									var titleArray = [ {
										"chart1" : [ {
											title : "Inflammation control",
											value : "3"
										} ],
										"chart2" : [ {
											title : "Nutrition and metabolism",
											value : "3"
										}, {
											title : "Toxin reduction",
											value : "3"
										} ],
										"chart3" : [ {
											title : "Exercise",
											value : "3"
										}, {
											title : "Genetics and aesthetics",
											value : "3"
										} ],
										"chart4" : [ {
											title : "Restoration of male hormones",
											value : "4"
										} ],
										"chart5" : [ {
											title : "Restoration of female hormones",
											value : "4"
										} ],
										"chart6" : [
												{
													title : "Advanced supplementation",
													value : "3"
												},
												{
													title : "Lifelong (mind-body) learning",
													value : "3"
												} ]
									} ];

									createChartdata(
											series,
											titleArray,
											pageId,
											function(node) {
												svgStringContent += "SVGSPLITTER"
														+ node[0];
												svgStringContent += "SVGSPLITTER"
														+ node[1];
												svgStringContent += "SVGSPLITTER"
														+ node[2];
												$("#charts1").html(node[0]);
												$("#charts2").html(node[1]);
												$("#charts3").html(node[2]);
												if (checkForGender()) {
													svgStringContent += "SVGSPLITTER"
															+ node[3];
													$("#charts4").html(node[3]);
												} else {
													svgStringContent += "SVGSPLITTER"
															+ node[4];
													$("#charts5").html(node[4]);
												}
												svgStringContent += "SVGSPLITTER"
														+ node[5];
												$("#charts6").html(node[5]);
											});
								});
			}
		}
	}

	function getChartData(messageType, testName) {
		var temp = 0;
		// alert("data" + $.toJSON(thisObject.observationVOs));
		for ( var index = 0; index < thisObject.observationVOs.length; index++) {
			var valueArray = new Array();
			var observationVO = thisObject.observationVOs[index];
			if (observationVO.messageType == messageType
					&& observationVO.testName == testName) {
				if (observationVO.observationValue.length > 0) {
					for (i in observationVO.observationValue) {
						valueArray
								.push(observationVO.observationValue[i].value);

					}
					$.each(valueArray, function(key, value) {
						if (!value) {
							valueArray[key] = 0;
						}
					});
					return valueArray;
				} else {
					return [ 0 ];
				}
			}
		}
	}
	;

	function checkForGender() {
		var patientVo = thisObject.appController.getComponent("Context")
				.getPatientVO(patientVo);
		/* alert("patientVo.gender" + patientVo.gender); */
		if (patientVo.gender == 'M') {
			return true;
		} else if (patientVo.gender == 'F') {
			return false;
		} else {
			// alert("Please Specify Gender");
		}
	}
	;

	function createChartdata(series, titleArray, pageId, callBackData) {
		var seriesList = [ {
			data : [ 0 ],
			color : [ "orange" ],
			title : [ "Weight" ],
			range : [ "0", "40" ]
		} ];
		var chartdata = new HIN.ChartVO();
		chartdata.chartSeries = series;
		chartdata.testData = seriesList;
		chartdata.titleArray = titleArray;
		chartdata.patientId = '1234';
		chartdata.testDate = new Date();
		chartdata.testType = "Testosterone";
		chartdata.ymin = 70;
		chartdata.ymax = 170;
		var json = $.toJSON(chartdata); /* alert("josn" + json); */

		loadPathData(json, series, titleArray, function(node) {
			if (callBackData) {
				callBackData(node);
			}

		});
	}
	;

	// charts
	function loadPathData(json, series, titleArray, callBack) {
		var alterData = null;
		var jqxhr = $.post("/hin-web/rest/chart/chartSvgController", {
			json : json
		}, function(data) {
			alterData = data;
		}).success(function() {
			if (callBack) {
				callBack(alterData);
			}
		}).error(function() {
			/* alert("error in loading chart" + $.toJSON(titleArray)); */
		}).complete(function() {

		});

	}
	;

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function checkForGrayedOut(messageType, testName) {
		var months = new Array();
		months.push(8);
		months.push(9);
		months.push(10);
		months.push(11);
		months.push(0);
		months.push(1);
		months.push(2);
		months.push(3);
		for ( var index = 0; index < thisObject.observationVOs.length; index++) {
			var valueArray = new Array();
			var observationVO = thisObject.observationVOs[index];
			if (observationVO.messageType == messageType
					&& observationVO.testName == testName) {
				if (!observationVO.observationValue.length > 0) {
					return [ "#a7a9ac" ];
				}
			}

		}
	}
	;
	function getXAxisData(messageType, testName) {
		var temp = 0;
		for ( var index = 0; index < thisObject.observationVOs.length; index++) {
			var valueArray = new Array();
			var observationVO = thisObject.observationVOs[index];
			if (observationVO.messageType == messageType
					&& observationVO.testName == testName) {
				if (observationVO.observationValue.length > 0) {
					for (i in observationVO.observationValue) {
						valueArray.push(observationVO.observationValue[i].date);
					}
					return valueArray;
				} else {
					return [];
				}
			}
		}
	}
	;
	function getHeartSmartValue(imtPanasonicMessageType,
			imtHeartSmartMessageType) {
		var imtValues = new Array();
		var imtArray = new Array();
		var dateArray = new Array();
		for ( var index = 0; index < thisObject.observationVOs.length; index++) {
			var observationVO = thisObject.observationVOs[index];
			if (observationVO.messageType == imtHeartSmartMessageType) {
				// alert("data=" + $.toJSON(observationVO.observationValue));
				for (i in observationVO.observationValue) {
					imtArray.push({
						date : observationVO.observationValue[i].date,
						value : observationVO.observationValue[i].value
					});
					dateArray.push(observationVO.observationValue[i].date);
				}
			} else if (observationVO.messageType == imtPanasonicMessageType) {
				imtValues = thisObject.getChartData(imtPanasonicMessageType,
						"imtPercentile");
			}
		}
		var imtHeartSmartValues = thisObject.calculateImtValue(imtArray,
				dateArray);
		if (imtHeartSmartValues.length > 0)
			return imtHeartSmartValues;
		else
			return imtValues;

	}
	;

	function calculateImtValue(imtArray, dateArray) {
		var imtHeartSmartValue = new Array();
		
		for (d in dateArray) {
			var total = 0;
			var valueArray = new Array();
			for (im in imtArray) {
				if (dateArray[d] == imtArray[im].date) {
					valueArray.push(imtArray[im].value);
				}
			}
			for (j in valueArray) {
				var testArray = new Array();
				for (k in this.imtHeartSmartValues) {
					if (valueArray[j] == this.imtHeartSmartValues[k].name) {
						if(testArray.indexOf(this.imtHeartSmartValues[k].name) == -1){
						var range = this.imtHeartSmartValues[k].value;
						if (range == 1) {
							total += 100;
						}
						if (range == 2) {
							total += 65;
						}
						if (range == 3) {
							total += 40;
						}
						if (range == 4) {
							total += 25;
						}
						if (range == 5) {
							total += 10;
						}
					}
						testArray.push(this.imtHeartSmartValues[k].name);
					}
				}
			}

			imtHeartSmartValue.push(total / 3);

		}
		return imtHeartSmartValue;

	}
	;
	
	function getHeartSmartAndImtXAxisData(imtPanasonicMessageType,
			imtHeartSmartMessageType) {
		var xAxis = new Array();
		xAxis = thisObject.getXAxisData(imtHeartSmartMessageType,
				"IMT_HeartSmart_Intima_Media_Thickness");
		if (xAxis.length == 0) {
			xAxis = thisObject.getXAxisData(imtPanasonicMessageType,
					"imtPercentile");
		}
		if (xAxis.length > 0) {
			return xAxis;
		} else {
			return [];
		}

	}
	;
	function checkForheartSmartAndImtGrayedOut(imtPanasonicMessageType,
			imtHeartSmartMessageType) {

		var grayedOut1 = thisObject.checkForGrayedOut(imtHeartSmartMessageType,
				"IMT_HeartSmart_Intima_Media_Thickness");
		var grayedOut2 = thisObject.checkForGrayedOut(imtPanasonicMessageType,
				"imtPercentile");
		if (grayedOut1 && grayedOut2) {
			return [ "#a7a9ac" ];
		}

	}
	;

};