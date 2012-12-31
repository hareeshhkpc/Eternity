var reportRenderer = null;
	//var client_pageIdArray = new Array();
var patient = new HIN.PatientInfo(appController);
	
	function loadPage(pageId, pageType){
		var pageUri = "../client-report/"+pageId + ".svg"; 
		//alert("Page: " + pageUri)
		var xmlNode = XmlUtil.loadXml(pageUri);
		reportRenderer.setSVGDoc(xmlNode);
		
		if(pageId=="page1"){
			var patientName = null;
			var program = null;
			var date = null;
			var patientInfo = patient.fetchPatientInfo();
			for(i in patientInfo){
				patientName = patientInfo[i].patient;
				program = patientInfo[i].program;
				date = patientInfo[i].date;
			}
			
			reportRenderer.fillPatientInfo(patientName, program, date);
		}
		
		var data = getData(pageId);
		
		if(data !== null){
			reportRenderer.createIndicator(data);
		}
		if(pageType == "consultation"){
			for(i in data){
				var physicianComments = data[i].comments;
				var checkedParam = data[i].checkedArray;
				var consultationType = data[i].consultationType;
				var hormoneDrugArray = data[i].hormoneDrugArray;
				var advancedSupplementationDrugIntake = data[i].advancedSupplementationDrugArray;
				if(consultationType=="checkBox"){
					reportRenderer.writePhysicianComments(physicianComments);
					reportRenderer.tickCheckBox(checkedParam);
				}else if(consultationType=="restorationHormones"){
					reportRenderer.drugIntakeHormone(hormoneDrugArray, physicianComments);
				}else if(consultationType=="advancedSupplementation"){
					reportRenderer.drugIntakeAdvancedSupplementation(advancedSupplementationDrugIntake, physicianComments);
				}
			}
		}
		reportRenderer.appendSVG();
	}
	
	
	function getData(page){
		var score_Array
		var data;
		if(page=="page1"){
			data=null;
		}
		if(page=="page2"){
			data=null;
		}
		if(page=="page3"){
			score_Array = [160, 100, 80, 160, 100, 80, 160, 100];
			coordinates = [{
				"y_rect" : 240,
				"y_circle" : 255,
				"y_text": 262,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 68,
				"y2_line": 68,
				"x_circle_small" :660,
				"y_circle_small" :68,
				"y_standard": 68,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			data=[ {
				"overall" :100,
				"page" : "OverviewResult",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		if(page=="page4"){
			coordinates = [{
				"y_rect" : 162,
				"y_circle" : 177,
				"y_text": 184,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 178,
				"y2_line": 178,
				"x_circle_small" :660,
				"y_circle_small" :178,
				"y_standard": 178,
				"array_increment": 22.5,
				"y_standard_increment" :81.3
			}];
			
			score_Array = [[160, 100, 80],[160, 100], [80, 160, 0], [80, 160, 100]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page5"){
			coordinates = [{
				"y_rect" : 162,
				"y_circle" : 177,
				"y_text": 184,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 178,
				"y2_line": 178,
				"x_circle_small" :660,
				"y_circle_small" :178,
				"y_standard": 178,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 0, 160, 100, 80, 160, 0, 80, 160, 100]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page6"){
			coordinates = [{
				"y_rect" : 188,
				"y_circle" : 203,
				"y_text": 210,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 204,
				"y2_line": 204,
				"x_circle_small" :660,
				"y_circle_small" :204,
				"y_standard": 204,
				"array_increment": 47,
				"y_standard_increment" :82.2
			}];
			
			score_Array = [[160, 100, 80, 160, 100], [80, 160, 100, 80, 160, 80]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page7"){
			coordinates = [{
				"y_rect" : 170,
				"y_circle" : 185,
				"y_text": 192,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 186,
				"y2_line": 186,
				"x_circle_small" :660,
				"y_circle_small" :186,
				"y_standard": 186,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 80,  160, 100, 160, 0]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page8"){
			coordinates = [{
				"y_rect" : 232,
				"y_circle" : 247,
				"y_text": 256,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 250,
				"y2_line": 250,
				"x_circle_small" :660,
				"y_circle_small" :250,
				"y_standard": 250,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[80, 0, 100, 80, 0, 100]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page9"){
			coordinates = [{
				"y_rect" : 160,
				"y_circle" : 175,
				"y_text": 182,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 176,
				"y2_line": 176,
				"x_circle_small" :660,
				"y_circle_small" :176,
				"y_standard": 176,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 80,  160, 100, 80, 160, 100, 0, 160, 100]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page10"){
			coordinates = [{
				"y_rect" : 144,
				"y_circle" : 159,
				"y_text": 166,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 160,
				"y2_line": 160,
				"x_circle_small" :660,
				"y_circle_small" :160,
				"y_standard": 160,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 80,  160, 100, 80, 160, 100, 0, 160, 0, 80 ]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page11"){
			coordinates = [{
				"y_rect" : 142,
				"y_circle" : 157,
				"y_text": 164,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 158,
				"y2_line": 158,
				"x_circle_small" :660,
				"y_circle_small" :158,
				"y_standard": 158,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 80,  160, 0, 80, 160, 100, 80]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="page12"){
			coordinates = [{
				"y_rect" : 160,
				"y_circle" : 175,
				"y_text": 182,
				"x1_line": 640,
				"x2_line" :658,
				"y1_line": 176,
				"y2_line": 176,
				"x_circle_small" :660,
				"y_circle_small" :176,
				"y_standard": 176,
				"array_increment": 0,
				"y_standard_increment" :0
			}];
			
			score_Array = [[160, 100, 80,  160, 100, 80, 160, 100, 80, 160, 100]];
			data=[ {
				"page" : "Results",
				"array" : score_Array,
				"coordinates": coordinates
			} ];
		}
		
		if(page=="consultation1"){
			
			coordinates = [{
				"x_rect": 200,
				"x_circle":170,
				"x1_line": 190,
				"x2_line" :210,
				"x_circle_small" :210,
				"x_standard": 210,
				"x_text":155
			}];
			checkedArray = [["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"],
			                ["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"]];
			physicianComments = [["Heart Attack"],["CT Scan"]];
			score_Array = [[160, 160, 160],[160, 160, 160]];
			data=[ {
				"page" : "Consultation",
				"consultationType" : "checkBox",
				"array" : score_Array,
				"coordinates": coordinates,
				"checkedArray": checkedArray,
				"comments" : physicianComments
			} ];
		}
		
	if(page=="consultation2"){
			
			coordinates = [{
				"x_rect": 200,
				"x_circle":170,
				"x1_line": 190,
				"x2_line" :210,
				"x_circle_small" :210,
				"x_standard": 210,
				"x_text":155
			}];
			checkedArray = [["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"],
			                ["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"]];
			physicianComments = [["Toxin reduction and cancer Screening"],["Exercise"]];
			score_Array = [[160, 160, 160],[160, 160, 160]];
			data=[ {
				"page" : "Consultation",
				"consultationType" : "checkBox",
				"array" : score_Array,
				"coordinates": coordinates,
				"checkedArray": checkedArray,
				"comments" : physicianComments
			} ];
		}
		
	if(page=="consultation3"){
		
		coordinates = [{
			"x_rect": 200,
			"x_circle":170,
			"x1_line": 190,
			"x2_line" :210,
			"x_circle_small" :210,
			"x_standard": 210,
			"x_text":155
		}];
		checkedArray = [["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"]];
		physicianComments = [["Genetics and aesthetics"]];
		score_Array = [[160, 160, 160]];
		data=[ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates": coordinates,
			"checkedArray": checkedArray,
			"comments" : physicianComments
		} ];
	}

	if(page=="consultation4"){
		
		coordinates = [{
			"x_rect": 200,
			"x_circle":170,
			"x1_line": 190,
			"x2_line" :210,
			"x_circle_small" :210,
			"x_standard": 210,
			"x_text":155
		}];
		hormoneDrugArray = [[2, "Morning"], [3, "Noon"], [1, "Evening"], [2, "Evening"], [2, "Morning"],
		                    [2, "Noon"], [1, "Morning"], [1, "Noon"], [1, "Noon"]];
		physicianComments = ["Restoration of male hormones"];
		score_Array = [[160, 160, 160]];
		data=[ {
			"page" : "Consultation",
			"consultationType" : "restorationHormones",
			"hormoneDrugArray" : hormoneDrugArray,
			"comments": physicianComments,
			"array" : score_Array,
			"coordinates": coordinates
		} ];
	}

	if(page=="consultation5"){
		
		coordinates = [{
			"x_rect": 200,
			"x_circle":170,
			"x1_line": 190,
			"x2_line" :210,
			"x_circle_small" :210,
			"x_standard": 210,
			"x_text":155
		}];
		anti_agingDrugArray = [{"drug1": ["2","Morning"], "drug2": ["1","Morning"], "drug3": ["2","Morning"], "drug4": ["1","Morning"],
			"drug5": ["2","Morning"], "drug6": ["1","Morning"]}];
		horoneBoostersDrugArray = [{"drug1": ["2","Morning"], "drug2": ["1","Morning"], "drug3": ["2","Morning"], "drug4": ["1","Morning"],
			"drug5": ["2","Morning"], "drug6": ["1","Morning"]}];
		cardioSupportDrugArray = [{"drug1": ["2","Morning"], "drug2": ["1","Morning"], "drug3": ["2","Morning"], "drug4": ["1","Morning"],
			"drug5": ["2","Morning"], "drug6": ["1","Morning"]}];
		dietControlDrugArray = [{"drug1": ["2","Morning"], "drug2": ["1","Morning"], "drug3": ["2","Morning"], "drug4": ["1","Morning"],
			"drug5": ["2","Morning"], "drug6": ["1","Morning"]}];
		advancedSupplementationDrugIntakeArray = [anti_agingDrugArray];
		physicianComments = ["Advanced Supplementation"];
		score_Array = [[160, 160, 160]];
		data=[ {
			"page" : "Consultation",
			"consultationType" : "advancedSupplementation",
			"advancedSupplementationDrugArray" : advancedSupplementationDrugIntakeArray,
			"comments": physicianComments,
			"array" : score_Array,
			"coordinates": coordinates
		} ];
	}

	if(page=="consultation6"){
		
		coordinates = [{
			"x_rect": 200,
			"x_circle":170,
			"x1_line": 190,
			"x2_line" :210,
			"x_circle_small" :210,
			"x_standard": 210,
			"x_text":155
		}];
		checkedArray = [["true", "false", "true", "false", "true", "true", "true", "false", "false", "true"]];
		physicianComments = [["Lifelong (mind-body) learning"]];
		score_Array = [[160, 160, 160]];
		data=[ {
			"page" : "Consultation",
			"consultationType" : "checkBox",
			"array" : score_Array,
			"coordinates": coordinates,
			"checkedArray": checkedArray,
			"comments" : physicianComments
		} ];
	}
		
		
		return data;
	}
	
	
	$(document)
			.ready(
					function() {
						
						//loads results pages
						for(pageIndex=1; pageIndex<=12; pageIndex++){
							var pageId = "page" + pageIndex;
							reportRenderer = new ReportRenderer($('#client_'+pageId), window.document);
							loadPage(pageId, "results");
						}
						
						//loads consultation pages
						for(pageIndex=1; pageIndex<=6; pageIndex++){
							var pageId = "consultation" + pageIndex;
							reportRenderer = new ReportRenderer($('#'+pageId), window.document);
							loadPage(pageId, "consultation");
						} 

						$('#printClientReport')
						.live(
								'click',
								function() {
									var consentContentprint = document
											.getElementById('client_mainHeaderDivId');
									var popupWin = window.open('', '_blank',
											'width=300,height=300');
									popupWin.document.open();
									popupWin.document
											.write('<html><body onload="window.print()">'
													+ consentContentprint.innerHTML
													+ '</html>');
									popupWin.document.close();
								});
					});