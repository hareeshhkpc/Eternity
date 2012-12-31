/**
 * 
 */
package com.hin.domain.vo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.w3c.dom.Document;
import com.hin.domain.InvoiceDetails;

/**
 * @author shilpa.rao
 * 
 */
public class MessageVO {

	private String id;
	private String type;
	private String message;
	private String version = "1";

	private String messageCode = "";

	List<String> participants = new ArrayList<String>();
	List<IndexFieldsVO> indexFieldVoList = new ArrayList<IndexFieldsVO>();
	private String indexDirectoryName = "";
	private String roleName = "";
	private String subscriberId;
	private String docId = "";

	private String name = "";
	private String password = "";
	private HashMap<String, String> permissionMap = new HashMap<String, String>();
	private boolean isPermissionMessage = false;
	private String taskId = "";
	private String AssigneId = "";
	private String outCome = "";
	private String userid = "";
	private String organizationId = "";
	private String region = "HIN";
	private String LicenseeType = "BRANCH";
	
	private String transactionType = "";

	private String LicenseeId = "";
	private String MasterLicensceeId = "";
	
	private Document messageDocument = null;
	private Document configarationDocument = null;

	private boolean finish;
	private boolean deleted;

	private InvoiceDetails invoiceDetails = null;
	
	private String organizationName="";
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * @param message
	 *            the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getMessageCode() {
		return messageCode;
	}

	public void setMessageCode(String messageCode) {
		this.messageCode = messageCode;
	}

	public List<String> getParticipants() {
		return participants;
	}

	public void setParticipants(List<String> participants) {
		this.participants = participants;
	}

	public List<IndexFieldsVO> getIndexFieldVoList() {
		return indexFieldVoList;
	}

	public void setIndexFieldVoList(List<IndexFieldsVO> indexFieldVoList) {
		this.indexFieldVoList = indexFieldVoList;
	}

	public String getIndexDirectoryName() {
		return indexDirectoryName;
	}

	public void setIndexDirectoryName(String indexDirectoryName) {
		this.indexDirectoryName = indexDirectoryName;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	
	public String getTransactionType() {
		return transactionType;
	}

	public void setTransactionType(String transactionType) {
		this.transactionType = transactionType;
	}
	
	

	public String getSubscriberId() {
		return subscriberId;
	}

	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

	public String getDocId() {
		return docId;
	}

	public void setDocId(String docId) {
		this.docId = docId;
	}
	
	public Document getMessageDocument() {
		return messageDocument;
	}

	public void setMessageDocument(Document messageDocument) {
		this.messageDocument = messageDocument;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public HashMap<String, String> getPermissionMap() {
		return permissionMap;
	}

	public void setPermissionMap(HashMap<String, String> permissionMap) {
		this.permissionMap = permissionMap;
	}

	public boolean isPermissionMessage() {
		return isPermissionMessage;
	}

	public void setIsPermissionMessage(boolean isPermissionMessage) {
		this.isPermissionMessage = isPermissionMessage;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getAssigneId() {
		return AssigneId;
	}

	public void setAssigneId(String assigneId) {
		AssigneId = assigneId;
	}

	public String getOutCome() {
		return outCome;
	}

	public void setOutCome(String outCome) {
		this.outCome = outCome;
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getOrganizationId() {
		return organizationId;
	}

	public void setOrganizationId(String organizationId) {
		this.organizationId = organizationId;
	}
	
	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getLicenseeType() {
		return LicenseeType;
	}

	public void setLicenseeType(String licenseeType) {
		LicenseeType = licenseeType;
	}

	/**
	 * @return the finish
	 */
	public boolean isFinish() {
		return finish;
	}

	/**
	 * @param finish
	 *            the finish to set
	 */
	public void setFinish(boolean finish) {
		this.finish = finish;
	}

	/**
	 * @return the deleted
	 */
	public boolean isDeleted() {
		return deleted;
	}

	/**
	 * @param deleted
	 *            the deleted to set
	 */
	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getLicenseeId() {
		return LicenseeId;
	}

	public void setLicenseeId(String licenseeId) {
		LicenseeId = licenseeId;
	}

	public String getMasterLicensceeId() {
		return MasterLicensceeId;
	}

	public void setMasterLicensceeId(String masterLicensceeId) {
		MasterLicensceeId = masterLicensceeId;
	}

	public InvoiceDetails getInvoiceDetails() {
		return invoiceDetails;
	}

	public void setInvoiceDetails(InvoiceDetails invoiceDetails) {
		this.invoiceDetails = invoiceDetails;
	}

	public Document getConfigarationDocument() {
		return configarationDocument;
	}

	public void setConfigarationDocument(Document configarationDocument) {
		this.configarationDocument = configarationDocument;
	}

	/**
	 * @return the organizationName
	 */
	public String getOrganizationName() {
		return organizationName;
	}

	/**
	 * @param organizationName the organizationName to set
	 */
	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

}
