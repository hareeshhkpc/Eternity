XmlUtil = {};

/**
 * Sets an attribute value on an XML node xmlNode - The xmlNode object on which
 * the attribute is to be set attrName - The name of attribute to set attrValue -
 * The value to be set the attribute
 */
/*XmlUtil.setAttributeValueInXml = function(xmlNode, attrName, attrValue) {
	$(xmlNode).attr(attrName, attrValue);
	 alert("attribute Value"+attrValue); 
	return xmlNode;
};*/

/* Gets the Attribute values from the XML node */
/*XmlUtil.getAttributeValueFromXml = function(xmlNode, attrName) {
	
	 * alert("attrName:"+attrName); alert("in util:
	 * "+$(xmlNode).attr(attrName));
	 
	return $(xmlNode).attr(attrName);
};*/

/**
 * set value for element Value in XML text- is the content to be added to the
 * element
 */
/*XmlUtil.setElementValueInXml = function(xmlNode, eleName, eleValue) {
	$(xmlNode).find(eleName).text(eleValue);
};*/

/**
 * get the value of the element from the xml eleName: name of the element whose
 * value shd be retrieved
 */
/*XmlUtil.getElementValueFromXml = function(xmlNode, elementName) {
	return $(xmlNode).find(elementName).text();
};
*/
/* find attr by id */
/*
 * XmlUtil.find = function(xmlNode, idAttrName, idValue){ alert("new
 * ele:"+$(xmlNode).find("[" + idAttrName + "=" + idValue + "]")); return
 * $(xmlNode).find("[" + idAttrName + "=" + idValue + "]"); };
 */

/* find element existance */
/*
 * XmlUtil.findElement = function (xmlNode, elementName){
 * //alert("element:"+elementName+"="+$(xmlNode).find(elementName).length);
 * return $(xmlNode).find(elementName); }
 */

/*XmlUtil.addingXmlFragment = function(xmlNode, eleName, xmlToBeAdded) {
	return $(xmlNode).find(eleName).replaceWith(xmlToBeAdded);
};*/

/*XmlUtil.demo = function() {
	alert("in xml util");
};*/

/**
 * Converts the XML node object to String
 * 
 * @param xmlNode -
 *            XML node object which is to be converted to string
 * @return returns the string object
 */
XmlUtil.xmlToString = function(xmlNode) {

	var serialized;

	try {
		// XMLSerializer exists in current Mozilla browsers
		serializer = new XMLSerializer();
		serialized = serializer.serializeToString(xmlNode);
	} catch (e) {
		// Internet Explorer has a different approach to serializing XML
		serialized = xmlNode.xml;
	}

	return serialized;
};



/**
 * Gets or Sets an attribute value on an XML node
 * 
 * @param xmlNode -
 *            The xmlNode object on with the attribute is to be set or read
 *            attrName - The name of attribute to get or set attrValue - value
 *            of the attribute
 */

XmlUtil.attr = function(xmlNode, attrName, attrValue) {
	if (attrName && arguments.length == 3) {
		// alert("xmlNode : "+xmlNode+" setAttribute attrValue :" + attrValue +
		// ", attrName : " + attrName);
		if (xmlNode != null)
			xmlNode.setAttribute(attrName, attrValue);
		// alert("in util : " + XmlUtil.xmlToString(xmlNode));
		return xmlNode;

	} else if (attrName) {
		return (XmlUtil.isDocumentElement(xmlNode)) ? null : xmlNode
				.getAttribute(attrName);
	}
};

/**
 * removes attributes from the xml Fragment 
 * @param  xmlNode- The xmlNode object from which the attribute will be removed
 * 		   attrName- name of the attribute to be removed 
 */
XmlUtil.removeAttr = function(xmlNode, attrName) {
	if (attrName && xmlNode.hasAttribute(attrName)) {
		xmlNode.removeAttribute(attrName);
	}
}

/**
 * Gets or Sets an text value to an XML node
 * 
 * @param xmlNode -
 *            The xmlNode object to which the text is to be set or read text -
 *            text which is to be set
 * @return returns the text of xmlNode if text parameter has no text
 */

