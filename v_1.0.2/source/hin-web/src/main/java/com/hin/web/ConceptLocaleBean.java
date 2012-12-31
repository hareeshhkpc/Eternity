/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.domain.ConceptLocale;
import com.hin.service.IConceptLocaleService;
import com.hin.web.base.BaseBean;

/**
 * @author thanveer.aqthar
 * 
 */
@Component("conceptLocaleBean")
@Scope("session")
public class ConceptLocaleBean extends BaseBean {

	Boolean localeExist = false;
	private static final long serialVersionUID = 1L;

	@Autowired
	private IConceptLocaleService conceptLocaleService;

	private ConceptLocale conceptLocale = new ConceptLocale();

	private List<ConceptLocale> conceptLocaleList = new ArrayList<ConceptLocale>();

	private String conceptLocaleId;

	public String saveLocale() {
		try {
			/*
			 * if (conceptLocale.getName().isEmpty()) {
			 * errorMessage("Field Cannot Be Empty"); }
			 */
			/* checkLocaleExists(); */
			/* if (!localeExist) { */
			if (conceptLocale.getName().isEmpty()) {
				errorMessage("Field Cannot Be Empty");
			} else {
				conceptLocale
						.setCode(conceptLocale.getCode().toString().trim());
				conceptLocale
						.setName(conceptLocale.getName().toString().trim());
				conceptLocale.setDescription(conceptLocale.getDescription()
						.toString().trim());
				conceptLocaleService.save(conceptLocale);
				return "conceptLocaleListView";
			}
			/*
			 * } else { errorMessage("" + conceptLocale.getName() +
			 * " Already Exists!"); }
			 */

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}

	/**
	 * @return the conceptLocaleId
	 */
	public String getConceptLocaleId() {
		return conceptLocaleId;
	}

	/**
	 * @param conceptLocaleId
	 *            the conceptLocaleId to set
	 */
	public void setConceptLocaleId(String conceptLocaleId) {
		this.conceptLocaleId = conceptLocaleId;
	}

	/*
	 * public void checkLocaleExists() { getConceptLocaleList(); String orgName
	 * = conceptLocale.getName(); for (ConceptLocale locale : conceptLocaleList)
	 * { String name = locale.getName(); if (orgName.equalsIgnoreCase(name)) {
	 * localeExist = true; } } }
	 */

	/**
	 * @return the conceptLocale
	 */
	public ConceptLocale getConceptLocale() {
		return conceptLocale;
	}

	/**
	 * @param conceptLocale
	 *            the conceptLocale to set
	 */
	public void setConceptLocale(ConceptLocale conceptLocale) {
		this.conceptLocale = conceptLocale;
	}

	/**
	 * @return the conceptLocaleList
	 */
	public List<ConceptLocale> getConceptLocaleList() {
		conceptLocaleList = conceptLocaleService.findAllConceptLocale();
		return conceptLocaleList;
	}

	/**
	 * @param conceptLocaleList
	 *            the conceptLocaleList to set
	 */
	public void setConceptLocaleList(List<ConceptLocale> conceptLocaleList) {
		this.conceptLocaleList = conceptLocaleList;
	}

	public String addLocale() {
		conceptLocale = new ConceptLocale();
		return "addLocale";
	}

	public String navigateTo() {
		return "conceptLocaleListView";
	}

	public void search() {
		conceptLocaleList.clear();
		conceptLocaleList.addAll(conceptLocaleService.getConcepts());
	}

	public String editLocale() {
		conceptLocale = conceptLocaleService.findById(conceptLocaleId,
				ConceptLocale.class);
		return "addLocale";
	}

	public void removeLocale() {
		conceptLocale = conceptLocaleService.findById(conceptLocaleId,
				ConceptLocale.class);
		conceptLocaleService.delete(conceptLocale);
		search();
	}
}
