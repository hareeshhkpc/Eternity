/**
 * 
 */
package com.hin.hl7messaging.vo;

import com.hin.domain.ProcessDefinition;

/**
 * @author sreekumar.s
 * 
 */
public class CouchProcessData {

	String _id;
	String _rev;
	String timpestamp;
	ProcessDefinition content;
	String objecttype;
	String userid;
	Object params;

	/**
	 * @return the _id
	 */
	public String get_id() {
		return _id;
	}

	/**
	 * @param _id
	 *            the _id to set
	 */
	public void set_id(String _id) {
		this._id = _id;
	}

	/**
	 * @return the _rev
	 */
	public String get_rev() {
		return _rev;
	}

	/**
	 * @param _rev
	 *            the _rev to set
	 */
	public void set_rev(String _rev) {
		this._rev = _rev;
	}

	/**
	 * @return the timpestamp
	 */
	public String getTimpestamp() {
		return timpestamp;
	}

	/**
	 * @param timpestamp
	 *            the timpestamp to set
	 */
	public void setTimpestamp(String timpestamp) {
		this.timpestamp = timpestamp;
	}

	/**
	 * @return the content
	 */
	public ProcessDefinition getContent() {
		return content;
	}

	/**
	 * @param content
	 *            the content to set
	 */
	public void setContent(ProcessDefinition content) {
		this.content = content;
	}

	/**
	 * @return the objecttype
	 */
	public String getObjecttype() {
		return objecttype;
	}

	/**
	 * @param objecttype
	 *            the objecttype to set
	 */
	public void setObjecttype(String objecttype) {
		this.objecttype = objecttype;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CouchData [_id=" + _id + ", _rev=" + _rev + ", timpestamp="
				+ timpestamp + ", content=" + content + ", objecttype="
				+ objecttype + "]";
	}

	/**
	 * @return the userid
	 */
	public String getUserid() {
		return userid;
	}

	/**
	 * @param userid the userid to set
	 */
	public void setUserid(String userid) {
		this.userid = userid;
	}

	/**
	 * @return the params
	 */
	public Object getParams() {
		return params;
	}

	/**
	 * @param params the params to set
	 */
	public void setParams(Object params) {
		this.params = params;
	}

}
