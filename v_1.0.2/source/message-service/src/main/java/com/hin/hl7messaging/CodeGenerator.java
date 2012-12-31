package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import com.hin.domain.Message;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.ICodeGenarator;
import com.hin.hl7messaging.cassandra.ICassandraConnector;
import com.hin.hl7messaging.configuration.generator.XMLHelper;

@Service(value = "codeGenerator")
public class CodeGenerator implements ICodeGenarator {

//	@Resource(name = "identityMessageRepository")
//	private IIdentityRepository repository;
	
	@Autowired
	private ICassandraConnector cassandraConnector;

	public String getNewMessageCode(MessageVO messageVO){
		String messageCode="";
		messageCode=getCode(messageVO,getCurrentNum(messageVO));
		if(messageCode==null ||messageCode.length()<=1){
			messageCode=createNewMessageCode(messageVO);
		}
		return messageCode;
	}
	
	public String getCurrentNum(MessageVO messageVO){
		Map<String, HashMap<String, String>> resultMessageMap = null;
		if(messageVO.getType().contains("LICENSEE")){
			resultMessageMap = cassandraConnector.retrieveStandardColumnFamily("MESSAGECODEDETAILS","HINORGLICENSEE",messageVO.getOrganizationId());
		}else{
			resultMessageMap = cassandraConnector.retrieveStandardColumnFamily("MESSAGECODEDETAILS",messageVO.getOrganizationId()+ messageVO.getType(),messageVO.getOrganizationId());
		}
		List<String> columnList = new ArrayList<String>();
		columnList.add("CURRENTNUM");
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues = cassandraConnector.getColumnValues(columnList,
					subscriberIdEntry);
			if (!columnValues.isEmpty()) {
				return columnValues.get("CURRENTNUM").get(0).toString();
			}
		}
		return "1";
	}
	private String getCode(MessageVO messageVO,String currentNum){
		String messageCode="";
		if (messageVO.getRegion() != null
				&& messageVO.getRegion().length() > 1) {
			messageCode = messageVO.getRegion() ;
		}else{
			messageCode="ME";
		}
		if (messageVO.getMasterLicensceeId() != null && messageVO.getMasterLicensceeId().length()>1) {
			String masterLicensceeCode = getLicensceeCode(messageVO.getMasterLicensceeId(),messageVO.getOrganizationId());
			if (masterLicensceeCode != null && masterLicensceeCode.length() > 1) {
				messageCode = messageCode + "-" + masterLicensceeCode;
			}
		}else{
			messageCode = messageCode + "-01" ;
		}
		if (messageVO.getLicenseeId() != null) {
			String LicensceeCode = getLicensceeCode(messageVO
					.getLicenseeId(),messageVO.getOrganizationId());
			if (LicensceeCode != null && LicensceeCode.length()>0) {
				messageCode =setMinimumLength(LicensceeCode,messageCode);
			}else{
				messageCode = messageCode + "-001" ;
			}
		}
		else{
			messageCode = messageCode + "-001" ;
		}
		messageCode =setMinimumLength(currentNum,messageCode);

		System.out.println( messageCode+currentNum.toString());
		return messageCode;
	}
	private String setMinimumLength(String currentNum,String messageCode){
		switch(currentNum.length()){
		case 0:messageCode = messageCode+"-0001";
				break;
		case  1:messageCode = messageCode+"-000";
				break;
		case  2:messageCode = messageCode+"-00";
		break;
		case  3:messageCode = messageCode+"-0";
			break;
		 default:
			messageCode = messageCode+"-";
			break;
		}
		messageCode = messageCode+currentNum.toString();
		return messageCode;
	}
	private String createNewMessageCode(MessageVO messageVO){
		String columnFamily="MESSAGECODEDETAILS";
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("ROWKEY", messageVO.getOrganizationId()+ messageVO.getType());
		map.put("PREFIX",messageVO.getRegion());
		map.put("SUFFIX",messageVO.getLicenseeType());
		map.put("CURRENTNUM","1");
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,messageVO.getOrganizationId());
		return getCode(messageVO,"1");
	}
	public void updateMessageCode(MessageVO messageVO){
		String columnFamily="MESSAGECODEDETAILS";
		HashMap<String, Object> map = new HashMap<String, Object>();
		List<Message> messageList = new ArrayList<Message>();
		Map<String, HashMap<String, String>> resultMessageMap = null;
		if(messageVO.getType().contains("LICENSEE")){
			resultMessageMap = cassandraConnector.retrieveStandardColumnFamily("MESSAGECODEDETAILS","HINORGLICENSEE",messageVO.getOrganizationId());
		}else{
			resultMessageMap = cassandraConnector.retrieveStandardColumnFamily("MESSAGECODEDETAILS",messageVO.getOrganizationId()+ messageVO.getType(),messageVO.getOrganizationId());
		}
		List<String> columnList = new ArrayList<String>();
		columnList.add("CURRENTNUM");
		HashMap<String, List<String>> columnValues = new HashMap<String, List<String>>();
		Iterator iterator = resultMessageMap.entrySet().iterator();
		while (iterator.hasNext()) {
	    	Map.Entry subscriberIdEntry = (Map.Entry) iterator.next();
			columnValues=cassandraConnector.getColumnValues(columnList,subscriberIdEntry);
			if(messageVO.getType().contains("LICENSEE")){
				map.put("ROWKEY","HINORGLICENSEE");
			}else{
				map.put("ROWKEY", messageVO.getOrganizationId()+messageVO.getType());
			}
			Integer currentNum=1;
			if(columnValues.get("CURRENTNUM")!=null){
			currentNum=Integer.parseInt(columnValues.get("CURRENTNUM").get(0).equals("")?"1":columnValues.get("CURRENTNUM").get(0));
			}
			currentNum=currentNum+1;
			map.put("CURRENTNUM",currentNum.toString());
		}
		cassandraConnector.saveStandardColumnFamily(map, columnFamily,messageVO.getOrganizationId());
	}
	
	public String getLicensceeCode(String messageId,String organizationId){
		String columnFamily = "LICENSEE_ST";
		return cassandraConnector.getColumnValue(columnFamily,messageId, "MESSAGECODE",organizationId).toString();
	}

}
