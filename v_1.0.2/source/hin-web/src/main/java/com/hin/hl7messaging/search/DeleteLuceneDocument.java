package com.hin.hl7messaging.search;

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
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.Version;

import java.io.File;
import java.io.IOException;

public class DeleteLuceneDocument {
	static String INDEX_DIR = "e:\\Lucene\\";
  public static void main(String[] args) throws IOException, ParseException {
    // 0. Specify the analyzer for tokenizing text.
    //    The same analyzer should be used for indexing and searching
    StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);

    // 1. create the index
    File file = new File(INDEX_DIR);
    IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);

    IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
    addDoc(w, "Ram","10001");
    addDoc(w, "Lucene","10002");
    /*addDoc(w, "Lucene for Dummies");
    addDoc(w, "Lucene for Computer");
    addDoc(w, "Lucene for Dummies");
    addDoc(w, "Lucene for Computer");
    addDoc(w, "Lucene for Art");
    addDoc(w, "Lucene for Computer");
    addDoc(w, "Lucene for Dummies");
    addDoc(w, "Lucene for Science");
    
    addDoc(w, "Managing Gigabytes");
    addDoc(w, "The Art of Computer Science");
    addDoc(w, "The Art of Computer Science");*/
    w.close();

    // 2. query
    //Term term = new Term("title","Lucenee");
    
		searchDocument(file);
		deleteDocumentsFromIndex();
		searchDocument(file);
  }
  private static void deleteDocumentsFromIndex() throws IOException {
	  boolean applyAllDeletes = true;
	  File file = new File(INDEX_DIR);
	  StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
	  IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
	  IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
	  //IndexReader indexReader = IndexReader.open(w, applyAllDeletes);
	  w.deleteDocuments(new Term("profileID","10001"));
	  w.close();
	  //indexReader.(new Term("title","lucenee"));
		//indexReader.close();

  }
  private static void searchDocument(File file) throws ParseException, CorruptIndexException, IOException{
	  StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
	  String querystr =  "Ram";
	    Query q = new QueryParser(Version.LUCENE_35, "title", analyzer).parse(querystr);
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
	    }
	    searcher.close();

  }
  private static void addDoc(IndexWriter w, String value,String ProfileID) throws IOException {
    Document doc = new Document();
    doc.add(new Field("title", value, Field.Store.YES, Field.Index.ANALYZED));
    doc.add(new Field("profileID", ProfileID, Field.Store.YES, Field.Index.ANALYZED));
    w.addDocument(doc);
  }
}

