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
import com.hin.hl7messaging.vo.ViewEditRequest;
import com.hin.hl7messaging.vo.ViewEditResponse;

@Controller
@RequestMapping("/ViewEditController")

public class ViewEditController
{
	@Resource(name="identityMessageService")
	private IIdentityMessageService messageService;
	
	@RequestMapping(method = RequestMethod.POST)	
	public @ResponseBody ViewEditResponse viewAndEdit(HttpServletRequest request)
	{
		Gson gson = new Gson();
		ViewEditRequest req = gson.fromJson(request.getParameter("data"), ViewEditRequest.class);
		
		String profileId = "";
		String message = "";
		String mulipartRequestType ="";
		String requestType = req.getRequestType();
		String columnName="", value="";
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		ViewEditResponse resp = new ViewEditResponse();
			
		if(requestType.equals("profile"))
		{
			resultMap = messageService.retrieveStandardColumn(req.getProfileId(), "SUBSCRIBER_PROFILE");
			System.out.println(resultMap);
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
						resp.setProfileXml(value);
						
					}else
					if(columnName.equals("HTMLDOM")){
						value = (String) columnValueEntry.getValue();
						resp.setProfileHtmlDom(value);
					}
					
					
				}
			}			
		}			
		return resp;
	}	

}