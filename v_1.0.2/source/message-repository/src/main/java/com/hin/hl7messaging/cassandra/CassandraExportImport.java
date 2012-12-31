
package com.hin.hl7messaging.cassandra;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;
import javax.xml.xpath.XPathConstants;

import org.apache.cassandra.thrift.Cassandra.Client;
import org.apache.cassandra.thrift.CfDef;
import org.apache.cassandra.thrift.Column;
import org.apache.cassandra.thrift.ColumnDef;
import org.apache.cassandra.thrift.ColumnOrSuperColumn;
import org.apache.cassandra.thrift.ColumnParent;
import org.apache.cassandra.thrift.Compression;
import org.apache.cassandra.thrift.ConsistencyLevel;
import org.apache.cassandra.thrift.CqlResult;
import org.apache.cassandra.thrift.CqlRow;
import org.apache.cassandra.thrift.IndexType;
import org.apache.cassandra.thrift.InvalidRequestException;
import org.apache.cassandra.thrift.KeyRange;
import org.apache.cassandra.thrift.KeySlice;
import org.apache.cassandra.thrift.KsDef;
import org.apache.cassandra.thrift.NotFoundException;
import org.apache.cassandra.thrift.SchemaDisagreementException;
import org.apache.cassandra.thrift.SlicePredicate;
import org.apache.cassandra.thrift.SliceRange;
import org.apache.cassandra.thrift.SuperColumn;
import org.apache.cassandra.thrift.TimedOutException;
import org.apache.cassandra.thrift.UnavailableException;
import org.apache.commons.codec.binary.Base64;
import org.apache.thrift.TException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;
import org.xml.sax.helpers.AttributesImpl;
import org.xml.sax.helpers.DefaultHandler;

import com.hin.hl7messaging.utils.XMLHelper;
import com.sun.org.apache.xml.internal.serialize.OutputFormat;
import com.sun.org.apache.xml.internal.serialize.XMLSerializer;

/**
 * @author Administrator
 *
 */
public class CassandraExportImport {

	private static final int COLUMN_COUNT = 1000;
	private static final int ROW_COUNT = 10000;
	private static ContentHandler contentHandler = null;

	public static void importKeyspaceData(Client client, String keyspaceName,
			File file) throws IOException, ParserConfigurationException, SAXException, InvalidRequestException, TException {
		
		SAXParserFactory factory = SAXParserFactory.newInstance();
		SAXParser saxParser = factory.newSAXParser();
	 
		saxParser.parse(file, importKeyspaceContentHandler(client, keyspaceName));		

	}
	
