/**
 * 
 */
package com.hin.hl7messaging.web.service.api;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

/**
 * @author sreekumar.s
 * 
 */
public interface ITransformationService {

	public String doMessageTransformation(String xml, File configXml, File xsl);

	public StringBuffer doInboxTransformation(Map<String, Object> map, File xsl,ServletContext servletContext,boolean history);

	public String doNewMessageTransformation(String xml, File configXml,
			File xsl);

	public String doMessageFormTransformation(String message, File xsl, String taskID);

	StringBuffer doLinkedProfileMessageTransformation(List<String> messageList,File xsl);

	public StringBuffer doMedicalTransformation(HashMap<String, Object> map,
			File xsl, ServletContext servletContext);
}
