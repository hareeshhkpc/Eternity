/**
 * 
 */
package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.utils.SearchCriteria;
import com.hin.domain.vo.ConceptVO;
import com.hin.domain.vo.RoleDefinitionVO;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.service.IProcessDefinitionService;
import com.hin.service.impl.ConceptClassService;
import com.hin.service.impl.ConceptService;

/**
 * @author krishna.lr
 * 
 */

@Controller
public class LookUpController {

	@Autowired
	ConceptService conceptService;

	@Autowired
	ConceptClassService conceptClassService;

	@Autowired
	ISearchService searchService;

	@Autowired
	IProcessDefinitionService processDefinitionService;

	private Logger logger = Logger.getLogger(LookUpController.class.getName());

	@RequestMapping(value = "/lookUp/static", method = RequestMethod.GET)
	public @ResponseBody
	String staticLookUp(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchCriteria searchCriteria = gson.fromJson(json,
				SearchCriteria.class);
		List<ConceptVO> concepts = new ArrayList<ConceptVO>();
		List<String> values = searchCriteria.getValues();
		if (values.size() > 0) {
			for (String value : values) {
				concepts.addAll(getConcepts(searchCriteria.getProperty(),
						value, searchCriteria.getCategory()));
			}
		} else {
			concepts.addAll(getConcepts(searchCriteria.getProperty(),
					searchCriteria.getValue(), searchCriteria.getCategory()));

		}

		Collections.sort(concepts, new Comparator<ConceptVO>() {

			@Override
			public int compare(ConceptVO o1, ConceptVO o2) {
				if (o1.getDescription() == null || o2.getDescription() == null) {
					return -1;
				}
				return o1.getDescription().compareToIgnoreCase(
						o2.getDescription());
			}
		});

		data = gson.toJson(concepts);
		return data;
	}

