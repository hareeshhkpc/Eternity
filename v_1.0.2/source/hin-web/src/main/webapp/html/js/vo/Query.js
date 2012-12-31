var HIN;
if (!HIN)
	HIN = {};

HIN.Query = function() {
	this.id = null;
	this.messageRequired = false;
	this.conditionMap = new HIN.HashMap();
};

HIN.Query.prototype.addCondition = function(messageType, queryString) {
	this.conditionMap.put(messageType, queryString);
};

HIN.Query.prototype.getQueryString = function(messageType) {
	return this.conditionMap.get(messageType).value;
};

HIN.Query.prototype.getConditionMap = function() {
	return this.conditionMap;
};

HIN.Query.prototype.toString = function() {
	return "[" + this.id + " , " + this.conditionMap + "]";
};