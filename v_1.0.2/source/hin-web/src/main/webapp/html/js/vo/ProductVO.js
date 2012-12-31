var HIN;
if (!HIN)
	HIN = {};

HIN.ProductVO = function() {
	this.messageId = null;
	this.messageTitle = null;
	this.messageStatus = null;
	this.createdDate = null;
	this.isActive = null;
	this.message = null;
	this.doseQuantity = null;
	this.unitQuantity = null;
};

HIN.ProductVO.prototype.setMessage = function(message) {
	this.message = message;
	var value = XmlUtil.getXPathResult(this.message,
			AppConstants.XPaths.Product.DOSAGE_QUANTITY ,
			XPathResult.STRING_TYPE);
	this.doseQuantity = (value && value.stringValue) ? value.stringValue: "";
	
	var unit = XmlUtil.getXPathResult(this.message,
			AppConstants.XPaths.Product.DOSAGE_UNIT_QUANTITY ,
			XPathResult.STRING_TYPE);
	this.unitQuantity = (unit && unit.stringValue) ? unit.stringValue: "";
}
;

HIN.ProductVO.prototype.toString = function() {
	return "[" + this.messageId + " , "+ this.messageTitle + " , "+ this.messageStatus + " , "+ this.createdDate + " , " + this.doseQuantity + " , "+ this.isActive + " , "+ this.unitQuantity + "]";
};
