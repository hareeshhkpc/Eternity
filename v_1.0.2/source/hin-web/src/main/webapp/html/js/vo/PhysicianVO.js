var HIN;
if (!HIN)
	HIN = {};
/**
 * PhysicianVO is nothing but a value object which hold the physician relevant
 * information
 */
HIN.PhysicianVO = function() {
	this.id = null;
	/**
	 * physicianId holds unique id.
	 */
	this.physicianId = null;
	/**
	 * name holds name of the physician
	 */
	this.name = null;
	/**
	 * prefixName holds prefix name of the physician
	 */
	this.prefixName = null;
	/**
	 * givenName holds given name of the physician
	 */
	this.givenName = null;
	/**
	 * familyName holds prefix name of the physician
	 */
	this.familyName = null;
	/**
	 * suffixName holds prefix name of the physician
	 */
	this.suffixName = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	/**
	 * message holds stringified xml
	 */
	this.message = null;
};
/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.PhysicianVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.PhysicianVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;
		/*
		 * set subscriberId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.PHYSICIAN_ID,
				XPathResult.STRING_TYPE);
		this.physicianId = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set prefixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.PREFIX_NAME,
				XPathResult.STRING_TYPE);
		this.prefixName = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set givenName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.GIVEN_NAME,
				XPathResult.STRING_TYPE);
		this.givenName = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set familyName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.FAMILY_NAME,
				XPathResult.STRING_TYPE);
		this.familyName = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set sufixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.SUFFIX_NAME,
				XPathResult.STRING_TYPE);
		this.suffixName = (value && value.stringValue) ? value.stringValue : "";

		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Physician.NAME, XPathResult.STRING_TYPE);
		this.name = (value && value.stringValue) ? value.stringValue : "";

	}
};
/**
 * It provides physician full name
 */
HIN.PhysicianVO.prototype.fullName = function() {
	var name = "";
	if (this.prefixName) {
		name += ' ' + this.prefixName;
	}
	if (this.givenName) {
		name += ' ' + this.givenName;
	}
	if (this.familyName) {
		name += ' ' + this.familyName;
	}
	if (this.suffixName) {
		name += ' ' + this.suffixName;
	}
	this.name = jQuery.trim(name);
	return this.name;
};

HIN.PhysicianVO.prototype.toString = function() {
	return "PhysicianVO : [" + this.id + " , " + this.physicianId + " , "
			+ this.prefixName + " , " + this.givenName + " , "
			+ this.familyName + " , " + this.suffixName + ", " + this.name
			+ "]";
};