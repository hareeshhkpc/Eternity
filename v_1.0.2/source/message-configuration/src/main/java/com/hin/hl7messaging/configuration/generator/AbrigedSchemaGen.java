/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import java.io.File;
import java.io.FilenameFilter;
import java.util.Date;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.log4j.Logger;

/**
 * @author admin
 * 
 */
public class AbrigedSchemaGen {
	
	private static Logger logger = Logger.getLogger(AbrigedSchemaGen.class.getName());

	public void createMessageConfiguration(MessageTypeSchemaDescriptor descriptor) throws Exception{
		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(descriptor.getAbrigedSchemaGenXsl());
		source.setSystemId(descriptor.getAbrigedSchemaGenXsl());
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);
			
			tr.setParameter("messageTypeIdentifier", descriptor.getMessageTypeIdentifier());
			tr.setParameter("messageDisplayName", descriptor.getMessageDisplayName());
			tr.setParameter("createdDate", new Date());			
			tr.setParameter("baseDirFullPath", descriptor.getBaseDiractory().getAbsolutePath());
			tr.setParameter("baseFileName", descriptor.getSourceSchemaFile() .getName());
			tr.setParameter("coreSchemaDirName", descriptor.getCoreSchemaDirName());
			tr.setParameter("schemaDirName", descriptor.getSchemaDirName());	
			
			RecurseHelper rh = new RecurseHelper();		
			
			File coreSchemaDir = new File(descriptor.getBaseDiractory() + "/" + descriptor.getCoreSchemaDirName());
			if(!coreSchemaDir.exists()){
				throw new Exception();
			}
			
			FilenameFilter filter = new FilenameFilter() {
				
				@Override
				public boolean accept(File file, String arg1) {
					return file.getName().toLowerCase().endsWith(".xsd");
				}
			};
			
			for(File cFile : coreSchemaDir.listFiles(filter)){
				rh.getCoreSchema().add(cFile.getName());	
			}
			
			tr.setParameter("recurseHelper", rh);			
			tr.setParameter("nonExistingAttrValue", "#$#");
			tr.setParameter("idElementName", "e_id");
			tr.setParameter("idValuePrefix", "id");
			tr.setParameter("labelElementName", "label");

		} catch (TransformerConfigurationException e1) {
			e1.printStackTrace();
		}
		
		System.out.println("Message configuration generator started.");
		
		try {
			StreamResult result = new StreamResult(descriptor.getOutputFile());
			StreamSource docSrc = new StreamSource(descriptor.getSourceSchemaFile());
			docSrc.setSystemId(descriptor.getSourceSchemaFile());
			tr.transform(docSrc, result);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			
		}
		System.out.println("Finished. Output: " + descriptor.getOutputFile().getAbsolutePath());
	}
	
	
	
	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		
		File out = new File("src/main/resources/messageconfig/PRPA_IN000001.xml");
		File xsl = new File("src/main/resources/transform/messagedef/abriged-schema-v.1.8.xsl");
		File xsd = new File("src/main/resources/messageconfig/htb/schemas/PRPA_IN000001.xsd");
		
		MessageTypeSchemaDescriptor descriptor = new MessageTypeSchemaDescriptor();
		descriptor.setAbrigedSchemaGenXsl(xsl);
		descriptor.setBaseDiractory(xsd.getParentFile().getParentFile());
		descriptor.setCoreSchemaDirName("coreschemas");
		descriptor.setCreatedByWhom("Abdul Kahar<abdul.kahar@imtacict.com>");
		descriptor.setMessageDisplayName("User Registration Message");
		descriptor.setMessageTypeIdentifier("USER_REGISTRATION_V0001");
		descriptor.setOutputFile(out);
		descriptor.setSchemaDirName("schemas");
		descriptor.setSourceSchemaFile(xsd);
		
		new AbrigedSchemaGen().createMessageConfiguration(descriptor);

		/*TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(xsl);
		source.setSystemId(xsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);
			
			tr.setParameter("messageTypeIdentifier", "USER_REGISTRATION_V0001");
			tr.setParameter("messageDisplayName", "User Registration Message");
			tr.setParameter("createdDate", new Date());
			
			tr.setParameter("baseDirFullPath", xsd.getParentFile().getParentFile().getAbsolutePath());
			tr.setParameter("baseFileName", xsd.getName());
			tr.setParameter("coreSchemaDirName", "coreschemas");
			tr.setParameter("schemaDirName", "schemas");	
			
			RecurseHelper rh = new RecurseHelper();		
			
			rh.getCoreSchema().add("datatypes-base.xsd");
			rh.getCoreSchema().add("datatypes.xsd");
			rh.getCoreSchema().add("infrastructureRoot.xsd");
			//rh.getCoreSchema().add("NarrativeBlock.xsd");
			rh.getCoreSchema().add("voc.xsd");
			
			
			tr.setParameter("recurseHelper", rh);			
			tr.setParameter("nonExistingAttrValue", "#$#");
			tr.setParameter("idElementName", "e_id");
			tr.setParameter("idValuePrefix", "id");
			tr.setParameter("labelElementName", "label");
			//tr.setParameter("messageFileName", "../../messageconfig/test/XML/POLB_EX224200_01_australia.xml");
		} catch (TransformerConfigurationException e1) {
			logger.error("Transformation error:"+e1.getMessage());
		}
		try {
			StreamResult result = new StreamResult(out);
			StreamSource docSrc = new StreamSource(xsd);
			docSrc.setSystemId(xsd);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Transformation error:"+e.getMessage());
		} finally {
			
		}
		System.out.println("Finished. Output: " + out.getAbsolutePath());*/
	}
}