package com.hin.hl7messaging.configuration;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.log4j.Logger;

public class CreatingMasterXSL {
	
	private static Logger logger = Logger.getLogger(CreatingMasterXSL.class.getName());

	public static void main(String args[]) {
		String str1 = "", result = "";

		List<String> filnamn = new ArrayList();
		ArrayList list = new ArrayList();
		File folder = new File("E:/HIN/source/message-configuration/src/main/resource/transform/datatype/v_103");
		
		File[] listOfFiles = folder.listFiles();
		
		try {
			// Create file
			FileWriter fstream = new FileWriter("E:\\Workspace\\UITransform\\resource\\xsl\\MasterXsl\\MasterXslCondensed.xsl");
			BufferedWriter out = new BufferedWriter(fstream);
			result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
			list.add(result);
			result = "<xsl:stylesheet xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"";
			list.add(result);
			result="xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"";
			list.add(result);
			result="xmlns:xalan=\"http://xml.apache.org/xslt\"";
			list.add(result);
			result="exclude-result-prefixes=\"xsi xsl xalan\" version=\"1.0\">";
			list.add(result);
			
		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isFile()) {
				filnamn.add(listOfFiles[i].getName());
				// System.out.println(listOfFiles[i].getName());
				str1 = listOfFiles[i].getName();
				result = "<xsl:import href=\"" + str1 + "\"/>";
				list.add(result);
				//System.out.println(result);
			}
		}

		result="</xsl:stylesheet>";
		list.add(result);
		
		Iterator itr = list.iterator();
		while (itr.hasNext()) {
			Object element = itr.next();
			out.write((String) element);
			

		}
			
		out.close();
		} catch (Exception e) {
			logger.error("An error occured while loading the file: "+e.getMessage());
		}
		
	}

}
