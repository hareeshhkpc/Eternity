/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.Date;
import java.util.List;

import com.hin.domain.vo.DocumentsVO;


/**
 * @author shilpa.rao
 * 
 */
public interface IDocumentsService {

	public List<String> getDataYearly();
	public List<String> getMessageIdsForMonth(DocumentsVO documentsVO) throws Exception;
	public List<DocumentsVO> getMessage(List<String> documentsMessageIds,String organizationId) throws Exception;
	public List<String> getAllLegends();
	public List<String> getLegendForMonth(long startTime,long endTime, String patientId) throws Exception;
	public Date getLasteDateOfMonth(int month, int year);
	public String convertHtmlToPdf(String patientId, String messageId, String invoiceNumber) throws Exception;
	
}
