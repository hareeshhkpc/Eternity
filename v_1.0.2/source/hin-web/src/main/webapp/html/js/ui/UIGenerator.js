var HIN;
if (!HIN)
	HIN = {};

/**
 * UIGenerator
 * 
 * Main UI controller which generate and holds the ui components.It makes events
 * to be processed by corresponding components.
 */
HIN.UIGenerator = function(instanceId, appController, uiSelectedStep,
		uiPlaceholder, uiMessageType, callback, page) {
	/** instanceId holds the unique id for each UI instance. */
	this.instanceId = instanceId;
	this.appController = appController;
	this.dataLayer = this.appController.getComponent("DataLayer");

	/** uiSelectedStep holds current selected step. */
	this.uiSelectedStep = uiSelectedStep;
	this.uiPlaceholder = uiPlaceholder;

	/** uiProcessDefinition holds current selected process definition. */
	this.uiProcessDefinition = null;
	this.uiMessages = [];
	this.formScripts = [];

	/** uiCurrentMessage holds current selected message object. */
	this.uiCurrentMessage = null;
	this.uiGroupHeaderMap = new HIN.HashMap();
	/*
	 * this.uiMaxId = 0; this.uiMaxMessageIndex = 0;
	 */
	this.uiMessageIndex = 0;
	this.callback = callback;
	this.addNew = false;
	this.sortType = "messageType";
	this.sortBy = null;
	ui = this;
	this.mainHeader = "block";
	this.addIcon = "block";
	this.subHeader = "block";
	this.removeIcon = "block";

	this.tableHeaders = null;
	/**
	 * tableFormat holds true or false value , if false UI act as collapsible
	 * otherwise table format.
	 */
	this.tableFormat = false;
	this.headerRendered = false;

	this.uiMessageTypes = [];
	this.uiMessageType = uiMessageType;
	this.messagTypeSelectionArray = [];// this.uiMessageType.selectionArray;
	// alert(" UI Generator : " + this.messagTypeSelectionArray);

	/**
	 * singleForm holds true or false value , if true it will show as single
	 * form. eg.Registration page , it should n't have any options like
	 * add,remove,collapse etc.
	 */
	this.singleForm = false;

	/**
	 * formRender holds true or false value , if true UI will be render.
	 */

	this.formRender = true;
	this.addInitialHandler = null;
	this.addCompleteHandler = null;
	this.removeCompleteHandler = null;

	this.messageIndex = 0;

	this.lookup = true;
	this.taskHandler = null;
	this.refreshHandler = null;
	this.singleHandler = null;
	this.clearHandler = null;
	this.cancelHandler = null;

	this.formCreationHandler = null;

	this.selectedMessage = null;
	this.selectedTask = null;

	this.category = null;
	this.lookupSelectionHandler = null;
	this.lookupSelectionValidateHandler = null;
	this.conceptLookup = null;
	this.lastOpenedFormId = null;
	this.createMessageTypeHandler = null;
	this.page = page;

	this.singleButton = false;

	this.formExpandable = true;
	this.innerPage = false;
	this.conceptServiceLookups = null;
	this.packageFinance = [];

	this.customRenderer = false;

	this.customRendererForm = null;

	this.openedForm = null;
	this.actions = true;
	this.conceptVO = null;
	this.packagePage = false;

	this.finish = true;

	this.refresh = true;

	this.finishTitleOnly = false;

	this.customTitleRenderer = false;

	this.customTitle = "";
};

HIN.UIGenerator.prototype.getPage = function() {
	this.page = appController.getComponent("RenderingEngine")
			.getChildComponent("Form").getPage();
};

/**
 * showMainHeader method will show main header from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.showMainHeader = function() {
	this.mainHeader = "block";
};

/**
 * showAddIcon method will show add icon from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.showAddIcon = function() {
	this.addIcon = "block";
};
/**
 * showSubHeader method will show sub header from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.showSubHeader = function() {
	this.subHeader = "block";
};
/**
 * showRemoveIcon method will show remove icon from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.showRemoveIcon = function() {
	this.removeIcon = "block";
};
/**
 * hideMainHeader method will hide main header from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.hideMainHeader = function() {
	this.mainHeader = "none";
};
/**
 * hideAddIcon method will hide add icon from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.hideAddIcon = function() {
	this.addIcon = "none";
};
/**
 * hideSubHeader method will hide sub header from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.hideSubHeader = function() {
	this.subHeader = "none";
};
/**
 * hideRemoveIcon method will hide remove icon from UI.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.hideRemoveIcon = function() {
	this.removeIcon = "none";
};

HIN.UIGenerator.prototype.addMessageType = function(messageType) {
	this.uiMessageTypes.push(messageType);
};

HIN.UIGenerator.prototype.getMessageType = function(type) {

	for ( var index = 0; index < this.uiMessageTypes.length; index++) {
		/*
		 * alert(this.uiMessageTypes.length + " = " +
		 * this.uiMessageTypes[index].type + " : " + type);
		 */
		if (this.uiMessageTypes[index].type == type) {
			return this.uiMessageTypes[index];
		}
	}
};

/**
 * loadUIForms method will load each message related UI form as per the process
 * definition.
 * 
 * @returns {void}
 */

HIN.UIGenerator.prototype.loadUIForms = function() {
	// alert("loadUIForms : " + !this.addNew + " - " + this.uiMessages.length);
	// alert("this.uiMessageIndex : " + this.uiMessageIndex);
	if (!this.addNew) {
		if (this.uiMessageIndex < this.uiMessages.length) {
			// appController.getComponent("RenderingEngine").showPageLoading();
			/* alert("uiMessageType : " + this.uiMessageType); */
			var message = this.uiMessages[this.uiMessageIndex];

			if (message.status == AppConstants.Status.ACTIVE
					&& message.renderUI) {
				/* this.uiMessageType = message.messageType; */
				/*
				 * this.createUIForm(this.uiMessageIndex, message.messageType,
				 * message.groupName, message.messageForm, message);
				 */
				var object = new Object();
				object.uiMessageIndex = this.uiMessageIndex;
				object.messageType = null;
				object.messageForm = null;
				object.selectedTypeName = null;
				this.createUIForm(object, null, null);

				/*
				 * this.createUIForm(this.uiMessageIndex, null, null, null,
				 * null, null);
				 */
			} else {
				this.uiMessageIndex++;
				this.loadUIForms();
			}
		} else {
			appController.getComponent("RenderingEngine").hidePageLoading();
			/*
			 * this.page = appController.getComponent("RenderingEngine")
			 * .getChildComponent("Form").getPage();
			 */
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			this.callback(page);
		}
	} else {
		/* alert("new"); */
	}

};

HIN.UIGenerator.prototype.loadNewUIForms = function() {
	// alert(this.uiMessageIndex + " : " + this.uiMessages.length);
	if (this.uiMessageIndex < this.uiMessages.length) {
		// appController.getComponent("RenderingEngine").showPageLoading();
		var message = this.uiMessages[this.uiMessageIndex];
		/*
		 * this.createUIForm(this.uiMessageIndex, message.messageType,
		 * message.groupName, message.messageForm, message);
		 */
		var object = new Object();
		object.uiMessageIndex = this.uiMessageIndex;
		object.messageType = null;
		object.messageForm = null;
		object.selectedTypeName = null;
		this.createUIForm(object, null, null);
		// this.createUIForm(this.uiMessageIndex, null, null, null, null, null);
	} else {
		// appController.getComponent("RenderingEngine").hidePageLoading();
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		this.callback(page);
	}
};

HIN.UIGenerator.prototype.loadNewUIForm = function(messageType, messageForm,
		selectedTypeName) {
	this.addNew = true;

	var object = new Object();
	object.uiMessageIndex = -1;
	object.messageType = messageType;
	object.messageForm = messageForm;
	object.selectedTypeName = selectedTypeName;
	this.createUIForm(object, this.addCompleteHandler, null);

	/*
	 * this.createUIForm(-1, messageType, messageForm, selectedTypeName,
	 * this.addCompleteHandler);
	 */
};

/**
 * Based on the formRender value the loadUIForm method will render html data to
 * the dom and query the msg document using datalayer API to display it.
 * 
 * @param message :
 *            Its an object of message.
 * @param formRender :
 *            Its a boolean value.
 * @param data :
 *            Its a html content.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @returns {void}
 * 
 * 
 */
HIN.UIGenerator.prototype.loadUIForm = function(message, formRender, data,
		addCompleteHandler, callbackHandler) {
	// alert('#inner-uiform-' + message.id + " , " + data)
	// alert("loadUIForm : " + formRender);
	// alert("Render : " + formRender);
	if (formRender) {

		function uiChange(thisObj) {
			setTimeout(
					function() {
						var instanceId = message.instanceId;
						var page = appController
								.getComponent("RenderingEngine")
								.getChildComponent("Form").getPage();
						/*
						 * alert(page + " : " + page.uiInstances + " : " +
						 * instanceId);
						 */
						var instance = page.uiInstances.get(instanceId).value;

						$('#inner-uiform-' + message.id).append(data);

						/*
						 * $('#uiform-sub-head' + message.instanceId).append( '<div><h1>Discount</h1></div>')
						 */;

						if (instance.tableFormat) {
							$('#inner-uiform-' + message.id).find(
									'.ui-delete-icon').attr('id', message.id);
							$('#inner-uiform-' + message.id).find(
									'.ui-delete-icon').attr('instanceId',
									instanceId);
						}

						$('#inner-uiform-' + message.id).trigger('create');

						if (instance.formExpandable) {
							if (instance.tableFormat) {
								$('#inner-main-head' + instance.instanceId)
										.unbind('click', instance.headerClicked);
								$('#inner-main-head' + instance.instanceId)
										.bind('click', instance.headerClicked);
							}

							$('#inner-uiform-head-' + message.id)
									.click(
											function() {

												var instanceId = $(this).attr(
														"instanceId");
												var page = appController
														.getComponent(
																"RenderingEngine")
														.getChildComponent(
																"Form")
														.getPage();
												var instance = page.uiInstances
														.get(instanceId).value;

												// alert(instance.customRenderer);
												if (instance.customRenderer == true) {
													/*
													 * instance.openedForm =
													 * '#inner-uiform-head-' +
													 * message.id;
													 */
													instance.openedForm = '#inner-sub-uiform-head'
															+ message.id;
												} else
													instance.openedForm = null;

												instance
														.openMessageForm(message);

											});
						}

						// alert("Form render uiMessageType : " +
						// instance.uiMessageType);
						if (instance.uiMessageType.headerView == false) {
							$('#uiform-sub-head' + message.instanceId).hide();
							$('#inner-sub-uiform-head' + message.id).hide();
						} else {
							$('#uiform-sub-head' + message.instanceId).show();
							$('#inner-sub-uiform-head' + message.id).show();
						}

						if (message.formView == false) {
							$('#inner-sub-uiform-head' + message.id).hide();
						} else {
							$('#inner-sub-uiform-head' + message.id).show();
						}

						instance.dataLayer.processMessage(message, "",
								function(messageId, msg, messageObj) {
									var instance = page.uiInstances
											.get(message.instanceId).value;
									// alert(messageId + " : " + instance);
									instance.uiCurrentMessage = message;
									if (instance)
										instance.uiMessageCreated(messageId,
												msg, message,
												instance.addCompleteHandler,
												callbackHandler);
								});
					}, 10);

		}

		uiChange(this);
		/* $(this).css("background-color", "#FF0000"); */
		appController.getComponent("RenderingEngine").showPageLoading(
				"Form Rendering");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Form Rendering");

	} else {

		if (!data) {
			data = "<h6></h6>"
		}
		$('#inner-uiform-' + message.id).append(data);

		if (this.tableFormat) {
			$('#inner-uiform-' + message.id).find('.ui-delete-icon').attr('id',
					message.id);
			$('#inner-uiform-' + message.id).find('.ui-delete-icon').attr(
					'instanceId', this.instanceId);
		}

		if (this.formExpandable) {
			$('#inner-uiform-head-' + message.id).unbind('click',
					this.processMessage);
			$('#inner-uiform-head-' + message.id).bind('click',
					this.processMessage);
		}
		// alert("Not uiMessageType : " + this.uiMessageType);
		if (this.uiMessageType.headerView == false) {
			$('#uiform-sub-head' + message.instanceId).hide();
			$('#inner-sub-uiform-head' + message.id).hide();
		} else {
			$('#uiform-sub-head' + message.instanceId).show();
			$('#inner-sub-uiform-head' + message.id).show();
		}
		if (message.formView == false) {
			$('#inner-sub-uiform-head' + message.id).hide();
		} else {
			$('#inner-sub-uiform-head' + message.id).show();
		}

		/*
		 * $('#uiform-sub-head' + message.instanceId).append( '<div><h1>Discount</h1></div>');
		 */
		/*
		 * $('<div><h1>Discount</h1></div>').insertBefore( '#footer-' +
		 * message.instanceId);
		 */
		/*
		 * $('<div><h1>Hi</h1></div>').insertAfter( $('#uiform-sub-head' +
		 * message.instanceId + ':first-child'));
		 */
		/*
		 * if (message.messageType == "POCD_MT000040UV_ClientReportView") {
		 * alert(message + " : " + message.formView) if (message.formView ==
		 * false) { $('#inner-sub-uiform-head' + message.id).hide(); } }
		 */
		// $('#main').trigger('create');
		appController.getComponent("RenderingEngine").hidePageLoading();

		this.uiMessageIndex++;

		/*
		 * if (this.addNew) { this.updateProcess(); }
		 */
		if (addCompleteHandler) {
			addCompleteHandler(this.addNew, this.uiMessageType, message, this);
		}
		if (this.lookupSelectionHandler && !message.dependendMessageProcessed) {
			message.dependendMessageProcessed = true;
			this.lookupSelectionHandler(this, this.conceptLookup, message);
		}
		if (callbackHandler)
			callbackHandler(message);
		this.loadUIForms();
	}
};

