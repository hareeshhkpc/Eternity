/**
 * 
 */
package com.hin.hl7messaging;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.apache.lucene.analysis.KeywordAnalyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.IIndexable;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "indexService")
public class IndexService implements IIndexService {

	@Value("${messageConfig.dirPath}")
	private String messageConfigDirPath;

	private Logger logger = Logger.getLogger(IndexService.class.getName());

	@Value("${indexing.LUCENE_INDEX_DIR_PATH}")
	private String INDEX_DIRECTORY;

	@Override
	public void createIndex(String messageXML) {
		try {
			List<IndexFieldsVO> indexFields = null;
			Document messageDocument = XMLHelper.getXMLDocument(messageXML);
			Document configureDocument = getConfigureDocument(messageDocument);
			indexFields = getIndexFields(messageDocument, configureDocument);
			String indexDirName = getIndexDirName(configureDocument);
			addDocumentToLuceneDir(indexFields, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("CorruptIndexException:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("LockObtainFailedException:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("IOException:" + ioe.getMessage());

		}

	}

	@Override
	public void createIndex(String messageXML, IndexFieldsVO roleIndexFieldsVO) {
		try {
			List<IndexFieldsVO> indexFields = null;
			Document messageDocument = XMLHelper.getXMLDocument(messageXML);
			Document configureDocument = getConfigureDocument(messageDocument);
			indexFields = getIndexFields(messageDocument, configureDocument);
			indexFields.add(roleIndexFieldsVO);
			String indexDirName = getIndexDirName(configureDocument);
			addDocumentToLuceneDir(indexFields, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		}

	}

	@Override
	public void updateIndex(String messageXML) {
		try {
			List<IndexFieldsVO> indexFields = null;
			Document messageDocument = XMLHelper.getXMLDocument(messageXML);
			Document configureDocument = getConfigureDocument(messageDocument);
			String messageXMLId = getMessageXMLId(messageDocument,
					configureDocument);
			indexFields = getIndexFields(messageDocument, configureDocument);
			String indexDirName = getIndexDirName(configureDocument);
			updateDocumentToLuceneDir(messageXMLId, indexDirName);
			addDocumentToLuceneDir(indexFields, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		} catch (ParseException pe) {
			pe.printStackTrace();
			logger.error("Parser not found:" + pe.getMessage());
		}
	}

	@Override
	public void updateIndex(String messageXML, IndexFieldsVO indexFieldVo) {
		try {
			List<IndexFieldsVO> indexFields = null;
			Document messageDocument = XMLHelper.getXMLDocument(messageXML);
			Document configureDocument = getConfigureDocument(messageDocument);
			String messageXMLId = getMessageXMLId(messageDocument,
					configureDocument);
			indexFields = getIndexFields(messageDocument, configureDocument);
			indexFields.add(indexFieldVo);
			String indexDirName = getIndexDirName(configureDocument);
			updateDocumentToLuceneDir(messageXMLId, indexDirName);
			addDocumentToLuceneDir(indexFields, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		} catch (ParseException pe) {
			pe.printStackTrace();
			logger.error("Parser not found:" + pe.getMessage());
		}
	}

	private IndexFieldsVO getPatientRoleFieldVo() {
		return new IndexFieldsVO("Role", "true", "", "patient", "false");
	}

	private Document getConfigureDocument(Document document) {
		String documentType = document.getDocumentElement().getAttribute(
				"config");

		if (messageConfigDirPath == null) {
			messageConfigDirPath = "E://message-configuration";
		}

		/*
		 * String deploymentPath = HINApplicationContext
		 * .getHINApplicationContext().getRealPath(messageConfigDirPath);
		 */

		File configureFile = new File(messageConfigDirPath + File.separator
				+ documentType + ".xml");

		return XMLHelper.getXMLDocument(configureFile);
	}

	private List<IndexFieldsVO> getIndexFields(Document messageDocument,
			Document configureDocument) {
		List<IndexFieldsVO> indexFields = new ArrayList<IndexFieldsVO>();
		NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,
				"//HL7MessageConfiguration/IndexConfiguration/Field",
				XPathConstants.NODESET);
		System.out.println("");
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
				value = (String) XMLHelper.read(messageDocument,
						element.getAttribute("xpath"), XPathConstants.STRING);
			} else if (dataType.equals("LONG")) {
				try {
					String time = XMLHelper.read(messageDocument,
							element.getAttribute("xpath"),
							XPathConstants.STRING).toString();

					SimpleDateFormat sdf = new SimpleDateFormat(
							"yyyy-mm-dd HH:mm:ss");
					Date parsed = sdf.parse(time);
					Calendar newCalendar = Calendar.getInstance();
					value = new Long(newCalendar.getTimeInMillis());
				} catch (Exception e) {
					System.out.println("Not able to parse date to long.");
				}

			} else {
				value = (String) XMLHelper.read(messageDocument,
						element.getAttribute("xpath"), XPathConstants.STRING);
			}
			if (dataType != null)
				indexFields.add(new IndexFieldsVO(name, indexed, "", value,
						analyzed, dataType));
			else
				indexFields.add(new IndexFieldsVO(name, indexed, "", value,
						analyzed));

		}
		return indexFields;
	}

	public List<IndexFieldsVO> getIndexFields(String messageXml) {
		List<IndexFieldsVO> indexFields = null;
		Document messageDocument = XMLHelper.getXMLDocument(messageXml);
		Document configureDocument = getConfigureDocument(messageDocument);
		indexFields = getIndexFields(messageDocument, configureDocument);
		return indexFields;
	}

	@SuppressWarnings("deprecation")
	public synchronized void addDocumentToLuceneDir(
			List<IndexFieldsVO> indexFields, String indexDirName)
			throws CorruptIndexException, LockObtainFailedException,
			IOException {

		File file = new File(indexDirName);
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35,
				analyzer);
		IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		try {
			org.apache.lucene.document.Document luceneDocument = new org.apache.lucene.document.Document();
			Iterator<IndexFieldsVO> iterator = indexFields.iterator();
			while (iterator.hasNext()) {
				IndexFieldsVO indexFieldsVO = iterator.next();
				if (indexFieldsVO.getIndexed().equals("true")) {
					if (indexFieldsVO.getAnalyzed().equals("false")) {
						luceneDocument.add(new Field(indexFieldsVO.getName(),
								indexFieldsVO.getValue().toString(),
								Field.Store.YES, Field.Index.NOT_ANALYZED));
					} else {
						luceneDocument.add(new Field(indexFieldsVO.getName(),
								indexFieldsVO.getValue().toString(),
								Field.Store.YES, Field.Index.ANALYZED));
					}
				} else {
					luceneDocument.add(new Field(indexFieldsVO.getName(),
							indexFieldsVO.getValue().toString(),
							Field.Store.YES, Field.Index.NO));
				}
			}
		luceneDocument.add(new Field("alldoc", "all", Field.Store.YES,Field.Index.ANALYZED));
		Long timestamp = System.currentTimeMillis();
		luceneDocument.add(new Field("createddate", timestamp.toString(), Field.Store.YES,Field.Index.ANALYZED));
		w.addDocument(luceneDocument);
		w.optimize();
		}
		 catch (CorruptIndexException cie) {
				cie.printStackTrace();
				logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage(), ioe);

		} finally {
			w.close();
		}
	}

