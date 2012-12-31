/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Form(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Form";

	this.loadUI = loadUI;

	var renderingEngine = renderingEngine;
	var form = this;

	this.messageType = null;

	this.getMessageType = getMessageType;
	this.setMessageType = setMessageType;

	this.placeHolder = "form";
	this.getPlaceHolder = getPlaceHolder;
	this.setPlaceHolder = setPlaceHolder;

	this.selectedStep = null;
	this.iframe = false;
	this.getIframe = getIframe;
	this.setIframe = setIframe;
	this.page = new HIN.Page(null, "");
	/* Function definitions */

	this.getPage = getPage;
	this.setPage = setPage;

	function eventHandler(event) {
		// alert("inside form event handler: " + event.type);
		if (event.type == AppConstants.Event.FORM_PAGE_LOAD_EVENT) {
			this.selectedStep = event.data;
			// alert(this.selectedStep.groupName);

			$('.inner-right-form').removeClass('ui-info-bg');
			if (this.selectedStep.groupName == "Registration"
					|| this.selectedStep.groupName == "Demographics" || this.selectedStep.groupName == "Company" ||
					this.selectedStep.groupName == "Settings" || this.selectedStep.groupName == "Contact") {
				$('.inner-right-form').addClass('ui-info-bg');
			}
			loadUI();
		} else if (event.type == AppConstants.Event.FORM_PAGE_BIND_EVENT) {

			try {
				var stepPage = form.selectedStep.formHtml;
				var stepPageJS = stepPage + "Page";
				form.page.lastOpenedFormId = null;
				/* alert(" stepPageJS : " + stepPageJS); */
				var stepPageObject = eval('new HIN.' + stepPageJS
						+ '(appController, "");');
				/* alert("stepPageObject : " + stepPageObject); */
				form.page.setStepPage(stepPageObject);
				form.page.appController = appController;
				/*if (stepPageJS == "EnrollmentPage"
						|| stepPageJS == "SignUpPage"
						|| stepPageJS == "PatientRegistrationPage"
						|| stepPageJS == "StaffRegistrationPage") {*/
					form.page.init();
				/*} else {
					form.page.init();
					form.page.loadUI();
				}*/
			} catch (e) {

			}

			/*
			 * this.page.setStepPage(new HIN.MonitorPage(appController,
			 * "monitorPage")); this.page.init(); this.page.loadUI()
			 */

			/*var searchVO = renderingEngine.getComponent("Context")
					.getSearchVO();
			if (searchVO != null && searchVO.id != null) {
				var messageVO = new HIN.MessageVO();
				messageVO.id = searchVO.id;

				renderingEngine.getEventQueue().postEvent(
						AppConstants.Event.FORM_PAGE_FETCH_DATA, {
							messageVO : messageVO
						}, renderingEngine, form);
			} else {

				renderingEngine
						.fireEvent(AppConstants.Event.FORM_PAGE_FILL_DATA);
			}*/
		} else if (event.type == AppConstants.Event.FORM_PAGE_FILL_DATA) {

		} else if (event.type == AppConstants.Event.FORM_PAGE_RESPONSE) {
			renderingEngine.setLeftHeaderInfo("Patient Name");
		} else if (event.type == AppConstants.Event.FORM_PAGE_ERROR) {

		}
	}
	;

	function loadUI() {
		var api = null;
		this.placeHolder = renderingEngine.getChildComponent("Form")
				.getPlaceHolder();
		//alert(this.placeHolder);
		this.iframe = renderingEngine.getChildComponent("Form").getIframe();
		if (this.iframe) {
			alert(form.selectedStep.formHtml);
			/*
			 * $('#' + this.placeHolder).attr("src", "pages/steps/" +
			 * form.selectedStep.formHtml + ".html");
			 */
			var src = "pages/steps/" + form.selectedStep.formHtml + ".html";
			var html = '<div style="height:auto;border:1px solid #0000FF"><iframe class="ui-inner-display-box ui-header-corner-top" height="100%" width="100%"  scrolling="auto"></iframe></div>'
			if (api === null) {
				api = new IFramePageApi(src, this.placeHolder, html);
				alert("API : " + api + " appController : " + appController);
				api.loadIFrame({
					appController : appController,
					idGenerator : idGenerator
				}, null);
			}

			/*
			 * alert(form.selectedStep); var id = id='"child_' +
			 * form.selectedStep.stepName + '_form"'; var iframeDoc =
			 * $("iframe[id=" + id + "]"); alert("id: " + id + ", Frame Count: " +
			 * iframeDoc.length); alert("Frames: " + $(iframeDoc).attr("id"));
			 * iframeDoc.hi();
			 */

		} else {
			renderingEngine.loadPages("pages/steps/"
					+ form.selectedStep.formHtml + ".html", this.placeHolder,
					AppConstants.Event.FORM_PAGE_BIND_EVENT);
			/* appController.fireEvent(AppConstants.Event.FORM_PAGE_BIND_EVENT); */
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

	function getPlaceHolder() {
		return this.placeHolder;
	}
	;

	function setPlaceHolder(placeHolder) {
		this.placeHolder = placeHolder;
	}
	;

	function getIframe() {
		return this.iframe;
	}
	;

	function setIframe(iframe) {
		this.iframe = iframe;
	}
	;

	function getPage() {
		return this.page;
	}
	;
	function setPage(page) {
		return this.page;
	}
	;
}
