/**
 * 
 */
package com.hin.hl7messaging.vo;

import org.apache.log4j.Logger;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.hl7messaging.web.service.SyncService;

/**
 * @author sreekumar.s
 * 
 */
public class CouchData {

	String _id;
	String _rev;
	String timpestamp;
	String content;
	String objecttype;
	String userid;
	Object params;

	protected static Logger logger = Logger.getLogger(CouchData.class);

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
	public String getContent() {
		return content;
	}

	/**
	 * @param content
	 *            the content to set
	 */
	public void setContent(String content) {
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

	public String getUserid() {
		return userid;
	}

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
	 * @param params
	 *            the params to set
	 */
	public void setParams(Object params) {
		this.params = params;
	}

	public boolean isFinished() {
		// System.out.println(this.params);
		CouchParams couchParams = null;
		if (this.params != null) {
			Gson gson = new GsonBuilder().create();

			try {
				couchParams = gson.fromJson(this.params.toString(),
						CouchParams.class);
			} catch (Exception e) {
				logger.error("Couch Params Gson conversion failed.", e);
				System.out.println("Couch Params Gson conversion failed");
			}
		}
		if (couchParams != null) {
			return couchParams.isFinish();
		}
		return false;
	}

	public boolean isDeleted() {
		// System.out.println(this.params);
		CouchParams couchParams = null;
		if (this.params != null) {
			Gson gson = new GsonBuilder().create();

			try {
				couchParams = gson.fromJson(this.params.toString(),
						CouchParams.class);
			} catch (Exception e) {
				logger.error("Couch Params Gson conversion failed.", e);
				System.out.println("Couch Params Gson conversion failed");
			}
		}
		if (couchParams != null) {
			return couchParams.isDeleted();
		}
		return false;
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
				+ objecttype + ", userid=" + userid + ", params=" + params
				+ "]";
	}

}
