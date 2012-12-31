function ServiceLayer(appController, dataLayer, renderingEngine) {
	var serviceLayer = this;
	this.className = "ServiceLayer";
	this.appController = appController;
	this.authenticate = authenticate;
	this.createOrUpdateTask = createOrUpdateTask;
	this.createOrUpdateTasks = createOrUpdateTasks;
	this.convertToPdf = convertToPdf;
	this.createDependentTask = createDependentTask;
	this.currencyConvert = currencyConvert;
	this.downloadClientReportPDF = downloadClientReportPDF;
	this.downloadUploadedDocuments = downloadUploadedDocuments;
	this.documentsTimeLine = documentsTimeLine;
	this.documentsLegend = documentsLegend;

	this.getMessages = getMessages;
	/* this.createTasks = createTasks; */
	this.getMessageTask = getMessageTask;
	this.saveProcess = saveProcess;

	this.getProcessDefinitions = getProcessDefinitions;
	this.getProcessDefinitionByProcessName = getProcessDefinitionByProcessName;
	this.getProcessDefinitionInstance = getProcessDefinitionInstance;
	this.fetchUserProcessDefinition = fetchUserProcessDefinition;

	this.search = search;
	this.archiveSearchPatient = archiveSearchPatient;
	this.archiveSearchResult = archiveSearchResult;
	this.fetchPrograms = fetchPrograms;
	this.fetchMessageTypesFromConcept = fetchMessageTypesFromConcept;
	this.fetchMessageDomains = fetchMessageDomains;
	this.fetchLuceneMessages = fetchLuceneMessages;
	this.fetchStatisticsDataForYear = fetchStatisticsDataForYear;
	this.fetchStatisticsDataForMonth = fetchStatisticsDataForMonth;
	this.fetchProgramsForStatistics = fetchProgramsForStatistics;
	this.fetchStatisticsMessageTypes = fetchStatisticsMessageTypes;
	this.changeEntityState = changeEntityState;
	this.fetchCheckedinPatient = fetchCheckedinPatient;
	this.fetchConcept = fetchConcept;
	this.fetchConceptByProperty = fetchConceptByProperty;
	this.fetchConceptByName = fetchConceptByName;
	this.fetchConceptByNames = fetchConceptByNames;
	this.loadAllConceptServices = loadAllConceptServices;
	this.loadConcepts = loadConcepts;
	this.fetchConceptByClassName = fetchConceptByClassName;
	this.searchServices = searchServices;
	this.fetchFacilities = fetchFacilities;
	this.fetchDocumentMessage = fetchDocumentMessage;

	this.getJsonCallToServer = getJsonCallToServer;
	this.postJsonCallToServer = postJsonCallToServer;

	this.dataLayer = dataLayer;
	this.renderingEngine = renderingEngine;
	this.ajaxMultipart = new AjaxMultipart();
	this.loadChartData = loadChartData;
	this.updateChatMessages = updateChatMessages;
	this.loadLookupData = loadLookupData;

	this.sendEmail = sendEmail;
	this.emailTemplate = emailTemplate;
	this.syncConfigurations = syncConfigurations;
	this.syncMessages = syncMessages;
	this.getCurrencyValue = getCurrencyValue;
	this.loadDynamicConceptLookUp = loadDynamicConceptLookUp;
	this.toString = toString;
	this.validateUser = validateUser;

	// alert(this.dataLayer);

	function getJsonCallToServer(url, params, callback, loadingMessage) {

		if (loadingMessage) {
			appController.getComponent("RenderingEngine").openModalDialog(
					loadingMessage);
		} else {
			appController.getComponent("RenderingEngine").showPageLoading(
					"Loading..");
			appController.getComponent("RenderingEngine").openModalDialog(
					"Loading");
		}
		appController.getComponent("RenderingEngine").showBusy();
		var jqxhr = $.getJSON(url, params, function(data) {
			// alert("success");
			appController.getComponent("RenderingEngine").showIdle();
		}).success(function(data) {
			appController.getComponent("RenderingEngine").showIdle();
			// alert("second success");
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			if (callback)
				callback(data);
		}).error(function(e) {
			// alert("error" + e);
			appController.getComponent("RenderingEngine").showFailure();
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
		}).complete(function() {
			// alert("complete");
			/*
			 * appController.getComponent("RenderingEngine").hidePageLoading();
			 * appController.getComponent("RenderingEngine").closeModalDialog();
			 */
		});
	}
	;

	function postJsonCallToServer(url, params, callback, loadingMessage) {
		if (loadingMessage) {
			appController.getComponent("RenderingEngine").openModalDialog(
					loadingMessage);
		} else {
			appController.getComponent("RenderingEngine").showPageLoading(
					"Loading..");
			appController.getComponent("RenderingEngine").openModalDialog(
					"Loading");
		}
		appController.getComponent("RenderingEngine").showBusy();
		var jqxhr = $.post(url, params, function(data) {
			// alert("success");
			appController.getComponent("RenderingEngine").showIdle();
		}).success(function(data) {
			appController.getComponent("RenderingEngine").showIdle();
			// alert("second success");
			if (callback)
				callback(data);
		}).error(function(e) {
			// alert("error: "+ e);
			appController.getComponent("RenderingEngine").showFailure();
		}).complete(function() {
			// alert("complete");
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
		});
	}
	;

	/* User Authentication and retrieve the profile message */
	function authenticate(user) {
		appController.getComponent("RenderingEngine").showPageLoading(
				"Authenticating...");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Authenticating");
		var json = $.toJSON(user);
		var params = {
			json : json
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/login/userLogin",
						params,
						function(data) {

							var userVo = new HIN.UserVO();
							userVo.subscriberId = data.subscriberId;
							userVo.name = data.name;
							userVo.userName = data.userName;
							userVo.password = data.password;
							userVo.roles = data.roles;
							userVo.privileges = data.privileges;
							userVo.profileProcessInstanceID = data.profileProcessInstanceID;
							var userXmlMessage = XmlUtil
									.stringToXml(data.message);
							userVo.setMessage(userXmlMessage);
							HL = new hl7adapter(userVo.subscriberId);
							var userLoginInfo = {
								"username" : data.userName,
								"password" : data.password
							};
							serviceLayer.dataLayer
									.loadLoginInfoToCache(userLoginInfo);
							if (data.subscriberId) {
								appController.getComponent("Context")
										.setUserVo(userVo);
								var message = dataLayer.factoryClass
										.createMessage();
								message.messageId = userVo.assigningOrganizationID;

								serviceLayer.dataLayer
										.getMessageInternal(
												message,
												serviceLayer.dataLayer.getOrganizationMessage,
												false);

							} else {
								appController
										.fireEvent(AppConstants.Event.LOGIN_PAGE_ERROR);
							}
						}, "");
	}
	;

	function validateUser(userName, callback) {
		var params = {
			json : userName
		};
		this.getJsonCallToServer("/hin-web/rest/login/validate", params,
				function(data) {
					if (callback) {
						callback(data);
					}
				}, "Validating User Name");
	}

	function downloadClientReportPDF(clientReportContent, patientId) {
		var params = {
			json : String(clientReportContent),
			patientId : patientId
		};
		
		this
				.postJsonCallToServer(
						"/hin-web/rest/report/svgExportController",
						params,
						function(data) {
							var obj = $.evalJSON(data);

							window.open(
									'/hin-web/rest/report/downloadClientReport?patientId='
											+ patientId + '&messageId='
											+ obj.messageId, "_blank");

						}, "Downloading Client Report.");
	}

	function downloadUploadedDocuments(messageId) {
		if ($('#docDownloadForm').length > 0) {
			$('#docDownloadForm').remove();
		}

		var url = '/hin-web/rest/downloadDocumentFileAttachment?message=' + messageId
				+ '&time=' + new Date().getTime();
		$('body').append(
				'<form id="docDownloadForm" action="' + url
						+ '" method="POST" target="_blank"></form>');
		$('#docDownloadForm').submit();
		// window.open(, "_blank");
	}

	function documentsTimeLine(yearSelected, patientId, callback) {
		var params = {
			yearSelected : yearSelected,
			patientId : patientId
		};
		this.getJsonCallToServer("/hin-web/rest/documents/getLegendsForYear",
				params, function(data) {
					if (data)
						callback(data);
				}, "");

	}
	function documentsLegend(startDate, callback) {
		var params = {
			startDate : startDate
		};
		this.getJsonCallToServer("/hin-web/rest/documents/getYear", params,
				function(data) {
					if (data)
						callback(data);
				}, "");

	}

	function syncConfigurations(callback) {
		appController.getComponent("RenderingEngine").showPageLoading();
		appController.getComponent("RenderingEngine").openModalDialog(
				"Synchronizing configurations");
		HL.syncMeta(function() {
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			dataLayer.cacheManager.syncLookUpData(callback);
			/*
			 * serviceLayer.syncMessages(function(){
			 * 
			 * });
			 */

		}, function() {

			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			if (callback)
				callback();
		});
	}
	;

	function sendEmail(email, message, fromEmail, fromPassword,
			licenseeAttachment, callback) {
		var params = {
			email : $.toJSON(email),
			messageText : message,
			from : fromEmail,
			authPassword : fromPassword,
			subject : "Welcome to Eternity",
			licenseeAttachment : $.toJSON(licenseeAttachment)
		};
		this.getJsonCallToServer("/hin-web/rest/sendEmail", params, function(
				data) {
			callback(data);
		}, "Sending Email");
	}
	;

	function emailTemplate(emailType, callback) {
		var params = {
			emailType : emailType
		};
		this.getJsonCallToServer("/hin-web/rest/emailTemplate", params,
				function(data) {
					callback(data);
				}, "");
	}
	;

	function currencyConvert(amount, baseCurrency, toCurrency, exchangeRate,
			callback) {
		var currencyVO = new HIN.CurrencyVO();
		currencyVO.amount = parseInt(amount);
		currencyVO.baseCurrency = baseCurrency; // USD
		currencyVO.toCurrency = toCurrency;
		currencyVO.exchangeRate = exchangeRate;
		var params = {
			json : $.toJSON(currencyVO)
		};
		this.getJsonCallToServer("/hin-web/rest/currency/converter", params,
				function(data) {
					callback(data.convertedAmount);
				}, "");
	}
	;

	function syncMessages(callback) {
		if (serviceLayer.dataLayer.cache) {
			appController.getComponent("RenderingEngine").showPageLoading();
			appController.getComponent("RenderingEngine").openModalDialog(
					"Synchronizing data");
			HL.syncMessage(
					function() {
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
						if (callback)
							callback();

					}, function() {

						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
						if (callback)
							callback();

					});
		} else {
			if (callback)
				callback();
		}
	}
	;
	/** Begin -- Create or update task(s) and message(s) -- * */

	function createOrUpdateTask(taskVo, message, processObjects) {
		// if (!message.sync) {
		appController.getComponent("RenderingEngine").showPageLoading(
				"Processing");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Processing");
		var messageId = message.messageId;
		var callback = {
			handler : createDependentTask,
			parameters : [ message, processObjects ]
		}
		var messageXml = null;
		var taskId = "";
		var outCome = "";
		var assigneId = "";
		var signUp = appController.getComponent("Context").isSignUp();
		if (taskVo && serviceLayer.dataLayer.getMessageObject(taskVo.messageID)) {
			messageXml = serviceLayer.dataLayer.getMessageXml(taskVo.messageID)
			taskId = taskVo.taskId;
			outCome = taskVo.outCome;
			assigneId = taskVo.assignee;
		} else {
			messageXml = serviceLayer.dataLayer.getMessageXml(messageId);
		}
		// alert(XmlUtil.xmlToString(messageXml));
		if (messageXml) { // alert(messageXml);
			var message = new XMLSerializer().serializeToString(messageXml);
			// alert(message);

			serviceLayer.ajaxMultipart.multipart("/hin-web/rest/finishTask",
					"post", {
						taskId : taskId,
						outCome : outCome,
						AssigneId : assigneId,
						messageId : messageId,
						signUp : signUp
					}, {
						message : message
					}, callback);
			/*
			 * } else { alert("Data is not available"); }
			 */
		} else {
			// alert("Data is already persisted");
			appController.getComponent("RenderingEngine").hidePageLoading();
		}

	}
	;

	function createOrUpdateTasks(parameters) {
		var messageObjects = null;
		var syncMessage = null;// synMessage
		// initial is null
		// ,syncMessage
		var processObjects = null;

		if (parameters.length > 0 && parameters[0] == true) {
			messageObjects = parameters[1];
			syncMessage = parameters[2];
			if (parameters.length > 2)
				processObjects = parameters[3];
			if (syncMessage) {
				syncMessage.sync = true;
				syncMessage.finished = true;
				serviceLayer.dataLayer.deleteMessageObject(syncMessage);
			}
		} else {

			if (parameters.length > 1) {
				messageObjects = parameters[0];
				processObjects = parameters[1];
			} else {
				messageObjects = parameters[0];
			}

		} // parmeter will be
		// available once
		// the message is
		// persited

		if (messageObjects.length > 0) {
			var messageObject = messageObjects.shift();
			var taskVO = messageObject.taskVO;

			var dependentMessageObjects = [];
			if (messageObject) {
				dependentMessageObjects = messageObject.dependendMessages;
			}

			for ( var dependentMessageIndex = 0; dependentMessageIndex < dependentMessageObjects.length; dependentMessageIndex++) {
				messageObjects
						.push(dependentMessageObjects[dependentMessageIndex]);
			}

			appController.getComponent("RenderingEngine").showPageLoading(
					"Processing");
			appController.getComponent("RenderingEngine").openModalDialog(
					"Processing");

			var callback = {
				handler : serviceLayer.createOrUpdateTasks,
				parameters : [ true, messageObjects, messageObject,
						processObjects ]
			}

			var messageXml = null;
			var taskId = "";
			var outCome = "";
			var assigneId = "";
			var messageId = messageObject.messageId;
			var signUp = appController.getComponent("Context").isSignUp();
			if (taskVO
					&& serviceLayer.dataLayer
							.getMessageObject(taskVO.messageID)) {
				messageXml = serviceLayer.dataLayer
						.getMessageXml(taskVO.messageID);
				messageId = taskVO.messageID;
				taskId = taskVO.taskId;
				outCome = taskVO.outCome;
				assigneId = taskVO.assignee;
			} else {
				messageXml = serviceLayer.dataLayer.getMessageXml(messageId);
			}
			if (messageXml) { // alert(messageXml);
				var message = new XMLSerializer().serializeToString(messageXml);
				// alert(message);

				serviceLayer.ajaxMultipart.multipart(
						"/hin-web/rest/finishTask", "post", {
							taskId : taskId,
							outCome : outCome,
							AssigneId : assigneId,
							messageId : messageId,
							signUp : signUp
						}, {
							message : message
						}, callback);

			} else {
				alert("Data is not available");
			}
		} else {
			notificationmsg.success("Data Saved Successfully");
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			// alert("Start Save Procees");
			if (processObjects)
				serviceLayer.saveProcess(processObjects);
		}
	}
	
	function convertToPdf(patientId, messageId, invoiceNumber) {
		
		var params = {
			patientId : patientId,
			messageId : messageId,
			invoiceNumber : invoiceNumber
		}
		this
				.postJsonCallToServer(
						"/hin-web/rest/documents/convertHtmlToPdf",
						params,
						function(data) {
							
						}, "");
	}
	;
	
	function createDependentTask(parameters) {
		var processObjects = null;
		// notificationmsg.success("Message Saved Successfully");
		appController.getComponent("RenderingEngine").hidePageLoading();
		appController.getComponent("RenderingEngine").closeModalDialog();
		appController.getComponent("Context").setSignUp(false);
		var message = null;
		if (parameters != null && parameters.length > 0) {
			message = parameters[0];
			message.sync = true;
			message.finished = true;
			notificationmsg.success("Data Saved Successfully");
			if (parameters.length > 1)
				processObjects = parameters[1];
		}

		var dependentMessageObjects = [];
		if (message) {
			var messageId = message.messageId;
			// alert("Message saved : " + messageId);
			dependentMessageObjects = message.dependendMessages;

		}
		if (dependentMessageObjects.length > 0) {
			var parameters = [ dependentMessageObjects, processObjects ];
			serviceLayer.createOrUpdateTasks(parameters);
			// updateDependentMessage(dependentMessages, processObjects);
		} else {
			if (processObjects)
				serviceLayer.saveProcess(processObjects);
		}

	}
	;

	/*
	 * function createTasks(parameters) { // alert(parameters[0]); var
	 * messageObjects = null; var syncMessage = null; var processObjects = null;
	 * if (parameters.length > 0 && parameters[0] == true) { messageObjects =
	 * parameters[1]; syncMessage = parameters[2]; if (parameters.length > 2)
	 * processObjects = parameters[3];
	 * 
	 * if (syncMessage) { syncMessage.sync = true; syncMessage.finished = true; } }
	 * else { if (parameters.length > 1) { messageObjects = parameters[0];
	 * processObjects = parameters[1]; } else { messageObjects = parameters; } }
	 * if (messageObjects.length > 0) { var messageObj = messageObjects.shift();
	 * 
	 * appController.getComponent("RenderingEngine").showPageLoading(
	 * "Processing"); var messageId = ""; var signUp =
	 * appController.getComponent("Context").isSignUp(); messageId =
	 * messageObj.messageId;
	 * 
	 * var callback = { handler : serviceLayer.createTasks, parameters : [ true,
	 * messageObjects, messageObj, processObjects ] } var messageXml = null; var
	 * taskId = ""; var outCome = ""; var assigneId = "";
	 * 
	 * messageXml = serviceLayer.dataLayer.getMessageXml(messageId);
	 * 
	 * if (messageXml) { var message = new
	 * XMLSerializer().serializeToString(messageXml);
	 * 
	 * serviceLayer.ajaxMultipart.multipart( "/hin-web/rest/finishTask", "post", {
	 * taskId : taskId, outCome : outCome, AssigneId : assigneId, messageId :
	 * messageId, signUp : signUp }, { message : message }, callback); } else {
	 * alert("Data is not available"); } } else {
	 * 
	 * notificationmsg.success("Data Saved Successfully");
	 * appController.getComponent("RenderingEngine").hidePageLoading();
	 * serviceLayer.saveProcess(processObjects); } } ;
	 */
	/** End -- Create or update task(s) and message(s) -- * */

	/** Begin -- getMessageIds -- * */

	function getMessages(id, queryHashMap, callback, messageRequired) {
		// alert("getMessageList");

		if (!messageRequired)
			messageRequired = false;

		var params = {
			patientId : id,
			conditionMap : $.toJSON(queryHashMap),
			messageRequired : messageRequired,
			organizationId : appController.getComponent("Context").getSelectedOrganizationVO().subscriberId
		};

		this.getJsonCallToServer("/hin-web/rest/getMessageList", params,
				function(data) {
					callback(data);
				}, "");
	}
	;

	/** End -- getMessageIds -- * */

	/** Begin -- getMessageTask against a message -- * */
	function getMessageTask(messageId, message, callback, UIcallback) {

		// alert("getMessageTask " + messageId);
		var params = {
			messageId : messageId
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/getUserTaskForMessageId",
						params,
						function(data) {
							// alert("Task Message " + data.messageID);
							if (data) {
								// alert("Task Message " + data.messageID);
								var taskVO = new HIN.TaskVO();
								taskVO.taskId = data.taskId;
								taskVO.messageID = data.messageID;
								if (data.taskOutComes) {
									for ( var index = 0; index < data.taskOutComes.length; index++) {
										taskVO
												.addOutCome(data.taskOutComes[index]);
									}
								}
								var assignablePeople = $
										.toJSON(data.assignablePeople);
								if (assignablePeople) {
									assignablePeople = assignablePeople
											.substring(1,
													assignablePeople.length - 1);
									var assignablePeoples = assignablePeople
											.split(",");
									if (assignablePeoples) {
										for ( var index = 0; index < assignablePeoples.length; index++) {
											if (assignablePeoples[index]
													.indexOf(":") > -1) {
												var values = assignablePeoples[index]
														.split(":")
												if (values && values[0]
														&& values[0].length > 0
														&& values[1]
														&& values[1].length > 0) {
													/*
													 * alert(values[0]+","+
													 * values[1]);
													 */
													values[0] = values[0]
															.substring(
																	1,
																	values[0].length - 1);
													values[1] = values[1]
															.substring(
																	1,
																	values[1].length - 1);
													taskVO.addAssignablePeople(
															values[0],
															values[1]);
												}
											}
										}
									}
								}

								message.taskVO = taskVO;

							}
							callback(message, UIcallback, false)
						}, "");

	}
	;

	/** End -- getMessageTask against a message -- * */

	/** Begin -- Save process-- * */
	function saveProcess(processObjects) {

		appController.getComponent("RenderingEngine").showPageLoading(
				"Saving Progress");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Saving Progress");

		if (processObjects.length > 0) {
			var processDefinitionInstance = processObjects.shift();
			processDefinitionInstance.optimize();
			var processInstanceJsonString = $.toJSON(processDefinitionInstance);
			/*
			 * var seen = []; var processInstanceJsonString =
			 * $.toJSON(processDefinitionInstance, function(key, val) { if
			 * (typeof val == "object") { if (seen.indexOf(val) >= 0) return
			 * undefined seen.push(val) } return val; });
			 */

			var params = {
				processInstanceJsonString : processInstanceJsonString
			};
			this
					.postJsonCallToServer(
							"/hin-web/rest/saveProcessInstance",
							params,
							function(data) {
								serviceLayer.saveProcess(processObjects);

								var definition = $.parseJSON(data);

								var processDefinition = appController
										.getComponent("RenderingEngine")
										.getChildComponent("Process")
										.getProcessDefinition();
								if (definition) {
									var updatedProcessDefinition = serviceLayer.dataLayer
											.createProcessDefinitionClone(definition);

									if (processDefinition.processName == updatedProcessDefinition.processName) {
										appController
												.getComponent("RenderingEngine")
												.getChildComponent("Process")
												.setProcessDefinition(
														updatedProcessDefinition);
										/*
										 * navigate to process with updated
										 * message status and reload
										 */

										appController.getComponent(
												"RenderingEngine")
												.getChildComponent("Process")
												.updateProcess();

									}
								}

							}, "");

		} else {

			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			notificationmsg.success("Process Saved Successfully");
		}
	}
	;
	/** End -- Save process-- * */

	/** Begin Process definitions * */
	function getProcessDefinitions(callback) {
		appController.getComponent("RenderingEngine").showPageLoading(
				"Loading process definitions...");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Loading process definitions");

		var params = null;

		this.getJsonCallToServer("/hin-web/rest/processDefinitions", params,
				function(data) {
					if (data) {
						for ( var index = 0; index < data.length; index++) {
							// alert(data[index].processName);
							serviceLayer.dataLayer.putProcessDefinitionJson(
									data[index].processName, data[index]);
							appController.getComponent("RenderingEngine")
									.showPageLoading(
											"Loading "
													+ data[index].processName
													+ "...");
							appController.getComponent("RenderingEngine")
									.openModalDialog(
											"Loading "
													+ data[index].processName);
						}
						if (callback)
							callback();
					} else {
						alert(" Process definitions are not found");
					}
				}, "");
	}
	;

	function getProcessDefinitionByProcessName(processName, callback) {

		var params = {
			processName : processName
		};
		this.getJsonCallToServer("/hin-web/rest/process", params,
				function(data) {
					if (data) {
						var processDefinition = serviceLayer.dataLayer
								.createProcessDefinitionClone(data)
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
						if (callback)
							callback(processDefinition);
					} else {
						alert(processName + " is not found");

					}

				}, "");
	}
	;

	function getProcessDefinitionInstance(processId, callback) {
		// alert(processId);
		var params = {
			processId : processId
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/getprocessDefinitionForProcessId",
						params,
						function(data) {
							var processDefinition = serviceLayer.dataLayer
									.createProcessDefinitionClone(data);

							if (callback)
								callback(processDefinition);
							else {
								appController
										.getEventQueue()
										.postEvent(
												AppConstants.Event.PROCESS_PAGE_DEFINITION_FILL_DATA,
												{
													processDefinition : processDefinition
												}, appController,
												serviceLayer.dataLayer);
							}
						}, "");
	}
	;

	function fetchUserProcessDefinition(userId, callback) {

		var params = {
			userId : userId
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/getProcessListForUser",
						params,
						function(data) {

							var userProcesses = [];
							for ( var index = 0; index < data.length; index++) {
								var userProcess = new HIN.UserProcess();
								userProcess.processName = data[index].processName;
								userProcess
										.addProcessIds(data[index].processIdList);
								userProcesses.push(userProcess);
							}
							var map = serviceLayer.dataLayer.userProcessMap
									.get(userId);
							if (!map) {
								serviceLayer.dataLayer.userProcessMap.put(
										userId, userProcesses);
							} else {
								map.value = userProcesses;
							}

							/**
							 * Fetching the user details(Registration message)
							 * and putting to the context**
							 */

							var message = serviceLayer.dataLayer.factoryClass
									.createMessage();
							message.messageId = userId;
							message.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
							serviceLayer.dataLayer.getMessageInternal(message,
									callback, false);

						}, "");
	}
	;
	/** End Process definitions * */

	/** Search * */
	function search(searchVO, conditionMap, callback) {
		var json = $.toJSON(searchVO);
		var params = {
			json : json,
			conditionMap : $.toJSON(conditionMap)
		};

		this.getJsonCallToServer(searchVO.serverURI, params, function(data) {
			if (callback) {
				callback(data);
			}
		}, "");
	}
	;

	function archiveSearchPatient(searchVO, conditionMap) {

		var json = $.toJSON(searchVO);
		var params = {
			json : json,
			conditionMap : $.toJSON(conditionMap)
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/search/entitySearchWithCondtion",
						params,
						function(data) {
							appController
									.getEventQueue()
									.postEvent(
											AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_RESPONSE,
											{
												result : data
											}, appController,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function archiveSearchResult(searchVO) {

		if (searchVO != undefined) {
			var json = $.toJSON(searchVO);
			var params = {
				json : json
			};
			this
					.getJsonCallToServer(
							searchVO.serverURI,
							params,
							function(data) {
								serviceLayer.renderingEngine
										.getEventQueue()
										.postEvent(
												AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_RESPONSE,
												{
													result : data,
													type : searchVO.type
												},
												serviceLayer.renderingEngine,
												serviceLayer.dataLayer);
							}, "");
		} else {
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
		}

	}
	;

	function fetchPrograms(callback) {
		var params = null;
		this.getJsonCallToServer("/hin-web/rest/program", params,
				function(data) {
					if (data) {
						callback(data);
					}
				}, "");
	}
	;

	function fetchMessageTypesFromConcept() {
		var searchVO = serviceLayer.renderingEngine.getComponent("Context")
				.getSearchVO();
		var json = $.toJSON(searchVO);

		var params = {
			json : json
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/search/messagetypenamelist",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS_RESPONSE,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function fetchMessageDomains() {

		serviceLayer.renderingEngine.showPageLoading("Fetching active message");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Fetching active message");

		var params = {
			json : ""
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/search/messagetypelist",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getComponent("Context").setMessageType(
											data);
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPE_RESPONSE,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function fetchLuceneMessages(searchVO, conditionMap, callback) {

		var json = $.toJSON(searchVO);
		// alert(searchVO.serverURI);
		var params = {
			json : json,
			conditionMap : $.toJSON(conditionMap)
		};
		this.getJsonCallToServer(searchVO.serverURI, params, function(data) {
			callback(data);
		}, "");
	}
	;

	function fetchStatisticsDataForYear(statisticsVO) {
		var json = $.toJSON(statisticsVO);
		var params = {
			json : json
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/statistics/year",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.STATISTICS_FETCH_YEAR_DATA_RESPONSE,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function fetchStatisticsDataForMonth(statisticsVO) {
		var json = $.toJSON(statisticsVO);
		var params = {
			json : json
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/statistics/month",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_RESPONSE,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function fetchProgramsForStatistics() {
		var params = null;
		this.getJsonCallToServer("/hin-web/rest/program", params,
				function(data) {

					if (data) {

						serviceLayer.renderingEngine.getEventQueue().postEvent(
								AppConstants.Event.STATISTICS_FILL_DATA, {
									result : data
								}, serviceLayer.renderingEngine,
								serviceLayer.dataLayer);
					}

				}, "");
	}
	;

	function fetchStatisticsMessageTypes(className) {
		var json = {
			"property" : "conceptClasses.name",
			"value" : className
		};
		json = $.toJSON(json);

		var params = {
			json : json
		};

		this.getJsonCallToServer("/hin-web/rest/lookUp/static", params,
				function(data) {

					serviceLayer.renderingEngine.getEventQueue().postEvent(
							AppConstants.Event.STATISTICS_MESSAGE_FILL_DATA, {
								result : data,
								program : className
							}, serviceLayer.renderingEngine,
							serviceLayer.dataLayer);

				}, "");
	}
	;

	function changeEntityState(entityState, callback) {

		json = $.toJSON(entityState);

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/entity/changeState", params,
				function(data) {
					if (callback) {
						callback(data);
					}
				}, "");

	}
	;

	function fetchCheckedinPatient(searchVO, entityState, conditionMap,
			callback) {

		searchVO = $.toJSON(searchVO);
		entityState = $.toJSON(entityState);

		var params = {
			searchVO : searchVO,
			entityState : entityState,
			conditionMap : $.toJSON(conditionMap)
		};
		this.getJsonCallToServer("/hin-web/rest/search/checkedinPatient",
				params, function(data) {
					if (callback) {
						callback(data);
					} else {
						serviceLayer.renderingEngine.getEventQueue().postEvent(
								AppConstants.Event.FILL_CHECKEDIN_PATIENTS, {
									result : data
								}, serviceLayer.renderingEngine,
								serviceLayer.dataLayer);
					}
				}, "");
	}
	;

	function fetchConcept(conceptName, conceptClassName, callback, instance) {
		var params = {
			conceptName : conceptName,
			conceptClassName : conceptClassName
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/concept/service",
				params, function(data) {

					if (data && data.length > 0) {
						// alert($.toJSON(data[0]));
						var conceptLookup = new HIN.ConceptLookup(data);// $.toJSON(data[0]));
						callback(conceptLookup, instance);
					}
					/*
					 * serviceLayer.renderingEngine.getEventQueue().postEvent(
					 * AppConstants.Event.CONCEPT_ATTRIBUTE, { result : data,
					 * key : key, conceptClassName : conceptClassName },
					 * serviceLayer.renderingEngine, serviceLayer.dataLayer);
					 */

				}, "");
	}
	function fetchConceptByProperty(searchCriteria, callback, instance) {

		var json = $.toJSON(searchCriteria);
		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/concept/property",
				params, function(data) {
					if (data && data.length > 0) {
						// alert($.toJSON(data[0]));
						var conceptLookup = new HIN.ConceptLookup(data);// $.toJSON(data[0]));
						callback(conceptLookup, instance);
					}
					/*
					 * serviceLayer.renderingEngine.getEventQueue().postEvent(
					 * AppConstants.Event.CONCEPT_ATTRIBUTE, { result : data,
					 * key : key, conceptClassName : conceptClassName },
					 * serviceLayer.renderingEngine, serviceLayer.dataLayer);
					 */

				}, "");
	}

	function fetchConceptByName(name, callback, instance) {

		var params = {
			name : name
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/concept/name", params,
				function(data) {
					if (data && data.length > 0) {
						// alert(name)
						var conceptLookup = new HIN.ConceptLookup(data);// $.toJSON(data[0]));
						callback(conceptLookup, instance);
					}

				}, name);
	}

	function fetchConceptByNames(names, callback, instance) {

		var params = {
			names : names
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/concept/names", params,
				function(data) {
					var conceptLookups = [];
					if (data && data.length > 0) {
						for ( var index = 0; index < data.length; index++) {
							var conceptLookup = new HIN.ConceptLookup(
									data[index]);
							conceptLookups.push(conceptLookup);
						}
					}
					callback(conceptLookups, instance);
				}, "");
	}

	function loadAllConceptServices(conceptClassName, callback, instance) {
		var searchCriteria = {
			"property" : "conceptClasses.name",
			"value" : conceptClassName
		};
		var json = $.toJSON(searchCriteria);

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/static", params,
				function(data) {
					var allConceptServiceLookup = new HIN.ConceptLookup(data);
					callback(allConceptServiceLookup, instance);
				}, "");
	}
	;

	function loadConcepts(searchCriteria, callback, instance) {

		var json = $.toJSON(searchCriteria);

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/static", params,
				function(data) {
					var allConceptServiceLookup = new HIN.ConceptLookup(data);
					callback(allConceptServiceLookup, instance);
				}, "");
	}

	function fetchConceptByClassName(searchCriteria, callback, instance) {

		var json = $.toJSON(searchCriteria);

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/static", params,
				function(data) {
					var conceptLookups = [];
					if (data && data.length > 0) {
						for ( var index = 0; index < data.length; index++) {
							var arr = [ data[index] ];
							var conceptLookup = new HIN.ConceptLookup(arr);
							conceptLookups.push(conceptLookup);
							/*
							 * alert(conceptLookup);
							 * alert(conceptLookup.getName() + " : " +
							 * conceptLookup.getAttribute("MessageType"));
							 */
						}
					}
					callback(conceptLookups, instance);

				}, "");
	}
	;

	function searchServices(serviceName, callback) {

		var searchCriteria = {
			"property" : "conceptClasses.name",
			"value" : serviceName,
		};
		var json = $.toJSON(searchCriteria);

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/static", params,
				function(data) {
					var arrayList = new Array();
					var allConceptServiceLookup = new HIN.ConceptLookup(data);
					callback(allConceptServiceLookup);
				}, "");
	}
	;

	function fetchFacilities() {
		var json = {};
		json = $.toJSON(json);

		var params = {
			json : json
		};
		this
				.getJsonCallToServer(
						"/hin-web/rest/search/facilities",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.STATISTICS_MESSAGE_FILL_FACILITIES,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);

						}, "");
	}
	;

	function fetchDocumentMessage(documentsVO) {
		// documentsVO.yearData = null;
		var json = $.toJSON(documentsVO);
		var params = {
			json : json
		}
		this
				.getJsonCallToServer(
						"/hin-web/rest/documents/getMessageIdsForMonth",
						params,
						function(data) {
							serviceLayer.renderingEngine
									.getEventQueue()
									.postEvent(
											AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_RESPONSE,
											{
												result : data
											}, serviceLayer.renderingEngine,
											serviceLayer.dataLayer);
						}, "");
	}
	;

	function loadChartData(json, callBack, series) {

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/chart/chartController", params,
				function(data) {
					if (callBack)
						callBack(data, series);
				}, "");
	}
	function updateChatMessages(json, callBack) {
		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/update/chatController", params,
				function(data) {
					if (callBack)
						callBack(data);
				}, "");
	}

	function loadLookupData(className, callBack) {
		// alert("className :" + className);

		var params = {
			className : className
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/getLookupList", params,
				function(data) {
					if (callBack)
						callBack(data);
				}, "");
	}
	;

	function getCurrencyValue(json, callBack) {

		var params = {
			json : json
		};
		this.getJsonCallToServer("/hin-web/rest/currency/converter", params,
				function(data) {
					if (callBack)
						callBack(data);
				}, "");
	}

	function loadDynamicConceptLookUp(conceptClassName, enteredValue, callback,
			instance) {

		var params = {
			conceptClassName : conceptClassName,
			searchWord : enteredValue
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/dynamic", params,
				function(data) {
					var allConceptServiceLookup = new HIN.ConceptLookup(data);
					callback(allConceptServiceLookup, instance);
				}, "");
	}
	;

	function loadLookUpDataInToCache(callBack, mainCallBack) {

		var params = null;
		this.getJsonCallToServer("/hin-web/rest/lookUp/getAllLookUpData",
				params, function(data) {
					callBack(data, mainCallBack);
				}, "");
	}
	;

	this.loadLookUpDataInToCache = loadLookUpDataInToCache;

	this.getMembershipId = getMembershipId;

	function getMembershipId(callBack) {
		console.log("Inside: getMembershipId");
		var organizationId = appController.getComponent("Context")
				.getOrganizationVO().subscriberId;

		var params = {
			organizationId : organizationId
		};
		console.log("Inside: getMembershipId: Requesting");
		$.ajax({
			url : '/hin-web/rest/getNewUserId',
			data : params,
			async : false,
			cache : false,
			dataType : "json",
			success : function(data) {

				console.log("Inside: getMembershipId: Got response: " + data);

				callBack(data);
			}
		});

		/*
		 * this.getJsonCallToServer("/hin-web/rest/getNewUserId", params, "",
		 * function(data) { callBack(data); });
		 */
	}
	;
	this.getInvoiceId = getInvoiceId;

	function getInvoiceId(callBack) {
		console.log("Inside: getInvoiceId");
		var organizationId = appController.getComponent("Context")
				.getOrganizationVO().subscriberId;

		var params = {
			organizationId : organizationId
		};
		console.log("Inside: getInvoiceId: Requesting");
		$.ajax({
			url : '/hin-web/rest/getNewInvoiceId',
			data : params,
			async : false,
			cache : false,
			dataType : "json",
			success : function(data) {

				console.log("Inside: getInvoiceId: Got response: " + data);

				callBack(data);
			}
		});

		/*
		 * this.getJsonCallToServer("/hin-web/rest/getNewUserId", params, "",
		 * function(data) { callBack(data); });
		 */
	}
	;
	this.getReceiptId = getReceiptId;

	function getReceiptId(callBack) {
		console.log("Inside: getReceiptId");
		var organizationId = appController.getComponent("Context")
				.getOrganizationVO().subscriberId;

		var params = {
			organizationId : organizationId
		};
		console.log("Inside: getReceiptId: Requesting");
		$.ajax({
			url : '/hin-web/rest/getNewReceiptId',
			data : params,
			async : false,
			cache : false,
			dataType : "json",
			success : function(data) {

				console.log("Inside: getReceiptId: Got response: " + data);

				callBack(data);
			}
		});

		/*
		 * this.getJsonCallToServer("/hin-web/rest/getNewUserId", params, "",
		 * function(data) { callBack(data); });
		 */
	}
	;
	
	this.getLicenseeInvoiceId = getLicenseeInvoiceId;
	function getLicenseeInvoiceId(callBack) {
		console.log("Inside: getLicenseeInvoiceId");
		var organizationId = appController.getComponent("Context")
				.getOrganizationVO().subscriberId;

		var params = {
			organizationId : organizationId
		};
		console.log("Inside: getNewLicenseeInvoiceId: Requesting");
		$.ajax({
			url : '/hin-web/rest/getNewLicenseeInvoiceId',
			data : params,
			async : false,
			cache : false,
			dataType : "json",
			success : function(data) {

				console.log("Inside: getLicenseeInvoiceId: Got response: " + data);

				callBack(data);
			}
		});

		/*
		 * this.getJsonCallToServer("/hin-web/rest/getNewUserId", params, "",
		 * function(data) { callBack(data); });
		 */
	}
	;

	function toString() {
		return serviceLayer.className;
	}
	;
	
	this.retrieveAllRollNames = retrieveAllRollNames;
	function retrieveAllRollNames(callBack) {
		var params = {
			json : "json"
		};
		this.getJsonCallToServer("/hin-web/rest/role/roleController", params,
				function(data) {
					if (callBack)
						callBack(data);
				}, "");
	}
	;
	
	this.retrieveAllProcessNames = retrieveAllProcessNames;
	function retrieveAllProcessNames(callBack) {		
		var params = {
			json : "json"
		};
		this.getJsonCallToServer("/hin-web/rest/lookUp/getAllProcess", params,
				function(data) {
					if (callBack)
						callBack(data);
				}, "");
	}
	;

};