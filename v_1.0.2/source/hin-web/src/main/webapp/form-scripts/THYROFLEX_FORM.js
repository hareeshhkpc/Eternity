function THYROFLEX_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.getHypoDetails = getHypoDetails;
	this.getHyperDetails = getHyperDetails; 
	this.createThyrofelxUI = createThyrofelxUI;
	this.calculateTotal = calculateTotal;
	
	this.thyroflexLookUp = new Array();
	this.conceptAttr = new Array();
	this.finalHypoTotal = "";
	this.finalHyperTotal = "";
	this.noSymptoms = "";
	this.mild = "";
	this.moderate = "";
	this.severe = "";

	function initialize() {

		try {
			// alert("initialize");
			/*
			 * thyroflexLookUp.push([ data.json[i].name,
			 * data.json[i].conceptAttributes, data.json[i].description]);
			 */
			thisObject.thyroflexLookUp.push(["thyroflex_No_symptoms","0","No symptoms"]);
			thisObject.thyroflexLookUp.push(["thyroflex_Mild_symptoms","1","Mild symptoms"]);
			thisObject.thyroflexLookUp.push(["thyroflex_Moderate_symptoms","2","Moderate symptoms"]);
			thisObject.thyroflexLookUp.push(["thyroflex_Severe_symptoms","3","Severe symptoms"]);

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");
			thisObject.createThyrofelxUI(message);
			
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value", patientId);
			

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}
	}
	;
	
	function getHypoDetails(){
		var hypoQuestions = new Array();
		
		hypoQuestions.push("Tiredness & Sluggishness,lethargic");
		hypoQuestions.push("Drying Hair or Skin(Thick,Dry,scaly)");
		hypoQuestions.push("Sleep more than usual");
		hypoQuestions.push("Weaker Muscles");
		hypoQuestions.push("Constant feeling of cold(fingers/hands/feel)");
		hypoQuestions.push("Frequent Muscule Cramps");
		hypoQuestions.push("Poorer Memory");
		hypoQuestions.push("More Depressed(mood change easily)");
		hypoQuestions.push("Slower Thinking");
		hypoQuestions.push("Puffier Eyes");
		hypoQuestions.push("Difficulty with Math");
		hypoQuestions.push("Hoarser or Deeper Voice");
		hypoQuestions.push("Constipation");
		hypoQuestions.push("Coarse Hair/Hair loss/brittle");
		hypoQuestions.push("Muscle /Joint Pain");
		hypoQuestions.push("Low Sex Drive/Impotence");
		hypoQuestions.push("Puffy Hands and Feet");
		hypoQuestions.push("Unsteady Gall(bump into things)");
		hypoQuestions.push("Gain Weight Easy");
		hypoQuestions.push("Outer Third of Eyebrows Thin");
		hypoQuestions.push("Menses More irregular(should be 28 Days)");
		hypoQuestions.push("Havier Menses(clotting/3+days)");
		hypoQuestions.push("Carpel Tunnel Syndrome");
		
		return hypoQuestions;
	};
	
	function getHyperDetails(){
		var hyperQuestions = new Array();
		
		hyperQuestions.push("Tachycardia(Rapid or irregular heart beat)");
		hyperQuestions.push("Palpitations(Skipping of heart beat)");
		hyperQuestions.push("Insomnia");
		hyperQuestions.push("Shakiness");
		hyperQuestions.push("Increased sweating");
		hyperQuestions.push("Brittle Nails");
		hyperQuestions.push("Loss of Appetite");
		
		return hyperQuestions;
	};
	
	function createThyrofelxUI(message){
		//alert("in meth");
		var hypoQuestions = thisObject.getHypoDetails();
		var hyperQuestions = thisObject.getHyperDetails();
		var lookups= new Array();
		
		$.each(thisObject.thyroflexLookUp,function(index,value){
			lookups.push(value[0]);
			lookups.push(value[2]);
			thisObject.conceptAttr.push(value[1]);
		});
		
		
		
		var hypoHtml = "";
		var hyperHtml = "";
		
		$.each(hypoQuestions, function(index,hypoQuestion){
			
			hypoHtml += '<div class="ui-block-a" style="width:50%"><div isEditor="true" editorLabel="'
					+ hypoQuestion
					+ '" pathFields="component2['
					+ (index + 1)
					+ '],observationEvent"  tagName="code" dataType="CD" editorType="CDLabel" idSuffix="'
					+ (index + 1)
					+ '"></div></div><div class="ui-block-b" style="width:25%"><div isEditor="true" editorLabel="" pathFields="component2['
					+ (index + 1)
					+ '],observationEvent"tagName="value" dataType="PQ" editorType="PQInplaceCombo" idSuffix="'
					+ (index + 1) + '"  configParams="[{name:\''+lookups[0]+'\',value:\''+lookups[1]+'\'},{name:\''+lookups[2]+'\',value:\''+lookups[3]+'\'},{name:\''+lookups[4]+'\',value:\''+lookups[5]+'\'},{name:\''+lookups[6]+'\',value:\''+lookups[7]+'\'}]"></div></div>'
		});
		
		var hypolength = hypoQuestions.length+1;
		$.each(hyperQuestions,function(key,hyperQuestion){
				hyperHtml += '<div class="ui-block-a" style="width:50%"><div isEditor="true" editorLabel="'
						+ hyperQuestion
						+ '" pathFields="component2['
						+ (hypolength + key + 1)
						+ '],observationEvent"  tagName="code" dataType="CD" editorType="CDLabel" idSuffix="'
						+ (hypolength + key + 1)
						+ '"></div></div><div class="ui-block-b" style="width:25%"><div isEditor="true" editorLabel="" pathFields="component2['
						+ (hypolength + key + 1)
						+ '],observationEvent" tagName="value" dataType="PQ" editorType="PQInplaceCombo" idSuffix="'
						+ (hypolength + key + 1) + '" configParams="[{name:\''+lookups[0]+'\',value:\''+lookups[1]+'\'},{name:\''+lookups[2]+'\',value:\''+lookups[3]+'\'},{name:\''+lookups[4]+'\',value:\''+lookups[5]+'\'},{name:\''+lookups[6]+'\',value:\''+lookups[7]+'\'}]"></div></div>'
		});
		
		$("#inner-uiform-" + message.id).find('#HypoScore').html(hypoHtml);
		$("#inner-uiform-" + message.id).find('#HyperScore').html(hyperHtml);
		
		if (message.messageAndUIBinder) {
			//alert("in call");
			var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
			message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
		}
		
		$("#inner-uiform-" + message.id).find('[type="multiple"]').unbind("change",function() {
			
		});

		$("#inner-uiform-" + message.id).find('[type="multiple"]').bind("change",function() {
				thisObject.calculateTotal(message.id);
		});
		
	};
	

	function calculateTotal(messageID) {
		// alert("combo changed");
	
	 var hypoTotal = 0; 
	 var hyperTotal = 0; 
	 var hypoContent = $("#inner-uiform-" + messageID).find('#HypoScore'); 
	 var hyperContent =	 $("#inner-uiform-" + messageID).find('#HyperScore');
	 
	 
	 var thyroflex_No_symptoms = parseInt(thisObject.conceptAttr[0]);
	 var thyroflex_Mild_symptoms = parseInt(thisObject.conceptAttr[1]);
	 var thyroflex_Moderate_symptoms = parseInt(thisObject.conceptAttr[2]);
	 var thyroflex_Severe_symptoms = parseInt(thisObject.conceptAttr[3]);
	  
	 
	  
	 
	 $(hyperContent).find('[type="multiple"]').each(function(key, value) { 
		  if($(value).val()) { 
			  var comboValue = $(value).val();
	         // hyperTotal += content;
	  
		  if (comboValue == 'thyroflex_No_symptoms') { 
			  hyperTotal += thyroflex_No_symptoms; 
		} 
		  else if (comboValue =='thyroflex_Mild_symptoms') { 
			  hyperTotal += thyroflex_Mild_symptoms; 
		} 
		  else if(comboValue == 'thyroflex_Moderate_symptoms') { 
			  hyperTotal += thyroflex_Moderate_symptoms; 
		} 
		  else if (comboValue == 'thyroflex_Severe_symptoms') { 
			  hyperTotal += thyroflex_Severe_symptoms; 
		  }
	  }
	  
	  });
	 
	 
	 $(hypoContent).find('[type="multiple"]').each(function(key, value) { 
		  if($(value).val()) { 
			  var comboValue = $(value).val();
	         // hyperTotal += content;
	  
		  if (comboValue == 'thyroflex_No_symptoms') { 
			  hypoTotal += thyroflex_No_symptoms; 
		} 
		  else if (comboValue =='thyroflex_Mild_symptoms') { 
			  hypoTotal += thyroflex_Mild_symptoms; 
		} 
		  else if(comboValue == 'thyroflex_Moderate_symptoms') { 
			  hypoTotal += thyroflex_Moderate_symptoms; 
		} 
		  else if (comboValue == 'thyroflex_Severe_symptoms') { 
			  hypoTotal += thyroflex_Severe_symptoms; 
		  }
	  }
	  
	  });
	 
	  $("#inner-uiform-" + messageID).find('#PQInplaceDisplayValue24').attr('value', hypoTotal);
	  $("#inner-uiform-" +messageID).find('#PQInplaceDisplayValue24').trigger('change');
	  
	  $("#inner-uiform-" +messageID).find('#PQInplaceDisplayValue32').attr('value', hyperTotal);
	  $("#inner-uiform-" +messageID).find('#PQInplaceDisplayValue32').trigger('change');
	 

	};

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

};