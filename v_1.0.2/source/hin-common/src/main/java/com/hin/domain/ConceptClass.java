/**
 * 
 */
package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

import com.hin.domain.core.BaseDomain;

/**
 * @author swetha.murthy
 * 
 */
public class ConceptClass extends BaseDomain {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String name;
	private String description;
	private List<ConceptAttribute> conceptAttributes = new ArrayList<ConceptAttribute>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	/**
	 * @return the conceptAttributes
	 */
	public List<ConceptAttribute> getConceptAttributes() {
		return conceptAttributes;
	}

	/**
	 * @param conceptAttributes
	 *            the conceptAttributes to set
	 */
	public void setConceptAttributes(List<ConceptAttribute> conceptAttributes) {
		this.conceptAttributes = conceptAttributes;
	}

	public boolean addConceptAttribute(ConceptAttribute conceptAttribute) {
		return conceptAttributes.add(conceptAttribute);

	}

	public ConceptAttribute getConceptAttrByKey(String conceptAttrKey) {
		List<ConceptAttribute> conceptAttributes = getConceptAttributes();
		for (ConceptAttribute conceptAttribute : conceptAttributes) {
			if (conceptAttribute.getKey().equals(conceptAttrKey)) {
				return conceptAttribute;
			}
		}

		return null;
	}

	public boolean removeConceptAttribute(String key) {
		ConceptAttribute conceptAttribute = null;
		for (ConceptAttribute attribute : conceptAttributes) {
			if (attribute.getKey().equals(key)) {
				conceptAttribute = attribute;
				break;
			}
		}
		return conceptAttributes.remove(conceptAttribute);
	}

}
