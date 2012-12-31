function CacheManager(appController, dataLayer) {
	var cacheManager = this;
	this.className = "CacheManager";
	this.appController = appController;
	this.dataLayer = dataLayer;
	this.createOrUpdateTask = createOrUpdateTask;
	this.createOrUpdateTasks = createOrUpdateTasks;
	this.createDependentTask = createDependentTask;
	this.fetchUserProcessDefinition = fetchUserProcessDefinition;
	this.getProcessDefinitionInstance = getProcessDefinitionInstance;
	this.getMessageTask = getMessageTask;
	this.workFlowManagerCache = new WorkFlowManagerCache(appController,
			dataLayer);
	this.processManagerCache = new ProcessManagerCache(appController, dataLayer);

	this.lookUpCache = new LookUpCache(appController, dataLayer);
	this.renderProcessUpdate = true;
	this.syncToCouch = true;

	function createOrUpdateTask(taskVo, message, processObjects) {
		appController.getComponent("RenderingEngine").showPageLoading(
				"Processing");
		var messageId = message.messageId;
		var callback = {
			handler : cacheManager.createDependentTask,
			parameters : [ message, processObjects ]
		}
		var messageXml = null;
		var taskId = "";
		var outCome = "";
		var assigneId = "";
		var signUp = appController.getComponent("Context").isSignUp();
		if (taskVo && cacheManager.dataLayer.getMessageObject(taskVo.messageID)) {
			messageXml = cacheManager.dataLayer.getMessageXml(taskVo.messageID)
			taskId = taskVo.taskId;
			outCome = taskVo.outCome;
			assigneId = taskVo.assignee;
		} else {
			messageXml = cacheManager.dataLayer.getMessageXml(messageId)
		}
		// alert(XmlUtil.xmlToString(messageXml));
		if (messageXml) { // alert(messageXml);
			cacheManager.workFlowManagerCache.createOrUpdateTask(taskId,
					outCome, assigneId, message, signUp);

			callback.handler(callback.parameters);

		} else {

			dataLayer.getMessageInternal(message, function(messageId, msg,
					message) {
				if (message.message) {
					cacheManager.workFlowManagerCache.createOrUpdateTask(
							taskId, outCome, assigneId, message, signUp);

					callback.handler(callback.parameters);
				} else {
					alert("Message is not available");
				}
			}, true);

		}
		/*
		 * } else { alert("Data is already persisted"); }
		 */

	}
	;

	function createOrUpdateTasks(parameters) {
		var messageObjects = null;
		var syncMessage = null;
		var processObjects = null;
		if (parameters.length > 0 && parameters[0] == true) {
			messageObjects = parameters[1];
			syncMessage = parameters[2];
			if (parameters.length > 2)
				processObjects = parameters[3];
			if (syncMessage) {
				syncMessage.sync = true;
				// syncMessage.finished = true;
				syncMessage.addNew = false;
				syncMessage.initializeScriptExecuted = true;
			}
		} else {

			if (parameters.length > 1) {
				messageObjects = parameters[0];
				processObjects = parameters[1];
			} else {
				messageObjects = parameters[0];
			}

		}
		if (messageObjects.length > 0) {
			var messageObject = messageObjects.shift();
			var taskVO = messageObject.taskVO;

			var dependentMessageObjects = [];
			if (messageObject) {
				dependentMessageObjects = messageObject.dependendMessages;
				if (dependentMessageObjects) {
					for ( var dependentMessageIndex = 0; dependentMessageIndex < dependentMessageObjects.length; dependentMessageIndex++) {
						messageObjects
								.push(dependentMessageObjects[dependentMessageIndex]);
					}
				}
			}

			appController.getComponent("RenderingEngine").showPageLoading(
					"Processing");
			var callback = {
				handler : cacheManager.createOrUpdateTasks,
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
					&& cacheManager.dataLayer
							.getMessageObject(taskVO.messageID)) {
				messageXml = cacheManager.dataLayer
						.getMessageXml(taskVO.messageID);
				messageId = taskVO.messageID;
				taskId = taskVO.taskId;
				outCome = taskVO.outCome;
				assigneId = taskVO.assignee;
			}
			if (messageXml) {
				cacheManager.workFlowManagerCache.createOrUpdateTask(taskId,
						outCome, assigneId, messageObject, signUp);
				callback.handler(callback.parameters);
			} else {

				dataLayer.getMessageInternal(messageObject, function(messageId,
						msg, messageObject) {
					if (messageObject.message) {
						cacheManager.workFlowManagerCache.createOrUpdateTask(
								taskId, outCome, assigneId, messageObject,
								signUp);

						callback.handler(callback.parameters);
					} else {
						alert("Message is not available");
					}
				}, true);

			}
		} else {
			// notificationmsg.success("Data Saved Successfully");
			appController.getComponent("RenderingEngine").hidePageLoading();
			// notificationmsg.success("Process Saved Successfully");

			if (processObjects) {
				cacheManager.processManagerCache.renderProcessUpdate = cacheManager.renderProcessUpdate;// true;
				cacheManager.processManagerCache.syncToCouch = cacheManager.syncToCouch;// true;
				cacheManager.processManagerCache.saveProcess(processObjects);
			} else {

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
				appController.getComponent("RenderingEngine").hidePageLoading();
				appController.getComponent("RenderingEngine")
						.closeModalDialog();
				appController.getComponent("RenderingEngine")
						.getChildComponent("Process").updateProcess();
			}
		}
	}
	;

	function createDependentTask(parameters) {
		var processObjects = null;
		// notificationmsg.success("Message Saved Successfully");
		appController.getComponent("RenderingEngine").hidePageLoading();
		appController.getComponent("Context").setSignUp(false);
		var message = null;
		if (parameters != null && parameters.length > 0) {
			message = parameters[0];
			message.sync = true;
			message.addNew = false;
			message.initializeScriptExecuted = true;
			// message.finished = true;
			// notificationmsg.success("Data Saved Successfully");
			if (parameters.length > 1)
				processObjects = parameters[1];
		}

		var dependentMessageObjects = [];
		if (message) {
			var messageId = message.messageId;
			// alert("Message saved : " + messageId);
			dependentMessageObjects = message.dependendMessages;

		}
		if (dependentMessageObjects && dependentMessageObjects.length > 0) {
			var parameters = [ dependentMessageObjects, processObjects ];
			cacheManager.createOrUpdateTasks(parameters);
			// updateDependentMessage(dependentMessages, processObjects);
		} else {
			appController.getComponent("RenderingEngine").hidePageLoading();
			if (processObjects) {
				cacheManager.processManagerCache.renderProcessUpdate = cacheManager.renderProcessUpdate;// true;
				cacheManager.processManagerCache.syncToCouch = cacheManager.syncToCouch;// true;
				cacheManager.processManagerCache.saveProcess(processObjects);
			} else {

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
				appController.getComponent("RenderingEngine").hidePageLoading();
				appController.getComponent("RenderingEngine")
						.closeModalDialog();
				appController.getComponent("RenderingEngine")
						.getChildComponent("Process").updateProcess();
			}
		}

	}
	;

	function getProcessCacheManager() {
		return this.workFlowManagerCache;
	}
	;
	function getWorkFlowCacheManager() {
		return this.workFlowManagerCache;
	}
	;
	function fetchUserProcessDefinition(userId, callback) {
		cacheManager.processManagerCache.fetchUserProcessDefinition(userId,
				callback);
	}
	;
	function getProcessDefinitionInstance(processId) {
		cacheManager.processManagerCache
				.getProcessDefinitionInstance(processId);
	}
	;
	function getMessageTask(messageId, message, callback, UIcallback) {
		cacheManager.workFlowManagerCache.getMessageTask(messageId, message,
				callback, UIcallback);
	}
	;
	function syncLookUpData(callback) {

		cacheManager.lookUpCache.cacheLookUpData(callback);
	}
	;
	this.syncLookUpData = syncLookUpData;
	function loadAllConceptServices(conceptClassName, callBack, instance) {
		cacheManager.lookUpCache.loadAllConceptServices(conceptClassName,
				callBack, instance);
	}
	;
	this.loadAllConceptServices = loadAllConceptServices;

	function createProcessIndexInCache() {
		cacheManager.processManagerCache.createProcessIndexInCache();
	}
	;
	this.createProcessIndexInCache = createProcessIndexInCache;
	function cacheLoginInfo(userLoginInfo) {
		cacheManager.lookUpCache.putLoginInfoToLocalCache(userLoginInfo);
	}
	;
	this.cacheLoginInfo = cacheLoginInfo;
	function getCachedLoginInfo(index, callBack) {
		cacheManager.lookUpCache.getLoginInfo(index, callBack);
	}
	;
	this.getCachedLoginInfo = getCachedLoginInfo;
	function removeCachedLoginInfo(index) {
		cacheManager.lookUpCache.removeLoginInfo(index);
	}
	;
	this.removeCachedLoginInfo = removeCachedLoginInfo;

	function searchServices(conceptClassName, callBack) {
		cacheManager.lookUpCache.searchServices(conceptClassName, callBack);
	}
	;
	this.searchServices = searchServices;
};