/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.UserVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IAuthenticationService;

/**
 * @author shilpa.rao
 * 
 */
@Service(value = "authenticationService")
public class AuthenticationService implements IAuthenticationService {

	private Logger logger = Logger.getLogger(AuthenticationService.class
			.getName());

	@Resource(name = "identityMessageRepository")
	private IIdentityRepository identityRepository;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.api.IAuthenticationService#authenticate(java.lang
	 * .Object)
	 */
	@Override
	public UserVO authenticate(UserVO userVO) {
		try {
			Map<String, HashMap<String, String>> resultMap = identityRepository.login(userVO.getUserName(), userVO.getPassword());
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			if (resultMap != null && !resultMap.isEmpty()) {
				String subscriberId = null;
				String message = null;
				Iterator<String> iterator = resultMap.keySet().iterator();

				while (iterator.hasNext()) {
					subscriberId = iterator.next();
					columnValueMap = resultMap.get(subscriberId);
					message = columnValueMap.get("MESSAGE");
				}
				userVO.setSubscriberId(subscriberId);
				userVO.setMessage(message);
				userVO.setRoles(getUserRoles(userVO));
				userVO.setPrivileges(getUserPrivileges(userVO));
			}
		} catch (Exception e) {
			logger.error(" Invalid User" + e);
		}
		return userVO;
	}
	
	@Override
	public Boolean validateUser(String userName) {
		Boolean exist = false;
		try {
			Map<String, HashMap<String, String>> resultMap = identityRepository.retrieveStandardColumnFamily("SUBSCRIBER_PROFILE", "USERNAME", userName);			
			if (resultMap != null && !resultMap.isEmpty()) {
				exist = true;
			}
		} catch (Exception e) {
			logger.error(" Invalid User" + e);
		}
		return exist;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.api.IAuthenticationService#getSubscribers()
	 */
	@Override
	public List<?> getSubscribers() {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.api.IAuthenticationService#getRoles()
	 */
	@Override
	public List<?> getRoles() {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.hin.hl7messaging.api.IAuthenticationService#getPrivileges()
	 */
	@Override
	public List<?> getPrivileges() {
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.api.IAuthenticationService#getUserRoles(java.lang
	 * .Object)
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public List<String> getUserRoles(UserVO userVO) {
		String blocked = "", status = "",name="";
		byte[] column = null;
		HashMap<byte[], HashMap<byte[], Object>> resultMap = new HashMap<byte[], HashMap<byte[], Object>>();
		HashMap<byte[], Object> superColumnMap = new HashMap<byte[], Object>();
		HashMap<byte[], byte[]> columnValueMap = new HashMap<byte[], byte[]>();
		List<String> roleIdList = new ArrayList<String>();
		List<String> roleNameList = new ArrayList<String>();
		byte[] roleNameByte;
		resultMap = identityRepository.retrieveSuperColumn("HIN_ETERNITY",
				"ROLE", userVO.getSubscriberId());

		/*
		 * resultMap = loginService.retrieveSuperColumn("HIN_ETERNITY", "ROLE",
		 * userVo.getSubscriberId());
		 */
		Iterator iterator = resultMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			superColumnMap = (HashMap<byte[], Object>) subscriberIdEntry
					.getValue();
			Iterator superColumnIterator = superColumnMap.entrySet().iterator();
			while (superColumnIterator.hasNext()) {
				Map.Entry superColumnEntry = (Map.Entry) superColumnIterator
						.next();
				roleNameByte = (byte[]) superColumnEntry.getKey();
				columnValueMap = (HashMap<byte[], byte[]>) superColumnEntry
						.getValue();
				Iterator<byte[]> columnValueIterator = columnValueMap.keySet()
						.iterator();
				while (columnValueIterator.hasNext()) {
					column = columnValueIterator.next();
					if (new String(column).equals("BLOCKED")) {
						blocked = new String(columnValueMap.get(column));
					} else if (new String(column).equals("ROLE_STATUS")) {
						status = new String(columnValueMap.get(column));
					}else if(new String(column).equals("ROLE_NAME")){
						name = new String(columnValueMap.get(column));;
					}
				}
				if (blocked.equals("FALSE") && status.equals("ACTIVE")){
					roleIdList.add(new String(roleNameByte));
					roleNameList.add(name);
				}
			}
		}
		userVO.setRoleID(roleIdList);
		return roleNameList;
	}

/*	
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.hin.hl7messaging.api.IAuthenticationService#getUserPrivileges(java
	 * .lang.Object)
	 
	@Override
	public List<String> getUserPrivileges(UserVO userVo) {
		String privilege = "", value = "", id = "";

		Set<String> privileges = new HashSet<String>();

		Map<String, Map<String, Map<String, String>>> resultMap = new HashMap<String, Map<String, Map<String, String>>>();
		Map<String, HashMap<String, String>> privilegeResultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();

		resultMap = identityRepository.querySuperColumnFamily("", "",
				"ROLE_DEFINITION", null, null, userVo.getRoles());
		if (resultMap != null && !resultMap.isEmpty()) {
			Iterator<String> roleDefinitionIdIterator = resultMap.keySet()
					.iterator();
			while (roleDefinitionIdIterator.hasNext()) {
				id = roleDefinitionIdIterator.next();
				privilegeResultMap = identityRepository
						.retrieveStandardColumnFamily("ROLE_PERMISSION", id);
				if (!privilegeResultMap.isEmpty()) {
					columnValueMap = privilegeResultMap.get(id);
					Iterator<String> columnValueMapIterator = columnValueMap
							.keySet().iterator();
					while (columnValueMapIterator.hasNext()) {
						privilege = columnValueMapIterator.next();
						value = columnValueMap.get(privilege);
						if (value.equals("1") && !privilege.equals("KEY"))
							privileges.add(privilege);
					}
				}
			}
		}
		List<String> list = new ArrayList<String>(privileges);
		return list;

	}*/
	

	public List<String> getUserPrivileges(UserVO userVo) {
		String privilege = "", value = "";
		Set<String> privileges = new HashSet<String>();
		Map<String, HashMap<String, String>> privilegeResultMap = new HashMap<String, HashMap<String, String>>();
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		for(String roleId:userVo.getRoleID()){
		privilegeResultMap = identityRepository.retrieveStandardColumnFamily("PERMISSION", roleId);
		if (!privilegeResultMap.isEmpty()) {
					columnValueMap = privilegeResultMap.get(roleId);
					Iterator<String> columnValueMapIterator = columnValueMap
							.keySet().iterator();
					while (columnValueMapIterator.hasNext()) {
						privilege = columnValueMapIterator.next();
						value = columnValueMap.get(privilege);
						if (value.equals("1") && !privilege.equals("KEY"))
							privileges.add(privilege);
					}
		}
		}
		List<String> list = new ArrayList<String>(privileges);
		return list;

	}
}
