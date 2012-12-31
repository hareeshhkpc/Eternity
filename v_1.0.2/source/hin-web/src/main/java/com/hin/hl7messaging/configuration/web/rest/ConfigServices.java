/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Stack;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.apache.commons.fileupload.FileItem;
import org.apache.log4j.Logger;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.google.gson.Gson;
import com.hin.domain.config.ConfigAction;
import com.hin.domain.config.ConfigClass;
import com.hin.domain.config.ConfigInput;
import com.hin.domain.config.ConfigOutput;
import com.hin.domain.config.HL7MessageConfiguration;
import com.hin.domain.config.HL7ObjectItem;
import com.hin.domain.config.HL7SchemaNamespaceContext;
import com.hin.domain.config.IConfigElement;
import com.hin.domain.config.MetaInfo;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.hl7messaging.vo.MultipartHandler;
import com.thoughtworks.xstream.XStream;


/**
 * @author Administrator
 *
 */

public class ConfigServices extends HttpServlet{

	/**
	 * Let's comply with Java Servlet serializaiton
	 */
	private static final long serialVersionUID = -4081799970599113801L;
	
	/**
	 * Have a logger to keep record of the events.
	 */
	private Logger logger = Logger.getLogger(ConfigServices.class.getName());
	
	/**
	 * Servlet context for use once the web app is loaded.
	 */
	private ServletContext servletContext;
	
	/**
	 * DOM of the schema path names. To be used by the XSL process to look for types.
	 */
	private DOMSource schemaSource;
	
	/**
	 * Where to load the HL7 schemas from (relative path from the web context)
	 */
	private String schemaDir = "/WEB-INF/htb"; // Should be a configuration parameter
	
	private transient MultipartHandler multipartHandler;
	
	private XStream streamSerializer;
	
	/**
	 * Common method where any HTTP GET and POST is processed. Called from doGet() and doPost()
	 * 
	 * @param req
	 * @param resp
	 * @throws ServletException
	 * @throws IOException
	 * @throws XPathExpressionException
	 * @throws ParserConfigurationException
	 */
	public void processConfigRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException, XPathExpressionException, ParserConfigurationException {
		String data = req.getParameter("data");
		if(data == null || data.trim().length() < 1){
			throw new ServletException("No input given");
		}
		
		String action = req.getParameter("action");
		if(action == null || action.trim().length() < 1){
			throw new ServletException("No action given");
		}
		
		Gson gson = new Gson();
		ConfigAction configAction = ConfigAction.valueOf(action);;
		
		String json = "";
		
		switch(configAction){
			case LIST_MESSAGE_TYPES:
				File extractDir = new File(	servletContext.getRealPath("/WEB-INF/imported_messages/extracted/"));
				ArrayList<HL7MessageConfiguration> msgTypes = new ArrayList<HL7MessageConfiguration>();
				for(File file : extractDir.listFiles()){
					HL7MessageConfiguration type = new HL7MessageConfiguration();
					type.getMetaInfo().setArtifactID(file.getName());
					type.getMetaInfo().setDescription(file.getName());
					msgTypes.add(type);
				}
				json = gson.toJson(msgTypes);
				break;
				
			case SHOW_CLASS_VIEW:
				HL7MessageConfiguration configuration = gson.fromJson(data, HL7MessageConfiguration.class);
				extractDir = new File(	servletContext.getRealPath("/WEB-INF/imported_messages/extracted/" + configuration.getMetaInfo().getArtifactID() + "/schemas/"));
				if(!extractDir.exists()){
					throw new ServletException("Target message type doesn't exist.");
				}
				
				File interactSchema = new File(extractDir, configuration.getMetaInfo().getArtifactID() + ".xsd");
				if(!interactSchema.exists()){
					throw new ServletException("Target message type schema doesn't exist: " + configuration.getMetaInfo().getArtifactID() + ".xsd");
				}
				
				File coreSchema = new File(interactSchema.getParentFile().getParentFile(), "coreschemas/datatypes-base.xsd");
				Document datatypeDoc = XMLHelper.getXMLDocument(coreSchema, true);
				Document interactionDocument = XMLHelper.getXMLDocument(interactSchema, true);
				HL7SchemaNamespaceContext context = new HL7SchemaNamespaceContext();
				
				// Generate class view
				ConfigClass configClass = new ConfigClass();
				
				/**
				 * This class view has the root class and its field information
				 */
				configClass = ConfigParser.getRootClassView(interactSchema, datatypeDoc, interactionDocument, context);
				
				// We need to fetch all Participations/ActRelationships of this root Act
				ConfigParser.populateAssociationClasses(configClass, datatypeDoc, interactionDocument, context, interactSchema);			
				
				configuration.setConfigClass(configClass);
				
				ConfigParser.updateConfigurationPropertyDefaults(configuration);
				
				json = gson.toJson(configuration);
				break;
			
			case SAVE_CONFIGURATION:
				configuration = gson.fromJson(data, HL7MessageConfiguration.class);
				extractDir = new File(	servletContext.getRealPath("/WEB-INF/imported_messages/extracted/" + configuration.getMetaInfo().getArtifactID() + "/schemas/"));
				if(!extractDir.exists()){
					throw new ServletException("Target message type doesn't exist.");
				}
				
				//updateConfigurationPropertyDefaults(configuration);
				
				String configString = streamSerializer.toXML(configuration);
				File confFile = new File(extractDir.getParentFile(), configuration.getMetaInfo().getArtifactID() + ".xml");
				FileWriter fileWriter = new FileWriter(confFile);
				fileWriter.write(configString);
				fileWriter.flush();
				fileWriter.close();
				
				json = gson.toJson(configuration);
				break;
		}
		
		resp.setContentType("application/json");
		resp.getWriter().print(json);
		resp.flushBuffer();
	}
	
	