XmlUtil.text = function(xmlNode, text) {

	// alert("xmlNode: " +xmlNode);
	if (xmlNode == null || xmlNode.childNodes == null)
		return;

	var childnodes = xmlNode.childNodes;
	// alert("childnodes : " + childnodes);

	if (childnodes.length < 1 && arguments.length == 2) {
		txtNode = xmlNode.ownerDocument.createTextNode(text);
		// txtNode.data = text;
		xmlNode.appendChild(txtNode);
	} else {
		var i = 0;
		var data = null;
		for (i = 0; i < childnodes.length; i++) {

			if (childnodes[i].nodeType == 3) {				
				if (arguments.length == 2) {
					childnodes[i].data = text;
					return;
				} else {
					if(data === null){
						data = childnodes[i].data;
					} else {
						data += childnodes[i].data;
					}
				}
			}
		}
		return data;
	}
};

/**
 * Gets the XML node with specified id from root xmlNode
 * 
 * @param xmlNode -
 *            The root xmlNode object in which XML node has to be found
 *            idAttrName - name of the attribute idValue - value of that
 *            attribute
 * @return returns the XML node object if the root node has required node else
 *         it returns null
 */

XmlUtil.find = function(xmlNode, idAttrName, idValue) {

	// alert("xmlNode: " + XmlUtil.xmlToString(xmlNode));

	/* get the child nodes of the element */
	var childnodes = xmlNode.childNodes;

	// alert("childnodes: " + childnodes + ", len: " + childnodes.length + ",
	// idAttrName: " + idAttrName);

	var i = 0;
	for (i = 0; i < childnodes.length; i++) {
		// alert(childnodes[i].nodeName);

		// alert("Node Type: " + childnodes[i].nodeType);

		/* check the node type. node is element if node type is '1' */
		if (childnodes[i].nodeType == 1) {
			// alert("childnode" + childnodes[i].nodeName);

			/* get the value of the attribute */
			var attributeValue = childnodes[i].getAttribute(idAttrName);

			if (attributeValue != null && attributeValue != ""
					&& attributeValue == idValue) {
				// if(attributeValue == idValue)
				// {
				return childnodes[i];
				// }else{
				// alert("No attr match");
				// }
			} else {
				/* check whether element has child */
				if (childnodes[i].hasChildNodes()) {
					// alert("has child nodes");
					var element = XmlUtil.find(childnodes[i], idAttrName,
							idValue);
					if (element != null) {
						return element;
					}
				} else {
					// alert("no child nodes");
				}
			}
		}
	}
	return null;
};

/**
 * @param :xmlNode -  xmlNode object in which the required element is to be found 
 * 		   elementName -  element to be found 
 * 		   firstMatchingOne :- if true- will return the first matching element 
 * 								 false - will return all the matching elements 
 * 
 * @returns :XML node object for the matching elementName
 */
XmlUtil.findByName = function(xmlNode, elementName, firstMatchingOne) {
	var allFound = null, found = null, filteredBySameParent = null;
	if (xmlNode != null) {
		allFound = xmlNode.getElementsByTagName(elementName);
	}

	// alert("allFound: " + allFound + ", Len: " + allFound.length);

	if (allFound != null) {
		filteredBySameParent = [];
		for (index = 0; index < allFound.length; index++) {
			// alert("index: " + index + ", parent: " +
			// allFound[index].parentNode + ", node: " + xmlNode);
			if (allFound[index].parentNode == xmlNode) {
				// alert("Match");
				filteredBySameParent.push(allFound[index]);
			}
		}
	}

	if (filteredBySameParent != null) {
		// alert("firstMatchingOne: "+ firstMatchingOne);
		found = (arguments.length == 3 && firstMatchingOne == false) ? filteredBySameParent
				: filteredBySameParent[0];
	}
	// alert("Found: " + found);
	return found;
}

/**
 * Gets the XML node with specified id from root xmlNode
 * 
 * @param xmlNode -
 *            The root xmlNode object in which XML node has to be found
 *            elementName - name of the element to be found idAttrName - name of
 *            the attribute idValue - value of the attribute of the element to
 *            be found
 * @return returns the XML node object if the root node has required node else
 *         it returns null
 */

