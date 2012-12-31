/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.domain.ConceptSynonym;
import com.hin.service.IBaseService;
import com.hin.service.IConceptSynonymService;
import com.hin.web.base.BaseBean;

/**
 * @author Sunanda.hangoraki
 * 
 */
@Component("conceptSynonymBean")
@Scope("session")
public class ConceptSynonymBean extends BaseBean {

	private static final long serialVersionUID = 1L;

	private String conceptSynonymId;

	@Autowired
	private IConceptSynonymService conceptSynonymService;

	@Autowired
	private IBaseService<ConceptSynonym> baseService;

	private ConceptSynonym conceptSynonym = new ConceptSynonym();

	private List<ConceptSynonym> synonyms = new ArrayList<ConceptSynonym>();

	/**
	 * @return the synonyms
	 */
	public List<ConceptSynonym> getSynonyms() {
		search();
		return synonyms;
	}

	/**
	 * @param synonyms
	 *            : the synonyms to set
	 */
	public void setSynonyms(List<ConceptSynonym> synonyms) {
		this.synonyms = synonyms;
	}

	/**
	 * @return the conceptSynonymId
	 */
	public String getConceptSynonymId() {
		return conceptSynonymId;
	}

	/**
	 * @param conceptSynonymId
	 *            : the conceptSynonymId to set
	 */
	public void setConceptSynonymId(String conceptSynonymId) {
		this.conceptSynonymId = conceptSynonymId;
	}

	/**
	 * @return the conceptSynonym
	 */
	public ConceptSynonym getConceptSynonym() {
		return conceptSynonym;
	}

	/**
	 * @param conceptSynonym
	 *            : the conceptSynonym to set
	 */
	public void setConceptSynonym(ConceptSynonym conceptSynonym) {
		this.conceptSynonym = conceptSynonym;
	}

	public String saveSynonym() {
		try {
			conceptSynonym.setName(conceptSynonym.getName().toString().trim());
			conceptSynonymService.save(conceptSynonym);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "conceptSynonyms";
	}

	public String addConceptSynonym() {
		conceptSynonym = new ConceptSynonym();
		return "addConceptSynonym";
	}

	public String viewConceptSynonym() {
		conceptSynonym = conceptSynonymService.findById(conceptSynonymId,
				ConceptSynonym.class);
		return "addConceptSynonym";
	}

	public void search() {
		synonyms.clear();
		/*
		 * if (searchCriteria.getValue() != null &&((String)
		 * searchCriteria.getValue()).length() > 0) {
		 * searchCriteria.setProperty("name");
		 * concepts.addAll(conceptService.findAllByProperty(
		 * searchCriteria.getProperty(), searchCriteria.getValue(),
		 * Concept.class)); } else {
		 */
		try {
			synonyms.addAll(baseService.findAll(ConceptSynonym.class));
			/*
			 * for (ConceptSynonym conceptSynonym :
			 * baseService.findAll(ConceptSynonym.class)) {
			 * if(conceptSynonym.getStatus() == Status.ACTIVE) {
			 * synonyms.add(conceptSynonym); } }
			 */
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/* } */
	}

	public void deleteConceptSynonym() {
		conceptSynonym = conceptSynonymService.findById(conceptSynonymId,
				ConceptSynonym.class);
		conceptSynonymService.delete(conceptSynonym);
		search();
	}

}
