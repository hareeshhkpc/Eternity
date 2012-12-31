function SERVICE_COST_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.onUnLoad = onUnLoad;
	this.getServiceCostTableHeader = getServiceCostTableHeader;

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
			
			onServiceCostComplete(false);		

			var message = thisObject.message;
			var dataLayer = thisObject.appController.getComponent("DataLayer");
			var messageTypeScript = new MessageTypeScript(message.msg,
					message.messageType, this.appController);
			dataLayer.loadData("JS_" + message.messageType, {}, function(data) {
				// alert("Script loaded");
				messageTypeScript.loadScript(data);
				var transactionType = AppConstants.TransactionType.SERVICE_FEE;
				messageTypeScript.fillData('transactionType', transactionType);
			});
		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			onServiceCostComplete(true);
		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function onServiceCostComplete(deleteMode) {
		// alert("onServiceCostComplete : " + deleteMode);
		var page = appController.getComponent("RenderingEngine")
				.getChildComponent("Form").getPage();
		var uiGenerator = thisObject.uiGenerator;
		var accountPage = page.stepPage;

		var serviceCostDiv = $('#uiform-sub-head' + uiGenerator.instanceId);		
		
		if (deleteMode == true) {
			sumCostFunction();
		}
		if (!accountPage.serviceCostTotalRender) {
			// appending total text box after new services and new products
			// alert(accountPage.serviceTotalRender);

			var totalBlock = '<fieldset class="ui-grid-b ui-accounting-box" style="margin-bottom:15px;">';
			totalBlock += '<div class="ui-block-a ui-total-width" style="width:84.2%;"><label class="ui-total-label">Total:</label></div>';
			totalBlock += '<div class="ui-block-b ui-accounting-field ui-total-field" style="width:12.1%;"><input class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" type="text" id="totalCost"  readonly="readonly" style="background:none;border:0px;color:#ffffff;" /></div></fieldset>';

			$('#footer-' + uiGenerator.instanceId).append(totalBlock);

		}

		function sumCostFunction() {

			var sum = 0;
			var pFlag = false;

			serviceCostDiv.find('input[tagname=amt]').each(
					function() {

						var chkValue = $(this)
								.parents('[amountParent=service]').find(
										'[id=chk]').is(':checked');
						var messageId = $(this).parents(
								'[amountParent=service]').find('[id=chk]')
								.val();

						// if (chkValue == true) {
						var map = accountPage.invoiceMessageMap.get(messageId);
						if (!map) {
							accountPage.invoiceMessageMap.put(messageId,
									chkValue);
						} else {
							map.value = chkValue;
						}

						/*
						 * } else {
						 * 
						 * var map = accountPage.invoiceMessageMap
						 * .get(messageId); if (map) {
						 * accountPage.invoiceMessageMap .removeItem(messageId); } }
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
			// alert(sum);
			$("#totalCost").val(sum);
			accountPage.serviceCheckFlag = pFlag;
			// alert("CHeckFlag: " + serviceCheckFlag)

		}
		;

		// serviceCostDiv.bind('DOMSubtreeModified', function() {
		$(serviceCostDiv).find('input[tagname=amt]')
				.unbind('keyup', sumCostFunction);
		$(serviceCostDiv).find('input[tagname=amt]').bind('keyup', sumCostFunction);
		$(serviceCostDiv).find('input[id=chk]').unbind('click', sumCostFunction);
		$(serviceCostDiv).find('input[id=chk]').bind('click', sumCostFunction);
		$(serviceCostDiv).find('input[id=chk]').unbind('click', clickHead);
		$(serviceCostDiv).find('input[id=chk]').bind('click', clickHead);

		/* Code to check/uncheck checkboxes */

		function clickHead() {
			var flag = true;
			serviceCostDiv.find('[id=chk]').each(function() {
				if ($(this).is(':checked') == false) {
					flag = false;
				}
			});

			if (flag == true) {
				$("#chkheadCost").attr('checked', true);
			} else {
				$("#chkheadCost").attr('checked', false);
			}
		}

		$('#chkheadCost').bind('click', function() { 
			
			var res = '';
			if ($('#chkheadCost').is(':checked') == true) {
				res = true;
			} else {
				res = false;
			}

			serviceCostDiv.find('[id=chk]').each(function() {
				this.checked = res;
			});

			sumCostFunction();

		});

		/* Code to check/uncheck checkboxes */
		if (!accountPage.serviceCostTotalRender) {
			$('#divSecondary').show();
			$('#divPrimary').css('width', '90%');
			$('#imgInvoice').unbind('click', accountPage.addToInvoice);
			$('#imgInvoice').bind('click', accountPage.addToInvoice);
		}

		// alert("CHeckFlag: " + serviceCheckFlag)

		accountPage.serviceCostTotalRender = true;
	}
	;

/*	function getServiceCostTableHeader() {
		var tableHeader = '<fieldset class="ui-grid-d ui-accounting-box"> ';
		tableHeader += '<div class="ui-block-a ui-accounting-fieldhead" ';
		tableHeader += 'style="border-right:0px;width:3%"><input type="checkbox" data-role="none" id="chkheadCost" value="" /></div>';
		tableHeader += '<div class="ui-block-b ui-accounting-fieldhead" ';
		tableHeader += 'style="width:16%">Date</div>';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-c ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:30%">Service</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-d ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:31.3%">Consultant</div> ';
		tableHeader += '<div ';
		tableHeader += 'class="ui-block-e ui-accounting-fieldhead ui-accounting-position" ';
		tableHeader += 'style="width:12.1%">Amount</div> ';

		return tableHeader;
	}*/

};