package com.hin.hl7messaging.search;

import java.io.File;
import java.io.IOException;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.queryParser.ParseException;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopScoreDocCollector;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;

public class LuceneAddNewDocument {
	public static final String INDEX_DIRECTORY =  "e:\\LuceneDirectory\\";
	
	public void createIndex(String fullUserName,String profileId) throws IOException, ParseException{
		
		File file = new File(INDEX_DIRECTORY);
		/*if(ifFileExist(file)){
			ifProfileIDExist(fullUserName);
		}*/
		addNewDocumentToIndex(file,fullUserName,profileId);
		retriewDocument(file);
		deleteDocument(file);
		retriewDocument(file);
		
	}
	
	/*public boolean ifFileExist(File file){
    	if(file.exists()){
    		if(file.listFiles().length > 0){
	        	return true;
	        }else{
	        	return false;
	        }
    	}else{
    		return false;
    	}
	}*/
	
	/*public void ifProfileIDExist(String profileId) throws ParseException, CorruptIndexException, IOException{
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
	    Query q = new QueryParser(Version.LUCENE_35, "USERNAME", analyzer).parse(profileId);
	    File file = new File(INDEX_DIRECTORY);
	    int hitsPerPage = 1;
	    IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);
	    TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, true);
	    searcher.search(q, collector);
	    ScoreDoc[] hits = collector.topDocs().scoreDocs;
	    System.out.println("Found " + hits.length + " hits.");
	    searcher.close();
	    for(int i=0;i<hits.length;++i) {
	      deleteDocument();
	     // System.out.println((i + 1) + ". " + d.get("USERNAME")+" ProfileId: "+d.get("ProfileId"));
	      
	    }
	}*/
	
	public void deleteDocument(File file) throws CorruptIndexException, IOException{
		  StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		  IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
		  IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		  w.deleteDocuments(new Term("USERNAME","raj"));
		  w.close();
	}
	
	public void addNewDocumentToIndex(File file,String fullUserName,String profileId) throws IOException{
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
		IndexWriter w = new IndexWriter(FSDirectory.open(file),config);
		Document doc = new Document();
		doc.add(new Field("ProfileId", profileId, Field.Store.YES, Field.Index.ANALYZED));
		doc.add(new Field("USERNAME", fullUserName, Field.Store.YES, Field.Index.ANALYZED));
		w.addDocument(doc);
		w.close();
	}
	
	public static void retriewDocument(File file) throws ParseException, CorruptIndexException, IOException{
		StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		String querystr =  "Ram";
		Query q = new QueryParser(Version.LUCENE_35, "USERNAME", analyzer).parse(querystr);
	    int hitsPerPage = 4;
	    IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);
	    TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, true);
	    searcher.search(q, collector);
	    ScoreDoc[] hits = collector.topDocs().scoreDocs;
	    System.out.println("Found " + hits.length + " hits.");
	    for(int i=0;i<hits.length;++i) {
	      int docId = hits[i].doc;
	      Document d = searcher.doc(docId);
	      System.out.println((i + 1) + ". " + d.get("USERNAME")+" ProfileId: "+d.get("ProfileId"));
	    }
	    searcher.close();
	}
	
}
