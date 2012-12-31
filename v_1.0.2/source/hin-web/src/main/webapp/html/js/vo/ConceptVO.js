var HIN;
if (!HIN)
	HIN = {};

HIN.ConceptVO = function() {
	this.name = null;
	this.description = null;
	this.conceptClasses = null;
	this.conceptAttributes = null;
	this.smallIcon = null;
	this.shortName = null;
	this.category = null;
	this.partOfPackage = false;
};

HIN.ConceptVO.prototype.getAttribute = function(key) {
	var conceptAttributes = this.conceptAttributes;
	// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
	for (j in conceptAttributes) {
		if (conceptAttributes[j].key == key) {
			var value = conceptAttributes[j].value;
			// alert("key=" + conceptAttributes[j].key + " and value=" +
			// value);
			return value;
		}
	}
};

HIN.ConceptVO.prototype.getName = function() {
	return this.name;
};

HIN.ConceptVO.prototype.getCategory = function() {
	return this.category;
};

HIN.ConceptVO.prototype.getDescription = function() {
	return this.description;
};

HIN.ConceptVO.prototype.getClassName = function() {

	var conceptClasses = this.conceptClasses;
	// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
	for (j in conceptClasses) {
		return conceptClasses[j].name;
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

HIN.ConceptVO.prototype.getMessageTypeClassName = function() {

	var conceptClasses = this.conceptClasses;
	// alert("ConceptAttribute" + $.toJSON(conceptAttributes));
	for (j in conceptClasses) {
		if (conceptClasses[j].name == "Service"
				|| conceptClasses[j].name == "Drug"
				|| conceptClasses[j].name == "Package")
			return conceptClasses[j].name;
	}

};

HIN.ConceptVO.prototype.isPartOfPackage = function() {
	return this.partOfPackage;
};

HIN.ConceptVO.prototype.toString = function() {
	return "[" + this.name + " , " + this.description + " ]";
};