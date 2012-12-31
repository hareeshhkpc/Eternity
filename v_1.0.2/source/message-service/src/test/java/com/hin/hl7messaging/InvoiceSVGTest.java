package com.hin.hl7messaging;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;

import org.junit.Test;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.hin.hl7messaging.utils.XMLHelper;

public class InvoiceSVGTest {
	int serviceYAxis = 0;
	
	@Test
	public void test() {
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;
		String stringData = "";
		String invoiceId ="", totalAmount="", doctorName = "", discount = "", interest = "";	
		String address = "KG Tower Marsa, Dubai Marina Dubai United Arab Emirates";
		String organizationName = "Eternity Medicine Institute Inc. Dubai";
		String telecom = "+97144508181";
		String currencyCode = "AED";
		String exchangeRate = "3.67299";
		
		List<String> invoiceServiceArray = new ArrayList<String>();
		invoiceServiceArray.add("AgeManagementProgram");
		invoiceServiceArray.add("BioClip");
		invoiceServiceArray.add("Biospace");
		invoiceServiceArray.add("BMI");
		invoiceServiceArray.add("Body Fat");
		
		
		HashMap<String, String> serviceMap = new HashMap<String, String>();
		HashMap<String, String> xCoordinatesMap = new HashMap<String, String>();
		
		File file = new File("E:\\EMI\\source\\hin-web\\src\\test\\java\\com\\hin\\hl7messaging\\web\\NewFile23.xml");
		Document doc = XMLHelper.getXMLDocument(file);
		
		String doctorPrefix = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/prefix", XPathConstants.STRING);
		String doctorGiven = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/given", XPathConstants.STRING);
		String doctorFamily = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/family", XPathConstants.STRING);
		String doctorSuffix = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/consultant/employmentStaff/employeePerson/name/suffix", XPathConstants.STRING);
		
		if(doctorPrefix != null && doctorPrefix != "")
			doctorName = doctorName + " " + doctorPrefix;
		if(doctorGiven != null && doctorGiven != "")
			doctorName = doctorName + " " + doctorGiven;
		if(doctorFamily != null && doctorFamily != "")
			doctorName = doctorName + " " + doctorFamily;
		if(doctorSuffix != null && doctorSuffix != "")
			doctorName = doctorName + " " + doctorSuffix;
		
		NodeList idFields = (NodeList) XMLHelper.read(doc, "message/FIAB_MT020000HT02/id", XPathConstants.NODESET);
		int idSize = idFields.getLength();
		
		for (int i = 1; i <= idSize; i++) {

			String rootNode = "message/FIAB_MT020000HT02/id[" + i + "]/root";
			String root = (String) XMLHelper.read(doc, rootNode, XPathConstants.STRING);
			root = root.replaceAll("\\n", "").trim();
			if(root.equals("INVOICE_ID")){
				invoiceId = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/id[" + i + "]/extension", XPathConstants.STRING);
			}
			if(root.equals("INVOICE_AMOUNT")){
				totalAmount = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/id[" + i + "]/extension", XPathConstants.STRING);
			}
			if(root.equals("DISCOUNT")){
				discount = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/id[" + i + "]/extension", XPathConstants.STRING);
			}
			if(root.equals("INTEREST")){
				interest = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/id[" + i + "]/extension", XPathConstants.STRING);
			}
		}

		String date = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/effectiveTime/value", XPathConstants.STRING);
		String[] myStringArray = date.split(" ");
		date = myStringArray[0];
		
		String prefix = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/prefix", XPathConstants.STRING);
		String given = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/given", XPathConstants.STRING);
		String family = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/family", XPathConstants.STRING);
		String suffix = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/postingTo/patientAccount/pertinentInformation/encounterEvent/subject/patient/patientPerson/name/suffix", XPathConstants.STRING);
		String patientName = "";
		if(prefix != null && prefix != "")
			patientName = patientName + " " + prefix;
		if(given != null && given != "")
			patientName = patientName + " " + given;
		if(family != null && family != "")
			patientName = patientName + " " + family;
		if(suffix != null && suffix != "")
			patientName = patientName + " " + suffix;
		
		NodeList serviceFields = (NodeList) XMLHelper.read(doc, "message/FIAB_MT020000HT02/pertinentInformation", XPathConstants.NODESET);
		int serviceSize = serviceFields.getLength();
		
		for (int i = 1; i <= serviceSize; i++) {

			String serviceName = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/pertinentInformation[" + i + "]/observationOrder/code/displayName", XPathConstants.STRING);
			serviceName = serviceName.replaceAll("\\n", "").trim();
			String cost = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/component[" + i + "]/financialTransactionChargeDetail/unitPriceAmt/numerator/value", XPathConstants.STRING);
			cost = cost.replaceAll("\\n", "").trim();
			
			String serviceCode = (String) XMLHelper.read(doc, "message/FIAB_MT020000HT02/pertinentInformation[" + i + "]/observationOrder/code/code", XPathConstants.STRING);
			serviceCode = serviceCode.replaceAll("\\n", "").trim();
			
			serviceMap.put(serviceName, cost);
			
			if(invoiceServiceArray != null && !invoiceServiceArray.isEmpty()){
				for(String service : invoiceServiceArray){
					if(!service.equals(serviceCode)){
						serviceMap.put("---" + service , "" );
					}
				}
			}
		
		}

		try {
			db = dbf.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}
		
		Document document = db.newDocument();
		Element rootElement = createRootElement(document);
		Element g = document.createElement("g");
		Element subG = document.createElement("g");		
		
		Element imageElement = createImage(document, subG);
		
		String style="font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#500e4a;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light";
		
		Element organizationElement = createTestTitleElement(document, subG, organizationName, "500", "113", style);
		Element addressElement = createTestTitleElement(document, subG, address, "500", "133", style);
		Element telecomElement = createTestTitleElement(document, subG, telecom, "500", "153", style);
		
		style = "font-size:25.52000046px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold";
		Element headerElement = createTestTitleElement(document, subG, "INVOICE", "1050", "113", style);
		
		style = "font-size:18.44000006px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold";
		Element customerElement = createTestTitleElement(document, subG, "To: " + patientName, "100", "290", style);
		
		style = "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light";
		Element invoiceNumElement = createTestTitleElement(document, subG, "Invoice Number : " + invoiceId, "930", "290", style);
		Element dateElement = createTestTitleElement(document, subG, "Date : " + date, "930", "310", style);
		Element doctorElement = createTestTitleElement(document, subG, "Doctor : " + doctorName, "930", "330", style);
		
		Element horizontalElement = createHorizontalLine(document, subG, "100" , "380");
		Element verticalElement = createVerticleLines(document, subG, "100" , "380", serviceMap.size());
		Element horizontalHeaderEndElement = createHorizontalLine(document, subG, "100" , "450");		
		
		
		style = "font-size:18.44000006px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold";
		Element descriptionElement = createTestTitleElement(document, subG, "Description", "400", "410", style);
		Element amtHeaderElement = createTestTitleElement(document, subG, "Amount in USD", "980", "410", style);
		
		
		style = "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light";
		
		xCoordinatesMap.put("115", "1150");
		
		Element closeElement = createEndComponent(document, subG, "100" , String.valueOf(serviceYAxis + 100), totalAmount , exchangeRate, currencyCode, discount, interest);
		Element serviceElement = createServiceElement(document, subG, serviceMap, xCoordinatesMap, "480", style);
		
		rootElement.appendChild(g);
		g.appendChild(imageElement);
		g.appendChild(organizationElement);
		g.appendChild(addressElement);
		g.appendChild(telecomElement);
		g.appendChild(headerElement);
		g.appendChild(customerElement);
		g.appendChild(invoiceNumElement);
		g.appendChild(dateElement);
		g.appendChild(doctorElement);
		g.appendChild(horizontalElement);
		g.appendChild(verticalElement);
		g.appendChild(horizontalHeaderEndElement);
		g.appendChild(descriptionElement);
		g.appendChild(amtHeaderElement);
		g.appendChild(closeElement);
		g.appendChild(serviceElement);
		g.appendChild(serviceElement);
		
		document.appendChild(rootElement);
		stringData = XMLHelper.getXMLDocumentAsString(document);
		System.out.println(stringData);

	}

