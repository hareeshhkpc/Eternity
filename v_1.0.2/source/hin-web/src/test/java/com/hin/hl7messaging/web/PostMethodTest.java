package com.hin.hl7messaging.web;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.httpclient.methods.multipart.StringPart;
import org.junit.Test;


import com.hin.hl7messaging.cassandra.XPATHReader;

public class PostMethodTest {
	
	@Test
	public void testRegisterOrganizaion() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");

		HashMap<String, String> params = new HashMap<String, String>();
		params.put("orgID", "HIN_1001");
		params.put("orgAuthority", "Health Information Network");
		params.put("orgName", "imtac iCT Lifecare Technology");
		params.put("orgMail", "abdul.kahar@imtacict.com");
		
		String userXml = makeOrgRegMessage(params);
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		Part[] parts = { 
				new StringPart("profileID", ""),	
				new StringPart("messageID", ""),
				new StringPart("messageType", "COCT_MT150000"),
				new StringPart("requestType", "register"),
				new StringPart("userName", "imtac"),
				new StringPart("password", "imtac"),

				new FilePart("message", baps) 
		};		
		String response = postToHttpService(client, method, parts);		
		System.out.println("Org Register Response: " + response);		
		
		params = new HashMap<String, String>();
		params.put("personName", "Abdul Kahar");
		params.put("profileAuthority", "IMTAC ICT");
		params.put("profileID", "");
		params.put("formalAuthority", "IMTAC ICT");
		params.put("formalMail", "abdul.kahar@imtacict.com");
		params.put("formalID", "IMTAC_1001");
		params.put("messageID", "IMTAC_100001");
		params.put("messageAuthority", "IMTAC ICT");
		
		userXml = makeUserRegMessage(params);
		baps = new ByteArrayPartSource("Registration.xml", userXml.getBytes());  
		
		parts = new Part[]{ 
				new StringPart("orgUserId", response),	
				new StringPart("messageType", "PRPA_IN101001UV01"),
				new StringPart("requestType", "linkedProfileRegistration"),

				new FilePart("message", baps) 
		};
		
		method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		response = postToHttpService(client, method, parts);
		
