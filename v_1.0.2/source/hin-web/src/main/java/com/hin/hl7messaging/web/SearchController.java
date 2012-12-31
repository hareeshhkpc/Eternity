package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Concept;
import com.hin.domain.EntityState;
import com.hin.domain.ListItem;
import com.hin.domain.ProcessMessageFilterCondition;
import com.hin.domain.vo.ConceptVO;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.ProductVO;
import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.MessageIndex;
import com.hin.hl7messaging.SearchService;
import com.hin.hl7messaging.api.IEntitySearchService;
import com.hin.hl7messaging.api.ILicenseeSearchService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.IProductSearchService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.service.IEntityStateService;
import com.hin.service.impl.ConceptService;

/**
 * @author krishna.lr
 * 
 */

@Controller
public class SearchController implements   ApplicationContextAware{

	@Autowired
	IEntitySearchService entitySearchService;

	@Autowired
	IMessageService messageService;

	@Autowired
	MessageIndex messageIndex;

	@Autowired
	ConceptService conceptService;

	@Autowired
	private IEntityStateService entityStateService;

	@Autowired
	private IProductSearchService productSearchService;

	@Autowired
	ILicenseeSearchService licenseeSearchService;

	@Autowired
	ISearchService searchService;
	
	private ApplicationContext applicationContext;

	private Logger logger = Logger.getLogger(SearchController.class.getName());

