function BIOCLIP_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.getFieldIdList = getFieldIdList;
	this.bioClipUploadHandler = bioClipUploadHandler;
	this.messageAndUIBinder = thisObject.message.messageAndUIBinder;


	function initialize() {

		try {
			//alert("initialize");
			if (message.messageAndUIBinder) {
				message.messageAndUIBinder.addEditorListener("upload","uploadListener",thisObject.bioClipUploadHandler);
			}

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			//alert("onLoad");
			var patientId = appController.getComponent("Context").getPatient();
			$('#patientId').attr("value",patientId);
			

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	
	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;
	
	function getFieldIdList(){
		//var fieldIdList = [];
		var fieldIdList = new HIN.HashMap();
		
		/*for(var i = 1;i <= 5; i++){
			fieldIdList.push(["PQInplaceDisplayValue"+i,"biospaceText"+i]);
		}*/
		
		fieldIdList.put('Vascular  Age:','bioClipText1');
		fieldIdList.put('Heart Rate:','bioClipText2');
		fieldIdList.put('SI:','bioClipText3');
		fieldIdList.put('RI:','bioClipText4');
		fieldIdList.put('SP02 (Oxygenation):','bioClipText5');
		
		return fieldIdList;
		
	}
	
	function bioClipUploadHandler(extractedValues){
		//alert("in handler:"+extractedValues);
		var fieldIdList = thisObject.getFieldIdList();
			try {
				eval('var data=' + extractedValues);
			} catch (error) {
				console.log("Invalid JSON extractedValues from the  BIOCLIP: "+ extractedValues);
				return;
			}
			
			try{
				$.each(data,function(key,value){
					//alert("name:"+value.name+"  value:"+value.value);
					label  = value.name;
					result = value.value;
					if(label){
						label = $.trim(label);
					}
					var formLabelObj = fieldIdList.get(label);
					if(typeof (formLabelObj) === 'object' && formLabelObj != null){
						var formId = fieldIdList.get(label).value;
						if(formId){
							var editorObj = thisObject.messageAndUIBinder.geteditor(formId);
							var idSuffix = $("#inner-uiform-" + message.id).find('#'+formId).attr('idSuffix');
							var field = editorObj.getField('PQInplaceDisplayValue'+idSuffix);
							field.val(result).trigger('change');
						}
					}
				});
			}catch(jsonError){
				console.log("error in iterating over the extracted values in BIOCLIP: " + jsonError);
			}
	}	

};