/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function RoleDefinition(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "RoleDefinition";
	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var roleDefinition = this;

	var roleDefinitionProcesses = [];

	/* Function definitions */
	function eventHandler(event) {
		// alert("inside user event handler: " + event.type);
		if (event.type == AppConstants.Event.ROLEDEFINITION_PAGE_LOAD_EVENT) {
			// alert("ROLEDEFINITION_PAGE_LOAD_EVENT");
		} else if (event.type == AppConstants.Event.ROLEDEFINITION_HOME_PAGE_BIND_EVENT) {
			loadProcess();
			$('#left-side').removeClass('left-side-bg');
			$('#left-side').addClass('user-home-bg');
		}
	}
	;

	function loadUI() {
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.loadPage("pages/roleDefinition/roleDefinition.html",
				"form", AppConstants.Event.ROLEDEFINITION_HOME_PAGE_BIND_EVENT);
		$('.left-side-content').css('height', '525px');
	}
	;

	function loadProcess() {
		var leftHeaderInfo = "Role Definition";
		var formName = "RoleDefinition";
		var processName = "RoleDefinition";
		var processId = null;
		renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
		renderingEngine.setFormName(formName);
		renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
					processName : processName,
					type : "NewProcess",
					processId : processId
				}, renderingEngine, roleDefinition);
	}
	;
}
