var HIN;
if (!HIN)
	HIN = {};

HIN.StatisticsVO = function() {
	this.month = null;
	this.year = null;
	this.dayArray = new Array();
	this.monthArray = new Array();
	this.dayCount = null;
	this.monthCount = null;
	this.yearCount = null;
	this.type = null;
	this.program = null;
	this.status = null;
	this.facility = null;
};

HIN.StatisticsVO.prototype.clear = function() {
	this.month = null;
	this.year = null;
};

HIN.StatisticsVO.prototype.toString = function() {
	return "[" + this.month + " , " + this.year+ "]";
};