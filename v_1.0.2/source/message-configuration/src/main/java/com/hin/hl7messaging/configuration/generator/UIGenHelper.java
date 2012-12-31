/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.ArrayList;

/**
 * @author abdul.kahar
 *
 */
public class UIGenHelper {

	private ArrayList<String> keywords = new ArrayList<String>();
	private ArrayList<String> varSet = new ArrayList<String>();
	
	public Boolean varAlreadyIncluded(String var){
		return varSet.contains(var);
	}
	public void includeVar(String var){
		varSet.add(var);
	}
	public void clearVarSet(){
		varSet.clear();
	}
	
	public UIGenHelper(){
		keywords.add("byte");
		keywords.add("short");
		keywords.add("int");
		keywords.add("long");
		keywords.add("float");
		keywords.add("double");
		keywords.add("char");
		keywords.add("false");
		keywords.add("true");
		keywords.add("boolean");
		keywords.add("null");
		keywords.add("abstract");
		keywords.add("while");
		keywords.add("volatile");
		keywords.add("void");
		keywords.add("try");
		keywords.add("byte");
		keywords.add("transient");
		keywords.add("throw");
		keywords.add("throws");
		keywords.add("this");
		keywords.add("synchronized");
		keywords.add("switch");
		keywords.add("super");
		keywords.add("static");
		keywords.add("return");
		keywords.add("public");
		keywords.add("protected");
		keywords.add("package");
		keywords.add("private");
		keywords.add("new");
		keywords.add("native");
		keywords.add("interface");
		keywords.add("instanceof");
		keywords.add("import");
		keywords.add("implements");
		keywords.add("if");
		keywords.add("goto");
		keywords.add("for");
		keywords.add("finally");
		keywords.add("final");
		keywords.add("extends");
		keywords.add("enum");
		keywords.add("else");
		keywords.add("do");
		keywords.add("default");
		keywords.add("continue");
		keywords.add("const");
		keywords.add("class");
		keywords.add("catch");
		keywords.add("case");
		keywords.add("break");
		keywords.add("assert");
	}
	
	public String createTypeName(String name){
		return name.substring(0, 1).toUpperCase().concat(name.substring(1)).replace('.', '_').replace('-', '_');
	}
	
	public String createVariableName(String name){
		String var = name.substring(0, 1).toLowerCase().concat(name.substring(1)).replace('.', '_').replace('-', '_');
		if(keywords.indexOf(var) > -1){
			var = var.concat("_$1");
		}
		return var;
	}
	
	public void createClass(String classTxt, String location) throws FileNotFoundException {
		File file = new File(location);
		PrintWriter pw = new PrintWriter(file);
		pw.println(classTxt);
		pw.close();
	}
	
}