	// creating RootElement
	public Element createRootElement(Document document) {
		Element rootElement = document.createElement("svg");
		rootElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		rootElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
		rootElement.setAttribute("width", "1500");
		rootElement.setAttribute("height", "1500");
		return rootElement;
	}
	
	//create horizontal line
	public Element createHorizontalLine(Document document, Element subG, String x, String y) {
		Element path = document.createElement("path");
		path.setAttribute("id", "horizontalLine");
		String dString = "m " + x + "," + y + " " + 1150 + ",0";
		path.setAttribute("d", dString);
		path.setAttribute(
				"style",
				"fill:none;stroke:#0c0c0c;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		subG.appendChild(path);
		return subG;
	}
	
	
	// creatingVerticalLine
	public Element createVerticleLines(Document document, Element subG, String x, String y, int size) {
		
		int yMax = Integer.parseInt(y) + size * 30;
		
		String dString = "M " + x + "," + y + " " + x + "," + (yMax + 100 ) + "";
		Element path = document.createElement("path");
		path.setAttribute("id", "verticalLine");
		path.setAttribute("d", dString);
		path.setAttribute(
				"style",
				"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		
		subG.appendChild(path);
		
		//createVerticleEndLine
		x = String.valueOf(1250);
		
		String dString1 = "M " + x + "," + y + " " + x + "," + (yMax + 200 ) + "";
		Element path1 = document.createElement("path");
		path1.setAttribute("id", "verticalLine");
		path1.setAttribute("d", dString1);
		path1.setAttribute(
				"style",
				"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		
		subG.appendChild(path1);
		
		
		//verticalDividerElement
		x = String.valueOf(900);
		
		String dString2 = "M " + x + "," + y + " " + x + "," + (yMax + 200 ) + "";
		Element path2 = document.createElement("path");
		path2.setAttribute("id", "verticalLine");
		path2.setAttribute("d", dString2);
		path2.setAttribute(
				"style",
				"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		
		subG.appendChild(path2);
		
		serviceYAxis = yMax;
		
		return subG;
		
	}
	
	
	//create Image
	public Element createImage(Document document, Element subG) {
		Element path = document.createElement("image");	
		path.setAttribute("xlink:href", "data:image/png;base64,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");		
		path.setAttribute("x", "104");
		path.setAttribute("y", "75");
		path.setAttribute("height", "100px");
		path.setAttribute("width", "100px");
		subG.appendChild(path);
		return subG;
	}
	
	public Element createTestTitleElement(Document document, Element subG, String content, String x, String y, String style) {
		Element text = document.createElement("text");
		text.setAttribute("x", "223.8");
		text.setAttribute("y", "781.76");
		text.setAttribute("id", "legendTitle");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "optimumTitle");
		tspan.setAttribute("x", x);
		tspan.setAttribute("y", y);
		tspan.setAttribute(
				"style", style);
		tspan.setTextContent(content);
		text.appendChild(tspan);
		subG.appendChild(text);
		return subG;
	}
	
	// For services
	public Element createServiceElement(Document document, Element subG, HashMap<String, String> serviceMap, HashMap<String, String> xCoordinatesMap, String y, String style) {
		
		List<String> sortedKeys = new ArrayList<String>(serviceMap.size());
		sortedKeys.addAll(serviceMap.keySet());
		Collections.sort(sortedKeys, Collections.reverseOrder());
		
		int xService = 115; 
		int xCost = 1150;
		
		for(String key : sortedKeys){
			Element text = document.createElement("text");
			text.setAttribute("x", "223.8");
			text.setAttribute("y", "781.76");
			text.setAttribute("id", "legendTitle");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "optimumTitle");
			tspan.setAttribute("x", String.valueOf(xService));
			tspan.setAttribute("y", y);
			tspan.setAttribute("style", style);
			tspan.setTextContent((String) key);
			text.appendChild(tspan);
			subG.appendChild(text);
			
			Element text1 = document.createElement("text");
			text1.setAttribute("x", "223.8");
			text1.setAttribute("y", "781.76");
			text1.setAttribute("id", "legendTitle");
			Element tspan1 = document.createElement("tspan");
			tspan1.setAttribute("id", "optimumTitle");
			tspan1.setAttribute("x", String.valueOf(xCost));
			tspan1.setAttribute("y", y);
			tspan1.setAttribute(
					"style", style);
			tspan1.setTextContent((String) serviceMap.get(key));
			text1.appendChild(tspan1);
			subG.appendChild(text1);
			
			int yAxis = Integer.parseInt(y);
			y = String.valueOf(yAxis + 30);
		}
		
		
	   /* while (iterator.hasNext()) {
	    	
	        @SuppressWarnings("rawtypes")
			Map.Entry pairs = (Map.Entry)iterator.next();
	        
	        Element text = document.createElement("text");
			text.setAttribute("x", "223.8");
			text.setAttribute("y", "781.76");
			text.setAttribute("id", "legendTitle");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "optimumTitle");
			tspan.setAttribute("x", String.valueOf(xService));
			tspan.setAttribute("y", y);
			tspan.setAttribute("style", style);
			tspan.setTextContent((String) pairs.getKey());
			text.appendChild(tspan);
			subG.appendChild(text);
			
			Element text1 = document.createElement("text");
			text1.setAttribute("x", "223.8");
			text1.setAttribute("y", "781.76");
			text1.setAttribute("id", "legendTitle");
			Element tspan1 = document.createElement("tspan");
			tspan1.setAttribute("id", "optimumTitle");
			tspan1.setAttribute("x", String.valueOf(xCost));
			tspan1.setAttribute("y", y);
			tspan1.setAttribute(
					"style", style);
			tspan1.setTextContent((String) pairs.getValue());
			text1.appendChild(tspan1);
			subG.appendChild(text1);
			
			int yAxis = Integer.parseInt(y);
			y = String.valueOf(yAxis + 30);
			//xService = xService + 20;
	    }*/
		
		
		return subG;
	}
	
	//create End Component line
	public Element createEndComponent(Document document, Element subG, String x, String y, String cost, String exchangeRate, String currencyCode, String discount, String interest) {
		int respY = Integer.parseInt(y);
		int respX = Integer.parseInt(x);
		
		Element path = document.createElement("path");
		path.setAttribute("id", "horizontalLine");
		String dString = "m " + x + "," + y + " " + 1150 + ",0";
		
		path.setAttribute("d", dString);
		path.setAttribute(
				"style",
				"fill:none;stroke:#0c0c0c;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		
		Element path1 = document.createElement("path");	
		path1.setAttribute("id", "horizontalLine");
		String d2String = "m " + (respX + 800) + "," + (respY + 100) + " " + 350 + ",0";
		path1.setAttribute("d", d2String);
		path1.setAttribute(
				"style",
				"fill:none;stroke:#0c0c0c;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		
		if(!discount.isEmpty() && Float.parseFloat(discount) > 0){
			Element discountText = document.createElement("text");
			discountText.setAttribute("x", "223.8");
			discountText.setAttribute("y", "781.76");
			discountText.setAttribute("id", "legendTitle");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "optimumTitle");
			tspan.setAttribute("x", "820");
			tspan.setAttribute("y", String.valueOf(respY + 60));
			tspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold");
			tspan.setTextContent("Discount");
			discountText.appendChild(tspan);
			subG.appendChild(discountText);
			
			Element discountTotalText = document.createElement("text");
			discountTotalText.setAttribute("x", "223.8");
			discountTotalText.setAttribute("y", "781.76");
			discountTotalText.setAttribute("id", "legendTitle");
			Element totalTspan = document.createElement("tspan");
			totalTspan.setAttribute("id", "optimumTitle");
			totalTspan.setAttribute("x", "1150");
			totalTspan.setAttribute("y", String.valueOf(respY + 60));
			totalTspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
			totalTspan.setTextContent(discount);
			discountTotalText.appendChild(totalTspan);
			subG.appendChild(discountTotalText);
			
			respY += 100;
			
			Element discountPath = document.createElement("path");	
			discountPath.setAttribute("id", "horizontalLine");
			String discount2String = "m " + (respX + 800) + "," + (respY + 100) + " " + 350 + ",0";
			discountPath.setAttribute("d", discount2String);
			discountPath.setAttribute(
					"style",
					"fill:none;stroke:#0c0c0c;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			x = String.valueOf(1250);
			
			String dString1 = "M " + x + "," + y + " " + x + "," + (respY + 100 ) + "";
			Element discountVerticalPath = document.createElement("path");
			discountVerticalPath.setAttribute("id", "verticalLine");
			discountVerticalPath.setAttribute("d", dString1);
			discountVerticalPath.setAttribute(
					"style",
					"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			subG.appendChild(discountVerticalPath);
			
			//verticalDividerElement
			x = String.valueOf(900);
			
			String dString2 = "M " + x + "," + y + " " + x + "," + (respY + 100 ) + "";
			Element discountVerticalPath2 = document.createElement("path");
			discountVerticalPath2.setAttribute("id", "verticalLine");
			discountVerticalPath2.setAttribute("d", dString2);
			discountVerticalPath2.setAttribute(
					"style",
					"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			subG.appendChild(discountVerticalPath2);
			subG.appendChild(discountPath);
		}
		
		if(!interest.isEmpty() && Float.parseFloat(interest) > 0){
			Element interestText = document.createElement("text");
			interestText.setAttribute("x", "223.8");
			interestText.setAttribute("y", "781.76");
			interestText.setAttribute("id", "legendTitle");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "optimumTitle");
			tspan.setAttribute("x", "820");
			tspan.setAttribute("y", String.valueOf(respY + 60));
			tspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold");
			tspan.setTextContent("Interest");
			interestText.appendChild(tspan);
			subG.appendChild(interestText);
			
			Element interestTotalText = document.createElement("text");
			interestTotalText.setAttribute("x", "223.8");
			interestTotalText.setAttribute("y", "781.76");
			interestTotalText.setAttribute("id", "legendTitle");
			Element totalTspan = document.createElement("tspan");
			totalTspan.setAttribute("id", "optimumTitle");
			totalTspan.setAttribute("x", "1150");
			totalTspan.setAttribute("y", String.valueOf(respY + 60));
			totalTspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
			totalTspan.setTextContent(interest);
			interestTotalText.appendChild(totalTspan);
			subG.appendChild(interestTotalText);
			
			respY += 100;
			
			Element interestPath = document.createElement("path");	
			interestPath.setAttribute("id", "horizontalLine");
			String interest2String = "m " + (respX + 800) + "," + (respY + 100) + " " + 350 + ",0";
			interestPath.setAttribute("d", interest2String);
			interestPath.setAttribute(
					"style",
					"fill:none;stroke:#0c0c0c;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			x = String.valueOf(1250);
			
			String dString1 = "M " + x + "," + y + " " + x + "," + (respY + 100 ) + "";
			Element interestVerticalPath = document.createElement("path");
			interestVerticalPath.setAttribute("id", "verticalLine");
			interestVerticalPath.setAttribute("d", dString1);
			interestVerticalPath.setAttribute(
					"style",
					"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			subG.appendChild(interestVerticalPath);
			
			//verticalDividerElement
			x = String.valueOf(900);
			
			String dString2 = "M " + x + "," + y + " " + x + "," + (respY + 100 ) + "";
			Element interestVerticalPath2 = document.createElement("path");
			interestVerticalPath2.setAttribute("id", "verticalLine");
			interestVerticalPath2.setAttribute("d", dString2);
			interestVerticalPath2.setAttribute(
					"style",
					"#fill:none;stroke:#0c0c0c;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			
			subG.appendChild(interestVerticalPath2);
			subG.appendChild(interestPath);
		}
		
		
		Element text = document.createElement("text");
		text.setAttribute("x", "223.8");
		text.setAttribute("y", "781.76");
		text.setAttribute("id", "legendTitle");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "optimumTitle");
		tspan.setAttribute("x", "850");
		tspan.setAttribute("y", String.valueOf(respY + 60));
		tspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light-Bold");
		tspan.setTextContent("Total");
		text.appendChild(tspan);
		subG.appendChild(text);
		
		Element totalText = document.createElement("text");
		totalText.setAttribute("x", "223.8");
		totalText.setAttribute("y", "781.76");
		totalText.setAttribute("id", "legendTitle");
		Element totalTspan = document.createElement("tspan");
		totalTspan.setAttribute("id", "optimumTitle");
		totalTspan.setAttribute("x", "1150");
		totalTspan.setAttribute("y", String.valueOf(respY + 60));
		totalTspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
		totalTspan.setTextContent(cost);
		totalText.appendChild(totalTspan);
		subG.appendChild(totalText);
		
		Element convertedText = document.createElement("text");
		convertedText.setAttribute("x", "223.8");
		convertedText.setAttribute("y", "781.76");
		convertedText.setAttribute("id", "legendTitle");
		Element convertedTspan = document.createElement("tspan");
		convertedTspan.setAttribute("id", "optimumTitle");
		convertedTspan.setAttribute("x", "1107");
		convertedTspan.setAttribute("y", String.valueOf(respY + 80));
		convertedTspan.setAttribute("style", "font-size:18.44000006px;font-variant:normal;font-weight:normal;writing-mode:lr-tb;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
		convertedTspan.setTextContent("(" + String.valueOf(Float.parseFloat(exchangeRate) * Float.parseFloat(cost)) + " " + currencyCode +")");
		convertedText.appendChild(convertedTspan);
		subG.appendChild(convertedText);
		
		subG.appendChild(path);
		subG.appendChild(path1);
		
		return subG;
	}

}
