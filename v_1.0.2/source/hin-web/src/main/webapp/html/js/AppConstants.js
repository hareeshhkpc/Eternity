AppConstants = {};

AppConstants.URL = {};
AppConstants.URL.SERVER_CONTEXT = '/hin-web';
AppConstants.URL.COUCHDB = "/couchdb/";
AppConstants.URL.COUCHDBUPDATE = AppConstants.URL.COUCHDB + "_design/hl7store/";
AppConstants.URL.CONCEPT_STATIC_URL = AppConstants.URL.SERVER_CONTEXT
		+ "/rest/lookUp/static";
AppConstants.URL.CONFIGURATION_URL = AppConstants.URL.SERVER_CONTEXT
		+ "/message-configuration";
AppConstants.URL.CONFIGURATION_URL_COUCHDB = AppConstants.URL.COUCHDB;
AppConstants.URL.WORKFLOW_URL = AppConstants.URL.SERVER_CONTEXT
		+ '/rest/getMessage?messageId='; // "/message-skeleton/samples";
AppConstants.URL.WORKFLOW_NEW_TASK_URL = AppConstants.URL.SERVER_CONTEXT
		+ "/rest/createNewTask";
AppConstants.URL.WORKFLOW_USER_TASK_FOR_MESSAGE = AppConstants.URL.SERVER_CONTEXT
		+ "/rest/getUserTaskForMessageId?messageId";
AppConstants.URL.PROCESS_SAVE_URL = AppConstants.URL.SERVER_CONTEXT
		+ "/rest/createNewTask";

AppConstants.URL.GetFileAttachment = AppConstants.URL.SERVER_CONTEXT
		+ '/rest/getFileAttachment';

AppConstants.Class = {};
AppConstants.Event = {};
AppConstants.Day = {};
AppConstants.SearchType = {};
AppConstants.ProgramStage = {};
AppConstants.RegistrationType = {};
AppConstants.Status = {};
AppConstants.MessageStatus = {};
AppConstants.TransactionType = {};
AppConstants.TransactionStatus = {};
AppConstants.DocumentType = {};

AppConstants.XPaths = {};
AppConstants.XPaths.PRPA_MT201000HT03 = {};
AppConstants.XPaths.COCT_MT150000HT04 = {};
AppConstants.XPaths.PRPA_MT201000HT03.SUBSCRIBER_ID = "message/PRPA_MT201000HT03/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.PRPA_MT201000HT03.USERNAME = "message/PRPA_MT201000HT03/id[root='USERNAME']/extension";
AppConstants.XPaths.PRPA_MT201000HT03.PASSWORD = "message/PRPA_MT201000HT03/id[root='PASSWORD']/extension";
AppConstants.XPaths.PRPA_MT201000HT03.MEMBERSHIP_ID = "message/PRPA_MT201000HT03/identifiedPerson/asIdentifications/id[root='Eternity_Membership_ID']/extension";
AppConstants.XPaths.PRPA_MT201000HT03.AS_IDENTIFICATIONS_ID = "message/PRPA_MT201000HT03/identifiedPerson/asIdentifications/id/extension";
AppConstants.XPaths.COCT_MT150000HT04.SUBSCRIBER_ID = "message/COCT_MT150000HT04/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.COCT_MT150000HT04.USERNAME = "message/COCT_MT150000HT04/id[root='USERNAME']/extension";
AppConstants.XPaths.COCT_MT150000HT04.PASSWORD = "message/COCT_MT150000HT04/id[root='PASSWORD']/extension";
AppConstants.XPaths.SUBSCRIBER_EMAIL = '//identifiedPerson/telecom[use="EmailP" or use="EmailB"]/value[1]';
AppConstants.XPaths.SUBSCRIBER_BIRTH_TIME = '//identifiedPerson/birthTime/value';
AppConstants.XPaths.COCT_MT150000HT04.LICENSEE_ID = "message/COCT_MT150000HT04/id[root='LICENSEE_ID']/extension";

AppConstants.XPaths.PROGRAM_ID = '//POCD_MT000040UV_Program/id[root=&apos;PROGRAM_ID&apos;]/extension';

AppConstants.XPaths.Registrtion = {};
AppConstants.XPaths.Registrtion.MESSAGE_TYPE = 'PRPA_MT201000HT03';

AppConstants.XPaths.Role = {};
AppConstants.XPaths.Role.PATIENT_MESSAGE_TYPE = 'ROLE_PATIENT';
AppConstants.XPaths.Role.EMPLOYEE_MESSAGE_TYPE = 'ROLE_EMPLOYEE';
AppConstants.XPaths.Role.PHYSICIAN_MESSAGE_TYPE = 'ROLE_PHYSICIAN';

AppConstants.XPaths.Permission = {};
AppConstants.XPaths.Permission.MESSAGE_TYPE = 'ROLE_PERMISSION';

AppConstants.XPaths.Program = {};
AppConstants.XPaths.Program.MESSAGE_TYPE = 'POCD_MT000040UV_Program';
AppConstants.XPaths.Program.CODE = '//POCD_MT000040UV_Program/code/code/text()';
AppConstants.XPaths.Program.DISPALY = '//POCD_MT000040UV_Program/code/displayName/text()';

AppConstants.XPaths.Package = {};
AppConstants.XPaths.Package.MESSAGE_TYPE = 'POCD_MT000040UV_Package';

AppConstants.XPaths.Finance = {};
AppConstants.XPaths.Finance.MESSAGE_TYPE = 'FIAB_MT020000HT02';
AppConstants.XPaths.Finance.FEE = "Fee";
AppConstants.XPaths.Finance.COST = "Cost";

