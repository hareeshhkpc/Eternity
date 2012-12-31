var width;
var height;
var totalSleep = 0;
var physicalTotal = [];
var emotionalTotal = [];
var spiritualTotal = [];
var mentalTotal = [];
var relationalTotal = [];
var environmentalTotal = [];

var questionObj = new HIN.QuestionnaireFormGenerator();

$(document).ready(function() {

	$('.questionnaireTitle').click(function() {
		var questionnaireTypeID = $(this).attr("id");
		var questionnaireBlockID = questionnaireTypeID + "_child";
		$('#' + questionnaireBlockID).slideToggle();
	});

	loadHistoryQuestionnaire();
	loadNutritionScreen();
	loadHormoneScreenWomen();
	loadHormoneQuestionnaireMale();
	loadSilentInflamationQuestionnaire();
	loadStressScreen();
	loadSleepScreen();
});

/* History Questionnaire Screen */
function loadHistoryQuestionnaire() {
	var questionnaireArray = getHistoryQuestionnaire();

	$.each(questionnaireArray, function(index, question) {
		var label = questionObj.generateUI(index + 1, question, "History");
		$("#lifestyleHistoryQuestionnaire").append(label);
	});

	var totalUI = questionObj.appendTotalUI("History");
	$("#lifestyleHistoryQuestionnaire").append(totalUI);

	$('.ui-option').change(function() {
		questionObj.calculateTotal(questionnaireArray.length, "History");
	});
}

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

/* Nutrition Questionnaire Screen */

function loadNutritionScreen() {
	var questionnaireArray1 = getNutritionQuestionnaire1stCategory();
	var questionnaireArray2 = getNutritionQuestionnaire2ndCategory();
	var questionnaireArray3 = getNutritionQuestionnaire3rdCategory();
	var questionnaireArray4 = getNutritionQuestionnaire4thCategory();
	var categoryArray = getNutritionQuestionnaireCategory();

	var mainArray = [ {
		"category" : categoryArray,
		"array" : [ questionnaireArray1, questionnaireArray2,
				questionnaireArray3, questionnaireArray4 ]
	} ];

	var index = 1;
	var questionnaireArray = 0;

	for (i in mainArray) {
		var groupName = mainArray[i].category;
		for (m in groupName) {
			var ID = parseInt(m) + 1;
			var nutritionCategory = loadCategory(ID, groupName[m]);
			$('#categoryBlock').append(nutritionCategory);
		}
		for (j in mainArray[i].array) {
			width = 38;

			questionnaireArray = questionnaireArray
					+ mainArray[i].array[j].length;

			for (k in mainArray[i].array[j]) {
				var question = mainArray[i].array[j];
				var id = parseInt(j) + 1;

				var label = questionObj.generateUI(index, question[k],
						"Nutrition");

				if (id == "1") {
					$('#category' + id).css("width", width + "px");
					$('#category' + id).css("margin-top", "145px");
					$('#category' + id).css("margin-left", "-145px");
				} else if (id == "2") {
					$('#category' + id).css("width", width + "px");
					$('#category' + id).css("margin-top", "107px");
					$('#category' + id).css("margin-left", "-107px");
				} else if (id == "3") {
					$('#category' + id).css("width", width + "px");
					$('#category' + id).css("margin-top", "127px");
					$('#category' + id).css("margin-left", "-127px");
				} else {
					$('#category' + id).css("width", width + "px");
					$('#category' + id).css("margin-top", "89px");
					$('#category' + id).css("margin-left", "-89px");
				}
				$('#nutritionQuestionnaire' + id).append(label);

				index += 1;
				width = width + 38;
			}

		}

	}

	var totalUI = questionObj.appendTotalUI("Nutrition");
	$("#categoryBlock").append(totalUI);

	$('.ui-option').change(function() {
		questionObj.calculateTotal(questionnaireArray, "Nutrition");
	});

}

function getNutritionQuestionnaireCategory() {
	var nutritionQuestionnaireCategory = [];
	nutritionQuestionnaireCategory.push("High Glycemic Carbohydrates");
	nutritionQuestionnaireCategory.push("Omega 6s/Transfats");
	nutritionQuestionnaireCategory.push("Omega 3s/Omega 9s");
	nutritionQuestionnaireCategory.push("Beverages");
	return nutritionQuestionnaireCategory;
}

function loadCategory(index, category) {
	var categoryBlock = '<div>';
	categoryBlock += '<div style="width:5%;float:left;height:100px;">';
	categoryBlock += '<div id="category' + index + '" class="rotate-block">';
	categoryBlock += category;
	categoryBlock += '</div>';
	categoryBlock += '</div>';
	categoryBlock += '<div id="nutritionQuestionnaire' + index
			+ '" class="nutrition-questionnaire-block"></div>';
	categoryBlock += '</div>';
	return categoryBlock;
}

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

