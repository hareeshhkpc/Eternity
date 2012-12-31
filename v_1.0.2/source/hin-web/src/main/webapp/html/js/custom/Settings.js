function Settings(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Settings";
	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var settings = this;

	/* Function definitions */

	function eventHandler(event) {
		if (event.type == AppConstants.Event.SETTINGS_PAGE_BIND_EVENTS) {
			/*
			 * renderingEngine.setLeftHeaderInfo("");
			 * renderingEngine.setFormName("");
			 */
			$(".ui-process-button").hover(function() {
				$('.ui-process-button').css('background', '#8d007f');
			}, function() {
				$('.ui-process-button').css('background', '#6B1E64');
			}).click(
					function() {
						/* $(".ui-process-button").removeClass(this); */
						$(".ui-process-button").css('background', '#b2479f');
						renderingEngine.showPageLoading();
						renderingEngine.openModalDialog("Synchronizing data");
						HL.doForceSync(function() {
							appController.getComponent("RenderingEngine")
									.hidePageLoading();
							appController.getComponent("RenderingEngine")
									.closeModalDialog();
						}, function() {
							appController.getComponent("RenderingEngine")
									.hidePageLoading();
							appController.getComponent("RenderingEngine")
									.closeModalDialog();
						});
					});

		}

	}
	;

	function loadUI() {
		// renderingEngine.setLeftHeaderInfo("");
		renderingEngine.loadPage("pages/settings/settings.html", "form",
				AppConstants.Event.SETTINGS_PAGE_BIND_EVENTS);

	}
	;
	function loadProcess() {
		/*
		 * var leftHeaderInfo = $(this).attr("leftHeaderInfo"); var formName =
		 * $(this).attr("formName"); var processName =
		 * $(this).attr("processName"); var processId =
		 * $(this).attr("processId"); if (this.id == "newSignUp")
		 */
		leftHeaderInfo = "New User";
		/*
		 * if (leftHeaderInfo)
		 * renderingEngine.setLeftHeaderInfo(leftHeaderInfo);
		 */

		var formName = "SignUp";
		var processName = "SignUp";
		var processId = null;
		renderingEngine.setFormName(formName);
		renderingEngine.fireEvent(AppConstants.Event.CLEAR_SEARCH_CONTEXT);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.PROCESS_PAGE_LOAD_EVENT, {
					processName : processName,
					type : "NewProcess",
					processId : processId
				}, renderingEngine, signUp);
	}
	;

}
