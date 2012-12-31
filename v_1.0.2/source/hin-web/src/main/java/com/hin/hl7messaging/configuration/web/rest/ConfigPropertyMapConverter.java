/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import java.util.HashMap;
import java.util.Iterator;

import com.thoughtworks.xstream.converters.Converter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;

/**
 * @author Administrator
 *
 */
@SuppressWarnings("unchecked")
public class ConfigPropertyMapConverter implements Converter {

	@SuppressWarnings("rawtypes")
	@Override
	public boolean canConvert(Class aClass) {
		return aClass.equals(HashMap.class);
	}

	@Override
	public void marshal(Object value, HierarchicalStreamWriter writer,
			MarshallingContext context) {
		HashMap<String, String> params = (HashMap<String, String>) value;
		for(String key : params.keySet()){
			writer.addAttribute(key, params.get(key));
		}
	}

	@Override
	public Object unmarshal(HierarchicalStreamReader reader,
			UnmarshallingContext context) {
		Iterator<String> iterator = reader.getAttributeNames();
		HashMap<String, String> params = new HashMap<String, String>();
		while(iterator.hasNext()){
			String key = iterator.next();
			params.put(key, reader.getAttribute(key));
		}
		return params;
	}

}
