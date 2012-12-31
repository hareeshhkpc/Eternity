package com.hin.hl7messaging.search;

import java.io.IOException;
import java.util.HashMap;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.util.Version;
import org.apache.lucene.store.FSDirectory;
import java.io.File;

public class LuceneProfileSearchManager {
	private LuceneProfileIndexManager indexManager;
	public static final String INDEX_DIRECTORY = System
			.getProperty("java.io.tmpdir") + "\\" + "LuceneDirectory";

	public LuceneProfileSearchManager() {
		this.indexManager = new LuceneProfileIndexManager();
	}

	public HashMap<String, String> search(String searchWord,
			String ColumnFamily, int maxRetieveProfiles)
			throws ParseException, CorruptIndexException, IOException {
		HashMap<String, String> searchResult = new HashMap<String, String>();
		if (indexManager.ifIndexDoesNotExist(ColumnFamily)) {
			try {
				indexManager.createIndex(ColumnFamily);
			} catch (IOException e) {
				e.printStackTrace();
				return searchResult;
			}
		}
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		Query q = new QueryParser(Version.LUCENE_35, "USERNAME", analyzer)
				.parse(searchWord + "*");
		File file = new File(INDEX_DIRECTORY + "\\" + ColumnFamily);
		int hitsPerPage = maxRetieveProfiles;
		IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);
		TopScoreDocCollector collector = TopScoreDocCollector.create(
				hitsPerPage, true);
		searcher.search(q, collector);
		ScoreDoc[] hits = collector.topDocs().scoreDocs;
		// 4. display results
		System.out.println("Found " + hits.length + " hits.");
		for (int i = 0; i < hits.length; ++i) {
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);
			System.out.println((i + 1) + ". " + d.get("USERNAME")
					+ " ProfileId: " + d.get("ProfileId"));
			searchResult.put(d.get("ProfileId"), d.get("USERNAME"));

		}

		// searcher can only be closed when there
		// is no need to access the documents any more.
		searcher.close();
		return searchResult;

	}
}
