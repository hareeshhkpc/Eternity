package com.hin.hl7messaging.search;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.store.LockObtainFailedException;
import org.apache.lucene.util.Version;
public class LuceneProfileIndexManager {
	public static final String INDEX_DIRECTORY =  System.getProperty("java.io.tmpdir")+"\\"+"LuceneDirectory";
	
	 public boolean createIndex(String ColumnFamily) throws IOException{
		 String INDEX_SUB_DIRECTORY =INDEX_DIRECTORY+"\\"+ColumnFamily;
		 File directory = new File(INDEX_SUB_DIRECTORY);
		 if(directory.exists()){
			 createColumnFamilyIndex(ColumnFamily,INDEX_SUB_DIRECTORY);
		 }else{
			 directory.mkdir();
			 createColumnFamilyIndex(ColumnFamily,INDEX_SUB_DIRECTORY);
		 }
		 return true;
	 }
	 
	 public void createColumnFamilyIndex(String ColumnFamily,String INDEX_SUB_DIRECTORY) throws CorruptIndexException, LockObtainFailedException, IOException{
		 StandardAnalyzer analyzer = new StandardAnalyzer(Version.LUCENE_35);
		 File file = new File(INDEX_SUB_DIRECTORY);
		 IndexWriterConfig config = new IndexWriterConfig(Version.LUCENE_35, analyzer);
		 IndexWriter w = new IndexWriter(FSDirectory.open(file), config);
		 Map<String, HashMap<String, String>> resultMap = new HashMap<String, HashMap<String, String>>();
		 HashMap<String, String> columnValueMap = new HashMap<String, String>();
		 String column = "", value = "", subscriberId="";
		// IdentityMessageService messageService = new IdentityMessageService();
		// resultMap = messageService.retrieveProfileNameColumn(ColumnFamily);
		 Iterator iterator = resultMap.entrySet().iterator();
		 while(iterator.hasNext()){
			 	Document doc = new Document();
				Map.Entry lookUpIdEntry = (Map.Entry) iterator.next();
				subscriberId = (String) lookUpIdEntry.getKey();
				columnValueMap = (HashMap<String, String>) lookUpIdEntry.getValue();
				Iterator columnIterator = columnValueMap.entrySet().iterator();
				doc.add(new Field("ProfileId", subscriberId, Field.Store.YES, Field.Index.ANALYZED));
				while(columnIterator.hasNext()){
					Map.Entry columnEntry = (Map.Entry) columnIterator.next();
					column = (String) columnEntry.getKey();
					if(!(column.equals("KEY"))){
						value = (String) columnEntry.getValue();
						doc.add(new Field(column, value, Field.Store.YES, Field.Index.ANALYZED));
					}
				}
				 w.addDocument(doc);
			}
		    w.close();
	 }
	 
	 public boolean ifIndexDoesNotExist(String ColumnFamily){
	        File directory = new File(INDEX_DIRECTORY+"\\"+ColumnFamily);
	        	if(directory.exists()){
	        		if(directory.listFiles().length > 0){
	    	        	return false;
	    	        }else{
	    	        	return true;
	    	        }
	        	}else{
	        		return true;
	        	}
	 }
	 
}
