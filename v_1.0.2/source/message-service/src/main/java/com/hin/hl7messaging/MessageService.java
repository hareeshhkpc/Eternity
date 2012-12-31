
package com.hin.hl7messaging;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.ListItem;
import com.hin.domain.Message;
import com.hin.domain.ProcessMessageFilterCondition;
import com.hin.domain.vo.DocumentsVO;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IArchiveMessageService;
import com.hin.hl7messaging.api.ICodeGenarator;
import com.hin.hl7messaging.api.IEntitySearchService;
import com.hin.hl7messaging.api.IGenerateSubscriberIdService;
import com.hin.hl7messaging.api.IIdentityService;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IInvoiceSvgService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.IOrganizationService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.hl7messaging.cassandra.ICassandraConnector;
import com.hin.hl7messaging.configuration.generator.XMLHelper;
import com.hin.hl7messaging.utils.WorkFlowContants;
import com.hin.service.IMessageParticipantService;
import com.hin.service.impl.ConceptService;

@Service(value = "messageService")
public class MessageService implements IMessageService {
	
	Properties messageServiceConfig = new Properties();

	@Resource(name = "identityMessageRepository")
	private IIdentityRepository identityRepository;
	
	@Resource(name = "identityService")
	private IIdentityService identityService;
	
	@Resource(name = "codeGenerator")
	private ICodeGenarator codeGenarator;
	
	@Autowired
	private ICassandraConnector cassandraConnector;

	@Autowired
	IGenerateSubscriberIdService generateSubscriberIdService;
	@Autowired
	IIndexService indexService;
	@Autowired
	ConceptService conceptService;
	@Autowired
	IInvoiceSvgService invoiceSvgService;
	
	@Value("${messageConfig.dirPath}")
	private String messageConfigurationPath;
	
	@Value("${messageConfig.idXPath}")
	private String messageIdXpath;
	
	@Value("${messageConfig.typeXPath}")
	private String messageTypeXpath;
	
	@Value("${messageConfig.docIdXPath}")
	private String messageDocIdXpath;
	
	@Value("${messageConfig.roleNameXPath}")				
	private String messageRoleNameXpath;
	
	@Value("${messageConfig.subscriberIdXPath}")
	private String messageSubscriberIdXpath;
	
	@Value("${messageConfig.userNameIdXpath}")
	private String messageUserNameIdXpath;
	
	@Value("${messageConfig.passwordXpath}")
	private String messagePasswordXpath;
	
	@Value("${messageConfig.participantXpath}")
	private String participantXpath;
	
	@Value("${messageConfig.transactionTypeXpath}")
	private String transactionTypeXpath;
	
	@Value("${messageConfig.registartionType}")
	private String registartionType;
	
	@Value("${messageConfig.taskIdXPath}")
	private String taskIdXPath;
	
	@Value("${messageConfig.taskOutComeXPath}")
	private String taskOutComeXPath;
	
	@Value("${messageConfig.taskAsigneeXPath}")
	private String taskAsigneeXPath;
	
	@Value("${FileAttachment.ATTACHMENT_DIR}")
	private String ATTACHMENT_DIR;
	
	
	@Value("${messageConfig.regionXPath}")
	private String regionXPath;
	
	@Value("${messageConfig.LicenseeTypeXPath}")
	private String LicenseeTypeXPath;
	

	@Value("${messageConfig.LicenseeXPath}")
	private String LicenseeXPath;
	
	//@Value("${cassandra.masterKeySpace}")
	private String masterKeySpace="HINORG";
	
	private String storeExtension="_ST";
	
	private String ISACTIVE="ISACTIVE";
	
	@Autowired
	IMessageParticipantService messageParticipantService;
	
	@Autowired
	IArchiveMessageService archiveMessageService;
	
	@Autowired
	ISearchService searchService;
	
	@Autowired
	IEntitySearchService entitySearchService;
	
	@Autowired
	IOrganizationService organizationService;

	private Logger logger = Logger.getLogger(MessageService.class.getName());

	public String getMessageIdXpath() {
		return messageIdXpath;
	}

	public void setMessageIdXpath(String messageIdXpath) {
		this.messageIdXpath = messageIdXpath;
	}

	public String getMessageTypeXpath() {
		return messageTypeXpath;
	}

	public void setMessageTypeXpath(String messageTypeXpath) {
		this.messageTypeXpath = messageTypeXpath;
	}

	public String getMessageDocIdXpath() {
		return messageDocIdXpath;
	}

	public void setMessageDocIdXpath(String messageDocIdXpath) {
		this.messageDocIdXpath = messageDocIdXpath;
	}

	public String getMessageRoleNameXpath() {
		return messageRoleNameXpath;
	}

	public void setMessageRoleNameXpath(String messageRoleNameXpath) {
		this.messageRoleNameXpath = messageRoleNameXpath;
	}

	public String getMessageSubscriberIdXpath() {
		return messageSubscriberIdXpath;
	}

	public void setMessageSubscriberIdXpath(String messageSubscriberIdXpath) {
		this.messageSubscriberIdXpath = messageSubscriberIdXpath;
	}
	
	@Override
	public MessageVO getMessage(MessageVO messageVO) {
		String subscriberId = "", message = "";
		
		Map<String, String> messageTypeMap = new HashMap<String, String>();
		messageTypeMap.put("PRPA_MT201000HT03", "SUBSCRIBER_PROFILE");
		messageTypeMap.put("POXX_MT111000HT02_Labs", "POXX_MT111000HT02_Labs");
		
		if(messageVO.getType() == null || messageVO.getType().length() < 1){
			messageVO.setType("PRPA_MT201000HT03");
		}
		
		String columnFamily = messageVO.getType();
		
		Map<String, HashMap<String, String>> resultMap = cassandraConnector.retrieveStandardColumnFamily(columnFamily, messageVO.getId(),"");
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		Iterator<String> iterator = resultMap.keySet().iterator();

		while (iterator.hasNext()) {
			subscriberId = iterator.next();
			columnValueMap = resultMap.get(subscriberId);
			message = columnValueMap.get("MESSAGE");
		}

		messageVO.setMessage(message);
		return messageVO;
	}

