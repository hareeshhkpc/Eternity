/**
 * 
 */
package com.hin.hl7messaging.utils;


/**
 * @author vinaykumar.gk
 * 
 */
public class GMap {

	private String lat;
	private String lng;
	private String title;
	private String content;
	private String icon;
	private String logo;
	private String path;
	private String orgId;

	public GMap(String lat, String lng, String title, String content,
			String icon, String logo,String path,String orgId) {
		this.lat = lat;
		this.lng = lng;
		this.title = title;
		this.content = content;
		this.icon = icon;
		this.logo = logo;
		this.path = path;
		this.orgId =orgId;
	}

	/**
	 * @return the lat
	 */
	public String getLat() {
		return lat;
	}

	/**
	 * @param lat
	 *            the lat to set
	 */
	public void setLat(String lat) {
		this.lat = lat;
	}

	/**
	 * @return the lng
	 */
	public String getLng() {
		return lng;
	}

	/**
	 * @param lng
	 *            the lng to set
	 */
	public void setLng(String lng) {
		this.lng = lng;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title
	 *            the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
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
	 * @return the icon
	 */
	public String getIcon() {
		return icon;
	}

	/**
	 * @param icon
	 *            the icon to set
	 */
	public void setIcon(String icon) {
		this.icon = icon;
	}

	/**
	 * @return the logo
	 */
	public String getLogo() {
		return logo;
	}

	/**
	 * @param logo
	 *            the logo to set
	 */
	public void setLogo(String logo) {
		this.logo = logo;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "GMap [lat=" + lat + ", lng=" + lng + ", title=" + title
				+ ", content=" + content + ", icon=" + icon + ", logo=" + logo + ", path= " + path
				+ "]";
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

}
