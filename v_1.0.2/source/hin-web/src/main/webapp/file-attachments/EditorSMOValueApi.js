/**
 * 
 * Class EditorSMOValueApi - Factory class for generatign SMOValue (given by the
 * message API) out of the editors back to the message
 * 
 * @returns EditorSMOValueApi
 * @author Administrator
 */
function EditorSMOValueApi() {

	var editorSMOValueApi = this;

	/**
	 * creates XML Node using the values in the "fieldObject" for dataType: PN
	 * 
	 * @param smoValueObject :
	 *            collection Of Nodes
	 * @param fieldObject :
	 *            Object contains the values to be updated to the xml node
	 * @returns SMO Object
	 */
	this.setPNSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var prefix = null;
		var family = null;
		var given = null;
		var suffix = null;
		var use = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];
			family = fieldObject[2];
			given = fieldObject[3];
			suffix = fieldObject[4];

			if (use) {
				smoValueObject.setValue("use", use);
			}
			if (prefix) {
				smoValueObject.setValue("prefix", prefix);
			}
			if (family) {
				smoValueObject.setValue("family", family);
			}
			if (given) {
				smoValueObject.setValue("given", given);
			}
			if (suffix) {
				smoValueObject.setValue("suffix", suffix);
			}
		}

		return smoValueObject;
	};

	/**
	 * creates an Object for dataType: PN
	 * 
	 * @param fieldObject :
	 */
	this.getPNSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var use = smoValueObject.getValue("use")[0];
			var prefix = smoValueObject.getValue("prefix")[0];
			var family = smoValueObject.getValue("family")[0];
			var given = smoValueObject.getValue("given")[0];
			var suffix = smoValueObject.getValue("suffix")[0];

			if (use) {
				fieldObject.push(use);
			} else {
				fieldObject.push(null);
			}
			if (prefix) {
				fieldObject.push(prefix);
			} else {
				fieldObject.push(null);
			}
			if (family) {
				fieldObject.push(family);
			} else {
				fieldObject.push(null);
			}
			if (given) {
				fieldObject.push(given);
			} else {
				fieldObject.push(null);
			}
			if (suffix) {
				fieldObject.push(suffix);
			} else {
				fieldObject.push(null);
			}
		}

		return fieldObject;
	};

	this.setCESMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			code = fieldObject[0];
			displayName = fieldObject[1];

			if (code) {
				smoValueObject.setValue("code", code);
			}
			if (displayName) {
				smoValueObject.setValue("displayName", displayName);
			}
		}
		return smoValueObject;
	};

	this.getCESMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");
		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var code = smoValueObject.getValue("code")[0];
			var displayName = smoValueObject.getValue("displayName")[0];

			if (code) {
				fieldObject.push(code);
			} else {
				fieldObject.push(null);
			}
			if (displayName) {
				fieldObject.push(displayName);
			} else {
				fieldObject.push(null);
			}
		}

		return fieldObject;
	};

	this.setTELSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var value = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			use = fieldObject[0];
			value = fieldObject[1];

			if (use) {
				smoValueObject.setValue("use", use);
			}
			if (value) {
				smoValueObject.setValue("value", value);
			}
		}

		return smoValueObject;
	};

	this.getTELSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var use = smoValueObject.getValue("use")[0];
			var value = smoValueObject.getValue("value")[0];

			if (use) {
				fieldObject.push(use);
			} else {
				fieldObject.push(null);
			}

			if (value) {
				fieldObject.push(value);
			} else {
				fieldObject.push(null);
			}
		}

		return fieldObject;
	};

	this.setIISMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var root = null;
		var extension = null;
		var assigningAuthorityName = null;
		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			// alert(""+fieldObject.length+"=="+smoValueObject);
			root = fieldObject[0];
			extension = fieldObject[1];
			assigningAuthorityName = fieldObject[2];

			if (root) {
				smoValueObject.setValue("root", root);
			}
			if (extension) {
				smoValueObject.setValue("extension", extension);
			}
			if (assigningAuthorityName) {
				smoValueObject.setValue("assigningAuthorityName",
						assigningAuthorityName);
			}
		}

		return smoValueObject;
	};

	this.getIISMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var root = smoValueObject.getValue("root")[0];
			var extension = smoValueObject.getValue("extension")[0];
			var assigningAuthorityName = smoValueObject
					.getValue("assigningAuthorityName")[0];

			if (root) {
				fieldObject.push(root);
			} else {
				fieldObject.push(null);
			}

			if (extension) {
				fieldObject.push(extension);
			} else {
				fieldObject.push(null);
			}

			if (assigningAuthorityName) {
				fieldObject.push(assigningAuthorityName);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setADSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var country = null;
		var state = null;
		var city = null;
		var houseNumber = null;
		var streetName = null;
		var postalCode = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			country = fieldObject[0];
			state = fieldObject[1];
			city = fieldObject[2];
			houseNumber = fieldObject[3];
			streetName = fieldObject[4];
			postalCode = fieldObject[5];

			if (country) {
				smoValueObject.setValue("country", country);
			}
			if (state) {
				smoValueObject.setValue("state", state);
			}
			if (city) {
				smoValueObject.setValue("city", city);
			}
			if (houseNumber) {
				smoValueObject.setValue("houseNumber", houseNumber);
			}
			if (streetName) {
				smoValueObject.setValue("streetName", streetName);
			}
			if (postalCode) {
				smoValueObject.setValue("postalCode", postalCode);
			}
		}
		return smoValueObject;
	};

	this.getADSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var country = smoValueObject.getValue("country")[0];
			var state = smoValueObject.getValue("state")[0];
			var city = smoValueObject.getValue("city")[0];
			var houseNumber = smoValueObject.getValue("houseNumber")[0];
			var streetName = smoValueObject.getValue("streetName")[0];
			var postalCode = smoValueObject.getValue("postalCode")[0];

			if (country) {
				fieldObject.push(country);
			} else {
				fieldObject.push(null);
			}

			if (state) {
				fieldObject.push(state);
			} else {
				fieldObject.push(null);
			}

			if (city) {
				fieldObject.push(city);
			} else {
				fieldObject.push(null);
			}

			if (houseNumber) {
				fieldObject.push(houseNumber);
			} else {
				fieldObject.push(null);
			}

			if (streetName) {
				fieldObject.push(streetName);
			} else {
				fieldObject.push(null);
			}

			if (postalCode) {
				fieldObject.push(postalCode);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setTSSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var value = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			value = fieldObject[0];

			if (value) {
				smoValueObject.setValue("value", value);
			}
		}
		return smoValueObject;
	};

	this.getTSSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var value = smoValueObject.getValue("value")[0];

			if (value) {
				fieldObject.push(value);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setCSSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var code = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			code = fieldObject[0];

			if (code) {
				smoValueObject.setValue("code", code);
			}
		}
		return smoValueObject;
	};

	this.getCSSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var code = smoValueObject.getValue("code")[0];

			if (code) {
				fieldObject.push(code);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setIVL_TSSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var low = null;
		var high = null;

		// clearing values from SMO OBJ
		var items = smoValueObject.getChild('low');
		for ( var key = 0; key < items.length; key++) {
			var item = items[key];
			smoValueObject.removeChild(item);
		}
		var items = smoValueObject.getChild('high');
		for ( var key = 0; key < items.length; key++) {
			var item = items[key];
			smoValueObject.removeChild(item);
		}

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			low = fieldObject[0];
			high = fieldObject[1];

			if (low) {
				var val = smoValueObject.createChild('low');
				val.setValue("value", low);
			}

			if (high) {
				var val = smoValueObject.createChild('high');
				val.setValue("value", high);
			}
		}
		return smoValueObject;
	};

	this.getIVL_TSSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var low = smoValueObject.getChild("low")[0];
			var high = smoValueObject.getChild("high")[0];

			if (low && low.getValue('value')) {
				fieldObject.push(low.getValue('value'));
			} else {
				fieldObject.push(null);
			}

			if (high && high.getValue('value')) {
				fieldObject.push(high.getValue('value'));
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setPQSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var value = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			value = fieldObject[0];

			if (value) {
				smoValueObject.setValue("value", value);
			}
		}
		return smoValueObject;
	};

	this.getPQSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var value = smoValueObject.getValue("value")[0];

			if (value) {
				fieldObject.push(value);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setCDSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;

		var codes = smoValueObject.getChild('code');
		for ( var key = 0; key < codes.length; key++) {
			var code = codes[key];
			smoValueObject.removeChild(code);
		}

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			code = fieldObject[0];
			displayName = fieldObject[1];

			if (code) {
				smoValueObject.setValue("code", code);
			}

			if (displayName) {
				smoValueObject.setValue("displayName", displayName);
			}
		}
		return smoValueObject;
	};

	this.getCDSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var code = smoValueObject.getValue("code")[0];
			var displayName = smoValueObject.getValue("displayName")[0];

			if (code) {
				fieldObject.push(code);
			} else {
				fieldObject.push(null);
			}

			if (displayName) {
				fieldObject.push(displayName);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setONSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var prefix = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];

			if (use) {
				smoValueObject.setValue("use", use);
			}

			if (prefix) {
				smoValueObject.setValue("prefix", prefix);
			}
		}
		return smoValueObject;
	};

	this.getONSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var use = smoValueObject.getValue("use")[0];
			var prefix = smoValueObject.getValue("prefix")[0];

			if (use) {
				fieldObject.push(use);
			} else {
				fieldObject.push(null);
			}

			if (prefix) {
				fieldObject.push(prefix);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setSTSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var jobTitle = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			jobTitle = fieldObject[0];

			if (jobTitle) {
				smoValueObject.setValue("jobTitle", jobTitle);
			}
		}
		return smoValueObject;
	};

	this.getSTSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var jobTitle = smoValueObject.getValue("jobTitle")[0];

			if (jobTitle) {
				fieldObject.push(jobTitle);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	/**
	 * Checks for presence of nullFlavor in the fieldObject. fieldObject - Array
	 * of values passed from editors or SMOValue read through message API mode -
	 * True if fieldObject is from editors, False if fieldObject is from message
	 * API
	 */
	this.checkNullFlavor = function(fieldObject, isSMO) {
		var isNull = null;

		if (isSMO === true) {
			isNull = (AppUtil.isArray(fieldObject) && fieldObject[0]
					&& (typeof (fieldObject[0]) === 'object') && fieldObject[0].getValue);
		} else {
			isNull = (AppUtil.isArray(fieldObject) && fieldObject[0]
					&& (typeof (fieldObject[0]) === 'object') && fieldObject[0].nullFlavor);
		}

		return isNull;
	};

	this.setMOSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var value = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			value = fieldObject[0];

			if (value) {
				smoValueObject.setValue("value", value);
			}
		}
		return smoValueObject;
	};

	this.getMOSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var value = smoValueObject.getValue("value")[0];

			if (value) {
				fieldObject.push(value);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setRTO_PQ_PQSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			
			var items = smoValueObject.getChild('numerator');
			for ( var key = 0; key < items.length; key++) {
				var item = items[key];
				smoValueObject.removeChild(item);
			}

			var items1 = smoValueObject.getChild('denominator');
			for ( var key = 0; key < items1.length; key++) {
				var item = items1[key];
				smoValueObject.removeChild(item);
			}
			
			
			numerator = fieldObject[0];
			denominator = fieldObject[1];

			if (numerator) {
				// smoValueObject.setValue("numerator", numerator);
				var val = smoValueObject.createChild('numerator');
				val.setValue("value", numerator);
			}

			if (denominator) {
				// smoValueObject.setValue("denominator", denominator);
				var val = smoValueObject.createChild('denominator');
				val.setValue("value", denominator);
			}
		}
		return smoValueObject;
	};

	this.getRTO_PQ_PQSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var numerator = smoValueObject.getChild("numerator")[0];
			var denominator = smoValueObject.getChild("denominator")[0];

			if (numerator && numerator.getValue('value')) {
				fieldObject.push(numerator.getValue('value'));
			} else {
				fieldObject.push(null);
			}

			if (denominator && denominator.getValue('value')) {
				fieldObject.push(denominator.getValue('value'));
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setRTO_MO_PQSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {

			var items = smoValueObject.getChild('numerator');
			for ( var key = 0; key < items.length; key++) {
				var item = items[key];
				smoValueObject.removeChild(item);
			}

			var items1 = smoValueObject.getChild('denominator');
			for ( var key = 0; key < items1.length; key++) {
				var item = items1[key];
				smoValueObject.removeChild(item);
			}

			numerator = fieldObject[0];
			denominator = fieldObject[1];

			if (numerator) {
				// smoValueObject.setValue("numerator", numerator);
				var val = smoValueObject.createChild('numerator');
				val.setValue("value", numerator);
			}

			if (denominator) {
				// smoValueObject.setValue("denominator", denominator);
				var val = smoValueObject.createChild('denominator');
				val.setValue("value", denominator);
			}
		}
		return smoValueObject;
	};

	this.getRTO_MO_PQSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var numerator = smoValueObject.getChild("numerator")[0];
			var denominator = smoValueObject.getChild("denominator")[0];

			if (numerator && numerator.getValue('value')) {
				fieldObject.push(numerator.getValue('value'));
			} else {
				fieldObject.push(null);
			}

			if (denominator && denominator.getValue('value')) {
				fieldObject.push(denominator.getValue('value'));
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setCVSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		var codeSystem = null;
		var displayName = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			originalText = fieldObject[0];
			code = fieldObject[1];
			codeSystem = fieldObject[2];
			displayName = fieldObject[3];

			if (originalText) {
				smoValueObject.setValue("originalText", originalText);
			}

			if (code) {
				smoValueObject.setValue("code", code);
			}

			if (codeSystem) {
				smoValueObject.setValue("codeSystem", codeSystem);
			}

			if (displayName) {
				smoValueObject.setValue("displayName", displayName);
			}
		}
		return smoValueObject;
	};

	this.getCVSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var originalText = smoValueObject.getValue("originalText")[0];
			var code = smoValueObject.getValue("code")[0];
			var codeSystem = smoValueObject.getValue("codeSystem")[0];
			var displayName = smoValueObject.getValue("displayName")[0];

			if (originalText) {
				fieldObject.push(originalText);
			} else {
				fieldObject.push(null);
			}

			if (code) {
				fieldObject.push(code);
			} else {
				fieldObject.push(null);
			}

			if (codeSystem) {
				fieldObject.push(codeSystem);
			} else {
				fieldObject.push(null);
			}

			if (displayName) {
				fieldObject.push(displayName);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setEDSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var thumbnail = null;
		var reference = null;
		var mediaType = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			thumbnail = fieldObject[0];
			mediaType = fieldObject[1];
			
			if (thumbnail) {
				smoValueObject.setValue("thumbnail", thumbnail);
			}
			if (mediaType) {
				smoValueObject.setValue("mediaType", mediaType);
			}
			if (reference) {
				var value =  fieldObject[2];
				smoValueObject.setValue("reference", reference);
				reference.setValue("value", value);
			}
			
		}
		return smoValueObject;
	};

	this.getEDSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);

			var thumbnail = smoValueObject.getValue("thumbnail")[0];
			var mediaType = smoValueObject.getValue("mediaType")[0];
			var reference = smoValueObject.getValue("reference")[0];
			var value = reference.getValue("value")[0];
			
			if (thumbnail) {
				fieldObject.push(thumbnail);
			} else {
				fieldObject.push(null);
			}
			
			if (mediaType) {
				fieldObject.push(mediaType);
			} else {
				fieldObject.push(null);
			}
			
			if (value) {
				fieldObject.push(value);
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};

	this.setCVListSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var originalText = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {

			var items = smoValueObject.getChild('item');
			for ( var key = 0; key < items.length; key++) {
				var item = items[key];
				smoValueObject.removeChild(item);
			}

			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = smoValueObject.createChild('item');
				if (fieldObject[key] && fieldObject[key] !== null) {

					var code = fieldObject[key + 1];
					var originalText = fieldObject[key];

					itemNode.setValue("code", code);
					itemNode.setValue("originalText", originalText);
				}
				key = key + 2;
			}

		}
		return smoValueObject;
	};

	this.getCVListSMOValue = function(smoValueObject) {
		var fieldObject = [];

		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (editorSMOValueApi.checkNullFlavor(nullFlavor, true)) {
			fieldObject.push({
				nullFlavor : nullFlavor[0]
			});
		} else {
			fieldObject.push(null);
			var itemNode = smoValueObject.getChild("item");

			$.each(itemNode, function(key, item) {
				var code = item.getValue("code")[0];
				var originalText = item.getValue("originalText")[0];

				if (originalText && item.getValue('originalText')) {
					fieldObject.push(originalText);
				} else {
					fieldObject.push(null);
				}

				if (code && item.getValue('code')) {
					fieldObject.push(code);
				} else {
					fieldObject.push(null);
				}
			});

		}
		return fieldObject;
	};

}