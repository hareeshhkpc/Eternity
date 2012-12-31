var HIN;
if (!HIN)
	HIN = {};
HIN.QuestionnaireFormGenerator = function() {
	this.questionID = 0;
}

HIN.QuestionnaireFormGenerator.prototype.generateUI = function(index, indexOfObs, question,
		questionnaireTitle) {
	var suffix = index + questionnaireTitle;
	this.questionID = this.questionID + 1;
	var id = this.questionID;

	/*var label = '<div class="ui-index">';
	label += '<div class="ui-text-align">';
	label += index;
	label += '</div>';
	label += '</div>';
	label += '<div class="ui-question">';
	label += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ suffix + '"></div>';
	label += '</div>';
	label += '<div class="ui-option" isEditor="true" editorLabel=""  pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" idSuffix="'
			+ suffix
			+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div>';
	return label;*/
	
	/*var label = '<div class="ui-questionnare-form-row"><div class="ui-questionnare-form-list" style="width: 2%;">';
	label += '<div class="ui-text-align">';
	label += index;
	label += '</div>';
	label += '</div>';
	label += '<div class="ui-question">';
	label += '<div class="ui-questionnare-form-list" style="width: 70%;margin-left:-1px;" isEditor="true"  editorLabel="'
			+ question
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ suffix + '"></div>';
	label += '</div>';
	label += '<div class="ui-questionnare-form-list" style="width: 24%;padding:1px;margin-left:-1px;" isEditor="true" editorLabel=""  pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" idSuffix="'
			+ suffix
			+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></div>';
	return label;*/
	
	var label = '<div class="ui-questionnare-form-row"><table class="ui-table-questionnare"><tr><td style="text-align:center;width:3%">';
	/*label += '<div class="ui-text-align">';*/
	label += index;
	/*label += '</div>';*/
	label += '</td>';
	/*label += '<div class="ui-question">';*/
	label += '<td style="width:65%;"><div class="ui-questionnare-form-list" isEditor="true"  editorLabel="'
			+ question
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ suffix + '"></div></td>';
	/*label += '</div>';*/
	label += '<td style="width:25%;"><div class="ui-option ui-questionnare-form-list" isEditor="true" editorLabel=""  pathFields="component,structuredBody,component,section,entry,observation['
			+ indexOfObs
			+ ']" idSuffix="'
			+ suffix
			+ '" tagName="value" dataType="ED" editorType="EDBoolean"></div></td></tr></table></div>';
	return label;
	
};