HIN.UIGenerator.prototype.headerClicked = function(e) {

	if (e.target.nodeName == "IMG")
		return;

	var id = this.id;
	// $(this).slideToggle('slow');

	var typeName = $(this).attr("typeName");
	var title = $(this).attr("title");
	// var title = $(this).find(".ui-add-button-show").html();
	if (!title)
		title = typeName;
	// alert(typeName);
	var instanceId = id.substr(15, id.length);// "inner-main-head"
	// alert("headerClicked " + instanceId);

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;

	/*
	 * $('#uiform-sub-head' + instanceId).find('.table').children().slideToggle(
	 * 'slow');
	 */

	if (instance.singleButton == true) {
		return;
	}

	// alert(instance.uiCurrentMessage);
	// instance.uiSelectedStep.getMessageTypeByTypeName();
	if (instance.actions == true) {
		instance.renderSingleTaskUI(title, typeName, instanceId);
	} else {
		$('#' + instance.uiSelectedStep.stepName + '_pageActions').html("");
	}

	// }
};

HIN.UIGenerator.prototype.renderSingleTaskUI = function(title, typeName,
		instanceId) {
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;
	var taskActionsUI = "";

	if (instance.finishTitleOnly == true) {
		title = "";
	}
	// var title = typeName;

	// if (instance.singleButton == true) {
	// title = "Single";

	var buttonUI = '';
	if (instance.finish) {
		buttonUI = '<div class="ui-process-button singleOutcome" typeName="'
				+ typeName
				+ '" instanceId="'
				+ instanceId
				+ '" value="" style="width:auto;" >'
				+ title
				+ ' Finish '

				/* + '[' + message.id + ']' */

				+ '<img src="images/finish.png" style="padding-left:30px;" /></div>';
	}

	if (instance.cancelHandler) {
		buttonUI += '<div class="ui-process-button cancel" instanceId="'
				+ instanceId
				+ '" value="" style="width:120px;display:none" >Cancel '
				+ ' <img src="images/refresh.png"/></div>';
	}
	taskActionsUI += buttonUI;

	$('#' + instance.uiSelectedStep.stepName + '_pageActions').html("");
	$('#' + instance.uiSelectedStep.stepName + '_pageActions').html(
			taskActionsUI);

	$('#' + instance.uiSelectedStep.stepName + '_pageActions').find(
			'.singleOutcome').unbind("click", instance.singleOutComeHandler);
	$('#' + instance.uiSelectedStep.stepName + '_pageActions').find(
			'.singleOutcome').bind("click", instance.singleOutComeHandler);

	$('#' + instance.uiSelectedStep.stepName + '_pageActions').find('.cancel')
			.unbind("click", instance.cancelHandler);
	$('#' + instance.uiSelectedStep.stepName + '_pageActions').find('.cancel')
			.bind("click", instance.cancelHandler);
};

HIN.UIGenerator.prototype.singleOutComeHandler = function() {
	$(this).css('background', '#b2479f');
	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;
	if (instance) {
		var typeName = $(this).attr("typeName");

		if (instance.singleHandler) {
			instance.singleHandler(typeName, instance);
		} else {
			alert("Page should implement singleHandler method");
		}
	}
};
/**
 * openMessageForm method will toggle the form and it renders the taskbar based
 * on the selected form.
 * 
 * @param message :
 *            Its an object of message.
 * @returns {void}
 */

HIN.UIGenerator.prototype.openMessageForm = function(message) {
	var instanceId = message.instanceId
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	/*
	 * appController.getComponent("RenderingEngine").showPageLoading( "Form
	 * Loading...");
	 * appController.getComponent("RenderingEngine").openModalDialog( "Form
	 * Loading");
	 */
	var instance = page.uiInstances.get(instanceId).value;
	// alert(message.id);
	if (!instance.singleForm && !instance.tableFormat) {
		$('#inner-uiform-' + message.id).slideToggle('slow');
	}

	if (instance.innerPage && !instance.packagePage) {
		/*
		 * appController.getComponent("RenderingEngine").hidePageLoading();
		 * appController.getComponent("RenderingEngine").closeModalDialog();
		 */
		return;
	}

	if (instance.packagePage == true) {
		instance.renderTaskUI(message);
	} else if (instance.singleButton) {
		instance.renderTaskUI(message);
	} else {

		if (!instance.innerPage && !instance.tableFormat
		// && !instance.customRenderer
		&& page.lastOpenedFormId && page.lastOpenedFormId != message.id) {
			$('#inner-uiform-' + page.lastOpenedFormId).hide();
			instance.renderTaskUI(null);
		}

		// alert(message + " rendered : " + message.rendered);
		if (!instance.tableFormat
		// && !instance.customRenderer
		) {
			if (page.lastOpenedFormId == message.id) {
				instance.renderTaskUI(null);
				page.lastOpenedFormId = null;
			} else {
				instance.renderTaskUI(message);
				page.lastOpenedFormId = message.id;
			}
		} else {
			// instance.renderTaskUI(message);
			if (instance.actions == true) {
				instance.renderSingleTaskUI(message.title,
						message.messageTypeName, instanceId);
			}
		}
	}

	/*
	 * appController.getComponent("RenderingEngine").hidePageLoading();
	 * appController.getComponent("RenderingEngine").closeModalDialog();
	 */
};

/**
 * processMessage method will trigger by clicking on the collapsible header and
 * it executes based on the message is already rendered or not.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.processMessage = function() {

	/*
	 * appController.getComponent("RenderingEngine").showPageLoading( "Form
	 * Rendering ");
	 * appController.getComponent("RenderingEngine").openModalDialog( "Form
	 * Rendering ");
	 */

	var id = this.id;
	id = id.substring(id.lastIndexOf("-") + 1, id.length);

	// alert(id);
	function uiChange(thisObj) {
		setTimeout(function() {

			// callback();
			var instanceId = $(thisObj).attr("instanceId");
			var messageId = $(thisObj).attr("messageId");
			// alert(instanceId + " ; " + messageId);
			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			var instance = page.uiInstances.get(instanceId).value;
			instance.formRender = true;

			var message = instance.getMessage(id);

			// alert(instance.customRenderer);
			if (instance.customRenderer == true) {
				// instance.openedForm = '#inner-uiform-head-' + message.id;
				instance.openedForm = '#inner-sub-uiform-head' + message.id;
			} else
				instance.openedForm = null;

			if (!message.rendered) {

				instance.loadUIMessageForm(message, instance.formRender,
						instance.loadUIFormHandler, null);

				// instance.renderTaskUI(null);
			}/*
				 * else {
				 * appController.getComponent("RenderingEngine").hidePageLoading(
				 * "Form Rendering");
				 * appController.getComponent("RenderingEngine").closeModalDialog(
				 * "Form Rendering"); instance.openMessageForm(message); }
				 */
		}, 10);

	}

	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;

	var message = instance.getMessage(id);
	if (message.rendered) {
		instance.openMessageForm(message);
	} else {

		uiChange(this);
		/* $(this).css("background-color", "#FF0000"); */
		appController.getComponent("RenderingEngine").showPageLoading(
				"Form Rendering");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Form Rendering");
	}

};

// HIN.UIGenerator.prototype.startUIRender = function(this)
/**
 * After the message document is created this method will be triggered and this
 * method internally call the uiMessageCreationCompleteHandler method which have
 * a callback event which will call the loadUIForms method.
 * 
 * @param messageId:
 *            Its a string holds the message id
 * @param msg :
 *            Its an object of xml document.
 * @param uiCurrentMessage :
 *            Its an object of message.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @returns {void}
 */
HIN.UIGenerator.prototype.uiMessageCreated = function(messageId, msg,
		uiCurrentMessage, addCompleteHandler, callbackHandler) {
	// this.uiCurrentMessage = uiCurrentMessage;

	this.uiMessageCreationCompleteHandler(uiCurrentMessage, addCompleteHandler,
			this, callbackHandler, function(instance) {
				instance.uiMessageIndex++;
				// this.loadUIForms(uiCurrentMessage);
				instance.loadUIForms();

			});
	/*
	 * this.uiMessageIndex++; // this.loadUIForms(uiCurrentMessage);
	 * this.loadUIForms();
	 */
};
/**
 * Handles the messagScript loading,formScript loading and data loading to the
 * from.
 * 
 * @param uiCurrentMessage :
 *            Its an object of message.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param instance :
 *            Its an object of uigenerator.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callback :
 *            Its a function which will be called after the completion of
 *            uiMessageCreationCompleteHandler.
 * @returns {void}
 */
