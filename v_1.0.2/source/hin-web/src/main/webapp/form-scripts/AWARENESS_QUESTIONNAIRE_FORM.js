function AWARENESS_QUESTIONNAIRE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.createAwarenessUI = createAwarenessUI;
	this.getTotal = getTotal;

	function initialize() {

		try {
			//thisObject.createAwarenessUI(message);
			 //alert("initialize");

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			 //alert("onLoad");
			thisObject.createAwarenessUI(message);
			
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

	function createAwarenessUI(message) {
		var exists = false;
		var totalArray = "";
		var alivenessArray = getAliveness();
		var awarenessMeaning = getAwarenessMeaning();
		var awarenessPurpose = getAwarenessPurpose();
		var awarenessWorldView = getAwarenessWorldView();
		var awarenessArrays = [ {
			"data" : alivenessArray,
			"name" : 'aliveness'
		}, {
			"data" : awarenessMeaning,
			"name" : 'awarenessMeaning'
		}, {
			"data" : awarenessPurpose,
			"name" : 'awarenessPurpose'
		}, {
			"data" : awarenessWorldView,
			"name" : 'awarenessWorldView'
		} ];

		var color = "";
		var index = 1;
		for (i in awarenessArrays) {
			var exists = false;
			var awarenessWorldView = false;
			var questionnaireString = "";
			 //alert("awarenessArrays[i].data" + awarenessArrays[i].data);
			var data = awarenessArrays[i].data;
			for ( var j = 1; j <= 10; j++) {
				var loopArray = "";
				if (j % 2 == 0) {
					color = "#FFFFFF";
				} else {
					color = "#F2F2F2";
				}
				if (awarenessArrays[i].name == "aliveness" && !exists) {
					questionnaireString += '<div class="environmentHead">II-	UL-  AWARENESS</div>';
					questionnaireString += '<div class="environmentBreak"></div>';
					questionnaireString += '<div class="envHistory">A-	ALIVENESS </div>';
					exists = true;
				}
				if (awarenessArrays[i].name == "awarenessMeaning" && !exists) {
					questionnaireString += '<div class="environmentBreak"></div>';
					questionnaireString += '<div class="envHistory">B-	MEANING </div>';
					exists = true;
				}
				if (awarenessArrays[i].name == "awarenessPurpose" && !exists) {
					questionnaireString += '<div class="environmentBreak"></div>';
					questionnaireString += '<div class="envHistory">C-	A PURPOSE</div>';
					exists = true;
				}
				if (awarenessArrays[i].name == "awarenessWorldView"
						&& !awarenessWorldView) {
					questionnaireString += '<div class="environmentBreak"></div>';
					questionnaireString += '<div class="worldViewHeader">D-	WORLDVIEW WELLBEING</div>';
					questionnaireString += '<div class="worldViewYearHeader">Billion Years</div>';
					questionnaireString += '<div class="worldViewYearHeader">Million Years</div>';
					questionnaireString += '<div class="worldViewYearHeader">Thousand Years</div>';
					questionnaireString += '<div class="worldViewYearHeader">Hundred Years</div>';

					awarenessWorldView = true;
				}
				if (awarenessWorldView) {
					if (j >= 9) {
						questionnaireString += '<table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%"><div class="environmentQuetionaireNumber" style="background-color: '
								+ color + ';"><label class="ui-awareness-textalign">' + j + '</label></div></td>';
						/*questionnaireString += '<div class="awarenessQuetionaireWorldViewTable">';*/
						questionnaireString += '<td style="width:65%;"><div class="ui-awareness-textalign" style="top:0px;" '								
								+ ' isEditor="true" editorLabel="'
								+ data[j]
								+ '" pathFields="component,structuredBody,component,section,entry,observation['
								+ index
								+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="'
								+ index + '"></div></td>';
						/*questionnaireString +='</div>';*/
						questionnaireString += '<td style="width:25%;"><div class="worldViewTwoRadio" finding="onchange" style="background-color: '
								+ color
								+ ';" isEditor="true" editorLabel="" pathFields="component,structuredBody,component,section,entry,observation['
								+ index
								+ ']" idSuffix="'
								+ index
								+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></td></tr></table>';
						index += 1;
						
						//alert("questionnaireString : "+questionnaireString);

					} else {
						questionnaireString += '<table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%"><div class="environmentQuetionaireNumber" style="background-color: '
								+ color + ';"><label class="ui-awareness-textalign">' + j + '</label></div></td>';
						/*questionnaireString += '<div class="awarenessQuetionaireWorldViewTable">';*/
						questionnaireString += '<td style="width:50%;"><div class="ui-awareness-textalign" style="top:0px;" '								
								+ ' isEditor="true" editorLabel="'
								+ data[j]
								+ '" pathFields="component,structuredBody,component,section,entry,observation['
								+ index
								+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="awarenessWorldView'
								+ index + '"></div></td>';
						/*questionnaireString +='</div>';*/
						questionnaireString += '<td style="width:10%;"><div class="worldViewTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[1'
								+ index
								+ ']" tagName="value" dataType="ED" editorType="EDTextBox"  idSuffix="awarenessWorldView1'
								+ index + '"></div></td>';
						questionnaireString += '<td style="width:10%;"><div class="worldViewTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[2'
								+ index
								+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="awarenessWorldView2'
								+ index + '"></div></td>';
						questionnaireString += '<td style="width:10%;"><div class="worldViewTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[3'
								+ index
								+ ']" tagName="value" dataType="ED" editorType="EDTextBox"  idSuffix="awarenessWorldView3'
								+ index + '"></div></td>';
						questionnaireString += '<td style="width:10%;"><div class="worldViewTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[4'
								+ index
								+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="awarenessWorldView4'
								+ index + '"></div></td></tr></table>';
						index += 1;
					}
				}

				if (!awarenessWorldView) {
					questionnaireString += '<table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%"><div class="environmentQuetionaireNumber" style="background-color: '
							+ color + ';"><label class="ui-awareness-textalign">' + j + '</label></div></td>';
					/*questionnaireString += '<div class="environmentQuetionaireTable">';*/
					questionnaireString += '<td style="width:65%;"><div class="ui-awareness-textalign" style="top:0px;"'							
							+ ' isEditor="true" editorLabel="'
							+ data[j]
							+ '" pathFields="component,structuredBody,component,section,entry,observation['
							+ index
							+ ']" tagName="code" dataType="CD" editorType="CDLabel" idSuffix="'
							+ index + '"></div></td>';
					/*questionnaireString +='</div>';*/
					questionnaireString += '<td style="width:25%;"><div class="environmentQuetionaireRadioYes" finding="onchange" style="background-color: '
							+ color
							+ ';" isEditor="true" editorLabel="" pathFields="component,structuredBody,component,section,entry,observation['
							+ index
							+ ']" idSuffix="'
							+ index
							+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></td></tr></table>';
					index += 1;
				}
			}
			
			$("#mainAwareness").append(questionnaireString);
			
			$("#mainAwareness").find('[finding="onchange"]').change(function() {
				thisObject.getTotal();
			});
		}
		totalArray += '<div class="awarenessTotal">GRAND TOTAL UL</div>';
		totalArray += '<div class="awarenessTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[41]" tagName="value" dataType="ED" editorType="EDTextBox"  idSuffix="41"></div>';
		totalArray += '<div class="awarenessTotalCheck"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation[42]" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="42"></div>';
		$("#total").append(totalArray);
		function getAwarenessMeaning() {
			var awarenessMeaning = new Array();
			awarenessMeaning.push("");
			awarenessMeaning
					.push("My life is filled with enthusiasm, passion and joy");
			awarenessMeaning.push("There is little to fear in my life.");
			awarenessMeaning
					.push("I see the universe as essentially being friendly");
			awarenessMeaning
					.push("My life is connected to something larger than myself");
			awarenessMeaning.push("I often feel close to a spiritual presence");
			awarenessMeaning
					.push("I have had an experience that has convinced me 'God is real'.");
			awarenessMeaning.push("I believe that I am immortal");
			awarenessMeaning.push("My life is productive and full of meaning.");
			awarenessMeaning
					.push("I let my 'inner voice' guide me rather than the expectations of others.");
			awarenessMeaning.push("I see my death as a step in my evolution");
			return awarenessMeaning;
		}
		function getAliveness() {
			var aliveness = new Array();
			aliveness.push("");
			aliveness.push("I feel a sense of balance in my life.");
			aliveness.push("I regularly enjoy hearty belly laughs");
			aliveness.push("I live my dreams");
			aliveness.push("I take time for solitude.");
			aliveness.push("I have at least two good friends in my life");
			aliveness.push("I feel the energy of optimum health");
			aliveness.push("I have a spiritual practice in my life.");
			aliveness.push("I feel that my life matters.");
			aliveness.push("Recreation time re-creates me");
			aliveness.push("I have the courage to say 'No'");
			return aliveness;
		}
		function getAwarenessPurpose() {
			var awarenessPurpose = new Array();
			awarenessPurpose.push("");
			awarenessPurpose
					.push("I wake up most days feeling energized to go to work.");
			awarenessPurpose
					.push("I have deep energy - feel a personal calling");
			awarenessPurpose.push("I am clear about how I measure my success");
			awarenessPurpose
					.push("I use my gifts to add real value to people's lives");
			awarenessPurpose
					.push("I work with people who honor the values I value.");
			awarenessPurpose.push("I speak the truth in my work");
			awarenessPurpose.push("I experience true joy in my works");
			awarenessPurpose
					.push("I make a living doing what I most love to do");
			awarenessPurpose
					.push("I can speak my purpose in one clear sentence");
			awarenessPurpose
					.push("I go to sleep most nights feeling 'This was a well lived day'.");
			return awarenessPurpose;
		}
		function getAwarenessWorldView() {
			var awarenessWorldView = new Array();
			awarenessWorldView.push("");
			awarenessWorldView.push("The universe is approximately how old?");
			awarenessWorldView.push("The earth is approximately how old?");
			awarenessWorldView.push("Humans are approximately how old?");
			awarenessWorldView.push("When did farming begin?");
			awarenessWorldView.push("When did history (writing) begin?");
			awarenessWorldView.push("When did the English language begin?");
			awarenessWorldView
					.push("When did humans first discover perspective - the ability to see 3-D?");
			awarenessWorldView
					.push("When did humans develop a sense of 'self' (self-reflective consciousness)?");
			awarenessWorldView
					.push("Can you have 'fear' without the concept of Linear Time?");
			awarenessWorldView
					.push("Do you have an awareness of the transcendent Self?");
			return awarenessWorldView;
		}

	}
	;

	function getTotal() {
		var yesCount = 0;
		var noCount = 0;
		$("#mainAwareness").find('[dataField="true"]').each(
				function(index, value) {
					if ($(value).is(':checked')) {
						if ($(this).val() == '1') {
							yesCount += 1;
						}
						if ($(this).val() == '0') {
							noCount += 1;
						}
					}
				});
		$("#EDDisplayValue41").val(yesCount);
		$("#EDDisplayValue41").trigger('change');
		$("#EDDisplayValue42").val(noCount);
		$("#EDDisplayValue42").trigger('change');
	}
	;

};