HIN.QuestionnaireFormGenerator.prototype.appendTotalUI = function(indexOfObs, questionnaireTitle) {
		
	this.questionID = this.questionID + 1;
	//var id = this.questionID;
	var id = indexOfObs;
	var suffix = questionnaireTitle + "YesTotal";
		
	var totalDiv = '<div class="ui-body-d ui-space-total">';
	totalDiv += '<font size="3">TOTAL</font>';
	totalDiv += '</div>';
	totalDiv += '<div class="ui-body-d ui-total-count" isEditor="true" style="background:none;" editorLabel="" value=""';
	totalDiv += 'pathFields="component,structuredBody,component,section,entry,observation['+id+']"';
	totalDiv += 'tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'+suffix+'"></div>';
	
	id = indexOfObs+1;
	this.questionID = id;
	suffix = questionnaireTitle + "NoTotal";
	
	totalDiv += '<div class="ui-body-d ui-total-count" isEditor="true" style="background:none;" editorLabel="" value=""';
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


HIN.QuestionnaireFormGenerator.prototype.loadStressQuestionnaire = function(index, question1, question2, question3,
		group1, group2, group3) {
	var id = this.questionID;
	id = id + 1;
	
	var questionnaire = '<div>';
	questionnaire += '<div class="ui-stress-question1">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question1
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group1 + '' + id + '"></div>';
	questionnaire += '</div>';

	id = id + 1;
	questionnaire += '<div class="ui-stress-question">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question2
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group2 + '' + id + '"></div>';
	questionnaire += '</div>';

	id = id + 1;
	this.questionID = id;

	questionnaire += '<div class="ui-stress-question">';
	questionnaire += '<div class="ui-text-align" isEditor="true"  editorLabel="'
			+ question3
			+ '" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="code" dataType="CD" editorType="CDLabel"  idSuffix="'
			+ id + '"></div>';
	questionnaire += '</div>';
	questionnaire += '<div class="ui-stress-rate"  isEditor="true" editorLabel="" value="" pathFields="component,structuredBody,component,section,entry,observation['
			+ id
			+ ']" tagName="value" dataType="ED" editorType="EDTextBox" idSuffix="'
			+ group3 + '' + id + '"></div>';
	questionnaire += '</div>';

	questionnaire += '</div>';
	return questionnaire;
}
;


HIN.QuestionnaireFormGenerator.prototype.calculateTotalStressQuestionnaire = function(count, arraySize) {
	
	var totalYesPhysical = 0;
	var totalNoPhysical = 0;
	var totalYesEmotional = 0;
	var totalNoEmotional = 0;	
	var totalYesSpiritual = 0;
	var totalNoSpiritual = 0;
	var totalYesMental = 0;
	var totalNoMental = 0;
	var totalYesRelational = 0;
	var totalNoRelational = 0;
	var totalYesEnvironmental = 0;
	var totalNoEnvironmental = 0;
	
	for ( var i = count; i <= arraySize; i++) {
		var idSuffix = i + count;
		if ($("input[id='radioEditor1physical" + i + "']:checked").val() == 1) {
			totalYesPhysical += 1;
		}
		if ($("input[id='radioEditor2physical" + i + "']:checked").val() == 0) {
			totalNoPhysical += 1;
		}
		if ($("input[id='radioEditor1emotional" + i + "']:checked").val() == 1) {
			totalYesEmotional += 1;
		}
		if ($("input[id='radioEditor2emotional" + i + "']:checked").val() == 0) {
			totalNoEmotional += 1;
		}
		if ($("input[id='radioEditor1spiritual" + i + "']:checked").val() == 1) {
			totalYesSpiritual += 1;
		}
		if ($("input[id='radioEditor2spiritual" + i + "']:checked").val() == 0) {
			totalNoSpiritual += 1;
		}
		if ($("input[id='radioEditor1mental" + i + "']:checked").val() == 1) {
			totalYesMental += 1;
		}
		if ($("input[id='radioEditor2mental" + i + "']:checked").val() == 0) {
			totalNoMental += 1;
		}
		if ($("input[id='radioEditor1relational" + i + "']:checked").val() == 1) {
			totalYesRelational += 1;
		}
		if ($("input[id='radioEditor2relational" + i + "']:checked").val() == 0) {
			totalNoRelational += 1;
		}
		if ($("input[id='radioEditor1environmental" + i + "']:checked").val() == 1) {
			totalYesEnvironmental += 1;
		}
		if ($("input[id='radioEditor2environmental" + i + "']:checked").val() == 0) {
			totalNoEnvironmental += 1;
		}
	}
	
	$("#physicalyes").find("#EDDisplayValuephysical").val(totalYesPhysical).trigger('change');
	$("#physicalno").find("#EDDisplayValuephysical").val(totalNoPhysical).trigger('change');
	
	$("#emotionalyes").find("#EDDisplayValueemotional").val(totalYesEmotional).trigger('change');
	$("#emotionalno").find("#EDDisplayValueemotional").val(totalNoEmotional).trigger('change');
	
	$("#spiritualyes").find("#EDDisplayValuespiritual").val(totalYesSpiritual).trigger('change');
	$("#spiritualno").find("#EDDisplayValuespiritual").val(totalNoSpiritual).trigger('change');
	
	$("#mentalyes").find("#EDDisplayValuemental").val(totalYesMental).trigger('change');
	$("#mentalno").find("#EDDisplayValuemental").val(totalNoMental).trigger('change');
	
	$("#relationalyes").find("#EDDisplayValuerelational").val(totalYesRelational).trigger('change');
	$("#relationalno").find("#EDDisplayValuerelational").val(totalNoRelational).trigger('change');
	
	$("#environmentalyes").find("#EDDisplayValueenvironmental").val(totalYesEnvironmental).trigger('change');
	$("#environmentalno").find("#EDDisplayValueenvironmental").val(totalNoEnvironmental).trigger('change');

};


