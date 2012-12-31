
AppUtil = {};

AppUtil.isArray = function(obj) {
    return (obj && obj.constructor && obj.constructor.toString().indexOf("Array") > -1);
}

AppUtil.getEvenClone = function(event){
	var cloneEvent = {
		type		: event.type, 
		data		: event.data, 
		trigger		: event.trigger, 
		eventSource	: event.eventSource, 
		broadCaster	: event.broadCaster
	};
	return cloneEvent;
};

AppUtil.getErrorDetails = function(errorObject, customMessage){
	msg = customMessage;
	if(errorObject.name)
		msg += " [name: " + errorObject.name + "]";
	if(errorObject.message)
		msg += " [message: " + errorObject.message + "]";
	return errorObject;
};

AppUtil.getFormattedDate = function(date, options){
	this.opts = (options && options !== null) ? options : ({ live: false, units: []});
	return $.easydate.format_date( new Date(date), this.opts);
};