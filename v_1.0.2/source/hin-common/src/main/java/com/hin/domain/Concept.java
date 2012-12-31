/**
 *
 */
package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * @author vineeth.ng
 * 
 */
public class Concept extends DataType implements Type {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String name;
	private String shortName;
	private String description;
	private String smallIcon;
	private String largeIcon;
	private List<ConceptClass> conceptClasses = new ArrayList<ConceptClass>(1);
	private ConceptDataType conceptDataType;
	private List<ConceptSynonym> synonyms = new ArrayList<ConceptSynonym>(1);
	private List<ConceptSource> sources = new ArrayList<ConceptSource>(1);
	private List<ConceptLocale> locales = new ArrayList<ConceptLocale>(1);
	private List<ConceptAttribute> conceptAttributes = new ArrayList<ConceptAttribute>();
	private DataType dataType;
	private String parentConcept;

	public Concept() {

	}

	public Concept(String name, ConceptDataType conceptDataType) {
		this.name = name;
		// this.conceptDataType = conceptDataType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<ConceptClass> getConceptClasses() {
		return conceptClasses;
	}

	public void setConceptClasses(List<ConceptClass> conceptClasses) {
		this.conceptClasses = conceptClasses;
	}

	public List<ConceptSynonym> getSynonyms() {
		return synonyms;
	}

	public void setSynonyms(List<ConceptSynonym> synonyms) {
		this.synonyms = synonyms;
	}

	public List<ConceptSource> getSources() {
		return sources;
	}

	public void setSources(List<ConceptSource> sources) {
		this.sources = sources;
	}

	public List<ConceptLocale> getLocales() {
		return locales;
	}

	public void setLocales(List<ConceptLocale> locales) {
		this.locales = locales;
	}

	public boolean addConceptClass(ConceptClass conceptClass) {
		return conceptClasses.add(conceptClass);
	}

	public boolean addSynonym(ConceptSynonym conceptSynonym) {
		return synonyms.add(conceptSynonym);
	}

	public boolean addConceptSource(ConceptSource conceptSource) {
		return sources.add(conceptSource);
	}

	public boolean addConceptLocale(ConceptLocale conceptLocale) {
		return locales.add(conceptLocale);
	}

	public boolean removeConceptClass(String id) {
		ConceptClass conceptClass3 = null;
		for (ConceptClass conceptClass2 : conceptClasses) {
			if (conceptClass2.getId().equals(id)) {
				conceptClass3 = conceptClass2;
				break;
			}
		}
		return conceptClasses.remove(conceptClass3);
	}

	public boolean removeSynonym(String id) {
		ConceptSynonym conceptSynonym1 = null;
		for (ConceptSynonym conceptSynonym2 : synonyms) {
			if (conceptSynonym2.getId().equals(id)) {
				conceptSynonym1 = conceptSynonym2;
				break;
			}
		}
		return synonyms.remove(conceptSynonym1);
	}

	public boolean removeConceptSource(String id) {
		ConceptSource conceptSource3 = null;
		for (ConceptSource conceptSource2 : sources) {
			if (conceptSource2.getId().equals(id)) {
				conceptSource3 = conceptSource2;
				break;
			}
		}
		return sources.remove(conceptSource3);
	}

	public boolean removeConceptLocale(String id) {
		ConceptLocale conceptLocale3 = null;
		for (ConceptLocale conceptLocale2 : locales) {
			if (conceptLocale2.getId().equals(id)) {
				conceptLocale3 = conceptLocale2;
				break;
			}
		}
		return locales.remove(conceptLocale3);
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

	/**
	 * @return the conceptDataType
	 */
	public ConceptDataType getConceptDataType() {
		return conceptDataType;
	}

	/**
	 * @param conceptDataType
	 *            the conceptDataType to set
	 */
	public void setConceptDataType(ConceptDataType conceptDataType) {
		this.conceptDataType = conceptDataType;
	}

	/**
	 * @return the dataType
	 */
	public DataType getDataType() {
		return dataType;
	}

	/**
	 * @param dataType
	 *            the dataType to set
	 */
	public void setDataType(DataType dataType) {
		this.dataType = dataType;
	}

	public String getParentConcept() {
		return parentConcept;
	}

	public void setParentConcept(String parentConcept) {
		this.parentConcept = parentConcept;
	}

	@Override
	public DataType getType() {
		return this.dataType;// conceptDataType.getType();
	}

	@Override
	public void handler() {
		System.out.println("Concept Handler");
	}

	public boolean addConceptAttribute(ConceptAttribute conceptAttribute) {
		return conceptAttributes.add(conceptAttribute);
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

	public String getSmallIcon() {
		return smallIcon;
	}

	public void setSmallIcon(String smallIcon) {
		this.smallIcon = smallIcon;
	}

	public String getLargeIcon() {
		return largeIcon;
	}

	public void setLargeIcon(String largeIcon) {
		this.largeIcon = largeIcon;
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
}
