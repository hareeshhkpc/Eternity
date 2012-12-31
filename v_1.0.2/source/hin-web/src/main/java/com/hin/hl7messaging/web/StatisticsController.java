package com.hin.hl7messaging.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.StatisticsVO;
import com.hin.hl7messaging.ArchiveMessageService;
import com.hin.hl7messaging.MessageIndex;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.hl7messaging.api.IStatisticsService;

@Controller
public class StatisticsController {
	@Autowired
	ISearchService searchService;
	@Autowired
	IMessageService messageService;
	
	@Autowired
	MessageIndex messageIndex;
	
	@Autowired
	IStatisticsService statisticsService;
	@Autowired
	ArchiveMessageService archiveService;
	
	private Logger logger = Logger.getLogger(LookUpController.class.getName());
	
/*	@RequestMapping(value = "/search/patientsearch", method = RequestMethod.GET)
	public @ResponseBody
	String patiant(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProfileVO> profiles = null;
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		try {
			profiles = searchService.patientSearch("firstName",
					searchVO.getValue(), searchVO.getMax());
			data = gson.toJson(profiles);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}
*/
	@RequestMapping(value = "/statistics/month", method = RequestMethod.GET)
	public @ResponseBody
	String fetchStatisticsDataForMonth(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		StatisticsVO statisticsVO = gson.fromJson(json, StatisticsVO.class);
		try {
			statisticsVO = statisticsService.fetchStatisticsDetails(Integer.parseInt(statisticsVO.getYear()), Integer.parseInt(statisticsVO.getMonth()), statisticsVO.getType(), statisticsVO.getProgram(), statisticsVO.getStatus(), statisticsVO.getFacility());
			data = gson.toJson(statisticsVO);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}
	
	@RequestMapping(value = "/statistics/saveArchieveMessage", method = RequestMethod.POST)
	public @ResponseBody void saveArchieveMessage(HttpServletRequest request) {
		if (request instanceof MultipartHttpServletRequest) {
			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
			System.out.println("multipart " + multipartHttpServletRequest.getFileMap());
			try {
				MultipartFile multipartFile = multipartHttpServletRequest
						.getFile("message");
				String message=new String(multipartFile.getBytes());
				
				try {
					MessageVO messageVo= messageService.createMessageVO(message);
					archiveService.archiveMessage(messageVo, "");
				} catch (Exception e) {
					e.printStackTrace();
				}
				
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
		
	}
	
	
/*	@RequestMapping(value = "/statistics/year", method = RequestMethod.GET)
	public @ResponseBody
	String fetchStatisticsDataForYear(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		StatisticsVO statisticsVO = gson.fromJson(json, StatisticsVO.class);
		try {
			statisticsVO = statisticsService.fetchStatisticsDataForYear("POXX_MT111000HT02", statisticsVO.getYear());
			data = gson.toJson(statisticsVO);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}*/
	
	@RequestMapping(value = "/search/facilities", method = RequestMethod.GET)
	public @ResponseBody
	String facilities(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<String> facilities = new ArrayList<String>();
		try {
			facilities = messageIndex.searchFacility();
			if (facilities != null) {
				data = gson.toJson(facilities);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

}
