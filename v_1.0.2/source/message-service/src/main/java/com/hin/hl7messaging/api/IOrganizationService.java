package com.hin.hl7messaging.api;

import com.hin.domain.vo.MessageVO;

public interface IOrganizationService {
	public void createOrganizationKeySpace(MessageVO messageVO) throws Exception;
}
