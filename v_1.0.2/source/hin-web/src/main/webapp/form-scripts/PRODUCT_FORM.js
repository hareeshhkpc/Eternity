function PRODUCT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.getProductTableHeader = getProductTableHeader;

	function initialize() {

		try {
			var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			if (messageAndUIBinder) {
				messageAndUIBinder.addEditorListener("service",
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
				var productDiv = $('#inner-uiform-' + thisObject.message.id);
				var totalProductAmount = '';
				var feeValue = conceptLookup.getAttribute("Fee");
				feeValue = parseFloat(feeValue).toFixed(2);
				// alert("FeeAmount: " + feeValue);
				if (productDiv.find('input[tagname=unitQuantity]').val() != ''
						&& productDiv.find('input[tagname=unitQuantity]').val() != 0) {
					totalProductAmount = feeValue
							* productDiv.find('input[tagname=unitQuantity]')
									.val();
				} else {
					totalProductAmount = feeValue;
				}
				productDiv.find('input[tagname=unitPriceAmt]').val(
						totalProductAmount);
				productDiv.find('input[id=unitPrice]').val(feeValue);
				productDiv.find('input[tagname=unitQuantity]').val(1);
				productDiv.find('input[tagname=unitPriceAmt]')
						.trigger('change');
				productDiv.find('input[id=unitPrice]').trigger('change');
			}
		}
	}
	;

	function onLoad(callback) {

		try {
			onProductComplete(false);

			var message = thisObject.message;
			/*
			 * var dataLayer =
			 * thisObject.appController.getComponent("DataLayer"); var
			 * messageTypeScript = new MessageTypeScript(message.msg,
			 * message.messageType, this.appController);
			 * dataLayer.loadData("JS_" + message.messageType, {},
			 * function(data) { // alert("Script loaded");
			 * messageTypeScript.loadScript(data); var transactionType =
			 * AppConstants.TransactionType.PRODUCT_FEE;
			 * messageTypeScript.fillData('transactionType', transactionType);
			 * messageTypeScript.fillData('transactionStatus',
			 * AppConstants.TransactionStatus.ORDERED); });
			 */

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			onProductComplete(true);
		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function onProductComplete(deleteMode) {

		// alert("onProductComplete : " + deleteMode);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var accountPage = page.stepPage;
		var productDiv = $('#uiform-sub-head' + uiGenerator.instanceId);

		if (deleteMode == true) {
			productSumFunction();
		}

		// alert("Second" + productDiv.attr('id'));
		if (!accountPage.productTotalRender) {
			// $("#accountPage

			// >
			// div:last-child");
			// alert("inside: "+accountPage.productTotalRender)
			var productTotalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			productTotalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			productTotalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text"  readonly="readonly" id="total2" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(productTotalBlock);
			// $("#accountPage").trigger("refresh");
		}

		function productSumFunction() {

			var sum = 0;
			var sFlag = false;
			// alert("productSumFunction: " + productDiv.attr('id'));

			productDiv.find('input[tagname=unitPriceAmt]').each(
					function() {

						var chkValue = $(this)
								.parents('[amountParent=product]').find(
										'[id=chk]').is(':checked');
						var messageId = $(this).parents(
								'[amountParent=product]').find('[id=chk]')
								.val();

						var map = accountPage.invoiceMessageMap.get(messageId);
						if (!map) {
							accountPage.invoiceMessageMap.put(messageId,
									chkValue);
						} else {
							map.value = chkValue;
						}

						/*
						 * if (chkValue == true) { var map =
						 * accountPage.invoiceMessageMap .get(messageId); if
						 * (!map) { accountPage.invoiceMessageMap.put(
						 * messageId, messageId); } } else {
						 * 
						 * var map = accountPage.invoiceMessageMap
						 * .get(messageId); if (map) {
						 * accountPage.invoiceMessageMap .removeItem(messageId); } //
						 * alert(map.value) }
						 */

						// alert($(this).parents('[amountParent=product]').length);
						// alert($(this).parents('[amountParent=product]').find('[id=chk]').length);
						// alert("CheckBox: " + chkValue);
						// add only if the value is number
						if (!isNaN(this.value) && this.value.length != 0) {
							if (chkValue == true) {
								sum += parseFloat(this.value);
								sFlag = true;
							}
						}

					});
			$("#total2").val(parseFloat(sum).toFixed(2));
			accountPage.productCheckFlag = sFlag;

		}
		;

		// serviceDiv.bind('DOMSubtreeModified', function() {
		$(productDiv).find('input[tagname=unitPriceAmt]').unbind('keyup',
				productSumFunction);
		$(productDiv).find('input[tagname=unitPriceAmt]').bind('keyup',
				productSumFunction);
		$(productDiv).find('input[id=chk]').unbind('click', productSumFunction);
		$(productDiv).find('input[id=chk]').bind('click', productSumFunction);
		$(productDiv).find('input[id=chk]').unbind('click', clickHead);
		$(productDiv).find('input[id=chk]').bind('click', clickHead);

		/* function to change amount based on quantity value */
		$(productDiv).find('input[tagname=unitQuantity]').bind(
				'keyup',
				function() {
					var currentAmount = '';
					// fetching the amount of single unit
					currentAmount = $(this).parents('[amountParent=product]')
							.find('input[id=unitPrice]').val();

					if (currentAmount == '' && currentAmount == 0) {
						var currentAmount = $(this).parents(
								'[amountParent=product]').find(
								'input[tagname=unitPriceAmt]').val();
						$(this).parents('[amountParent=product]').find(
								'input[id=unitPrice]').val(
								parseFloat(currentAmount).toFixed(2));
					}
					currentAmount = currentAmount * this.value;
					$(this).parents('[amountParent=product]').find(
							'input[tagname=unitPriceAmt]').val(
							parseFloat(currentAmount).toFixed(2));
					$(this).parents('[amountParent=product]').find(
							'input[tagname=unitPriceAmt]').trigger('change');
					productSumFunction();

				});

		/* Code to check/uncheck checkboxes */

		function clickHead() {
			var flag = true;
			productDiv.find('[id=chk]').each(function() {
				if ($(this).is(':checked') == false) {
					flag = false;
				}
			});

			if (flag == true) {
				$("#chkhead2").attr('checked', true);
			} else {
				$("#chkhead2").attr('checked', false);
			}
		}

		$('#chkhead2').bind('click', function() {

			var res = '';
			if ($('#chkhead2').is(':checked') == true) {
				res = true;
			} else {
				res = false;
			}

			productDiv.find('[id=chk]').each(function() {
				this.checked = res;
			});

			productSumFunction();

		});

		/* Code to check/uncheck checkboxes */
		/*if (!accountPage.serviceTotalRender) {
			var uiGenerator = thisObject.uiGenerator
			$('#divSecondary' + uiGenerator.uiSelectedStep.stepName).show();
			$('#divPrimary' + uiGenerator.uiSelectedStep.stepName).css('width',
					'93%');
			
			 * $('#divSecondary').show(); $('#divPrimary').css('width', '93%');
			 
			$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).unbind(
					'click', accountPage.addToInvoice);
			$('#imgInvoice' + uiGenerator.uiSelectedStep.stepName).bind(
					'click', accountPage.addToInvoice);

			$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName)
					.unbind('click', accountPage.generateInvoice);
			$('#imgGenerateInvoice' + uiGenerator.uiSelectedStep.stepName)
					.bind('click', accountPage.generateInvoice);
		}*/

		// alert("CHeckFlag: " + checkFlag)

		accountPage.productTotalRender = true;
	}
	;

	function getProductTableHeader() {
		var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
		tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
		tableHeader += 'style="width:3%"><input type="checkbox" data-role="none" id="chkhead2" value="" /></div>';
		tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
		tableHeader += 'style="width:16%">Date</div>';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:46.9%">Product</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:12.3%">Quantity</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:14.2%">Amount</div> ';
		return tableHeader;
	}

};