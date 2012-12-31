/**
 * 
 */
package com.hin.domain.config;

import java.util.Iterator;

import javax.xml.namespace.NamespaceContext;

/**
 * @author Administrator
 *
 */
public class HL7SchemaNamespaceContext implements NamespaceContext {

	@SuppressWarnings("rawtypes")
	@Override
	public Iterator getPrefixes(String arg0) {
		return null;
	}
	
	@Override
	public String getPrefix(String arg0) {
		return null;
	}
	
	@Override
	public String getNamespaceURI(String prefix) {
		String uri;
		if (prefix.equals("xs"))
			uri = "http://www.w3.org/2001/XMLSchema";
		else
			uri = null;
		return uri;
	}
	
}
