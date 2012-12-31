package za.co.hsol.hl7adapter.meta;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.xml.parsers.ParserConfigurationException;

import org.junit.Test;
import org.xml.sax.SAXException;

public class ConfigClassTest {

	@Test
	public void test() throws SAXException, IOException {
		    FileInputStream in = new FileInputStream(new File("test/artifacts/PRPA_IN203000HT04.xml"));
			ConfigDocument doc = ConfigDocument.loadConfigFile(in);
			ConfigClass cl = doc.getChildClass("registrationEvent");	
			
			assertEquals(cl.getConfigClassName(), "registrationEvent");
			
			ConfigField field = cl.getField("id");
			assertTrue(field.getProperty("label").equals("Id"));
			assertTrue(field.getProperty("displayOrder").equals("1"));
			
			assertTrue(cl.getProperty("inputControl").equals("Class"));
			
			// nested class
			ConfigClass subject = cl.getChildClass("subject");
			ConfigClass subsumed = subject.getChildClass("subsumedBy");
			assertTrue(subsumed.getProperty("label").equals("Subsumed By"));
			assertTrue(subsumed.getField("statusCode").getProperty("label").equals("Status Code"));
			
			ConfigClass subsumedFromDirect = cl.getChildClass("subject.subsumedBy");
			assertTrue(subsumedFromDirect.getProperty("label").equals("Subsumed By"));
			
			
			//Test missing values
			assertTrue(field.getProperty("").equals(""));
			assertTrue(cl.getField("")==null);

			
			// Test fieldlist
			List<String> l = cl.getFieldNames();
			assertTrue(l.get(0).equals("id"));
			assertTrue(l.size() == 2);
			
			// Test classnames
			l = cl.getChildClassNames();
			assertTrue(l.size()==1);
			
			// Test attributes
			l = cl.getPropertyNames();
			assertTrue(l.get(3).equals("Registration Event"));
			
			// ArtifactId
			String a = doc.getArtifactId();
			assertTrue(a.equals("PRPA_IN203000HT04"));
			
			
		
	}

}
