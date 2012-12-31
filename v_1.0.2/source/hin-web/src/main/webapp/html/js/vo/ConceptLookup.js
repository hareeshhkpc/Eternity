var HIN;
if (!HIN)
	HIN = {};

HIN.ConceptLookup = function(json) {
	this.json = json;
	this.concepts = new HIN.HashMap();
	this.addConecpts();
};

HIN.ConceptLookup.prototype.addConecpts = function() {
	for (i in this.json) {
		var result = this.json[i];
		if (result) {
			var conceptVO = new HIN.ConceptVO();
			conceptVO.name = result.name;
			conceptVO.description = result.description;
			conceptVO.conceptClasses = result.conceptClasses;
			conceptVO.conceptAttributes = result.conceptAttributes;
			conceptVO.smallIcon = result.smallIcon;
			conceptVO.shortName = result.shortName;
			conceptVO.category = result.category;
			this.concepts.put(conceptVO.name, conceptVO);
		}
	}
};

HIN.ConceptLookup.prototype.getConcept = function(name) {
	var map = this.concepts.get(name);
	if (map && map.value)
		return map.value;
};

HIN.ConceptLookup.prototype.getAttribute = function(key) {
	// alert($.toJSON(this.json));
	for (i in this.json) {
		var result = this.json[i];
		if (result) {
			var conceptAttributes = result.conceptAttributes;
			// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
			for (j in conceptAttributes) {
				if (conceptAttributes[j].key == key) {
					var value = conceptAttributes[j].value;
					// alert("key=" + conceptAttributes[j].key + " and value=" +
					// value);
					return value;
				}
			}
		} else {
			alert($.toJSON(this.json) + " concept not found");// does n't have
			// attribute ["
			// + key + "]
			// .");
		}
	}
};

HIN.ConceptLookup.prototype.getAllServices = function() {
	var conceptAttributes = new Array();
	for (i in this.json) {
		var result = this.json[i];
		if (result) {
			var category = result.category;
			if (category) {
				category = " ( " + category.substr(0, 1) + " ) ";
			} else {
				category = "";
			}
			conceptAttributes.push({
				value : result.name,
				label : result.description + category
			});
		}
	}
	return conceptAttributes;
}

HIN.ConceptLookup.prototype.getAllLookups = function() {
	var concepts = new Array();
	for (i in this.json) {
		concepts.push(this.json[i]);
	}
	return concepts;
};

HIN.ConceptLookup.prototype.getName = function() {
	for (i in this.json) {
		var result = this.json[i];
		if (result)
			return result.name;
		else
			return null;
	}
};

HIN.ConceptLookup.prototype.getCategory = function() {
	for (i in this.json) {
		var result = this.json[i];
		if (result)
			return result.category;
		else
			return null;
	}
};

HIN.ConceptLookup.prototype.getDescription = function() {
	for (i in this.json) {
		var result = this.json[i];
		if (result)
			return result.description;
		else
			return null;
	}
};

HIN.ConceptLookup.prototype.getClassName = function() {
	for (i in this.json) {
		var result = this.json[i];
		var conceptClasses = result.conceptClasses;
		// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
		for (j in conceptClasses) {
			return conceptClasses[j].name;
		}
	}
};

HIN.ConceptLookup.prototype.isServiceOrDrugClass = function() {
	for (i in this.json) {
		var result = this.json[i];
		var conceptClasses = result.conceptClasses;
		// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
		for (j in conceptClasses) {
			if (conceptClasses[j].name == "Service"
					|| conceptClasses[j].name == "Drug")
				return true;
		}
	}
};

HIN.ConceptLookup.prototype.getMessageTypeClassName = function() {
	for (i in this.json) {
		var result = this.json[i];
		var conceptClasses = result.conceptClasses;
		// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
		for (j in conceptClasses) {
			if (conceptClasses[j].name == "Service"
					|| conceptClasses[j].name == "Drug"
					|| conceptClasses[j].name == "Package")
				return conceptClasses[j].name;
		}
	}
};

HIN.ConceptLookup.prototype.toString = function() {
	return ($.toJSON(this.json));
};