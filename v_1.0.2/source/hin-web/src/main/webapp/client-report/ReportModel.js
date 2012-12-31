var HIN;
if (!HIN)
	HIN = {};

HIN.ReportModel = function(appController, patientVo, programVo, reportRenderer) {
	this.appController = appController;
	this.patientVo = patientVo;
	this.programVo = programVo;
	this.reportRenderer = reportRenderer;
	var thisObject = this;

	this.messageTypeMap = new HIN.HashMap();
	this.testScoreRefs = [];
	this.pagesMap = new HIN.HashMap();
	this.GREY = "#CCCCCC";
	this.GREEN = "#8dc642";
	this.ORANGE = "#e8c237";
	this.RED = "#9B1F21";

	this.gender = null;
	var dob = null;
	var genderIndex = null;
	this.currentAge = null;
	var bioFatConstant = null;
	var bioFatRefRange_Green = null;
	var bioFatRefRange_Orange = null;
	var today_date;
	var today_year;
	var today_month;
	var today_day;
	var current_date;
	this.pageFractionWeightMaps = new HIN.HashMap();
}

HIN.ReportModel.prototype.setConfigurations = function() {

	today_date = new Date();
	today_year = today_date.getFullYear();
	today_month = today_date.getMonth() + 1;
	today_day = today_date.getDate();
	today_day = today_day;
	current_date = today_day + "-" + today_month + "-" + today_year;

	if (this.patientVo) {
		this.gender = this.patientVo.gender;
		dob = this.patientVo.dob;
		if (dob) {
			dob = new Date(dob);
			var newdate = formatDate(dob, "dd/MM/yyyy");
			this.currentAge = this.calculateAge(newdate);

		}else{
			this.appController
			.getComponent("RenderingEngine")
			.openPromptModalDialog(
					"Date Of Birth Require, Please enter Date Of Birth",
					function(result) {
						// alert(result);
					});
		}

	}

	if (this.gender == "M") {
		genderIndex = 0;
		bioFatConstant = "15";
		bioFatRefRange_Green = 20;
		bioFatRefRange_Orange = 25;
	} else {
		genderIndex = 1;
		bioFatConstant = "20";
		bioFatRefRange_Green = 25;
		bioFatRefRange_Orange = 30;
	}

	// CAC
	this
			.putMessageType(
					"POLB_MT004000HT01_CAC",
					[ "CAC" ],
					[ "message/POLB_MT004000HT01_CAC/component2[7]/observationEvent/value/value" ],
					[ "((x<=10 && x>=0)?this.GREEN:(x<=100?this.ORANGE:this.RED))" ],
					[ "0-10" ],
					[ "" ],
					[ "((x<=10 && x>=0)?this.testScoreRefs.push(0, 10, 3):(x<=100?this.testScoreRefs.push(10, 100 , 4):this.testScoreRefs.push(100, 0 , 5)))" ]);

	// MCG
	this
			.putMessageType(
					"POLB_MT004000HT01_MCG",
					[ "MCG" ],
					[ "message/POLB_MT004000HT01_MCG/component2/observationEvent[4]/text/thumbnail" ],
					[ "((x<=1 && x>=0)?this.GREEN:(x<5?this.ORANGE:this.RED))" ],
					[ "0-1" ],
					[ "26" ],
					[ "((x<=1 && x>=0)?this.testScoreRefs.push(0, 1, 3):(x<=4?this.testScoreRefs.push(1, 4, 4):this.testScoreRefs.push(4, 15, 5)))" ]);

	// Sphygmocor
	this
			.putMessageType(
					"POLB_MT004000HT01_SphygmoCor",
					[ "SphygmoCor" ],
					[ "message/POLB_MT004000HT01_SphygmoCor/component2/observationEvent[2]/value/value" ],
					[ "((x<50 && x>=0)?this.RED:((x>=50 && x<60)?this.ORANGE:((x>=60 && x<=80)?this.GREEN:((x>80 && x<=90)?this.ORANGE:this.RED))))" ],
					[ "60-80" ],
					[ "16" ],
					[ "((x<50 && x>=0)?this.testScoreRefs.push(0, 50, 1):(x==50||x<60?this.testScoreRefs.push(50, 60, 2):(x==60||x<=80?this.testScoreRefs.push(60, 80, 3):(x>80||x<=90?this.testScoreRefs.push(80, 90 , 4):this.testScoreRefs.push(90, 200, 5)))))" ]);

	// IMT Panasonic
	this
			.putMessageType(
					"POLB_MT004000HT01_IMT",
					[ "IMT" ],
					[ "message/POLB_MT004000HT01_IMT/component2[6]/observationEvent/value/value" ],
					[ "(x<26?this.GREEN:(x<75?this.ORANGE:this.RED))" ],
					[ "<25" ],
					[ "26" ],
					[ "(x<26?this.testScoreRefs.push(0, 25.9, 3):(x<75?this.testScoreRefs.push(26, 74, 4):this.testScoreRefs.push(0, 0, 5)))" ]);

	// IMT HeartSmart
	this
			.putMessageType(
					"POLB_MT004000HT01_IMT_HearSmart",
					[ "IMT", "IMT", "IMT" ],
					[
							"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[1]/text/thumbnail",
							"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[2]/text/thumbnail",
							"message/POLB_MT004000HT01_IMT_HearSmart/component2/observationEvent[3]/text/thumbnail" ],
					[ "(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))",
							"(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))",
							"(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))" ],
					[ "A", "A", "A" ],
					[ "26", "26", "26" ],
					[
							"(x==100?this.testScoreRefs.push(0, 0, 1):(x==65?this.testScoreRefs.push(0, 0, 2):(x==40?this.testScoreRefs.push(0, 0, 3):(x==25?this.testScoreRefs.push(0, 0 , 4):this.testScoreRefs.push(0, 0, 5)))))",
							"(x==100?this.testScoreRefs.push(0, 0, 1):(x==65?this.testScoreRefs.push(0, 0, 2):(x==40?this.testScoreRefs.push(0, 0, 3):(x==25?this.testScoreRefs.push(0, 0 , 4):this.testScoreRefs.push(0, 0, 5)))))",
							"(x==100?this.testScoreRefs.push(0, 0, 1):(x==65?this.testScoreRefs.push(0, 0, 2):(x==40?this.testScoreRefs.push(0, 0, 3):(x==25?this.testScoreRefs.push(0, 0 , 4):this.testScoreRefs.push(0, 0, 5)))))" ]);

	// BioClip
	this
			.putMessageType(
					"POLB_MT004000HT01_Bioclip",
					[ "Bioclip" ],
					[ "message/POLB_MT004000HT01_Bioclip/component2[1]/observationEvent/value/value" ],
					[ "(x<this.currentAge?this.GREEN:(x==this.currentAge?this.ORANGE:this.RED))" ],
					[ "<" + this.currentAge ],
					[ "16" ],
					[ "(x<this.currentAge?this.testScoreRefs.push(0, 0, 3):(x==this.currentAge?this.testScoreRefs.push(0, 0 , 4):this.testScoreRefs.push(0, 0 , 5)))" ]);

	// Blood Test
	this
			.putMessageType(
					"POLB_MT004000HT01_BloodTest",
					[ "CRP-hs", "Homocysteine", "TNF", "PAI-1", "Fibrinogen",
							"Ferritin", "FBS", "HbA1C", "Insulin",
							"Triglycerides", "HDL-cholesterol H",
							"LDL-cholesterol L", "Adiponectin", "Leptin",
							"Resistin", "CA-125", "CEA", "AFP", "PSA", "HCG",
							"CA15-3", "Testosterone", "Progesterone",
							"Estradiol", "DHT", "Pregnenolone", "Cortisol",
							"Insulin", "Vitamin D3", "DHEA", "IgF", "Estrogen",
							"FSH", "LH", "Hemoglobin", "Total protein",
							"Albumen", "Globulin", "Magnesium", "Calcium",
							"Uric Acid", "Vitamin B12", "Ferritin" ],
					[
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_High-Sensitivity_C_Reactive_Protein']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Homocysteine']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_TNF']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_PAI-1']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Fibrinogen']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Ferritin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Glucose']/value/value/text()", // fbs
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Glycosylated Haemoglobin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Fasting Insulin']/value/value/text()", // fasting insulin
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Triglycerides']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Total_HDL']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Total_LDL']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Adiponectin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Leptin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Resistin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CA_125']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CEA']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_AFP']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_PSA']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_HCG']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_CA15_3']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Total_Testosterone']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Progesterone']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Estradiol_(E2)']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_DHT']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Pregnenolone']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Cortisol']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Fasting Insulin']/value/value/text()", // insulin
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_VitD3']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Dehydroepiandrosterone-Sulfate']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_IGF']/value/value/text()", // igf
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Estrogen']/value/value/text()",
							"",// fsh
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Luteinising_Hormone']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Haemoglobin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Protein-Total']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Albumin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Globulin']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Magnesium']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Calcium']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Uric_Acid']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Vitamin_B12']/value/value/text()",
							"message/POLB_MT004000HT01_BloodTest/component2/observationEvent[code/code='Blood_Ferritin']/value/value/text()" ],

					[
							[
									"(x<1?this.GREEN:((x>=1 && x<=3)?this.ORANGE:this.RED))", // CRP-hs
									"((x>=0 && x<=10)?this.GREEN:((x>10 && x<=13)?this.ORANGE:this.RED))",// Homocysteine
									"(x<8?this.GREEN:((x>=8 && x<=10)?this.ORANGE:this.RED))",// TNF
									"((x>=0 && x<=30)?this.GREEN:((x>30 && x<=40)?this.ORANGE:this.RED))",// PAI-1
									"(x<300?this.GREEN:((x>=300 && x<=400)?this.ORANGE:this.RED))",// Fibrinogen
									"(x<300?this.GREEN:(x<=365?this.ORANGE:this.RED))",// Ferritin
									"(x<40?this.RED:((x>=40 && x<50)?this.ORANGE:((x>=50 && x<=85)?this.GREEN:((x>85 && x<=100)?this.ORANGE:this.RED))))",// FBS
									"((x>=0 && x<=5)?this.GREEN:(x<=6?this.ORANGE:this.RED))",// HbA1C
									"(x<1?this.RED:(x==1||x<2?this.ORANGE:(x==2||x<=5?this.GREEN:(x>5 && x<=10?this.ORANGE:this.RED))))",// fasting insulin
									"(x<100?this.GREEN:(x<=150?this.ORANGE:this.RED))",// Triglycerides
									"(x<40?this.RED:(x<=55?this.ORANGE:this.GREEN))",// HDL-cholesterolH
									"(x<100?this.GREEN:(x<=120?this.ORANGE:this.RED))",// LDL-cholesterolL
									"(x<1.4?this.RED:(x<=4?this.ORANGE:this.GREEN))",// Adiponectin
									"(x<6?this.GREEN:(x<=9?this.ORANGE:this.RED))",// Leptin
									"((x>=0 && x<15)?this.GREEN:((x>=15 && x<=20)?this.ORANGE:this.RED))",// Resistin
									"(x<35?this.GREEN:(x<=65?this.ORANGE:this.RED))",// CA-125
									"(x<4?this.GREEN:(x<=5?this.ORANGE:this.RED))",// CEA
									"(x<12?this.GREEN:(x<=15?this.ORANGE:this.RED))",// AFP
									"(x<3.5?this.GREEN:(x<=4?this.ORANGE:this.RED))",// PSA
									"(x<4?this.GREEN:(x<=5?this.ORANGE:this.RED))",// HCG
									"(x<28?this.GREEN:(x<=31?this.ORANGE:this.RED))",// CA15-3
									"(x<500?this.RED:((x>=500 && x<700)?this.ORANGE:((x>=700 && x<=850)?this.GREEN:((x>850 && x<=900)?this.ORANGE:this.RED))))",// Testosterone
									"(x<0.15?this.RED:(x==0.15||x<1?this.ORANGE:(x==1||x<=2?this.GREEN:(x>2 && x<=5?this.ORANGE:this.RED))))",// Progesterone
									"(x<=50?this.GREEN:((x>50 && x<=150)?this.ORANGE:this.RED))",// Estradiol
									"(x<10?this.RED:((x>=10 && x<25)?this.ORANGE:((x>=25 && x<=100)?this.GREEN:((x>100 && x<=125)?this.ORANGE:this.RED))))",// DHT
									"this.GREY",// Pregnenolone
									"(x<200?this.RED:((x>=200 && x<225)?this.ORANGE:((x>=225 && x<=700)?this.GREEN:((x>700 && x<=850)?this.ORANGE:this.RED))))",// Cortisol
									"(x<1?this.RED:(x==1||x<=1.9?this.ORANGE:(x==2||x<=4.9?this.GREEN:(x==5||x<=10?this.ORANGE:this.RED))))",// Insulin
									"(x<50?this.RED:((x>=50 && x<75)?this.ORANGE:((x>=75 && x<=100)?this.GREEN:((x>100 && x<=150)?this.ORANGE:this.RED))))",// VitaminD3
									"(x<250?this.RED:(x==250||x<350?this.ORANGE:((x>=350 && x<=450)?this.GREEN:(x>450 && x<=500?this.ORANGE:this.RED))))",// DHEA
									"(x<99?this.RED:(x==99||x<225?this.ORANGE:(x==225||x<=380?this.GREEN:(x>380 && x<=400?this.ORANGE:this.RED))))",// IgF
									"(x<50?this.RED:(x==50||x<=89?this.ORANGE:(x==90||x<=950?this.GREEN:(x==951||x<=1250?this.ORANGE:this.RED))))",// Estrogen
									"this.GREY",// FSH
									"this.GREY",// LH
									"(x<11?this.RED:((x>=11 && x<13.5)?this.ORANGE:((x>=13.5 && x<=17.5)?this.GREEN:((x>17.5 && x<=20)?this.ORANGE:this.RED))))",// Hemoglobin
									"(x<5?this.RED:(x<=6?this.ORANGE:this.GREEN))",// Totalprotein
									"(x<3?this.RED:(x<=5?this.ORANGE:this.GREEN))",// Albumen
									"(x<2?this.RED:(x<=3?this.ORANGE:this.GREEN))",// Globulin
									"(x<6?this.RED:((x>=6 && x<8)?this.ORANGE:((x>=8 && x<=11)?this.GREEN:((x>11 && x<=14)?this.ORANGE:this.RED))))",// Magnesium
									"(x<6?this.RED:((x>=6 && x<8.5)?this.ORANGE:((x>=8.5 && x<=10.5)?this.GREEN:((x>10.5 && x<=11)?this.ORANGE:this.RED))))",// Calcium
									"(x<4.5?this.GREEN:(x<=5.5?this.ORANGE:this.RED))",// UricAcid
									"(x<200?this.RED:((x>=200 && x<250)?this.ORANGE:((x>=250 && x<=750)?this.GREEN:((x>750 && x<=850)?this.ORANGE:this.RED))))",// VitaminB12
									"(x<300?this.GREEN:(x<=365?this.ORANGE:this.RED))" ],// Ferritin
							[
									"(x<1?this.GREEN:((x>=1 && x<=3)?this.ORANGE:this.RED))", // CRP-hs
									"((x>=0 && x<=10)?this.GREEN:((x>10 && x<=13)?this.ORANGE:this.RED))",// Homocysteine
									"(x<8?this.GREEN:((x>=8 && x<=10)?this.ORANGE:this.RED))",// TNF
									"((x>=0 && x<=30)?this.GREEN:((x>30 && x<=40)?this.ORANGE:this.RED))",// PAI-1
									"(x<300?this.GREEN:((x>=300 && x<=400)?this.ORANGE:this.RED))",// Fibrinogen
									"(x<300?this.GREEN:(x<=365?this.ORANGE:this.RED))",// Ferritin
									"(x<40?this.RED:((x>=40 && x<50)?this.ORANGE:((x>=50 && x<=85)?this.GREEN:((x>85 && x<=100)?this.ORANGE:this.RED))))",// FBS
									"((x>=0 && x<=5)?this.GREEN:(x<=6?this.ORANGE:this.RED))",// HbA1C
									"(x<1?this.RED:(x==1||x<2?this.ORANGE:(x==2||x<=5?this.GREEN:(x>5 && x<=10?this.ORANGE:this.RED))))",// fasting insulin
									"(x<100?this.GREEN:(x<=150?this.ORANGE:this.RED))",// Triglycerides
									"(x<40?this.RED:(x<=55?this.ORANGE:this.GREEN))",// HDL-cholesterolH
									"(x<100?this.GREEN:(x<=120?this.ORANGE:this.RED))",// LDL-cholesterolL
									"(x<1.4?this.RED:(x<=4?this.ORANGE:this.GREEN))",// Adiponectin
									"(x<6?this.GREEN:(x<=9?this.ORANGE:this.RED))",// Leptin
									"((x>=0 && x<15)?this.GREEN:((x>=15 && x<=20)?this.ORANGE:this.RED))",// Resistin
									"(x<35?this.GREEN:(x<=65?this.ORANGE:this.RED))",// CA-125
									"(x<4?this.GREEN:(x<=5?this.ORANGE:this.RED))",// CEA
									"(x<12?this.GREEN:(x<=15?this.ORANGE:this.RED))",// AFP
									"(x<3.5?this.GREEN:(x<=4?this.ORANGE:this.RED))",// PSA
									"(x<4?this.GREEN:(x<=5?this.ORANGE:this.RED))",// HCG
									"(x<28?this.GREEN:(x<=31?this.ORANGE:this.RED))",// CA15-3
									"(x<3?this.RED:(x==3||x<5?this.ORANGE:(x==5||x<=84?this.GREEN:(x>84 && x<=100?this.ORANGE:this.RED))))",// Testosterone
									"(x<1?this.RED:(x==1||x<2?this.ORANGE:(x==2||x<=86?this.GREEN:(x>86 && x<=100?this.ORANGE:this.RED))))",// Progesterone
									"(x<=50?this.GREEN:((x>50 && x<=150)?this.ORANGE:this.RED))",// Estradiol
									"(x<10?this.RED:((x>=10 && x<25)?this.ORANGE:((x>=25 && x<=100)?this.GREEN:((x>100 && x<=125)?this.ORANGE:this.RED))))",// DHT
									"this.GREY",// Pregnenolone
									"(x<200?this.RED:((x>=200 && x<225)?this.ORANGE:((x>=225 && x<=700)?this.GREEN:((x>700 && x<=850)?this.ORANGE:this.RED))))",// Cortisol
									"(x<1?this.RED:(x==1||x<=1.9?this.ORANGE:(x==2||x<=4.9?this.GREEN:(x==5||x<=10?this.ORANGE:this.RED))))",// Insulin
									"(x<50?this.RED:((x>=50 && x<75)?this.ORANGE:((x>=75 && x<=100)?this.GREEN:((x>100 && x<=150)?this.ORANGE:this.RED))))",// VitaminD3
									"(x<250?this.RED:(x==250||x<350?this.ORANGE:((x>=350 && x<=450)?this.GREEN:(x>450 && x<=500?this.ORANGE:this.RED))))",// DHEA
									"(x<99?this.RED:(x==99||x<225?this.ORANGE:(x==225||x<=380?this.GREEN:(x>380 && x<=400?this.ORANGE:this.RED))))",// IgF
									"(x<50?this.RED:(x==50||x<=89?this.ORANGE:(x==90||x<=950?this.GREEN:(x==951||x<=1250?this.ORANGE:this.RED))))",// Estrogen
									"this.GREY",// FSH
									"this.GREY",// LH
									"(x<11?this.RED:((x>=11 && x<13.5)?this.ORANGE:((x>=13.5 && x<=17.5)?this.GREEN:((x>17.5 && x<=20)?this.ORANGE:this.RED))))",// Hemoglobin
									"(x<5?this.RED:(x<=6?this.ORANGE:this.GREEN))",// Totalprotein
									"(x<3?this.RED:(x<=5?this.ORANGE:this.GREEN))",// Albumen
									"(x<2?this.RED:(x<=3?this.ORANGE:this.GREEN))",// Globulin
									"(x<6?this.RED:((x>=6 && x<8)?this.ORANGE:((x>=8 && x<=11)?this.GREEN:((x>11 && x<=14)?this.ORANGE:this.RED))))",// Magnesium
									"(x<6?this.RED:((x>=6 && x<8.5)?this.ORANGE:((x>=8.5 && x<=10.5)?this.GREEN:((x>10.5 && x<=11)?this.ORANGE:this.RED))))",// Calcium
									"(x<4.5?this.GREEN:(x<=5.5?this.ORANGE:this.RED))",// UricAcid
									"(x<200?this.RED:((x>=200 && x<250)?this.ORANGE:((x>=250 && x<=750)?this.GREEN:((x>750 && x<=850)?this.ORANGE:this.RED))))",// VitaminB12
									"(x<300?this.GREEN:(x<=365?this.ORANGE:this.RED))" ] ],// Ferritin
					[
							[ "<1", "0-10", "<8", "0-30", "<300", "<300",
									"50-85", "3-5", "2-5", "<100", ">55",
									"<100", ">4", "<6", "5-15", "<35", "<4",
									"<12", "<3.5", "<4", "<28", "700-850",
									"1-2", "0-50", "25-100", "", "225-700",
									"2-5", "75-100", "350-450", "225-380", "",
									"", "", "13.5-17.5", ">6", ">5", ">3", "8-11",
									"8.5-10.5", "<4.5", "250-750", "<300" ],
									
							[ "<1", "0-10", "<8", "0-30", "<300", "<300",
									"50-85", "3-5", "2-5", "<100", ">55",
									"<100", ">4", "<6", "5-15", "<35", "<4",
									"<12", "<3.5", "<4", "<28", "5-84",
									"2-86", "0-50", "25-100", "", "225-700",
									"2-5", "75-100", "350-450", "225-380", "90-950",
									"", "", "13.5-17.5", ">6", ">5", ">3", "8-11", 
									"8.5-10.5", "<4.5", "250-750", "<300" ] ],
									
					[ "16", "", "", "", "", "", "16", "26", "", "16", "", "16",
							"", "", "", "", "", "", "", "", "", "26", "16",
							"16", "", "", "16", "", "", "", "", "16", "", "",
							"", "16", "16", "", "26", "", "", "16", "" ],
					[
							[
									"(x<1?this.testScoreRefs.push(0, 1, 3):((x>=1 && x<=3)?this.testScoreRefs.push(1, 3, 4):this.testScoreRefs.push(3, 200 , 5)))",// CRP-hs
									"((x>=0 && x<=10)?this.testScoreRefs.push(0, 10, 3):((x>10 && x<=13)?this.testScoreRefs.push(10, 13 , 4):this.testScoreRefs.push(13, 200 , 5)))",// Homocysteine
									"(x<8?this.testScoreRefs.push(0, 8, 3):((x>=8 && x<=10)?this.testScoreRefs.push(8, 10 , 4):this.testScoreRefs.push(10, 200 , 5)))",// TNF
									"((x>=0 && x<=30)?this.testScoreRefs.push(0, 30, 3):((x>30 && x<=40)?this.testScoreRefs.push(30, 40 , 4):this.testScoreRefs.push(40, 1000 , 5)))",// PAI-1
									"(x<300?this.testScoreRefs.push(0, 300, 3):((x>=300 && x<=400)?this.testScoreRefs.push(300, 400 , 4):this.testScoreRefs.push(400, 1000 , 5)))",// Fibrinogen
									"(x<300?this.testScoreRefs.push(0, 300, 3):(x<=365?this.testScoreRefs.push(300, 365 , 4):this.testScoreRefs.push(365, 1000 , 5)))",// Ferritin
									"(x<40?this.testScoreRefs.push(0, 40 ,1):((x>=40 && x<50)?this.testScoreRefs.push(40, 50, 2):((x>=50 && x<=85)?this.testScoreRefs.push(50, 85, 3):((x>85 && x<=100)?this.testScoreRefs.push(85, 100, 4):this.testScoreRefs.push(100, 500, 5)))))",// FBS
									"((x>=0 && x<=5)?this.testScoreRefs.push(0, 5, 3):((x>5 && x<=6)?this.testScoreRefs.push(5, 6, 4):this.testScoreRefs.push(6, 200, 5)))",// HbA1C
									"(x<1?this.testScoreRefs.push(0,1,1):(x==1||x<=2?this.testScoreRefs.push(1,2,2):(x==2||x<=5?this.testScoreRefs.push(2, 5, 3):(x>5||x<=10?this.testScoreRefs.push(5, 10, 4):this.testScoreRefs.push(10, 200, 5)))))",// fasting insulin
									"(x<100?this.testScoreRefs.push(0, 100, 3):(x<=150?this.testScoreRefs.push(100, 150, 4):this.testScoreRefs.push(150, 1000, 5)))",// Triglycerides
									"(x<40?this.testScoreRefs.push(0, 40, 1):(x<=55?this.testScoreRefs.push(40, 55, 2):this.testScoreRefs.push(55, 500 , 3)))",// HDL-cholesterolH
									"(x<100?this.testScoreRefs.push(0, 100, 3):(x<=120?this.testScoreRefs.push(100, 120, 4):this.testScoreRefs.push(120, 1000 , 5)))",// LDL-cholesterolL
									"(x<1.4?this.testScoreRefs.push(0, 1.4, 1):(x<=4?this.testScoreRefs.push(1.4, 4, 2):this.testScoreRefs.push(4, 200, 3)))",// Adiponectin
									"(x<6?this.testScoreRefs.push(0, 6, 3):(x<=9?this.testScoreRefs.push(6, 9 , 4):this.testScoreRefs.push(9, 200 , 5)))",// Leptin
									"((x>=0 && x<15)?this.testScoreRefs.push(0, 15, 3):((x>=15 && x<=20)?this.testScoreRefs.push(15, 20 , 4):this.testScoreRefs.push(20, 200 , 5)))",// Resistin
									"(x<35?this.testScoreRefs.push(0, 35, 3):(x<=65?this.testScoreRefs.push(35, 65 , 4):this.testScoreRefs.push(65, 300, 5)))",// CA-125
									"(x<4?this.testScoreRefs.push(0, 4, 3):(x<=5?this.testScoreRefs.push(4, 5, 4):this.testScoreRefs.push(5, 300, 5)))",// CEA
									"(x<12?this.testScoreRefs.push(0, 12, 3):(x<=15?this.testScoreRefs.push(12, 15 , 4):this.testScoreRefs.push(15, 300, 5)))",// AFP
									"(x<3.5?this.testScoreRefs.push(0, 3.5, 3):(x<=4?this.testScoreRefs.push(3.5, 4, 4):this.testScoreRefs.push(4, 300 , 5)))",// PSA
									"(x<4?this.testScoreRefs.push(0, 4, 3):(x<=5?this.testScoreRefs.push(4, 5, 4):this.testScoreRefs.push(5, 300 , 5)))",// HCG
									"(x<28?this.testScoreRefs.push(0, 28, 3):(x<=31?this.testScoreRefs.push(28, 31, 4):this.testScoreRefs.push(31, 300, 5)))",// CA15-3
									"(x<500?this.testScoreRefs.push(0, 500 ,1):((x>=500 && x<700)?this.testScoreRefs.push(500, 700 , 2):((x>=700 && x<=850)?this.testScoreRefs.push(700, 850 , 3):((x>850 && x<=900)?this.testScoreRefs.push(850, 900, 4):this.testScoreRefs.push(900, 3000 , 5)))))",// Testosterone
									"(x<0.15?this.testScoreRefs.push(0, 0.15 ,1):(x==0.15||x<1?this.testScoreRefs.push(0.15, 1 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x>2||x<=5?this.testScoreRefs.push(2, 5, 4):this.testScoreRefs.push(5, 800 , 5)))))",// Progesterone
									"(x<=50?this.testScoreRefs.push(0, 50, 3):((x>50 && x<=150)?this.testScoreRefs.push(50, 150, 4):this.testScoreRefs.push(150, 800, 5)))",// Estradiol
									"(x<10?this.testScoreRefs.push(0, 10 ,1):((x>=10 && x<25)?this.testScoreRefs.push(10, 25 , 2):((x>=25 && x<=100)?this.testScoreRefs.push(25, 100, 3):((x>100 && x<=125)?this.testScoreRefs.push(100, 125, 4):this.testScoreRefs.push(125, 3000 , 5)))))",// DHT									
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<200?this.testScoreRefs.push(0, 200 ,1):((x>=200 && x<225)?this.testScoreRefs.push(200, 225 , 2):((x>=225 && x<=700)?this.testScoreRefs.push(225, 700 , 3):((x>700 && x<=850)?this.testScoreRefs.push(700, 850, 4):this.testScoreRefs.push(850, 1500 , 5)))))",// Cortisol
									"(x<1?this.testScoreRefs.push(0, 0.9 ,1):(x==1||x<=1.9?this.testScoreRefs.push(1, 1.9 , 2):(x==2||x<=4.9?this.testScoreRefs.push(2, 4.9, 3):(x==5||x<=10.9?this.testScoreRefs.push(5, 10.9, 4):this.testScoreRefs.push(11, 20 , 5)))))",//Insulin
									"(x<50?this.testScoreRefs.push(0, 50 ,1):((x>=50 && x<75)?this.testScoreRefs.push(50, 75 , 2):((x>=75 && x<=100)?this.testScoreRefs.push(75, 100, 3):((x>100 && x<=150)?this.testScoreRefs.push(100, 150, 4):this.testScoreRefs.push(150, 500 , 5)))))",// VitaminD3
									"(x<250?this.testScoreRefs.push(0, 250,1):(x==250||x<350?this.testScoreRefs.push(250, 350 , 2):(x==350||x<=450?this.testScoreRefs.push(350, 450, 3):(x>450||x<=500?this.testScoreRefs.push(450, 500, 4):this.testScoreRefs.push(500, 1000 , 5)))))",//DHEA
									"(x<99?this.testScoreRefs.push(0, 99 ,1):(x==99||x<225?this.testScoreRefs.push(99, 225 , 2):(x==225||x<=380?this.testScoreRefs.push(225, 380, 3):(x>380||x<=400?this.testScoreRefs.push(380, 400, 4):this.testScoreRefs.push(400, 1200 , 5)))))",//Igf
									"(x<50?this.testScoreRefs.push(0, 49.9 ,1):(x==50||x<=89.9?this.testScoreRefs.push(50, 89.9 , 2):(x==90||x<=950.9?this.testScoreRefs.push(90, 950.9, 3):(x==951||x<=1250.9?this.testScoreRefs.push(951, 1250.9, 4):this.testScoreRefs.push(1251, 1260 , 5)))))",
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<11?this.testScoreRefs.push(0, 11 ,1):((x>=11 && x<13.5)?this.testScoreRefs.push(11, 13.5 , 2):((x>=13.5 && x<=17.5)?this.testScoreRefs.push(13.5, 17.5, 3):((x>17.5 && x<=20)?this.testScoreRefs.push(17.5, 20, 4):this.testScoreRefs.push(20, 300 , 5)))))",// Hemoglobin
									"(x<5?this.testScoreRefs.push(0, 5, 1):(x<=6?this.testScoreRefs.push(5, 6, 2):this.testScoreRefs.push(6, 150 , 3)))",// Totalprotein
									"(x<3?this.testScoreRefs.push(0, 3, 1):(x<=5?this.testScoreRefs.push(3, 5, 2):this.testScoreRefs.push(5, 150 , 3)))",// Albumen
									"(x<2?this.testScoreRefs.push(0, 2, 1):(x<=3?this.testScoreRefs.push(2, 3, 2):this.testScoreRefs.push(3, 150 , 3)))",// Globulin
									"(x<6?this.testScoreRefs.push(0, 6 ,1):((x>=6 && x<8)?this.testScoreRefs.push(6, 8 , 2):((x>=8 && x<=11)?this.testScoreRefs.push(8, 11, 3):((x>11 && x<=14)?this.testScoreRefs.push(11, 14, 4):this.testScoreRefs.push(14, 150 , 5)))))",// Magnesium
									"(x<6?this.testScoreRefs.push(0, 6 ,1):((x>=6 && x<8.5)?this.testScoreRefs.push(6, 8.5 , 2):((x>=8.5 && x<=10.5)?this.testScoreRefs.push(8.5, 10.5, 3):((x>10.5 && x<=11)?this.testScoreRefs.push(10.5, 11, 4):this.testScoreRefs.push(11, 300 , 5)))))",// Calcium
									"(x<4.5?this.testScoreRefs.push(0, 4.5, 3):(x<=5.5?this.testScoreRefs.push(4.5, 5.5, 4):this.testScoreRefs.push(5.5, 150 , 5)))",// UricAcid
									"(x<200?this.testScoreRefs.push(0, 200 ,1):((x>=200 && x<250)?this.testScoreRefs.push(200, 250 , 2):((x>=250 && x<=750)?this.testScoreRefs.push(250, 750, 3):((x>750 && x<=850)?this.testScoreRefs.push(750, 850, 4):this.testScoreRefs.push(850, 3000 , 5)))))",// VitaminB12
									"(x<300?this.testScoreRefs.push(0, 300, 3):(x<=365?this.testScoreRefs.push(300, 365, 4):this.testScoreRefs.push(365, 1000 , 5)))" ],
							[
									"(x<1?this.testScoreRefs.push(0, 1, 3):((x>=1 && x<=3)?this.testScoreRefs.push(1, 3, 4):this.testScoreRefs.push(3, 200 , 5)))",// CRP-hs
									"((x>=0 && x<=10)?this.testScoreRefs.push(0, 10, 3):((x>10 && x<=13)?this.testScoreRefs.push(10, 13 , 4):this.testScoreRefs.push(13, 200 , 5)))",// Homocysteine
									"(x<8?this.testScoreRefs.push(0, 8, 3):((x>=8 && x<=10)?this.testScoreRefs.push(8, 10 , 4):this.testScoreRefs.push(10, 200 , 5)))",// TNF
									"((x>=0 && x<=30)?this.testScoreRefs.push(0, 30, 3):((x>30 && x<=40)?this.testScoreRefs.push(30, 40 , 4):this.testScoreRefs.push(40, 1000 , 5)))",// PAI-1
									"(x<300?this.testScoreRefs.push(0, 300, 3):((x>=300 && x<=400)?this.testScoreRefs.push(300, 400 , 4):this.testScoreRefs.push(400, 1000 , 5)))",// Fibrinogen
									"(x<300?this.testScoreRefs.push(0, 300, 3):(x<=365?this.testScoreRefs.push(300, 365 , 4):this.testScoreRefs.push(365, 1000 , 5)))",// Ferritin
									"(x<40?this.testScoreRefs.push(0, 40 ,1):((x>=40 && x<50)?this.testScoreRefs.push(40, 50, 2):((x>=50 && x<=85)?this.testScoreRefs.push(50, 85, 3):((x>85 && x<=100)?this.testScoreRefs.push(85, 100, 4):this.testScoreRefs.push(100, 500, 5)))))",// FBS
									"((x>=0 && x<=5)?this.testScoreRefs.push(0, 5, 3):((x>5 && x<=6)?this.testScoreRefs.push(5, 6, 4):this.testScoreRefs.push(6, 200, 5)))",// HbA1C
									"(x<1?this.testScoreRefs.push(0,1,1):(x==1||x<=2?this.testScoreRefs.push(1,2,2):(x==2||x<=5?this.testScoreRefs.push(2, 5, 3):(x>5||x<=10?this.testScoreRefs.push(5, 10, 4):this.testScoreRefs.push(10, 200, 5)))))",// fasting insulin
									"(x<100?this.testScoreRefs.push(0, 100, 3):(x<=150?this.testScoreRefs.push(100, 150, 4):this.testScoreRefs.push(150, 1000, 5)))",// Triglycerides
									"(x<40?this.testScoreRefs.push(0, 40, 1):(x<=55?this.testScoreRefs.push(40, 55, 2):this.testScoreRefs.push(55, 500 , 3)))",// HDL-cholesterolH
									"(x<100?this.testScoreRefs.push(0, 100, 3):(x<=120?this.testScoreRefs.push(100, 120, 4):this.testScoreRefs.push(120, 1000 , 5)))",// LDL-cholesterolL
									"(x<1.4?this.testScoreRefs.push(0, 1.4, 1):(x<=4?this.testScoreRefs.push(1.4, 4, 2):this.testScoreRefs.push(4, 200, 3)))",// Adiponectin
									"(x<6?this.testScoreRefs.push(0, 6, 3):(x<=9?this.testScoreRefs.push(6, 9 , 4):this.testScoreRefs.push(9, 200 , 5)))",// Leptin
									"((x>=0 && x<15)?this.testScoreRefs.push(0, 15, 3):((x>=15 && x<=20)?this.testScoreRefs.push(15, 20 , 4):this.testScoreRefs.push(20, 200 , 5)))",// Resistin
									"(x<35?this.testScoreRefs.push(0, 35, 3):(x<=65?this.testScoreRefs.push(35, 65 , 4):this.testScoreRefs.push(65, 300, 5)))",// CA-125
									"(x<4?this.testScoreRefs.push(0, 4, 3):(x<=5?this.testScoreRefs.push(4, 5, 4):this.testScoreRefs.push(5, 300, 5)))",// CEA
									"(x<12?this.testScoreRefs.push(0, 12, 3):(x<=15?this.testScoreRefs.push(12, 15 , 4):this.testScoreRefs.push(15, 300, 5)))",// AFP
									"(x<3.5?this.testScoreRefs.push(0, 3.5, 3):(x<=4?this.testScoreRefs.push(3.5, 4, 4):this.testScoreRefs.push(4, 300 , 5)))",// PSA
									"(x<4?this.testScoreRefs.push(0, 4, 3):(x<=5?this.testScoreRefs.push(4, 5, 4):this.testScoreRefs.push(5, 300 , 5)))",// HCG
									"(x<28?this.testScoreRefs.push(0, 28, 3):(x<=31?this.testScoreRefs.push(28, 31, 4):this.testScoreRefs.push(31, 300, 5)))",// CA15-3
									"(x<3?this.testScoreRefs.push(0, 3 ,1):((x==3 || x<5)?this.testScoreRefs.push(3, 5 , 2):((x==5 || x<=84)?this.testScoreRefs.push(5, 84 , 3):((x>84 || x<=100)?this.testScoreRefs.push(84, 100, 4):this.testScoreRefs.push(100, 1300 , 5)))))",// Testosterone
									"(x<1?this.testScoreRefs.push(0, 1 ,1):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 2):(x==2||x<=86?this.testScoreRefs.push(2, 86 , 3):(x>86||x<=100?this.testScoreRefs.push(86, 100, 4):this.testScoreRefs.push(100, 1300 , 5)))))",// Progesterone
									"(x<=50?this.testScoreRefs.push(0, 50, 3):((x>50 && x<=150)?this.testScoreRefs.push(50, 150, 4):this.testScoreRefs.push(150, 800, 5)))",// Estradiol
									"(x<10?this.testScoreRefs.push(0, 10 ,1):((x>=10 && x<25)?this.testScoreRefs.push(10, 25 , 2):((x>=25 && x<=100)?this.testScoreRefs.push(25, 100, 3):((x>100 && x<=125)?this.testScoreRefs.push(100, 125, 4):this.testScoreRefs.push(125, 3000 , 5)))))",// DHT									
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<200?this.testScoreRefs.push(0, 200 ,1):((x>=200 && x<225)?this.testScoreRefs.push(200, 225 , 2):((x>=225 && x<=700)?this.testScoreRefs.push(225, 700 , 3):((x>700 && x<=850)?this.testScoreRefs.push(700, 850, 4):this.testScoreRefs.push(850, 1500 , 5)))))",// Cortisol
									"(x<1?this.testScoreRefs.push(0, 0.9 ,1):(x==1||x<=1.9?this.testScoreRefs.push(1, 1.9 , 2):(x==2||x<=4.9?this.testScoreRefs.push(2, 4.9, 3):(x==5||x<=10.9?this.testScoreRefs.push(5, 10.9, 4):this.testScoreRefs.push(11, 20 , 5)))))",//Insulin
									"(x<50?this.testScoreRefs.push(0, 50 ,1):((x>=50 && x<75)?this.testScoreRefs.push(50, 75 , 2):((x>=75 && x<=100)?this.testScoreRefs.push(75, 100, 3):((x>100 && x<=150)?this.testScoreRefs.push(100, 150, 4):this.testScoreRefs.push(150, 500 , 5)))))",// VitaminD3
									"(x<250?this.testScoreRefs.push(0, 250,1):(x==250||x<350?this.testScoreRefs.push(250, 350 , 2):(x==350||x<=450?this.testScoreRefs.push(350, 450, 3):(x>450||x<=500?this.testScoreRefs.push(450, 500, 4):this.testScoreRefs.push(500, 1000 , 5)))))",//DHEA
									"(x<99?this.testScoreRefs.push(0, 99 ,1):(x==99||x<225?this.testScoreRefs.push(99, 225 , 2):(x==225||x<=380?this.testScoreRefs.push(225, 380, 3):(x>380||x<=400?this.testScoreRefs.push(380, 400, 4):this.testScoreRefs.push(400, 1000 , 5)))))",//Igf
									"(x<50?this.testScoreRefs.push(0, 49.9 ,1):(x==50||x<=89.9?this.testScoreRefs.push(50, 89.9 , 2):(x==90||x<=950.9?this.testScoreRefs.push(90, 950.9, 3):(x==951||x<=1250.9?this.testScoreRefs.push(951, 1250.9, 4):this.testScoreRefs.push(1251, 1260 , 5)))))",
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<0.15?this.testScoreRefs.push(0, 0.14 ,1):(x==0.15||x<=0.9?this.testScoreRefs.push(0.15, 0.9 , 2):(x==1||x<=2?this.testScoreRefs.push(1, 2 , 3):(x==2.1||x<=5.9?this.testScoreRefs.push(2.1, 5.9, 4):this.testScoreRefs.push(6, 20 , 5)))))",
									"(x<11?this.testScoreRefs.push(0, 11 ,1):((x>=11 && x<13.5)?this.testScoreRefs.push(11, 13.5 , 2):((x>=13.5 && x<=17.5)?this.testScoreRefs.push(13.5, 17.5, 3):((x>17.5 && x<=20)?this.testScoreRefs.push(17.5, 20, 4):this.testScoreRefs.push(20, 300 , 5)))))",// Hemoglobin
									"(x<5?this.testScoreRefs.push(0, 5, 1):(x<=6?this.testScoreRefs.push(5, 6, 2):this.testScoreRefs.push(6, 150 , 3)))",// Totalprotein
									"(x<3?this.testScoreRefs.push(0, 3, 1):(x<=5?this.testScoreRefs.push(3, 5, 2):this.testScoreRefs.push(5, 150 , 3)))",// Albumen
									"(x<2?this.testScoreRefs.push(0, 2, 1):(x<=3?this.testScoreRefs.push(2, 3, 2):this.testScoreRefs.push(3, 150 , 3)))",// Globulin
									"(x<6?this.testScoreRefs.push(0, 6 ,1):((x>=6 && x<8)?this.testScoreRefs.push(6, 8 , 2):((x>=8 && x<=11)?this.testScoreRefs.push(8, 11, 3):((x>11 && x<=14)?this.testScoreRefs.push(11, 14, 4):this.testScoreRefs.push(14, 150 , 5)))))",// Magnesium
									"(x<6?this.testScoreRefs.push(0, 6 ,1):((x>=6 && x<8.5)?this.testScoreRefs.push(6, 8.5 , 2):((x>=8.5 && x<=10.5)?this.testScoreRefs.push(8.5, 10.5, 3):((x>10.5 && x<=11)?this.testScoreRefs.push(10.5, 11, 4):this.testScoreRefs.push(11, 300 , 5)))))",// Calcium
									"(x<4.5?this.testScoreRefs.push(0, 4.5, 3):(x<=5.5?this.testScoreRefs.push(4.5, 5.5, 4):this.testScoreRefs.push(5.5, 150 , 5)))",// UricAcid
									"(x<200?this.testScoreRefs.push(0, 200 ,1):((x>=200 && x<250)?this.testScoreRefs.push(200, 250 , 2):((x>=250 && x<=750)?this.testScoreRefs.push(250, 750, 3):((x>750 && x<=850)?this.testScoreRefs.push(750, 850, 4):this.testScoreRefs.push(850, 3000 , 5)))))",// VitaminB12
									"(x<300?this.testScoreRefs.push(0, 300, 3):(x<=365?this.testScoreRefs.push(300, 365, 4):this.testScoreRefs.push(365, 1000 , 5)))" ] ]);// Ferritin

	// Thyroflex
	this
			.putMessageType(
					"POLB_MT004000HT01_Thyroflex",
					[ "Thyroid" ],
					[ "message/POLB_MT004000HT01_Thyroflex/component2/observationEvent[code/code='REFLEX TIME']/value/value/text()" ],
					[ "((x>=0 && x<=100)?this.GREEN:(x<=136?this.ORANGE:this.RED))" ],
					[ "0-100" ],
					[ "26" ],
					[ "((x>=0 && x<=100)?this.testScoreRefs.push(0, 100, 3):(x<=136?this.testScoreRefs.push(100, 136, 4):this.testScoreRefs.push(136, 800 , 5)))" ]);

	// POCD_MT000040UV_PhEx
	this
			.putMessageType(
					"POCD_MT000040UV_PhEx",
					[ "Waist circumference" ],
					[
							[ "message/POCD_MT000040UV_PhEx/component/structuredBody/component/section/entry/observation[3]/value/thumbnail" ],
							[ "message/POCD_MT000040UV_PhEx/component/structuredBody/component/section/entry/observation[3]/value/thumbnail" ] ],
					[
							[ "(x<35?this.GREEN:(x<=40?this.ORANGE:this.RED))" ],
							[ "(x<30?this.GREEN:(x<=35?this.ORANGE:this.RED))" ] ],
					[ [ "<35" ], [ "<30" ] ],
					[ [ "" ], [ "" ] ],
					[
							[ "(x<35?this.testScoreRefs.push(0, 35, 3):(x<=40?this.testScoreRefs.push(35, 40, 4):this.testScoreRefs.push(40, 500 , 5)))" ],
							[ "(x<30?this.testScoreRefs.push(0, 30, 3):(x<=35?this.testScoreRefs.push(30, 35, 4):this.testScoreRefs.push(35, 500 , 5)))" ] ]);

	// biospace
	this
			.putMessageType(
					"POLB_MT004000HT01_Biospace",
					[ "Body fat", "Body fat" ],
					[
							"message/POLB_MT004000HT01_Biospace/component2/observationEvent[code/code='Percent Body Fat']/value/value/text()",
							"message/POLB_MT004000HT01_Biospace/component2/observationEvent[code/code='Percent Body Fat']/value/value/text()" ],
					[
							[
									"(x<4?this.RED:((x>=4 && x<5)?this.ORANGE:((x>=5 && x<=20)?this.GREEN:((x>20 && x<=25)?this.ORANGE:this.RED))))",
									"(x<4?this.RED:((x>=4 && x<5)?this.ORANGE:((x>=5 && x<=20)?this.GREEN:((x>20 && x<=25)?this.ORANGE:this.RED))))" ],
							[
									"(x<12?this.RED:((x>=12 && x<15)?this.ORANGE:((x>=15 && x<=25)?this.GREEN:((x>25 && x<=30)?this.ORANGE:this.RED))))",
									"(x<12?this.RED:((x>=12 && x<15)?this.ORANGE:((x>=15 && x<=25)?this.GREEN:((x>25 && x<=30)?this.ORANGE:this.RED))))" ] ],
					[ [ "5-20", "5-20" ], [ "15-25", "15-25" ] ],
					[ [ "26", "" ], [ "26", "" ] ],
					[
							[
									"(x<4?this.testScoreRefs.push(0, 4, 1):((x>=4 && x<5)?this.testScoreRefs.push(4, 5, 2):((x>=5 && x<=20)?this.testScoreRefs.push(5, 20, 3):((x>20 && x<=25)?this.testScoreRefs.push(20, 25, 4):this.testScoreRefs.push(25, 80 , 5)))))",
									"(x<4?this.testScoreRefs.push(0, 4, 1):((x>=4 && x<5)?this.testScoreRefs.push(4, 5, 2):((x>=5 && x<=20)?this.testScoreRefs.push(5, 20, 3):((x>20 && x<=25)?this.testScoreRefs.push(20, 25, 4):this.testScoreRefs.push(25, 80 , 5)))))" ],
							[
									"(x<12?this.testScoreRefs.push(0, 12, 1):((x>=12 && x<15)?this.testScoreRefs.push(12, 15, 2):((x>=15 && x<=25)?this.testScoreRefs.push(15, 25, 3):((x>25 && x<=30)?this.testScoreRefs.push(25, 30, 4):this.testScoreRefs.push(30, 80 , 5)))))",
									"(x<12?this.testScoreRefs.push(0, 12, 1):((x>=12 && x<15)?this.testScoreRefs.push(12, 15, 2):((x>=15 && x<=25)?this.testScoreRefs.push(15, 25, 3):((x>25 && x<=30)?this.testScoreRefs.push(25, 30, 4):this.testScoreRefs.push(30, 80 , 5)))))" ] ]);

	// fitness test
	this
			.putMessageType(
					"POLB_MT004000HT01_FitnessTest",
					[ "Body fat", "Strength", "Strength", "Flexibility",
							"Bone density", "Posture", "Balance",
							"Metabolic (VO2)" ],
					[
							[
									"message/POLB_MT004000HT01_FitnessTest/component2[1]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[3]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[5]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[7]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[15]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[9]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[11]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[13]/observationEvent/value/value" ],
							[
									"message/POLB_MT004000HT01_FitnessTest/component2[2]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[4]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[6]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[8]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[16]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[10]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[12]/observationEvent/value/value",
									"message/POLB_MT004000HT01_FitnessTest/component2[14]/observationEvent/value/value" ] ],

					[
							"(x<" + bioFatRefRange_Green + "?this.GREEN:(x<"
									+ bioFatRefRange_Orange
									+ "?this.ORANGE:this.RED))",
							"(x<8?this.RED:(x<=12?this.ORANGE:this.GREEN))",
							"(x<18?this.RED:(x<=30?this.ORANGE:this.GREEN))",
							"(x==25?this.RED:(x==65?this.ORANGE:this.GREEN))",
							"(x==25?this.GREEN:(x==65?this.ORANGE:this.RED))",
							"(x==25?this.RED:(x==65?this.ORANGE:this.GREEN))",
							"(x<10?this.RED:(x<16?this.ORANGE:this.GREEN))",
							"(x<100?this.GREEN:(x<120?this.ORANGE:this.RED))" ],
					[ bioFatRefRange_Green, ">12", ">12", "Good", "", "Good",
							">16", "<100" ],
					[ "", "26", "26", "16", "", "16", "16", "26" ],
					[
							[
									"(x<4?this.testScoreRefs.push(0, 3.9,0):(x==4||x<5?this.testScoreRefs.push(4, 4.9, 1):(x==5||x<=20?this.testScoreRefs.push(5, 20.9, 2):(x==21||x<=25?this.testScoreRefs.push(21, 25.9, 3):this.testScoreRefs.push(26, 100 , 4)))))",
									"(x<8?this.testScoreRefs.push(0, 8, 1):(x<=12?this.testScoreRefs.push(8, 12, 2):this.testScoreRefs.push(12, 200 , 3)))",
									"(x<8?this.testScoreRefs.push(0, 8, 1):(x<=12?this.testScoreRefs.push(8, 12, 2):this.testScoreRefs.push(12, 200 , 3)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 1):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 2):this.testScoreRefs.push(66, 100 , 3)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 3):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 4):this.testScoreRefs.push(66, 100 , 5)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 1):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 2):this.testScoreRefs.push(66, 100 , 3)))",
									"(x<10?this.testScoreRefs.push(0, 9.9, 1):(x<=10||x<=16.9?this.testScoreRefs.push(10, 16.9, 2):this.testScoreRefs.push(17, 100 , 3)))",
									"(x<100?this.testScoreRefs.push(0, 99.9 , 3):(x<=100||x<=120.9?this.testScoreRefs.push(100, 120.9, 4):this.testScoreRefs.push(121, 150 , 5)))" ],

							[
									"(x<4?this.testScoreRefs.push(0, 3.9,0):(x==4||x<5?this.testScoreRefs.push(4, 4.9, 1):(x==5||x<=20?this.testScoreRefs.push(5, 20.9, 2):(x==21||x<=25?this.testScoreRefs.push(21, 25.9, 3):this.testScoreRefs.push(26, 100 , 4)))))",
									"(x<18?this.testScoreRefs.push(0, 18, 1):(x<=30?this.testScoreRefs.push(18, 30, 2):this.testScoreRefs.push(30, 200, 3)))",
									"(x<18?this.testScoreRefs.push(0, 18, 1):(x<=30?this.testScoreRefs.push(18, 30, 2):this.testScoreRefs.push(30, 200, 3)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 1):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 2):this.testScoreRefs.push(66, 100 , 3)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 3):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 4):this.testScoreRefs.push(66, 100 , 5)))",
									"(x<=25?this.testScoreRefs.push(0, 25, 1):(x<=26||x<=65?this.testScoreRefs.push(26, 65, 2):this.testScoreRefs.push(66, 100 , 3)))",
									"(x<10?this.testScoreRefs.push(0, 9.9, 1):(x<=10||x<=16.9?this.testScoreRefs.push(10, 16.9, 2):this.testScoreRefs.push(17, 100 , 3)))",
									"(x<100?this.testScoreRefs.push(0, 99.9 , 3):(x<=100||x<=120.9?this.testScoreRefs.push(100, 120.9, 4):this.testScoreRefs.push(121, 150 , 5)))" ] ]);

	// toxin
	this
			.putMessageType(
					"POLB_MT004000HT01_ToxinePanel",
					[ "Aluminium", "Arsenic", "Cadmium", "Lead", "Mercury" ],
					[
							"message/POLB_MT004000HT01_ToxinePanel/component2[1]/observationEvent/value/value",
							"message/POLB_MT004000HT01_ToxinePanel/component2[3]/observationEvent/value/value",
							"message/POLB_MT004000HT01_ToxinePanel/component2[7]/observationEvent/value/value",
							"message/POLB_MT004000HT01_ToxinePanel/component2[10]/observationEvent/value/value",
							"message/POLB_MT004000HT01_ToxinePanel/component2[11]/observationEvent/value/value" ],
					[ "(x<35?this.GREEN:(x<=195?this.ORANGE:this.RED))",
							"(x<117?this.GREEN:(x<=166?this.ORANGE:this.RED))",
							"(x<1?this.GREEN:(x<=2?this.ORANGE:this.RED))",
							"(x<2?this.GREEN:(x<=14?this.ORANGE:this.RED))",
							"(x<4?this.GREEN:(x<=17?this.ORANGE:this.RED))" ],
					[ "<35", "<117", "<1", "<2", "<4" ],
					[ "16", "16", "16", "26", "26" ],
					[
							"(x<35?this.testScoreRefs.push(0, 35, 3):(x<=195?this.testScoreRefs.push(35, 195, 4):this.testScoreRefs.push(195, 500 , 5)))",
							"(x<117?this.testScoreRefs.push(0, 117, 3):(x<=166?this.testScoreRefs.push(117, 166, 4):this.testScoreRefs.push(166, 500 , 5)))",
							"(x<1?this.testScoreRefs.push(0, 1, 3):(x<=2?this.testScoreRefs.push(1, 2, 4):this.testScoreRefs.push(2, 100 , 5)))",
							"(x<2?this.testScoreRefs.push(0, 2, 3):(x<=14?this.testScoreRefs.push(2, 14, 4):this.testScoreRefs.push(14, 300 , 5)))",
							"(x<4?this.testScoreRefs.push(0, 4, 3):(x<=17?this.testScoreRefs.push(4, 17, 4):this.testScoreRefs.push(17, 300 , 5)))" ]);

	// CNS
	this
			.putMessageType(
					"POLB_MT004000HT01_CNS",
					[ "Composite memory", "Psychomotor speed", "Reaction time",
							"Complex attention", "Cognitive flexibility",
							"Processing speed", "Executive functioning" ],
					[
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Composite Memory']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Psychomotor Speed']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Reaction Time*']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Complex Attention*']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Cognitive Flexibility']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Processing Speed']/value/value/text()",
							"message/POLB_MT004000HT01_CNS/component2/observationEvent[code/code='Executive Functioning']/value/value/text()" ],
					[ "(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))",
							"(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))" ],
					[ ">90", ">90", ">90", ">90", ">90", ">90",
							">90" ],
					[ "16", "", "26", "", "", "26", "16" ],
					[
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))",
							"(x<80?this.testScoreRefs.push(0, 80, 1):(x>=80 && x<=90?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))" ]);

	// ANS HRV
	this
			.putMessageType(
					"POLB_MT004000HT01_Heartmath",
					[ "ANS HRV" ],
					[ "message/POLB_MT004000HT01_Heartmath/component2/observationEvent[3]/value/value" ],
					[ "(x<80?this.RED:(x<=90?this.ORANGE:this.GREEN))" ],
					[ ">90" ],
					[ "16" ],
					[ "(x<80?this.testScoreRefs.push(0, 80, 1):((x<=80 && x<=90)?this.testScoreRefs.push(80, 90 , 2):this.testScoreRefs.push(90, 150 , 3)))" ]);

	this.putMessageType("POCD_MT000040UV_PhComm_EX", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");
	this.putMessageType("POCD_MT000040UV_PhComm_GE", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");
	this.putMessageType("POCD_MT000040UV_PhComm_LI", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");
	this.putMessageType("POCD_MT000040UV_PhComm_IN", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");
	this.putMessageType("POCD_MT000040UV_PhComm_NU", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");
	this.putMessageType("POCD_MT000040UV_PhComm_TO", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation");

	this.putMessageType("POSA_MT920000HT03_Hormones", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation4");
	this.putMessageType("POSA_MT920000HT03_HormonesRpt", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation4");

	this.putMessageType("POSA_MT920000HT03_Supplements", [ "" ], [ "" ], null,
			[ "" ], null, null, "consultation5");
	this.putMessageType("POSA_MT920000HT03_SupplementsRpt", [ "" ], [ "" ],
			null, [ "" ], null, null, "consultation5");

};

HIN.ReportModel.prototype.putMessageType = function(type, testNames, xPaths,
		rangeColors, idealScores, weightings, testRefRanges, reportType) {
	var object = new Object();
	object.testNames = testNames;
	object.xPaths = xPaths;
	object.reportType = reportType;
	object.rangeColors = rangeColors;
	object.idealScores = idealScores;
	object.values = [];
	object.colors = [];
	object.weightings = weightings;
	object.testRefRanges = testRefRanges;
	object.scores = [];
	object.weights = [];
	object.idealScore = null;
	object.value = null;
	object.color = null;
	object.testName = null;
	object.messages = [];
	this.messageTypeMap.put(type, object);
};

HIN.ReportModel.prototype.fetchMessageTypeMap = function() {
	return this.messageTypeMap;
}

HIN.ReportModel.prototype.calculateTestValue = function(message) {
	if (message.message) {
		var msg = XmlUtil.stringToXml(message.message);
		var messageType = message.messageType;
		 /*alert("Message xml : " + XmlUtil.xmlToString(msg)); */

		var map = this.messageTypeMap.get(messageType);
		if (map) {
			var object = map.value;
			var testNames = null;
			var xPaths = null;
			var rangeColors = null;
			var weightings = null;
			var testRefRanges = null;
			var idealScores = null;

			if (messageType == "POLB_MT004000HT01_Biospace") {
				testNames = object.testNames;
				xPaths = object.xPaths;
				rangeColors = object.rangeColors[genderIndex];
				weightings = object.weightings[genderIndex];
				testRefRanges = object.testRefRanges[genderIndex];
				object.idealScores = object.idealScores[genderIndex];
			} else if (messageType == "POLB_MT004000HT01_FitnessTest") {
				testNames = object.testNames;
				xPaths = object.xPaths[genderIndex];
				rangeColors = object.rangeColors;
				weightings = object.weightings;
				testRefRanges = object.testRefRanges[genderIndex];
			} else if (messageType == "POLB_MT004000HT01_BloodTest") {
				testNames = object.testNames;
				xPaths = object.xPaths;
				rangeColors = object.rangeColors[genderIndex];
				weightings = object.weightings;
				testRefRanges = object.testRefRanges[genderIndex];
				object.idealScores = object.idealScores[genderIndex];
			} else if (messageType == "POCD_MT000040UV_PhEx") {
				testNames = object.testNames;
				xPaths = object.xPaths[genderIndex];
				rangeColors = object.rangeColors[genderIndex];
				weightings = object.weightings[genderIndex];
				testRefRanges = object.testRefRanges[genderIndex];
				object.idealScores = object.idealScores[genderIndex];
			} else {
				testNames = object.testNames;
				xPaths = object.xPaths;
				rangeColors = object.rangeColors;
				weightings = object.weightings;
				testRefRanges = object.testRefRanges;
			}

			for ( var index = 0; index < xPaths.length; index++) {

				if (xPaths[index] && xPaths[index].length > 0) {

					var score = null;
					var node = null;
					var x = 0;
					if (messageType == "POLB_MT004000HT01_BloodTest"
							|| messageType == "POLB_MT004000HT01_Biospace"
							|| messageType == "POLB_MT004000HT01_CNS"
							|| messageType == "POLB_MT004000HT01_Thyroflex") {
						x = XmlUtil.getXPathResult(msg, xPaths[index],
								XPathResult.STRING_TYPE);
						x = x.stringValue;
						x = parseFloat(x);
					} else {
						score = XmlUtil.getXPathResult(msg, xPaths[index]);
						node = score.iterateNext();
						if (node) {
							x = XmlUtil.text(node);
							if (messageType != "POLB_MT004000HT01_IMT_HearSmart") {
								x = parseFloat(x);
							}
						}
					}

					if (messageType == "POLB_MT004000HT01_IMT_HearSmart") {
						// alert("value: " + x);
						if (x == "Normal" || x == "None Observed") {
							x = 100;
						} else if (x == "Mild" || x == "Early Buildup"
								|| x == "Nominal") {
							x = 65;
						} else if (x == "Moderate" || x == "Calcified"
								|| x == "Less than 30%") {
							x = 40;
						} else if (x == "Significant" || x == "Mixed"
								|| x == "Between 30%-50%") {
							x = 25;
						} else if (x == "Critical Significant" || x == "Soft"
								|| x == "Greater than 50%") {
							x = 10;
						}
					}
					// alert(messageType + ": " + x);
					// alert(object.testNames[index]+": "+x);

					var regDeci = /^[0-9]+(\.[0-9]+)+$/;
					if (regDeci.test(x) == true) {
						object.values.push(x.toFixed(1));
					} else {
						object.values.push(x);

					}

					if (rangeColors[index] && rangeColors[index].length > 0) {
						object.colors.push(eval(rangeColors[index]));
					} else {
						object.colors.push("");
					}

					if (index == 0) {
						object.testName = object.testNames[index];
						object.value = x;
						object.color = object.colors[index];
						object.score = object.scores[index];
					}

					if (x) {
						if (testRefRanges[index]
								&& testRefRanges[index].length > 0) {

							eval(testRefRanges[index]);
							var rawValue = Math.round(x);
							var normalizedValue = this
									.calculateNormalizedScore(
											object.testNames[index], rawValue,
											this.testScoreRefs);
							object.weights.push(weightings[index]);
							object.scores.push(normalizedValue);
							this.testScoreRefs = [];

						}
					} else {
						object.scores.push("0");
						object.weights.push("0");
					}

				} else {
					object.values.push("");
					object.colors.push("");
					object.scores.push("0");
					object.weights.push("0");
				}

			}
		}
	}
};

HIN.ReportModel.prototype.calculateNormalizedScore = function(testName, value,
		refRange) {
	
	var minRange = refRange[0];
	var maxRange = refRange[1];
	var rangeNumber = refRange[2];
	
	if(value > maxRange){
		if(testName == "CAC")
			maxRange = value;
		else
			value = maxRange;
	}
	if(value < minRange)
		value = minRange;

	var formula = "(value-minRange)/(maxRange-minRange)";
	var normalizedValue = "";
	var sumOfNormalizedValues = "";

	if (testName == "Bioclip") {
		if (rangeNumber == 3) {
			sumOfNormalizedValues = 2.5;
		} else if (rangeNumber == 4) {
			sumOfNormalizedValues = 3.5;
		} else if (rangeNumber == 5) {
			sumOfNormalizedValues = 4.5;
		}
	} else if (testName == "IMT HeartSmart") {
		if (rangeNumber == 1) {
			sumOfNormalizedValues = 2.5;
		} else if (rangeNumber == 2) {
			sumOfNormalizedValues = 3.5;
		} else if (rangeNumber == 3) {
			sumOfNormalizedValues = 4;
		} else if (rangeNumber == 4) {
			sumOfNormalizedValues = 4.5;
		} else if (rangeNumber == 5) {
			sumOfNormalizedValues = 0.5;
		}
	} else {
		if (rangeNumber == 5) {
			normalizedValue = 0.5;
		} else {
			normalizedValue = eval(formula);
		}

		sumOfNormalizedValues = (rangeNumber - 1) + normalizedValue;
	}

	if (sumOfNormalizedValues <= 2.5) {
		normalizedValue = (sumOfNormalizedValues / 2.5) * 100;
	} else {
		normalizedValue = 100 - (((sumOfNormalizedValues - 2.5) / 2.5) * 100);
	}

	normalizedValue = (Math.round(normalizedValue));
	
	//alert("testName: " + testName + "\n minRange: " + minRange + " :maxRange : " +maxRange + "\n rangeNumber: " + rangeNumber + "\n normalizedValue: " + normalizedValue);
	
	return normalizedValue;
}

HIN.ReportModel.prototype.loadPage = function(pageId, pageType) {
	var patientName = null;
	var program = null;
	var date = null;
	var svgDoc = null;

	var pageUri = "../client-report/" + pageId + ".svg";
	var xmlNode = XmlUtil.loadXml(pageUri);

	var reportRenderer = new ReportRenderer();
	reportRenderer.setSVGDoc(xmlNode);

	if (pageId == "page1") {

		if (this.patientVo) {
			patientName = this.patientVo.name;
		}
		if (this.programVo) {
			program = this.programVo.displayName;
		}
		date = current_date;

		svgDoc = reportRenderer.fillPatientInfo(patientName, program, date);
	} else {

		var data = this.getData(pageId);

		if (data !== null) {
			svgDoc = reportRenderer.createIndicator(data);
		}
		if (pageType == "consultation") {
			for (i in data) {
				var physicianComments = data[i].comments;
				var checkedParam = data[i].checkedArray;
				var consultationType = data[i].consultationType;
				var hormoneDrugArray = data[i].hormoneDrugArray;
				var advancedSupplementationDrugIntake = data[i].advancedSupplementationDrugArray;
				if (consultationType == "checkBox") {
					svgDoc = reportRenderer
							.writePhysicianComments(physicianComments);
					svgDoc = reportRenderer.tickCheckBox(checkedParam);
				} else if (consultationType == "restorationHormones") {
					svgDoc = reportRenderer.drugIntakeHormone(hormoneDrugArray,
							physicianComments);
				} else if (consultationType == "advancedSupplementation") {
					svgDoc = reportRenderer.drugIntakeAdvancedSupplementation(
							advancedSupplementationDrugIntake,
							physicianComments);
				}
			}
		}
	}
	return svgDoc;
};

HIN.ReportModel.prototype.createPageObject = function(page) {
	var map = this.pagesMap.get(page);
	if (!map) {
		var pageObject = new Object();
		pageObject.page = page;
		pageObject.score_Array = [];
		pageObject.score = "";
		pageObject.color = "";
		pageObject.idealScore = "";
		pageObject.worstScores = [];
		this.pagesMap.put(page, pageObject);
	} else {
		return map.value;
	}
	return pageObject;
};

HIN.ReportModel.prototype.getScore = function(page) {
	var map = this.pagesMap.get(page);
	var score = "";
	var color = "";
	var idealScore = "";
	if (map) {
		var pageObject = map.value;
		score = pageObject.score
		color = pageObject.color;
		idealScore = pageObject.idealScore;
	}
	if (score) {
		var indicatorObject = new Object();
		indicatorObject.value = score;
		indicatorObject.color = color;
		indicatorObject.idealScore = idealScore;
		// alert(page + " :\n" + score);
		return indicatorObject;
	}
	return null;
};

HIN.ReportModel.prototype.getWeightage = function(testName, weighting,
		totalWeight) {
	var calculatedWeighting = 0;
	var difference = 0;
	difference = 100 - totalWeight;

	calculatedWeighting = (weighting / totalWeight) * difference;
	calculatedWeighting = calculatedWeighting + weighting;

	return calculatedWeighting;
}

HIN.ReportModel.prototype.getEScore = function() {
	var integral = 0;
	var eScore = 0;
	for ( var pageIndex = 0; pageIndex < this.pagesMap.length(); pageIndex++) {
		var map = this.pagesMap.getItemAt(pageIndex);
		if (map && map.value) {
			var pageObject = map.value;
			if (pageObject.score) {
				var psgeID = pageObject.page.substring(0, 4);
				if (psgeID == "page") {
					var score = parseFloat(pageObject.score);
					if (score && score != 0) {
						integral = integral + 1;
					}
					eScore += score;
				}

			}
		}
	}

	if (eScore) {
		var indicatorObject = new Object();
		indicatorObject.value = Math.round(eScore / integral);
		var color = indicatorObject.value > 70 ? this.GREEN
				: (indicatorObject.value > 30 ? this.ORANGE : this.RED);
		indicatorObject.color = color;
		indicatorObject.idealScore = "71-100";
		return indicatorObject;
	}
	return null;
};

HIN.ReportModel.prototype.getData = function(page) {
	var score_Array;
	var data;
	var pageObject = this.createPageObject(page);
	if (page == "page1") {
		data = null;
	}
	if (page == "page2") {
		data = null;
	}
	if (page == "page3") {

		for ( var pageIndex = 0; pageIndex < this.pagesMap.length(); pageIndex++) {

			var weighting = 0;
			var map = this.pagesMap.getItemAt(pageIndex);
			if (map && map.value) {
				var pageObject = map.value;
				// alert("Page :" + pageObject.page);
				var score_Array = pageObject.score_Array;
				if (pageObject.page != "page3" && score_Array) {
					var totalWeightPerPage = 0;
					for ( var scoreIndex = 0; scoreIndex < score_Array.length; scoreIndex++) {
						var indicatorObjectArray = score_Array[scoreIndex];
						for ( var indicatorObjectArrayIndex = 0; indicatorObjectArrayIndex < indicatorObjectArray.length; indicatorObjectArrayIndex++) {
							var indicatorObject = indicatorObjectArray[indicatorObjectArrayIndex];
							if (indicatorObject) {
								var value;
								var name = indicatorObject.testName;
								if (name == 'IMT') {
									value = indicatorObject.value;
								} else {
									value = parseFloat(indicatorObject.value);
								}

								if (value) {
									weighting = parseFloat(indicatorObject.weighting);
									if (weighting) {
										var name = indicatorObject.testName;
										totalWeightPerPage = totalWeightPerPage
												+ weighting;
									}
								}
							}
						}

					}
					if (totalWeightPerPage) {
						// alert(pageObject.page+": "+totalWeightPerPage);
						this.pageFractionWeightMaps.put(pageObject.page,
								totalWeightPerPage);
					}
				}
			}

		}

		for ( var pageIndex = 0; pageIndex < this.pagesMap.length(); pageIndex++) {
			var map = this.pagesMap.getItemAt(pageIndex);
			// alert(map.value);
			if (map && map.value) {
				var pageObject = map.value;
				var Object1 = null;
				var Object2 = null;
				var Object3 = null;
				var Object1val = null;
				var Object2val = null;
				var Object3val = null;
				var weighting;

				//alert("Page :" + pageObject.page);
				var score_Array = pageObject.score_Array;
				if (pageObject.page != "page3" && score_Array) {
					var sumOfScore = 0;
					var sumOfSection = 0;

					for ( var scoreIndex = 0; scoreIndex < score_Array.length; scoreIndex++) {
						var indicatorObjectArray = score_Array[scoreIndex];

						for ( var indicatorObjectArrayIndex = 0; indicatorObjectArrayIndex < indicatorObjectArray.length; indicatorObjectArrayIndex++) {
							var indicatorObject = indicatorObjectArray[indicatorObjectArrayIndex];

							if (indicatorObject) {
								var name = indicatorObject.testName;
								var value;
								if (name == 'IMT') {
									value = indicatorObject.value;
								} else {
									value = parseFloat(indicatorObject.value);
								}

								if (value) {
									weighting = parseFloat(indicatorObject.weighting);
									if (weighting) {
										var totalWeight = this.pageFractionWeightMaps
												.get(pageObject.page).value;

										weighting = this.getWeightage(name,
												weighting, totalWeight);

									} else {
										weighting = 0;
									}
									
									sumOfSection++;
									var scoreValue = parseFloat(indicatorObject.score);
									var normalizedValue = scoreValue;
									scoreValue = scoreValue * (weighting / 100);

									if (scoreValue) {
										var lastSum = Math.round(sumOfScore);
										sumOfScore += scoreValue;

									}

									if (indicatorObject.color == "#9B1F21") {
										if (Object1 == null) {
											Object1 = indicatorObject;
										} else if (Object2 == null) {
											Object2 = indicatorObject;
										} else if (Object3 == null) {
											Object3 = indicatorObject;
										}

										if (parseFloat(Object1.value) > parseFloat(indicatorObject.value)) {
											if (Object3) {
												Object3 = Object2;
											}
											Object2 = Object1;
											Object1 = indicatorObject;
										} else if (Object2 != null
												&& parseFloat(Object2.value) > parseFloat(indicatorObject.value)) {
											Object3 = Object2;
											Object2 = indicatorObject;
										} else if (Object3 != null
												&& parseFloat(Object3.value) > parseFloat(indicatorObject.value)) {
											Object3 = indicatorObject;
										}
									}

								}

							}
						}
					}

					var score = 0;
					if (sumOfScore)
						score = Math.round(sumOfScore);

					pageObject.score = score;
					pageObject.color = eval(pageObject.rangeColor);

					if (Object1)
						pageObject.worstScores.push(Object1);
					if (Object2)
						pageObject.worstScores.push(Object2);
					if (Object3)
						pageObject.worstScores.push(Object3);
				}
			}
		}

		var hormonePageID;
		if (this.gender == "M") {
			hormonePageID = "page9";
		} else {
			hormonePageID = "page10";
		}
		score_Array = [ this.getScore("page4"), this.getScore("page5"),
				this.getScore("page6"), this.getScore("page7"),
				this.getScore("page8"), this.getScore(hormonePageID),
				this.getScore("page11"), this.getScore("page12") ];
		coordinates = [ {
			"y_rect" : 240,
			"y_circle" : 255,
			"y_text" : 262,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 68,
			"y2_line" : 68,
			"x_circle_small" : 660,
			"y_circle_small" : 68,
			"y_standard" : 68,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		data = [ {
			"overall" : this.getEScore(),
			"page" : "OverviewResult",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}
	if (page == "page4") {

		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";

		coordinates = [ {
			"y_rect" : 162,
			"y_circle" : 177,
			"y_text" : 184,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 178,
			"y2_line" : 178,
			"x_circle_small" : 660,
			"y_circle_small" : 178,
			"y_standard" : 178,
			"array_increment" : 22.5,
			"y_standard_increment" : 81.3
		} ];

		var imtPanasonic = new Object();
		var imtHeartSmart1 = new Object();
		var imtHeartSmart2 = new Object();
		var imtHeartSmart3 = new Object();
		var imtHeartSmart = new Object();
		var imtIndicatorObject = new Object();
		var imtHeartSmartIndicatorValue = 0;

		imtPanasonic = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT", 0);
		imtHeartSmart1 = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 0);
		imtHeartSmart2 = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 1);
		imtHeartSmart3 = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_IMT_HearSmart", 2);

		var imtDinominator = [];
		if (imtHeartSmart1.value) {
			imtIndicatorObject.value = imtHeartSmart1.value;
			imtDinominator.push(imtHeartSmart1.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
					+ imtHeartSmart1.value;
		}

		if (imtHeartSmart2.value) {
			imtIndicatorObject.value = imtHeartSmart2.value;
			imtDinominator.push(imtHeartSmart2.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
					+ imtHeartSmart2.value;
		}

		if (imtHeartSmart3.value) {
			imtIndicatorObject.value = imtHeartSmart3.value;
			imtDinominator.push(imtHeartSmart3.value);
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
					+ imtHeartSmart3.value;
		}

		imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
				/ imtDinominator.length;

		/*
		 * imtHeartSmartIndicatorValue = (imtHeartSmart1.value +
		 * imtHeartSmart2.value + imtHeartSmart3.value) / 3;
		 */

		var regDeci = /^[0-9]+(\.[0-9]+)+$/;
		if (regDeci.test(imtHeartSmartIndicatorValue) == true) {
			imtHeartSmartIndicatorValue = imtHeartSmartIndicatorValue
					.toFixed(1);
		}

		if (imtPanasonic.value && imtIndicatorObject.value) {
			imtIndicatorObject = imtPanasonic;
		} else if (imtPanasonic.value && !imtIndicatorObject.value) {
			imtIndicatorObject = imtPanasonic;
			var calculatedScore = (imtIndicatorObject.score) * ((imtIndicatorObject.weighting) / 100);
			if (calculatedScore > 100) {
				calculatedScore = 100;
			} else if (calculatedScore < 0) {
				calculatedScore = 0;
			}
			imtIndicatorObject.score = calculatedScore;
		} else if (!imtPanasonic.value && imtIndicatorObject.value) {
			var x = imtHeartSmartIndicatorValue;

			x = eval("(x<=10?10:(x==10.1||x<=25?25:(x<=25.1||x<=40?40:(x<=40.1||x<=65?65:100))))");

			var weight = 26;
			var imtIndicatorColor;

			eval("(x==10?this.testScoreRefs.push(0, 0, 5):(x==25?this.testScoreRefs.push(0, 0, 4):(x==40?this.testScoreRefs.push(0, 0, 3):(x==65?this.testScoreRefs.push(0, 0 , 2):this.testScoreRefs.push(0, 0, 1)))))");
			imtIndicatorColor = eval("(x==100?this.GREEN:(x==65?this.ORANGE:this.RED))");

			var normalizedValue = this.calculateNormalizedScore(
					"IMT HeartSmart", x, this.testScoreRefs);

			var calculatedScore = normalizedValue * (weight / 100);
			if (calculatedScore > 100) {
				calculatedScore = 100;
			} else if (calculatedScore < 0) {
				calculatedScore = 0;
			}

			x = eval("(x==10?'E':(x==25?'D':(x==40?'C':(x==65?'B':'A'))))");

			imtIndicatorObject.testName = "IMT";
			imtIndicatorObject.idealScore = "A";
			imtIndicatorObject.value = x;
			imtIndicatorObject.score = calculatedScore;
			imtIndicatorObject.color = imtIndicatorColor;
			imtIndicatorObject.weighting = weight;
		}

		score_Array = [
				[
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_CAC", 0),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_MCG", 0),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_SphygmoCor", 0) ],
				[
						imtIndicatorObject,
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_Bioclip", 0) ],
				[
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 0),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 1),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 2) ],
				[
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 3),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 4),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 5) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page5") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 162,
			"y_circle" : 177,
			"y_text" : 184,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 178,
			"y2_line" : 178,
			"x_circle_small" : 660,
			"y_circle_small" : 178,
			"y_standard" : 178,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_Biospace", 0),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 6),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 7),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 8),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 9),
				this.getMessageTypeIndicatorValues("POCD_MT000040UV_PhEx", 0),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 10),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 11),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 12),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 13),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 14) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page6") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 188,
			"y_circle" : 203,
			"y_text" : 210,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 204,
			"y2_line" : 204,
			"x_circle_small" : 660,
			"y_circle_small" : 204,
			"y_standard" : 204,
			"array_increment" : 47,
			"y_standard_increment" : 82.2
		} ];

		score_Array = [
				[
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_ToxinePanel", 0),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_ToxinePanel", 1),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_ToxinePanel", 2),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_ToxinePanel", 3),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_ToxinePanel", 4) ],
				[
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 15),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 16),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 17),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 18),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 19),
						this.getMessageTypeIndicatorValues(
								"POLB_MT004000HT01_BloodTest", 20) ] ];

		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page7") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 160,
			"y_circle" : 175,
			"y_text" : 182,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 176,
			"y2_line" : 176,
			"x_circle_small" : 660,
			"y_circle_small" : 176,
			"y_standard" : 176,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		var pushUps = new Object();
		var sitUps = new Object();
		var strengthIndicatorObject = new Object();

		pushUps = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 1);
		sitUps = this.getMessageTypeIndicatorValues(
				"POLB_MT004000HT01_FitnessTest", 2);
		if (pushUps.value > sitUps.value) {
			strengthIndicatorObject = pushUps;
		} else {
			strengthIndicatorObject = sitUps;
		}

		score_Array = [ [
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_Biospace", 1),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 1),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 3),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 4),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 5),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 6),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_FitnessTest", 7) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page8") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 232,
			"y_circle" : 247,
			"y_text" : 256,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 250,
			"y2_line" : 250,
			"x_circle_small" : 660,
			"y_circle_small" : 250,
			"y_standard" : 250,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [ null, null, null, null, null, null ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page9") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 160,
			"y_circle" : 175,
			"y_text" : 182,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 176,
			"y2_line" : 176,
			"x_circle_small" : 660,
			"y_circle_small" : 176,
			"y_standard" : 176,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 21),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 22),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 23),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 24),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_Thyroflex", 0),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 26),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 27),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 28),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 29),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 30) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page10") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 144,
			"y_circle" : 159,
			"y_text" : 166,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 160,
			"y2_line" : 160,
			"x_circle_small" : 660,
			"y_circle_small" : 160,
			"y_standard" : 160,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 21),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 22),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 31),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 32),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_Thyroflex", 0),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 26),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 27),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 28),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 29),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 30),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 33) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page11") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 142,
			"y_circle" : 157,
			"y_text" : 164,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 158,
			"y2_line" : 158,
			"x_circle_small" : 660,
			"y_circle_small" : 158,
			"y_standard" : 158,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 35),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 36),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 37),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 38),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 39),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 40),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 41),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_BloodTest", 42) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "page12") {
		pageObject.rangeColor = "(score>70?this.GREEN:(score>30?this.ORANGE:this.RED))";
		pageObject.idealScore = "71-100";
		coordinates = [ {
			"y_rect" : 160,
			"y_circle" : 175,
			"y_text" : 182,
			"x1_line" : 640,
			"x2_line" : 658,
			"y1_line" : 176,
			"y2_line" : 176,
			"x_circle_small" : 660,
			"y_circle_small" : 176,
			"y_standard" : 176,
			"array_increment" : 0,
			"y_standard_increment" : 0
		} ];

		score_Array = [ [
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 0),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 1),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 2),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 3),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 4),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 5),
				this.getMessageTypeIndicatorValues("POLB_MT004000HT01_CNS", 6),
				this.getMessageTypeIndicatorValues(
						"POLB_MT004000HT01_Heartmath", 0) ] ];
		data = [ {
			"page" : "Results",
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "consultation1") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];
		checkedArray = [
				[
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_IN",
										"Age Management (CardioMetabolic) Program (manual)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"Wellman or Wellwomen (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"CNN Clinton/Dr. Gupta (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"Cardio-Metabolic Disease Dr. Oz (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"The Anti-Inflammation Zone (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"The Inflammation Syndrome (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"Going Against The Grain (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"The Art of Low Carbohydrate Living (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"CardioMetabolic Program Overview (Booklet)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_IN",
								"Quick Start Program Guide (Booklet)") ],
				[
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"Nutrition (Manual)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"The Paleo Solution (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"Good Calories Bad Calories (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"Eternity Nutrition Overview (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"The Dangers of Sugar 60 Mins (video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"The New Glucose Revolution (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"What Makes Us Fat (Article)"),
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_NU",
										"Carbohydrates Not Fat Cause Heart Disease (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"HCG Diet (Manual)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_NU",
								"Paleo Diet (Manual)") ] ];
		physicianComments = [
				[ this.getComments(page, "POCD_MT000040UV_PhComm_IN") ],
				[ this.getComments(page, "POCD_MT000040UV_PhComm_NU") ] ];

		var page4WorstScores = this.getWorstScores("page4");
		var page5WorstScores = this.getWorstScores("page5");

		score_Array = [
				[ page4WorstScores[0], page4WorstScores[1], page4WorstScores[2] ],
				[ page5WorstScores[0], page5WorstScores[1], page5WorstScores[2] ] ];
		data = [ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates" : coordinates,
			"checkedArray" : checkedArray,
			"comments" : physicianComments
		} ];
	}

	if (page == "consultation2") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];

		checkedArray = [
				[
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Is Sugar Toxic (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Caloric Sweetener and Dyslipidemia (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Detox or Die (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"The Detox Strategy (Book)"),
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_TO",
										"Toxins and inability to lose weight (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Cancer is a man made disease (Article)"),
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_TO",
										"Tomatoes, lycopene and prostate cancer (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Earthing (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Raw Food (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_TO",
								"Detox with Oral Chelation (Book)") ],
				[
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"Body For Life (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"The Life Plan (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"Eternity Exercise (Video)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"Exercise as Hypertension Therapy (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"Exercise slows aging process (Article)"),
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_EX",
										"Aerobic and Resistance Exercise for Diabetes (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"Sitting shaves years off your life (Article)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"The Y's Way To Physical Fitness (Book)"),
						this.getCheckedValue("POCD_MT000040UV_PhComm_EX",
								"The Power of Ten (Book)"),
						this
								.getCheckedValue("POCD_MT000040UV_PhComm_EX",
										"Exercise and Psychological Wellbeing(Article)") ] ];

		physicianComments = [
				[ this.getComments(page, "POCD_MT000040UV_PhComm_TO") ],
				[ this.getComments(page, "POCD_MT000040UV_PhComm_EX") ] ];

		var page6WorstScores = this.getWorstScores("page6");
		var page7WorstScores = this.getWorstScores("page7");

		score_Array = [
				[ page6WorstScores[0], page6WorstScores[1], page6WorstScores[2] ],
				[ page7WorstScores[0], page7WorstScores[1], page7WorstScores[2] ] ];
		data = [ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates" : coordinates,
			"checkedArray" : checkedArray,
			"comments" : physicianComments
		} ];
	}

	if (page == "consultation3") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];
		checkedArray = [ [
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Outsmart your genes (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Telomere Testing and Aging (Article)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Telomere reactivation in aged mice (Article)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Genetic Screening Personalized Health (Article)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Sample Genetic Client Report (Article)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Genetics of Cardio-Metabolic Disease (Part 1)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Genetics of Cardio-Metabolic Disease (Part 2)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"The Wrinkle Cure (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"The Perricone Prescription (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_GE",
						"Spa Medicine (Book)") ] ];
		physicianComments = [ [ this.getComments(page,
				"POCD_MT000040UV_PhComm_GE") ] ];

		var page8WorstScores = this.getWorstScores("page8");

		score_Array = [ [ page8WorstScores[0], page8WorstScores[1],
				page8WorstScores[2] ] ];
		data = [ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates" : coordinates,
			"checkedArray" : checkedArray,
			"comments" : physicianComments
		} ];
	}

	if (page == "consultation4") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];
		hormoneDrugArray = [
				this.getDrugs(page, "POSA_MT920000HT03_Hormones",
						"Testosterone"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones", "Estrogen"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones",
						"Progesterone"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones", "Thyroid"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones", "DHEA"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones", "Melatonin"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones",
						"Growth Hormone"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones", "Cortef"),
				this.getDrugs(page, "POSA_MT920000HT03_Hormones",
						"Pregnenolone") ];

		physicianComments = [ [ this.getComments(page,
				"POSA_MT920000HT03_HormonesRpt") ] ];
		if (this.gender == "M") {
			var page9WorstScores = this.getWorstScores("page9");

			score_Array = [ [ page9WorstScores[0], page9WorstScores[1],
					page9WorstScores[2] ] ];

		} else {
			var page10WorstScores = this.getWorstScores("page10");

			score_Array = [ [ page10WorstScores[0], page10WorstScores[1],
					page10WorstScores[2] ] ];
		}

		data = [ {
			"page" : "Consultation",
			"consultationType" : "restorationHormones",
			"hormoneDrugArray" : hormoneDrugArray,
			"comments" : physicianComments,
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "consultation5") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];
		anti_agingDrugArray = [ {
			"drug1" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Telomere Multivitamin"),
			"drug2" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Liquid Fish Oil"),
			"drug3" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Inflammation Control"),
			"drug4" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Antioxidant Formula"),
			"drug5" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Mega Omegas 600mg"),
			"drug6" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Tri Mag")
		} ];
		horoneBoostersDrugArray = [ {
			"drug1" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Adrenal Support"),
			"drug2" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Thyroid Support"),
			"drug3" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Prostate Support"),
			"drug4" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Vitamin D3"),
			"drug5" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Estrogen Support"),
			"drug6" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Secretropin 30ml(1Oz)")
		} ];
		cardioSupportDrugArray = [ {
			"drug1" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Circulation Support"),
			"drug2" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Plaque Control"),
			"drug3" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Heart Support"),
			"drug4" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Niacin 500mg"),
			"drug5" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Lipid Control"),
			"drug6" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Vitamin C")
		} ];
		dietControlDrugArray = [ {
			"drug1" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Appetite Control"),
			"drug2" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Glucose Control"),
			"drug3" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Probiotic Support"),
			"drug4" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Carb Blocker"),
			"drug5" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Weight Burn"),
			"drug6" : this.getDrugs(page, "POSA_MT920000HT03_Supplements",
					"Sleep Support")
		} ];

		advancedSupplementationDrugIntakeArray = [ anti_agingDrugArray,
				horoneBoostersDrugArray, cardioSupportDrugArray,
				dietControlDrugArray ];
		physicianComments = [ [ this.getComments(page,
				"POSA_MT920000HT03_SupplementsRpt") ] ];
		var page11WorstScores = this.getWorstScores("page11");

		score_Array = [ [ page11WorstScores[0], page11WorstScores[1],
				page11WorstScores[2] ] ];
		data = [ {
			"page" : "Consultation",
			"consultationType" : "advancedSupplementation",
			"advancedSupplementationDrugArray" : advancedSupplementationDrugIntakeArray,
			"comments" : physicianComments,
			"array" : score_Array,
			"coordinates" : coordinates
		} ];
	}

	if (page == "consultation6") {

		coordinates = [ {
			"x_rect" : 200,
			"x_circle" : 170,
			"x1_line" : 190,
			"x2_line" : 210,
			"x_circle_small" : 212,
			"x_standard" : 210,
			"x_text" : 155
		} ];
		checkedArray = [ [
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"The Metastory (Video)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"The Ever Present Origin (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"Up From Eden (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"The Relaxation Response (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"The Heart Math Solution (Boook)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"Meaning and Medicine (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"The Decision Tree Awareness (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"Mind Body Medicine (Book)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"Integral Health -  The Four Quadrants (Video)"),
				this.getCheckedValue("POCD_MT000040UV_PhComm_LI",
						"Integral Spirituality (Book)") ] ];
		physicianComments = [ [ this.getComments(page,
				"POCD_MT000040UV_PhComm_LI") ] ];
		var page12WorstScores = this.getWorstScores("page12");

		score_Array = [ [ page12WorstScores[0], page12WorstScores[1],
				page12WorstScores[2] ] ];
		data = [ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates" : coordinates,
			"checkedArray" : checkedArray,
			"comments" : physicianComments
		} ];
	}

	pageObject.score_Array = score_Array;
	return data;
};

