var reportRenderer = null;
	var results_pageIdArray = new Array();
	
	function loadPage(pageId){
		var pageUri = "../client-report/"+pageId + ".svg"; 
		//alert("Page: " + pageUri)
		var xmlNode = XmlUtil.loadXml(pageUri);
		reportRenderer.setSVGDoc(xmlNode);
		
		var data = getData(pageId);
		
		if(data !== null){
			reportRenderer.createIndicator(data);
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
		
		
		
		return data;
	}
	
	function resultFormClickHandler() {
		var index = results_pageIdArray.indexOf($(this).attr('id'));
		$('#results_page' + index).slideToggle();
	}
	
	$(document)
			.ready(
					function() {
						results_pageIdArray.push("");
						results_pageIdArray.push("");
						results_pageIdArray.push("");
						results_pageIdArray.push("results_togglePage3");
						results_pageIdArray.push("results_togglePage4");
						results_pageIdArray.push("results_togglePage5");
						results_pageIdArray.push("results_togglePage6");
						results_pageIdArray.push("results_togglePage7");
						results_pageIdArray.push("results_togglePage8");
						results_pageIdArray.push("results_togglePage9");
						results_pageIdArray.push("results_togglePage10");
						results_pageIdArray.push("results_togglePage11");
						results_pageIdArray.push("results_togglePage12");
						
						for(pageIndex=3; pageIndex<=12; pageIndex++){
							var pageId = "page" + pageIndex;
							reportRenderer = new ReportRenderer($('#results_'+pageId), window.document);
							loadPage(pageId);
						}

						for ( var newID = 3; newID <= 12; newID++) {
								$('#results_page' + newID).hide();
							}

							$(".results_pageClass").unbind('click', resultFormClickHandler);
							$(".results_pageClass").bind('click', resultFormClickHandler);
					});