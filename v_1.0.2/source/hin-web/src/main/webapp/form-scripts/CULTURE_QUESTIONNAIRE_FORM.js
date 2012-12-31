function CULTURE_QUESTIONNAIRE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.loadCultureQuestionnaire = loadCultureQuestionnaire;
	this.getCulturequestionnaireString = getCulturequestionnaireString;
	this.loadCulture = loadCulture;
	this.getCultureQuestionnaire = getCultureQuestionnaire;
	this.loadTemperamentQuestionnaireScreen = loadTemperamentQuestionnaireScreen;
	this.getTemperamentQuestionnaire = getTemperamentQuestionnaire;
	this.loadTemperamentQuestionnaire = loadTemperamentQuestionnaire;
	this.loadTemperamentQuestionnaireScreen2 = loadTemperamentQuestionnaireScreen2;
	this.getTemperamentQuestionnaire2 = getTemperamentQuestionnaire2;
	this.loadTemperamentQuestionnaireScreen3 = loadTemperamentQuestionnaireScreen3;
	this.getTemperamentQuestionnaire3 = getTemperamentQuestionnaire3;
	this.loadTemperamentQuestionnaireScreen4 = loadTemperamentQuestionnaireScreen4;
	this.getTemperamentQuestionnaire4 = getTemperamentQuestionnaire4;
	
	this.radioYes = 0;
	this.radioNo = 0;

	function initialize() {

		try {
			//alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");
			thisObject.loadCultureQuestionnaire(message);
			thisObject.loadTemperamentQuestionnaireScreen();
			thisObject.loadTemperamentQuestionnaireScreen2();
			thisObject.loadTemperamentQuestionnaireScreen3();
			thisObject.loadTemperamentQuestionnaireScreen4();

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

	function loadCultureQuestionnaire(message) {
		var questionnaireString = thisObject.getCulturequestionnaireString();
		var questionnaireArray = thisObject.getCultureQuestionnaire();
		var totalArray = "";
		var color = "";
		$(questionnaireArray).each(
				function(index, question) {
					if (index == 0) {
						$("#inner-uiform-" + message.id).find('#mainCulture')
								.append(questionnaireString);
					}
					if (index % 2 == 0) {
						color = "#FFFFFF";
					} else {
						color = "#F2F2F2";
					}
					var questionnaire = thisObject.loadCulture(index + 1,
							question, color);
					$("#inner-uiform-" + message.id).find('#mainCulture')
							.append(questionnaire);

				});
		totalArray += '<div>';
		totalArray += '<div class="cultureTotal">TOTAL</div>';
		totalArray += '<div class="cultureTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[11]" tagName="value" dataType="ED" editorType="EDTextBox"  idSuffix="culture11"></div>';
		totalArray += '<div class="cultureTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[12]" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="culture12"></div>';

		$("#inner-uiform-" + message.id).find("#mainCulture")
				.append(totalArray);

	}
	;

	function getCulturequestionnaireString() {
		var questionnaireString = "";
		questionnaireString += '<div>';
		questionnaireString += '<div class="culturetitle cultureHead">III- LL- CULTURE</div>';
		questionnaireString += '<div class="cultureBreak"></div>';
		questionnaireString += '<div class="culturehistory cultureHistory">HISTORY</div>';
		questionnaireString += '</div>';
		return questionnaireString;
	}
	;

	function loadCulture(index, question, color) {
		var questionnaire = "";
		questionnaire += '<table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%"><div class="cultureQuestionnaireNumber" style="background-color: '
				+ color + ';" >' + index + '</div></td>';
		questionnaire += '<td style="width:65%;"><div class="cultureQuestionnaireTable" style="background-color: '
				+ color
				+ ';" isEditor="true" editorLabel="'
				+ question
				+ '"pathFields="component,structuredBody,component,section,entry,observation['
				+ index
				+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="culture'
				+ index + '"></div></td>';
		questionnaire += '<td style="width:25%;"><div class="cultureQuestionnaireYes" style="background-color: '
				+ color
				+ ';" isEditor="true" editorLabel=""pathFields="component,structuredBody,component,section,entry,observation['
				+ index
				+ ']" idSuffix="culture'
				+ index
				+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></td></tr></table>';
		return questionnaire;
	}
	;

	function getCultureQuestionnaire() {
		var cultureArray = new Array();
		cultureArray.push("I have a significant other that enhances me");
		cultureArray.push("I feel I am well loved.");
		cultureArray.push("I am close to my family");
		cultureArray.push("I have close friends");
		cultureArray.push("I enjoy my job");
		cultureArray.push("I have a good relationship with my coworkers");
		cultureArray.push("I am active in my community");
		cultureArray
				.push("I attend a church, mosque, synagogue(spiritual group");
		cultureArray.push("I love my country");
		cultureArray.push("I value and feel at home on 'mother earth'");
		return cultureArray;
	}
	;


	function loadTemperamentQuestionnaireScreen() {
		// alert("in meth");
		var questionnaire = thisObject.getCultureQuestionnaire();
		// alert(questionnaire.length);
		var tempQuestionnaireArray = thisObject.getTemperamentQuestionnaire();
		var count = (questionnaire.length) + (tempQuestionnaireArray.length)
				+ 2;
		var serialNum = 0;
		var incrementCounter = 0;
		for ( var i = (questionnaire.length + 1 + 2); i <= count; i++) {

			serialNum += 1;

			// var arrayIndex = parseInt(serialNum)-1;
			// alert("i: "+i);
			var tempQuestionnaire = thisObject.loadTemperamentQuestionnaire(
					serialNum, i, incrementCounter,
					tempQuestionnaireArray[incrementCounter].OptionA,
					tempQuestionnaireArray[incrementCounter].OptionB,
					"TemperamentAssessment");
			incrementCounter += 1;
			$("#inner-uiform-" + message.id).find('#TemperamentAssessment')
					.append(tempQuestionnaire);

		}

	}
	;


	function getTemperamentQuestionnaire() {
		var temperamentQuestionnaire = [];
		temperamentQuestionnaire.push({
			OptionA : "Popular",
			OptionB : "Intimate"

		});

		temperamentQuestionnaire.push({
			OptionA : "Talkative",
			OptionB : "Reserved"

		});

		temperamentQuestionnaire.push({
			OptionA : "Lively",
			OptionB : "Calm"

		});

		temperamentQuestionnaire.push({
			OptionA : "I know varied things",
			OptionB : "I know specialized things"

		});

		temperamentQuestionnaire
				.push({
					OptionA : "I prefer to be recognized for my part in a group undertaking",
					OptionB : "I prefer to be recognized for something I have done myself"

				});

		temperamentQuestionnaire
				.push({
					OptionA : "I prefer to be skilled in games that call for interaction with others",
					OptionB : "I prefer to play singly and be solely responsible for the results"

				});

		temperamentQuestionnaire.push({
			OptionA : "My interests are varied and changing",
			OptionB : "My interests are few and lasting"

		});

		temperamentQuestionnaire
				.push({
					OptionA : "I can talk easily with anyone on anything",
					OptionB : "I find things to say only to certain people on certain topics"

				});

		return temperamentQuestionnaire;
	}
	;

	function loadTemperamentQuestionnaire(serialNum, index, increimentCounter,
			question1, question2, appendindDiv) {
		index = index + increimentCounter;
		var questionnaire = '<fieldset class="ui-grid-a">';
		questionnaire += '<div class="ui-block-a" style="height:37px;width: 5%;border: 1px solid;border-top:0px;">';
		questionnaire += '<div style="margin-left:5px;">';
		questionnaire += serialNum;
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
		questionnaire += '<div style="margin-top: 9px; margin-left:10px;">';
		questionnaire += '<div isEditor="true" class="culturecheckbox1" parentDiv="'+appendindDiv+'"  tagName="value" dataType="ED" editorType="EDCheckBox" idSuffix="cultureCheckBox" editorLabel="'
				+ question1
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ (index) + ']"></div>';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-b" style="height:37px;width: 40%; border: 1px solid; border-left: 0px;border-top:0px;">';
		questionnaire += '<div style="margin-left:5px" isEditor="true" editorLabel="'
				+ question1
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ (index)
				+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="cultureCheckBox1">';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;border-top:0px;">';
		questionnaire += '<div style="margin-top: 9px; margin-left:10px;">';
		questionnaire += '<div isEditor="true" class="culturecheckbox2" parentDiv="'+appendindDiv+'" tagName="value" dataType="ED" editorType="EDCheckBox" idSuffix="cultureCheckBox" editorLabel="'
				+ question2
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ (index + 1) + ']"></div>';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-b" style="height:37px;width: 44.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
		questionnaire += '<div style="margin-left:5px" isEditor="true" editorLabel="'
				+ question2
				+ '" pathFields="component,structuredBody,component,section,entry,observation['
				+ (index + 1)
				+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="cultureCheckBox2">';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '</fieldset>';


		return questionnaire;
	}
	;

	function loadTemperamentQuestionnaireScreen2() {
		var questionnaire = thisObject.getCultureQuestionnaire();
		var tempQuestionnaireArray = thisObject.getTemperamentQuestionnaire();
		var questionnaireArray2 = thisObject.getTemperamentQuestionnaire2();
		var count = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2)
				+ (questionnaireArray2.length) + 2 + 2;
		var serialNum = tempQuestionnaireArray.length;
		var incrementCounter = 0;
		for ( var i = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2) + 1 + 2 + 2; i <= count; i++) {

			serialNum += 1;
			var tempQuestionnaire = thisObject.loadTemperamentQuestionnaire(
					serialNum, i, incrementCounter,
					questionnaireArray2[incrementCounter].OptionA,
					questionnaireArray2[incrementCounter].OptionB,
					"TemperamentAssessment2");
			incrementCounter += 1;
			$("#inner-uiform-" + message.id).find('#TemperamentAssessment2')
					.append(tempQuestionnaire);
		}

	}

	function getTemperamentQuestionnaire2() {
		var temperamentQuestionnaire2 = [];
		temperamentQuestionnaire2.push({
			OptionA : "Matter of fact",
			OptionB : "Imaginative"

		});

		temperamentQuestionnaire2.push({
			OptionA : "Concrete",
			OptionB : "Abstract"

		});

		temperamentQuestionnaire2.push({
			OptionA : "What is",
			OptionB : "What if"

		});

		temperamentQuestionnaire2.push({
			OptionA : "Emphasis on facts",
			OptionB : "Emphasis on possibilities"

		});

		temperamentQuestionnaire2.push({
			OptionA : "Do it the way you have been taught",
			OptionB : "Figure it out on your own"

		});

		temperamentQuestionnaire2.push({
			OptionA : "It is hard to adapt to constant change",
			OptionB : "It is hard to adapt to routine"

		});

		temperamentQuestionnaire2.push({
			OptionA : "I have more common sense",
			OptionB : "I have more vision"

		});

		temperamentQuestionnaire2.push({
			OptionA : "I am able to adjust to the facts as they are",
			OptionB : "I am able to see the possibilities"

		});

		return temperamentQuestionnaire2;
	}

	function loadTemperamentQuestionnaireScreen3() {
		var questionnaire = thisObject.getCultureQuestionnaire();
		var tempQuestionnaireArray = thisObject.getTemperamentQuestionnaire();
		var questionnaireArray2 = thisObject.getTemperamentQuestionnaire2();
		var questionnaireArray3 = thisObject.getTemperamentQuestionnaire3();
		var count = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2)
				+ ((questionnaireArray2.length) * 2)
				+ (questionnaireArray3.length) + 2 + 4;
		var serialNum = (tempQuestionnaireArray.length)
				+ (questionnaireArray2.length);
		var incrementCounter = 0;
		for ( var i = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2)
				+ ((questionnaireArray2.length) * 2) + 1 + 2 + 4; i <= count; i++) {
			serialNum += 1;
			var tempQuestionnaire = thisObject.loadTemperamentQuestionnaire(
					serialNum, i, incrementCounter,
					questionnaireArray3[incrementCounter].OptionA,
					questionnaireArray3[incrementCounter].OptionB,
					"TemperamentAssessment3");
			incrementCounter += 1;
			$("#inner-uiform-" + message.id).find('#TemperamentAssessment3')
					.append(tempQuestionnaire);
		}
	}

	function getTemperamentQuestionnaire3() {
		var temperamentQuestionnaire3 = [];
		temperamentQuestionnaire3.push({
			OptionA : "Harmony",
			OptionB : "Truth"

		});

		temperamentQuestionnaire3.push({
			OptionA : "I prefer decisions based on personal involvement",
			OptionB : "I prefer decisions based on intellectual knowledge"

		});

		temperamentQuestionnaire3.push({
			OptionA : "I more often choose tactfulness over truthfulness",
			OptionB : "I more often choose truthfulness over tactfulness"

		});

		temperamentQuestionnaire3
				.push({
					OptionA : "It is important that the world recognize the needs of people",
					OptionB : "It is important that the world run on logical principles"

				});

		temperamentQuestionnaire3.push({
			OptionA : "I go with my emotions, what is best to do",
			OptionB : "I go with the logical decision"

		});

		temperamentQuestionnaire3.push({
			OptionA : "I  more often let my heart rule my head",
			OptionB : "I more often let my head rule my heart"

		});

		temperamentQuestionnaire3
				.push({
					OptionA : "I believe its more important to be aware of those feelings",
					OptionB : "I believe its more important to be clear about what works"

				});

		temperamentQuestionnaire3
				.push({
					OptionA : "I prefer conversation that is sociable and friendly",
					OptionB : "I prefer conversation that is focused on objective analysis"

				});

		return temperamentQuestionnaire3;
	}

	function loadTemperamentQuestionnaireScreen4() {
		var questionnaire = thisObject.getCultureQuestionnaire();
		var tempQuestionnaireArray = thisObject.getTemperamentQuestionnaire();
		var questionnaireArray2 = thisObject.getTemperamentQuestionnaire2();
		var questionnaireArray3 = thisObject.getTemperamentQuestionnaire3();
		var questionnaireArray4 = thisObject.getTemperamentQuestionnaire4();
		var count = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2)
				+ ((questionnaireArray2.length) * 2)
				+ ((questionnaireArray3.length) * 2)
				+ (questionnaireArray4.length) + 2 + 6;
		var serialNum = (tempQuestionnaireArray.length)
				+ (questionnaireArray2.length) + (questionnaireArray3.length);
		var incrementCounter = 0;
		for ( var i = (questionnaire.length)
				+ ((tempQuestionnaireArray.length) * 2)
				+ ((questionnaireArray2.length) * 2)
				+ ((questionnaireArray3.length) * 2) + 1 + 2 + 6; i <= count; i++) {
			serialNum += 1;
			var tempQuestionnaire = thisObject.loadTemperamentQuestionnaire(
					serialNum, i, incrementCounter,
					questionnaireArray4[incrementCounter].OptionA,
					questionnaireArray4[incrementCounter].OptionB,
					"TemperamentAssessment4");
			incrementCounter += 1;
			$("#inner-uiform-" + message.id).find('#TemperamentAssessment4')
					.append(tempQuestionnaire);
		}

		if (message.messageAndUIBinder) {
			var lookupHandler = thisObject.appController
					.getComponent("DataLayer").lookupHandler;
			thisObject.message.messageAndUIBinder
					.loadDataOntoForm(lookupHandler);
		}

		
		$("#inner-uiform-" + message.id).find("#mainCulture").find('[dataField="true"]').each(function(key,value){
			$(value).change(function(){
				var radioYes = 0;
				var radioNo = 0;
					$("#inner-uiform-" + message.id).find("#mainCulture").find('[type="radio"]').each(function(){
						if ($(this).is(':checked')) {
							if ($(this).val() == '1') {
								radioYes += 1;
							}
							if ($(this).val() == '0') {
								radioNo += 1;
							}
						}
					});
					
					$("#inner-uiform-" + message.id).find("#mainCulture").find("#EDDisplayValueculture11").attr('value',radioYes);
					
					$("#inner-uiform-" + message.id).find("#mainCulture").find("#EDDisplayValueculture12").attr('value',radioNo);
			})
		});
		
		$("#inner-uiform-" + message.id).find("#mainCulture").find("#EDDisplayValueculture11").trigger('change');
		$("#inner-uiform-" + message.id).find("#mainCulture").find("#EDDisplayValueculture12").trigger('change');
		
		$("#inner-uiform-" + message.id).find("#temperamentCulture").find('[dataField="true"]').each(function(key,value){
			var totalCulturecheckbox1 = 0;
			var totalCulturecheckbox2 = 0;
			$(value).click(function(){
					var parentId = $(this).closest('[isEditor="true"]')[0];
					if ($(parentId).attr('class') == 'culturecheckbox1') {
						var findingDiv = $(parentId).attr('parentDiv');
						var idsuffix1 = $("#" + findingDiv + "Total1").attr('idSuffix');
						var count = 0;
						$("#"+findingDiv).find('[type="checkbox"]').each(function(){
							var parent = $(this).closest('[isEditor="true"]')[0];
							if($(this).is(':checked') && $(parent).attr('class') == 'culturecheckbox1'){
								count += 1;
							}
						});
						$("#inner-uiform-" + message.id).find("#" + findingDiv + "Total1").find("#EDDisplayValue" + idsuffix1).attr('value',count);
						$("#inner-uiform-" + message.id).find("#" + findingDiv + "Total1").find("#EDDisplayValue" + idsuffix1).trigger('change');
					}
					if ($(parentId).attr('class') == 'culturecheckbox2') {
						var findingDiv = $(parentId).attr('parentDiv');
						var idsuffix2 = $("#" + findingDiv + "Total2").attr('idSuffix');
						var count = 0;
						$("#"+findingDiv).find('[type="checkbox"]').each(function(){
							var parent = $(this).closest('[isEditor="true"]')[0];
							if($(this).is(':checked') && $(parent).attr('class') == 'culturecheckbox2'){
								count += 1;
							}
						});
						$("#inner-uiform-" + message.id).find("#" + findingDiv + "Total2").find("#EDDisplayValue" + idsuffix2).attr('value',count);
						$("#inner-uiform-" + message.id).find("#" + findingDiv + "Total2").find("#EDDisplayValue" + idsuffix2).trigger('change');
					}
			});
			
		});
	
	}

	function getTemperamentQuestionnaire4() {
		var temperamentQuestionnaire4 = [];
		temperamentQuestionnaire4.push({
			OptionA : "Scheduled",
			OptionB : "Flexible"

		});

		temperamentQuestionnaire4.push({
			OptionA : "Decisive",
			OptionB : "Open minded"

		});

		temperamentQuestionnaire4
				.push({
					OptionA : "Try to find a way to make the situation fit with my plans",
					OptionB : "Instinctively adjust my plans to fit the changed situation"

				});

		temperamentQuestionnaire4.push({
			OptionA : "I prefer to follow a schedule",
			OptionB : "I prefer to go with the flow"

		});

		temperamentQuestionnaire4
				.push({
					OptionA : "I am happier when things are settled",
					OptionB : "I am happier with more information before settling things"

				});

		temperamentQuestionnaire4.push({
			OptionA : "I see through to completion",
			OptionB : "Reconsider things if there are unforeseen circumstances"

		});

		temperamentQuestionnaire4.push({
			OptionA : "I prefer to arrange parties in advance",
			OptionB : "I do what seems most appropriate when the time comes"

		});

		temperamentQuestionnaire4.push({
			OptionA : "I find it nice to be able to plan accordingly",
			OptionB : "I find it unduly constraining to be tied down"

		});

		return temperamentQuestionnaire4;
	}

}
