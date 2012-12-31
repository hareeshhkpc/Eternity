package com.hin.hl7messaging.web;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.hin.hl7messaging.api.IIdentityMessageService;
import com.hin.hl7messaging.api.IIdentityService;
import com.hin.hl7messaging.utils.RequestType;
import com.hin.hl7messaging.vo.IdentityRequest;
import com.hin.hl7messaging.vo.IdentityResponse;


@Controller
@RequestMapping("/ProfileFetchController")
public class ProfileFetchController {
	
	@Resource(name="identityMessageService")
	private IIdentityMessageService messageService;
	
	Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
	HashMap<String, String> columnValueMap = new HashMap<String, String>();
	IdentityResponse response = new IdentityResponse();
	
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody IdentityResponse getResponseInJSON(HttpServletRequest request) {
		 
		Gson gson = new Gson();
		IdentityRequest identityRequest = gson.fromJson(request.getParameter("data"), IdentityRequest.class);
		RequestType action = identityRequest.getAction();
		
		switch (action) {
		case PROFILEVIEW:
			response = viewProfile(response,identityRequest);
			break;
			
		default:
			response=null;
			break;
			
		}
		
		return response;
	}

	private IdentityResponse viewProfile(IdentityResponse response, IdentityRequest identityRequest){
		String columnName="", value="", subscriberId="";
		resultMap = messageService.retrieveStandardColumn(identityRequest.getSubscriberId(), "SUBSCRIBER_PROFILE");
		Iterator iterator = resultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while(columnValueIterator.hasNext()){
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
				columnName = (String) columnValueEntry.getKey();
				if(columnName.equals("MESSAGE")){
					value = (String) columnValueEntry.getValue();
					response.setMessageXML(value);
							
				}
				else if(columnName.equals("HTMLDOM")){
					value = (String) columnValueEntry.getValue();
					response.setHtmlDom(value);
				}
			}
		}
		return response;
	}

}
