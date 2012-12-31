/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;
import java.util.ListIterator;
import java.util.Stack;

import javax.xml.namespace.NamespaceContext;
import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.hin.domain.config.ARCHIVE_FIELD_TYPE;
import com.hin.domain.config.CHILD_TRAVERSE_POLICY;
import com.hin.domain.config.CONFIG_OBJECT_TYPE;
import com.hin.domain.config.ConfigArchive;
import com.hin.domain.config.ConfigArchiveField;
import com.hin.domain.config.ConfigClass;
import com.hin.domain.config.ConfigElement;
import com.hin.domain.config.ConfigField;
import com.hin.domain.config.ConfigGeneratorParam;
import com.hin.domain.config.ConfigIndex;
import com.hin.domain.config.ConfigIndexField;
import com.hin.domain.config.ConfigParamTreeNode;
import com.hin.domain.config.ConfigSchemaSet;
import com.hin.domain.config.ConfigWorkFlow;
import com.hin.domain.config.ConfigWorkFlowStart;
import com.hin.domain.config.ConfigWorkFlowTask;
import com.hin.domain.config.ConfigWorkFlowTransition;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.config.HL7SchemaNamespaceContext;
import com.hin.domain.config.IConfigElement;
import com.hin.domain.config.MESSAGE_SCHEMA_CATEGORY;
import com.hin.domain.config.MessageSchema;
import com.hin.domain.config.MessageSchemaDescriptor;
import com.hin.domain.config.MetaInfo;
import com.hin.domain.config.RIM_TYPE;
import com.hin.domain.config.SCHEMA_ELEMENT_TYPE;
import com.hin.domain.config.SCHEMA_TYPE;
import com.hin.hl7messaging.utils.XMLHelper;
import com.thoughtworks.xstream.XStream;


/**
 * @author Administrator
 *
 */
public class ConfigSerializer {

	private MessageSchemaDescriptor descriptor;
	private NamespaceContext context = new HL7SchemaNamespaceContext();
	private HL7MessageConfiguration configuration;
	private ConfigGeneratorParam generatorParam;
	private Stack<String> treePath = new Stack<String>();
	private XStream streamSerializer;
	
	public HL7MessageConfiguration createConfiguration(File configFile) throws Exception{
		
		streamSerializer = new XStream();
		streamSerializer.processAnnotations(ConfigGeneratorParam.class);
		generatorParam = (ConfigGeneratorParam) streamSerializer.fromXML(configFile);
		generatorParam.initDefaults();
		
		treePath.push("/");
		
		configuration = new HL7MessageConfiguration();
		
		System.out.println("Loading all schemas...");
		
		descriptor = new MessageSchemaDescriptor();
		createMessageSchemaDescriptor();
		
		System.out.println("Finished loading schemas...");
		
		MetaInfo info = new MetaInfo();
		info.setArtifactID(generatorParam.getArtifactId());
		info.setDescription(generatorParam.getDescription());
		info.setEntryPoint(generatorParam.getRootClass());
		info.setCreatedDate(new Date());
		configuration.setMetaInfo(info);
		
		ConfigClass rootCls = new ConfigClass();
		if(generatorParam.getArtifactIDAsRootTag()){
			rootCls.setTagName(generatorParam.getArtifactId());
		}
		else{
			rootCls.setTagName(getArtifactIDFromSchemaFileName(descriptor.getMessageSchema().getSchemaFile().getName()));
		}
		rootCls.setType(generatorParam.getRootClass());
		RIM_TYPE rim_TYPE = getRIMType(generatorParam.getRootClass(), descriptor.getMessageSchema().getDocument(), (HL7SchemaNamespaceContext) context);
		rootCls.setRIMType(rim_TYPE);
		
		configuration.setConfigClass(rootCls);
		
		getClassView(generatorParam.getRootClass(), rootCls);
		
		updateConfigurationPropertyDefaults(configuration, "id", 100);
		
		streamSerializer.processAnnotations(HL7MessageConfiguration.class);
		
		File targetFile = new File(generatorParam.getConfigFilePath());
		if(targetFile.exists()){
			HL7MessageConfiguration tconf = (HL7MessageConfiguration) streamSerializer.fromXML(targetFile);
			updateConfigurationWithExistingControlParameters(configuration, tconf);
		}
		else {
			ConfigIndex configIndex = new ConfigIndex();
			configIndex.setIndexName(configuration.getMetaInfo().getArtifactID() + "_Index");
			ConfigIndexField field = new ConfigIndexField();
			field.setIndexed(Boolean.TRUE);
			field.setName("id");
			field.setXpath("//" + configuration.getMetaInfo().getArtifactID() + "/id[1]/@root");
			configIndex.getAttributes().add(field);
			configuration.setConfigIndex(configIndex);
			
			ConfigArchive configArchive = new ConfigArchive();
			configArchive.setColumnFamilyName(configuration.getMetaInfo().getArtifactID());
			ConfigArchiveField field1 = new ConfigArchiveField();
			field1.setIndexed(Boolean.TRUE);
			field1.setName("id");
			field1.setXpath("//" + configuration.getMetaInfo().getArtifactID() + "/id[1]/@root");
			field1.setType(ARCHIVE_FIELD_TYPE.ROWKEY);
			configArchive.getAttributes().add(field1);
			configuration.setConfigArchive(configArchive);
		}
		if(!targetFile.exists()){
			ConfigWorkFlow configWorkFlow = createWorkflowConfiguration();
			configuration.setConfigWorkFlow(configWorkFlow);
		}else {
			HL7MessageConfiguration tconf = (HL7MessageConfiguration) streamSerializer.fromXML(targetFile);
			ConfigWorkFlow configWorkFlow = tconf.getConfigWorkFlow();
			if(configWorkFlow == null){
				configWorkFlow = createWorkflowConfiguration();
			}
			configuration.setConfigWorkFlow(configWorkFlow);
		}
		
		String configString = streamSerializer.toXML(configuration);
		
		FileWriter fileWriter = new FileWriter(targetFile);
		fileWriter.write(configString);
		fileWriter.flush();
		fileWriter.close();
		
		return configuration;
	}