AppConstants.XPaths.Appointment = {};
AppConstants.XPaths.Appointment.BLOCK_CODE = "blockadded";
AppConstants.XPaths.Appointment.BLOCK_DISABLE_CODE = "blockremoved";
AppConstants.XPaths.Appointment.MESSAGE_TYPE = 'PRPA_MT410001HT02';
AppConstants.XPaths.Appointment.PATIENT_NAME = "concat(//PRPA_MT410001HT02/subject/patient/patientPerson/name/given/text(), ' ',//PRPA_MT410001HT02/subject/patient/patientPerson/name/family/text(),' ',//PRPA_MT410001HT02/subject/patient/patientPerson/name/suffix/text())";
AppConstants.XPaths.Appointment.PATIENT_ID = "//PRPA_MT410001HT02/subject/patient/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.Appointment.MESSAGE_TITLE = "//PRPA_MT410001HT02/id[root='MSG_TITLE']/extension";
AppConstants.XPaths.Appointment.CONSULTANT_ID = '//PRPA_MT410001HT02/consultant/employmentStaff/id[root="SUBSCRIBER_ID"]/extension';
AppConstants.XPaths.Appointment.CONSULTANT_NAME = "concat(//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/prefix/text(), ' ',//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/given/text(), ' ', //PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/family/text(),' ',//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/suffix/text())";
AppConstants.XPaths.Appointment.CONSULTANT_GIVEN = '//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/given/text()';
AppConstants.XPaths.Appointment.CONSULTANT_PREFIX = '//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/prefix/text()';
AppConstants.XPaths.Appointment.CONSULTANT_FAMILY = '//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/family/text()';
AppConstants.XPaths.Appointment.CONSULTANT_SUFFIX = '//PRPA_MT410001HT02/consultant/employmentStaff/employeePerson/name/suffix/text()';
AppConstants.XPaths.Appointment.REASONCODE = '//PRPA_MT410001HT02/reasonCode/code/text()';
AppConstants.XPaths.Appointment.COMMENTS = '//PRPA_MT410001HT02/code/code/text()';
AppConstants.XPaths.Appointment.UPDATE_COMMENTS = '//PRPA_MT410001HT02/code/code';
AppConstants.XPaths.Appointment.DATE_FROM = '//PRPA_MT410001HT02/effectiveTime/low/value';
AppConstants.XPaths.Appointment.DATE_TO = '//PRPA_MT410001HT02/effectiveTime/high/value';
AppConstants.XPaths.Appointment.THUMBNAIL = '//PRPA_MT410001HT02/subject/patient/patientPerson/desc/thumbnail/text()';
AppConstants.XPaths.Appointment.MIN_TIME = 0;
AppConstants.XPaths.Appointment.MAX_TIME = 24;
AppConstants.XPaths.Appointment.SLOT_MINUTES = 15;
AppConstants.XPaths.Appointment.IS_DBUPDATE_ONDRAG = true;
AppConstants.XPaths.Appointment.IS_OVERLOADING = false;
AppConstants.XPaths.Appointment.MAIN_HEADING_BUTTON = "physician block month,agendaWeek,agendaDay";
AppConstants.XPaths.Appointment.APP_HEADING_BUTTON = "physician month,agendaWeek,agendaDay";
AppConstants.Event.APPLICATION_INITIALIZED = "APPLICATION_INITIALIZED";

AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED = "APP_SCHEDULE_PAGE_INITIALIZED";
AppConstants.Event.APP_SCHEDULE_PAGE_BIND_EVENTS = "APP_SCHEDULE_PAGE_BIND_EVENTS";
AppConstants.Event.APP_SCHEDULE_PAGE_FILL_DATA = "APP_SCHEDULE_PAGE_FILL_DATA";
AppConstants.Event.APP_SCHEDULE_PAGE_FETCH_DATA = "APP_SCHEDULE_PAGE_FETCH_DATA";
AppConstants.Event.APP_SCHEDULE_PAGE_PROCESSED = "APP_SCHEDULE_PAGE_PROCESSED";
AppConstants.Event.APP_SCHEDULE_PAGE_RESPONSE = "APP_SCHEDULE_PAGE_RESPONSE";
AppConstants.Event.APP_SCHEDULE_PAGE_ERROR = "APP_SCHEDULE_PAGE_ERROR";

AppConstants.Event.ARCHIVE_SEARCH_PAGE_BIND_EVENTS = "ARCHIVE_SEARCH_PAGE_BIND_EVENTS";
AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_RESPONSE = "ARCHIVE_SEARCH_PATIENT_PAGE_RESPONSE";
AppConstants.Event.ARCHIVE_SEARCH_PATIENT_PAGE_PROCESSED = "ARCHIVE_SEARCH_PATIENT_PAGE_PROCESSED";
AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_PROCESSED = "ARCHIVE_SEARCH_RESULT_PAGE_PROCESSED";
AppConstants.Event.ARCHIVE_SEARCH_RESULT_PAGE_RESPONSE = "ARCHIVE_SEARCH_RESULT_PAGE_RESPONSE";

AppConstants.Event.CALENDAR_PAGE_INITIALIZED = "CALENDAR_PAGE_INITIALIZED";
AppConstants.Event.CALENDAR_PAGE_LOAD_EVENT = "CALENDAR_PAGE_LOAD_EVENT";
AppConstants.Event.CALENDAR_PAGE_BIND_EVENT = "CALENDAR_PAGE_BIND_EVENT";
AppConstants.Event.CALENDAR_PAGE_FETCH_DATA = "CALENDAR_PAGE_FETCH_DATA";
AppConstants.Event.CALENDAR_PAGE_FILL_DATA = "CALENDAR_PAGE_FILL_DATA";
AppConstants.Event.CALENDAR_PAGE_PROCESSED = "CALENDAR_PAGE_PROCESSED";
AppConstants.Event.CALENDAR_PAGE_RESPONSE = "CALENDAR_PAGE_RESPONSE";
AppConstants.Event.CALENDAR_PAGE_ERROR = "CALENDAR_PAGE_ERROR";

AppConstants.Event.CLEAR_CONTEXT = "CLEAR_CONTEXT";
AppConstants.Event.CLEAR_SEARCH_CONTEXT = "CLEAR_SEARCH_CONTEXT";

