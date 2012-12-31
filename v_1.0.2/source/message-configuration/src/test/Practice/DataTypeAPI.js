function getEDvaluesFromUI(idPrefix, elementName){
	var xml =$('<' + elementName 
		+ ' id="id12" mediaType="" language="" compression=""'
		+ ' integrityCheck="" integrityCheckAlgorithm="" representation="" nullFlavor=""> <!-- ED -->'
		+ '<reference use="" value="" nullFlavor=""> <!-- TEL --><useablePeriod operator="" value="" nullFlavor=""/>'
		+ '<!-- SXCM_TS --></reference><thumbnail> <!-- thumbnail --><reference use="" value="" nullFlavor="">'
		+ '<!-- TEL --><useablePeriod operator="" value="" nullFlavor=""/> <!-- SXCM_TS --></reference></thumbnail></' 
		+ elementName + '>');
	
	var mediaType 				= $('#' + idPrefix + "_attr_1").val();
	var language 				= $('#' + idPrefix + "_attr_2").val();
	var compression 			= $('#' + idPrefix + "_attr_3").val();
	var integrityCheck 			= $('#' + idPrefix + "_attr_4").val();
	var integrityCheckAlgorithm = $('#' + idPrefix + "_attr_5").val();
	var representation 			= $('#' + idPrefix + "_attr_6").val();
	var nullFlavor 				= $('#' + idPrefix + "_attr_7").val();
	
	/*	Set the attribute values in the xml fragment	*/
	XmlUtil.setAttributeValueInXml(xml,'mediaType',mediaType);
	XmlUtil.setAttributeValueInXml(xml,'language',language);
	XmlUtil.setAttributeValueInXml(xml,'compression',compression);
	XmlUtil.setAttributeValueInXml(xml,'integrityCheck',integrityCheck);
	XmlUtil.setAttributeValueInXml(xml,'integrityCheckAlgorithm',integrityCheckAlgorithm);
	XmlUtil.setAttributeValueInXml(xml,'representation',representation);
	XmlUtil.setAttributeValueInXml(xml,'nullFlavor', nullFlavor);
	
	var text = $('#' + idPrefix + "_text").val();
	
		alert("before appending: "+$(xml).xml());
		if(text == ""){
			/*	Get values from all children	*/
			//element: reference type TEL
			var xmlFromTEL=getTELvaluesFromUI('idtel', 'reference');
			XmlUtil.addingXmlFragment(xml, 'reference', xmlFromTEL);
			
			
			//element:thumbnail type thumbnail
			var xmlFromThumbnail=getTELvaluesFromUI('idtel', 'thumbnail');
			XmlUtil.addingXmlFragment(xml, 'thumbnail', xmlFromThumbnail);
			
			alert("after appending: "+$(xml).xml());
			
		} else {
			var XmlWithText=XmlUtil.setElementValueInXml(xml, elementName, text);
		}
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Get *TEL* ValueFrom UI>>>>>>>>>>>>>>>>>>>>>>>>>>*/

function getTELvaluesFromUI(IdPrefix, elementName){  
	var TELxml=$('<'+ elementName+ ' value="" use="" nullFlavor="">'
				+ '<useablePeriod operator="" value="" nullFlavor=""/><!-- SXCM_TS --> </'+ elementName+ '>');
	
	var value= $("#"+IdPrefix+"_attr_1").val();
	var use= $("#"+IdPrefix+"_attr_2").val();
	
	XmlUtil.setAttributeValueInXml(TELxml,'value',value);
	XmlUtil.setAttributeValueInXml(TELxml,'use',use);
	/*element:useablePeriod*/
	if(elementName == 'reference'){
		alert('idsxcm_ref');
	var xmlFromSXCM_TS = getSXCM_TSvaluesFromUI('idsxcm_ref','useablePeriod' );
	
	XmlUtil.addingXmlFragment(TELxml, 'useablePeriod', xmlFromSXCM_TS);
	
	}
	else if(elementName == 'thumbnail'){
		alert('idsxcm_th');
		var xmlFromSXCM_TS = getSXCM_TSvaluesFromUI('idsxcm_th','useablePeriod' );
		
		XmlUtil.addingXmlFragment(TELxml, 'useablePeriod', xmlFromSXCM_TS);		
	}
	return TELxml;	
}

function getSXCM_TSvaluesFromUI(IdPrefix, elementName){
	var SXCM_TSxml=$('<'+elementName+' operator="" value="" nullFlavor=""/>');
	
	var operator   =$('#'+IdPrefix+'_attr_1').val();
	var value      =$('#'+IdPrefix+'_attr_2').val();
	var nullFlavor =$('#'+IdPrefix+'_attr_3').val();
	
	XmlUtil.setAttributeValueInXml(SXCM_TSxml,'operator',operator);
	XmlUtil.setAttributeValueInXml(SXCM_TSxml,'value',value);
	XmlUtil.setAttributeValueInXml(SXCM_TSxml,'nullFlavor',nullFlavor);
	return SXCM_TSxml;	
	
}

function getThumbnailValuesFromUI(IdPrefix, elementName){
	getTELvaluesFromUI(IdPrefix, elementName);
}




function demo(){
	alert("i am in the js file ");
}

/*datatype II*/
function IIgetValues(IdPrefix, elementName){	
	var IIxml=$('<'+ elementName +' root=\'\' extension=\'\' assigningAuthorityName=\'\' displayable=\'\'/>');

	$(IIxml).attr('root', $("#"+IdPrefix+"1").val());
	$(IIxml).attr('extension', $("#"+IdPrefix+"2").val());
	$(IIxml).attr('assigningAuthorityName', $("#"+IdPrefix+"3").val());
	$(IIxml).attr('displayable', $("#"+IdPrefix+"4").val());
	return IIxml;
	}
function IIclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");
	$("#"+IdPrefix+"2").val("");
	$("#"+IdPrefix+"3").val("");
	$("#"+IdPrefix+"4").val("");

}	
function IIsetValue(IdPrefix,IIxml){
	$("#"+IdPrefix+"1").val($(IIxml).attr('root'));
	$("#"+IdPrefix+"2").val($(IIxml).attr('extension'));
	$("#"+IdPrefix+"3").val($(IIxml).attr('assigningAuthorityName'));
	$("#"+IdPrefix+"4").val($(IIxml).attr('displayable'));
}

