package za.co.hsol.hl7adapter.defs;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import za.co.hsol.hl7adapter.defs.helper.NamespaceContextMap;

public class MifDocument {
	private static final String REPOSITORY = "test/artifacts/schemas/PRPA_MT410001HT02/mifs/";
	private String mConfigFileName;
	private Element mConfig;
	private XPath mXpath;
	private NamespaceContext context = new NamespaceContextMap(
		        "mif", "urn:hl7-org:v3/mif");
	  
	  
		

		public String getConfigFileName() {
			return mConfigFileName;
		}

		public void setConfigFileName(String configFileName) {
			mConfigFileName = configFileName;
		}

		private static MifDocument loadConfigFile(InputStream in)
				throws SAXException, IOException {

			org.w3c.dom.Element elt = null;
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			dbFactory.setNamespaceAware(true);
			DocumentBuilder db = null;
			try {
				db = dbFactory.newDocumentBuilder();
				Document doc = db.parse(in);
				elt = doc.getDocumentElement();

			} catch (ParserConfigurationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new MifDocument(elt);
		}

		public MifDocument(Element configElement) {
			mConfig = configElement;
			mXpath = XPathFactory.newInstance().newXPath();
			mXpath.setNamespaceContext(context);
		}
		
		public Element getClassDef(String className){
			className = className.substring(className.indexOf('.')+1 );
			String xPathStr = "//mif:class[@name='" + className + "']";
			Element classnode = null;
			try {
				XPathExpression expr = mXpath.compile(xPathStr);
				NodeList classnodeList = (NodeList) expr.evaluate(mConfig.getOwnerDocument(), XPathConstants.NODESET);
				
				if(classnodeList.getLength()>0) classnode = (Element)classnodeList.item(0);
			} catch (XPathExpressionException e) {
				e.printStackTrace();
			}
			
			return classnode;
		}
		
		
		public NodeList findNode(String expression, Node node){
			NodeList list = null;
			try {
				list = (NodeList) mXpath.evaluate(expression, node,
						XPathConstants.NODESET);
			} catch (XPathExpressionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return list;		
		}

		
	
			
		public static MifDocument getDocument(String docName){
			FileInputStream in;
			MifDocument result = null;
			try {
				in = new FileInputStream(new File(docName));
				result = loadConfigFile(in);
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
			
					
			return result;
		}

		public NodeList findDefaultValue(String parentDataType, String attrName) {
			Element mifDef = getClassDef(parentDataType);
			return findNode(".//mif:attribute[@name='"+attrName+"']/mif:supplierDomainSpecification", mifDef);
		}
		 


}
