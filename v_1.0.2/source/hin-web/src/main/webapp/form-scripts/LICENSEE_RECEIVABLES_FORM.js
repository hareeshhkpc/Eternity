function LICENSEE_RECEIVABLES_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.getServiceTableHeader = getServiceTableHeader;

	function initialize() {

		try {
			var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			if (messageAndUIBinder) {
				messageAndUIBinder.addEditorListener("serviceLookup",
						"serviceListener", serviceListenerHandler);
			}

		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function serviceListenerHandler(conceptName) {
		var page = thisObject.appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		page.fetchConceptByName(conceptName, conceptHandler, null);

	}
	;

	function conceptHandler(conceptLookup) {
		if (conceptLookup) {
			var feeValue = conceptLookup.getAttribute("Fee");
			if (uiGenerator) {
				// var serviceDiv = $('#uiform-sub-head' +
				// uiGenerator.instanceId);
				var serviceDiv = $('#inner-uiform-' + thisObject.message.id);

				serviceDiv.find('input[tagname=amt]').val(feeValue);
				serviceDiv.find('input[tagname=amt]').trigger('change');
			}
		}
	}
	;

	function onLoad(callback) {

		try {
			setAge();
			onServiceComplete(false);

			var message = thisObject.message;
			
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			
			onServiceComplete(true);
		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function onServiceComplete(deleteMode) {
		// alert("onServiceComplete : " + deleteMode);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var licenseeBooksPage = page.stepPage;

		var serviceDiv = $('#uiform-sub-head' + uiGenerator.instanceId);
	
	

		if (!licenseeBooksPage.serviceTotalRender) {
			// appending total text box after new services and new products
			// alert(licenseeBooksPage.serviceTotalRender);

			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="total2"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);

		}
		summerFunction();
		
		function summerFunction() {
			var sum = 0;
			serviceDiv.find('input[tagname=amt]').each(
					function() {
						if (!isNaN(this.value) && this.value.length != 0) {
								sum += parseFloat(this.value);
						}

					});
			$("#total2").val(sum);


		}
		;

		/* Code to check/uncheck checkboxes */
		if (!licenseeBooksPage.serviceTotalRender) {
			$('#divSecondary').show();
			$('#divPrimary').css('width', '93%');
			$('#imgInvoice').unbind('click', licenseeBooksPage.addToInvoice);
			$('#imgInvoice').bind('click', licenseeBooksPage.addToInvoice);
		}

		// alert("CHeckFlag: " + serviceCheckFlag)

		licenseeBooksPage.serviceTotalRender = true;
	}
	;

	function getServiceTableHeader() {
		var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
		tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
		tableHeader += 'style="border-right:0px;width:3%"><input type="checkbox" data-role="none" id="chkhead" value="" /></div>';
		tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
		tableHeader += 'style="width:16%">Date</div>';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:30%">licenseeReceivable</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:31.3%">Consultant</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:12.1%">Amount</div> ';

		return tableHeader;
	}
	;
	
	function setAge() {
		var messageId = message.messageId;
		var msg = licenseeBooksPage.appController.getComponent("DataLayer")
				.getMsg(messageId);
		var dateTime = XmlUtil.getXPathResult(msg.getXML(),
				'message/FIAB_MT020000HT02/effectiveTime/value',
				XPathResult.STRING_TYPE);
		var messageDate = dateTime.stringValue;
		var arrayDate = messageDate.split(" ");
		messageDate = arrayDate[0];
		
		messageDate = new Date(messageDate);
		var presentDate = currentDate();
		presentDate = new Date(presentDate);
		var dateDiff = inDays(messageDate, presentDate);
		if (isNaN(dateDiff)) {
			dateDiff=0;
		}
		$('#'+message.messageAndUIBinder.parentContainerID).find('#invoiceAge').val(dateDiff+"days");

	}
	;
	function currentDate() {
		var date = new Date();
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		var day = (day < 10) ? '0' + day : day;
		var month = (month < 10) ? '0' + month : month;
		var fullDate = year + '-' + month + '-' + day;
		return fullDate;
	};
	function inDays(d1, d2) {

		var t1 = d1.getTime();
		var t2 = d2.getTime();

		return parseInt((t2 - t1) / (24 * 3600 * 1000));

	}
	;
};