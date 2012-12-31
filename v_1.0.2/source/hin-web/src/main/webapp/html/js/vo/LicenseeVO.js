var HIN;
if (!HIN)
	HIN = {};
/**
 * LicenseeVO is nothing but a value object which hold the licensee relevant
 * information
 */
HIN.LicenseeVO = function() {
	/**
	 * subscriberId holds unique id.
	 */
	this.subscriberId = null;
	/**
	 * message holds stringified xml
	 */
	this.message = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	/**
	 * licenseeEmail holds email of the licensee
	 */
	this.licenseeEmail = null;
	this.licenseePassword = null;
	this.licenseeAttachment = new HIN.HashMap();
	this.licenseeAttachmentName = new Array();
	/**
	 * currency holds currency of the licensee
	 */
	this.currency = null;
	/**
	 * currencyCode holds currency code of the licensee
	 */
	this.currencyCode = null;
	/**
	 * currencySymbol holds currency symbol of the licensee
	 */
	this.currencySymbol = null;
	/**
	 * exchangeRate holds exchange Rate of the currency
	 */
	this.exchangeRate = null;
	this.emailContent = null;
	this.expiryDate = null;
	this.emailProductContent = null;
	
};
/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.LicenseeVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};
/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.LicenseeVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Licensee.SUBSCRIBER_ID,
				XPathResult.STRING_TYPE);
		this.subscriberId = (value && value.stringValue) ? value.stringValue
				: "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Licensee.LICENSEE_EMAIL,
				XPathResult.STRING_TYPE);
		this.licenseeEmail = (value && value.stringValue) ? value.stringValue
				: "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Licensee.LICENSEE_PASSWORD,
				XPathResult.STRING_TYPE);
		this.licenseePassword = (value && value.stringValue) ? value.stringValue
				: "";

		var currencyObject = XmlUtil.getXPathResult(message,
				"message/LICENSEE/currency/code/code", XPathResult.STRING_TYPE);
		this.currency = (currencyObject && currencyObject.stringValue) ? currencyObject.stringValue
				: "AED";

		var expiryDateObject = XmlUtil.getXPathResult(message,
				"message/LICENSEE/licenseExpiry/expiryDate/value",
				XPathResult.STRING_TYPE);
		this.expiryDate = (expiryDateObject && expiryDateObject.stringValue) ? expiryDateObject.stringValue
				: "";

		var emailContentObject = XmlUtil.getXPathResult(message,
				"message/LICENSEE/text/thumbnail", XPathResult.STRING_TYPE);
		this.emailContent = (emailContentObject && emailContentObject.stringValue) ? emailContentObject.stringValue
				: "";
		
		var emailProductContentObject = XmlUtil.getXPathResult(message, "message/LICENSEE/emailProductContent/text/thumbnail", XPathResult.STRING_TYPE);
		this.emailProductContent = (emailProductContentObject && emailProductContentObject.stringValue) ? emailProductContentObject.stringValue : "";
		
		var messageXml = XmlUtil.findByName(message, "message", true);
		var licenseeFragment = XmlUtil.findByName(messageXml, "LICENSEE", true);
		var idFragment = XmlUtil.findByName(licenseeFragment, "id", true);
		if (idFragment) {
			idFragment = XmlUtil.findByName(licenseeFragment, "id", false);
			for (i = 0; i < idFragment.length; i++) {
				var attachment = XmlUtil.getXPathResult(message,
						"message/LICENSEE/desc[" + (i + 1)
								+ "]/reference/value", XPathResult.STRING_TYPE);
				var attachmentName = XmlUtil
						.getXPathResult(message, "message/LICENSEE/desc["
								+ (i + 1) + "]/language/value",
								XPathResult.STRING_TYPE);
				// alert("attachmentName: " + attachmentName.stringValue + "
				// :attachment : "+attachment.stringValue);

				if (attachmentName.stringValue.length > 1
						&& attachment.stringValue.length > 1) {
					this.licenseeAttachmentName
							.push((attachmentName && attachmentName.stringValue) ? attachmentName.stringValue
									: "");
					this.licenseeAttachment
							.put(
									(attachment && attachment.stringValue) ? attachment.stringValue
											: "",
									(attachmentName && attachmentName.stringValue) ? attachmentName.stringValue
											: "");
				}
			}
		}
	}

};
HIN.LicenseeVO.prototype.toString = function() {
	return "[" + this.subscriberId + " , " + this.message + " , "
			+ this.exchangeRate + " , " + this.licenseeEmail + " , "
			+ this.licenseePassword + " , " + this.currencyCode + " , "
			+ this.currencySymbol + " , " + this.emailContent + "]";
};