/**
 * Test Class for any process initialization script testing. Initilize this class with the ID of the HTML
 * container where the logging should be done. Then call testRun() with the message type and two call back 
 * function references so that a call back can be made just before and after the test execution.
 * @param logContainerID - The HTML container ID, eg: a DIV, where the log is to be displayed
 * @returns
 */
function ProcessInitScriptTest(logContainerID) {
	
	var thisObject = this;	
	
	this.logContainerID = logContainerID;
	
	this.testRun = testRun;
	this.loadConfiguration = loadConfiguration;
	this.logTest = logTest;
	this.htmlEncode = htmlEncode;
	this.htmlDecode = htmlDecode;
	this.param = {};
	
	this.msgBinder = null;

	function testRun(messageType, beforeCallBackFunction, afterCallBackFunction){
		// Mandatory: loading the configuraiton of your message
		thisObject.loadConfiguration(messageType, testRunCallBack);
		
		function testRunCallBack(){
			
			// Give a change for the setup before the test
			if(beforeCallBackFunction)
				beforeCallBackFunction(thisObject.msgBinder);
			
			var scriptUrl = '/hin-web/message-scripts/' + thisObject.msgBinder.messageTypeID + '.js';
			thisObject.logTest("Script: " + scriptUrl);
			
			$.ajax({
				type : "GET",
				url : scriptUrl,
				data : "",
				dataType : "html",
				cache : false,
				success : function(jsString) {
					try{
						//thisObject.logTest(jsString);
	
						eval(jsString + '; new ' + thisObject.msgBinder.messageTypeID + '(null, thisObject.msgBinder, thisObject).run();');
						
						//thisObject.logTest("Message xml: \n" +  XmlUtil.xmlToString(thisObject.msgBinder.messageObject.getXML()));
						
					}catch(e){
						thisObject.logTest("ERROR: " + e);
						return;
					}finally{
						// Clean up the memory if a call back for the same is supplied
						if(afterCallBackFunction)
							afterCallBackFunction(thisObject.msgBinder);
					}
				},
	
				error : function(request, error) {				
					thisObject.logTest("Failed to get init script: " + error);
					// Clean up the memory if a call back for the same is supplied
					if(afterCallBackFunction)
						afterCallBackFunction(thisObject.msgBinder);
				}
			});
		}
	}
	

	function loadConfiguration(messageType, callBackFunction) {
		getMessage('/message-configuration/' + messageType + '.xml',
			function(configData) {

				var doc = new ConfigDocument(configData)
				var result = 0;
				result = doc.getArtifactId();
				// alert("result :"+result);

				thisObject.logTest("Configuration Loaded");

				thisObject.msgBinder = new MessageAndUIBinder('', null,	messageType);

				var message = doc.createMessage();
				thisObject.msgBinder.messageObject = message;
				
				callBackFunction();
				
			}, function(status) {
				thisObject.logTest("Failed to load configuration. Status: " + status);
			}
		);
	}
	
	function logTest(logEntry){
		var cval = $('#' + thisObject.logContainerID).val();
		if(cval && cval != '')
			cval = cval + '\n\n';
		cval = cval + logEntry;
		$('#' + thisObject.logContainerID).val(cval);
		
		var psconsole = $('#' + thisObject.logContainerID);
	    psconsole.scrollTop(
	        psconsole[0].scrollHeight - psconsole.height()
	    );
	}

	function htmlEncode(value){
	    if (value) {
	        return jQuery('<div />').text(value).html();
	    } else {
	        return '';
	    }
	}
	 
	function htmlDecode(value) {
	    if (value) {
	        return $('<div />').html(value).text();
	    } else {
	        return '';
	    }
	}
	
};
