function LookupHandler(){
	var lookupHandler      = this;
	
	this.createDatabase    = createDatabase;
	this.createTable   	   = createTable;
	this.nullDataHandler   = nullDataHandler;
	this.errorHandler      = errorHandler;
	this.viewHandler       = viewHandler;
	this.loadLookUpData    = loadLookUpData;
	this.lookUp            = lookUp;
	this.poping            = poping;
	this.viewColumnContent = viewColumnContent;
	this.dynamicLoopUp     = dynamicLoopUp;
	this.updateRelatedLookUpValues = updateRelatedLookUpValues;
	this.isDBAvailable	   = false;
	this.elementIdList = new Array();
	//var appController = appController;
	
	/**
	 * Call back function reference which gets called after look up load. Added for 
	 * synchronisation of the look up load and message load
	 */
	this.callbackAfterLookupLoading = null;
	
	var htmlFragment       = null;
	var conceptClassName   = null;
	var lookAry            = null;
	var elementId          = null;
	
	
	function createDatabase(callBack) {
		try {
		    if (!window.openDatabase) {
		        //alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
		    	lookupHandler.isDBAvailable = false;
		    } else {
		    	lookupHandler.isDBAvailable = true;
		        var shortName = 'HIN_LOOKUP_DB';
		        var version = '1.0';
		        var displayName = 'HIN_LOOKUP_DB Test2';
		        var maxSize = 100000; // in bytes
		       /* HIN_LOOKUP_DB = openDatabase(shortName, version, displayName, maxSize);
		        createTable(function(){
		        	if(callBack)
		        		callBack();
		        });*/
		        
		    }
		} catch(e) {
		    if (e == 2) {
		        // Version mismatch.
		        console.log("Invalid database version.");
		    } else {
		        console.log("Unknown error "+ e +".");
		    }
		    return;
		} 
	};

	
	function createTable(callBackAfterFinishAllSQL){
		$.ajax({
			type : "GET",
			url : '/hin-web/resources/lookups/CONCEPTS.sql',
			data : "",
			dataType : "html",
			cache : false,
			success : function(sqlContent) {
				
				/**
				 * Iterate on each line and execute it as local SQLite doesn't support executing multiple queries in one trasaction.
				 */
				var sqlSplit = sqlContent.split("\n");

				dbOperation(sqlSplit, 0, sqlCallback, callBackAfterFinishAllSQL);
		
			},
			error : function(request, error) {				
				alert("Error in table creation: " + error);
			}
		});
		
		function sqlCallback(sqlArray, index, callBackAfterFinishAllSQL){
			if((index + 1) < sqlArray.length){
				dbOperation(sqlArray, index + 1, sqlCallback, callBackAfterFinishAllSQL);
			}
			else {
				callBackAfterFinishAllSQL();
			}
		}
		function dbOperation(sqlArray, index, callbackForNextSQL, callBackAfterFinishAllSQL){
			HIN_LOOKUP_DB.transaction(
		        function (transaction) {
		        	transaction.executeSql(sqlArray[index], [], nullDataHandler, errorHandler);
		        	callbackForNextSQL(sqlArray, index, callBackAfterFinishAllSQL);
		        }
		    );
		};
	};
	
	function nullDataHandler(){
		console.log("SQL Query Succeeded");
	};

	function errorHandler(error){
	 	if (error && 'code' in error && error.code==1){
	 		// DB Table already exists
	 	} else {
	    	// Error is a human-readable string.
		    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
	 	}
	    return false;
	};


	function viewHandler(transaction, results){
		var lookUpValues = new Array();
		 
		for (var i=0; i<results.rows.length; i++) {
			 var row = results.rows.item(i);
			 lookUpValues.push([row["CODE"], row["VALUE"]]);
		 }

		lookupHandler.loadLookUpData(lookUpValues);
	};
	
	function loadLookUpData(lookUpValues,autoCompleteLookUps){
		var lookupControlType = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("lookupControlType"); 
			if(lookupControlType == "multiple"){
				$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).html("");
				$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).append("<option value=''>Select</option>");	
				
				$.each(lookUpValues.sort(), function(index, value){
					if(value != null){
						var id = value[0].replace(/\s+/g, '_');
						//var id = value[0]; //value.replace(" ","_");
						var val = value[1];
						$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).append("<option value="+id+"  id="+id+">"+val+"</option>");
					}
				});
				
				//$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger('create');
			 }

			else if(lookupControlType == "checkBox"){
				$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).html("");
				
				var fields = "";
				var pathFields = "";
				
				$.each(lookUpValues, function(key, data){
					fields += data[1];
					
					if(key < (lookUpValues.length-1)){
						fields += ',';
					}
				});
				
				pathFields = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("pathFields");
	
				$.each(lookUpValues, function(index, value){
					if(value != null){
						var id = value[0].replace(/\s+/g, '_');
						//var id = value[0]; //value.replace(" ","_");
						var val = value[1];
						$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).append("<input type='checkbox' id='"+id+"' pathFields='"+pathFields+"' fields='"+fields+"' dataField='true' data-role='none' value='" + val + "' /><label>"+val+"</label>&nbsp;");
						$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).append("<br/>");
						
						$(lookupHandler.htmlFragment).find("#"+id).click(function(){
							$('this').attr('checked',"checked");
							$('this').trigger('change');
						});
					}
				});
				
				//$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).removeAttr('dataField');
				$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("fields", fields);
				$(lookupHandler.htmlFragment).trigger('refresh');
				
				
			 }			
			
			else if(lookupControlType == "radio"){
				$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).html("");
	
				$.each(lookUpValues, function(index, value){
					if(value != null){
						var id = value[0].replace(/\s+/g, '_');
						//var id = value[0]; //value.replace(" ","_");
						var val = value[1];
						$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).append("<input type='radio'  id='"+lookupHandler.conceptClassName+"' name='"+lookupHandler.conceptClassName+"'  data-role='none' /><label>"+val+"</label>&nbsp;");
					}
				});
			 }
			
			else if(lookupControlType == "autoComplete"){
				lookUpList = autoCompleteLookUps;
				var enteredValue = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("value");
				
				//Value in the list are filtered based on the entered text
				$(lookupHandler.htmlFragment).find("#" + lookupHandler.elementId).keyup(function() {
					$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
					$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").append("<div class='ui-lookup-ul'><div id='"+lookupHandler.elementId+"ListDiv' style='overflow:auto;position:relative;z-index:1;'></div></div>");
					var dataObj = null;
					var text = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("value");
						if ($.isArray(lookUpList)) {							
							dataObj = lookUpList.sort().filter(function(element) {
								var element_text, re = new RegExp('^' + text, 'i');
								if ($.isPlainObject(element)) {
									element_text = element.label;
								} else {
									element_text = element;
								}
								return re.test(element_text);
							});	
						
						if (dataObj) {
							var flag = dataObj.length>4;
							$.each(dataObj, function(index, value){ 								
								if(value){								
									var id = value.value;									
									var val = value.label;
									var conceptAttributes = value.data.conceptAttributes; 								
									if(conceptAttributes){
										var parent = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).closest('[uiRole="editor"]')[0];
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").append("<li id='"+id+"' class='ui-lookup-li'>"+val+"</li>");
										if(flag){
											$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").css("height","120");											
										}												
										
									}else{
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").append("<li id='"+id+"' class='ui-lookup-li'>"+val+"</li>");
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").trigger("create");
									}	
									
									$(lookupHandler.htmlFragment).find("#"+id).click(function(){
										lookupHandler.updateRelatedLookUpValues(conceptAttributes, parent);
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("value",val);										
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("create");
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("keyup");
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
									});
								}
							});
						}else{
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").css('display','none');
						}
					}
						
				});
				
				// Comes here on click
				if(lookUpValues.length >= 1){
					$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
					/*$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").append("<div id='"+lookupHandler.elementId+"ListDiv' class='ui-lookup-ul'></div>");*/
					$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").append("<div class='ui-lookup-ul'><div id='"+lookupHandler.elementId+"ListDiv' style='overflow:auto;position:relative;z-index:1;'></div></div>");
					
					// are we looking at a source array or remote data?
					
						//buildItems($this, data, settings);
					var flag = lookUpValues.length > 4;
					$.each(lookUpValues, function(index, value){  
						if(value){
							var id = value[0].replace(/\s+/g, '_');
							//var id = value[0]; 
							var val = value[1];
							var conceptAttributes = value[2]; 
							
									if(conceptAttributes){
										var parent = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).closest('[uiRole="editor"]')[0];
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").append("<li id='"+id+"' class='ui-lookup-li'>"+val+"</li>");
										if(index == (lookUpValues.length-1)){
											$(lookupHandler.htmlFragment).find("#"+id).css('border','0px');
											
										}
										if(flag){
											$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").css("height","120");
										}
										
										$(lookupHandler.htmlFragment).find("#"+id).click(function(){
											lookupHandler.updateRelatedLookUpValues(conceptAttributes, parent);
											$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").css("display","none");
										});
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").trigger("create");
										//$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("keyup");
									}
									else{
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").append("<li id='"+id+"' class='ui-lookup-li'>"+val+"</li>");
										
										if(flag){
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").css("height","120");
									    }
										
										$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv").trigger("create");
										
									}
						}
					});
				
					
					$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"ListDiv li").each(function(index, value){
						/*$(value).click(function(){
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("value", $(value).text());
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("code", $(value).attr("id"));
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
							//$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("keyup");
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger('change');
						});*/
						$(value).click(function(){
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("value", $(value).text());
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).attr("code", $(value).attr("id"));
							
							var hiddenText = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"Hidden").html();
							//alert("v: "+hiddenText);
							if(hiddenText != null){
								$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"Hidden").attr("value", $(value).text());
								$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"Hidden").trigger('change');
								//$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("keyup");
							}else{
								$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger('change');
								$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId).trigger("keyup");
							}
							$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
						});
						
					});
					
			   }	
				
				
			}
		
			/* to avoid replacing the value from the xml*/
			if(lookupControlType != "autoComplete"){
				poping();
			}	
		
	};
	var lookUpList = new Array();
	function viewColumnContent(conceptClassName, callbackAfterLookupResult){
		try{
			appController.getComponent(["DataLayer"]).loadAllConceptServices(
					conceptClassName,
					function(data) {
						var lookUpValues = new Array();
						var autoCompleteLookUps = new Array();
						for (i in data.json) {
							if(i != "key"){
							lookUpValues.push([ data.json[i].name, data.json[i].description,
							                    data.json[i].conceptAttributes, data.json[i].smallIcon,
							                    data.json[i].shortName ]);
							
							autoCompleteLookUps.push({label:data.json[i].description, value:data.json[i].name,data:data.json[i]});
							}
						}

						// if a callback is given for the lookup load, call
						// that.
						if (!callbackAfterLookupResult) {
							lookupHandler.loadLookUpData(lookUpValues,autoCompleteLookUps);
						} else {
							callbackAfterLookupResult(lookUpValues);
						}
					}, null);	
				
		}catch(error){
			errorHandler();
		}
	};
	   
	   
	   
	function lookUp(lookupFragment,lookups){
	   lookupHandler.htmlFragment = lookupFragment;
	   lookupHandler.lookAry = lookups;
	   lookupHandler.poping();
   	
    };

	function poping() {
		var lookUpUIType = null;
		if (lookupHandler.lookAry.length > 0) {
			var lookUpInfo = lookupHandler.lookAry.pop();
			
			$.each(lookUpInfo,function(key,data){
				if(data.name == 'conceptClass'){
					lookupHandler.conceptClassName = data.value;
				}
				if(data.name == 'type'){
					lookUpUIType = data.value;
					
				}
				if(data.name == 'elementId'){
					lookupHandler.elementId = data.value;
				}				
			});

			if (lookUpUIType == 'multiple' || lookUpUIType == 'checkBox' || lookUpUIType == 'radio' || lookUpUIType == 'programs') {
				viewColumnContent(lookupHandler.conceptClassName);
			} else {
				
				$(lookupHandler.htmlFragment).find("#" + lookupHandler.elementId).click(function(e) {
					lookupHandler.elementId = $(this).attr("id");
					lookupHandler.conceptClassName = $(this).attr("conceptClass");
					lookupHandler.htmlFragment = $(this).closest('[uiRole="editor"]')[0];
					var listContent = $(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html();
					if(listContent){
						$(lookupHandler.htmlFragment).find("#"+lookupHandler.elementId+"List").html("");
					}else{
						
						if(lookupHandler.elementIdList.indexOf(lookupHandler.elementId) > -1){
							
						}else{
							lookupHandler.elementIdList.push(lookupHandler.elementId);
						}
						
						$.each(lookupHandler.elementIdList,function(key,value){
							if(value){
								$(lookupHandler.htmlFragment).find("#"+value+"List").html("");
							}
						});

						//added to handle search box if multiple forms are loaded 
						$('[hasToggle="true"]').each(function(key, uiField){
							var elementId = $(uiField).attr('id');
								var editor = $(uiField).closest('[uiRole="editor"]')[0];
								$(editor).find("#"+elementId+"List").html("");
						});
						viewColumnContent(lookupHandler.conceptClassName);
					}
					
				
				});
				
			poping();
			}
		}
		else {
			if(lookupHandler.callbackAfterLookupLoading)
				lookupHandler.callbackAfterLookupLoading();
		}
	}
	;
	   
   function dynamicLoopUp(conceptClassName,enteredValue){
	   lookupHandler.conceptClassName= conceptClassName;
		try{
			appController.getComponent(["DataLayer"]).loadDynamicConceptLookUp(
					conceptClassName,enteredValue,
					function(data) {
						var lookUpValues = new Array();
						for (i in data.json) {
							lookUpValues.push([ data.json[i].name, data.json[i].description,
							                    data.json[i].conceptAttributes, data.json[i].smallIcon,
							                    data.json[i].shortName ]);
						}

						lookupHandler.loadLookUpData(lookUpValues);
						
					}, null);
			
		}catch(error){
			errorHandler();
		}
    };

	function updateRelatedLookUpValues(conceptAttributes, parent){
		if(conceptAttributes){
			$.each(conceptAttributes,function(index,conceptAttribute){
				$(parent).find('[dataField="true"]').each(function(){
					var relatedConceptClass = $(this).attr('conceptClass') ;
					if(relatedConceptClass == 'Nations'){
						relatedConceptClass = 'country';
					}
					if(relatedConceptClass == conceptAttribute.key){
						$(this).attr('placeholder',conceptAttribute.value);
						$(this).trigger('change');
						$(this).trigger('keyup');
						$(this).attr('value',conceptAttribute.value);
					}
				});
			});
		}
		
	};
	
}