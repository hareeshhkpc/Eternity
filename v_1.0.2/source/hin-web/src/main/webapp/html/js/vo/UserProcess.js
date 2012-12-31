var HIN;
if (!HIN)
	HIN = {};

HIN.UserProcess = function() {
	this.processName = "";
	this.processIds = [];
};

HIN.UserProcess.prototype.addProcessIds = function(processIds) {
	for ( var index = 0; index < processIds.length; index++) {
		this.processIds.push(processIds[index]);
	}
};

HIN.UserProcess.prototype.count = function() {
	return this.processIds.length;
};

HIN.UserProcess.prototype.toString = function() {
	return "[" + this.processName + "," + this.processIds + "]";
};
