package com.hin.hl7messaging.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hin.service.helper.LuceneUpdator;

@Controller
public class LuceneUpdateController {
	@Autowired
	LuceneUpdator luceneUpdator;
	
	@RequestMapping(value = "/cassandraToLuceneUpdator", method = RequestMethod.GET)
	public @ResponseBody
	String fetchStatisticsDataForMonth(@RequestParam String messageId, String attrName,String attrValue,String organizationId) {
		String data = "";
		luceneUpdator.updateLuceneForMessage(messageId, attrName, attrValue,organizationId);
		return data;
	}
}