/* Hormone For Women */
function loadHormoneScreenWomen() {
	var questionnaireArray1 = getHormoneQuestionnaire1stCategory();
	var questionnaireArray2 = getHormoneQuestionnaire2ndCategory();
	var questionnaireArray3 = getHormoneQuestionnaire3rdCategory();
	var categoryArray = getQuestionnaireCategory();

	var mainArray = [ {
		"category" : categoryArray,
		"array" : [ questionnaireArray1, questionnaireArray2,
				questionnaireArray3 ]
	} ];

	var index = 1;
	for (i in mainArray) {
		var groupName = mainArray[i].category;
		for (m in groupName) {
			var ID = parseInt(m) + 1;
			var hormoneCategory = loadHormoneCategory(ID, groupName[m]);
			$('#hormoneWomen').append(hormoneCategory);
		}
		for (j in mainArray[i].array) {
			height = 38;
			for (k in mainArray[i].array[j]) {
				var question = mainArray[i].array[j];
				var id = parseInt(j) + 1;
				var label = questionObj.generateUI(index, question[k], "Women");
				if (id == "1") {
					$('#hormoneQuestionnaireGroup' + id).css("height",
							height + "px");
				} else if (id == "2") {
					$('#hormoneQuestionnaireGroup' + id).css("height",
							height + "px");
				} else {
					$('#hormoneQuestionnaireGroup' + id).css("height",
							height + "px");
				}
				$('#hormoneQuestionnaire' + id).append(label);

				height = height + 38;
				index = index + 1;
			}
		}

	}

}

function getQuestionnaireCategory() {
	var questionnaireCategoryArray = [];
	questionnaireCategoryArray.push("Progesterone");
	questionnaireCategoryArray.push("Testosterone");
	questionnaireCategoryArray.push("Estrogen");
	return questionnaireCategoryArray;
}

function loadHormoneCategory(index, category) {
	var categoryBlock = '<div id="hormoneQuestionnaireGroup' + index
			+ '" class="ui-category-women">';
	categoryBlock += '<div class="ui-text-align">';
	categoryBlock += category;
	categoryBlock += '</div>';
	categoryBlock += '</div>';
	categoryBlock += '<div id="hormoneQuestionnaire' + index
			+ '" class="ui-hormone-questionnaire-content "></div>';
	return categoryBlock;
}

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

/* Load Hormone For men Screen */
function loadHormoneQuestionnaireMale() {
	var questionnaireArray = getHormoneQuestionnaireMale();
	$(questionnaireArray).each(function(index, question) {
		var label = questionObj.generateUI(index + 1, question, "Male");
		$('#hormoneMen').append(label);
	});
}

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

/* Load Silent Inflamation Screen */
function loadSilentInflamationQuestionnaire() {
	var questionnaireArray = getSilentInflamationQuestionnaire();
	$(questionnaireArray).each(function(index, question) {
		var label = questionObj.generateUI(index + 1, question, "Silent");
		$('#silentInflamation').append(label);
	});

	var totalUI = questionObj.appendTotalUI("Silent");
	$("#silentInflamation").append(totalUI);

	$('.ui-option').change(function() {
		questionObj.calculateTotal(questionnaireArray.length, "Silent");
	});
}

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

