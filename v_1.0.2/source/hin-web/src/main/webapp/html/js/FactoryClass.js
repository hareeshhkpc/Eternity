/**
 * FactoryClass creates objects without exposing the instantiation logic to the
 * end user, Methods of a factory whose main purpose is creation of objects.
 * 
 * @returns
 */
function FactoryClass() {
	// id variable
	var id = 1;
	var idGenerator = null;
	// instance of the idGenerator
	this.factoryClassInstance = null;

	// Get the instance of the SingletonClass
	// If there is no instance in this.idGeneratorInstance, instanciate one
	var getInstance = function() {
		if (!this.factoryClassInstance) {
			// create a instance
			this.factoryClassInstance = createInstance();
		}

		// return the instance of the idGeneratorClass
		return this.factoryClassInstance;
	}

	// function for the creation of the SingletonClass class
	var createInstance = function() {

		// public methodes
		return {
			/**
			 * Provide the message object
			 */
			createMessage : function() {
				if (!idGenerator)
					idGenerator = new IDGenerator();
				var message = new HIN.Message();
				var id = idGenerator.getId();
				message.id = id;
				message.messageStatus = 0;// AppConstants.MessageStatus.PENDING;
				message.status = AppConstants.Status.ACTIVE
				message.rendered = false;
				message.finished = false;
				message.addNew = true;
				message.initializeScriptExecuted = false;
				/* message.deletable = true; */
				return message;
			},
			/**
			 * Provide the message type object
			 */
			createMessageType : function(type, typeName, formHtml, title) {
				var messageType = new HIN.MessageType();
				messageType.type = type;
				messageType.state = 2;// AppConstants.MessageStatus.PENDING;
				messageType.typeName = typeName;
				messageType.formHtml = formHtml;
				messageType.status = AppConstants.Status.ACTIVE
				messageType.title = title;
				return messageType;
			},
			/**
			 * Provide the taskvo object
			 */
			createTaskVo : function() {
				var taskVo = new HIN.TaskVO();
				return taskVo;
			},
			/**
			 * Provide the step object
			 */
			createStep : function(stepName) {
				var step = new HIN.Step();
				step.status = AppConstants.Status.ACTIVE;
				step.stepName = stepName;
				step.groupName = stepName;
				step.shortDescription = stepName + " Short Description";
				step.longDescription = stepName + "Long Description";
				return step;
			},

			createHiddenStep : function(stepName) {
				var step = new HIN.Step();
				step.status = AppConstants.Status.ACTIVE;
				step.stepName = "Hidden_" + stepName;
				step.groupName = stepName;
				step.shortDescription = stepName + " Short Description";
				step.longDescription = stepName + "Long Description";
				return step;
			},
			/**
			 * Provide the process definition object
			 */
			createProcessDefinitionInstance : function(data) {
				// alert(data.processName);
				if (!data)
					return null;
				var definition = new HIN.ProcessDefinition();
				definition.processName = data.processName;
				definition.description = data.description;
				definition.scripts = data.scripts;
				definition.id = data.id;
				definition.status = data.status;
				definition.initializeScript = data.initializeScript;

				var prop = 'order'
				var asc = 'asc';
				var sortedSteps = data.steps.sort(function(a, b) {
					if (asc)
						return (a[prop] > b[prop]);
					else
						return (b[prop] > a[prop]);
				});
				// counter++;
				for ( var stepIndex = 0; stepIndex < sortedSteps.length; stepIndex++) {
					var jsonStep = sortedSteps[stepIndex];
					if (jsonStep.status == "ACTIVE") {

						var step = new HIN.Step();
						step.stepName = jsonStep.stepName;
						step.groupName = jsonStep.groupName;
						if (step.groupName)
							step.groupName = step.groupName
									.replace(/\s+/g, '_');
						step.shortDescription = jsonStep.shortDescription;
						step.longDescription = jsonStep.longDescription;
						step.formHtml = jsonStep.formHtml;
						step.status = jsonStep.status;
						step.state = jsonStep.state;
						step.stepStatusInfo = jsonStep.stepStatusInfo;
						// alert("Message Length : "+jsonStep.messages.length);
						var prop = 'msgTypeOrder'
						var asc = 'asc';
						var sortedMessageTypes = jsonStep.messageTypes
								.sort(function(a, b) {
									if (asc)
										return (a[prop] > b[prop]);
									else
										return (b[prop] > a[prop]);
								});

						for ( var messageTypeIndex = 0; messageTypeIndex < sortedMessageTypes.length; messageTypeIndex++) {
							var jsonMessageType = sortedMessageTypes[messageTypeIndex];
							if (jsonMessageType.status == "ACTIVE") {
								var messageType = new HIN.MessageType();
								messageType.state = jsonMessageType.state;
								messageType.type = jsonMessageType.type;
								messageType.typeName = jsonMessageType.typeName;
								if (!messageType.typeName)
									messageType.typeName = "Unknown Group"
								messageType.typeName = messageType.typeName
										.replace(/\s+/g, '_');
								messageType.formHtml = jsonMessageType.formHtml;
								messageType.sortType = jsonMessageType.type;
								messageType.title = jsonMessageType.title;
								messageType.status = jsonMessageType.status;
								messageType.queryString = jsonMessageType.queryString;
								messageType.category = jsonMessageType.category;
								messageType.status = jsonMessageType.status;
								messageType.transactionType = jsonMessageType.transactionType;
								messageType.finished = jsonMessageType.finished;
								// alert(jsonMessageType.messages.length);
								for ( var messageIndex = 0; messageIndex < jsonMessageType.messages.length; messageIndex++) {
									var jsonMessage = jsonMessageType.messages[messageIndex];
									var message = new HIN.Message();
									message.id = idGenerator.getId();// jsonMessage.messageIndex;
									message.messageIndex = message.id;
									message.messageId = jsonMessage.messageId;
									message.message = jsonMessage.message;
									message.messageStatus = jsonMessage.messageStatus;
									message.messageType = jsonMessage.messageType;
									message.messageForm = jsonMessage.messageForm;
									message.header = jsonMessage.header;
									message.title = jsonMessage.title;
									message.transactionType = jsonMessage.transactionType;
									message.finished = jsonMessage.finished;
									message.messageProcessCompeletionStatus = jsonMessage.messageProcessCompeletionStatus;
									message.partOfPackage = jsonMessage.partOfPackage;
									message.financeType = jsonMessage.financeType;
									message.addNew = jsonMessage.addNew;
									message.initializeScriptExecuted = jsonMessage.initializeScriptExecuted;
									message.deletable = jsonMessage.deletable;
									messageType.addMessage(message);
									/*
									 * if (jsonMessage.dependendMessages)
									 * alert(jsonMessage.dependendMessages.length);
									 */
									for ( var dependendMessageIndex = 0; dependendMessageIndex < jsonMessage.dependendMessages.length; dependendMessageIndex++) {
										var jsonDependendMessage = jsonMessage.dependendMessages[dependendMessageIndex];
										var dependendMessage = new HIN.Message();
										dependendMessage.id = idGenerator
												.getId();// jsonMessage.messageIndex;
										dependendMessage.messageIndex = jsonDependendMessage.id;
										dependendMessage.messageId = jsonDependendMessage.messageId;
										dependendMessage.message = jsonDependendMessage.message;
										dependendMessage.messageStatus = jsonDependendMessage.messageStatus;
										dependendMessage.messageType = jsonDependendMessage.messageType;
										dependendMessage.messageForm = jsonDependendMessage.messageForm;
										dependendMessage.header = jsonDependendMessage.header;
										dependendMessage.title = jsonDependendMessage.title;
										dependendMessage.transactionType = jsonDependendMessage.transactionType;
										dependendMessage.finished = jsonDependendMessage.finished;
										message
												.addDependendMessage(dependendMessage);
									}
								}
								step.addMessageType(messageType);

								var count = messageType.getMessages().length;
								if (count > 0) {
									/* alert(messageType.title + " : " + count); */
									step.addMessageGroup(messageType, count);
								}
							}
						}
						definition.addStep(step);
					}

				}

				return definition;
			}

		}
	}

	// wen constructed the getInstance is automaticly called and return the
	// SingletonClass instance
	return getInstance();
}
