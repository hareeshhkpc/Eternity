function IMT_HEARSMART_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.createImtHeartUI = createImtHeartUI;
	this.getLookupValuesForIntimaMediaThickness = getLookupValuesForIntimaMediaThickness;
	this.getLookupValuesForPlaqueCharacter = getLookupValuesForPlaqueCharacter;
	this.getLookupValuesForPercentStenosis = getLookupValuesForPercentStenosis;

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
			thisObject.createImtHeartUI(message);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function getLookupValuesForIntimaMediaThickness() {
		var intimaMediaThickness = new Array();

		intimaMediaThickness.push("Normal");
		intimaMediaThickness.push("Mild");
		intimaMediaThickness.push("Moderate");
		intimaMediaThickness.push("Significant");
		intimaMediaThickness.push("Critical Significant");

		return intimaMediaThickness;
	}

	function getLookupValuesForPlaqueCharacter() {
		var plaqueCharacter = new Array();

		plaqueCharacter.push("None Observed");
		plaqueCharacter.push("Early Buildup");
		plaqueCharacter.push("Calcified");
		plaqueCharacter.push("Mixed");
		plaqueCharacter.push("Soft");

		return plaqueCharacter;
	}

	function getLookupValuesForPercentStenosis() {
		var percentStenosis = new Array();

		percentStenosis.push("None Observed");
		percentStenosis.push("Nominal");
		percentStenosis.push("Less than 30%");
		percentStenosis.push("Between 30%-50%");
		percentStenosis.push("Greater than 50%");

		return percentStenosis;
	}

	function createImtHeartUI(message) {

		var intima = thisObject.getLookupValuesForIntimaMediaThickness();
		var character = thisObject.getLookupValuesForPlaqueCharacter();
		var stenosis = thisObject.getLookupValuesForPercentStenosis();

		var intimaHtml = "";
		var characterHtml = "";
		var stenosisHtml = "";

		intimaHtml += '<div isEditor="true" pathFields="component2,observationEvent[1]" tagName="text" editorLabel="Normal"dataType="ED" editorType="EDSingleBoolean" idSuffix="1" configParams="[{name:\'param1\',value:\''
				+ intima[0]
				+ '\'},{name:\'param2\',value:\''
				+ intima[1]
				+ '\'},{name:\'param3\',value:\''
				+ intima[2]
				+ '\'},{name:\'param4\',value:\''
				+ intima[3]
				+ '\'},{name:\'param5\',value:\'' + intima[4] + '\'}]"></div>'
				

				characterHtml += '<div isEditor="true" pathFields="component2,observationEvent[2]" tagName="text" editorLabel="Mild"	dataType="ED" editorType="EDSingleBoolean" idSuffix="2"	configParams="[{name:\'param1\',value:\''
				+ character[0]
				+ '\'},{name:\'param2\',value:\''
				+ character[1]
				+ '\'},{name:\'param3\',value:\''
				+ character[2]
				+ '\'},{name:\'param4\',value:\''
				+ character[3]
				+ '\'},{name:\'param5\',value:\''
				+ character[4]
				+ '\'}]"></div>';		
		


				stenosisHtml += '<div isEditor="true" pathFields="component2,observationEvent[3]" tagName="text" editorLabel="Moderate" dataType="ED" editorType="EDSingleBoolean" idSuffix="3" configParams="[{name:\'param1\',value:\''
				+ stenosis[0]
				+ '\'},{name:\'param2\',value:\''
				+ stenosis[1]
				+ '\'},{name:\'param3\',value:\''
				+ stenosis[2]
				+ '\'},{name:\'param4\',value:\''
				+ stenosis[3]
				+ '\'},{name:\'param5\',value:\''
				+ stenosis[4]
				+ '\'}]"></div>';

		$("#inner-uiform-" + message.id).find("#intimaMediaThickness").html(intimaHtml);
		$("#inner-uiform-" + message.id).find("#plaqueCharacter").html(characterHtml);
		$("#inner-uiform-" + message.id).find("#percentStenosis").html(stenosisHtml);
		
		
		if (message.messageAndUIBinder) {
			var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
			message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
		}
	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

};