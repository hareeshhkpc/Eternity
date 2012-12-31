package com.hin.hl7messaging.web;

import java.util.UUID;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import com.hin.hl7messaging.api.IAuthenticationService;

@Controller
public class IdGenerationController {

	@RequestMapping(value = "/idGeneration", method = RequestMethod.GET)
	public @ResponseBody String uuidGeneration() {
		
		UUID uuid = UUID.randomUUID();
		String data = uuid.toString();
		return data;
	}
	
	@RequestMapping(value = "/testAuth", method = RequestMethod.GET)
	public @ResponseBody String testAuth() {
		
		Object user = RequestContextHolder.currentRequestAttributes().getAttribute(IAuthenticationService.LOGGED_IN_USER, RequestAttributes.SCOPE_SESSION);
		System.out.println(user);
		return "{}";
	}

}