HIN.UIGenerator.prototype.uiMessageCreationCompleteHandler = function(
		uiCurrentMessage, addCompleteHandler, instance, callbackHandler,
		callback) {

	/*
	 * alert("Message Created " + uiCurrentMessage); alert("Msg Created " +
	 * uiCurrentMessage.msg); alert("message Created " +
	 * uiCurrentMessage.message);
	 */

	/*
	 * uiCurrentMessage.messageId = messageId; if (msg) { uiCurrentMessage.msg =
	 * msg; uiCurrentMessage.message = msg.getXML(); }
	 */

	// this.uiCurrentMessage = uiCurrentMessage;
	if (instance.formRender && !uiCurrentMessage.rendered) {

		// alert("Ok");
		/*
		 * uiCurrentMessage.messageAndUIBinder = new MessageAndUIBinder(
		 * 'inner-uiform-' + uiCurrentMessage.id, uiCurrentMessage.msg,
		 * uiCurrentMessage.messageType);
		 */

		/*
		 * var renderingEngine = appController.getComponent("RenderingEngine");
		 * renderingEngine.showPageLoading("Script Loading...");
		 * renderingEngine.openModalDialog("Script Loading");
		 */

		instance
				.loadAndExecuteMessagScript(
						uiCurrentMessage,
						instance,
						function(messageTypeScript) {
							var properties = new Object();
							properties.readOnly = uiCurrentMessage.readOnly;
							var finished = uiCurrentMessage.finished;
							// properties.readOnly = finished;

							instance
									.loadDataOntoForm(
											instance,
											uiCurrentMessage,
											properties,
											messageTypeScript,
											function() {
												instance
														.loadAndExecuteFormScript(
																instance,
																uiCurrentMessage,
																function() {
																	instance
																			.openMessageForm(uiCurrentMessage);

																	if (callbackHandler)
																		callbackHandler(uiCurrentMessage);

																	/*
																	 * if
																	 * (instance.addNew) {
																	 * instance
																	 * .updateProcess(); }
																	 */

																	if (addCompleteHandler) {
																		addCompleteHandler(
																				instance.addNew,
																				instance.uiMessageType,
																				uiCurrentMessage,
																				instance);
																	}

																	if (instance.lookupSelectionHandler
																			&& !uiCurrentMessage.dependendMessageProcessed) {
																		uiCurrentMessage.dependendMessageProcessed = true;
																		instance
																				.lookupSelectionHandler(
																						instance,
																						instance.conceptLookup,
																						uiCurrentMessage);
																	} else {
																		if (instance.addNew) {
																			// alert("No
																			// lookup");
																			instance
																					.updateProcess();
																		}
																	}

																	uiCurrentMessage.rendered = true;

																	$('#main')
																			.trigger(
																					'create');

																	if (!instance.innerPage
																			&& !instance.tableFormat)
																		instance
																				.renderTaskUI(uiCurrentMessage);
																	appController
																			.getComponent(
																					"RenderingEngine")
																			.hidePageLoading();
																	appController
																			.getComponent(
																					"RenderingEngine")
																			.closeModalDialog();

																	if (callback) {
																		callback(instance);
																	}

																});
											});
						});

	}

	// instance.appController.getComponent("RenderingEngine").hidePageLoading();
	// alert("addCompleteHandler : "+addCompleteHandler);

	/*
	 * instance.openMessageForm(uiCurrentMessage);
	 * 
	 * if (addCompleteHandler) { addCompleteHandler(instance.addNew,
	 * instance.uiMessageType, uiCurrentMessage, instance); }
	 * 
	 * if (instance.lookupSelectionHandler &&
	 * !uiCurrentMessage.dependendMessageProcessed) {
	 * uiCurrentMessage.dependendMessageProcessed = true;
	 * instance.lookupSelectionHandler(instance, instance.conceptLookup,
	 * uiCurrentMessage); }
	 * 
	 * uiCurrentMessage.rendered = true; $('#main').trigger('create');
	 * 
	 * if (callback) callback();
	 */

};
/**
 * Using dataLayer API load the script based on the message type and executes
 * using MessagScript API
 * 
 * @param uiCurrentMessage :
 *            Its an object of message.
 * @param instance :
 *            Its an object of uigenerator.
 * @param callback :
 *            Its a function which will be called after the completion of this
 *            method.
 * @returns {void}
 */
HIN.UIGenerator.prototype.loadAndExecuteMessagScript = function(
		uiCurrentMessage, instance, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");
	/*
	 * renderingEngine.showPageLoading("Script Loading...");
	 * renderingEngine.openModalDialog("Script Loading");
	 */

	var messageTypeScript = renderingEngine
			.getMessageScript(uiCurrentMessage.messageType);

	if (!messageTypeScript) {
		messageTypeScript = new MessageTypeScript(uiCurrentMessage.msg,
				uiCurrentMessage.messageType, instance.appController,
				uiCurrentMessage.messageAndUIBinder);
		instance.dataLayer
				.loadData(
						"JS_" + uiCurrentMessage.messageType,
						{},
						function(jsString) {
							// alert("Script loaded : " + jsString);

							try {
								if (jsString) {
									messageTypeScript.loadScript(jsString);
									if (!uiCurrentMessage
											.isInitializeScriptExecuted()) {
										uiCurrentMessage
												.setInitializeScriptExecuted(true);
										messageTypeScript.initialize();

										// added to avoid calling fill data more
										// than once
										/*
										 * var title =
										 * instance.uiCurrentMessage.title; if
										 * (!title) title = instance.getTitle();
										 * if (title != null)
										 * messageTypeScript.fillData(
										 * "messageTitle", title);
										 */

									}
									if (!uiCurrentMessage.taskVO)
										messageTypeScript.fillParticipants();

									var title = instance.uiCurrentMessage.title;
									if (!title)
										title = instance.getTitle();

									// title = instance.uiMessageType.typeName;
									if (title != null)
										messageTypeScript.fillData(
												"messageTitle", title);

								}
								/*
								 * renderingEngine.hidePageLoading();
								 * renderingEngine.closeModalDialog();
								 */
								if (callback) {
									callback(messageTypeScript);
								}

							} catch (e) {
								alert("Message Script for type "
										+ uiCurrentMessage.messageType
										+ " is not found : " + e);
								renderingEngine.hidePageLoading();
								renderingEngine.closeModalDialog();
							}
						});
	} else {

		messageTypeScript.messageAndUIBinder = uiCurrentMessage.messageAndUIBinder;

		if (!uiCurrentMessage.isInitializeScriptExecuted()) {
			uiCurrentMessage.setInitializeScriptExecuted(true);
			messageTypeScript.initialize();
		}
		if (!uiCurrentMessage.taskVO)
			messageTypeScript.fillParticipants();
	}
};
/**
 * Using MessageAndUIBinder API load message in to the form.
 * 
 * @param instance :
 *            Its an object of uigenerator.
 * @param uiCurrentMessage :
 *            Its an object of message.
 * @param properties :
 *            its an object that contains readOnly,finished etc.
 * @param messageTypeScript :
 *            Its an object of messageTypeScript.
 * @param callback :
 *            Its a function which will be called after the completion of this
 *            method.
 * @returns {void}
 */
HIN.UIGenerator.prototype.loadDataOntoForm = function(instance,
		uiCurrentMessage, properties, messageTypeScript, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");
	/*
	 * renderingEngine.showPageLoading("Form Rendering...");
	 * renderingEngine.openModalDialog("Form Rendering");
	 */
	try {
		/*
		 * var properties = new Object(); properties.readOnly = false;
		 */
		var finished = uiCurrentMessage.finished;
		var uiInstance = instance;
		// properties.readOnly = finished;
		// alert(finished);

		uiCurrentMessage.messageAndUIBinder = new MessageAndUIBinder(
				'inner-uiform-' + uiCurrentMessage.id, uiCurrentMessage.msg,
				uiCurrentMessage.messageType);

		var processName = instance.uiProcessDefinition.processName;
		var isMemberShipId = true;
		var isPatientTransfer = false;
		if (processName == "DemographicsAndBackground"
				&& uiCurrentMessage.messageType == AppConstants.XPaths.Registrtion.MESSAGE_TYPE) {
			var idValue = XmlUtil
					.getXPathResult(
							uiCurrentMessage.messageAndUIBinder.messageObject
									.getXML(),
							AppConstants.XPaths.PRPA_MT201000HT03.AS_IDENTIFICATIONS_ID,
							XPathResult.STRING_TYPE);
			idValue = (idValue && idValue.stringValue) ? idValue.stringValue
					: "";
			if (!idValue || idValue.length == 0) {
				isMemberShipId = false;
			}
			var checkinstate = renderingEngine.getComponent("Context")
					.getCheckinState();
			if (checkinstate == "transfer") {
				isMemberShipId = false;
				isPatientTransfer = true;
			}
		}

		if (isMemberShipId == false) {
			appController.getComponent("DataLayer").getMembershipId(
					function(id) {
						idValue = id;
						// alert(uiInstance);
						uiInstance.fillMembershipId(uiCurrentMessage, idValue);
						if (isPatientTransfer) {
							var orgId = appController.getComponent("Context")
									.getUserVo().assigningOrganizationID;
							uiInstance.fillOrganizationId(uiCurrentMessage,
									orgId);
						}
						var lookupHandler = uiInstance.dataLayer.lookupHandler;
						uiCurrentMessage.messageAndUIBinder.loadDataOntoForm(
								lookupHandler, properties, function() {
									// alert("rendered");
									/*
									 * renderingEngine.hidePageLoading();
									 * renderingEngine.closeModalDialog();
									 */
									if (callback)
										callback();
								});
					});

		} else {
			var lookupHandler = instance.dataLayer.lookupHandler;
			uiCurrentMessage.messageAndUIBinder.loadDataOntoForm(lookupHandler,
					properties, function() {
						/*
						 * renderingEngine.hidePageLoading();
						 * renderingEngine.closeModalDialog();
						 */
						// alert("rendered");
						if (callback)
							callback();
					});
		}
	} catch (e) {
		renderingEngine.hidePageLoading();
		renderingEngine.closeModalDialog();
		alert("MessageAndUIBinder loadDataOntoForm " + e);
		instance.appController.getComponent("RenderingEngine")
				.hidePageLoading();
	}
};
/**
 * Using dataLayer API load the script based on the message form and executes
 * using FormScript API
 * 
 * @param instance :
 *            Its an object of uigenerator.
 * @param uiCurrentMessage :
 *            Its an object of message.
 * @param callback :
 *            Its a function which will be called after the completion of this
 *            method.
 * @returns {void}
 */
HIN.UIGenerator.prototype.loadAndExecuteFormScript = function(instance,
		uiCurrentMessage, callback) {
	var renderingEngine = appController.getComponent("RenderingEngine");
	/*
	 * renderingEngine.showPageLoading("Form Script Loading...");
	 * renderingEngine.openModalDialog("Form Script Loading");
	 */
	try {

		var formScript = instance.getFormScript(uiCurrentMessage.id);

		// alert("messageForm: "
		// + messageForm);
		if (!formScript) {

			formScript = new FormScript(uiCurrentMessage,
					instance.appController, instance);
			instance.addFormScript(formScript);
			instance.dataLayer.loadData("FS_" + uiCurrentMessage.messageForm,
					{}, function(jsString) {
						// alert("Form
						// Script
						// loaded
						// : "
						// +
						// jsString);

						try {
							if (jsString) {
								formScript.loadScript(jsString);
								formScript.initialize();
								formScript.onLoad();
							}
							renderingEngine
									.fireEvent(AppConstants.Event.RESIZE);
							/*
							 * renderingEngine.hidePageLoading();
							 * renderingEngine.closeModalDialog();
							 */
							if (callback) {
								callback(formScript);
							}
						} catch (e) {
							renderingEngine.hidePageLoading();
							renderingEngine.closeModalDialog();
							alert("Form Script" + uiCurrentMessage.messageForm
									+ " is not found : " + e);

						}
					});
		} else if (formScript) {

			// alert(XmlUtil.xmlToString(msg.getXML()));

			formScript.message = uiCurrentMessage;
			formScript.uiGenerator = instance;
			formScript.initialize();
			formScript.onLoad();

			renderingEngine.fireEvent(AppConstants.Event.RESIZE);
			/*
			 * renderingEngine.hidePageLoading();
			 * renderingEngine.closeModalDialog();
			 */
			if (callback) {
				callback(formScript);
			}
		}

	} catch (e) {
		renderingEngine.hidePageLoading();
		renderingEngine.closeModalDialog();
		alert("Form Script" + messageForm + " is not found : " + e);

	}
};

HIN.UIGenerator.prototype.loadUIFormHandler = function(message, formRender,
		data, addCompleteHandler) {
	$('#inner-uiform-' + message.id).html(data);

	var dataLayer = appController.getComponent("DataLayer");
	dataLayer.processMessage(message, "", function(messageId, msg, messageObj) {
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var instance = page.uiInstances.get(message.instanceId).value;
		instance.formRender = true;
		instance.uiCurrentMessage = message;
		if (instance)
			instance.uiMessageCreationCompleteHandler(message,
					instance.addCompleteHandler, instance);
	});

};
/**
 * Creates the header UI for the each message type name
 * 
 * @param instanceId :
 *            Its a integer value
 * @param addTitle :
 *            Its a string value
 * @param title :
 *            Its a string value
 * @param messageType :
 *            Its an object of messageType.
 * @param display :
 *            Its a string value , 'none' or 'block'
 * @returns {void}
 */

