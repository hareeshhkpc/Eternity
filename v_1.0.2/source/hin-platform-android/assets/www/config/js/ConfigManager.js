/* ConfigManager  */

function ConfigManager() {
	var configManager = this;
	this.configOut = {};
	this.configInput = {};
	this.responceCallback = null;
	this.existingMessageList = [];
	
	this.className = "ConfigManager";
	
	this.init = init;
	this.sendAndReceive = sendAndReceive;
	this.loadAllMessageTypes = loadAllMessageTypes;
	this.loadSelectedMessageType = loadSelectedMessageType;
	this.loadClassView = loadClassView;
	this.saveMetaInfo = saveMetaInfo;
	this.uploadSchema = uploadSchema;
	this.loadAllExistingMessageTypes = loadAllExistingMessageTypes;
	this.loadClassViewOfMessageType = loadClassViewOfMessageType;
	this.sendAndReceiveConfigAction = sendAndReceiveConfigAction;
	this.saveConfiguration = saveConfiguration;
	this.updateParentPathRecursively = updateParentPathRecursively;
	
	function init(){
		
	}
	
	function saveMetaInfo(metaInfo, callback){
		configManager.configInput.action = ConfigAction.META_INFO_SAVE;
		configManager.configInput.metaInfo = metaInfo;
		sendAndReceive(callback);
	}
	
	function loadClassView(className, tagName, callback){
		configManager.configInput.action = ConfigAction.SHOW_CLASS_VIEW;
		configManager.configInput.configClassType = className;
		configManager.configInput.tagName = tagName;
		sendAndReceive(callback);
	}
	
	function loadSelectedMessageType(messageType, callback){
		configManager.configInput.action = ConfigAction.LIST_ENTRY_POINTS;
		configManager.configInput.messageType = messageType;
		sendAndReceive(callback);
	}
	
	function loadAllMessageTypes(callback){
		configManager.configInput.action = ConfigAction.LIST_MESSAGE_TYPES;
		sendAndReceive(callback);
	}
	
	function sendAndReceive(callback){		
		var encoded = $.toJSON(configManager.configInput);
		
		//alert("Input: " + encoded);

		$.ajax({
			type : "POST",
			url : "/hin-web/ConfigServices",
			data : "data=" + encoded,
			dataType : "json",
			cache : false,
			success : function(resp) {
				//alert($.toJSON(resp));
				configManager.configOut = resp;
				callback(resp);
			},

			error : function(request, error) {				
				alert(request + ": " + error);
			}
		});
	}
	
	function sendAndReceiveConfigAction(action){		
		var encoded = $.toJSON(configManager.configInput);
		
		//alert("Input: " + encoded);

		$.ajax({
			type : "POST",
			url : "/hin-web/ConfigServices",
			data : "data=" + encoded + "&action=" + action,
			dataType : "json",
			cache : false,
			success : function(resp) {
				//alert($.toJSON(resp));
				configManager.configOut = resp;
				try{
					configManager.responceCallback(resp);
				} catch(e){
					alert("Error while calling callback: " + e);
				}
			},

			error : function(request, error) {				
				alert(request + ": " + error);
			}
		});
	}
	
	function uploadSchema(formId, targetId){
		$('#' + formId).attr('action', '/hin-web/ConfigServices');
		$('#' + formId).attr('target', targetId);
		$('#' + formId).submit();
	}
	
	function loadAllExistingMessageTypes(callback){
		configManager.responceCallback = function(resp){
			configManager.existingMessageList = resp;
			callback(resp);
		};
		sendAndReceiveConfigAction(ConfigAction.LIST_MESSAGE_TYPES);
	}
	
	function loadClassViewOfMessageType(msgIndex, callback){
		configManager.responceCallback = function(resp){
			//alert("BEFORE:\n" + $.toJSON(configManager.configOut));
			//updateParentPathRecursively(configManager.configOut);
			//alert("AFTER:\n" + $.toJSON(configManager.configOut));
			callback(configManager.configOut);
		}
		var configObject = null;
		
		var path = 'configManager.existingMessageList[' + msgIndex + ']';
		//alert("Path: " + path);
		try{
			configObject = eval(path);
			//alert("Value: " + $.toJSON(configObject));
		} catch(e){
			alert("Error while evaluating expression: " + e);
			return;
		}
		
		configManager.configInput = configObject;
		sendAndReceiveConfigAction(ConfigAction.SHOW_CLASS_VIEW);
	}
	
	function updateParentPathRecursively(configItem){
		if(!("configType" in configItem)){
			return;
		}
		
		if(configItem.configType === "MESSAGE"){
			configItem.parentPath = "NONE";
			if("configClass" in configItem){
				configItem.configClass.parentPath = "MESSAGE";
				updateParentPathRecursively(configItem.configClass);
			}
		} else if(configItem.configType === "CLASS"){
			if("classes" in configItem && configItem.classes.length > 0){
				for(i = 0; i < configItem.classes.length; i++){
					if("parentPath" in configItem && configItem.parentPath === 'MESSAGE'){
						configItem.classes[i].parentPath = "configClass";
					} else {
						configItem.classes[i].parentPath = configItem.parentPath + ".classes[" + i + "]";
					}					
					updateParentPathRecursively(configItem.classes[i]);
				}
			}
			if("fields" in configItem && configItem.fields.length > 0){
				for(j = 0; j < configItem.fields.length; j++){
					if("parentPath" in configItem && configItem.parentPath === 'MESSAGE'){
						configItem.fields[j].parentPath = "configClass";
					} else {
						configItem.fields[j].parentPath = configItem.parentPath + ".fields[" + j + "]";
					}
					updateParentPathRecursively(configItem.fields[j]);
				}
			}
			if("attributes" in configItem && configItem.attributes.length > 0){
				for(k = 0; k < configItem.attributes.length; k++){
					if("parentPath" in configItem && configItem.parentPath === 'MESSAGE'){
						configItem.attributes[k].parentPath = "configClass";
					} else {
						configItem.attributes[k].parentPath = configItem.parentPath + ".attributes[" + k + "]";
					}
				}
			}
		} else if(configItem.configType === "FIELD"){
			if("attributes" in configItem && configItem.attributes.length > 0){
				for(i = 0; i < configItem.attributes.length; i++){
					configItem.attributes[i].parentPath = configItem.parentPath + ".attributes[" + i + "]";
				}
			}
		} 		
	}
	
	function saveConfiguration(callback){
		configManager.responceCallback = function(resp){
			//configManager.existingMessageList = resp;
			callback(resp);
		};
		
		configManager.configInput = configManager.configOut;
		sendAndReceiveConfigAction(ConfigAction.SAVE_CONFIGURATION);
	}
}