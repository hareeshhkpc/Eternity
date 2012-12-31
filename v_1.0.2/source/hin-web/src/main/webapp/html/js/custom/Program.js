/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Program(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Program";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var program = this;

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside login event handler: " + event.type);
		if (event.type == AppConstants.Event.PROGRAM_PAGE_BIND_EVENTS) {
			// load();
			// loadDiagnostics();

		} else if (event.type == AppConstants.Event.PROGRAM_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.PROGRAM_PAGE_ERROR) {

		}
	}
	;
	function loadUI() {

		var programStage = AppConstants.ProgramStage.MONITOR;

		if (programStage == AppConstants.ProgramStage.MEASURE) {
			renderingEngine.loadPage("pages/program/diagnostic.html", "form",
					AppConstants.Event.MEASURE_PAGE_BIND_EVENTS);
		} else if (programStage == AppConstants.ProgramStage.MENTOR) {
			renderingEngine.loadPage("pages/program/prescription.html", "form",
					AppConstants.Event.MENTOR_PAGE_BIND_EVENTS);
		/*} else if (programStage == AppConstants.ProgramStage.MONITOR) {
			renderingEngine.loadPage("pages/monitor/Substances.html", "form",
					AppConstants.Event.MONITOR_PAGE_BIND_EVENTS);*/
		} else if (programStage == AppConstants.ProgramStage.MONITOR) {
			renderingEngine.loadPage("pages/monitor/Monitor.html", "form",
					AppConstants.Event.MONITOR_PAGE_BIND_EVENTS);
		}

	}
	;

	

}
