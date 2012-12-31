/**
 * 
 */
package com.hin.domain.config;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamAsAttribute;

/**
 * @author Administrator
 *
 */
@XStreamAlias(value="tree-node")
public class ConfigParamTreeNode {

	@XStreamAsAttribute
	private String xpath = "/";
	
	@XStreamAsAttribute
	private CHILD_TRAVERSE_POLICY traverseChildWhen = CHILD_TRAVERSE_POLICY.MANDATORY;
	
	@XStreamAsAttribute
	private Integer repeatCount = 1;
	
	@XStreamAsAttribute
	private Boolean traverseMessageObjectChild = true;
	
	@XStreamAsAttribute
	private Boolean traverseHL7DataTypeChild = false;
	
	@XStreamAsAttribute
	private String traveseChildList;
	
	@XStreamAsAttribute
	private String overriddenFieldType;
	
	@XStreamAsAttribute
	private CHILD_TRAVERSE_POLICY considerChildrenWhen = CHILD_TRAVERSE_POLICY.MANDATORY;

	public boolean isDifferent(ConfigParamTreeNode obj) {
		if(obj.getConsiderChildrenWhen() != this.getConsiderChildrenWhen()
				|| obj.getTraverseChildWhen() != this.getTraverseChildWhen()
				|| obj.getTraverseHL7DataTypeChild() != this.getTraverseHL7DataTypeChild()
				|| obj.getTraverseMessageObjectChild() != this.getTraverseMessageObjectChild()
				|| obj.getRepeatCount() != this.getRepeatCount()
				|| obj.getTraveseChildList() != this.getTraveseChildList()
				|| obj.getOverriddenFieldType() != this.getOverriddenFieldType()){
			return true;
		}
		return false;
	}

	public void initDefaults(){
		if(xpath == null){
			xpath = "/";
		}
		if(traverseChildWhen == null){
			traverseChildWhen = CHILD_TRAVERSE_POLICY.MANDATORY;
		}
		if(repeatCount == null){
			repeatCount = 1;
		}
		if(traverseMessageObjectChild == null){
			traverseMessageObjectChild = true;
		}
		if(traverseHL7DataTypeChild == null){
			traverseHL7DataTypeChild = false;
		}
		if(considerChildrenWhen == null){
			considerChildrenWhen = CHILD_TRAVERSE_POLICY.MANDATORY;
		}
	}
	
	/**
	 * @return the traverseChildWhen
	 */
	public CHILD_TRAVERSE_POLICY getTraverseChildWhen() {
		return traverseChildWhen;
	}

	/**
	 * @param traverseChildWhen the traverseChildWhen to set
	 */
	public void setTraverseChildWhen(CHILD_TRAVERSE_POLICY traverseChildWhen) {
		this.traverseChildWhen = traverseChildWhen;
	}

	/**
	 * @return the repeatCount
	 */
	public Integer getRepeatCount() {
		return repeatCount;
	}

	/**
	 * @param repeatCount the repeatCount to set
	 */
	public void setRepeatCount(Integer repeatCount) {
		this.repeatCount = repeatCount;
	}

	/**
	 * @return the traverseMessageObjectChild
	 */
	public Boolean getTraverseMessageObjectChild() {
		return traverseMessageObjectChild;
	}

	/**
	 * @param traverseMessageObjectChild the traverseMessageObjectChild to set
	 */
	public void setTraverseMessageObjectChild(Boolean traverseMessageObjectChild) {
		this.traverseMessageObjectChild = traverseMessageObjectChild;
	}

	/**
	 * @return the traverseHL7DataTypeChild
	 */
	public Boolean getTraverseHL7DataTypeChild() {
		return traverseHL7DataTypeChild;
	}

	/**
	 * @param traverseHL7DataTypeChild the traverseHL7DataTypeChild to set
	 */
	public void setTraverseHL7DataTypeChild(Boolean traverseHL7DataTypeChild) {
		this.traverseHL7DataTypeChild = traverseHL7DataTypeChild;
	}

	/**
	 * @return the considerChildrenWhen
	 */
	public CHILD_TRAVERSE_POLICY getConsiderChildrenWhen() {
		return considerChildrenWhen;
	}

	/**
	 * @param considerChildrenWhen the considerChildrenWhen to set
	 */
	public void setConsiderChildrenWhen(CHILD_TRAVERSE_POLICY considerChildrenWhen) {
		this.considerChildrenWhen = considerChildrenWhen;
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

	/**
	 * @return the traveseChildList
	 */
	public String getTraveseChildList() {
		return traveseChildList;
	}

	/**
	 * @param traveseChildList the traveseChildList to set
	 */
	public void setTraveseChildList(String traveseChildList) {
		this.traveseChildList = traveseChildList;
	}

	/**
	 * @return the overriddenFieldType
	 */
	public String getOverriddenFieldType() {
		return overriddenFieldType;
	}

	/**
	 * @param overriddenFieldType the overriddenFieldType to set
	 */
	public void setOverriddenFieldType(String overriddenFieldType) {
		this.overriddenFieldType = overriddenFieldType;
	}
	
}
