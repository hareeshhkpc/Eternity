function Callback() {
	this.message = "";
	this.eventTypes = new Array();
	this.showMessage = showMessage;
	this.addEvent = addEvent;
	this.getEvents = getEvents;

	function showMessage(message) {
		this.message = message;
	}
	;

	function addEvent(eventType) {
		this.eventTypes.push(eventType);
	}
	;

	function getEvents() {
		var events = "";
		for ( var i = 0; i < this.eventTypes.length; i++) {
			events = events.concat(this.eventTypes[i] + "|");
		}
		events = events.substring(0, events.lastIndexOf("|"));
		return events;
	}
	;
};