	/**
	 * Common method where any HTTP GET and POST is processed. Called from doGet() and doPost()
	 * 
	 * @param req
	 * @param resp
	 * @throws ServletException
	 * @throws IOException
	 * @throws XPathExpressionException
	 * @throws ParserConfigurationException
	 */
	@SuppressWarnings("unchecked")
	public void processRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException, XPathExpressionException, ParserConfigurationException {
		String data = req.getParameter("data");
		if(data == null){
			logger.warn("No input params", new Exception("No input given"));
			return;
		}
		Gson gson = new Gson();
		ConfigInput input = gson.fromJson(data, ConfigInput.class);
		
		if(input == null || input.getAction() == null){
			logger.warn("ConfigInput parameters are not enough", new Exception("ConfigInput parameters are not enough"));
			return;
		}
		
		// Update the current selection into the configuration
		updateConfiguration(req, input);
		
		File tranformXsl = null;
		File schemaXml = null;
		try {
			if(input.getMessageType() == null || input.getMessageType().length() < 1){
				schemaXml = new File(this.getClass().getResource("/com/hin/hl7messaging/rest/config/dummy.xml").toURI());				
			}
			else {				
				schemaXml = new File(this.servletContext.getRealPath("/WEB-INF/htb/schemas/" + input.getMessageType()));
			}
				
			tranformXsl = new File(this.getClass().getResource("/com/hin/hl7messaging/rest/config/xml-schema-browser.xsl").toURI());
		} catch (URISyntaxException e) {
			throw new ServletException("Invalid resource url", e);
		}
		
		ByteArrayOutputStream stream = new ByteArrayOutputStream();
		
		Map<String, Object> params = new HashMap<String, Object>();
		String baseDir = new File(this.servletContext.getRealPath("/WEB-INF/htb")).getAbsolutePath();
		params.put("baseDir", baseDir);

		Object schemas = getAllInteractionSchemaPathNames();
		params.put("schemas", schemas);
		params.put("action", input.getAction().name());
		if(input.getMessageType() != null)
			params.put("messageType", input.getMessageType());
		if(input.getEntryPoint() != null)
			params.put("entryPoint", input.getEntryPoint());
		if(input.getConfigClassType() != null)
			params.put("configClassType", input.getConfigClassType());
		
		transformSchema(input, params, tranformXsl, schemaXml, stream);
		
		String json = new String(stream.toByteArray());
		ConfigOutput output = gson.fromJson(json, ConfigOutput.class);
		removeEmtyOrNullItems(output);
		
		Stack<IConfigElement> stack = (Stack<IConfigElement>) req.getSession().getAttribute("hl7Config");
		HL7MessageConfiguration config = (HL7MessageConfiguration) stack.get(0);
		
		// to show the config object at the client side as JSON
		output.setCurrentConfig(config);
		output.setMetaInfo(config.getMetaInfo());
		
		// update the output object to reflect the current configuration selection
		updateOutputToReflectConfigurationChange(input, output, stack, config);
		
		json = gson.toJson(output);
		
		resp.setContentType("application/json");
		resp.getWriter().print(json);
		resp.flushBuffer();
	}