HIN.UIGenerator.prototype.createMessageTypeUIGroupHeader = function(instanceId,
		addTitle, title, messageType, display) {
	var id = instanceId;
	var type = messageType.type;
	var typeName = messageType.typeName;

	var groupHeader = '<div id="uiform-sub-head' + id
			+ '" style="width: 100%;">';
	groupHeader += '<div class="ui-inner-display-box" id="inner-main-head' + id
			+ '"  typeName="' + typeName + '" title="' + title + '" >';

	var headerStyle = "ui-add-button-show";
	if (this.addIcon == "none") {
		headerStyle = "ui-add-button-hidden";
	}

	groupHeader += '<div class="ui-sub-header-bg ui-page-header-text '
			+ headerStyle + '" style="display:' + display + ';">';

	groupHeader += addTitle + ' </div> ';
	// groupHeader += title + ' </div>';
	groupHeader += '<div class="ui-add-icon ' + type + '"   style="display:'
			+ this.addIcon + ';z-index:10000"  id="' + id + '"  instanceId="'
			+ instanceId + '"  >'; // Verify this
	// will support
	// all browsers

	groupHeader += '<img src="images/add.png" />';
	groupHeader += '</div>';
	groupHeader += '</div>';
	groupHeader += '</div>';
	return groupHeader;
};

/**
 * Create the specified header UI to the component.
 * 
 * @param message :
 *            Its an object of message.
 * @param display :
 *            Its a string value , 'none' or 'block'
 * @returns {void}
 */
HIN.UIGenerator.prototype.createUIGroupChildHeader = function(message, display) {

	var id = message.id;
	var formName = message.messageForm;
	var header = message.title;
	var messageType = message.messageType;
	var typeName = message.groupName;

	var headerStyle = "ui-add-button-show";

	// alert(message.finished);
	/*
	 * if (this.singleForm == false) { if (message.finished == true) {
	 * this.hideRemoveIcon(); } else { this.showRemoveIcon(); } }
	 */

	/*
	 * if (this.removeIcon == "none" && this.addIcon == "none") { headerStyle =
	 * "ui-add-button-hidden"; }
	 */

	var pacakge = message.partOfPackage;
	if (pacakge == true) {
		// header += "(P)";
	}

	var groupChildHeader = '<div id="inner-sub-uiform-head' + id
			+ '" class="ui-inner-display-box">';
	groupChildHeader += '<div id="inner-uiform-head-' + id
			+ '" class="ui-sub-head-inner-bg ui-sub-header-text ' + headerStyle
			+ '" style="display:' + display + '" instanceId="'
			+ this.instanceId + '" messageObjId="' + message.id + '">';
	groupChildHeader += header;
	/*
	 * groupChildHeader += "message.finished : " + message.finished + "
	 * message.addNew : " + message.addNew;
	 */
	groupChildHeader += '</div>';
	/* alert(" message.deletable : " + message.deletable); */
	if ((message.finished == false && message.addNew == true)
			|| message.deletable == true) {
		if (this.singleForm == false) {
			groupChildHeader += '<div class="ui-delete-icon"   style="display:'
					+ this.removeIcon + '"    id="' + id + '"  instanceId="'
					+ this.instanceId + '"  >';
			groupChildHeader += '<img src="images/delete.png"  />';
			groupChildHeader += '</div>';
		}
	} else if (message.finished == true) {
		if (this.singleForm == false) {
			groupChildHeader += '<div class="ui-complete-icon"   style="display:block"    id="'
					+ id + '"  instanceId="' + this.instanceId + '"  >';
			groupChildHeader += '<img src="images/tick_black.png"  />';
			groupChildHeader += '</div>';
		}
	} else {
		if (this.singleForm == false) {
			groupChildHeader += '<div class="ui-delete-icon"   style="display:block"    id="'
					+ id + '"  instanceId="' + this.instanceId + '"  >';
			groupChildHeader += '<img src="" style="display:none"  />';
			groupChildHeader += '</div>';
		}
	}
	var formDisplay = "none";
	if (display == "none") {
		formDisplay = "block";
	}
	groupChildHeader += '<div id="inner-uiform-'
			+ id
			+ '"class="ui-inner-border" style="float:left;padding:1px;width:99%;display:'
			+ formDisplay + '">';
	groupChildHeader += '</div>';
	groupChildHeader += '</div>';

	/* alert("createUIGroupChildHeader : " + groupChildHeader); */
	return groupChildHeader;
};

/**
 * Create the specified header UI to the component.
 * 
 * @param message :
 *            Its an object of message.
 * @param display :
 *            Its a string value , 'none' or 'block'
 * @returns {void}
 */

HIN.UIGenerator.prototype.createUITableGroupChildHeader = function(message,
		display) {

	var id = message.id;
	var formName = message.messageForm;
	var messageType = message.messageType;

	var groupChildHeader = '';

	var formDisplay = "block";
	if (display == "none") {
		formDisplay = "block";
	}

	var uiForm = "";
	var form = "";
	form += '<div id="inner-sub-uiform-head' + id
			+ '" class="ui-inner-display-box table">';

	form += '<div id="inner-uiform-' + id
			+ '" style="float:left;width:100%;display:' + formDisplay + '">';
	form += '</div>';
	form += '</div>';

	if (!this.headerRendered) {
		groupChildHeader += '<div class="ui-inner-display-box">';
		groupChildHeader += this.tableHeaders;
		groupChildHeader += '</div>';
		uiForm += groupChildHeader;
	}

	if (message.insertBeforeFooter) {
		// groupChildHeader += form;
		// $('#footer-' + message.instanceId).css("background-color",
		// "#FF0000");
		$(form).insertBefore('#footer-' + message.instanceId);
	} else {
		uiForm += form;
	}

	return uiForm;
};

HIN.UIGenerator.prototype.createCustomUIGroupChildHeader = function(message,
		display) {

	var id = message.id;
	var formName = message.messageForm;
	var header = message.title;
	var messageType = message.messageType;
	var typeName = message.groupName;

	var headerStyle = "ui-add-button-show";

	// alert(message.finished);
	/*
	 * if (message.finished == true) this.hideRemoveIcon(); else
	 * this.showRemoveIcon();
	 */

	if (this.removeIcon == "none" && this.addIcon == "none") {
		headerStyle = "ui-add-button-hidden";
	}
	var groupChildHeader = "";
	/*
	 * var groupChildHeader = '<div id="inner-sub-uiform-head' + id + '"
	 * class="ui-inner-display-box">'; groupChildHeader += '<div
	 * id="inner-uiform-head-' + id + '" class="ui-sub-head-inner-bg
	 * ui-sub-header-text ' + headerStyle + '" style="display:' + display + '"
	 * instanceId="' + this.instanceId + '" messageObjId="' + message.id + '">';
	 * groupChildHeader += header; groupChildHeader += '</div>';
	 * groupChildHeader += '<div class="ui-delete-icon" style="display:' +
	 * this.removeIcon + '" id="' + id + '" instanceId="' + this.instanceId + '"
	 * >'; groupChildHeader += '<img src="images/delete.png" />';
	 * groupChildHeader += '</div>';
	 */
	var formDisplay = "none";
	if (display == "none") {
		formDisplay = "block";
	}
	groupChildHeader += '<div id="inner-uiform-'
			+ id
			+ '"class="ui-inner-border" style="float:left;padding:1px;width:99%;display:'
			+ formDisplay + '">';
	groupChildHeader += '</div>';
	groupChildHeader += '</div>';

	/* alert("createUIGroupChildHeader : " + groupChildHeader); */
	return groupChildHeader;
};

/**
 * Initiate to create the UI, based on the attributes like messageType,
 * messageForm, selectedTypeName etc and it will trigger the generateUI method
 * to render the form against the current message.
 * 
 * @param object:
 *            its an object that contains message index , messageType,
 *            messageForm, messageTypeName, category etc.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @returns {void}
 */
HIN.UIGenerator.prototype.createUIForm = function(/*
													 * uiMessageIndex,
													 * messageType, messageForm,
													 * selectedTypeName,
													 */object, addCompleteHandler, callbackHandler) {
	// alert("createUIForm callbackHandler " + callbackHandler);

	var uiMessageIndex = object.uiMessageIndex;
	var messageType = object.messageType;
	var messageForm = object.messageForm;
	var selectedTypeName = object.selectedTypeName;
	var partOfPackage = object.partOfPackage;
	var category = object.category;

	var message = null;
	if (uiMessageIndex != -1) {
		message = this.uiMessages[uiMessageIndex];
		message.messageTypeCompeletionTempStatus = this.uiMessageType.state;
		/*
		 * alert(message.messageProcessCompeletionStatus + " == " +
		 * message.messageTypeCompeletionTempStatus)
		 */
		if (message.messageProcessCompeletionStatus == message.messageTypeCompeletionTempStatus) {
			message.finished = true;
		} else {
			message.finished = false;
		}
		this.generateUI(message, addCompleteHandler, callbackHandler);
	}/* else { */

	/*
	 * else if (!messageType) {
	 * 
	 * message = this.creatMessage(); if (partOfPackage && partOfPackage ==
	 * true) message.partOfPackage = partOfPackage;
	 * 
	 * this.uiMessageType.addMessage(message); this.uiMessages.push(message);
	 * this.generateUI(message, addCompleteHandler, callbackHandler); } else {
	 */
	else {
		message = this.creatMessage();
		message.addNew = true;
		if (partOfPackage && partOfPackage == true)
			message.partOfPackage = partOfPackage;
		if (selectedTypeName)
			message.title = selectedTypeName;
		var messageTypeObj = null;
		if (messageType) {
			messageTypeObj = this.getMessageType(messageType)

			if (messageTypeObj) {
				this.uiMessageType = messageTypeObj;
				messageTypeObj.addMessage(message);
				this.addMessage(message);
				message.messageTypeCompeletionTempStatus = this.uiMessageType.state;
				// alert(messageTypeObj.state);

				this.uiSelectedStep.addMessageGroup(messageTypeObj, 1);
				this.generateUI(message, addCompleteHandler, callbackHandler);
			} else {
				/* alert("CreateUIForm TODO"); */

				messageTypeObj = factoryClass.createMessageType(messageType,
						this.uiMessageType.typeName, messageForm,
						selectedTypeName)
				messageTypeObj.category = category;
				// alert(messageTypeObj.state);
				this.uiMessageType = messageTypeObj;
				message.messageTypeCompeletionTempStatus = this.uiMessageType.state;
				messageTypeObj.addMessage(message);
				this.addMessageType(messageTypeObj)
				this.addMessage(message);
				this.uiSelectedStep.addMessageType(messageTypeObj);
				this.uiSelectedStep.addMessageGroup(messageTypeObj, 1);
				this.generateUI(message, addCompleteHandler, callbackHandler);

				/*
				 * if (this.createMessageTypeHandler) { var page =
				 * appController.getComponent("RenderingEngine")
				 * .getChildComponent("Form").getPage();
				 * this.createMessageTypeHandler(page, messageTypeObj, message,
				 * addCompleteHandler); } else { alert("Implement
				 * createMessageTypeHandler in step page"); }
				 */
			}
		}
	}

	// $('#main').trigger('create');

};

