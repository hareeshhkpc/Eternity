package com.hin.hl7messaging;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.HashMap;

import javax.annotation.Resource;

import org.junit.Before;
import org.junit.Test;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.hl7.messaging.api.IMessageRepository;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class fileInputTest extends  AbstractJUnit4SpringContextTests {
	
	@Resource(name="messageRepository")
	private IMessageRepository repository;
	
	String userName="",password="",message="";
	Boolean isOrg=true;
	
	@Before
	public void testConnect(){

	}
	
	// Insert row in super column
		@Test
		public void testSaveMessageInbox(){
			try {
				String[] strLine=new String[3];
				FileInputStream fstream = new FileInputStream("../hin-web/src/main/webapp/UserProfile/html/input.txt");
				DataInputStream in = new DataInputStream(fstream);
				BufferedReader br = new BufferedReader(new InputStreamReader(in));
				int i=0;
				while((strLine[i]=br.readLine())!=null&&i<2){
					i++;
				}
				br.close();
				fstream.close();
				HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
				HashMap<String, String> userNameMap = new HashMap<String, String>();
				HashMap<String, String> passwordMap = new HashMap<String, String>();
				HashMap<String, String> isOrgMap = new HashMap<String, String>();
				HashMap<String, String> regMessageMap = new HashMap<String, String>();
				columnValueMap.put("ROWKEY", strLine[0]+strLine[1]);
				userNameMap.put("value", strLine[0]);
				passwordMap.put("value",strLine[1]);
				regMessageMap.put("PROFILE", strLine[2]);
			 	columnValueMap.put("USER_NAME", userNameMap);
			 	columnValueMap.put("PASSWORD", passwordMap);
			 	columnValueMap.put("REG_MESSAGE", regMessageMap);
			 	columnValueMap.put("IS_ORG", isOrgMap);
				repository.saveMessage("IDENTITY_REPO", columnValueMap);
			} catch (Exception e) {
				e.printStackTrace();
			}	
		}
}
