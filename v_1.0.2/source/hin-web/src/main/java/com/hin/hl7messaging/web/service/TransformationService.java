/**
 * 
 */
package com.hin.hl7messaging.web.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.hin.hl7messaging.configuration.XSLHelper;
import com.hin.hl7messaging.configuration.generator.RecurseHelper;
import com.hin.hl7messaging.configuration.generator.XMLHelper;
import com.hin.hl7messaging.utils.TaskVO;
import com.hin.hl7messaging.web.service.api.ITransformationService;

/**
 * @author sreekumar.s
 * 
 */
public class TransformationService implements ITransformationService {

	private Logger logger = Logger.getLogger(TransformationService.class
			.getName());

	@Override
	public StringBuffer doInboxTransformation(Map<String, Object> map,
			File xsl, ServletContext servletContext, boolean history) {

		// HashMap<String, Object> resultMap = new HashMap<String, Object>();
		int thumbIndex = 0;
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("helper", new XSLHelper());
		} catch (TransformerConfigurationException e1) {
			logger.error("Transformation error: " + e1.getMessage());
		}
		StringBuffer outputBuff = new StringBuffer();
		Set set = map.entrySet();
		Iterator iterator = set.iterator();
		List<TaskVO> taskVOs = new ArrayList<TaskVO>();

		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			TaskVO taskVO = (TaskVO) entry.getValue();
			taskVOs.add(taskVO);
		}
		Collections.sort(taskVOs, new TaskVoComparator());
		Collections.reverse(taskVOs);
		for (TaskVO taskVO : taskVOs) {
			/*
			 * String xml = taskVO.getMessage();// (String) entry.getValue();
			 * System.out.println("Test xml : " + xml);
			 */

			boolean read = taskVO.isCompleted();
			String messageType = taskVO.getMessageType();
			String messageXML = taskVO.getMessage();
			String messageForm = "";

			if ((messageType == null || messageType.length() == 0)
					&& messageXML.length() > 0) {
				Document xmlDocument = XMLHelper.getXMLDocument(messageXML);
				messageType = (String) XMLHelper.read(xmlDocument, "name(/*)",
						XPathConstants.STRING);
			}
			if (messageType != null && messageType.length() > 0
					&& messageXML != null && messageXML.length() > 0) {
				if (history) {
					if (read) {
						thumbIndex = makeFormAndView(servletContext,
								thumbIndex, tr, outputBuff, taskVO,
								messageType, messageXML, messageForm);
					}

				} else {
					if (!read) {
						thumbIndex = makeFormAndView(servletContext,
								thumbIndex, tr, outputBuff, taskVO,
								messageType, messageXML, messageForm);
					}
				}
			}

		}
		return outputBuff;
	}

	private int makeFormAndView(ServletContext servletContext, int thumbIndex,
			Transformer tr, StringBuffer outputBuff, TaskVO taskVO,
			String messageType, String messageXML, String messageForm) {
		System.out.println("Message Type: " + messageType);
		if (messageType != null && messageType.length() > 0
				&& messageXML.length() > 0) {
			String taskID = taskVO.getTaskId();
			File messageTypexsl = new File(
					servletContext.getRealPath("/transformers/" + messageType
							+ ".xsl"));
			messageForm = doMessageFormTransformation(messageXML,
					messageTypexsl, taskID);

			/* tr.reset(); */
		}

		String tasks = taskVO.getMessageID().concat("|")
				.concat(taskVO.getOrgId()).concat("|")
				.concat(taskVO.getTaskId()).concat("|")
				.concat(taskVO.getMessageType());
		// System.out.println(tasks);
		tr.setParameter(
				"friendRequestKey",
				taskVO.getFriendRequestKey() == null ? 0 : taskVO
						.getFriendRequestKey());
		tr.setParameter("friendRequestBy", taskVO.getFriendId() == null ? 0
				: taskVO.getFriendId());
		tr.setParameter("contactType", taskVO.getContactType() == null ? ""
				: taskVO.getContactType());
		if (taskVO.getOutComes() == null || taskVO.getOutComes().length() == 0) {
			tr.setParameter("recipients", new HashMap<String, String>());
		} else {
			tr.setParameter(
					"recipients",
					taskVO.getAssignablePeople() == null ? new HashMap<String, String>()
							: taskVO.getAssignablePeople());
		}
		boolean usercopy=false;
		if(messageType != null && messageType.startsWith("USERCOPY_")){
			usercopy=true;
		}

		String message = taskVO.getMessage();
		if (message != null && message.length() > 0) {
			message = message.replace("\n", "");
			message = message.replace("\r", "");
			message = message.replace("\"", "\\\"");
		}
		tr.setParameter("message", message);
		tr.setParameter("tasks", tasks);
		tr.setParameter("read", taskVO.isCompleted());
		tr.setParameter("outcomes", taskVO.getOutComes());
		tr.setParameter("thumbIndex", thumbIndex++);
		tr.setParameter("messageForm", messageForm);
		tr.setParameter("usercopy", usercopy);
		String output = "";
		if (messageXML != null && messageXML.length() > 0)
			output = extractThumbnailView(messageXML, tr);
		outputBuff.append(output);
		tr.reset();
		return thumbIndex;
	}

	private String extractThumbnailView(String xml, Transformer tr) {
		try {
			/* System.out.println("myXml: "+xml); */
			ByteArrayInputStream byteInputStream = new ByteArrayInputStream(
					xml.getBytes());
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(stream);
			/* System.out.println("result: "+result); */
			StreamSource docSrc = new StreamSource(byteInputStream);
			// docSrc.setSystemId(xml);
			tr.transform(docSrc, result);
			// System.out.println("stream returned : " + stream);
			return new String(stream.toByteArray());

		} catch (Exception e) {
			logger.error("Unable to transform stream to byte: "
					+ e.getMessage());
			return null;
		} /*
		 * finally {
		 * 
		 * }
		 */

	}

	@Override
	public String doMessageTransformation(String xml, File configXml, File xsl) {
		/*
		 * StringBuffer messageContent = new StringBuffer(); try {
		 * BufferedReader br = new BufferedReader(new InputStreamReader( new
		 * ByteArrayInputStream(xml.getBytes()))); String line = ""; while
		 * ((line = br.readLine()) != null) { messageContent.append(line); }
		 * br.close(); } catch (IOException e2) {
		 * System.out.println("Error reading message file: " + e2); return null;
		 * }
		 */

		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			/*
			 * String messageData = messageContent.toString().replace('"',
			 * '\''); tr.setParameter("messageData", messageData);
			 */
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(stream);
			StreamSource docSrc = new StreamSource(configXml);
			docSrc.setSystemId(configXml);
			tr.transform(docSrc, result);
			// System.out.println("stream returned : " + stream);
			return new String(stream.toByteArray());
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "
					+ e1.getMessage());
		} catch (TransformerException e) {
			logger.error("Unable to transform from stream to byte: "
					+ e.getMessage());
		}
		return null;
	}

	@Override
	public String doNewMessageTransformation(String xml, File configXml,
			File xsl) {
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("recurseHelper", new RecurseHelper());
			// tr.setParameter("idAttributeName", "_-i");
			ByteArrayOutputStream stream = new ByteArrayOutputStream();
			StreamResult result = new StreamResult(stream);
			StreamSource docSrc = new StreamSource(configXml);
			docSrc.setSystemId(configXml);
			tr.transform(docSrc, result);
			return new String(stream.toByteArray());
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "
					+ e1.getMessage());
		} catch (TransformerException e) {
			logger.error("Unable to transform from stream to byte: "
					+ e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public String doMessageFormTransformation(String message, File xsl,
			String taskId) {
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			if (tr != null) {
				tr.setParameter("helper", new XSLHelper());
				if (taskId != null)
					tr.setParameter("taskId", taskId);
			}
			return extractThumbnailView(message, tr);
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "
					+ e1.getMessage());
		} catch (TransformerException e) {
			logger.error("Unable to transform from stream to byte: "
					+ e.getMessage());
		}
		return null;
	}

	@Override
	public StringBuffer doLinkedProfileMessageTransformation(
			List<String> messageList, File xsl) {

		int thumbIndex = 0;
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("helper", new XSLHelper());
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "
					+ e1.getMessage());
		}
		StringBuffer outputBuff = new StringBuffer();

		for (String message : messageList) {
			String xml = message;
			tr.setParameter("message", message);
			tr.setParameter("thumbIndex", thumbIndex++);
			String output = extractThumbnailView(xml, tr);
			outputBuff.append(output);
			tr.reset();
		}
		return outputBuff;
	}

	@Override
	public StringBuffer doMedicalTransformation(HashMap<String, Object> map,
			File xsl, ServletContext servletContext) {
		int thumbIndex = 0;
		TransformerFactory tranObj = TransformerFactory.newInstance();
		Transformer tr = null;
		try {
			tr = tranObj.newTransformer(new StreamSource(xsl));
			tr.setParameter("helper", new XSLHelper());
		} catch (TransformerConfigurationException e1) {
			logger.error("TransformationConfiguration error: "
					+ e1.getMessage());
		}
		StringBuffer outputBuff = new StringBuffer();
		Set set = map.entrySet();
		Iterator iterator = set.iterator();
		while (iterator.hasNext()) {
			Map.Entry entry = (Map.Entry) iterator.next();
			TaskVO taskVO = (TaskVO) entry.getValue();
			/*
			 * String xml = taskVO.getMessage();// (String) entry.getValue();
			 * System.out.println("Test xml : " + xml);
			 */

			// String messageType = taskVO.getMessageType();
			String messageXML = taskVO.getMessage();
			Document xmlDocument = XMLHelper.getXMLDocument(messageXML);
			String messageType = (String) XMLHelper.read(xmlDocument,
					"name(/*)", XPathConstants.STRING);
			String messageForm = "";
			if (messageType != null && messageType.length() > 0) {
				File messageTypexsl = new File(
						servletContext.getRealPath("/transformers/"
								+ messageType + ".xsl"));
				messageForm = doMessageFormTransformation(messageXML,
						messageTypexsl, taskVO.getTaskId());

				tr.reset();
			}

			tr.setParameter("message", taskVO.getMessage());
			tr.setParameter("thumbIndex", thumbIndex++);
			tr.setParameter("messageForm", messageForm);
			String output = extractThumbnailView(messageXML, tr);
			outputBuff.append(output);
			tr.reset();
		}
		return outputBuff;
	}

	class TaskVoComparator implements Comparator {
		public int compare(Object o1, Object o2) {

			String key1 = ((TaskVO) o1).getMessageID();
			String key2 = ((TaskVO) o2).getMessageID();
			if (key1.length() == 0 || key2.length() == 0) {
				return 1;
			}
			try {
				long value1 = Long.parseLong(key1);

				long value2 = Long.parseLong(key2);
				if (value1 < value2)
					return -1;
				if (value2 < value1)
					return 1;

				return 0;
			} catch (Exception e) {
				logger.error("Fail to parse to long: " + e.getMessage());
				return 0;
			}
		}
	}

}
