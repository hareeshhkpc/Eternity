function ENVIRONMENT_QUESTIONNAIRE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	
	this.getEnvironmentquestionnaireString = getEnvironmentquestionnaireString;
	this.loadEnvironment = loadEnvironment;
	this.getEnvironmentQuestionnaire = getEnvironmentQuestionnaire;
	this.loadEnvironmentQuestionnaire = loadEnvironmentQuestionnaire;
	this.getTotal = getTotal;

	function initialize() {

		try {
			//thisObject.loadEnvironmentQuestionnaire();
		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			thisObject.loadEnvironmentQuestionnaire();
			var lookupHandler = thisObject.appController.getComponent("DataLayer").lookupHandler;
	           thisObject.message.messageAndUIBinder.loadDataOntoForm(lookupHandler);

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
		function loadEnvironmentQuestionnaire() {
			var questionnaireString = getEnvironmentquestionnaireString();
			var questionnaireArray = getEnvironmentQuestionnaire();
			var totalArray = "";
			var color = "";
			$(questionnaireArray).each(
					function(index, question) {
						if (index == 0) {
							$('#mainEnvironment').append(questionnaireString);
						}
						if (index % 2 == 0) {
							color = "#FFFFFF";
						} else {
							color = "#F2F2F2";
						}
						var questionnaire = loadEnvironment(index + 1,
								question, color);
						$('#mainEnvironment').append(

						questionnaire);
						$('.environmentQuetionaireRadioYes').change(function() {
							getTotal(questionnaireArray.length);
						});

					});
			totalArray += '<div class="envTotal">TOTAL</div>';
			totalArray += '<div class="envTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[21]" tagName="value" dataType="ED" editorType="EDTextBox"  idSuffix="environment21"></div>';
			totalArray += '<div class="envTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[22]" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="environment22"></div>';

			$("#mainEnvironment").append(totalArray);
		}
		function getEnvironmentquestionnaireString() {
			var questionnaireString = "";
			questionnaireString += '<div>';
			questionnaireString += '<div class="environmentHead">IV-LR-ENVIRONMENT</div>';
			questionnaireString += '<div class="environmentBreak"></div>';
			questionnaireString += '<div class="envHistory">HISTORY</div>';
			return questionnaireString;
		}
		function loadEnvironment(index, question, color) {
			var questionnaire = "";
			questionnaire += '<table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%"><div class="environmentQuetionaireNumber" style="background-color: '
					+ color + ';" >' + index + '</div></td>';
			questionnaire += '<td style="width:65%;"><div class="environmentQuetionaireTable" style="background-color: '
					+ color
					+ ';" isEditor="true" editorLabel="'
					+ question
					+ '" pathFields="component,structuredBody,component,section,entry,observation['
					+ index
					+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="environment'
					+ index + '"></div></td>';
			questionnaire += '<td style="width:25%;"><div class="environmentQuetionaireRadioYes" style="background-color: '
					+ color
					+ ';" isEditor="true" editorLabel="" pathFields="component,structuredBody,component,section,entry,observation['
					+ index
					+ ']" idSuffix="environment'
					+ index
					+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></td></tr></table>';
			return questionnaire;
		}

		function getEnvironmentQuestionnaire() {
			var environmentArray = new Array();
			environmentArray
					.push("I live away from a city full of noise and pollution");
			environmentArray.push("I don't live near power lines");
			environmentArray.push("I have plenty of fresh air and sunshine");
			environmentArray.push("I drink and bathe in pure water");
			environmentArray.push("I eat mostly organic fruits and vegetables");
			environmentArray
					.push("I avoid chemicals like insecticides and cleaners");
			environmentArray.push("I do not use aluminum cookware");
			environmentArray.push("I avoid smoking and recreational drugs");
			environmentArray
					.push("I minimize taking any over the counter drugs");
			environmentArray.push("I use alcohol moderately");
			environmentArray
					.push("I use natural soaps, underarm deodorants and toothpastes");
			environmentArray
					.push("I recycle and conserve water, electricity, etc...");
			environmentArray.push("I take no pharmaceutical drugs");
			environmentArray
					.push("I honor other life forms-animals, birds, etc...");
			environmentArray.push("I use biodegradable products");
			environmentArray.push("I avoid electro-magnetic radiation");
			environmentArray.push("I avoid eating packaged foods");
			environmentArray
					.push("I live in an environmentally conscious city");
			environmentArray.push("I do not drink sodas");
			environmentArray
					.push("I recognize the importance of a healthy community");
			return environmentArray;
		}

		function getTotal(size) {
			var yesCount = 0;
			var noCount = 0;
			for (i = 1; i <= size; i++) {
				if ($("input[id='radioEditor1environment" + i + "']:checked")
						.val() == 1) {

					yesCount += 1;
				}
				if ($("input[id='radioEditor2environment" + i + "']:checked")
						.val() == 0) {
					noCount += 1;
				}
			}
			
			 
			$("#EDDisplayValueenvironment21").val(yesCount);
			$("#EDDisplayValueenvironment21").trigger('change');
			$("#EDDisplayValueenvironment22").val(noCount);
			$("#EDDisplayValueenvironment22").trigger('change');
		}
	
};