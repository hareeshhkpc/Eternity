var HIN;
if (!HIN)
	HIN = {};

HIN.ObservationVO = function() {

	this.patientId = "";
	this.testName = "";
	this.testValue = 0;
	this.messageType = "";
	this.observationTests = [];
	this.observationValue = [];
	this.organizationId="";
};

HIN.ObservationVO.prototype.toString = function() {
	return "[" + this.patientId + " , " + this.messageType + " , "
			+ this.testName + " , " + this.testValue + "]";
};
