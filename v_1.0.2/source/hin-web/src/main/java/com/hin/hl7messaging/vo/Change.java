/**
 * 
 */
package com.hin.hl7messaging.vo;

/**
 * @author sreekumar.s
 * 
 */
public class Change {

	String rev;

	/**
	 * @return the rev
	 */
	public String getRev() {
		return rev;
	}

	/**
	 * @param rev
	 *            the rev to set
	 */
	public void setRev(String rev) {
		this.rev = rev;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Change [rev=" + rev + "]";
	}

}
