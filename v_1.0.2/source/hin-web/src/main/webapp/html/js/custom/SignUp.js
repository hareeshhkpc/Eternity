function SignUp(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "SignUp";
	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var signUp = this;
	var userVo = null;
	/* Function definitions */

	function eventHandler(event) {
		if (event.type == AppConstants.Event.SIGNUP_PAGE_BIND_EVENT) {			
			$('#logout').hide();
			$('#loginPage').css('display', 'block');			
			$('#loginPage').unbind("click", bindLoginClick);
			$('#loginPage').bind("click", bindLoginClick);
			renderingEngine.setLeftHeaderInfo("");
			renderingEngine.setFormName("");
			loadProcess();
			renderingEngine.registerClickEvent('newSignUp', loadProcess);
			// alert(screen.height);

			// alert(screen.height);
			$('.left-side-content').css('height', '525px');
			$('.left-side-content').css('width', '98%');
			$('.right-side-content').hide('slow');
			$('.left-side-bg').css('background-size', '20%');
		}

	}
	;
	function bindLoginClick(){
		$('#logout').show();
		$("#loginPage").hide();
		$("#header").hide();
		var signUp=appController.getComponent("RenderingEngine").getChildComponent("SignUp");
		signUp.login();
	}

	function loadUI() {
		renderingEngine.setLeftHeaderInfo("");
		renderingEngine.loadPage("pages/signup/signup.html", "form",
				AppConstants.Event.SIGNUP_PAGE_BIND_EVENT);
		$('.left-side-content').css('height', '525px');
		/*$('.right-side-content').css('height', '525px');*/

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
	function login(){
		renderingEngine.getEventQueue().postEvent(
				 AppConstants.Event.LOGIN_PAGE_INITIALIZED, {}, renderingEngine,
				 login)
	}
	;
	this.login=login;
}
