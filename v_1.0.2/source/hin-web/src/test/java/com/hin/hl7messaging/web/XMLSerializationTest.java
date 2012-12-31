/**
 * 
 */
package com.hin.hl7messaging.web;

import java.util.Date;

import org.junit.Before;
import org.junit.Test;

import com.hin.domain.config.ConfigAttribute;
import com.hin.domain.config.ConfigClass;
import com.hin.domain.config.ConfigField;
import com.hin.domain.config.ConfigParam;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.config.MetaInfo;
import com.thoughtworks.xstream.XStream;

/**
 * @author Administrator
 *
 */
public class XMLSerializationTest {

	private XStream stream;
	
	@Before
	public void setUpSerializer(){
		stream = new XStream();
		stream.processAnnotations(HL7MessageConfiguration.class);
	}
	
	@Test
	public void testObjectToXml(){
		ConfigClass conf = new ConfigClass();
		conf.setDisplayOrder(1);
		conf.setInputControl("Registration");
		conf.setLabel("Organization registration");
		conf.setTagName("OrgReg");
		
		ConfigAttribute attr = new ConfigAttribute();
		attr.setDisplayOrder(1);
		attr.setInputControl("textbox");
		attr.setTagName("admitter");
		
		ConfigParam param = new ConfigParam();
		param.setName("required");
		param.setValue("false");		
		attr.getControlParameter().getParams().add(param);
		param = new ConfigParam();
		param.setName("label");
		param.setValue("Some label");		
		attr.getControlParameter().getParams().add(param);

		conf.getAttributes().add(attr);
		
		ConfigField field = new ConfigField();
		field.setDisplayOrder(9);
		field.setInputControl("PN");
		field.setLabel("Oranization Name");
		field.setMaxOccurs(-1);
		field.setMinOccurs(1);
		field.setTagName("name");
		field.setType("PN");
		
		conf.getFields().add(field);
		
		attr = new ConfigAttribute();
		attr.setDisplayOrder(3);
		attr.setInputControl("radiobutton");
		attr.setTagName("typeCode");
		
		param = new ConfigParam();
		param.setName("required");
		param.setValue("false");		
		attr.getControlParameter().getParams().add(param);
		param = new ConfigParam();
		param.setName("dataSource");
		param.setValue("NullFlavorSource");		
		attr.getControlParameter().getParams().add(param);
		
		field.getAttributes().add(attr);
		
		HL7MessageConfiguration msg = new HL7MessageConfiguration();
		msg.setConfigClass(conf);
		MetaInfo info = new MetaInfo();
		info.setArtifactID("PRPA_IN0001");
		info.setPublisher("admin@imtacict.com");
		info.setCreatedDate(new Date());
		info.setDescription("Message for registration");
		
		msg.setMetaInfo(info);
		
		conf = new ConfigClass();
		conf.setDisplayOrder(12);
		conf.setInputControl("Class");
		conf.setLabel("Contact Party");
		conf.setTagName("contactParty");
		
		attr = new ConfigAttribute();
		attr.setDisplayOrder(1);
		attr.setInputControl("NullFlavorCombo");
		attr.setTagName("nullFlavor");
		param = new ConfigParam();
		param.setName("required");
		param.setValue("false");		
		attr.getControlParameter().getParams().add(param);
		param = new ConfigParam();
		param.setName("dataSource");
		param.setValue("NullFlavorSource");		
		attr.getControlParameter().getParams().add(param);	
		conf.getAttributes().add(attr);
		
		msg.getConfigClass().getClasses().add(conf);
		
		String xml = stream.toXML(msg);
		System.out.println("XML:\n" + xml);
	}

	@Test
	public void testMessageConfig(){
		System.out.println(stream.toXML(new HL7MessageConfiguration()));
		HL7MessageConfiguration c = new HL7MessageConfiguration();
		c.getMetaInfo().setArtifactID("PRERLJRE");
		System.out.println(stream.toXML(c));
	}
}