	private synchronized void updateDocumentToLuceneDir(String messageXMLId,
			String indexDirName) throws ParseException, CorruptIndexException,
			IOException {
		KeywordAnalyzer analyzer = new KeywordAnalyzer();

		IndexWriter w = null;
		try {

			File file = new File(indexDirName);
			IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35,
					analyzer);
			w = new IndexWriter(FSDirectory.open(file), config);
			w.deleteDocuments(new Term("messageId", messageXMLId));
		} catch (Exception e) {
			logger.error("Parser not found:" + e.getMessage(), e);
		} finally {
			if (w != null) {
				w.close();
			}
		}

	}

	private String getMessageXMLId(Document messageDocument,
			Document configureDocument) {
		NodeList indexNodeList = (NodeList) XMLHelper.read(configureDocument,
				"//HL7MessageConfiguration/IndexConfiguration/Field",
				XPathConstants.NODESET);
		for (int i = 0; i < indexNodeList.getLength(); i++) {
			Node node = indexNodeList.item(i);
			Element element = (Element) node;
			String name = element.getAttribute("name");
			if (name.equals("id")) {
				String value = (String) XMLHelper.read(messageDocument,
						element.getAttribute("xpath"), XPathConstants.STRING);
				return value;
			}
		}
		return null;
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

		return INDEX_DIRECTORY + "//" + value;
	}

	public void createIndex(IIndexable indexableObject) {
		List<IndexFieldsVO> indexFields = indexableObject.getIndexFieldList();
		String indexDirName = indexableObject.getIndexingDirectory();
		indexDirName = INDEX_DIRECTORY + "//" + indexDirName;
		try {
			addDocumentToLuceneDir(indexFields, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		}

	}

	public void createIndex(IndexFieldsVO indexFieldsVO, String indexDirName) {
		List<IndexFieldsVO> indexFieldsVOs = new ArrayList<IndexFieldsVO>();
		indexFieldsVOs.add(indexFieldsVO);
		try {
			addDocumentToLuceneDir(indexFieldsVOs, indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		}
	}

	public void deleteIndex(String id, String indexDirectoryName) {
		try {
			updateDocumentToLuceneDir(id, indexDirectoryName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("Parser not found:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("Parser not found:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("Parser not found:" + ioe.getMessage());

		} catch (ParseException pe) {
			pe.printStackTrace();
			logger.error("Parser not found:" + pe.getMessage());
		}
	}

	public String getIndexDirectory(String messageXML) {
		Document messageDocument = XMLHelper.getXMLDocument(messageXML);
		Document configureDocument = getConfigureDocument(messageDocument);
		String messageXMLId = getMessageXMLId(messageDocument,
				configureDocument);
		String indexDirName = getIndexDirName(configureDocument);
		return indexDirName;
	}

	public void createIndexForMessageVo(MessageVO messageVo) {
		try {
			String indexDirName = INDEX_DIRECTORY + "//"
					+ messageVo.getIndexDirectoryName();
			addDocumentToLuceneDir(messageVo.getIndexFieldVoList(),
					indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("CorruptIndexException:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("LockObtainFailedException:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("IOException:" + ioe.getMessage());

		}
	}

	public void updateIndexForMessageVo(MessageVO messageVo) {
		try {
			String indexDirName = INDEX_DIRECTORY + "//"
					+ messageVo.getIndexDirectoryName();
			updateDocumentToLuceneDir(messageVo.getId(), indexDirName);
			addDocumentToLuceneDir(messageVo.getIndexFieldVoList(),
					indexDirName);
		} catch (CorruptIndexException cie) {
			cie.printStackTrace();
			logger.error("CorruptIndexException:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			lfe.printStackTrace();
			logger.error("LockObtainFailedException:" + lfe.getMessage());

		} catch (IOException ioe) {
			ioe.printStackTrace();
			logger.error("IOException:" + ioe.getMessage());

		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}

	}
}
