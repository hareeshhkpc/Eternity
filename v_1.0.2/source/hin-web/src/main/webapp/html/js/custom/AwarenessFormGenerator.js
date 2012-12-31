$(document).ready(function() {
	loadAwarenessQuestionnaire();
	loadAwarenessQuestionnaireMeaning();
	loadAwarenessQuestionnairePurpose();
	loadAwarenessQuestionnaireWorldView();
});

function loadAwarenessQuestionnaire() {
	var questionnaireArray = getAwarenessQuestionnaire();
	$(questionnaireArray).each(function(index, question) {
		var questionnaire = loadHistory(index + 1, question);
		$('#awarenessAlivenessQuestionnaire').append(questionnaire);
	});
}

function getAwarenessQuestionnaire() {
	var history = [];

	history.push("I feel a sense of balance in my life.");
	history.push("I regularly enjoy hearty belly laughs");
	history.push("I live my dreams");
	history.push("I take time for solitude.");
	history.push("I have at least two good friends in my life");
	history.push("I feel the energy of optimum health");
	history.push("I have a spiritual practice in my life.");
	history.push("I feel that my life matters.");
	history.push("Recreation time re-creates me");
	history.push("I have the courage to say 'No'");
	return history;
}

function loadHistory(index, question) {
	var questionnaire = '<fieldset class="ui-grid-a">';
	questionnaire += '<div class="ui-block-a" style="width: 5%; border: 1px solid">';
	questionnaire += '<div style="margin-left:5px">';
	questionnaire += index;
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-b" style="width: 78.3%; border: 1px solid; border-left: 0px">';
	questionnaire += '<div style="margin-left:5px">';
	questionnaire += question;
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-c" style="height: 19px; width: 5%; border: 1px solid; border-left: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:15px">';
	questionnaire += '<input type="radio" name="question+' + index
			+ '" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-d"';
	questionnaire += 'style="width: 3%; border: 1px solid; border-left: 0px; height:19px; border-right: 0px;">';
	questionnaire += '<font size="1">&nbsp;&nbsp;Yes</font>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-e" style="height: 19px; width: 5%; border: 1px solid; border-right: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:15px">';
	questionnaire += '<input type="radio" name="question+' + index
			+ '" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-d" style="width: 3%; height:19px; border: 1px solid;">';
	questionnaire += '<font size="1">&nbsp;&nbsp;No</font>';
	questionnaire += '</div>';
	questionnaire += '</fieldset>';
	return questionnaire;
}

function loadAwarenessQuestionnaireMeaning() {
	var questionnaireArray = getAwarenessQuestionnaireMeaning();
	$(questionnaireArray).each(function(index, question) {
		var questionnaire = loadHistory(index + 1, question);
		$('#awarenessMeaningQuestionnaire').append(questionnaire);
	});
}

function getAwarenessQuestionnaireMeaning() {
	var awarenessMeaning = [];

	awarenessMeaning.push("My life is filled with enthusiasm, passion and joy");
	awarenessMeaning.push("There is little to fear in my life.");
	awarenessMeaning.push("I see the universe as essentially being friendly");
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

function loadAwarenessQuestionnairePurpose() {
	var questionnaireArray = getAwarenessQuestionnairePurpose();
	$(questionnaireArray).each(function(index, question) {
		var questionnaire = loadHistory(index + 1, question);
		$('#awarenessPurposeQuestionnaire').append(questionnaire);
	});
}

function getAwarenessQuestionnairePurpose() {
	var awarenessPurpose = [];

	awarenessPurpose
			.push("I wake up most days feeling energized to go to work.");
	awarenessPurpose.push("I have deep energy - feel a personal calling");
	awarenessPurpose.push("I am clear about how I measure my success");
	awarenessPurpose.push("I use my gifts to add real value to people's lives");
	awarenessPurpose.push("I work with people who honor the values I value.");
	awarenessPurpose.push("I speak the truth in my work");
	awarenessPurpose.push("I experience true joy in my works");
	awarenessPurpose.push("I make a living doing what I most love to do");
	awarenessPurpose.push("I can speak my purpose in one clear sentence");
	awarenessPurpose
			.push("I go to sleep most nights feeling 'This was a well lived day'.");
	return awarenessPurpose;
}
function loadAwarenessQuestionnaireWorldView() {
	var questionnaireArray = getAwarenessQuestionnaireWorldView();
	$(questionnaireArray).each(function(index, question) {
		var questionnaire = loadWorldView(index + 1, question);
		$('#awarenessWorldViewQuestionnaire').append(questionnaire);
	});
}

function getAwarenessQuestionnaireWorldView() {
	var awarenessWorldView = [];

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

function loadWorldView(index, question) {
	var questionnaire = '<fieldset class="ui-grid-a">';
	questionnaire += '<div class="ui-block-a" style="width: 5%; border: 1px solid">';
	questionnaire += '<div style="margin-left:5px">';
	questionnaire += index;
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-b" style="width: 78.3%; border: 1px solid; border-left: 0px">';
	questionnaire += '<div style="margin-left:5px">';
	questionnaire += question;
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-c" style="height: 16px; width: 4%;border: 1px solid; border-left: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:2px">';
	questionnaire += '<input type="text" size="3" class="ui-body-d ui-corner-all" name="" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-c" style="height: 16px; width: 4%;border: 1px solid; border-left: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:2px">';
	questionnaire += '<input type="text" size="3" class="ui-body-d ui-corner-all" name="" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-c" style="height: 16px; width: 4%;border: 1px solid; border-left: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:2px">';
	questionnaire += '<input type="text" class="ui-body-d ui-corner-all" size="3" name="" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-block-c" style="height: 16px; width: 4%;border: 1px solid; border-left: 0px;">';
	questionnaire += '<div style="margin-top: 0px; margin-left:2px">';
	questionnaire += '<input type="text" class="ui-body-d ui-corner-all" size="3" name="" value="" />';
	questionnaire += '</div>';
	questionnaire += '</div>';
	questionnaire += '</fieldset>';
	return questionnaire;
}