AppConstants.Event.DOCUMENT_PAGE_INITIALIZED = "DOCUMENT_PAGE_INITIALIZED";
AppConstants.Event.DOCUMENTS_PAGE_BIND_EVENTS = "DOCUMENTS_PAGE_BIND_EVENTS";
AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_REQUEST = "DOCUMENTS_FETCH_MESSAGE_ID_REQUEST"
AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_RESPONSE = "DOCUMENTS_FETCH_MESSAGE_ID_RESPONSE"

AppConstants.Event.FORM_PAGE_INITIALIZED = "FORM_PAGE_INITIALIZED";
AppConstants.Event.FORM_PAGE_LOAD_EVENT = "FORM_PAGE_LOAD_EVENT";
AppConstants.Event.FORM_PAGE_BIND_EVENT = "FORM_PAGE_BIND_EVENT";
AppConstants.Event.FORM_PAGE_FETCH_DATA = "FORM_PAGE_FETCH_DATA";
AppConstants.Event.FORM_PAGE_FILL_DATA = "FORM_PAGE_FILL_DATA";
AppConstants.Event.FORM_PAGE_PROCESSED = "FORM_PAGE_PROCESSED";
AppConstants.Event.FORM_PAGE_RESPONSE = "FORM_PAGE_RESPONSE";
AppConstants.Event.FORM_PAGE_ERROR = "FORM_PAGE_ERROR";

AppConstants.Event.HOME_PAGE_INITIALIZED = "HOME_PAGE_INITIALIZED";
AppConstants.Event.HOME_PAGE_BIND_EVENTS = "HOME_PAGE_BIND_EVENTS";
AppConstants.Event.HOME_PAGE_FILL_DATA = "HOME_PAGE_FILL_DATA";
AppConstants.Event.HOME_PAGE_FETCH_DATA = "HOME_PAGE_FETCH_DATA";
AppConstants.Event.HOME_PAGE_PROCESSED = "HOME_PAGE_PROCESSED";
AppConstants.Event.HOME_PAGE_RESPONSE = "HOME_PAGE_RESPONSE";
AppConstants.Event.HOME_PAGE_ERROR = "HOME_PAGE_ERROR";

AppConstants.Event.LOGIN_PAGE_INITIALIZED = "LOGIN_PAGE_INITIALIZED";
AppConstants.Event.LOGIN_PAGE_BIND_EVENTS = "LOGIN_PAGE_BIND_EVENTS";
AppConstants.Event.LOGIN_PAGE_PROCESSED = "LOGIN_PAGE_PROCESSED";
AppConstants.Event.LOGIN_PAGE_RESPONSE = "LOGIN_PAGE_RESPONSE";
AppConstants.Event.LOGIN_PAGE_ERROR = "LOGIN_PAGE_ERROR";

AppConstants.Event.MENTOR_PAGE_INITIALIZED = "MENTOR_PAGE_INITIALIZED";
AppConstants.Event.MENTOR_PAGE_BIND_EVENTS = "MENTOR_PAGE_BIND_EVENTS";
AppConstants.Event.MENTOR_PAGE_FETCH_DATA = "MENTOR_PAGE_FETCH_DATA";
AppConstants.Event.MENTOR_PAGE_FILL_DATA = "MENTOR_PAGE_FILL_DATA";
AppConstants.Event.MENTOR_PAGE_PROCESSED = "MENTOR_PAGE_PROCESSED";
AppConstants.Event.MENTOR_PAGE_RESPONSE = "MENTOR_PAGE_RESPONSE";
AppConstants.Event.MENTOR_PAGE_ERROR = "MENTOR_PAGE_ERROR";

AppConstants.Event.MONITOR_PAGE_INITIALIZED = "MONITOR_PAGE_INITIALIZED";
AppConstants.Event.MONITOR_PAGE_BIND_EVENTS = "MONITOR_PAGE_BIND_EVENTS";
AppConstants.Event.MONITOR_PAGE_FETCH_DATA = "MONITOR_PAGE_FETCH_DATA";
AppConstants.Event.MONITOR_PAGE_FILL_DATA = "MONITOR_PAGE_FILL_DATA";
AppConstants.Event.MONITOR_PAGE_PROCESSED = "MONITOR_PAGE_PROCESSED";
AppConstants.Event.MONITOR_PAGE_RESPONSE = "MONITOR_PAGE_RESPONSE";
AppConstants.Event.MONITOR_PAGE_ERROR = "MONITOR_PAGE_ERROR";

AppConstants.Event.MEASURE_PAGE_INITIALIZED = "MEASURE_PAGE_INITIALIZED";
AppConstants.Event.MEASURE_PAGE_BIND_EVENTS = "MEASURE_PAGE_BIND_EVENTS";
AppConstants.Event.MEASURE_PAGE_FETCH_DATA = "MEASURE_PAGE_FETCH_DATA";
AppConstants.Event.MEASURE_PAGE_FILL_DATA = "MEASURE_PAGE_FILL_DATA";
AppConstants.Event.MEASURE_PAGE_PROCESSED = "MEASURE_PAGE_PROCESSED";
AppConstants.Event.MEASURE_PAGE_RESPONSE = "MEASURE_PAGE_RESPONSE";
AppConstants.Event.MEASURE_PAGE_ERROR = "MEASURE_PAGE_ERROR";

AppConstants.Event.NAVIGATION_PAGE_INITIALIZED = "NAVIGATION_PAGE_INITIALIZED";
AppConstants.Event.NAVIGATION_PAGE_BIND_EVENTS = "NAVIGATION_PAGE_BIND_EVENTS";
AppConstants.Event.NAVIGATION_PAGE_PROCESSED = "NAVIGATION_PAGE_PROCESSED";
AppConstants.Event.NAVIGATION_PAGE_RESPONSE = "NAVIGATION_PAGE_RESPONSE";
AppConstants.Event.NAVIGATION_PAGE_ERROR = "NAVIGATION_PAGE_ERROR";

AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT = "PATIENT_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.PATIENT_HOME_PAGE_FETCH_DATA = "PATIENT_HOME_PAGE_FETCH_DATA";
AppConstants.Event.PATIENT_HOME_PAGE_FILL_DATA = "PATIENT_HOME_PAGE_FILL_DATA";
AppConstants.Event.PATIENT_HOME_PAGE_BIND_EVENT = "PATIENT_HOME_PAGE_BIND_EVENT";
AppConstants.Event.PATIENT_PAGE_INITIALIZED = "PATIENT_PAGE_INITIALIZED";
AppConstants.Event.PATIENT_PAGE_LOAD_EVENT = "PATIENT_PAGE_LOAD_EVENT";
AppConstants.Event.PATIENT_PAGE_BIND_EVENT = "PATIENT_PAGE_BIND_EVENT";
AppConstants.Event.PATIENT_PAGE_FETCH_DATA = "PATIENT_PAGE_FETCH_DATA";
AppConstants.Event.PATIENT_PAGE_FILL_DATA = "PATIENT_PAGE_FILL_DATA";
AppConstants.Event.PATIENT_PAGE_PROCESSED = "PATIENT_PAGE_PROCESSED";
AppConstants.Event.PATIENT_PAGE_RESPONSE = "PATIENT_PAGE_RESPONSE";
AppConstants.Event.PATIENT_PAGE_ERROR = "PATIENT_PAGE_ERROR";
AppConstants.Event.PATIENT_WORK_FLOW_PAGE_FECTH_DATA = "PATIENT_WORK_FLOW_PAGE_FECTH_DATA";
AppConstants.Event.PATIENT_WORK_FLOW_PAGE_LOAD_EVENT = "PATIENT_WORK_FLOW_PAGE_LOAD_EVENT";
AppConstants.Event.PATIENT_WORK_FLOW_PAGE_BIND_EVENT = "PATIENT_WORK_FLOW_PAGE_BIND_EVENT";

AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT = "LICENSEE_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.LICENSEE_HOME_PAGE_FETCH_DATA = "LICENSEE_HOME_PAGE_FETCH_DATA";
AppConstants.Event.LICENSEE_HOME_PAGE_FILL_DATA = "LICENSEE_HOME_PAGE_FILL_DATA";
AppConstants.Event.LICENSEE_HOME_PAGE_BIND_EVENT = "LICENSEE_HOME_PAGE_BIND_EVENT";
AppConstants.Event.LICENSEE_PAGE_INITIALIZED = "LICENSEE_PAGE_INITIALIZED";
AppConstants.Event.LICENSEE_PAGE_LOAD_EVENT = "LICENSEE_PAGE_LOAD_EVENT";
AppConstants.Event.LICENSEE_PAGE_BIND_EVENT = "LICENSEE_PAGE_BIND_EVENT";
AppConstants.Event.LICENSEE_PAGE_FETCH_DATA = "LICENSEE_PAGE_FETCH_DATA";
AppConstants.Event.LICENSEE_PAGE_FILL_DATA = "LICENSEE_PAGE_FILL_DATA";
AppConstants.Event.LICENSEE_PAGE_PROCESSED = "LICENSEE_PAGE_PROCESSED";
AppConstants.Event.LICENSEE_PAGE_RESPONSE = "LICENSEE_PAGE_RESPONSE";
AppConstants.Event.LICENSEE_PAGE_ERROR = "LICENSEE_PAGE_ERROR";
AppConstants.Event.LICENSEE_WORK_FLOW_PAGE_FECTH_DATA = "LICENSEE_WORK_FLOW_PAGE_FECTH_DATA";
AppConstants.Event.LICENSEE_WORK_FLOW_PAGE_LOAD_EVENT = "LICENSEE_WORK_FLOW_PAGE_LOAD_EVENT";
AppConstants.Event.LICENSEE_WORK_FLOW_PAGE_BIND_EVENT = "LICENSEE_WORK_FLOW_PAGE_BIND_EVENT";

AppConstants.Event.PROGRAM_PAGE_INITIALIZED = "PROGRAM_PAGE_INITIALIZED";
AppConstants.Event.PROGRAM_PAGE_BIND_EVENTS = "PROGRAM_PAGE_BIND_EVENTS";
AppConstants.Event.PROGRAM_PAGE_FETCH_DATA = "PROGRAM_PAGE_FETCH_DATA";
AppConstants.Event.PROGRAM_PAGE_FILL_DATA = "PROGRAM_PAGE_FILL_DATA";
AppConstants.Event.PROGRAM_PAGE_PROCESSED = "PROGRAM_PAGE_PROCESSED";
AppConstants.Event.PROGRAM_PAGE_RESPONSE = "PROGRAM_PAGE_RESPONSE";
AppConstants.Event.PROGRAM_PAGE_ERROR = "PROGRAM_PAGE_ERROR";

AppConstants.Event.PROCESS_PAGE_LOAD_EVENT = "PROCESS_PAGE_LOAD_EVENT";
AppConstants.Event.PROCESS_PAGE_BIND_EVENT = "PROCESS_PAGE_BIND_EVENT";
AppConstants.Event.PROCESS_PAGE_FECTH_DATA = "PROCESS_PAGE_FECTH_DATA";
AppConstants.Event.PROCESS_PAGE_FILL_DATA = "PROCESS_PAGE_FILL_DATA";
AppConstants.Event.PROCESS_PAGE_DEFINITION_FECTH_DATA = "PROCESS_PAGE_DEFINITION_FECTH_DATA";
AppConstants.Event.PROCESS_PAGE_DEFINITION_FILL_DATA = "PROCESS_PAGE_DEFINITION_FILL_DATA";
AppConstants.Event.PROCESS_PAGE_INSTANCE_FECTH_DATA = "PROCESS_PAGE_INSTANCE_FECTH_DATA";
AppConstants.Event.PROCESS_PAGE_INSTANCE_FILL_DATA = "PROCESS_PAGE_INSTANCE_FILL_DATA";

