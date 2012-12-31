package za.co.hsol.hl7adapter.helper;

import java.io.FileInputStream;
import java.util.Iterator;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.*;
import javax.xml.xpath.*;
import javax.xml.namespace.NamespaceContext;

import org.w3c.dom.*;

public class XpathTester {
    public static void main(String[] args) throws Exception {
	if (args.length < 2) {
	    usage();
	    return;
	}

	String inputFile = args[0];
	String xPathStr = args[1];

	// optional namespace spec: xmlns:prefix:URI
	String nsPrefix = null;
	String nsUri = null;
	if ((args.length >= 3) && args[2].startsWith("xmlns:")) {
	    String[] nsDef = args[2].substring("xmlns:".length()).split("=");
	    if (nsDef.length == 2) {
		nsPrefix = nsDef[0];
		nsUri = nsDef[1];
	    }
	}
	
	// Parse XML to DOM
	DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
	dbFactory.setNamespaceAware(true);
	Document doc = dbFactory
		       .newDocumentBuilder()
		       .parse(new FileInputStream(inputFile));

	// Find nodes by XPATH
	XPathFactory xpFactory = XPathFactory.newInstance();
	XPath xpath = xpFactory.newXPath();

	// namespace?
	if (nsPrefix != null) {
	    final String myPrefix = nsPrefix;
	    final String myUri = nsUri;
	    xpath.setNamespaceContext(new NamespaceContext() {
		public String getNamespaceURI(String prefix) {
		    return myPrefix.equals(prefix) ?  myUri : null;
		}

		public String getPrefix(String namespaceURI) {
		    return null; // we are not using this.
		}

		public Iterator getPrefixes(String namespaceURI) {
		    return null; // we are not using this.
		}
	    });
	}

	XPathExpression expr = xpath.compile(xPathStr);
	NodeList nodes = (NodeList) expr.evaluate(doc, XPathConstants.NODESET);
	if (nodes.getLength() < 1) {
	    System.out.println("Can't find node by XPATH: " + xPathStr);
	}
	else {
	    System.out.println(nodes.getLength() 
			     + " nodes found for " 
			     + xPathStr);
	}
    }

    private static void usage() {
	System.out.println("Usage: java XPathExample <inputFile> <XPathExpr> [namespaceDef]");
    }
}