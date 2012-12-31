/**
 * DataLayer is a child component of Application Controller.It catches the
 * events from other components and broadcasts the same events to all components
 * except from which that event triggers and which broadcasts that event. If
 * required it handles the events here itself.This layer will be decided to work
 * as offline or online.
 */

function DataLayer(appController) {

	var dataLayer = this;
	this.className = "DataLayer";

	var appController = appController;
	var ajaxMultipart = new AjaxMultipart();
	var renderingEngine = appController.getComponent("RenderingEngine");
	/**
	 * Handles event from Datalayer
	 * 
	 * @param event
	 */
	this.eventHandler = eventHandler;
	this.authenticate = authenticate;
	this.getProcessDefinitions = getProcessDefinitions;
	this.getProcessDefinitionInstance = getProcessDefinitionInstance;
	this.getNewProcessDefinitionInstance = getNewProcessDefinitionInstance;
	/* this.createProcessDefinition = createProcessDefinition; */
	this.getProcessDefinitionByProcessName = getProcessDefinitionByProcessName;
	this.processMessage = processMessage;
	/* this.saveMessages = saveMessages; */
	this.sendEmail = sendEmail;
	this.emailTemplate = emailTemplate;
	this.currencyConvert = currencyConvert;
	/* this.saveProcess = saveProcess; */
	this.getMessageForSearchResult = getMessageForSearchResult;

	// this.signUp = signUp;
	this.fetchPrograms = fetchPrograms;
	this.changeEntityState = changeEntityState;
	this.fetchCheckedinPatient = fetchCheckedinPatient;
	this.getMessageInternal = getMessageInternal;
	this.getMessageXml = getMessageXml;
	this.getMsg = getMsg;
	this.getMessageTask = getMessageTask;

	this.messageMap = new HIN.HashMap();
	this.processMap = new HIN.HashMap();

	/** processDefinitionJsonMap holds all process definitions in json format */
	this.processDefinitionJsonMap = new HIN.HashMap();
	/* this.createProcessDefinitions = createProcessDefinitions; */
	this.createProcessDefinitionClone = createProcessDefinitionClone;
	/*
	 * this.addProcess = addProcess; this.getProcess = getProcess;
	 */
	/** userProcessMap holds all process definitions against the user */
	this.userProcessMap = new HIN.HashMap();
	this.getUserProcessMap = getUserProcessMap;
	this.getUserProcesses = getUserProcesses;
	this.lookupHandler = new LookupHandler();

	this.search = search;
	this.getMessages = getMessages;
	this.fetchLuceneMessages = fetchLuceneMessages;
	this.fetchConcept = fetchConcept;
	this.fetchConceptByProperty = fetchConceptByProperty;
	this.fetchConceptByName = fetchConceptByName;
	this.fetchConceptByNames = fetchConceptByNames;
	this.loadAllConceptServices = loadAllConceptServices;
	this.fetchConceptByClassName = fetchConceptByClassName;
	this.loadDynamicConceptLookUp = loadDynamicConceptLookUp;

	this.loadConcepts = loadConcepts;
	// this.fetchPrograms = fetchProgram;

	/* this.createTasks = createTasks; */
	this.createOrUpdateTask = createOrUpdateTask;
	this.createOrUpdateTasks = createOrUpdateTasks;
	this.convertToPdf = convertToPdf;
	this.downloadClientReportPDF = downloadClientReportPDF;
	this.downloadUploadedDocuments = downloadUploadedDocuments;
	this.documentsTimeLine = documentsTimeLine;
	this.documentsLegend = documentsLegend;

	this.searchServices = searchServices;

	this.generateId = generateId;

	this.currentProcessDefinition = null;
	this.clearProcesses = clearProcesses;

	this.loadConfig = loadConfig;
	this.loadData = loadData;

	this.messageTypeJsStringMap = new HIN.HashMap();
	this.messageFormMap = new HIN.HashMap();
	this.messageFormScriptMap = new HIN.HashMap();
	this.navigateBackToProcess = false;
	this.getMessageObject = getMessageObject;
	this.putMessageObject = putMessageObject;
	this.deleteMessageObject = deleteMessageObject;

	this.deleteMessage = deleteMessage;

	this.getProcessDefinitionJson = getProcessDefinitionJson;
	this.putProcessDefinitionJson = putProcessDefinitionJson;

	this.getLicenseeMessage = getLicenseeMessage;
	this.getOrganizationMessage = getOrganizationMessage;

	this.factoryClass = new FactoryClass();
	this.serviceLayer = new ServiceLayer(appController, dataLayer,
			renderingEngine);
	this.cacheManager = new CacheManager(appController, dataLayer);
	this.loadChartData = loadChartData;
	this.loadLookupData = loadLookupData;

	this.getCurrencyValue = getCurrencyValue;
	/**
	 * cache holds the true or false value , based on this it acts as offline or
	 * online.
	 */
	this.cache = true;

	this.getNewId = getNewId;
	this.type = null;
	this.syncMessage = syncMessage;
	this.synCompleted = true;
	this.validateUser = validateUser;

	HL = new hl7adapter();

	/* Function definitions */

	function eventHandler(event) {
		// alert("event handler in datalayer : "+event.type);
		if (event.type == AppConstants.Event.APPLICATION_INITIALIZED) {

			// Create lookup handler for the SQLite
			this.lookupHandler.createDatabase();
			// this.getProcessDefinitions();
			/* this.syncMessage(); */
			/*
			 * setTimeout(function() { dataLayer.syncMessage(); }, 5000);
			 */

		} else if (event.type == AppConstants.Event.LOGIN_PAGE_PROCESSED) {
			authenticate(event.data);
		} else if (event.type == AppConstants.Event.SEARCH_PAGE_PROCESSED) {
			dataLayer
					.search(event.data.searchVO, event.data.conditionMap, null);
		} else if (event.type == AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_PROCESSED) {
			archiveSearchPatient(event.data.searchVO, event.data.conditionMap);
		} else if (event.type == AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_PROCESSED) {
			archiveSearchResult(event.data.searchVO);
		} else if (event.type == AppConstants.Event.PROCESS_PAGE_DEFINITION_FECTH_DATA) {
			getProcessDefinitionInstance(event.data.processId);
		} else if (event.type == AppConstants.Event.PROCESS_PAGE_INSTANCE_FECTH_DATA) {
			getProcessInstance(event.data.userId, event.data.processName);
		} else if (event.type == AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS) {
			fetchMessageTypesFromConcept();
		} else if (event.type == AppConstants.Event.PATIENT_HOME_PAGE_FETCH_DATA) {
			fetchUserProcessDefinition(event.type, event.data);
		} else if (event.type == AppConstants.Event.STAFF_HOME_PAGE_FETCH_DATA) {
			fetchUserProcessDefinition(event.type, event.data);
		} else if (event.type == AppConstants.Event.LICENSEE_HOME_PAGE_FETCH_DATA) {
			fetchUserProcessDefinition(event.type, event.data);
		} else if (event.type == AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPES) {
			fetchMessageDomains();
		} else if (event.type == AppConstants.Event.STATISTICS_FETCH_YEAR_DATA_REQUEST) {
			fetchStatisticsDataForYear(event.data.statisticsVO);
		} else if (event.type == AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_REQUEST) {
			fetchStatisticsDataForMonth(event.data.statisticsVO);
		} else if (event.type == AppConstants.Event.STATISTICS_FETCH_DATA) {
			fetchProgramsForStatistics();
		} else if (event.type == AppConstants.Event.STATISTICS_MESSAGE_FETCH_DATA) {
			fetchStatisticsMessageTypes(event.data.className);
		} else if (event.type == AppConstants.Event.ENTITY_STATE_CHANGE) {
			changeEntityState(event.data);
		} else if (event.type == AppConstants.Event.FETCH_CHECKEDIN_PATIENTS) {
			fetchCheckedinPatient(event.data.searchVO, event.data.entityState,
					event.data.conditionMap);
		} else if (event.type == AppConstants.Event.STATISTICS_MESSAGE_FETCH_FACILITIES) {
			fetchFacilities();
		} else if (event.type == AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_REQUEST) {
			fetchDocumentMessage(event.data.documentsVO);
		}

	}
	;

	function getNewId() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
				+ S4() + S4());
	}
	;

	function getMessageXml(messageId) {
		var message = dataLayer.getMessageObject(messageId);
		if (message)
			return message.message;
		return null;
	}
	;

	function getMsg(messageId) {
		var message = dataLayer.getMessageObject(messageId);
		if (message)
			return message.msg;
		return null;
	}
	;

	function createProcessDefinitionClone(data) {
		return dataLayer.factoryClass.createProcessDefinitionInstance(data);

	}
	;

	function getUserProcessMap() {
		return this.userProcessMap;
	}
	;
	function clearProcesses() {
		dataLayer.processMap.clearItems();
		dataLayer.processQueueIndex = 0;
	}
	;

	/**
	 * Provides all process id's against the user
	 * 
	 * @param userId :
	 *            Its a string value.
	 * @returns {UserProcess []}
	 */
	function getUserProcesses(userId) {
		if (this.userProcessMap.get(userId)) {
			return this.userProcessMap.get(userId).value;
		}
		return null;
	}

	function getProcessDefinitionByProcessName(processName, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.getProcessDefinitionByProcessName(processName,
				callback);
	}
	;

	/**
	 * Provides the all process definition instances through callback method. *
	 * 
	 * @param callback :
	 *            Its a function which will be called after the completion of
	 *            this method.
	 */
	function getProcessDefinitions(callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.getProcessDefinitions(callback);
	}
	;

	function fetchPrograms(callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchPrograms(callback);
	}
	;

	/**
	 * Authenticate the user.
	 * 
	 * @param user:
	 *            Its an object of user.
	 * @returns {void}
	 */
	function authenticate(user) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.authenticate(user);
		// dataLayer.cacheManager.cacheLookUpData();

	}
	;

	function validateUser(userName, callback) {
		dataLayer.serviceLayer.validateUser(userName, callback);
	}

	function search(searchVO, conditionMap, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.search(searchVO, conditionMap, callback);
	}
	;

	function archiveSearchPatient(searchVO, conditionMap) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.archiveSearchPatient(searchVO, conditionMap);

	}
	;

	function archiveSearchResult(searchVO) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.archiveSearchResult(searchVO);
	}
	;

	function downloadClientReportPDF(clientReportContent) {
		var patientVO = appController.getComponent("Context").getPatientVO();
		var patientId = patientVO.subscriberId;
		dataLayer.serviceLayer.downloadClientReportPDF(clientReportContent,
				patientId);
	}
	;

	function downloadUploadedDocuments(messageId) {
		dataLayer.serviceLayer.downloadUploadedDocuments(messageId);
	}
	;

	function documentsTimeLine(startDate, patientId, callback) {
		var data = dataLayer.serviceLayer.documentsTimeLine(startDate,
				patientId, callback);
	}
	function documentsLegend(startDate, callback) {
		var data = dataLayer.serviceLayer.documentsLegend(startDate, callback);
	}
	;

	/**
	 * Provides the new process definition instance based on the process name.
	 * 
	 * @param processName :
	 *            Its a string value , name of the process
	 * @returns {ProcessDefinition}
	 */
	function getNewProcessDefinitionInstance(processName) {
		if (dataLayer.processDefinitionJsonMap
				&& dataLayer.getProcessDefinitionJson(processName)) {
			var processDefinitionJson = dataLayer
					.getProcessDefinitionJson(processName);
			var processDefinition = dataLayer
					.createProcessDefinitionClone(processDefinitionJson);
			processDefinition.id = "";
			return processDefinition;
		} else {
			alert(processName + " is not found");
		}

	}
	;

	/**
	 * Provides the process definition instance based on the process id through
	 * callback. *
	 * 
	 * @param processId :
	 *            Its a string value , id of the process
	 * @param callback :
	 *            Its a function which will be called after the completion of
	 *            the method,it provides processdefintion object as parameter to
	 *            call back.
	 * @returns {void}
	 */
	function getProcessDefinitionInstance(processId, callback) {
		if (!dataLayer.cache)
			dataLayer.serviceLayer.getProcessDefinitionInstance(processId,
					callback);
		else
			dataLayer.cacheManager.getProcessDefinitionInstance(processId,
					callback);
	}
	;

	function fetchMessageTypesFromConcept() {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchMessageTypesFromConcept();
	}
	;

	/*
	 * function addProcess(id, definition) { if (dataLayer.processMap.get(id)) {
	 * var map = dataLayer.processMap.get(id); map.value = definition; } else {
	 * dataLayer.processMap.put(id, definition) } } ;
	 * 
	 * function getProcess(id) { if (dataLayer.processMap.get(id)) { var map =
	 * dataLayer.processMap.get(id); return map.value = definition; } } ;
	 */

	function fetchMessageDomains() {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchMessageDomains();
	}
	;

	function fetchUserProcessDefinition(type, userId) {
		if (type == AppConstants.Event.STAFF_HOME_PAGE_FETCH_DATA) {
			dataLayer.type = AppConstants.SearchType.STAFF_PROFILE_SEARCH;
		} else if (type == AppConstants.Event.PATIENT_HOME_PAGE_FETCH_DATA) {
			dataLayer.type = AppConstants.SearchType.PATIENT_PROFILE_SEARCH;
		} else if (type == AppConstants.Event.LICENSEE_HOME_PAGE_FETCH_DATA) {
			dataLayer.type = AppConstants.SearchType.LICENSEE_SEARCH;
		}

		// alert(type + " : " + userId);

		if (!dataLayer.cache)
			dataLayer.serviceLayer.fetchUserProcessDefinition(userId,
					loadedUserProcessDefinition);
		else
			dataLayer.cacheManager.fetchUserProcessDefinition(userId,
					loadedUserProcessDefinition);

	}
	;
	function loadedUserProcessDefinition(messageId, msg, message) {
		if (dataLayer.cache) {
			dataLayer.cacheManager.createProcessIndexInCache();
		}
		// alert("messageId :"+messageId+", msg :"+msg+", message :"+message);
		getRegistrationMessage(messageId, msg, message);
	}
	;
	function getRegistrationMessage(messageId, msg, message) {
		// alert("getRegistartionMessage : " + messageId);
		/*
		 * appController.getComponent("Context").addInContext("registration",
		 * msg.getXML());
		 */
		var type = dataLayer.type;
		var searchVO = renderingEngine.getComponent("Context").getSearchVO();
		if (searchVO) {
			type = searchVO.type;
		}
		// alert("Type : " + searchVO.type);

		if (type == AppConstants.SearchType.LICENSEE_SEARCH) {
			var selectedOrganizationVO = new HIN.OrganizationVO();
			selectedOrganizationVO.setMessage(msg.getXML());
			selectedOrganizationVO.setMsg(msg);
			appController.getComponent("Context").setSelectedOrganizationVO(
					selectedOrganizationVO);
			appController.getComponent("RenderingEngine").showPageLoading(
					"Filling Licensee Data");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.LICENSEE_HOME_PAGE_FILL_DATA, {},
					renderingEngine, dataLayer);
		} else if (type == AppConstants.SearchType.STAFF_PROFILE_SEARCH) {
			var staffVO = appController.getComponent("Context").getStaffVo();
			if (!staffVO)
				staffVO = new HIN.StaffVO();
			staffVO.setMessage(msg.getXML());
			appController.getComponent("Context").setStaffVo(staffVO);
			appController.getComponent("RenderingEngine").showPageLoading(
					"Filling Staff Data");
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.STAFF_HOME_PAGE_FILL_DATA, {},
					renderingEngine, dataLayer);

		} else if (type == AppConstants.SearchType.PATIENT_PROFILE_SEARCH
				|| type == AppConstants.SearchType.CALENDAR_SEARCH) {
			var patientVO = appController.getComponent("Context")
					.getPatientVO();
			if (!patientVO)
				patientVO = new HIN.PatientVO();
			patientVO.setMsg(msg);
			patientVO.setMessage(msg.getXML());
			appController.getComponent("Context").setPatientVO(patientVO);
			appController.getComponent("RenderingEngine").showPageLoading(
					"Filling Patient Data");

			/*
			 * renderingEngine.getEventQueue().postEvent(
			 * AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA, {},
			 * renderingEngine, dataLayer);
			 */

			/*
			 * Fetching the program details(Program message) and putting to the
			 * context**
			 */
			message.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
			/*
			 * var messageAndUIBinder = new MessageAndUIBinder(null,
			 * patientVO.msg, message.messageType);
			 */
			// alert(patientVO.msg.getXML());
			// alert("Message xml in M&UIB: \n"
			// +XmlUtil.xmlToString(patientVO.msg.getXML()));
			var programId = patientVO.programId;
			var consultantId = patientVO.consultantId;
			// alert("programId : " + programId + "consultantId :" +
			// consultantId);
			if (programId && programId.length > 0) {
				var message = dataLayer.factoryClass.createMessage();
				message.messageId = programId;
				message.messageType = AppConstants.XPaths.Program.MESSAGE_TYPE;
				dataLayer.getMessageInternal(message, getProgramMessage, true);
			} else if (consultantId && consultantId.length > 0) {
				var message = dataLayer.factoryClass.createMessage();
				message.messageId = consultantId;
				// alert(" if else datalayer");
				message.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
				dataLayer.getMessageInternal(message, getConsultantMessage,
						true);
			} else {
				appController.getComponent("Context").setProgramVO(null);
				appController.getComponent("Context").addInContext("program",
						null);
				appController.getComponent("Context").setPhysicianVO(null);
				appController.getComponent("Context").addInContext(
						"consultant", null);
				renderingEngine.getEventQueue().postEvent(
						AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA, {},
						renderingEngine, dataLayer);
			}

		}

	}

	function getOrganizationMessage(messageId, msg, message) {
		appController.getComponent("Context").addInContext("organization",
				msg.getXML());
		var organizationVO = appController.getComponent("Context")
				.getOrganizationVO();
		if (!organizationVO) {
			organizationVO = new HIN.OrganizationVO();
			appController.getComponent("Context").setOrganizationVO(
					organizationVO);
		}
		organizationVO.setMessage(msg.getXML());
		organizationVO.setMsg(msg);

		/*
		 * dataLayer.serviceLayer .getProcessDefinitions(function() {
		 */
		if (organizationVO.licenseeId) {
			var message = dataLayer.factoryClass.createMessage();
			message.messageId = organizationVO.licenseeId;
			dataLayer.getMessageInternal(message, dataLayer.getLicenseeMessage,
					false);
		} else {
			if (dataLayer.cache) {
				dataLayer.serviceLayer.syncConfigurations(function() {
					appController
							.fireEvent(AppConstants.Event.LOGIN_PAGE_RESPONSE);
					// dataLayer.syncMessage();
				});
			} else {
				appController.fireEvent(AppConstants.Event.LOGIN_PAGE_RESPONSE);
				// dataLayer.syncMessage();
			}
		}
		/* }); */
	}

	function getLicenseeMessage(messageId, msg, message) {
		appController.getComponent("Context").addInContext("licensee",
				msg.getXML());
		var licenseeVO = appController.getComponent("Context").getLicenseeVO();

		if (!licenseeVO) {
			licenseeVO = new HIN.LicenseeVO();
			appController.getComponent("Context").setLicenseeVO(licenseeVO);
		}
		licenseeVO.setMessage(msg.getXML());
		licenseeVO.setMsg(msg);
		var organizationVO = appController.getComponent("Context")
				.getOrganizationVO();

		var today = new Date();
		var dd = today.getDate().toString();
		var mm = (today.getMonth() + 1).toString();
		var yyyy = today.getFullYear().toString();
		var currentDay = yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-"
				+ (dd[1] ? dd : "0" + dd[0]);

		if (!(new Date(currentDay).valueOf() >= new Date(licenseeVO.expiryDate)
				.valueOf())
				|| new Date(currentDay).valueOf() == new Date(
						licenseeVO.expiryDate).valueOf()) {
			dataLayer.fetchConceptByName(licenseeVO.currency, function(data) {
				for (i in data.json) {
					$.each(data.json[i].conceptAttributes, function(index,
							conceptAttr) {
						if (conceptAttr) {
							if (conceptAttr.key == 'CurrencyCode') {
								licenseeVO.currencyCode = conceptAttr.value;
							}
							if (conceptAttr.key == 'CurrencySymbol') {
								licenseeVO.currencySymbol = conceptAttr.value;
							}
							if (conceptAttr.key == 'ExchangeRate') {
								licenseeVO.exchangeRate = conceptAttr.value;
							}
						}
					});
				}
				dataLayer.serviceLayer.syncConfigurations(function() {
					appController
							.fireEvent(AppConstants.Event.LOGIN_PAGE_RESPONSE);
				});
			}, null);
		} else {
			appController.fireEvent(AppConstants.Event.LOGIN_PAGE_INITIALIZED);
		}

	}

	function getProgramMessage(messageId, msg, message) {
		// alert("getProgramMessage : " + XmlUtil.xmlToString(message.message));
		appController.getComponent("Context").addInContext("program",
				msg.getXML());
		var programVo = appController.getComponent("Context").getProgramVO();
		if (!programVo) {
			programVo = new HIN.ProgramVO();
			appController.getComponent("Context").setProgramVO(programVo);
		}
		programVo.setMsg(msg);
		programVo.setMessage(message.message);

		var patientVO = appController.getComponent("Context").getPatientVO();
		var messageAndUIBinder = new MessageAndUIBinder(null, patientVO.msg,
				AppConstants.XPaths.Registrtion.MESSAGE_TYPE);
		var consultantId = messageAndUIBinder.getIdRootValue("CONSULTANT_ID");

		if (consultantId && consultantId.length > 0) {
			var message = dataLayer.factoryClass.createMessage();
			message.messageId = consultantId;
			message.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;
			dataLayer.getMessageInternal(message, getConsultantMessage, false);
		} else {
			renderingEngine.getEventQueue().postEvent(
					AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA, {},
					renderingEngine, dataLayer);
		}
	}
	;

	function getConsultantMessage(messageId, msg, message) {
		// alert("getConsultantMessage : " +
		// XmlUtil.xmlToString(message.message));
		appController.getComponent("Context").addInContext("consultant",
				msg.getXML());
		var physicianVo = appController.getComponent("Context")
				.getPhysicianVO();
		if (!physicianVo) {
			physicianVo = new HIN.PhysicianVO();
			appController.getComponent("Context").setPhysicianVO(physicianVo);
		}
		physicianVo.setMsg(msg);
		physicianVo.setMessage(message.message);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA, {},
				renderingEngine, dataLayer);
	}
	;

	function getMessageTask(messageId, message, callback, UIcallback, force) {
		if (!dataLayer.cache || force)
			dataLayer.serviceLayer.getMessageTask(messageId, message, callback,
					UIcallback);
		else
			dataLayer.cacheManager.getMessageTask(messageId, message, callback,
					UIcallback);

	}
	;

	/**
	 * Get msg document object based on message type
	 * 
	 * @param message :
	 *            Its an object of message.
	 * @param UIcallback:
	 *            Its a function which will be called after the completion of
	 *            the method,it set msg object to message object.
	 * @param cache :
	 *            Its a boolean value,based on the value it will be decided to
	 *            retrieve from online or offline.
	 * @returns {void}
	 */
	function getMessageInternal(message, UIcallback, cache) {
		// alert(message);// + " : " + UIcallback);
		// var url = "/rest/getMessage?messageId=" + messageId;
		var messageId = message.messageId;
		var url = messageId;
		var local = dataLayer.cache;
		if (!cache) {
			local = false;
		}

		// alert("Before Call: " + url);
		HL.getMessage(url, function(msgObject) {
			// alert("Loaded : " + msgObject);
			// alert("data layer getMessageInternal : " + messageId);
			dataLayer.msg = msgObject;
			message.msg = msgObject;
			message.message = msgObject.getXML();
			// if (!dataLayer.cache) {
			dataLayer.putMessageObject(message);
			// }
			/*
			 * if (cache) dataLayer.messageMap.put(messageId, dataLayer.msg);
			 */
			UIcallback(messageId, dataLayer.msg, message);
		}, function(status) {
			alert(" DataLayer method [getMessageInternal] - Message Id: ["
					+ message.messageId + "] , Message Type : ["
					+ message.messageType + " ] :  Reason Message Not Found ["
					+ status + "]");
		}, local);

	}
	;

	function getMessageObject(messageId) {
		if (dataLayer.messageMap.get(messageId)) {
			return dataLayer.messageMap.get(messageId).value;
		} /*
			 * else { HL.getDynamicContent(messageId, callback, failback,
			 * useCache, convert) }
			 */

	}
	;

	function putMessageObject(message) {
		// alert(message.messageId);
		/* HL.getMessage.putWorkFlowMessage(message.msg,message); */

		var map = dataLayer.messageMap.get(message.messageId);
		if (!map) {
			dataLayer.messageMap.put(message.messageId, message);
			// alert(" inserted " + message);
		} else {
			map.value = message;
		}
	}
	;

	function deleteMessage(messageId) {
		HL.deleteDoc(messageId, function(o) {
			alert("deleted : [ " + messageId + " ] " + o)
		});
	}
	;

	function deleteMessageObject(message) {
		var map = dataLayer.messageMap.get(message.messageId);
		if (map) {
			dataLayer.messageMap.put(message.messageId, null);
			// alert(" deleted " + message);
		}
	}

	function getProcessDefinitionJson(processName) {
		if (dataLayer.processDefinitionJsonMap.get(processName)) {
			return dataLayer.processDefinitionJsonMap.get(processName).value;
		}
	}
	;

	function putProcessDefinitionJson(processName, processJson) {

		var map = dataLayer.getProcessDefinitionJson(processName);
		if (!map) {
			dataLayer.processDefinitionJsonMap.put(processName, processJson);
			// alert(" inserted " + message);
		} else {
			map.value = processJson;
		}
	}
	;

	function getMessageForSearchResult(messageId, messageType, patientId,
			UIcallback) {
		var json = $.toJSON({
			id : messageId,
			type : messageType
		});
		var url = "/rest/archive/getArchivedMessage?json=" + json;
		HL.getMessageForUrl(url, messageId, function(msgObject) {
			UIcallback(messageId, msgObject, patientId);
		}, function(status) {
			alert("Failed : " + status);
		}, false);
	}
	;

	/**
	 * Get messages based on the participant id and query string
	 * 
	 * @param id :
	 *            its a string value , hold the participant id
	 * @param queryHashMap:
	 *            its an object of hashmap which holds the queries
	 * @param callback:
	 *            Its a function which will be called after the completion of
	 *            the method.
	 * @param messageRequired:
	 *            Its a boolean value , based it will be act as offline or
	 *            online
	 * 
	 * @returns {void}
	 */
	function getMessages(id, queryHashMap, callback, messageRequired) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.getMessages(id, queryHashMap, callback,
				messageRequired);
	}
	;

	/*
	 * function fetchMessages(query, callback) {
	 * renderingEngine.showPageLoading("Requesting message"); var id = query.id;
	 * var conditionMap = query.conditionMap;
	 * $.getJSON("/hin-web/rest/getMessageList", { patientId : id, conditionMap :
	 * $.toJSON(conditionMap), messageRequired : query.messageRequired },
	 * function(data) { renderingEngine.showPageLoading("Recived message");
	 * callback(data); }); } ;
	 */
	// getMessageList
	function fetchLuceneMessages(searchVO, conditionMap, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchLuceneMessages(searchVO, conditionMap,
				callback);
	}
	;

	/* API Implementation */

	this.messageTypeConfig = new HIN.HashMap();
	this.msg;
	this.config;
	this.expression;

	var id = 0;

	function loadMessageConfiguration(messageRoot, message, callback,
			UIcallback) {
		// alert("in load");
		// var messageConfig = '/message-configuration/' + messageRoot +
		// '.xml';
		var messageConfig = messageRoot;
		/* var messageId = message.messageId; */
		// alert("messageRoot :" + messageRoot);
		// alert("messageConfig : " + messageConfig);
		if (dataLayer.messageTypeConfig.get(messageRoot)) {
			dataLayer.config = dataLayer.messageTypeConfig.get(messageRoot).value;
		} else {
			dataLayer.config = null;
		}
		if (!dataLayer.config) {
			HL.getConfigDocument(messageConfig, function(configData) {
				// alert("Loaded");
				// dataLayer.config = new ConfigDocument(configData);
				dataLayer.config = configData;
				dataLayer.messageTypeConfig.put(messageRoot, dataLayer.config);
				callback(message, UIcallback);
			}, function(status) {
				alert("loadMessageConfiguration Failed : " + status);
			}, true);
		} else {
			// alert("Configuration available");
			callback(message, UIcallback);
		}
	}

	function processMessage(message, changeExpr, UIcallback) {
		var messageRoot = message.messageType;
		var messageId = message.messageId;
		dataLayer.expression = changeExpr;
		/*
		 * alert("messageId : " + messageId + " Map : " +
		 * dataLayer.messageMap.get(messageId));
		 */
		if (messageId != null && messageId.length > 0) {
			if (!dataLayer.cache) {
				if (dataLayer.getMessageObject(messageId) == null) {
					// if (dataLayer.messageMap.get(messageId) == null ||
					// !message.taskVO) {
					// alert("processMessage : " + messageId);
					// dataLayer.msg =
					// getMessageInternal(messageId, UIcallback)
					getMessageTask(messageId, message,
							dataLayer.getMessageInternal, UIcallback);

				} else {

					var messageObj = dataLayer.getMessageObject(messageId);
					// alert("finished : " + message.finished);
					if (messageObj.finished) {
						getMessageTask(messageId, message,
								dataLayer.getMessageInternal, UIcallback);
					} else {
						message.msg = messageObj.msg;
						message.message = messageObj.message;
						message.taskVO = messageObj.taskVO;

						// alert("Exist : " + messageId);
						dataLayer.msg = dataLayer.getMsg(messageId);// dataLayer.messageMap.get(messageId).value;
						UIcallback(messageId, dataLayer.msg, message);
					}
				}
			} else {
				HL.getMessage(messageId, function(msg) {
					if (msg) {
						message.msg = msg;
						message.message = msg.getXML();
						dataLayer.putMessageObject(message);
						dataLayer.cacheManager.getMessageTask(messageId,
								message, dataLayer.getMessageInternal,
								UIcallback);
					}
				}, function() {
					alert("DataLayer :Error while getting message xml")
				}, dataLayer.cache);
			}
		} else {
			dataLayer.msg = null;
			loadMessageConfiguration(messageRoot, message, createMessage,
					UIcallback);
		}
		// alert("Exist : " + dataLayer.msg);
		/*
		 * return loadMessageConfiguration(messageRoot, messageId,
		 * createMessage, UIcallback);
		 */

	}
	;

	function createMessage(message, UIcallback) {

		// alert("Config : " + dataLayer.config);
		if (!dataLayer.msg || dataLayer.msg == null) {
			dataLayer.msg = dataLayer.config.createMessage();
			generateId(UIcallback, dataLayer.msg, message);
		}

		// eval(dataLayer.expression);

		// alert("Message xml : " +
		// XmlUtil.xmlToString(dataLayer.msg.getXML()));

		// return id;
	}
	;

	/*
	 * function loadMessage(messageId, message) { //alert(messageId + " :" +
	 * message); //alert(messageId + " :" + XmlUtil.stringToXml(message));
	 * 
	 * dataLayer.msg = XmlUtil.stringToXml(message); messageMap.put(messageId,
	 * dataLayer.msg); //alert(messageId + "," + dataLayer.msg) } ;
	 */

	function generateId(UIcallback, msg, message) {
		// alert(XmlUtil.xmlToString(msg.getXML()));

		var messageId = msg.getId();
		var obj = msg.createObject(dataLayer.config.getArtifactId());
		// alert(XmlUtil.xmlToString(msg.getXML()));

		if (obj) {
			// obj.setValue("id", xmlNode);

			var valueObj = obj.getNewValue("id");
			valueObj.setValue("root", 'HIN_MSG_ID');
			valueObj.setValue("extension", messageId);

			/*
			 * var taskId = dataLayer.getNewId(); valueObj =
			 * obj.getNewValue("id"); valueObj.setValue("root", 'TASK_ID');
			 * valueObj.setValue("extension", taskId);
			 */

		} else {
			alert("In datalayer generateId root id updating is failed");
		}
		if (!message) {

			message = dataLayer.factoryClass.createMessage();
			message.messageType = dataLayer.config.getArtifactId();
		}
		/*
		 * if (!message.taskVo) { var taskVo =
		 * dataLayer.factoryClass.createTaskVo(); taskVo.taskId = taskId;
		 * message.taskVo = taskVo; }
		 */
		message.messageId = messageId;
		message.message = msg.getXML();
		message.msg = msg;
		dataLayer.putMessageObject(message);

		UIcallback(messageId, msg, message);

		/*
		 * $.get("/hin-web/rest/idGeneration", {}, function(messageId) {
		 * 
		 * var obj = msg.createObject(dataLayer.config.getArtifactId()); //
		 * alert(XmlUtil.xmlToString(msg.getXML()));
		 * 
		 * if (obj) { // obj.setValue("id", xmlNode);
		 * 
		 * var valueObj = obj.getNewValue("id"); valueObj.setValue("root",
		 * 'HIN_MSG_ID'); valueObj.setValue("extension", msg.getId()); } else {
		 * alert("In datalayer generateId root id updating is failed"); } if
		 * (!message) {
		 * 
		 * message = dataLayer.factoryClass.createMessage(); message.messageType =
		 * dataLayer.config.getArtifactId(); } message.messageId = messageId;
		 * message.message = msg.getXML(); message.msg = msg;
		 * dataLayer.putMessageObject(message);
		 * 
		 * UIcallback(messageId, msg, message); });
		 */

	}
	;
	/**
	 * It persist the single message and process objects. *
	 * 
	 * @param taskVo :
	 *            Its an object of taskVo.
	 * @param message :
	 *            Its an object of message.
	 * @param processObjects :
	 *            Its an array of process definition objects.
	 * @return {void}
	 */

	function createOrUpdateTask(taskVo, message, processObjects) {
		if (!dataLayer.cache)
			dataLayer.serviceLayer.createOrUpdateTask(taskVo, message,
					processObjects);
		else {
			appController.getComponent("RenderingEngine").showPageLoading(
					"Loading..");
			appController.getComponent("RenderingEngine").openModalDialog(
					"Loading");
			dataLayer.cacheManager.createOrUpdateTask(taskVo, message,
					processObjects);
		}

	}
	;

	/**
	 * It persist multiple messages and process objects.
	 * 
	 * @param parameters :
	 *            Its an array of message and process definition objects.
	 * @return {void}
	 */
	function createOrUpdateTasks(parameters) {
		if (!dataLayer.cache)
			dataLayer.serviceLayer.createOrUpdateTasks(parameters);
		else {
			appController.getComponent("RenderingEngine").showPageLoading(
					"Loading..");
			appController.getComponent("RenderingEngine").openModalDialog(
					"Loading");
			dataLayer.cacheManager.createOrUpdateTasks(parameters);
		}
	}
	;

	function convertToPdf(patientId, messageId, invoiceNumber) {
		dataLayer.serviceLayer
				.convertToPdf(patientId, messageId, invoiceNumber);
	}
	;

	/*
	 * function createTasks(parameters) {
	 * dataLayer.serviceLayer.createTasks(parameters); } ;
	 */

	function currencyConvert(amount, baseCurrency, toCurrency, exchangeRate,
			callback) {
		dataLayer.serviceLayer.currencyConvert(amount, baseCurrency,
				toCurrency, exchangeRate, callback);
	}
	;

	function sendEmail(email, message, fromEmail, fromPassword,
			licenseeAttachment, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.sendEmail(email, message, fromEmail,
				fromPassword, licenseeAttachment, callback);
	}
	;

	function emailTemplate(emailType, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.emailTemplate(emailType, callback);
	}
	;

	function fetchStatisticsDataForYear(statisticsVO) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchStatisticsDataForYear(statisticsVO);
	}
	;

	function fetchStatisticsDataForMonth(statisticsVO) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchStatisticsDataForMonth(statisticsVO);
	}
	;

	function fetchProgramsForStatistics() {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchProgramsForStatistics();
	}
	;

	function fetchStatisticsMessageTypes(className) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchStatisticsMessageTypes(className);
	}
	;

	function fetchCurrencyConverter(className) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchCurrencyConverter(className);
	}
	;

	function changeEntityState(entityState, callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.changeEntityState(entityState, callback);
	}
	;

	function fetchCheckedinPatient(searchVO, entityState, conditionMap,
			callback) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchCheckedinPatient(searchVO, entityState,
				conditionMap, callback);
	}
	;

	function fetchConcept(conceptName, conceptClassName, callback, instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchConcept(conceptName, conceptClassName,
				callback, instance);
	}
	function fetchConceptByProperty(searchCriteria, callback, instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchConceptByProperty(searchCriteria, callback,
				instance);
	}

	function fetchConceptByName(name, callback, instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchConceptByName(name, callback, instance);
	}

	function fetchConceptByNames(names, callback, instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchConceptByNames(names, callback, instance);
	}

	/**
	 * Load all concepts based on the class name.
	 * 
	 * @params conceptClassName: Its a string value name of the concept class
	 * 
	 * @params callback: Its a function which will be called after the complete.
	 * @params instance: Its an object which can act any type of object which is
	 *         return back to the call back method.
	 * @returns {void}
	 */
	function loadAllConceptServices(conceptClassName, callback, instance) {

		if (!dataLayer.cache) {
			dataLayer.serviceLayer.loadAllConceptServices(conceptClassName,
					callback, instance);
		} else {
			dataLayer.cacheManager.loadAllConceptServices(conceptClassName,
					callback, instance);
		}

	}

	/**
	 * Load all concepts based on the search criteria.
	 * 
	 * @params searchCriteria: Its an object of searchcriteria
	 * 
	 * @params callback: Its a function which will be called after the
	 *         completion of the method.
	 * @params instance: Its an object which can act any type of object which is
	 *         return back to the call back method.
	 * @returns {void}
	 */
	function loadConcepts(searchCriteria, callback, instance) {
		dataLayer.serviceLayer.loadConcepts(searchCriteria, callback, instance);
	}

	function loadDynamicConceptLookUp(conceptClassName, enteredValue, callback,
			instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.loadDynamicConceptLookUp(conceptClassName,
				enteredValue, callback, instance);
	}

	function fetchConceptByClassName(searchCriteria, callback, instance) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchConceptByClassName(searchCriteria,
				callback, instance);
	}

	function searchServices(serviceName, callback) {
		if (!dataLayer.cache) {
			dataLayer.serviceLayer.searchServices(serviceName, callback);
		} else {
			dataLayer.cacheManager.searchServices(serviceName, callback);
		}
	}
	;

	function fetchFacilities() {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchFacilities();
	}

	function fetchDocumentMessage(documentsVO) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.fetchDocumentMessage(documentsVO);
	}

	function loadChartData(json, callBack, series) {
		// if (!dataLayer.cache)
		dataLayer.serviceLayer.loadChartData(json, callBack, series);
	}
	;
	function loadLookupData(className, callBack) {
		if (!dataLayer.cache) {
			dataLayer.serviceLayer.loadLookupData(className, callBack);
		} else {
			dataLayer.cacheManager.loadLookupData(className, callBack);
		}
	}
	;

	/**
	 * Get config object based on message type
	 * 
	 * @param messageType:
	 *            Its a string value hold the type of message.
	 * @param callBackFunction:
	 *            Its a function which will be called after the completion of
	 *            the method and return the config object as parameter to the
	 *            callback method.
	 * 
	 * @returns {void}
	 */
	function loadConfig(messageType, callBackFunction) {
		// alert("loadConfig messageType :" + messageType);
		// var messageConfig = '/message-configuration/' + messageType +
		// '.xml';
		var messageConfig = messageType;
		// alert("messageRoot :" + messageRoot);
		// alert("messageConfig : " + messageConfig);
		if (dataLayer.messageTypeConfig.get(messageType)) {
			dataLayer.config = dataLayer.messageTypeConfig.get(messageType).value;
		} else {
			dataLayer.config = null;
		}
		if (!dataLayer.config) {

			HL.getConfigDocument(messageConfig, function(configData) {
				// dataLayer.config = new ConfigDocument(configData);
				dataLayer.config = configData;
				dataLayer.messageTypeConfig.put(messageType, dataLayer.config);
				// dataLayer.msg = dataLayer.config.createMessage();
				if (callBackFunction)
					callBackFunction(dataLayer.config);

			}, function(status) {
				alert("Failed to load configuration. Status: " + status);
			}, dataLayer.cache);
		} else {
			// dataLayer.msg = dataLayer.config.createMessage();
			if (callBackFunction)
				callBackFunction(dataLayer.config);
		}
	}
	;

	/**
	 * Load the data based on the key, prefix with 'JS_' (MessagScript), 'FS_'
	 * (FormScript), 'FM_' (FormHtml) etc. based on the key it retrievs the data
	 * from the cache or server.
	 * 
	 * @param key:
	 *            Its a string value.
	 * @param paramData:
	 *            Its a json array.(Optional)
	 * @param callBack:
	 *            Its a function which will be called after the completion of
	 *            the method , it returns a data through callback method.
	 */
	function loadData(key, paramData, callBack) {
		// alert("Loading: " + messageType);
		if (dataLayer.cache) {
			/*
			 * appController.getComponent("RenderingEngine").showPageLoading(
			 * "loading " + key);
			 * appController.getComponent("RenderingEngine").openModalDialog(
			 * "loading " + key);
			 */
			HL.getStaticDocument(key, function(content) {
				/*
				 * appController.getComponent("RenderingEngine")
				 * .hidePageLoading();
				 * appController.getComponent("RenderingEngine")
				 * .closeModalDialog();
				 */
				if (callBack)
					callBack(content);

			}, function(data) {
				// alert("Static Document load Failure :" + key);
				/*
				 * appController.getComponent("RenderingEngine")
				 * .hidePageLoading();
				 * appController.getComponent("RenderingEngine")
				 * .closeModalDialog();
				 */
				if (callBack)
					callBack(null);

			}, true);
		} else if (key.indexOf("JS_") > -1) {
			var messageType = key.substring(3, key.length);
			// alert("MessageType : " + messageType);
			var map = this.messageTypeJsStringMap.get(messageType);
			if (map) {
				if (callBack)
					callBack(map.value);
			} else {
				$.ajax({
					type : "GET",
					url : "/hin-web/message-scripts/" + messageType + ".js",
					data : paramData,
					dataType : "html",
					cache : false,
					success : function(jsString) {
						dataLayer.messageTypeJsStringMap.put(messageType,
								jsString);
						var map = dataLayer.messageTypeJsStringMap
								.get(messageType);
						if (callBack)
							callBack(map.value);
					},

					error : function(request, error) {
						/*
						 * alert("Message Type : [" + messageType + "]");
						 */
						if (callBack)
							callBack(null);
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
					}

				});
			}
		} else if (key.indexOf("FM_") > -1) {
			var messageForm = key.substring(3, key.length);
			// alert("MessageForm : " + messageForm);
			var map = dataLayer.messageFormMap.get(messageForm);
			if (map) {
				if (callBack)
					callBack(map.value);
			} else {
				var url = "../message-forms/" + messageForm + ".html";
				$.ajax({

					type : "GET",
					url : url,
					dataType : "html",
					cache : false,
					success : function(data) {

						dataLayer.messageFormMap.put(messageForm, data);
						var map = dataLayer.messageFormMap.get(messageForm);
						if (callBack)
							callBack(map.value);
					},

					error : function(request, error) {
						/*
						 * alert("Message Form Not Found : " + request + ": " +
						 * error);
						 */
						if (callBack)
							callBack(null);
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
					}
				});
			}
		} else if (key.indexOf("FS_") > -1) {
			var messageForm = key.substring(3, key.length);
			// alert("MessageForm : " + messageForm);
			var map = dataLayer.messageFormScriptMap.get(messageForm);
			if (map) {
				if (callBack) {
					callBack(map.value);
				}
			} else {
				var url = "../form-scripts/" + messageForm + ".js";
				$.ajax({

					type : "GET",
					url : url,
					dataType : "html",
					cache : false,
					success : function(data) {

						dataLayer.messageFormScriptMap.put(messageForm, data);
						var map = dataLayer.messageFormScriptMap
								.get(messageForm);
						if (callBack)
							callBack(map.value);
					},

					error : function(request, error) {

						// alert("Form JS Not Found : " + messageForm + ": "
						// +
						// error);
						if (callBack)
							callBack(null);
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
					}
				});
			}
		}

	}
	;

	this.loadAllStaticDatas = loadAllStaticDatas;
	this.messageTypes = [ "COCT_MT150000HT04", "FIAB_MT020000HT02", "LICENSEE",
			"POCD_MT000040UV_AWARENESS_QUESTIONNAIRE",
			"POCD_MT000040UV_ConsentForm",
			"POCD_MT000040UV_CULTURE_QUESTIONNAIRE",
			"POCD_MT000040UV_ENVIRONMENT_QUESTIONNAIRE",
			"POCD_MT000040UV_HEALTH_HISTORY_QUESTIONNAIRE",
			"POCD_MT000040UV_LIFE_STYLE_QUESTIONNAIRE",
			"POCD_MT000040UV_PhysicalExamination",
			"POCD_MT000040UV_PhysiciansComments", "POCD_MT000040UV_Program",
			"POCD_MT000040UV_Welcome", "POLB_MT004000HT01_ABI",
			"POLB_MT004000HT01_Bioclip", "POLB_MT004000HT01_Biospace",
			"POLB_MT004000HT01_BloodTest", "POLB_MT004000HT01_CAC",
			"POLB_MT004000HT01_CNS", "POLB_MT004000HT01_Elastometer",
			"POLB_MT004000HT01_Heartmath", "POLB_MT004000HT01_HormonePanel",
			"POLB_MT004000HT01_IMT", "POLB_MT004000HT01_MCG",
			"POLB_MT004000HT01_SphygmoCor", "POLB_MT004000HT01_Thyroflex",
			"POLB_MT004000HT01_ToxinePanel", "POSA_MT920000HT03_Genetics",
			"POSA_MT920000HT03_Hormones", "POSA_MT920000HT03_Supplements",
			"PRPA_MT201000HT03", "PRPA_MT410001HT02", "ROLE_EMPLOYEE",
			"ROLE_PATIENT", "ROLE_PERMISSION", "ROLE_PHYSICIAN", "ROLE_USER",
			"POCD_MT000040UV_ResultsView", "POCD_MT000040UV_ConsultationView",
			"POCD_MT000040UV_ClientReportView",
			"POLB_MT004000HT01_FitnessTest", "POSA_MT920000HT03_HormonesRpt",
			"POCD_MT000040UV_PhComm_IN", "POCD_MT000040UV_PhComm_EX",
			"POCD_MT000040UV_PhComm_GE", "POCD_MT000040UV_PhComm_LI",
			"POCD_MT000040UV_PhComm_NU", "POCD_MT000040UV_PhComm_TO",
			"POCD_MT000040UV_PhEx", "POCD_MT000040UV_PhComm" ];

	this.forms = [ "ABI_FORM", "ACCOUNT_BALANCE_FORM", "AESTHETICS_FORM",
			"APPOINTMENT_FEES_FORM", "APPOINTMENT_FORM",
			"AWARENESS_QUESTIONNAIRE_FORM", "BIOCLIP_FORM", "BIOSPACE_FORM",
			"BLOOD_TEST_RESULT_FORM", "CAC_FORM", "CARDIOSCAN_FORM",
			"CARDIO_FORM", "CLIENT_REPORT_FORM", "CNS_FORM", "CONSENT_FORM",
			"CONSULTATION_EXERCISE", "CONSULTATION_GENETICS",
			"CONSULTATION_INFORMATION", "CONSULTATION_LIFELONG",
			"CONSULTATION_NUTRITION", "CONSULTATION_TOXIN",
			"CONTACT_PERSON_FORM", "COST_FORM", "CULTURE_FORM",
			"CULTURE_QUESTIONNAIRE_FORM", "DEMOGRAPHICS_FORM", "DISCOUNT",
			"ELASTOMETER_FORM", "ENVIRONMENT_FORM",
			"ENVIRONMENT_QUESTIONNAIRE_FORM", "EXERCISE_FORM", "FEE_FORM",
			"GENETICS_FORM", "HEALTH_HISTORY_QUESTIONNAIRE_FORM",
			"HEART_MATH_FORM", "HORMONES_GRID_FORM", "IMT_FORM",
			"INFLAMMATION_FORM", "INVOICE_FORM", "LABS_FORM", "LEARNING_FORM",
			"LICENSEE_REGISTRATION_FORM", "LIFE_STYLE_QUESTIONNAIRE_FORM",
			"MCG_FORM", "MCG_FORM1", "MEASUREMENTS_FORM", "MEASURE_FORM",
			"NOT_EXISTING_FORM", "NUTRITION_METABOLIC_FORM", "ORGAN_FORM",
			"OVERVIEW_REPORT_FORM", "OVERVIEW_RESULT_FORM",
			"PATIENT_APPOINTMENT_FORM", "PAYMENT_FORM", "PERMISSION_FORM",
			"PRODUCT_FORM", "PROGRAMS_FORM", "PROGRAM_FORM",
			"REGISTRATION_FORM", "REGISTRATION_FORM_BASE", "RENEW_FORM",
			"RESTORATION_FORM", "REVIEW_FORM", "ROLE_EMPLOYEE_FORM",
			"ROLE_PATIENT_FORM", "ROLE_PHYSICIAN_FORM", "ROLE_USER_FORM",
			"ROLE_USER_FORM1", "SCHEDULE_FORM", "SERVICE_FORM",
			"SETTINGS_FORM", "SIGNUP_FORM", "SPHYGMOCOR_FORM",
			"STAFF_REGISTRATION_FORM", "SUBSTANCES_FORM",
			"SUPPLEMENTATION_FORM", "SUPPLEMENTS_GRID_FORM", "THYROFLEX_FORM",
			"TOXIN_FORM", "USER_REGISTRATION_FORM", "WELCOME_BOOKING_FORM",
			"CONSULTATION_NUTRITION", "CONSULTATION_EXERCISE", "RESULTS_FORM",
			"CONSULTATION_FORM", "CONSULTATION_INFLAMMATION_FORM",
			"FITNESS_TEST", "CLIENT_CHART_FORM", "DISCOUNT_FORM",
			"WELCOME_BOOKING_FORM", "HISTORY_FORM", "LICENSEE_PRODUCT_FORM",
			"LICENSEE_RECEIVABLES_FORM", "LICENSEE_PAYABLES_FORM",
			"LICENSEE_OTHERFEE_FORM", "BALANCE_FORM", "ROLE_DEFINITION_FORM",
			"ROLE_RIGHTS_FORM" ];

	function loadAllStaticDatas(callback) {
		if (!dataLayer.cache) {

			for ( var messageTypesIndex = 0; messageTypesIndex < this.messageTypes.length; messageTypesIndex++) {
				dataLayer.loadData(
						"JS_" + this.messageTypes[messageTypesIndex], {}, null);
			}
			for ( var formIndex = 0; formIndex < this.forms.length; formIndex++) {
				dataLayer.loadData("FM_" + this.forms[formIndex], {}, null);
			}

			for ( var formIndex = 0; formIndex < this.forms.length; formIndex++) {
				dataLayer.loadData("FS_" + this.forms[formIndex], {}, null);
			}
		}
		/* if (!dataLayer.cache) { */
		// dataLayer.serviceLayer.getProcessDefinitions(callback);
		/*
		 * }else{ //TODO }
		 */

	}

	function getCurrencyValue(json, callBack) {
		dataLayer.serviceLayer.getCurrencyValue(json, callBack);
	}

	function loadLookUpDataInToCache(callBack) {
		dataLayer.serviceLayer.loadLookUpDataInToCache(callBack);
	}
	;
	this.loadLookUpDataInToCache = loadLookUpDataInToCache;

	this.getMembershipId = getMembershipId;
	function getMembershipId(callBack) {
		dataLayer.serviceLayer.getMembershipId(callBack);
	}

	this.getInvoiceId = getInvoiceId;
	function getInvoiceId(callBack) {
		dataLayer.serviceLayer.getInvoiceId(callBack);
	}
	this.getLicenseeInvoiceId = getLicenseeInvoiceId;
	function getLicenseeInvoiceId(callBack) {
		dataLayer.serviceLayer.getLicenseeInvoiceId(callBack);
	}

	this.getReceiptId = getReceiptId;
	function getReceiptId(callBack) {
		dataLayer.serviceLayer.getReceiptId(callBack);
	}

	function loadLoginInfoToCache(userLoginInfo) {
		dataLayer.cacheManager.cacheLoginInfo(userLoginInfo);
	}
	this.loadLoginInfoToCache = loadLoginInfoToCache;

	function getCachedLoginInfo(index, callBack) {
		dataLayer.cacheManager.getCachedLoginInfo(index, callBack);
	}
	;
	this.getCachedLoginInfo = getCachedLoginInfo;

	function removeCachedLoginInfo(index) {
		dataLayer.cacheManager.removeCachedLoginInfo(index);
	}
	;
	this.removeCachedLoginInfo = removeCachedLoginInfo;

	this.createMessageByType = createMessageByType;
	function createMessageByType(messageType, callback) {
		/* alert("createMessage : " + messageType); */
		dataLayer.loadConfig(messageType, function(configDoc) {
			var msgApiObj = configDoc.createMessage();
			dataLayer.config = configDoc;
			dataLayer.generateId(function(messageId, msg) {
				var messageObj = factoryClass.createMessage();
				messageObj.messageId = messageId;
				messageObj.msg = msg
				messageObj.messageType = messageType;
				messageObj.message = msg.getXML();
				if (callback)
					callback(messageObj);
			}, msgApiObj);
		});
	}
	;

	function syncMessage(successCallback, failureCallback) {
		if (dataLayer.synCompleted) {
			dataLayer.synCompleted = false;
			doSynchronize(successCallback, failureCallback);
		}
	}

	function doSynchronize(successCallback, failureCallback) {
		HL.syncMessage(function() {
			appController.getComponent("RenderingEngine").hidePageLoading();
			// alert("Server synchronization Completed.");
			dataLayer.synCompleted = true;
			if (successCallback)
				successCallback();
			/*
			 * setTimeout(function() { dataLayer.syncMessage(successCallback,
			 * failureCallback); }, 5000);
			 */

		}, function() {
			// alert("Server synchronization Failed.");
			dataLayer.synCompleted = true;
			if (failureCallback)
				failureCallback();
			/*
			 * setTimeout(function() { dataLayer.syncMessage(successCallback,
			 * failureCallback); }, 5000);
			 */
		});
	}
	this.getLocalProcessDefinitionMessages = getLocalProcessDefinitionMessages;
	function getLocalProcessDefinitionMessages() {
		var localMessages = new Array();
		var allProcessDefinition = HL.getProcessDefinition();
		$.each(allProcessDefinition, function(index, data) {
			var processDefinition = dataLayer.createProcessDefinitionClone(JSON
					.parse(data.content));
			if (processDefinition != null) {
				$.each(processDefinition.steps, function(index, data) {
					$.each(data.messageTypes, function(index, data) {
						$.each(data.messages, function(index, data) {
							// alert("" + data);
							localMessages.push(data);
						});
					});
				});
			}
		});
		return localMessages;
	}
	/* syncronize configuration messages from cache */
	this.syncronizeConfigurations = syncronizeConfigurations;
	function syncronizeConfigurations(callBack) {
		appController.getComponent("RenderingEngine").showPageLoading();
		appController.getComponent("RenderingEngine").openModalDialog(
				"Synchronizing configurations");
		HL.syncMeta(function() {
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			callBack();
		}, function() {
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			callBack();
		});
	}

	/* purge configuration messages from cache */
	this.purgeConfigurations = purgeConfigurations;
	function purgeConfigurations(callBack) {
		appController.getComponent("RenderingEngine")
				.openModalDialog("Loading");
		clearConfigStore();
		function clearConfigStore() {
			setTimeout(function() {
				HL.clearConfigStore(function() {
					appController.getComponent("RenderingEngine")
							.closeModalDialog();
					callBack();
				});
			}, 10);
		}
	}

	/* purge static storage messages from cache */
	this.purgeStaticMessages = purgeStaticMessages;
	function purgeStaticMessages(callBack) {
		appController.getComponent("RenderingEngine")
				.openModalDialog("Loading");
		clearStaticStore();
		function clearStaticStore() {
			setTimeout(function() {
				HL.clearStaticStore(function() {
					appController.getComponent("RenderingEngine")
							.closeModalDialog();
					callBack();
				});
			}, 10);
		}
	}

	this.getStaticMessageInternal = getStaticMessageInternal;
	function getStaticMessageInternal(message, UIcallback, cache) {
		// alert(message);// + " : " + UIcallback);
		// var url = "/rest/getMessage?messageId=" + messageId;
		var messageId = message.messageId;
		var url = messageId;
		var local = dataLayer.cache;
		if (!cache) {
			local = false;
		}

		// alert("Before Call: " + url);
		HL
				.getStaticMessage(
						url,
						function(msgObject) {
							// alert("Loaded : " + msgObject);
							// alert("data layer getMessageInternal : " +
							// messageId);
							dataLayer.msg = msgObject;
							message.msg = msgObject;
							message.message = msgObject.getXML();
							// if (!dataLayer.cache) {
							dataLayer.putMessageObject(message);
							// }
							/*
							 * if (cache) dataLayer.messageMap.put(messageId,
							 * dataLayer.msg);
							 */
							UIcallback(messageId, dataLayer.msg, message);
						},
						function(status) {
							alert(" DataLayer method [getStaticMessageInternal] - Message Id: ["
									+ message.messageId
									+ "] , Message Type : ["
									+ message.messageType
									+ " ] :  Reason Message Not Found ["
									+ status + "]");
						}, local);

	}
	;
	this.getLocalProcessDefinitionMessage = getLocalProcessDefinitionMessage;
	function getLocalProcessDefinitionMessage() {
		var processDefinitions = new Array();
		var allProcessDefinition = HL.getProcessDefinition();
		$.each(allProcessDefinition, function(index, data) {
			var processDefinition = dataLayer.createProcessDefinitionClone(JSON
					.parse(data.content));
			processDefinitions.push(processDefinition);
		});
		return processDefinitions;
	}
	this.getStaticProcessDefinitionMessage = getStaticProcessDefinitionMessage;
	function getStaticProcessDefinitionMessage() {
		var staticProcessDefinitions = new Array();
		var allProcessDefinition = HL.getProcessDefinition();
		$.each(allProcessDefinition, function(index, data) {
			var processDefinition = dataLayer.createProcessDefinitionClone(JSON
					.parse(data.content));
			if (processDefinition != null) {
				$.each(processDefinition.steps, function(index, data) {
					$.each(data.messageTypes, function(index, data) {
						$.each(data.messages, function(index, message) {
							dataLayer.getStaticMessageInternal(message,
									function(messageId, msg, messageObj) {
										staticProcessDefinitions
												.push(processDefinition);
									}, true);
						});
					});
				});
			}
		});
		return staticProcessDefinitions;
	}

	this.getAllRollNames = getAllRollNames;
	function getAllRollNames(callBack) {
		dataLayer.serviceLayer.retrieveAllRollNames(function(data) {
			if (callBack) {
				callBack(data);
			}
		});

	}
	this.getAllProcessNames = getAllProcessNames;
	function getAllProcessNames(callBack) {
		dataLayer.serviceLayer.retrieveAllProcessNames(function(data) {
			if (callBack) {
				callBack(data);
			}
		});

	}
}
