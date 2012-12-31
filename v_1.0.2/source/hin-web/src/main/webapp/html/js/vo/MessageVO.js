var HIN;
if (!HIN)
	HIN = {};

HIN.MessageVO = function() {
	this.id = null;
	this.type = null;
	this.message = null;
	this.handler = null;
};

HIN.MessageVO.prototype.clear = function() {
	this.id = null;
	this.type = null;
	this.message = null;
	this.handler = null;
};

HIN.MessageVO.prototype.getSerializedMessage = function() {
	return new XMLSerializer().serializeToString(this.message);
};

HIN.MessageVO.prototype.toString = function() {
	return "[" + this.id + " , " + this.type + " , " + this.message + "]";
};