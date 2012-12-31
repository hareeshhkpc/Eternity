package com.hin.web;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.faces.event.AjaxBehaviorEvent;
import javax.faces.model.SelectItem;

import org.apache.log4j.Logger;
import org.richfaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.domain.Concept;
import com.hin.domain.ConceptAttribute;
import com.hin.domain.ConceptClass;
import com.hin.domain.ConceptDataType;
import com.hin.domain.ConceptLocale;
import com.hin.domain.ConceptSource;
import com.hin.domain.ConceptSynonym;
import com.hin.domain.NumericRange;
import com.hin.domain.Unit;
import com.hin.domain.utils.SearchCriteria;
import com.hin.hl7messaging.utils.BinaryUtils;
import com.hin.service.IConceptAttributeService;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptLocaleService;
import com.hin.service.IConceptService;
import com.hin.service.IConceptSourceService;
import com.hin.service.IConceptSynonymService;
import com.hin.service.IUnitService;
import com.hin.web.base.BaseBean;

/**
 * @author sreekumar.s
 * 
 */

@Component("conceptBean")
@Scope("session")
public class ConceptBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Logger logger = Logger.getLogger(ConceptBean.class.getName());

	@Transient
	@Autowired
	private IConceptService conceptService;

	@Transient
	@Autowired
	private IConceptClassService conceptClassService;

	@Transient
	@Autowired
	private IConceptSourceService conceptSourceService;

	@Transient
	@Autowired
	private IConceptLocaleService conceptLocaleService;

	@Transient
	@Autowired
	private IConceptSynonymService conceptSynonymService;

	@Transient
	@Autowired
	private IUnitService unitService;

	@Transient
	@Autowired
	private IConceptAttributeService conceptAttributeService;

	private Boolean flag1 = true, flag2 = true;
	private String conceptId;
	private String conceptSourceId;
	private String conceptLocaleId;
	private Concept concept = new Concept();
	private List<Concept> concepts = new ArrayList<Concept>();

	private List<SelectItem> conceptTypeList = new ArrayList<SelectItem>();

	private List<SelectItem> conceptClassList = new ArrayList<SelectItem>();

	private List<SelectItem> conceptSynonymss = new ArrayList<SelectItem>();

	private List<SelectItem> sourcesList = new ArrayList<SelectItem>();

	private List<SelectItem> localesList = new ArrayList<SelectItem>();

	private SearchCriteria searchCriteria = new SearchCriteria();

	private List<SelectItem> unitList = new ArrayList<SelectItem>();

	private ConceptAttribute conceptAttribute = new ConceptAttribute();

	private List<SelectItem> conceptNames = new ArrayList<SelectItem>();

	private List<Concept> parentConcepts = new ArrayList<Concept>();

	private String conceptClassId;
	private String conceptSynonymId;

	private String unitId;

	private String conceptAttributeId;

	private String conceptAttrKey;

	private String selectedConcept = "";
	private Boolean conceptAttributeShow = false;
	private Boolean updateConceptAttributeShow = false;

	public List<SelectItem> getConceptTypeList() {

		if (conceptTypeList.isEmpty()) {
			ConceptDataType[] types = ConceptDataType.values();
			SelectItem options = new SelectItem();
			for (ConceptDataType type : types) {
				options = new SelectItem(type.getName(), type.getValue());
				conceptTypeList.add(options);
				Collections.sort(conceptTypeList, comparator);
			}
		}
		return conceptTypeList;
	}

	public String loadConcepts() {
		concepts.clear();
		concepts.addAll(conceptService.getConcepts());
		return "concepts";
	}

	public String addConcept() {
		concept = new Concept();
		return "addconcept";
	}

	public String viewConcept() {
		concept = conceptService.findById(conceptId, Concept.class);
		return "viewconcept";
	}

	public String saveConcept() {
		try {
			String conceptAttributeKey = conceptAttribute.getKey();
			if (conceptAttributeKey != null) {
				conceptAttribute.setKey(conceptAttributeKey.trim());
				String conceptAttributeValue = conceptAttribute.getValue();
				if (conceptAttributeValue != null)
					conceptAttribute.setValue(conceptAttributeValue.trim());
			}
			concept.setName(concept.getName().toString().trim());
			concept.setDescription(concept.getDescription().toString().trim());
			concept.setShortName(concept.getShortName().toString().trim());
			conceptService.save(concept);
			search();
			return "concepts";
		} catch (Exception e) {
			e.printStackTrace();
			return "viewconcept";
		}
	}

	public void deleteConceptClass() {
		concept.removeConceptClass(conceptClassId);
	}

	public void deleteSynonym() {
		concept.removeSynonym(conceptSynonymId);
	}

	public void addConceptClass() {
		concept.addConceptClass(conceptClassService.findById(conceptClassId,
				ConceptClass.class));
	}

	public void addSynonym() {
		concept.addSynonym(conceptSynonymService.findById(conceptSynonymId,
				ConceptSynonym.class));
	}

	public void addConceptSource() {
		concept.addConceptSource(conceptSourceService.findById(conceptSourceId,
				ConceptSource.class));
	}

	public void removeConceptAttribute() {
		concept.removeConceptAttribute(conceptAttributeId);
	}

	public void viewConceptAttribute() {
		conceptAttribute = concept.getConceptAttrByKey(conceptAttrKey);
		updateConceptAttributeShow = true;
	}

	public void deleteConceptSource() {
		concept.removeConceptSource(conceptSourceId);
	}

	public String addConceptSynonym() {
		// concept = new Concept();
		return "conceptSynonyms";
	}

	public String getConceptLocaleId() {
		return conceptLocaleId;
	}

	public void setConceptLocaleId(String conceptLocaleId) {
		this.conceptLocaleId = conceptLocaleId;
	}

	public void addConceptLocale() {
		concept.addConceptLocale(conceptLocaleService.findById(conceptLocaleId,
				ConceptLocale.class));
	}

	public void addConceptAttribute() {
		if (conceptAttribute.getId() != null
				&& conceptAttribute.getId().length() > 0) {

		} else {
			int id = concept.getConceptAttributes().size() + 1;
			conceptAttribute.setId(concept.getId() + "_"
					+ conceptAttribute.getKey() + "_" + +id);
			concept.addConceptAttribute(conceptAttribute);
		}

		conceptAttributeShow = false;
		updateConceptAttributeShow = false;

	}

	public void deleteConceptLocale() {
		concept.removeConceptLocale(conceptLocaleId);
	}

	/**
	 * @return the concepts
	 */
	public List<Concept> getConcepts() {
		if (selectedConcept == null) {
			concepts = new ArrayList<Concept>();
		} else if (concepts.isEmpty()) {
			search();
		}
		return concepts;
	}

	/**
	 * @param concepts
	 *            the concepts to set
	 */
	public void setConcepts(List<Concept> concepts) {
		this.concepts = concepts;
	}

	/**
	 * @return the concept
	 */
	public Concept getConcept() {
		return concept;
	}

	/**
	 * @param concept
	 *            the concept to set
	 */
	public void setConcept(Concept concept) {
		this.concept = concept;
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

	/**
	 * @return the conceptId
	 */
	public String getConceptId() {
		return conceptId;
	}

	/**
	 * @param conceptId
	 *            the conceptId to set
	 */
	public void setConceptId(String conceptId) {
		this.conceptId = conceptId;
	}

	public void changeDataType(AjaxBehaviorEvent event) {
		System.out.println("ConceptDataType : " + concept.getConceptDataType());

		switch (concept.getConceptDataType()) {
		case NUMERICRANGE:
			concept.setDataType(concept.getConceptDataType().getType());
		case TEXT:
			concept.setDataType(concept.getConceptDataType().getType());
		}

	}

	/**
	 * @return the searchCriteria
	 */
	public SearchCriteria getSearchCriteria() {
		return searchCriteria;
	}

	/**
	 * @param searchCriteria
	 *            the searchCriteria to set
	 */
	public void setSearchCriteria(SearchCriteria searchCriteria) {
		this.searchCriteria = searchCriteria;
	}

	public void search() {
		concepts.clear();
		concepts.addAll(conceptService.getConcepts());
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
	 * @return the conceptSourceService
	 */
	public IConceptSourceService getConceptSourceService() {
		return conceptSourceService;
	}

	/**
	 * @param conceptSourceService
	 *            the conceptSourceService to set
	 */
	public void setConceptSourceService(
			IConceptSourceService conceptSourceService) {
		this.conceptSourceService = conceptSourceService;
	}

	/**
	 * @return the conceptLocaleService
	 */
	public IConceptLocaleService getConceptLocaleService() {
		return conceptLocaleService;
	}

	/**
	 * @param conceptLocaleService
	 *            the conceptLocaleService to set
	 */
	public void setConceptLocaleService(
			IConceptLocaleService conceptLocaleService) {
		this.conceptLocaleService = conceptLocaleService;
	}

	/**
	 * @return the conceptSynonymService
	 */
	public IConceptSynonymService getConceptSynonymService() {
		return conceptSynonymService;
	}

	/**
	 * @param conceptSynonymService
	 *            the conceptSynonymService to set
	 */
	public void setConceptSynonymService(
			IConceptSynonymService conceptSynonymService) {
		this.conceptSynonymService = conceptSynonymService;
	}

	/**
	 * @return the conceptClassList
	 */
	public List<SelectItem> getConceptClassList() {
		try {
			conceptClassList.clear();
			List<ConceptClass> list = conceptClassService.findAllConceptClass();
			for (ConceptClass conceptClass : list) {
				SelectItem selectItem = new SelectItem(conceptClass.getId(),
						conceptClass.getName());
				conceptClassList.add(selectItem);
				Collections.sort(conceptClassList, comparator);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conceptClassList;
	}

	/**
	 * @param conceptClassList
	 *            the conceptClassList to set
	 */
	public void setConceptClassList(List<SelectItem> conceptClassList) {
		this.conceptClassList = conceptClassList;
	}

	/**
	 * @return the conceptSynonymss
	 * 
	 */
	public List<SelectItem> getConceptSynonymss() {
		try {
			conceptSynonymss.clear();
			List<ConceptSynonym> list = conceptSynonymService
					.findAll(ConceptSynonym.class);
			for (ConceptSynonym conceptSynonym : list) {
				SelectItem selectItem = new SelectItem(conceptSynonym.getId(),
						conceptSynonym.getName());
				conceptSynonymss.add(selectItem);
				Collections.sort(conceptSynonymss, comparator);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return conceptSynonymss;
	}

	/**
	 * @param synonymsList
	 *            the synonymsList to set
	 */
	public void setConceptSynonymss(List<SelectItem> conceptSynonymss) {
		this.conceptSynonymss = conceptSynonymss;
	}

	/**
	 * @return the sourcesList
	 */
	public List<SelectItem> getSourcesList() {

		try {
			sourcesList.clear();
			List<ConceptSource> list = conceptSourceService.getConceptSources();
			for (ConceptSource conceptSource : list) {
				SelectItem selectItem = new SelectItem(conceptSource.getId(),
						conceptSource.getName());
				sourcesList.add(selectItem);
				Collections.sort(sourcesList, comparator);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return sourcesList;
	}

	/**
	 * @param sourcesList
	 *            the sourcesList to set
	 */
	public void setSourcesList(List<SelectItem> sourcesList) {
		this.sourcesList = sourcesList;
	}

	/**
	 * @return the localesList
	 */
	public List<SelectItem> getLocalesList() {

		try {
			if (localesList.isEmpty()) {
				List<ConceptLocale> list = conceptLocaleService
						.findAllConceptLocale();
				for (ConceptLocale conceptLocale : list) {
					SelectItem selectItem = new SelectItem(
							conceptLocale.getId(), conceptLocale.getName());
					localesList.add(selectItem);
					Collections.sort(localesList, comparator);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return localesList;
	}

	/**
	 * @param localesList
	 *            the localesList to set
	 */
	public void setLocalesList(List<SelectItem> localesList) {
		this.localesList = localesList;
	}

	/**
	 * @param conceptTypeList
	 *            the conceptTypeList to set
	 */
	public void setConceptTypeList(List<SelectItem> conceptTypeList) {
		this.conceptTypeList = conceptTypeList;
	}

	/**
	 * @return the conceptClassId
	 */
	public String getConceptClassId() {
		return conceptClassId;
	}

	/**
	 * @param conceptClassId
	 *            the conceptClassId to set
	 */
	public void setConceptClassId(String conceptClassId) {
		this.conceptClassId = conceptClassId;
	}

	/**
	 * @return the conceptSynonymId
	 */
	public String getConceptSynonymId() {
		return conceptSynonymId;
	}

	/**
	 * @param conceptSynonymId
	 *            the conceptSynonymId to set
	 */
	public void setConceptSynonymId(String conceptSynonymId) {
		this.conceptSynonymId = conceptSynonymId;
	}

	/**
	 * 
	 * @return the unitService
	 */
	public IUnitService getUnitService() {
		return unitService;
	}

	/**
	 * @param unitService
	 *            the unitService to set
	 */
	public void setUnitService(IUnitService unitService) {
		this.unitService = unitService;
	}

	/**
	 * @return the unitList
	 */
	public List<SelectItem> getUnitList() {
		try {
			if (unitList.isEmpty()) {
				List<Unit> list = unitService.findAllUnit();

				for (Unit unit : list) {
					SelectItem selectItem = new SelectItem(unit.getId(),
							unit.getAbbreviation());
					unitList.add(selectItem);
					Collections.sort(unitList, comparator);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return unitList;
	}

	/**
	 * @param unitList
	 *            the unitList to set
	 */
	public void setUnitList(List<SelectItem> unitList) {
		this.unitList = unitList;
	}

	/**
	 * @return the unitId
	 */
	public String getUnitId() {
		return unitId;
	}

	/**
	 * @param unitId
	 *            the unitId to set
	 */
	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public void unitChange(AjaxBehaviorEvent event) {
		if (concept.getDataType() instanceof NumericRange) {
			try {
				((NumericRange) concept.getDataType()).setUnit(unitService
						.findById(unitId, Unit.class));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public String getConceptSourceId() {
		return conceptSourceId;
	}

	public void setConceptSourceId(String conceptSourceId) {
		this.conceptSourceId = conceptSourceId;
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

	public List<Concept> conceptsList(String searchKey) {
		List<Concept> list = new ArrayList<Concept>();
		list.addAll(conceptService.findAllByProperty("name", "^" + searchKey,
				Concept.class));
		return list;
	}

	/**
	 * @return the selectedConcept
	 */
	public String getSelectedConcept() {
		return selectedConcept;
	}

	/**
	 * @param selectedConcept
	 *            the selectedConcept to set
	 */
	public void setSelectedConcept(String selectedConcept) {
		this.selectedConcept = selectedConcept;
	}

	public void selectedConcept() {
		if (!selectedConcept.isEmpty()) {
			concepts = conceptService.findAllByProperty("name", "^"
					+ selectedConcept, Concept.class);
			if (concepts.isEmpty()) {
				selectedConcept = null;
			}
		} else {
			concepts = conceptService.getConcepts();
		}
	}

	public void fileUploaded(FileUploadEvent event) {
		String decodedImage = new String();
		try {
			InputStream inputStreamImage = event.getUploadedFile()
					.getInputStream();
			int imageIntSize = (int) event.getUploadedFile().getSize();
			decodedImage = (String) BinaryUtils.convertInputStreamToBase64(
					inputStreamImage, imageIntSize);
		} catch (Exception e) {
			logger.error("Error: ", e);
		}
		concept.setSmallIcon(decodedImage);
		this.setFlag1(false);
	}

	public void fileUploaded2(FileUploadEvent event) {
		String decodedImage = new String();
		try {
			InputStream inputStreamImage = event.getUploadedFile()
					.getInputStream();
			int imageIntSize = (int) event.getUploadedFile().getSize();
			decodedImage = (String) BinaryUtils.convertInputStreamToBase64(
					inputStreamImage, imageIntSize);
		} catch (Exception e) {
			logger.error("Error: ", e);
		}
		concept.setLargeIcon(decodedImage);
		this.setFlag2(false);
	}

	public Boolean getFlag1() {
		return flag1;
	}

	public void setFlag1(Boolean flag1) {
		this.flag1 = flag1;
	}

	public Boolean getFlag2() {
		return flag2;
	}

	public void setFlag2(Boolean flag2) {
		this.flag2 = flag2;
	}

	public void setConceptAttributeShow() {
		if (conceptAttributeShow) {
			conceptAttributeShow = false;
		} else {
			conceptAttributeShow = true;
		}
		conceptAttribute = new ConceptAttribute();
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

	public void deleteConcept() {
		concept = conceptService.findById(conceptId, Concept.class);
		conceptService.delete(concept);
		loadConcepts();
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

	Comparator<SelectItem> comparator = new Comparator<SelectItem>() {
		@Override
		public int compare(SelectItem s1, SelectItem s2) {
			return s1.getLabel().compareToIgnoreCase(s2.getLabel());
		}
	};

	public List<SelectItem> getConceptNames() {
		conceptNames.clear();
		List<Concept> conceptList = conceptService.findAll(Concept.class);
		SelectItem initialSelectItem = new SelectItem(null, "-Select-");
		conceptNames.add(initialSelectItem);
		for (Concept concept : conceptList) {
			SelectItem selectItem = new SelectItem(concept.getId(),
					concept.getDescription());
			conceptNames.add(selectItem);
		}
		return conceptNames;
	}

	public void setConceptNames(List<SelectItem> conceptNames) {
		this.conceptNames = conceptNames;
	}

	public List<Concept> getParentConcepts() {
		parentConcepts.clear();
		Concept parentConcept = new Concept();
		if (concept.getParentConcept() != null) {
			parentConcept=conceptService.findById(concept.getParentConcept(), Concept.class);
			parentConcepts.add(parentConcept);
		}
		return parentConcepts;
	}

	public void setParentConcepts(List<Concept> parentConcepts) {
		this.parentConcepts = parentConcepts;
	}

}
