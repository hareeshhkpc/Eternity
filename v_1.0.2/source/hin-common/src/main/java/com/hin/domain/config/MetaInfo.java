/**
 * 
 */
package com.hin.domain.config;

import java.util.Date;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="MetaInfo")
public class MetaInfo implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 908173954133703404L;

	@XStreamAsAttribute
	private String id;
	
	@XStreamAsAttribute
	private String artifactID;
	
	@XStreamAsAttribute
	private String name;
	
	@XStreamAsAttribute
	private String publisher;
	
	@XStreamAsAttribute
	private String version;
	
	@XStreamAsAttribute
	private Date createdDate;
	
	@XStreamAsAttribute
	private String entryPoint;
	
	@XStreamAsAttribute
	private String description;

	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.META_INFO;

	@XStreamAsAttribute
	private RIM_TYPE rimType;
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the artifactID
	 */
	public String getArtifactID() {
		return artifactID;
	}
	/**
	 * @param artifactID the artifactID to set
	 */
	public void setArtifactID(String artifactID) {
		this.artifactID = artifactID;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the author
	 */
	public String getPublisher() {
		return publisher;
	}
	/**
	 * @param author the author to set
	 */
	public void setPublisher(String author) {
		this.publisher = author;
	}
	/**
	 * @return the version
	 */
	public String getVersion() {
		return version;
	}
	/**
	 * @param version the version to set
	 */
	public void setVersion(String version) {
		this.version = version;
	}
	/**
	 * @return the createdDate
	 */
	public Date getCreatedDate() {
		return createdDate;
	}
	/**
	 * @param createdDate the createdDate to set
	 */
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	/**
	 * @return the entryPoint
	 */
	public String getEntryPoint() {
		return entryPoint;
	}
	/**
	 * @param entryPoint the entryPoint to set
	 */
	public void setEntryPoint(String entryPoint) {
		this.entryPoint = entryPoint;
	}
	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}
	/**
	 * @param description the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	@Override
	public String toString() {
		return "MetaInfo [artifactID=" + artifactID + ", name=" + name
				+ ", publisher=" + publisher + ", version=" + version
				+ ", createdDate=" + createdDate + ", entryPoint=" + entryPoint
				+ ", description=" + description + "]";
	}

	@Override
	public Boolean isSelected() {
		return this.selected;
	}
	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}
	/**
	 * @param selected the selected to set
	 */
	public void setSelected(Boolean selected) {
		this.selected = selected;
	}
	/**
	 * @param configType the configType to set
	 */
	public void setConfigType(CONFIG_OBJECT_TYPE configType) {
		this.configType = configType;
	}
	@Override
	public RIM_TYPE getRIMType() {
		if(rimType == null){
			rimType = RIM_TYPE.UNIDENTIFIED;
		}
		return rimType;
	}
	@Override
	public void setRIMType(RIM_TYPE type) {
		rimType = type;
	}	
}
