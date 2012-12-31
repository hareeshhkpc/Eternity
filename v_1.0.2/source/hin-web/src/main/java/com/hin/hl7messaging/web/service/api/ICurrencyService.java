/**
 * 
 */
package com.hin.hl7messaging.web.service.api;

/**
 * @author sreekumar.s
 * 
 */
public interface ICurrencyService {

	public double convert(double amount, String baseCurrency, String toCurrency);

	public long convert(long amount, String baseCurrency, String toCurrency);

	public double convert(double amount, String toCurrency);

	public long convert(long amount, String toCurrency);

}
