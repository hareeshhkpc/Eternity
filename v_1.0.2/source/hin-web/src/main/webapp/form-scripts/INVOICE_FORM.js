function INVOICE_FORM(message, appController, uiGenerator) {

	var thisObject = this;

	this.message = message;
	this.appController = appController;
	this.uiGenerator = uiGenerator;

	this.initialize = initialize;
	this.onLoad = onLoad;
	this.reRender = reRender;
	this.onUnLoad = onUnLoad;
	this.discountBlock = false;
	this.createDiscountRow = createDiscountRow;

	function initialize() {

		try {
			// alert("initialize : " + thisObject.uiGenerator);

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

			// alert("Onload...")
			// var uiGenerator = thisObject.uiGenerator;
			// var message = thisObject.message;
			// createDiscountRow('footer-' + uiGenerator.instanceId);
			// createDiscountRow(message.id);

		} catch (error) {
			alert("Error in form onLoad  script: " + error);
		}

	}
	;

	function reRender(callback) {

		try {
			// alert("reRender")
			var message = thisObject.message;
			// thisObject.createDiscountRow(message.id);
		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function onUnLoad(callback) {

		try {
			// alert("Unload form")
		} catch (error) {
			alert("Error in form onUnLoad  script: " + error);
		}

	}
	;

	function createDiscountRow(placeHolder) {
		alert("placeHolder" + placeHolder);
		var discountTable = '<fieldset id="disBlock" class="ui-grid-c ui-accounting-box1" style="width:100%;">';
		discountTable += '<div class="ui-block-a ui-accounting-field" style="border:0px;width:29%"></div><div class="ui-block-b ui-accounting-field" style="border:0px;width:10%"></div>';
		discountTable += '<div class="ui-block-c ui-accounting-field ui-accounting-position" style="margin-left:2px;border-left:1px dashed #686868;width:41.3%">';
		discountTable += '<select name="selectDiscount' + placeHolder
				+ '" id="selectDiscount' + placeHolder
				+ '" data-theme="b" data-native-menu="false">';
		discountTable += '<option value="">Select One</option>';
		discountTable += '<option value="DISCOUNT">Discount</option>';
		discountTable += '<option value="INTEREST">Interest</option>';
		discountTable += '</select></div>';
		discountTable += '<div class="ui-block-d  ui-accounting-field ui-accounting-position" style="width:12.1%"><input id="disAmt'
				+ placeHolder + '" type="text" /></div>';
		discountTable += '</fieldset>';
		discountTable += '<fieldset id="totalBlock" class="ui-grid-c ui-accounting-box2" style="width:100%;">';
		discountTable += '<div class="ui-block-a ui-accounting-field" style="border:0px;width:29%"></div>';
		discountTable += '<div class="ui-block-b ui-accounting-field" style="border:0px;width:10%"></div>';
		discountTable += '<div class="ui-block-c ui-accounting-field ui-accounting-position" style="border:0px;width:41.3%;text-align:right;">Grand Total</div>';
		discountTable += '<div class="ui-block-d ui-accounting-field ui-accounting-position2" style="border-left:1px dashed #686868;margin-left:2px;width:12.1%"><input id="disTotalAmt'
				+ placeHolder + '" type="text" /></div>';
		discountTable += '</fieldset>';
		// alert(placeHolder);
		// $('#' + placeHolder).append(discountTable);

		$('#inner-uiform-' + placeHolder).append(discountTable);// (discountTable);

		/*
		 * else { $('#disBlock').remove(); $('#totalBlock').remove();
		 * $('fieldset[amountParent=invoice]:last').append(discountTable); }
		 */

		// alert(discountTable);
	}
	;
};