var HIN;
if (!HIN)
	HIN = {};

HIN.SearchVO = function() {
	this.value = "";
	this.min = 3;
	this.max = 4;
	this.type = "";
	this.serverURI = "";
	this.patientId = new Array();
	this.patientId1 = "";
	this.testName = new Array();
	this.id = null;
	this.messageType = "";
	this.fromDate = "";
	this.toDate = "";
	this.artifactId = "";
	this.displayValue = "";
	this.role = "";
	this.parameterList = new Array();
	this.queryString = "";
	this.filterColumn = "";
	this.placeHolder = "";
	this.assigningOrganizationID = "";
	this.searchServiceClass="SearchService";
};

HIN.SearchVO.prototype.clear = function() {
	this.value = "";
	this.min = 3;
	this.max = 4;
	this.id = null;
	this.displayValue = "";
	this.queryString = "";
	this.placeHolder = "";
};

HIN.SearchVO.prototype.toString = function() {
	return "[" + this.value + " , " + this.min + " , " + this.max + " , "
			+ this.type + " , " + this.serverURI + " , " + this.id + " , "
			+ this.messageType + " , " + this.displayValue + " , "
			+ this.queryString + ", " + this.fromDate + " ," + this.toDate + " ]";
};