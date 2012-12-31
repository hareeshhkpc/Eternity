var HIN;
if (!HIN)
	HIN = {};

HIN.CurrencyVO = function() {
	this.amount = 0.0;
	this.convertedAmount = 0.0;
	this.baseCurrency = "";
	this.toCurrency = "";
	this.exchangeRate = "";
};

HIN.CurrencyVO.prototype.toString = function() {
	return "[" + this.amount + " , " + this.baseCurrency + " , "
			+ this.toCurrency + " , " + this.convertedAmount + " , " + this.exchangeRate + "]";
};
