package com.hin.hl7messaging.search;

import java.io.File;
import java.io.IOException;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
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
import org.apache.lucene.util.Version;

public class AddNewDocumentToLucene {
	public static final String INDEX_DIRECTORY =  "e:\\LuceneDirectory\\";
	public void addDoc(String value,String ProfileID) throws IOException, ParseException {
		 File file = new File(INDEX_DIRECTORY);	
		if(ifFileExist(file)){
			searchDocument(file,ProfileID);
		}
			StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
			 IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
			 IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
			Document doc = new Document();
		    doc.add(new Field("title", value, Field.Store.YES, Field.Index.ANALYZED));
		    doc.add(new Field("profileID", ProfileID, Field.Store.YES, Field.Index.ANALYZED));
		    w.addDocument(doc);
		    w.close();
		    searchDocument(file,ProfileID);
		    searchDocument(file,ProfileID);
	 }
	public  void searchDocument(File file,String ProfileID) throws ParseException, CorruptIndexException, IOException{
		  StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		  String querystr = ProfileID;
		    Query q = new QueryParser(Version.LUCENE_35, "profileID", analyzer).parse(querystr);
		  int hitsPerPage = 4;
		  IndexSearcher searcher = new IndexSearcher(FSDirectory.open(file), true);
		    TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage, true);
		    searcher.search(q, collector);
		    ScoreDoc[] hits = collector.topDocs().scoreDocs;
		    System.out.println("Found " + hits.length + " hits.");
		    for(int i=0;i<hits.length;++i) {
		      int docId = hits[i].doc;
		      Document d = searcher.doc(docId);
		      System.out.println((i + 1) + ". " + d.get("title"));
		      System.out.println((i + 1) + ". " + d.get("profileID"));
		      deleteDocumentsFromIndex(file);
		    }
		    searcher.close();
	  }
	public  void deleteDocumentsFromIndex(File file) throws IOException {
		  StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		  IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
		  IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		  w.deleteDocuments(new Term("profileID","10001"));
		  w.close();
	 }
	
	public boolean ifFileExist(File file){
    	if(file.exists()){
    		if(file.listFiles().length > 0){
	        	return true;
	        }else{
	        	return false;
	        }
    	}else{
    		return false;
    	}
	}
	
	public void updateLuceneDocument(){
		
	}
}