	private String updateMessage(String messageXML, String attrName,
			String value) {
		Document xmlDocument = XMLHelper.getXMLDocument(messageXML);

		NodeList nodeList = (NodeList) XMLHelper.read(xmlDocument, attrName,
				XPathConstants.NODESET);
		if (nodeList.getLength() < 1) {
			return messageXML;
		} else {
			Node node = nodeList.item(0);
			node.setNodeValue(value);
		}
		return XMLHelper.getXMLDocumentAsString(xmlDocument);

	}
	
	
	@Override
	public void createUser(MessageVO messageVO) {
		createRole(messageVO);
	}
	
	private void createSubscriber(MessageVO messageVO){
		identityService.createSubscriber(messageVO);
	}
	
	private void createRole(MessageVO messageVO){
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("MESSAGE", messageVO.getMessage());
		columnValueMap.put("BLOCKED", "FALSE");
		columnValueMap.put("ROLE_STATUS", "ACTIVE");
		columnValueMap.put("ROLE_NAME", messageVO.getRoleName());
		identityRepository.saveSuperColumn("ROLE", messageVO.getSubscriberId(),messageVO.getId(),
				columnValueMap);
	}
	private void deleteRole(MessageVO messageVO){
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROLE_STATUS", "INACTIVE");
		System.out.println("Deleting role User ID :"+messageVO.getSubscriberId() +" RoleId :" +messageVO.getId() );
		identityRepository.saveSuperColumn("ROLE", messageVO.getSubscriberId(),messageVO.getId(),
				columnValueMap);
	}
	private void createLuceneIndex(MessageVO messageVO) {
		if (messageVO.getType().equals(registartionType) || messageVO.getRoleName().length()>1) {
			String roles = messageVO.getRoleName();
			if (messageVO.getSubscriberId() != null
					&& messageVO.getSubscriberId().length() > 1) {
				roles=getCurrentRole(messageVO);
				String msgXml = getMessage(messageVO.getSubscriberId(),messageVO.getOrganizationId());
				if (msgXml != null && msgXml.length() > 1) {
					MessageVO newMessageVO = null;
					if (messageVO.getType().equals(registartionType) ){
						newMessageVO = messageVO;
					}else{
						newMessageVO = createMessageVO(msgXml);
					}
					newMessageVO.getIndexFieldVoList()
							.add(new IndexFieldsVO("Role", "true", "", roles,
									"true"));
					System.out.println("Roles  for user "+messageVO.getSubscriberId()  +"   : "+roles);
					indexService.updateIndexForMessageVo(newMessageVO);
					return;
				}
			}
			messageVO.getIndexFieldVoList().add(
					new IndexFieldsVO("Role", "true", "", roles, "true"));
		}
		if (messageVO.getVersion().equals("1")) {
			indexService.createIndexForMessageVo(messageVO);
		} else {
			indexService.updateIndexForMessageVo(messageVO);
		}
	}
	private void createLuceneIndex1(MessageVO messageVO) {
		if (messageVO.getType().equals(registartionType) || messageVO.getRoleName().length()>1) {
			String roles = messageVO.getRoleName();
			if (messageVO.getSubscriberId() != null
					&& messageVO.getSubscriberId().length() > 1) {
				roles=getCurrentRole(messageVO);
				SearchVO searchVO=new SearchVO();
				searchVO.setMessageType(registartionType);
				searchVO.setQueryString("messageId:"+messageVO.getSubscriberId());
				Object IndexFiledList=searchService.search(searchVO);
				if (IndexFiledList != null && !( (List<Object>)IndexFiledList).isEmpty()) {
					MessageVO newMessageVO=new MessageVO();
					if (messageVO.getType().equals(registartionType) ){
						newMessageVO = messageVO;
						newMessageVO.getIndexFieldVoList()
						.add(new IndexFieldsVO("Role", "true", "", roles,
								"true"));
					}else{
						newMessageVO.setId(messageVO.getSubscriberId());
						newMessageVO.setType(registartionType);
						for(Object IndexFileds:(List<Object>)IndexFiledList){
							for(IndexFieldsVO lstItem:(List<IndexFieldsVO>)IndexFileds){
								if(lstItem.getName().equals("Role")){
									newMessageVO.getIndexFieldVoList()
									.add(new IndexFieldsVO("Role", "true", "", roles,
											"true"));
								}else{
								newMessageVO.getIndexFieldVoList().add(lstItem);
								}
							}
						}
					}
					indexService.updateIndexForMessageVo(newMessageVO);
					return;
				}
			messageVO.getIndexFieldVoList().add(
					new IndexFieldsVO("Role", "true", "", roles, "true"));
			}
		}
		if (messageVO.getVersion().equals("1")) {
			indexService.createIndexForMessageVo(messageVO);
		} else {
			indexService.updateIndexForMessageVo(messageVO);
		}
	}
/*
	public String getRoleName(MessageVO messageVO) {
		if (messageVO.getType().equals("ROLE_PATIENT")) {
			return "Patient";
		} else if (messageVO.getType().equals("ROLE_PHYSICIAN")) {
			return "Doctor";
		} else if (messageVO.getType().equals("ROLE_EMPLOYEE")) {
			return "Employee";
		} else if (messageVO.getType().equals("ROLE_USER")) {
			return "User";
		}
		return "";
	}*/
	public String getCurrentRole(MessageVO messageVO){
		String roles = messageVO.getRoleName();
		List<ListItem> conditionMaps = new ArrayList<ListItem>();
		ListItem listItem = new ListItem();
		listItem.setKey("messageId");
		listItem.setValue(messageVO.getSubscriberId());
		listItem.setLogicalOperator("AND");
		conditionMaps.add(listItem);
		SearchVO searchVO = new SearchVO();
		searchVO.setMessageType(registartionType);
		searchVO.setConditionMaps(conditionMaps);
		Object profileVoList = entitySearchService.search(searchVO);
		if (profileVoList != null) {
			List<Object> List=(List<Object>) profileVoList;
			if(!List.isEmpty()){
				ProfileVO profileVO=(ProfileVO)List.get(0);
				String existingRole = profileVO.getRole();
				roles=createNewRoleString(messageVO,existingRole);
			}
		}
		return roles;
	}
	private String createNewRoleString(MessageVO messageVO,String existingRole){
		String roles=messageVO.getRoleName();
		String newRoles="";
		String[] existingRoles=existingRole.split(",");
		if (existingRole == null
			|| existingRole.length() < 1) {
			return roles;
		}
		for(int i=0;i<existingRoles.length;i++){
			if(!existingRoles[i].equals(roles)){
				newRoles=newRoles +existingRoles[i] +",";
			}
			if(i==existingRoles.length-1){
				newRoles=newRoles.substring(0, newRoles.length()-1);
			}
		}
		if (roles.length() > 1  &&  !messageVO.isDeleted()) {
			newRoles = newRoles + "," + roles;
		} 
		return newRoles;
	}
	public String getMessage(String messageId,String organizationId) {
		try{
		String messageType = cassandraConnector.getColumnValue("MESSAGE_ID_TYPE",
				messageId, "MESSAGETYPE",organizationId);
		String messageStr="";
		if (messageType != null && messageType.length() > 1) {
			String isAstive = cassandraConnector.getColumnValue(messageType
					+ storeExtension, messageId, ISACTIVE,organizationId);
			if(isAstive!=null && !isAstive.equals("FALSE")){
			String versionString = cassandraConnector.getColumnValue(messageType
					+ storeExtension, messageId, "VERSION",organizationId);
			Integer version = Integer.parseInt(versionString.equals("") ? "1"
					: versionString);
			messageStr=cassandraConnector.getColumnValue(messageType + storeExtension, messageId,
					version.toString(),organizationId);
			 logger.info("Retriving message Id :"+messageId);
			 System.out.println("Retriving message Id :"+messageId);
			}else{
				 logger.info("Message not Active :"+messageId);
				 System.out.println("Message not Active:"+messageId);
			}
			return messageStr;
		}else{
			// logger.info("MESSAGETYPE not found in MESSAGE_ID_TYPE column family for message Id :"+messageId);
			// System.out.println("MESSAGETYPE not found in MESSAGE_ID_TYPE column family for message Id :"+messageId);
			String versionString = cassandraConnector.getColumnValue("MESSAGE_STORE", messageId, "VERSION","");
			Integer version = Integer.parseInt(versionString.equals("") ? "1"
					: versionString);
			messageStr=cassandraConnector.getColumnValue("MESSAGE_STORE", messageId,
					version.toString(),"");
			// logger.info("Retriving message Id :"+messageId+ " Message  :"+messageStr);
			// System.out.println("Retriving message Id :"+messageId+ " Message  :"+messageStr);
			return messageStr;
		}
		}catch(Exception e){
			// logger.info("Error wile reading Message ID:"+messageId+" Error :"+e.getMessage());
			// System.out.println("Error wile reading Message ID:"+messageId+" Error :"+e.getMessage());
		}
		return "";
	}
	public String getMessageStatus(String messageId,String organizationId) {
		String messageType = cassandraConnector.getColumnValue("MESSAGE_ID_TYPE",
				messageId, "MESSAGETYPE",organizationId);
		if (messageType != null && messageType.length() > 1) {
			return cassandraConnector.getColumnValue(messageType + storeExtension, messageId, "MESSAGESTATUS",organizationId);
		}
		return "";
	}
	public void updateMessageStatus(MessageVO messageVO) {
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		columnValueMap.put("ROWKEY", messageVO.getId());
		columnValueMap.put("MESSAGESTATUS", WorkFlowContants.MessageStatus.COMPLETED);
		cassandraConnector.saveStandardColumnFamily(columnValueMap, messageVO.getType() + storeExtension,messageVO.getOrganizationId());
	}
	public void updateMessage(MessageVO messageVO) {
		String columnFamily = messageVO.getType() + storeExtension;
		String versionString = cassandraConnector.getColumnValue(columnFamily,
				messageVO.getId(), "VERSION",messageVO.getOrganizationId());
		Integer version = Integer.parseInt(versionString.equals("") ? "1"
				: versionString);
		cassandraConnector.getColumnValue(columnFamily, messageVO.getId(),
				version.toString(),messageVO.getOrganizationId());
		version = version + 1;
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageVO.getId());
		map.put(version.toString(), messageVO.getMessage());
		map.put("VERSION", version.toString());
		map.put("MESSAGETYPE", messageVO.getType());
		map.put("MESSAGESTATUS", WorkFlowContants.MessageStatus.LOCKED);
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,messageVO.getOrganizationId());
	}
	
	public void saveMessage(MessageVO messageVO) throws Exception {
		String columnFamily = messageVO.getType()+storeExtension;
		cassandraConnector.createColumnFamily(columnFamily,messageVO.getOrganizationId());
		String versionString=cassandraConnector.getColumnValue(columnFamily, messageVO.getId(), "VERSION",messageVO.getOrganizationId());
		Integer version =  Integer.parseInt(versionString.equals("")?"0":versionString);
		version=version+1;
		messageVO.setVersion(version.toString());
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageVO.getId());
		map.put(version.toString(), messageVO.getMessage());
		map.put("VERSION", version.toString());
		map.put("MESSAGETYPE", messageVO.getType());
		map.put("MESSAGESTATUS", WorkFlowContants.MessageStatus.LOCKED);
		map.put(ISACTIVE, "TRUE");
		
		if(!messageVO.isPermissionMessage()){
			createLuceneIndex(messageVO);
		}
		if(messageVO.getName().length()>1){
			createSubscriber(messageVO);
		}
		if (messageVO.getRoleName().length()>1 && !messageVO.isPermissionMessage()){
			createRole(messageVO);
		}
		if (!messageVO.getPermissionMap().isEmpty()){
			createRolePermission(messageVO);			
		}
		if (messageVO.getType().contains("POLB")) {
			saveObservation(messageVO);
		}
		if (messageVO.getType().contains("ROLE_DEFINITION")) {
			createRoleDefinition(messageVO);
		}
		if(messageVO.getType().contains("LICENSEE")){
			map.put("MESSAGECODE", codeGenarator.getCurrentNum(messageVO));
		}else{
			map.put("MESSAGECODE", codeGenarator.getNewMessageCode(messageVO));
		}
		
		if(messageVO.getType().equals("FIAB_MT020000HT02")){
			   if(messageVO.getTransactionType().equals("Invoice")){
				   invoiceSvgService.generatePdf(messageVO);
			   }
		}	
		if(messageVO.getType().contains("COCT")){
			setOrganizationName(messageVO);
			organizationService.createOrganizationKeySpace(messageVO);
		}
		//addIndexColumns(messageVO);
		HashMap<String, Object> messageIDTypeMap = new HashMap<String, Object>();
		messageIDTypeMap.put("ROWKEY", messageVO.getId());
		messageIDTypeMap.put("MESSAGETYPE", messageVO.getType());
		cassandraConnector.saveStandardColumnFamily(messageIDTypeMap, "MESSAGE_ID_TYPE",messageVO.getOrganizationId());
		messageParticipantService.saveMessageParticipant(messageVO.getParticipants(), messageVO.getId(),messageVO.getOrganizationId());
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,messageVO.getOrganizationId());
		archiveMessageService.archiveMessage( messageVO, "");
		codeGenarator.updateMessageCode(messageVO);
	}
	
	
	
	public void removeMessage(MessageVO messageVO) throws Exception{
		//cassandraConnector.dropRow(messageVO.getType()+storeExtension, messageVO.getId());
		HashMap<String, Object> map = new HashMap<String, Object>();
		String columnFamily=messageVO.getType()+storeExtension;
		map.put("ROWKEY", messageVO.getId());
		map.put(ISACTIVE, "FALSE");
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,messageVO.getOrganizationId());
		for(IndexFieldsVO indexFieldsVO: messageVO.getIndexFieldVoList()){
			if(indexFieldsVO.getName().equals(ISACTIVE)){
				indexFieldsVO.setValue("FALSE");
			}
		}
		System.out.println("Role name :" +messageVO.getRoleName());
		if (messageVO.getRoleName().length()>1 && !messageVO.isPermissionMessage()){
			deleteRole(messageVO);
		}
		String versionString=cassandraConnector.getColumnValue(columnFamily, messageVO.getId(), "VERSION",messageVO.getOrganizationId());
		Integer version =  Integer.parseInt(versionString.equals("")?"0":versionString);
		version=version+1;
		messageVO.setVersion(version.toString());
		createLuceneIndex(messageVO);
	}
	private void addIndexColumns(MessageVO messageVO) throws Exception{
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageVO.getId());
		for(IndexFieldsVO indexFieldsVO:messageVO.getIndexFieldVoList()){
			map.put(indexFieldsVO.getName(),indexFieldsVO.getValue());
		}
	
			cassandraConnector.saveStandardColumnFamily(map, messageVO.getType()+"_INDEX",messageVO.getOrganizationId());
		
	}
	
	
	