	/**
	 * @param data
	 * @param gson
	 * @param searchCriteria
	 * @return
	 */
	private List<ConceptVO> getConcepts(String porperty, Object value,
			String category) {
		List<ConceptVO> concepts = new ArrayList<ConceptVO>();
		try {
			List<Concept> conceptList = new ArrayList<Concept>();
			conceptList = conceptService.findAllConceptsByProperty(porperty,
					(String) value);
			Iterator<Concept> iterator = conceptList.iterator();
			while (iterator.hasNext()) {
				Concept concept = iterator.next();
				if (value.equals("Package")) {
					boolean service = false;
					for (ConceptClass conceptClass : concept
							.getConceptClasses()) {
						if (conceptClass.getName().equals("Service")) {
							service = true;
							break;
						}
					}
					if (!service) {
						ConceptVO conceptVO = new ConceptVO(concept.getName(),
								concept.getDescription(),
								concept.getConceptClasses(),
								concept.getConceptAttributes(),
								concept.getSmallIcon(), concept.getShortName());
						conceptVO.setCategory(value.toString());
						concepts.add(conceptVO);
					}
				} else {

					for (ConceptClass conceptClass : concept
							.getConceptClasses()) {
						String propertValue = conceptClass.getName();
						if (porperty.equals("description")) {
							propertValue = concept.getDescription();
						}

						if (propertValue.equals(value)) {
							ConceptVO conceptVO = new ConceptVO(
									concept.getName(),
									concept.getDescription(),
									concept.getConceptClasses(),
									concept.getConceptAttributes(),
									concept.getSmallIcon(),
									concept.getShortName());
							if (category != null && category.length() > 0) {
								conceptVO.setCategory(category);
							} else {
								conceptVO.setCategory(value.toString());
							}
							concepts.add(conceptVO);
						}
					}

				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return concepts;
	}

	@RequestMapping(value = "/lookUp/dynamic", method = RequestMethod.GET)
	public @ResponseBody
	String dynamicLookUp(@RequestParam String conceptClassName,
			String searchWord) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		logger.info("conceptClassName: " + conceptClassName);
		try {
			List<ConceptVO> concepts = new ArrayList<ConceptVO>();
			List<Concept> conceptList = new ArrayList<Concept>();
			String regex = ".*" + searchWord + ".*";
			conceptList = conceptService.findAllConceptsByDualProperty(
					"conceptClasses.name", conceptClassName, "description",
					regex);
			Iterator<Concept> iterator = conceptList.iterator();
			while (iterator.hasNext()) {
				Concept concept = iterator.next();
				concepts.add(new ConceptVO(concept.getName(), concept
						.getDescription(), concept.getConceptClasses(), concept
						.getConceptAttributes(), concept.getSmallIcon(),
						concept.getShortName()));
			}
			data = gson.toJson(concepts);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/concept", method = RequestMethod.GET)
	public @ResponseBody
	String conceptLookUp(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchCriteria searchCriteria = gson.fromJson(json,
				SearchCriteria.class);
		try {
			List<Concept> conceptList = new ArrayList<Concept>();
			conceptList = conceptService.findAllConceptsByProperty(
					searchCriteria.getProperty(),
					(String) searchCriteria.getValue());
			data = gson.toJson(conceptList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/concept/service", method = RequestMethod.GET)
	public @ResponseBody
	String serviceLookUp(@RequestParam String conceptName,
			String conceptClassName) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		logger.info("conceptClassName: " + conceptClassName);
		try {
			List<Concept> conceptList = new ArrayList<Concept>();
			conceptList = conceptService.findAllConceptsByDualProperty("name",
					conceptName, "conceptClasses.name", conceptClassName);

			if (conceptList != null && conceptList.size() > 1) {
				List<Concept> concepts = new ArrayList<Concept>();
				for (Concept concept : conceptList) {
					if (concept.getName().equals(conceptName)) {
						concepts.add(concept);
						break;
					}
				}
				data = gson.toJson(concepts);
			} else {
				data = gson.toJson(conceptList);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/concept/property", method = RequestMethod.GET)
	public @ResponseBody
	String lookupByProperty(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchCriteria searchCriteria = gson.fromJson(json,
				SearchCriteria.class);
		try {

			List<Concept> conceptList = new ArrayList<Concept>();
			conceptList = conceptService.findAllConceptsByProperty(
					searchCriteria.getProperty(),
					(String) searchCriteria.getValue());
			data = gson.toJson(conceptList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/concept/name", method = RequestMethod.GET)
	public @ResponseBody
	String lookupByName(@RequestParam String name) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		try {
			List<Concept> conceptList = new ArrayList<Concept>();
			Concept concept = conceptService.findByName(name);
			conceptList.add(concept);
			data = gson.toJson(conceptList);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/concept/names", method = RequestMethod.GET)
	public @ResponseBody
	String lookupByNames(@RequestParam String names) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		try {
			String[] conceptNames = null;
			if (names != null) {
				conceptNames = names.split(",");
			}

			List<List<Concept>> conceptLists = new ArrayList<List<Concept>>();
			for (int index = 0; index < conceptNames.length; index++) {
				Concept concept = conceptService
						.findByName(conceptNames[index]);
				List<Concept> conceptList = new ArrayList<Concept>();
				conceptList.add(concept);
				conceptLists.add(conceptList);
			}
			data = gson.toJson(conceptLists);
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	/**
	 * Return the lookup data base on class name. Ex.
	 * gender,physician,service,drug etc....
	 * 
	 * @param className
	 * @return json data
	 * @throws Exception
	 * @author madhu.murmu
	 */

	@RequestMapping(value = "/lookUp/getLookupList", method = RequestMethod.GET)
	public @ResponseBody
	String getLookupList(@RequestParam String className) throws Exception {
		String data = "";
		Gson gson = new GsonBuilder().create();
		try {
			List<Object> listObj = searchService.searchLookup(className);
			if (!listObj.isEmpty()) {
				data = gson.toJson(listObj);
			}
		} catch (Exception ex) {
			logger.error(
					"Error while retriving the lookup message :"
							+ ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/getAllLookUpData", method = RequestMethod.GET)
	public @ResponseBody
	String getAllLookUpData() throws Exception {
		Gson gson = new GsonBuilder().create();
		String data = "";
		try {
			HashMap<String, List<Concept>> lookUpMap = new HashMap<String, List<Concept>>();
			List<ConceptClass> conceptList = conceptClassService
					.findAll(ConceptClass.class);
			Iterator<ConceptClass> iterator = conceptList.iterator();
			while (iterator.hasNext()) {
				ConceptClass conceptClass = iterator.next();
				List<Concept> conceptLists = new ArrayList<Concept>();
				conceptLists = conceptService.findAllConceptsByProperty(
						"conceptClasses.name", conceptClass.getName());
				Collections.sort(conceptLists, new Comparator<Concept>() {
					@Override
					public int compare(Concept o1, Concept o2) {
						if (o1.getDescription() == null
								|| o2.getDescription() == null) {
							return -1;
						}
						return o1.getDescription().compareToIgnoreCase(
								o2.getDescription());
					}
				});
				lookUpMap.put(conceptClass.getName(), conceptLists);
			}
			if (lookUpMap != null) {
				data = gson.toJson(lookUpMap);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/lookUp/getAllProcess", method = RequestMethod.GET)
	public @ResponseBody
	String getAllProcess(@RequestParam String json) throws Exception {
		String data = "";
		try {
			RoleDefinitionVO roleDefinitionVO = new RoleDefinitionVO();
			Gson gson = new GsonBuilder().create();		
			List<String> processNames = new ArrayList<String>();
			List<ProcessDefinition> processDefinitionList = processDefinitionService
					.findAll(ProcessDefinition.class);
			Iterator<ProcessDefinition> iterator = processDefinitionList.iterator();
			while (iterator.hasNext()) {
				ProcessDefinition processDefinition = iterator.next();
				processNames.add(processDefinition.getDescription());
			}
			roleDefinitionVO.setProcessNames(processNames);
			data = gson.toJson(roleDefinitionVO);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return data;
	}
}
