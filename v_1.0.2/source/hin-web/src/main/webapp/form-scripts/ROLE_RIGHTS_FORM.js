function ROLE_RIGHTS_FORM(message, appController, uiGenerator) {
	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.createRoleRightsUI = createRoleRightsUI;
	this.onUnLoad = onUnLoad;

	function initialize() {

		try {

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			thisObject.createRoleRightsUI(message);

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
	function createRoleRightsUI(message) {
		var processNames;
		appController
				.getComponent("DataLayer")
				.getAllProcessNames(
						function(data) {
							processNames = data.processNames;
							// alert("processNames" + processNames);
							var proceeHeaderDiv = "";
							proceeHeaderDiv += '<div class="ui-grid-a">';
							proceeHeaderDiv += '<div class="ui-block-a header" style="width: 30%;">Process Names</div>';
							proceeHeaderDiv += '<div class="ui-block-b header" style="width: 15%;">Archive</div>';
							proceeHeaderDiv += '<div class="ui-block-c header" style="width: 15%;">Restricted</div>';
							proceeHeaderDiv += '<div class="ui-block-d header" style="width: 15%;">Execute</div>';
							proceeHeaderDiv += '<div class="ui-grid-a">';
							/*
							 * proceeHeaderDiv += ' <div class="ui-block-a "
							 * style="width: 45%;">WITHIN</div>';
							 * proceeHeaderDiv += ' <div class="ui-block-b "
							 * style="width: 45%;">OUTSIDE</div>';
							 */
							proceeHeaderDiv += '<div class="ui-block-c " style="width: 0%;"></div>';
							proceeHeaderDiv += '</div>';
							proceeHeaderDiv += '</div>';
							proceeHeaderDiv += '</div>';
							$('#inner-uiform-' + message.id).append(
									proceeHeaderDiv);
							$
									.each(
											processNames,
											function(key, value) {
												if (value) {
													
													var groupId = value.replace(/\s+/g, '_');
													
													//alert("value: "+value);
													var proceeDiv = "";
													proceeDiv += '<div class="ui-grid-a">';
													proceeDiv += '<div isEditor="true" editorLabel="'
															+ value
															+ '" class="ui-block-a header" pathFields="rights" tagName="processName" dataType="CS" editorType="" idSuffix="'
															+ (key + 1)
															+ '" class="ui-block-a header" style="width: 30%;">'
															+ value + '</div>';
													proceeDiv += '<div isEditor="true" pathFields="rights['+(key+1)+']" tagName="id" groupId="'+groupId+'" editorLabel="Archive" dataType="II" editorType="IISingleCheckBox" idSuffix="'
															+ (key + 1)
															+ '" class="ui-block-b header" style="width: 15%;"></div>';
													proceeDiv += '<div isEditor="true" pathFields="rights['+(key+1)+']" tagName="id" groupId="'+groupId+'" editorLabel="Restricted" dataType="II" editorType="IISingleCheckBox" idSuffix="'
															+ (key + 1)
															+ '" class="ui-block-c header" style="width: 15%;"></div>';
													proceeDiv += '<div isEditor="true" pathFields="rights['+(key+1)+']" tagName="id" groupId="'+groupId+'"  editorLabel="Execute" dataType="II" editorType="IISingleCheckBox" idSuffix="'
															+ (key + 1)
															+ '" class="ui-block-d header" style="width: 15%;"></div>';
													proceeDiv += '<div class="ui-grid-a">';

													proceeDiv += '<div class="ui-block-c " style="width: 0%;"></div>';
													proceeDiv += '</div>';
													proceeDiv += '</div>';
													proceeDiv += '</div>';

													$(
															'#inner-uiform-'
																	+ message.id)
															.append(proceeDiv);
												}

											});
							if (message.messageAndUIBinder) {
								var lookupHandler = this.appController.getComponent("DataLayer").lookupHandler;
								message.messageAndUIBinder.loadDataOntoForm(lookupHandler);
							}


						});
		//alert("message.messageAndUIBinder: "+message.messageAndUIBinder);
		
	}
	;

};