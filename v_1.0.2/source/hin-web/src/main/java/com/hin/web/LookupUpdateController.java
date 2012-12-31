package com.hin.web;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.hin.domain.Concept;
import com.hin.domain.ConceptAttribute;
import com.hin.domain.ConceptClass;
import com.hin.domain.ConceptLocale;
import com.hin.domain.ConceptSource;
import com.hin.domain.ConceptSynonym;
import com.hin.domain.MessageType;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.Status;
import com.hin.domain.Step;
import com.hin.hl7messaging.web.LookupUpdateStatus;
import com.hin.service.IConceptClassService;
import com.hin.service.IConceptLocaleService;
import com.hin.service.IConceptService;
import com.hin.service.IConceptSourceService;
import com.hin.service.IConceptSynonymService;
import com.hin.service.IProcessDefinitionService;

@Controller
public class LookupUpdateController {

	@Autowired
	private IConceptService conceptService;

	@Autowired
	private IConceptSourceService conceptSourceService;

	@Autowired
	private IConceptLocaleService conceptLocaleService;

	@Autowired
	private IConceptSynonymService conceptSynonymService;

	@Autowired
	private IProcessDefinitionService processDefinitionService;

	@Autowired
	private IConceptClassService conceptClassService;
	
	InputStream inputStrm;

	Workbook wb;

	private LookupUpdateStatus lookupUpdateStatus = new LookupUpdateStatus();

	private List<String> removeList = new ArrayList<String>();
	private List<String> stepRemoveList = new ArrayList<String>();
	private List<ConceptAttribute> removeConceptAttributeList = new ArrayList<ConceptAttribute>();
	private List<Step> removeStepList = new ArrayList<Step>();
	private List<MessageType> removeMessageTypeList = new ArrayList<MessageType>();
	private List<String> messageTypeRemoveList = new ArrayList<String>();

	// READ CONCEPT DETAILS FROM EXCEL FILE
	public List<LookupUpdateStatus> readConceptFile(InputStream inp)
			throws Exception {
		inputStrm = inp;
		List<LookupUpdateStatus> updatedConceptsList = new ArrayList<LookupUpdateStatus>();
		wb = WorkbookFactory.create(inputStrm);

		updateConceptClass();
		updateConceptSource();
		updateConceptLocale();
		updateConceptSynonym();
		updatedConceptsList = updateConcept();
		return updatedConceptsList;
	}

