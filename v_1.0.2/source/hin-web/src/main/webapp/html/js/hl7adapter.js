var d
var d1
var SERVER_URL = '/hin-web'
function queryData(query, callback, failback) {

    $.ajax({
        url: '_list/messageid/fetch'+query,
        type: "GET",
        data: "",
        contentType: "application/json",
        dataType: "json",
        success: callback,
        cache: false,
        error: AjaxFailed
    });


	function AjaxFailed(result) {
	  if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
		callback(eval(result.responseText));
	  }
	  else {
		failback("FAILED : " + result.status + ' ' + result.statusText);
	  }
   }
} 

function getMessage(messageid,callback, failback) {

    $.ajax({
        url: SERVER_URL + messageid,
        type: "GET",
        data: "",
        contentType: "application/xml",
        dataType: "xml",
        success: callback,
        cache: false,
        error: AjaxFailed
    });

	function AjaxFailed(result) {
	  if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
		callback(result.responseText);
	  }
	  else {
		failback("FAILED : " + result.status + ' ' + result.statusText);
	  }
   }
} 


function putMessage(messageid,contents, callback, failback) {

    function xml2string(node) {
       if (typeof(XMLSerializer) !== 'undefined') {
          var serializer = new XMLSerializer();
          return serializer.serializeToString(node);
       } else if (node.xml) {
          return node.xml;
       }
    }



   /* $.ajax({
        url: '_update/postXML/'+messageid,
        type: "POST",
        data: xml2string(contents),
        contentType: "application/xml",
        dataType: "json",
        success: callback,
        cache: false,
        error: AjaxFailed
    });

	function AjaxFailed(result) {
	  if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
		callback(eval(result.responseText));
	  }
	  else {
		failback("FAILED : " + result.status + ' ' + result.statusText);
	  }
   }*/
} 

// Evaluate an XPath expression aExpression against a given DOM node
// or Document object (aNode), returning the results as an array
// thanks wanderingstan at morethanwarm dot mail dot com for the
// initial work.
function evaluateXPath(aNode, aExpr) {
  var xpe = new XPathEvaluator();
  var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
    aNode.documentElement : aNode.ownerDocument.documentElement);
  var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
  var found = [];
  var res;
  while (res = result.iterateNext())
    found.push(res);
  return found;
}

function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..
            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("oops");
   return dom;
}


function ConfigClass(xmlelement){
   var xml = xmlelement
   function getChildClass(className){
       var r = evaluateXPath(xml, 'Class[@tagName="'+className+'"]')
       var result
       if(r.length==1) {
           result = new ConfigClass(r[0]);
       } else {
           result = null
       }
       return result
   }
   this.getChildClass = getChildClass

   function getField(fieldName){
       var r = evaluateXPath(xml, 'Field[@tagName="'+fieldName+'"]')
       var result
       if(r.length==1) {
           result = new ConfigField(r[0]);
       } else {
           result = null
       }
       return result
   }
   this.getField = getField

   function getProperty(propertyName){
       return xml.getAttribute(propertyName).toString()
   }
   this.getProperty = getProperty
 
   function getClassName() {
       return xml.getAttribute('tagName')
   }
   this.getClassName =getClassName 

   function getNodeNames(expression) {
        var r = evaluateXPath(xml, expression)
        var resultarr = new Array();
        for(var i in r) resultarr.push(r[i].nodeValue) 
		return resultarr;

	}
    this.getNodeNames = getNodeNames

	function getFieldNames() {
		return getNodeNames("Field/@tagName");
	}
    this.getFieldNames = getFieldNames

    function getChildClassNames() {
		return getNodeNames("Class/@tagName");
	}
    this.getChildClassNames = getChildClassNames

	function getPropertyNames() {
		return getNodeNames("@*");
	}
    this.getPropertyNames = getPropertyNames
}

function ConfigField(xmlelement){
   var xml = xmlelement

   function getProperty(propertyName){
       return xml.getAttribute(propertyName).toString()
   }
   this.getProperty = getProperty
 
   function getFieldName() {
       return xml.getAttribute('tagName')
   }
   this.getClassName =getFieldName 
}


function ConfigDocument(xmldef){
   var xml = xmldef

   function getChildClass(className){
       var r = evaluateXPath(xml, '/HL7MessageConfiguration/Class[@tagName="'+className+'"]')
       var result
       if(r.length==1) {
           result = new ConfigClass(r[0]);
       } else {
           result = null
       }
       return result

   }
   this.getChildClass = getChildClass


   function getArtifactId(){
       var r = evaluateXPath(xml, '/HL7MessageConfiguration/MetaInfo')
       return r[0].getAttribute('artifactID').toString()
   }
   this.getArtifactId = getArtifactId

	function createMessage() {
		return new SMOMessage(this);
	}
    this.createMessage = createMessage

   function getXML(){
      return xml
   } 
   this.getXML = getXML
}


function getConfigDocument(documentid, callback, failback){

    function internalcb(data){
         config =  new ConfigDocument(data)
         callback(config)
    }
    function internalfail(data){
         failback(data)
    }
    getMessage(documentid, internalcb, internalfail)
}


