/**
 * 
 */
package com.hin.hl7messaging;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.apache.lucene.analysis.KeywordAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Fieldable;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermRangeFilter;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.ListItem;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "searchService")
public class SearchService implements ISearchService {

	@Value("${indexing.LUCENE_INDEX_DIR_PATH}")
	private String INDEX_DIRECTORY;

	@Value("${messageConfig.dirPath}")
	private String messageConfigDirPath;
	
	@Value("${tomcat.path}")
	String tomcatPath;
	
	//@Value("${lookupData.file}")
	String filePath;
	

	
	private Logger logger = Logger.getLogger(SearchService.class.getName());
	
	 public static  ISearchService getSearchService(SearchVO searchVO, ApplicationContext applicationContext){
		 ISearchService searchService=null;
		searchService =(ISearchService) applicationContext.getBean(searchVO.getSearchServiceClass());
		 return searchService;
	 }
	 

	@Override
	public Object search(SearchVO searchVO) {
		String INDEX_DIR_PATH = searchVO.getIndexFolder();
		Query query = null;
		if (INDEX_DIR_PATH.length() <= 1) {
			INDEX_DIR_PATH = getIndexDirPath(searchVO.getMessageType());
		} else {
			INDEX_DIR_PATH = INDEX_DIRECTORY + "//" + INDEX_DIR_PATH;
		}
		Object object = null;
		try {

			KeywordAnalyzer analyzer = new KeywordAnalyzer();
			if (searchVO.getQueryString() == null
					|| searchVO.getQueryString().length() <= 1) {
				query = getQuery(searchVO.getConditionMaps(), analyzer);
			} else {
				QueryParser queryParser = new QueryParser(Version.LUCENE_35,
						null, analyzer);
				query = queryParser.parse(searchVO.getQueryString()+" -ISACTIVE:FALSE");
			}
			System.out.println("Search Query 1:" + query);
			File file = new File(INDEX_DIR_PATH);
			int hitsPerPage = searchVO.getMax();
			if (file.exists() == true && query!=null) {
				@SuppressWarnings("deprecation")
				IndexSearcher searcher = new IndexSearcher(FSDirectory
						.open(file), true);
				TopScoreDocCollector collector = TopScoreDocCollector.create(
						hitsPerPage, true);
				// searcher.search(booleanQuery, collector);
				TermRangeFilter filter = getTermRangeFilter(searchVO);
				System.out.println("Search Query 2:" + filter);
				if (filter == null) {
					searcher.search(query, collector);
				} else {
					searcher.search(query, filter, collector);
				}
				ScoreDoc[] hits = collector.topDocs().scoreDocs;
				object = fillData(hits, searcher, searchVO);
				searcher.close();
			} else {
				logger.info("files does not exist.");
				return null;
			}
		} catch (CorruptIndexException cie) {
			logger.error("CorruptIndexException:" + cie.getMessage());

		} catch (LockObtainFailedException lfe) {
			logger.error("LockObtainFailedException:" + lfe.getMessage());

		} catch (IOException ioe) {
			logger.error("IOException:" + ioe.getMessage());

		} catch (Exception e) {
			e.printStackTrace();
		}

		return object;

	}

	private TermRangeFilter getTermRangeFilter(SearchVO searchVO) {
		if (searchVO.getFilterColumn() != null
				&& searchVO.getFromDate().length() > 1) {
			String lowerTerm = searchVO.getFromDate();
			String upperTerm = searchVO.getToDate();
			TermRangeFilter filter = new TermRangeFilter(searchVO
					.getFilterColumn(), lowerTerm, upperTerm, true, true);
			return filter;
		}
		return null;
	}