HIN.ReportModel.prototype.getCheckedValue = function(messageType, codeValue) {
	if (codeValue.indexOf("'") > -1) {
		codeValue = 'concat("' + codeValue.replace(/'/g, '","\'","') + '")';
	} else {
		codeValue = "'" + codeValue + "'";
	}

	var map = this.messageTypeMap.get(messageType);
	if (map) {
		var object = map.value;
		var reportType = object.reportType;
		if (reportType == "consultation" && object) {
			var messages = object.messages;
			if (messages && messages.length > 0) {
				var message = messages[0];
				var xml = message.message;
				var messageXml = XmlUtil.stringToXml(xml);
				if (messageXml) {
					var checkedValue = this.getDataFromXml(messageType,
							messageXml, codeValue);
					return checkedValue;
				}
			}
		}
	}
	return "false";
};

HIN.ReportModel.prototype.getDataFromXml = function(messageType, messageXml,
		codeValue) {
	var checkedValue = "false";
	if (messageXml) {
		var xPath = "message/"
				+ messageType
				+ "/component/structuredBody/component/section/entry/observation/value[thumbnail="
				+ codeValue + "]/thumbnail/text()";
		var x = XmlUtil.getXPathResult(messageXml, xPath,
				XPathResult.STRING_TYPE);
		x = x.stringValue;

		if (x && typeof (x) != 'object') {
			checkedValue = "true";
		}
	}
	return checkedValue;
};

