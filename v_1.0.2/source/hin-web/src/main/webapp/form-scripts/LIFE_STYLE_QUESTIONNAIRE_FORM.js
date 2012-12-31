function LIFE_STYLE_QUESTIONNAIRE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;
	this.totalSleep = 0;

	this.history = "false";
	this.nutrition = "false";
	this.hormoneWomen = "false";
	this.hormoneMale = "false";
	this.silentInflamation = "false";
	this.stress = "false";
	this.sleep = "false";
	// this.page = page;
	this.indexOfObs = 1;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.fillData = fillData;
	this.loadHistoryQuestionnaire = loadHistoryQuestionnaire;
	this.getHistoryQuestionnaire = getHistoryQuestionnaire;

	this.loadNutritionScreen = loadNutritionScreen;
	this.getNutritionQuestionnaireCategory = getNutritionQuestionnaireCategory;
	this.loadCategory = loadCategory;
	this.getNutritionQuestionnaire1stCategory = getNutritionQuestionnaire1stCategory;
	this.getNutritionQuestionnaire2ndCategory = getNutritionQuestionnaire2ndCategory;
	this.getNutritionQuestionnaire3rdCategory = getNutritionQuestionnaire3rdCategory;
	this.getNutritionQuestionnaire4thCategory = getNutritionQuestionnaire4thCategory;

	this.loadHormoneScreenWomen = loadHormoneScreenWomen;
	this.getQuestionnaireCategory = getQuestionnaireCategory;
	this.loadHormoneCategory = loadHormoneCategory;
	this.getHormoneQuestionnaire1stCategory = getHormoneQuestionnaire1stCategory;
	this.getHormoneQuestionnaire2ndCategory = getHormoneQuestionnaire2ndCategory;
	this.getHormoneQuestionnaire3rdCategory = getHormoneQuestionnaire3rdCategory;

	this.loadHormoneQuestionnaireMale = loadHormoneQuestionnaireMale;
	this.getHormoneQuestionnaireMale = getHormoneQuestionnaireMale;

	this.loadSilentInflamationQuestionnaire = loadSilentInflamationQuestionnaire;
	this.getSilentInflamationQuestionnaire = getSilentInflamationQuestionnaire;

	this.loadStressScreen = loadStressScreen;
	this.getStressQuestionnaire = getStressQuestionnaire;
	this.loadStressQuestionnaire = loadStressQuestionnaire;
	this.getTotalDiv = getTotalDiv;

	this.loadSleepScreen = loadSleepScreen;
	this.getSleepQuestionnaire = getSleepQuestionnaire;
	this.sleepRateUI = sleepRateUI;
	this.getSleepRateTotal = getSleepRateTotal;

	this.questionObj = new HIN.QuestionnaireFormGenerator();
	this.questionaireMap = new HIN.HashMap();
	this.lastQuestionnaireBlockID = null;

	function initialize() {
		
		var patientVO = appController.getComponent("Context").getPatientVO();
		var gender =  patientVO.gender;
		if(gender == 'M'){
			$('#hormoneScreenWomenToggle').css("display","none");
		}else{
			$('#hormoneScreenMaleToggle').css("display","none");
		}
		
		try {
			$('.questionnaireTitle')
					.click(
							function() {

								var questionnaireTypeID = $(this).attr("id");
								var map = thisObject.questionaireMap
										.get(questionnaireTypeID)
								if (!map) {
									thisObject.questionaireMap.put(
											questionnaireTypeID,
											questionnaireTypeID);
									if (questionnaireTypeID == "historyScreenToggle") {
										thisObject.loadHistoryQuestionnaire();
									} else if (questionnaireTypeID == "nutritionScreenToggle") {
										thisObject.loadNutritionScreen();
									} else if (questionnaireTypeID == "hormoneScreenWomenToggle") {
										thisObject.loadHormoneScreenWomen();
									} else if (questionnaireTypeID == "hormoneScreenMaleToggle") {
										thisObject
												.loadHormoneQuestionnaireMale();
									} else if (questionnaireTypeID == "silentInflamationToggle") {
										thisObject
												.loadSilentInflamationQuestionnaire();
									} else if (questionnaireTypeID == "stressScreenToggle") {
										thisObject.loadStressScreen();
									} else if (questionnaireTypeID == "sleepScreenToggle") {
										thisObject.loadSleepScreen();
									}

									map = thisObject.questionaireMap
											.get(questionnaireTypeID);
								}

								if (map.value == "historyScreenToggle") {
									if (thisObject.history == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "lifestyleHistoryQuestionnaire";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);
										
										$("#lifestyleHistoryQuestionnaire").find(' [idsuffix= "16History"] ').attr("disabled", "disabled");
										$("#lifestyleHistoryQuestionnaire").find(' [idsuffix= "17History"] ').attr("disabled", "disabled");
										$("#lifestyleHistoryQuestionnaire").find(' [idsuffix= "18History"] ').attr("disabled", "disabled");
										$("#lifestyleHistoryQuestionnaire").find(' [idsuffix= "19History"] ').attr("disabled", "disabled");
										$("#lifestyleHistoryQuestionnaire").find(' [idsuffix= "20History"] ').attr("disabled", "disabled");
										
										thisObject.history = "true";
									}

								} else if (map.value == "nutritionScreenToggle") {
									if (thisObject.nutrition == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "categoryBlock";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.nutrition = "true";
									}

								} else if (map.value == "hormoneScreenWomenToggle") {
									if (thisObject.hormoneWomen == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "hormoneWomen";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.hormoneWomen = "true";
									}

								} else if (map.value == "hormoneScreenMaleToggle") {
									if (thisObject.hormoneMale == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "hormoneMen";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.hormoneMale = "true";

									}

								} else if (map.value == "silentInflamationToggle") {
									if (thisObject.silentInflamation == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "silentInflamation";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.silentInflamation = "true";
									}

								} else if (map.value == "stressScreenToggle") {
									if (thisObject.sleep == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "stressTableContainer";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.sleep = "true";
									}

								} else if (map.value == "sleepScreenToggle") {
									if (thisObject.stress == "false") {
										thisObject.message.messageAndUIBinder.parentContainerID = "sleepScreen";
										var lookupHandler = thisObject.appController
												.getComponent("DataLayer").lookupHandler;
										thisObject.message.messageAndUIBinder
												.loadDataOntoForm(lookupHandler);

										thisObject.stress = "true";
									}

								}

								var questionnaireBlockID = questionnaireTypeID
										+ "_child";
								var page = appController.getComponent(
										"RenderingEngine").getChildComponent(
										"Form").getPage();
								if (!thisObject.lastQuestionnaireBlockID) {
									thisObject.lastQuestionnaireBlockID = questionnaireBlockID;
									$('#' + questionnaireBlockID).slideToggle(
											'slow', function() {
												page.pageResized();
											});
								} else {
									if (thisObject.lastQuestionnaireBlockID == questionnaireBlockID) {
										$(
												'#'
														+ thisObject.lastQuestionnaireBlockID)
												.slideToggle('slow',
														function() {
															page.pageResized();
														});
										thisObject.lastQuestionnaireBlockID = "";
									} else {
										$(
												'#'
														+ thisObject.lastQuestionnaireBlockID)
												.slideToggle('slow',
														function() {
															page.pageResized();
														});
										$('#' + questionnaireBlockID)
												.slideToggle('slow',
														function() {
															page.pageResized();
														});
										thisObject.lastQuestionnaireBlockID = questionnaireBlockID;
									}
								}

							});

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	/* History Questionnaire Screen */
	function loadHistoryQuestionnaire() {
		thisObject.indexOfObs = 1;
		var questionnaireArray = thisObject.getHistoryQuestionnaire();
		var ui = "";

		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var object = new Object();
		page.getMessageScript(message, object, thisObject.fillData);

		// alert(questionnaireArray.length);
		$.each(questionnaireArray, function(index, question) {
			var label = thisObject.questionObj.generateUI(index + 1,
					thisObject.indexOfObs, question, "History");
			thisObject.indexOfObs = thisObject.indexOfObs + 1;
			ui += label
		});
		var totalUI = thisObject.questionObj.appendTotalUI(
				questionnaireArray.length + 1, "History");
		// thisObject.indexOfObs = thisObject.indexOfObs +
		// questionnaireArray.length +2;
		// alert(thisObject.indexOfObs);
		ui += totalUI;

		$("#lifestyleHistoryQuestionnaire").append(ui);
		
		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArray.length, "History");
				});
	}
	;

	function getHistoryQuestionnaire() {
		var history = [];
		history.push("Family history of Heart Disease, Obesity, Diabetes");
		history.push("Female(older than 55) or Male (older than 45)");
		history
				.push("History of High Blood Sugar, Blood Pressure, Blood Fats or Uric Acid");
		history.push("History of Smoking");
		history
				.push("History of Excessive alcohol (more than 3 drinks/day (male) or 5 drinks/day (female))");
		history
				.push("History of Chronic infections, intestinal problems or gum disease");
		history.push("My general health is poor");
		history.push("History of Blood clots");
		history.push("Lack of Exercise");
		history.push("Poor Sex Drive");
		history.push("No or poor Significant other relationship");
		history.push("Lack of Job Satisfaction");
		history.push("Lack of Family or Social Support");
		history.push("Lack of Happiness");
		history.push("I have no spiritual practice in my life");
		history.push("Nutrition Screen* (Score 3)");
		history.push("Hormone Screen* (Score 3)");
		history.push("Inflammation Screen* (Score 2)");
		history.push("Stress Screen* (Score 1)");
		history.push("Sleep Screen* (Score 1)");
		return history;
	}
	;

	/* Nutrition Questionnaire Screen */

	function loadNutritionScreen() {
		thisObject.indexOfObs = 23;
		var questionnaireArray1 = thisObject
				.getNutritionQuestionnaire1stCategory();
		var questionnaireArray2 = thisObject
				.getNutritionQuestionnaire2ndCategory();
		var questionnaireArray3 = thisObject
				.getNutritionQuestionnaire3rdCategory();
		var questionnaireArray4 = thisObject
				.getNutritionQuestionnaire4thCategory();
		var categoryArray = thisObject.getNutritionQuestionnaireCategory();

		var mainArray = [ {
			"category" : categoryArray,
			"array" : [ questionnaireArray1, questionnaireArray2,
					questionnaireArray3, questionnaireArray4 ]
		} ];

		var index = 1;
		var questionnaireArraySize = 0;

		for (i in mainArray) {
			var groupName = mainArray[i].category;
			for (m in groupName) {
				var ID = parseInt(m) + 1;
				var nutritionCategory = thisObject.loadCategory(ID,
						groupName[m]);
				$('#categoryBlock').append(nutritionCategory);
			}
			for (j in mainArray[i].array) {
				width = 38;

				questionnaireArraySize = questionnaireArraySize
						+ mainArray[i].array[j].length;

				for (k in mainArray[i].array[j]) {
					var question = mainArray[i].array[j];
					var id = parseInt(j) + 1;

					// alert(thisObject.indexOfObs);

					var label = thisObject.questionObj.generateUI(index,
							thisObject.indexOfObs, question[k], "Nutrition");
					thisObject.indexOfObs = thisObject.indexOfObs + 1;

					/*if (id == "1") {
						$('#category' + id).css("width", (width - 2) + "px");
						$('#category' + id).css("margin-top", "146px");
						$('#category' + id).css("margin-left", "-142px");
					} else if (id == "2") {
						$('#category' + id).css("width", width + "px");
						$('#category' + id).css("margin-top", "107px");
						$('#category' + id).css("margin-left", "-105px");
					} else if (id == "3") {
						$('#category' + id).css("width", width + "px");
						$('#category' + id).css("margin-top", "126px");
						$('#category' + id).css("margin-left", "-124px");
					} else {
						$('#category' + id).css("width", width + "px");
						$('#category' + id).css("margin-top", "88px");
						$('#category' + id).css("margin-left", "-86px");
					}*/
					$('#nutritionQuestionnaire' + id).append(label);
					index += 1;
					width = width + 38;
				}

			}

		}

		var totalUI = thisObject.questionObj.appendTotalUI(
				thisObject.indexOfObs, "Nutrition");
		// thisObject.indexOfObs = thisObject.indexOfObs + 1;
		$("#categoryBlock").append(totalUI);

		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArraySize, "Nutrition");
				});

	}
	;

	function getNutritionQuestionnaireCategory() {
		var nutritionQuestionnaireCategory = [];
		nutritionQuestionnaireCategory.push("High Glycemic Carbohydrates");
		nutritionQuestionnaireCategory.push("Omega 6s/Transfats");
		nutritionQuestionnaireCategory.push("Omega 3s/Omega 9s");
		nutritionQuestionnaireCategory.push("Beverages");
		return nutritionQuestionnaireCategory;
	}
	;

	/*function loadCategory(index, category) {
		var categoryBlock = '<div>';
		categoryBlock += '<div style="width:5%;float:left;height:100px;">';
		categoryBlock += '<div id="category' + index
				+ '" class="group-rotate">';
		categoryBlock += category;
		categoryBlock += '</div>';
		categoryBlock += '</div>';
		categoryBlock += '<div id="nutritionQuestionnaire' + index
				+ '" class="nutrition-questionnaire-block"></div>';
		categoryBlock += '</div>';
		return categoryBlock;
	}
	;*/
	
	function loadCategory(index, category) {
		var categoryBlock = '<div class="ui-questionnare-list">';
		categoryBlock += '<div class="ui-rotate-slide">';
		categoryBlock += '<span id="category' + index
				+ '" class="ui-rotate-text">';
		categoryBlock += category;
		categoryBlock += '</span>';
		categoryBlock += '</div>';
		categoryBlock += '<div id="nutritionQuestionnaire' + index
				+ '" class="ui-questionnare-form"></div>';
		categoryBlock += '</div>';
		return categoryBlock;
	}
	;

	function getNutritionQuestionnaire1stCategory() {
		var category1st = [];
		category1st.push("I frequently eat bread");
		category1st.push("I frequently eat cereals");
		category1st.push("I frequently eat rice or pasta");
		category1st.push("I frequently eat potatoes");
		category1st.push("I frequently eat wheat based products");
		category1st.push("I frequently eat pastries");
		category1st.push("I frequently eat candies");
		category1st
				.push("I frequently eat tropical fruits( bananas, mangos, melons)");
		category1st.push("I frequently eat packaged foods");
		return category1st;
	}
	;

	function getNutritionQuestionnaire2ndCategory() {
		var category2nd = [];
		category2nd.push("I frequently eat French fries");
		category2nd.push("I frequently eat cookies");
		category2nd.push("I frequently eat doughnuts");
		category2nd
				.push("I frequently use vegetable oils like sunflower, corn, cotton seed");
		category2nd.push("I frequently use margarine");
		category2nd.push("I frequently use mayonnaise");
		category2nd.push("I frequently eat chips( all types)");
		return category2nd;
	}
	;

	function getNutritionQuestionnaire3rdCategory() {
		var category3rd = [];
		category3rd.push("I rarely use olive oil");
		category3rd.push("I rarely use canola oil");
		category3rd.push("I rarely take fish oil");
		category3rd.push("I rarely eat avocados");
		category3rd.push("I rarely eat flaxseeds");
		category3rd.push("I rarely eat fish");
		category3rd.push("I rarely eat nuts");
		category3rd.push("I rarely eat soybeans");
		return category3rd;
	}
	;

	function getNutritionQuestionnaire4thCategory() {
		var category4th = [];
		category4th.push("I rarely drink water during the day");
		category4th.push("I drink milk(cows)");
		category4th.push("I drink sodas( regular or diet)");
		category4th.push("I frequently drink juice");
		category4th.push("I drink more than 3 alcoholic drinks/day");
		category4th.push("I use artificial sweeteners");
		return category4th;
	}
	;

	/* Hormone For Women */
	function loadHormoneScreenWomen() {
		thisObject.indexOfObs = 55;
		var questionnaireArray1 = thisObject
				.getHormoneQuestionnaire1stCategory();
		var questionnaireArray2 = thisObject
				.getHormoneQuestionnaire2ndCategory();
		var questionnaireArray3 = thisObject
				.getHormoneQuestionnaire3rdCategory();
		var categoryArray = thisObject.getQuestionnaireCategory();

		var mainArray = [ {
			"category" : categoryArray,
			"array" : [ questionnaireArray1, questionnaireArray2,
					questionnaireArray3 ]
		} ];

		var index = 1;
		var questionnaireArraySize = 0;
		for (i in mainArray) {
			var groupName = mainArray[i].category;
			for (m in groupName) {
				var ID = parseInt(m) + 1;
				var hormoneCategory = thisObject.loadHormoneCategory(ID,
						groupName[m]);
				$('#hormoneWomen').append(hormoneCategory);
			}
			for (j in mainArray[i].array) {
				//height = 38;

				questionnaireArraySize = questionnaireArraySize
						+ mainArray[i].array[j].length;

				for (k in mainArray[i].array[j]) {
					var question = mainArray[i].array[j];
					var id = parseInt(j) + 1;

					var label = thisObject.questionObj.generateUI(index,
							thisObject.indexOfObs, question[k], "HormoneWomen");
					thisObject.indexOfObs = thisObject.indexOfObs + 1;
					/*if (id == "1") {
						$('#hormoneQuestionnaireGroup' + id).css("height",
								height + "px");
					} else if (id == "2") {
						$('#hormoneQuestionnaireGroup' + id).css("height",
								height + "px");
					} else {
						$('#hormoneQuestionnaireGroup' + id).css("height",
								height + "px");
					}*/
					$('#hormoneQuestionnaire' + id).append(label);

					/*height = height + 38;*/
					index = index + 1;
				}
			}

		}

		var totalUI = thisObject.questionObj.appendTotalUI(
				thisObject.indexOfObs, "HormoneWomen");
		$("#hormoneWomen").append(totalUI);

		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArraySize, "HormoneWomen");
				});

	}
	;

	function getQuestionnaireCategory() {
		var questionnaireCategoryArray = [];
		questionnaireCategoryArray.push("Progesterone");
		questionnaireCategoryArray.push("Testosterone");
		questionnaireCategoryArray.push("Estrogen");
		return questionnaireCategoryArray;
	}
	;

	function loadHormoneCategory(index, category) {
		var categoryBlock = '<div class="ui-questionnare-list"><div id="hormoneQuestionnaireGroup' + index
				+ '" class="ui-category-women">';
		categoryBlock += '<div class="ui-text-align">';
		categoryBlock += category;
		categoryBlock += '</div>';
		categoryBlock += '</div>';
		categoryBlock += '<div id="hormoneQuestionnaire' + index
				+ '" class="ui-hormone-questionnaire-content "></div></div>';
		return categoryBlock;
	}
	;

	function getHormoneQuestionnaire1stCategory() {
		var category1st = [];
		category1st.push("Lighter Sleep");
		category1st.push("Anxiety");
		category1st.push("Panic Attacks");
		category1st.push("Mood Swings (irritability)");
		category1st.push("Breast Cyst, Ovarian Cysts, Fibroids");
		category1st.push("Low Sex Drive");
		category1st.push("Hot Flashes");
		category1st.push("Heavier Bleeding");
		category1st.push("Worst PMS (+/- headaches)");
		category1st.push("Mid-abdominal Weight gain");
		return category1st;
	}
	;

	function getHormoneQuestionnaire2ndCategory() {
		var category2nd = [];
		category2nd.push("I have no sex drive");
		category2nd.push("Muscles Loss");
		category2nd.push("Fatigue - no energy");
		category2nd.push("Depression");
		category2nd.push("Face more wrinkled");
		category2nd.push("More aches and pains");
		category2nd.push("My belly is getting fat");
		category2nd.push("My orgasms are less intense");
		category2nd.push("I feel less strong");
		category2nd.push("My mind is less sharp");
		return category2nd;
	}
	;

	function getHormoneQuestionnaire3rdCategory() {
		var category3rd = [];
		category3rd.push("Hot - flashes");
		category3rd.push("Vaginal Dryness");
		category3rd.push("Urinary Incontinence");
		category3rd.push("Brain Fog");
		category3rd.push("Bone Loss");
		category3rd.push("Night Sweats");
		category3rd.push("I have more facial hair");
		category3rd.push("Wrinkles around my lips");
		category3rd.push("My breast are smaller and more droopy");
		category3rd.push("I am losing hair");
		return category3rd;
	}
	;

	/* Load Hormone For men Screen */
	function loadHormoneQuestionnaireMale() {
		thisObject.indexOfObs = 87;
		var questionnaireArray = thisObject.getHormoneQuestionnaireMale();
		$(questionnaireArray).each(
				function(index, question) {
					var label = thisObject.questionObj.generateUI(index + 1,
							thisObject.indexOfObs, question, "HormoneMen");
					thisObject.indexOfObs = thisObject.indexOfObs + 1;
					$('#hormoneMen').append(label);
				});
		var totalUI = thisObject.questionObj.appendTotalUI(
				thisObject.indexOfObs, "HormoneMen");
		$("#hormoneMen").append(totalUI);

		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArray.length, "HormoneMen");

				});
		
	}
	;

	function getHormoneQuestionnaireMale() {
		var hormoneMale = [];
		hormoneMale.push("I'm often tired");
		hormoneMale.push("I have fewer early morning erections");
		hormoneMale.push("I have lost a lot of strength");
		hormoneMale.push("My mind feels less sharp");
		hormoneMale.push("I think about sex less often");
		hormoneMale.push("My belly has much more fat ");
		hormoneMale.push("I feel sadder");
		hormoneMale.push("My orgasms are less satisfying");
		hormoneMale.push("My erections are less hard");
		hormoneMale.push("I simply feel less confident");
		return hormoneMale;
	}
	;

	/* Load Silent Inflamation Screen */
	function loadSilentInflamationQuestionnaire() {
		thisObject.indexOfObs = 99;
		var ui = "";
		var questionnaireArray = thisObject.getSilentInflamationQuestionnaire();
		$(questionnaireArray).each(
				function(index, question) {
					var label = thisObject.questionObj.generateUI(index + 1,
							thisObject.indexOfObs, question, "Silent");
					thisObject.indexOfObs = thisObject.indexOfObs + 1;
					ui += label;
				});

		var totalUI = thisObject.questionObj.appendTotalUI(
				thisObject.indexOfObs, "Silent");
		ui += totalUI;
		$("#silentInflamation").append(ui);

		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArray.length, "Silent");
				});
	}
	;

	function getSilentInflamationQuestionnaire() {
		var inflamationArray = [];
		inflamationArray.push("Are you overweight?");
		inflamationArray.push("Are you always craving carbohydrates?");
		inflamationArray.push("Are you constantly hungry?");
		inflamationArray.push("Do you have diabetes or other hormonal issues?");
		inflamationArray.push("Are you tired, especially after exercise?");
		inflamationArray.push("Are your fingernails brittle?");
		inflamationArray.push("Is your hair limp with little texture?");
		inflamationArray.push("Are you constipated?");
		inflamationArray.push("Do you have a history of cancer?");
		inflamationArray.push("Do you sleep excessively?");
		inflamationArray.push("Are you groggy upon waking?");
		inflamationArray.push("Do you have heart disease?");
		inflamationArray.push("Do you have a lack of mental concentration?");
		inflamationArray.push("Do you lack a sense of well-being?");
		inflamationArray.push("Do you have headaches?");
		inflamationArray.push("Do you have a history of memory impairments?");
		inflamationArray.push("Are you constantly fatigued?");
		inflamationArray.push("Do you have dry skin?");
		inflamationArray.push("Are you aging faster than your peers?");
		inflamationArray.push("Do you have inflammatory bowel disease?");
		return inflamationArray;
	}
	;

	/* Load Stress Screen */
	function loadStressScreen() {
		thisObject.indexOfObs = 121;
		var questionnaireArray = thisObject.getStressQuestionnaire();
		var arraySize = 0;
		arraySize += questionnaireArray.length * 6;
		var count = thisObject.indexOfObs;
		arraySize += parseInt(count);

		$.each(questionnaireArray, function(index, question) {
			var questionnaireSet1 = thisObject.loadStressQuestionnaire(
					thisObject.indexOfObs, question.Physical,
					question.Emotional, question.Spiritual, "physical",
					"emotional", "spiritual");

			thisObject.indexOfObs = thisObject.indexOfObs + 3;

			/*
			 * var questionnaireSet2 = thisObject.loadStressQuestionnaire(
			 * thisObject.indexOfObs, question.Mental, question.Relational,
			 * question.Environmental, "mental", "relational", "environmental");
			 */
			// thisObject.indexOfObs = thisObject.indexOfObs + 4;
			$('#stressScreenFirst').append(questionnaireSet1);
			// $('#stressScreenSecond').append(questionnaireSet2);
		});

		thisObject.indexOfObs = 151;
		$.each(questionnaireArray, function(index, question) {

			var questionnaireSet2 = thisObject.loadStressQuestionnaire(
					thisObject.indexOfObs, question.Mental,
					question.Relational, question.Environmental, "mental",
					"relational", "environmental");
			thisObject.indexOfObs = thisObject.indexOfObs + 3;
			$('#stressScreenSecond').append(questionnaireSet2);

		});

		var totalDivGroup1 = thisObject.getTotalDiv(thisObject.indexOfObs,
				"physical", "emotional", "spiritual");
		thisObject.indexOfObs = thisObject.indexOfObs + 3;
		var totalDivGroup2 = thisObject.getTotalDiv(thisObject.indexOfObs,
				"mental", "relational", "environmental");
		$('#stressScreenFirst').append(totalDivGroup1);
		$('#stressScreenSecond').append(totalDivGroup2);

		$('.ui-stress-rate').change(
				function() {
					thisObject.questionObj.calculateTotalStressQuestionnaire(
							count, arraySize);
				});

	}
	;

	function getStressQuestionnaire() {
		var stressQuestionnaire = [];
		stressQuestionnaire.push({
			Physical : "Appetite or weight change",
			Emotional : "Anxiety",
			Spiritual : "Emptiness",
			Mental : "Forgetfulness",
			Relational : "Isolation",
			Environmental : "Leaky gut syndrome"
		});
		stressQuestionnaire.push({
			Physical : "Headaches - tension",
			Emotional : "Frustration",
			Spiritual : "Loss of meaning",
			Mental : "Low productivity",
			Relational : "Resentment",
			Environmental : "Poor memory"
		});
		stressQuestionnaire.push({
			Physical : "Fatigue",
			Emotional : "Mood swings",
			Spiritual : "Doubt",
			Mental : "Negative Attitude",
			Relational : "Loneliness",
			Environmental : "Chronic fatigue"
		});
		stressQuestionnaire.push({
			Physical : "Insomnia",
			Emotional : "Bad temper",
			Spiritual : "No joy",
			Mental : "Confusion",
			Relational : "Lashing out",
			Environmental : "Chronic disease"
		});
		stressQuestionnaire.push({
			Physical : "Digestive upsets",
			Emotional : "Crying spells",
			Spiritual : "No purpose",
			Mental : "Lethargy",
			Relational : "Clamming up",
			Environmental : "Liver toxicity"
		});
		stressQuestionnaire.push({
			Physical : "Pounding heart",
			Emotional : "Irritability",
			Spiritual : "Looking for magic",
			Mental : "Whirling mind",
			Relational : "Lowered sex drive",
			Environmental : "Immune depression"
		});
		stressQuestionnaire.push({
			Physical : "Accident prone",
			Emotional : "No one cares",
			Spiritual : "Loss of direction",
			Mental : "No new ideas",
			Relational : "Nagging",
			Environmental : "Joint Pain"
		});
		stressQuestionnaire.push({
			Physical : "Teeth grinding",
			Emotional : "Depression",
			Spiritual : "Cynicism",
			Mental : "Boredom",
			Relational : "Distrust",
			Environmental : "Skin rash"
		});
		stressQuestionnaire.push({
			Physical : "Restlessness",
			Emotional : "Worrying",
			Spiritual : "Apathy",
			Mental : "Spacing out",
			Relational : "Lack of intimacy",
			Environmental : "Emotional problems"
		});
		stressQuestionnaire.push({
			Physical : "Drug Use",
			Emotional : "Little joy",
			Spiritual : "No passion",
			Mental : "Poor concentration",
			Relational : "Apathy",
			Environmental : "Allergies asthma"
		});

		return stressQuestionnaire;
	}
	;

	function loadStressQuestionnaire(index, question1, question2, question3,
			group1, group2, group3) {
		/*
		 * var id = thisObject.questionObj.questionID; id = id + 1;
		 */
		var id = index;
		// id = id + 1

		var questionnaire = '<div>';
		questionnaire += '<table style="border-collapse:collapse;width:99.8%;"><tr><td style="border:1px solid;border-top:0px;width:33.33%">';
		questionnaire += '<div class="ui-stress-align ui-text-align" isEditor="true"  editorLabel="'
				+ question1
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
				+ id + '"></div>';
		/*questionnaire += '</td>';*/
		questionnaire += '<div class="ui-stress-align ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="value" dataType="ED" editorType="EDBoolean" idSuffix="'
				+ group1 + '' + id + '"></div>';
		questionnaire += '</td>';

		id = id + 1;
		/*questionnaire += '<div class="ui-stress-question">';*/
		questionnaire += '<td style="border:1px solid;border-top:0px;width:33.33%"><div class="ui-stress-align ui-text-align" isEditor="true"  editorLabel="'
				+ question2
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
				+ id + '"></div>';
		/*questionnaire += '</div>';*/
		questionnaire += '<div class="ui-stress-align ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="value" dataType="ED" editorType="EDBoolean" idSuffix="'
				+ group2 + '' + id + '"></div>';
		questionnaire += '</td>';

		id = id + 1;
		thisObject.questionObj.questionID = id;

		/*questionnaire += '<div class="ui-stress-question">';*/
		questionnaire += '<td style="border:1px solid;border-top:0px;width:33.33%"><div class="ui-stress-align ui-text-align" isEditor="true"  editorLabel="'
				+ question3
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
				+ id + '"></div>';
		/*questionnaire += '</div>';*/
		questionnaire += '<div class="ui-stress-align ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ id
				+ ']" tagName="value" dataType="ED" editorType="EDBoolean" idSuffix="'
				+ group3 + '' + id + '"></div>';
		questionnaire += '</td>';

		questionnaire += '</tr></table></div>';
		return questionnaire;
	}
	;

	function getTotalDiv(idSuffix, id1, id2, id3) {
		var idSuffix = thisObject.questionObj.questionID;
		idSuffix = idSuffix + 1;
		var total = '<div class="ui-stress-total1">TOTAL</div>';
		total += '<div id="'
				+ id1
				+ 'yes" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id1 + '"></div>';

		idSuffix = idSuffix + 1;
		total += '<div id="'
				+ id1
				+ 'no" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id1 + '"></div>';

		idSuffix = idSuffix + 1;
		total += '<div class="ui-stress-total">TOTAL</div>';
		total += '<div id="'
				+ id2
				+ 'yes" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id2 + '"></div>';
		idSuffix = idSuffix + 1;
		total += '<div id="'
				+ id2
				+ 'no" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id2 + '"></div>';

		idSuffix = idSuffix + 1;
		thisObject.questionObj.questionID = idSuffix;
		total += '<div class="ui-stress-total">TOTAL</div>';
		total += '<div id="'
				+ id3
				+ 'yes" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id3 + '"></div>';
		idSuffix = idSuffix + 1;
		total += '<div id="'
				+ id3
				+ 'no" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
				+ idSuffix
				+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
				+ id3 + '"></div>';

		thisObject.questionObj.questionID = thisObject.questionObj.questionID + 1;
		return total;
	}
	;

	/* Load Sleep Screen */
	function loadSleepScreen() {
		thisObject.indexOfObs = 193;
		var ui = "";
		var questionnaireArray = thisObject.getSleepQuestionnaire();
		$.each(questionnaireArray, function(index, question) {
			var label = thisObject.questionObj.generateUI(index + 1,
					thisObject.indexOfObs, question.value, "Sleep");
			thisObject.indexOfObs = thisObject.indexOfObs + 1;
			var rateUI = sleepRateUI(question.key);
			ui += label;
			$("#sleepScreenRate").append(rateUI);

			var total = thisObject.getSleepRateTotal(question.key);
			$("#lifestyle_sleep_value").html(total);

		});

		var totalUI = thisObject.questionObj.appendTotalUI(
				thisObject.indexOfObs, "Sleep");
		ui += totalUI;
		$("#sleepScreen").append(ui);

		$('.ui-option').change(
				function() {
					thisObject.questionObj.calculateTotal(
							questionnaireArray.length, "Sleep");
				});
	}
	;

	function getSleepQuestionnaire() {
		var sleepingBehaviour = [];
		sleepingBehaviour
				.push({
					key : "8",
					value : "Have you ever been told that you stop breathing while you are sleeping?"
				});
		sleepingBehaviour.push({
			key : "6",
			value : "Do you have un-restful sleep?"
		});
		sleepingBehaviour.push({
			key : "6",
			value : "Do you feel excessively sleepy during the day?"
		});
		sleepingBehaviour
				.push({
					key : "6",
					value : "Has anyone ever told you that you snore while you're sleeping?"
				});
		sleepingBehaviour
				.push({
					key : "6",
					value : "Do you awaken suddenly with shortness of breath, gasping or with your heart racing?"
				});
		sleepingBehaviour.push({
			key : "4",
			value : "Have you ever fallen asleep or nodded off while driving?"
		});
		sleepingBehaviour.push({
			key : "2",
			value : "Have you had weight gain and found it difficult to lose?"
		});
		sleepingBehaviour
				.push({
					key : "3",
					value : "Have you taken medication for or been diagnosed with high blood pressure?"
				});
		sleepingBehaviour.push({
			key : "2",
			value : "Do you wake up with headache during the night or morning?"
		});
		sleepingBehaviour.push({
			key : "2",
			value : "Do you have trouble falling asleep?"
		});
		sleepingBehaviour.push({
			key : "2",
			value : "Do you have trouble staying asleep once you fall asleep?"
		});
		sleepingBehaviour.push({
			key : "2",
			value : "Do you have depression or sexual dysfunction"
		});
		return sleepingBehaviour;
	}
	;

	function sleepRateUI(value) {
		var rateDiv = '<div class="ui-option-input">';
		rateDiv += '<div class="ui-text-align">';
		rateDiv += value;
		rateDiv += '</div>';
		rateDiv += '</div>';
		return rateDiv;
	}
	;

	function getSleepRateTotal(value) {
		thisObject.totalSleep = thisObject.totalSleep + parseInt(value);
		return thisObject.totalSleep;
	}
	;

	function fillData(messageTypeScript, object, message) {
		var updatedValues = new Array();
		var yesTotal = 0, noTotal = 0;
		
		if (history)
			history = parseInt(history);
		
		/** For Stress value in History */
		var stressPhysical = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[181]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressPhysical = (stressPhysical && stressPhysical.stringValue) ? stressPhysical.stringValue
				: "";
		if (stressPhysical)
			stressPhysical = parseInt(stressPhysical);

		var stressEmotional = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[183]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressEmotional = (stressEmotional && stressEmotional.stringValue) ? stressEmotional.stringValue
				: "";
		if (stressEmotional)
			stressEmotional = parseInt(stressEmotional);
		else
			stressEmotional = 0;

		var stressSpiritual = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[185]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressSpiritual = (stressSpiritual && stressSpiritual.stringValue) ? stressSpiritual.stringValue
				: "";
		if (stressSpiritual)
			stressSpiritual = parseInt(stressSpiritual);
		else
			stressSpiritual = 0;

		var stressMental = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[187]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressMental = (stressMental && stressMental.stringValue) ? stressMental.stringValue
				: "";
		if (stressMental)
			stressMental = parseInt(stressMental);
		else
			stressMental = 0;

		var stressRelational = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[189]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressRelational = (stressRelational && stressRelational.stringValue) ? stressRelational.stringValue
				: "";
		if (stressRelational)
			stressRelational = parseInt(stressRelational);
		else
			stressRelational = 0;

		var stressEnvironmental = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[191]/value/thumbnail",
						XPathResult.STRING_TYPE);
		stressEnvironmental = (stressEnvironmental && stressEnvironmental.stringValue) ? stressEnvironmental.stringValue
				: "";
		if (stressEnvironmental)
			stressEnvironmental = parseInt(stressEnvironmental);
		else
			stressEnvironmental = 0;

		var stressTotal = stressPhysical + stressEmotional + stressSpiritual
				+ stressMental + stressRelational + stressEnvironmental;

		/** For Nutrition value in History */
		var nutritionTotal = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[53]/value/thumbnail",
						XPathResult.STRING_TYPE);
		nutritionTotal = (nutritionTotal && nutritionTotal.stringValue) ? nutritionTotal.stringValue
				: "";
		if (nutritionTotal)
			nutritionTotal = parseInt(nutritionTotal);
		else
			nutritionTotal = 0;

		/** For Hormone value in History */

		var patientVO = appController.getComponent("Context").getPatientVO();
		var gender = patientVO.gender;

		var hormoneTotal = "";
		if (gender == 'M') {
			hormoneTotal = XmlUtil
					.getXPathResult(
							thisObject.message.message,
							"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[97]/value/thumbnail",
							XPathResult.STRING_TYPE);
		} else {
			hormoneTotal = XmlUtil
					.getXPathResult(
							thisObject.message.message,
							"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[85]/value/thumbnail",
							XPathResult.STRING_TYPE);
		}
		hormoneTotal = (hormoneTotal && hormoneTotal.stringValue) ? hormoneTotal.stringValue
				: "";
		if (hormoneTotal)
			hormoneTotal = parseInt(hormoneTotal);
		else
			hormoneTotal = 0;

		/** For Inflammation value in History */
		var inflammationTotal = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[119]/value/thumbnail",
						XPathResult.STRING_TYPE);
		inflammationTotal = (inflammationTotal && inflammationTotal.stringValue) ? inflammationTotal.stringValue
				: "";
		if (inflammationTotal)
			inflammationTotal = parseInt(inflammationTotal);
		else
			inflammationTotal = 0;

		/** For Sleep value in History */
		var sleepTotal = XmlUtil
				.getXPathResult(
						thisObject.message.message,
						"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[205]/value/thumbnail",
						XPathResult.STRING_TYPE);
		sleepTotal = (sleepTotal && sleepTotal.stringValue) ? sleepTotal.stringValue
				: "";
		if (sleepTotal)
			sleepTotal = parseInt(sleepTotal);
		else
			sleepTotal = 0;
		
		
		/** For History value in History */
		
		var question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[1]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[2]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
			/*yesTotal = yesTotal + parseInt(question);
		else
			yesTotal = yesTotal;*/
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[3]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[4]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[5]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[6]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[7]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[8]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[9]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[10]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[11]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[12]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[13]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[14]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		question =  XmlUtil
		.getXPathResult(
				thisObject.message.message,
				"message/POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE/component/structuredBody/component/section/entry/observation[15]/value/thumbnail",
				XPathResult.STRING_TYPE);
		question = (question && question.stringValue) ? question.stringValue : "";
		if(question == "0"){
			noTotal++;
		}else if(question == "1"){
			yesTotal++;
		}
		
		if (stressTotal > 15){
			updatedValues
					.push([ 'yes',
							"component,structuredBody,component,section,entry,observation[19]" ]);
			yesTotal++;
		} else {
			updatedValues
			.push([ 'no',
					"component,structuredBody,component,section,entry,observation[19]" ]);
			
			noTotal++;
		}
		if (nutritionTotal > 8){
			updatedValues
					.push([ 'yes',
							"component,structuredBody,component,section,entry,observation[16]" ]);
			yesTotal++;
		} else {
			updatedValues
			.push([ 'no',
					"component,structuredBody,component,section,entry,observation[16]" ]);
			
			noTotal++;
		}
		if (gender == 'M') {
			if (hormoneTotal > 3){
				updatedValues
						.push([ 'yes',
								"component,structuredBody,component,section,entry,observation[17]" ]);
				yesTotal++;
			} else {
				updatedValues
				.push([ 'no',
						"component,structuredBody,component,section,entry,observation[17]" ]);
				noTotal++;
			}
		} else {
			if (hormoneTotal > 8){
				updatedValues
						.push([ 'yes',
								"component,structuredBody,component,section,entry,observation[17]" ]);
				yesTotal++;
			} else {
				updatedValues
				.push([ 'no',
						"component,structuredBody,component,section,entry,observation[17]" ]);
				noTotal++;
			}
		}
		if (inflammationTotal > 5){
			updatedValues
					.push([ 'yes',
							"component,structuredBody,component,section,entry,observation[18]" ]);
			yesTotal++;
		} else {
			updatedValues
			.push([ 'no',
					"component,structuredBody,component,section,entry,observation[18]" ]);
			noTotal++;
		}
		if (sleepTotal > 8){
			updatedValues
					.push([ 'yes',
							"component,structuredBody,component,section,entry,observation[20]" ]);
			yesTotal++;
		} else {
			updatedValues
			.push([ 'no',
					"component,structuredBody,component,section,entry,observation[20]" ]);
			noTotal++;
		}
		
		updatedValues.push([ 'historyYes', yesTotal ]);
		updatedValues.push([ 'historyNo', noTotal ]);
		messageTypeScript.fillData('updateValues', updatedValues);
	}
	;

};
