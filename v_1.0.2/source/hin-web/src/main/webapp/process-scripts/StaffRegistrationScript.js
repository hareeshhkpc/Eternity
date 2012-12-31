function StaffRegistration(processDefinition, appController, idGenerator) {
	var thisObject = this;

	// alert("Inside DemographicsAndBackground");

	this.processDefinition = processDefinition;
	this.appController = appController;
	this.idGenerator = idGenerator;
	this.dataLayer = appController.getComponent("DataLayer");

	this.StpName = 'Step2';

	this.messageTypes = [];
	this.messageTypeQueue = 0;
	this.callBackAfterScript = null;

	this.messageCreationMap = new HIN.HashMap();
	this.messageCreationMapQueue = 0;

	this.objects = [];
	this.objectQueue = 0;

	this.initialize = function(callBackFunction) {
		// thisObject.log("initialize : " + thisObject.processDefinition);

		var empty = [];
		var object = new Object();
		object.messageType = 'PRPA_MT201000HT03';
		object.conceptName = 'Staff Registration';
		object.category = "Role";
		object.lookup = false;
		thisObject.messageCreationMap.put(object, empty);

		var empty = [];
		var object = new Object();
		object.messageType = 'ROLE_EMPLOYEE';
		object.conceptName = 'Employee';
		object.category = "Role";
		object.lookup = false;
		thisObject.messageCreationMap.put(object, empty);

		var empty = [];
		var object = new Object();
		object.messageType = 'ROLE_PERMISSION';
		object.conceptName = 'Permission';
		object.category = "Permission";
		object.lookup = false;
		thisObject.messageCreationMap.put(object, empty);

	};

	this.stepOpen = function(stepName, callBackAfterScript) {
		if (stepName === thisObject.StpName) {
			thisObject.callBackAfterScript = callBackAfterScript;
			thisObject.startMessageCreation();
		}
	};

	this.startMessageCreation = function() {

		if (thisObject.messageCreationMapQueue < thisObject.messageCreationMap
				.length()) {
			var map = thisObject.messageCreationMap
					.getItemAt(thisObject.messageCreationMapQueue);
			thisObject.messageCreationMapQueue++;
			thisObject.objectQueue = 0;
			var object = map.key;
			thisObject.objects = map.value;
			thisObject.createNewMessage(object, null, thisObject.messageCreate);
		} else {
			if (thisObject.callBackAfterScript) {
				thisObject.callBackAfterScript(thisObject.processDefinition);
			}
		}
	}

	this.messageCreate = function(conceptLookup) {

		/*
		 * alert(thisObject.messageTypeQueue + "<" +
		 * thisObject.messageTypes.length);
		 */
		if (thisObject.objectQueue < thisObject.objects.length) {
			thisObject.objectQueue++;
			thisObject.createNewMessage(
					thisObject.objects[thisObject.objectQueue - 1],
					conceptLookup, function() {
						// alert("Message Created.");
						thisObject.messageCreate(conceptLookup);
					});
		} else {
			thisObject.startMessageCreation();
		}
	}

	this.createNewMessage = function(object, conceptLookup, callback) {

		// if call from startMessageCreation then object should be there
		var messageType = object.messageType;
		var conceptName = object.conceptName;
		var category = object.category;
		var lookup = object.lookup;
		// alert(conceptName + " : " + category);
		/*
		 * if (!messageType) { messageType = object; } else { lookup = true; }
		 */
		// alert("creating NewMessage: " + messageType + " lookup : " + lookup);
		thisObject.dataLayer.loadConfig(messageType, function(configDoc) {
			var message = configDoc.createMessage();
			thisObject.dataLayer.config = configDoc;
			thisObject.dataLayer.generateId(function(msgId, msgApiObj,messageObj) {
				// alert(messageType);
				if (messageType == "ROLE_EMPLOYEE") {
					thisObject.StpName = "Step2"
				} else if (messageType == "ROLE_PERMISSION") {
					thisObject.StpName = "Step3"
				}
				// Add the current appointment to process definition
				var msgTypeObj = thisObject.processDefinition.getStep(
						thisObject.StpName).getMessageTypeByType(messageType);
				// alert("msgTypeObj: " + msgTypeObj);
				/*var id = thisObject.idGenerator.getId();
				var messageObj = new HIN.Message();
				messageObj.id = id;
				messageObj.messageId = msgId;
				messageObj.message = msgApiObj.getXML();
				messageObj.msg = msgApiObj;*/

				if (messageType != "PRPA_MT201000HT03")
					messageObj.renderUI = false;
				if (!msgTypeObj) {
					msgTypeObj = new HIN.MessageType();
					msgTypeObj.type = messageType;
					msgTypeObj.typeName = messageType.typeName;
					messageObj.title = msgTypeObj.title;
					thisObject.processDefinition.getStep(thisObject.StpName)
							.addMessageType(msgTypeObj);

					/*
					 * if (category && conceptName) {
					 * thisObject.fetchLookup(category, conceptName, msgTypeObj,
					 * msgId, message, conceptLookup, callback) } else {
					 * msgTypeObj.addMessage(messageObj);
					 * thisObject.fillMessage(msgTypeObj, message,
					 * conceptLookup, callback); }
					 */
					/*
					 * else if (callback) callback(conceptLookup);
					 */
				}
				if (conceptName)
					msgTypeObj.title = conceptName;
				else
					msgTypeObj.title = msgTypeObj.type;

				messageObj.title = msgTypeObj.title;

				var msg = messageObj.msg;
				/*
				 * alert(messageObj.messageId + " : " + msg); alert("Msg SCript
				 * Message xml : " + XmlUtil.xmlToString(msg.getXML()));
				 */
				if (lookup) {
					thisObject.fetchLookup(category, conceptName, msgTypeObj,
							msgId, message, conceptLookup, callback)
				} else {
					msgTypeObj.addMessage(messageObj);
					thisObject.fillMessage(msgTypeObj, message, conceptLookup,
							callback);
				}

				/*
				 * else { // alert("msgTypeObj: " + msgTypeObj); if
				 * (conceptName) msgTypeObj.title = conceptName;
				 * 
				 * messageObj.title = msgTypeObj.title;
				 * msgTypeObj.addMessage(messageObj);
				 * thisObject.fillMessage(msgTypeObj, message, conceptLookup,
				 * callback); }
				 */
			}, message);
		});
	};

	this.fetchLookup = function(category, conceptName, msgTypeObj, msgId,
			message, conceptLookup, callback) {
		// alert(category + " , " + conceptName);
		if (category && conceptName) {

			var object = new Object();
			object.msgTypeObj = msgTypeObj;
			object.msgId = msgId;
			object.callback = callback;
			object.message = message;

			thisObject.appController.getComponent("DataLayer")
					.fetchConceptByName(conceptName, thisObject.getLookup,
							object);
		}/*
			 * else { thisObject .fillMessage(msgTypeObj, message,
			 * conceptLookup, callback); }
			 */
	}

	this.getLookup = function(conceptLookup, object) {
		/* alert("conceptLookup : " + conceptLookup); */
		var msgTypeObj = object.msgTypeObj;
		var msgId = object.msgId;
		var message = object.message;
		var callback = object.callback;
		// alert("getLookup :" + msgTypeObj);

		if (conceptLookup) {

			var messageType = conceptLookup.getAttribute("MessageType");
			var messageForm = conceptLookup.getAttribute("MessageForm");
			var typeName = conceptLookup.getAttribute("MessageTypeName");
			var title = conceptLookup.getName();

			msgTypeObj.type = messageType;
			msgTypeObj.formHtml = messageForm;
			msgTypeObj.title = title;
			msgTypeObj.typeName = typeName;
			var id = thisObject.idGenerator.getId();
			var messageObj = new HIN.Message();
			messageObj.id = id;
			messageObj.messageId = msgId;
			messageObj.message = message.getXML();
			messageObj.msg = message;
			messageObj.title = msgTypeObj.title;
			msgTypeObj.addMessage(messageObj);
			thisObject
					.fillMessage(msgTypeObj, message, conceptLookup, callback);
		} else {
			if (callback)
				callback(null);
		}

	};

	this.fillMessage = function(messageType, message, conceptLookup, callback) {

		/*
		 * // alert("fillMessage : " + messageType.type + " : " +
		 * conceptLookup); if (messageType.type == "ROLE_USER") { //
		 * message.title = messageType.typeName = "ServiceFee";
		 * thisObject.fillRoleMessage(messageType, message, conceptLookup,
		 * callback); } else { if (callback) callback(conceptLookup); }
		 */
		if (callback)
			callback(conceptLookup);
	};

	this.fillRoleMessage = function(messageType, message, conceptLookup,
			callback) {
		/*
		 * var messageAndUIBinder = new MessageAndUIBinder('', message,
		 * messageType.type);
		 * 
		 * var fields = ""; var type = "II"; var tagName = "id"; var pathFields =
		 * fields.split(','); instanceObject = [ 'ROLE_NAME', 'employee', null ];
		 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
		 * instanceObject);
		 */
		/*
		 * var messages = thisObject.processDefinition.getStep("Step1")
		 * .getMessageTypeByType("PRPA_MT201000HT03").getMessages(); var
		 * subscriberId = ""; if (messages.length > 0) { subscriberId =
		 * messages[0].messageId; } alert("subscriberId : " + subscriberId);
		 * fields = ""; type = "II"; tagName = "id"; pathFields =
		 * fields.split(',');
		 * 
		 * instanceObject = [ 'SUBSCRIBER_ID', subscriberId, null ];
		 * 
		 * messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,
		 * instanceObject);
		 */
		if (callback)
			callback(conceptLookup);
	};

	/*
	 * this.createMessage = function(messageType, callBackFunction) { //
	 * alert("createMessage : " + messageType);
	 * DemographicsAndBackground.loadConfig(messageType, function(msgBinder) { //
	 * alert("msgBinder: " + msgBinder); if (callBackFunction)
	 * callBackFunction(msgBinder); }); };
	 */

	/*function loadConfig(messageType, callBackFunction) {
		getMessage('/message-configuration/' + messageType + '.xml', function(
				configData) {

			var configDoc = new ConfigDocument(configData)

			if (callBackFunction)
				callBackFunction(configDoc);

		}, function(status) {
			thisObject.log("Failed to load configuration. Status: " + status);
		});
	}
	;*/

	this.log = function(message) {
		alert(message);
	}
};