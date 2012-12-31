/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.domain.ConceptSource;
import com.hin.service.IConceptSourceService;
import com.hin.web.base.BaseBean;

/**
 * @author ranga.reddy
 * 
 */
@Component("conceptSourceBean")
@Scope("session")
public class ConceptSourceBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Transient
	@Autowired
	private IConceptSourceService conceptSourceService;

	private String conceptSourceId;
	private String selectedConceptSource="";

	private ConceptSource conceptSource = new ConceptSource();
	private List<ConceptSource> sources = new ArrayList<ConceptSource>();

	public String saveConcept() {
		try {
			conceptSource.setName(conceptSource.getName().toString().trim());
			conceptSource.setDescription(conceptSource.getDescription().toString().trim());
			conceptSourceService.save(conceptSource);
			search();
		} catch (Exception e) {			
			e.printStackTrace();
		}
		return "viewconceptsource";
	}

	public ConceptSource getConceptSource() {
		return conceptSource;
	}

	public void setConceptSource(ConceptSource conceptSource) {
		this.conceptSource = conceptSource;
	}

	public void reset() {
		conceptSource.setName("");
		conceptSource.setDescription("");
	}

	public void removeConceptSource() {
		ConceptSource conceptSource = conceptSourceService
				.findByConceptSourceId(conceptSourceId);
		conceptSourceService.delete(conceptSource);
		search();
	}

	public String addConceptSource() {
		conceptSource = new ConceptSource();
		return "addconceptsource";
	}

	public String viewConceptSource() {
		conceptSource = conceptSourceService
				.findByConceptSourceId(conceptSourceId);
		return "addconceptsource";
	}

	public String getConceptSourceId() {
		return conceptSourceId;
	}

	public void setConceptSourceId(String conceptSourceId) {
		this.conceptSourceId = conceptSourceId;
	}

	/**
	 * @return the sources
	 */
	public List<ConceptSource> getSources() {
		if (selectedConceptSource == null) {
			sources = new ArrayList<ConceptSource>();
		} else if (sources.isEmpty()) {
			search();
		}
		return sources;
	}

	/**
	 * @param sources
	 *            the sources to set
	 */
	public void setSources(List<ConceptSource> sources) {
		this.sources = sources;
	}

	private void search() {
		sources.clear();
		sources.addAll(conceptSourceService.getConceptSources());

	}

	/**
	 * @return the conceptSourceService
	 */
	public IConceptSourceService getConceptSourceService() {
		return conceptSourceService;
	}

	/**
	 * @param conceptSourceService the conceptSourceService to set
	 */
	public void setConceptSourceService(IConceptSourceService conceptSourceService) {
		this.conceptSourceService = conceptSourceService;
	}

	/**
	 * @return the selectedConceptSource
	 */
	public String getSelectedConceptSource() {
		return selectedConceptSource;
	}

	/**
	 * @param selectedConceptSource the selectedConceptSource to set
	 */
	public void setSelectedConceptSource(String selectedConceptSource) {
		this.selectedConceptSource = selectedConceptSource;
	}

	/**
	 * @return the selectedconceptSource
	 */
	
	public void selectedConceptSource() {
		if (!selectedConceptSource.isEmpty()) {
			sources = conceptSourceService.findAllByProperty("name",
					"^" + selectedConceptSource, ConceptSource.class);
			if (sources.isEmpty()) {
				selectedConceptSource = null;
			}
		} else {
			sources = conceptSourceService.getConceptSources();
		}
	}

	public List<ConceptSource> conceptSourceList(String searchKey) {
		List<ConceptSource> list = new ArrayList<ConceptSource>();
		list.addAll(conceptSourceService.findAllByProperty("name",
				"^" + searchKey, ConceptSource.class));
		return list;
	}
}
