/**
 * 
 */
package com.hin.hl7messaging.uitl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.junit.Test;

/**
 * @author Administrator
 *
 */
public class Json2Xml {

	@Test
	public void testJson2Xml() throws FileNotFoundException{
		
        /*File jsonFile = new File("src/test/resources/concept.json");
        exportJson("hindb", "concept", "name,shortName,description,conceptClasses.name,conceptClasses.description", jsonFile);
        
        String jsonData = FileUtils.getContents(jsonFile);
        
        jsonData = jsonData.replace("\"$", "\"_");
        
        XMLSerializer serializer = new XMLSerializer();
        JSON json = JSONSerializer.toJSON(jsonData);
        String xml = serializer.write(json);
        System.out.println(xml);
        
        Document document = XMLHelper.getXMLDocument(xml);
        NodeList list = (NodeList) XMLHelper.read(document, "//_id", XPathConstants.NODESET);
        System.out.println("Found ids: " + list.getLength());
        for(int i = 0; i < list.getLength(); i++){
        	Node node = list.item(i);
        	node.getParentNode().removeChild(node);
        }
        
        xml = XMLHelper.getXMLDocumentAsString(document);
		
        PrintWriter pw = new PrintWriter("src/test/resources/concept.xml");
        pw.println(xml);
        pw.flush();
        pw.close();*/
	}
	
	private void exportJson(String db, String collection, String fields, File exportLocation){
		String cmd = "mongoexport";
		cmd += " --db " + db;
		cmd += " --collection " + collection;
		cmd += " --out " + exportLocation.getAbsolutePath();
		cmd += " --journal";
		cmd += " --fields " + fields;
		cmd += " --jsonArray";
		
		try {
			Process process = Runtime.getRuntime().exec(cmd);
			process.waitFor();
			System.out.println("Command done");
		} catch (IOException e) {
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
}
