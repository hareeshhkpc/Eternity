package com.hin.hl7messaging.web;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.junit.Test;
import ca.uhn.hl7v2.parser.*;
import ca.uhn.hl7v2.model.Message;
//import ca.uhn.hl7v2.model.v24.message.ACK;
import ca.uhn.hl7v2.model.v23.message.ACK;

public class TestHapi {

	@Test
	public void test() {
		
		BufferedReader reader = null;
		try {
			reader = new BufferedReader( new FileReader ("../../documents/Messages/Dubai Cardiometabolic.txt"));
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		}
	    String         line = null;
	    StringBuilder  stringBuilder = new StringBuilder();
	    String         ls = System.getProperty("line.separator");

	    try {
			while( ( line = reader.readLine() ) != null ) {
			    stringBuilder.append( line );
			    stringBuilder.append( ls );
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}

	    String ackMessageString = stringBuilder.toString();
        //instantiate a PipeParser, which handles the "traditional encoding" 
	    PipeParser pipeParser = new PipeParser();
	
	    try {
	         //parse the message string into a Message object 
	         Message message = pipeParser.parse(ackMessageString);
	         
	         //if it is an ACK message (as we know it is),  cast it to an 
	         // ACK object so that it is easier to work with, and change a value            
	         if (message instanceof ACK) {
	             ACK ack = (ACK) message;
	             ack.getMSH().getProcessingID().getProcessingMode().setValue("P");
	         }
	         
	         //instantiate an XML parser 
	         XMLParser xmlParser = new DefaultXMLParser();
	         
	         //encode message in XML 
	         String ackMessageInXML = xmlParser.encode(message);
	         
	         //print XML-encoded message to standard out
	         System.out.println(ackMessageInXML);
	     } catch (Exception e) {
	         e.printStackTrace();
	     }       
		
	}
	
}




