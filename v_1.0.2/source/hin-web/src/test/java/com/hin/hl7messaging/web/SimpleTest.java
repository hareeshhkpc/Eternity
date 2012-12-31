package com.hin.hl7messaging.web;

import java.io.File;
import java.io.FileReader;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;


public class SimpleTest {
	
	public static void main(String[] args) {
	    ScriptEngineManager manager = new ScriptEngineManager();
	    ScriptEngine engine = manager.getEngineByName("js");
	    try {
	      FileReader reader = new FileReader(new File(SimpleTest.class.getResource("sample.js").toURI()));
	      engine.eval(reader);
	      reader.close();
	    } catch (Exception e) {
	      e.printStackTrace();
	    }
	  }
	
}