AppConstants.Event.PROCESS_PAGE_RENDER = "PROCESS_PAGE_RENDER";
AppConstants.Event.PROCESS_PAGE_RESPONSE = "PROCESS_PAGE_RESPONSE";
AppConstants.Event.PROCESS_PAGE_ERROR = "PROCESS_PAGE_ERROR";

AppConstants.Event.REGISTRATION_PAGE_INITIALIZED = "REGISTRATION_PAGE_INITIALIZED";
AppConstants.Event.REGISTRATION_PAGE_BIND_EVENTS = "REGISTRATION_PAGE_BIND_EVENTS";
AppConstants.Event.REGISTRATION_PAGE_PROCESSED = "REGISTRATION_PAGE_PROCESSED";
AppConstants.Event.REGISTRATION_PAGE_RESPONSE = "REGISTRATION_PAGE_RESPONSE";
AppConstants.Event.REGISTRATION_PAGE_ERROR = "REGISTRATION_PAGE_ERROR";

AppConstants.Event.REVIEW_PAGE_INITIALIZED = "REVIEW_PAGE_INITIALIZED";
AppConstants.Event.REVIEW_PAGE_BIND_EVENTS = "REVIEW_PAGE_BIND_EVENTS";
AppConstants.Event.REVIEW_PAGE_PROCESSED = "REVIEW_PAGE_PROCESSED";
AppConstants.Event.REVIEW_PAGE_RESPONSE = "REVIEW_PAGE_RESPONSE";
AppConstants.Event.REVIEW_PAGE_ERROR = "REVIEW_PAGE_ERROR";

AppConstants.Event.SEARCH_PAGE_INITIALIZED = "SEARCH_PAGE_INITIALIZED";
AppConstants.Event.SEARCH_PAGE_BIND_EVENTS = "SEARCH_PAGE_BIND_EVENTS";
AppConstants.Event.SEARCH_PAGE_PROCESSED = "SEARCH_PAGE_PROCESSED";
AppConstants.Event.SEARCH_PAGE_RESPONSE = "SEARCH_PAGE_RESPONSE";
AppConstants.Event.SEARCH_PAGE_ERROR = "SEARCH_PAGE_ERROR";

AppConstants.Event.SAVE_MESSAGE_EVENT = "SAVE_MESSAGE_EVENT";
AppConstants.Event.SAVE_PROCESS_EVENT = "SAVE_PROCESS_EVENT";

AppConstants.Event.STATISTICS_PAGE_INITIALIZED = "STATISTICS_PAGE_INITIALIZED";
AppConstants.Event.STATISTICS_PAGE_BIND_EVENTS = "STATISTICS_PAGE_BIND_EVENTS";
AppConstants.Event.STATISTICS_FETCH_DATA_REQUEST = "STATISTICS_FETCH_DATA_REQUEST";
AppConstants.Event.STATISTICS_FETCH_DATA_RESPONSE = "STATISTICS_FETCH_DATA_RESPONSE";
AppConstants.Event.STATISTICS_FETCH_YEAR_DATA_REQUEST = "STATISTICS_FETCH_YEAR_DATA_REQUEST";
AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_REQUEST = "STATISTICS_FETCH_MONTH_DATA_REQUEST";
AppConstants.Event.STATISTICS_FETCH_YEAR_DATA_RESPONSE = "STATISTICS_FETCH_YEAR_DATA_RESPONSE";
AppConstants.Event.STATISTICS_FETCH_MONTH_DATA_RESPONSE = "STATISTICS_FETCH_MONTH_DATA_RESPONSE";
AppConstants.Event.STATISTICS_AVAILABLE = "STATISTICS_AVAILABLE";
AppConstants.Event.STATISTICS_FETCH_DATA = "STATISTICS_FETCH_DATA";
AppConstants.Event.STATISTICS_FILL_DATA = "STATISTICS_FILL_DATA";
AppConstants.Event.STATISTICS_MESSAGE_FETCH_DATA = "STATISTICS_MESSAGE_FETCH_DATA";
AppConstants.Event.STATISTICS_MESSAGE_FILL_DATA = "STATISTICS_MESSAGE_FILL_DATA";
AppConstants.Event.STATISTICS_MESSAGE_FETCH_FACILITIES = "STATISTICS_MESSAGE_FETCH_FACILITIES";
AppConstants.Event.STATISTICS_MESSAGE_FILL_FACILITIES = "STATISTICS_MESSAGE_FILL_FACILITIES";

AppConstants.Event.TEST_RESULTS_PAGE_INITIALIZED = "TEST_RESULTS_PAGE_INITIALIZED";
AppConstants.Event.TEST_RESULTS_PAGE_BIND_EVENTS = "TEST_RESULTS_PAGE_BIND_EVENTS";
AppConstants.Event.TEST_RESULTS_PAGE_PROCESSED = "TEST_RESULTS_PAGE_PROCESSED";
AppConstants.Event.TEST_RESULTS_PAGE_RESPONSE = "TEST_RESULTS_PAGE_RESPONSE";
AppConstants.Event.TEST_RESULTS_PAGE_ERROR = "TEST_RESULTS_PAGE_ERROR";
AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS = "TEST_RESULTS_PAGE_FETCH_TESTS";
AppConstants.Event.TEST_RESULTS_PAGE_FETCH_TESTS_RESPONSE = "TEST_RESULTS_PAGE_FETCH_TESTS_RESPONSE";
AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPES = "TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPES";
AppConstants.Event.TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPE_RESPONSE = "TEST_RESULTS_PAGE_FETCH_MESSAGE_TYPE_RESPONSE";

