var HIN;
if (!HIN)
	HIN = {};
/**
 * UserVO is nothing but a value object which hold the user relevant information
 */
HIN.UserVO = function() {
	/**
	 * subscriberId holds unique id.
	 */
	this.subscriberId = null;
	/**
	 * name holds the name of the staff.
	 */
	this.name = "";
	this.userName = "";
	this.password = "";
	/**
	 * roles holds the multiple roles of the staff
	 */
	this.roles = null;
	/**
	 * privileges holds the multiple privileges of the staff
	 */
	this.privileges = null;
	/**
	 * message holds stringified xml
	 */
	this.message = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	this.image = null;
	this.gender = null;
	this.profileProcessInstanceID = null;
	this.assigningOrganizationID = null;
	this.artifactID = "";
};
/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.UserVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.UserVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;

		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.User.ARTIFACT_ID, XPathResult.STRING_TYPE);
		this.artifactID = (value && value.stringValue) ? value.stringValue : "";

		if (this.artifactID == "COCT_MT150000HT04") {
			var value = XmlUtil.getXPathResult(message,
					AppConstants.XPaths.Organization.SUBSCRIBER_ID,
					XPathResult.STRING_TYPE);
			this.assigningOrganizationID = (value && value.stringValue) ? value.stringValue
					: "";
		} else {

			var value = XmlUtil.getXPathResult(message,
					AppConstants.XPaths.User.ASSIGNING_ORGANIZATION_ID,
					XPathResult.STRING_TYPE);
			this.assigningOrganizationID = (value && value.stringValue) ? value.stringValue
					: "";

			/*
			 * var value = XmlUtil.getXPathResult(message,
			 * AppConstants.XPaths.User.SUBSCRIBER_ID, XPathResult.STRING_TYPE);
			 * this.subscriberId = (value && value.stringValue) ?
			 * value.stringValue:"";
			 */

			var value = XmlUtil.getXPathResult(message,
					AppConstants.XPaths.User.USERNAME, XPathResult.STRING_TYPE);
			this.userName = (value && value.stringValue) ? value.stringValue
					: "";

			var value = XmlUtil.getXPathResult(message,
					AppConstants.XPaths.User.PASSWORD, XPathResult.STRING_TYPE);
			this.password = (value && value.stringValue) ? value.stringValue
					: "";

			var value = XmlUtil.getXPathResult(message,
					AppConstants.XPaths.User.GENDER, XPathResult.STRING_TYPE);
			this.gender = (value && value.stringValue) ? value.stringValue : "";

		}

	}
};
HIN.UserVO.prototype.havePrivilege = function(Privilege) {
	if (Privilege) {
		for ( var key = 0; key < this.privileges.length; key++) {
			var value = this.privileges[key];
			if (value.toLowerCase() === Privilege) {
				return true;
			}
		}
	}
	return false;
};

HIN.UserVO.prototype.toString = function() {
	return "[" + this.subscriberId + " , " + this.name + " , " + this.userName
			+ " , " + this.password + " , " + this.roles + " , "
			+ this.privileges + " , " + this.message + " , " + this.image
			+ " , " + this.gender + " , " + this.profileProcessInstanceID
			+ " , " + this.assigningOrganizationID + "]";
};