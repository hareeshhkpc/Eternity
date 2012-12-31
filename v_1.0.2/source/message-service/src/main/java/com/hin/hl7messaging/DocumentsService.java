/**
 * 
 */
package com.hin.hl7messaging;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TermRangeFilter;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hin.domain.Concept;
import com.hin.domain.vo.DocumentsVO;
import com.hin.domain.vo.FileUploadMessageVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IDocumentsService;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IInvoiceSvgService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.cassandra.CassandraConnector;
import com.hin.service.IConceptService;

/**
 * @author shilpa.rao
 * 
 */
@Service(value = "documentsService")
public class DocumentsService implements IDocumentsService {
	
	@Value("${indexing.LUCENE_INDEX_DIR_PATH}")
	private String INDEX_DIRECTORY;
	
	@Value("${FileAttachment.ATTACHMENT_DIR}")
	private String ATTACHMENT_DIR;
	
	@Value("${htmlToPdfConversionXsl.file}")
	String HTML_PDF_CONVERSION_XSL;
	
	@Value("${tomcat.path}")
	String tomcatPath;
	
	private Logger logger = Logger.getLogger(DocumentsService.class
			.getName());

	//@Resource(name = "identityMessageRepository")
	//private IIdentityRepository repository;
	
	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Autowired
	IMessageService messageService;
	
	@Autowired
	IInvoiceSvgService invoiceSvgService;
	
	@Autowired
	private IConceptService conceptService;
	
	@Autowired
	IIndexService indexService;

	@Override
	public List<String> getDataYearly() {
		List<String> monthData = new ArrayList<String>();
		try{
			
			
			
		}catch(Exception e){
			logger.error("Documents TimeLine error :" + e);
		}
		return null;
	}
	
