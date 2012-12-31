package com.hin.hl7messaging.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.UserVO;
import com.hin.hl7messaging.api.IAuthenticationService;
import com.hin.service.IProcessInstanceService;

@Controller
public class LoginController {

	@Autowired
	IAuthenticationService authenticationService;
	
	@Autowired
	private IProcessInstanceService processInstanceService;

	@RequestMapping(value = "/login/userLogin", method = RequestMethod.GET)
	public @ResponseBody
	String authenticate(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		UserVO userVO = gson.fromJson(json, UserVO.class);
		try {
			userVO = authenticationService.authenticate(userVO);
			RequestContextHolder.currentRequestAttributes().setAttribute(IAuthenticationService.LOGGED_IN_USER, userVO, RequestAttributes.SCOPE_SESSION);
			String userProcessName="Profile";
	/*		for(String userRole:userVO.getRoles()){
				if(userRole.equals("EMPLOYEE")){
					userProcessName="StaffRegistration";
				}
			}*/
			userVO.setProfileProcessInstanceID(processInstanceService.getProcessListForUser(userVO.getSubscriberId(),userProcessName));
		} catch (Exception e) {
			e.printStackTrace();
		}
		data = gson.toJson(userVO);
		return data;
	}
	
	
	@RequestMapping(value = "/login/validate", method = RequestMethod.GET)
	public @ResponseBody String validateUser(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		//UserVO userVO = gson.fromJson(json, UserVO.class);
		Boolean exist = false;
		try {
			exist = authenticationService.validateUser(json);
			 		
		} catch (Exception e) {
			e.printStackTrace();
		}
		data = gson.toJson(exist);
		return data;
	}


}