/*datatype TS*/
function TSgetValues(IdPrefix, elementName){	
	var TSxml=$('<'+ elementName +' value=\'\'/>');
	
	$(TSxml).attr('value', $("#"+IdPrefix+"1").val());
	return TSxml;
	}

function TSclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");

}	

function TSsetValue(IdPrefix,TSxml){
	$("#"+IdPrefix+"1").val($(TSxml).attr('value'));
}

/*datatype SXCM_TS*/
function SXCM_TSgetValues(IdPrefix, elementName){	
	var SXCM_TSxml=$('<'+ elementName +' value=\'\' operator=\'\'/>');
	
	$(SXCM_TSxml).attr('value', $("#"+IdPrefix+"1").val());
	$(SXCM_TSxml).attr('operator', $("#"+IdPrefix+"2").val());
	return SXCM_TSxml;
	}

function SXCM_TSclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");
	$("#"+IdPrefix+"2").val("");

}	

function SXCM_TSsetValue(IdPrefix,SXCM_TSxml){
	$("#"+IdPrefix+"1").val($(SXCM_TSxml).attr('value'));
	$("#"+IdPrefix+"2").val($(SXCM_TSxml).attr('operator'));
}


/*datatype URL*/
function URLgetValues(IdPrefix, elementName){	
	var URLxml=$('<'+ elementName +' value=\'\'/>');
	
	$(URLxml).attr('value', $("#"+IdPrefix+"1").val());
	/*alert($(TSxml).xml());*/
	return URLxml;
	}

function URLclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");

}	