	public void updateConfigurationWithExistingControlParameters(IConfigElement created, IConfigElement existing) {
		if(created instanceof HL7MessageConfiguration){
			HL7MessageConfiguration createdConf = (HL7MessageConfiguration) created;
			HL7MessageConfiguration existingConf = (HL7MessageConfiguration) existing;
			
			createdConf.setConfigIndex(existingConf.getConfigIndex());
			createdConf.setConfigArchive(existingConf.getConfigArchive());
			
			updateConfigurationWithExistingControlParameters(createdConf.getConfigClass(), existingConf.getConfigClass());
		}
		else if(created instanceof ConfigClass){	
			ConfigClass createdClass = (ConfigClass) created;
			ConfigClass existingClass = (ConfigClass) existing;
			createdClass.setAttributes(existingClass.getAttributes());
			createdClass.setInputControl(existingClass.getInputControl());
			
			int index = 0;
			for(ConfigClass childClass : createdClass.getClasses()){
				if(existingClass.getClasses().size() > index){
					updateConfigurationWithExistingControlParameters(childClass, existingClass.getClasses().get(index++));
				}
			}
			
			index = 0;
			for(ConfigField childField : createdClass.getFields()){
				if(existingClass.getFields().size() > index){
					updateConfigurationWithExistingControlParameters(childField, existingClass.getFields().get(index++));
				}
			}
		}
		else if(created instanceof ConfigField){
			ConfigField createdField = (ConfigField) created;
			ConfigField existingField = (ConfigField) existing;
			createdField.setAttributes(existingField.getAttributes());
			if(existingField.getInputControl() != null && existingField.getInputControl().length() > 0){
				createdField.setInputControl(existingField.getInputControl());
			}
			createdField.setControlParameter(existingField.getControlParameter());
		}
	}

	private ConfigWorkFlow createWorkflowConfiguration() {
		ConfigWorkFlow configWorkFlow = new ConfigWorkFlow();
		configWorkFlow.setName("Workflow Configuration For: " + configuration.getMetaInfo().getArtifactID());
		configWorkFlow.setId("id");
		ConfigWorkFlowStart start = new ConfigWorkFlowStart();
		ConfigWorkFlowTask task = new ConfigWorkFlowTask();
		start.setG("20,20,48,48");
		ConfigWorkFlowTransition transition = new ConfigWorkFlowTransition();
		transition.setName("true");
		transition.setTo("Save");
		start.setTransition(transition);
		configWorkFlow.setStart(start);
		task.setName("Save");
		transition = new ConfigWorkFlowTransition();
		transition.setName("Save");
		transition.setTo("Save");
		task.getTransitition().add(transition);
		configWorkFlow.setTask(task);
		return configWorkFlow;
	}

