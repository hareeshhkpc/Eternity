var hl7adapter = function(_id) {
	/***************************************************************************
	 * ********************************************************************************\
	 * Constants \
	 **************************************************************************/

	var DELETED_FROM_STORE = 1
	var EDITED_IN_STORE = 2
	var GUEST_ID = "guest"

	var RETURN_RAW = 0
	this.RETURN_RAW = RETURN_RAW
	var RETURN_OBJECT = 1
	this.RETURN_OBJECT = RETURN_OBJECT
	var RETURN_DOM = 2
	this.RETURN_DOM = RETURN_DOM
	var FORCE_SYNC = false;

	/***************************************************************************
	 * ********************************************************************************\
	 * Storage functions \
	 **************************************************************************/
	var userid = _id || GUEST_ID
	var storeReady = {
		config : false,
		message : false,
		genobj : false
	}
	var lookupstore = new Lawnchair({
		name : "lookupstore"
	}, function() {
		storeReady.genobj = true
	})
	var configstore = new Lawnchair({
		name : "configstore"
	}, function() {
		storeReady.config = true
	})
	var messagestore = new Lawnchair({
		name : "messagestore_" + userid
	}, function() {
		initStore(this, function() {
			storeReady.message = true
		})
	})
	var staticstore = new Lawnchair({
		name : "staticstore_" + userid
	}, function() {
		storeReady.config = true
	})
	configstore.userid = "common"
	messagestore.userid = userid
	staticstore.userid = userid

	function initStore(store, callback) {
		/*
		 * if(userid == GUEST_ID){ store.nuke(callback) } else {
		 */
		callback()
		/* } */
	}

	function makeDocument(key, revision, contentString) {
		var doc = {
			key : key,
			rev : revision,
			content : contentString,
			params : {}
		}
		return doc
	}

	function getChangedDocuments(store, callback) {
		store.get('__changes', function(changeObj) {
			if (changeObj == null) {
				changeObj = {
					key : '__changes'
				};
			}
			callback(changeObj)
		})
	}

	function addChangedDocument(store, docKey, callback) {
		getChangedDocuments(store, function(changeObj) {
			changeObj[docKey] = EDITED_IN_STORE
			store.save(changeObj, callback)
		})
	}

	function addRemovedDocument(store, docKey, callback) {
		getChangedDocuments(store, function(changeObj) {
			changeObj[docKey] = DELETED_FROM_STORE
			store.save(changeObj, callback)
		})
	}

	function removeChangedDocument(store, docKey, callback) {
		getChangedDocuments(store, function(changeObj) {
			delete changeObj[docKey]
			store.save(changeObj, callback)
		})

	}

	function saveDocument(store, doc, callback) {
		if (!isProcess(doc) && isCompleted(doc)) {
			staticstore.save(doc, function() {
			})
		} else {
			store.save(doc, function() {
				addChangedDocument(store, doc.key, callback)
			})
		}
	}

	function convertChangeObjToChangeArr(changeObj) {
		var result = new Object();
		result.edits = new Array()
		result.deletes = new Array()

		for ( var key in changeObj) {
			if (key != 'key') {
				if (changeObj[key] == EDITED_IN_STORE) {
					result.edits.push(key)
				} else if (changeObj[key] == DELETED_FROM_STORE) {
					result.deletes.push(key)
				}
			}
		}
		return result;

	}

	function clearStore(store, callback) {
		store.nuke(callback);
	}

	function clearMessageStore(callback) {
		clearStore(messagestore, callback)
	}
	this.clearMessageStore = clearMessageStore

	function clearConfigStore(callback) {
		clearStore(configstore, callback)
	}
	this.clearConfigStore = clearConfigStore

	function clearStaticStore(callback) {
		clearStore(staticstore, callback)
	}
	this.clearStaticStore = clearStaticStore

	/***************************************************************************
	 * Helper functions
	 **************************************************************************/

	function xml2string(node) {
		if (typeof (XMLSerializer) !== 'undefined') {
			var serializer = new XMLSerializer();
			return serializer.serializeToString(node);
		} else if (node.xml) {
			return node.xml;
		}
	}

	function parseXml(xml) {
		var dom = null;
		if (window.DOMParser) {
			try {
				dom = (new DOMParser()).parseFromString(xml, "text/xml");
			} catch (e) {
				dom = null;
			}
		} else if (window.ActiveXObject) {
			try {
				dom = new ActiveXObject('Microsoft.XMLDOM');
				dom.async = false;
				if (!dom.loadXML(xml)) // parse error ..
					window
							.alert(dom.parseError.reason
									+ dom.parseError.srcText);
			} catch (e) {
				dom = null;
			}
		} else
			alert("oops");
		return dom;
	}

	function guidGenerator() {
		var S4 = function() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		};
		return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4()
				+ S4() + S4());
	}

	// Evaluate an XPath expression aExpression against a given DOM node
	// or Document object (aNode), returning the results as an array
	// thanks wanderingstan at morethanwarm dot mail dot com for the
	// initial work.
	function evaluateXPath(aNode, aExpr) {
		var xpe = new XPathEvaluator();
		var nsResolver = xpe
				.createNSResolver(aNode.ownerDocument == null ? aNode.documentElement
						: aNode.ownerDocument.documentElement);
		var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
		var found = [];
		var res;
		while (res = result.iterateNext())
			found.push(res);
		return found;
	}

	/***************************************************************************
	 * Communication functions
	 **************************************************************************/

	function getDocument(docid, callback, failback, store) {

		/* url: '../../'+docid, */
		// var url = AppConstants.URL.COUCHDB +
		// "_design/hl7store/_show/xmlmessage/" +docid;
		var url = AppConstants.URL.COUCHDB + docid;
		$.ajax({
			url : url,
			type : "GET",
			data : "",
			contentType : "application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(eval(result.responseText));
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}
		function AjaxCallback(result) {
			var doc = makeDocument(docid, result._rev, result.content)
			if (!isProcess(doc) && isCompleted(doc)) {
				staticstore.save(doc, function() {
				})
			} else {
				if (store)
					store.save(doc)
					// setTimeout(function(){ callback(doc) }, 10000)
			}
			callback(doc)
		}
	}

	function updateDocument(handler, doc, callback, failback, store, objecttype) {
		var objectTypeStr = objecttype || 'smo';

		var params = null;
		if (doc.params)
			params = JSON.stringify(doc.params);

		$.ajax({
			url : AppConstants.URL.COUCHDBUPDATE + '_update/' + handler + '/'
					+ doc.key + '?objecttype=' + objectTypeStr + "&userid="
					+ userid + '&params=' + params,
			type : "POST",
			data : doc.content,
			contentType : "application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxCallback(data, textStatus, request) {
			var newrev = request.getResponseHeader('X-Couch-Update-NewRev')
			newrev = newrev || data._rev
			var doc = makeDocument(data._id, newrev, data.content)
			// setTimeout(function(){ callback(doc) }, 10000)
			callback(doc)
		}

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(eval(result.responseText));
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}
	}

	function putDocument(doc, callback, failback, store, objecttype) {
		updateDocument('postDoc', doc, putCallBack, failback, store, objecttype)
		function putCallBack(doc) {
			if (!isProcess(doc) && isCompleted(doc)) {
				staticstore.save(doc, function() {
				})
			} else {
				store.save(doc)
			}
			removeChangedDocument(store, doc.key, callback)
		}
	}

	function deleteDocument(doc, callback, failback, store, objecttype) {
		doc.params = {
			finish : true,
			deleted : true
		};
		store.remove(doc.key, function(o) {
			afterUpdate = function(doc) {
				removeChangedDocument(store, doc.key, callback)
			}
			updateDocument('deleteDoc', doc, afterUpdate, failback, store,
					objecttype)
		})
	}

	function getConfigDocument(documentid, callback, failback, useCache) {
		if (useCache) {
			configstore.get(documentid, function(r) {
				if (r == null) {
					getDocument(documentid, internalcb, internalfail,
							configstore)
				} else {
					internalcb(r)
				}
			})
		} else {
			getDocument(documentid, internalcb, internalfail, configstore)

		}

		function internalcb(doc) {
			config = new ConfigDocument(parseXml(doc.content))
			callback(config)
		}
		function internalfail(data) {
			failback(data)
		}

	}
	this.getConfigDocument = getConfigDocument

	function getMessage(documentid, callback, failback, useCache) {
		var xml = null;
		if (useCache) {
			messagestore.get(documentid, function(r) {
				if (r == null) {
					// getDocument(documentid, messagecallback,
					// failback,messagestore)
					getMessageFromServer(documentid, messagecallback, failback,
							messagestore)
				} else {
					messagecallback(r)
				}
			})
		} else {
			// getDocument(documentid, messagecallback, failback,messagestore)
			getMessageFromServer(documentid, messagecallback, failback,
					messagestore)
		}

		function messagecallback(doc) {
			xml = parseXml(doc.content)
			// alert("Message xml : " + XmlUtil.xmlToString(xml));
			var configid = xml.childNodes[0].getAttribute('config')
			getConfigDocument(configid, configcallback, failback, useCache)

		}

		function configcallback(configdoc) {
			var msg = configdoc.createMessage(documentid, xml)
			callback(msg)
		}

	}
	this.getMessage = getMessage

	function putMessage(msg, callback, failback) {

		var doc = makeDocument(msg.getId(), null, xml2string(msg.getXML()))
		putDocument(doc, callback, failback, messagestore)

	}
	this.putMessage = putMessage

	function deleteMessage(msg, callback, failback) {
		messagestore.remove(msg.getId(), function(o) {
			addRemovedDocument(messagestore, msg.getId(), callback)
		})
	}
	this.deleteMessage = deleteMessage

	/***************************************************************************
	 * Static & Dynamic Object
	 **************************************************************************/

	function getRawContent(id, callback, failback, useCache, store, convert) {
		if (useCache) {
			store.get(id, function(r) {
				if (r == null) {
					callback(r);
					// getDocument(id, staticcallback, failback,store)
					// getProcessFromServer();
				} else {
					staticcallback(r)
				}
			})
		} else {
			// getDocument(id, staticcallback, failback,store)
			getProcessFromServer();
		}

		function staticcallback(doc) {
			if (convert == RETURN_OBJECT)
				callback(JSON.parse(doc.content))
			else if (convert == RETURN_DOM)
				callback(parseXml(doc.content))
			else
				callback(doc.content)

		}

	}

	function getStaticContent(id, callback, failback, useCache, convert) {
		return getRawContent(id, callback, failback, useCache, configstore,
				convert)
	}
	this.getStaticContent = getStaticContent

	function getDynamicContent(id, callback, failback, useCache, convert) {
		return getRawContent(id, callback, failback, useCache, messagestore,
				convert)
	}
	this.getDynamicContent = getDynamicContent

	function putStaticContent(id, obj, callback, failback) {
		var val = obj
		if (obj instanceof Document)
			val = xml2string(obj)
		else if (obj instanceof Object)
			val = JSON.stringify(obj)
		var doc = makeDocument(id, null, val)
		saveDocument(configstore, doc, callback)
	}
	this.putStaticContent = putStaticContent

	function putDynamicContent(id, obj, callback, failback) {
		var val = obj
		if (obj instanceof Document)
			val = xml2string(obj)
		else if (obj instanceof Object)
			val = JSON.stringify(obj)
		var doc = makeDocument(id, null, val)
		saveDocument(messagestore, doc, callback)
	}
	this.putDynamicContent = putDynamicContent

	function deleteDynamicContent(id, callback, failback) {
		messagestore.remove(id, function(o) {
			addRemovedDocument(messagestore, id, callback)
		})
	}
	this.deleteDynamicContent = deleteDynamicContent

	/***************************************************************************
	 * Syncing
	 **************************************************************************/

	function resetSync(store, callback) {
		store.remove('__sync', function() {
			store.save({
				key : '__sync',
				lastseq : 0
			}, callback)
		})
	}

	function syncDocument(store, callback, failback, doctype) {
		store.get('__sync', function(obj) {
			handleSync(store, obj, doctype, callback, failback)
		})
	}

	function handleSync(store, syncdata, doctype, callback, failback) {
		var docsToGet
		var getIndex = 0

		var editIndex = 0
		var deleteIndex = 0
		var docsToPush
		var changes
		var result = {
			get : 0,
			put : 0,
			deleted : 0
		}

		var lastseqid = syncdata == null ? 0 : syncdata.lastseq || 0
		if (doctype == "meta" || FORCE_SYNC == true) {
			// Get changed objects
			$.ajax({
				url : AppConstants.URL.COUCHDB
						+ '_changes?filter=hl7store/objecttype&objecttype='
						+ doctype + '&since=' + lastseqid + "&userid="
						+ store.userid,
				type : "GET",
				data : "",
				contentType : "application/json",
				dataType : "json",
				success : AjaxCallback,
				cache : false,
				error : AjaxFailed
			});
		} else {
			docsToGet = [];
			getChangedDocuments(store, changedocCallback)
		}
		// Now get changed document array
		function AjaxCallback(data) {
			this.FORCE_SYNC = false;
			docsToGet = data.results
			getChangedDocuments(store, changedocCallback)
		}
		// Now the docs
		function changedocCallback(changeObj) {
			docsToPush = changeObj
			processGetDocument()
		}

		function AjaxFailed(result) {
			this.FORCE_SYNC = false;
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(eval(result.responseText));
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}

		function processGetSuccess(doc) {
			getIndex++
			store.save({
				key : '__sync',
				lastseq : docsToGet[getIndex - 1].seq
			}, function(obj) {
				processGetDocument()
			})
		}
		function processGetFail(doc) {
			failback(doc)
		}

		function processGetDocument() {
			var PULL = 1
			var DELETE = 2
			var IGNORE = 0
			var PUSH = 3

			if (getIndex < docsToGet.length) {
				store
						.get(
								docsToGet[getIndex].id,
								function(doc) {

									var togetRev = docsToGet[getIndex].changes[0].rev;
									// If not local
									if (doc == null) {
										// AND if not deleted on server
										if (docsToGet[getIndex].deleted == null) {
											// AND busy deleting locally
											if (docsToPush[docsToGet[getIndex].id] == DELETED_FROM_STORE) {
												ops = DELETE
												// AND not busy deleting locally
											} else {
												ops = PULL
											}
											// AND if deleted on the server
										} else {
											// AND if busy deleting locally
											if (docsToPush[docsToGet[getIndex].id] == DELETED_FROM_STORE) {
												ops = DELETE
												// AND NOT busy deleting locally
											} else {
												ops = IGNORE
											}
										}

									} else {
										// if NOT deleted remotely
										if (docsToGet[getIndex].deleted == null) {
											// if revision changed
											if (togetRev != doc.rev) {
												// if doc not edited locally,
												// then PULL
												if (docsToPush[doc.key] == null) {
													ops = PULL
													// if edited locally
												} else if (docsToPush[doc.key] == EDITED_IN_STORE) {
													ops = PUSH
												}
												// revision did not change
											} else {
												ops = IGNORE
											}
											// if deleted remotely
										} else {
											// if doc not edited locally, then
											// DELETE
											if (docsToPush[doc.key] == null) {
												ops = DELETE
												// if edited locally - push,
												// don't want to loose data
											} else if (docsToPush[doc.key] == EDITED_IN_STORE) {
												ops = PUSH
											}
										}
									}

									key = docsToGet[getIndex].id
									if (ops == PULL) {
										delete docsToPush[key]
										getDocument(docsToGet[getIndex].id,
												processGetSuccess,
												processGetFail, store)
										result.get++
									} else if (ops == PUSH) {
										docsToPush[key] = EDITED_IN_STORE
										processGetSuccess()
									} else if (ops == DELETE) {
										docsToPush[key] = DELETED_FROM_STORE
										processGetSuccess()
									} else if (ops == IGNORE) {
										processGetSuccess()
									}
								})
			} else {
				changes = convertChangeObjToChangeArr(docsToPush)
				processEditDocument()
			}
		}

		function processEditSuccess(doc) {
			editIndex++
			processEditDocument()
		}
		function processEditFail(doc) {
			failback(doc)
		}

		function processEditDocument() {
			if (editIndex < changes.edits.length) {
				id = changes.edits[editIndex]
				store.get(id, function(doc) {
					putDocument(doc, processEditSuccess, processEditFail,
							store, doctype)
					result.put++
				})
			} else {
				processDeleteDocument()
			}
		}

		function processDeleteSuccess(doc) {
			deleteIndex++
			processDeleteDocument()
		}
		function processDeleteFail(doc) {
			failback(doc)
		}

		function processDeleteDocument() {
			if (deleteIndex < changes.deletes.length) {
				id = changes.deletes[deleteIndex]
				store.get(id, function(doc) {
					if (doc != null) {
						deleteDocument(doc, processDeleteSuccess,
								processDeleteFail, store, doctype)
					} else {
						deleteDocument(makeDocument(id, null, ""),
								processDeleteSuccess, processDeleteFail, store,
								doctype)
					}
					result.deleted++

				})
			} else {
				callback(result)
			}
		}

	}

	function resetMetaSync(callback) {
		resetSync(configstore, callback)
	}
	this.resetMetaSync = resetMetaSync

	function syncMeta(callback, failback) {
		syncDocument(configstore, callback, failback, "meta")
	}
	this.syncMeta = syncMeta

	function resetMessageSync(callback) {
		resetSync(messagestore, callback)
	}
	this.resetMessageSync = resetMessageSync

	function syncMessage(callback, failback) {
		syncDocument(messagestore, callback, failback, "smo")
	}
	this.syncMessage = syncMessage

	/***************************************************************************
	 * Meta functions
	 **************************************************************************/

	function ConfigClass(xmlelement) {
		var xml = xmlelement
		function getChildClass(className) {
			var r = evaluateXPath(xml, 'Class[@tagName="' + className + '"]')
			var result
			if (r.length == 1) {
				result = new ConfigClass(r[0]);
			} else {
				result = null
			}
			return result
		}
		this.getChildClass = getChildClass

		function getField(fieldName) {
			var r = evaluateXPath(xml, 'Field[@tagName="' + fieldName + '"]')
			var result = new Array()
			for ( var i = 0; i < r.length; i++) {
				result.push(new ConfigField(r[0]));
			}
			return result
		}
		this.getField = getField

		function getProperty(propertyName, defaultValue) {
			if (propertyExists(propertyName)) {
				return xml.getAttribute(propertyName).toString()
			} else {
				return defaultValue
			}
		}
		this.getProperty = getProperty

		function getClassName() {
			return xml.getAttribute('tagName')
		}
		this.getClassName = getClassName

		function getNodeNames(expression) {
			var r = evaluateXPath(xml, expression)
			var resultarr = new Array();
			for ( var i in r)
				resultarr.push(r[i].nodeValue)
			return resultarr;

		}
		this.getNodeNames = getNodeNames

		function getFieldNames() {
			var fieldNames = getNodeNames("Field/@tagName");
			var u = {}
			var result = new Array()
			for ( var i in fieldNames) {
				if (u[fieldNames[i]] == null) {
					u[fieldNames[i]] = 1
					result.push(fieldNames[i])
				}
			}
			return result
		}
		this.getFieldNames = getFieldNames

		function getChildClassNames() {
			return getNodeNames("Class/@tagName");
		}
		this.getChildClassNames = getChildClassNames

		function getPropertyNames() {
			var r = evaluateXPath(xml, "@*")
			var resultarr = new Array();
			for ( var i in r)
				resultarr.push(r[i].nodeName)
			return resultarr;
		}
		this.getPropertyNames = getPropertyNames

		function nodeExists(nodename, nodeArr) {
			var found = false
			for ( var i = 0; i < nodeArr.length; i++) {
				if (nodeArr[i] == nodename) {
					found = true
					break
				}
			}
			return found
		}

		function propertyExists(propname) {
			var props = getPropertyNames()
			return nodeExists(propname, props)
		}
		this.propertyExists = propertyExists

		function childClassExists(classname) {
			var classes = getChildClassNames()
			return nodeExists(classname, classes)
		}
		this.childClassExists = childClassExists

	}

	function ConfigField(xmlelement) {
		var xml = xmlelement

		function getProperty(propertyName) {
			return xml.getAttribute(propertyName).toString()
		}
		this.getProperty = getProperty

		function getFieldName() {
			return xml.getAttribute('tagName')
		}
		this.getFieldName = getFieldName
	}

	function ConfigDocument(xmldef) {
		var xml = xmldef

		function getChildClass(className) {
			var r = evaluateXPath(xml,
					'/HL7MessageConfiguration/Class[@tagName="' + className
							+ '"]')
			var result
			if (r.length == 1) {
				result = new ConfigClass(r[0]);
			} else {
				result = null
			}
			return result

		}
		this.getChildClass = getChildClass

		function getArtifactId() {
			var r = evaluateXPath(xml, '/HL7MessageConfiguration/MetaInfo')
			return r[0].getAttribute('artifactID').toString()
		}
		this.getArtifactId = getArtifactId

		function createMessage(id, xml) {
			return new SMOMessage(this, id, xml);
		}
		this.createMessage = createMessage

		function getXML() {
			return xml
		}
		this.getXML = getXML
	}
	this.ConfigDocument = ConfigDocument

	/***************************************************************************
	 * SMO Message functions
	 **************************************************************************/

	function SMOMessage(documentconfig, messageid, xml) {
		var config = documentconfig
		var id = messageid || guidGenerator()
		var doc = xml

		// setId(messageid)

		function clearMessage() {
			doc = document.implementation.createDocument(null, "message", null);
			doc.childNodes[0].setAttribute('config', config.getArtifactId())
			save()
		}
		this.clearMessage = clearMessage

		if (doc == null) {
			clearMessage()
		}

		function load(xml) {
			doc = xml
		}
		// this.load = load

		function createObject(configClassName) {
			var result
			var cl = config.getChildClass(configClassName)
			if (cl != null) {
				elt = doc.createElement(configClassName);

				doc.childNodes[0].appendChild(elt);
				result = new SMOObject(cl, elt, save);
				save()
				result.populateObject()
			} else {
				result = null;
			}
			return result;
		}
		this.createObject = createObject

		function findObject(expression) {
			var r = evaluateXPath(doc, "/message/" + expression)
			var resultarr = new Array();
			for ( var i in r) {
				var elt = r[i]
				var cl = config.getChildClass(elt.tagName)
				if (cl != null)
					resultarr.push(new SMOObject(cl, elt, save))
			}
			return resultarr;
			return root.findObject(expression)
		}
		this.findObject = findObject

		function validateMessage() {
			var result = true;
			var l = findObject("*");
			for ( var i = 0; i < l.length; i++) {
				var obj = l[i]
				result &= obj.validate();
			}

			return result;
		}
		this.validateMessage = validateMessage

		function getXML() {
			return doc
		}
		this.getXML = getXML

		function getConfig() {
			return config
		}
		this.getConfig = getConfig

		function getId() {
			return id
		}
		this.getId = getId

		function setId(messageid) {
			id = messageid
			save()
		}
		this.setId = setId

		function save() {
			saveDocument(messagestore, makeDocument(getId(), null,
					xml2string(getXML())))
		}

	}
	this.SMOMessage = SMOMessage

	function SMOObject(configClass, xmlelement, messageSave) {
		var xml = xmlelement
		var config = configClass
		var save = messageSave

		function createObject(className) {
			var result;
			if (isValid(className)) {
				var cl = config.getChildClass(className);

				if (cl != null) {
					var elt = xml.ownerDocument.createElement(className);
					xml.appendChild(elt);
					result = new SMOObject(cl, elt, save);
					save();
					result.populateObject();
				} else {
					result = null;
				}

			} else {
				result = null
			}
			return result
		}
		this.createObject = createObject

		function populateObject() {
			var r = config.getChildClassNames()
			for ( var i = 0; i < r.length; i++) {
				var cc = config.getChildClass(r[i]);
				var minOccurs = cc.getProperty("minOccurs", 0)
				if (minOccurs >= 1) {
					var objArr = findObject(r[i])
					for ( var j = objArr.length; j < minOccurs; j++) {
						createObject(r[i])
					}
				}
			}
		}
		this.populateObject = populateObject

		function findObject(expression) {
			var r = evaluateXPath(xml, expression)
			var resultarr = new Array();
			for ( var i in r) {
				var elt = r[i]
				var cl = config.getChildClass(elt.tagName)
				if (cl != null)
					resultarr.push(new SMOObject(cl, elt, save))
			}
			return resultarr;

		}
		this.findObject = findObject

		function removeObject(childObject) {
			xml.removeChild(childObject.getXML())
		}
		this.removeObject = removeObject

		function isValid(name) {
			var field = config.getField(name);
			var clas = config.getChildClass(name);
			return field.length != 0 || clas != null;
		}

		function getValue(fieldName) {
			var result;
			/*
			 * if (!isValid(fieldName) && ){ result = null } else {
			 */
			var r = evaluateXPath(xml, fieldName)
			var result = new Array();
			for ( var i in r) {
				var text = r[i].textContent

				if (r[i].firstChild != null) {
					if (r[i].firstChild.nodeType == r[i].ELEMENT_NODE) {
						text = new SMOValue(r[i], messageSave)
					}
				}
				result.push(text)
			}
			// }
			return result;
		}
		this.getValue = getValue

		function putValue(fieldName, value) {
			var storedText
			if (typeof (value) == "object") {
				var attrElement = xml.ownerDocument.importNode(value.getXML(),
						true);
				// var doc =
				// parseXml("<"+fieldName+">"+json2xml(value)+"</"+fieldName+">")
				// attrElement = doc.firstChild
			} else {
				storedText = value
				var attrElement = xml.ownerDocument.createElement(fieldName)
				var text = xml.ownerDocument.createTextNode(storedText)
				attrElement.appendChild(text)
			}
			xml.appendChild(attrElement)
			save()
		}

		function setValue(fieldName, value) {
			var result
			if (isValid(fieldName)) {
				clearValue(fieldName)

				if (value instanceof Array) {
					for ( var i in value) {
						putValue(fieldName, value[i])
					}
				} else {
					putValue(fieldName, value)
				}

				result = true
			} else {
				result = false
			}
			return result
		}
		this.setValue = setValue

		function getXML() {
			return xml
		}
		this.getXML = getXML

		function getNewValue(fieldName) {
			var e = xml.ownerDocument.createElement(fieldName)
			xml.appendChild(e)
			return new SMOValue(e, messageSave)
		}
		this.getNewValue = getNewValue

		function clearValue(fieldName) {
			var r = evaluateXPath(xml, fieldName)
			for ( var i in r) {
				xml.removeChild(r[i])
			}
		}
		this.clearValue = clearValue

		function validate() {
			var result = true;
			var l = evaluateXPath(xml, "*")
			for ( var i = 0; i < l.length; i++) {
				if (!isValid(l[i].tagName)) {
					result = false;
					break;
				}
			}
			// check child class cardinality
			if (result) {
				var cln = config.getChildClassNames()
				for ( var i = 0; i < cln.length; i++) {
					var cl = config.getChildClass(cln[i])
					var minOccurs = cl.getProperty("minOccurs", 0)
					var maxOccurs = cl.getProperty("maxOccurs", -1)
					var objArr = findObject(cln[i])
					result = (objArr.length >= minOccurs)
					if (maxOccurs >= 0) {
						result &= (objArr.length <= maxOccurs)
					}
					if (!result) {
						break
					}
				}
			}
			// check field cardinality
			if (result) {
				var fn = config.getFieldNames()
				for ( var i = 0; i < fn.length; i++) {
					var fd = config.getField(fn[i])
					if (fd.length == 1) {
						var minOccurs = fd[0].getProperty("minOccurs", 0)
						var maxOccurs = fd[0].getProperty("maxOccurs", -1)
						var value = getValue(fn[i])
						if (value instanceof Array) {
							result = value.length >= minOccurs
							if (maxOccurs >= 0) {
								result &= (value.length <= maxOccurs)
							}
						} else {
							result = minOccurs <= 1
						}
						if (!result) {
							break
						}
					}
				}
			}

			if (result) {
				var l = findObject("*");
				for ( var i = 0; i < l.length; i++) {
					result = l[i].validate();
					if (!result)
						break;
				}
			}
			return result;
		}
		this.validate = validate

	}

	function SMOValue(xmlelement, messageSave) {
		var xml = xmlelement
		var save = messageSave

		function setValue(fieldName, fieldValue) {
			nl = evaluateXPath(xml, fieldName)
			for ( var i in nl) {
				xml.removeChild(nl[i]);
			}
			if (!(fieldValue instanceof Array)) {
				fieldValue = [ fieldValue ]
			}
			for ( var i in fieldValue) {
				var e = xml.ownerDocument.createElement(fieldName)
				e.textContent = fieldValue[i]
				xml.appendChild(e)
			}
			save();
		}
		this.setValue = setValue

		function getValue(fieldName) {
			var r = evaluateXPath(xml, fieldName)
			var resultarr = new Array();
			for ( var i in r) {
				resultarr.push(r[i].textContent)
			}
			return resultarr
		}
		this.getValue = getValue

		function createChild(childName) {
			e = xml.ownerDocument.createElement(childName);
			xml.appendChild(e);
			return new SMOValue(e, messageSave);
		}
		this.createChild = createChild

		function getChild(childName) {
			var r = evaluateXPath(xml, childName)
			var resultarr = new Array();
			for ( var i in r) {
				var elt = r[i]
				resultarr.push(new SMOValue(elt, messageSave))
			}
			return resultarr;

		}
		this.getChild = getChild

		function addChild(value) {
			dup = xml.ownerDocument.importNode(value.getXML(), true);
			xml.appendChild(dup);
			save();
		}
		this.addChild = addChild

		function removeChild(value) {
			xml.removeChild(value.getXML());
			save();
		}
		this.removeChild = removeChild

		function getXML() {
			return xml
		}
		this.getXML = getXML

		function getName() {
			return xml.nodeName
		}
	}

	/**
	 * ***************************************************************Customized
	 * methods*******************************************************************************************
	 */

	function getLocalStorageMessage() {
		var localStorageMessage = new Array();
		getChangedDocuments(messagestore, function(changeObj) {
			var docs = changeObj;

			$.each(changeObj, function(key, value) {
				if (key.indexOf("key") == -1) {
					var messageId = key;

					messagestore.get(messageId,
							function(doc) {
								var params = doc.params;
								if (params) {
									params = JSON.stringify(doc.params);
								}

								localStorageMessage.push([ "Message Id: ",
										messageId, "Content: ", doc.content,
										"Status: ", params ]);
								// alert("messageId: " + messageId + "Content :
								// " + doc.content + " finished :" + params);

							});

				}
			});
		});
		return localStorageMessage;
	}
	this.getLocalStorageMessage = getLocalStorageMessage;

	function getMessageFromServer(messageid, callback, failback, store) {
		var URL = AppConstants.URL.WORKFLOW_URL + messageid+"&organizationId=HINORG";
		$.ajax({
			url : URL,
			type : "GET",
			data : "",
			contentType : "Application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});
		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}
		function AjaxCallback(result) {
			var dom = parseXml(result);
			var value = XmlUtil.getXPathResult(dom,
					"//id[root='HIN_MSG_ID']/extension",
					XPathResult.STRING_TYPE);
			value = (value && value.stringValue) ? value.stringValue : "";
			var doc = makeDocument(value, "", result)
			doc.type = 'message';
			doc.saved = false;
			if (!isProcess(doc) && isCompleted(doc)) {
				staticstore.save(doc, function() {
				})
			} else {
				if (store)
					store.save(doc)
			}
			callback(doc)
		}
	}
	function getProcessFromServer(processId, callback, failback, store) {
		$.getJSON("/hin-web/rest/getprocessDefinitionForProcessId", {
			processId : processId
		}, function(result) {
			var doc = makeDocument(processId, null, result);
			saveDocument(messagestore, doc, callback);
		});
		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}

	}
	function __getMessageForUrl(url, callback, failback, store) {
		var URL = AppConstants.URL.SERVER_CONTEXT + url;
		// alert(URL);
		$.ajax({
			url : URL,
			type : "GET",
			data : "",
			contentType : "text/plain",
			dataType : "text",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});
		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}
		function AjaxCallback(result) {
			var dom = parseXml(result);
			var value = XmlUtil.getXPathResult(dom,
					"//id[root='HIN_MSG_ID']/extension",
					XPathResult.STRING_TYPE);
			value = (value && value.stringValue) ? value.stringValue : "";
			var doc = makeDocument(value, "", result)

			// var doc = makeDocument(messageid, "", result)
			doc.type = 'message';
			doc.saved = false;
			if (!isProcess(doc) && isCompleted(doc)) {
				staticstore.save(doc, function() {
				})
			} else {
				if (store)
					store.save(doc)
			}
			callback(doc)
		}
	}

	function getMessageForUrl(url, documentid, callback, failback, useCache) {
		// FIXME: only for temporary turn off local storage
		useCache = false;
		var xml
		if (useCache) {
			messagestore.get(url, function(r) {
				if (r == null) {
					__getMessageForUrl(url, messagecallback, failback,
							messagestore)
				} else {
					messagecallback(r)
				}
			})
		} else {

			__getMessageForUrl(url, messagecallback, failback)
		}

		function messagecallback(doc) {
			xml = parseXml(doc.content)
			var configid = xml.childNodes[0].getAttribute('config')
			getConfigDocument(configid, configcallback, failback, useCache)

		}

		function configcallback(configdoc) {
			var msg = configdoc.createMessage(documentid, xml)
			callback(msg)
		}
	}
	this.getMessageForUrl = getMessageForUrl;

	function getBareDocument(docid, callback, failback, store) {

		/* url: '../../'+docid, */
		// var url = AppConstants.URL.COUCHDB +
		// "_design/hl7store/_show/xmlmessage/" +docid;
		var url = AppConstants.URL.COUCHDB
				+ "_design/hl7store/_show/xmlmessage/" + docid;
		$.ajax({
			url : url,
			type : "GET",
			data : "",
			contentType : "application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				failback("FAILED : " + result.status + ' ' + result.statusText);
			}
		}
		function AjaxCallback(result) {
			var doc = makeDocument(docid, 0, result)
			if (!isProcess(doc) && isCompleted(doc)) {
				staticstore.save(doc, function() {
				})
			} else {
				if (store)
					store.save(doc)
			}
			// setTimeout(function(){ callback(doc) }, 10000)
			callback(doc)
		}
	}

	function getStaticDocument(documentid, callback, failback, useCache) {
		if (useCache) {
			configstore.get(documentid, function(r) {
				if (r == null) {
					getBareDocument(documentid, internalcb, internalfail,
							configstore)
				} else {
					internalcb(r)
				}
			})
		} else {
			getBareDocument(documentid, internalcb, internalfail, configstore)

		}

		function internalcb(doc) {
			callback(doc.content)
		}
		function internalfail(data) {
			failback(data)
		}

	}
	this.getStaticDocument = getStaticDocument

	function getMessageDocument(documentid, callback, failback, useCache) {
		if (useCache) {
			messagestore.get(documentid, function(r) {
				if (r == null) {
					getBareDocument(documentid, internalcb, internalfail,
							configstore)
				} else {
					internalcb(r)
				}
			})
		} else {
			getBareDocument(documentid, internalcb, internalfail, configstore)

		}

		function internalcb(doc) {
			callback(doc)
		}
		function internalfail(data) {
			failback(data)
		}

	}
	this.getMessageDocument = getMessageDocument

	function saveDoc(doc, callback) {
		/*
		 * doc.params = { finish : true };
		 */
		var store = messagestore;
		/*
		 * store.save(doc, function() { if (callback) callback(doc); })
		 */

		saveDocument(store, doc, callback);
	}
	this.saveDoc = saveDoc;

	function deleteDoc(doc, callback, failback) {
		var store = messagestore;
		var objecttype = "smo";
		deleteDocument(doc, callback, failback, store, objecttype);

	}
	this.deleteDoc = deleteDoc;

	function deleteMsg(msg, callback, failback) {
		deleteMessage(msg, callback, failback)

	}
	this.deleteMsg = deleteMsg;

	function saveLookUpData(key, doc, callback) {
		makeDocument(key, 0, doc);
		doc.key = key;
		lookupstore.save(doc, function() {
			if (callback)
				callback(doc);
		})
	}
	this.saveLookUpData = saveLookUpData;

	function removeLookUpData(key, callback) {
		var store = lookupstore;
		store.remove(key, function(o) {
			if (callback)
				callback(o);
		})
	}
	this.removeLookUpData = removeLookUpData;

	function getLookUpData(lookupKey, callback) {
		lookupstore.get(lookupKey, function(lookupData) {
			if (callback)
				// lookupData.key=null;
				if (lookupData) {
					delete lookupData.key;
					callback(lookupData);
				} else {
					callback(lookupData);
				}
		});
	}
	this.getLookUpData = getLookUpData;

	function doForceSync(callback, failback) {
		FORCE_SYNC = true;
		syncMessage(callback, failback);
	}
	this.doForceSync = doForceSync;
	/**
	 * ***********************************************************End Customized
	 * methods*******************************************************************************************
	 */

	/***************************************************************************
	 * Retrieve the all process definition from local storage.
	 * 
	 */

	this.getProcessDefinition = getProcessDefinition;
	function getProcessDefinition() {
		var localProcessDefinition = new Array();
		messagestore.each(function(data) {
			if (data.key.indexOf("Process_") > -1) {
				if (data.key.indexOf("Process_Index") <= 0) {
					localProcessDefinition.push(data);
				}
			}
		});
		return localProcessDefinition;
	}
	/* method to retrive all configuration messages */
	function getStaticMessages() {
		var staticMessages = new Array();
		configstore.each(function(data) {
			var config = true;
			var key = data.key;
			if (key.indexOf("JS_") > -1 || key.indexOf("FS_") > -1
					|| key.indexOf("FM_") > -1 || key.indexOf("__sync") > -1) {
				config = false;
			}
			if (config) {
				staticMessages.push({
					key : key,
					value : data.content
				});
			}
		});
		return staticMessages;
	}
	this.getStaticMessages = getStaticMessages;

	function isProcess(doc) {
		if (doc) {
			if (doc.key.indexOf("Process") > -1) {
				return true;
			}
			return false;
		}
		return null;
	}
	this.isProcess = isProcess;

	function isCompleted(doc) {
		var key = doc.key;
		if (!(key.indexOf("JS_") > -1) && !(key.indexOf("FS_") > -1)
				&& !(key.indexOf("FM_") > -1)) {
			try {
				var xml = parseXml(doc.content);
				var configid = xml.childNodes[0].getAttribute('config')
			} catch (error) {
				alert("hl7 adapter error" + doc.key);
			}
			var messageStatus = XmlUtil.getXPathResult(xml, "//" + configid
					+ "/id[root='MESSAGE_STATUS']/extension",
					XPathResult.STRING_TYPE);
			var status = messageStatus.stringValue;		
			if (status == AppConstants.MessageStatus.FINISHED) {
				return true;
			}
			return false;
		}
		return false;
	}
	this.isCompleted = isCompleted;

	function getStaticMessage(documentid, callback, failback) {
		var xml = null;		
			staticstore.get(documentid, function(r) {
				if (r != null) {
					staticmessagecallback(r)
				}
			})		

		function staticmessagecallback(doc) {
			xml = parseXml(doc.content)
			// alert("Message xml : " + XmlUtil.xmlToString(xml));
			var configid = xml.childNodes[0].getAttribute('config')
			getConfigDocument(configid, configcallback, failback, useCache)

		}

		function configcallback(configdoc) {
			var msg = configdoc.createMessage(documentid, xml)
			callback(msg)
		}

	}
	this.getStaticMessage = getStaticMessage

	/* method to retrive all getStaticStorageMessages */
	function getStaticStorageMessages() {
		var staticStorageMessages = new Array();
		staticstore.each(function(data) {
			var staticStore = true;
			var key = data.key;
			if (key.indexOf("JS_") > -1 || key.indexOf("FS_") > -1
					|| key.indexOf("FM_") > -1 || key.indexOf("__sync") > -1) {
				staticStore = false;
			}
			if (staticStore) {
				staticStorageMessages.push({
					key : key,
					value : data.content
				});
			}
		});
		return staticStorageMessages;
	}
	this.getStaticStorageMessages = getStaticStorageMessages;
}
var HL = null;// new hl7adapter("")*/

