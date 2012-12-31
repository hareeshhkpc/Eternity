/**
 * 
 */
package com.hin.hl7messaging.svgexport;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Date;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.junit.Test;

/**
 * @author abdul.kahar
 * 
 */
public class JSExecute {

	@Test
	public void testJSExecute() throws ScriptException {

		// create a script engine manager
		ScriptEngineManager factory = new ScriptEngineManager();
		// create a JavaScript engine
		ScriptEngine engine = factory.getEngineByName("JavaScript");
		// evaluate JavaScript code from String
		engine.eval("println('Welocme to java world')");
		
		engine.getContext().setAttribute("ctx", new Date(), ScriptContext.ENGINE_SCOPE);
		
		engine.eval("println('ctx = ' + ctx)");
		
		String user = "abdul.kahar";
		
		engine.getContext().setAttribute("user", user, ScriptContext.ENGINE_SCOPE);
		engine.eval("println(\"User: \" + user)");
		
		engine.eval("var jsVar ='This is from JS';");
		engine.eval("var jsVar1 = new Date();");
		String jsVar = (String) engine.getContext().getAttribute("jsVar");
		Object jsVar1 = engine.getContext().getAttribute("jsVar1");
		
		System.out.println("jsVar: " + jsVar + "\njsVar1: " + jsVar1);
	}

	@Test
	public void testJSFile() throws FileNotFoundException, ScriptException{
		File jsFile = new File("src/test/resources/SVGManip.js");
		
		// create a script engine manager
		ScriptEngineManager factory = new ScriptEngineManager();
		// create a JavaScript engine
		ScriptEngine engine = factory.getEngineByName("JavaScript");
		
		engine.eval(new java.io.FileReader(jsFile));
		
		engine.eval("println(new SVGManip());");
		engine.eval("var svgManip = new SVGManip('Hello World'); svgManip.printData()");
	}
	
	@Test
	public void testReadXML() throws FileNotFoundException, ScriptException{
		File jsFile = new File("src/test/resources/SVGManip.js");
		
		// create a script engine manager
		ScriptEngineManager factory = new ScriptEngineManager();
		// create a JavaScript engine
		ScriptEngine engine = factory.getEngineByName("JavaScript");
		
		engine.eval(new java.io.FileReader(jsFile));
		
		engine.eval("println(new SVGManip());");
		engine.eval("var svgManip = new SVGManip('Hello World'); svgManip.printData()");
	}
}
