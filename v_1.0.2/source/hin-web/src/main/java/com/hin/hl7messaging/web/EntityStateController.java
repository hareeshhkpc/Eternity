package com.hin.hl7messaging.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.EntityState;
import com.hin.service.IEntityStateService;

@Controller
public class EntityStateController {

	@Autowired
	private IEntityStateService entityStateService;

	@RequestMapping(value = "/entity/changeState", method = RequestMethod.GET)
	public @ResponseBody
	String changeEntityState(@RequestParam String json) {

		Gson gson = new GsonBuilder().create();
		EntityState entityState = gson.fromJson(json, EntityState.class);
		try {
			entityStateService.changeState(entityState);
			json = gson.toJson(entityState);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return json;
	}

	// get the value of a entity id
	@RequestMapping(value = "/entity/getState", method = RequestMethod.GET)
	public @ResponseBody
	String getEntityState(@RequestParam String json) {
		Gson gson = new GsonBuilder().create();
		EntityState entityState = gson.fromJson(json, EntityState.class);
		try {
			json = gson.toJson(entityStateService.getStates(entityState));
		} catch (Exception e) {

			e.printStackTrace();
		}
		return json;
	}

}