package com.hin.domain;

import com.hin.domain.core.BaseDomain;

/**
 * @author Hari Krishnan p.c
 * 
 */

public class EntityState extends BaseDomain {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 1L;
	private String entityid;
	private String state;
	private String statevalue;
	private String time;
	private String assigningOrganizationID;

	public String getEntityid() {
		return entityid;
	}

	public void setEntityid(String entityid) {
		this.entityid = entityid;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getStatevalue() {
		return statevalue;
	}

	public void setStatevalue(String statevalue) {
		this.statevalue = statevalue;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getAssigningOrganizationID() {
		return assigningOrganizationID;
	}

	public void setAssigningOrganizationID(String assigningOrganizationID) {
		this.assigningOrganizationID = assigningOrganizationID;
	}
	
	@Override
	public String toString() {
		return "EntityState [entityid=" + entityid + ", state=" + state
				+ ", statevalue=" + statevalue + ", time=" + time + "]";
	}

}