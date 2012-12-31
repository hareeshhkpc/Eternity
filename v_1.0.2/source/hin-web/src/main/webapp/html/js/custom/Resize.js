/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function Resize(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "Resize";

	// this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var resize = this;

	var userProcesses = [];
	this.getHeight = getHeight;
	// this.setCurrentHeight = setCurrentHeight;
	this.currentHeight = 0;
	// this.height = 525;
	this.delay = 100;

	/* Function definitions */

	function eventHandler(event) {

		if (event.type == AppConstants.Event.RESIZE) {
			var wHeight = $(window).height() - 50;

			$('.loginscreen').css('height', wHeight + 65);

			$('.ui-login-position').css('margin-top', wHeight - 550);
			$('#home-data').css('margin-top', wHeight - 450);
			
			$('.data-area').css('height', wHeight - 100);
			/*
			 * $("#mcs_container").animate({ height : wHeight - 140 },
			 * resize.delay);
			 */	
			$('.ui-document-downloads').css('height', wHeight - 100);			

			$("#mcs_container").css('height', wHeight - 140);

			$('#mcs_container').find(".dragger_container").css('height',
					wHeight - 140);

			renderingEngine.getChildComponent("Search").mCustomScrollbars();

			var processNavHeight = $(".ui-left-top").css('height');
			processNavHeight = parseInt(processNavHeight);

			var applyHeight = 0;

			if (processNavHeight > wHeight) {
				wHeight = processNavHeight;

				resize.height = wHeight + 7;

				applyHeight = resize.height;

				$(".left-side-content").animate({
					height : applyHeight
				}, resize.delay);

				$(".right-side-content").animate({
					height : applyHeight
				}, resize.delay);

				$('.archive-left-side-content').css('height', applyHeight);
				$('.archive-right-side-content').css('height', applyHeight);
				/*
				 * $('.ui-login-position').css('top', wHeight - 350);
				 * $('#home-data').css('margin-top', wHeight - 450);
				 */
				$('.ui-left-side-forms').css('height', applyHeight - 140);
				$('.inner-right-form').css('height', applyHeight - 80);
				$('.data-area').css('height', applyHeight - 100);
				$('.ui-document-downloads').css('height', applyHeight - 100);	
				// alert(applyHeight);
			//	$('.loginscreen').css('height', applyHeight + 10);

				/*
				 * $("#mcs_container").animate({ height : applyHeight - 110 },
				 * resize.delay);
				 */

				$("#mcs_container").css('height', applyHeight - 110);

				$('#mcs_container').find(".dragger_container").css('height',
						applyHeight - 110);

				renderingEngine.getChildComponent("Search").mCustomScrollbars();
				// renderingEngine.getChildComponent("Process").mCustomScrollbars();

			} else {

				// applyHeight = wHeight;

				$(".left-side-content").animate({
					height : wHeight - 45
				}, resize.delay);

				$(".right-side-content").animate({
					height : wHeight - 45
				}, resize.delay);

				$('.archive-left-side-content').css('height', wHeight - 45);
				$('.archive-right-side-content').css('height', wHeight - 45);
				$('.ui-left-side-forms').css('height', wHeight - 140);
				$('.inner-right-form').css('height', wHeight - 80);
				$('.data-area').css('height', wHeight - 120);
				$('.ui-login-position').css('margin-top', wHeight - 550);
				$('.ui-document-downloads').css('height', wHeight - 100);
				
				$('#home-data').css('margin-top', wHeight - 450);
				// alert(applyHeight);
				/*
				 * $("#mcs_container").animate({ height : applyHeight - 140 },
				 * resize.delay);
				 */

				$("#mcs_container").css('height', wHeight - 140);

				$('#mcs_container').find(".dragger_container").css('height',
						wHeight - 140);

				renderingEngine.getChildComponent("Search").mCustomScrollbars();
				// renderingEngine.getChildComponent("Process").mCustomScrollbars();

			}

		}
		renderingEngine.getChildComponent("Search").mCustomScrollbars();
	}
	;

	function getHeight() {
		return resize.height;
	}

}
