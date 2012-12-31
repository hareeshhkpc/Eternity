var HIN;
if (!HIN)
	HIN = {};

HIN.ChartVO = function() {

	this.testType = "";
	this.patientId = "";
	/* this.testRange = ""; */
	this.testDate = new Date();
	this.testData = new Array();
	this.plotList = new Array();
	this.pathList = new Array();
	this.scaleList = new Array();
	this.scalePixel = new Array();
	this.titleArray = new Array();
	/* this.testRangePixel = 0.0; */
	this.testRangeMap = new Array();
	this.ymin = 0.0;
	this.ymax = 0.0;
	this.chartSeries = new Array();
	this.svgArray = new Array();
};

HIN.ChartVO.prototype.toString = function() {
	return "[" + this.ymin + " , " + this.ymax + "]";
};
