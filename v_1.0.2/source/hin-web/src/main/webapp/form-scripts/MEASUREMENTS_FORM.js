function MEASUREMENTS_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;

	this.onLoadComplete_PhysicalExamination = onLoadComplete_PhysicalExamination;
	this.toggleSections = toggleSections;
	this.getTotal = getTotal;

	function initialize() {

		try {
			// alert("initialize");
		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {
			// alert("onLoad");
			thisObject.onLoadComplete_PhysicalExamination(message.messageType,
					message);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onLoadComplete_PhysicalExamination(messageType, message) {
		$('#inner-uiform-' + message.id).find(".ui-cns-header").unbind('click',
				function() {

				});
		$('#inner-uiform-' + message.id).find(".ui-cns-header").bind('click',
				function() {
					thisObject.toggleSections(message, this);
				});

		$("#riskByExamination").find('[finding="onchange"]').change(function() {
			thisObject.getTotal();
		});

	}
	;

	function toggleSections(message, htmlFrag) {
		/*
		 * var blockId = $(htmlFrag).attr("blockId"); $('#inner-uiform-' +
		 * message.id).find("#" + blockId).toggle();
		 */

		var currentPage = $(htmlFrag).attr('blockid');
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();

		if (thisObject.lastOpenPage == null) {
			thisObject.lastOpenPage = currentPage;
			$('#' + currentPage)
					.slideToggle(
							'slow',
							function() {
								thisObject.message.messageAndUIBinder.parentContainerID = currentPage;
								var lookupHandler = thisObject.appController
										.getComponent("DataLayer").lookupHandler;
								thisObject.message.messageAndUIBinder
										.loadDataOntoForm(lookupHandler);
								page.pageResized();
							});
		} else {
			if (thisObject.lastOpenPage == currentPage) {
				$('#' + thisObject.lastOpenPage).slideToggle('slow',
						function() {
							page.pageResized();
						});
				thisObject.lastOpenPage = null;
			} else {
				$('#' + thisObject.lastOpenPage).slideToggle('slow',
						function() {
							page.pageResized();
						});
				$('#' + currentPage).slideToggle('slow', function() {
					page.pageResized();
				});
				thisObject.lastOpenPage = currentPage;
			}

		}

	}

	function onUnLoad(callback) {

		try {

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;
	function getTotal() {
		var yesCount = 0;
		var noCount = 0;
		$("#riskByExamination").find('[dataField="true"]').each(
				function(index, value) {
					if ($(value).is(':checked')) {
						if ($(this).val() == '1') {
							yesCount += 1;
						}
						if ($(this).val() == '0') {
							noCount += 1;
						}
					}
				});
		$("#EDDisplayValue27").val(yesCount);
		$("#EDDisplayValue27").trigger('change');
		$("#EDDisplayValue28").val(noCount);
		$("#EDDisplayValue28").trigger('change');
	}
	;

};