HIN.ReportModel.prototype.getMessageTypeIndicatorValues = function(messageType,
		index) {
	var object = this.messageTypeMap.getItem(messageType);
	if (object) {
		var indicatorObject = new Object();
		indicatorObject.testName = object.testNames[index];
		indicatorObject.idealScore = object.idealScores[index];
		indicatorObject.value = object.values[index];
		indicatorObject.color = object.colors[index];
		indicatorObject.score = object.scores[index];
		indicatorObject.weighting = object.weights[index];
		indicatorObject.worstScore = object.worstScore;
		return indicatorObject;
	}

	return null;
};

HIN.ReportModel.prototype.getDrugs = function(reportType, messageType,
		codeValue) {
	var map = this.messageTypeMap.get(messageType);
	var array = [];
	var howMany = "";
	var when = "";
	if (map) {
		var object = map.value;
		var type = object.reportType;
		if (type == reportType && object) {

			var messages = object.messages;
			for ( var index = 0; index < messages.length; index++) {
				var message = messages[index];
				var xml = message.message;
				var messageXml = XmlUtil.stringToXml(xml);
				if (messageXml) {
					var xPath = "message/" + messageType + "/id[extension ='"
							+ codeValue + "']/extension/text()";
					var x = XmlUtil.getXPathResult(messageXml, xPath,
							XPathResult.STRING_TYPE);
					x = x.stringValue;
					if (x && typeof (x) != 'object') {
						howManyXPath = "message/" + messageType
								+ "/code/code/text()";
						howMany = XmlUtil.getXPathResult(messageXml,
								howManyXPath, XPathResult.STRING_TYPE);
						howMany = howMany.stringValue;
						whenXPath = "message/" + messageType
								+ "/priorityCode/code/text()";
						when = XmlUtil.getXPathResult(messageXml, whenXPath,
								XPathResult.STRING_TYPE);
						when = when.stringValue;
						if (x == codeValue) {
							break;
						}
					} else {
						howMany = "";
						when = "";
					}

				}
			}
			array.push(howMany)
			array.push(when);
			return array;
		}
	}
	array.push(howMany)
	array.push(when);
	return array;
};

