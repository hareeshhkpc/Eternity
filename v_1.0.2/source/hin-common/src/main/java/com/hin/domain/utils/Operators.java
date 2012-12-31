/**
 * To map with the mongodb Query operators
 */
package com.hin.domain.utils;

/**
 * @author s.thamilarasi
 * 
 */

public enum Operators {
	GT(">"), GTE(">="), LT("<"), LTE("<="), IS("="), NE("!=");
	
	private final String operatorSymbol;

	Operators(String operatorSymbol) {
		this.operatorSymbol = operatorSymbol;
	}
	
	public String getName() {
		return name();
	}
	
	public String getValue(){
		return operatorSymbol;
	}
	
	/**
	 * 
	 * @param givenSymbol
	 * @return Operator based on givenSymbol
	 */
	public static Operators fromOperatorSymbol(String givenSymbol){
		if(givenSymbol!=null){
			for(Operators operators:values()){
				if(givenSymbol.equals(operators.operatorSymbol)){
					return operators;
				}
			}
		}
		return null;
				
		
	}
	 

}
