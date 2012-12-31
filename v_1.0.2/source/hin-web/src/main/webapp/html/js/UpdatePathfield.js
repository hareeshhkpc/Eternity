function UpdatePathfield(){
	var updatePathfield      = this;
	
	this.getPathField = getPathField;
	this.getUpdatedPathField = getUpdatedPathField;
	this.getPathFieldObject = getPathFieldObject;
	this.setPathField= setPathField;
	
	/**
	 * converts the configPathField string to a JSON object
	 * @param htmlFragment : is the fragment HTML from which the configPathField string is retrieved 
	 * @returns : configPathField object in JSON format
	 */
	function getPathFieldObject(htmlFragment){
		var path = $(htmlFragment).attr("configPathField");
		try{
			eval('var configPathFieldObj='+path);
		}catch(error){
			alert("Invalid JSON config params from the form: " + path);
			return;
		}
		return configPathFieldObj;
	};
	
	/**
	 * creates pathFields string from the configPathField Object
	 * @param configPathFieldObj : configPathField JSON Object
	 * @returns {String} : pathFields 
	 */
	function getPathField(configPathFieldObj){
		var pathFields = '';
		$.each(configPathFieldObj,function(key,pathInfo){
			var elementIndex =  parseInt(pathInfo.value,10);

				if(elementIndex == 0){
					pathFields += pathInfo.name; 
				}
				else{
					pathFields += pathInfo.name+"["+pathInfo.value+"]"; 
				}
				
				if(key < (configPathFieldObj.length)-1){
					pathFields += ",";
				}
		});
		
		return pathFields;
	};
	
	/**
	 * used to get the updated pathField when we add a new row
	 * @param gridEditor : HTML fragment which contains the last updated configPathField
	 * @returns {String} : pathFields
	 */
	function getUpdatedPathField(gridEditor){
		var htmlFragment = $(gridEditor).find("#addButton");
		var configPathFieldObj = updatePathfield.getPathFieldObject(htmlFragment);
		
		var pathFields = '';
		$.each(configPathFieldObj,function(key,pathInfo){
			var elementIndex =  parseInt(pathInfo.value,10);

			if( pathInfo.editable == 'true'){
				if(elementIndex == 0){
					configPathFieldObj[key].value = ""+(elementIndex+2)+"";
				}
				else{
					configPathFieldObj[key].value = ""+(elementIndex+1)+"";
				}
			}
		});
		var pathFields = updatePathfield.getPathField(configPathFieldObj);
		var configPathField =  JSON.stringify(configPathFieldObj, null, 2);
		$(gridEditor).find("#addButton").attr("configPathField",configPathField);
		return pathFields;
	};
	
	/** 
	 * used to reassign the value of the pathFields when a row is removed  
	 * @param gridEditor : HTML fragment which contains all the rows
	 * @returns : updated HTML gridEditor
	 */
	function setPathField(gridEditor){
		var gridContent  = ($(gridEditor).find('[uiRole="gridContent"]'))[0];
		var configPathFieldObj = updatePathfield.getPathFieldObject(gridContent);
		var pathFields = null;
		
		$(gridEditor).find('[ uiRole="editor" ]').each(function(key,editorFragment){
			
			/*modifing the obj to get new pathfield*/
			var pathFields = '';
			if(key == 0){
				pathFields = updatePathfield.getPathField(configPathFieldObj);
			}
			else{
				$.each(configPathFieldObj,function(key,pathInfo){
					var elementIndex =  parseInt(pathInfo.value,10);
	
					if( pathInfo.editable == 'true'){
						if(elementIndex == 0){
							configPathFieldObj[key].value = ""+(elementIndex+2)+"";
						}
						else{
							configPathFieldObj[key].value = ""+(elementIndex+1)+"";
						}
					}
				});
				
				pathFields = updatePathfield.getPathField(configPathFieldObj);
			}	
			
			configPathFieldObj = configPathFieldObj;

			//alert("pathFields being assigned after remove for ele :"+key+"\n"+pathFields);
			$.each($(this).find('[dataField="true"]'),function(index,value){
				$(this).attr("pathFields",pathFields);
			});
			
		});
		
		var configPathField =  JSON.stringify(configPathFieldObj, null, 2);
		$(gridEditor).find("#addButton").attr("configPathField",configPathField);
		//alert("grid aft changing all params: "+$(gridEditor).html());
		return gridEditor;
	};
	
	
}