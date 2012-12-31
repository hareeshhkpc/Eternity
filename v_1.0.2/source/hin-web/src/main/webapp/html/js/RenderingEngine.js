/**
 * Rendering Engine is a child component of Application Controller. It renders
 * events to all of its Components. It has child components like appController,
 * Login, AppList, Contacts, Header, DefaultServices, MyOrg, Settings, Support,
 * ProfilePicture and MessageDocumentView. It catches the events from other
 * components and broadcasts the same events to all components except from which
 * that event triggers and which broadcasts that event. If required it handles
 * the events here itself.
 */

function RenderingEngine(appController) {
	/**
	 * className is used to refer the RenderingEngine class name in other
	 * components
	 */
	this.className = "RenderingEngine";

	/**
	 * eventQueue is used to add the events in queue to handle
	 * 
	 * @return
	 */
	this.eventQueue = new EventQueue();

	/**
	 * It gets the EventQueue from Application Controller.
	 * 
	 * @return eventQueue : Object of EventQueue class
	 */
	this.getEventQueue = getEventQueue;

	/**
	 * Broadcasts the events to all of its components except event source and
	 * broadcaster
	 */
	this.broadcastEvent = broadcastEvent;

	/**
	 * Handles the events from components
	 * 
	 * @param event
	 */
	this.eventHandler = eventHandler;

	this.getComponent = getComponent;

	this.getChildComponent = getChildComponent;
	/**
	 * appController is a private variable used to refer the Application
	 * Controller
	 */
	var appController = appController;

	/** renderingEngine is used to refer the RenderingEngine class object */
	var renderingEngine = this;

	/** Components has objects of child components */
	var childComponents = new Array();

	childComponents.push(appController);

	childComponents.push(new AppCalendar(renderingEngine));
	childComponents.push(new AppSchedule(renderingEngine));
	childComponents.push(new Archive(renderingEngine));

	childComponents.push(new Form(renderingEngine));

	childComponents.push(new Home(renderingEngine));

	childComponents.push(new Licensee(renderingEngine));
	childComponents.push(new Login(renderingEngine));

	childComponents.push(new Navigation(renderingEngine));
	childComponents.push(new NavigationLine(renderingEngine));

	childComponents.push(new Patient(renderingEngine));
	childComponents.push(new Process(renderingEngine));
	childComponents.push(new Program(renderingEngine));

	childComponents.push(new Resize(renderingEngine));

	childComponents.push(new Search(renderingEngine));
	childComponents.push(new SignUp(renderingEngine));
	childComponents.push(new Staff(renderingEngine));
	childComponents.push(new Statistics(renderingEngine));
	childComponents.push(new Settings(renderingEngine));
	childComponents.push(new Messages(renderingEngine));
	childComponents.push(new IMCommunication(renderingEngine));

	childComponents.push(new Documents(renderingEngine));
	childComponents.push(new Products(renderingEngine));
	childComponents.push(new TestResult(renderingEngine));
	childComponents.push(new PatientCalendar(renderingEngine));

	childComponents.push(new User(renderingEngine));
	childComponents.push(new RoleDefinition(renderingEngine));
	/*
	 * Start the EventQueue to process the events. It processes the events added
	 * to EventQueue for every 500ms
	 * 
	 * @see EventQueue
	 */
	this.eventQueue.start();

	this.fireEvent = fireEvent;
	this.setHeaderInfo = setHeaderInfo;
	this.setLeftHeaderInfo = setLeftHeaderInfo;
	this.setFormName = setFormName;
	this.clearHeaderInfo = clearHeaderInfo;
	this.registerClickEvent = registerClickEvent;
	this.loadPage = loadPage;
	this.loadPages = loadPages;
	this.showPageLoading = showPageLoading;
	this.hidePageLoading = hidePageLoading;

	this.messageScripts = new HIN.HashMap();
	this.putMessageScript = putMessageScript;
	this.getMessageScript = getMessageScript;

	this.formScripts = new HIN.HashMap();
	this.putFormScript = putFormScript;
	this.getFormScript = getFormScript;

	this.openModalDialog = openModalDialog;
	this.closeModalDialog = closeModalDialog;
	this.openPromptModalDialog = openPromptModalDialog;
	this.openPromptOkCancelModalDialog = openPromptOkCancelModalDialog;

	this.showBusy = showBusy;
	this.showIdle = showIdle;
	this.showFailure = showFailure;
	this.iconChange = iconChange;

	/* Function definitions */

	function getEventQueue() {
		return renderingEngine.eventQueue;
	}

	/* Function definitions */
	/**
	 * Provides the Appcontroller's child components based on the
	 * componentClassName
	 */
	function getComponent(componentClassName) {
		return appController.getComponent(componentClassName);
	}
	;

	/**
	 * Provides the RenderingEnginge's child components based on the
	 * componentClassName
	 */
	function getChildComponent(componentClassName) {
		for (componentIndex = 0; componentIndex < childComponents.length; componentIndex++) {
			if (componentClassName == childComponents[componentIndex].className) {
				return childComponents[componentIndex];
			}
		}
	}
	;

	function setProgress(id) {
		$('#' + id).html('<div class="loading"></div>');
	}
	;

	function appendProgress(id) {
		$('#' + id).append('<div class="loading"></div>');
	}
	;

	function setErrorStyle(id) {
		$('#' + id).css("background-color", "#FF0000");
		$('#' + id).css("color", "#FFFFFF");
	}
	;

	function removeErrorStyle(id) {
		$('#' + id).css("style", "");
	}
	;

	/**
	 * It shows busy icon on the menu bar
	 */
	function showBusy() {
		$('.idle').hide();
		$('.failure').hide();
		$('.busy').show();
	}
	;
	/**
	 * It shows idle icon on the menu bar
	 */
	function showIdle() {
		$('.busy').hide();
		$('.failure').hide();
		$('.idle').show();
	}
	;

	/**
	 * It shows failure icon on the menu bar
	 */
	function showFailure() {
		$('.idle').hide();
		$('.busy').hide();
		$('.failure').show();
	}
	;

	function showPageLoading(msg) {

		if (msg == undefined || msg == null) {
			msg = 'Loading....';
		}
		document.body.style.cursor = "wait";
		// $('#loadingMsg').html(msg);
		/*
		 * $.mobile.loadingMessage = (msg) ? msg : "Loading...";
		 * $.mobile.showPageLoadingMsg();
		 */
	}
	;

	function hidePageLoading() {
		document.body.style.cursor = "default";
		/* $.mobile.hidePageLoadingMsg(); */
	}
	;

	function broadcastEvent(event) {
		/*
		 * alert("RenderingEngine broadCast: " + event.type + " Event Source: " +
		 * event.eventSource.className);
		 */
		$
				.each(
						childComponents,
						function(index, value) {
							// alert("Current Class selected in RENDER
							// broadCast: " + value.className);
							if (value.className != event.eventSource.className
									&& (event.broadCaster == null || event.broadCaster.className != value.className)) {
								clone = AppUtil.getEvenClone(event);
								clone.broadCaster = renderingEngine;
								value.eventHandler(clone);
							} else {
								// alert("RenderingEngine broadCast Not firing
								// on: " + value.className);
							}
						});
	}
	;

	function eventHandler(event) {
		// alert("event handler in renderengine : " + event.type);

		if (event.type == AppConstants.Event.APPLICATION_INITIALIZED) {
			appController.getComponent("DataLayer").getCachedLoginInfo(
					"loginInfo", isLoginInfoExist);
		} else if (event.type == AppConstants.Event.APP_SCHEDULE_PAGE_INITIALIZED) {
			loadTemplatePage("pages/appschedule", renderingEngine
					.getChildComponent("AppSchedule").loadUI);
		} else if (event.type == AppConstants.Event.CALENDAR_PAGE_INITIALIZED) {
			loadTemplatePage("pages/appcalendar", renderingEngine
					.getChildComponent("AppCalendar").loadUI);
		} else if (event.type == AppConstants.Event.FORM_PAGE_INITIALIZED) {
			loadTemplatePage("pages/form", renderingEngine
					.getChildComponent("Form").loadUI);
		} else if (event.type == AppConstants.Event.HOME_PAGE_INITIALIZED) {
			loadTemplatePage("pages/home", renderingEngine
					.getChildComponent("Home").loadUI);
		} else if (event.type == AppConstants.Event.LOGIN_PAGE_INITIALIZED) {
			loadTemplatePage("pages/login", renderingEngine
					.getChildComponent("Login").loadUI);
		} else if (event.type == AppConstants.Event.PATIENT_PAGE_INITIALIZED) {
			loadTemplatePage("pages/patient", renderingEngine
					.getChildComponent("Patient").loadUI);
		} else if (event.type == AppConstants.Event.USER_PAGE_INITIALIZED) {
			loadTemplatePage("pages/user", renderingEngine
					.getChildComponent("User").loadUI);
		} else if (event.type == AppConstants.Event.STAFF_PAGE_INITIALIZED) {
			loadTemplatePage("pages/staff", renderingEngine
					.getChildComponent("Staff").loadUI);
		} else if (event.type == AppConstants.Event.LICENSEE_PAGE_INITIALIZED) {
			loadTemplatePage("pages/licensee", renderingEngine
					.getChildComponent("Licensee").loadUI);
		} else if (event.type == AppConstants.Event.PROGRAM_PAGE_INITIALIZED) {
			loadTemplatePage("pages/program", renderingEngine
					.getChildComponent("Program").loadUI);
		} else if (event.type == AppConstants.Event.REVIEW_PAGE_INITIALIZED) {
			loadTemplatePage("pages/review", renderingEngine
					.getChildComponent("Review").loadUI);
		} else if (event.type == AppConstants.Event.TEST_RESULTS_PAGE_INITIALIZED) {
			loadTemplatePage("pages/testresult", renderingEngine
					.getChildComponent("TestResult").loadUI);
		} else if (event.type == AppConstants.Event.STATISTICS_PAGE_INITIALIZED) {
			loadTemplatePage("pages/statistics", renderingEngine
					.getChildComponent("Statistics").loadUI);
		} else if (event.type == AppConstants.Event.SIGNUP_PAGE_INITIALIZED) {
			loadTemplatePage("pages/signup", renderingEngine
					.getChildComponent("SignUp").loadUI);
		} else if (event.type == AppConstants.Event.SETTINGS_PAGE_INITIALIZED) {
			loadTemplatePage("pages/settings", renderingEngine
					.getChildComponent("Settings").loadUI);
		} else if (event.type == AppConstants.Event.DOCUMENT_PAGE_INITIALIZED) {
			loadTemplatePage("pages/documents", renderingEngine
					.getChildComponent("Documents").loadUI, event);
		} else if (event.type == AppConstants.Event.PRODUCTS_PAGE_INITIALIZED) {
			loadTemplatePage("pages/products", renderingEngine
					.getChildComponent("Products").loadUI);
		} else if (event.type == AppConstants.Event.MESSAGES_PAGE_INITIALIZED) {
			loadTemplatePage("pages/messages", renderingEngine
					.getChildComponent("Messages").loadUI, event);
		} else if (event.type == AppConstants.Event.PATIENT_CALENDAR_PAGE_INITIALIZED) {
			loadTemplatePage("pages/patientCalendar", renderingEngine
					.getChildComponent("PatientCalendar").loadUI);
		} else if (event.type == AppConstants.Event.ROLEDEFINITION_PAGE_INITIALIZED) {
			loadTemplatePage("pages/roleDefinition", renderingEngine
					.getChildComponent("RoleDefinition").loadUI);
		} else {
			broadcastEvent(event);
		}
	}
	;
	/**
	 * It register the event to id property and to further manipulate those
	 * registered behaviors.
	 */

	function registerClickEvent(id, func) {
		if (id.indexOf(".") > -1) {
			$(id).unbind("click", func);
			$(id).bind("click", func);
		} else {
			$('#' + id).unbind("click", func);
			$('#' + id).bind("click", func);
		}
	}
	;

	function login() {
		appController.fireEvent(AppConstants.Event.LOGIN_PAGE_PROCESSED);
	}
	;

	/**
	 * It loads the template.html from the templatePath using ajax method.
	 */
	function loadTemplatePage(templatePath, func, event) {
		var templateUrl = templatePath + "/template.html";
		showPageLoading();
		$.ajax({
			type : "GET",
			url : templateUrl,
			dataType : "html",
			cache : false,
			success : function(data) {
				$('#template').html(data);
				$('#main').trigger('create');
				if (func)
					func(event);

				// alert('loadTemplatePage');
				/*
				 * renderingEngine.getChildComponent("Resize").setCurrentHeight(
				 * 512);
				 */
				appController.getComponent("RenderingEngine").fireEvent(
						AppConstants.Event.RESIZE);

				hidePageLoading();
			},

			error : function(request, error) {
				alert(request + ": " + error);
				hidePageLoading();
			}
		});
	}
	;
	/**
	 * It loads the html from the pageUrl using ajax method. The html data
	 * should be placed where the place holder is mentioned.Event and callback
	 * will be triggered after html page is loaded.
	 */
	function loadPage(pageUrl, placeHolderId, event, callback) {
		showPageLoading();
		$.ajax({

			type : "GET",
			url : pageUrl,
			dataType : "html",
			cache : false,
			success : function(data) {
				$('#' + placeHolderId).html(data);
				$('#main').trigger('create');
				if (event)
					renderingEngine.getEventQueue().postEvent(event, {},
							renderingEngine, renderingEngine);
				if (callback)
					callback();
				// alert('loadPage');
				/*
				 * renderingEngine.getChildComponent("Resize").setCurrentHeight(
				 * 512);
				 */
				hidePageLoading();
			},

			error : function(request, error) {
				alert(request + ": " + error);
				hidePageLoading();
			}
		});

	}
	;

	function loadPages(pageUrl, placeHolderId, event) {
		showPageLoading();
		$.ajax({

			type : "GET",
			url : pageUrl,
			dataType : "html",
			cache : false,
			success : function(data) {
				$('#' + placeHolderId).append(data);
				$('#main').trigger('create');
				hidePageLoading();
				if (event)
					renderingEngine.getEventQueue().postEvent(event, {},
							renderingEngine, renderingEngine);
			},

			error : function(request, error) {
				// alert(request + ": " + error);

				/*
				 * $('#' + placeHolderId).append('<h4>In progress ...</h4>');
				 * $('#main').trigger('create');
				 */

				if (event)
					renderingEngine.getEventQueue().postEvent(event, {},
							renderingEngine, renderingEngine);
				hidePageLoading();
			}
		});
	}
	;

	function loadUI() {
		alert("implement in corresponding js");
		/*
		 * loadPage("pages/login/login.html", "form",
		 * AppConstants.Event.LOGIN_PAGE_BIND_EVENTS);
		 */
		// loadPage("pages/registration/Profile.html", "form")
		// loadPage("pages/login/right.html", "right")
	}
	;

	function fireEvent(eventName) {
		appController.fireEvent(eventName);
	}
	;

	function iconChange() {
		$(".demographics-icon").hover(
				function() {
					$('.demographics-icon').removeClass('patient').addClass(
							'patient-hover');
				},
				function() {
					$('.demographics-icon').removeClass('patient-hover')
							.addClass('patient');
				}).click(function() {
			$(".demographics-icon").removeClass(this);
			$(".demographics-icon").addClass('patient-press');
		});

		$(".licensee-icon").hover(
				function() {
					$('.licensee-icon').removeClass('patient').addClass(
							'patient-hover');
				},
				function() {
					$('.licensee-icon').removeClass('patient-hover').addClass(
							'patient');
				}).click(function() {
			$(".licensee-icon").removeClass(this);
			$(".licensee-icon").addClass('patient-press');
		});

		$(".profile-icon").hover(
				function() {
					$('.profile-icon').removeClass('patient').addClass(
							'patient-hover');
				},
				function() {
					$('.profile-icon').removeClass('patient-hover').addClass(
							'patient');
				}).click(function() {
			$(".profile-icon").removeClass(this);
			$(".profile-icon").addClass('patient-press');
		});

		$(".calendar-icon").hover(
				function() {
					$('.calendar-icon').removeClass('calendar').addClass(
							'calendar-hover');
				},
				function() {
					$('.calendar-icon').removeClass('calendar-hover').addClass(
							'calendar');
				}).click(function() {
			$(".calendar-icon").removeClass(this);
			$(".calendar-icon").addClass('calendar-press');
		});
		;

		$(".account-icon").hover(
				function() {
					$('.account-icon').removeClass('accounting').addClass(
							'accounting-hover');
				},
				function() {
					$('.account-icon').removeClass('accounting-hover')
							.addClass('accounting');
				}).click(function() {
			$(".account-icon").removeClass(this);
			$(".account-icon").addClass('accounting-press');
		});

		$(".program-icon").hover(
				function() {
					$('.program-icon').removeClass('programs').addClass(
							'programs-hover');
				},
				function() {
					$('.program-icon').removeClass('programs-hover').addClass(
							'programs');
				}).click(function() {
			$(".program-icon").removeClass(this);
			$(".program-icon").addClass('programs-press');
		});

		$(".progress-icon").hover(
				function() {
					$('.progress-icon').removeClass('progress').addClass(
							'progress-hover');
				},
				function() {
					$('.progress-icon').removeClass('progress-hover').addClass(
							'progress');
				}).click(function() {
			$(".progress-icon").removeClass(this);
			$(".progress-icon").addClass('progress-press');
		});

		$(".document-icon").hover(
				function() {
					$('.document-icon').removeClass('document').addClass(
							'document-hover');
				},
				function() {
					$('.document-icon').removeClass('document-hover').addClass(
							'document');
				}).click(function() {
			$(".document-icon").removeClass(this);
			$(".document-icon").addClass('document-press');
		});

		$(".admin-icon").hover(function() {
			$('.admin-icon').removeClass('admin').addClass('admin-hover');
		}, function() {
			$('.admin-icon').removeClass('admin-hover').addClass('admin');
		}).click(function() {
			$(".admin-icon").removeClass(this);
			$(".admin-icon").addClass('admin-press');
		});

		$(".archive-icon").hover(
				function() {
					$('.archive-icon').removeClass('archive').addClass(
							'archive-hover');
				},
				function() {
					$('.archive-icon').removeClass('archive-hover').addClass(
							'archive');
				}).click(function() {
			$(".archive-icon").removeClass(this);
			$(".archive-icon").addClass('archive-press');
		});

		$(".library-icon").hover(
				function() {
					$('.library-icon').removeClass('library').addClass(
							'library-hover');
				},
				function() {
					$('.library-icon').removeClass('library-hover').addClass(
							'library');
				}).click(function() {
			$(".library-icon").removeClass(this);
			$(".library-icon").addClass('library-press');
		});

		$(".products-icon").hover(
				function() {
					$('.products-icon').removeClass('calendar').addClass(
							'calendar-hover');
				},
				function() {
					$('.products-icon').removeClass('calendar-hover').addClass(
							'calendar');
				}).click(function() {
			$(".products-icon").removeClass(this);
			$(".products-icon").addClass('calendar-press');
		});
	}
	;
	function setHeaderInfo(leftHeaderDesc, mainHeaderDesc) {
		$('#header').css("display", "block");
		$('#navigationHeader').css("display", "none");
		$('#leftHeader').html(leftHeaderDesc);
		$('#mainHeader').html(mainHeaderDesc);
	}
	;

	function setLeftHeaderInfo(leftHeaderDesc) {
		$('#header').css("display", "block");
		$('#navigationHeader').css("display", "block");
		$('#leftHeader').html(leftHeaderDesc);
	}
	;

	function setFormName(name) {

	}
	;

	function clearHeaderInfo() {
		$('#header').css("display", "none");
		$('#leftHeader').html("");
		$('#mainHeader').html("");
		$('#navigationHeader').css("display", "none");
	}
	;

	function putMessageScript(messageType, messageTypeScript) {
		this.messageScripts.put(messageType, messageTypeScript);
	}
	;
	function getMessageScript(messageType) {
		var map = this.messageScripts.get(messageType);
		if (map && map.value) {
			return map.value;
		}
		return null;
	}
	;

	function putFormScript(messageForm, formScript) {
		this.formScripts.put(messageForm, formScript);
	}
	;

	function getFormScript(messageForm) {
		var map = this.formScripts.get(messageForm);
		if (map && map.value) {
			return map.value;
		}
		return null;
	}
	;

	this.opened = false;

	/**
	 * Modal dialog will block to access the UI and provide the proper
	 * information to the end user.
	 */
	function openModalDialog(message) {
		if (this.opened == true) {
			this.closeModalDialog();
		}
		this.opened = true;
		var fullHTML = "";
		if (!message) {
			message = "";
		}

		fullHTML += "<div class='ui-body ui-body-v'>";
		fullHTML += "<h3>Please Wait ...</h3>";
		fullHTML += "<p>" + message + "<strong></strong> <em></em></p>";
		fullHTML += "<div data-role='collapsible' data-collapsed='true' data-theme='v'>";
		/*
		 * fullHTML += "<h3>More</h3>"; fullHTML += "<p></p>";
		 */
		fullHTML += "</div>";
		fullHTML += "</div>";

		/*
		 * fullHTML = "<ul data-role='listview'><li>Please Wait ... " +
		 * message + " ...</li></ul>";
		 */

		$('#main').simpledialog({
			'mode' : 'blank',
			'prompt' : false,
			'forceInput' : true,
			'cleanOnClose' : true,
			'useModal' : true,
			'fullHTML' : fullHTML
		});
	}
	;
	/**
	 * Close the opened modal dialog
	 */
	function closeModalDialog() {
		try {
			if (this.opened == true)
				$('#main').simpledialog('close');
			this.opened = false;
		} catch (e) {

		}
	}
	;

	/**
	 * Prompt the end user, options like 'ok' or 'cancel' and based on the input
	 * it will be provided the result as a callback method to the end user.
	 */
	function openPromptOkCancelModalDialog(message, callback) {

		var fullHTML = "";
		if (!message) {
			message = "";
		}

		$('#okCancelDialog').simpledialog({
			'mode' : 'bool',
			'prompt' : message,
			'useModal' : true,
			'buttons' : {
				'OK' : {
					click : function() {
						$('#dialogoutput').text('OK');
						if (callback)
							callback(true);
					}
				},
				'Cancel' : {
					click : function() {
						$('#dialogoutput').text('Cancel');
						if (callback)
							callback(false);
					},
					icon : "delete",
					theme : "c"
				}
			}
		});
	}
	;

	function openPromptModalDialog(message, callback) {

		var fullHTML = "";
		if (!message) {
			message = "";
		}

		$('#okDialog').simpledialog({
			'mode' : 'bool',
			'prompt' : message,
			'useModal' : true,
			'buttons' : {
				'OK' : {
					click : function() {
						$('#dialogoutput').text('OK');
						if (callback)
							callback(true);
					}
				}
			}
		});
	}
	;

	function isLoginInfoExist(loginInfo) {
		if (loginInfo) {
			appController.getComponent("DataLayer").getProcessDefinitions();
			var user = new HIN.UserVO();
			user.userName = loginInfo.username;
			user.password = loginInfo.password;
			appController.getEventQueue().postEvent(
					AppConstants.Event.LOGIN_PAGE_PROCESSED, user,
					renderingEngine, login);
		} else {
			appController.fireEvent(AppConstants.Event.LOGIN_PAGE_INITIALIZED);
		}
	}
	;
	this.isLoginInfoExist = isLoginInfoExist;

	function slideLeft() {
		renderingEngine.slideDelay = 200;
		var left = "67%";
		var right = "30%";
		$('.right-side-content').css('display', 'block')
		$('.inner-right').css('width', '70%')
		$(".left-side-content").animate({
			width : left
		}, renderingEngine.slideDelay);

		$(".right-side-content").animate({
			width : right
		}, renderingEngine.slideDelay);

		$('.left-side-content').css('height', renderingEngine.outerHeight);
		$('#form').html('');
	}
	this.slideLeft = slideLeft;
	function getUIDimensions() {
		var right = $('.right-side-content').css('width');
		if (right) {
			var innerHeight = $('.ui-left-top').css('height');
			var outerHeight = $('.left-side-content').css('height');
			var left = $('.left-side-content').css('width');

			renderingEngine.right = right.substring(0, right.length - 2);
			renderingEngine.left = left.substring(0, left.length - 2);
			renderingEngine.innerHeight = innerHeight;
			renderingEngine.outerHeight = outerHeight;
			var parentWidth = $('.left-side-content').offsetParent().width();
			var percent = 100 * renderingEngine.left / parentWidth;
			renderingEngine.left = percent + "%";

			parentWidth = $('.right-side-content').offsetParent().width();
			percent = 100 * renderingEngine.right / parentWidth;
			renderingEngine.right = percent + "%";
		}
	}
	;
	this.getUIDimensions = getUIDimensions;
	function slideRight() {
		getUIDimensions();

		var width = "98%";
		$('.right-side-content').css('display', 'none')
		// $('.left-side-content').css('width', width + "px");
		$('.inner-right').css('width', '94.5%')
		$(".left-side-content").animate({
			width : width
		}, renderingEngine.slideDelay);
		$(".right-side-content").animate({
			width : 0,
		}, renderingEngine.slideDelay);
		// $('.left-side-content').css('height', 'auto');
		// $('.ui-left-top').css('height', 'auto');

		$('.home-icon-link').css('display', 'none');
		$('#left-side').removeClass('left-side-bg');
	}
	;
	this.slideRight = slideRight;
	function loadDocument() {
		showPageLoading();
		$.ajax({
			type : "GET",
			url : "pages/documents/documents.html",
			dataType : "html",
			cache : false,
			success : function(data) {
				$('#' + "form").html(data);
				$('#main').trigger('create');
				slideRight();
				renderingEngine.getChildComponent("Documents").loadUI();
				hidePageLoading();
			},

			error : function(request, error) {
				alert(request + ": " + error);
				hidePageLoading();
			}
		});
	}
	;
	this.loadDocument = loadDocument;

}