HIN.UIGenerator.prototype.creatMessage = function() {
	/*
	 * var id = idGenerator.getId(); message = new HIN.Message();
	 * message.instanceId = this.instanceId; // message.messageType =
	 * messageType;
	 * 
	 * message.messageId = ""; message.message = ""; message.messageStatus =
	 * "Pending"; // message.messageForm = messageForm; // message.title =
	 * selectedTypeName; message.title = this.uiMessageType.title; message.id =
	 * id; message.messageIndex = message.id; message.empty = false;
	 */
	var message = factoryClass.createMessage();
	message.instanceId = this.instanceId;
	message.title = this.uiMessageType.title;
	/* alert("creatMessage :" + message.instanceId); */
	return message;
};
/**
 * Generate the UI to be displayed as per the design.
 * 
 * @param message :
 *            Its an object of message.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @returns {void}
 * 
 */

HIN.UIGenerator.prototype.generateUI = function(message, addCompleteHandler,
		callbackHandler) {
	// alert("generateUI : " + message);
	var messageStr = '<fieldset class="ui-grid-b"><div class="ui-block-a">'
			+ message.messageForm + '</div>';
	messageStr += '<div class="ui-block-b" style="text-align:center;">-</div><div class="ui-block-c" style="text-align:right;">-</div></fieldset>'
	// alert("map" + this.instanceId);
	var title = this.getTitle();
	if (!this.tableFormat)
		title = this.getAddTitle();

	if (!this.tableFormat)
		$('#uiform-sub-head' + this.instanceId).find(
				'#inner-main-head' + this.instanceId).find(".ui-sub-header-bg")
				.html(title);

	if (!this.tableFormat) {
		// alert("openedForm: " + this.openedForm);
		if (this.openedForm) {
			$(this.openedForm).append(
					this
							.createCustomUIGroupChildHeader(message,
									this.subHeader));
		} else {
			$('#uiform-sub-head' + this.instanceId).append(
					this.createUIGroupChildHeader(message, this.subHeader));
		}

	} else {
		var uiForm = this
				.createUITableGroupChildHeader(message, this.subHeader);
		if (uiForm && uiForm.length > 0) {
			if (this.headerRendered == false) {
			}

			$('#uiform-sub-head' + this.instanceId).append(uiForm);
		}

		/*
		 * $(this.createUITableGroupChildHeader(message, this.subHeader)+"<div><h1>"+message.messageId+"</h1></div>")
		 * .insertBefore('#footer-' + message.instanceId);
		 */

		this.headerRendered = true;
	}

	// alert(this.formRender);
	// alert(message);
	if (this.formRender)
		this.loadUIMessageForm(message, this.formRender, this.loadUIForm,
				addCompleteHandler, callbackHandler);
	else
		this.loadUIForm(message, this.formRender, null, addCompleteHandler,
				callbackHandler);
};

HIN.UIGenerator.prototype.createNewUIForm = function() {

	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;

	if (instance.customRenderer == true) {
		instance.uiMessageType.formHtml = instance.customRendererForm;
		/*
		 * var formScript = null; for ( var index = 0; index <
		 * instance.formScripts.length; index++) { formScript =
		 * instance.formScripts[index]; } alert(formScript.message);
		 * formScript.reRender(); return;
		 */
	}

	if (instance.addInitialHandler)
		instance.addInitialHandler(instance);

	if (instance) {
		/* var message = instance.getMessage(this.id); */
		instance.addNew = true;
		instance.showRemoveIcon();
		// alert("createNewUIForm : " +
		// instance.messagTypeSelectionArray.length)
		if (!instance.lookup) {

			var object = new Object();
			object.uiMessageIndex = -1;
			object.messageType = instance.uiMessageType.type;
			object.messageForm = null;
			object.selectedTypeName = null;
			instance.createUIForm(object, instance.addCompleteHandler, null);

			/*
			 * instance.createUIForm(-1, null, null, null,
			 * instance.addCompleteHandler, null);
			 */
		} else {
			instance.createSelectionForm(null, instance.addCompleteHandler);

		}
	}

};

/*
 * HIN.UIGenerator.prototype.createNewAddUIForm = function() {
 * 
 * var instanceId = $(this).attr("instanceId"); var instance =
 * page.uiInstances.get(instanceId).value; if (instance) { instance.addNew =
 * true; var message = instance.getMessage(this.id);
 * 
 * instance.hideMainHeader(); instance.hideAddIcon(); //
 * alert("createNewAddUIForm : " + // instance.messagTypeSelectionArray.length);
 * if (!instance.lookup) {
 * 
 * 
 * instance.createUIForm(-1, message.messageType, message.groupName,
 * message.messageForm, message);
 * 
 * instance.createUIForm(-1, null, null, null, null,
 * instance.addCompleteHandler); } else { instance.createSelectionForm(message,
 * instance.addCompleteHandler); } } };
 */
/**
 * Trigger by clicking on the add icon from the UI and it provides an
 * autocomplete popup based on the category against a messageType.eg category
 * like 'Service','Drug','Role' nothing but concept class.
 * 
 * @param message :
 *            Its an object of message.
 * @param addCompleteHandler :
 *            Its an function or event handler
 * @returns {void}
 */
HIN.UIGenerator.prototype.createSelectionForm = function(message,
		addCompleteHandler) {
	if (this.lookup) {
		this.category = this.uiMessageType.category;

		// alert(this.category + " : " + this.uiMessageType);

		/*
		 * if (this.category == null || this.category.length <= 0) this.category =
		 * "Role";
		 */

		if (!this.category)
			this.category = "Service";
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var instance = page.uiInstances.get(this.instanceId).value;
		/*
		 * instance.dataLayer.loadAllConceptServices(instance.category,
		 * instance.loadlookups, instance);
		 */
		/* this.loadlookups(); */

		var searchCriteria = null;

		if (this.category == "Service") {
			var conceptClassNames = [ "Package", "Service" ];
			// var conceptClassNames = [ "Service" ];
			// conceptClassNames.push();
			searchCriteria = {
				"property" : "conceptClasses.name",
				"values" : conceptClassNames
			};
			instance.dataLayer.loadConcepts(searchCriteria,
					instance.loadlookups, instance);
		} else {

			instance.dataLayer.loadAllConceptServices(instance.category,
					instance.loadlookups, instance);
		}

		/* this.loadlookups(); */

	}
};
/**
 * Provides the autocomplete component based on the lookup category.
 * 
 * @param conceptServiceLookup :
 *            Its an object of conceptServiceLookup.
 * @param instance :
 *            Its an object of uigenerator.
 * @returns {void}
 */
HIN.UIGenerator.prototype.loadlookups = function(conceptServiceLookup, instance) {
	var lookups = conceptServiceLookup.getAllServices();
	// alert("lookups : " + lookups);
	instance.packageFinance = null;
	$('#selectionList').remove();

	var selection = '<div id="selectionList" class="ui-select-list-main">';
	selection += '<div class="ui-select-list-text"><label for="auto'
			+ instance.instanceId + '"> Add ' + instance.category
			+ ' </label></div>';
	selection += '<div class="ui-select-list-box"><input type="text"  id="auto'
			+ instance.instanceId
			+ '" instanceId="'
			+ instance.instanceId
			+ '"></input><ul id="ui_'
			+ instance.instanceId
			+ '" data-role="listview" data-theme="a" style="width: 100%;"></ul></div>';

	selection += '<div class="ui-select-list-button"><button type="cancel" onclick="$(\'#selectionList\').remove();" id="cancel'
			+ instance.instanceId + '" >Cancel</button></div>';
	selection += '</div>';

	$(selection).insertAfter(
			$('#inner-main-head' + instance.instanceId + ":first-child"));

	if (lookups) {
		var instanceId = instance.instanceId;
		$('#auto' + instance.instanceId)
				.autocomplete(
						{
							target : $("#ui_" + instance.instanceId),
							source : lookups,
							callback : function(e) {
								var $a = $(e.currentTarget);
								/*
								 * var code = (e.keyCode ? e.keyCode : e.which);
								 * if (code == 1) {
								 */
								var $name = $(e.currentTarget);
								/* var selectedTypeName = $name.text(); */
								var concepLookup = $name.attr('data-value');
								var selectedTypeName = $name.attr('data-value');
								// alert(selectedTypeName);
								var conceptVO = conceptServiceLookup
										.getConcept(selectedTypeName);
								// alert(conceptVO.name);
								$('#auto' + instanceId).val($a.text());
								/*
								 * if (selectedTypeName &&
								 * selectedTypeName.length > 2) {
								 */
								$('#auto' + instanceId).autocomplete('clear');

								var page = appController.getComponent(
										"RenderingEngine").getChildComponent(
										"Form").getPage();
								var instance = page.uiInstances.get(instanceId).value;

								var category = conceptVO.category;
								// alert(category)

								if (category && category == "Package") {

									if (page.processDefinition
											&& !page.processDefinition
													.isCleared()) {
										$('#auto' + instanceId).autocomplete(
												'clear');
										appController
												.getComponent("RenderingEngine")
												.openPromptModalDialog(
														"Add package after reset the report",
														function(result) {
															// alert(result);
														});

										return;
									}

									instance.formRender = false;
									// instance.conceptVO = conceptVO;

									page
											.lookupPackageSelectionHandler(
													instance,
													conceptVO,
													null,
													function(messageObjects) {

														/*
														 * alert("Package done " +
														 * messageObjects);
														 */

														var searchCriteria = {
															"property" : "conceptClasses.name",
															"value" : selectedTypeName,
															"category" : "Service"
														};
														instance.packageFinance = messageObjects;

														if (instance.packageFinance
																&& instance.packageFinance.length > 0) {
															var packageId = idGenerator
																	.getId();
															var messageObjects = instance.packageFinance;
															for ( var index = 0; index < messageObjects.length; index++) {
																messageObjects[index].packageId = packageId;
															}
														}

														instance.dataLayer
																.fetchConceptByClassName(
																		searchCriteria,
																		instance.loadAlllookups,
																		instance);
													});

								} else {
									instance.formRender = true;
									instance.conceptVO = conceptVO;
									instance.lookupCallBack(conceptVO,
											instance, function(message) {
												/* alert(message.messageType); */
											})
								}

							},
							minLength : 1
						});
	}
	$('#uiform-sub-head' + instance.instanceId).trigger('create');
	// $('#main').trigger('create');
};
/**
 * Trigger once choose the data from the autocomplete component and based on the
 * selection it may returns more than one concept and it iterates the concepts
 * which internally trigger the lookupCallBack method.
 * 
 * @param conceptServiceLookup :
 *            Its an array of conceptServiceLookup objects.
 * @param instance :
 *            Its an object of uigenerator.
 * @returns {void}
 */

HIN.UIGenerator.prototype.loadAlllookups = function(conceptServiceLookups,
		instance) {
	if (conceptServiceLookups) {
		instance.conceptServiceLookups = conceptServiceLookups;
	}

	if (instance.conceptServiceLookups) {
		var conceptLookup = instance.conceptServiceLookups.shift();
		if (conceptLookup) {
			/*
			 * alert(conceptLookup.getName() + " : " +
			 * conceptLookup.getAttribute("MessageType") +
			 * conceptLookup.getMessageTypeClassName());
			 */
			var conceptVO = conceptLookup.getConcept(conceptLookup.getName());
			conceptVO.partOfPackage = true;
			// alert(conceptLookup.getName() + " : " + conceptVO.getName());
			instance.lookupCallBack(conceptVO, instance)
			// instance.lookupCallBack(conceptLookup, instance);
			// instance.loadAlllookups(null, instance);
		} else {
			/*
			 * if (instance.addNew) { instance.updateProcess(); //
			 * alert("package compeleted"); }
			 */
		}
	} else {

		if (instance.addNew) {
			instance.updateProcess();
			// alert("service compeleted");
		}
	}

};
/**
 * Trigger once choose the data from the autocomplete component and based on the
 * concept API it identfies the attributes like message type,message form
 * etc.Then trigger createUIForm method to render the UI.
 * 
 * @param conceptVO :
 *            Its an object of conceptVO.
 * @param instance :
 *            Its an object of uigenerator.
 * @param callback :
 *            Its a function which will be called after the createUIForm
 *            completion.
 */
