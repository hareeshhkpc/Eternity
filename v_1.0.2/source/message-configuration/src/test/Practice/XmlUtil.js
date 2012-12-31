
XmlUtil = {};

/**
 *  Sets an attribute value on an XML node
 * xmlNode - The xmlNode object on which the attribute is to be set 
 * attrName	- The name of attribute to  set
 * attrValue - The value to be set the attribute
 */
XmlUtil.setAttributeValueInXml = function(xmlNode, attrName, attrValue){
		$(xmlNode).attr(attrName, attrValue);
/*		alert("attribute Value"+attrValue);*/
		return xmlNode;
};

/* Gets the Attribute values from the XML node*/
XmlUtil.getAttributeValueFromXml = function(xmlNode,attrName){
	/*alert("attrName:"+attrName);
	alert("in util: "+$(xmlNode).attr(attrName));*/
	return $(xmlNode).attr(attrName);
};

/**
 *  set value for element Value in XML
 *  text- is the content to be added to the element
 */
XmlUtil.setElementValueInXml = function(xmlNode, eleName, eleValue){
	$(xmlNode).find(eleName).text(eleValue);
};

/**
 * get the value of the element from the xml
 * eleName: name of the element whose value shd be retrieved 
 */
XmlUtil.getElementValueFromXml = function(xmlNode, elementName){
	return $(xmlNode).find(elementName).text();
};

/* find attr by id */
XmlUtil.find = function(xmlNode, idAttrName, idValue){
	alert("new ele:"+$(xmlNode).find("[" + idAttrName + "=" + idValue + "]"));
	return $(xmlNode).find("[" + idAttrName + "=" + idValue + "]");
};


/*find element existance*/
XmlUtil.findElement = function (xmlNode, elementName){
	//alert("element:"+elementName+"="+$(xmlNode).find(elementName).length);
	return $(xmlNode).find(elementName);
}

XmlUtil.addingXmlFragment = function(xmlNode, eleName, xmlToBeAdded){
	return $(xmlNode).find(eleName).replaceWith(xmlToBeAdded);
};



XmlUtil.demo = function(){
	alert("in xml util");
};

