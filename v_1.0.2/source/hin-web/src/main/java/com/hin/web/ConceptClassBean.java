package com.hin.web;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.faces.model.SelectItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.domain.Concept;
import com.hin.domain.ConceptAttribute;
import com.hin.domain.ConceptClass;
import com.hin.domain.core.BaseDomain;
import com.hin.service.IBaseService;
import com.hin.service.IConceptAttributeService;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptService;
import com.hin.web.base.BaseBean;

@Component("conceptClassBean")
@Scope("session")
public class ConceptClassBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private ConceptClass conceptClass = new ConceptClass();
	private List<ConceptClass> conceptClassList = new ArrayList<ConceptClass>();
	private List<SelectItem> conceptClassStaus = new ArrayList<SelectItem>();
	private List<Concept> conceptList = new ArrayList<Concept>();
	private String selectedConceptClass = "";
	private String conceptClassId;
	private Boolean show = false;
	private String conceptAttributeId;
	private Boolean conceptAttributeShow = false;
	private Boolean updateConceptAttributeShow = false;
	private String conceptAttrKey;

	@Autowired
	private IConceptClassService conceptClassService;

	@Autowired
	private IConceptService conceptService;

	@Autowired
	IBaseService<BaseDomain> baseService;

	@Transient
	@Autowired
	private IConceptAttributeService conceptAttributeService;

	private ConceptAttribute conceptAttribute = new ConceptAttribute();

	public ConceptClass getConceptClass() {
		return conceptClass;
	}

	public void setConceptClass(ConceptClass conceptClass) {
		this.conceptClass = conceptClass;
	}

	/*
	 * public ConceptClass getConcept() { return concept; } public void
	 * setConcept(ConceptClass concept) { this.concept = concept; }
	 */
	public List<ConceptClass> getConceptClassList() throws Exception {
		// conceptClassList = conceptClassService.findAllConceptClass();
		if (selectedConceptClass == null) {
			conceptClassList = new ArrayList<ConceptClass>();
		} else if (conceptClassList.isEmpty()) {
			search();
		}
		return conceptClassList;
	}

	public void setConceptClassList(List<ConceptClass> conceptClassList) {
		this.conceptClassList = conceptClassList;
	}

	public String getConceptClassId() {
		return conceptClassId;
	}

	public void setConceptClassId(String conceptClassId) {
		this.conceptClassId = conceptClassId;
	}

	public String saveConceptClass() {
		try {
			try {
				String conceptAttributeKey = conceptAttribute.getKey();
				if (conceptAttributeKey != null) {
					conceptAttribute.setKey(conceptAttributeKey.trim());
					String conceptAttributeValue = conceptAttribute.getValue();
					if (conceptAttributeValue != null)
						conceptAttribute.setValue(conceptAttributeValue.trim());
				}
				conceptClass.setName(conceptClass.getName().toString().trim());
				conceptClass.setDescription(conceptClass.getDescription()
						.toString().trim());
			} catch (NullPointerException ne) {
				ne.printStackTrace();
			}
			conceptClassService.save(conceptClass);
			loadConceptClass();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "conceptClasses";
	}

	public String loadConceptClass() {
		conceptClassList.clear();
		conceptClassList.addAll(conceptClassService.getConcepts());
		return "conceptClass";
	}

	public String addConceptClass() {
		show = false;
		conceptClass = new ConceptClass();
		return "addconceptclass";
	}

	public String viewConceptClass() {
		show = true;
		loadConceptClassList();
		return "conceptClass";
	}

	public String moveto() {
		return "conceptClasses";
	}

	public void search() {
		conceptClassList.clear();

		/*
		 * if (searchCriteria.getValue() != null &&((String)
		 * searchCriteria.getValue()).length() > 0) {
		 * searchCriteria.setProperty("name");
		 * concepts.addAll(conceptService.findAllByProperty(
		 * searchCriteria.getProperty(), searchCriteria.getValue(),
		 * Concept.class)); } else {
		 */

		List<ConceptClass> con = new ArrayList<ConceptClass>();
		con = conceptClassService.getConcepts();

		for (ConceptClass con1 : con) {
			if (con1.getStatus().toString().equals("ACTIVE")) {
				conceptClassList.add(con1);
			}
		}

		// conceptClassList.addAll(conceptClassService.getConcepts());
	}

	public List<SelectItem> getConceptClassStaus() {
		return conceptClassStaus;
	}

	public void setConceptClassStaus(List<SelectItem> conceptClassStaus) {
		this.conceptClassStaus = conceptClassStaus;
	}

	/**
	 * @return the conceptClassService
	 */
	public IConceptClassService getConceptClassService() {
		return conceptClassService;
	}

	/**
	 * @param conceptClassService
	 *            the conceptClassService to set
	 */
	public void setConceptClassService(IConceptClassService conceptClassService) {
		this.conceptClassService = conceptClassService;
	}

	/**
	 * @return the conceptService
	 */
	public IConceptService getConceptService() {
		return conceptService;
	}

	/**
	 * @param conceptService
	 *            the conceptService to set
	 */
	public void setConceptService(IConceptService conceptService) {
		this.conceptService = conceptService;
	}

	/**
	 * @return the conceptList
	 */
	public List<Concept> getConceptList() {
		return conceptList;
	}

	/**
	 * @return the selectedConceptClass
	 */
	public String getSelectedConceptClass() {
		return selectedConceptClass;
	}

	/**
	 * @param selectedConceptClass
	 *            the selectedConceptClass to set
	 */
	public void setSelectedConceptClass(String selectedConceptClass) {
		this.selectedConceptClass = selectedConceptClass;
	}

	/**
	 * @param conceptList
	 *            the conceptList to set
	 */
	public void setConceptList(List<Concept> conceptList) {
		this.conceptList = conceptList;
	}

	public List<ConceptClass> conceptClassAutoCompleteList(String searchKey) {
		List<ConceptClass> list = new ArrayList<ConceptClass>();
		list.addAll(conceptClassService.findAllByProperty("name", "^"
				+ searchKey, ConceptClass.class));
		return list;
	}

	public void getConceptClassForAutoComplete() {
		if (!selectedConceptClass.isEmpty()) {
			conceptClassList = conceptClassService.findAllByProperty("name",
					"^" + selectedConceptClass, ConceptClass.class);
			if (conceptClassList.isEmpty()) {
				selectedConceptClass = null;
			}
		} else {
			conceptClassList = conceptClassService.findAll(ConceptClass.class);
		}

	}

	public String editConceptClass() {
		show = false;
		loadConceptClassList();
		return "conceptClass";
	}

	public void loadConceptClassList() {
		conceptList.clear();
		conceptClass = conceptClassService.findById(conceptClassId,
				ConceptClass.class);
		List<Concept> concepts = conceptService.findAll(Concept.class);
		Iterator<Concept> iterator = concepts.iterator();
		while (iterator.hasNext()) {
			Concept concept = iterator.next();
			List<ConceptClass> attribute = concept.getConceptClasses();
			Iterator<ConceptClass> conceptClassiterator = attribute.iterator();
			while (conceptClassiterator.hasNext()) {
				ConceptClass conceptClass1 = conceptClassiterator.next();
				if (conceptClass1.getName().equals(conceptClass.getName())) {
					conceptList.add(concept);
				}
			}
		}
	}

	/*
	 * public void changeStaus(AjaxBehaviorEvent event){
	 * 
	 * 
	 * 
	 * switch (concept.getConceptDataType()) { case NUMERICRANGE:
	 * concept.setDataType(concept.getConceptDataType().getType()); case TEXT:
	 * concept.setDataType(concept.getConceptDataType().getType()); } }
	 */

	/**
	 * @return the show
	 */
	public Boolean getShow() {
		return show;
	}

	/**
	 * @param show
	 *            the show to set
	 */
	public void setShow(Boolean show) {
		this.show = show;
	}

	public void deleteConceptClass() {
		conceptClass = conceptClassService.findById(conceptClassId,
				ConceptClass.class);
		conceptClassService.delete(conceptClass);
		loadConceptClass();
	}

	public void addConceptAttribute() {
		if (conceptAttribute.getId() != null
				&& conceptAttribute.getId().length() > 0) {

		} else {
			int id = conceptClass.getConceptAttributes().size() + 1;
			conceptAttribute.setId(conceptClass.getId() + "_"
					+ conceptAttribute.getKey() + "_" + +id);
			conceptClass.addConceptAttribute(conceptAttribute);
		}

		conceptAttributeShow = false;
		updateConceptAttributeShow = false;

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

	/**
	 * @return the conceptAttributeShow
	 */
	public Boolean getConceptAttributeShow() {
		return conceptAttributeShow;
	}

	/**
	 * @param conceptAttributeShow
	 *            the conceptAttributeShow to set
	 */
	public void setConceptAttributeShow(Boolean conceptAttributeShow) {
		this.conceptAttributeShow = conceptAttributeShow;
	}

	/**
	 * @return the updateConceptAttributeShow
	 */
	public Boolean getUpdateConceptAttributeShow() {
		return updateConceptAttributeShow;
	}

	/**
	 * @param updateConceptAttributeShow
	 *            the updateConceptAttributeShow to set
	 */
	public void setUpdateConceptAttributeShow(Boolean updateConceptAttributeShow) {
		this.updateConceptAttributeShow = updateConceptAttributeShow;
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

	public void removeConceptAttribute() {
		conceptClass.removeConceptAttribute(conceptAttributeId);
	}

	public void viewConceptAttribute() {
		conceptAttribute = conceptClass.getConceptAttrByKey(conceptAttrKey);
		updateConceptAttributeShow = true;
	}

	/**
	 * @return the conceptAttrKey
	 */
	public String getConceptAttrKey() {
		return conceptAttrKey;
	}

	/**
	 * @param conceptAttrKey
	 *            the conceptAttrKey to set
	 */
	public void setConceptAttrKey(String conceptAttrKey) {
		this.conceptAttrKey = conceptAttrKey;
	}

	public void setConceptAttributeShow() {
		if (conceptAttributeShow) {
			conceptAttributeShow = false;
		} else {
			conceptAttributeShow = true;
		}
		conceptAttribute = new ConceptAttribute();
	}

}