HIN.UIGenerator.prototype.lookupCallBack = function(conceptVO, instance,
		callback) {
	if (conceptVO) {
		var messageType = conceptVO.getAttribute("MessageType");
		var messageForm = conceptVO.getAttribute("MessageForm");
		var selectedTypeName = conceptVO.getDescription();// conceptVO.getName();
		if (messageType && messageForm) {

			instance.conceptLookup = conceptVO;
			if (instance.lookupSelectionValidateHandler) {
				instance.lookupSelectionValidateHandler(instance,
						instance.conceptLookup);
			} else if (instance && messageType && messageForm
					&& selectedTypeName) {
				// alert(messageType);

				var object = new Object();
				object.uiMessageIndex = -1;
				object.messageType = messageType;
				object.messageForm = messageForm;
				object.selectedTypeName = selectedTypeName;
				object.category = conceptVO.category;
				if (conceptVO.partOfPackage == true) {
					object.partOfPackage = true;
				} else {
					object.partOfPackage = false;
				}

				instance
						.createUIForm(
								object,
								instance.addCompleteHandler,
								function(uiCurrentMessage) {
									if (callback) {
										callback(uiCurrentMessage);
									}

									// alert("Done " + instance.packageFinance);
									if (instance.packageFinance
											&& instance.packageFinance.length > 0) {
										var messageObjects = instance.packageFinance;
										for ( var index = 0; index < messageObjects.length; index++) {
											// alert(messageObjects[index]);
											// alert(uiCurrentMessage);
											uiCurrentMessage.packageId = messageObjects[index].packageId;
											uiCurrentMessage
													.addDependendMessage(messageObjects[index]);
										}
										if (instance.addNew) {
											instance.updateProcess();
											// alert("package compeleted");
										}
									}
									// instance.packageFinance = null;

								});
			}
		} else {
			instance.conceptLookup = null;
			instance.loadAlllookups(null, instance);
		}
		$('#selectionList').remove();
	} else {
		instance.conceptLookup = null;
	}
};

HIN.UIGenerator.prototype.hideUIForm = function(instance, id) {
	$('#inner-sub-uiform-head' + id).hide();
};

HIN.UIGenerator.prototype.showUIForm = function(instance, id) {
	$('#inner-sub-uiform-head' + id).show();
};

HIN.UIGenerator.prototype.hideSection = function(instance, messageType) {

	$(
			'#inner-form-' + messageType.typeName + 'Placeholder-'
					+ instance.instanceId).hide();
};

HIN.UIGenerator.prototype.showSection = function(instance, messageType) {

	$(
			'#inner-form-' + messageType.typeName + 'Placeholder-'
					+ instance.instanceId).show();
};

var deletedMessage = null;
var deletedMessageInstance = null;

/**
 * Trigger by clicking on the delete icon from the UI and it propogates the
 * event to the step page.
 * 
 * @returns {void}
 */

HIN.UIGenerator.prototype.removeUIForm = function() {

	var instanceId = $(this).attr("instanceId");
	var messageId = this.id;
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var map = page.uiInstances.get(instanceId);

	deletedMessageInstance = null;
	deletedMessage = null;
	var title = "";
	if (map)
		deletedMessageInstance = map.value;
	if (deletedMessageInstance) {
		deletedMessage = deletedMessageInstance.getMessage(messageId);
		if (deletedMessage.title)
			title = "'" + deletedMessage.title + "'";
	}

	appController
			.getComponent("RenderingEngine")
			.openPromptOkCancelModalDialog(
					"Do you want to delete " + title + " ?",
					function(result) {
						if (result == true) {

							if (deletedMessageInstance && deletedMessage) {
								// deletedMessageInstance.uiSelectedStep.removeMessage(message.messageId)
								if (deletedMessageInstance.singleButton == false
										&& deletedMessageInstance.tableFormat == false)
									deletedMessageInstance.renderTaskUI(null);

								$('#inner-sub-uiform-head' + deletedMessage.id)
										.remove();
								var dependendMessages = deletedMessage.dependendMessages;
								if (dependendMessages) {
									for ( var index = 0; index < dependendMessages.length; index++) {
										$(
												'#inner-sub-uiform-head'
														+ dependendMessages[index].id)
												.remove();
									}
								}

								// message =
								// deletedMessageInstance.getMessage(id);
								// deletedMessageInstance.deleteMessage(message.id);
								deletedMessage.markAsObsolete();
								var messageType = deletedMessageInstance.uiSelectedStep
										.getMessageTypeByType(deletedMessage.messageType);

								if (deletedMessageInstance.uiProcessDefinition.processName == "StaffRegistration"
										&& (messageType.type == "ROLE_PHYSICIAN" || messageType.type == "ROLE_EMPLOYEE")) {
									permissionMessageIndex = 0;

									if (!deletedMessage.messageAndUIBinder
											&& deletedMessage.msg) {
										deletedMessage.messageAndUIBinder = new MessageAndUIBinder(
												null, deletedMessage.msg,
												deletedMessage.messageType);
									}
									if (deletedMessage.messageAndUIBinder) {
										deletedMessageInstance
												.deleteRolePermission(
														messageType,
														deletedMessage,
														deletedMessageInstance);
									} else {

										var dataLayer = appController
												.getComponent("DataLayer");
										dataLayer
												.getMessageInternal(
														deletedMessage,
														function(messageId,
																msg,
																deletedMessage) {
															deletedMessage.messageAndUIBinder = new MessageAndUIBinder(
																	null,
																	deletedMessage.msg,
																	deletedMessage.messageType);
															deletedMessageInstance
																	.deleteRolePermission(
																			messageType,
																			deletedMessage,
																			deletedMessageInstance);

														});

									}

								} else {

									if (messageType) {
										messageType
												.removeMessage(deletedMessage);
										deletedMessageInstance.uiSelectedStep
												.updateMessageGroupByType(
														messageType, 1);
									}

									if (deletedMessage.rendered) {
										var cacheManager = appController
												.getComponent("DataLayer").cacheManager;
										cacheManager.renderProcessUpdate = false;
										cacheManager.syncToCouch = true;
										var processObjects = [];
										var dataLayer = appController
												.getComponent("DataLayer");
										dataLayer.createOrUpdateTask(
												deletedMessage.taskVO,
												deletedMessage, processObjects);
									}

									deletedMessageInstance.updateProcess();

									if (deletedMessageInstance.removeCompleteHandler) {
										deletedMessageInstance
												.removeCompleteHandler(
														deletedMessageInstance.uiMessageType,
														deletedMessage,
														deletedMessageInstance);
									}
								}
							}
						}
					});

};

HIN.UIGenerator.prototype.deleteRolePermission = function(messageType,
		deletedMessage, deletedMessageInstance) {

	var roleId = deletedMessage.messageAndUIBinder.getIdRootValue("HIN_MSG_ID");
	// alert("roleId : " + roleId);
	var step3 = deletedMessageInstance.uiProcessDefinition.getStep("Step3");
	var permissionMessageType = step3.getMessageTypeByType("ROLE_PERMISSION");
	var permissionMessages = permissionMessageType.getMessages();
	deletedMessageInstance
			.getPermission(
					deletedMessageInstance,
					roleId,
					permissionMessages,
					function(permissionMessage) {
						if (permissionMessage) {
							permissionMessageType
									.removeMessage(permissionMessage);
							step3.updateMessageGroupByType(
									permissionMessageType, 1);
						}

						if (messageType) {
							messageType.removeMessage(deletedMessage);
							deletedMessageInstance.uiSelectedStep
									.updateMessageGroupByType(messageType, 1);
						}

						// if (deletedMessage.rendered) {
						var cacheManager = appController
								.getComponent("DataLayer").cacheManager;
						cacheManager.renderProcessUpdate = false;
						cacheManager.syncToCouch = true;
						var processObjects = [];
						var dataLayer = appController.getComponent("DataLayer");
						dataLayer.createOrUpdateTask(deletedMessage.taskVO,
								deletedMessage, processObjects);
						// }

						deletedMessageInstance.updateProcess();

						if (deletedMessageInstance.removeCompleteHandler) {
							deletedMessageInstance.removeCompleteHandler(
									deletedMessageInstance.uiMessageType,
									deletedMessage, deletedMessageInstance);
						}

					});

};

/**
 * Render the taskbar UI and this method will decide, which task actions need to
 * be shown in taskbar UI.
 * 
 * @param message :
 *            Its an object of message.
 * @returns {void}
 */
HIN.UIGenerator.prototype.renderTaskUI = function(message) {

	if (message && (!this.innerPage || this.packagePage)
			&& this.actions == true) {
		/*
		 * if (message.readOnly) { $('#' + this.uiSelectedStep.stepName +
		 * '_pageActions').html(""); return; }
		 */

		var taskActionsUI = "";
		var taskVO = message.taskVO;
		var title = "";
		if (message.title)
			title = message.title;
		if (!title)
			title = this.uiMessageType.typeName;

		if (this.singleButton == true || this.finishTitleOnly == true)
			title = "";

		if (taskVO) {
			for ( var index = 0; index < taskVO.taskOutComes.length; index++) {
				var label = taskVO.taskOutComes[index];
				var buttonUI = '<div style="float:left">';
				buttonUI += '<input class="taskOutcome" instanceId="'
						+ message.instanceId + '" id="' + message.id
						+ '" type="button" value="' + label + '">';
				buttonUI += '</div>';

				var buttonUI = '';
				if (this.finish) {
					buttonUI = '<div class="ui-process-button taskOutcome" instanceId="'
							+ message.instanceId
							+ '" id="'
							+ message.id
							+ '" value="'
							+ label
							+ '"  style="width:auto;" >'
							+ title
							+ ' Finish '

							/* + '[' + message.id + ']' */

							+ ' <img src="images/finish.png" style="padding-left:30px;" /></div>';
				}
				if (this.refresh) {
					buttonUI += '<div class="ui-process-button taskSync" instanceId="'
							+ message.instanceId
							+ '" id="'
							+ message.id
							+ '"value="'
							+ label
							+ '" style="width:120px" >Refresh '
							+ ' <img src="images/refresh.png"/></div>';
				}
				if (this.clearHandler) {
					buttonUI += '<div class="ui-process-button clear" instanceId="'
							+ message.instanceId
							+ '" id="'
							+ message.id
							+ '"value="'
							+ label
							+ '" style="width:120px" >Reset '
							+ ' <img src="images/clear.png"/></div>';
				}
				if (this.cancelHandler) {
					buttonUI += '<div class="ui-process-button cancel" instanceId="'
							+ message.instanceId
							+ '" id="'
							+ message.id
							+ '"value="'
							+ label
							+ '" style="width:120px" >Cancel '
							+ ' <img src="images/cancel.png"/></div>';
				}

				taskActionsUI += buttonUI;
			}
		} else {
			var buttonUI = '';
			if (this.finish) {
				buttonUI = '<div class="ui-process-button taskOutcome" instanceId="'
						+ message.instanceId
						+ '" id="'
						+ message.id
						+ '" value="" style="width:auto;" >'
						+ title
						+ ' Finish '

						/* + '[' + message.id + ']' */

						+ '<img src="images/finish.png" style="padding-left:30px;" /></div>';
			}

			if (this.clearHandler) {
				buttonUI += '<div class="ui-process-button clear" instanceId="'
						+ message.instanceId + '" id="' + message.id
						+ '"value="' + label + '" style="width:120px" >Reset '
						+ ' <img src="images/refresh.png"/></div>';
			}

			if (this.cancelHandler) {
				buttonUI += '<div class="ui-process-button cancel" instanceId="'
						+ message.instanceId
						+ '" id="'
						+ message.id
						+ '"value="'
						+ label
						+ '" style="width:120px" >Cancel '
						+ ' <img src="images/refresh.png"/></div>';
			}

			taskActionsUI += buttonUI;
		}

		/*
		 * var assignablePeopleMap = taskVO.assignablePeople; if
		 * (taskVO.assignablePeople) { var comboUI = '<div
		 * style="float:left">'; comboUI += '<select class="taskAssignee" id="' +
		 * message.id + '" instanceId="' + message.instanceId + '" id="' +
		 * message.id + '" data-native-menu="false">'; comboUI += '<option
		 * value="-1">-Select-</option>'; for ( var index = 0; index <
		 * taskVO.assignablePeople.length(); index++) { var map =
		 * taskVO.assignablePeople.getItemAt(index); var value = map.key; var
		 * label = map.value; comboUI += '<option value="' + value + '">' +
		 * label + '</option>'; } comboUI += "</select>"; comboUI += '</div>';
		 * taskActionsUI += comboUI; }
		 */

		$('#' + this.uiSelectedStep.stepName + '_pageActions').html("");
		$('#' + this.uiSelectedStep.stepName + '_pageActions').html(
				taskActionsUI);

		$('#' + this.uiSelectedStep.stepName + '_pageActions').find(
				'.taskOutcome').unbind("click", this.taskOutcomeHandler);
		$('#' + this.uiSelectedStep.stepName + '_pageActions').find(
				'.taskOutcome').bind("click", this.taskOutcomeHandler);

		$('#' + this.uiSelectedStep.stepName + '_pageActions')
				.find('.taskSync').unbind("click", this.taskSyncHandler);
		$('#' + this.uiSelectedStep.stepName + '_pageActions')
				.find('.taskSync').bind("click", this.taskSyncHandler);

		$('#' + this.uiSelectedStep.stepName + '_pageActions').find('.clear')
				.unbind("click", this.clearHandler);
		$('#' + this.uiSelectedStep.stepName + '_pageActions').find('.clear')
				.bind("click", this.clearHandler);

		$('#' + this.uiSelectedStep.stepName + '_pageActions').find('.cancel')
				.unbind("click", this.cancelHandler);
		$('#' + this.uiSelectedStep.stepName + '_pageActions').find('.cancel')
				.bind("click", this.cancelHandler);

		$('#uiform-sub-head' + message.id).trigger('create');
	} else {
		$('#' + this.uiSelectedStep.stepName + '_pageActions').html("");
	}

	$(".ui-process-button").hover(function() {
		$(this).css('background', '#8d007f');
	}, function() {
		$(this).css('background', '#6B1E64');
	});

};

