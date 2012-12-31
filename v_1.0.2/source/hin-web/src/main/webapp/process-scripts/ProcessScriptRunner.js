/**
 * PRPA_MT201000HT03.
 */

function ProcessScriptRunner(appController, scriptAsString) {
	
	var thisObject = this;
	
	this.appController = appController;
	this.script = new Function(scriptAsString);
	
	this.run = function() {
				
	}

};
