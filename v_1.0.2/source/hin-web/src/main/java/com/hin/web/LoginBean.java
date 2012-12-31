/**
 * 
 */
package com.hin.web;

import java.io.IOException;

import javax.faces.FacesException;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import com.hin.domain.vo.UserVO;
import com.hin.hl7messaging.api.IAuthenticationService;
import com.hin.service.IProcessInstanceService;
import com.hin.web.base.BaseBean;

/**
 * @author ranga.reddy
 * 
 */
@Component("loginBean")
@Scope("session")
public class LoginBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Autowired
	private IAuthenticationService authenticationService;
	@Autowired
	private IProcessInstanceService processInstanceService;

	private UserVO userVO = new UserVO();
	private boolean logout = true;

	/**
	 * @return the authenticationService
	 */
	public IAuthenticationService getAuthenticationService() {
		return authenticationService;
	}

	/**
	 * @param authenticationService
	 *            the authenticationService to set
	 */
	public void setAuthenticationService(
			IAuthenticationService authenticationService) {
		this.authenticationService = authenticationService;
	}

	/**
	 * @return the userVo
	 */
	public UserVO getUserVO() {
		return userVO;
	}

	/**
	 * @param userVo
	 *            the userVo to set
	 */
	public void setUserVO(UserVO userVO) {
		this.userVO = userVO;
	}

	/**
	 * @return the processInstanceService
	 */
	public IProcessInstanceService getProcessInstanceService() {
		return processInstanceService;
	}

	/**
	 * @param processInstanceService
	 *            the processInstanceService to set
	 */
	public void setProcessInstanceService(
			IProcessInstanceService processInstanceService) {
		this.processInstanceService = processInstanceService;
	}

	public String authenticate() {
		try {
			if (userVO.getUserName() != null && userVO.getPassword() != null) {
				userVO = authenticationService.authenticate(userVO);
				RequestContextHolder.currentRequestAttributes().setAttribute(
						IAuthenticationService.LOGGED_IN_USER, userVO,
						RequestAttributes.SCOPE_SESSION);
				if (userVO.getSubscriberId() != null) {
					logout = false;
					return "index";
				} else {
					errorMessage("Enter Correct UserName and Password ");
					return "login";
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}

	public String logout() {
		logout = true;
		userVO.setUserName("");
		userVO.setSubscriberId(null);
		FacesContext ctx = FacesContext.getCurrentInstance();

		ExternalContext extContext = ctx.getExternalContext();
		String url = extContext.encodeActionURL(ctx.getApplication()
				.getViewHandler()
				.getActionURL(ctx, "/pages/login.xhtml"));
		try {

			extContext.redirect(url);
		} catch (IOException ioe) {
			throw new FacesException(ioe);

		}
		return null;
	}

	/**
	 * @return the logout
	 */
	public boolean isLogout() {
		return logout;
	}

	/**
	 * @param logout
	 *            the logout to set
	 */
	public void setLogout(boolean logout) {
		this.logout = logout;
	}

}
