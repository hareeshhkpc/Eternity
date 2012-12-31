function PAYMENT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;
	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.addTotal = addTotal;

	function initialize() {

		try {
			//alert("initialize : " + thisObject.uiGenerator);

			/*
			 * if (thisObject.uiGenerator) thisObject.uiGenerator.tableHeaders =
			 * thisObject .getServiceTableHeader();
			 */
		} catch (error) {
			alert("Error in form initialize  script: " + error);
		}

	}
	;

	function onLoad(callback) {

		try {	
			onServiceComplete(false);

			var message = thisObject.message;
			var uiGenerator = thisObject.uiGenerator;
			// alert("UIgenerator: " + uiGenerator.instanceId);
			// createDiscountRow('footer-' + uiGenerator.instanceId);
			$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('input[tagName=amt]')
					.unbind('keyup', addTotal);
			$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('input[tagName=amt]')
					.bind('keyup', addTotal);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			onServiceComplete(true);
			//alert("Unload form");

		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function addTotal() {
		var sum = 0;
		$('fieldset[amountParent=payment]').find('input[tagName=amt]').each(
				function() {
					sum = sum + parseFloat($(this).val());
				});
		$('#total').val(sum);
		var licenseeVO = appController.getComponent("Context").getLicenseeVO();
		if(licenseeVO){
				var data = parseFloat($(this).val()) * parseFloat(licenseeVO.exchangeRate);
			//appController.getComponent("DataLayer").currencyConvert($(this).val(), "USD", licenseeVO.currencyCode, licenseeVO.exchangeRate, function(data) {
				$("#inner-uiform-" + message.id).find('fieldset[amountParent=payment]').find('#UsdAmt').text(data.toFixed(2) + " " + licenseeVO.currencyCode);
			//});
		}	
	}
	;
	
	function onServiceComplete(deleteMode) {
		// alert("onServiceComplete : " + deleteMode);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var collectionPage = page.stepPage;

		var serviceDiv = $('#uiform-sub-head' + uiGenerator.instanceId);

		if (deleteMode == true) {
			summerFunction();
		}
		/*if (!collectionPage.serviceTotalRender) {
			// appending total text box after new services and new products
			// alert(collectionPage.serviceTotalRender);

			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="total1"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);

		}
*/
		function summerFunction() {

			var sum = 0;
			var pFlag = false;

			serviceDiv.find('input[tagname=amt]').each(
					function() {

						var chkValue = $(this)
								.parents('[amountParent=payment]').find(
										'[id=chk]').is(':checked');
						// alert("chkValue" + chkValue);
						var messageId = $(this).parents(
								'[amountParent=payment]').find('[id=chk]')
								.val();

						// if (chkValue == true) {
						var map = collectionPage.invoiceMessageMap.get(messageId);
						if (!map) {
							collectionPage.invoiceMessageMap.put(messageId,
									chkValue);
						} else {
							map.value = chkValue;
						}

						/*
						 * } else {
						 * 
						 * var map = collectionPage.invoiceMessageMap
						 * .get(messageId); if (map) {
						 * collectionPage.invoiceMessageMap .removeItem(messageId); } }
						 */
						/*
						 * alert($(this).parents('[amountParent=service]').length);
						 * alert($(this).parents('[amountParent=service]').find('[id=chk]').length);
						 * alert(chkValue);
						 */

						// add only if the value is number
						if (!isNaN(this.value) && this.value.length != 0) {
							if (chkValue == true) {
								sum += parseFloat(this.value);
								pFlag = true;
							}
						}

					});
			//alert(sum);
			$("#paymentTotal").val(sum);
			collectionPage.serviceCheckFlag = pFlag;
			// alert("CHeckFlag: " + serviceCheckFlag)

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
		/*if (!collectionPage.serviceTotalRender) {
			var uiGenerator = thisObject.uiGenerator
			$('#divSecondary' + uiGenerator.uiSelectedStep.stepName).show();
			$('#divPrimary' + uiGenerator.uiSelectedStep.stepName).css('width',
					'93%');
			
			 * $('#divSecondary').show(); $('#divPrimary').css('width', '93%');
			 
			$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).unbind(
					'click', collectionPage.addToInvoice);
			$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).bind(
					'click', collectionPage.addToInvoice);

			$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName)
					.unbind('click', collectionPage.generateInvoice);
			$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName)
					.bind('click', collectionPage.generateInvoice);
		}
*/
		// alert("CHeckFlag: " + serviceCheckFlag)

		collectionPage.serviceTotalRender = true;
	}
	;

};