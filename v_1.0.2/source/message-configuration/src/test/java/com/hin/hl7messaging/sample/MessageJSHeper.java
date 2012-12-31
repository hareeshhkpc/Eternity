/**
 * 
 */
package com.hin.hl7messaging.sample;

import java.util.Stack;

/**
 * @author Administrator
 *
 */
public class MessageJSHeper {
	private Stack<String> treeStack = new Stack<String>();
	
	
	public void push(String id){
		treeStack.push(id);
	}
	
	public String pop(){
		return treeStack.pop();
	}
	
	public String treeID(){
		String id = "";
		for(String treeId : treeStack){
			if(id.length() < 1)
				id = id.concat(treeId);
			else
				id = id.concat("_").concat(treeId);
		}
		
		return id;
	}
}
