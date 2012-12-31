package com.hin.hl7messaging;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TermQuery;
import org.apache.lucene.search.TermRangeFilter;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.SearchVO;

@Service(value = "messageIndex")
public class MessageIndex {
	@Value("${indexing.LUCENE_INDEX_DIR_PATH}")
	private String INDEX_DIRECTORY;

	// METHOD FOR SEARCHING DOCUMENTS
	public List<String> searchDocument(String patientidField, SearchVO searchVO) throws ParseException,
 CorruptIndexException, IOException {

		List<String> list = new ArrayList<String>();
		String patientId = "";
		if (searchVO.getPatientId1() != null) {
			patientId = searchVO.getPatientId1();
		}
		if (searchVO.getPatientId1() != null) {
			for (String indexFolderAndArtifactId : searchVO.getTestName()) {
				if (indexFolderAndArtifactId != null) {
					String[] splitedTerms = indexFolderAndArtifactId.split(",");
					String indexFolder = splitedTerms[0];
					String artifactId = splitedTerms[1];
					File file = new File(INDEX_DIRECTORY + "//" + indexFolder);
					int hitsPerPage = 4;
					IndexSearcher searcher = new IndexSearcher(
							FSDirectory.open(file), true);

					BooleanQuery bq = new BooleanQuery();
					Query query1 = new TermQuery(new Term(patientidField,
							patientId));
					bq.add(query1, BooleanClause.Occur.MUST);
					String lowerTerm = searchVO.getFromDate();
					String upperTerm = searchVO.getToDate();
					TermRangeFilter filter = new TermRangeFilter("createddate",
							lowerTerm, upperTerm, true, true);
					TopScoreDocCollector collector = TopScoreDocCollector
							.create(hitsPerPage, true);
					searcher.search(bq, filter, collector);
					ScoreDoc[] hits = collector.topDocs().scoreDocs;
					for (int i = 0; i < hits.length; ++i) {
						int docId = hits[i].doc;
						Document d = searcher.doc(docId);
						list.add(d.get("messageId") + "," + artifactId + ","
								+ d.get("subscriberId"));
					}
					searcher.close();
				}
			}
		}
		return list;

	}

	
	
	// FETCH ALL FACILITIES
		public List<String> searchFacility()
				throws CorruptIndexException, IOException {
			List<String> facilities = new ArrayList<String>();
			File file = new File(INDEX_DIRECTORY + "//Facility");
			int hitsPerPage = 50;
			IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);
			BooleanQuery bq = new BooleanQuery();
			Query query1 = new TermQuery(new Term("alldoc", "all"));
			bq.add(query1, BooleanClause.Occur.MUST);
			TopScoreDocCollector collector = TopScoreDocCollector.create(
					hitsPerPage, true);
			searcher.search(bq, collector);
			ScoreDoc[] hits = collector.topDocs().scoreDocs;
			for (int i = 0; i < hits.length; ++i) {
				int docId = hits[i].doc;
				Document d = searcher.doc(docId);
				facilities.add(d.get("facility"));
			}
			searcher.close();
			return facilities;
		}
}
