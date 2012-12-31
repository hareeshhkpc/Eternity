function MCG_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	
	this.getSecondaryUI = getSecondaryUI;
	this.getSecondaryResults = getSecondaryResults;
	this.getTertiaryUI = getTertiaryUI;
	this.getTertiaryResults = getTertiaryResults;
	this.mcgUploadHandler = mcgUploadHandler;
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;

	function initialize() {

		try {
			// alert("initialize");
			
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.mcgUploadHandler);
			}
			

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;
	function getSecondaryUI(message) {
		var secondaryList = getSecondaryResults();
		var htmlFragment = '';
		$.each(secondaryList,function(index, list) {
						
			htmlFragment += '<fieldset class="ui-grid-b"><div class="ui-block-a" style="width:7%;position:relative" isEditor="true" editorLabel="'+list+'" idSuffix="'
			+ (index + 5)
			+ '" pathFields="component2,observationEvent['
			+ (index + 5)
			+ ']" tagName="id" dataType="ED" editorType="EDCheckBox"></div><div isEditor="true" style="width:90%"  class="ui-block-b" editorLabel="'+list+'" idSuffix="'
			+ (index + 5)
			+ '"pathFields="component2,observationEvent['
			+ (index + 5)
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"></div></fieldset>'
	});

		$("#inner-uiform-" + message.id).find("#SecondaryResults").append(htmlFragment);
		
		
		
	};

	function getTertiaryUI(message) {
		var tertiaryList = getTertiaryResults();
		var htmlFragment = '';
		$.each(tertiaryList,function(index, list) {
			
				htmlFragment += '<fieldset class="ui-grid-b"><div class="ui-block-a" style="width:7%;position:relative" isEditor="true" editorLabel="'+list+'" idSuffix="'
				+ (index + 14)
				+ '" pathFields="component2,observationEvent['
				+ (index + 14)
				+ ']" tagName="id" dataType="ED" editorType="EDCheckBox"></div><div style="width:90%" isEditor="true" class="ui-block-b" editorLabel="'+list+'" idSuffix="'
				+ (index + 14)
				+ '"pathFields="component2,observationEvent['
				+ (index + 14)
				+ ']" tagName="code" dataType="CD" editorType="CDLabel"></div></fieldset>'
				});
		
		$("#inner-uiform-" + message.id).find("#TertiaryResults").append(htmlFragment);
		
		//thisObject.message.messageAndUIBinder.parentContainerID ="TertiaryResults"; 
		  
		
		/*
		 * thisObject.message.messageAndUIBinder.parentContainerID =
		 * "TertiaryResults"; var lookupHandler =
		 * thisObject.appController.getComponent("DataLayer").lookupHandler;
		 * thisObject.message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
		 */
};


	function getSecondaryResults() {
		var secondaryArray = new Array();
		secondaryArray.push("Myocardial Damage");
		secondaryArray.push("Ventricular Hypertrophy");
		secondaryArray.push("Cardiomyopathy");
		secondaryArray.push("Pulmonary Heart Disease");
		secondaryArray.push("Fibrillation (likely atrial).");
		secondaryArray.push("Ventricular arrhythmia.");
		secondaryArray.push("Myocarditis or Myocardial Inflammation");
		secondaryArray.push("Rheumatic Heart Disease or remnants thereof");
		secondaryArray.push("Congenital Heart Disease or remnants thereof");
		return secondaryArray;
	};

	function getTertiaryResults() {
		var tertiaryArray = new Array();
		tertiaryArray.push("Myocardial remodeling");
		tertiaryArray
				.push("Decreased myocardial compliance. Likely causes include ischemia, ventricular hypertrophy, increased afterload, systemic hypertension");
		tertiaryArray
				.push("Increased myocardial compliance. Likely causes include ischemia, myocarditis, structural anomalies, cardiomyopathy");
		tertiaryArray
				.push("Decreased cardiac output reflected by decreased ejection fraction.");
		tertiaryArray.push("Bradycardia");
		tertiaryArray.push("Tachycardia");
		tertiaryArray
				.push("Acute Power Failure. Likely conditions are ischemia heart disease, pump failure, supply and demand imbalance.");
		tertiaryArray.push("Global asynchrony");
		tertiaryArray.push("Regional or localized asynchrony");
		return tertiaryArray;
	};

	function onLoad(callback) {

		try {
			// alert("onLoad");
			thisObject.getSecondaryUI(message);
			thisObject.getTertiaryUI(message);
			var ecgFragment    = '';
			var localFragment  = ''; 
			var globalFragment = '';
			var scoreFragment  = '';
			ecgFragment +=' <div isEditor="true" id="ECGQualityEditor"  editorLabel="ECG Quality" pathFields="component2,observationEvent[1]" '
						+'tagName="text" dataType="ED" editorType="EDComboBox" idSuffix="1"'
						+' configParams="[{name:\'conceptClass\',value:\'ecgQuality\'},{name:\'lookupType\',value:\'static\'},'
						+'{name:\'lookupSelectType\',value:\'single\'},{name:\'lookupControl\',value:\'multiple\'}]"></div>'
						
				$("#inner-uiform-" + message.id).find('#ECGQuality').append(ecgFragment);
			
			  localFragment +='<div isEditor="true" id="localEditor" editorLabel="Local" idSuffix="1" pathFields="component2,observationEvent[2]"'
				  			+'tagName="text" dataType="ED" editorType="EDTextBox" ></div>'
			
				 $("#inner-uiform-" + message.id).find('#local').append(localFragment);
			  
			  globalFragment += '<div isEditor="true" id="globalEditor"  editorLabel="Global" idSuffix="1" pathFields="component2,observationEvent[3]"'
				  			+'tagName="text" dataType="ED" editorType="EDTextBox"></div>'
				  			
				 $("#inner-uiform-" + message.id).find('#global').append(globalFragment);
			  
			  scoreFragment +=' <div isEditor="true" id="scoreEditor"  editorLabel="Score" idSuffix="1" pathFields="component2,observationEvent[4]"'
				  			+' tagName="text" dataType="ED" editorType="EDTextBox" ></div>'
				  			
				$("#inner-uiform-" + message.id).find('#score').append(scoreFragment);
			 	
					
			  var lookupHandler = thisObject.appController.getComponent("DataLayer").lookupHandler;
			  thisObject.message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
			  
			 
			  var patientId = appController.getComponent("Context").getPatient();
				$('#patientId').attr("value",patientId);  
			
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	};
	
	function mcgUploadHandler(extractedValues){
		
		try {
			eval('var data=' + extractedValues);
		} catch (error) {
			console.log("Invalid JSON extractedValues from the  MCG: "+ extractedValues);
			return;
		}
		
		try{
			$.each(data,function(key,value){
				label  = value.name;
				result = value.value;
				if(label){
					label = $.trim(label);
				}
				
				if(label == 'ECG Quality'){
					var editorObj = thisObject.messageAndUIBinder.geteditor('ECGQualityEditor');
				    var field = editorObj.getField('EDComboBox1');
				
				    field.find('option').each(function(key,option){
				    	if($(option).html() == result){
				    		$(option).attr("selected", "selected");
				    		 field.selectmenu('refresh', true);
				    		 field.trigger('change');
				    	}
				    });
				    
				    
				    
				}else if (label == 'Local'){
					var editorObj = thisObject.messageAndUIBinder.geteditor("localEditor");
					var field = editorObj.getField("EDDisplayValue1");
					field.val(result).trigger('change');
				}else if(label == 'Global'){
					var editorObj = thisObject.messageAndUIBinder.geteditor("globalEditor");
					var field = editorObj.getField("EDDisplayValue1");
					field.val(result).trigger('change');
				}else if(label == 'Score'){
					var editorObj = thisObject.messageAndUIBinder.geteditor("scoreEditor");
					var field = editorObj.getField("EDDisplayValue1");
					field.val(result).trigger('change');
				}
			});
		}catch(jsonError){
			console.log("error in iterating over the extracted values in MCG: " + jsonError);
		}	
	};

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	};

};