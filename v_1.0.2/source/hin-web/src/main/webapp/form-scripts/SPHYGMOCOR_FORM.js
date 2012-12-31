function SPHYGMOCOR_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	
	this.createSphygmoCorUI = createSphygmoCorUI;
	this.createSphygmoCorChartUI =createSphygmoCorChartUI;
	this.fillReferenceRange = fillReferenceRange;
	this.sphygmocorUploadHandler = sphygmocorUploadHandler;
	this.sphygmocorConfiguration = new HIN.HashMap();
	this.createConfiguration = createConfiguration;
	this.rangeValues = new Array();
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;
	
	function initialize() {

		try {
			//alert("initialize");
			if (thisObject.messageAndUIBinder) {
				thisObject.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.sphygmocorUploadHandler);
			}
			thisObject.createConfiguration();

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");

			thisObject.createSphygmoCorUI(thisObject.message);

			var patientId = thisObject.appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);
			
			$("#inner-uiform-" + thisObject.message.id).find('[dataField="true"]').live(
					"keyup", function() {
						// alert('in change');
						thisObject.createSphygmoCorChartUI(thisObject.message);
					});

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	/**
	 * fetches the values(testName, units, Range Min, Range Max) from the
	 * lookups and creats the UI
	 */
	function createSphygmoCorUI(message) {
		var sphygmocorLookUp = new Array();
		var UIString = "";

		this.appController.getComponent("DataLayer").loadAllConceptServices(
				"sphygmocor",
				function(data) {

					for (i in data.json) {
						sphygmocorLookUp.push([ data.json[i].description,
								data.json[i].conceptAttributes,data.json[i].name]);
					}

					createUI(sphygmocorLookUp);
				}, null);
		/**
		 * uses the lookUp values in the array to create the UI
		 * 
		 * @param sphygmocorLookUp :
		 *            array with the values fetched from the lookUp DB
		 */
		function createUI(sphygmocorLookUp) {
			$
					.each(
							sphygmocorLookUp,
							function(key, value) {
								var units = "";
								var rangeMin = "";
								var rangeMax = "";
								if (value[1]) {
									$.each(value[1], function(index,
											conceptAttr) {
										if (conceptAttr) {
											if (conceptAttr.key == 'units') {
												units = conceptAttr.value;
											}
											if (conceptAttr.key == 'rangeMin') {
												rangeMin = conceptAttr.value;
											}
											if (conceptAttr.key == 'rangeMax') {
												rangeMax = conceptAttr.value;
											}
										}

									});
								}
								UIString += ('<tr class="first"> <td width="50px" colspan="2"><strong>'
										+ '<div isEditor="true" editorLabel="'
										+ value[0]
										+ '" pathFields="component2,observationEvent['
										+ (key + 1)
										+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="'
										+ key
										+ '"></div>'
										+ '</strong></td> </tr> <tr> <fieldset class="ui-grid-b"> <div class="ui-block-a"><td width="120px">'
										+ '<div style="width: 100%;float: left;">'
										+ '<div isEditor="true" editorLabel="" pathFields="component2,observationEvent['
										+ (key + 1)
										+ ']" tagName="value" id="'+value[2]+'" dataType="PQ" editorType="PQInplace" idSuffix="'
										+ key
										+ '"></div>'
										+ '</div></td><td width="140px"> <div style="float: left;padding-left:0%;padding-top: 6%;">'
										+ '<label>'
										+ units
										+ '</label></div></td></div> <div class="ui-block-b">'
										+ '<td width="120px"> <div class="ui-grid-b">'
										+ '<div style="width: 39%;float: left;" class="ui-block-a">'
										+ '<div id="rangeMin'+key+'" isEditor="true" editorLabel="" pathFields="component2,observationEvent['
										+ (key + 1)
										+ '],referenceRange,interpretationRange[1]" tagName="interpretationCode" dataType="CE" editorType="CEInplace" idSuffix="'
										+ key
										+ '"></div></div><div class="ui-block-b" style="width: 20%;position: relative; left: 5px;top:6px;"> -> </div>'
										+ '<div style="width: 39%;float: left;" class="ui-block-c">'
										+ '<div id="rangeMax'
										+ key
										+ '" isEditor="true" editorLabel="" pathFields="component2,observationEvent['
										+ (key + 1)
										+ '],referenceRange,interpretationRange[2]" tagName="interpretationCode" dataType="CE" editorType="CEInplace" idSuffix="'
										+ key + '"></div></div>' + '</div></td></div></fieldset></tr>')
										
										thisObject.rangeValues.push([rangeMin,rangeMax]); 
							});

			$("#inner-uiform-" + thisObject.message.id).find("#Sphygmocor-content").html('');
			$("#inner-uiform-" + thisObject.message.id).find("#Sphygmocor-content").html(UIString);

			/*
			 * calling the methosd from messageAndUIBinder to load the editors
			 * and bind the fields to update teh msg
			 */
			if (thisObject.messageAndUIBinder) {
				var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
				thisObject.messageAndUIBinder.loadDataOntoForm(lookupHandler);
				thisObject.messageAndUIBinder.bindFieldEvents();
			}
			
			var valueCheck = '';
			$("#inner-uiform-" + thisObject.message.id).find('[type="text"]').each(function(key,value){
				if($(this).val()){
					valueCheck = 1;
					return;
				}else{
					valueCheck = 0;
				}
			});
			
			if(valueCheck === 0){
				/*var page = appController.getComponent("RenderingEngine").getChildComponent("Form").getPage();
				var object = new Object();
				page.getMessageScript(message, object, thisObject.fillReferenceRange);*/
				
				$.each(thisObject.rangeValues,function(key,range){
					$("#inner-uiform-" + thisObject.message.id).find("#rangeMin"+key).find("#reasonValue").attr("value",range[0]).trigger("change");
					$("#inner-uiform-" + thisObject.message.id).find("#rangeMax"+key).find("#reasonValue").attr("value",range[1]).trigger("change");
				})
			}
			
			
			

			thisObject.createSphygmoCorChartUI(thisObject.message);
		}

	}
	;

	/**
	 * used to create the Chart to indicate the values entered using SVG
	 */
	function createSphygmoCorChartUI(message) {
		//alert("found");
		var rangeMin = 0;
		var rangeMax = 0;
 		var graphMin = 0;
		var graphMax = 0;
		var graphRange = new Array();

		var text1 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue0").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin0").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax0").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin0").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax0").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}	
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		//alert("graphMin:"+graphMin+" graphMax:"+graphMax);
		var xAxis1 = modifyChart(text1, rangeMin, rangeMax, graphMin, graphMax);

		var text2 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue1").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin1").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax1").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin1").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax1").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		var xAxis2 = modifyChart(text2, rangeMin, rangeMax, graphMin, graphMax);

		var text3 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue2").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin2").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax2").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin2").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax2").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}
		
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		var xAxis3 = modifyChart(text3, rangeMin, rangeMax, graphMin, graphMax);


		var text4 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue3").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin3").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax3").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin3").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax3").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		var xAxis4 = modifyChart(text4, rangeMin, rangeMax, graphMin, graphMax);

		var text5 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue4").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin4").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax4").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin4").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax4").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		var xAxis5 = modifyChart(text5, rangeMin, rangeMax, graphMin, graphMax);

		var text6 = $("#inner-uiform-" + message.id).find("#PQInplaceDisplayValue5").val();
		rangeMin = parseInt($("#inner-uiform-" + message.id).find("#rangeMin5").find("#reasonValue").attr("value"));
		rangeMax = parseInt($("#inner-uiform-" + message.id).find("#rangeMax5").find("#reasonValue").attr("value"));
		if(!rangeMin){
			$("#inner-uiform-" + message.id).find("#rangeMin5").find("#reasonValue").attr("value","0");
			rangeMin = 0;
		}
		if(!rangeMax){
			$("#inner-uiform-" + message.id).find("#rangeMax5").find("#reasonValue").attr("value","0");
			rangeMax = 0;
		}
		
		graphRange = getGraphRange(rangeMin,rangeMax);
		graphMin = graphRange[0];
		graphMax = graphRange[1];
		var xAxis6 = modifyChart(text6, rangeMin, rangeMax, graphMin, graphMax);

		createChart();
		
		function getGraphRange(rangeMin,rangeMax){
			var min = "";
			var max = "";
			var ranges = new Array();
			
			if(rangeMin){
				if(rangeMin < 0){
					min = rangeMin + ((rangeMin*5)/100);
				}else{
					min = rangeMin - ((rangeMin*5)/100);
				}
			}else{
				min = 0;
			}	
			
			if(rangeMax < 0){
				max = rangeMax - ((rangeMax*5)/100);
			}else{
				max = rangeMax + ((rangeMax*5)/100);
			}
			
			ranges = [min, max];
			return ranges;
		}

		/**
		 * 
		 * @param text1 :
		 *            values entered in the text box
		 * @param rangeMin :
		 *            min range for the specified test
		 * @param rangeMax :
		 *            max range for the specified test
		 * @param graphMin :
		 *            min value that can be indicated in the graph
		 * @param graphMax :
		 *            max value that can be indicated in the graph
		 * @returns {String} : value to be upadted in the xml to to modify the
		 *          graph UI
		 */
		function modifyChart(text1, rangeMin, rangeMax, graphMin, graphMax) {
			//alert("1:"+text1+" 2."+rangeMin+" 3."+rangeMax+" 4."+graphMin+" 5."+graphMax);
			//if(rangeMin >= 0){
				var num1 = 100 / (rangeMin - 1);
				var num2 = 180 / (rangeMax - rangeMin);
				var num3 = 100 / (graphMax - rangeMax);
				var rectPosition = "";
	
				if (text1 > graphMin && text1 <= (rangeMin - 1)) {
					if (parseInt(text1) * num1 < 80) {
						rectPosition = parseInt(text1) * num1;
					} else {
						rectPosition = (parseInt(text1) * num1) - 20;
					}
	
				} else if (text1 >= rangeMin && text1 <= rangeMax) {
					var text1 = parseInt(text1);
					var rangeVal = parseInt(rangeMin) - 1;
					rectPosition = 100 + ((text1 - rangeVal) * num2);
					if (rectPosition > 300) {
						rectPosition = rectPosition - 30;
					} else {
						rectPosition = rectPosition - 5;
					}
	
				} else if (text1 > rangeMax && text1 < graphMax) {
					rectPosition = 300 + ((parseInt(text1) - rangeMax) * num3);
					if (rectPosition > 380) {
						rectPosition = "380";
					}
	
				}else if(text1 < graphMin){
					rectPosition = "0";
				} else if(text1 > graphMax){
					rectPosition = "380";
				}else {
					/*if (text1 == 0) {
						rectPosition = "0";
					} else {
						rectPosition = "380";
					}*/
				}
			
			return rectPosition;
		}

		/**
		 * used to update all the calculated value to the xml to modify the
		 * Chart UI
		 */
		function createChart() {
			var xmlNode = XmlUtil.loadXml("charts/SphygmocorGraph.xml");

			var subNode1 = XmlUtil.find(xmlNode, "id", "rectSmall11");
			XmlUtil.attr(subNode1, "x", xAxis1);

			var subNode2 = XmlUtil.find(xmlNode, "id", "rectSmall12");
			XmlUtil.attr(subNode2, "x", xAxis2);

			var subNode3 = XmlUtil.find(xmlNode, "id", "rectSmall13");
			XmlUtil.attr(subNode3, "x", xAxis3);

			var subNode4 = XmlUtil.find(xmlNode, "id", "rectSmall14");
			XmlUtil.attr(subNode4, "x", xAxis4);

			var subNode5 = XmlUtil.find(xmlNode, "id", "rectSmall21");
			XmlUtil.attr(subNode5, "x", xAxis5);

			var subNode6 = XmlUtil.find(xmlNode, "id", "rectSmall22");
			XmlUtil.attr(subNode6, "x", xAxis6);
			$("#inner-uiform-" + message.id).find("#svgGraph").html(
					XmlUtil.xmlToString(xmlNode));
		}

	}
	
	function fillReferenceRange(messageTypeScript,object, message){
		messageTypeScript.fillData('interpretationCode', thisObject.rangeValues);
		
	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;
	
	function createConfiguration(){
		
		
		//key: name coming from dataBase  & value is the id in the form
		thisObject.sphygmocorConfiguration.put('Aortic SP',"AorticSP");
		thisObject.sphygmocorConfiguration.put('Aortic SP1',"AorticSP");
		thisObject.sphygmocorConfiguration.put('Aortic PP','AorticPP');
		thisObject.sphygmocorConfiguration.put('Aortic PP1',"AorticPP");
		thisObject.sphygmocorConfiguration.put('AP','AP');
		thisObject.sphygmocorConfiguration.put('AP1',"AP");
		thisObject.sphygmocorConfiguration.put('AIx @ HR75','Alx_HR75');
		thisObject.sphygmocorConfiguration.put('AIx @ HR751',"Alx_HR75");
		thisObject.sphygmocorConfiguration.put('Ejection Duration','EjectionDuration');
		thisObject.sphygmocorConfiguration.put('Ejection Duration1',"EjectionDuration");
		thisObject.sphygmocorConfiguration.put('SEVR','SEVR');
		thisObject.sphygmocorConfiguration.put('SEVR1',"SEVR");
		thisObject.sphygmocorConfiguration.put('Peripheral Pressures',"PeripheralPressures");
		thisObject.sphygmocorConfiguration.put('PP','PP');
		thisObject.sphygmocorConfiguration.put('Dp','Dp');
		
	//	return thisObject.sphygmocorConfiguration;
		
	};
	
	function sphygmocorUploadHandler(extractedValues){
		//alert("in handler:"+extractedValues);
		console.log("in handler: "+ extractedValues);
		console.log("thisObject.message: "+ thisObject.message);
		console.log("thisObject.messageAndUIBinder: "+ thisObject.messageAndUIBinder);
		try {
			eval('var data=' + extractedValues);
		} catch (error) {
			console.log("Invalid JSON extractedValues from the SPHYGMOCOR_FORM: "+ extractedValues);
			return;
		}
		
		console.log("data: "+ data);
		
		try{
			$.each(data,function(key,value){
				
				var rangeMin = null;
				var rangeMax = null;
				var list = new Array();
				var formId = new Array();
				var modified = false;
				
				var label  = value.name;
				var result = value.value;
				if(label){
					label = $.trim(label);
				}
				//alert("label: "+label+"  result:"+result);
				//alert("index:"+result.indexOf('->'));
				if(result){
				if(result.indexOf('->') > -1){
					list = result.split("->");
					//alert("list: "+list);
					if(list[0] &&  list[1]){
						// rangeMin = list[0].substr(1);
						 //rangeMax = list[1].slice(0, -1);
						 var first = list[0].split('[');
						 var second = list[1].split(']');
						 rangeMin = first[1];
						 rangeMax = second[0];
						 modified = "array";
						 //alert(rangeMin+" : "+rangeMax);
					}
				}else if(result.indexOf('mmHg') > -1){
					list = result.split("mmHg");
					result = list[0];
					 modified = "string";
					
				}else if(result.indexOf('%') > -1){
					list = result.split("%");
					result = list[0];	
					 modified = "string";
				}else if(result.indexOf('/') > -1){
					list = result.split("/");
					 rangeMin = list[0];
					 rangeMax = list[1];	
					 modified = "array";
				}
				}
				 
				 
				
					var formIdObj = thisObject.sphygmocorConfiguration.get(label);
					if(typeof (formIdObj) === 'object'  && formIdObj != null){
						formId = thisObject.sphygmocorConfiguration.get(label).value;
						//alert("formId: "+formId);
						if(formId){
							
							if(modified === "array"){
								if(label != 'Peripheral Pressures'){
									var idSuffix = $("#inner-uiform-" + thisObject.message.id).find('#'+formId).attr('idSuffix');
									//alert("1: "+"rangeMin"+idSuffix);
									var editorObj = thisObject.messageAndUIBinder.geteditor("rangeMin"+idSuffix);
									var field = editorObj.getField('reasonValue');
									field.val(rangeMin).trigger('change');
									
									//alert("2: "+"rangeMax"+idSuffix);
									var editorObj = thisObject.messageAndUIBinder.geteditor("rangeMax"+idSuffix);
									var field = editorObj.getField('reasonValue');
									field.val(rangeMax).trigger('change');
								}else{
									var idSuffix = $("#inner-uiform-" + thisObject.message.id).find('#'+formId).attr('idSuffix');
									//alert("3: "+"rangeMin"+idSuffix);
									var editorObj = thisObject.messageAndUIBinder.geteditor("rangeMin"+idSuffix);
									var field = editorObj.getField('PQInplaceDisplayValue'+idSuffix);
									field.val(rangeMin).trigger('change');
									
									//alert("4: "+"rangeMax"+idSuffix);
									var editorObj = thisObject.messageAndUIBinder.geteditor("rangeMax"+idSuffix);
									var field = editorObj.getField('PQInplaceDisplayValue'+idSuffix);
									field.val(rangeMax).trigger('change');							
								}
							}else{
								var idSuffix = $("#inner-uiform-" + thisObject.message.id).find('#'+formId).attr('idSuffix');
								//alert("5: "+formId);
								var editorObj = thisObject.messageAndUIBinder.geteditor(formId);
								var field = editorObj.getField('PQInplaceDisplayValue'+idSuffix);
								field.val(result).trigger('change');
							}
						}
					}
				
			});
		}catch(jsonError){
			console.log("error in iterating over the extracted values in SPHYGMOCOR_FORM: " + jsonError);
		}
}

};