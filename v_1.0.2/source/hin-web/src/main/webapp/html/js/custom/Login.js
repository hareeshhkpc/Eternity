/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Login(renderingEngine) {
	/**
	 * Handles the events from components
	 * 
	 * @param event
	 */
	this.eventHandler = eventHandler;
	this.className = "Login";

	this.loadUI = loadUI;

	var renderingEngine = renderingEngine;
	var login = this;

	/* Function definitions */

	function eventHandler(event) {
		// alert("inside login event handler: " + event.type);
		if (event.type == AppConstants.Event.LOGIN_PAGE_BIND_EVENTS) {
			/*
			 * $("#loginForm").validationEngine('attach', { bindMethod : "live"
			 * });
			 */
			var winHeight = $(window).height();
			// alert(winHeight);
			$('.loginscreen').css('height', winHeight);
			$('.ui-login-position').css('margin-top', winHeight - 550);

			$('#username').focus();
			$("#password").keyup(function(event) {
				if (event.keyCode == 13) {
					$("#login").click();
				}
			});

			$("#login").hover(function() {
				$('#login').css('background', '#8d007f');
			}, function() {
				$('#login').css('background', '#6B1E64');
			});

			$("#login").click(function() {
				$('#login').css('background', '#b2479f');
				if ($('#loginForm').validationEngine('validate')) {
					authenticate();
				}
			});

			$("#signup").hover(function() {
				$('#signup').css('background', '#8d007f');
			}, function() {
				$('#signup').css('background', '#6B1E64');
			});
			// $("#signup").die("click");
			$("#signup")
					.live(
							"click",
							function() {
								$('#signup').css('background', '#b2479f');
								renderingEngine
										.fireEvent(AppConstants.Event.SIGNUP_PAGE_INITIALIZED);
							});
		} else if (event.type == AppConstants.Event.LOGIN_PAGE_RESPONSE) {
			// alert("inside login event handler: " + event.type);
			/*
			 * renderingEngine.getEventQueue().postEvent(
			 * AppConstants.Event.HOME_PAGE_FETCH_DATA, {}, renderingEngine,
			 * login);
			 */
			document.title = "Eternity Medicine Institute";
			renderingEngine.fireEvent(AppConstants.Event.HOME_PAGE_INITIALIZED);
		} else if (event.type == AppConstants.Event.LOGIN_PAGE_ERROR) {
			$('#username').val('');
			$('#password').val('');
			$('#username').focus();

			$("#msg").message("show");
			$("#msg").message({
				type : "error",
				message : "Invalid UserName or Password.  "
			});
			// notificationmsg.error("Invalid UserName or Password.");
			// $('#errormsg').css("display","block");
			/*
			 * renderingEngine.getEventQueue().postEvent(
			 * AppConstants.Event.LOGIN_PAGE_INITIALIZED, {}, renderingEngine,
			 * login);
			 */

		}
	}
	;

	/**
	 * Get the data from UI and post the event to event queue.
	 */
	function authenticate() {
		var username = $('#username').val();
		var password = $('#password').val();
		/*
		 * var usn = username.toLowerCase(); username =
		 * capitaliseFirstLetter(usn);
		 */
		var user = new HIN.UserVO();
		user.userName = username;
		user.password = password;
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.LOGIN_PAGE_PROCESSED, user, renderingEngine,
				login);
	}
	;

	/**
	 * Load the html page and bind the ui events.
	 */
	function loadUI() {

		appController.getComponent("RenderingEngine").showPageLoading(
				"Synchronizing configurations...");
		appController.getComponent("RenderingEngine").openModalDialog(
				"Synchronizing configurations");

		HL.syncMeta(function() {
			appController.getComponent("DataLayer").getProcessDefinitions(
					loadLogin);

		}, function() {

			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();

		});
		// appController.getComponent("DataLayer").loadAllStaticDatas(loadLogin);

		// loadLogin();
	}
	;

	function loadLogin() {
		appController.getComponent("RenderingEngine").hidePageLoading();
		appController.getComponent("RenderingEngine").closeModalDialog();
		renderingEngine.loadPage("pages/login/login.html", "form",
				AppConstants.Event.LOGIN_PAGE_BIND_EVENTS);

		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);
	}
	;

	/*
	 * function capitaliseFirstLetter(string) { return
	 * string.charAt(0).toUpperCase() + string.slice(1); }
	 */
}
