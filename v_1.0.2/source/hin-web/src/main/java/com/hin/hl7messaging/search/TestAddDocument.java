package com.hin.hl7messaging.search;

import java.io.IOException;

import org.apache.lucene.queryParser.ParseException;

public class TestAddDocument {
	public static void main(String[] args) throws IOException, ParseException {
		 AddNewDocumentToLucene exp = new AddNewDocumentToLucene();
		 exp.addDoc("ram","10001");
		
	}
	
}
