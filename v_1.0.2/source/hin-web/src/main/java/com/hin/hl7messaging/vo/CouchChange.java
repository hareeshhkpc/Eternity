/**
 * 
 */
package com.hin.hl7messaging.vo;

import java.util.List;

/**
 * @author sreekumar.s
 * 
 */
public class CouchChange {
	int seq;
	String id;
	List<Change> changes;
	String deleted;

	/* custom */
	CouchData couchData;
	CouchProcessData couchProcessData;

	/**
	 * @return the seq
	 */
	public int getSeq() {
		return seq;
	}

	/**
	 * @param seq
	 *            the seq to set
	 */
	public void setSeq(int seq) {
		this.seq = seq;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the changes
	 */
	public List<Change> getChanges() {
		return changes;
	}

	/**
	 * @param changes
	 *            the changes to set
	 */
	public void setChanges(List<Change> changes) {
		this.changes = changes;
	}

	/**
	 * @return the deleted
	 */
	public String getDeleted() {
		return deleted;
	}

	/**
	 * @param deleted
	 *            the deleted to set
	 */
	public void setDeleted(String deleted) {
		this.deleted = deleted;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CouchChange [seq=" + seq + ", id=" + id + ", changes="
				+ changes + ", deleted=" + deleted + "]";
	}

	/**
	 * @return the couchData
	 */
	public CouchData getCouchData() {
		return couchData;
	}

	/**
	 * @param couchData
	 *            the couchData to set
	 */
	public void setCouchData(CouchData couchData) {
		this.couchData = couchData;
	}

	/**
	 * @return the couchProcessData
	 */
	public CouchProcessData getCouchProcessData() {
		return couchProcessData;
	}

	/**
	 * @param couchProcessData
	 *            the couchProcessData to set
	 */
	public void setCouchProcessData(CouchProcessData couchProcessData) {
		this.couchProcessData = couchProcessData;
	}

}