function SMOMessage(documentconfig){
   var config = documentconfig
   var doc

   function clearMessage(){
       doc = document.implementation.createDocument(null, "message", null);
       doc.childNodes[0].setAttribute('config', config.getArtifactId())
   }
   this.clearMessage = clearMessage
   clearMessage() 

   function load(xml){
      doc = xml
   }
   this.load = load

   function createObject(configClassName) {
		var result
		var cl = config.getChildClass(configClassName)
		if(cl!=null){
			elt = doc.createElement(configClassName);

			doc.childNodes[0].appendChild(elt);
			result = new SMOObject(cl, elt);
		} else {
			result = null;
		}
		return result;
	}
    this.createObject = createObject


   function findObject(expression) { 
        var r = evaluateXPath(doc, "/message/"+expression)
        var resultarr = new Array();
        for(var i in r) {
             var elt = r[i]
             var cl = config.getChildClass(elt.tagName)
             if(cl!=null) resultarr.push(new SMOObject(cl, elt)) 
        }
		return resultarr;
        return root.findObject(expression)
	}
    this.findObject = findObject


	function validateMessage() {
		var result=true;
		var l = findObject("*");
		for(var i=0; i<l.length;i++){
            var obj = l[i]
			result &= obj.validate();
		}
		
		return result;
	}
    this.validateMessage = validateMessage


    function getXML(){
       return doc
    }
    this.getXML = getXML
}

function getMessageDocument(documentid, callback,failback){
    var msg
    var xml

    function configcallback(configdoc){
         msg = configdoc.createMessage()
         msg.load(xml)
         callback(msg)
    }

    function messagecallback(messagexml){
        xml = messagexml
        var configid = '/message-configuration/' + messagexml.childNodes[0].getAttribute('config') + '.xml'
        getConfigDocument(configid, configcallback, failback)
    }

    getMessage(documentid, messagecallback, failback)         
}
function putMessageDocument(documentid, msg, callback, failback){
    putMessage(documentid, msg.getXML(),callback,failback )
}



function SMOObject(configClass, xmlelement){
   var xml  = xmlelement
   var config = configClass 

  function createObject(className) {
        var result;
        if(isValid(className)){
		    var cl = config.getChildClass(className);

		    
		    if (cl != null) {
			    var elt = xml.ownerDocument.createElement(className);
			    xml.appendChild(elt);
			    result = new SMOObject(cl, elt);
		    } else {
			    result = null;
		    }
		    
       } else {
            result = null
       }
       return result
	}
   this.createObject  = createObject

   function findObject(expression) { 
        var r = evaluateXPath(xml, expression)
        var resultarr = new Array();
        for(var i in r) {
             var elt = r[i]
             var cl = config.getChildClass(elt.tagName)
             if(cl!=null) resultarr.push(new SMOObject(cl, elt)) 
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
        var clas =  config.getChildClass(name);
		return field != null || clas != null;
	}

	function getValue(fieldName) {
		var result;
		if (!isValid(fieldName)){
			result = null
		} else {
			var r = evaluateXPath(xml, fieldName)
            var resultarr = new Array();
            for(var i in r){ 
                 var text = r[i].textContent
                 if(text.indexOf("<object>")==0) {
                     json = xml2json(parseXml(text)," ")
                     eval("text="+json)
                     text = text.object
                 }
                 resultarr.push(text)
            }
            if(resultarr.length==1){
                     result = resultarr[0]
            } else {
                     result = resultarr
            }
        }  
		return result;
	}
    this.getValue = getValue


    function putValue(fieldName, value){
         var storedText
         if(typeof(value) == "object"){
             storedText = "<object>"+json2xml(value)+"</object>"
         } else {
             storedText = value
         }      

         var attrElement = xml.ownerDocument.createElement(fieldName)  
         var text = xml.ownerDocument.createTextNode(storedText)           
         attrElement.appendChild(text)
         xml.appendChild(attrElement)
    }

	function setValue(fieldName,value){
       var result
	   if (isValid(fieldName)){
             var r = xml.childNodes
             var i =0 
             while(i<r.length){
                 if(r[i].tagName==fieldName){ 
                    xml.removeChild(r[i])
                 } else {  
                    i++
                 }
             }

             if(value instanceof Array){
                 for(var i in value){
                      putValue(fieldName, value[i])
                 }
             } else {
                 putValue(fieldName,value)    
             }

                          
            result = true
       }else{
            result = false
       }
       return result
	}
    this.setValue = setValue

    function getXML(){
        return xml
    }
    this.getXML = getXML


	function validate() {
		var result = true;
		var l = evaluateXPath(xml, "*")
		for(var i=0; i<l.length;i++){
			if (!isValid(l[i].tagName)) {
				result = false;
				break;
			}
		}
		if (result) {
			var l = findObject("*");            
			for (var i=0; i<l.length;i++) {
				result = l[i].validate();
				if (!result)
					break;
			}
		}
		return result;
	}
   this.validate = validate

}
