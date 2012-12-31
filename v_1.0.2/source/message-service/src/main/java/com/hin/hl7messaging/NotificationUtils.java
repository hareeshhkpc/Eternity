/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.List;

import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.vo.ProfileVO;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author krishna.lr
 * 
 */
public class NotificationUtils {
	public static List<ProfileVO> readAllParticipants(Document configurationDocument,
			Document messageDocument) {
		List<ProfileVO> profileVOs = new ArrayList<ProfileVO>();
		NodeList nodeList = (NodeList) XMLHelper.read(configurationDocument,
				"//HL7MessageConfiguration/Participants/Field",
				XPathConstants.NODESET);
		for (int i = 0; i < nodeList.getLength(); i++) {
			ProfileVO profileVO = new ProfileVO();
			Node node = nodeList.item(i);
			Element element = (Element) node;
			profileVO.setName(element.getAttribute("name"));
			profileVO.setSubscriberId((String) XMLHelper.read(messageDocument,
					element.getAttribute("xpath"), XPathConstants.STRING));
			profileVOs.add(profileVO);
		}
		return profileVOs;
	}

}
