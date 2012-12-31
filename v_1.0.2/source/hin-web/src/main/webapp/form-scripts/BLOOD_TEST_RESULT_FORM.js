function BLOOD_TEST_RESULT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.createUI = createUI;

	this.bloodTestLookUp = new Array();
	this.currentTest = "";
	// this.patientId = "";
	this.unit = "";
	this.refRange = "";
	this.unitArray = [];
	this.refRangeArray = [];
	this.fillData = fillData;
	this.sortedTests = new Array();
	this.bloodTestLabelList = new HIN.HashMap();
	this.bloodTestConfiguration = new HIN.HashMap();
	this.keyCheckList = new Array();
	this.bloodTestuploadHandler =bloodTestuploadHandler;
	this.createConfiguration = createConfiguration;
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;
	
	function initialize() {

		try {
			// alert("initialize");

			var messageTitle = XmlUtil
					.getXPathResult(
							message.message,
							"//POLB_MT004000HT01_BloodTest/id[root='MSG_TITLE']/extension",
							XPathResult.STRING_TYPE);

			messageTitle = (messageTitle && messageTitle.stringValue) ? messageTitle.stringValue
					: "";
			
			messageTitle = $.trim(messageTitle);

			if (messageTitle == "Female Age Management Blood Panel") {
				thisObject.currentTest = 'FemaleAgeManagementBloodPanel'
			} 
			else if (messageTitle == "Male Age Management Blood Panel") {
				thisObject.currentTest = 'MaleAgeManagementBloodPanel';
			} 
			else if (messageTitle == "AMP Female Follow Up Panel") {
				thisObject.currentTest = 'AMP_Female_Follow_Up_Panel';
			} 
			else if (messageTitle == "AMP Male Follow Up Panel") {
				thisObject.currentTest = 'AMP_Male_Follow_Up_Panel';
			} 
			else if (messageTitle == "Female Hormone Panel") {
				thisObject.currentTest = 'FemaleHormonePanel';
			} 
			else if (messageTitle == "Male Hormone Panel") {
				thisObject.currentTest = 'MaleHormonePanel';
			} 
			else if (messageTitle == "AMP USA Female Panel") {
				thisObject.currentTest = 'AMP_USA_Female_Panel';
			} 
			else if (messageTitle == "AMP USA Male Panel") {
				thisObject.currentTest = 'AMP_USA_Male_Panel';
			} 
			else {
				thisObject.currentTest = null;
				console.log("in bloodTest Form: concept not found:"+messageTitle+":");
			}
			
			thisObject.createConfiguration();

			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value", patientId);
			
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.bloodTestuploadHandler);
			}
			
			

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			 //alert("onLoad");
			if(thisObject.currentTest){
				this.appController.getComponent("DataLayer")
						.loadAllConceptServices(
								thisObject.currentTest,
								function(data) {
	
									for (i in data.json) {
										thisObject.bloodTestLookUp.push([
												data.json[i].name,
												data.json[i].description,
												data.json[i].conceptAttributes ]);
									}
	
									thisObject.createUI(thisObject.bloodTestLookUp,
											message);
								}, null);
			}

			/*
			 * var patientId =
			 * appController.getComponent("Context").getPatient();
			 * $('#patientId').attr("value",patientId);
			 */

		} catch (error) {
			alert("Error in bloodTest form onLoad  script: " + error);
		}

	}
	;

	function createUI(tests, message) {
		thisObject.sortedTests = tests.sort();
		// alert('tests:'+tests.length);
		var htmlMessageContent = '';

		$
				.each(
						tests.sort(),
						function(key, val) {
							var unit = "";
							var refRange = "";
							if (val[2]) {
								$
										.each(
												val[2],
												function(index, conceptAttr) {
													if (conceptAttr) {
														if (conceptAttr.key == 'UnitOfMeasure') {
															unit = conceptAttr.value;
															// thisObject.unitArray.push[thisObject.unit,(key
															// + 1)];
														}
														if (conceptAttr.key == 'ReferenceRange') {
															refRange = conceptAttr.value;
															// thisObject.refRangeArray.push[thisObject.refRange,(key
															// + 1)];
														}
													}

												});

							}

							htmlMessageContent += ('<div uiRole="wrapper" id="bloodTestResult' 
									+ (key + 1)
									+ '" style="display:block;" class="ui-result-bloodTest">'
									+ '<div style="float:left;margin-left:20px;width:25%;">&nbsp;</div>'
									+ '<div style="float:left;margin-right:80px;color: rgb(107, 30, 100);width:10%;">Flag:</div>'
									+ '<div style="float:left;margin-right:80px;color: rgb(107, 30, 100);width:10%;">Result:</div>'
									+ '<div style="float:left;margin-right:80px;color: rgb(107, 30, 100);width:10%;">Unit Of Measure:</div>'
									+ '<div style="float:left;color: rgb(107, 30, 100);width:10%;">Reference Range:</div><br/>'
									+ '<div id="labelDiv" style="width:25%;margin-left:20px;float:left;color: rgb(107, 30, 100); font-weight: bold;">'
									+ val[1]
									+ '</div>'
									+ '<div style="width:10%;margin-right:80px;float:left;" isEditor="true" pathFields="component2['
									+ (key + 1)
									+ '],observationEvent" tagName="interpretationCode" dataType="CE" editorType="CEInplace"></div>'
									+ '<div style="width:10%;margin-right:80px;float:left;" isEditor="true" pathFields="component2['
									+ (key + 1)
									+ '],observationEvent" tagName="value" dataType="PQ" editorType="PQInplace" id="PQResult'+(key+1)+'"></div>'
									+ '<div style="width:10%;margin-right:80px;float:left;" isEditor="true" pathFields="component2['
									+ (key + 1)
									+ '],observationEvent,referenceRange,interpretationRange" tagName="interpretationCode" dataType="CE" editorType="CEInplace" editorLabel="'
									+ unit
									+ '"></div>'
									+ '<div style="width:10%;float:left;" isEditor="true" pathFields="component2['
									+ (key + 1)
									+ '],observationEvent,referenceRange,interpretationRange" tagName="value" dataType="PQ" editorType="PQInplace" editorLabel="'
									+ refRange + '"></div></div>');
							
							thisObject.bloodTestLabelList.put(val[1], "PQResult"+(key+1));
							//thisObject.keyCheckList.push(val[1]);
						});

		$("#inner-uiform-" + message.id).find('#bloodTestResult_Report')
				.append(htmlMessageContent);

		try {
			var messageTitle = XmlUtil.getXPathResult(message.message,
					"message/POLB_MT004000HT01_BloodTest/component2");
			if (!messageTitle.iterateNext()) {
				var page = appController.getComponent("RenderingEngine")
						.getChildComponent("Form").getPage();
				var object = new Object();
				page.getMessageScript(message, object, thisObject.fillData);
			}

		} catch (error) {
			alert("error in blood test");
		}

		if (message.messageAndUIBinder) {
			var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
			message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
		}
		
		/*$("#inner-uiform-" + message.id).find('#labelDiv').each(function(index,labelField){
			var label = $(labelField).html();
			if(label){
				label = label.trim();
			}
			
			//var wrapper = $(labelField).closest('[uiRole="wrapper"]')[0];
			//parentId = $(wrapper).attr('id');
			
			thisObject.bloodTestLabelList.put(label, parentId);
			
			
		});*/
		
		
		
		
		//alert("message:"+XmlUtil.xmlToString(message.message));  thisObject.bloodTestLabelList = 
	}

	function fillData(messageTypeScript, object, message) {
		messageTypeScript.fillData('component2', thisObject.sortedTests);

	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;
	
	
	function createConfiguration(){
		//alert("create array");
		//key: name coming from dataBase  & value is the label in the form
		thisObject.bloodTestConfiguration.put('Total LDL','Total LDL');
		thisObject.bloodTestConfiguration.put('LDL Real (LDL-R)','Real LDL');
		thisObject.bloodTestConfiguration.put('Total HDL','Total HDL');
		thisObject.bloodTestConfiguration.put('Total VLDL','Total VLDL');
		thisObject.bloodTestConfiguration.put('Total Cholesterol','Cholesterol/HDl Ratio');
		thisObject.bloodTestConfiguration.put('Triglycerides','Triglycerides');
		thisObject.bloodTestConfiguration.put('Remnant Lipoproteins (IDL + VLDL3)','Remnant Lipoprotein (IDL + VLDL)');
		thisObject.bloodTestConfiguration.put('Apolipoprotein A1 (Apo A1)','Apolipoprotein A');
		thisObject.bloodTestConfiguration.put('Apo B100/Apo A1 Ratio','Apolipoprotein B/Apolipoprotein A ratio');
		thisObject.bloodTestConfiguration.put('Homocysteine','Homocysteine (>12+)');
		thisObject.bloodTestConfiguration.put('Insulin','Insulin');
		thisObject.bloodTestConfiguration.put('C-Peptide','C-Peptide(>5+)');
		thisObject.bloodTestConfiguration.put('Proinsulin, Total','Proinsulin (>22+)');
		thisObject.bloodTestConfiguration.put('Proinsulin/Insulin Ratio','Proinsulin/Insulin Ratio (>0.25)');
		thisObject.bloodTestConfiguration.put('Adiponectin*','Adiponectin (<4+)');
		thisObject.bloodTestConfiguration.put('Leptin*','Leptin (>6.9+)');
		thisObject.bloodTestConfiguration.put('Resistin*','Resistin (>25+)');
		thisObject.bloodTestConfiguration.put('Testosterone, Total','Total Testosterone');
		thisObject.bloodTestConfiguration.put('Sex Hormone Binding Globulin','Globulin');
		thisObject.bloodTestConfiguration.put('High Sensitivity CRP','High-Sensitivity C-Reactive Protein (hs-CRP) (>1+)');
		thisObject.bloodTestConfiguration.put('Tumor Necrosis Factor Alpha*','TNF');
		thisObject.bloodTestConfiguration.put('Plasminogen Activator Inhibitor Type 1*','PAI-1');
		thisObject.bloodTestConfiguration.put('Glucose','Glucose (>90+)');
	};
	
	function bloodTestuploadHandler(extractedValues){
		try {
			eval('var data=' + extractedValues);
		} catch (error) {
			console.log("Invalid JSON extractedValues from the  BLOOD_TEST_RESULT_FORM: "+ extractedValues);
			return;
		}
		
		
		try{
			$.each(data,function(key,value){
				label  = value.name;
				result = value.value;
				if(label){
					label = $.trim(label);
				}
				var formLabelObj = thisObject.bloodTestConfiguration.get(label);
				if(typeof (formLabelObj) === 'object' && formLabelObj != null){
					var formLabel = thisObject.bloodTestConfiguration.get(label).value;
					var formIdObj = thisObject.bloodTestLabelList.get(formLabel);
					if(typeof (formIdObj) === 'object'  && formIdObj != null){
						var formId = thisObject.bloodTestLabelList.get(formLabel).value;
						if(formId){
							var editorObj = thisObject.messageAndUIBinder.geteditor(formId);
							var field = editorObj.getField('PQInplaceDisplayValue');
							field.val(result).trigger('change');
						}
					}
				}	
				
			});
		}catch(jsonError){
			console.log("error in iterating over the extracted values in BLOOD_TEST_RESULT_FORM: " + jsonError);
		}
		
	};

};