	public Object fillData(ScoreDoc[] hits, IndexSearcher searcher,
			SearchVO searchVO) throws Exception {
		List<Object> ObjectList = new ArrayList<Object>();
		for (int i = 0; i < hits.length; ++i) {
			List<ListItem> listItems = new ArrayList<ListItem>();
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);
			if (!searchVO.getParameterList().isEmpty()) {
				for (String parameter : searchVO.getParameterList()) {

					ListItem listItem = new ListItem();
					listItem.setKey(parameter);
					listItem.setValue(d.get(parameter));
					listItems.add(listItem);
				}
			} else {
				for (Fieldable field : d.getFields()) {
					ListItem listItem = new ListItem();
					listItem.setKey(field.name());
					listItem.setValue(d.get(field.name()));
					listItems.add(listItem);
				}
				ObjectList.add(listItems);
			}
		}
		return ObjectList;
	}

	private BooleanQuery getQuery(List<ListItem> conditionMaps,
			KeywordAnalyzer analyzer) {
		BooleanQuery mainQuery = new BooleanQuery();
		BooleanQuery subQuery = new BooleanQuery();
		if (conditionMaps != null && !conditionMaps.isEmpty()) {
			for (ListItem listItem : conditionMaps) {
				if (!listItem.getKey().isEmpty()
						&& listItem.getValue()!=null && !listItem.getValue().isEmpty()) {
					Query query;
					try {
						query = new QueryParser(Version.LUCENE_35, listItem
								.getKey().toString(), analyzer).parse(listItem
								.getValue().toString());
						if (listItem.getLogicalOperator().equals("AND")) {
							mainQuery.add(query, Occur.MUST);
						} else {
							subQuery.add(query, Occur.SHOULD);
						}
					} catch (ParseException e) {
						logger.error("Exception:" + e.getMessage());
					}
				} else {
					logger.error("Error: Condition map contains empty value");
				}
			}
			if (!subQuery.clauses().isEmpty()) {
				mainQuery.add(subQuery, Occur.MUST);
			}
		}
		System.out.println(mainQuery.toString());
		return mainQuery;
	}

	private String getIndexDirPath(String messageType) {
		File configureFile = new File(messageConfigDirPath + File.separator
				+ messageType + ".xml");
		org.w3c.dom.Document configureDocument = XMLHelper
				.getXMLDocument(configureFile);
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

	/*
	 * public Object fillData(ScoreDoc[] hits, IndexSearcher searcher, SearchVO
	 * searchVO) throws Exception { List<Object> ObjectList=new
	 * ArrayList<Object>(); for (int i = 0; i < hits.length; ++i) {
	 * List<IndexFieldsVO> listItems = new ArrayList<IndexFieldsVO>(); int docId
	 * = hits[i].doc; Document d = searcher.doc(docId);
	 * if(!searchVO.getParameterList().isEmpty()){ for(String parameter :
	 * searchVO.getParameterList()){ IndexFieldsVO indexField = new
	 * IndexFieldsVO(); Fieldable field=d.getFieldable(parameter);
	 * indexField.setName(field.name());
	 * indexField.setValue(d.get(field.name()));
	 * indexField.setIndexed(field.isIndexed()==true?"true":"false");
	 * indexField.setAnalyzed(field.isTokenized()==true?"true":"false");
	 * indexField.setType("String"); listItems.add(indexField); } }else{
	 * for(Fieldable field : d.getFields()){ IndexFieldsVO indexField = new
	 * IndexFieldsVO(); indexField.setName(field.name());
	 * indexField.setValue(d.get(field.name()));
	 * indexField.setIndexed(field.isIndexed()==true?"true":"false");
	 * indexField.setAnalyzed(field.isTokenized()==true?"true":"false");
	 * listItems.add(indexField); } ObjectList.add(listItems); } } return
	 * ObjectList; }
	 */
	@Override
	public List<Object> searchLookup(String className) throws Exception {
		List<Object> data = null;
		try {
			data = new ArrayList<Object>();
			if (className != null) {
				File docFile = new File(tomcatPath + filePath+".xml");
				System.out.println(docFile.getAbsolutePath());
				org.w3c.dom.Document doc = XMLHelper.getXMLDocument(docFile);
				NodeList list = (NodeList) XMLHelper.read(doc,
						"//lookups/lookup[@class='" + className + "']",
						XPathConstants.NODESET);
				String message = "****** Total lookup retrive from the class " + className
				+ " is ["+list.getLength()+"] *******";
				System.out.println(message);
				logger.info(message);
				for (int i = 0; i < list.getLength(); i++) {
					Element node = (Element) list.item(i);
					System.out.println("Name: " + node.getAttribute("name")
							+ ", Desc: " + node.getAttribute("description"));
					Object str = "{label:"+node.getAttribute("description")+",value:"+node.getAttribute("name")+"}";
					data.add(str);
				}
				data.add(doc);
			}

		} catch (Exception e) {
			logger.error(e);
			throw new Exception(e.getCause());
		}
		return data;
	}
	/*public static void main(String[] args) {
		String className = "service";
		try {
			//File docFile = new File("src/main/resources/concept.xml");
			File docFile = new File(tomcatPath + filePath+".xml");
			//File docFile = new File("E:/hin-eternity/source/message-service/src/main/resources/concept.xml");
			System.out.println(docFile.getAbsolutePath());
			org.w3c.dom.Document doc = XMLHelper.getXMLDocument(docFile);
			System.out.println("== :"+doc);
			NodeList list = (NodeList) XMLHelper.read(doc,
			"//lookups/lookup[@class='" + className + "']",
			XPathConstants.NODESET);
			System.out.println("== :"+doc);
			for (int i = 0; i < list.getLength(); i++) {
				Element node = (Element) list.item(i);
				System.out.println("Name: " + node.getAttribute("name")
						+ ", Desc: " + node.getAttribute("description"));
				Object str = "{label:"+node.getAttribute("description")+",value:"+node.getAttribute("name")+"}";
				System.out.println(""+str); 
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}*/

}