/**
 * Trigger by clicking on the finish button from the taskbar and it propogates
 * the event to the step page.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.taskOutcomeHandler = function() {
	// $(this).hide();// Hide Finish Button
	/* $(this).addClass('ui-process-button-pressed'); */
	$(this).css('background', '#b2479f');
	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;
	if (instance) {
		page.currentUIInstance = instance;
		var id = $(this).attr("id");
		var message = instance.getMessage(id);
		if (message) {

			var taskVO = message.taskVO;
			if (taskVO) {
				taskVO.outCome = $(this).attr("value");

			}

			// alert(message);
			instance.selectedMessage = message;
			instance.selectedTask = taskVO;

			// alert(instance.selectedMessage + "," +
			// instance.selectedTask);
			// alert("instance.taskHandler : " + instance.taskHandler);

			if (instance.taskHandler) {
				instance.taskHandler(message, taskVO, instance);
			} else {
				instance.complete(instance, instance.saveTask);
				/*
				 * appController.getComponent("DataLayer").createOrUpdateTask(taskVO,
				 * message.messageId);
				 */
			}

		} else {
			alert("Message No Found.");
		}
	}
};
/**
 * Trigger if taskhandler method which is not implemented in step page *
 * 
 * @param instance :
 *            Its an object of uigenerator.
 * @returns {void}
 */
HIN.UIGenerator.prototype.saveTask = function(instance) {
	if (instance.selectedMessage) {
		instance.complete();

		if (instance.selectedMessage.partOfPackage == true
				&& instance.selectedMessage.packageId != null) {
			instance.uiSelectedStep
					.removeDependendMessages(instance.selectedMessage);
		}
		var lastOne = instance.uiSelectedStep
				.isFinished(instance.selectedMessage);
		// alert(lastOne);

		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		if (instance.singleForm == true || instance.singleButton == true
				|| lastOne == true)
			cacheManager.renderProcessUpdate = true;
		else
			cacheManager.renderProcessUpdate = false;
		cacheManager.syncToCouch = true;

		instance.dataLayer.createOrUpdateTask(instance.selectedTask,
				instance.selectedMessage);
	} else {
		alert("selectedMessage is not available");
	}
};

/**
 * ProcessTask method should be call from the taskhandler method which is
 * implemented in step page,it saves the currently opened message and process
 * definitions as per business logic. This method have the capability to decide
 * whether page can be redirected to the process page or not. *
 * 
 * @param processObjects :
 *            Its an array of processdefinition objects.
 * @returns {void}
 */
HIN.UIGenerator.prototype.processTask = function(processObjects) {
	if (this.selectedMessage) {
		this.complete();

		if (this.selectedMessage.partOfPackage == true
				&& this.selectedMessage.packageId != null) {
			this.uiSelectedStep.removeDependendMessages(this.selectedMessage);
		}
		var lastOne = this.uiSelectedStep.isFinished(this.selectedMessage);
		// alert(lastOne);

		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		if (this.singleForm == true || this.singleButton == true
				|| lastOne == true)
			cacheManager.renderProcessUpdate = true;
		else
			cacheManager.renderProcessUpdate = false;
		cacheManager.syncToCouch = true;

		var dataLayer = appController.getComponent("DataLayer");
		dataLayer.createOrUpdateTask(this.selectedTask, this.selectedMessage,
				processObjects);
	} else {
		alert("selectedMessage is not available");
	}
};

HIN.UIGenerator.prototype.taskAssigneeHandler = function() {

	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var instance = page.uiInstances.get(instanceId).value;
	if (instance) {
		var id = $(this).attr("id");
		var message = instance.getMessage(id);
		/*
		 * var id = $(this).id; fix this issue alert(id);
		 */
		var assignee = $('#inner-uiform-' + message.id).find(
				'#' + message.id + ' option:selected').val(); // insteadof
		// message.id use id
		var taskVO = message.taskVO;
		if (taskVO) {
			taskVO.assignee = assignee;
		}
	}

};
/**
 * Trigger by clicking on the refresh button from the taskbar and it propogates
 * the event to the step page.
 * 
 * @returns {void}
 */

HIN.UIGenerator.prototype.taskSyncHandler = function() {
	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	var instance = page.uiInstances.get(instanceId).value;
	if (instance.refreshHandler) {
		instance.refreshHandler(instance);
		return;
	}

	if (instance) {
		var id = $(this).attr("id");
		var message = instance.getMessage(id);
		if (message) {
			var taskVO = message.taskVO;
			if (taskVO) {
				// alert("Refresh Task : " + taskVO.taskId);
				var dataLayer = appController.getComponent("DataLayer");

				dataLayer
						.getMessageTask(
								message.messageId,
								message,
								dataLayer.getMessageInternal,
								function(messageId, msg, message) {
									message.msg = msg;
									message.message = msg.getXML()
									// alert(message);
									/*
									 * alert("Message xml1 : " +
									 * XmlUtil.xmlToString(message.msg
									 * .getXML()));
									 */

									var properties = new Object();
									properties.readOnly = message.readOnly;
									var finished = message.finished;
									// properties.readOnly = finished;

									if (message.messageAndUIBinder) {
										message.messageAndUIBinder.messageObject = msg;
										var lookupHandler = this.appController
												.getComponent("DataLayer").lookupHandler;
										message.messageAndUIBinder
												.loadDataOntoForm(
														lookupHandler,
														properties,
														function() {

															var renderingEngine = appController
																	.getComponent("RenderingEngine");
															var formScript = instance
																	.getFormScript(message.id);
															// alert("message.messageForm:
															// "+
															// message.messageForm);
															if (!formScript
																	&& message.messageForm) {
																formScript = new FormScript(
																		message,
																		this.appController,
																		this);
																instance
																		.addFormScript(formScript);
																instance.dataLayer
																		.loadData(
																				"FS_"
																						+ message.messageForm,
																				{},
																				function(
																						jsString) {

																					try {
																						formScript
																								.loadScript(jsString);
																						formScript
																								.initialize();
																						formScript
																								.onLoad();
																					} catch (e) {
																						alert("FormScript "
																								+ messageForm
																								+ " is not found : "
																								+ e);
																					}
																				});

															} else {
																formScript
																		.initialize();
																formScript
																		.onLoad();
															}
														});

									}
								}, true);

			}
		}
	}

};

/**
 * Trigger by clicking on the reset button from the taskbar and it propogates
 * the event to the step page.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.clearHandler = function() {
	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	var instance = page.uiInstances.get(instanceId).value;
	if (instance.clearHandler) {
		instance.clearHandler(instance);
		return;
	}
};
/**
 * Trigger by clicking on the cancel button from the taskbar and it propogates
 * the event to the step page.
 * 
 * @returns {void}
 */

HIN.UIGenerator.prototype.cancelHandler = function() {
	var instanceId = $(this).attr("instanceId");
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();

	var instance = page.uiInstances.get(instanceId).value;
	if (instance.cancelHandler) {
		instance.cancelHandler(instance);
		return;
	}
};

/**
 * Trigger by clicking on the finish button from the taskbar and it propogates
 * the event to the step page.
 * 
 * @param page :
 *            Its an object of page.
 * @returns {void}
 */
HIN.UIGenerator.prototype.finishCompleteHandler = function(page) {
	// alert("UI Finished : " + page.currentUIInstance);
	if (page.currentUIInstance && !page.currentUIInstance.tableFormat) {
		var selectedMessage = page.currentUIInstance.selectedMessage
		page.currentUIInstance.openMessageForm(selectedMessage);
		// page.currentUIInstance.selectedMessage = null;
		if (page.currentUIInstance.singleForm == false) {
			$('#inner-sub-uiform-head' + selectedMessage.id).find(
					'#' + selectedMessage.id).removeClass('ui-delete-icon');
			$('#inner-sub-uiform-head' + selectedMessage.id).find(
					'#' + selectedMessage.id).addClass('ui-complete-icon');
			$('#inner-sub-uiform-head' + selectedMessage.id).find(
					'#' + selectedMessage.id).find('img').attr('src',
					'images/tick_black.png')
			$('#inner-sub-uiform-head' + selectedMessage.id).find(
					'#' + selectedMessage.id).find('img').css('display',
					'block')
		}
		page.currentUIInstance = null;
		var cacheManager = appController.getComponent("DataLayer").cacheManager;
		cacheManager.renderProcessUpdate = true;
		cacheManager.syncToCouch = true;
	}
};

/**
 * Trigger the complete method inside the message script API, based on the
 * currently loaded message.
 * 
 * @param instance :
 *            Its an object of uigenerator.
 * @param callback :
 *            Its a function which will be called after the complete.
 * @returns {void}
 */
HIN.UIGenerator.prototype.complete = function(instance, callBack) {

	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	var messageType = this.uiCurrentMessage.messageType;
	var curMessage = this.uiCurrentMessage;
	page.complete(curMessage);
	if (callBack)
		callBack(instance);

};

/**
 * Get the html content using datalayer API based on message form. *
 * 
 * @param message :
 *            Its an object of message.
 * @param formRender :
 *            Its a boolean value.
 * @param func:
 *            Its a function which will be called after the loadUIMessageForm.
 * @param addCompleteHandler :
 *            Its a function which will be called based on the life cycle.
 * @param callbackHandler :
 *            Its a function which will be called based on the life cycle.
 * @returns {void}
 */
