/**
 * 
 */
package com.hin.hl7messaging.vo;

import java.util.List;

/**
 * @author sreekumar.s
 * 
 */
public class CouchChanges {

	List<CouchChange> results;
	int last_seq;

	/**
	 * @return the results
	 */
	public List<CouchChange> getResults() {
		return results;
	}

	/**
	 * @param results
	 *            the results to set
	 */
	public void setResults(List<CouchChange> results) {
		this.results = results;
	}

	/**
	 * @return the last_seq
	 */
	public int getLast_seq() {
		return last_seq;
	}

	/**
	 * @param last_seq
	 *            the last_seq to set
	 */
	public void setLast_seq(int last_seq) {
		this.last_seq = last_seq;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CouchChanges [results=" + results + ", last_seq=" + last_seq
				+ "]";
	}

}