	/**
	 * Query the enity list based on conditionMap from Lucene using
	 * SearchService.
	 */
	@RequestMapping(value = "/search/entitySearchWithCondtion", method = RequestMethod.GET)
	public @ResponseBody
	String entitySearchWithCondtion(@RequestParam String json,
			@RequestParam HashMap<String, String> conditionMap) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessMessageFilterCondition processMessageFilterCondition = gson
				.fromJson(conditionMap.get("conditionMap"),
						ProcessMessageFilterCondition.class);
		List<ListItem> conditionMaps = processMessageFilterCondition.getMaps();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		List<ProfileVO> profiles = null;
		try {
			searchVO.setConditionMaps(conditionMaps);
			Object profilesObjectList = entitySearchService.search(searchVO);
			profiles = entitySearchService.convertObjectListToProfileVoList(profilesObjectList);
			if (profiles != null) {
				data = gson.toJson(profiles);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	/**
	 * Query the entity list based on Role from Lucene using SearchService.
	 */
	@RequestMapping(value = "/search/entitySearch", method = RequestMethod.GET)
	public @ResponseBody
	String entitySearch(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProfileVO> profiles = null;
		try {
			SearchVO searchVO = gson.fromJson(json, SearchVO.class);
			if (searchVO.getType().equals("PHYSICIAN_PROFILE_SEARCH"))
				searchVO.setMessageType("PRPA_MT201000HT03");

			Object profilesObjectList = entitySearchService.search(searchVO);
			profiles = entitySearchService.convertObjectListToProfileVoList(profilesObjectList);
			if (profiles != null) {
				data = gson.toJson(profiles);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	/* Code to get Service values starts here */

	@RequestMapping(value = "/search/serviceSearch", method = RequestMethod.GET)
	public @ResponseBody
	String serviceSearch(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ProfileVO> profiles = null;
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		try {
			Object profilesObjectList = entitySearchService.search(searchVO);
			profiles =entitySearchService.convertObjectListToProfileVoList(profilesObjectList);
			if (profiles != null) {
				data = gson.toJson(profiles);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	/* Code to get Service values ends here */

	// FETCH MESSAGEID'S FROM LUCENE BASED ON THE SELECTED MESSAGETYPE AND
	// PATIENTID
	@RequestMapping(value = "/search/archivetestsearch", method = RequestMethod.GET)
	public @ResponseBody
	String archivetestsearch(@RequestParam String json) {
		String data = "";
		List<String> testname = new ArrayList<String>();
		Gson gson = new GsonBuilder().create();
		List<String> archiveMessageIds = new ArrayList<String>();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		System.out.println(searchVO);
		testname.addAll(searchVO.getTestName());
		try {
			archiveMessageIds = messageIndex.searchDocument("subscriberId",
					searchVO);
			System.out.println(archiveMessageIds);
			if (archiveMessageIds != null) {
				data = gson.toJson(archiveMessageIds);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/search/messagetypenamelist", method = RequestMethod.GET)
	public @ResponseBody
	String messageTypeName(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		/* List<String> tests = new ArrayList<String>(); */

		List<ConceptVO> concepts = new ArrayList<ConceptVO>();
		List<Concept> conceptList = new ArrayList<Concept>();
		conceptList = conceptService.findAllByProperty("conceptClasses.name",
				searchVO.getMessageType(), Concept.class);
		Iterator<Concept> iterator = conceptList.iterator();
		int numberOfRecords = searchVO.getMax();
		for (int i = 0; iterator.hasNext() && i < numberOfRecords; i++) {
			Concept concept = iterator.next();
			concepts.add(new ConceptVO(concept.getName(), concept
					.getDescription(), concept.getConceptClasses(), concept
					.getConceptAttributes(), concept.getSmallIcon(), concept
					.getShortName()));
		}
		data = gson.toJson(concepts);
		return data;
	}

	@RequestMapping(value = "/search/messagetypelist", method = RequestMethod.GET)
	public @ResponseBody
	String messageTypes(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<ConceptVO> concepts = new ArrayList<ConceptVO>();
		List<Concept> conceptList = new ArrayList<Concept>();
		conceptList = conceptService.findAllByProperty("conceptClasses.name",
				"MasterDomain", Concept.class);
		Iterator<Concept> iterator = conceptList.iterator();
		while (iterator.hasNext()) {
			Concept concept = iterator.next();
			concepts.add(new ConceptVO(concept.getName(), concept
					.getDescription(), concept.getConceptClasses(), concept
					.getConceptAttributes(), concept.getSmallIcon(), concept
					.getShortName()));
		}
		data = gson.toJson(concepts);
		return data;
	}

	@RequestMapping(value = "/archive/getArchivedMessage", method = RequestMethod.GET)
	public @ResponseBody
	String getArchivedMessage(@RequestParam String json) {
		Gson gson = new GsonBuilder().create();
		MessageVO vo = gson.fromJson(json, MessageVO.class);
		try {
			messageService.getMessage(vo);
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}

		return vo.getMessage();
	}

	/**
	 * Query the enity list based on conditionMap from Lucene using
	 * SearchService.
	 */
	@RequestMapping(value = "/search/licenseeSearch", method = RequestMethod.GET)
	public @ResponseBody
	String licenseeSearch(@RequestParam String json,
			@RequestParam HashMap<String, String> conditionMap) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessMessageFilterCondition processMessageFilterCondition = gson
				.fromJson(conditionMap.get("conditionMap"),
						ProcessMessageFilterCondition.class);
		List<ListItem> conditionMaps = processMessageFilterCondition.getMaps();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		List<ProfileVO> profiles = null;
		try {
			searchVO.setConditionMaps(conditionMaps);
			Object profilesObjectList = licenseeSearchService.search(searchVO);
			profiles = entitySearchService.convertObjectListToProfileVoList(profilesObjectList);

			if (profiles != null) {
				data = gson.toJson(profiles);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	/**
	 * Query the checkedin patient from Lucene using SearchService.
	 */
	@RequestMapping(value = "/search/checkedinPatient", method = RequestMethod.GET)
	public @ResponseBody
	String getCheckedinPatient(@RequestParam String searchVO,
			@RequestParam String entityState,
			@RequestParam HashMap<String, String> conditionMap) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessMessageFilterCondition processMessageFilterCondition = gson
				.fromJson(conditionMap.get("conditionMap"),
						ProcessMessageFilterCondition.class);
		List<ListItem> conditionMaps = processMessageFilterCondition.getMaps();
		EntityState entity = gson.fromJson(entityState, EntityState.class);
		SearchVO search = gson.fromJson(searchVO, SearchVO.class);
		List<ProfileVO> profiles = null;
		try {

			List<EntityState> entityStateList = entityStateService
					.getStates(entity);

			List<ListItem> updatedConditionMaps = new ArrayList<ListItem>();
			for (ListItem listItem : conditionMaps) {
				listItem.setLogicalOperator("AND");
				updatedConditionMaps.add(listItem);
			}
			for (EntityState entityStateItem : entityStateList) {
				ListItem listItem = new ListItem();
				listItem.setKey("subscriberId");
				listItem.setValue(entityStateItem.getEntityid());
				listItem.setLogicalOperator("OR");
				updatedConditionMaps.add(listItem);
			}
			search.setConditionMaps(updatedConditionMaps);
			Object profilesObjectList = entitySearchService.search(search);
			profiles = entitySearchService.convertObjectListToProfileVoList(profilesObjectList);
			entitySearchService.updateTime(profiles, entityStateList);
			if (profiles != null) {
				data = gson.toJson(profiles);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}
	
	@RequestMapping(value = "/search/messageSearchWithCondtion", method = RequestMethod.GET)
	public @ResponseBody
	String messageSearchWithCondtion(@RequestParam String json,
			@RequestParam HashMap<String, String> conditionMap) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		ProcessMessageFilterCondition processMessageFilterCondition = gson
				.fromJson(conditionMap.get("conditionMap"),
						ProcessMessageFilterCondition.class);
		List<ListItem> conditionMaps = processMessageFilterCondition.getMaps();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
		List<String> messageIdList = new ArrayList<String>();
		List<com.hin.domain.Message> messageList = null;
		try {
			searchVO.setConditionMaps(conditionMaps);
			Object profilesObjectList = searchService.search(searchVO);
			for (Object ListObjArray : (List) profilesObjectList) {
				for (ListItem ListObj : (List<ListItem>) ListObjArray) {
					if (((ListItem) ListObj).getKey().equals("messageId")) {
						messageIdList.add(((ListItem) ListObj).getValue());
					}
				}

			}
			messageList = messageService.getMessages(messageIdList, true);
			if (messageList != null) {
				System.out.println("************************* \n messageList :"+messageList.size()); 
				data = gson.toJson(messageList);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@RequestMapping(value = "/search/productSearch", method = RequestMethod.GET)
	public @ResponseBody
	String productSearch(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
	
		List<ProductVO> products = null;
		try {
			Object productVOObjectList = productSearchService.search(searchVO);
			products = productSearchService.convertObjectListToProductVOList(productVOObjectList);
			if (products != null) {
				data = gson.toJson(products);
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}
	
	@RequestMapping(value = "/search/getLuceneIndex", method = RequestMethod.GET)
	public @ResponseBody
	String getLuceneIndex(@RequestParam String json) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		SearchVO searchVO = gson.fromJson(json, SearchVO.class);
	    ISearchService searchService=  SearchService.getSearchService(searchVO,this.applicationContext);
		try {
			Object ObjectList = searchService.search(searchVO);
			if (ObjectList != null) {
				data =(String)ObjectList;
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
		return data;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext=applicationContext;
	}
	

}