AppConstants.Event.WORK_FLOW_PAGE_LOAD_EVENT = "WORK_FLOW_PAGE_LOAD_EVENT";
AppConstants.Event.WORK_FLOW_PAGE_BIND_EVENT = "WORK_FLOW_PAGE_BIND_EVENT";
AppConstants.Event.WORK_FLOW_PAGE_FECTH_DATA = "WORK_FLOW_PAGE_FECTH_DATA";
AppConstants.Event.WORK_FLOW_PAGE_FILL_DATA = "WORK_FLOW_PAGE_FILL_DATA";
AppConstants.Event.WORK_FLOW_PAGE_RESPONSE = "WORK_FLOW_PAGE_RESPONSE";
AppConstants.Event.WORK_FLOW_PAGE_ERROR = "WORK_FLOW_PAGE_ERROR";

AppConstants.Event.ENTITY_STATE_CHANGE = "ENTITY_STATE_CHANGE";
AppConstants.Event.ON_ENTITY_STATE_CHANGE = "ON_ENTITY_STATE_CHANGE";
AppConstants.Event.FETCH_CHECKEDIN_PATIENTS = "FETCH_CHECKEDIN_PATIENTS";
AppConstants.Event.FILL_CHECKEDIN_PATIENTS = "FILL_CHECKEDIN_PATIENTS";

AppConstants.SearchType.ARCHIVE_SEARCH = "ARCHIVE_SEARCH";
AppConstants.SearchType.ARCHIVE_TEST_RESULT_SEARCH = "ARCHIVE_TEST_RESULT_SEARCH";
AppConstants.SearchType.PATIENT_PROFILE_SEARCH = "PATIENT_PROFILE_SEARCH";
AppConstants.SearchType.STAFF_PROFILE_SEARCH = "STAFF_PROFILE_SEARCH";
AppConstants.SearchType.CALENDAR_SEARCH = "CALENDAR_SEARCH";
AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH = "PHYSICIAN_PROFILE_SEARCH";
AppConstants.SearchType.LICENSEE_SEARCH = "LICENSEE_SEARCH";
AppConstants.SearchType.PATIENT_PRODUCT_SEARCH = "PATIENT_PRODUCT_SEARCH";

AppConstants.ProgramStage.MEASURE = "MEASURE";
AppConstants.ProgramStage.MENTOR = "MENTOR";
AppConstants.ProgramStage.MONITOR = "MONITOR";
AppConstants.Day.TODAY = "TODAY";
AppConstants.Day.WEEK = "WEEK";
AppConstants.Day.MONTH = "MONTH";

AppConstants.Event.USER_PAGE_INITIALIZED = "USER_PAGE_INITIALIZED";
AppConstants.Event.USER_HOME_PAGE_LOAD_EVENT = "USER_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.USER_HOME_PAGE_FETCH_DATA = "USER_HOME_PAGE_FETCH_DATA";
AppConstants.Event.USER_HOME_PAGE_FILL_DATA = "USER_HOME_PAGE_FILL_DATA";
AppConstants.Event.USER_HOME_PAGE_BIND_EVENT = "USER_HOME_PAGE_BIND_EVENT";

AppConstants.Event.STAFF_PAGE_INITIALIZED = "STAFF_PAGE_INITIALIZED";
AppConstants.Event.STAFF_HOME_PAGE_LOAD_EVENT = "STAFF_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.STAFF_HOME_PAGE_FETCH_DATA = "STAFF_HOME_PAGE_FETCH_DATA";
AppConstants.Event.STAFF_HOME_PAGE_FILL_DATA = "STAFF_HOME_PAGE_FILL_DATA";
AppConstants.Event.STAFF_HOME_PAGE_BIND_EVENT = "STAFF_HOME_PAGE_BIND_EVENT";

AppConstants.Event.SIGNUP_PAGE_INITIALIZED = "SIGNUP_PAGE_INITIALIZED";
AppConstants.Event.SIGNUP_PAGE_BIND_EVENT = "SIGNUP_PAGE_BIND_EVENT";
AppConstants.Event.SIGNUP_SAVE_EVENT = "SIGNUP_SAVE_EVENT";
AppConstants.Event.SIGNUP_LOADCONFIG_EVENT = "SIGNUP_LOADCONFIG_EVENT";

AppConstants.Event.SETTINGS_PAGE_INITIALIZED = "SETTINGS_PAGE_INITIALIZED";
AppConstants.Event.SETTINGS_PAGE_BIND_EVENTS = "SETTINGS_PAGE_BIND_EVENTS";

AppConstants.Event.MESSAGES_PAGE_INITIALIZED = "MESSAGES_PAGE_INITIALIZED";
AppConstants.Event.MESSAGES_PAGE_BIND_EVENTS = "MESSAGES_PAGE_BIND_EVENTS";
AppConstants.Event.MESSAGES_OPEN_CONTACT_EVENTS = "MESSAGES_OPEN_CONTACT_EVENTS";
AppConstants.Event.MESSAGES_WEBSOCKET_LOGIN_EVENTS = "MESSAGES_WEBSOCKET_LOGIN_EVENTS";
AppConstants.Event.MESSAGES_USER_LOGGEDIN = "MESSAGES_USER_LOGGEDIN";

AppConstants.RegistrationType.PATIENT_REGISTRATION = "PATIENT_REGISTRATION";
AppConstants.RegistrationType.STAFF_REGISTRATION = "STAFF_REGISTRATION";
AppConstants.RegistrationType.STAFF_REGISTRATION = "LICENSEE_REGISTRATION";
AppConstants.RegistrationType.SIGN_UP = "SIGN_UP";

AppConstants.Status.ACTIVE = "ACTIVE";
AppConstants.Status.INACTIVE = "INACTIVE";
AppConstants.Status.OBSOLETE = "OBSOLETE";

AppConstants.MessageStatus.PENDING = "PENDING";
AppConstants.MessageStatus.COMPLETED = "COMPLETED";
AppConstants.MessageStatus.FINISHED = "FINISHED";

AppConstants.TransactionStatus.INVOICED = "INVOICED";
AppConstants.TransactionStatus.UNPAID = "UNPAID";
AppConstants.TransactionStatus.PAID = "PAID";
AppConstants.TransactionStatus.ORDERED = "ORDERED";
AppConstants.TransactionStatus.DISCOUNT = "DISCOUNT";

