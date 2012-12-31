function CLIENT_CHART_FORM(message, appController, uiGenerator) {
	// alert("client_chart_FORM");

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.loadReport = loadReport;
	this.reportRenderer = null;
	this.loadChartPage = loadChartPage;
	this.loadPathData = loadPathData;
	this.getChartData = getChartData;
	this.createChartdata = createChartdata;
	this.checkForGender = checkForGender;
	this.checkForGrayedOut = checkForGrayedOut;
	this.getHeartSmartValue = getHeartSmartValue;
	this.imtHeartSmartValues = [];
	this.calculateImtValue = calculateImtValue;
	this.getHeartSmartAndImtXAxisData = getHeartSmartAndImtXAxisData;
	this.checkForheartSmartAndImtGrayedOut = checkForheartSmartAndImtGrayedOut;
	// this.patient = new HIN.PatientInfo(appController);
	// this.cl_Report_Data = new HIN.ClientReport_Data(message, appController);

	/*
	 * this.loadPage = loadPage;
	 * 
	 * this.getData = getData; this.getResults = getResults; this.loadResults =
	 * loadResults; this.calculateTestValue = calculateTestValue;
	 * this.getMessageTypeIndicatorValues = getMessageTypeIndicatorValues;
	 */

	/*
	 * this.messageTypeMap = new HIN.HashMap(); this.putMessageType =
	 * putMessageType;
	 */

	this.GREY = "#CCCCCC";
	this.GREEN = "#8dc642";
	this.ORANGE = "#e8c237";
	this.RED = "#9B1F21";

	// this.colors = [ this.GREEN, this.ORANGE, this.RED ];

	// var counterBloodTest = 0;

	/*
	 * var cacValue = null; var cacColor = null; var cacIdealScore = null;
	 * 
	 * var mcgValue = null; var mcgColor = null; var mcgIdealScore = null; var
	 * sphygmocorValue = null; var sphygmocorColor = null; var
	 * sphygmocorIdealScore = null; var imtValue = null; var imtColor = null;
	 * var imtIdealScore = null;
	 */
	var bioclipValue = null;
	var bioclipColor = null;
	var bioclipIdealScore = null;
	var crp_hsValue = null;
	var crp_hsColor = null;
	var crp_hsIdealScore = null;
	var homocystieneValue = null;
	var homocystieneColor = null;
	var homocystieneIdealScore = null;
	this.printReport = printReport;
	var aluminiumValue = null;
	var aluminiumColor = null;
	var aluminiumIdealScore = null;
	var arsenicValue = null;
	var arsenicColor = null;
	var arsenicIdealScore = null;
	var cadmiumValue = null;
	var cadmiumColor = null;
	var cadmiumIdealScore = null;
	var leadValue = null;
	var leadColor = null;
	var leadIdealScore = null;
	var mercuryValue = null;
	var mercuryColor = null;
	var mercuryIdealScore = null;
	this.observationVOs = null;
	this.getXAxisData = getXAxisData;

	function initialize() {
		// alert("initialize");

		try {

			thisObject.loadReport();

			$("#printMonitorChartReport").hover(
					function() {
						$('#printMonitorChartReport').removeClass(
								'print-icon-link').addClass(
								'print-icon-link-hover')
					},
					function() {
						$('#printMonitorChartReport').removeClass(
								'print-icon-link-hover').addClass(
								'print-icon-link')
					});

			$('#printMonitorChartReport').bind('click', function() {
				printReport();
			});

			$('#printMonitorChartReport').unbind('click', function() {

			});

		} catch (error) {
			alert("Error in form initialize  script: " + error);
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

	function printReport() {
		var clientReportContent = document
				.getElementById('client_chartMainHeaderDivId');
		var popupWin = window.open('', '_blank',
				'width=744.09448819,height=1052.3622047');
		popupWin.document.open();
		popupWin.document.write('<html><body onload="window.print()">'
				+ clientReportContent.innerHTML + '</html>');
		popupWin.document.close();
	}
	;

	function loadReport() {
		for (pageIndex = 1; pageIndex <= 1; pageIndex++) {
			var pageId = "charts" + pageIndex;
			thisObject.loadChartPage(pageId, "chartReport");
		}

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
					messageType : "POLB_MT004000HT01_FitnessTest",
					testName : "FitnessTest_Female_StrengthPushUps"
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
									/* alert("gender=" + checkForGender()); */
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
															"FitnessTest_Female_StrengthPushUps"),
											color : [ "#92d050" ],
											title : [ "Strength" ],
											xAxisData : thisObject
													.getXAxisData(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Female_StrengthPushUps"),
											range : [ "0", "30" ],
											scale : [ "0", "200" ],
											grayedOutColor : thisObject
													.checkForGrayedOut(
															"POLB_MT004000HT01_FitnessTest",
															"FitnessTest_Female_StrengthPushUps")
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
													scale : [ "0", "150" ],
													grayedOutColor : thisObject
															.checkForGrayedOut(
																	"POLB_MT004000HT01_Heartmath",
																	"heartMat_HighValue")
												} ]
									} ];
									/* alert("array=" + $.toJSON(series)); */
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

									createChartdata(series, titleArray, pageId,
											function(node) {
												$("#monitorCharts1").html(
														node[0]);
												$("#monitorCharts2").html(
														node[1]);
												$("#monitorCharts3").html(
														node[2]);
												if (checkForGender()) {
													$("#monitorCharts4").html(
															node[3]);
												} else {
													$("#monitorCharts5").html(
															node[4]);
												}
												$("#monitorCharts6").html(
														node[5]);
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
					/* alert("valueArray" + valueArray); */
					return valueArray;
				} else {
					return [ 0 ];
				}
			}
		}
	}
	;
	function checkForGrayedOut(messageType, testName) {
		// alert("testName" + testName);
		for ( var index = 0; index < thisObject.observationVOs.length; index++) {
			// alert("data" + $.toJSON(thisObject.observationVOs));
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
		var json = $.toJSON(chartdata);
		// alert("josn" + json);

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
			/* alert("data" + $.toJSON(data)); */
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
					/* alert("dateArray" + valueArray); */
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
		var testArray = new Array();
		for (d in dateArray) {
			var total = 0;
			var valueArray = new Array();
			for (im in imtArray) {
				if (dateArray[d] == imtArray[im].date) {
					valueArray.push(imtArray[im].value);
				}
			}
			for (j in valueArray) {
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