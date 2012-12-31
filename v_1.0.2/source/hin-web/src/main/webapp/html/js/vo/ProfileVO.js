var HIN;
if (!HIN)
	HIN = {};

HIN.ProfileVO = function() {
	this.subscriberId = "";
	this.name="";
	this.imageBase64="";
	this.age="";
	this.gender="";
	this.telecom="";
	this.state="";
	this.timeLapse="";
	this.role="";
	
	
	this.prefixName="";
	this.givenName="";
	this.familyName="";
	this.suffixName="";
	this.getFullName="";
};

HIN.ProfileVO.prototype.toString = function() {

};

HIN.ProfileVO.prototype.setMessage = function(message) {
	
};