AppConstants.TransactionType.SERVICE_FEE = "SERVICE_FEE";
AppConstants.TransactionType.SERVICE_COST = "SERVICE_COST";

AppConstants.TransactionType.PRODUCT_FEE = "PRODUCT_FEE";
AppConstants.TransactionType.PRODUCT_COST = "PRODUCT_COST";

AppConstants.TransactionType.PAYMENT = "PAYMENT";
AppConstants.TransactionType.RECEIPT = "RECEIPT";
AppConstants.TransactionType.LICENSEEPAYMENT = "LICENSEEPAYMENT";

/*
 * AppConstants.TransactionType.SERVICE = "Service";
 * AppConstants.TransactionType.PRODUCT = "Product";
 */
AppConstants.TransactionType.INVOICE = "Invoice";
AppConstants.TransactionType.LICENSEEINVOICE = "LicenseeInvoice";

AppConstants.DocumentType.DOCUMENTS = "DOCUMENTS";
AppConstants.DocumentType.RESULTS = "RESULTS";

AppConstants.Event.RESIZE = "RESIZE";
AppConstants.Event.HOME_PAGE_RESIZE = "HOME_PAGE_RESIZE";

AppConstants.Autocomplete = {};
AppConstants.Autocomplete.LOOKUP_KEY = "LOOKUP_DATA";
AppConstants.Autocomplete.XPATH = "//lookups/lookup[@class=";
AppConstants.Autocomplete.LABEL = "description";
AppConstants.Autocomplete.VALUE = "name";

AppConstants.XPaths.User = {};
AppConstants.XPaths.User.SUBSCRIBER_ID = "//PRPA_MT201000HT03/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.User.PREFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/prefix/text()";
AppConstants.XPaths.User.SUFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/suffix/text()";
AppConstants.XPaths.User.GIVEN_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/given/text()";
AppConstants.XPaths.User.FAMILY_NAME = "";
AppConstants.XPaths.User.USERNAME = "//PRPA_MT201000HT03/id[root='USERNAME']/extension";
AppConstants.XPaths.User.PASSWORD = "//PRPA_MT201000HT03/id[root='PASSWORD']/extension";
AppConstants.XPaths.User.MESSAGE = "";
AppConstants.XPaths.User.GENDER = "//PRPA_MT201000HT03/identifiedPerson/administrativeGenderCode/code/text()";
AppConstants.XPaths.User.ASSIGNING_ORGANIZATION_ID = "//PRPA_MT201000HT03/assigningOrganization/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.User.ARTIFACT_ID = "//@config";

AppConstants.XPaths.Patient = {};
AppConstants.XPaths.Patient.SUBSCRIBER_ID = "//PRPA_MT201000HT03/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.Patient.PREFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/prefix/text()";
AppConstants.XPaths.Patient.SUFFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/suffix/text()";
AppConstants.XPaths.Patient.GIVEN_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/given/text()";
AppConstants.XPaths.Patient.FAMILY_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/family/text()";
AppConstants.XPaths.Patient.IMAGE = "//PRPA_MT201000HT03/identifiedPerson/desc/thumbnail/text()";
AppConstants.XPaths.Patient.GENDER = "//PRPA_MT201000HT03/identifiedPerson/administrativeGenderCode/code/text()";
AppConstants.XPaths.Patient.DOB = "//PRPA_MT201000HT03/identifiedPerson/birthTime/value/text()";
AppConstants.XPaths.Patient.CONSULTANT_ID = "//PRPA_MT201000HT03/id[root='CONSULTANT_ID']/extension";
AppConstants.XPaths.Patient.PROGRAM_ID = "//PRPA_MT201000HT03/id[root='PROGRAM_ID']/extension";
AppConstants.XPaths.Patient.CONSULTANT = "";
AppConstants.XPaths.Patient.ASSIGNING_ORGANIZATION_ID = "//PRPA_MT201000HT03/assigningOrganization/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.Patient.EMAIL_ID = '//PRPA_MT201000HT03/identifiedPerson/telecom[use="EmailP" or use="EmailB"]/value';
AppConstants.XPaths.Patient.MEMBERSHIP_ID = "//PRPA_MT201000HT03/identifiedPerson/asIdentifications/id[root='Eternity_Membership_ID']/extension";
AppConstants.XPaths.Patient.NAME_TYPE = "//PRPA_MT201000HT03/identifiedPerson/name/use/text()";

AppConstants.XPaths.Organization = {};
AppConstants.XPaths.Organization.SUBSCRIBER_ID = "//COCT_MT150000HT04/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.Organization.NAME_TYPE = "//COCT_MT150000HT04/name/use/text()";
AppConstants.XPaths.Organization.PREFIX_NAME = "//COCT_MT150000HT04/name/prefix/text()";
AppConstants.XPaths.Organization.SUFFIX_NAME = "//COCT_MT150000HT04/name/suffix/text()";
AppConstants.XPaths.Organization.GIVEN_NAME = "//COCT_MT150000HT04/name/given/text()";
AppConstants.XPaths.Organization.FAMILY_NAME = "//COCT_MT150000HT04/name/family/text()";
AppConstants.XPaths.Organization.REGION_CODE = "//COCT_MT150000HT04/code/code/text()";
AppConstants.XPaths.Organization.REGION_NAME = "//COCT_MT150000HT04/code/originalText/text()";
AppConstants.XPaths.Organization.HOUSE_NUMBER = "//COCT_MT150000HT04/addr/houseNumber/text()";
AppConstants.XPaths.Organization.STREET_NAME = "//COCT_MT150000HT04/addr/streetName/text()";
AppConstants.XPaths.Organization.CITY = "//COCT_MT150000HT04/addr/city/text()";
AppConstants.XPaths.Organization.STATE = "//COCT_MT150000HT04/addr/state/text()";
AppConstants.XPaths.Organization.COUNTRY = "//COCT_MT150000HT04/addr/country/text()";
AppConstants.XPaths.Organization.POSTAL_CODE = "//COCT_MT150000HT04/addr/postalCode/text()";
AppConstants.XPaths.Organization.CONTACT_TYPE = "//COCT_MT150000HT04/telecom/use/text()";
AppConstants.XPaths.Organization.CONTACT_VALUE = "//COCT_MT150000HT04/telecom/value/text()";
AppConstants.XPaths.Organization.LICENSEE_ID = "//COCT_MT150000HT04/id[root='LICENSEE_ID']/extension";
AppConstants.XPaths.Organization.USERNAME = "//COCT_MT150000HT04/id[root='USERNAME']/extension";
AppConstants.XPaths.Organization.PASSWORD = "//COCT_MT150000HT04/id[root='PASSWORD']/extension";
AppConstants.XPaths.Organization.IMAGE = "";
AppConstants.XPaths.Organization.MESSAGE_TYPE = "COCT_MT150000HT04";

