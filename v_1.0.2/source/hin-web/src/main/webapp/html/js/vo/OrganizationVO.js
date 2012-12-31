var HIN;
if (!HIN)
	HIN = {};
/**
 * OrganizationVO is nothing but a value object which hold the organization
 * relevant information
 */
HIN.OrganizationVO = function() {
	/**
	 * subscriberId holds unique id.
	 */
	this.subscriberId = null;
	/**
	 * name holds the name of the organization.
	 */
	this.name = "";
	/**
	 * message holds stringified xml
	 */
	this.message = null;
	/**
	 * image holds the image/logo of the organization.
	 */
	this.image = null;
	/**
	 * addr holds the addr of the organization.
	 */
	this.addr = null;
	/**
	 * msg holds message xml document
	 */
	this.msg = null;
	/**
	 * licenseeId holds the licensee id of the organization.
	 */
	this.licenseeId = null;
	/**
	 * name regionCode the region code of the organization.
	 */
	this.regionCode = null;
	/**
	 * regionName holds the region name of the organization.
	 */
	this.regionName = null;
	/**
	 * houseNumber holds the house number of the organization.
	 */
	this.houseNumber = null;
	/**
	 * streetName holds the street name of the organization.
	 */
	this.streetName = null;
	/**
	 * city holds the city of the organization.
	 */
	this.city = null;
	/**
	 * state holds the state of the organization.
	 */
	this.state = null;
	/**
	 * country holds the country of the organization.
	 */
	this.country = null;
	/**
	 * postalCode holds the postal code of the organization.
	 */
	this.postalCode = null;
	/**
	 * contactType holds the contact type of the organization.
	 */
	this.contactType = null;
	/**
	 * telecom holds the contact number of the organization.
	 */
	this.telecom = null;

	this.nameType = null;

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
HIN.OrganizationVO.prototype.setMsg = function(msg) {
	this.msg = msg;
};

/**
 * set stringify message document object
 * 
 * @param message :
 *            Its a string value of msg document.
 * @returns {void}
 */
HIN.OrganizationVO.prototype.setMessage = function(message) {
	if (message) {
		this.message = message;
		/*
		 * set subscriberId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.SUBSCRIBER_ID,
				XPathResult.STRING_TYPE);
		this.subscriberId = (value && value.stringValue) ? value.stringValue
				: "";

		/*
		 * set nameType
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.NAME_TYPE,
				XPathResult.STRING_TYPE);
		this.nameType = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set prefixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.PREFIX_NAME,
				XPathResult.STRING_TYPE);
		this.prefixName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.prefixName) ? this.prefixName : "";
		/*
		 * set givenName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.GIVEN_NAME,
				XPathResult.STRING_TYPE);
		this.givenName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.givenName) ? this.name + " " + this.givenName
				: this.name;
		/*
		 * set familyName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.FAMILY_NAME,
				XPathResult.STRING_TYPE);
		this.familyName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.familyName) ? this.name + " " + this.familyName
				: this.name;
		/*
		 * set sufixName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.SUFIX_NAME,
				XPathResult.STRING_TYPE);
		this.sufixName = (value && value.stringValue) ? value.stringValue : "";
		this.name = (this.sufixName) ? this.name + " " + this.sufixName
				: this.name;
		/*
		 * set image
		 */
		/*
		 * var value = XmlUtil.getXPathResult(message,
		 * AppConstants.XPaths.Organization.IMAGE, XPathResult.STRING_TYPE);
		 * this.image = (value && value.stringValue) ? value.stringValue : "";
		 */
		/*
		 * set regionCode
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.REGION_CODE,
				XPathResult.STRING_TYPE);
		this.regionCode = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set regionName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.REGION_NAME,
				XPathResult.STRING_TYPE);
		this.regionName = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set houseNumber
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.HOUSE_NUMBER,
				XPathResult.STRING_TYPE);
		this.houseNumber = (value && value.stringValue) ? value.stringValue
				: "";
		this.addr = (this.houseNumber) ? this.houseNumber : "";
		/*
		 * set streetName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.STREET_NAME,
				XPathResult.STRING_TYPE);
		this.streetName = (value && value.stringValue) ? value.stringValue : "";
		this.addr = (this.streetName) ? this.addr + " " + this.streetName
				: this.addr;

		/*
		 * set city
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.CITY, XPathResult.STRING_TYPE);
		this.city = (value && value.stringValue) ? value.stringValue : "";
		this.addr = (this.city) ? this.addr + " " + this.city : this.addr;

		/*
		 * set sate
		 */
		var value = XmlUtil
				.getXPathResult(message,
						AppConstants.XPaths.Organization.STATE,
						XPathResult.STRING_TYPE);
		this.state = (value && value.stringValue) ? value.stringValue : "";
		this.addr = (this.state) ? this.addr + " " + this.state : this.addr;

		/*
		 * set country
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.COUNTRY,
				XPathResult.STRING_TYPE);
		this.country = (value && value.stringValue) ? value.stringValue : "";
		this.addr = (this.country) ? this.addr + " " + this.country : this.addr;

		/*
		 * set postalCode
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.POSTAL_CODE,
				XPathResult.STRING_TYPE);
		this.postalCode = (value && value.stringValue) ? value.stringValue : "";

		this.addr = (this.postalCode.length > 0) ? this.addr + " "
				+ this.postalCode : this.addr;

		/*
		 * set contactType
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.CONTACT_TYPE,
				XPathResult.STRING_TYPE);
		this.contactType = (value && value.stringValue) ? value.stringValue
				: "";
		/*
		 * set telecom
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.CONTACT_VALUE,
				XPathResult.STRING_TYPE);
		this.telecom = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set licenseeId
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.LICENSEE_ID,
				XPathResult.STRING_TYPE);
		this.licenseeId = (value && value.stringValue) ? value.stringValue : "";

		/*
		 * set userName
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.USERNAME,
				XPathResult.STRING_TYPE);
		this.userName = (value && value.stringValue) ? value.stringValue : "";
		/*
		 * set password
		 */
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Organization.PASSWORD,
				XPathResult.STRING_TYPE);
		this.password = (value && value.stringValue) ? value.stringValue : "";

	}
};
HIN.OrganizationVO.prototype.toString = function() {
	return "[" + this.subscriberId + " , " + this.name + " , " + this.telecom
			+ " , " + this.addr + " , " + this.image + " , " + this.message
			+ " , " + this.licenseeId + " , " + this.country + " , "
			+ this.username + " , " + this.password + "]";
};
