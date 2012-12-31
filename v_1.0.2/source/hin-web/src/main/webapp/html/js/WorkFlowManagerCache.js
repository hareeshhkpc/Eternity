function WorkFlowManagerCache(appController, dataLayer) {
	var workFlowManagerCache = this;
	this.className = "WorkFlowManagerCache";
	this.appController = appController;
	this.dataLayer = dataLayer;
	this.UIcallback = null;
	this.callback = null;
	this.message = null;
	this.createOrUpdateTask = createOrUpdateTask;
	this.getMessageTask = getMessageTask;

	function createOrUpdateTask(taskId, outCome, assigneId, messageObject,
			signUp) {
		var taskVO = new HIN.TaskVO();
		var messageType = messageObject.messageType;
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer
				.loadConfig(
						messageType,
						function(messageTypeConfig) {
							if (taskId) {
								taskVO.taskId = taskId;
								taskVO.messageID = messageObject.messageId;
								taskVO.outCome = outCome;
								messageObject.taskVo = taskVO;
								// completeTask(messageObject);
								createNewtask(messageObject, outCome);
							} else {
								createNewtask(messageObject, "start");
							}

							HL
									.getMessageDocument(
											messageObject.messageId,
											function(doc) {
												// alert(messageObject.messageId
												// + ":" + doc);
												var document = doc;
												var deleted = false;
												var deleteMsg = null;
												if (messageObject.status == AppConstants.Status.OBSOLETE) {
													deleted = true;
													deleteMsg = messageObject.msg;
												}
												document.params = {
													finish : true,
													deleted : deleted
												};
												HL
														.saveDoc(
																document,
																function(doc) {
																	if (deleted) {

																		/*
																		 * alert("call
																		 * delete
																		 * doc " +
																		 * document.key);
																		 */

																		/*
																		 * if
																		 * (document) {
																		 * HL
																		 * .deleteDoc(
																		 * document,
																		 * function() {
																		 * 
																		 * alert("deleted " +
																		 * document.key) },
																		 * function() {
																		 * alert("WorkFlowManagerCache
																		 * createOrUpdateTask
																		 * delete
																		 * doc
																		 * is
																		 * failed");
																		 * }); }
																		 */
																		return;
																		if (deleteMsg) {
																			HL
																					.deleteMsg(
																							deleteMsg,
																							function() {

																								/*
																								 * alert("deleted " +
																								 * deleteMsg)
																								 */

																							},
																							function() {
																								alert("WorkFlowManagerCache createOrUpdateTask delete doc is failed");
																							});
																		} else {
																			alert("deleteMsg not found.")
																		}
																	}
																});

											},
											function() {
												alert("WorkFlowManagerCache createOrUpdateTask save doc is failed");
											}, true);

						});

	}
	;

	function createNewtask(messageObject, outCome) {
		var taskVO = messageObject.taskVo;
		if (!taskVO) {
			taskVO = new HIN.TaskVO();
			taskVO.taskId = getNewTaskId();
			taskVO.messageID = messageObject.messageId;
			taskVO.outCome = outCome;

			messageObject.taskVo = taskVO;
		}
		// if (messageObject.newTask == false)
		messageObject.finished = true;
		setNewTaskIDInMessage(taskVO.taskId, messageObject);
		setOutcomeInMessage(outCome, messageObject);
		setMessageStatusInMessage(
				messageObject.messageTypeCompeletionTempStatus, messageObject);
		messageObject.messageProcessCompeletionStatus = messageObject.messageTypeCompeletionTempStatus;
		// HL.putDynamicContent("TaskVO_" + taskVO.messageID, taskVO)

		return taskVO;
	}
	;
	function getNewTaskId() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
				+ S4() + S4());
	}
	;
	function gettaskOutComes(messageTypeConfig, taskName) {
		var outtaskComes = [];
		var i = 0;
		if (messageTypeConfig) {
			var transitionsXpath = '//WorkFlowDefinition/start/transition/@to';
			var result = XmlUtil.getXPathResult(messageTypeConfig.getXML(),
					transitionsXpath, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

			while (res = result.iterateNext()) {
				outtaskComes.push(res.nodeValue);
			}
		}
		return outtaskComes;
	}
	;
	function completeTask(taskVo) {
		createNewtask(taskVo.messageID, taskVo.outCome);
	}
	;
	function getMessageTask(messageId, message, callback, UIcallback) {
		workFlowManagerCache.UIcallback = UIcallback;
		// workFlowManagerCache.callback = callback;
		workFlowManagerCache.message = message;
		setMessageProcessCompeletionStatusInMessage(message);
		getMessageTaskFromMessageXml(message)
		// callback();
		/*
		 * HL.getDynamicContent("TaskVO_" + messageId, getTaskCallBack, null,
		 * true, HL.RETURN_OBJECT);
		 */
	}
	;
	function getTaskCallBack(task) {
		createNewTask(task.outCome)
	}
	;

	function getMessageTaskFromMessageXml(message) {
		var obj = message.msg;
		var messageAndUIBinder = new MessageAndUIBinder(null, obj,
				message.messageType);
		var outcome;
		if (obj) {

			var fields = "";
			var type = "II";
			var tagName = "id";
			var pathFields = fields.split(',');

			var node = messageAndUIBinder.readMessageObjects(pathFields,
					tagName);
			if (!node) {
				throw "No valid subscriber ID in Message: FIAB_MT020000HT02";
			}

			if (AppUtil.isArray(node)) {
				$.each(node, function(key, value) {
					var instanceObject = messageAndUIBinder
							.readValueFromMessage(tagName, pathFields, type,
									value);
					if (instanceObject[1] == "TASK_OUTCOME") {
						outcome = instanceObject[2];
						// return;
					}
				});
			}

			if (!outcome || outcome.length == 0) {
				if (workFlowManagerCache.UIcallback) {
					workFlowManagerCache.UIcallback(
							workFlowManagerCache.message.messageId,
							workFlowManagerCache.message.msg,
							workFlowManagerCache.message);
				}
			} else {
				createNextTask(outcome);
			}

		}

	}
	;
	function createNextTask(outcome) {
		var taskVO = new HIN.TaskVO();
		var messageTypeConfig = null
		taskVO.taskId = getNewTaskId();// task.taskId;
		taskVO.messageID = workFlowManagerCache.message.messageId;
		var dataLayer = appController.getComponent("DataLayer");
		dataLayer
				.loadConfig(
						workFlowManagerCache.message.messageType,
						function(messageTypeConfig) {
							// messageObject.messageStatus="LOCKED";
							messageTypeConfig = messageTypeConfig;
							var taskOutComes = gettaskOutComes(
									messageTypeConfig, outcome);
							if (taskOutComes) {
								for ( var index = 0; index < taskOutComes.length; index++) {
									taskVO.addOutCome(taskOutComes[index]);
								}
							}
							workFlowManagerCache.message.taskVO = taskVO;
							if (outcome == "save") {
								workFlowManagerCache.message.finished = true;
							}
							if (workFlowManagerCache.UIcallback) {
								workFlowManagerCache.UIcallback(
										workFlowManagerCache.message.messageId,
										workFlowManagerCache.message.msg,
										workFlowManagerCache.message);
							}
						});
	}
	function setNewTaskIDInMessage(taskId, message) {
		var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
				message.messageType);
		messageAndUIBinder.updateId("TASK_ID", taskId);
	}
	;
	function setOutcomeInMessage(OutCome, message) {
		var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
				message.messageType);
		messageAndUIBinder.updateId("TASK_OUTCOME", OutCome);
	}
	;
	function setAssigneeInMessage(Assignee, message) {
		var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
				message.messageType);
		messageAndUIBinder.updateId("TASK_ASIGNEE", Assignee);
	}
	;
	function setMessageStatusInMessage(MessageStatus, message) {
		var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
				message.messageType);
		messageAndUIBinder.updateId("MESSAGE_STATUS", MessageStatus);
	}
	;
	function setMessageProcessCompeletionStatusInMessage(message) {
		if (message.msg) {
			var messageAndUIBinder = new MessageAndUIBinder(null, message.msg,
					message.messageType);
			message.messageProcessCompeletionStatus = messageAndUIBinder
					.getIdRootValue("MESSAGE_STATUS");
		}
	}
	;
};