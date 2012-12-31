/**
 * 
 */
package com.hin.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Concept;
import com.hin.domain.User;
import com.hin.service.IConceptService;
import com.hin.service.IRegistrationService;
import com.hin.service.IUserService;

/**
 * @author sreekumar.s
 * 
 */
@Controller
public class RegistrationController {

	@Autowired
	private IRegistrationService registrationService;

	@Autowired
	private IUserService userService;

	@Autowired
	private IConceptService conceptService;

	/*@Autowired
	private CommonsMultipartResolver commonsMultipartResolver;*/

	@RequestMapping(value = "/register", method = RequestMethod.GET)
	public @ResponseBody
	String register(@RequestParam String type, String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		User user = gson.fromJson(json, User.class);
		try {
			registrationService.register(user);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		data = gson.toJson(user);
		return data;
	}

	@RequestMapping(value = "/user", method = RequestMethod.GET)
	public @ResponseBody
	String user(@RequestParam String type, String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		User user = gson.fromJson(json, User.class);
		User newUser = userService.findUserByProperty("name", user.getName());

		Concept concept = new Concept();
		concept.setName("BP");
		try {
			conceptService.findByConceptName(concept);

			userService.save(new User());

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		if (newUser != null)
			data = gson.toJson(newUser);
		else
			data = gson.toJson(user);
		return data;
	}

	/*@RequestMapping(value = "/multi", method = RequestMethod.POST)
	public @ResponseBody
	String multi(@RequestParam HttpServletRequest request) {
		String data = "";
		if (request instanceof MultipartHttpServletRequest) {
			// process the uploaded file
			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
			System.out.println("multipart "
					+ multipartHttpServletRequest.getFileMap());
			//commonsMultipartResolver.getFileUpload();
		} else {
			// other logic
		}

		return data;
	}*/

}