	private void updateOutputToReflectConfigurationChange(ConfigInput input,
			ConfigOutput output, Stack<IConfigElement> stack,
			HL7MessageConfiguration config) {
		switch(input.getAction()){
			case LIST_MESSAGE_TYPES:
				if(config.getMetaInfo() != null && config.getMetaInfo().getArtifactID() != null){
					for(HL7ObjectItem item : output.getItems()){
						if(item.getType().equals(config.getMetaInfo().getArtifactID())){
							item.setIsSelected(true);
						}
					}
				}
				break; 
			case LIST_ENTRY_POINTS:
				if(config.getConfigClass() != null && config.getConfigClass().getTagName() != null){
					for(HL7ObjectItem item : output.getItems()){
						if(item.getName().equals(config.getConfigClass().getTagName())){
							item.setIsSelected(true);
						}
					}
				}
				break;
			case SHOW_CLASS_VIEW:
				ConfigClass cls = (ConfigClass) stack.peek();
				if(cls.getClasses() != null){
					for(ConfigClass c : cls.getClasses()){
						for(HL7ObjectItem item : output.getItems()){
							if(item.getName().equals(c.getTagName())){
								item.setIsSelected(true);
							}
						}
					}
				}
				break;
	
			case SHOW_PROPERTY_VIEW:
				break;
		}
	}

	@SuppressWarnings("unchecked")
	private void updateConfiguration(HttpServletRequest req, ConfigInput input) {
		HL7MessageConfiguration configuration = null;
		Stack<IConfigElement> stack = null;
		
		if(req.getSession().getAttribute("hl7Config") == null){
			configuration = new HL7MessageConfiguration();
			stack = new Stack<IConfigElement>();
			req.getSession().setAttribute("hl7Config", stack);
			stack.push(configuration);
		}
		else {
			stack = (Stack<IConfigElement>) req.getSession().getAttribute("hl7Config");
			configuration = (HL7MessageConfiguration) stack.get(0);
		}
		
		switch(input.getAction()){
			case LIST_MESSAGE_TYPES:
				//configuration.setConfigClass(new ConfigClass());
				//configuration.setMetaInfo(new MetaInfo());
				stack.clear();
				stack.push(configuration);
				break; 
			case LIST_ENTRY_POINTS:
				if(input.getMessageType() != null && !input.getMessageType().equals(configuration.getMetaInfo().getArtifactID())){
					configuration.setMetaInfo(new MetaInfo());
					configuration.getMetaInfo().setArtifactID(input.getMessageType());
					configuration.setConfigClass(new ConfigClass());
				}
				stack.clear();
				stack.push(configuration);
				break;
			case SHOW_CLASS_VIEW:
				if(input.getNavigation() != null && input.getNavigation().equals("BACK")){
					if(stack.size() > 1){
						stack.pop();
					}
					break;
				}
				
				if(stack.peek() instanceof HL7MessageConfiguration){
					HL7MessageConfiguration config = (HL7MessageConfiguration) stack.peek();
					if(config.getConfigClass().getType() == null || !config.getConfigClass().getType().equals(input.getConfigClassType())){
						ConfigClass configClass = new ConfigClass();
						configClass.setTagName(input.getTagName());
						configClass.setType(input.getConfigClassType());
						config.setConfigClass(configClass);
						stack.push(configClass);
					} else if(config.getConfigClass().getType().equals(input.getConfigClassType())) {
						stack.push(config.getConfigClass());
					}
				} else if(stack.peek() instanceof ConfigClass){
					ConfigClass config = (ConfigClass) stack.peek();
					// check if this element already in the child colleciton of stack.peek() item
					boolean childExists = false;
					for(ConfigClass childClass : config.getClasses()){
						if(childClass.getTagName().equals(input.getTagName())){
							childExists = true;
							stack.push(childClass);
							break;
						}
					}
					if(!childExists){
						ConfigClass configClass = new ConfigClass();
						configClass.setTagName(input.getTagName());
						configClass.setType(input.getConfigClassType());
						config.getClasses().add(configClass);
						stack.push(configClass);
					}
				}
				break;

			case SHOW_PROPERTY_VIEW:
				break;
				
			case META_INFO_SAVE:
				configuration.setMetaInfo(input.getMetaInfo());
				break;
				
			case SCHEMA_IMPORT:
				
				break;
		}
	}

