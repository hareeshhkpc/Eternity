package com.hin.hl7messaging.api;

import com.hin.domain.vo.FileUploadMessageVO;

public interface IFileUploadMessageService {

	public String createFileUploadMessage(
			FileUploadMessageVO fileUploadMessageVO, String messageId,
			String patientId, String effectiveDate, String fileExtension);
	public FileUploadMessageVO createMessageVO(String messageXml);

	public String getFileUploadMessage(String messageId,String organizationId);
	
}
