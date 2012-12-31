/**
 * 
 */
package com.hin.web;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import com.hin.domain.ConceptAttribute;
import com.hin.service.IConceptAttributeService;
import com.hin.web.base.BaseBean;

/**
 * @author vinaykumar.gk
 * 
 */
@Component("conceptAttributeBean")
@Scope("session")
public class ConceptAttributeBean extends BaseBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private ConceptAttribute conceptAttribute = new ConceptAttribute();

	private List<ConceptAttribute> conceptAttributeList = new ArrayList<ConceptAttribute>();

	private String conceptAttributeId;
	private String selectedConceptAttribute = "";

	@Autowired
	private IConceptAttributeService conceptAttributeService;

	/**
	 * @return the conceptAttribute
	 */
	public ConceptAttribute getConceptAttribute() {
		return conceptAttribute;
	}

	/**
	 * @param conceptAttribute
	 *            the conceptAttribute to set
	 */
	public void setConceptAttribute(ConceptAttribute conceptAttribute) {
		this.conceptAttribute = conceptAttribute;
	}

	/**
	 * @return the conceptAttributeService
	 */
	public IConceptAttributeService getConceptAttributeService() {
		return conceptAttributeService;
	}

	/**
	 * @param conceptAttributeService
	 *            the conceptAttributeService to set
	 */
	public void setConceptAttributeService(
			IConceptAttributeService conceptAttributeService) {
		this.conceptAttributeService = conceptAttributeService;
	}

	/**
	 * @return the serialversionuid
	 */
	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public String saveConceptAttribute() {
		conceptAttributeService.saveConceptAttribute(conceptAttribute);
		return "conceptAttributeList";
	}

	public String addNewConceptAttribute() {
		conceptAttribute = new ConceptAttribute();
		return "addNewConceptAttribute";
	}

	/**
	 * @return the conceptAttributeList
	 */
	public List<ConceptAttribute> getConceptAttributeList() {
		if (selectedConceptAttribute == null) {
			conceptAttributeList = new ArrayList<ConceptAttribute>();
		} else if (conceptAttributeList.isEmpty()) {
			search();
		}
		return conceptAttributeList;
	}

	/**
	 * @param conceptAttributeList
	 *            the conceptAttributeList to set
	 */
	public void setConceptAttributeList(
			List<ConceptAttribute> conceptAttributeList) {
		this.conceptAttributeList = conceptAttributeList;
	}

	/**
	 * @return the conceptAttributeId
	 */
	public String getConceptAttributeId() {
		return conceptAttributeId;
	}

	/**
	 * @param conceptAttributeId
	 *            the conceptAttributeId to set
	 */
	public void setConceptAttributeId(String conceptAttributeId) {
		this.conceptAttributeId = conceptAttributeId;
	}

	public String editConceptAttribute() {
		conceptAttribute = conceptAttributeService.findById(conceptAttributeId,
				ConceptAttribute.class);
		return "addNewConceptAttribute";
	}

	public String navigateToConceptAttribute() {
		return "conceptAttributeList";
	}

	public List<ConceptAttribute> conceptAttributeAutoCompleteList(
			String searchKey) {
		List<ConceptAttribute> list = new ArrayList<ConceptAttribute>();
		list.addAll(conceptAttributeService.findAllByProperty("key", "^"
				+ searchKey, ConceptAttribute.class));
		return list;
	}

	public void getConceptAttributeForAutoComplete() {
		if (!selectedConceptAttribute.isEmpty()) {
			conceptAttributeList = conceptAttributeService.findAllByProperty(
					"key", "^" + selectedConceptAttribute,
					ConceptAttribute.class);
			if (conceptAttributeList.isEmpty()) {
				selectedConceptAttribute = null;
			}
		} else {
			conceptAttributeList = conceptAttributeService
					.findAll(ConceptAttribute.class);
		}
	}

	public void search() {
		conceptAttributeList.clear();
		conceptAttributeList = conceptAttributeService
				.findAll(ConceptAttribute.class);
	}

	/**
	 * @return the selectedConceptAttribute
	 */
	public String getSelectedConceptAttribute() {
		return selectedConceptAttribute;
	}

	/**
	 * @param selectedConceptAttribute
	 *            the selectedConceptAttribute to set
	 */
	public void setSelectedConceptAttribute(String selectedConceptAttribute) {
		this.selectedConceptAttribute = selectedConceptAttribute;
	}
}