function URLsetValue(IdPrefix,URLxml){
	$("#"+IdPrefix+"1").val($(URLxml).attr('value'));
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  DATATYPE TEL  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
function TELgetValues(IdPrefix, elementName){	
	var TELxml=$('<'+ elementName +' value=\'\' use=\'\' />');
	
	var value= $("#"+IdPrefix+"1").val();
	var use= $("#"+IdPrefix+"2").val();
	
	XmlUtil.setAttributeValueInXml(TELxml,'value',value);
	XmlUtil.setAttributeValueInXml(TELxml,'use',use);
	return TELxml;
	}

function TELclearValues(IdPrefix){
	$('#'+IdPrefix+'_attr_1').val(""); 
	$('#'+IdPrefix+'_attr_2').val(""); 
	
	
}	

function TELsetValue(IdPrefix,TELxml){
	var retValue=XmlUtil.getAttributeValueFromXml(TELxml,'value');
	var retUse=XmlUtil.getAttributeValueFromXml(TELxml,'use');
	
	$('#'+IdPrefix+'_attr_1').val(retValue);
	$('#'+IdPrefix+'_attr_2').val(retUse);
	var sxcmRetXml = SXCM_TSsetValue(idsxcm,SXCM_TSxml)
}

/*demo to check element get-set*/
function ELEgetValues(IdPrefix, elementName){
	var ELExml=$('<'+ elementName +'  use=\'\' ><newEle></newEle></'+ elementName +'>');
	alert(IdPrefix + ", " + elementName);
	var use=$("#"+IdPrefix+"1").val();
	alert($("#"+IdPrefix+"1").val());
	var newEle=$("#"+IdPrefix+"2").val();
	alert($("#"+IdPrefix+"2").val());
	
	XmlUtil.setAttributeValueInXml(ELExml, 'use', use);
	XmlUtil.setElementValueInXml(ELExml, 'newEle', newEle);
	return ELExml;
}

function ELEclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");
	$("#"+IdPrefix+"2").val("");
}

function ELEsetValue(IdPrefix, ELExml){
	var retUse=XmlUtil.getAttributeValueFromXml(ELExml,'use');
	alert(retUse);
	var retNewEle=XmlUtil.getElementValueFromXml(ELExml, 'newEle');
	alert(retNewEle);
	$("#"+IdPrefix+"1").val(retUse);
	$("#"+IdPrefix+"2").val(retNewEle);
}

/*datatype ED*/
function EDgetValues(IdPrefix, elementName){	
	var EDxml=$('<'+ elementName +' representation=\'\' mediaType=\'\' language=\'\' compression=\'\' integrityCheck=\'\' integrityCheckAlgorithm=\'\'/>');
	
	$(EDxml).attr('representation', $("#"+IdPrefix+"1").val());
	$(EDxml).attr('mediaType', $("#"+IdPrefix+"2").val());
	$(EDxml).attr('language', $("#"+IdPrefix+"3").val());
	$(EDxml).attr('compression', $("#"+IdPrefix+"4").val());
	$(EDxml).attr('integrityCheck', $("#"+IdPrefix+"5").val());
	$(EDxml).attr('integrityCheckAlgorithm', $("#"+IdPrefix+"6").val());
	
	/*alert($(TSxml).xml());*/
	return EDxml;
	}

function EDclearValues(IdPrefix){
	$("#"+IdPrefix+"1").val("");
	$("#"+IdPrefix+"2").val("");
	$("#"+IdPrefix+"3").val("");
	$("#"+IdPrefix+"4").val("");
	$("#"+IdPrefix+"5").val("");
	$("#"+IdPrefix+"6").val("");
	

}	

function EDsetValue(IdPrefix,EDxml){
	$("#"+IdPrefix+"1").val($(EDxml).attr('representation'));
	$("#"+IdPrefix+"2").val($(EDxml).attr('mediaType'));
	$("#"+IdPrefix+"3").val($(EDxml).attr('language'));
	$("#"+IdPrefix+"4").val($(EDxml).attr('compression'));
	$("#"+IdPrefix+"5").val($(EDxml).attr('integrityCheck'));
	$("#"+IdPrefix+"6").val($(EDxml).attr('integrityCheckAlgorithm'));
	
}