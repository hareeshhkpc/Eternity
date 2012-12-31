var HIN;
if (!HIN)
	HIN = {};

HIN.StepGroup = function() {
	this.groupName = null;
	this.state = null;
	this.steps = [];
};

HIN.StepGroup.prototype.addStep = function(step) {
	this.steps.push(step);
};

HIN.StepGroup.prototype.getState = function() {
	this.state = "read";
	for ( var stepIndex = 0; stepIndex < this.steps.length; stepIndex++) {
		var state = this.steps[stepIndex].state;
	//	alert("Group : " + this.steps[stepIndex].stepName + " : " + state)
		if (state == "current") {
			this.state = state;
			break;
		}
		if (state == "unread") {
			this.state = state;
			//break;
		}

	}
	return this.state;
};

HIN.StepGroup.prototype.toString = function() {
	return "[" + this.groupName + " , " + this.state + " , " + this.steps + "]";
};