package com.hin.service.helper;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IIndexService;
import com.hin.hl7messaging.api.IMessageService;

@Service(value = "luceneUpdator")
public class LuceneUpdator {
	
	private Logger logger = Logger.getLogger(LuceneUpdator.class.getName());
	
	@Autowired
	private IMessageService messageService;
	
	@Autowired
	private IIndexService indexService;

	public LuceneUpdator() {
	}

	public void updateLuceneForMessage(String messageId, String attrName,
			String attrValue,String organizationId) {
		List<IndexFieldsVO> indexFieldsVOs = new ArrayList<IndexFieldsVO>();
		indexFieldsVOs.add(new IndexFieldsVO(attrName, "true", "", attrValue, "true"));
		updateLuceneIndexForMessage(messageId, indexFieldsVOs,organizationId);
	}

	private void updateLuceneIndexForMessage(String messageId, List<IndexFieldsVO> indexFieldsVOs,String organizationId) {
		try {
			String messageXml = getMessageService().getMessage(messageId,organizationId);
			MessageVO messageVO=new MessageVO();
			messageVO = getMessageService().createMessageVO(messageXml);
			messageVO.getIndexFieldVoList().addAll(indexFieldsVOs);
			getIndexService().updateIndexForMessageVo(messageVO);
			System.out.println(messageVO);
		} catch (Exception ex) {
			logger.error("Error while getting message :"+ex.getMessage(), ex);
			ex.printStackTrace();
		}
	}
	
	public IMessageService getMessageService() {
		return messageService;
	}

	public void setMessageService(IMessageService messageService) {
		this.messageService = messageService;
	}

	public IIndexService getIndexService() {
		return indexService;
	}

	public void setIndexService(IIndexService indexService) {
		this.indexService = indexService;
	}
}