HIN.ReportModel.prototype.getComments = function(reportType, messageType) {
	var map = this.messageTypeMap.get(messageType);
	var comments = "";
	if (map) {
		var object = map.value;
		var reportType = object.reportType;
		var type = object.reportType;
		if (type == reportType && object) {
			var messages = object.messages;
			if (messages && messages.length > 0) {
				var message = messages[0];
				var xml = message.message;
				var messageXml = XmlUtil.stringToXml(xml);
				if (messageXml) {
					if (messageXml) {

						var xPath = "";
						if (messageType === "POSA_MT920000HT03_SupplementsRpt"
								|| messageType === "POSA_MT920000HT03_HormonesRpt") {
							xPath = "message/" + messageType
									+ "/text/thumbnail/text()";

						} else {
							xPath = "message/"
									+ messageType
									+ "/component/structuredBody/component/section/text/thumbnail/text()";
						}
						var x = XmlUtil.getXPathResult(messageXml, xPath,
								XPathResult.STRING_TYPE);
						x = x.stringValue;
						if (x && typeof (x) != 'object') {
							comments = x;
						}

					}
				}

			}
		}
	}
	return comments;
};

HIN.ReportModel.prototype.calculateAge = function(dob) {
	var date1 = new Date();
	var date2 = new Date(dob);
	var pattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/; // Regex to validate date
	if (pattern.test(dob)) {
		var y1 = date1.getFullYear(); // getting current year
		var y2 = date2.getFullYear(); // getting dob year
		var age = y1 - y2; // calculating age
		return age;
	} else {
		console
				.log("Invalid date format. Please Input in (dd/mm/yyyy) format!");
		return false;
	}
};

HIN.ReportModel.prototype.getWorstScores = function(page) {
	var map = this.pagesMap.get(page);
	worstScores = [];
	if (map) {
		var pageObject = map.value;
		return pageObject.worstScores;
	}

	return worstScores;
};