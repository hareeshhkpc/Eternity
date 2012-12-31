package com.hin.hl7messaging;

import java.io.File;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPathConstants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.core.repo.indexing.IMessageIndexRepository;
import com.hin.domain.index.IndexBase;
import com.hin.domain.vo.StatisticsVO;
import com.hin.hl7messaging.api.IStatisticsService;
import com.hin.hl7messaging.utils.XMLHelper;

@Service(value = "statisticsService")
public class StatisticsService implements IStatisticsService{
	
	@Value("${messageConfig.dirPath}")
	private String messageConfigDirPath;
	
	@Autowired
	private IMessageIndexRepository repository;
	
	public static Map<String, String> messageTypeDomainMap = new HashMap<String, String>();
	static {
		messageTypeDomainMap.put("PRPA_MT201000HT03", "com.hin.domain.index.Registration");
		messageTypeDomainMap.put("POLB_MT004000HT01_BloodTest", "com.hin.domain.index.ObservationBattery");
		messageTypeDomainMap.put("FIAB_MT020000HT02_FEES", "com.hin.domain.index.FinancialTransaction");
		messageTypeDomainMap.put("PRPA_MT410001HT02", "com.hin.domain.index.EncounterAppointment");
		messageTypeDomainMap.put("POLB_MT004000HT01_ABI", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Bioclip", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Biospace", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_CAC", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Cardioscan", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Elastometer", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_IMT", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Labs", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_MCG", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_SphygmoCor", "com.hin.domain.index.DiagnosticTestResult");
		messageTypeDomainMap.put("POLB_MT004000HT01_Thyroflex", "com.hin.domain.index.DiagnosticTestResult");
	}

	public void insertIntoIndex(String message,String messageId,String program, String facility) throws Exception{
		String artifactId="";
		Document messageDocument = XMLHelper.getXMLDocument(message);
		String documentType = messageDocument.getDocumentElement().getAttribute("config");
		if (messageConfigDirPath == null) {
			messageConfigDirPath = "E://message-configuration";
		}
		File configureFile = new File(messageConfigDirPath + File.separator+ documentType + ".xml");
		Document configurationdocument = XMLHelper.getXMLDocument(configureFile);
		NodeList indexNodeList = (NodeList) XMLHelper.read(configurationdocument,"//HL7MessageConfiguration/MetaInfo",XPathConstants.NODESET);
		for (int i = 0; i < indexNodeList.getLength(); i++) {
			Node node = indexNodeList.item(i);
			Element element = (Element) node;
			artifactId = element.getAttribute("artifactID");
		}
		String messageClass = "";
		messageClass = messageTypeDomainMap.get(artifactId);
		if(messageClass!=null && !messageClass.equals("")){
			Calendar cal = Calendar.getInstance();
			IndexBase index = (IndexBase) Class.forName(messageClass).newInstance();
			index.setDay(cal.get(Calendar.DATE)+0);
			index.setMonth(cal.get(Calendar.MONTH)+1);
			index.setYear(cal.get(Calendar.YEAR));
			index.setMessageIds(messageId.toCharArray());
			index.setStatus("Completed");
			index.setCount(1);
			index.setProgram(program);
			index.setFacility(facility);
			repository.updateIndexDetails(index, messageClass);
		}
		//}
	}
	
	public StatisticsVO fetchStatisticsDetails(int year, int month, String messageType, String program, String status, String facility) throws ClassNotFoundException{
		StatisticsVO statisticsVO = new StatisticsVO();
		Calendar calendar = Calendar.getInstance();
		calendar.set(year, month-1, 1);
		int size = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
		String indexClass = null;
		int[] dayCount = new int[size];
		
		indexClass = messageTypeDomainMap.get(messageType);
		List dayWiseSumForMonth = repository.queryIndexForMonth(indexClass, messageType, program, month, year,status,facility);
		for(Object a : dayWiseSumForMonth){
			Object[] array=(Object[])a;
			dayCount[Integer.parseInt(array[1].toString())-1] =Integer.parseInt(array[0].toString());
		}
		System.out.println(dayCount.length);
		int dayCountForMonth = repository.queryIndexForMonthCount(indexClass, messageType, program, month, year,status,facility);
		statisticsVO.setDayCount(dayCountForMonth);
		statisticsVO.setDayArray(dayCount);
		return statisticsVO;
	}
}
