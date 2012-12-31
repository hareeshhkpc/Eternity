package com.hin.hl7messaging.configuration;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;

import org.junit.Test;

import com.hin.hl7messaging.configuration.generator.MessageWithConfigAttrsManager;


public class MessageWithIdGeneratorTest {
	
	@Test
	public void testMessageWithConfigAttrManager() throws Exception{
		MessageWithConfigAttrsManager manager = new MessageWithConfigAttrsManager();
		manager.setConfigAttrs("id");
		//String message = getXMLContent(new File("src/sample/POLB_EX224200_01_australia.xml"));
	/*	String message = getXMLContent(new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\SubstanceAdministrationOrder_POSA_IN000001.xml"));
		String config = getXMLContent(new File("src/main/resources/messageconfig/POSA_IN000001.xml"));
		String result = manager.generateConfigAttrsForMessage(message, config);
		saveXMLContent(new File("E:\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\emptyWithID\\xml\\SubstanceAdministrationOrder_Empty_withID.xml"), result);
		
	*/	
		String artifactID = "PRPA_IN000001";
		String message = getXMLContent(new File("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\sample\\"+artifactID+".xml"));
		String config = getXMLContent(new File("src/main/resources/messageconfig/"+artifactID+".xml"));
		String result = manager.generateConfigAttrsForMessage(message, config);
		saveXMLContent(new File("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\sample\\"+artifactID+".xml"), result);
		
	
	}
	
	private void saveXMLContent(File file, String content) throws Exception{
		PrintWriter pw = new PrintWriter(file);
		pw.print(content);
		pw.flush();
		pw.close();
	}
	
	private String getXMLContent(File xmlFile) throws Exception{
		BufferedReader br = new BufferedReader(new FileReader(xmlFile));
		String line = "";
		StringBuffer buffer = new StringBuffer();
		while((line = br.readLine()) != null){
			buffer.append(line);
			buffer.append("\n");
		}
		br.close();
		return buffer.toString();
	}
}