AppConstants.XPaths.Physician = {};
AppConstants.XPaths.Physician.PREFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/prefix/text()";
AppConstants.XPaths.Physician.SUFFIX_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/suffix/text()";
AppConstants.XPaths.Physician.GIVEN_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/given/text()";
AppConstants.XPaths.Physician.FAMILY_NAME = "//PRPA_MT201000HT03/identifiedPerson/name/family/text()";
AppConstants.XPaths.Physician.PHYSICIAN_ID = "//PRPA_MT201000HT03/id[root='SUBSCRIBER_ID']/extension";
AppConstants.XPaths.Physician.NAME = "concat(//PRPA_MT201000HT03/identifiedPerson/name/prefix/text(), ' ',//PRPA_MT201000HT03/identifiedPerson/name/given/text(), ' ',//PRPA_MT201000HT03/identifiedPerson/name/family/text(),' ',//PRPA_MT201000HT03/identifiedPerson/name/suffix/text())";

AppConstants.XPaths.Staff = {};
AppConstants.XPaths.Staff.USERNAME = "//PRPA_MT201000HT03/id[root='USERNAME']/extension";
AppConstants.XPaths.Staff.PASSWORD = "//PRPA_MT201000HT03/id[root='PASSWORD']/extension";

AppConstants.XPaths.Licensee = {};
AppConstants.XPaths.Licensee.SUBSCRIBER_ID = "//LICENSEE/id[root='HIN_MSG_ID']/extension";
AppConstants.XPaths.Licensee.LICENSEE_EMAIL = "//LICENSEE/telecom/value/text()";
AppConstants.XPaths.Licensee.LICENSEE_PASSWORD = "//LICENSEE/id[root='PASSWORD']/extension";
AppConstants.XPaths.Licensee.IMAGE = "";

AppConstants.Event.PRODUCT_PAGE_INITIALIZED = "PRODUCTS_PAGE_INITIALIZED";
AppConstants.Event.PRODUCTS_HOME_PAGE_LOAD_EVENT = "PRODUCTS_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.PRODUCTS_HOME_PAGE_FETCH_DATA = "PRODUCTS_HOME_PAGE_FETCH_DATA";
AppConstants.Event.PRODUCTS_HOME_FILL_DATA_EVENT = "PRODUCTS_HOME_FILL_DATA_EVENT";
AppConstants.Event.PRODUCTS_PAGE_BIND_EVENTS = "PRODUCTS_PAGE_BIND_EVENTS";

AppConstants.Event.PATIENT_CALENDAR_PAGE_INITIALIZED = "PATIENT_CALENDAR_PAGE_INITIALIZED";
AppConstants.Event.PATIENT_CALENDAR_HOME_PAGE_LOAD_EVENT = "PATIENT_CALENDAR_HOME_PAGE_LOAD_EVENT";
AppConstants.Event.PATIENT_CALENDAR_HOME_PAGE_FETCH_DATA = "PATIENT_CALENDAR_HOME_PAGE_FETCH_DATA";
AppConstants.Event.PATIENT_CALENDAR_HOME_FILL_DATA_EVENT = "PATIENT_CALENDAR_HOME_FILL_DATA_EVENT";
AppConstants.Event.PATIENT_CALENDAR_PAGE_BIND_EVENTS = "PATIENT_CALENDAR_PAGE_BIND_EVENTS";

AppConstants.XPaths.Product = {};
AppConstants.XPaths.Product.DOSAGE_QUANTITY = "//POSA_MT920000HT03_Supplements/doseQuantity/code/text()";
AppConstants.XPaths.Product.DOSAGE_UNIT_QUANTITY = "//POSA_MT920000HT03_Supplements/doseCheckQuantity/numerator/value/text()";
AppConstants.XPaths.Product.DOSAGE_QUANTITY = "//POSA_MT920000HT03_Supplements/doseQuantity/code/text()";

AppConstants.TransactionType.PAYMENTADVICE = "PAYMENTADVICE";

AppConstants.Event.ROLEDEFINITION_PAGE_INITIALIZED = "ROLEDEFINITION_PAGE_INITIALIZED";
AppConstants.Event.ROLEDEFINITION_PAGE_LOAD_EVENT = "ROLEDEFINITION_PAGE_LOAD_EVENT";
AppConstants.Event.ROLEDEFINITION_HOME_PAGE_FETCH_DATA = "ROLEDEFINITION_PAGE_FETCH_DATA";
AppConstants.Event.ROLEDEFINITION_HOME_FILL_DATA_EVENT = "ROLEDEFINITION_FILL_DATA_EVENT";
AppConstants.Event.ROLEDEFINITION_PAGE_BIND_EVENTS = "ROLEDEFINITION_PAGE_BIND_EVENTS";
AppConstants.Event.ROLEDEFINITION_HOME_PAGE_BIND_EVENT = "ROLEDEFINITION_HOME_PAGE_BIND_EVENT";
