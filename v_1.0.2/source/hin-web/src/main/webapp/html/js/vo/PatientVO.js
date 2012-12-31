var HIN;
if (!HIN)
	HIN = {};
/**
 * PatientVO is nothing but a value object which hold the patient relevant
 * information
 */
HIN.PatientVO = function() {
	/**
	 * subscriberId holds unique id.
	 */
	this.subscriberId = null;
	this.roles = null;
	/**
	 * name holds name of the patient
	 */
	this.name = "";
	this.nameType = "";
	/**
	 * givenName holds given name of the patient
	 */
	this.givenName = "";
	/**
	 * prefixName holds prefix name of the patient
	 */
	this.prefixName = "";
	/**
	 * familyName holds family name of the patient
	 */
	this.familyName = "";
	/**
	 * suffixName holds suffix name of the patient
	 */
	this.suffixName = "";
	/**
	 * message holds stringified xml
	 */
	this.message = null;
	this.image = null;
	this.gender = null;
	this.consultant = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	/**
	 * dob holds date of birth of the patient
	 */
	this.dob = null;
	this.programId = null;
	this.consultantId = null;
	this.assigningOrganizationID = null;
	/**
	 * emailAddress holds email addresses of the patient
	 */
	this.emailAddress = [];
	this.isEmailAvailable = false;
	/**
	 * membershipId holds membershipId of the patient
	 */
	this.membershipId = null;
};

/**
 * set message document object
 * 
 * @param msg :
 *            Its an object of msg document.
 * @returns {void}
 */
HIN.PatientVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.PatientVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;
		// alert(XmlUtil.xmlToString(message));
		/*
		 * set subscriberId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.SUBSCRIBER_ID,
				XPathResult.STRING_TYPE);
		this.subscriberId = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set assigningOrganizationID
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.ASSIGNING_ORGANIZATION_ID,
				XPathResult.STRING_TYPE);
		this.assigningOrganizationID = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set consultantId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.CONSULTANT_ID,
				XPathResult.STRING_TYPE);
		this.consultantId = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set programId
		 */
		var value = XmlUtil
				.getXPathResult(message,
						AppConstants.XPaths.Patient.PROGRAM_ID,
						XPathResult.STRING_TYPE);
		this.programId = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set nameType
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.NAME_TYPE, XPathResult.STRING_TYPE);
		this.nameType = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set prefixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.PREFIX_NAME,
				XPathResult.STRING_TYPE);
		this.prefixName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.prefixName) ? this.prefixName : "";
		/*
		 * set givenName
		 */
		var value = XmlUtil
				.getXPathResult(message,
						AppConstants.XPaths.Patient.GIVEN_NAME,
						XPathResult.STRING_TYPE);
		this.givenName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.givenName) ? this.name + " " + this.givenName
				: this.name;
		/*
		 * set familyName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.FAMILY_NAME,
				XPathResult.STRING_TYPE);
		this.familyName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.familyName) ? this.name + " " + this.familyName
				: this.name;
		/*
		 * set sufixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.SUFFIX_NAME,
				XPathResult.STRING_TYPE);
		this.suffixName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.suffixName) ? this.name + " " + this.suffixName
				: this.name;
		/*
		 * set gender
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.GENDER, XPathResult.STRING_TYPE);
		this.gender = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set dob
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.DOB, XPathResult.STRING_TYPE);
		this.dob = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set image
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.IMAGE, XPathResult.STRING_TYPE);
		this.image = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set membershipId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.MEMBERSHIP_ID,
				XPathResult.STRING_TYPE);
		this.membershipId = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set email
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Patient.EMAIL_ID,
				XPathResult.ORDERED_NODE_ITERATOR_TYPE);
		var res = null;
		if (value) {
			while (res = value.iterateNext()) {
				this.emailAddress.push(res.textContent);
				this.isEmailAvailable = true;
			}
		}

	}
};

HIN.PatientVO.prototype.toString = function() {
	return "[" + this.subscriberId + " , " + this.name + " , " + this.roles
			+ " , " + this.image + " , " + this.message + " , " + this.gender
			+ " , " + this.consultant + "," + this.dob + " , " + this.name
			+ " , " + this.programId + " , " + this.consultantId + " , "
			+ this.assigningOrganizationID + " , " + this.isEmailAvailable
	"]";
};