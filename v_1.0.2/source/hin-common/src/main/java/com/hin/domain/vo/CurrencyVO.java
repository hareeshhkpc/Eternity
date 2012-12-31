/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author preetham.bhat
 * 
 */
public class CurrencyVO {

	private double amount = 0;
	private double convertedAmount = 0;
	private String baseCurrency;
	private String toCurrency;
	private String exchangeRate;

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public double getConvertedAmount() {
		return convertedAmount;
	}

	public void setConvertedAmount(double convertedAmount) {
		this.convertedAmount = convertedAmount;
	}

	public String getBaseCurrency() {
		return baseCurrency;
	}

	public void setBaseCurrency(String baseCurrency) {
		this.baseCurrency = baseCurrency;
	}

	public String getToCurrency() {
		return toCurrency;
	}

	public void setToCurrency(String toCurrency) {
		this.toCurrency = toCurrency;
	}

	/**
	 * @return the exchangeRate
	 */
	public String getExchangeRate() {
		return exchangeRate;
	}

	/**
	 * @param exchangeRate the exchangeRate to set
	 */
	public void setExchangeRate(String exchangeRate) {
		this.exchangeRate = exchangeRate;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CurrencyVO [amount=" + amount + ", convertedAmount="
				+ convertedAmount + ", baseCurrency=" + baseCurrency
				+ ", toCurrency=" + toCurrency + ", exchangeRate="
				+ exchangeRate + "]";
	}

}
