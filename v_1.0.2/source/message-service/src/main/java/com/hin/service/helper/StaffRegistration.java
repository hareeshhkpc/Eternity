package com.hin.service.helper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.utils.FileUtils;

@Service(value = "staffRegistration")
public class StaffRegistration {
	
	private Logger logger = Logger.getLogger(StaffRegistration.class.getName());
	
	@Autowired
	private IMessageService messageService;

	public StaffRegistration() {
	}

	public void registerStaff(String filePath, String fileName) {
		File file = new File(filePath+fileName);
		String messageXml = FileUtils.getContentsAsJavaString(file);
		MessageVO messageVO = new MessageVO();
		try {
			messageVO = getMessageService().createMessageVO(messageXml);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		try {
			getMessageService().saveMessage(messageVO);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public IMessageService getMessageService() {
		return messageService;
	}

	public void setMessageService(IMessageService messageService) {
		this.messageService = messageService;
	}
}