HIN.UIGenerator.prototype.loadUIMessageForm = function(message, formRender,
		func, addCompleteHandler, callbackHandler) {
	// alert(message.messageForm + " : " + formRender);

	var messageForm = message.messageForm;
	if (message.transactionType == "DISCOUNT") {
		message.messageForm = "DISCOUNT_FORM";
		messageForm = message.messageForm;
		// message.formView = false;
	}
	if (message.transactionType == "LICENSEEDISCOUNT") {
		message.messageForm = "LICENSEE_DISCOUNT_FORM";
		messageForm = message.messageForm;
	}

	if (message.formView == false) {
		$('#inner-uiform-' + message.id).hide();
	}
	var dataLayer = appController.getComponent("DataLayer");

	if (formRender) {

		dataLayer.loadData("FM_" + messageForm, {},
				function(htmlString) {
					// alert("loadUIMessageForm callback : " + callbackHandler);
					try {
						if (func)
							func(message, formRender, htmlString,
									addCompleteHandler, callbackHandler);
						appController.getComponent("RenderingEngine")
								.fireEvent(AppConstants.Event.RESIZE);
					} catch (e) {
						alert("Form " + messageForm + " is not found : " + e);
						if (func)
							func(message, formRender, htmlString,
									addCompleteHandler, callbackHandler);
						appController.getComponent("RenderingEngine")
								.fireEvent(AppConstants.Event.RESIZE);
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
					}

				});

		/*
		 * var map = dataLayer.messageFormMap.get(message.messageForm); if (map) {
		 * if (func) func(message, formRender, map.value, addCompleteHandler);
		 * appController.getComponent("RenderingEngine").hidePageLoading(); }
		 * else { var url = "../message-forms/" + message.messageForm + ".html"; $
		 * .ajax({
		 * 
		 * type : "GET", url : url, dataType : "html", cache : false, success :
		 * function(data) {
		 * 
		 * dataLayer.messageFormMap.put(message.messageForm, data); var map =
		 * dataLayer.messageFormMap .get(message.messageForm); if (func)
		 * func(message, formRender, map.value, addCompleteHandler);
		 * 
		 * 
		 * if (func) func(message, formRender, data, addCompleteHandler);
		 * 
		 * appController.getComponent("RenderingEngine")
		 * .fireEvent(AppConstants.Event.RESIZE);
		 * appController.getComponent("RenderingEngine") .hidePageLoading(); },
		 * 
		 * error : function(request, error) {
		 * 
		 * alert("Message Form Not Found : " + request + ": " + error);
		 * 
		 * appController.getComponent("RenderingEngine") .hidePageLoading(); }
		 * }); }
		 */
	} else {
		alert("Form Render On Demand");
	}
};

HIN.UIGenerator.prototype.addMessage = function(message) {
	var messageObject = this.getMessage(message.id)
	/*
	 * alert(message.id + " : " + message.messageId + " : " +
	 * message.instanceId);
	 */
	if (!messageObject) {
		message.instanceId = this.instanceId;
		message.rendered = false;
		this.uiMessages.push(message);
	} else {
		messageObject.instanceId = this.instanceId;
		/* alert("Exist : " + messageObject.instanceId); */
	}
};
HIN.UIGenerator.prototype.getMessage = function(id) {
	// alert(this.uiMessages.length + " : " + id);
	for ( var index = 0; index < this.uiMessages.length; index++) {
		// alert(this.uiMessages[index].id + " : " + id);
		if (this.uiMessages[index].id == id) {
			return this.uiMessages[index];
		}
	}
};

HIN.UIGenerator.prototype.getMessages = function() {
	return this.uiMessages;
};

HIN.UIGenerator.prototype.deleteMessage = function(id) {
	var deleteIndex = -1;
	for ( var index = 0; index < this.uiMessages.length; index++) {
		if (this.uiMessages[index].id == id) {
			deleteIndex = index;
			break;
		}
	}
	if (deleteIndex != -1) {
		this.uiMessages.splice(deleteIndex);
	}
};

HIN.UIGenerator.prototype.addFormScript = function(formScript) {
	this.formScripts.push(formScript);
};

HIN.UIGenerator.prototype.getFormScript = function(id) {
	// alert(this.formScripts.length + " : " + id);
	for ( var index = 0; index < this.formScripts.length; index++) {
		// alert(this.uiMessages[index].id + " : " + id);
		if (this.formScripts[index].message.id == id) {
			return this.formScripts[index];
		}
	}
};

HIN.UIGenerator.prototype.deleteFormScript = function(id) {
	var deleteIndex = -1;
	for ( var index = 0; index < this.formScripts.length; index++) {
		if (this.formScripts[index].id == id) {
			deleteIndex = index;
			break;
		}
	}
	if (deleteIndex != -1) {
		this.formScripts.splice(deleteIndex);
	}
};

/**
 * Trigger from the page component and initiates to generate UI and event
 * handlers.
 * 
 * @returns {void}
 */
HIN.UIGenerator.prototype.load = function() {
	// this.sortType = sortType;
	this.uiProcessDefinition = appController.getComponent("RenderingEngine")
			.getChildComponent("Process").getProcessDefinition();
	this.uiSelectedStep = appController.getComponent("RenderingEngine")
			.getChildComponent("Form").selectedStep;
	var addTitle = this.getAddTitle();// getTitle();
	var title = this.getTitle();

	var groupHeader = this.createMessageTypeUIGroupHeader(this.instanceId,
			addTitle, title, this.uiMessageType, this.mainHeader);

	$('#' + this.uiPlaceholder).append(groupHeader);
	$('#' + this.uiPlaceholder)
			.append(
					'<div id="footer-'
							+ this.instanceId
							+ '" style="float:right;width:100%;border:0px solid #000000;padding:0px"></div>');

	$('.' + this.uiMessageType.type).unbind("click", this.createNewUIForm);
	$('.' + this.uiMessageType.type).bind("click", this.createNewUIForm);

	$('.ui-delete-icon').die("click", this.removeUIForm);
	$('.ui-delete-icon').live("click", this.removeUIForm);

	if (this.uiMessageType.headerView == false) {
		$('#uiform-sub-head' + this.instanceId).hide();
	} else {
		$('#uiform-sub-head' + this.instanceId).show();
	}

	if (this.singleForm && (!this.uiMessages || this.uiMessages.length == 0)) {
		var message = factoryClass.createMessage();
		message.instanceId = this.instanceId;
		this.uiMessages.push(message);
		this.uiMessageType.addMessage(message);
	}
	this.loadUIForms();

};

/**
 * Provides the title from the message type.
 * 
 * @returns {String}
 */
HIN.UIGenerator.prototype.getTitle = function() {

	var title = this.uiMessageType.title;

	if (this.uiMessages.length == 1) {
		title = this.uiMessageType.typeName;
		if (this.uiProcessDefinition.processName == "Accounts"
				|| this.uiProcessDefinition.processName == "LicenseeAccounts")
			title = this.uiMessageType.title;
	}

	// alert("Title: " + title)

	if (!title)
		title = this.uiMessageType.typeName;
	if (!title)
		title = this.uiMessageType.type;
	if (title)
		title = title.replace(/_/g, " ");

	// this.uiMessages = this.uiMessageType.getMessages();

	// alert("Title: " + title)

	/*
	 * if (this.uiMessages.length == 0) { var vowelRegex = /^[AEIOU]/; if
	 * (title.match(vowelRegex) != null) { title = "an " + title; } else { title =
	 * "a " + title; } title = "< Add " + title + " >"; }
	 */

	return title;
};

/**
 * Provides the title from the message type and it appends the prefix like 'Add
 * a ' or 'Add an '.
 * 
 * @returns {String}
 */
HIN.UIGenerator.prototype.getAddTitle = function() {

	var title = this.uiMessageType.typeName;
	if (this.uiProcessDefinition.processName == "Accounts"
			|| this.uiProcessDefinition.processName == "LicenseeAccounts")
		title = this.uiMessageType.title;

	if (this.customTitleRenderer == true) {
		title = this.customTitle;
	}

	if (title)
		title = title.replace(/_/g, " ");

	// this.uiMessages = this.uiMessageType.getMessages();

	// alert("Title: " + title)

	if (this.addIcon == "block") {// this.uiMessages.length == 0) {
		var vowelRegex = /^[AEIOU]/;
		if (title.match(vowelRegex) != null) {
			title = "an " + title;
		} else {
			title = "a " + title;
		}
		title = "< Add  " + title + " >";
	}

	return title;
};

/**
 * Changes in the message object will be updated the process definition and
 * persist.
 * 
 * @returns {void}
 */

HIN.UIGenerator.prototype.updateProcess = function() {

	// alert("updateProcess");
	// return;
	var page = appController.getComponent("RenderingEngine").getChildComponent(
			"Form").getPage();
	if (page.processDefinition.processName == "Appointments"
			|| page.processDefinition.processName == "Accounts"
			|| page.processDefinition.processName == "LicenseeAccounts") {
		return;
	} else {
		// alert("updateProcess : " + page.processDefinition.processName);
		var processObjects = [ page.processDefinition ];
		var processManagerCache = appController.getComponent("DataLayer").cacheManager.processManagerCache;
		processManagerCache.renderProcessUpdate = false;
		processManagerCache.syncToCouch = false;
		processManagerCache.saveProcess(processObjects);
	}
}

HIN.UIGenerator.prototype.fillMembershipId = function(message, membershipId) {
	var fields = "identifiedPerson,asIdentifications";
	var type = "II";
	var tagName = "id";
	var pathFields = fields.split(',');

	if (membershipId) {
		instanceObject = [ 'Eternity_Membership_ID', membershipId, null ];
		message.messageAndUIBinder.writeValueToMessage(tagName, pathFields,
				type, instanceObject);
	}
}
HIN.UIGenerator.prototype.fillOrganizationId = function(message, orgId) {
	var fields = "assigningOrganization";
	var type = "II";
	var tagName = "id";
	var pathFields = fields.split(',');

	if (orgId) {
		instanceObject = [ 'SUBSCRIBER_ID', orgId, null ];
		message.messageAndUIBinder.writeValueToMessage(tagName, pathFields,
				type, instanceObject);
	}
}
var permissionMessageIndex = 0;
HIN.UIGenerator.prototype.getPermission = function(instance, roleId,
		permissionMessages, callback) {

	if (permissionMessageIndex < permissionMessages.length) {
		var permissionMessage = permissionMessages[permissionMessageIndex];
		if (!permissionMessage.messageAndUIBinder && permissionMessage.msg) {
			/*
			 * alert(permissionMessage.message);
			 * alert(XmlUtil.xmlToString(permissionMessage.message));
			 */
			permissionMessage.messageAndUIBinder = new MessageAndUIBinder(null,
					permissionMessage.msg, permissionMessage.messageType);
		}
		if (permissionMessage.messageAndUIBinder) {
			var parentRoleId = permissionMessage.messageAndUIBinder
					.getIdRootValue("ROLE_NAME");
			if (roleId == parentRoleId) {

				if (callback)
					callback(permissionMessage);
			}
			permissionMessageIndex++;
			instance.getPermission(instance, roleId, permissionMessages,
					callback);
		} else {
			var dataLayer = appController.getComponent("DataLayer");
			dataLayer.getMessageInternal(permissionMessage, function(messageId,
					msg, permissionMessage) {

				permissionMessage.messageAndUIBinder = new MessageAndUIBinder(
						null, permissionMessage.msg,
						permissionMessage.messageType);
				var parentRoleId = permissionMessage.messageAndUIBinder
						.getIdRootValue("ROLE_NAME");
				if (roleId == parentRoleId) {

					if (callback)
						callback(permissionMessage);
				}
				permissionMessageIndex++;
				instance.getPermission(instance, roleId, permissionMessages,
						callback);
			}, true);

		}

	} else {
		if (callback)
			callback(null);
	}
};
