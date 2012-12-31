/**
 * 
 */
var HIN;
if (!HIN)
	HIN = {};

HIN.DocumentsVO = function() {
	this.startYear = null;
	//this.yearData = new HIN.HashMap();
	this.legends = new Array();
	this.monthData = new Array();
	this.documentDate = "";
	this.documentName = "";
	this.documentType = "";
	this.documentFileSize = 0;
	this.subscriberId = "";
	this.documentFileType = "";
	this.messageId = "";
	this.documentFromDate="";
	this.documentToDate="";
	this.patientId = "";
	this.startYear = "";
};

HIN.DocumentsVO.prototype.toString = function() {
	return "[" + this.startYear + "]";
};

HIN.DocumentsVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

HIN.DocumentsVO.prototype.setMessage = function(message) {
	if(message){
		this.message = message;
	}
	
};