	private void removeEmtyOrNullItems(ConfigOutput output) {
		int i = 0;
		while(i < output.getItems().size()){
			if(output.getItems().get(i) == null){
				output.getItems().remove(i);
				continue;
			}
			HL7ObjectItem item = output.getItems().get(i);
			if(item.getName() == null || item.getName().length() < 1){
				output.getItems().remove(i);
				continue;
			}
			++i;
		}
	}
	
	private void transformSchema(ConfigInput input, Map<String, Object> parameters, File tranformXsl, 
			File schemaXml, ByteArrayOutputStream stream){
		TransformerFactory tFactory = TransformerFactory.newInstance();

		StreamSource source = new StreamSource(tranformXsl);
		source.setSystemId(tranformXsl);
		
		Transformer tr = null;
		try {
			tr = tFactory.newTransformer(source);
			for(String key : parameters.keySet()){
				tr.setParameter(key, parameters.get(key));
			}
			
		} catch (TransformerConfigurationException e) {
			logger.error("Transformation error:" + e.getMessage());
		} 
		try {
			StreamResult result = new StreamResult(stream);
			StreamSource docSrc = new StreamSource(schemaXml);
			docSrc.setSystemId(schemaXml);
			tr.transform(docSrc, result);
		} catch (Exception e) {
			logger.error("Transformation error:" + e.getMessage());
		} finally {
			
		}
	}
	
	private Object getAllInteractionSchemaPathNames() throws XPathExpressionException{
		XPathExpression xpe = XPathFactory.newInstance().newXPath().compile("/");
	    Object expRes = xpe.evaluate(schemaSource.getNode(), XPathConstants.NODESET);
		return expRes;
	}
	
	private void loadSchemaSource(String basePath) throws ParserConfigurationException, XPathExpressionException{
		XPathExpression xpe = XPathFactory.newInstance().newXPath().compile("count(//xs:schema/xs:element)");
		
		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
	    DocumentBuilder domBuilder = domFactory.newDocumentBuilder();

	    Document newDoc = domBuilder.newDocument();
	    Element rootElement = newDoc.createElement("schemas");
	    newDoc.appendChild(rootElement);
	    
	    FilenameFilter filenameFilter = new FilenameFilter() {
			
			@Override
			public boolean accept(File file, String name) {
				return name.endsWith("xsd");
			}
		};	    
	    
	    Element element = null;
	    File schemasDir = new File(basePath + "/schemas");
	    for(File member : schemasDir.listFiles(filenameFilter)){
	    	element = newDoc.createElement("schema");
	    	Attr attr = newDoc.createAttribute("name");
	    	attr.setNodeValue(member.getName());
		    element.getAttributes().setNamedItem(attr);
		    attr = newDoc.createAttribute("type");
	    	attr.setNodeValue("schemas");
		    element.getAttributes().setNamedItem(attr);
		    rootElement.appendChild(element);
		    
		    // Check if this schema is an interaction schema
		    Double controlActCount = (Double) xpe.evaluate(newDoc, XPathConstants.NUMBER);
		    
		    attr = newDoc.createAttribute("isInteraction");
	    	attr.setNodeValue(Boolean.toString(controlActCount > 0));
		    element.getAttributes().setNamedItem(attr);
	    }
	    File coreSchemasDir = new File(basePath + "/coreschemas");
	    for(File member : coreSchemasDir.listFiles()){
	    	element = newDoc.createElement("schema");
	    	Attr attr = newDoc.createAttribute("name");
	    	attr.setNodeValue(member.getName());
		    element.getAttributes().setNamedItem(attr);
		    attr = newDoc.createAttribute("type");
	    	attr.setNodeValue("coreschemas");
		    element.getAttributes().setNamedItem(attr);
		    rootElement.appendChild(element);
	    }
	    
	    schemaSource = new DOMSource(newDoc);
	}
	
