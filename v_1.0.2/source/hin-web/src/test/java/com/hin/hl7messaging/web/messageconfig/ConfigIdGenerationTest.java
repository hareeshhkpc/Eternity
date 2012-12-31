package com.hin.hl7messaging.web.messageconfig;

import java.io.File;
import java.io.FileWriter;

import org.junit.Before;
import org.junit.Test;

import com.hin.domain.config.CONFIG_OBJECT_TYPE;
import com.hin.domain.config.ConfigClass;
import com.hin.domain.config.ConfigField;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.config.IConfigElement;
import com.thoughtworks.xstream.XStream;

public class ConfigIdGenerationTest {
	
	private XStream streamSerializer;

	@Before
	public void initTest(){
		streamSerializer = new XStream();
		streamSerializer.processAnnotations(HL7MessageConfiguration.class);
		assert(streamSerializer != null);
	}
	
	@Test
	public void testDeserializeConfigXML() throws Exception {
		File confFile = new File("src/main/webapp/mobile/viewedit/xml/PRPA_IN203000HT04.xml");
		assert(confFile != null);
		HL7MessageConfiguration config = (HL7MessageConfiguration) streamSerializer.fromXML(confFile);
		assert(config != null);
		
		System.out.println(config);
		
		updateConfigurationPropertyDefaults(config, "id", 0);
		
		System.out.println(config);
		
		String configString = streamSerializer.toXML(config);
		confFile = new File(confFile.getParentFile(), config.getMetaInfo().getArtifactID() + "_ID.xml");
		FileWriter fileWriter = new FileWriter(confFile);
		fileWriter.write(configString);
		fileWriter.flush();
		fileWriter.close();	
	}
	
	private void updateConfigurationPropertyDefaults(IConfigElement configElement, String idPrefix, Integer id){
		if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.MESSAGE){
			((HL7MessageConfiguration)configElement).setId(idPrefix + (++id));
			((HL7MessageConfiguration)configElement).getMetaInfo().setId(idPrefix + (++id));
			updateConfigurationPropertyDefaults(((HL7MessageConfiguration)configElement).getConfigClass(), idPrefix, id);
		}
		else if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.CLASS){
			((ConfigClass)configElement).setId(idPrefix + (++id));

			for(ConfigField field : ((ConfigClass)configElement).getFields()){
				field.setId(idPrefix + (++id));
			}
			for(ConfigClass configClass : ((ConfigClass)configElement).getClasses()){
				updateConfigurationPropertyDefaults(configClass, idPrefix, id);
			}
		}
	}

}