	// CONCEPTCLASS
	public void updateConceptClass() throws Exception {
		Sheet sheet = wb.getSheet("conceptClass");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			Row row = sheet.getRow(i);
			String name = "";
			String description = "";
			Status status = null;
			if (row != null) {
				if (row.getCell(0) != null) {
					name = getStringValue(row.getCell(0));
				}

				if (row.getCell(1) != null) {
					description = getStringValue(row.getCell(1));
				}

				if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}
				ConceptClass conceptClass = conceptClassService.findByName(
						name, ConceptClass.class);

				if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("REMOVE")) {
					conceptClassService.delete(conceptClass);
				} else {
					if (conceptClass == null) {
						conceptClass = new ConceptClass();
					}
					conceptClass.setName(name);
					conceptClass.setDescription(description);
					conceptClass.setStatus(status);
					conceptClassService.save(conceptClass);
				}
			}
		}
	}

	// CONCEPTSOURCE
	public void updateConceptSource() throws Exception {
		Sheet sheet = wb.getSheet("conceptSource");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			Row row = sheet.getRow(i);
			if (row != null) {
				String name = "";
				String description = "";
				Status status = null;

				if (row.getCell(0) != null) {
					name = getStringValue(row.getCell(0));
				}
				if (row.getCell(1) != null) {
					description = getStringValue(row.getCell(1));
				}

				if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}

				ConceptSource conceptSource = conceptSourceService.findByName(
						name, ConceptSource.class);
				if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("REMOVE")) {
					conceptSourceService.delete(conceptSource);
				} else {
					if (conceptSource == null) {
						conceptSource = new ConceptSource();
					}
					conceptSource.setName(name);
					conceptSource.setDescription(description);
					conceptSource.setStatus(status);
					conceptSourceService.save(conceptSource);
				}
			}
		}
	}

	// CONCEPTLOCALE
	public void updateConceptLocale() throws Exception {

		Sheet sheet = wb.getSheet("conceptLocale");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			Row row = sheet.getRow(i);
			if (row != null) {
				String name = "";
				String description = "";
				String code = "";

				if (row.getCell(0) != null) {
					name = getStringValue(row.getCell(0));
				}

				if (row.getCell(1) != null) {
					description = getStringValue(row.getCell(1));
				}
				if (row.getCell(2) != null) {
					code = getStringValue(row.getCell(2));
				}

				Status status = null;
				if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}

				ConceptLocale conceptLocale = conceptLocaleService.findByName(
						name, ConceptLocale.class);
				if (row.getCell(4) != null
						&& getStringValue(row.getCell(4)).equals("REMOVE")) {
					conceptLocaleService.delete(conceptLocale);
				} else {
					if (conceptLocale == null) {
						conceptLocale = new ConceptLocale();
					}
					conceptLocale.setName(name);
					conceptLocale.setDescription(description);
					conceptLocale.setStatus(status);
					conceptLocale.setCode(code);
					conceptLocaleService.save(conceptLocale);
				}
			}
		}
	}

	// CONCEPTSYNONYM
	public void updateConceptSynonym() throws Exception {
		Sheet sheet = wb.getSheet("conceptSynonym");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			Row row = sheet.getRow(i);
			if (row != null) {
				String name = "";

				if (row.getCell(0) != null) {
					name = getStringValue(row.getCell(0));
				}

				Status status = null;
				if (row.getCell(1) != null
						&& getStringValue(row.getCell(1)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(1) != null
						&& getStringValue(row.getCell(1)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}

				ConceptSynonym conceptSynonym = conceptSynonymService
						.findByName(name, ConceptSynonym.class);
				if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("REMOVE")) {
					conceptSynonymService.delete(conceptSynonym);
				} else {
					if (conceptSynonym == null) {
						conceptSynonym = new ConceptSynonym();
					}
					conceptSynonym.setName(name);
					conceptSynonym.setStatus(status);
					conceptSynonymService.save(conceptSynonym);
				}
			}
		}
	}

	// CONCEPT
	public List<LookupUpdateStatus> updateConcept() throws Exception {
		List<LookupUpdateStatus> updatedConceptsList = new ArrayList<LookupUpdateStatus>();
		Sheet sheet = wb.getSheet("concept");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			lookupUpdateStatus = new LookupUpdateStatus();
			Row row = sheet.getRow(i);
			if (row != null) {
				String name = "", description = "", shortName = "";
				List<ConceptClass> conceptClasses = new ArrayList<ConceptClass>();
				List<ConceptAttribute> conceptAttributes = new ArrayList<ConceptAttribute>();
				List<ConceptLocale> locales = new ArrayList<ConceptLocale>();
				List<ConceptSynonym> synonyms = new ArrayList<ConceptSynonym>();
				List<ConceptSource> sources = new ArrayList<ConceptSource>();

				if (row.getCell(0) != null) {
					name = getStringValue(row.getCell(0));
				}
				if (row.getCell(1) != null) {
					shortName = getStringValue(row.getCell(1));
				}
				if (row.getCell(2) != null) {
					description = getStringValue(row.getCell(2));
				}

				if (row.getCell(3) != null) {
					String conceptClassesValue = getStringValue(row.getCell(3));
					String[] conceptClassesList = conceptClassesValue
							.split(",");
					for (String conceptClass : conceptClassesList) {
						ConceptClass conceptClassFromDB = conceptClassService.findByName(conceptClass, ConceptClass.class);
						if(conceptClassFromDB != null){
							conceptClasses.add(conceptClassFromDB);
						}
					}
				}

				if (row.getCell(0) != null) {
					String conceptAttributesValue = getStringValue(row
							.getCell(0));
					Sheet conceptAttributeSheet = wb
							.getSheet("conceptAttribute");
					removeList.clear();
					removeConceptAttributeList.clear();
					conceptAttributes = getConceptAttributeObj(
							conceptAttributesValue, conceptAttributeSheet);
				}

				if (row.getCell(4) != null) {
					String conceptLocalesValue = getStringValue(row.getCell(4));
					String[] conceptLocalesList = conceptLocalesValue
							.split(",");
					for (String conceptLocale : conceptLocalesList) {
						ConceptLocale conceptLocaleFromDB = conceptLocaleService.findByName(conceptLocale, ConceptLocale.class);
						if(conceptLocaleFromDB != null){
							locales.add(conceptLocaleFromDB);
						}
					}
				}

				if (row.getCell(5) != null) {
					String conceptSynonymValue = getStringValue(row.getCell(5));
					String[] conceptSynonymList = conceptSynonymValue
							.split(",");
					for (String conceptSynonym : conceptSynonymList) {
						ConceptSynonym conceptSynonymFromDB = conceptSynonymService.findByName(conceptSynonym, ConceptSynonym.class);
						if(conceptSynonymFromDB != null){
							synonyms.add(conceptSynonymFromDB);
						}
					}
				}

				if (row.getCell(6) != null) {
					String conceptSourceValue = getStringValue(row.getCell(6));
					String[] conceptSourceList = conceptSourceValue.split(",");
					for (String conceptSource : conceptSourceList) {
						ConceptSource conceptSourceFromDB =conceptSourceService.findByName(conceptSource, ConceptSource.class); 
						if(conceptSourceFromDB != null){
							sources.add(conceptSourceFromDB);
						}
					}
				}

				Status status = null;
				if (row.getCell(7) != null
						&& getStringValue(row.getCell(7)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(7) != null
						&& getStringValue(row.getCell(7)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}

				Concept concept = conceptService
						.findByName(name, Concept.class);
				if(concept != null){
					//conceptClasses.addAll(concept.getConceptClasses());
					List<ConceptClass> cxs = new ArrayList<ConceptClass>(conceptClasses);
					List<ConceptClass> cds = new ArrayList<ConceptClass>(concept.getConceptClasses());
					String found="";
					for(ConceptClass cd : cds){
						for(ConceptClass cx : cxs){
							if(cx.getName().equals(cd.getName())){
								found="found";
							}
						}
						if(!found.equals("found")){
							conceptClasses.add(cd);
						}
						found="";
					}
				}
				if (row.getCell(8) != null
						&& getStringValue(row.getCell(8)).equals("REMOVE")) {
					List<Concept> conceptListToDelete = conceptService.findAllConceptsByProperty("name", name);
					for(Concept conceptToDelete : conceptListToDelete){
						conceptService.delete(conceptToDelete);
					}
				} else {
					if (concept == null) {
						concept = new Concept();
						lookupUpdateStatus.setStatus("Inserted");
						concept.setName(name);
					} else {
						lookupUpdateStatus.setStatus("Updated");
					}
					concept.setShortName(shortName);
					concept.setDescription(description);
					concept.setStatus(status);
					concept.setConceptClasses(conceptClasses);
					List<ConceptAttribute> newConceptAttributeList = new ArrayList<ConceptAttribute>();
					if (!conceptAttributes.isEmpty()) {
						List<ConceptAttribute> attributes = concept
								.getConceptAttributes();
						String flag = "";
						for (ConceptAttribute attribute : attributes) {
							for (ConceptAttribute conceptAttribute : conceptAttributes) {
								if (conceptAttribute.getKey().equals(
										attribute.getKey())) {
									newConceptAttributeList
											.add(conceptAttribute);
									flag = "found";
									for (String remove : removeList) {
										if (remove.equals(conceptAttribute
												.getKey())) {
											removeConceptAttributeList
													.add(conceptAttribute);
										}
									}
									break;
								}
							}
							if (!flag.equals("found")) {
								newConceptAttributeList.add(attribute);
							}
							flag = "";
						}
						for (ConceptAttribute ca1 : conceptAttributes) {
							for (ConceptAttribute ca2 : newConceptAttributeList) {
								if (ca1.getKey().equals(ca2.getKey())) {
									flag = "found";
								}
							}
							if (!flag.equals("found")) {
								newConceptAttributeList.add(ca1);
							}
							flag = "";
						}
						newConceptAttributeList
								.removeAll(removeConceptAttributeList);
						concept.setConceptAttributes(newConceptAttributeList);
					}
					concept.setSynonyms(synonyms);
					concept.setSources(sources);
					concept.setLocales(locales);
					conceptService.save(concept);
					lookupUpdateStatus.setName(name);
					updatedConceptsList.add(lookupUpdateStatus);
				}
			}
		}
		return updatedConceptsList;
	}

	// READ PROCESS EXCEL FILE
	public List<LookupUpdateStatus> readProcessFile(InputStream inp)
			throws Exception {
		inputStrm = inp;
		List<LookupUpdateStatus> updatedProcessList = new ArrayList<LookupUpdateStatus>();
		wb = WorkbookFactory.create(inputStrm);
		Sheet sheet;
		// PROCESS
		sheet = wb.getSheet("processDefinition");
		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			lookupUpdateStatus = new LookupUpdateStatus();
			Row row = sheet.getRow(i);
			if (row != null) {
				String processName = "";
				String processDescription = "";
				String initializeScript = "";

				if (row.getCell(0) != null) {
					processName = getStringValue(row.getCell(0));
				}
				if (row.getCell(1) != null) {
					initializeScript = getStringValue(row.getCell(1));
				}
				if (row.getCell(4) != null) {
					processDescription = getStringValue(row.getCell(4));
				}

				Status status = null;
				if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				} else if (row.getCell(2) != null
						&& getStringValue(row.getCell(2)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				}

				ProcessDefinition processDefinition = processDefinitionService
						.findByProcessName(processName);
				if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("REMOVE")) {
					processDefinitionService.delete(processDefinition);
					lookupUpdateStatus.setStatus("Removed");
					lookupUpdateStatus.setName(processName);
					updatedProcessList.add(lookupUpdateStatus);
				} else {
					if (processDefinition == null) {
						processDefinition = new ProcessDefinition();
						processDefinition.setProcessName(processName);
						processDefinitionService.save(processDefinition);
						lookupUpdateStatus.setStatus("Inserted");
					} else {
						lookupUpdateStatus.setStatus("Updated");
					}
					
					if(initializeScript!=null && initializeScript!=""){
						processDefinition.setInitializeScript(initializeScript);
					}
					processDefinition.setStatus(status);
					processDefinition.setDescription(processDescription);
					Sheet stepSheet = wb.getSheet("processStep");
					List<Step> newStepList = new ArrayList<Step>();
					List<Step> stepsDb = processDefinition.getSteps();
					stepRemoveList.clear();
					removeStepList.clear();
					List<Step> stepsXl = getStepObj(processName, stepSheet, stepsDb, processDefinition);

					if (!stepsXl.isEmpty()) {

						String flag = "";
						for (Step stepDb : stepsDb) {
							for (Step stepXl : stepsXl) {
								if (stepXl.getStepName().equals(
										stepDb.getStepName())) {
									newStepList.add(stepXl);
									flag = "found";
									for (String remove : stepRemoveList) {
										if (remove.equals(stepXl.getStepName())) {
											removeStepList.add(stepXl);
										}
									}
									break;
								}
							}
							if (!flag.equals("found")) {
								newStepList.add(stepDb);
							}
							flag = "";
						}
						for (Step s1 : stepsXl) {
							for (Step s2 : newStepList) {
								if (s1.getStepName().equals(s2.getStepName())) {
									flag = "found";
								}
							}
							if (!flag.equals("found")) {
								newStepList.add(s1);
							}
							flag = "";
						}
						newStepList.removeAll(removeStepList);
						//iterate and add id
						for(Step step:newStepList){
							ProcessDefinitionBean.addToProcessDefinition(step, processDefinition);
						}
						for(Step step:newStepList){
							ListIterator<MessageType> listIterator = step.getMessageTypes().listIterator();
							while(listIterator.hasNext()){
								MessageType messageType = listIterator.next();
								String category = messageType.getCategory();
								ConceptClass c = conceptClassService.findByName(category, ConceptClass.class);
								String conceptClassId="";
								if(c==null){
									conceptClassId = "Select";
								}else {
									conceptClassId=c.getId();
								}
								ProcessDefinitionBean.addToProcessStep(conceptClassId, messageType, step, conceptClassService);
							}
						}
						processDefinition.setSteps(newStepList);
					}
					processDefinitionService.save(processDefinition);
					lookupUpdateStatus.setName(processName);
					updatedProcessList.add(lookupUpdateStatus);
				}
			}
		}
		return updatedProcessList;
	}

	// GET STEPS DETAILS FOR THE PROCESSES
	public List<Step> getStepObj(String processName, Sheet stepSheet,
			List<Step> stepsDb, ProcessDefinition processDefinition) throws Exception {
		List<Step> steps = new ArrayList<Step>();
		for (int i = stepSheet.getFirstRowNum() + 1; i <= stepSheet
				.getLastRowNum(); i++) {
			Row row = stepSheet.getRow(i);
			if (row != null && row.getCell(0) != null
					&& getStringValue(row.getCell(0)).equals(processName)) {
				String order = "";
				String stepName = "";
				String goupName = "";
				String shortDescription = "";
				String longDescription = "";
				String formHtml = "";
				if (row.getCell(1) != null) {
					order = getStringValue(row.getCell(1));
				}
				if (row.getCell(2) != null) {
					stepName = getStringValue(row.getCell(2));
				}
				if (row.getCell(3) != null) {
					goupName = getStringValue(row.getCell(3));
				}
				if (row.getCell(4) != null) {
					shortDescription = getStringValue(row.getCell(4));
				}
				if (row.getCell(5) != null) {
					longDescription = getStringValue(row.getCell(5));
				}
				if (row.getCell(6) != null) {
					formHtml = getStringValue(row.getCell(6));
				}
				Status status = null;
				if (row.getCell(7) != null
						&& getStringValue(row.getCell(7)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(7) != null
						&& getStringValue(row.getCell(7)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}
				Boolean stepStatusInfo = Boolean.TRUE;
				if (row.getCell(8) != null
						&& getStringValue(row.getCell(8)).equals("FALSE")) {
					stepStatusInfo = Boolean.FALSE;
				} else if (row.getCell(8) != null
						&& getStringValue(row.getCell(8)).equals("TRUE")) {
					stepStatusInfo = Boolean.TRUE;
				}
				if (row.getCell(9) != null
						&& getStringValue(row.getCell(9)).equals("REMOVE")) {
					stepRemoveList.add(stepName);
				}
				Step step = new Step();
				step.setOrder(order);
				step.setShortDescription(shortDescription);
				step.setLongDescription(longDescription);
				step.setStepName(stepName);
				step.setGroupName(goupName);
				step.setFormHtml(formHtml);
				step.setStatus(status);
				step.setStepStatusInfo(stepStatusInfo);
				
				Sheet messageTypeSheet = wb.getSheet("processMessageType");
				// from excel
				messageTypeRemoveList.clear();
				removeMessageTypeList.clear();
				List<MessageType> messageTypesXL = getMessageTypeObj(stepName,
						messageTypeSheet,processName);

				if (stepsDb.isEmpty()) {
					step.setMessageTypes(messageTypesXL);
					steps.add(step);
				} else {
					List<MessageType> newMessageType = new ArrayList<MessageType>();
					String stepFlag = "";
					for (Step s : stepsDb) {
						if (s.getStepName().equals(stepName)) {
							stepFlag = "found";
							String flag = "";
							List<MessageType> mtsDb = s.getMessageTypes();
							for (MessageType mtDb : mtsDb) {
								for (MessageType mtXl : messageTypesXL) {
									if ((mtXl.getType()+mtXl.getFormHtml()).equals(
											(mtDb.getType()+mtDb.getFormHtml()))) {
										newMessageType.add(mtXl);
										flag = "found";
										for (String remove : messageTypeRemoveList) {
											if (remove.equals(mtXl.getType()+mtXl.getFormHtml())) {
												removeMessageTypeList.add(mtXl);
											}
										}
										break;
									}
								}
								if (!flag.equals("found")) {
									newMessageType.add(mtDb);
								}
								flag = "";
							}
							for (MessageType mt1 : messageTypesXL) {
								for (MessageType mt2 : newMessageType) {
									if ((mt1.getType()+mt1.getFormHtml()).equals(
											mt2.getType()+mt2.getFormHtml())) {
										flag = "found";
									}
								}
								if (!flag.equals("found")) {
									newMessageType.add(mt1);
								}
								flag = "";
							}
							newMessageType.removeAll(removeMessageTypeList);
							step.setMessageTypes(newMessageType);
							steps.add(step);
						}
					}
					if (!stepFlag.equals("found")) {
						step.setMessageTypes(messageTypesXL);
						steps.add(step);
					}
				}
			}
		}
		return steps;
	}

	// GET MESSAGETYPES OF A STEP
	public List<MessageType> getMessageTypeObj(String stepName,
			Sheet messageTypeSheet, String processName) {
		List<MessageType> messageTypes = new ArrayList<MessageType>();
		for (int i = messageTypeSheet.getFirstRowNum() + 1; i <= messageTypeSheet
				.getLastRowNum(); i++) {
			Row row = messageTypeSheet.getRow(i);
			if (row != null && row.getCell(0) != null
					&& getStringValue(row.getCell(1)).equals(stepName) && getStringValue(row.getCell(0)).equals(processName)) {
				String order = "";
				String type = "";
				String typeName = "";
				String formHtml = "";
				String title = "";
				String category = "";
				String transactionType = "";
				String queryString = "";
				String state = "";

				if (row.getCell(2) != null) {
					order = getStringValue(row.getCell(2));
				}
				if (row.getCell(3) != null) {
					state = getStringValue(row.getCell(3));
				}
				if (row.getCell(4) != null) {
					type = getStringValue(row.getCell(4));
				}
				if (row.getCell(5) != null) {
					typeName = getStringValue(row.getCell(5));
				}
				if (row.getCell(6) != null) {
					formHtml = getStringValue(row.getCell(6));
				}
				if (row.getCell(7) != null) {
					title = getStringValue(row.getCell(7));
				}
				if (row.getCell(8) != null) {
					category = getStringValue(row.getCell(8));
				}
				if (row.getCell(9) != null) {
					transactionType = getStringValue(row.getCell(9));
				}
				if (row.getCell(10) != null) {
					queryString = getStringValue(row.getCell(10));
				}
				Status status = null;
				if (row.getCell(11) != null
						&& getStringValue(row.getCell(11)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(11) != null
						&& getStringValue(row.getCell(11)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}
				if (row.getCell(12) != null && getStringValue(row.getCell(12)).equals("REMOVE")) {
					messageTypeRemoveList.add(type);
				}
				MessageType messageType = new MessageType();
				messageType.setMsgTypeOrder(order);
				messageType.setState(state);
				messageType.setType(type);
				messageType.setTypeName(typeName);
				messageType.setFormHtml(formHtml);
				messageType.setTitle(title);
				messageType.setCategory(category);
				messageType.setTransactionType(transactionType);
				messageType.setQueryString(queryString);
				messageType.setStatus(status);
				messageTypes.add(messageType);
			}
		}
		return messageTypes;
	}

	// GET CONCEPT ATTRIBUTES OF A CONCEPT
	public List<ConceptAttribute> getConceptAttributeObj(
			String conceptAttributeName, Sheet conceptAttributeSheet)
			throws Exception {
		List<ConceptAttribute> conceptAttributes = new ArrayList<ConceptAttribute>();
		for (int i = conceptAttributeSheet.getFirstRowNum() + 1; i <= conceptAttributeSheet
				.getLastRowNum(); i++) {
			Row row = conceptAttributeSheet.getRow(i);
			if (row != null
					&& getStringValue(row.getCell(0)).equals(
							conceptAttributeName)) {
				String key = "";
				String value = "";
				ConceptAttribute conceptAttribute = new ConceptAttribute();
				if (row.getCell(1) != null) {
					key = getStringValue(row.getCell(1));
				}
				if (row.getCell(2) != null) {
					int cellType = row.getCell(2).getCellType();
					if (cellType == Cell.CELL_TYPE_NUMERIC) {
						value = Double.toString(row.getCell(2)
								.getNumericCellValue());
					} else if (cellType == Cell.CELL_TYPE_STRING) {
						value = getStringValue(row.getCell(2));
					}
				}
				Status status = null;
				if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("INACTIVE")) {
					status = Status.INACTIVE;
				} else if (row.getCell(3) != null
						&& getStringValue(row.getCell(3)).equals("ACTIVE")) {
					status = Status.ACTIVE;
				}
				if (row.getCell(3) != null
						&& getStringValue(row.getCell(4)).equals("REMOVE")) {
					removeList.add(key);
				}
				if (!(key.equals("") || value.equals(""))) {
					conceptAttribute.setKey(key);
					conceptAttribute.setValue(value);
					conceptAttribute.setStatus(status);
					conceptAttributes.add(conceptAttribute);
				}

			}
		}
		return conceptAttributes;
	}

	// GET THE STRING VALUE FROM A CELL OF EXCEL FILE
	public String getStringValue(Cell cell) {
		if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC) {
			return Double.toString(cell.getNumericCellValue()).trim();
		} else if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
			return cell.getStringCellValue().trim();
		} else {
			return null;
		}
	}

}
