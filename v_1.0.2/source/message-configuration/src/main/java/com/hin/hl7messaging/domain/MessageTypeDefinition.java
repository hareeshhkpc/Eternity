/**
 * 
 */
package com.hin.hl7messaging.domain;

import java.util.HashMap;

/**
 * @author salam.halley
 *
 */
public class MessageTypeDefinition {
	String artifactsID="", columnFamily="", defaultValue="", creationTime="";
	
	HashMap<String, Object> map = new HashMap<String, Object>();
	HashMap<String, Object> clientFieldsMap = new HashMap<String, Object>();
	HashMap<String, Object> deidenitfiedMap = new HashMap<String, Object>();
	
	
	public String getCreationTime() {
		return creationTime;
	}
	public void setCreationTime(String creationTime) {
		this.creationTime = creationTime;
	}
	public String getDefaultValue() {
		return defaultValue;
	}
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
	public HashMap<String, Object> getClientFieldsMap() {
		return clientFieldsMap;
	}
	public void setClientFieldsMap(HashMap<String, Object> clientFieldsMap) {
		this.clientFieldsMap = clientFieldsMap;
	}
	public String getArtifactsID() {
		return artifactsID;
	}
	public void setArtifactsID(String artifactsID) {
		this.artifactsID = artifactsID;
	}
	public String getColumnFamily() {
		return columnFamily;
	}
	public void setColumnFamily(String columnFamily) {
		this.columnFamily = columnFamily;
	}
	public HashMap<String, Object> getMap() {
		return map;
	}
	public void setMap(HashMap<String, Object> map) {
		this.map = map;
	}
	public HashMap<String, Object> getDeidenitfiedMap() {
		return deidenitfiedMap;
	}
	public void setDeidenitfiedMap(HashMap<String, Object> deidenitfiedMap) {
		this.deidenitfiedMap = deidenitfiedMap;
	}
	@Override
	public String toString() {
		return "MessageTypeDefinition [artifactsID=" + artifactsID
				+ ", columnFamily=" + columnFamily + ", defaultValue="
				+ defaultValue + ", creationTime=" + creationTime + ", map="
				+ map + ", clientFieldsMap=" + clientFieldsMap
				+ ", deidenitfiedMap=" + deidenitfiedMap + "]";
	}

}