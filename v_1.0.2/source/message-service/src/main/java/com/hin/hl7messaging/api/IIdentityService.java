package com.hin.hl7messaging.api;

import com.hin.domain.vo.MessageVO;

public interface IIdentityService {
	 public void createRoleDefinition(MessageVO messageVO);
	 public void createSubscriber(MessageVO messageVO);
}
	 