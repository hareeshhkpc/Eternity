var HIN;
if (!HIN)
	HIN = {};
/**
 * StaffVO is nothing but a value object which hold the staff relevant
 * information
 */
HIN.StaffVO = function() {
	/**
	 * subscriberId holds unique id.
	 */
	this.subscriberId = null;
	this.roles = null;
	/**
	 * name holds the name of the staff.
	 */
	this.name = null;
	this.nameType = null;
	/**
	 * prefix holds prefix name of the staff
	 */
	this.prefix = null;
	/**
	 * givenName holds given name of the staff
	 */
	this.given = null;
	/**
	 * family holds family name of the staff
	 */
	this.family = null;
	/**
	 * suffix holds suffix name of the staff
	 */
	this.suffix = null;
	/**
	 * message holds stringified xml
	 */
	this.message = null;

	this.image = null;
	/**
	 * gender holds gender of the staff
	 */
	this.gender = null;

	this.consultant = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	this.userName = "";
	this.password = "";
};
/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.StaffVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.StaffVO.prototype.setMessage = function(message) {

	this.message = message;
	/*
	 * get identifiedPerson child nodes.
	 */

	// alert("generateId : " + XmlUtil.xmlToString(message));
	var messageNode = XmlUtil.findByName(message, "message", true);

	if (messageNode) {
		var node = XmlUtil.findByName(messageNode, "PRPA_MT201000HT03", true);

		if (node) {

			var dataXPath = AppConstants.XPaths.PRPA_MT201000HT03.SUBSCRIBER_ID;
			// alert(dataXPath);
			try {
				var value = XmlUtil.getXPathResult(message, dataXPath,
						XPathResult.STRING_TYPE);
				value = (value && value.stringValue) ? value.stringValue : "";
				this.subscriberId = value;
				// alert(this.subscriberId);
			} catch (e) {
				alert("Element does not exist : " + e);
			}

			var identifiedPerson = XmlUtil.findByName(node, "identifiedPerson",
					true);
			if (identifiedPerson) {

				/*
				 * set subscriberId.
				 */
				/*
				 * try { this.subscriberId = XmlUtil.attr(XmlUtil.findByName(
				 * identifiedPerson, "id", true), "extension"); } catch (e) {
				 * console.log("element does not exist"); }
				 */

				/*
				 * set gender.
				 */
				var administrativeGenderCode = XmlUtil.findByName(
						identifiedPerson, "administrativeGenderCode", true);
				if (administrativeGenderCode) {
					var genderNode = XmlUtil.findByName(identifiedPerson,
							"administrativeGenderCode", true);
					if (genderNode) {
						try {

							this.gender = XmlUtil.text(XmlUtil.findByName(
									genderNode, "code", true));
						} catch (e) {
							console.log("Element does not exist");
						}
					}
				}

				/*
				 * set name.
				 */
				var nameNode = XmlUtil.findByName(identifiedPerson, "name",
						true)

				if (nameNode) {
					var name = "";
					try {
						if (XmlUtil.text(XmlUtil.findByName(nameNode, "use",
								true))) {
							this.nameType = XmlUtil.text(XmlUtil.findByName(
									nameNode, "use", true));
							name = this.nameType;
						}
					} catch (e) {
						console.log("Element does not exist");
					}

					try {
						if (XmlUtil.text(XmlUtil.findByName(nameNode, "prefix",
								true))) {
							this.prefix = XmlUtil.text(XmlUtil.findByName(
									nameNode, "prefix", true));
							name = this.prefix;
						}
					} catch (e) {
						console.log("Element does not exist");
					}
					try {
						if (XmlUtil.text(XmlUtil.findByName(nameNode, "given",
								true))) {
							this.given = XmlUtil.text(XmlUtil.findByName(
									nameNode, "given", true));
							name += " " + this.given;
						}
					} catch (e) {
						console.log("Element does not exist");
					}
					try {
						if (XmlUtil.text(XmlUtil.findByName(nameNode, "family",
								true))) {
							this.family = XmlUtil.text(XmlUtil.findByName(
									nameNode, "family", true));
							name += " " + this.family;
						}
					} catch (e) {
						console.log("Element does not exist");
					}
					try {
						if (XmlUtil.text(XmlUtil.findByName(nameNode, "suffix",
								true))) {
							this.suffix = XmlUtil.text(XmlUtil.findByName(
									nameNode, "suffix", true));
							name += " " + this.suffix;
						}
					} catch (e) {
						console.log("Element does not exist");
					}
					this.name = jQuery.trim(name);
				}

				/*
				 * set image.
				 */
				var descNode = XmlUtil.findByName(identifiedPerson, "desc",
						true);
				if (descNode) {
					try {
						this.image = XmlUtil.text(XmlUtil.findByName(descNode,
								"thumbnail", true));
					} catch (e) {
						console.log("Element does not exist");
					}
				}
			}

			/*
			 * set userName
			 */
			var value = XmlUtil
					.getXPathResult(message,
							AppConstants.XPaths.Staff.USERNAME,
							XPathResult.STRING_TYPE);
			this.userName = (value && value.stringValue) ? value.stringValue
					: "";

			/*
			 * set password
			 */
			var value = XmlUtil
					.getXPathResult(message,
							AppConstants.XPaths.Staff.PASSWORD,
							XPathResult.STRING_TYPE);
			this.password = (value && value.stringValue) ? value.stringValue
					: "";
		}

	}

};
HIN.StaffVO.prototype.toString = function() {
	return "[" + this.subscriberId + " , " + this.name + " , " + this.roles
			+ " , " + this.image + " , " + this.message + " , " + this.gender
			+ " , " + this.consultant + " , " + this.userName + " , "
			+ this.password + "]";
};
