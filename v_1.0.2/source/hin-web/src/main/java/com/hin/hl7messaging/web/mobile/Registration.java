/*package com.hin.hl7messaging.web.mobile;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.hin.hl7messaging.api.IIdentityService;

@Controller
@RequestMapping("/Registration")

public class Registration
{
	
	@Resource(name="identityMessageService")
	private IIdentityService messageService;
	
	@RequestMapping(method = RequestMethod.POST)	
	public @ResponseBody RegResponse register(HttpServletRequest request)
	{
		Gson gson = new Gson();
		RegRequest req = gson.fromJson(request.getParameter("data"), RegRequest.class);
		
		String requestType = req.getRequestType();				
		String username = req.getUserName();
		String password = req.getPassword();
		String subscriberType = req.getSubscriberType();
		String name = req.getName();
		String telecom = req.getTelecom();
		
		String question = req.getQuestion();
		String answer = req.getAnswer();
		String msg = req.getProfileXml();
		String result = null;
		
		System.out.println(requestType);
		System.out.println(username);
		
		RegResponse resp = new RegResponse();
			
	//check userName Availability
	if(requestType.equals("check")){
		Map<String, HashMap<String, String>> UserNames = new HashMap<String, HashMap<String, String>>();
		UserNames = messageService.checkAvailability("SUBSCRIBER_PROFILE", username);
		if(UserNames.isEmpty()){
			result = "User name Available. You can use this.";
			System.out.println(result);
		}
		else{
			result = "User name already exist. Try another one.";
			System.out.println(result);
		}
	}
	
	//registering User to the Network
	if(requestType.equals("register")){
		try{	
			msg = msg.replaceAll("\n", "--del--");
			msg = msg.replaceAll("\r", ""); 
			msg=msg.replaceAll("'", "\\\\");
			
			messageService.saveSubscriberProfileMessage(msg, username, name, password, question, answer, subscriberType, telecom);
			System.out.println("registered with the network successfully");
			
			String to = telecom;
			String from = "salam.halley@imtacict.com";
			String url = "http://172.25.250.163:8081/hin-web/androidApp/Login.html";			
			SendEmail.sendMailToSubscriber(to, from, url, username, password);
			System.out.println("Email sent");
		}
		catch (Exception e) {
			System.out.println("Error occured in registering new profile");
			System.out.println("Error: "+e);
		}
		
		}
		
	return resp;
	}
	
	
}*/