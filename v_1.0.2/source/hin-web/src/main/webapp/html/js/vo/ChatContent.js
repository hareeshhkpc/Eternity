var HIN;
if (!HIN)
	HIN = {};

HIN.ChatContent = function() {
	this.sender = null;
	this.receiver = null;
	this.content = null;
	this.sendTime = null;
	this.readTime = null;
	this.readStatus = null;
	this.saveType = null;
	this.instanceId = null;
	chatContent = this;
};
HIN.ChatContent.prototype.toString = function() {
	return "[" + this.instanceId + " , " + this.sender + " , " + this.receiver + " , " + this.content
			+ " , " + this.readStatus + " , " + this.saveType +	"]";
};
