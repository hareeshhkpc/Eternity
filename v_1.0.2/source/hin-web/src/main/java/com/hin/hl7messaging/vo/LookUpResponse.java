package com.hin.hl7messaging.vo;
import java.util.HashMap;
public class LookUpResponse {
	public 	HashMap<String, String> data = new HashMap<String,String>();
	public String dataSize;
	public void setProfileList(HashMap<String, String> data){
		this.data.putAll(data);
		this.dataSize = Integer.toString(data.size()); 
	}
	 public HashMap<String, String> getProfileList(){
		return data;  
		 
	 }
	 public String getdataSize(){
		return dataSize;
	 }
}
