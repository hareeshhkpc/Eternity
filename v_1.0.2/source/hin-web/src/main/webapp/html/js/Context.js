/**
 * Context is a child component of Application Controller which keeps the user
 * information coming from data Layer Context has information regarding logged
 * in user like whether he/she logged in or not and user name, his/her contacts
 * list, organization list etc. Once the user logged in, it gets the user
 * information from Data layer through Application Controller and sets the
 * Context. Information in Context can be sent to any component through
 * Application Controller for further processing.
 */

function Context(appController) {
	/** className is used to refer the Context class name in other components */
	this.className = "Context";

	/**
	 * Handles the events from Application Controller. It checks the type of
	 * event, depending on the type of event, it performs required action.
	 * 
	 * @param event :
	 *            It is an object. It contains event type, event data, event
	 *            source and event broadcaster
	 */
	this.eventHandler = eventHandler;

	/** context is used to refer the Context class object */
	var context = this;

	/** appController is used to refer the Application Controller */
	var appController = appController;

	var contextMap = new HIN.HashMap();
	this.userVo = null;
	this.staffVo = null;

	this.getUserVo = getUserVo;
	this.setUserVo = setUserVo;

	this.getStaffVo = getStaffVo;
	this.setStaffVo = setStaffVo;

	this.searchVO = null;
	this.getSearchVO = getSearchVO;
	this.setSearchVO = setSearchVO;

	this.messageVO = null;
	this.getMessageVO = getMessageVO;
	this.setMessageVO = setMessageVO;

	this.profileVO = null;
	this.getProfileVO = getProfileVO;
	this.setProfileVO = setProfileVO;

	this.physicianVO = null;
	this.getPhysicianVO = getPhysicianVO;
	this.setPhysicianVO = setPhysicianVO;
	this.clearPhysicianContext = clearPhysicianContext;

	this.appointmentVO = null;
	this.getAppointmentVO = getAppointmentVO;
	this.setAppointmentVO = setAppointmentVO;
	this.clearAppointmentVOContext = clearAppointmentVOContext;

	this.messageType = null;
	this.getMessageType = getMessageType;
	this.setMessageType = setMessageType;

	this.clearSearchContext = clearSearchContext; // Search field and message

	this.steps = null;
	this.getSteps = getSteps;
	this.setSteps = setSteps;

	this.user = null;
	this.getUser = getUser;
	this.setUser = setUser;

	this.patient = null;
	this.getPatient = getPatient;
	this.setPatient = setPatient;

	this.staff = null;
	this.getStaff = getStaff;
	this.setStaff = setStaff;

	this.licensee = null;
	this.getLicensee = getLicensee;
	this.setLicensee = setLicensee;

	this.organization = null;
	this.getOrganization = getOrganization;
	this.setOrganization = setOrganization;

	this.addInContext = addInContext;
	this.getFromContext = getFromContext;
	this.deleteFromContext = deleteFromContext;

	this.consultant = null;
	this.getConsultant = getConsultant;
	this.setConsultant = setConsultant;

	this.consultantName = null;
	this.getConsultantName = getConsultantName;
	this.setConsultantName = setConsultantName;

	this.checkinState = null;
	this.getCheckinState = getCheckinState;
	this.setCheckinState = setCheckinState;
	this.clearCheckinState = clearCheckinState;

	this.calendarQuery = null;
	this.getCalendarQuery = getCalendarQuery;
	this.setCalendarQuery = setCalendarQuery;

	this.patientVO = null;
	this.getPatientVO = getPatientVO;
	this.setPatientVO = setPatientVO;
	this.clearPatientVOContext = clearPatientVOContext;

	this.licenseeVO = null;
	this.getLicenseeVO = getLicenseeVO;
	this.setLicenseeVO = setLicenseeVO;

	this.organizationVO = null;
	this.getOrganizationVO = getOrganizationVO;
	this.setOrganizationVO = setOrganizationVO;
	this.clearOrganizationVOContext = clearOrganizationVOContext;

	this.documentsVO = null;
	this.getDocumentsVO = getDocumentsVO;
	this.setDocumentsVO = setDocumentsVO;

	this.registrationType = null;
	this.getRegistrationType = getRegistrationType;
	this.setRegistrationType = setRegistrationType;

	this.appointment = null;
	this.getAppointment = getAppointment;
	this.setAppointment = setAppointment;

	this.selectedProfile = null;
	this.getSelectedProfile = getSelectedProfile;
	this.setSelectedProfile = setSelectedProfile;
	this.clearSelectedProfileContext = clearSelectedProfileContext;
	this.signUp = false;
	this.isSignUp = isSignUp;
	this.setSignUp = setSignUp;

	this.roleId = null;
	this.getRoleId = getRoleId;
	this.setRoleId = setRoleId;

	this.subscriberId = null;
	this.getSubscriberId = getSubscriberId;
	this.setSubscriberId = setSubscriberId;

	this.currentScheduledMap = new HIN.HashMap();
	this.navigationId = null;
	this.setNavigationId = setNavigationId;
	this.getNavigationId = getNavigationId;

	this.programVO = null;
	this.getProgramVO = getProgramVO;
	this.setProgramVO = setProgramVO;

	this.selectedLicenseeVO = null;
	this.getSelectedLicenseeVO = getSelectedLicenseeVO;
	this.setSelectedLicenseeVO = setSelectedLicenseeVO;

	this.selectedOrganizationVO = null;
	this.getSelectedOrganizationVO = getSelectedOrganizationVO;
	this.setSelectedOrganizationVO = setSelectedOrganizationVO;
	this.clearSelectedOrganizationVOContext = clearSelectedOrganizationVOContext;

	this.backToPatientHome = false;
	this.getBackToPatientHome = getBackToPatientHome;
	this.setBackToPatientHome = setBackToPatientHome;

	this.patientRegistrationProcessDefinition = null;
	this.getPatientRegistrationProcessDefinition = getPatientRegistrationProcessDefinition;
	this.setPatientRegistrationProcessDefinition = setPatientRegistrationProcessDefinition;

	this.staffRegistrationProcessDefinition = null;
	this.getStaffRegistrationProcessDefinition = getStaffRegistrationProcessDefinition;
	this.setStaffRegistrationProcessDefinition = setStaffRegistrationProcessDefinition;

	this.contactPersonProcessDefinition = null;
	this.getContactPersonProcessDefinition = getContactPersonProcessDefinition;
	this.setContactPersonProcessDefinition = setContactPersonProcessDefinition;

	this.isPatientTransfer = false;
	this.getIsPatientTransfer = getIsPatientTransfer;
	this.setIsPatientTransfer = setIsPatientTransfer;

	this.navigationMap = new HIN.HashMap();
	this.setNavigationMap = setNavigationMap;
	this.getNavigationMap = getNavigationMap;
	this.clearNavigationMap = clearNavigationMap;

	/* Function definitions */
	function eventHandler(event) {
		// alert("inside Context event handler: " + event.type);
		if (event.type == AppConstants.Event.APPLICATION_INITIALIZED) {
			// alert("event handler in context");

		} else if (event.type == AppConstants.Event.CLEAR_SEARCH_CONTEXT) {
			this.clearSearchContext();

		} else if (event.type == AppConstants.Event.CLEAR_CONTEXT) {
			/*
			 * this.programVO = null; this.searchVO = null; this.patientVO =
			 * null; this.deleteFromContext();
			 */
		}

	}
	;

	function addInContext(key, value) {
		var map = contextMap.get(key);

		if (map == null) {
			contextMap.put(key, value);
		} else {
			map.value = value;
		}
		/* this.contextMap = contextMap; */
	}
	;

	function getFromContext(key) {
		if (contextMap.get(key)) {
			return contextMap.get(key).value;
		} else {
			// alert("No context available");
			return null;
		}
	}
	;

	function deleteFromContext() {
		contextMap.clearItems();
	}
	;

	/**
	 * Return the logged user from the context
	 * 
	 * @returns {UserVo}
	 */
	function getUserVo() {
		return this.userVo;
	}
	;

	/**
	 * Set the logged user to the context
	 * 
	 * @param userVo:
	 *            Its an object of userVo
	 * @returns {void}
	 */
	function setUserVo(userVo) {
		this.userVo = userVo;
	}
	;

	/**
	 * Return the selected staff from the context
	 * 
	 * @returns {StaffVo}
	 */
	function getStaffVo() {
		return this.staffVo;
	}
	;

	/**
	 * Set the selected staff to the context
	 * 
	 * @param staffVo:
	 *            Its an object of staffVo
	 * @returns {void}
	 */
	function setStaffVo(staffVo) {
		this.staffVo = staffVo;
		if (this.staffVo)
			this.setStaff(this.staffVo.subscriberId);
	}
	;

	function getSearchVO() {
		return this.searchVO;
	}
	;

	function setSearchVO(searchVO) {
		this.searchVO = searchVO;

	}
	;

	function getMessageVO() {
		return this.messageVO;
	}
	;

	function setMessageVO(messageVO) {
		this.messageVO = messageVO;
	}
	;
	function getProfileVO() {
		return this.profileVO;
	}
	;

	function setProfileVO(profileVO) {
		this.profileVO = profileVO;
	}
	;

	/**
	 * Return the physcian from the context
	 * 
	 * @returns {PhysicianVO}
	 */
	function getPhysicianVO() {
		return this.physicianVO;
	}
	;

	/**
	 * Set the physcian to the context
	 * 
	 * @param physicianVO:
	 *            Its an object of patientVO
	 * @returns {void}
	 */
	function setPhysicianVO(physicianVO) {
		this.physicianVO = physicianVO;
	}
	;

	function clearPhysicianContext() {
		this.physicianVO = null;
	}
	;

	function getAppointmentVO() {
		return this.appointmentVO;
	}
	;

	function setAppointmentVO(appointmentVO) {
		this.appointmentVO = appointmentVO;
	}
	;

	function clearAppointmentVOContext() {
		this.appointmentVO = null;
	}
	;

	function clearSearchContext() {
		if (this.searchVO) {
			this.searchVO.clear();
		}
	}
	;

	function getMessageType() {
		return this.messageType;
	}
	;

	function setMessageType(messageType) {
		this.messageType = messageType;
	}
	;

	function getSteps() {
		return this.steps;
	}
	;

	function setSteps(steps) {
		this.steps = steps;
		// alert(this.steps);
	}
	;

	function getPatient() {
		return this.patient;
	}
	;

	function setPatient(patient) {
		this.patient = patient;
	}
	;

	function getStaff() {
		return this.staff;
	}
	;

	function setStaff(staff) {
		this.staff = staff;
	}
	;

	function getLicensee() {
		return this.licensee;
	}
	;

	function setLicensee(licensee) {
		this.licensee = licensee;
	}
	;

	function getOrganization() {
		return this.organization;
	}
	;

	function setOrganization(organization) {
		this.organization = organization;
	}
	;

	function getUser() {
		return this.user;
	}
	;

	function setUser(user) {
		this.user = user;
	}
	;

	function getConsultant() {
		return this.consultant;
	}
	;

	function setConsultant(consultant) {
		// alert("Set Context consultant :"+consultant);
		this.consultant = consultant;
	}
	;

	function getConsultantName() {
		return this.consultantName;
	}
	;

	function setConsultantName(consultantName) {
		// alert("Set Context Name :"+consultantName);
		this.consultantName = consultantName;
	}
	;

	function getCheckinState() {
		return this.checkinState;
	}
	;

	function setCheckinState(checkinState) {
		this.checkinState = checkinState;
	}
	;
	function clearCheckinState() {
		this.checkinState = null;
	}
	;

	function getCalendarQuery() {
		return this.calendarQuery;
	}
	;

	function setCalendarQuery(calendarQuery) {
		this.calendarQuery = calendarQuery;
	}
	;

	/**
	 * Return the selected patient from the context
	 * 
	 * @returns {PatientVO}
	 */
	function getPatientVO() {
		return this.patientVO;
	}
	;

	/**
	 * Set selected patient to the context
	 * 
	 * @param patientVO:
	 *            Its an object of patientVO
	 * @returns {void}
	 */
	function setPatientVO(patientVO) {
		this.patientVO = patientVO;
		if (this.patientVO)
			this.setPatient(this.patientVO.subscriberId);
	}
	;

	/**
	 * Return the selected licensee from the context
	 * 
	 * @returns {LicenseeVO}
	 */
	function getLicenseeVO() {
		return this.licenseeVO;
	}
	;

	/**
	 * Set selected licensee to the context
	 * 
	 * @param licenseeVO:
	 *            Its an object of licenseeVO
	 * @returns {void}
	 */
	function setLicenseeVO(licenseeVO) {
		this.licenseeVO = licenseeVO;
		if (this.licenseeVO)
			this.setLicensee(this.licenseeVO.subscriberId);
	}
	;

	function getRegistrationType() {
		return this.registrationType;
	}
	;

	function setRegistrationType(registrationType) {
		this.registrationType = registrationType;
	}
	;

	function getAppointment() {
		return this.appointment;
	}
	;

	function setAppointment(appointment) {
		this.appointment = appointment;
	}
	;

	function isSignUp() {
		return this.signUp;
	}
	;

	function setSignUp(signUp) {
		this.signUp = signUp;
	}
	;
	function getRoleId() {
		return this.roleId;
	}
	;
	function setRoleId(roleId) {
		this.roleId = roleId;
	}
	;
	function getSelectedProfile() {
		return this.selectedProfile;
	}
	;

	function setSelectedProfile(selectedProfile) {
		this.selectedProfile = selectedProfile;
	}
	;

	function clearSelectedProfileContext() {
		if (this.selectedProfile) {
			this.selectedProfile = null;
		}
	}
	;
	function getSubscriberId() {
		return this.subscriberId;
	}
	;
	function setSubscriberId(subscriberId) {
		this.subscriberId = subscriberId;
	}
	;

	/**
	 * Return the selected program from the context
	 * 
	 * @returns {ProgramVO}
	 */
	function getProgramVO() {
		return this.programVO;
	}
	;

	/**
	 * Set selected program to the context
	 * 
	 * @param programVO:
	 *            Its an object of programVO.
	 * @returns {void}
	 */
	function setProgramVO(programVO) {
		this.programVO = programVO;
	}
	;

	function getNavigationId() {
		return this.navigationId;
	}
	;
	function setNavigationId(navigationId) {
		this.navigationId = navigationId;
	}
	;
	function setSelectedLicenseeVO(selectedLicenseeVO) {
		this.selectedLicenseeVO = selectedLicenseeVO;
	}
	;
	function getSelectedLicenseeVO() {
		return this.selectedLicenseeVO;
	}
	;

	function setSelectedOrganizationVO(selectedOrganizationVO) {
		this.selectedOrganizationVO = selectedOrganizationVO;
	}
	;

	function getDocumentsVO() {
		return this.documentsVO;
	}
	;

	function setDocumentsVO(documentsVO) {
		this.documentsVO = documentsVO;
	}
	;

	function getSelectedOrganizationVO() {
		return this.selectedOrganizationVO;
	}
	;

	function clearSelectedOrganizationVOContext() {
		this.selectedOrganizationVO = null;
	}
	;

	/**
	 * Return the selected organization from the context
	 * 
	 * @returns {OrganizationVO}
	 */
	function getOrganizationVO() {
		return this.organizationVO;
	}
	;

	/**
	 * Set selected organization to the context
	 * 
	 * @param organizationVO:
	 *            Its an object of organizationVO.
	 * @returns {void}
	 */
	function setOrganizationVO(organizationVO) {
		this.organizationVO = organizationVO;
	}
	;

	function clearOrganizationVOContext() {
		this.organizationVO = null;
	}
	;

	function setBackToPatientHome(backToPatientHome) {
		this.backToPatientHome = backToPatientHome;
	}
	;
	function getBackToPatientHome() {
		return this.backToPatientHome;
	}
	;
	function clearPatientVOContext() {
		this.patientVO = null;
		this.patient = null;
		this.clearSearchContext();
	}
	;

	function getPatientRegistrationProcessDefinition() {
		return this.patientRegistrationProcessDefinition;
	}

	;
	function setPatientRegistrationProcessDefinition(
			patientRegistrationProcessDefinition) {
		this.patientRegistrationProcessDefinition = patientRegistrationProcessDefinition;
	}
	;

	function getStaffRegistrationProcessDefinition() {
		return this.staffRegistrationProcessDefinition;
	}

	;
	function setStaffRegistrationProcessDefinition(
			staffRegistrationProcessDefinition) {
		this.staffRegistrationProcessDefinition = staffRegistrationProcessDefinition;
	}
	;

	function getContactPersonProcessDefinition() {
		return this.contactPersonProcessDefinition;
	}

	;
	function setContactPersonProcessDefinition(contactPersonProcessDefinition) {
		this.contactPersonProcessDefinition = contactPersonProcessDefinition;
	}
	;

	function getIsPatientTransfer() {
		return this.isPatientTransfer;
	}
	;

	function setIsPatientTransfer(isPatientTransfer) {
		this.isPatientTransfer = isPatientTransfer;
	}
	;

	function getNavigationMap() {
		return this.navigationMap;
	}
	;

	function setNavigationMap(navigationMap) {
		this.navigationMap = navigationMap;
	}

	function clearNavigationMap() {
		this.navigationMap.clearItems();
	}
	;

	this.clearContext = clearContext;
	function clearContext() {
		this.patientVO = null;
		this.staffVo = null;
		this.selectedOrganizationVO = null;
	}
	;

}
