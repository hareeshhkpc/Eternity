/*package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.hin.hl7messaging.api.IIdentityService;
import com.hin.hl7messaging.utils.RequestType;
import com.hin.hl7messaging.utils.RolesVO;
import com.hin.hl7messaging.vo.IdentityRequest;
import com.hin.hl7messaging.vo.IdentityResponse;

@Controller
@RequestMapping("/Role")

public class Role
{
	@Resource(name="identityMessageService")
	private IIdentityService messageService;
	
	IdentityResponse response = new IdentityResponse();
	Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();

	@RequestMapping(method = RequestMethod.POST)	
	public @ResponseBody IdentityResponse profileViewAndEdit(HttpServletRequest request)
	{
		
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		Gson gson = new Gson();
		IdentityRequest identityRequest = gson.fromJson(request.getParameter("data"), IdentityRequest.class);
		RequestType action = identityRequest.getAction();
		
		resultMap = messageService.retrieveStandardColumn(identityRequest.getSubscriberId(),"SUBSCRIBER_PROFILE");	
		columnValueMap = resultMap.get(identityRequest.getSubscriberId());
		response.setMessageXML(columnValueMap.get("MESSAGE"));
		response.setUserName(columnValueMap.get("USERNAME"));
		
		switch (action) {
		case ROLES:
			response=fetchRoles(identityRequest, response);
			break;
		case ROLELIST:
			response=fetchRoleList(identityRequest, response);
			break;
		case SELECTEDROLE:
			response=fetchDefinitionFromSelectedRole(response, identityRequest);
			break;
		case ADDPROPERTY:
			addProperty(response,identityRequest);
			break;
		case PERMISSION:
			response=fetchPermission(response, identityRequest);
			break;
		case SAVEPERMISSION:
			messageService.savePermission(identityRequest.getRoleId(), identityRequest.getPermission());
			break;
		case RELATIONSHIPS:
			response=fetchUnreadMessage(response, identityRequest);
			break;
		case OLDRELATIONSHIPS:
			response=fetchOtherRelations(response, identityRequest);
			break;
		case SAVEROLEINSTANCE:
			saveRoleInstance(response,identityRequest);
			break;
		case DELETEROLE:
			response=deleteRole(response, identityRequest);
			break;
		case ROLEEXISTING:
			response=fetchExistingRole(identityRequest,response);
			break;
		case ROLEAVAILABLE:
			response=fetchAvailableRole(identityRequest,response);
			break;
		case UPDATESTATUS:
			response= updateStatus(identityRequest,response);
			break;
		case SELECTEDEXISTINGROLE:
			response=fetchRoleInstanceOfSelectedRole(response, identityRequest);
			break;
		default:
			response=null;
			break;
		}
		
		return response;
	}
	
	
	private IdentityResponse fetchOtherRelations(IdentityResponse response, IdentityRequest identityRequest) {
		String status="";
		List<RolesVO> rolesListVO = new ArrayList<RolesVO>();
		List<RolesVO> resultMap = messageService.retrieveRelations(identityRequest.getSubscriberId());
		for (RolesVO innerList : resultMap) {
			status = innerList.getStatus();
			if(!(status.equals("NEW"))){
				innerList.getContact();
				innerList.getRoleName();
				innerList.getContactSubscriberId();
				String time = getTime(innerList.getCreationTime());
				innerList.setCreationTime(time);
				rolesListVO.add(innerList);
			}
		}
		response.setRoleListVO(rolesListVO);
		return response;
	}
	
	private IdentityResponse fetchUnreadMessage(IdentityResponse response, IdentityRequest identityRequest) {
		
		String status="", notificationPermision="", roleName="";
		IdentityResponse permissionResponse = fetchPermission(response, identityRequest);
		List<RolesVO> permissionListVO = new ArrayList<RolesVO>();
		permissionListVO = permissionResponse.getRoleListVO();
		List<RolesVO> rolesListVO = new ArrayList<RolesVO>();
		
		List<RolesVO> resultMap = messageService.retrieveRelations(identityRequest.getSubscriberId());
		for (RolesVO innerList : resultMap) {
			if(resultMap.size() > 0){
				status = innerList.getStatus();
				if(status.equals("NEW")){
					innerList.getContact();
					roleName = innerList.getRoleName();
					innerList.getContactSubscriberId();
					for(RolesVO permissions : permissionListVO){
						notificationPermision = permissions.getPermission();
						notificationPermision = Character.toString(notificationPermision.charAt(2));
						if(notificationPermision.equals("1") && permissions.getRoleName().equals(roleName)){
							String time = getTime(innerList.getCreationTime());
							innerList.setCreationTime(time);
							rolesListVO.add(innerList);
						}
					}
				}
			}
		}
		response.setRoleListVO(rolesListVO);
		return response;
	}

	private String getTime(String roleCreationTime){
		
		Long timestamp = System.currentTimeMillis();
		Calendar c = Calendar.getInstance();
		Date from =null, now = null;
		
		c.setTimeInMillis(Long.parseLong(roleCreationTime));
		from = c.getTime();
		c.setTimeInMillis(timestamp);
		now = c.getTime();
		
		long difference = now.getTime() - from.getTime();
	    long distanceInMin = difference / 60000;

	    if ( 0 <= distanceInMin && distanceInMin <= 1 ) {
	        return "Just now";
	    } else if ( 1 <= distanceInMin && distanceInMin <= 45 ) {
	        return distanceInMin + " min ago";
	    } else if ( 45 <= distanceInMin && distanceInMin <= 89 ) {
	        return "About 1 hour";
	    } else if ( 90 <= distanceInMin && distanceInMin <= 1439 ) {
	        return "About " + (distanceInMin / 60) + " hours ago";
	    } else if ( 1440 <= distanceInMin && distanceInMin <= 2529 ) {
	        return "1 day";
	    } else if ( 2530 <= distanceInMin && distanceInMin <= 43199 ) {
	        return (distanceInMin / 1440) + " days ago";
	    } else if ( 43200 <= distanceInMin && distanceInMin <= 86399 ) {
	        return "About 1 month ago";
	    } else if ( 86400 <= distanceInMin && distanceInMin <= 525599 ) {
	        return "About " + (distanceInMin / 43200) + " months ago";
	    } else {
	        long distanceInYears = distanceInMin / 525600;
	        return "About " + distanceInYears + " years ago";
	    }
		
	}
	
	@SuppressWarnings("rawtypes")
	private IdentityResponse fetchPermission(IdentityResponse response, IdentityRequest identityRequest) {
		
		List<RolesVO> rolesListVO = new ArrayList<RolesVO>();
		HashMap<String, String> permissionResultMap = messageService.retrieveRolePermission(identityRequest.getSubscriberId());
		String roleName;
		Iterator iterator = permissionResultMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			RolesVO roleVO = new RolesVO();
			roleName = messageService.retrieveRoleName((String) subscriberIdEntry.getKey());
			roleVO.setPermission((String) subscriberIdEntry.getValue());
			roleVO.setRoleId((String) subscriberIdEntry.getKey());
			roleVO.setRoleName(roleName);
			rolesListVO.add(roleVO);
		}

		response.setRoleListVO(rolesListVO);
		return response;
	}

	private void addProperty(IdentityResponse response, IdentityRequest identityRequest) {
		String roleName = identityRequest.getSelectedRole();
		resultMap = messageService.retrieveStandardColumn(identityRequest.getSubscriberId(), "ROLE_INDEX");
		String roleId = retrieveRoleIndex(roleName, resultMap);
		
		messageService.saveRoleMessage(identityRequest.getXmlMsg(), identityRequest.getSubscriberId(), roleName, roleId, identityRequest.getContact(), "scoper");
		messageService.saveRoleMessage(identityRequest.getXmlMsg(), identityRequest.getContact(), roleName, roleId, identityRequest.getSubscriberId(), "player");
		
		messageService.saveRoleDefinition(identityRequest.getSubscriberId()+"_"+roleId, roleName, identityRequest.getXmlMsg());
		messageService.saveRoleDefinition(identityRequest.getContact()+"_"+roleId, roleName, identityRequest.getXmlMsg());
	}


	@SuppressWarnings({ "rawtypes", "unchecked" })
	private IdentityResponse fetchDefinitionFromSelectedRole(IdentityResponse response, IdentityRequest identityRequest) {
		resultMap = messageService.retrieveRoleDefinition(identityRequest.getSelectedRole(), identityRequest.getSubscriberId());
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		
		Iterator iterator = resultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			response.setMessageXML(columnValueMap.get("DEFINITION"));
		}
		return response;
	}
	
	private IdentityResponse fetchRoleInstanceOfSelectedRole(IdentityResponse response, IdentityRequest identityRequest) {
		
		response.setMessageXML(messageService.retrieveRoleInstanceDefinition(identityRequest.getSubscriberId(),identityRequest.getSelectedRole()));
		return response;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private IdentityResponse fetchRoleList(IdentityRequest request, IdentityResponse response) {
		Set<String> roleSet = new HashSet<String>(); 
		resultMap = messageService.retrieveStandardColumn(request.getSubscriberId(),"ROLE_INDEX");
		String value="", columnName="", status="";
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		Iterator iterator = resultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			response.setSubscriberId((String) subscriberIdEntry.getKey());		
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while(columnValueIterator.hasNext()){
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
				columnName = (String) columnValueEntry.getKey();
				if(!(columnName.equals("KEY"))){
					status = messageService.retrieveRoleStatus(request.getSubscriberId()+"_"+columnName);
					if(status.equals("ACTIVE") || status.equals("NEW")){
						value = (String) columnValueEntry.getValue();
						roleSet.add(value);
					}
				}
			}
		}
		List<String> rolesList = new ArrayList<String>(roleSet);
		response.setRoleList(rolesList);
		return response;
	}


	@SuppressWarnings("rawtypes")
	private IdentityResponse fetchRoles(IdentityRequest request, IdentityResponse response) {
		
		HashMap<String, String> roleIdMap = new HashMap<String, String>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		int i= 0;
		String status="";
		Map<String, HashMap<String, String>> roleIndexMap = new HashMap<String, HashMap<String, String>>();
		roleIndexMap = messageService.retrieveStandardColumn(request.getSubscriberId(), "ROLE_INDEX");
		roleIdMap = roleIndexMap.get(request.getSubscriberId());
		
		Iterator iterator = roleIdMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry roleIdEntry = (Map.Entry) iterator.next();
			if(!(roleIdEntry.getKey().equals("KEY"))){
				resultMap = messageService.retrieveStandardColumn(request.getSubscriberId()+"_"+roleIdEntry.getKey(), "ROLE");
				columnValueMap = resultMap.get(request.getSubscriberId()+"_"+roleIdEntry.getKey());
				status = columnValueMap.get("ROLE_STATUS");
				if(status.equals("NEW"))
					i++;
			}
		}
	
		response.setMessageCount(String.valueOf(i));
		return response;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String retrieveRoleIndex(String roleName, Map<String, HashMap<String, String>> resultMap){
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String value="", columnName="";
		System.out.println(resultMap);
		Iterator iterator = resultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();		
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while(columnValueIterator.hasNext()){
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
				if(!((String) columnValueEntry.getKey()).equals("KEY")){
					value = (String) columnValueEntry.getValue();
					if(value.equals(roleName))
						columnName = (String) columnValueEntry.getKey();	
				}
			}
		}
		return columnName;
	}
	
	private void saveRoleInstance(IdentityResponse response, IdentityRequest identityRequest) {
		Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		String roleName = identityRequest.getSelectedRole();
		resultMap = messageService.retrieveStandardColumn(identityRequest.getContact(), "ROLE_INDEX");
		String roleId = retrieveRoleIndex(roleName, resultMap);
		messageService.saveRoleMessage(identityRequest.getXmlMsg(), identityRequest.getSubscriberId(), roleName, roleId, identityRequest.getContact(), "scoper");
		messageService.saveRoleMessage(identityRequest.getXmlMsg(), identityRequest.getContact(), roleName, roleId, identityRequest.getSubscriberId(), "player");
	}
	
	private IdentityResponse deleteRole(IdentityResponse response, IdentityRequest identityRequest){
		 String[] results = identityRequest.getRoleId().split( ",\\s*" ); 
	     for ( String roleId : results ){
			if(identityRequest.getActionType().equals("Suspend")){
				messageService.updateStatus(identityRequest.getSubscriberId(), "ROLE", roleId, "ROLE_STATUS", "INACTIVE");
				messageService.updateStatus(identityRequest.getContact(), "ROLE", roleId,"ROLE_STATUS", "INACTIVE");
			}
			else if(identityRequest.getActionType().equals("Active")){
				messageService.updateStatus(identityRequest.getSubscriberId(), "ROLE", roleId, "ROLE_STATUS", "ACTIVE");
				messageService.updateStatus(identityRequest.getContact(), "ROLE", roleId,"ROLE_STATUS", "ACTIVE");
			}
			else if(identityRequest.getActionType().equals("Block")){
				messageService.updateStatus(identityRequest.getSubscriberId(), "ROLE", roleId, "BLOCKED", "TRUE");
				messageService.updateStatus(identityRequest.getContact(), "ROLE", roleId,"BLOCKED", "TRUE");
			}
			else if(identityRequest.getActionType().equals("Unblock")){
				messageService.updateStatus(identityRequest.getSubscriberId(), "ROLE", roleId, "BLOCKED", "FALSE");
				messageService.updateStatus(identityRequest.getContact(), "ROLE", roleId,"BLOCKED", "FALSE");
			}
	    }
		
		return response;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private IdentityResponse fetchExistingRole(IdentityRequest request,IdentityResponse response) {
		Set<String> roleSet = new HashSet<String>(); 
		List<String> roleIdList = new ArrayList<String>();
		Map<String, HashMap<String, String>> rolesResultMap = new HashMap<String, HashMap<String, String>>();
		resultMap = messageService.retrieveStandardColumn(request.getSubscriberId(),"ROLE_INDEX");
		String value="", columnName="", roleKey="";
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		HashMap<String, String> roleValueMap = new HashMap<String, String>();
		if(resultMap!=null && !(resultMap.isEmpty())){
			Iterator iterator = resultMap.entrySet().iterator();
			while(iterator.hasNext()){
				Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
				response.setSubscriberId((String) subscriberIdEntry.getKey());		
				columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
				Iterator columnValueIterator = columnValueMap.entrySet().iterator();
				while(columnValueIterator.hasNext()){
					Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
					columnName = (String) columnValueEntry.getKey();
					if(!(columnName.equals("KEY"))){
						roleKey=request.getSubscriberId()+"_"+columnName;
						rolesResultMap = messageService.roleListFromRoleIndex(roleKey, request.getContact());
						if(rolesResultMap!=null && !rolesResultMap.isEmpty()){
							roleValueMap = rolesResultMap.get(roleKey);
							value = roleValueMap.get("CONTACT");
							if(value.equals(request.getContact())){
								roleIdList.add(columnName);
								roleSet.add((String) columnValueEntry.getValue());
							}
						}
					}
				}
			}
		}
		List<String> rolesList = new ArrayList<String>(roleSet);
		response.setRoleIdList(roleIdList);
		response.setRoleList(rolesList);
		return response;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private IdentityResponse fetchAvailableRole(IdentityRequest request, IdentityResponse response) {
		Set<String> roleSet = new HashSet<String>(); 
		List<String> roleIdList = new ArrayList<String>();
		List<String> roleIdMainList = new ArrayList<String>();
		String subId="", con="";

		subId=request.getSubscriberId();
		resultMap = messageService.retrieveStandardColumn(request.getSubscriberId(),"ROLE_INDEX");
		String columnName="", permission="", personPermission="";
		IdentityResponse fetchExistingResponse = new IdentityResponse();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		Iterator iterator = resultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			response.setSubscriberId((String) subscriberIdEntry.getKey());		
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			Iterator columnValueIterator = columnValueMap.entrySet().iterator();
			while(columnValueIterator.hasNext()){
				Map.Entry columnValueEntry = (Map.Entry) columnValueIterator.next();
				columnName = (String) columnValueEntry.getKey();
				if(!(columnName.equals("KEY"))){
					permission = checkPermission((String) columnValueEntry.getValue(), request.getSubscriberId());
					personPermission = Character.toString(permission.charAt(0));
					if(personPermission.equals("1"))
						roleIdMainList.add(columnName);
				}
			}
		}
		
		//Changing the subscriber and contact in the request.
		con=request.getContact();
		request.setContact(request.getSubscriberId());
		request.setSubscriberId(con);
		fetchExistingResponse = fetchExistingRole(request, response);
		roleIdList = fetchExistingResponse.getRoleIdList();
		roleIdMainList.removeAll(roleIdList);
		for(String id : roleIdMainList){
			roleSet.add(messageService.retrieveRoleName(subId+"_"+id));
		}
		List<String> rolesList = new ArrayList<String>(roleSet);
		response.setRoleList(rolesList);
		return response;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private String checkPermission(String roleName, String subscriberId){
		Map<String, HashMap<String, String>> permissionResultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		String permission="";
		permissionResultMap = messageService.retrieveRoleDefinition(roleName, subscriberId);
		Iterator iterator = permissionResultMap.entrySet().iterator();
		while(iterator.hasNext()){
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValueMap =  (HashMap<String, String>) subscriberIdEntry.getValue();
			permission = columnValueMap.get("PERMISSION");
		}
		return permission;
	}
	
	private IdentityResponse updateStatus(IdentityRequest request,IdentityResponse response) {
		messageService.updateStatus(request.getSubscriberId(), "ROLE", request.getRoleId(),"ROLE_STATUS", "ACTIVE");
		return response;
	}	
}*/