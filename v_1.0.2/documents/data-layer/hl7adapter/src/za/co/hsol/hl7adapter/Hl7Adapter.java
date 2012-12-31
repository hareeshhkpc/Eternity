package za.co.hsol.hl7adapter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.meta.ConfigDocument;


public class Hl7Adapter {
	public ConfigDocument getConfigDocument(String DocumentID){
	    FileInputStream in;
	    ConfigDocument doc = null;
		try {
			in = new FileInputStream(new File("test/artifacts/PRPA_IN203000HT04.xml"));
			doc= ConfigDocument.loadConfigFile(in);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return doc;

	}
	
}
