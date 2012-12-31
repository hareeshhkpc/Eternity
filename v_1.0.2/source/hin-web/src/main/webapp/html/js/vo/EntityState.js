/**
 * 
 */
var HIN;
if (!HIN)
	HIN = {};

HIN.EntityState = function() {
	this.entityid = null;
	this.state = null;
	this.statevalue = null;
	this.time = null;
	this.assigningOrganizationID = null;
};

HIN.EntityState.prototype.toString = function() {
	return "[" + this.entityid + " , " + this.state + " , " + this.statevalue
			+ " , " + this.time + " , " + this.assigningOrganizationID
	"]";
};