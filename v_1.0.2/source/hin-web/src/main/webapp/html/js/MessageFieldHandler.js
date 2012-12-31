var MFH = (function(window, undefined){
	
	var config,
		messageFieldHandler = function(jsonConfigParams){
			if(jsonConfigParams){
				config = $.parseJSON(jsonConfigParams);
			}
			return messageFieldHandler;
		},
		version = 'v1.0';
	
	messageFieldHandler.help = function(){
		alert("MessageFieldHandler " + version);
		return messageFieldHandler;
	};
	
	messageFieldHandler.showConfig = function(){
		alert(config);
		return messageFieldHandler;
	};
	
	return messageFieldHandler;
	
}(window));