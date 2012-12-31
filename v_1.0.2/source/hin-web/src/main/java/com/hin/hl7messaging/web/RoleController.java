/**
 * 
 */
package com.hin.hl7messaging.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.RoleDefinitionVO;
import com.hin.hl7messaging.api.IRoleDefinitionService;

/**
 * @author vinaykumar.gk
 * 
 */
@Controller
public class RoleController {
	@Autowired
	IRoleDefinitionService roleDefinitionService;

	@RequestMapping(value = "/role/roleController", method = RequestMethod.GET)
	public @ResponseBody
	String retrieveALlRoleNames(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		RoleDefinitionVO roleDefinitionVO = new RoleDefinitionVO();
		List<String> roleNames = roleDefinitionService.retrieveAllRoleNames();
		roleDefinitionVO.setRoleNames(roleNames);
		data = gson.toJson(roleDefinitionVO);
		return data;

	}

}