/*	  private String getOrganizationId(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   orgnaizationXPath, XPathConstants.STRING);
		   return value;
	  }*/
	   
	  public DocumentsVO createDocumentsVO(String messageXml){
		  DocumentsVO documentsVO=new DocumentsVO();
		  Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		  documentsVO.setDocumentDate(getDocumentDate(messageDocument));
		  documentsVO.setDocumentName(getDocumentName(messageDocument));
		  documentsVO.setSubscriberId(getSubscriberIdForDocuments(messageDocument));
		  documentsVO.setMessageId(getMessageIdForDocument(messageDocument));
		  documentsVO.setDocumentFileType(getDocumentFileType(messageDocument));
		  File file = new File(ATTACHMENT_DIR + "/" + documentsVO.getSubscriberId() + "/" + documentsVO.getMessageId() + documentsVO.getDocumentFileType());
		  //converting the file size from byte to Kb
		  documentsVO.setDocumentFileSize(file.length()/1024l);
		  documentsVO.setDocumentType(getDocumentType(messageDocument));
		  return documentsVO;
	  }
	   
	  public MessageVO createMessageVO(String messageXml){
		   //TODO:Remove "System.out.println"
		   //System.out.println("*******************************Creating message Object from message xml*******************************************");
		   logger.info("*******************************Creating message Object from message xml*******************************************");
		   MessageVO messageVO=new MessageVO();
		   Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		   Document configureDocument = getConfigureDocument(messageDocument);
		   String messageType=getMessageType(messageDocument);
		   messageVO.setMessageDocument(messageDocument);
		   logger.info("Saving message type :"+messageType);
		   //System.out.println("Saving message type :"+messageType);
		   String messageId=getMessageId(messageDocument);
		   logger.info("messageID :"+messageId);
		   //System.out.println("messageID :"+messageId);
		   messageVO.setMessage(messageXml);
		   //System.out.println("messageXml :"+messageXml);
		   messageVO.setType(messageType);
		   messageVO.setId(messageId);
		   messageVO.setRoleName(getRoleName(messageDocument));
		   logger.info("RoleName :"+messageVO.getRoleName());
		   
		   String transactionType = getFinanceTransactionType(messageDocument);
		   messageVO.setTransactionType(transactionType);
		   //System.out.println("RoleName :"+messageVO.getRoleName());
		   messageVO.setParticipants(getParticipants(messageDocument));
		   logger.info("Participants :"+messageVO.getParticipants());
		   //System.out.println("Participants :"+messageVO.getParticipants());
		   messageVO.setIndexFieldVoList(getIndexFields(messageDocument,configureDocument));
		   messageVO.setIndexDirectoryName(getIndexDirName(configureDocument));
		   logger.info("IndexDirectoryName :"+messageVO.getIndexDirectoryName());
		   //System.out.println("IndexDirectoryName :"+messageVO.getIndexDirectoryName());
		   messageVO.setSubscriberId(getSubscriberId(messageDocument));
		   logger.info("Subscriber ID :"+messageVO.getSubscriberId());
		   //System.out.println("Subscriber ID :"+messageVO.getSubscriberId());
		   messageVO.setName(getUserName(messageDocument));
		   logger.info("UserName :"+messageVO.getName());
		   //System.out.println("UserName :"+messageVO.getName());
		   messageVO.setPassword(getPasswordName(messageDocument));
		   messageVO.setDocId(getDocID(messageDocument));
		   messageVO.setTaskId(getTaskId(messageDocument));
		   logger.info("TaskId :"+messageVO.getName());
		   //System.out.println("TaskId :"+messageVO.getName());
		   messageVO.setOutCome(getTaskOutCome(messageDocument));
		   logger.info("TaskOutCome :"+messageVO.getOutCome());
		   //System.out.println("TaskOutCome :"+messageVO.getOutCome());
		   messageVO.setAssigneId(getTaskAssignee(messageDocument));
		   logger.info("AssigneeID :"+messageVO.getAssigneId());
		   //System.out.println("AssigneeID :"+messageVO.getAssigneId());
		   setPermission(messageVO,messageDocument);
		   messageVO.setOrganizationId(getOrganizationId(messageVO));
		   logger.info("OrganizationID :"+messageVO.getOrganizationId());
		   System.out.println("OrganizationID :"+messageVO.getOrganizationId());
		   //System.out.println("******************************************************************************************************************");
		   logger.info("******************************************************************************************************************");
		  return messageVO;
	  }
	  private String getOrganizationId(MessageVO messageVO){
		  for(IndexFieldsVO indexFieldsVO:messageVO.getIndexFieldVoList()){
			  if(indexFieldsVO.getName().equals("organizationId")){
				  return indexFieldsVO.getValue().toString();
			  }		  
		  }
		   return "";
	  }
	  private void setOrganizationName(MessageVO messageVO){
		  String organizationName = (String) XMLHelper.read(messageVO.getMessageDocument(),
				  "//name/prefix", XPathConstants.STRING);
		  messageVO.setOrganizationName(organizationName);
	  }
	  private String getDocumentDate(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				  "//effectiveTime/value", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getDocumentName(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				"//title/value", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getSubscriberIdForDocuments(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				"//recordTarget/patientRole/patient/id/extension", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getMessageIdForDocument(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				"//id[root='HIN_MSG_ID']/extension", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getDocumentFileType(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				"//component/structuredBody/component/section/text/language", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getDocumentType(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				  "//id[root='DOCUMENT_TYPE']/extension", XPathConstants.STRING);
		  if(value==null){
			  value="";
		  }
		  return value;
	  }
	  private String getTaskOutCome(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				  taskOutComeXPath, XPathConstants.STRING);
		   return value;
		  
	  }
	  private String getTaskAssignee(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				  taskAsigneeXPath, XPathConstants.STRING);
		   return value;
		  
	  }
	  private String getTaskId(Document messageDocument){
		  String value = (String) XMLHelper.read(messageDocument,
				  taskIdXPath, XPathConstants.STRING);
		   return value;
	  }
	  private List<String>  getParticipants(Document messageDocument){
			List<String> participantList = new ArrayList<String>();
			NodeList nodeList = (NodeList) XMLHelper.read(messageDocument,
					participantXpath,
					XPathConstants.NODESET);
			System.out.println(nodeList.toString());
			
			for (int i = 0; i < nodeList.getLength(); i++) {
					//Node node = nodeList.item(i);
					//Element roleElement = (Element) nodeList.item(i);
					//System.out.println(roleElement.getChildNodes().getLength());
					//Element idElement = (Element) ((Element) roleElement)
					//		.getElementsByTagName("id").item(0);
					//if (idElement != null && idElement.getAttribute("extension") != null) {
						participantList.add( nodeList.item(i).getTextContent());
					//}
			}
			return participantList;
	  }
	  private void setPermission( MessageVO messageVO,Document messageDocument){
		  for(int i=1; i<=8 ; i++){
		  String permission = (String) XMLHelper.read(messageDocument,
				  "//message/ROLE_PERMISSION/permission["+i+"]/id/root", XPathConstants.STRING);
		  String value = (String) XMLHelper.read(messageDocument,
				"//message/ROLE_PERMISSION/permission["+i+"]/id/extension", XPathConstants.STRING);
		  if(!permission.isEmpty() && permission.length()>1){
			  messageVO.setIsPermissionMessage(true);
		  }
		  if(!permission.isEmpty() && permission.length()>1 && value!=null && !value.equals("") ){
			  messageVO.getPermissionMap().put(permission, value); 	
		  }
		  }
		 
	  }
	   private String getMessageType(Document messageDocument){
			String value = (String) XMLHelper.read(messageDocument,
					messageTypeXpath, XPathConstants.STRING);
		   return value;
	   }
	   private String getMessageId(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messageIdXpath, XPathConstants.STRING);
		   return value;
	   }
	   private String getDocID(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messageDocIdXpath, XPathConstants.STRING);
		   return value;
	   }
	   private String getSubscriberId(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messageSubscriberIdXpath, XPathConstants.STRING);
		   return value;
	   }
	   private String getRoleName(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messageRoleNameXpath, XPathConstants.STRING);
		   return value;
	   }
	   
	   private String getUserName(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messageUserNameIdXpath, XPathConstants.STRING);
		   return value;
	   }
	   
	   private String getPasswordName(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   messagePasswordXpath, XPathConstants.STRING);
		   return value;
	   }
		private String getIndexDirName(Document configureDocument) {
			NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,
					"//HL7MessageConfiguration/IndexConfiguration",
					XPathConstants.NODESET);
			String value = "";
			for (int i = 0; i < indexNodeList.getLength(); i++) {
				Node node = indexNodeList.item(i);
				Element element = (Element) node;
				value = element.getAttribute("indexName");
			}
			return  value;
		}
		private Document getConfigureDocument(Document document) {
			String documentType = document.getDocumentElement().getAttribute("config");

			if (messageConfigurationPath == null) {
				messageConfigurationPath = "E://message-configuration";
			}
			File configureFile = new File(messageConfigurationPath + File.separator
					+ documentType + ".xml");
			return XMLHelper.getXMLDocument(configureFile);
		}

	/*  private List<String> getParticipants(Document messageDocument,Document configureDocument) {
		  	List<String> participantList = new ArrayList<String>();
			NodeList nodeList = (NodeList) XMLHelper.read(configureDocument,
					"//Class[@rimType='ROLE' or @rimType='ENTITY']",
					XPathConstants.NODESET);
			System.out.println(nodeList);
			for (int i = 0; i < nodeList.getLength(); i++) {
				Node node = nodeList.item(i);
				System.out.println("Name: "
						+ ((Element) node).getAttribute("tagName"));
				NodeList List = messageDocument.getElementsByTagName(((Element) node)
						.getAttribute("tagName"));
				for (int k = 0; k < List.getLength(); k++) {
					Element roleElement = (Element) List.item(k);
					System.out.println(roleElement.getChildNodes().getLength());

					Element idElement = (Element) ((Element) roleElement)
							.getElementsByTagName("id").item(0);
					if (idElement != null && idElement.getAttribute("extension") != null) {
						participantList.add(idElement.getAttribute("extension"));
					}
				}
			}
			return participantList;
		}*/
	  private List<IndexFieldsVO> getIndexFields(Document messageDocument,
				Document configureDocument) {
			List<IndexFieldsVO> indexFields = new ArrayList<IndexFieldsVO>();
			NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,
					"//HL7MessageConfiguration/IndexConfiguration/Field",
					XPathConstants.NODESET);
			for (int i = 0; i < indexNodeList.getLength(); i++) {
				Node node = indexNodeList.item(i);
				Element element = (Element) node;
				String name = element.getAttribute("name");
				String indexed = element.getAttribute("indexed");
				String analyzed = element.getAttribute("analyzed");
				String dataType = element.getAttribute("dataType");
				Object value=null;
				if(dataType==null||dataType.length()<=0 || dataType.equals("STRING")){
				 value = (String) XMLHelper.read(messageDocument,
						element.getAttribute("xpath"), XPathConstants.STRING);
				}else if(dataType.equals("LONG")){
					try {
						String time = XMLHelper.read(messageDocument,
								element.getAttribute("xpath"), XPathConstants.STRING).toString();
						if(!time.equals("")){
							SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
							Date parsed = sdf.parse(time);
							/*Calendar newCalendar = Calendar.getInstance();
							value = new Long(newCalendar.getTimeInMillis());*/
							value = new Long(parsed.getTime());
						}else{
							value= new Long(0);
						}
					} catch (Exception e) {
						System.out.println("Not able to parse date to long.");
					}
				
				}else{
					 value = (String) XMLHelper.read(messageDocument,
								element.getAttribute("xpath"), XPathConstants.STRING);
				}
				// System.out.println("IndexField "+name + " : " +  value);
				if(dataType!=null)
					indexFields.add(new IndexFieldsVO(name, indexed, "", value, analyzed,dataType));
				else
					indexFields.add(new IndexFieldsVO(name, indexed, "", value, analyzed));

			}
			indexFields.add(new IndexFieldsVO(ISACTIVE, "true", "", "TRUE", "false"));
			return indexFields;
		}
	
	  
	public List<Message> getUserMessagesForCondition(String userId,ProcessMessageFilterCondition processMessageFilterCondition,boolean messageRequired,String organizationId) throws Exception{
		List<Message> messageList = new ArrayList<Message>();
		for(ListItem listItem: processMessageFilterCondition.getMaps()){
			//List<Message> msgList= getUserMessagesForCondition(userId,listItem.getKey().toString(),listItem.getValue().toString(),messageRequired);
			List<Message> msgList=getUserMessagesForConditionFromLucene(userId,listItem.getKey().toString(),listItem.getValue().toString(),messageRequired,organizationId);
			if(msgList!=null){
				messageList.addAll(msgList);
			}
		}

		return messageList;
	}
	public List<Message> getUserMessagesForCondition(String userId,String messageType,String condtion,boolean messageRequired) throws Exception{
		List<Message> messageList=null;
		String conditionalString="";
		
		if(condtion.length()>0){
			conditionalString=condtion/*+" and "+ getmessageIdString(userId)*/;
		}else{
			conditionalString=getmessageIdString(userId);
		}
		if(conditionalString.length()>1){
			Map<String, HashMap<String, String>> resultMap = cassandraConnector.retrieveStandardColumnFamilyForCondition(messageType+"_INDEX",conditionalString,"");
			if(!resultMap.isEmpty()){
			 messageList= getMessageList(messageType,resultMap,messageRequired);
			}
		}
		return messageList;
	}
	public List<Message> getUserMessagesForConditionFromLucene(String userId,String messageType,String condtion,boolean messageRequired,String organizationId) throws Exception{
		List<Message> messageList=null;
		String conditionalString="";
		if(condtion.length()>0){
			conditionalString=condtion/*+" and "+ getmessageIdString(userId)*/;
		}else{
			conditionalString=getmessageIdStringForLucene(userId,organizationId);
		}
		HashMap<String, String> messageTransactionTypeMap=new HashMap<String, String>();
		List<String> List=new ArrayList<String>();
		if(conditionalString.length()>1){
		SearchVO searchVO = new SearchVO();
		searchVO.setMessageType(messageType);
		searchVO.setQueryString(conditionalString);
		searchVO.setMax(100);
		List<ListItem> listItemList=null;
		Object profileVoList = searchService.search(searchVO);
		String messageId="";
		
		if (profileVoList != null ) {
			for(Object profileVo:(List<Object>)profileVoList){
			messageId="";
			listItemList=(List<ListItem>) profileVo;
			for(ListItem lstItem: listItemList){
				if(lstItem.getKey().equals("messageId")){
					List.add(lstItem.getValue());
					messageId=lstItem.getValue();
				}
				if(messageId.length()>1 && lstItem.getKey().equals("transactionType")){
					messageTransactionTypeMap.put(messageId,lstItem.getValue());
				}
			}
			}
		}
		}
		
		logger.info("################################################################");
		logger.info("Message Id List from Lucene :"+List);
		logger.info("################################################################");
		
		messageList=getMessages(List,messageRequired);
		
		logger.info("################################################################");
		logger.info("Size Of MessageList : "+messageList.size());
		logger.info("################################################################");
		
		updatemessageTransactionType(messageList,messageTransactionTypeMap);
		return messageList;
	}
	private void updatemessageTransactionType( List<Message> messageList,HashMap<String, String> messageTransactionTypeMap){
		Iterator iterator = messageTransactionTypeMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry messageIdEntry = (Map.Entry) iterator.next();
	    	for(Message message:messageList){
	    		if(message.getMessageId().equals(messageIdEntry.getKey())){
	    			message.setTransactionType(messageIdEntry.getValue().toString());
	    		}
	    	}
		}
		
	}
	private String getmessageIdStringForLucene(String userId,String organizationId) throws Exception{
		List<String> messageList=messageParticipantService.getUserMessages(userId,organizationId);
		String messageCondition="";
		for(String message:messageList){
			if(message.length()>1){
				if(messageCondition.length()>0){
					messageCondition=messageCondition+" messageId:"+message  ;
				}
				else{
					messageCondition="+ ( messageId:" + message +"";
				}
			}
		}
		if(messageCondition.length()>1){
		messageCondition=messageCondition+" )";
		}
		return messageCondition;
	}
	private String getmessageIdString(String userId) throws Exception{
	//	List<String> messageList=messageParticipantService.getUserMessages(userId);
		String messageCondition="";
	/*	for(String message:messageList){
			if(message.length()>1){
				if(messageCondition.length()>0){
					messageCondition=messageCondition+", '"+message  +"'";
		//			System.out.println("aa");
				}
				else{
					messageCondition="KEY IN ( '" + message +"'";
				}
			}
		}
		if(messageCondition.length()>1){
		messageCondition=messageCondition+" )";
		}*/
		return messageCondition;
	}
	private List<Message> getMessageList(String messageType,Map<String, HashMap<String, String>> resultMap,boolean messageRequired){
		List<Message> messageList;
		List<String> messageIdList=cassandraConnector.getColumnValue(resultMap, "KEY");
		return getMessages(messageIdList,messageRequired);
	}
	public List<Message> getMessages(List<String> messageIdList,boolean messageRequired){
		String conditionalString=createConditionString(messageIdList);
		if(conditionalString.equals(""))
			return new ArrayList<Message>();
		return getMessgeFromMessageTypeStore(conditionalString,messageRequired);
	}
	private String createConditionString(List<String> messageIdList){
		String messageIds="";
		if(messageIdList==null)
			return null;
		for(String messageId:messageIdList){
			
			if(messageIds.length()>0)
				messageIds=messageIds+","+ messageId;
			else
				messageIds=messageId;
		}
		if(messageIds.length()<=1){
			return "";
		}
		String conditionalString= "KEY IN ("+messageIds+")";
		System.out.println("conditional string :"+conditionalString);
		return conditionalString;
	}
	private HashMap<String, List<String>> getMessageColumnFamily(String conditionalString){
		HashMap<String, List<String>> messageKeyMap=new HashMap<String, List<String>>();
		Map<String, HashMap<String, String>> resultMessageMap = cassandraConnector.retrieveStandardColumnFamilyForCondition("MESSAGE_ID_TYPE",conditionalString,"");
		List<String> columnList = new ArrayList<String>();
		columnList.add("KEY");
		columnList.add("MESSAGETYPE");
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
	    	Message message=new Message();
			columnValues=cassandraConnector.getColumnValues(columnList,subscriberIdEntry);
			if(columnValues != null){
				if(columnValues.get("MESSAGETYPE") !=null && !columnValues.get("MESSAGETYPE").isEmpty()){
					if(messageKeyMap.containsKey(columnValues.get("MESSAGETYPE").get(0))){
						messageKeyMap.get(columnValues.get("MESSAGETYPE").get(0)).add(columnValues.get("KEY").get(0));
					}else{
						List<String> messageIdList=new ArrayList<String>();
						messageIdList.add(columnValues.get("KEY").get(0));
						messageKeyMap.put(columnValues.get("MESSAGETYPE").get(0), messageIdList);
					}
				}
				
			}
		}
		return messageKeyMap;
	}
	private List<Message> getMessgeFromMessageTypeStore(String conditionalString,boolean messageRequired){
		List<Message> messageList = new ArrayList<Message>();
		HashMap<String, List<String>> messageTypeMap = getMessageColumnFamily(conditionalString);
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		List<String> columnList = new ArrayList<String>();
		columnList.add("MESSAGETYPE");
		Iterator iterator = messageTypeMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			List<String> messageIdList = (List<String>) subscriberIdEntry
					.getValue();
			String msgTypeConditionalString = createConditionString(messageIdList);
			messageList.addAll(getMessageFromMessageStore(subscriberIdEntry
					.getKey().toString(), msgTypeConditionalString,
					messageRequired));
		}
		return messageList;
	}
	private List<Message> getMessageFromMessageStore(String messageType,String conditionalString,boolean messageRequired){
		List<Message> messageList = new ArrayList<Message>();
		Map<String, HashMap<String, String>> resultMessageMap = cassandraConnector.retrieveStandardColumnFamilyForCondition(messageType+storeExtension,conditionalString,"");
		List<String> columnList = new ArrayList<String>();
		columnList.add("KEY");
		columnList.add("MESSAGESTATUS");
		columnList.add("MESSAGETYPE");
		columnList.add("VERSION");
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
	    	Message message=new Message();
			columnValues=cassandraConnector.getColumnValues(columnList,subscriberIdEntry);
			if(columnValues != null){
				if(columnValues.get("KEY") != null && !columnValues.get("KEY").isEmpty()){
					message.setMessageId(columnValues.get("KEY").get(0));
				}
				if(columnValues.get("MESSAGESTATUS") != null && !columnValues.get("MESSAGESTATUS").isEmpty()){
					message.setMessageStatus(columnValues.get("MESSAGESTATUS").get(0));
				}
				if(columnValues.get("MESSAGETYPE") !=null && !columnValues.get("MESSAGETYPE").isEmpty()){
					message.setMessageType(columnValues.get("MESSAGETYPE").get(0));	
				}
				if(messageRequired){
					List<String> versionColumnList = new ArrayList<String>();
					String messageString= null;
					if(columnValues.get("VERSION") != null && !columnValues.get("VERSION").isEmpty()){
						String versionString=columnValues.get("VERSION").get(0);
						versionColumnList.add(versionString);
						messageString=cassandraConnector.getColumnValues(versionColumnList,subscriberIdEntry).get(versionString).get(0);
						message.setMessage(messageString);
					}
				}
			}
			messageList.add(message);
		}
		return messageList;
	}
	private void createRolePermission(MessageVO messageVO){
		HashMap<String, Object> permissionIndexMap = new HashMap<String, Object>();
		permissionIndexMap.put("ROWKEY", messageVO.getRoleName());
		Iterator iterator =  messageVO.getPermissionMap().entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			permissionIndexMap.put(subscriberIdEntry.getKey().toString(),subscriberIdEntry.getValue().toString());
		}
		cassandraConnector.saveStandardColumnFamily(permissionIndexMap, "PERMISSION",messageVO.getOrganizationId());
		
	}
	private void saveObservation(MessageVO messageVO) {
		Calendar cal = Calendar.getInstance();		
		int month = cal.get(Calendar.MONTH);
		int day = cal.get(Calendar.DATE);
		int year = cal.get(Calendar.YEAR);		
		cal.clear();
		cal.set(year, month, day);	
		Date onlyDate = cal.getTime();		
		String fullDate = Long.toString(onlyDate.getTime());		
		String patientId = "";
		for (IndexFieldsVO indexFieldsVO : messageVO.getIndexFieldVoList()) {
			HashMap<String, Object> chartMap = new HashMap<String, Object>();
			if (indexFieldsVO.getName().equals("subscriberId")) {
				patientId = (String) indexFieldsVO.getValue();
			}
			if (indexFieldsVO.getName().contains("_observationTest_")) {
				chartMap.put("MESSAGE", messageVO.getMessage());
				chartMap.put("PATIENT_ID", patientId);
				chartMap.put("ROWKEY", patientId+ "_"
						+ messageVO.getType() + ""
						+ indexFieldsVO.getName().toString());
				chartMap.put(fullDate, indexFieldsVO.getValue()
						.toString());
				cassandraConnector.saveStandardColumnFamily(chartMap,
						"PATIENT_OBSERVATIONS",messageVO.getOrganizationId());
			}
		}
	}

	@Override
	public String getCouchLastSequence() throws Exception {
		String lastSequence = "", value = "";
		Map<String, HashMap<String, String>> lastCacheSequenceMap = cassandraConnector.retrieveStandardColumnFamily("COUCH_SEQUENCE", "couchSequence",masterKeySpace);
		HashMap<String, String> columnValueMap = new HashMap<String, String>();
		if (!lastCacheSequenceMap.isEmpty()) {
			columnValueMap = lastCacheSequenceMap.get("couchSequence");
			Iterator<String> columnValueMapIterator = columnValueMap.keySet().iterator();
			while (columnValueMapIterator.hasNext()) {
				lastSequence = columnValueMapIterator.next();
				value = columnValueMap.get(lastSequence);
				return value;
			}
		}
		return null;
	}

	@Override
	public void updateCouchLastSequence(String sequence) throws Exception {
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		columnValueMap.put("ROWKEY", "couchSequence");
		columnValueMap.put("LASTSEQUENCE", sequence);
		cassandraConnector.saveStandardColumnFamily(columnValueMap, "COUCH_SEQUENCE",masterKeySpace);
	}
	
	
	 public String getNewPatientCode(String organizationId){
		 String messageXml=getMessage(organizationId,organizationId);
		 Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		 String LicenseeId=getLicenseeId(messageDocument);
		 String licenseeMessageXml=getMessage(LicenseeId,organizationId);
		 Document licenseeMessageDocument = XMLHelper.getXMLDocument(licenseeMessageXml);
		 MessageVO  messageVO=new MessageVO();
		 messageVO.setOrganizationId(organizationId);
		 messageVO.setType(registartionType);
		 messageVO.setLicenseeType(getLicenseeType(licenseeMessageDocument));
		 messageVO.setRegion(getRegion(messageDocument));
		 messageVO.setLicenseeId(LicenseeId);
		 String msgCode=codeGenarator.getNewMessageCode(messageVO);
		 codeGenarator.updateMessageCode(messageVO);
		 return msgCode;
	 }
	 public String getNewInvoiceCode(String organizationId){
		 String messageXml=getMessage(organizationId,organizationId);
		 Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		 String LicenseeId=getLicenseeId(messageDocument);
		 String licenseeMessageXml=getMessage(LicenseeId,organizationId);
		 Document licenseeMessageDocument = XMLHelper.getXMLDocument(licenseeMessageXml);
		 MessageVO  messageVO=new MessageVO();
		 messageVO.setOrganizationId(organizationId);
		 messageVO.setType("INVOICE");
		 messageVO.setLicenseeType(getLicenseeType(licenseeMessageDocument));
		 messageVO.setRegion(getRegion(messageDocument));
		 messageVO.setLicenseeId(LicenseeId);
		 String msgCode=codeGenarator.getNewMessageCode(messageVO);
		 codeGenarator.updateMessageCode(messageVO);
		 return  "INV-"+msgCode;
	 }
	 public String getNewReceiptCode(String organizationId){
		 String messageXml=getMessage(organizationId,organizationId);
		 Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		 String LicenseeId=getLicenseeId(messageDocument);
		 String licenseeMessageXml=getMessage(LicenseeId,organizationId);
		 Document licenseeMessageDocument = XMLHelper.getXMLDocument(licenseeMessageXml);
		 MessageVO  messageVO=new MessageVO();
		 messageVO.setOrganizationId(organizationId);
		 messageVO.setType("RECEIPT");
		 messageVO.setLicenseeType(getLicenseeType(licenseeMessageDocument));
		 messageVO.setRegion(getRegion(messageDocument));
		 messageVO.setLicenseeId(LicenseeId);
		 String msgCode=codeGenarator.getNewMessageCode(messageVO);
		 codeGenarator.updateMessageCode(messageVO);
		 return "REC-"+msgCode;
	 }
	 public String getNewLicenseeInvoiceCode(String organizationId){
		 String messageXml=getMessage(organizationId,organizationId);
		 Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		 String LicenseeId=getLicenseeId(messageDocument);
		 String licenseeMessageXml=getMessage(LicenseeId,organizationId);
		 Document licenseeMessageDocument = XMLHelper.getXMLDocument(licenseeMessageXml);
		 MessageVO  messageVO=new MessageVO();
		 messageVO.setOrganizationId(organizationId);
		 messageVO.setType("LICENSCEEINVOICE");
		 messageVO.setLicenseeType(getLicenseeType(licenseeMessageDocument));
		 messageVO.setRegion(getRegion(messageDocument));
		 messageVO.setLicenseeId(LicenseeId);
		 String msgCode=codeGenarator.getNewMessageCode(messageVO);
		 codeGenarator.updateMessageCode(messageVO);
		 return "LICINV-"+msgCode;
	 }
	 private String getRegion(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   regionXPath, XPathConstants.STRING);
		   return value;
	 }
	 private String getLicenseeType(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   LicenseeTypeXPath, XPathConstants.STRING);
		   return value;
	 }
	 private String getLicenseeId(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   LicenseeXPath, XPathConstants.STRING);
		   return value;
	 }



	 private void createRoleDefinition(MessageVO messageVO) {
			identityService.createRoleDefinition(messageVO);
	 }
	 
	 private String getFinanceTransactionType(Document messageDocument){
		   String value = (String) XMLHelper.read(messageDocument,
				   transactionTypeXpath, XPathConstants.STRING);
		   value = value.replaceAll("\\n", "").trim();
		   return value;
	 }
	 
}
