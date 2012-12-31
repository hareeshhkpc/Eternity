function ProcessManagerCache(appController, dataLayer) {
	var processManagerCache = this;
	this.className = "ProcessManagerCache";
	this.appController = appController;
	this.dataLayer = dataLayer;
	this.saveProcess = saveProcess;
	this.fetchUserProcessDefinition = fetchUserProcessDefinition;
	this.getProcessList = getProcessList;
	this.getProcessDefinitionInstance = getProcessDefinitionInstance;

	this.renderProcessUpdate = true;
	this.syncToCouch = true;

	function saveProcess(processObjects) {
		appController.getComponent("RenderingEngine").showPageLoading(
				"Saving Progress");
		if (processObjects.length > 0) {
			var processDefinitionInstance = processObjects.shift();
			// processDefinitionInstance.updateMessageStatus();
			// processDefinitionInstance.updateStatus();
			processDefinitionInstance.optimize();
			var patientProcess;
			this.processIds = [];
			var processId = processDefinitionInstance.id;
			if (!processId || processId.length == 0) {
				processId = getNewProcessId();
				processDefinitionInstance.id = processId;
			}

			var processInstanceJsonString = $.toJSON(processDefinitionInstance);

			/*
			 * var seen = []; var processInstanceJsonString =
			 * $.toJSON(processDefinitionInstance, function(key, val) { if
			 * (typeof val == "object") { if (seen.indexOf(val) >= 0) return
			 * undefined seen.push(val) } return val; });
			 */

			var patientId = appController.getComponent("Context").getPatient();
			HL
					.getDynamicContent(
							"ProcessIndex_" + patientId,
							function(patientProcessList) {
								if (!patientProcessList) {
									patientProcessList = [];
								} else {
									patientProcess = processManagerCache
											.getProcessList(
													patientProcessList,
													processDefinitionInstance.processName);
								}
								if (!patientProcess) {
									patientProcess = new HIN.UserProcess();
									patientProcess.processName = processDefinitionInstance.processName;
									patientProcessList = getUserProcessList(patientProcessList);
									patientProcessList.push(patientProcess);
								}
								processIds = patientProcess.processIds;
								processIds.push(processId);
								HL
										.putDynamicContent(
												"ProcessIndex_" + patientId,
												$.toJSON(patientProcessList),
												function() {
													HL
															.putDynamicContent(
																	"Process_"
																			+ processId,
																	processInstanceJsonString,
																	function() {
																		if (processObjects)
																			processManagerCache
																					.saveProcess(processObjects);
																	});
												});
							}, null, true, HL.RETURN_OBJECT);

		} else {

			appController.getComponent("RenderingEngine").hidePageLoading();

			var page = appController.getComponent("RenderingEngine")
					.getChildComponent("Form").getPage();
			if (page) {
				page.finishCompleteHandler();
			}
			// notificationmsg.success("Process Saved Successfully");
			if (processManagerCache.renderProcessUpdate == true) {
				appController.getComponent("RenderingEngine")
						.getChildComponent("Process").updateProcess();
			}
			if (processManagerCache.syncToCouch == true) {
				HL.syncMessage(function() {
					appController.getComponent("RenderingEngine")
							.hidePageLoading();
					/*
					 * notificationmsg .success("Server synchronization
					 * completed.");
					 */
				}, function() {
					/*
					 * notificationmsg .success("Server synchronization
					 * Failed.");
					 */
				});
			}
		}
	}
	;
	function getNewProcessId() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
				+ S4() + S4());
	}
	;

	function fetchUserProcessDefinition(patientId, callback) {
		HL
				.getDynamicContent(
						"ProcessIndex_" + patientId,
						function(processData) {
							if (!processData) {
								processManagerCache.dataLayer.serviceLayer
										.fetchUserProcessDefinition(patientId,
												callback);
							} else {
								var userProcesses = processManagerCache
										.getProcessList(processData);
								var map = processManagerCache.dataLayer.userProcessMap
										.get(patientId);
								if (!map) {
									processManagerCache.dataLayer.userProcessMap
											.put(patientId, userProcesses);
								} else {
									map.value = userProcesses;
								}
								var message = processManagerCache.dataLayer.factoryClass
										.createMessage();
								message.messageId = patientId;
								processManagerCache.dataLayer
										.getMessageInternal(message, callback,
												true);
							}
						}, null, true, HL.RETURN_OBJECT);

	}
	;
	function getProcessList(processDataList, processName) {
		var processList = [];
		for ( var index = 0; index < processDataList.length; index++) {
			processData = processDataList[index];
			var data = processData;
			var userProcess = new HIN.UserProcess();
			userProcess.processName = data.processName;
			if (data.processIds) {
				userProcess.addProcessIds(data.processIds);
			}
			if (processName) {
				if (data.processName == processName) {
					return userProcess;
				}
			}
			processList.push(userProcess);
		}
		if (processName)
			return null;
		return processList;
	}
	;
	function getUserProcessList(processDataList) {
		var processList = [];
		for ( var index = 0; index < processDataList.length; index++) {
			processData = processDataList[index];
			var data = processData;
			var userProcess = new HIN.UserProcess();
			userProcess.processName = data.processName;
			if (data.processIds) {
				userProcess.addProcessIds(data.processIds);
			}
			processList.push(userProcess);
		}
		return processList;
	}
	;
	function getProcessDefinitionInstance(processId) {
		HL
				.getDynamicContent(
						"Process_" + processId,
						function(data) {
							if (!data) {
								var data = processManagerCache.dataLayer.serviceLayer
										.getProcessDefinitionInstance(
												processId,
												function(processDefinition) {
													// storeProcessInastanceToCache(processDefinition);
													var seen = [];
													HL
															.putDynamicContent(
																	"Process_"
																			+ processId,
																	$
																			.toJSON(
																					processDefinition,
																					function(
																							key,
																							val) {
																						if (typeof val == "object") {
																							if (seen
																									.indexOf(val) >= 0)
																								return undefined
																							seen
																									.push(val)
																						}
																						return val;
																					}),
																	function() {
																	});
													processManagerCache.appController
															.getEventQueue()
															.postEvent(
																	AppConstants.Event.PROCESS_PAGE_DEFINITION_FILL_DATA,
																	{
																		processDefinition : processDefinition
																	},
																	processManagerCache.appController,
																	processManagerCache.dataLayer);
												});

							} else {
								var processDefinition = processManagerCache.dataLayer
										.createProcessDefinitionClone(data);

								processManagerCache.appController
										.getEventQueue()
										.postEvent(
												AppConstants.Event.PROCESS_PAGE_DEFINITION_FILL_DATA,
												{
													processDefinition : processDefinition
												},
												processManagerCache.appController,
												processManagerCache.dataLayer);
							}

						}, null, true, HL.RETURN_OBJECT);
	}
	;
	function storeProcessInastanceToCache(processDefinitionInstance) {
		processDefinitionInstance.optimize();
		var patientProcess;
		this.processIds = [];
		var processId = processDefinitionInstance.id;
		if (!processId || processId.length == 0) {
			processId = getNewProcessId();
			processDefinitionInstance.id = processId;
		}
		
		var processInstanceJsonString = $.toJSON(processDefinitionInstance);
		/*
		 * var seen = []; var processInstanceJsonString =
		 * $.toJSON(processDefinitionInstance, function(key, val) { if (typeof
		 * val == "object") { if (seen.indexOf(val) >= 0) return undefined
		 * seen.push(val) } return val; });
		 */
		var patientId = appController.getComponent("Context").getPatient();
		HL
				.getDynamicContent(
						"ProcessIndex_" + patientId,
						function(patientProcessList) {
							if (!patientProcessList) {
								patientProcessList = [];
							} else {
								patientProcess = processManagerCache
										.getProcessList(
												patientProcessList,
												processDefinitionInstance.processName);
							}
							if (!patientProcess) {
								patientProcess = new HIN.UserProcess();
								patientProcess.processName = processDefinitionInstance.processName;
								patientProcessList = getUserProcessList(patientProcessList);
								patientProcessList.push(patientProcess);
							}
							processIds = patientProcess.processIds;
							processIds.push(processId);
							HL.putDynamicContent("ProcessIndex_" + patientId, $
									.toJSON(patientProcessList), function() {
								HL.putDynamicContent("Process_" + processId,
										processInstanceJsonString, function() {
										});
							});
						}, null, true, HL.RETURN_OBJECT);

	}
	;
	this.storeProcessInastanceToCache = storeProcessInastanceToCache;

	function createProcessIndexInCache() {
		this.processList = [];
		// processIds
		// =getProcessList();

		processList = appController.getComponent("DataLayer").getUserProcesses(
				appController.getComponent("Context").getPatient());
		var patientId = appController.getComponent("Context").getPatient();
		HL.getDynamicContent("ProcessIndex_" + patientId, function(
				patientProcessList) {
			if (!patientProcessList) {
				HL.putDynamicContent("ProcessIndex_" + patientId, $
						.toJSON(processList), function() {
				});
			}

		}, null, true, HL.RETURN_OBJECT);

	}
	;
	this.createProcessIndexInCache = createProcessIndexInCache;

	/*
	 * function getProcessList(){
	 * processList=renderingEngine.getComponent("DataLayer")
	 * .getUserProcesses(appController.getComponent("Context").getPatient());
	 * this.processIds = []; if (userProcesses) { for ( var index = 0; index <
	 * userProcesses.length; index++) { var userProcess = userProcesses[index];
	 * processId = userProcess.processIds[0];
	 * 
	 * 
	 * var userProcess = new HIN.UserProcess(); userProcess.processName =
	 * data.processName; if (processId) { userProcess.addProcessIds(processId); }
	 * processIds.push(userProcess); } } return processIds; }
	 */

}