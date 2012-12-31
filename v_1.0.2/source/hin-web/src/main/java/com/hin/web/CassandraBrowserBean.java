package com.hin.web;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.faces.event.ActionEvent;
import javax.faces.model.SelectItem;
import javax.swing.JTree;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import com.hin.domain.ListItem;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.web.base.BaseBean;
import com.hin.hl7messaging.configuration.generator.XMLHelper;

@SuppressWarnings("serial")
@Component("cassandraBrowserBean")
@Scope(value = "session")
public class CassandraBrowserBean extends BaseBean {

	private Logger logger = Logger.getLogger(CassandraBrowserBean.class
			.getName());

	@Autowired
	ISearchService searchService;
	@Autowired
	IMessageService messageService;

	@Value("${messageConfig.dirPath}")
	private String messageConfigurationPath;

	private List<ProfileVO> patientList = new ArrayList<ProfileVO>();
	private SearchVO searchVO = new SearchVO();
	private String patientName = "";
	private String messageId;
	private Boolean showListView = Boolean.FALSE;
	private Boolean showXmlView = Boolean.FALSE;
	private Boolean showTextView = Boolean.FALSE;
	private String messageXml = null;
	private String messageHeader = "";
	private MessageVO messageVO = new MessageVO();
	private NodeList messagesNodeList = null;
	private List<String> msgNodeList = new ArrayList<String>();
	private List<IndexFieldsVO> indexFieldsVOList = new ArrayList<IndexFieldsVO>();
	private List<SelectItem> roleList = new ArrayList<SelectItem>();

	/**
	 * @return the patientList
	 * @throws Exception
	 */
	public void patientSearch() throws Exception {
		if (!patientName.isEmpty()) {
			patientList = autocompletePatient(patientName);
		} else {
			patientList = autocompletePatient("");
		}
	}

	public String showList() {
		showListView = Boolean.FALSE;
		return null;
	}

	@SuppressWarnings("unchecked")
	public List<ProfileVO> autocompletePatient(Object suggest) throws Exception {
		searchVO.setMax(100);
		searchVO.setValue((String) suggest.toString());
		searchVO.setMessageType("PRPA_MT201000HT03");
		if (searchVO.getValue().isEmpty() && !searchVO.getRole().equals("all")) {
			searchVO.setQueryString("+(Role:" + searchVO.getRole() + ")");
		} else if (searchVO.getValue().isEmpty()
				&& searchVO.getRole().equals("all")) {
			searchVO.setQueryString("+(alldoc:all)");
		} else if (!searchVO.getValue().isEmpty()
				&& searchVO.getRole().equals("all")) {
			searchVO.setQueryString("+alldoc:" + searchVO.getRole()
					+ " +subscriberType:" + searchVO.getMessageType()
					+ " +((+(givenName:" + searchVO.getValue()
					+ "* familyName:" + searchVO.getValue()
					+ "*))(  membershipId:" + searchVO.getValue() + "))");
		} else {
			if (searchVO.getValue().isEmpty()) {
				searchVO.setValue("a");
			}
			searchVO.setQueryString("+Role:" + searchVO.getRole()
					+ " +subscriberType:" + searchVO.getMessageType()
					+ " +((+(givenName:" + searchVO.getValue()
					+ "* familyName:" + searchVO.getValue()
					+ "*))(  membershipId:" + searchVO.getValue() + "))");
		}
		Object profilesObjectList = searchService.search(searchVO);
		showListView = Boolean.FALSE;
		List<ProfileVO> profileVOList = new ArrayList<ProfileVO>();
		if (profilesObjectList != null) {
			for (Object ListObjArray : (List) profilesObjectList) {
				List<ListItem> listItem = (List<ListItem>) ListObjArray;
				ProfileVO profileVO = (ProfileVO) fillData(listItem);
				profileVOList.add(profileVO);
			}
		}
		// messageList = messageService.getMessages(messageIdList, true);
		return profileVOList;
	}

