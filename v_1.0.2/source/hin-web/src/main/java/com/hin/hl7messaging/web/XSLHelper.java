package com.hin.hl7messaging.web;

import java.util.ArrayList;

/**
 * 
 */

/**
 * @author 
 *
 */
public class XSLHelper {

	public  ArrayList<String> visits = new ArrayList<String>();
	/*private Integer panelId = 1;*/

	/*public String getLastId(){
		return "penelId" + (panelId++);
	}
	*/
	/*public String toUpper(String str){
		return str.toUpperCase();
	}*/
	
	public String  keepVisited(String attrValue){
		visits.add(attrValue); 
		return attrValue;
	}
	
	public Boolean hasVisited(String attrVlaue ){
		return (visits.contains(attrVlaue));
		
	}
	
	/*public static void main (String args[]){
		XSLHelper obj= new XSLHelper();
		obj.hasVisited("","");
	
	}*/
	
	
	
}

