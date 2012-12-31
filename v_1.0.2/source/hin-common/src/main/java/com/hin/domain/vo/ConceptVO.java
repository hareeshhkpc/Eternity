/**
 * 
 */
package com.hin.domain.vo;

import java.util.List;

import com.hin.domain.ConceptAttribute;
import com.hin.domain.ConceptClass;

/**
 * @author krishna.lr
 * 
 */
public class ConceptVO {
	/**
	 * @param name
	 * @param description
	 * @param shortName
	 */
	public ConceptVO(String name, String description,
			List<ConceptClass> conceptClasses,
			List<ConceptAttribute> conceptAttributes, String smallIcon,
			String shortName) {
		super();
		this.name = name;
		this.description = description;
		this.conceptClasses = conceptClasses;
		this.conceptAttributes = conceptAttributes;
		this.smallIcon = smallIcon;
		this.shortName = shortName;
	}

	private String name;
	private String description;
	private List<ConceptClass> conceptClasses;
	private List<ConceptAttribute> conceptAttributes;
	private String smallIcon;
	private String shortName;
	private String category;

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}

	/**
	 * @param name
	 *            the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @return the description
	 */
	public String getDescription() {
		return description;
	}

	/**
	 * @param description
	 *            the description to set
	 */
	public void setDescription(String description) {
		this.description = description;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	public List<ConceptAttribute> getConceptAttributes() {
		return conceptAttributes;
	}

	public void setConceptAttributes(List<ConceptAttribute> conceptAttributes) {
		this.conceptAttributes = conceptAttributes;
	}

	public String getSmallIcon() {
		return smallIcon;
	}

	public void setSmallIcon(String smallIcon) {
		this.smallIcon = smallIcon;
	}

	@Override
	public String toString() {
		return "ConceptVO [name=" + name + ", description=" + description + "]";
	}

	/**
	 * @return the shortName
	 */
	public String getShortName() {
		return shortName;
	}

	/**
	 * @param shortName
	 *            the shortName to set
	 */
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	/**
	 * @return the conceptClasses
	 */
	public List<ConceptClass> getConceptClasses() {
		return conceptClasses;
	}

	/**
	 * @param conceptClasses
	 *            the conceptClasses to set
	 */
	public void setConceptClasses(List<ConceptClass> conceptClasses) {
		this.conceptClasses = conceptClasses;
	}

	/**
	 * @return the category
	 */
	public String getCategory() {
		return category;
	}

	/**
	 * @param category
	 *            the category to set
	 */
	public void setCategory(String category) {
		this.category = category;
	}

}
