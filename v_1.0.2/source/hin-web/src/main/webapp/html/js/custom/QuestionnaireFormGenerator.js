var HIN;
if (!HIN)
	HIN = {};
HIN.QuestionnaireFormGenerator = function() {
	this.questionID = 0;
}

HIN.QuestionnaireFormGenerator.prototype.generateUI = function(index, question,
		questionnaireTitle) {
	var suffix = index + questionnaireTitle;
	this.questionID = this.questionID + 1;
	var id = this.questionID;

	var label = '<div class="ui-index">';
	label += '<div class="ui-text-align">';
	label += index;
	label += '</div>';
	label += '</div>';
	label += '<div class="ui-question">';
	label += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ suffix + '"></div>';
	label += '</div>';
	label += '<div class="ui-option" isEditor="true" editorLabel=""  pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" idSuffix="'
			+ suffix
			+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div>';
	return label;
};


HIN.QuestionnaireFormGenerator.prototype.appendTotalUI = function(questionnaireTitle) {
	
	this.questionID = this.questionID + 1;
	var id = this.questionID;
	var suffix = questionnaireTitle + "YesTotal";
		
	var totalDiv = '<div class="ui-body-d ui-space-total">';
	totalDiv += '<font size="3">TOTAL</font>';
	totalDiv += '</div>';
	totalDiv += '<div class="ui-body-d ui-total-count" isEditor="true" editorLabel="" value=""';
	totalDiv += 'pathFields="component,structuredBody,component,section,entry,observation['+id+']"';
	totalDiv += 'tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'+suffix+'"></div>';
	
	id = this.questionID+1;
	this.questionID = id;
	suffix = questionnaireTitle + "NoTotal";
	
	totalDiv += '<div class="ui-body-d ui-total-count" isEditor="true" editorLabel="" value=""';
	totalDiv += 'pathFields="component,structuredBody,component,section,entry,observation['+id+']"';
	totalDiv += 'tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'+suffix+'"></div>';
	totalDiv += '';
	return totalDiv;
	
};



HIN.QuestionnaireFormGenerator.prototype.calculateTotal = function(size,
		questionnaireTitle) {
	
	var yesTotalCountID = questionnaireTitle + "YesTotal";
	var noTotalCountID = questionnaireTitle + "NoTotal";
	var yesCount = 0;
	var noCount = 0;
	
	for (i = 1; i <= size; i++) {
		
		var idSuffix = i + questionnaireTitle;
		if ($("input[id='radioEditor1" + idSuffix + "']:checked").val() == 1) {
			yesCount += 1;
		}
		if ($("input[id='radioEditor2" + idSuffix + "']:checked").val() == 0) {
			noCount += 1;
		}
	}
	
	$("#EDDisplayValue"+yesTotalCountID).val(yesCount);
	$("#EDDisplayValue"+yesTotalCountID).trigger('change');
	$("#EDDisplayValue"+noTotalCountID).val(noCount);
	$("#EDDisplayValue"+noTotalCountID).trigger('change');
	
};


