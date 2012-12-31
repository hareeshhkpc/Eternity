/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;
import com.thoughtworks.xstream.annotations.XStreamOmitField;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="Field")
public class ConfigIndexField  implements IConfigElement {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = -6353024427465883265L;

	/**
	 * An enum attribute to define the RIM type of this class (Participation/Role/Act/Entity/RoleLink/ActRelationship)
	 */
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private RIM_TYPE rimType = RIM_TYPE.UNIDENTIFIED;
	
	/**
	 * Only a configuration design view attribute to signify the selection of this class
	 */
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private Boolean selected = Boolean.FALSE;
	
	@XStreamOmitField /*	We don't need this field in the configuration file	*/
	private CONFIG_OBJECT_TYPE configType = CONFIG_OBJECT_TYPE.INDEX_FIELD;
	
	@XStreamAsAttribute	
	private String name;
	
	@XStreamAsAttribute
	private Boolean indexed = Boolean.TRUE;
	
	@XStreamAsAttribute
	private String xpath;
	
	@XStreamAsAttribute	
	private String analyzed;
	
	@XStreamAsAttribute	
	private DATA_TYPE dataType = DATA_TYPE.STRING;

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
	 * @return the indexed
	 */
	public Boolean getIndexed() {
		return indexed;
	}

	/**
	 * @param indexed the indexed to set
	 */
	public void setIndexed(Boolean indexed) {
		this.indexed = indexed;
	}

	/**
	 * @return the xpath
	 */
	public String getXpath() {
		return xpath;
	}

	/**
	 * @param xpath the xpath to set
	 */
	public void setXpath(String xpath) {
		this.xpath = xpath;
	}

	@Override
	public RIM_TYPE getRIMType() {
		return rimType;
	}

	@Override
	public void setRIMType(RIM_TYPE type) {
		rimType = type;
	}

	@Override
	public CONFIG_OBJECT_TYPE getConfigType() {
		return configType;
	}

	@Override
	public Boolean isSelected() {
		return selected;
	}

	public String getAnalyzed() {
		return analyzed;
	}

	public void setAnalyzed(String analyzed) {
		this.analyzed = analyzed;
	}

	public DATA_TYPE getDataType() {
		return dataType;
	}

	public void setDataType(DATA_TYPE dataType) {
		this.dataType = dataType;
	}
	
}
