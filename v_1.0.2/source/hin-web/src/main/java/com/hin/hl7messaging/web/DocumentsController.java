package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.DocumentsVO;
import com.hin.hl7messaging.api.IDocumentsService;
import com.hin.hl7messaging.api.IFileUploadMessageService;

@Controller
public class DocumentsController {

	@Autowired
	IDocumentsService documentsService;
	
	@Autowired
	IFileUploadMessageService fileUploadMessageService;
	
	private Logger logger = Logger.getLogger(SearchController.class.getName());
	
	@RequestMapping(value = "/documents/getYear", method = RequestMethod.GET)
	public @ResponseBody String getYearData(@RequestParam String startDate) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<String> legends = new ArrayList<String>();
		try {
			legends.addAll(documentsService.getAllLegends());
		} catch (Exception e) {
			e.printStackTrace();
		}
		data = gson.toJson(legends);
		System.out.println("===================ALL LEGENDS======="+data);
		return data;
	}
	
	@RequestMapping(value = "/documents/convertHtmlToPdf", method = RequestMethod.POST)
	public @ResponseBody String convertHtmlToPdf( @RequestParam String patientId, @RequestParam String messageId, @RequestParam String invoiceNumber) {
		String data = "";
		try {
			
			documentsService.convertHtmlToPdf( patientId, messageId, invoiceNumber);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}
	
	@RequestMapping(value = "/documents/getMessageIdsForMonth", method = RequestMethod.GET)
	public @ResponseBody String getDocumentsData(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<String> documentsMessageIds = new ArrayList<String>();
		DocumentsVO documentsVO = gson.fromJson(json, DocumentsVO.class);
		System.out.println(documentsVO);
		try {
			documentsMessageIds = documentsService.getMessageIdsForMonth(documentsVO);
			System.out.println(documentsMessageIds);
			if (documentsMessageIds != null) {
				List<DocumentsVO> documentsVOs = documentsService.getMessage(documentsMessageIds,documentsVO.getOrganizationId());
				data = gson.toJson(documentsVOs);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		System.out.println("===================MESSAGE VO FOR MONTH======="+data);
		return data;
	}
	
	@RequestMapping(value = "/documents/getLegendsForYear", method = RequestMethod.GET)
	public @ResponseBody String getLegendYearData(@RequestParam String yearSelected,@RequestParam String patientId) throws Exception{
		String data = "";
		Gson gson = new GsonBuilder().create();
		int year = Integer.parseInt(gson.fromJson(yearSelected, String.class));
		List<List<String>> legendForYear = new ArrayList<List<String>>();
		Calendar c = Calendar.getInstance();
		for(int i=0;i<=11;i++){
			List<String> legendForMonth = new ArrayList<String>();
			c.clear();
			c.set(Calendar.YEAR, year);
			c.set(Calendar.MONTH, i);
			c.set(Calendar.DAY_OF_MONTH, 1);
			Date startDateOfMonth = c.getTime();
			long startTime = startDateOfMonth.getTime();
			long endTime = documentsService.getLasteDateOfMonth(i,year).getTime();
			legendForMonth.addAll(documentsService.getLegendForMonth(startTime,endTime,patientId));
			legendForYear.add(legendForMonth);
		}
		if(legendForYear!=null){
			data = gson.toJson(legendForYear);
		}
		System.out.println("===================LEGENDS FOR YEAR======="+data);
		return data;
	}


}