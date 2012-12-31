package com.hin.hl7messaging.web.mobile;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import me.prettyprint.cassandra.serializers.StringSerializer;
import me.prettyprint.cassandra.service.CassandraHostConfigurator;
import me.prettyprint.hector.api.Cluster;
import me.prettyprint.hector.api.Keyspace;
import me.prettyprint.hector.api.factory.HFactory;
import me.prettyprint.hector.api.mutation.Mutator;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.hin.hl7messaging.api.IIdentityMessageService;
import com.hin.hl7messaging.api.IIdentityService;



@Controller
@RequestMapping("/Link")

public class Link {
	
	@Resource(name="identityMessageService")
	private IIdentityMessageService mService;

	@RequestMapping(method = RequestMethod.POST)
	
	public @ResponseBody RegResponse loginAuthenticate(HttpServletRequest request, HttpServletResponse response) {
		Gson gson = new Gson();
		RegRequest req = gson.fromJson(request.getParameter("data"), RegRequest.class);	
		String id = req.getSubscriberID();
		String requestType = req.getRequestType();				
		System.out.println(requestType);
		System.out.println(id);		
		String username = req.getUserName();
		String password = req.getPassword();
		RegResponse resp = new RegResponse();
		String userCredentials = null;
		
		String linkMessage = "", profile="", subscriberID = "", key="", value="";
		
		HashMap<String, String> userDetailsMap = new HashMap<String, String>();
		if(requestType.equals("initLink")){
			Map<String, HashMap<String, String>> userDetails = new HashMap<String, HashMap<String, String>>();
			userDetails = mService.retrieveStandardColumn(id, "SUBSCRIBER_PROFILE");
			if(userDetails!=null && !userDetails.isEmpty()){
				Iterator iterator = userDetails.entrySet().iterator();
				while (iterator.hasNext()) {
					Map.Entry userDetailsMapEntry = (Map.Entry) iterator.next();
					userDetailsMap = (HashMap<String, String>) userDetailsMapEntry.getValue();
					Iterator columnIterator = userDetailsMap.entrySet().iterator();
					while (columnIterator.hasNext()) {
						Map.Entry columnMapEntry = (Map.Entry) columnIterator.next();
						key = (String) columnMapEntry.getKey();
						value = (String) columnMapEntry.getValue();
						if(key.equals("MESSAGE") && !value.equals("")){
							profile = value;
						}
					}
				}
				
				String profileMsg=profile.replaceAll("\\\\", "'");
			    profileMsg=profile.replaceAll("", "\r");
				profileMsg=profile.replaceAll("--del--", "\n");
				resp.setProfileXml(profileMsg);
				
			}
			
		}
		
		if(requestType.equals("linking")){
			Map<String, HashMap<String, String>> loginDetails = new HashMap<String, HashMap<String, String>>();
			loginDetails = mService.login(username, password);
			
			if(loginDetails==null){
				userCredentials = "Wrong UserName & Password.";
				System.out.println(userCredentials);
			}
			else{
				userCredentials = "Linking your profile. Click OK to proceed";
				Iterator iterator = loginDetails.entrySet().iterator();
				while (iterator.hasNext()) {
					Map.Entry columnMapEntry = (Map.Entry) iterator.next();
					key = (String) columnMapEntry.getKey();
					subscriberID = key;
				}
				
				System.out.println("SubscriberID: "+subscriberID);
				
				try{
					StringSerializer stringSerializer = StringSerializer.get();
					  Cluster cluster = HFactory.getOrCreateCluster("Blog", new CassandraHostConfigurator("localhost:9160"));
					  Keyspace keyspaceOperator = HFactory.createKeyspace("Blog", cluster); 
					  Mutator<String> mutator = HFactory.createMutator(keyspaceOperator, stringSerializer);
					  mutator.insert(subscriberID, "SUBSCRIBER_PROFILE", HFactory.createStringColumn("LINKED_PROFILE", id));
					  mutator.insert(id, "SUBSCRIBER_PROFILE", HFactory.createStringColumn("PARENT_PROFILE", subscriberID));
					 System.out.println("inserted");
					linkMessage = "The Profile has been successsfully linked";
				}catch (Exception e) {
					linkMessage = "Error occured in linking your profile";
					System.out.println("Error" + e);
				}
			}
			
		resp.setLinkMessage(linkMessage);
		resp.setUserCredentials(userCredentials);
		}
		
		return resp;
	}
	
	
}