	@Override
	public List<String> getMessageIdsForMonth(DocumentsVO documentsVO) throws Exception {
		List<String> messageIds = new ArrayList<String>();
		if (documentsVO.getPatientId() != null) {
					File file = new File(INDEX_DIRECTORY + "//" + "POCD_MT000040UV_FileAttachment_Index");
					int hitsPerPage = 100;
					IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);

					BooleanQuery bq = new BooleanQuery();
					Query query1 = new TermQuery(new Term("subscriberId",
							documentsVO.getPatientId()));
					if(!("".equals(documentsVO.getDocumentType()))){
						Query query2 = new TermQuery(new Term("documentType",
								documentsVO.getDocumentType().toLowerCase()));
						bq.add(query2, BooleanClause.Occur.MUST);
					}
					bq.add(query1, BooleanClause.Occur.MUST);
					String lowerTerm = documentsVO.getDocumentFromDate();
					String upperTerm = documentsVO.getDocumentToDate();
					TermRangeFilter filter = new TermRangeFilter("createddate",
							lowerTerm, upperTerm, true, true);
					TopScoreDocCollector collector = TopScoreDocCollector
							.create(hitsPerPage, true);
					searcher.search(bq, filter, collector);
					ScoreDoc[] hits = collector.topDocs().scoreDocs;
					for (int i = 0; i < hits.length; ++i) {
						int docId = hits[i].doc;
						Document d = searcher.doc(docId);
						messageIds.add(d.get("messageId"));
					}
					searcher.close();
				}
		return messageIds;
	}

	@Override
	public List<DocumentsVO> getMessage(List<String> documentsMessageIds,String organizationId) throws Exception {
		List<DocumentsVO> documentsVOs = new ArrayList<DocumentsVO>();
		for(String messageId : documentsMessageIds){
			String messageXml = "";
			String msgId="";
			Map<String, HashMap<String, String>> resultMap = cassandraConnector.retrieveStandardColumnFamily("POCD_MT000040UV_FileAttachment", messageId,organizationId);
			HashMap<String, String> columnValueMap = new HashMap<String, String>();
			Iterator<String> iterator = resultMap.keySet().iterator();
			DocumentsVO documentsVO = new DocumentsVO();
			while (iterator.hasNext()) {
				msgId = iterator.next();
				columnValueMap = resultMap.get(msgId);
				messageXml = columnValueMap.get("MESSAGE");
				documentsVO = messageService.createDocumentsVO(messageXml);
			}
			documentsVOs.add(documentsVO);
		}
		return documentsVOs;
	}
	
	@Override
	public List<String> getAllLegends(){
		List<String> legendsList = new ArrayList<String>();
		List<Concept> conceptList = conceptService.findAllByProperty("conceptClasses.name","ProgressReportLegends", Concept.class);;
		for(Concept c : conceptList){
			legendsList.add(c.getName());
		}
		return legendsList;
	}
	@Override
	public List<String> getLegendForMonth(long startTime, long endTime, String patientId) throws Exception{
		Set<String> legendSet = new HashSet<String>(); 
		List<String> legendList = new ArrayList<String>();
		File file = new File(INDEX_DIRECTORY + "//" + "POCD_MT000040UV_FileAttachment_Index");
		int hitsPerPage = 1000;
		IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);

		BooleanQuery bq = new BooleanQuery();
		Query query1 = new TermQuery(new Term("subscriberId",patientId));
		bq.add(query1, BooleanClause.Occur.MUST);
		String lowerTerm = String.valueOf(startTime);
		String upperTerm = String.valueOf(endTime);
		TermRangeFilter filter = new TermRangeFilter("createddate",
				lowerTerm, upperTerm, true, true);
		TopScoreDocCollector collector = TopScoreDocCollector
				.create(hitsPerPage, true);
		searcher.search(bq, filter, collector);
		ScoreDoc[] hits = collector.topDocs().scoreDocs;
		for (int i = 0; i < hits.length; ++i) {
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);
			String documentType = d.get("documentType");
			if(documentType!=null && !("null".equals(documentType.trim())) && !(documentType.equals(""))){
				legendSet.add(documentType);
			}
		}
		searcher.close();
		legendList.addAll(legendSet);
		return legendList;
	}
	
	public Date getLasteDateOfMonth(int month, int year){
		Calendar c = Calendar.getInstance();
		c.clear();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, month);
		c.set(Calendar.DAY_OF_MONTH, 27);
		
		Date endDateOfMonth = c.getTime();
		
		for(int i = 28; i <= 32; i++){
			c.add(Calendar.DAY_OF_MONTH, 1);
			Date date = c.getTime();
			
			Calendar a = Calendar.getInstance();
			Calendar b = Calendar.getInstance();
			
			a.setTime(endDateOfMonth);
			b.setTime(date);
			
			if((b.get(Calendar.MONTH) > a.get(Calendar.MONTH)) || (b.get(Calendar.YEAR) > a.get(Calendar.YEAR))){
				break;
			}
			
			endDateOfMonth = date;
		}
		
		return endDateOfMonth;
		
	}
	
	public String convertHtmlToPdf(String patientId, String messageId, String invoiceNumber) throws Exception{

		File file = new File(ATTACHMENT_DIR + "/" + patientId + "/" + messageId + ".pdf");
	    FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();
	    fileUploadMessageVO.setFileSize(file.length());
	    fileUploadMessageVO.setFileName("Invoice# " + invoiceNumber);
	    fileUploadMessageVO.setMessageId(messageId);
		fileUploadMessageVO.setDocumentType("Finance");
		fileUploadMessageVO.setFileType("application/pdf");
	    
	    fileUpload(fileUploadMessageVO, patientId, messageId , ".pdf");
		return null;
	}
	
	private void fileUpload(FileUploadMessageVO fileUploadMessageVO, String patientId, String messageId, String fileExtension){
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		Date date = new Date();
		String effectiveDate = (dateFormat.format(date)).toString();
		FileUploadMessageService fileUploadMessageService = new FileUploadMessageService();
		String fileMetaData = fileUploadMessageService.createFileUploadMessage(fileUploadMessageVO, messageId, patientId, effectiveDate, fileExtension);
		MessageVO messageVO;
		try {
			messageVO = messageService.createMessageVO(fileMetaData);
			messageService.saveMessage(messageVO);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
	/*private static org.w3c.dom.Document xml2FO(org.w3c.dom.Document xml) throws Exception {
	    DOMSource xmlDomSource = new DOMSource(xml);
	    DOMResult domResult = new DOMResult();

	    TransformerFactory factory = TransformerFactory.newInstance();
	    Transformer transformer = factory.newTransformer();

	    if (transformer == null) {
	       System.out.println("Error creating transformer");
	       System.exit(1);
	    }

	    try {
	        transformer.transform(xmlDomSource, domResult);
	    } catch (javax.xml.transform.TransformerException e) {
	        return null;
	    }

	    return (org.w3c.dom.Document) domResult.getNode();
	}
	
	private byte[] fo2PDF(org.w3c.dom.Document foDocument, String styleSheet) {
	    FopFactory fopFactory = FopFactory.newInstance();
	    byte[] result = null;

	    try {
	        ByteArrayOutputStream out = new ByteArrayOutputStream();

	        Fop fop = fopFactory.newFop(MimeConstants.MIME_PDF, out);
	        Transformer transformer = getTransformer(styleSheet);

	        Source src = new DOMSource(foDocument);
	        Result res = new SAXResult(fop.getDefaultHandler());

	        transformer.transform(src, res);

	        result = out.toByteArray();

	    } catch (Exception ex) {
	    	logger.error("Documents TimeLine error :" + ex);
	    }
	    return result;
	 }*/
	
	/*private static Transformer getTransformer(String styleSheet) {
	    try {
	        TransformerFactory tFactory = TransformerFactory.newInstance();

	        DocumentBuilderFactory dFactory = DocumentBuilderFactory.newInstance();
	        dFactory.setNamespaceAware(true);

	        DocumentBuilder dBuilder = dFactory.newDocumentBuilder();
	        org.w3c.dom.Document xslDoc = dBuilder.parse(styleSheet);
	        DOMSource xslDomSource = new DOMSource(xslDoc);

	        return tFactory.newTransformer(xslDomSource);
	    } catch (javax.xml.transform.TransformerException e) {
	        e.printStackTrace();
	        return null;
	    } catch (java.io.IOException e) {
	        e.printStackTrace();
	        return null;
	    } catch (javax.xml.parsers.ParserConfigurationException e) {
	        e.printStackTrace();
	        return null;
	    } catch (org.xml.sax.SAXException e) {
	        e.printStackTrace();
	        return null;
	    }
	}*/
	
}
