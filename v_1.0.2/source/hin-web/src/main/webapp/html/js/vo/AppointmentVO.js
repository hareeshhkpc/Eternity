var HIN;
if (!HIN)
	HIN = {};
HIN.AppointmentVO = function() {
	this.id = null;
	this.title = null;
	this.start = null;
	this.end = null;
	this.img = null;
	this.allDay = false;
	this.backgroundColor = null;
	this.patientId = null;
	this.doctorId = null;
	this.doctor = null;
	this.reason = null;
	this.comment = null;
	this.isCurrent = false;
	this.physician = new HIN.PhysicianVO();
	this.message = null;
	this.msg = null;
	this.msgObject = null;
	this.className = [];
	this.editable = true;
	this.messageTitle = null;
	this.reScheduled = false;
};
HIN.AppointmentVO.prototype.setMsg = function(msg) {
	this.msg = msg;
}
HIN.AppointmentVO.prototype.setMsgObject = function(msgObject) {
	this.msgObject = msgObject;
}

HIN.AppointmentVO.prototype.setMessage = function(message) {
	var patientName, patientId, consultantId, givenName,prefixName,familyName,suffixName,reasonCode, comment, fromDate, toDate = "";
	var thumbnail = null;
	if (message) {
		
		this.message = message;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.PATIENT_NAME,
				XPathResult.STRING_TYPE);
		patientName = (value && value.stringValue) ? value.stringValue
				: patientName;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.PATIENT_ID,
				XPathResult.STRING_TYPE);
		patientId = (value && value.stringValue) ? value.stringValue
				: patientId;
		
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.REASONCODE,
				XPathResult.STRING_TYPE);
		reasonCode = (value && value.stringValue) ? value.stringValue
				: reasonCode;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.COMMENTS,
				XPathResult.STRING_TYPE);
		comment = (value && value.stringValue) ? value.stringValue : comment;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.DATE_FROM,
				XPathResult.STRING_TYPE);
		fromDate = (value && value.stringValue) ? value.stringValue : fromDate;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.DATE_TO,
				XPathResult.STRING_TYPE);
		toDate = (value && value.stringValue) ? value.stringValue : toDate;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.THUMBNAIL,
				XPathResult.STRING_TYPE);
		thumbnail = (value && value.stringValue) ? value.stringValue
				: thumbnail;
		//*** start Physician Details///
		
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_GIVEN,
				XPathResult.STRING_TYPE);
		this.physician.givenName = (value && value.stringValue) ? value.stringValue : givenName;		

		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_PREFIX,
				XPathResult.STRING_TYPE);
		this.physician.prefixName = (value && value.stringValue) ? value.stringValue : prefixName;

		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_SUFFIX,
				XPathResult.STRING_TYPE);
		this.physician.suffixName = (value && value.stringValue) ? value.stringValue : suffixName;		

		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_FAMILY,
				XPathResult.STRING_TYPE);
		this.physician.familyName = (value && value.stringValue) ? value.stringValue : familyName;
		
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_NAME,
				XPathResult.STRING_TYPE);
		this.physician.name = (value && value.stringValue) ? value.stringValue : "";
		
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.MESSAGE_TITLE,
				XPathResult.STRING_TYPE);
		this.messageTitle = (value && value.stringValue) ? value.stringValue : "";
		
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_ID,
				XPathResult.STRING_TYPE);
		consultantId = (value && value.stringValue) ? value.stringValue : consultantId;
		
		this.physician.physicianId = consultantId;
		//*** end Physician Details///
		this.id = idGenerator.getId();
		this.doctor = this.physician.name;
		this.doctorId = consultantId;
		
		this.reason = reasonCode;		
		this.backgroundColor = reasonCode;
			
		this.patientId = patientId;
		this.img = thumbnail;
		this.title = patientName;
		if(this.messageTitle == AppConstants.XPaths.Appointment.BLOCK_CODE){
			//this.title = comment;
			this.isCurrent = true;
		}
		this.start = parseDate(fromDate);
		this.end = parseDate(toDate);
		this.comment = comment;
		this.allDay = false;
		//alert(this+", \n "+this.physician);
	} else {
		//alert("TO DO");
	}
};
HIN.AppointmentVO.prototype.setBlockingMessage = function(message) {
	if(message){
		this.message = message;
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.REASONCODE,
				XPathResult.STRING_TYPE);
		this.backgroundColor = (value && value.stringValue) ? value.stringValue
				: "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.COMMENTS,
				XPathResult.STRING_TYPE);
		this.comment = (value && value.stringValue) ? value.stringValue : "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.DATE_FROM,
				XPathResult.STRING_TYPE);
		this.start = (value && value.stringValue) ? value.stringValue : "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.DATE_TO,
				XPathResult.STRING_TYPE);
		this.end = (value && value.stringValue) ? value.stringValue : "";
		var value = XmlUtil.getXPathResult(message,
				AppConstants.XPaths.Appointment.CONSULTANT_ID,
				XPathResult.STRING_TYPE);
		this.doctorId = (value && value.stringValue) ? value.stringValue : "";
		this.title = this.comment;
	}
};
HIN.AppointmentVO.prototype.toString = function() {
	return "AppointmentVO : [" + this.id + " , " + this.patientId + " , " + this.title + " , "+this.doctor+" , "+this.messageTitle+" , "
			+ this.start + " , " + this.end + "]";
};