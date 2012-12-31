var HIN;
if (!HIN)
	HIN = {};

HIN.ProcessVO = function() {
	this.groupName = null;
	this.stepName = null;
	this.formHtml = null;
	this.longDescription = null;
	this.processName = null;
	this.processValues = null;
	this.forms = [];
	this.messageTypes = new HIN.HashMap();
};

HIN.ProcessVO.prototype.addMessageGroup = function(key) {
	alert("ProcessVO.prototype.addMessageGroup");

	/*
	 * if (this.messageTypes.get(key) == null) { this.messageTypes.put(key, 1) }
	 * else { var map = this.messageTypes.get(key); map.value = map.value + 1; }
	 */

	/*
	 * var object = new Object(); object.messageType = messageType; object.count =
	 * count;
	 * 
	 * var key = messageType.title;
	 * 
	 * if (this.messageGroups.get(key) == null) { this.messageGroups.put(key,
	 * object) } else { var map = this.messageGroups.get(key); var object =
	 * map.value; object.count = object.count + count; // map.value = map.value +
	 * count; }
	 */

};

HIN.ProcessVO.prototype.addMessageType = function(key) {

	if (this.messageTypes.get(key) == null) {
		this.messageTypes.put(key, 1)
	} else {
		var map = this.messageTypes.get(key);
		map.value = map.value + 1;
	}

};

HIN.ProcessVO.prototype.getFormsByMessageType = function(messageType,
		instanceId) {
	var messageTypeForms = [];
	for ( var index = 0; index < this.forms.length; index++) {
		if (messageType == this.forms[index].messageType) {
			this.forms[index].instanceId = instanceId;
			messageTypeForms.push(this.forms[index]);
		}
	}
	return messageTypeForms;

};

HIN.ProcessVO.prototype.getFormsByTypeName = function(typeName, instanceId) {
	var messageTypeForms = [];
	for ( var index = 0; index < this.forms.length; index++) {
		if (typeName == this.forms[index].typeName) {
			this.forms[index].instanceId = instanceId;
			messageTypeForms.push(this.forms[index]);
		}
	}
	return messageTypeForms;

};