XmlUtil.findElement = function(xmlNode, elementName, idAttrName, idValue) {
	/* get the child nodes of the element */

	var nodesList = xmlNode.getElementsByTagName(elementName);
	// alert(nodesList.length);

	var i = 0;
	for (i = 0; i < nodesList.length; i++) {
		// alert(nodesList[i].nodeName);

		/* check the node type. node is element if node type is '1' */
		if (nodesList[i].nodeType == 1) {
			// alert("childnode" + nodesList[i].nodeName);

			/* get the value of the attribute */
			var attributeValue = nodesList[i].getAttribute(idAttrName);

			if (attributeValue != null && attributeValue != "") {
				if (attributeValue == idValue) {
					return nodesList[i];
				}
			}
		}
	}
	return null;
};

/**
 * Replaces the existing XML node with new XML node
 * 
 * @param xmlNode -
 *            existing XML node object newXmlNode - new XML node object
 */

XmlUtil.replace = function(newXmlNode, xmlNode) {

	xmlNode.parentNode.replaceChild(newXmlNode, xmlNode);

};

/**
 * Converts the XML node object to String
 * 
 * @param xmlNode -
 *            XML node object which is to be converted to string
 * @return returns the string object
 */

/*XmlUtil.xmlToString = function(xmlNode) {

	var serialized;

	try {
		// XMLSerializer exists in current Mozilla browsers
		serializer = new XMLSerializer();
		serialized = serializer.serializeToString(xmlNode);
	} catch (e) {
		// Internet Explorer has a different approach to serializing XML
		serialized = xmlNode.xml;
	}

	return serialized;
};*/

/**
 * Converts the string XML data to XML node object
 * 
 * @param xmlData -
 *            XML string data which is to be converted to XML node object
 * @return returns the XML node object
 */

XmlUtil.stringToXml = function(xmlData) {
	if (window.ActiveXObject) {
		// for IE
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xmlData);
		messageDOM = xmlDoc;
	} else if (document.implementation
			&& document.implementation.createDocument) {
		// for Mozilla
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlData, "text/xml");
		messageDOM = xmlDoc;
	}

	return messageDOM;
};

/**
 * Loads the XML file
 * 
 * @param xmlData -
 *            file name which is to be loaded
 * @return returns the XML DOM Object
 */

XmlUtil.loadXml = function(xmlData) {

	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", xmlData, false);
	xhttp.send();
	return xhttp.responseXML;
};

/**
 * creating an element 
 * 
 * @param :-
 * xmlNode -  XML node object 
 * elementName : element to be created
 * 
 */
XmlUtil.createNewElement = function(xmlNode, elementName) {

	return (XmlUtil.isDocumentElement(xmlNode)) ? xmlNode
			.createElement(elementName) : xmlNode.ownerDocument
			.createElement(elementName);

};

/**
 * Returns true if the current xmlNode is a Document element
 * @param : XML node object 
 */
XmlUtil.isDocumentElement = function(xmlNode) {
	// alert(xmlNode);
	return (xmlNode.documentElement) ? true : false;
}

/**
 * Removes childNode from the children of xmlNode
 * 
 * @param : 
 * 	xmlNode	- XML node object 
 * 	childNode - node to be removed 
 */
XmlUtil.removeChild = function(xmlNode, childNode) {
	xmlNode.removeChild(childNode);
}

/**
 * Gets element using XPath
 * @param :-
 * 	xmlNode - XML node object in which the element has to be found 
 * 	xpath -  XPAth for the element to be found 
 * 	resultType -  it is node by default . Specify the type of result required
 * 
 *  @returns : will return a node 
 */


XmlUtil.getXPathResult = function(xmlNode, xpath, resultType) {
	var node = null;
	var resType = (arguments.length == 3 && resultType) ? resultType
			: XPathResult.ANY_TYPE;

	/* get Node */
	if (window.ActiveXObject) {
		node = (xmlNode.ownerDocument) ? xmlNode.ownerDocument
				.selectSingleNode(xpath) : xmlNode.selectSingleNode(xpath);
	} else {
		var evaluator = (xmlNode.ownerDocument) ? xmlNode.ownerDocument
				: xmlNode;
		node = evaluator.evaluate(xpath,
				(xmlNode.ownerDocument) ? xmlNode.ownerDocument : xmlNode,
				null, resType, null);
	}
	return node;
};

