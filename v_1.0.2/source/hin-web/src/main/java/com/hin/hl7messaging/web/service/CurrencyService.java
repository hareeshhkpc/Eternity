/**
 * 
 */
package com.hin.hl7messaging.web.service;

import java.io.IOException;
import java.text.ParseException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hin.domain.utils.CurrencyConverter;
import com.hin.hl7messaging.web.service.api.ICurrencyService;

/**
 * @author sreekumar.s
 * 
 */
@Service
public class CurrencyService implements ICurrencyService {

	private Logger logger = Logger.getLogger(CurrencyService.class
			.getName());
	
	private CurrencyConverter currencyConverter = null;
	@Value("${currency.BASE_CURRENCY}")
	private String baseCurrency;

	@Value("${currency.ECB_RATES_URL}")
	private String ecbRatesURL;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.web.service.api.ICurrencyService#convert(double,
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public double convert(double amount, String baseCurrency, String toCurrency) {
		double convertedAmount = 0d;
		try {
			if(baseCurrency.isEmpty() || baseCurrency.length() < 1)
				baseCurrency = this.baseCurrency;
			if(toCurrency.isEmpty() || toCurrency.length() < 1)
				toCurrency = this.baseCurrency;
			convertedAmount = getCurrencyConverter().convert(amount,
					baseCurrency, toCurrency);
			return convertedAmount;
		} catch (IllegalArgumentException e) {
			logger.error("Currency Conversion IllegalArgumentException" , e);
		} catch (IOException e) {
			logger.error("Currency Conversion IOException" , e);
		} catch (ParseException e) {
			logger.error("Currency Conversion ParseException" , e);
		}
		return 0;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.web.service.api.ICurrencyService#convert(long,
	 * java.lang.String, java.lang.String)
	 */
	@Override
	public long convert(long amount, String baseCurrency, String toCurrency) {
		long convertedAmount = 0l;

		try {
			convertedAmount = getCurrencyConverter().convert(amount,
					baseCurrency, toCurrency);
			return convertedAmount;
		} catch (IllegalArgumentException e) {
			logger.error("Currency Conversion IllegalArgumentException" , e);
		} catch (IOException e) {
			logger.error("Currency Conversion IOException" , e);
		} catch (ParseException e) {
			logger.error("Currency Conversion ParseException" , e);
		}

		return 0;
	}

	@Override
	public double convert(double amount, String toCurrency) {
		double convertedAmount = 0d;
		try {
			convertedAmount = getCurrencyConverter().convert(amount,
					baseCurrency, toCurrency);
			return convertedAmount;
		} catch (IllegalArgumentException e) {
			logger.error("Currency Conversion IllegalArgumentException" , e);
		} catch (IOException e) {
			logger.error("Currency Conversion IOException" , e);
		} catch (ParseException e) {
			logger.error("Currency Conversion ParseException" , e);
		}

		return 0;
	}

	@Override
	public long convert(long amount, String toCurrency) {
		long convertedAmount = 0l;

		try {
			convertedAmount = getCurrencyConverter().convert(amount,
					baseCurrency, toCurrency);
			return convertedAmount;
		} catch (IllegalArgumentException e) {
			logger.error("Currency Conversion IllegalArgumentException" , e);
		} catch (IOException e) {
			logger.error("Currency Conversion IOException" , e);
		} catch (ParseException e) {
			logger.error("Currency Conversion ParseException" , e);
		}

		return 0;
	}

	/**
	 * @return the baseCurrency
	 */
	public String getBaseCurrency() {
		return baseCurrency;
	}

	/**
	 * @param baseCurrency
	 *            the baseCurrency to set
	 */
	public void setBaseCurrency(String baseCurrency) {
		this.baseCurrency = baseCurrency;
	}

	/**
	 * @return the ecbRatesURL
	 */
	public String getEcbRatesURL() {
		return ecbRatesURL;
	}

	/**
	 * @param ecbRatesURL
	 *            the ecbRatesURL to set
	 */
	public void setEcbRatesURL(String ecbRatesURL) {
		this.ecbRatesURL = ecbRatesURL;
	}

	public CurrencyConverter getCurrencyConverter() {
		if (this.currencyConverter == null)
			this.currencyConverter = CurrencyConverter
					.getInstance(this.ecbRatesURL);
		return this.currencyConverter;

	}

}
