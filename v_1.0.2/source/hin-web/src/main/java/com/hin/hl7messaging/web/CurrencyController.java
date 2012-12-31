package com.hin.hl7messaging.web;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.CurrencyVO;
import com.hin.hl7messaging.web.service.api.ICurrencyService;

/**
 * @author preetham.bhat
 * 
 */
@Controller
public class CurrencyController {
	@Autowired
	ICurrencyService currencyService;
	private Logger logger = Logger.getLogger(LookUpController.class.getName());

	@RequestMapping(value = "/currency/converter", method = RequestMethod.GET)
	public @ResponseBody
	String currencyLookUp(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		try {
			CurrencyVO currencyVO = gson.fromJson(json, CurrencyVO.class);
			/*currencyVO.setConvertedAmount(currencyService.convert(
					currencyVO.getAmount(), currencyVO.getBaseCurrency(),
					currencyVO.getToCurrency()));*/
			double exchangeRate = Float.parseFloat(currencyVO.getExchangeRate());
			double convertedAmount = exchangeRate * currencyVO.getAmount();
			currencyVO.setConvertedAmount(convertedAmount);
			
			data = gson.toJson(currencyVO);
		} catch (Exception e) {
			logger.error("Currency Conversion Exception:", e);
		}
		return data;
	}
}
