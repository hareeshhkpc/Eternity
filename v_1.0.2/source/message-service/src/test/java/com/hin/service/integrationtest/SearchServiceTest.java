package com.hin.service.integrationtest;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.KeywordAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.vo.ProfileVO;
import com.hin.hl7messaging.api.IEntitySearchService;
import com.hin.hl7messaging.api.ISearchService;

/**
 * @author krishna.lr
 * 
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class SearchServiceTest extends AbstractJUnit4SpringContextTests {
	@Autowired
	ISearchService searchService;

	@Autowired
	IEntitySearchService entitySearchService;
/*
	@Test
	public void testSearchCheckedinPatient() {
		List<ProfileVO> profileVOList = new ArrayList<ProfileVO>();
		SearchVO searchVO = new SearchVO();
		searchVO.setMax(7);
		searchVO.setMin(3);
		searchVO.setMessageType("PRPA_MT201000HT03");
		EntityState entityState = new EntityState();
		entityState.setState("checkedin");
		entityState.setStatevalue("true");
		profileVOList = searchService.searchCheckedinPatient(searchVO);
		System.out.println(profileVOList);
	}*/

	@Test
	public void testLuceneQuery() throws IOException, ParseException {
		String INDEX_DIR_PATH = "//172.25.250.165//LuceneDirectory//RegistrtionIndex";
		KeywordAnalyzer analyzer = new KeywordAnalyzer();
		Query query = null;
		QueryParser queryParser = new QueryParser(Version.LUCENE_35, null,
				analyzer);
		query = queryParser.parse("+(givenName:kum*)");

		BooleanQuery mainQuery = new BooleanQuery();
		BooleanQuery subQuery = new BooleanQuery();
		query = new QueryParser(Version.LUCENE_35, "data", analyzer)
				.parse("value");
		mainQuery.add(query, Occur.MUST);
		query = null;
		query = new QueryParser(Version.LUCENE_35, "data", analyzer)
				.parse("value");
		mainQuery.add(query, Occur.MUST);
		query = null;
		query = new QueryParser(Version.LUCENE_35, "data", analyzer)
				.parse("value");
		subQuery.add(query, Occur.SHOULD);
		query = null;
		query = new QueryParser(Version.LUCENE_35, "data", analyzer)
				.parse("value");
		subQuery.add(query, Occur.SHOULD);
		mainQuery.add(subQuery, Occur.MUST);
		System.out.println(mainQuery.toString());

		File file = new File(INDEX_DIR_PATH);
		int hitsPerPage = 5;
		if (file.length() > 0) {
			@SuppressWarnings("deprecation")
			IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file),
					true);
			TopScoreDocCollector collector = TopScoreDocCollector.create(
					hitsPerPage, true);
			searcher.search(query, collector);
			ScoreDoc[] hits = collector.topDocs().scoreDocs;
			System.out.println(hits.length);
			for (int i = 0; i < hits.length; i++) {
				int docId = hits[i].doc;
				Document d = searcher.doc(docId);
				ProfileVO profileVO = new ProfileVO();
				profileVO.setName(d.get("givenName"));
				profileVO.setSubscriberId(d.get("subscriberId"));
				profileVO.setImageBase64(d.get("image"));
				profileVO.setRole(d.get("Role"));
				System.out.println(profileVO.toString());
			}
			searcher.close();
		} else {
			logger.info("files does not exist.");
		}
	}

}
