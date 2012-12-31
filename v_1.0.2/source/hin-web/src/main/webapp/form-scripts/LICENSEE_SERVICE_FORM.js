function LICENSEE_SERVICE_FORM(message, appController, uiGenerator) {

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
			var costValue = conceptLookup.getAttribute("Cost");
			if (uiGenerator) {
				// var serviceDiv = $('#uiform-sub-head' +
				// uiGenerator.instanceId);
				var serviceDiv = $('#inner-uiform-' + thisObject.message.id);

				serviceDiv.find('input[tagname=amt]').val(costValue);
				serviceDiv.find('input[tagname=amt]').trigger('change');
			}
		}
	}
	;

	function onLoad(callback) {

		try {
			onServiceComplete(false);

			var message = thisObject.message;
			//alert("service form load");
			/*
			 * var dataLayer =
			 * thisObject.appController.getComponent("DataLayer"); var
			 * messageTypeScript = new MessageTypeScript(message.msg,
			 * message.messageType, this.appController);
			 * dataLayer.loadData("JS_" + message.messageType, {},
			 * function(data) { // alert("Script loaded");
			 * messageTypeScript.loadScript(data); var transactionType =
			 * AppConstants.TransactionType.SERVICE_FEE;
			 * messageTypeScript.fillData('transactionType', transactionType);
			 * messageTypeScript.fillData('transactionStatus', "ORDERED");
			 * 
			 * });
			 */
			/*var value = $("#inner-uiform-" + message.id)
					.find("#PNDisplayValue").attr('value');
			$("#inner-uiform-" + message.id).find("#pPhysician").attr("value",
					value);*/
			//createDiscountRow(message.id);
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
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var licenseeNewServicePage = page.stepPage;

		var serviceDiv = $('#uiform-sub-head' + uiGenerator.instanceId);

		if (deleteMode == true) {
			summerFunction();
		}
		if (!licenseeNewServicePage.serviceTotalRender) {
			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="total1"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);
			

			$('#footer-' + uiGenerator.instanceId).find('#selectServiceDiscount').change(function() {
				summerFunction();
			
			})
			
			$('#footer-' + uiGenerator.instanceId).find('#serviceDisAmt').keyup(function() {
				summerFunction();
			})

		}

		function summerFunction() {

			var sum = 0;
			var pFlag = false;

			serviceDiv.find('input[tagname=amt]').each(
					function() {

						var chkValue = $(this)
								.parents('[amountParent=licenseeService]').find(
										'[id=chk]').is(':checked');
						var messageId = $(this).parents(
								'[amountParent=licenseeService]').find('[id=chk]')
								.val();
						var map = licenseeNewServicePage.invoiceMessageMap.get(messageId);
						var serviceMap = licenseeNewServicePage.serviceMessageMap.get(messageId);
						if (!map) {
							licenseeNewServicePage.invoiceMessageMap.put(messageId,
									chkValue);
						} else {
							map.value = chkValue;
						}
						if (!serviceMap) {
							licenseeNewServicePage.serviceMessageMap.put(messageId,
									chkValue);
						} else {
							serviceMap.value = chkValue;
						}
						if (!isNaN(this.value) && this.value.length != 0) {
							if (chkValue == true) {
								sum += parseFloat(this.value);
								pFlag = true;
							}
						}			
					});
			licenseeNewServicePage.calculateTotal(sum);
			licenseeNewServicePage.serviceCheckFlag = pFlag;
		}
		;

		// serviceDiv.bind('DOMSubtreeModified', function() {
		$(serviceDiv).find('input[tagname=amt]')
				.unbind('keyup', summerFunction);
		$(serviceDiv).find('input[tagname=amt]').bind('keyup', summerFunction);
		$(serviceDiv).find('input[id=chk]').unbind('click', summerFunction);
		$(serviceDiv).find('input[id=chk]').bind('click', summerFunction);
		$(serviceDiv).find('input[id=chk]').unbind('click', clickHead);
		$(serviceDiv).find('input[id=chk]').bind('click', clickHead);

		/* Code to check/uncheck checkboxes */

		function clickHead() {
			var flag = true;
			serviceDiv.find('[id=chk]').each(function() {
				if ($(this).is(':checked') == false) {
					flag = false;
				}
			});

			if (flag == true) {
				$("#chkhead").attr('checked', true);
			} else {
				$("#chkhead").attr('checked', false);
			}
		}

		$('#chkhead').bind('click', function() {

			var res = '';
			if ($('#chkhead').is(':checked') == true) {
				res = true;
			} else {
				res = false;
			}

			serviceDiv.find('[id=chk]').each(function() {
				this.checked = res;
			});

			summerFunction();

		});

		/* Code to check/uncheck checkboxes */
		if (!licenseeNewServicePage.serviceTotalRender) {
			var uiGenerator = thisObject.uiGenerator
			$('#divSecondary'+uiGenerator.uiSelectedStep.stepName).show();
			$('#divPrimary'+uiGenerator.uiSelectedStep.stepName).css('width', '93%');
			$('#imgInvoice'+uiGenerator.uiSelectedStep.stepName).unbind('click', licenseeNewServicePage.addToInvoice);
			$('#imgInvoice'+uiGenerator.uiSelectedStep.stepName).bind('click', licenseeNewServicePage.addToInvoice);
			licenseeNewServicePage.loadComplete();
		}
	
		// alert("CHeckFlag: " + serviceCheckFlag)

		licenseeNewServicePage.serviceTotalRender = true;
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
		tableHeader += 'style="width:30%">licenseeService</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:31.3%">Consultant</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:12.1%">Amount</div> ';

		return tableHeader;
	}
	;


};