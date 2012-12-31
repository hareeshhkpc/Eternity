/**
 * 
 */
package com.hin.domain.config;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Administrator
 *
 */
public class HL7ObjectItem {
	private String name;
	private String type;
	private Integer min;
	private Integer max;
	private Boolean isHL7Type = false;
	private Boolean isModel = false;
	private List<HL7ObjectItem> items;
	private Boolean isSelected;
	
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
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/**
	 * @return the min
	 */
	public Integer getMin() {
		return min;
	}
	/**
	 * @param min the min to set
	 */
	public void setMin(Integer min) {
		this.min = min;
	}
	/**
	 * @return the max
	 */
	public Integer getMax() {
		return max;
	}
	/**
	 * @param max the max to set
	 */
	public void setMax(Integer max) {
		this.max = max;
	}
	/**
	 * @return the isHL7Type
	 */
	public Boolean getIsHL7Type() {
		return isHL7Type;
	}
	/**
	 * @param isHL7Type the isHL7Type to set
	 */
	public void setIsHL7Type(Boolean isHL7Type) {
		this.isHL7Type = isHL7Type;
	}
	/**
	 * @return the items
	 */
	public List<HL7ObjectItem> getItems() {
		if(items == null){
			items = new ArrayList<HL7ObjectItem>();
		}
		return items;
	}
	/**
	 * @param items the items to set
	 */
	public void setItems(List<HL7ObjectItem> items) {
		this.items = items;
	}
	/**
	 * @return the isModel
	 */
	public Boolean getIsModel() {
		return isModel;
	}
	/**
	 * @param isModel the isModel to set
	 */
	public void setIsModel(Boolean isModel) {
		this.isModel = isModel;
	}
	/**
	 * @return the isSelected
	 */
	public Boolean getIsSelected() {
		return isSelected;
	}
	/**
	 * @param isSelected the isSelected to set
	 */
	public void setIsSelected(Boolean isSelected) {
		this.isSelected = isSelected;
	}
}
