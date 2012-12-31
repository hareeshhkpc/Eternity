function LICENSEE_PRODUCT_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.getProductTableHeader = getProductTableHeader;
	this.serviceListenerHandler = serviceListenerHandler;
	this.conceptHandler=conceptHandler;
	this.onProductComplete=onProductComplete;

	function initialize() {

		try {
			var message = thisObject.message;
			var messageAndUIBinder = message.messageAndUIBinder;
			if (messageAndUIBinder) {
				messageAndUIBinder.addEditorListener("product","serviceListener",
						serviceListenerHandler);
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
		var licenseeNewProductPage = page.stepPage;
		var productDiv = $('#uiform-sub-head' + uiGenerator.instanceId);

		if (deleteMode == true) {
			productSumFunction();
		}

		// alert("Second" + productDiv.attr('id'));
		if (!licenseeNewProductPage.productTotalRender) {
			//createDiscountRow(uiGenerator.instanceId);
			var productTotalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			productTotalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			productTotalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text"  readonly="readonly" id="total2" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(productTotalBlock);
			// $("#licenseeNewProductPage").trigger("refresh");
			
			$('#footer-' + uiGenerator.instanceId).find('#selectServiceDiscount').change(function() {
				productSumFunction();
			
			})
			
			$('#footer-' + uiGenerator.instanceId).find('#serviceDisAmt').keyup(function() {
				productSumFunction();
			})
		}

		function productSumFunction() {

			var sum = 0;
			var sFlag = false;
			// alert("productSumFunction: " + productDiv.attr('id'));

			productDiv.find('input[tagname=unitPriceAmt]').each(
					function() {

						var chkValue = $(this)
								.parents('[amountParent=LicenseeProduct]').find(
										'[id=chk]').is(':checked');
						var messageId = $(this).parents(
								'[amountParent=LicenseeProduct]').find('[id=chk]')
								.val();

						var map = licenseeNewProductPage.invoiceMessageMap.get(messageId);
						if (!map) {
							licenseeNewProductPage.invoiceMessageMap.put(messageId,
									chkValue);
						} else {
							map.value = chkValue;
						}

						/*
						 * if (chkValue == true) { var map =
						 * licenseeNewProductPage.invoiceMessageMap
						 * .get(messageId); if (!map) {
						 * licenseeNewProductPage.invoiceMessageMap.put(
						 * messageId, messageId); } } else {
						 * 
						 * var map = licenseeNewProductPage.invoiceMessageMap
						 * .get(messageId); if (map) {
						 * licenseeNewProductPage.invoiceMessageMap
						 * .removeItem(messageId); } // alert(map.value) }
						 */

						// alert($(this).parents('[amountParent=LicenseeProduct]').length);
						// alert($(this).parents('[amountParent=LicenseeProduct]').find('[id=chk]').length);
						// alert("CheckBox: " + chkValue);
						// add only if the value is number
						if (!isNaN(this.value) && this.value.length != 0) {
							if (chkValue == true) {
								sum += parseFloat(this.value);
								sFlag = true;
							}
						}
				

					});
			// alert(sum);
			licenseeNewProductPage.calculateTotal(sum);
			licenseeNewProductPage.productCheckFlag = sFlag;

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
					currentAmount = $(this).parents('[amountParent=LicenseeProduct]')
							.find('input[id=unitPrice]').val();

					if (currentAmount == '' && currentAmount == 0) {
						var currentAmount = $(this).parents(
								'[amountParent=LicenseeProduct]').find(
								'input[tagname=unitPriceAmt]').val();
						$(this).parents('[amountParent=LicenseeProduct]').find(
								'input[id=unitPrice]').val(currentAmount);
					}
					currentAmount = currentAmount * this.value;
					$(this).parents('[amountParent=LicenseeProduct]').find(
							'input[tagname=unitPriceAmt]').val(currentAmount);
					$(this).parents('[amountParent=LicenseeProduct]').find(
							'input[tagname=unitPriceAmt]').trigger('change');

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
		if (!licenseeNewProductPage.productTotalRender) {
		/*	$('.ui-right-side-icons').css('display','block');
			$('.ui-left-side-forms').css('width', '93%');	*/
			var uiGenerator = thisObject.uiGenerator
			$('#divSecondary'+uiGenerator.uiSelectedStep.stepName).show();
			$('#divPrimary'+uiGenerator.uiSelectedStep.stepName).css('width', '93%');
			$('#imgInvoice'+uiGenerator.uiSelectedStep.stepName).unbind('click', licenseeNewProductPage.addToInvoice);
			$('#imgInvoice'+uiGenerator.uiSelectedStep.stepName).bind('click', licenseeNewProductPage.addToInvoice);
			licenseeNewProductPage.loadComplete();
		}

		// alert("CHeckFlag: " + checkFlag)

		licenseeNewProductPage.productTotalRender = true;
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
	
	function createDiscountRow(placeHolder) {
		var discountTable = '<fieldset id="disBlock" class="ui-grid-c ui-accounting-box1" style="width:100%;">';
		discountTable += '<div class="ui-block-a ui-accounting-field" style="border:0px;width:29%"></div><div class="ui-block-b ui-accounting-field" style="border:0px;width:10%"></div>';
		discountTable += '<div class="ui-block-c ui-accounting-field ui-accounting-position" style="margin-left:2px;border-left:1px dashed #686868;width:41.3%">';
		discountTable += '<select name="selectDiscount' 
				+ '" id="selectServiceDiscount" data-theme="b" data-native-menu="false">';
		discountTable += '<option value="">Select One</option>';
		discountTable += '<option value="DISCOUNT">Discount</option>';
		discountTable += '<option value="INTEREST">Interest</option>';
		discountTable += '</select></div>';
		discountTable += '<div class="ui-block-d  ui-accounting-field ui-accounting-position" style="width:12.1%"><input id="serviceDisAmt" type="text" /></div>';
		discountTable += '</fieldset>';
		$('#footer-'  + placeHolder).append(discountTable);

	}
	;

};