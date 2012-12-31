package za.co.hsol.hl7adapter.smo;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import org.junit.Test;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.meta.ConfigDocument;
import za.co.hsol.hl7adapter.smo.SMOObject.InvalidFieldNameException;

public class SMOTest {

	@Test
	public void test() throws SAXException, IOException {
		ConfigDocument doc = ConfigDocument.loadConfigFile(new FileInputStream(new File("test/artifacts/PRPA_IN203000HT04.xml")));
        SMOMessage message = doc.createMessage();
        SMOObject obj = message.createObject("should_be_null");
        assertNull(obj);
        
        obj = message.createObject("registrationEvent");
		assertNotNull(obj);
		
		SMOObject obj1 = obj.createObject("should_be_null");
		assertNull(obj1);
		obj1 = obj.createObject("subject");
		assertNotNull(obj1);

		List<SMOObject> l = obj.findObject("should_be_zero");
		assertEquals(l.size(), 0);
		
		l = obj.findObject("subject");
		assertEquals(l.size(), 1);
		
		String s = obj1.getValueAsString("should_be_null");
		assertNull(s);
		
		
		try {
			obj1.setValue("should_throw_exception", "");
			fail("Was expecting an InvalidFieldNameException");
		} catch (InvalidFieldNameException e) {
		}
		
		SMOObject obj2 = obj1.createObject("subsumedBy");
		try {
			obj2.setValue("id", "123");			
		} catch (InvalidFieldNameException e) {
		}
		assertTrue(obj2.getValueAsString("id").equals("123"));
		
		
		
	}
	
	@Test
	public void loadAndValidate() throws FileNotFoundException, SAXException, IOException{
		ConfigDocument doc = ConfigDocument.loadConfigFile(new FileInputStream(new File("test/artifacts/PRPA_IN203000HT04.xml")));
        SMOMessage message = doc.createMessage();
        message.load(new FileInputStream(new File("test/artifacts/SMOTest_load1.xml")));
        assertTrue(message.validateMessage());

        message.load(new FileInputStream(new File("test/artifacts/SMOTest_load_invalid.xml")));
        assertFalse(message.validateMessage());

        
	}
	

}