	public static DefaultHandler importKeyspaceContentHandler(Client client, String keyspaceName){
		class CassandraImportContentHandler extends DefaultHandler {

			private Client client;
			private String keyspaceName;
			
			private String columnFamily = "";
			private byte[] rowKey = null;
			private byte[] columnName = null;
			private byte[] subColumnName = null;
			private long columnTime = -1L;
			private StringBuffer data = null;
			
			@Override
			public void characters(char[] ch, int start, int length)
					throws SAXException {
					
				if(columnName != null && data != null){
					String contentString = new String(ch, start, length);
					byte[] content = Base64.decodeBase64(contentString);
					data.append(new String(content));
				}
			}

			@Override
			public void endDocument() throws SAXException {
				System.out.println("Ent of import keyspace data.");
			}

			@Override
			public void endElement(String uri, String localName, String qName)
					throws SAXException {

				if(columnName != null && data != null){
					
					if(columnTime < 0){
						return;
					}
				
					ByteBuffer key = ByteBuffer.wrap(rowKey);
					ByteBuffer colName = ByteBuffer.wrap(columnName);
					
					//System.out.println("DECODED: " + data.toString());
					
					Column column = new Column();
					
					ColumnParent column_parent = new ColumnParent();
					column_parent.setColumn_family(columnFamily);
					if(subColumnName != null){						
						column_parent.setSuper_column(colName);
						ByteBuffer subColName = ByteBuffer.wrap(subColumnName);
						column.setName(subColName);
						if(columnFamily.equals("ROLE")){
							System.out.println("KEY: " + new String(rowKey) + ", SUPER COLUMN: " + new String(columnName) + ", COLUMN: " + new String(subColumnName));
						}
					}
					else {
						column.setName(colName);
						if(columnFamily.equals("ROLE")){
							System.out.println("KEY: " + new String(rowKey) + ", COLUMN: " + new String(columnName));
						}
					}
					
					column.setValue(data.toString().getBytes());
					column.setTimestamp(columnTime);
					try {
						client.insert(key, column_parent, column, ConsistencyLevel.ALL);
					} catch (InvalidRequestException e) {
						System.out.println(e);
						System.out.println("KS: " + keyspaceName + ", CF: " + columnFamily + ", Col: " + colName);
					} catch (UnavailableException e) {
						System.out.println(e);
					} catch (TimedOutException e) {
						System.out.println(e);
					} catch (TException e) {
						System.out.println(e);
					}
				}
				
				if(qName.equals("ColumnFamily")){
					columnFamily = "";
				}
				else if(qName.equals("Row")){
					rowKey = null;
				}
				else if(qName.equals("Column")){
					columnName = null;
					columnTime = -1L;
				}
				else if(qName.equals("SubColumn")){
					subColumnName = null;
					columnTime = -1L;
				}
				
				data = null;
			}

			@Override
			public void error(SAXParseException e) throws SAXException {
				System.out.println("Error: " + e);
			}

			@Override
			public void startDocument() throws SAXException {
				System.out.println("Import Cassandra started.");
			}

			@Override
			public void startElement(String uri, String localName,
					String qName, Attributes attributes) throws SAXException {
				
				data = new StringBuffer();
				
				if(qName.equals("CassandraDataExport")){
					if(keyspaceName == null){
						keyspaceName = attributes.getValue("key_space_name");
					}
					
					try {
						client.set_keyspace(keyspaceName);
					} catch (InvalidRequestException e) {
						System.out.println("Error setting keyspace: " + e);
						throw new SAXException(e);
					} catch (TException e) {
						System.out.println("Error setting keyspace: " + e);
						throw new SAXException(e);
					}
				}
				else if(qName.equals("ColumnFamily")){
					columnFamily = attributes.getValue("name");
					if(columnFamily.length() > 48){
						columnFamily = columnFamily.substring(0, 47);
					}
				}
				else if(qName.equals("Row")){
					rowKey = Base64.decodeBase64(attributes.getValue("key"));
				}
				else if(qName.equals("Column")){
					columnName = Base64.decodeBase64(attributes.getValue("name"));
					if(attributes.getValue("time") == null){
						//System.out.println("TIME NULL FOR COLUMN: " + new String(columnName));
						columnTime = 0L;
					}
					else {
						columnTime = Long.valueOf(attributes.getValue("time"));
					}
				}
				else if(qName.equals("SubColumn")){
					subColumnName = Base64.decodeBase64(attributes.getValue("name"));
					columnTime = Long.valueOf(attributes.getValue("time"));
				}
			}

			public void setClient(Client client) {
				this.client = client;
			}

			public void setKeyspaceName(String keyspaceName) {
				this.keyspaceName = keyspaceName;
			}			
		};
		
		CassandraImportContentHandler contentHandler = new CassandraImportContentHandler();
		contentHandler.setClient(client);
		contentHandler.setKeyspaceName(keyspaceName);
		return contentHandler;
	}
	
	public static void exportKeyspaceData(Client client, String keyspaceName,
			File file) throws IOException, SAXException,
			NotFoundException, InvalidRequestException, TException,
			UnavailableException, TimedOutException,
			SchemaDisagreementException {
		
		FileWriter fileWriter = new FileWriter(file);
		
		contentHandler = (ContentHandler) updateXML(contentHandler, XML_DATA_TYPE.START_DOC, null, fileWriter);
		
		Map<String, String> attrMap = new HashMap<String, String>(); 
		attrMap.put("key_space_name", keyspaceName);				
		updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "CassandraDataExport", attrMap);
		
		KsDef keyspaceDef = client.describe_keyspace(keyspaceName);
		for(CfDef cfDef : keyspaceDef.getCf_defs()){
			String columnFamily = cfDef.getName();
			if(cfDef.getColumn_type().toUpperCase().equals("STANDARD")){
				exportColumnFamily(client, columnFamily, contentHandler);
			} else {
			exportSuperColumnFamily(client, columnFamily, contentHandler);
			}
		}
		
		updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "CassandraDataExport", null);		
		updateXML(contentHandler, XML_DATA_TYPE.END_DOC, null, null);
		
		fileWriter.close();
	}
	
	public static void exportKeyspaceDefinition(Client client, String keyspaceName,
			File file) throws NotFoundException, InvalidRequestException,
			TException, IOException {
		Document document = getKeyspaceDefinitionXML(client, keyspaceName);
		
		String defXML = XMLHelper.getXMLDocumentAsString(document);
		//System.out.println(defXML);
		
		
		FileWriter fileWriter = new FileWriter(file);
		fileWriter.write(defXML);
		fileWriter.close();
	}
	
	public static void importKeyspace(Client client, File file, String keyspaceName)
			throws InvalidRequestException, TException,
			SchemaDisagreementException {
		Document document = XMLHelper.getXMLDocument(file);		
		Element keyspaceElement = document.getDocumentElement();
		if(keyspaceName == null){
			keyspaceName = keyspaceElement.getAttribute("name"); // + new Date().getTime();
			System.out.println("Keyspace: " + keyspaceName);
		}
		keyspaceElement.setAttribute("name", keyspaceName);
		
		KsDef keyspaceDef = getKeyspaceDefinitionObject(client, document);
		
		boolean keyspaceExists = false;
		try {
			client.describe_keyspace(keyspaceDef.getName());
			keyspaceExists = true;
		} catch (NotFoundException e) {
			System.out.println("No keyspace by that name.");	
		}
		
		if(!keyspaceExists)
			client.system_add_keyspace(keyspaceDef);
		else {
			client.system_drop_keyspace(keyspaceDef.getName());
			client.system_add_keyspace(keyspaceDef);
			
			List<CfDef> cfDefs = keyspaceDef.getCf_defs();
			keyspaceDef.setCf_defs(new ArrayList<CfDef>());
			client.system_update_keyspace(keyspaceDef);
			
			client.set_keyspace(keyspaceDef.getName());
			for(CfDef cfDef : cfDefs){
				cfDef.setIdIsSet(false);
				client.system_update_column_family(cfDef);
			}
		}
	}
	
	public static KsDef getKeyspaceDefinitionObject(Client client, Document document) {
		Element keyspaceElement = document.getDocumentElement();	
		
		KsDef keyspaceDef = new KsDef();
		
		if(!keyspaceElement.getAttribute("name").equals(""))
			keyspaceDef.setName(keyspaceElement.getAttribute("name"));
		if(!keyspaceElement.getAttribute("durable_writes").equals(""))
			keyspaceDef.setDurable_writes(Boolean.valueOf(keyspaceElement.getAttribute("durable_writes")));
		if(!keyspaceElement.getAttribute("strategy_class").equals(""))
			keyspaceDef.setStrategy_class(keyspaceElement.getAttribute("strategy_class"));
		
		NodeList strategyOptions = (NodeList) XMLHelper.read(document, "/KeyspaceDef/StrategyOptions/Option", XPathConstants.NODESET);
		if(strategyOptions.getLength() > 0){
			Map<String, String> strategyOptionsMap = new HashMap<String, String>();
			for(int i = 0; i < strategyOptions.getLength(); i ++){
				Element strategy = (Element) strategyOptions.item(i);
				strategyOptionsMap.put(strategy.getAttribute("name"), strategy.getAttribute("value"));
			}
			keyspaceDef.setStrategy_options(strategyOptionsMap);
		}
		
		List<CfDef> cfDefs = new ArrayList<CfDef>();
		keyspaceDef.setCf_defs(cfDefs);
		
		NodeList columnFamilies = (NodeList) XMLHelper.read(document, "/KeyspaceDef/ColumnFamily", XPathConstants.NODESET);
		for(int i = 0; i < columnFamilies.getLength(); i ++){
			Element cfElement = (Element) columnFamilies.item(i);
			CfDef cfDef = new CfDef();			
			cfDefs.add(cfDef);
			cfDef.setKeyspace(keyspaceDef.getName());
			
			if(!cfElement.getAttribute("name").equals("")){
				String cfName = cfElement.getAttribute("name");
				/*if(cfName.length() > 48){
					cfName = cfName.substring(0, 47);
				}*/
				cfDef.setName(cfName);
			}
			if(!cfElement.getAttribute("comparator_type").equals("")){
				cfDef.setComparator_type(cfElement.getAttribute("comparator_type"));
			}
			if(!cfElement.getAttribute("column_type").equals("")){
				cfDef.setColumn_type(cfElement.getAttribute("column_type"));
			}
			if(!cfElement.getAttribute("comment").equals("")){
				cfDef.setComment(cfElement.getAttribute("comment"));
			}
			if(!cfElement.getAttribute("default_validation_class").equals("")){
				cfDef.setDefault_validation_class(cfElement.getAttribute("default_validation_class"));
			}
			if(!cfElement.getAttribute("id").equals("")){
				cfDef.setId(Integer.valueOf(cfElement.getAttribute("id")));
			}
			if(!cfElement.getAttribute("key_alias").equals("")){
				cfDef.setKey_alias(cfElement.getAttribute("key_alias").getBytes());
			}
			if(!cfElement.getAttribute("key_validation_class").equals("")){
				cfDef.setKey_validation_class(cfElement.getAttribute("key_validation_class"));
			}
			if(!cfElement.getAttribute("subcomparator_type").equals("")){
				cfDef.setSubcomparator_type(cfElement.getAttribute("subcomparator_type"));
			}
			
			List<ColumnDef> columnDefs = new ArrayList<ColumnDef>();
			NodeList columns = (NodeList) XMLHelper.read(document, "/KeyspaceDef/ColumnFamily[@name='" + cfElement.getAttribute("name") + "']/Column", XPathConstants.NODESET);
			for(int j = 0; j < columns.getLength(); j ++){
				Element colElement = (Element) columns.item(j);
				ColumnDef colDef = new ColumnDef();
				colDef.setName(colElement.getAttribute("name").getBytes());
				if(!colElement.getAttribute("validation_class").equals("")){
					colDef.setValidation_class(colElement.getAttribute("validation_class"));
				}
				if(!colElement.getAttribute("index_name").equals("") && !colElement.getAttribute("index_type").equals("")){
					//System.out.println("INDEX NAME: " + colElement.getAttribute("index_name"));
					colDef.setIndex_name(colElement.getAttribute("index_name"));
					colDef.setIndex_type(IndexType.valueOf(colElement.getAttribute("index_type")));
				}
				
				columnDefs.add(colDef);
			}
			cfDef.setColumn_metadata(columnDefs);
		}
		return keyspaceDef;
	}
	
	public static Document getKeyspaceDefinitionXML(Client client, String keyspaceName)
			throws NotFoundException, InvalidRequestException, TException {
		KsDef keyspaceDef = client.describe_keyspace(keyspaceName);
		//System.out.println(keyspaceDef);
		
		Document document = XMLHelper.getXMLDocument("<KeyspaceDef/>");
		Element keyspaceElement = document.getDocumentElement();
		
		if(keyspaceDef.isSetName())
			keyspaceElement.setAttribute("name", keyspaceDef.getName());
		if(keyspaceDef.isSetDurable_writes())
			keyspaceElement.setAttribute("durable_writes", Boolean.toString(keyspaceDef.isDurable_writes()));
		if(keyspaceDef.isSetStrategy_class())
			keyspaceElement.setAttribute("strategy_class", keyspaceDef.getStrategy_class());
		if(keyspaceDef.isSetStrategy_options()){
			Element optionsElement = document.createElement("StrategyOptions");
			keyspaceElement.appendChild(optionsElement);
			for(Map.Entry<String, String> entry : keyspaceDef.getStrategy_options().entrySet()){
				Element optionElement = document.createElement("Option");
				optionsElement.appendChild(optionElement);
				optionElement.setAttribute("name", entry.getKey());
				optionElement.setAttribute("value", entry.getValue());
			}
		}
		
		List<CfDef> cfDefs = keyspaceDef.getCf_defs();
		
		for(CfDef cfDef : cfDefs){
			System.out.println("ColumnFamily: " + cfDef.getName());
			Element cfElement = document.createElement("ColumnFamily");
			keyspaceElement.appendChild(cfElement);
			
			cfElement.setAttribute("name", cfDef.getName());
			
			if(cfDef.isSetComparator_type()){
				cfElement.setAttribute("comparator_type", cfDef.getComparator_type());
			}
			if(cfDef.isSetColumn_type()){
				cfElement.setAttribute("column_type", cfDef.getColumn_type());
			}
			if(cfDef.isSetComment()){
				cfElement.setAttribute("comment", cfDef.getComment());
			}
			if(cfDef.isSetDefault_validation_class()){
				cfElement.setAttribute("default_validation_class", cfDef.getDefault_validation_class());
			}
			if(cfDef.isSetId()){
				cfElement.setAttribute("id", cfDef.getId() + "");
			}
			if(cfDef.isSetKey_alias()){
				cfElement.setAttribute("key_alias", new String(cfDef.getKey_alias()));
			}
			if(cfDef.isSetKey_validation_class()){
				cfElement.setAttribute("key_validation_class", cfDef.getKey_validation_class());
			}
			if(cfDef.isSetSubcomparator_type()){
				cfElement.setAttribute("subcomparator_type", cfDef.getSubcomparator_type());
			}
			
			List<ColumnDef> columnDefs = cfDef.getColumn_metadata();
			for(ColumnDef columnDef : columnDefs){
				//System.out.println("ColumnName: " + columnDef.getName());
				
				Element colElement = document.createElement("Column");
				cfElement.appendChild(colElement);
				
				colElement.setAttribute("name", new String(columnDef.getName()));
				if(columnDef.isSetValidation_class()){
					colElement.setAttribute("validation_class", columnDef.getValidation_class());
				}
				if(columnDef.isSetIndex_name()){
					colElement.setAttribute("index_name", columnDef.getIndex_name());
				}
				if(columnDef.isSetIndex_type()){
					colElement.setAttribute("index_type", columnDef.getIndex_type().name());
				}
			}
		}
		return document;
	}	

	public static void exportSuperColumnFamily(Client client, String columnFamily, ContentHandler contentHandler)
			throws InvalidRequestException, UnavailableException,
			TimedOutException, SchemaDisagreementException, TException,
			IOException, SAXException {
		
		Map<Object, Object> attrMap = null;

		SlicePredicate sp = new SlicePredicate();
		SliceRange sr = new SliceRange(ByteBuffer.wrap("".getBytes()), ByteBuffer.wrap("".getBytes()), false, CassandraExportImport.COLUMN_COUNT);
		sp.setSlice_range(sr);

		KeyRange kr = new KeyRange();
		kr.start_key = ByteBuffer.wrap("".getBytes());
		kr.end_key = ByteBuffer.wrap("".getBytes());
		kr.setCount(CassandraExportImport.ROW_COUNT);
		
		attrMap = new HashMap<Object, Object>(); 
		attrMap.put("name", columnFamily);				
		updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "ColumnFamily", attrMap);
		
		List<KeySlice> rangeSlices = client.get_range_slices(new ColumnParent(columnFamily), sp, kr, ConsistencyLevel.ONE);
		System.out.println("Row count in CD=" + columnFamily + " is " + rangeSlices.size());
		for (KeySlice slice : rangeSlices) {
			byte[] key = slice.getKey();
			
			//System.out.println("KEY: " + new String(key));
			
			attrMap = new HashMap<Object, Object>(); 
			attrMap.put("key", key);
			updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "Row", attrMap);
					
			for (ColumnOrSuperColumn colOrSupCol : slice.getColumns()) {
				
				byte[] colName = (colOrSupCol.isSetSuper_column()) 
						? colOrSupCol.getSuper_column().getName() 
								: colOrSupCol.getColumn().getName();
				
				attrMap = new HashMap<Object, Object>(); 
				attrMap.put("name", colName);
				if(!colOrSupCol.isSetSuper_column()){
					long time = colOrSupCol.getColumn().getTimestamp();
					attrMap.put("time", time);
				}
				updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "Column", attrMap);
				
				if (colOrSupCol.isSetSuper_column()) {
					SuperColumn supCol = colOrSupCol.getSuper_column();
					
					for (Column column : supCol.getColumns()) {
						exportColumn(contentHandler, column, true);
					}
					
				} else {
					Column col = colOrSupCol.getColumn();
					exportColumn(contentHandler, col, false);
				}
				
				updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "Column", null);
			}
			
			updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "Row", null);
		}
		updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "ColumnFamily", null);
	}

	public static byte[] decodeContent(String key) {
		return Base64.decodeBase64(key);
	}	
	public static String encodeContent(byte[] key) {
		return Base64.encodeBase64URLSafeString(key);
	}

	public static void exportColumn(ContentHandler contentHandler, Column column, Boolean isSuper)
			throws IOException, SAXException {
		
		byte[] name  = column.getName();
		byte[] value  = column.getValue();
		long time = column.getTimestamp();
		
		if(isSuper){
			
			if(time < 0 && name.equals("KEY")){
				return;
			}
			
			Map<Object, Object> attrMap = new HashMap<Object, Object>(); 
			attrMap.put("name", name);
			attrMap.put("time", time);
			updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "SubColumn", attrMap);
			
			updateXML(contentHandler, XML_DATA_TYPE.TEXT, null, value);
			
			updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "SubColumn", null);
		}
		else {
			updateXML(contentHandler, XML_DATA_TYPE.TEXT, null, value);
		}
	}

	public static void exportColumnFamily(Client client, String columnFamily, ContentHandler contentHandler2)
			throws InvalidRequestException, UnavailableException,
			TimedOutException, SchemaDisagreementException, TException,
			IOException, SAXException {
		
		Map<Object, Object> attrMap = null;
		ByteBuffer buffer = ByteBuffer.wrap("SELECT * FROM ".concat(columnFamily).getBytes());
		CqlResult cqlResult = client.execute_cql_query(buffer, Compression.NONE);
		
		System.out.println("Row count in CD=" + columnFamily + " is " + cqlResult.rows.size());
		
		attrMap = new HashMap<Object, Object>(); 
		attrMap.put("name", columnFamily);				
		updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "ColumnFamily", attrMap);
		
		for(int row = 0; row < cqlResult.rows.size(); row++){
			CqlRow cqlRow = cqlResult.rows.get(row);
			byte[] key = cqlRow.getKey();
			
			attrMap = new HashMap<Object, Object>(); 
			attrMap.put("key", key);				
			updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "Row", attrMap);
			
			for(Column column : cqlRow.getColumns()){
				byte[] name  = column.getName();
				byte[] value  = column.getValue();
				long time = column.getTimestamp();
				
				if(time < 0 && name.equals("KEY")){
					// Row key
					continue;
				}
				
				attrMap = new HashMap<Object, Object>(); 
				attrMap.put("name", name);
				attrMap.put("time", time);
				updateXML(contentHandler, XML_DATA_TYPE.START_ELEMENT, "Column", attrMap);
				
				updateXML(contentHandler, XML_DATA_TYPE.TEXT, null, value);
				
				updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "Column", null);
			}
			
			updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "Row", null);
		}
		updateXML(contentHandler, XML_DATA_TYPE.END_ELEMENT, "ColumnFamily", null);
	}
	
	public static Object updateXML(ContentHandler contentHandler, XML_DATA_TYPE type, String nodeName, Object nodeVal) throws IOException, SAXException{
		switch(type){
			case START_DOC:
				OutputFormat of = new OutputFormat("XML", "ISO-8859-1", true);
				of.setIndent(4);
				of.setIndenting(true);
				XMLSerializer serializer = new XMLSerializer(of);
				serializer.setOutputCharStream((Writer) nodeVal);
				contentHandler = serializer.asContentHandler();
				contentHandler.startDocument(); break;
			case END_DOC:
				contentHandler.endDocument(); break;
			case START_ELEMENT:
				AttributesImpl attrs = new AttributesImpl();
				if(nodeVal != null && nodeVal instanceof Map){
					
					@SuppressWarnings("unchecked")
					Map<Object, Object> attrMap = (Map<Object, Object>) nodeVal;
					for(Map.Entry<Object, Object> entry : attrMap.entrySet()){
						String value = "";
						if(entry.getValue() instanceof byte[]){
							value = Base64.encodeBase64String((byte[]) entry.getValue());
						}
						else if(entry.getValue() instanceof Long){
							value  = entry.getValue().toString();
						}
						else {
							value  = (String) entry.getValue();
						}
						attrs.addAttribute("", (String)entry.getKey(), (String)entry.getKey(), "CDATA", value);						
					}
				}
				contentHandler.startElement("", "", nodeName, attrs);
				break;
			case END_ELEMENT:
				contentHandler.endElement("", "", nodeName);
				break;
			case TEXT:
				String base64EncodedData = Base64.encodeBase64String((byte[]) nodeVal);
				char[] val = base64EncodedData.toCharArray();
				contentHandler.characters(val, 0, val.length);
				break;
		}
		
		return contentHandler;
	}
	
}
