/**
 * Class EditorXmlApi - Factory class for generatign Xml out of the editors
 * 
 * @returns EditorXmlApi
 * @author Administrator
 */
function EditorXmlApi() {

	var editorXmlApi = this;
	
	//============= CREATE XML NODE ======================//

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: II
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getIIXml = function(nodeName, fieldObject) {
		var nullFlavor = null;
		var root = null;
		var extension = null;
		var assigningAuthorityName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 4) {
			nullFlavor = fieldObject[3];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("root");
			xmlNode.removeAttribute("extension");
			xmlNode.removeAttribute("assigningAuthorityName");
		} else {
			root = fieldObject[0];
			extension = fieldObject[1];
			assigningAuthorityName = fieldObject[2];

			xmlNode.removeAttribute("nullFlavor");

			if (root) {
				XmlUtil.attr(xmlNode, "root", root);
			} else {
				xmlNode.removeAttribute("root");
			}
			if (extension) {
				XmlUtil.attr(xmlNode, "extension", extension);
			} else {
				xmlNode.removeAttribute("extension");
			}
			if (assigningAuthorityName) {
				XmlUtil.attr(xmlNode, "assigningAuthorityName",
						assigningAuthorityName);
			} else {
				xmlNode.removeAttribute("assigningAuthorityName");
			}
		}
		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: PN
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getPNXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var prefix = null;
		var family = null;
		var given = null;
		var suffix = null;
		var use = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];
			given = fieldObject[2];
			family = fieldObject[3];
			suffix = fieldObject[4];

			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (prefix) {
				var node = XmlUtil.createNewElement(xmlNode, "prefix");
				XmlUtil.text(node, prefix);
				xmlNode.appendChild(node);
			}
			if (given) {
				var node = XmlUtil.createNewElement(xmlNode, "given");
				XmlUtil.text(node, given);
				xmlNode.appendChild(node);
			}
			if (family) {
				var node = XmlUtil.createNewElement(xmlNode, "family");
				XmlUtil.text(node, family);
				xmlNode.appendChild(node);
			}
			if (suffix) {
				var node = XmlUtil.createNewElement(xmlNode, "suffix");
				XmlUtil.text(node, suffix);
				xmlNode.appendChild(node);
			}

		}

		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ON
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getONXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var prefix = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			use    = fieldObject[0];
			prefix = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (prefix) {
				var node = XmlUtil.createNewElement(xmlNode, "prefix");
				XmlUtil.text(node, prefix);
				xmlNode.appendChild(node);
			}
		}
		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ST
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getSTXml = function (nodeName, fieldObject){
		var nullFlavor = null;
		var jobTitle   = null;
		
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];
		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		}else{
			jobTitle = fieldObject[0];
			if (jobTitle) {
				XmlUtil.text(xmlNode, jobTitle);
			}
		}
		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: MO
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getMOXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			if (fieldObject[0] != null) {
				value = fieldObject[0];
			} else {
				value = fieldObject[1];
			}
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}

		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCSXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			code = fieldObject[0];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: TEL
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getTELXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var value = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			xmlNode.removeAttribute("value");
		} else {
			use = fieldObject[0];
			value = fieldObject[1];
			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: AD
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */  
	this.getADXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var country = null;
		var state = null;
		var city = null;
		var houseNumber = null;
		var streetName = null;
		var postalCode = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			houseNumber = fieldObject[0];
			streetName = fieldObject[1];
			city = fieldObject[2];
			state = fieldObject[3];
			country = fieldObject[4];
			postalCode = fieldObject[5];
	
			xmlNode.removeAttribute("nullFlavor");
			if (houseNumber) {
				var node = XmlUtil.createNewElement(xmlNode, "houseNumber");
				XmlUtil.text(node, houseNumber);
				xmlNode.appendChild(node);
			}
			if (streetName) {
				var node = XmlUtil.createNewElement(xmlNode, "streetName");
				XmlUtil.text(node, streetName);
				xmlNode.appendChild(node);
			}
			if (city) {
				var node = XmlUtil.createNewElement(xmlNode, "city");
				XmlUtil.text(node, city);
				xmlNode.appendChild(node);
			}
			if (state) {
				var node = XmlUtil.createNewElement(xmlNode, "state");
				XmlUtil.text(node, state);
				xmlNode.appendChild(node);
			}
			if (country) {
				var node = XmlUtil.createNewElement(xmlNode, "country");
				XmlUtil.text(node, country);
				xmlNode.appendChild(node);
			}
			if (postalCode) {
				var node = XmlUtil.createNewElement(xmlNode, "postalCode");
				XmlUtil.text(node, postalCode);
				xmlNode.appendChild(node);
			}

		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CE
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCEXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;
		var originalText = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[2];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
			xmlNode.removeAttribute("displayName");
			xmlNode.removeAttribute("originalText");
		} else {
			code = fieldObject[0];
			displayName = fieldObject[1];
			originalText = fieldObject[2];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (displayName) {
				XmlUtil.attr(xmlNode, "displayName", displayName);
			}
			if (originalText) {
				XmlUtil.attr(xmlNode, "originalText", originalText);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CVList
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCVListXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		//var codeSystem = null;
		//var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		/*if (fieldObject && fieldObject.length == 1) {	
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				if (fieldObject[key] && fieldObject[key] !== null) {
					XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
					var originalTextNode = XmlUtil.createNewElement(itemNode,
							"originalText");
					XmlUtil.text(originalTextNode, fieldObject[key]);
					itemNode.appendChild(originalTextNode);
				}
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}

		}*/
		
		if (fieldObject && fieldObject.length == 3) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				if (fieldObject[key] && fieldObject[key] !== null) {
					XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
					var originalTextNode = XmlUtil.createNewElement(itemNode,
							"originalText");
					XmlUtil.text(originalTextNode, fieldObject[key]);
					itemNode.appendChild(originalTextNode);
				}
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}
		}
		
		
		//alert("XmlUtil " +XmlUtil.xmlToString(xmlNode));
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CV
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCVXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		var codeSystem = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			code = fieldObject[0];
			originalText = fieldObject[1];

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (originalText) {
				var originalTextNode = XmlUtil.createNewElement(xmlNode,
						"originalText");
				XmlUtil.text(originalTextNode, originalText);
				xmlNode.appendChild(originalTextNode);
			}
		}

		return xmlNode;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CV
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCVObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		} else {
			fieldObject.push(null);
		}

		var originalText = XmlUtil.findByName(fieldNode, "originalText", true);

		if (XmlUtil.text(originalText)) {
			fieldObject.push(XmlUtil.text(originalText));
		}

		return fieldObject;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CEList
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCEListXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		var codeSystem = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
				var originalTextNode = XmlUtil.createNewElement(itemNode,
						"originalText");
				XmlUtil.text(originalTextNode, fieldObject[key]);
				itemNode.appendChild(originalTextNode);
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}

		}

		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ED
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getEDXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var thumbnail = null;
		var mediaType = null;
		var reference = null;
		var language = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			thumbnail = fieldObject[0];
			mediaType = fieldObject[1];
			reference = fieldObject[2];
			language = fieldObject[3];
			
			if (thumbnail) {
				var node = XmlUtil.createNewElement(xmlNode, "thumbnail");
				XmlUtil.text(node, thumbnail);
				xmlNode.appendChild(node);
			}
			if (mediaType) {
				var node = XmlUtil.createNewElement(xmlNode, "mediaType");
				XmlUtil.text(node, mediaType);
				xmlNode.appendChild(node);
			}
			if (reference) {
				var node = XmlUtil.createNewElement(xmlNode, "reference");
				var valueNode = XmlUtil.createNewElement(xmlNode, "reference");
				XmlUtil.text(valueNode, mediaType);
				node.appendChild(valueNode);
				xmlNode.appendChild(node);
			}
			if(language){
				var node = XmlUtil.createNewElement(xmlNode, "language");
				var valueNode = XmlUtil.createNewElement(xmlNode, "language");
				XmlUtil.text(valueNode, mediaType);
				node.appendChild(valueNode);
				xmlNode.appendChild(node);
			}
		}
		//alert(XmlUtil.xmlToString(xmlNode));
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: TS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getTSXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("value");
		} else {
			value = fieldObject[0];
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: IVL_TS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getIVL_TSXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var low = null;
		var high = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			low = fieldObject[0];
			high = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");

			if (low) {
				var node = XmlUtil.createNewElement(xmlNode, "low");
				XmlUtil.attr(node, "value", low);
				xmlNode.appendChild(node);
			}
			if (high) {
				var node = XmlUtil.createNewElement(xmlNode, "high");
				XmlUtil.attr(node, "value", high);
				xmlNode.appendChild(node);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: PQ
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getPQXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			if (fieldObject[0] != null) {
				value = fieldObject[0];
			} else {
				value = fieldObject[1];
			}
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}

		return xmlNode;
	}

	this.getRTO_PQ_PQXml = function (nodeName, fieldObject){
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			numerator = fieldObject[0];
			denominator = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			if (numerator) {
				var node = XmlUtil.createNewElement(xmlNode, "numerator");
				XmlUtil.attr(node, "value", numerator);
				xmlNode.appendChild(node);
			}
			if (denominator) {
				var node = XmlUtil.createNewElement(xmlNode, "denominator");
				XmlUtil.attr(node, "value", denominator);
				xmlNode.appendChild(node);
			}
		}

		return xmlNode;
	}
	;
	
	this.getRTO_MO_PQXml = function (nodeName, fieldObject){
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;
		//var use = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			//use = fieldObject[0];
			numerator = fieldObject[0];
			denominator = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			/*if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}*/
			if (numerator) {
				var node = XmlUtil.createNewElement(xmlNode, "numerator");
				XmlUtil.attr(node, "value", numerator);
				xmlNode.appendChild(node);
			}
			if (denominator) {
				var node = XmlUtil.createNewElement(xmlNode, "denominator");
				XmlUtil.attr(node, "value", denominator);
				xmlNode.appendChild(node);
			}
		}

		return xmlNode;
	}
	;
	
	// --------------------- GET OBJECT METHODS ------------------------------------------//
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: PQ
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getPQObject = function (fieldNode) { 
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	}

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: II
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getIIObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "root")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "root"));
		}
		if (XmlUtil.attr(fieldNode, "extension")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "extension"));
		}
		if (XmlUtil.attr(fieldNode, "assigningAuthorityName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "assigningAuthorityName"));
		}

		return fieldObject;
	};

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: PN
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getPNObject = function (fieldNode) {
		/*
		 * var fieldObject = [];
		 * 
		 * if(fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
		 * fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor")); } else {
		 * fieldObject.push(null); }
		 * 
		 * if(XmlUtil.text(fieldNode)){
		 * fieldObject.push(XmlUtil.text(fieldNode)); }
		 * 
		 * return fieldObject;
		 */
		var fieldObject = [];
		var prefixNode = XmlUtil.findByName(fieldNode, "prefix", true);
		var familyNode = XmlUtil.findByName(fieldNode, "family", true);
		var givenNode = XmlUtil.findByName(fieldNode, "given", true);
		var suffixNode = XmlUtil.findByName(fieldNode, "suffix", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(prefixNode)) {
			fieldObject.push(XmlUtil.text(prefixNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(familyNode)) {
			fieldObject.push(XmlUtil.text(familyNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(givenNode)) {
			fieldObject.push(XmlUtil.text(givenNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(suffixNode)) {
			fieldObject.push(XmlUtil.text(suffixNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;

	};
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ON
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getONObject = function (fieldNode) {
		/*
		 * var fieldObject = [];
		 * 
		 * if(fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
		 * fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor")); } else {
		 * fieldObject.push(null); }
		 * 
		 * if(XmlUtil.text(fieldNode)){
		 * fieldObject.push(XmlUtil.text(fieldNode)); }
		 * 
		 * return fieldObject;
		 */
		var fieldObject = [];
		var prefixNode = XmlUtil.findByName(fieldNode, "prefix", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(prefixNode)) {
			fieldObject.push(XmlUtil.text(prefixNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;

	};
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ST
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getSTObject = function (fieldNode){
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(fieldNode)) {
			fieldObject.push(XmlUtil.text(fieldNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;
	}
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: MO
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getMOObject = function (fieldNode) { 
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	};
	

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: TS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getTSObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	};

	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCSObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		}

		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: TEL
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getTELObject = function (fieldNode) {

		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));

		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: AD
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */ 
	this.getADObject = function (fieldNode) {
		var fieldObject = [];
		var countryNode = XmlUtil.findByName(fieldNode, "country", true);
		var stateNode = XmlUtil.findByName(fieldNode, "state", true);
		var cityNode = XmlUtil.findByName(fieldNode, "city", true);
		var houseNumberNode = XmlUtil
				.findByName(fieldNode, "houseNumber", true);
		var streetNameNode = XmlUtil.findByName(fieldNode, "streetName", true);
		var postalCodeNode = XmlUtil.findByName(fieldNode, "postalCode", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(houseNumberNode)) {
			fieldObject.push(XmlUtil.text(houseNumberNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(streetNameNode)) {
			fieldObject.push(XmlUtil.text(streetNameNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(cityNode)) {
			fieldObject.push(XmlUtil.text(cityNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(stateNode)) {
			fieldObject.push(XmlUtil.text(stateNode));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.text(countryNode)) {
			fieldObject.push(XmlUtil.text(countryNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(postalCodeNode)) {
			fieldObject.push(XmlUtil.text(postalCodeNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CE
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCEObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.attr(fieldNode, "displayName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "displayName"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CD
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	this.getCDXml = function (nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			displayName = fieldObject[0];
			code = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (displayName) {
				XmlUtil.attr(xmlNode, "displayName", displayName);
			}
		}
		return xmlNode;
	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CD
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCDObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		}
		if (XmlUtil.attr(fieldNode, "displayName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "displayName"));
		}

		return fieldObject;
	};
	


	this.updateNullFlavour = function (xmlNode, fieldObject) {
		var nullSet = false;
		if (fieldObject && fieldObject.length == 1 && typeof (fieldObject[0]) == 'object') {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor.nullFlavor);

			// Remove all attributes
			while (xmlNode.attributes.length > 1) {
				var attnode = xmlNode.attributes[0];
				if (attnode.nodeName === 'nullFlavor' && xmlNode.attributes.length === 1) {
					break;
				}

				if (attnode.nodeName !== 'nullFlavor')
					xmlNode.removeAttributeNode(attnode);
			}

			// Remove all child nodes
			while (xmlNode.childNodes.length > 0) {
				var child = xmlNode.childNodes[0];
				xmlNode.removeChild(child);
			}

			nullSet = true;
		} else {
			xmlNode.removeAttribute("nullFlavor");
		}

		return nullSet;
	}

	this.retrieveNullFlavor = function (fieldNode) {
		var nullFlavor = null;

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			nullFlavor = XmlUtil.attr(fieldNode, "nullFlavor");
		}

		return nullFlavor;
	}

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ED
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getEDObject = function (fieldNode) {
		var fieldObject = [];

		var nullSet = editorXmlApi.retrieveNullFlavor(fieldNode);
		if (nullSet != null) {
			fieldObject.push(nullSet);
			return fieldObject;
		}

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		var thumbnail = XmlUtil.findByName(fieldNode, "thumbnail", true);
		var mediaType = XmlUtil.findByName(fieldNode, "mediaType", true);
		var reference = XmlUtil.findByName(fieldNode, "reference", true);
		var referenceValue = XmlUtil.findByName(reference, "value", true);
		var language = XmlUtil.findByName(fieldNode, "language", true);
		var languageValue = XmlUtil.findByName(language, "value", true);

		if (XmlUtil.text(thumbnail)) {
			fieldObject.push(XmlUtil.text(thumbnail));
		}
		if (XmlUtil.text(mediaType)) {
			fieldObject.push(XmlUtil.text(mediaType));
		}
		if (XmlUtil.text(referenceValue)) {
			fieldObject.push(XmlUtil.text(referenceValue));
		}
		if (XmlUtil.text(languageValue)) {
			fieldObject.push(XmlUtil.text(languageValue));
		}

		return fieldObject;
	};
	
	
	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CVList
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCVListObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		var itemNode = XmlUtil.findByName(fieldNode, "item", false);

		$.each(itemNode, function(key, value) {
			var originalTextNode = XmlUtil.findByName(value, "originalText",
					true);
			if (XmlUtil.text(originalTextNode)) {
				fieldObject.push(XmlUtil.text(originalTextNode));
			} else {
				fieldObject.push(null);
			}

			if (XmlUtil.attr(value, "code")) {
				fieldObject.push(XmlUtil.attr(value, "code"));
			} else {
				fieldObject.push(null);
			}
		});

		return fieldObject;

	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CEList
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getCEListObject = function (fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		var itemNode = XmlUtil.findByName(fieldNode, "item", false);

		$.each(itemNode, function(key, value) {
			var originalTextNode = XmlUtil.findByName(value, "originalText",
					true);
			if (XmlUtil.text(originalTextNode)) {
				fieldObject.push(XmlUtil.text(originalTextNode));
			}
			if (XmlUtil.attr(value, "code")) {
				fieldObject.push(XmlUtil.attr(value, "code"));
			}
		});

		return fieldObject;
	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: IVL_TS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	this.getIVL_TSObject = function (fieldNode) {
		var fieldObject = [];
		var lowNode = XmlUtil.findByName(fieldNode, "low", true);
		var highNode = XmlUtil.findByName(fieldNode, "high", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (lowNode) {
			fieldObject.push(XmlUtil.attr(lowNode, "value"));
		} else {
			fieldObject.push(null);
		}
		if (highNode) {
			fieldObject.push(XmlUtil.attr(highNode, "value"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};

	this.getRTO_PQ_PQObject = function (fieldNode){
		var fieldObject = [];
		var numeratorNode = XmlUtil.findByName(fieldNode, "numerator", true);
		var denominatorNode = XmlUtil.findByName(fieldNode, "denominator", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		
		if (numeratorNode) {
			fieldObject.push(XmlUtil.attr(numeratorNode, "value"));
		} else {
			fieldObject.push(null);
		}
		
		if (denominatorNode) {
			fieldObject.push(XmlUtil.attr(denominatorNode, "value"));
		}else {
			fieldObject.push(null);
		}
		
		return fieldObject;

	}
	;
	

	this.getRTO_MO_PQObject = function (fieldNode){
		var fieldObject = [];
		var numeratorNode = XmlUtil.findByName(fieldNode, "numerator", true);
		var denominatorNode = XmlUtil.findByName(fieldNode, "denominator", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		
		if (numeratorNode) {
			fieldObject.push(XmlUtil.attr(numeratorNode, "value"));
		} else {
			fieldObject.push(null);
		}
		
		if (denominatorNode) {
			fieldObject.push(XmlUtil.attr(denominatorNode, "value"));
		}else {
			fieldObject.push(null);
		}
		
		return fieldObject;

	}
	;

}