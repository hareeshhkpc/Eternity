var HIN;
if (!HIN)
	HIN = {};
/**
 * TaskVO
 *   
 * Represent the task information against a message, which will be
 * identify by workflow configuration based on the message type.
 */
HIN.TaskVO = function() {
	/** taskId holds the task id. */
	this.taskId = "";
	/** messageID holds the messageId of the task. */
	this.messageID = "";
	/**
	 * taskOutComes holds outcomes of the task which is dependend on the
	 * workflow task
	 */
	this.taskOutComes = [];
	/**
	 * assignablePeople holds assignablePeople of the task which is dependend on
	 * the workflow task
	 */
	this.assignablePeople = new HIN.HashMap();

	/** assignee holds the assignee of task. */
	this.assignee = "";
	/** outCome holds the outCome of task. */
	this.outCome = "";
	/** taskName holds the name of task. */
	this.taskName = "";
};

HIN.TaskVO.prototype.addOutCome = function(outcome) {
	this.taskOutComes.push(outcome);
};

HIN.TaskVO.prototype.addAssignablePeople = function(key, value) {
	this.assignablePeople.put(key, value);
};
/**
 * getOutComes method will return all outcomes under task.
 */
HIN.TaskVO.prototype.getOutComes = function() {
	return this.taskOutComes;
};
/**
 * getAssignablePeople method will return all assignees under task.
 */
HIN.TaskVO.prototype.getAssignablePeople = function(key) {
	var map = this.assignablePeople.get(key);
	if (map) {
		return map.value;
	}
	return null;
};

HIN.TaskVO.prototype.toString = function() {
	return "[" + this.taskId + " , " + this.messageID + " , " + " , "
			+ this.taskOutComes + ", " + this.assignablePeople + ","
			+ this.assignee + "," + this.outCome + "," + this.taskName + "]";
};
