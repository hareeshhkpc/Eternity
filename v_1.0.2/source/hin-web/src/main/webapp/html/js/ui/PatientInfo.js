var HIN;
if (!HIN)
	HIN = {};

HIN.PatientInfo = function(appController) {
	this.appController = appController;
	thisObject = this;
}

HIN.PatientInfo.prototype.fetchPatientInfo = function() {
	var patientName = null;
	var date = null;
	var program = null;
	var dob = null;
	var client_number = null;

	var programVo = thisObject.appController.getComponent("Context")
			.getProgramVO(programVo);
	if (programVo) {
		program = programVo.code;
		// alert(program_name);
	}

	var patientVo = thisObject.appController.getComponent("Context")
			.getPatientVO(patientVo);
	if (patientVo) {
			patientName = patientVo.name;
			dob =  patientVo.dob;
			//client_number = patientVo.
		//alert(dob);
	}

	var patientInfo = [ {
		"patient" : patientName,
		"dob" : dob,
		"program" : program,
		"date" : "27-08-2012"
	} ];

	return patientInfo;
}

