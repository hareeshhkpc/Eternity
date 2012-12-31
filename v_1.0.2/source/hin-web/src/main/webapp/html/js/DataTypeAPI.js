/**
 * Data type API has methods to set values into and to get values from editor for each data Type
 * */

function DataTypeAPI()
{
	this.PN = {
			setPN :	setPN,
			getPN : getPN			
	};
	this.CE = {
			setCE :	setCE,
			getCE : getCE			
	};
	this.CD = {
			setCD :	setCD,
			getCD : getCD			
	};
	this.TEL = {
			setTEL : setTEL,
			getTEL : getTEL			
	};
	this.II = {
			setII : setII,
			getII : getII	
	}
	this.ED = {
			setED : setED,
			getED : getED	
	}
	this.CS = {
			setCS : setCS,
			getCS : getCS	
	}
	this.AD = {
			setAD : setAD,
			getAD : getAD	
	}
	this.TS = {
			setTS : setTS,
			getTS : getTS	
	}
	this.INT = {
			setINT : setINT,
			getINT : getINT	
	}
	
	
	function stringToDate(dateString) {
		var year = dateString.substring(0, 4);
		var month = dateString.substring(4, 6);
		var date = dateString.substring(6, 8);
		var newDateString = date + "/" + month + "/" + year;
		return newDateString;
	}

	function dateToString(dateString) {
		var splitedDate = dateString.split("/");
		var newDateString = splitedDate[2] + splitedDate[1] + splitedDate[0];
		return newDateString;
	}

	function setPN(xmlNode, htmlFragment)
	{				
		var nullFlavor = XmlUtil.attr(xmlNode, "nullFlavor");	
		if(nullFlavor == null)
		{
			var use = XmlUtil.attr(xmlNode, "use");
			$(htmlFragment).find("#use").attr('value', use);
			
			var prefix = XmlUtil.text(XmlUtil.findByName(xmlNode, "prefix", true));
			var delimiter = XmlUtil.text(XmlUtil.findByName(xmlNode, "delimiter", true));
			var family = XmlUtil.text(XmlUtil.findByName(xmlNode, "family", true));
			var given = XmlUtil.text(XmlUtil.findByName(xmlNode, "given", true));
			var suffix = XmlUtil.text(XmlUtil.findByName(xmlNode, "suffix", true));
			var low = XmlUtil.text(XmlUtil.findByName(xmlNode, "low", true));
			var high = XmlUtil.text(XmlUtil.findByName(xmlNode, "high", true));
			
			if(prefix)
			{
				prefix = $.trim(prefix);
				$(htmlFragment).find("#prefix").attr('value', prefix);
			}
			if(delimiter)
			{
				delimiter = $.trim(delimiter);
				$(htmlFragment).find("#delimiter").attr('value', delimiter);
			}
			if(family)
			{
				family = $.trim(family);
				$(htmlFragment).find("#family").attr('value', family);
			}
			if(given)
			{
				given = $.trim(given);
				$(htmlFragment).find("#given").attr('value', given);
			}
			if(suffix)
			{
				suffix = $.trim(suffix);
				$(htmlFragment).find("#suffix").attr('value', suffix);
			}
			if(low)
			{
				low = $.trim(low);
				low = stringToDate(low);
				$(htmlFragment).find("#low").attr('value', low);
			}
			if(high)
			{
				high = $.trim(high);
				high = stringToDate(high);
				$(htmlFragment).find("#high").attr('value', high);
			}
		}
		else
		{
			$(htmlFragment).find('#nullFlavor option').each(function(){
				if($(this).text() == nullFlavor)
					$(this).attr("selected", "selected");				
			});
		}
		
		/*$(htmlFragment).find("#low").after( $( "<div id=lowDatePicker style='display:none'/>" ).datepicker({ altField: "#" +$(htmlFragment).find("#low").attr( "id" ), showOtherMonths: true }) );
		$(htmlFragment).find("#high").after( $( "<div id=highDatePicker style='display:none'/>" ).datepicker({ altField: "#" +$(htmlFragment).find("#high").attr( "id" ), showOtherMonths: true }) );
	*/	
		$(htmlFragment).find("#low").click(function(){		
			$(htmlFragment).find("#lowDatePicker").slideToggle("slow");			
		});	

		$(htmlFragment).find("#high").click(function(){
			$(htmlFragment).find("#highDatePicker").slideToggle("slow");				
		});			
		lookUp(htmlFragment, "prefix");
	}
	
	function getPN(xmlNode, htmlFragment)
	{
		var nullFlavor = $(htmlFragment).find("#nullFlavor option:selected").text();	
		if(nullFlavor != "Select")
		{
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);			
			xmlNode.removeAttribute("use");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "prefix", true), "");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "delimiter", true), "");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "family", true), "");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "given", true), "");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "suffix", true), "");	
			XmlUtil.text(XmlUtil.findByName(xmlNode, "low", true), "");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "high", true), "");
		}	
		else
		{		
			var use = $(htmlFragment).find("#use").attr('value');
			if(use){
				XmlUtil.attr(xmlNode, "use", use);
			}
			else{
				xmlNode.removeAttribute("use");
			}
			xmlNode.removeAttribute("nullFlavor");
			
			var prefix = $(htmlFragment).find("#prefix").attr('value');
			var delimiter = $(htmlFragment).find("#delimiter").attr('value');
			var family = $(htmlFragment).find("#family").attr('value');
			var given = $(htmlFragment).find("#given").attr('value');
			var suffix = $(htmlFragment).find("#suffix").attr('value');
			var low = $(htmlFragment).find("#low").attr('value');
			if(low)
			low = dateToString(low);
			var high = $(htmlFragment).find("#high").attr('value');
			if(high)
			high = dateToString(high);
					
			XmlUtil.text(XmlUtil.findByName(xmlNode, "prefix", true), prefix);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "delimiter", true), delimiter);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "family", true), family);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "given", true), given);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "suffix", true), suffix);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "low", true), low);
			XmlUtil.text(XmlUtil.findByName(xmlNode, "high", true), high);
		}		
	}
	
	function setCE(xmlNode, htmlFragment)
	{
		var code = XmlUtil.attr(xmlNode, "code");		
		var codeSystemName = XmlUtil.attr(xmlNode, "codeSystemName");
		var originalText = XmlUtil.text(XmlUtil.findByName(xmlNode, "originalText", true));
		
		$(htmlFragment).find("#code").attr('value', code);
		$(htmlFragment).find("#codeSystemName").attr('value', codeSystemName);
		
		if(originalText)
		{
			originalText = $.trim(originalText);
			$(htmlFragment).find("#originalText").attr('value', originalText);
		}
		
		lookUp(htmlFragment, "code");
	}
	function getCE(xmlNode, htmlFragment)
	{
		var code = $(htmlFragment).find("#code").attr('value');
		var codeSystemName = $(htmlFragment).find("#codeSystemName").attr('value');
		var originalText = $(htmlFragment).find("#originalText").attr('value');
		
		if(code){
			XmlUtil.attr(xmlNode, "code", code);
		}else{
			xmlNode.removeAttribute("code");
		}
		if(codeSystemName){
			XmlUtil.attr(xmlNode, "codeSystemName", codeSystemName);
		}else{
			xmlNode.removeAttribute("codeSystemName");
		}
			
		XmlUtil.text(XmlUtil.findByName(xmlNode, "originalText", true), originalText);
	}
	
	function setCD(xmlNode, htmlFragment)
	{
		var code = XmlUtil.attr(xmlNode, "code");		
		var codeSystemName = XmlUtil.attr(xmlNode, "codeSystemName");
		var originalText = XmlUtil.text(XmlUtil.findByName(xmlNode, "originalText", true));
		
		$(htmlFragment).find("#code").attr('value', code);
		$(htmlFragment).find("#codeSystemName").attr('value', codeSystemName);
		
		if(originalText)
		{
			originalText = $.trim(originalText);
			$(htmlFragment).find("#originalText").attr('value', originalText);
		}
		
		lookUp(htmlFragment, "code");
	}
	function getCD(xmlNode, htmlFragment)
	{
		var code = $(htmlFragment).find("#code").attr('value');
		var codeSystemName = $(htmlFragment).find("#codeSystemName").attr('value');
		var originalText = $(htmlFragment).find("#originalText").attr('value');
		
		if(code){
			XmlUtil.attr(xmlNode, "code", code);
		}else{
			xmlNode.removeAttribute("code");
		}
		if(codeSystemName){
			XmlUtil.attr(xmlNode, "codeSystemName", codeSystemName);
		}else{
			xmlNode.removeAttribute("codeSystemName");
		}
			
		XmlUtil.text(XmlUtil.findByName(xmlNode, "originalText", true), originalText);
	}	
	
	function setTEL(xmlNode, htmlFragment)
	{
		var nullFlavor = XmlUtil.attr(xmlNode, "nullFlavor");		
		if(nullFlavor == null)
		{
			var use = XmlUtil.attr(xmlNode, "use");		
			var useablePeriod = XmlUtil.text(XmlUtil.findByName(xmlNode, "useablePeriod", true));
			$(htmlFragment).find("#use").attr('value', use);
			
			if(useablePeriod)
			{
				useablePeriod = $.trim(useablePeriod);
				$(htmlFragment).find("#useablePeriod").attr('value', useablePeriod);
			}			
		}else
		{
			$(htmlFragment).find('#nullFlavor option').each(function(){
				if($(this).text() == nullFlavor)
					$(this).attr("selected", "selected");				
			});
		}
	}
	function getTEL(xmlNode, htmlFragment)
	{
		var nullFlavor = $(htmlFragment).find("#nullFlavor option:selected").text();
		
		if(nullFlavor != "Select")
		{
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(XmlUtil.findByName(xmlNode, "useablePeriod", true), "");
		}
		else
		{
			var use = $(htmlFragment).find("#use").attr('value');
			var useablePeriod = $(htmlFragment).find("#useablePeriod").attr('value');
			xmlNode.removeAttribute("nullFlavor");
			if(use){
				XmlUtil.attr(xmlNode, "use", use);
			}else{
				xmlNode.removeAttribute("use");
			}
			XmlUtil.text(XmlUtil.findByName(xmlNode, "useablePeriod", true), useablePeriod);
		}
	}
	function setII(xmlNode, htmlFragment){
		var nullFlavor = XmlUtil.attr(xmlNode, "nullFlavor");
		if(nullFlavor == null)
		{
			var root = XmlUtil.attr(xmlNode, "root");
			var extension = XmlUtil.attr(xmlNode, "extension"); 
			var assigningAuthorityName=XmlUtil.attr(xmlNode, "assigningAuthorityName");
			

			$(htmlFragment).find("#root").attr('value', root);
			$(htmlFragment).find("#extension").attr('value', extension);	
			$(htmlFragment).find("#assigningAuthorityName").attr('value', assigningAuthorityName);
		}
		else
		{
			$(htmlFragment).find('#nullFlavor option').each(function(){
				if($(this).text() == nullFlavor)
					$(this).attr("selected", "selected");				
			});
		}
	}
	function getII(xmlNode, htmlFragment)
	{
		var nullFlavor = $(htmlFragment).find("#nullFlavor option:selected").text();	
		if(nullFlavor != "Select")
		{
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("root");
			xmlNode.removeAttribute("extension");
			xmlNode.removeAttribute("assigningAuthorityName");			
		}
		else
		{
			var root = $(htmlFragment).find("#root").attr('value');
			var extension = $(htmlFragment).find("#extension").attr('value');
			var assigningAuthorityName=$(htmlFragment).find("#assigningAuthorityName").attr('value');
			
			xmlNode.removeAttribute("nullFlavor");
			
			if(root){
				XmlUtil.attr(xmlNode, "root", root);
			}else{
				xmlNode.removeAttribute("root");
			}
			if(extension){
				XmlUtil.attr(xmlNode, "extension", extension);
			}else{
				xmlNode.removeAttribute("extension");
			}
			if(assigningAuthorityName){
				XmlUtil.attr(xmlNode, "assigningAuthorityName", assigningAuthorityName);
			}else{
				xmlNode.removeAttribute("assigningAuthorityName");
			}
		}
	}
	function setED(xmlNode, htmlFragment)
	{
/*		var mediaType = XmlUtil.attr(xmlNode, "mediaType");		
		var language = XmlUtil.attr(xmlNode, "language");
		var referenceElement = XmlUtil.findByName(xmlNode, "reference", true);
		var thumbnailElement = XmlUtil.findByName(xmlNode, "thumbnail", true);					
		var reference = XmlUtil.text(referenceElement);
		var thumbnail = XmlUtil.text(thumbnailElement);
		
		if(reference)
		{
			reference = $.trim(reference);
			$(htmlFragment).find("#reference").attr('value', reference);
		}
		if(thumbnail)
		{
			thumbnail = $.trim(thumbnail);
			$(htmlFragment).find("#thumbnail").attr('src', "data:image/gif;base64,'+thumbnail+'");
		}
		$(htmlFragment).find("#mediaType").attr('value', mediaType);
		$(htmlFragment).find("#language").attr('value', language);*/
	}
	function getED(xmlNode, htmlFragment)
	{		
		var oFReader = new FileReader(), rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;   
		  
		 var oFile = document.getElementById("uploadImage").files[0]; 
		 oFReader.readAsDataURL(oFile); 
		
		oFReader.onload = function (oFREvent) { 
		  var imageData = oFREvent.target.result;
		  XmlUtil.text(XmlUtil.findByName(xmlNode, "thumbnail", true), imageData);
		  
		};		
	}

	
	function encode64(input)
	{		
		var keyStr = "ABCDEFGHIJKLMNOP" +
		    "QRSTUVWXYZabcdef" +
		    "ghijklmnopqrstuv" +
		    "wxyz0123456789+/" +
		    "=";
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
		
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
		
			output = output +
			 keyStr.charAt(enc1) +
			 keyStr.charAt(enc2) +
			 keyStr.charAt(enc3) +
			 keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		
		return output;
	}
	
	function setCS(xmlNode, htmlFragment)
	{
		var code = XmlUtil.attr(xmlNode, "code");
		$(htmlFragment).find("#code").attr('value', code);
		
		lookUp(htmlFragment, "code");
	}
	function getCS(xmlNode, htmlFragment)
	{
		var code = $(htmlFragment).find("#code").attr('value');
		if(code){
			XmlUtil.attr(xmlNode, "code", code);
		}else{
			xmlNode.removeAttribute("code");
		}
		
		
	}
	
	function setAD(xmlNode, htmlFragment)
	{
		
		var delimiter = XmlUtil.text(XmlUtil.findByName(xmlNode, "delimiter", true));
		var country = XmlUtil.text(XmlUtil.findByName(xmlNode, "country", true));
		var state = XmlUtil.text(XmlUtil.findByName(xmlNode, "state", true));
		var county = XmlUtil.text(XmlUtil.findByName(xmlNode, "county", true));
		var city = XmlUtil.text(XmlUtil.findByName(xmlNode, "city", true));
		var postalCode = XmlUtil.text(XmlUtil.findByName(xmlNode, "postalCode", true));
		var streetAddressLine = XmlUtil.text(XmlUtil.findByName(xmlNode, "streetAddressLine", true));
		var houseNumber = XmlUtil.text(XmlUtil.findByName(xmlNode, "houseNumber", true));
		var houseNumberNumeric = XmlUtil.text(XmlUtil.findByName(xmlNode, "houseNumberNumeric", true));
		var direction = XmlUtil.text(XmlUtil.findByName(xmlNode, "direction", true));
		var streetName = XmlUtil.text(XmlUtil.findByName(xmlNode, "streetName", true));
		var streetNameBase = XmlUtil.text(XmlUtil.findByName(xmlNode, "streetNameBase", true));
		var streetNameType = XmlUtil.text(XmlUtil.findByName(xmlNode, "streetNameType", true));
		var additionalLocator = XmlUtil.text(XmlUtil.findByName(xmlNode, "additionalLocator", true));
		var unitID = XmlUtil.text(XmlUtil.findByName(xmlNode, "unitID", true));
		var unitType = XmlUtil.text(XmlUtil.findByName(xmlNode, "unitType", true));
		var careOf = XmlUtil.text(XmlUtil.findByName(xmlNode, "careOf", true));
		var censusTract = XmlUtil.text(XmlUtil.findByName(xmlNode, "censusTract", true));
		var deliveryAddressLine = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryAddressLine", true));
		var deliveryInstallationType = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationType", true));
		var deliveryInstallationArea = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationArea", true));
		var deliveryInstallationQualifier = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationQualifier", true));
		var deliveryMode = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryMode", true));
		var deliveryModeIdentifier = XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryModeIdentifier", true));
		var buildingNumberSuffix = XmlUtil.text(XmlUtil.findByName(xmlNode, "buildingNumberSuffix", true));
		var postBox = XmlUtil.text(XmlUtil.findByName(xmlNode, "postBox", true));
		var precinct = XmlUtil.text(XmlUtil.findByName(xmlNode, "precinct", true));
		
		if(delimiter)
		{
			delimiter = $.trim(delimiter);
			$(htmlFragment).find("#delimiter").attr('value', delimiter);
		}
		if(country)
		{
			country = $.trim(country);
			$(htmlFragment).find("#country").attr('value', country);
		}
		if(state)
		{
			state = $.trim(state);
			$(htmlFragment).find("#state").attr('value', state);
		}
		if(county)
		{
			county = $.trim(county);
			$(htmlFragment).find("#county").attr('value', county);
		}
		if(city)
		{
			city = $.trim(city);
			$(htmlFragment).find("#city").attr('value', city);
		}
		if(postalCode)
		{
			postalCode = $.trim(postalCode);
			$(htmlFragment).find("#postalCode").attr('value', postalCode);
		}
		if(streetAddressLine)
		{
			streetAddressLine = $.trim(streetAddressLine);
			$(htmlFragment).find("#streetAddressLine").attr('value', streetAddressLine);
		}
		if(houseNumber)
		{
			houseNumber = $.trim(houseNumber);
			$(htmlFragment).find("#houseNumber").attr('value', houseNumber);
		}
		if(houseNumberNumeric)
		{
			houseNumberNumeric = $.trim(houseNumberNumeric);
			$(htmlFragment).find("#houseNumberNumeric").attr('value', houseNumberNumeric);
		}
		if(direction)
		{
			direction = $.trim(direction);
			$(htmlFragment).find("#direction").attr('value', direction);
		}
		if(streetName)
		{
			streetName = $.trim(streetName);
			$(htmlFragment).find("#streetName").attr('value', streetName);
		}
		if(streetNameBase)
		{
			streetNameBase = $.trim(streetNameBase);
			$(htmlFragment).find("#streetNameBase").attr('value', streetNameBase);
		}
		if(streetNameType)
		{
			streetNameType = $.trim(streetNameType);
			$(htmlFragment).find("#streetNameType").attr('value', streetNameType);
		}
		if(additionalLocator)
		{
			additionalLocator = $.trim(additionalLocator);
			$(htmlFragment).find("#additionalLocator").attr('value', additionalLocator);
		}
		if(unitID)
		{
			unitID = $.trim(unitID);
			$(htmlFragment).find("#unitID").attr('value', unitID);			
		}
		if(unitType)
		{
			unitType = $.trim(unitType);
			$(htmlFragment).find("#unitType").attr('value', unitType);			
		}
		if(careOf)
		{
			careOf = $.trim(careOf);
			$(htmlFragment).find("#careOf").attr('value', careOf);			
		}
		if(censusTract)
		{
			censusTract = $.trim(censusTract);
			$(htmlFragment).find("#censusTract").attr('value', censusTract);			
		}
		if(deliveryAddressLine)
		{
			deliveryAddressLine = $.trim(deliveryAddressLine);
			$(htmlFragment).find("#deliveryAddressLine").attr('value', deliveryAddressLine);			
		}
		if(deliveryInstallationType)
		{
			deliveryInstallationType = $.trim(deliveryInstallationType);
			$(htmlFragment).find("#deliveryInstallationType").attr('value', deliveryInstallationType);			
		}
		if(deliveryInstallationArea)
		{
			deliveryInstallationArea = $.trim(deliveryInstallationArea);
			$(htmlFragment).find("#deliveryInstallationArea").attr('value', deliveryInstallationArea);			
		}
		if(deliveryInstallationQualifier)
		{
			deliveryInstallationQualifier = $.trim(deliveryInstallationQualifier);
			$(htmlFragment).find("#deliveryInstallationQualifier").attr('value', deliveryInstallationQualifier);			
		}
		if(deliveryMode)
		{
			deliveryMode = $.trim(deliveryMode);
			$(htmlFragment).find("#deliveryMode").attr('value', deliveryMode);			
		}
		if(deliveryModeIdentifier)
		{
			deliveryModeIdentifier = $.trim(deliveryModeIdentifier);
			$(htmlFragment).find("#deliveryModeIdentifier").attr('value', deliveryModeIdentifier);			
		}
		if(buildingNumberSuffix)
		{
			buildingNumberSuffix = $.trim(buildingNumberSuffix);
			$(htmlFragment).find("#buildingNumberSuffix").attr('value', buildingNumberSuffix);			
		}
		if(postBox)
		{
			postBox = $.trim(postBox);
			$(htmlFragment).find("#postBox").attr('value', postBox);			
		}
		if(precinct)
		{
			precinct = $.trim(precinct);
			$(htmlFragment).find("#precinct").attr('value', precinct);			
		}
		
		lookUp(htmlFragment, "country");
		lookUp(htmlFragment, "state");
		lookUp(htmlFragment, "city");		
	}
	
	function getAD(xmlNode, htmlFragment)
	{

		var delimiter = $(htmlFragment).find("#delimiter").attr('value');
		var country = $(htmlFragment).find("#country").attr('value');
		var state = $(htmlFragment).find("#state").attr('value');
		var county = $(htmlFragment).find("#county").attr('value');
		var city = $(htmlFragment).find("#city").attr('value');
		var postalCode = $(htmlFragment).find("#postalCode").attr('value');
		var streetAddressLine = $(htmlFragment).find("#streetAddressLine").attr('value');
		var houseNumber = $(htmlFragment).find("#houseNumber").attr('value');
		var houseNumberNumeric = $(htmlFragment).find("#houseNumberNumeric").attr('value');
		var direction = $(htmlFragment).find("#direction").attr('value');
		var streetNameBase = $(htmlFragment).find("#streetNameBase").attr('value');
		var streetNameType = $(htmlFragment).find("#streetNameType").attr('value');
		var additionalLocator = $(htmlFragment).find("#additionalLocator").attr('value');
		var unitID = $(htmlFragment).find("#unitID").attr('value');
		var unitType = $(htmlFragment).find("#unitType").attr('value');
		var careOf = $(htmlFragment).find("#careOf").attr('value');
		var censusTract = $(htmlFragment).find("#censusTract").attr('value');
		var deliveryAddressLine = $(htmlFragment).find("#deliveryAddressLine").attr('value');
		var deliveryInstallationType = $(htmlFragment).find("#deliveryInstallationType").attr('value');
		var deliveryInstallationArea = $(htmlFragment).find("#deliveryInstallationArea").attr('value');
		var deliveryInstallationQualifier = $(htmlFragment).find("#deliveryInstallationQualifier").attr('value');
		var deliveryMode = $(htmlFragment).find("#deliveryMode").attr('value');
		var deliveryModeIdentifier = $(htmlFragment).find("#deliveryModeIdentifier").attr('value');
		var buildingNumberSuffix = $(htmlFragment).find("#buildingNumberSuffix").attr('value');
		var postBox = $(htmlFragment).find("#postBox").attr('value');
		var precinct = $(htmlFragment).find("#precinct").attr('value');
			
		XmlUtil.text(XmlUtil.findByName(xmlNode, "delimiter", true), delimiter);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "country", true), country);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "state", true), state);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "county", true), county);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "city", true), city);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "postalCode", true), postalCode);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "streetAddressLine", true), streetAddressLine);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "houseNumber", true), houseNumber);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "houseNumberNumeric", true), houseNumberNumeric);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "direction", true), direction);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "streetNameBase", true), streetNameBase);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "streetNameType", true), streetNameType);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "additionalLocator", true), additionalLocator);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "unitID", true), unitID);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "unitType", true), unitType);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "careOf", true), careOf);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "censusTract", true), censusTract);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryAddressLine", true), deliveryAddressLine);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationType", true), deliveryInstallationType);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationArea", true), deliveryInstallationArea);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryInstallationQualifier", true), deliveryInstallationQualifier);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryMode", true), deliveryMode);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "deliveryModeIdentifier", true), deliveryModeIdentifier);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "buildingNumberSuffix", true), buildingNumberSuffix);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "postBox", true), postBox);
		XmlUtil.text(XmlUtil.findByName(xmlNode, "precinct", true), precinct);
	}
	
	function setTS(xmlNode, htmlFragment)
	{
		var value = XmlUtil.attr(xmlNode, "value");
		$(htmlFragment).find("#value").attr('value', value);
		
		$(htmlFragment).find("#value").after( $( "<div id=valueDatePicker style='display:none'/>" ).datepicker({ altField: "#" +$(htmlFragment).find("#value").attr( "id" ), showOtherMonths: true }) );
		
		$(htmlFragment).find("#value").click(function(){		
			$(htmlFragment).find("#valueDatePicker").slideToggle("slow");			
		});	
		
	}
	function getTS(xmlNode, htmlFragment)
	{
		var value = $(htmlFragment).find("#value").attr('value');
		if(value){
			XmlUtil.attr(xmlNode, "value", value);
		}else{
			xmlNode.removeAttribute("value");
		}
	}
	function setINT(xmlNode, htmlFragment)
	{
		var value = XmlUtil.attr(xmlNode, "value");
		$(htmlFragment).find("#value").attr('value', value);
	}
	function getINT(xmlNode, htmlFragment)
	{
		var value = $(htmlFragment).find("#value").attr('value');
		if(value){
			XmlUtil.attr(xmlNode, "value", value);
		}else{
			xmlNode.removeAttribute("value");
		}
	}
	
	function lookUp(htmlFragment, fieldName){
		$(htmlFragment).find("#"+fieldName).keyup(function(){
			
			var enteredValue = $(htmlFragment).find("#"+fieldName).attr("value");
			if(enteredValue.trim() != 0)
			{
				var dataSource = $(htmlFragment).find("#"+fieldName).attr("dataSource");	
				var lookupValues = Lookup[dataSource];
				$(htmlFragment).find("#"+fieldName+"List").html("");
						
				$.each(lookupValues, function(index, value){					
					var subStr = value.substr(0, enteredValue.length);
					if(enteredValue.toLowerCase() == subStr.toLowerCase())
					{
						$(htmlFragment).find("#"+fieldName+"List").append("<li class='ui-li ui-li-static ui-bar-a ui-body-c' style='border-width:1px 1px 0px; cursor:pointer;' id='' >"+value+"</li>");
						$(htmlFragment).find("#"+fieldName+"List").trigger("create");
					}				
				});
				
				
				
				$(htmlFragment).find("#"+fieldName+"List li").each(function(index, value){
					$(value).click(function(){
						$(htmlFragment).find("#"+fieldName).attr("value", $(value).text());
						$(htmlFragment).find("#"+fieldName+"List").html("");
					});
				});
				
			}			
		});
	}
}