	private void getClassView(String elementType, ConfigClass cls) {
		String currentXpath = getXpathFromTreePath();		
		System.out.println("Xpath: " + currentXpath);
		List<ConfigElement> elementList = getElementList(elementType);
		int i = 0;
		
		ConfigParamTreeNode classTreeNode = generatorParam.getParamTreeNode(getXpathFromTreePath());
		
		for(ConfigElement e : elementList){
			
			int min = getMinMaxCount(e.getElement(), "minOccurs");
			int max = getMinMaxCount(e.getElement(), "maxOccurs");
						
			if(e.getType() == CONFIG_OBJECT_TYPE.FIELD){
				ConfigParamTreeNode node = generatorParam.getParamTreeNode(currentXpath + e.getElement().getAttribute("name") + "/");
				
				if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.ALWAYS){
					
				}
				else if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.MANDATORY){
					if(min < 1){
						continue;
					}
				}
				else if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.OPTIONAL){
					if(min > 0){
						continue;
					}
				}
				
				for(int r = 0; r < node.getRepeatCount(); r++){			
					ConfigField field = new ConfigField();
					field.setTagName(e.getElement().getAttribute("name"));
					if(node.getOverriddenFieldType() == null){
						field.setType(e.getElement().getAttribute("type"));
					}
					else{
						field.setType(node.getOverriddenFieldType());
					}					
					field.setLabel(getFormattedLabel(e.getElement().getAttribute("name")));
					field.setMinOccurs(min);
					field.setMaxOccurs(max);
					field.setDisplayOrder(i++);
					field.setInputControl(field.getType());
					cls.getFields().add(field);
				}
			}
			else if(e.getType() == CONFIG_OBJECT_TYPE.CLASS){
				ConfigParamTreeNode node = generatorParam.getParamTreeNode(currentXpath + e.getElement().getAttribute("name") + "/");
				if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.ALWAYS){
					
				}
				else if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.MANDATORY){
					if(min < 1){
						continue;
					}
				}
				else if(node.getConsiderChildrenWhen() == CHILD_TRAVERSE_POLICY.OPTIONAL){
					if(min > 0){
						continue;
					}
				}
				
				RIM_TYPE rim_TYPE = getRIMType(e.getElement().getAttribute("type"), e.getSchema().getDocument(), (HL7SchemaNamespaceContext) context);
				
				for(int r = 0; r < node.getRepeatCount(); r++){	
					ConfigClass confCls = new ConfigClass();
					confCls.setTagName(e.getElement().getAttribute("name"));
					confCls.setType(e.getElement().getAttribute("type"));
					confCls.setLabel(getFormattedLabel(e.getElement().getAttribute("name")));
					confCls.setMinOccurs(min);
					confCls.setMaxOccurs(max);
					confCls.setDisplayOrder(i++);
					confCls.setRIMType(rim_TYPE);
					cls.getClasses().add(confCls);
				}
			}
		}
		
		/*if(currentXpath.equals("/")){
			System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAaa");
		}*/
		
		i = 0;
		for(ConfigClass configClass : cls.getClasses()){
			ConfigParamTreeNode node = generatorParam.getParamTreeNode(currentXpath + configClass.getTagName() + "/");
			if(classTreeNode.getTraverseMessageObjectChild() && node.getTraverseChildWhen() == CHILD_TRAVERSE_POLICY.ALWAYS){
				
			}
			else if(classTreeNode.getTraverseMessageObjectChild() && node.getTraverseChildWhen() == CHILD_TRAVERSE_POLICY.MANDATORY){
				if(configClass.getMinOccurs() < 1){
					continue;
				}
			}
			else if(classTreeNode.getTraverseMessageObjectChild() && node.getTraverseChildWhen() == CHILD_TRAVERSE_POLICY.OPTIONAL){
				if(configClass.getMinOccurs() > 0){
					continue;
				}
			}
			if(classTreeNode.getTraveseChildList() != null && classTreeNode.getTraveseChildList().length() > 0){
				List<String> list = Arrays.asList(classTreeNode.getTraveseChildList().split(","));
				if(!list.contains(configClass.getTagName())){
					continue;
				}
			}
			treePath.push(configClass.getTagName() + "/");
			getClassView(configClass.getType(), configClass);
			treePath.pop();
		}
		
		// clean up all classes which are not traversed
		ListIterator<ConfigClass> iterator = cls.getClasses().listIterator();
		while(iterator.hasNext()){
			ConfigClass c = iterator.next();
			if(c.getFields().size() < 1 && c.getClasses().size() < 1){
				iterator.remove();
			}
		}
	}
	
	private String getXpathFromTreePath() {
		Enumeration<String> enumeration = treePath.elements();
		String xpath = "";
		while(enumeration.hasMoreElements()){
			xpath = xpath.concat(enumeration.nextElement());
		}
		return xpath;
	}

	public List<ConfigElement> getElementList(String element){		
		MessageSchema messageSchema = getMessageSchemaForType(element);
		List<ConfigElement> elementList = new ArrayList<ConfigElement>();
		
		if(messageSchema == null){
			return elementList;
		}
		
		String xpath = "//xs:complexType[@name='" + element + "']//xs:element";
				/*"     //xs:complexType[@name='" + element + "']//xs:group" 
				+ " | //xs:complexType[@name='" + element + "']//xs:element"
				+ " | //xs:complexType[@name='" + element + "']//xs:attribute"
				+ " | //xs:complexType[@name='" + element + "']//xs:attributeGroup"*/;
		
		NodeList elements = (NodeList) XMLHelper.read(messageSchema.getDocument(), xpath, XPathConstants.NODESET, context);		
		for(int i = 0; i < elements.getLength(); i++){
			MessageSchema schema = getMessageSchemaForType(((Element)elements.item(i)).getAttribute("type"));
			ConfigElement configElement = new ConfigElement();
			configElement.setElement((Element) elements.item(i));
			configElement.setSchema(schema);
			
			if(elements.item(i).getNodeName().equals("xs:group")){
				configElement.setSchemaElementType(SCHEMA_ELEMENT_TYPE.ELEMENT_GROUP);
			} else if(elements.item(i).getNodeName().equals("xs:element")){
				configElement.setSchemaElementType(SCHEMA_ELEMENT_TYPE.ELEMENT);
			} else if(elements.item(i).getNodeName().equals("xs:attribute")){
				configElement.setSchemaElementType(SCHEMA_ELEMENT_TYPE.ATTRIBUTE);
			} else if(elements.item(i).getNodeName().equals("xs:attributeGroup")){
				configElement.setSchemaElementType(SCHEMA_ELEMENT_TYPE.ATTRIBUTE_GROUP);
			}
			
			if(schema.getCategory() == MESSAGE_SCHEMA_CATEGORY.CORE_SCHEMA){
				configElement.setType(CONFIG_OBJECT_TYPE.FIELD);
			}
			else {
				configElement.setType(CONFIG_OBJECT_TYPE.CLASS);
			}
			elementList.add(configElement);
		}
		
		return elementList;
	}
	
	public static RIM_TYPE getRIMType(String className, Document document,
			HL7SchemaNamespaceContext context) {
		RIM_TYPE type = RIM_TYPE.UNIDENTIFIED;
		Double moodCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='moodCode'])", XPathConstants.NUMBER, context);
		Double classCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='classCode'])", XPathConstants.NUMBER, context);
		Double determinerCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='determinerCode'])", XPathConstants.NUMBER, context);
		Double typeCodeCount = (Double) XMLHelper.read(document, "count(//xs:complexType[@name='" + className + "']/xs:attribute[@name='typeCode'])", XPathConstants.NUMBER, context);
		
		if(moodCodeCount == 1 && classCodeCount == 1){
			type = RIM_TYPE.ACT;
		} else if(determinerCodeCount == 1 && classCodeCount == 1){
			type = RIM_TYPE.ENTITY;
		} else if(classCodeCount == 1 && typeCodeCount == 0){
			type = RIM_TYPE.ROLE;
		}
		return type;
	}
	
	public MessageSchema getMessageSchemaForType(String typeName){
		MessageSchema messageSchema = null;
		if(descriptor.getMessageSchema().getComplexTypes().containsKey(typeName)
				|| descriptor.getMessageSchema().getSimpleTypes().containsKey(typeName)){
			messageSchema = descriptor.getMessageSchema();
		}
		else{
			for(MessageSchema schema : descriptor.getCoreSchemaMap().values()){
				if(schema.getComplexTypes().containsKey(typeName)
						|| schema.getSimpleTypes().containsKey(typeName)){
					messageSchema = schema;
					break;
				}
			}
			
			if(messageSchema == null){
				for(MessageSchema schema : descriptor.getIncludedSchemaMap().values()){
					if(schema.getComplexTypes().containsKey(typeName)
							|| schema.getSimpleTypes().containsKey(typeName)){
						messageSchema = schema;
					}
				}
			}
		}
		
		if(messageSchema == null){
			System.err.println("messageSchema is null for type " + typeName);
		}
		
		return messageSchema;
	}
	
	public ConfigClass traverseClass(Element element, ConfigClass configClass){
		ConfigClass clazz = new ConfigClass();
		clazz.setTagName(element.getAttribute("name"));
		
		return null;
	}
	
	public Integer getMinMaxCount(Element element, String minMax){
		Integer minMaxVal = 0;
		if(element.hasAttribute(minMax)){
			String val = element.getAttribute(minMax);
			if(val.charAt(0) >= 48 && val.charAt(0) <= 58){
				minMaxVal = Integer.parseInt(val);
			}
			else {
				minMaxVal = -1;
			}
		}
		else {
			if(element.getNodeName().equals("xs:element")){
				minMaxVal = 1;
			}
		}
		return minMaxVal;
	}
	
	public static String getFormattedLabel(String className) {
		String displayName = (className.lastIndexOf('.') > -1) ? className.substring(className.lastIndexOf('.') + 1) : className;
		String formattedDisplayName = "";
		int li = 0;
		for(int si = 0; si < displayName.length(); si++){
			if(displayName.charAt(si) >= 'A' && displayName.charAt(si) <= 'Z'){
				formattedDisplayName += displayName.substring(li, si);
				formattedDisplayName += " ";
				li = si;
			}
		}
		formattedDisplayName += displayName.substring(li);
		if(formattedDisplayName.length() < 1){
			System.err.println("Class: " + className);
		}
		formattedDisplayName = formattedDisplayName.substring(0, 1).toUpperCase() + formattedDisplayName.substring(1);
		formattedDisplayName = formattedDisplayName.trim();
		return formattedDisplayName;
	}
	
	public static String getArtifactIDFromSchemaFileName(String fileName){
		String artifact = fileName.substring(0, fileName.lastIndexOf('.'));
		return artifact;
	}
	
	private void createMessageSchemaDescriptor() throws Exception {
		
		File messageSchema;
		File[] coreSchemas; 
		File[] includedSchemas;
		
		ConfigSchemaSet set = generatorParam.getSchemaSetForType(SCHEMA_TYPE.MESSAGE);
		messageSchema = new File(set.getPath());
		if(!messageSchema.exists() || messageSchema.isDirectory()){
			throw new Exception("Target schema (type = '" + SCHEMA_TYPE.MESSAGE + ") doesn't exist or it's a directory: " + messageSchema.getPath());
		}
		
		set = generatorParam.getSchemaSetForType(SCHEMA_TYPE.CORESCHEMA);
		File path = new File(set.getPath());
		if(!path.exists()){
			throw new Exception("Target schema (type = '" + SCHEMA_TYPE.CORESCHEMA + ") doesn't exist: " + set.getPath());
		}
		if(path.isDirectory()){
			coreSchemas = path.listFiles();
		}
		else {
			coreSchemas = new File[]{path};
		}
		
		set = generatorParam.getSchemaSetForType(SCHEMA_TYPE.SCHEMAS);
		path = new File(set.getPath());
		if(!path.exists()){
			throw new Exception("Target schema (type = '" + SCHEMA_TYPE.SCHEMAS + ") doesn't exist: " + set.getPath());
		}
		if(path.isDirectory()){
			//includedSchemas = path.listFiles();
			//messageSchema
			SchemaArchiveManager schemaArchiveManager = new SchemaArchiveManager();
			ArrayList<String> includedSchemaNames = schemaArchiveManager.getIncludes(messageSchema, new ArrayList<String>());
			ArrayList<File> includedSchemaFileList = new ArrayList<File>();
			for(String filePath : includedSchemaNames){
				includedSchemaFileList.add(new File(filePath));
			}
			includedSchemas = includedSchemaFileList.toArray(new File[]{});
		}
		else {
			includedSchemas = new File[]{path};
		}
		
		MessageSchema schema = MessageSchema.getMessageSchema(messageSchema, context);		
		schema.setCategory(MESSAGE_SCHEMA_CATEGORY.MAIN_SCHEMA);
		descriptor.setMessageSchema(schema);
		
		for(int i = 0; i < coreSchemas.length; i++){
			schema = MessageSchema.getMessageSchema(coreSchemas[i], context);
			schema.setCategory(MESSAGE_SCHEMA_CATEGORY.CORE_SCHEMA);
			String name = coreSchemas[i].getName().substring(0, coreSchemas[i].getName().lastIndexOf('.'));
			descriptor.getCoreSchemaMap().put(name, schema);
		}
		
		for(int i = 0; i < includedSchemas.length; i++){
			schema = MessageSchema.getMessageSchema(includedSchemas[i], context);
			schema.setCategory(MESSAGE_SCHEMA_CATEGORY.INCLUDED_SCHEMA);
			String name = includedSchemas[i].getName().substring(0, includedSchemas[i].getName().lastIndexOf('.'));
			descriptor.getIncludedSchemaMap().put(name, schema);
		}
	}
	
	public void checkSchemasExist(File messageSchema, File[] coreSchemas, File[] includedSchemas) throws Exception{
		
		if(!messageSchema.exists()){
			throw new Exception("Target message type schema doesn't exist: " + messageSchema.getName());
		}
		
		if(coreSchemas == null){
			return;
		}
		
		for(File schema : coreSchemas){
			if(!schema.exists()){
				throw new Exception("Target core schema doesn't exist: " + schema.getName());
			}
		}
		
		if(includedSchemas == null){
			return;
		}
		
		for(File schema : includedSchemas){
			if(!schema.exists()){
				throw new Exception("Target included schema doesn't exist: " + schema.getName());
			}
		}
	}	
	
	private void updateConfigurationPropertyDefaults(IConfigElement configElement, String idPrefix, Integer id){
		if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.MESSAGE){
			//((HL7MessageConfiguration)configElement).setId(idPrefix + (++id));
			//((HL7MessageConfiguration)configElement).getMetaInfo().setId(idPrefix + (++id));
			updateConfigurationPropertyDefaults(((HL7MessageConfiguration)configElement).getConfigClass(), idPrefix, id);
		}
		else if(configElement.getConfigType() == CONFIG_OBJECT_TYPE.CLASS){
			//((ConfigClass)configElement).setId(idPrefix + (++id));

			/*for(ConfigField field : ((ConfigClass)configElement).getFields()){
				field.setId(idPrefix + (++id));
			}*/
			for(ConfigClass configClass : ((ConfigClass)configElement).getClasses()){
				updateConfigurationPropertyDefaults(configClass, idPrefix, id);
				if(configClass.getRIMType() == RIM_TYPE.UNIDENTIFIED){
					if(configElement.getRIMType() == RIM_TYPE.ACT){
						if(configClass.getClasses().size() > 0 && configClass.getClasses().get(0).getRIMType() == RIM_TYPE.ACT){
							configClass.setRIMType(RIM_TYPE.ACTRELATIONSHIP);
						}
						if(configClass.getClasses().size() > 0 && configClass.getClasses().get(0).getRIMType() == RIM_TYPE.ROLE){
							configClass.setRIMType(RIM_TYPE.PARTICIPATION);
						}
					}
					if(configElement.getRIMType() == RIM_TYPE.ROLE){
						if(configClass.getClasses().size() > 0 && configClass.getClasses().get(0).getRIMType() == RIM_TYPE.ROLE){
							configClass.setRIMType(RIM_TYPE.ROLELINK);
						}
					}
				}
			}
		}
	}
}
