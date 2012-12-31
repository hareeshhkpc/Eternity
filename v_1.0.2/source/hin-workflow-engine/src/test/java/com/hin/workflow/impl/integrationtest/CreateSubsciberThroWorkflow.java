/**
 * 
 */
package com.hin.workflow.impl.integrationtest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.cassandra.CassandraClient;
import com.hin.hl7messaging.cassandra.XPATHReader;
import com.hin.messaging.IWorkFlowProvider;

/**
 * @author krishna.lr
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml"})
public class CreateSubsciberThroWorkflow  extends AbstractJUnit4SpringContextTests{
	@Autowired
	private CassandraClient client;
	
	@Autowired
	private IWorkFlowProvider workFlowProvider; 
	
	@Test
	public void test() {
		try {
			client.connect("172.25.250.165", 9160, true);
			client.selectKeySpace("HIN_ETERNITY");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		XPATHReader reader = new XPATHReader("E:\\icthealth_projects\\HIN-ETERNITY\\source\\hin-web\\src\\main\\webapp\\message-skeleton\\COCT_MT150000HT04.xml");
		String message = reader.XMLmsg("E:\\icthealth_projects\\HIN-ETERNITY\\source\\hin-web\\src\\main\\webapp\\message-skeleton\\COCT_MT150000HT04.xml");
		MessageVO messageVO=new MessageVO();
		messageVO.setMessage(message);
		messageVO.setType("COCT_MT150000HT04");
		messageVO.setId("b1k-csg-adh-ep3");
		try {
			workFlowProvider.createNewTask("1", messageVO);
			System.out.println("inserted");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
