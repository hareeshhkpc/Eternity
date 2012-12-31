package com.hin.domain.vo;

import java.util.ArrayList;
import java.util.List;

public class RoleDefinitionVO {
	List<String> roleNames = new ArrayList<String>();
	List<String> processNames = new ArrayList<String>();

	public List<String> getRoleNames() {
		return roleNames;
	}

	public void setRoleNames(List<String> roleNames) {
		this.roleNames = roleNames;
	}

	public List<String> getProcessNames() {
		return processNames;
	}

	public void setProcessNames(List<String> processNames) {
		this.processNames = processNames;
	}

}
