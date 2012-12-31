package com.hin.hl7messaging.IdentityServices;

import java.util.HashMap;
import java.util.List;

import org.apache.thrift.transport.TTransportException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import com.hin.hl7messaging.HinOrgUserProfile;
import com.hin.hl7messaging.HinUserProfile;
import com.hin.hl7messaging.utils.GMap;

public interface IIdentityProcessor {
	
 public HinUserProfile identifyUser(String userName,String password) throws TTransportException, Exception;
 
 public void saveHinUserProfile(HinUserProfile hinUserProfile) throws Exception;
 
 public String saveOrganizationUserProfile(HinUserProfile hinUserProfile,HinOrgUserProfile hinOrgUserProfile) throws Exception;
 
 public void mapUserAndOrganization(String orgId,String linkedId,HinUserProfile hinUserProfile) throws Exception;
 
 public void updateUserProfileIdInOrgUserProfile(HinUserProfile hinUserProfile,HinOrgUserProfile hinOrgUserProfile,String linkId) throws Exception;
 
 public void updateWorkFlowCriteria(HinUserProfile hinUserProfile) throws Exception;
 
 public HashMap<String,String> getUserListForOrg(String OrgId,HashMap<String, Object> filterCritreria) throws Exception ;
 
 public HashMap<String, String> getRelatedUsers(String userId) throws Exception ;
 
 public String getProfile(String userId) throws Exception ;
 
 public String updateProfile(String xpath,Node node,Document messageDocument,boolean insert,String tagName) throws Exception ;
 
 public List<GMap> fetchGmapLocation(String orgId) throws Exception ;
 
 public void saveGmapLocation(HinUserProfile orgId,GMap map) throws Exception ;
 
 public void createUserRelationships(String loginUserId,String friendUserId,String message,String relationship) throws Exception ;

public List<Object[]> searchOrgLocation(String upperCase, String lookupType) throws Exception;

public List<Object[]> searchContacts(String upperCase, String lookupType) throws Exception;  

public String getUserName(String userId) throws Exception ;

public HashMap<String, String> getOrgListForUser(String useId,HashMap<String, Object> filterCritreria)  throws Exception;

public String getUserId(String message);

public List<Object[]> searchUsersByOrgId(String rowKey, String orgId) throws Exception;

}
