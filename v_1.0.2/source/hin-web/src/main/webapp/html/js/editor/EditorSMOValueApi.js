/**
 * 
 * Class EditorSMOValueApi - Factory class for generating SMOValue (given by the
 * message API) out of the editors back to the message
 * 
 * @returns EditorSMOValueApi
 * @author Administrator
 */
function EditorSMOValueApi() {

	var editorSMOValueApi = this;

	this.clearPNSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var uses = smoValueObject.getChild('use');
		for ( var key = 0; key < uses.length; key++) {
			var use = uses[key];
			smoValueObject.removeChild(use);
		}

		var prefixs = smoValueObject.getChild('prefix');
		for ( var key = 0; key < prefixs.length; key++) {
			var prefix = prefixs[key];
			smoValueObject.removeChild(prefix);
		}
		
		var givens = smoValueObject.getChild('given');
		for ( var key = 0; key < givens.length; key++) {
			var given = givens[key];
			smoValueObject.removeChild(given);
		}
		
		var families = smoValueObject.getChild('family');
		for ( var key = 0; key < families.length; key++) {
			var family = families[key];
			smoValueObject.removeChild(family);
		}
		
		var suffixs = smoValueObject.getChild('suffix');
		for ( var key = 0; key < suffixs.length; key++) {
			var suffix = suffixs[key];
			smoValueObject.removeChild(suffix);
		}
	};

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
		var given = null;
		var family = null;
		var suffix = null;
		var use = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];
			given = fieldObject[2];
			family = fieldObject[3];
			suffix = fieldObject[4];

			if (use) {
				smoValueObject.setValue("use", use);
			}
			if (prefix) {
				smoValueObject.setValue("prefix", prefix);
			}
			if (given) {
				smoValueObject.setValue("given", given);
			}
			if (family) {
				smoValueObject.setValue("family", family);
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
			var given = smoValueObject.getValue("given")[0];
			var family = smoValueObject.getValue("family")[0];
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
			if (given) {
				fieldObject.push(given);
			} else {
				fieldObject.push(null);
			}
			if (family) {
				fieldObject.push(family);
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

	this.clearCESMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var codes = smoValueObject.getChild('code');
		for ( var key = 0; key < codes.length; key++) {
			var code = codes[key];
			smoValueObject.removeChild(code);
		}

		var displayNames = smoValueObject.getChild('displayName');
		for ( var key = 0; key < displayNames.length; key++) {
			var displayName = displayNames[key];
			smoValueObject.removeChild(displayName);
		}
		
		var originalTexts = smoValueObject.getChild('originalText');
		for ( var key = 0; key < originalTexts.length; key++) {
			var originalText = originalTexts[key];
			smoValueObject.removeChild(originalText);
		}
	};

	this.setCESMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;
		var originalText = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			code = fieldObject[0];
			displayName = fieldObject[1];
			originalText = fieldObject[2];

			if (code) {
				smoValueObject.setValue("code", code);
			}
			if (displayName) {
				smoValueObject.setValue("displayName", displayName);
			}
			if (originalText) {
				smoValueObject.setValue("originalText", originalText);
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
			var originalText = smoValueObject.getValue("originalText")[0];

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
			if (originalText) {
				fieldObject.push(originalText);
			} else {
				fieldObject.push(null);
			}
		}

		return fieldObject;
	};

	this.clearTELSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var uses = smoValueObject.getChild('use');
		for ( var key = 0; key < uses.length; key++) {
			var use = uses[key];
			smoValueObject.removeChild(use);
		}

		var values = smoValueObject.getChild('value');
		for ( var key = 0; key < values.length; key++) {
			var value = values[key];
			smoValueObject.removeChild(value);
		}
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

	this.clearIISMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var roots = smoValueObject.getChild('root');
		for ( var key = 0; key < roots.length; key++) {
			var root = roots[key];
			smoValueObject.removeChild(root);
		}

		var extensions = smoValueObject.getChild('extension');
		for ( var key = 0; key < extensions.length; key++) {
			var extension = extensions[key];
			smoValueObject.removeChild(extension);
		}

		var assigningAuthorityNames = smoValueObject
				.getChild('assigningAuthorityName');
		for ( var key = 0; key < assigningAuthorityNames.length; key++) {
			var assigningAuthorityName = assigningAuthorityNames[key];
			smoValueObject.removeChild(assigningAuthorityName);
		}

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

	this.clearADSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var countries = smoValueObject.getChild('country');
		for ( var key = 0; key < countries.length; key++) {
			var country = countries[key];
			smoValueObject.removeChild(country);
		}

		var states = smoValueObject.getChild('state');
		for ( var key = 0; key < states.length; key++) {
			var state = states[key];
			smoValueObject.removeChild(state);
		}

		var cities = smoValueObject.getChild('city');
		for ( var key = 0; key < cities.length; key++) {
			var city = cities[key];
			smoValueObject.removeChild(city);
		}

		var houseNumbers = smoValueObject.getChild('houseNumber');
		for ( var key = 0; key < houseNumbers.length; key++) {
			var houseNumber = houseNumbers[key];
			smoValueObject.removeChild(houseNumber);
		}

		var streetNames = smoValueObject.getChild('streetName');
		for ( var key = 0; key < streetNames.length; key++) {
			var streetName = streetNames[key];
			smoValueObject.removeChild(streetName);
		}

		var postalCodes = smoValueObject.getChild('postalCode');
		for ( var key = 0; key < postalCodes.length; key++) {
			var postalCode = postalCodes[key];
			smoValueObject.removeChild(postalCode);
		}

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
			houseNumber = fieldObject[0];
			streetName = fieldObject[1];
			city = fieldObject[2];			
			state = fieldObject[3];
			country = fieldObject[4];
			postalCode = fieldObject[5];

			if (houseNumber) {
				smoValueObject.setValue("houseNumber", houseNumber);
			}
			if (streetName) {
				smoValueObject.setValue("streetName", streetName);
			}
			if (city) {
				smoValueObject.setValue("city", city);
			}
			if (state) {
				smoValueObject.setValue("state", state);
			}
			if (country) {
				smoValueObject.setValue("country", country);
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

			var houseNumber = smoValueObject.getValue("houseNumber")[0];
			var streetName = smoValueObject.getValue("streetName")[0];
			var city = smoValueObject.getValue("city")[0];
			var state = smoValueObject.getValue("state")[0];
			var country = smoValueObject.getValue("country")[0];
			var postalCode = smoValueObject.getValue("postalCode")[0];

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
			if (city) {
				fieldObject.push(city);
			} else {
				fieldObject.push(null);
			}
			if (state) {
				fieldObject.push(state);
			} else {
				fieldObject.push(null);
			}
			if (country) {
				fieldObject.push(country);
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

	this.clearTSSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var values = smoValueObject.getChild('value');
		for ( var key = 0; key < values.length; key++) {
			var value = values[key];
			smoValueObject.removeChild(value);
		}

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

	this.clearCSSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var codes = smoValueObject.getChild('code');
		for ( var key = 0; key < codes.length; key++) {
			var code = codes[key];
			smoValueObject.removeChild(code);
		}

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
	
	this.clearIVL_TSSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
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
	
	this.clearPQSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var values = smoValueObject.getChild('value');
		for ( var key = 0; key < values.length; key++) {
			var value = values[key];
			smoValueObject.removeChild(value);
		}
		
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

	this.clearCDSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var codes = smoValueObject.getChild('code');
		for ( var key = 0; key < codes.length; key++) {
			var code = codes[key];
			smoValueObject.removeChild(code);
		}
		
		var displayNames = smoValueObject.getChild('displayName');
		for ( var key = 0; key < displayNames.length; key++) {
			var displayName = displayNames[key];
			smoValueObject.removeChild(displayName);
		}
		
	};
	
	this.setCDSMOValue = function(smoValueObject, fieldObject) {
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
	
	this.clearONSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var uses = smoValueObject.getChild('use');
		for ( var key = 0; key < uses.length; key++) {
			var use = uses[key];
			smoValueObject.removeChild(use);
		}
		
		var prefixs = smoValueObject.getChild('prefix');
		for ( var key = 0; key < prefixs.length; key++) {
			var prefix = prefixs[key];
			smoValueObject.removeChild(prefix);
		}
		
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

	this.clearSTSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var thumbnails = smoValueObject.getChild('thumbnail');
		for ( var key = 0; key < thumbnails.length; key++) {
			var thumbnail = thumbnails[key];
			smoValueObject.removeChild(thumbnail);
		}
		
	};
	
	this.setSTSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var thumbnail = null;

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			thumbnail = fieldObject[0];

			if (thumbnail) {
				smoValueObject.setValue("thumbnail", thumbnail);
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

			var thumbnail = smoValueObject.getValue("thumbnail")[0];

			if (thumbnail) {
				fieldObject.push(thumbnail);
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
	
	
	this.clearMOSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var values = smoValueObject.getChild('value');
		for ( var key = 0; key < values.length; key++) {
			var value = values[key];
			smoValueObject.removeChild(value);
		}
		
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
	
	this.clearRTO_PQ_PQSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
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
	
	this.clearRTO_MO_PQSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
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
	
	
	this.clearCVSMOValue = function(smoValueObject){
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
		var originalTexts = smoValueObject.getChild('originalText');
		for ( var key = 0; key < originalTexts.length; key++) {
			var originalText = originalTexts[key];
			smoValueObject.removeChild(originalText);
		}
		
		var codes = smoValueObject.getChild('code');
		for ( var key = 0; key < codes.length; key++) {
			var code = codes[key];
			smoValueObject.removeChild(code);
		}
		
		var codeSystems = smoValueObject.getChild('codeSystem');
		for ( var key = 0; key < codeSystems.length; key++) {
			var codeSystem = codeSystems[key];
			smoValueObject.removeChild(codeSystem);
		}
		
		var displayNames = smoValueObject.getChild('displayName');
		for ( var key = 0; key < displayNames.length; key++) {
			var displayName = displayNames[key];
			smoValueObject.removeChild(displayName);
		}
		
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

	this.clearEDSMOValue = function(smoValueObject) {
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}

		var thumbnails = smoValueObject.getChild('thumbnail');
		for ( var key = 0; key < thumbnails.length; key++) {
			var thumbnail = thumbnails[key];
			smoValueObject.removeChild(thumbnail);
		}
		
		var mediaTypes = smoValueObject.getChild('mediaType');
		for ( var key = 0; key < mediaTypes.length; key++) {
			var mediaType = mediaTypes[key];
			smoValueObject.removeChild(mediaType);
		}

	}

	this.setEDSMOValue = function(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var thumbnail = null;
		var reference = null;
		var mediaType = null;
		var referenceValue = null;
		var language = null;
		var languageValue = null;

		var items = smoValueObject.getChild('reference');
		for ( var key = 0; key < items.length; key++) {
			var item = items[key];
			smoValueObject.removeChild(item);
		}

		var items = smoValueObject.getChild('language');
		for ( var key = 0; key < items.length; key++) {
			var item = items[key];
			smoValueObject.removeChild(item);
		}

		if (editorSMOValueApi.checkNullFlavor(fieldObject, false)) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			thumbnail = fieldObject[0];
			mediaType = fieldObject[1];
			referenceValue = fieldObject[2];
			languageValue = fieldObject[3];

			if (thumbnail) {
				smoValueObject.setValue("thumbnail", thumbnail);
			}
			if (mediaType) {
				smoValueObject.setValue("mediaType", mediaType);
			}
			if (referenceValue) {
				reference = smoValueObject.createChild("reference");
				reference.setValue("value", referenceValue);
			}
			if (languageValue) {
				language = smoValueObject.createChild("language");
				language.setValue("value", languageValue);
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
			var reference = smoValueObject.getChild("reference")[0];
			var language = smoValueObject.getChild("language")[0];

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
			if (reference && reference.getValue('value')) {
				fieldObject.push(reference.getValue('value'));
			} else {
				fieldObject.push(null);
			}

			if (language && language.getValue('value')) {
				fieldObject.push(language.getValue('value'));
			} else {
				fieldObject.push(null);
			}
		}
		return fieldObject;
	};
	
	this.clearCVListSMOValue = function(smoValueObject){	
		var nullFlavors = smoValueObject.getChild('nullFlavor');
		for ( var key = 0; key < nullFlavors.length; key++) {
			var nullFlavor = nullFlavors[key];
			smoValueObject.removeChild(nullFlavor);
		}
		
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