		System.out.println("Linked Profile Register Response: " + response);
		
		
	}
	
	@Test
	public void testRegisterUser() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		BufferedReader br = null;

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
	//	ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", "<PRPA_IN101001UV01 id=\"id1_1\"><id id=\"id1_1_id786_1\" root=\"IMTAC00002\" extension=\"\" assigningAuthorityName=\"IMTAC\" displayable=\"\" nullFlavor=\"\"></id><controlActProcess id=\"id1_1_id801_1\"><subject id=\"id1_1_id801_1_id29_1\"><registrationEvent id=\"id1_1_id801_1_id29_1_id31_1\"><subject1 id=\"id1_1_id801_1_id29_1_id31_1_id35_1\"><identifiedPerson id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1\"><id id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1_id418_1\" root=\"IMTAC00002\" extension=\"\" assigningAuthorityName=\"IMTAC\" displayable=\"\" nullFlavor=\"\"></id><telecom id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1_id420_1\" use=\"thanveer.aqthar@imtacict.com\" value=\"thanveer.aqthar@imtacict.com\" nullFlavor=\"\"></telecom><identifiedPerson id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1_id423_1\"><id id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1_id423_1_id436_1\" root=\"IMTAC00002\" extension=\"\" assigningAuthorityName=\"imtac\" displayable=\"\" nullFlavor=\"\"></id><name id=\"id1_1_id801_1_id29_1_id31_1_id35_1_id41_1_id423_1_id437_1\" use=\"L\" nullFlavor=\"\">IMTAC00002</name></identifiedPerson></identifiedPerson></subject1></registrationEvent></subject></controlActProcess></PRPA_IN101001UV01>".getBytes());  
		
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml", "<PRPA_IN000001 id=\"id1_1\"></PRPA_IN000001>".getBytes());
		
		Part[] parts = { 
				new StringPart("profileID", ""),	
				new StringPart("messageID", ""),
				//new StringPart("messageType", "PRPA_IN101001UV01"),
				new StringPart("messageType", "PRPA_IN000001"),
				new StringPart("requestType", "registerOrgUser"),
				new StringPart("userName", "integration2"),
				new StringPart("password", "integration2"),

				new FilePart("message", baps) 
		};
		
		postToHttpService(client, method, parts);

	}
	
	private String makeOrgRegMessage(HashMap<String, String> params){
		String userXml = "<COCT_MT150000 id=\"id1_1\"><id id=\"id1_1_id227_1\" root=\"${orgID}\" extension=\"\" assigningAuthorityName=\"${orgAuthority}\" displayable=\"\" nullFlavor=\"\"></id><name id=\"id1_1_id229_1\" use=\"L\">${orgName}</name><telecom id=\"id1_1_id232_1\" use=\"${orgMail}\"	value=\"\" nullFlavor=\"\"></telecom></COCT_MT150000>";

		userXml = userXml.replace("${orgID}", params.get("orgID"));
		userXml = userXml.replace("${orgAuthority}", params.get("orgAuthority"));
		userXml = userXml.replace("${orgName}", params.get("orgName"));
		userXml = userXml.replace("${orgMail}", params.get("orgMail"));
		
		return userXml;
	}
	private String makeUserRegMessage(HashMap<String, String> params){
		String userXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><PRPA_IN000001  xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ITSVersion=\"XML_1.0\" id=\"id1_1\"><id extension=\"\" id=\"id1_1_id747_1\" root=\"${messageID}\" assigningAuthorityName=\"${messageAuthority}\"/><creationTime id=\"id1_1_id748_1\" value=\"20050719140010\"/>	<responseModeCode id=\"id1_1_id750_1\" nullFlavor=\"NI\"/>	<versionCode code=\"NE2006\" id=\"id1_1_id751_1\"/>	<!-- Interaction is a notification of a person registration -->	<interactionId extension=\"PRPA_IN000001\" id=\"id1_1_id752_1\" root=\"2.16.840.1.113883.1.6\"/>	<processingCode code=\"P\" id=\"id1_1_id754_1\"/>	<processingModeCode code=\"T\" id=\"id1_1_id755_1\"/>	<acceptAckCode code=\"ER\" id=\"id1_1_id756_1\"/>	<receiver id=\"id1_1_id758_1\" typeCode=\"RCV\">		<device classCode=\"DEV\" determinerCode=\"INSTANCE\" id=\"id1_1_id758_1_id57_1\">			<id extension=\"922\" id=\"id1_1_id758_1_id57_1_id39_1\" root=\"2.16.840.1.113883.2.6.6\"/>		</device>	</receiver>	<sender id=\"id1_1_id760_1\" typeCode=\"SND\">		<device classCode=\"DEV\" determinerCode=\"INSTANCE\" id=\"id1_1_id760_1_id61_1\">			<id extension=\"1\" id=\"id1_1_id760_1_id61_1_id39_1\" root=\"2.16.840.1.113883.2.6.6\"/>		</device>	</sender>	<controlActProcess id=\"id1_1_id763_1\">		<code id=\"id1_1_id763_1_id20_1\" nullFlavor=\"NI\"/>		<subject id=\"id1_1_id763_1_id28_1\">			<registrationEvent id=\"id1_1_id763_1_id28_1_id29_1\" moodCode=\"EVN\">				<code id=\"id1_1_id763_1_id28_1_id29_1_id31_1\" nullFlavor=\"NI\"/>				<subject id=\"id1_1_id763_1_id28_1_id29_1_id32_1\">					<identifiedEntity classCode=\"IDE\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1\">						<id id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id326_1\"							root=\"${formalID}\" extension=\"\" assigningAuthorityName=\"${formalAuthority}\"							displayable=\"\" nullFlavor=\"\"></id>						<telecom id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id328_1\"							use=\"${formalMail}\" value=\"\" nullFlavor=\"\"></telecom>						<identifiedPerson classCode=\"IDP\" determinerCode=\"INSTANCE\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1\">							<id extension=\"04P800000-1049151\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id351_1\" root=\"${profileID}\"  assigningAuthorityName=\"${profileAuthority}\"/>							<name id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id352_1\" use=\"L\">${personName}</name>							<!-- profile image -->							<desc id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id353_1\" mediaType=\"text/plain\"/>							<statusCode code=\"active\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id354_1\"/>							<telecom id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id355_1\"/>							<administrativeGenderCode code=\"M\" codeSystemName=\"2.16.840.1.113883.5.1\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id357_1\"/>							<birthTime id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id358_1\" value=\"17091988\"/>							<addr id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id364_1\">								<country>India</country>								<state>Karnataka</state>								<city>Hubli</city>								<postalCode>574140</postalCode>								<streetName>Nagundanahalli</streetName>								<houseNumber>67</houseNumber>							</addr>							<maritalStatusCode code=\"M\" codeSystem=\"2.16.840.1.113883.5.2\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id365_1\"/>							<religiousAffiliationCode code=\"H\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id369_1\"/>							<asEmployment classCode=\"AET\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id372_1\">							</asEmployment>							<asCitizen classCode=\"ACN\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id373_1\">								<politicalNation classCode=\"PTN\" determinerCode=\"INSTANCE\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id373_1_id274_1\">									<code id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id373_1_id274_1_id342_1\" nullFlavor=\"NI\"/>								</politicalNation>							</asCitizen>							<emergencyContact classCode=\"EMC\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1\">								<emergencyContactPerson classCode=\"ECP\" determinerCode=\"INSTANCE\" id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1\">									<name id=\"id1_1_id763_1_id28_1_id29_1_id32_1_id33_1_id331_1_id378_1_id289_1_id88_1\">										<prefix>Mr</prefix>										<given>Tippe</given>										<family>Gowda</family>									</name>								</emergencyContactPerson>							</emergencyContact>						</identifiedPerson>					</identifiedEntity>				</subject>			</registrationEvent>		</subject>	</controlActProcess></PRPA_IN000001>";

		userXml = userXml.replace("${personName}", params.get("personName"));
		userXml = userXml.replace("${profileAuthority}", params.get("profileAuthority"));
		userXml = userXml.replace("${profileID}", params.get("profileID"));
		userXml = userXml.replace("${formalMail}", params.get("formalMail"));
		userXml = userXml.replace("${formalAuthority}", params.get("formalAuthority"));
		userXml = userXml.replace("${formalID}", params.get("formalID"));
		userXml = userXml.replace("${messageID}", params.get("messageID"));
		userXml = userXml.replace("${messageAuthority}", params.get("messageAuthority"));
		
		return userXml;
	}

	private String postToHttpService(HttpClient client, PostMethod method, Part[] parts) {
		
		BufferedReader br = null;
		
		method.setRequestEntity(new MultipartRequestEntity(parts, method.getParams()));

		try {
			int returnCode = client.executeMethod(method);

			if (returnCode == HttpStatus.SC_NOT_IMPLEMENTED) {
				System.err
						.println("The Post method is not implemented by this URI");
				// still consume the response body
				return method.getResponseBodyAsString();
			} else {
				StringBuffer buf = new StringBuffer();
				br = new BufferedReader(new InputStreamReader(
						method.getResponseBodyAsStream()));
				String readLine;
				while (((readLine = br.readLine()) != null)) {
					System.err.println(readLine);
					buf.append(readLine);
				}
				return buf.toString();
			}
		} catch (Exception e) {
			System.err.println(e);
		} finally {
			method.releaseConnection();
			if (br != null)
				try {
					br.close();
				} catch (Exception fe) {
				}
		}
		return null;
	}

	@Test
	public void testRegistrationMessageSend() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		BufferedReader br = null;

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
		XPATHReader reader = new XPATHReader("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\Registeration_PRPA_IN000001_withID.xml");
		String message = reader.XMLmsg("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\Registeration_PRPA_IN000001_withID.xml");
		ByteArrayPartSource baps = new ByteArrayPartSource("Registration.xml",message.getBytes());  
		
		Part[] parts = { 
				new StringPart("assignedToWhom", "user1demo"),	
				new StringPart("messageID", "PRPA_IN000001"),
				new StringPart("messageType", "PRPA_IN000001"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN000001"),
				new FilePart("message", baps) 

				
		};
		
		postToHttpService(client, method, parts);

	}
	
	@Test
	public void testEncounterEventMessageSend() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		BufferedReader br = null;

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
		XPATHReader reader = new XPATHReader("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\EncounterEvent_PRPA_IN400000_withID.xml");
		String message = reader.XMLmsg("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\EncounterEvent_PRPA_IN400000_withID.xml");
		ByteArrayPartSource baps = new ByteArrayPartSource("EncounterEvent_PRPA_IN400000.xml",message.getBytes());  
		
		Part[] parts = { 
				new StringPart("assignedToWhom", "user1demo"),	
				new StringPart("messageID", "PRPA_IN400000"),
				new StringPart("messageType", "PRPA_IN400000"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN400000"),
				new FilePart("message", baps)
				
		};
		
		postToHttpService(client, method, parts);

	}
	
	@Test	
	public void testEncounterAppointmentMessageSend() {
		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");
		BufferedReader br = null;
		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
		XPATHReader reader = new XPATHReader("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\EncounterAppointment_PRPA_IN410001_withID.xml");
		String message = reader.XMLmsg("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\EncounterAppointment_PRPA_IN410001_withID.xml");
		ByteArrayPartSource baps = new ByteArrayPartSource("EncounterAppointment.xml",message.getBytes());  
		Part[] parts = { 
				new StringPart("assignedToWhom", "user2demo"),	
				new StringPart("messageID", "PRPA_IN410001"),
				new StringPart("messageType", "PRPA_IN410001"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "PRPA_IN410001"),
				new FilePart("message", baps)
				
		};
		
		postToHttpService(client, method, parts);

	}
	
	@Test
	public void testSubstanceAdministrationEventMessageSend() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		BufferedReader br = null;

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
		XPATHReader reader = new XPATHReader("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\SubstanceAdministrationEvent_POSA_IN000101_withID.xml");
		String message = reader.XMLmsg("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\SubstanceAdministrationEvent_POSA_IN000101_withID.xml");
		ByteArrayPartSource baps = new ByteArrayPartSource("SubstanceAdministrationEvent.xml",message.getBytes());  
		
		Part[] parts = { 
				new StringPart("assignedToWhom", "admindemo"),	
				new StringPart("messageID", "POSA_IN000101"),
				new StringPart("messageType", "POSA_IN000101"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "POSA_IN000101"),
				new FilePart("message", baps)
				
		};
		
		postToHttpService(client, method, parts);

	}
	
	@Test
	public void testSpecimenObservationEventMessageSend() {

		HttpClient client = new HttpClient();
		client.getParams().setParameter("http.useragent", "Test Client");

		BufferedReader br = null;

		PostMethod method = new PostMethod("http://localhost:8080/hin-web/MessageServlet");
		
		XPATHReader reader = new XPATHReader("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\SpecimenObservationEvent_POXX_IN111001_withID.xml");
		String message = reader.XMLmsg("E:\\ict-projects\\HIN\\source\\message-configuration\\src\\main\\resources\\messageconfig\\htb\\xml\\SpecimenObservationEvent_POXX_IN111001_withID.xml");
		ByteArrayPartSource baps = new ByteArrayPartSource("SpecimenObservationEvent.xml",message.getBytes());  
		
		Part[] parts = { 
				new StringPart("assignedToWhom", "admindemo"),	
				new StringPart("messageID", "POXX_IN111001"),
				new StringPart("messageType", "POXX_IN111001"),
				new StringPart("requestType", "newTask"),
				new StringPart("artifactID", "POXX_IN111001"),
				new FilePart("message", baps)
				
		};
		
		postToHttpService(client, method, parts);

	}
}