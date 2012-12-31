/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.vo.UserVO;

/**
 * @author shilpa.rao
 * 
 */
public interface IAuthenticationService {

	public final static String LOGGED_IN_USER = "LOGGED_IN_USER";
	
	public UserVO authenticate(UserVO userVO);

	public List<?> getSubscribers();

	/* public List<?> getSubscribers(Object object); */

	public List<?> getRoles();

	public List<?> getPrivileges();

	public List<String> getUserRoles(UserVO userVo);

	public List<String> getUserPrivileges(UserVO userVo);

	public Boolean validateUser(String userVO);

}
