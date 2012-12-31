function AgeManagementScript(processDefinition, appController){
	var thisObject = this;
	
	this.processDefinition = {
				messageTypes: 
					[{name: 'PRPA_MT201000HT03': {
						messageIds: []
					}}, 
					{name: 'PRPA_MT410001HT02': {
						messageIds: []
					}}]};//processDefinition;
	this.appController = appController;
	
	this.initialize = function(callBackFunction){
		alert("initialize : " + thisObject.processDefinition);
		
		/*loadConfiguration(0, thisObject.processDefinition.messageTypes, callBackFunction);
		
		function loadConfiguration(index, processDef, callBackFunction){
			var messageType = processDef[index].name;
			alert("Loading " + messageType);
			AgeManagementScript.loadConfig(messageType, function(msgBinder){
				alert("msgBinder: " + msgBinder);
				if(callBackFunction)
					callBackFunction(msgBinder);
			});
		}*/
	};
	
	this.createMessage = function(messageType, callBackFunction){
		alert("createMessage : " + messageType);
		AgeManagementScript.loadConfig(messageType, function(msgBinder){
			alert("msgBinder: " + msgBinder);
			if(callBackFunction)
				callBackFunction(msgBinder);
		});
	};
	
	AgeManagementScript.loadConfig = function(messageType, callBackFunction){
		getMessage('/message-configuration/' + messageType + '.xml',
			function(configData) {

				var doc = new ConfigDocument(configData)
				var result = 0;
				result = doc.getArtifactId();
				// alert("result :"+result);

				thisObject.log("Configuration Loaded");

				var msgBinder = new MessageAndUIBinder('', null,	messageType);
				var message = doc.createMessage();
				msgBinder.messageObject = message;

				if(callBackFunction)
					callBackFunction(msgBinder);
				
			}, function(status) {
				thisObject.log("Failed to load configuration. Status: " + status);
			}
		);
	} 
	
	
	this.log = function(message) {
		alert(message);
	}
};
