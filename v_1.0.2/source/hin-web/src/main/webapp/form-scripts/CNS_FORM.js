function CNS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.onLoadComplete_CNS = onLoadComplete_CNS;
	this.cnsUploadHandler = cnsUploadHandler;
	this.createConfiguration = createConfiguration;
	this.cnsConfiguration = new HIN.HashMap();
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;

	function initialize() {

		try {
			// alert("initialize");
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.cnsUploadHandler);
			}
			
			thisObject.createConfiguration();

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			// alert("onLoad");
			thisObject.onLoadComplete_CNS(message.messageType, message)
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value", patientId);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onLoadComplete_CNS(messageType, message) {

		$('#inner-uiform-' + message.id).find(".ui-cns-header").unbind('click',
				toggleTests);
		$('#inner-uiform-' + message.id).find(".ui-cns-header").bind('click',
				toggleTests);

		function toggleTests() {

			var blockId = $(this).attr("blockId");
			// $('#inner-uiform-' + message.id).find("#"+blockId).toggle();
			var display = null;
			if ($('#inner-uiform-' + message.id).find("#" + blockId).css(
					"display") == "none") {
				display = $('#inner-uiform-' + message.id).find("#" + blockId)
						.css("display");
			} else if ($('#inner-uiform-' + message.id).find("#" + blockId)
					.css("display") == "block") {
				display = $('#inner-uiform-' + message.id).find("#" + blockId)
						.css("display");
			}

			$('#inner-uiform-' + message.id).find(".ui-cns-block").css(
					"display", "none");
			if (display == "none") {
				$('#inner-uiform-' + message.id).find("#" + blockId).css(
						"display", "block");
			} else if (display == "block") {
				$('#inner-uiform-' + message.id).find("#" + blockId).css(
						"display", "none");
			}
		}

		var lookUps = this.appController
				.getComponent("DataLayer")
				.loadAllConceptServices(
						"CNSscroreStd",
						function(data) {
							var lookUps = [];
							for (i in data.json) {
								for (j in data.json[i].conceptAttributes) {
									if (data.json[i].conceptAttributes[j].key == "standard") {
										lookUps
												.push({
													name : data.json[i].name,
													value : data.json[i].conceptAttributes[j].value
												});
									}
								}
							}

							$(lookUps).each(
									function(index, concept) {
										// alert("name: "+concept.name+"
										// attr:"+concept.value);
										$('#inner-uiform-' + message.id).find(
												'[concept="' + concept.name
														+ '"]').attr("value",
												concept.value);
									});

							$('#inner-uiform-' + message.id)
									.find(".cns-header")
									.each(
											function(index, header) {
												var headerName = $(header)
														.html();
												var blockId = $(header).attr(
														"blockId");
												$('#inner-uiform-' + message.id)
														.find("#" + blockId)
														.find(".component")
														.each(
																function(index,
																		component) {
																	$(component)
																			.find(
																					"#IIextension")
																			.attr(
																					"value",
																					headerName);
																	$(component)
																			.find(
																					"#IIroot")
																			.attr(
																					"value",
																					"TEST_NAME");
																});
											});

							$('#inner-uiform-' + message.id)
									.find(".component")
									.each(
											function(index, comp) {
												var compId = index + 1;
												$(".component" + compId).find(
														'#PQInplaceDisplayValue'
																+ compId)
														.unbind("change",
																triggerChange);
												$(".component" + compId).find(
														'#PQInplaceDisplayValue'
																+ compId)
														.bind("change",
																triggerChange);
												function triggerChange() {
													$(".component" + compId)
															.find('label')
															.each(
																	function() {
																		if ($(
																				this)
																				.attr(
																						"id") !== "CDLabelEditorLabel"
																				+ compId) {
																			$(
																					this)
																					.trigger(
																							'change');
																		}
																	});
													$(".component" + compId)
															.find(
																	'input[type="text"]')
															.each(
																	function() {
																		if ($(
																				this)
																				.attr(
																						"id") !== "PQInplaceDisplayValue"
																				+ compId) {
																			$(
																					this)
																					.trigger(
																							'change');
																		}
																	});
												}
											});
						});
	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function cnsUploadHandler(extractedValues) {
		//alert("extractedValues:" + extractedValues);
		try {
			eval('var data=' + extractedValues);
		} catch (error) {
			console.log("Invalid JSON extractedValues from the  CNS: "+ extractedValues);
			return;
		}

		try{
			$.each(data, function(key, value) {
				var resultsList = new Array();
				var label = value.name;
				var result = value.value;
				if (label) {
					label = $.trim(label);
				}
				if (result) {
					resultsList = result.split(" ");
	
				}
	
				var formIdObj = thisObject.cnsConfiguration.get(label);
				if (typeof (formIdObj) === 'object' && formIdObj != null) {
					formId = thisObject.cnsConfiguration.get(label).value;
					//alert("formId:" + formId);
					if (formId) {
						var idSuffix = $("#inner-uiform-" + message.id).find(
								'#' + formId).attr('idSuffix');
						// alert("idSuffix:"+idSuffix);
						var score = resultsList[0];
						var standard = resultsList[1];
						var percentile = resultsList[2];
	
						//alert("formId" + formId + " idSuffix:"+ idSuffix+" score:"+score+" standard:"+standard+" percentile:"+percentile);
	
						var editorObj = thisObject.messageAndUIBinder
								.geteditor("score" + idSuffix);
						var field = editorObj.getField('PQInplaceDisplayValue'
								+ idSuffix);
						field.val(score).trigger('change');
	
						
						 var editorObj =thisObject.messageAndUIBinder.geteditor("standard"+idSuffix);
						 var field =editorObj.getField('PQInplaceDisplayValueStandard'+idSuffix);
						 field.val(standard).trigger('change');
						 
						 var editorObj =thisObject.messageAndUIBinder.geteditor("percentile"+idSuffix);
						 var field =editorObj.getField('PQInplaceDisplayValuePercentile'+idSuffix);
						 field.val(percentile).trigger('change');
						 
					}
				}
	
			});
		}catch(jsonError){
			console.log("error in iterating over the extracted values in CNS: " + jsonError);
		}	
			

	}
	;

	function createConfiguration() {

		// key: name coming from dataBase & value is the id in the form
		// PAGE 0
		thisObject.cnsConfiguration.put('Neurocognitive Index (NCI)',
				"NeurocognitiveIndex");
		thisObject.cnsConfiguration.put('Composite Memory', "CompositeMemory");
		thisObject.cnsConfiguration.put('Verbal Memory', "VerbalMemory");
		thisObject.cnsConfiguration.put('Visual Memory', "VisualMemory");
		thisObject.cnsConfiguration
				.put('Psychomotor Speed', "PsychomotorSpeed");
		thisObject.cnsConfiguration.put('Reaction Time*', "ReactionTime");
		thisObject.cnsConfiguration.put('Complex Attention*',
				"ComplexAttention");
		thisObject.cnsConfiguration.put('Cognitive Flexibility',
				"CognitiveFlexibility");
		thisObject.cnsConfiguration.put('Processing Speed', "ProcessingSpeed");
		thisObject.cnsConfiguration.put('Executive Functioning',
				"ExecutiveFunctioning");
		thisObject.cnsConfiguration.put('Correct Hits - ImmediateVBM',
				"CorrectHitsImmediateVBM");
		thisObject.cnsConfiguration.put('Correct Passes - ImmediateVBM',
				"CorrectPassesImmediateVBM");
		thisObject.cnsConfiguration.put('Correct Hits - DelayVBM',
				"CorrectHitsDelayVBM");
		thisObject.cnsConfiguration.put('Correct Passes - DelayVBM',
				"CorrectPassesDelayVBM");
		thisObject.cnsConfiguration.put('Correct Hits - ImmediateVSM',
				"CorrectHitsImmediateVSM");
		thisObject.cnsConfiguration.put('Correct Passes - ImmediateVSM',
				"CorrectPassesImmediateVSM");
		thisObject.cnsConfiguration.put('Correct Hits - DelayVSM',
				"CorrectHitsDelayVSM");
		thisObject.cnsConfiguration.put('Correct Passes - DelayVSM',
				"CorrectPassesDelayVSM");
		thisObject.cnsConfiguration.put('Right Taps Average',
				"RightTapsAverage");
		thisObject.cnsConfiguration.put('Left Taps Average', "LeftTapsAverage");
		thisObject.cnsConfiguration
				.put('Correct ResponsesSDC', "CorrectResponsesSDC");
		thisObject.cnsConfiguration.put('Errors*SDC', "ErrorsSDC");
		thisObject.cnsConfiguration.put('Simple Reaction Time*',
				"SimpleReactionTime");
		thisObject.cnsConfiguration.put('Complex Reaction Time Correct*',
				"ComplexReactionTimeCorrect");
		thisObject.cnsConfiguration.put('Stroop Reaction Time Correct*',
				"StroopReactionTimeCorrect");
		thisObject.cnsConfiguration.put('Stroop Commission Errors*',
				"StroopCommissionErrors");

		// PAGE 1
		thisObject.cnsConfiguration.put('Correct ResponsesSAAT',
				"CorrectResponsesSAAT");
		thisObject.cnsConfiguration.put('Errors*SAAT', "ErrorsSAAT");
		thisObject.cnsConfiguration.put('Correct Reaction Time*SAAT',
				"CorrectReactionTimeSAAT");
		thisObject.cnsConfiguration.put('Correct ResponsesCPT',
				"CorrectResponsesCPT");
		thisObject.cnsConfiguration.put('Omission Errors*CPT',
				"OmmissionErrorsCPT");
		thisObject.cnsConfiguration.put('Commission Errors*CPT',
				"CommissionErrorsCPT");
		thisObject.cnsConfiguration.put('Choice Reaction Time Correct*',
				"ChoiceReactionTimeCorrect");

	}
	;

};