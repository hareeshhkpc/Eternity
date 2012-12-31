package com.hin.hl7messaging.web.mobile;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.hin.hl7messaging.api.IIdentityMessageService;
import com.hin.hl7messaging.api.IIdentityService;


@Controller
@RequestMapping("/Login1")

public class Login {
	
	@Resource(name="identityMessageService")
	private IIdentityMessageService mService;

	@RequestMapping(method = RequestMethod.POST)
	
	public @ResponseBody RegResponse loginAuthenticate(HttpServletRequest request, HttpServletResponse response) {
		Gson gson = new Gson();
		RegRequest req = gson.fromJson(request.getParameter("data"), RegRequest.class);		
		String requestType = req.getRequestType();				
		System.out.println(requestType);		
		String username = req.getUserName();
		//System.out.println(username);
		String password = req.getPassword();
		//System.out.println(password);
		String subscriberID = "", key = "";
		
		RegResponse resp = new RegResponse();
		String userCredentials = null;
		
		//resp.setUserName(username);		
		
			Map<String, HashMap<String, String>> loginDetails = new HashMap<String, HashMap<String, String>>();
			loginDetails = mService.login(username, password);
			//System.out.println(loginDetails);
			if(loginDetails==null){
				userCredentials = "Wrong UserCredentials";
				resp.setUserCredentials(userCredentials);
				System.out.println(userCredentials);
			}
			
			else{
				Iterator iterator = loginDetails.entrySet().iterator();
				while (iterator.hasNext()) {
					Map.Entry columnMapEntry = (Map.Entry) iterator.next();
					key = (String) columnMapEntry.getKey();
					subscriberID = key;
				}
				
				System.out.println("SubscriberID: "+subscriberID);
				resp.setSubscriberID(subscriberID);
			}
			
		return resp;
		
}
	
}