	public Object fillData(List<ListItem> list) {
		ProfileVO profileVO = new ProfileVO();
		for (ListItem ListObj : list) {
			if (((ListItem) ListObj).getKey().equals("subscriberId")) {
				profileVO.setSubscriberId(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("prefixName")) {
				profileVO.setPrefixName(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("givenName")) {
				profileVO.setGivenName(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("suffixName")) {
				profileVO.setSuffixName(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("familyName")) {
				profileVO.setFamilyName(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("image")) {
				profileVO.setImageBase64(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("organizationId")) {
				profileVO.setOrganizationId(((ListItem) ListObj).getValue());
			} else if (((ListItem) ListObj).getKey().equals("Role")) {
				profileVO.setRole(((ListItem) ListObj).getValue());
			}/*
			 * else if (((ListItem) ListObj).getKey().equals("createddate")) {
			 * SimpleDateFormat sdf=new SimpleDateFormat("yyyy-mm-dd HH:mm:ss");
			 * try { String num = ((ListItem) ListObj).getValue(); Date parsed =
			 * sdf.parse(num.substring(0, 13));
			 * profileVO.setCreateddate(parsed); } catch (ParseException e) {
			 * e.printStackTrace(); } }
			 */
		}
		profileVO.setName(profileVO.getFullName());
		return profileVO;
	}

	public String getPath(String path) {
		String shortPath = null;
		int idx = path.lastIndexOf('/');
		if (idx != -1) {
			shortPath = path.substring(idx + 1);
		} else {
			shortPath = path;
		}
		return shortPath;
	}

	public String loadCasandraXmlDet() {
		System.out.println("messageId :" + messageId);
		try {
			messageXml = messageService.getMessage(messageId,"");
			/*
			 * System.out.println("messageStr \n "+messageXml); Document
			 * xmlDocument = XMLHelper.getXMLDocument(messageXml);
			 * messagesNodeList = (NodeList)
			 * XMLHelper.read(xmlDocument,"//message[1]", XPathConstants.NODE);
			 * 
			 * Element root = xmlDocument.getDocumentElement();
			 * 
			 * NodeList nodes = root.getChildNodes(); for (int i = 0; i <
			 * nodes.getLength(); i++) { // String nodePath =
			 * nodes[i].toString(); System.out.println("Planned Duration: 1 "
			 * +((Node)nodes.item(i)).getNodeValue().trim()); NodeList
			 * bookdetails = nodes.item(i).getChildNodes(); String nodePath =
			 * bookdetails.item(i).getTextContent();
			 * System.out.println("Planned Duration: 2 " +nodePath);
			 * msgNodeList.add(getPath(nodePath)); }
			 */
			showListView = Boolean.TRUE;
			showXmlView = Boolean.TRUE;
			showTextView = Boolean.FALSE;
			messageHeader = "XML Message";
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	private Document getConfigureDocument(Document document) {
		String documentType = document.getDocumentElement().getAttribute(
				"config");

		if (messageConfigurationPath == null) {
			messageConfigurationPath = "E://message-configuration";
		}
		File configureFile = new File(messageConfigurationPath + File.separator
				+ documentType + ".xml");
		return XMLHelper.getXMLDocument(configureFile);
	}

	public String loadCasandraVoDet() {
		System.out.println("messageId :" + messageId);
		List<IndexFieldsVO> fieldsVoList = new ArrayList<IndexFieldsVO>();
		try {
			String messageXml = messageService.getMessage(messageId,"");
			MessageVO messageVO = messageService.createMessageVO(messageXml);
			indexFieldsVOList = messageVO.getIndexFieldVoList();
			if(messageVO!=null){
				//fieldsVoList.add(new IndexFieldsVO(messageVO.get, indexed, "", value, analyzed));
			}
			showListView = Boolean.TRUE;
			showXmlView = Boolean.FALSE;
			showTextView = Boolean.TRUE;
			messageHeader = "Documents Message";
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

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
			Object value = null;
			if (dataType == null || dataType.length() <= 0
					|| dataType.equals("STRING")) {
				value = (String) XMLHelper.read(messageDocument, element
						.getAttribute("xpath"), XPathConstants.STRING);
			} else if (dataType.equals("LONG")) {
				try {
					String time = XMLHelper.read(messageDocument,
							element.getAttribute("xpath"),
							XPathConstants.STRING).toString();
					if (!time.equals("")) {
						SimpleDateFormat sdf = new SimpleDateFormat(
								"yyyy-MM-dd HH:mm:ss");
						Date parsed = sdf.parse(time);
						/*
						 * Calendar newCalendar = Calendar.getInstance(); value
						 * = new Long(newCalendar.getTimeInMillis());
						 */
						value = new Long(parsed.getTime());
					} else {
						value = new Long(0);
					}
				} catch (Exception e) {
					System.out.println("Not able to parse date to long.");
				}

			} else {
				value = (String) XMLHelper.read(messageDocument, element
						.getAttribute("xpath"), XPathConstants.STRING);
			}
			System.out.println("IndexField " + name + " : " + value);
			if (dataType != null)
				indexFields.add(new IndexFieldsVO(name, indexed, "", value,
						analyzed, dataType));
			else
				indexFields.add(new IndexFieldsVO(name, indexed, "", value,
						analyzed));

		}

		return indexFields;
	}

	public List<ProfileVO> getPatientList() {
		return this.patientList;
	}

	/**
	 * @param patientList
	 *            the patientList to set
	 */
	public void setPatientList(List<ProfileVO> patientList) {
		this.patientList = patientList;
	}

	/**
	 * @return the searchVO
	 */
	public SearchVO getSearchVO() {
		return searchVO;
	}

	/**
	 * @param searchVO
	 *            the searchVO to set
	 */
	public void setSearchVO(SearchVO searchVO) {
		this.searchVO = searchVO;
	}

	/**
	 * @return the searchService
	 */
	public ISearchService getSearchService() {
		return searchService;
	}

	/**
	 * @param searchService
	 *            the searchService to set
	 */
	public void setSearchService(ISearchService searchService) {
		this.searchService = searchService;
	}

	/**
	 * @return the patientName
	 */
	public String getPatientName() {
		return patientName;
	}

	/**
	 * @param patientName
	 *            the patientName to set
	 */
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	/**
	 * @return the roleList
	 */
	public List<SelectItem> getRoleList() {
		searchVO.setRole("all");
		if (roleList.isEmpty()) {
			SelectItem selectItem = new SelectItem();
			selectItem.setLabel("All");
			selectItem.setValue("all");
			roleList.add(selectItem);
			selectItem = new SelectItem();
			selectItem.setLabel("Patient");
			selectItem.setValue("patient");
			roleList.add(selectItem);
			selectItem = new SelectItem();
			selectItem.setLabel("Employee");
			selectItem.setValue("employee");
			roleList.add(selectItem);
			selectItem = new SelectItem();
			selectItem.setLabel("Doctor");
			selectItem.setValue("doctor");
			roleList.add(selectItem);
		}
		return roleList;
	}

	/**
	 * @param roleList
	 *            the roleList to set
	 */
	public void setRoleList(List<SelectItem> roleList) {
		this.roleList = roleList;
	}

	/**
	 * @return the showListView
	 */
	public Boolean getShowListView() {
		return showListView;
	}

	/**
	 * @param showListView
	 *            the showListView to set
	 */
	public void setShowListView(Boolean showListView) {
		this.showListView = showListView;
	}

	/**
	 * @return the messageId
	 */
	public String getMessageId() {
		return messageId;
	}

	/**
	 * @param messageId
	 *            the messageId to set
	 */
	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	/**
	 * @return the showXmlView
	 */
	public Boolean getShowXmlView() {
		return showXmlView;
	}

	/**
	 * @param showXmlView
	 *            the showXmlView to set
	 */
	public void setShowXmlView(Boolean showXmlView) {
		this.showXmlView = showXmlView;
	}

	/**
	 * @return the showTextView
	 */
	public Boolean getShowTextView() {
		return showTextView;
	}

	/**
	 * @param showTextView
	 *            the showTextView to set
	 */
	public void setShowTextView(Boolean showTextView) {
		this.showTextView = showTextView;
	}

	/**
	 * @return the messageXml
	 */
	public String getMessageXml() {
		return messageXml;
	}

	/**
	 * @param messageXml
	 *            the messageXml to set
	 */
	public void setMessageXml(String messageXml) {
		this.messageXml = messageXml;
	}

	/**
	 * @return the messageHeader
	 */
	public String getMessageHeader() {
		return messageHeader;
	}

	/**
	 * @param messageHeader
	 *            the messageHeader to set
	 */
	public void setMessageHeader(String messageHeader) {
		this.messageHeader = messageHeader;
	}

	/**
	 * @return the messageVO
	 */
	public MessageVO getMessageVO() {
		return messageVO;
	}

	/**
	 * @param messageVO
	 *            the messageVO to set
	 */
	public void setMessageVO(MessageVO messageVO) {
		this.messageVO = messageVO;
	}

	/**
	 * @return the messagesNodeList
	 */
	public NodeList getMessagesNodeList() {
		return messagesNodeList;
	}

	/**
	 * @param messagesNodeList
	 *            the messagesNodeList to set
	 */
	public void setMessagesNodeList(NodeList messagesNodeList) {
		this.messagesNodeList = messagesNodeList;
	}

	/**
	 * @return the indexFieldsVOList
	 */
	public List<IndexFieldsVO> getIndexFieldsVOList() {
		return indexFieldsVOList;
	}

	/**
	 * @param indexFieldsVOList
	 *            the indexFieldsVOList to set
	 */
	public void setIndexFieldsVOList(List<IndexFieldsVO> indexFieldsVOList) {
		this.indexFieldsVOList = indexFieldsVOList;
	}

}
