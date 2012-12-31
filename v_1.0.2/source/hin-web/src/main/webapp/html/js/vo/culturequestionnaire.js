var yesCount = 0;
var noCount = 0;
var radioCountArray = new Array();
var selectedRadioArray = new Array();
$(document).ready(function() {
		
		loadCultureHistoryQuestionnaire();
		loadTemperamentQuestionnaireScreen();
		loadTemperamentQuestionnaireScreen2();
		loadTemperamentQuestionnaireScreen3();
		loadTemperamentQuestionnaireScreen4();
	});

	function loadCultureHistoryQuestionnaire() {
		var culturequestionnaireArray = getCultureHistoryQuestionnaire();
		$(culturequestionnaireArray).each(function(index, question) {
			var questionnaire = loadCultureHistory(index + 1, question);
			$('#cultureHistoryQuestionnaire').append(questionnaire);
			var id = index + 1;
			$('.cultureRadioHIstory' + id).click(function() {
				selected = $("input[name='history" + id + "']:checked").val();
				if (radioCountArray[id]) {
					if (selected == "yes" && selectedRadioArray[id] !=="yes") {
						selectedRadioArray[id] = selected;
						yesCount = yesCount + 1;
						if (noCount > 0) {
							noCount = noCount - 1;
						}
					} else if(selectedRadioArray[id] !=="no" && selected == "no"){
						selectedRadioArray[id] = selected;
						noCount = noCount + 1;
						if (yesCount > 0) {
							yesCount = yesCount - 1;
						}
					}
				}else{
					radioCountArray[id] = id;
					selectedRadioArray[id] = selected;
					if (selected == "yes") {
						yesCount = yesCount + 1;
						
					} else {
						noCount = noCount + 1;
					}
				}
				$('#culturehistory_yes').html(yesCount);
				$('#culturehistory_no').html(noCount);
			});


		});
	}

	function getCultureHistoryQuestionnaire() {
		var history = [];
		history.push("I have a significant other that enhances me");
		history.push("I feel I am well loved.");
		history
				.push("I am close to my family");
		history.push("I have close friends");
		history
				.push("I enjoy my job");
		history
				.push("I have a good relationship with my coworkers");
		history.push("I am active in my community");
		history.push("I attend a church, mosque, synagogue(spiritual group");
		history.push("I love my country");
		history.push("I value and feel at home on \"mother earth\"");
		return history;
	}

	function loadCultureHistory(index, question) {
		var backcolor = "";
		if(index % 2==0)
		{
			backcolor = "#F2F2F2";
		}
		/*else{
			 backcolor = "#FFFFFF";
		}*/
		var questionnaire = '<fieldset id="'+index+'" class="ui-grid-a" style="background:'+backcolor+'">';
		//$("#4").css("background","#C0C0C0");
		questionnaire += '<div class="ui-block-a" style="width: 5%; border: 1px solid;border-top:0px;">';
		questionnaire += '<div style="margin-left:5px;">';
		questionnaire += index;
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-b" style="width: 78.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
		questionnaire += '<div style="margin-left:5px">';
		questionnaire += question;
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-c" style="height: 19px; width: 3%; border: 1px solid; border-left: 0px;;border-top:0px;">';
		questionnaire += '<div style="margin-top: 0px; margin-left:-15px">';
		questionnaire += '<input class="cultureRadioHIstory' + index + '" type="radio" name="history' + index + '" value="yes" />';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-d"';
		questionnaire += 'style="height:19px;width: 5%; border: 1px solid; border-left: 0px; border-right: 0px;;border-top:0px;">';
		questionnaire += '<font size="2">&nbsp;&nbsp;Yes</font>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-e" style="height: 19px; width: 3%; border: 1px solid; border-right: 0px;;border-top:0px;">';
		questionnaire += '<div style="margin-top: 0px; margin-left:-15px">';
		questionnaire += '<input class="cultureRadioHIstory' + index + '" type="radio" name="history' + index + '" value="no" />';
		questionnaire += '</div>';
		questionnaire += '</div>';
		questionnaire += '<div class="ui-block-d" style="height:19px;width: 5%; border: 1px solid;border-top:0px;">';
		questionnaire += '<font size="2">&nbsp;&nbsp;No</font>';
		questionnaire += '</div>';
		questionnaire += '</fieldset>';
		
		return questionnaire;
	}
	
	function loadTemperamentQuestionnaireScreen() {
		var questionnaireArray = getTemperamentQuestionnaire();
		$.each(questionnaireArray, function(index, question) {
			var questionnaire = loadTemperamentQuestionnaire(index + 1, question.OptionA,
			question.OptionB);
			$('#TemperamentAssessment').append(questionnaire);
		});

		
	}

	
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
			
			temperamentQuestionnaire.push({
				OptionA : "I prefer to be recognized for my part in a group undertaking",
				OptionB : "I prefer to be recognized for something I have done myself"
				
			});
			
			temperamentQuestionnaire.push({
				OptionA : "I prefer to be skilled in games that call for interaction with others",
				OptionB : "I prefer to play singly and be solely responsible for the results"
				
			});
			
			temperamentQuestionnaire.push({
				OptionA : "My interests are varied and changing",
				OptionB : "My interests are few and lasting"
				
			});
			
			temperamentQuestionnaire.push({
				OptionA : "I can talk easily with anyone on anything",
				OptionB : "I find things to say only to certain people on certain topics"
				
			});
			
			return temperamentQuestionnaire;
		}
		
		
		function loadTemperamentQuestionnaire(index, question1, question2) {
			var questionnaire = '<fieldset class="ui-grid-a">';
			questionnaire += '<div class="ui-block-a" style="height:37px;width: 5%;border: 1px solid;border-top:0px;">';
			questionnaire += '<div style="margin-left:5px;">';
			questionnaire += index;
			questionnaire += '</div>';
			questionnaire += '</div>';
			questionnaire += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
			questionnaire += '<div style="margin-top: 9px; margin-left:10px;">';
			questionnaire += '<input type="checkbox" name="" value="" />';
			questionnaire += '</div>';
			questionnaire += '</div>';
			questionnaire += '<div class="ui-block-b" style="height:37px;width: 40%; border: 1px solid; border-left: 0px;border-top:0px;">';
			questionnaire += '<div style="margin-left:5px">';
			questionnaire += question1;
			questionnaire += '</div>';
			questionnaire += '</div>';
			questionnaire += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
			questionnaire += '<div style="margin-top: 9px; margin-left:10px;">';
			questionnaire += '<input type="checkbox" name="" value="" />';
			questionnaire += '</div>';
			questionnaire += '</div>';
			questionnaire += '<div class="ui-block-b" style="height:37px;width: 44.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
			questionnaire += '<div style="margin-left:5px">';
			questionnaire += question2;
			questionnaire += '</div>';
			questionnaire += '</div>';
			questionnaire += '</fieldset>';
			return questionnaire;
		}
		
		function loadTemperamentQuestionnaireScreen2() {
			var questionnaireArray2 = getTemperamentQuestionnaire2();
			$.each(questionnaireArray2, function(index, question) {
				var questionnaire2 = loadTemperamentQuestionnaire2(index + 1, question.OptionA,
				question.OptionB);
				$('#TemperamentAssessment2').append(questionnaire2);
			});

			
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
			
			
			function loadTemperamentQuestionnaire2(index, question1, question2) {
				var questionnaire2 = '<fieldset class="ui-grid-a">';
				questionnaire2 += '<div class="ui-block-a" style="width: 5%;border: 1px solid;border-top:0px;">';
				questionnaire2 += '<div style="margin-left:5px;">';
				questionnaire2 += index;
				questionnaire2 += '</div>';
				questionnaire2 += '</div>';
				questionnaire2 += '<div class="ui-block-c" style="height:19px;width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
				questionnaire2 += '<div style="margin-top: 1px; margin-left:10px;">';
				questionnaire2 += '<input type="checkbox" name="" value="" />';
				questionnaire2 += '</div>';
				questionnaire2 += '</div>';
				questionnaire2 += '<div class="ui-block-b" style="width: 40%; border: 1px solid; border-left: 0px;border-top:0px;">';
				questionnaire2 += '<div style="margin-left:5px">';
				questionnaire2 += question1;
				questionnaire2 += '</div>';
				questionnaire2 += '</div>';
				questionnaire2 += '<div class="ui-block-c" style="height:19px;width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
				questionnaire2 += '<div style="margin-top: 1px; margin-left:10px;">';
				questionnaire2 += '<input type="checkbox" name="" value="" />';
				questionnaire2 += '</div>';
				questionnaire2 += '</div>';
				questionnaire2 += '<div class="ui-block-b" style="width: 44.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
				questionnaire2 += '<div style="margin-left:5px">';
				questionnaire2 += question2;
				questionnaire2 += '</div>';
				questionnaire2 += '</div>';
				questionnaire2 += '</fieldset>';
				return questionnaire2;
			}
			
			
			function loadTemperamentQuestionnaireScreen3() {
				var questionnaireArray3 = getTemperamentQuestionnaire3();
				$.each(questionnaireArray3, function(index, question) {
					var questionnaire3 = loadTemperamentQuestionnaire3(index + 1, question.OptionA,
					question.OptionB);
					$('#TemperamentAssessment3').append(questionnaire3);
				});

				
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
					
					temperamentQuestionnaire3.push({
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
					
					temperamentQuestionnaire3.push({
						OptionA : "I believe its more important to be aware of those feelings",
						OptionB : "I believe its more important to be clear about what works"
						
					});
					
					temperamentQuestionnaire3.push({
						OptionA : "I prefer conversation that is sociable and friendly",
						OptionB : "I prefer conversation that is focused on objective analysis"
						
					});
					
					return temperamentQuestionnaire3;
				}
				

				function loadTemperamentQuestionnaire3(index, question1, question2) {
					var questionnaire3 = '<fieldset class="ui-grid-a">';
					questionnaire3 += '<div class="ui-block-a" style="height:37px;width: 5%;border: 1px solid;border-top:0px;">';
					questionnaire3 += '<div style="margin-left:5px;">';
					questionnaire3 += index;
					questionnaire3 += '</div>';
					questionnaire3 += '</div>';
					questionnaire3 += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
					questionnaire3 += '<div style="margin-top: 9px; margin-left:10px;">';
					questionnaire3 += '<input type="checkbox" name="" value="" />';
					questionnaire3 += '</div>';
					questionnaire3 += '</div>';
					questionnaire3 += '<div class="ui-block-b" style="height:37px;width: 41.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
					questionnaire3 += '<div style="margin-left:5px">';
					questionnaire3 += question1;
					questionnaire3 += '</div>';
					questionnaire3 += '</div>';
					questionnaire3 += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
					questionnaire3 += '<div style="margin-top: 9px; margin-left:10px;">';
					questionnaire3 += '<input type="checkbox" name="" value="" />';
					questionnaire3 += '</div>';
					questionnaire3 += '</div>';
					questionnaire3 += '<div class="ui-block-b" style="height:37px;width: 43%; border: 1px solid; border-left: 0px;border-top:0px;">';
					questionnaire3 += '<div style="margin-left:5px">';
					questionnaire3 += question2;
					questionnaire3 += '</div>';
					questionnaire3 += '</div>';
					questionnaire3 += '</fieldset>';
					return questionnaire3;
				}
				
				
				function loadTemperamentQuestionnaireScreen4() {
					var questionnaireArray4 = getTemperamentQuestionnaire4();
					$.each(questionnaireArray4, function(index, question) {
						var questionnaire4 = loadTemperamentQuestionnaire4(index + 1, question.OptionA,
						question.OptionB);
						$('#TemperamentAssessment4').append(questionnaire4);
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
						
						temperamentQuestionnaire4.push({
							OptionA : "Try to find a way to make the situation fit with my plans",
							OptionB : "Instinctively adjust my plans to fit the changed situation"
							
						});
						
						temperamentQuestionnaire4.push({
							OptionA : "I prefer to follow a schedule",
							OptionB : "I prefer to go with the flow"
							
						});
						
						temperamentQuestionnaire4.push({
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
					

					function loadTemperamentQuestionnaire4(index, question1, question2) {
						var questionnaire4 = '<fieldset class="ui-grid-a">';
						questionnaire4 += '<div class="ui-block-a" style="height:37px;width: 5%;border: 1px solid;border-top:0px;">';
						questionnaire4 += '<div style="margin-left:5px;">';
						questionnaire4 += index;
						questionnaire4 += '</div>';
						questionnaire4 += '</div>';
						questionnaire4 += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
						questionnaire4 += '<div style="margin-top: 9px; margin-left:10px;">';
						questionnaire4 += '<input type="checkbox" name="" value="" />';
						questionnaire4 += '</div>';
						questionnaire4 += '</div>';
						questionnaire4 += '<div class="ui-block-b" style="height:37px;width: 41.2%; border: 1px solid; border-left: 0px;border-top:0px;">';
						questionnaire4 += '<div style="margin-left:5px">';
						questionnaire4 += question1;
						questionnaire4 += '</div>';
						questionnaire4 += '</div>';
						questionnaire4 += '<div class="ui-block-c" style="height: 37px; width: 5%; border: 1px solid; border-left: 0px;;border-top:0px;">';
						questionnaire4 += '<div style="margin-top: 9px; margin-left:10px;">';
						questionnaire4 += '<input type="checkbox" name="" value="" />';
						questionnaire4 += '</div>';
						questionnaire4 += '</div>';
						questionnaire4 += '<div class="ui-block-b" style="height:37px;width: 43%; border: 1px solid; border-left: 0px;border-top:0px;">';
						questionnaire4 += '<div style="margin-left:5px">';
						questionnaire4 += question2;
						questionnaire4 += '</div>';
						questionnaire4 += '</div>';
						questionnaire4 += '</fieldset>';
						return questionnaire4;
					}
				
	
				
		
		