	private void processMultipartRequest(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		multipartHandler = new MultipartHandler(req);
		try {
			multipartHandler.parse();
		} catch (Exception e) {
			logger.error("Could not parse multipart request", e);
			throw new ServletException(e);
		}
		
		ConfigAction action = ConfigAction.valueOf(multipartHandler.getParameter("action"));
		switch (action) {
			case SCHEMA_IMPORT:
				FileItem zipItem = multipartHandler.getFileParameter("zipFile");
				File target = new File(	servletContext.getRealPath("/WEB-INF/imported_messages/zipped/"	+ zipItem.getName()));
				try {
					if(!target.exists()){
						target.createNewFile();
					}
					zipItem.write(target);
				} catch (Exception e) {
					logger.error("Unable to save the uploaded zip file", e);
					throw new ServletException(e);
				}
				
				SchemaArchiveManager manager = new SchemaArchiveManager();
				
				String dirName = zipItem.getName().substring(0, zipItem.getName().lastIndexOf('.'));
				File extractDir = new File(	servletContext.getRealPath("/WEB-INF/imported_messages/extracted/"	+ dirName));
				
				manager.extractZipContents(target, extractDir);
				
				PrintWriter pw = resp.getWriter();
				pw.println("<script>");
				pw.println("alert('Done...');");
				pw.println("</script>");
				break;
				
			case FILE_UPLOAD:
				FileItem fileItem = multipartHandler.getFileParameter("fileInUploadRequest");
				target = new File(	servletContext.getRealPath("/uploaded_files/"	+ fileItem.getName()));
				try {
					if(!target.exists()){
						target.createNewFile();
					}
					fileItem.write(target);
				} catch (Exception e) {
					logger.error("Unable to save the uploaded file", e);
					throw new ServletException(e);
				}
				break;
		}
	}
	
	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		try {
			processRequest(req, resp);
		} catch (Exception e) {
			logger.error("Error processing request", e);
		}
	}

	/* (non-Javadoc)
	 * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {		
		try {
			if(MultipartHandler.isMultipartRequest(req)){
				processMultipartRequest(req, resp);
			} else {			
				//processRequest(req, resp);
				processConfigRequest(req, resp);
			}
		} catch (Exception e) {
			logger.error("Error processing request" + ":", e);
		}
	}

	/* (non-Javadoc)
	 * @see javax.servlet.GenericServlet#init(javax.servlet.ServletConfig)
	 */
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		this.servletContext = config.getServletContext();
		String baseDir = new File(this.servletContext.getRealPath(schemaDir)).getAbsolutePath();
		try {
			loadSchemaSource(baseDir);

			StringWriter writer = new StringWriter();
			StreamResult result = new StreamResult(writer);
			Properties pr = new Properties();
			pr.put(OutputKeys.METHOD, "xml");
			//pr.put("indent-amount", "4");
			TransformerFactory factory = TransformerFactory.newInstance();
			Transformer tr = factory.newTransformer();
			tr.setOutputProperties(pr);
			tr.transform(schemaSource, result);
			writer.flush();
			/*String xml = writer.toString();
			//logger.info(xml);
*/			
			streamSerializer = new XStream();
			streamSerializer.processAnnotations(HL7MessageConfiguration.class);
			
		} catch (XPathExpressionException e) {
			throw new ServletException("Error while loading schema source", e);
		} catch (ParserConfigurationException e) {
			throw new ServletException("Error while loading schema source", e);
		} catch (TransformerConfigurationException e) {
			throw new ServletException("Error while loading schema source", e);
		} catch (TransformerException e) {
			throw new ServletException("Error while loading schema source", e);
		}
	}
	
}
