var HIN;
if (!HIN)
	HIN = {};
/**
 * ProgramVO is nothing but a value object which hold the program relevant
 * information
 */
HIN.ProgramVO = function() {
	/**
	 * id holds unique id.
	 */
	this.id = null;
	/**
	 * displayName holds program display name.
	 */
	this.displayName = null;
	/**
	 * displayName holds program code.
	 */
	this.code = null;
	/**
	 * message holds stringified xml
	 */
	this.message = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;

};
/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.ProgramVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};
/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.ProgramVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;

		/*
		 * set id
		 */
		var messageAndUIBinder = new MessageAndUIBinder(null, this.msg,
				AppConstants.XPaths.Program.MESSAGE_TYPE);
		this.id = messageAndUIBinder.getIdRootValue("HIN_MSG_ID");

		/*
		 * set code
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Program.CODE, XPathResult.STRING_TYPE);
		this.code = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set display name
		 */
		AppConstants.XPaths.Program.DISPALY
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Program.DISPALY, XPathResult.STRING_TYPE);
		this.displayName = (value && value.stringValue) ? value.stringValue
				: "";
	}

};

HIN.ProgramVO.prototype.toString = function() {
	return "[" + this.id + " , " + this.displayName + "," + this.code + "]";
};