/**
 * used to update the value of the attribute and element
 * @param :-
 * 	xmlNode - XML node object to which the values are updated 
 * 	xpath - XPath of the node where the values need to be updated 
 * 	attrName - name of the attribute whose value is to be updated/ value of the element node  
 * 	value - value of the attribute 
 */

XmlUtil.updateXmlUsingpath = function(xmlNode, xpath, attrName, value) {

	// alert("In XmlUtil.updateXmlUsingpath, xmlNode: " +
	// XmlUtil.xmlToString(xmlNode));
	// alert("In XmlUtil.updateXmlUsingpath, xpath: " + xpath);

	var node = XmlUtil.getXPathResult(xmlNode, xpath, XPathResult.ANY_TYPE);

	// alert("Result: " + node + ", Result Type: " + node.resultType);

	var result = node.iterateNext();

	// alert("Iterate: " + XmlUtil.xmlToString(result));
	// alert("snapshotLength: " + node.snapshotLength);

	if (arguments.length == 3) {
		XmlUtil.text(result, attrName);
	} else {
		XmlUtil.attr(result, attrName, value);
	}
};

/**
 * used to convert a XML file into a document
 * @param :  xmlFileName - file to be convert with the exact path
 * @returns : XML Document 
 */
XmlUtil.getXMLDocument = function(xmlFileName) {
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("GET", xmlFileName, false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;
	return xmlDoc;
}

/**
 * used to get values from the input elements in the container and update the XML node 
 *@param :- 
 *	  messageXMLDoc - XML node  to  set values 
 *	  containerId - get or set data from the specified container 
 */
XmlUtil.save = function(messageXMLDoc, containerId) {
	var elements = $('#' + containerId).find('input[type="text"]');
	XmlUtil.updateData(messageXMLDoc, elements);
	var elements = $('#' + containerId).find('input[type="hidden"]');
	XmlUtil.updateData(messageXMLDoc, elements);
	// alert(elements.length);
	/*
	 * for(var i=0;i<elements.length;i++){ var xPath =
	 * $(elements[i]).attr("data"); // alert(xPath); if(xPath){ var value =
	 * $(elements[i]).val(); var attr = null; if(xPath.indexOf('@')>-1){ attr=
	 * xPath.substring(xPath.indexOf('@')+1); xPath =
	 * xPath.substring(0,xPath.indexOf('@')-1);
	 * XmlUtil.updateXmlUsingpath(messageXMLDoc,xPath,attr,value); }else{
	 * XmlUtil.updateXmlUsingpath(messageXMLDoc,xPath,value); } } }
	 */

	// alert(XmlUtil.xmlToString(messageXMLDoc));
}

/**
 * used to get values from the  XML node and updates the input elements in the container
 * @param :- 
 *	  messageXMLDoc - XML node  to get values 
 *	  containerId - get or set data from the specified container 
 */
XmlUtil.load = function(messageXMLDoc, containerId) {
	var elements = $('#' + containerId).find('input[type="text"]');
	// alert(elements.length);
	// alert(messageXMLDoc);
	XmlUtil.loadData(messageXMLDoc, elements, "data");
	var elements = $('#' + containerId).find('input[type="hidden"]');
	XmlUtil.loadData(messageXMLDoc, elements, "data");
	var elements = $('#' + containerId).find('textarea');
	XmlUtil.loadData(messageXMLDoc, elements, "data");

};

/**
 * update the value of the input elemnets in the specified container 
 * @param :- 
 *	  messageXMLDoc - XML node to get values 
 *	  containerId - get or set data from the specified container 
 */
XmlUtil.fill = function(messageXMLDoc, containerId) {
	var elements = $('#' + containerId).find('input[type="text"]');
	// alert(containerId+" : "+elements.length);
	// alert(messageXMLDoc);
	XmlUtil.loadData(messageXMLDoc, elements, "fillXpath");
	var elements = $('#' + containerId).find('input[type="hidden"]');
	XmlUtil.loadData(messageXMLDoc, elements, "fillXpath");
	var elements = $('#' + containerId).find('textarea');
	XmlUtil.loadData(messageXMLDoc, elements, "fillXpath");

};

/**
 * update the XML node with the data from the elements 
 * @param :-  
 * 	messageXMLDoc - XML node  to get or set values 
 * 	elements -  array of element from which the value of the attr "data" is retrived 
 */
XmlUtil.updateData = function(messageXMLDoc, elements) {
	for ( var i = 0; i < elements.length; i++) {
		var xPath = $(elements[i]).attr("data");
		// alert(xPath);
		if (xPath) {
			var value = $(elements[i]).val();
			var attr = null;
			if (xPath.indexOf('@') > -1) {
				attr = xPath.substring(xPath.indexOf('@') + 1);
				xPath = xPath.substring(0, xPath.indexOf('@') - 1);
				XmlUtil.updateXmlUsingpath(messageXMLDoc, xPath, attr, value);
			} else {
				XmlUtil.updateXmlUsingpath(messageXMLDoc, xPath, value);
			}

		}
	}
};

/**
 * will retrieve the value from the XML node using the XPath in the attribute "fillXpath" and update the input elements 
 * @param :-
 * 	messageXMLDoc -  XML node used to get values 
 * 	elements - input elements to be updated 
 * 	pathAttr -  XPath that is retrived from the attribute "data" in the input element  
 */
XmlUtil.loadData = function(messageXMLDoc, elements, pathAttr) {
	for ( var i = 0; i < elements.length; i++) {
		var xPath = $(elements[i]).attr(pathAttr);
		if (xPath) {
			var attr = null;
			var node = null;
			var attrValue = null;
			var text = null;
			if (xPath.indexOf('@') > -1) {
				attr = xPath.substring(xPath.indexOf('@') + 1);
				xPath = xPath.substring(0, xPath.indexOf('@') - 1);
				node = XmlUtil.getXPathResult(messageXMLDoc, xPath);
				var element = node.iterateNext();
				if (node != null && element != null) {
					attrValue = XmlUtil.attr(element, attr);
					$(elements[i]).val(attrValue);
				}
			} else {
				node = XmlUtil.getXPathResult(messageXMLDoc, xPath);
				var element = node.iterateNext();
				if (node != null && element != null) {
					text = XmlUtil.text(element);
					$(elements[i]).val(text);
				}
			}

		}
	}
};

/**
 * used to convert a string into a Standard Date Format
 *  @param : dateString -  string to be converted
 *  @returns : formated date 
 */
XmlUtil.stringToDate = function(dateString) {
	var year = dateString.substring(0, 4);
	var month = dateString.substring(4, 6);
	var date = dateString.substring(6, 8);
	var newDateString = date + "/" + month + "/" + year;
	return newDateString;
};

/**
 * used to convert Standard Date Format into a string 
 *  @param : dateString -  date to be converted
 *  @returns : string form of date 
 */
XmlUtil.dateToString = function(dateString) {
	var splitedDate = dateString.split("/");
	var newDateString = splitedDate[2] + splitedDate[1] + splitedDate[0];
	return newDateString;
};

/**
 * used to convert Time into a string
 * @param :  timeString - Time to be converted
 * @returns :  string 
 */
XmlUtil.timeToString = function(timeString) {
	var splitedTime = timeString.split(":");
	var hh = splitedTime[0];
	if (hh.length == 1) {
		hh = "0" + hh;
	}
	var newTimeString = hh + splitedTime[1];// +"00";
	return newTimeString;
};

/**
 * used to retrive the value from an input element and update the Formated date in another input element  
 * @param : 
 * 	 fromId - input element from which the data is retrived 
 * 	 toId - input element to which the data is updated 
 */
XmlUtil.dateFormat = function(fromId, toId) {
	var birthTime = $('#'+fromId).val();
	//alert(birthTime);
	if (birthTime) {
		$('#'+toId).val(XmlUtil.stringToDate(birthTime));
	}
};