/* Load Stress Screen */
function loadStressScreen() {
	var questionnaireArray = getStressQuestionnaire();
	var arraySize = 0;
	arraySize += questionnaireArray.length * 6;
	var count = questionObj.questionID + 1;
	arraySize += parseInt(count);

	$.each(questionnaireArray, function(index, question) {
		var questionnaireSet1 = loadStressQuestionnaire(index + 1,
				question.Physical, question.Emotional, question.Spiritual,
				"physical", "emotional", "spiritual");

		var questionnaireSet2 = loadStressQuestionnaire(index + 1,
				question.Mental, question.Relational, question.Environmental,
				"mental", "relational", "environmental");

		$('#stressScreenFirst').append(questionnaireSet1);
		$('#stressScreenSecond').append(questionnaireSet2);
	});

	var totalDivGroup1 = getTotalDiv("physical", "emotional", "spiritual");
	var totalDivGroup2 = getTotalDiv("mental", "relational", "environmental");
	$('#stressScreenFirst').append(totalDivGroup1);
	$('#stressScreenSecond').append(totalDivGroup2);

	$('.ui-stress-rate').keyup(
			function() {

				var totalPhysical = 0;
				var totalEmotional = 0;
				var totalSpiritual = 0;
				var totalMental = 0;
				var totalRelational = 0;
				var totalEnvironmental = 0;

				for ( var i = count; i <= arraySize; i++) {
					if ($("#EDDisplayValuephysical" + i).val()) {
						totalPhysical += parseInt($(
								"#EDDisplayValuephysical" + i).val());
					}
					if ($("#EDDisplayValueemotional" + i).val()) {
						totalEmotional += parseInt($(
								"#EDDisplayValueemotional" + i).val());
					}
					if ($("#EDDisplayValuespiritual" + i).val()) {
						totalSpiritual += parseInt($(
								"#EDDisplayValuespiritual" + i).val());
					}
					if ($("#EDDisplayValuemental" + i).val()) {
						totalMental += parseInt($("#EDDisplayValuemental" + i)
								.val());
					}
					if ($("#EDDisplayValuerelational" + i).val()) {
						totalRelational += parseInt($(
								"#EDDisplayValuerelational" + i).val());
					}
					if ($("#EDDisplayValueenvironmental" + i).val()) {
						totalEnvironmental += parseInt($(
								"#EDDisplayValueenvironmental" + i).val());
					}
				}

				$("#EDDisplayValuephysical").val(totalPhysical);
				$("#EDDisplayValuephysical").trigger('change');
				$("#EDDisplayValueemotional").val(totalEmotional);
				$("#EDDisplayValueemotional").trigger('change');
				$("#EDDisplayValuespiritual").val(totalSpiritual);
				$("#EDDisplayValuespiritual").trigger('change');
				$("#EDDisplayValuemental").val(totalMental);
				$("#EDDisplayValuemental").trigger('change');
				$("#EDDisplayValuerelational").val(totalRelational);
				$("#EDDisplayValuerelational").trigger('change');
				$("#EDDisplayValueenvironmental").val(totalEnvironmental);
				$("#EDDisplayValueenvironmental").trigger('change');

			});

}

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

function loadStressQuestionnaire(index, question1, question2, question3,
		group1, group2, group3) {
	var id = questionObj.questionID;
	id = id + 1;
	var questionnaire = '<div>';

	questionnaire += '<div class="ui-stress-question1">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question1
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group1 + '' + id + '"></div>';
	questionnaire += '</div>';

	id = id + 1;
	questionnaire += '<div class="ui-stress-question">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question2
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group2 + '' + id + '"></div>';
	questionnaire += '</div>';

	id = id + 1;
	questionObj.questionID = id;

	questionnaire += '<div class="ui-stress-question">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question3
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group3 + '' + id + '"></div>';
	questionnaire += '</div>';

	questionnaire += '</div>';
	return questionnaire;
}

function getTotalDiv(id1, id2, id3) {
	var idSuffix = questionObj.questionID;
	idSuffix = idSuffix + 1;
	var total = '<div class="ui-stress-total1">TOTAL</div>';
	total += '<div id="'
			+ id1
			+ '" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ idSuffix
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ id1 + '"></div>';
	idSuffix = idSuffix + 1;
	total += '<div class="ui-stress-total">TOTAL</div>';
	total += '<div id="'
			+ id1
			+ '" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ idSuffix
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ id2 + '"></div>';
	idSuffix = idSuffix + 1;
	questionObj.questionID = idSuffix;
	total += '<div class="ui-stress-total">TOTAL</div>';
	total += '<div id="'
			+ id1
			+ '" class="ui-body-d stress-total-count" isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ idSuffix
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ id3 + '"></div>';
	return total;
}

/* Load Sleep Screen */

function loadSleepScreen() {
	var questionnaireArray = getSleepQuestionnaire();
	$.each(questionnaireArray, function(index, question) {
		var label = questionObj.generateUI(index + 1, question.value, "Sleep");
		var rateUI = sleepRateUI(question.key);
		$("#sleepScreen").append(label);
		$("#sleepScreenRate").append(rateUI);

		var total = getSleepRateTotal(question.key);
		$("#lifestyle_sleep_value").html(total);

	});

	var totalUI = questionObj.appendTotalUI("Sleep");
	$("#sleepScreen").append(totalUI);

	$('.ui-option').change(function() {
		questionObj.calculateTotal(questionnaireArray.length, "Sleep");
	});
}

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

function sleepRateUI(value) {
	var rateDiv = '<div class="ui-option-input">';
	rateDiv += '<div class="ui-text-align">';
	rateDiv += value;
	rateDiv += '</div>';
	rateDiv += '</div>';
	return rateDiv;
}

function getSleepRateTotal(value) {
	totalSleep = totalSleep + parseInt(value);
	return totalSleep;
}