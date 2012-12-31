package com.hin.hl7messaging.api;

import com.hin.domain.vo.MessageVO;

public interface ICodeGenarator {
	public String getNewMessageCode(MessageVO messageVO);
	public void updateMessageCode(MessageVO messageVO);
	public String getLicensceeCode(String messageId,String organizationId);
	public String getCurrentNum(MessageVO messageVO);
}
