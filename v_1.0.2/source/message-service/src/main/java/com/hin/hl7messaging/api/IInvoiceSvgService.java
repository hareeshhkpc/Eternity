/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.List;

import org.w3c.dom.Document;

import com.hin.domain.Concept;
import com.hin.domain.vo.MessageVO;


/**
 * @author shilpa.rao
 * 
 */
public interface IInvoiceSvgService {

	public String createSvgDocument(Document doc, List<Concept> invoiceServiceArray, String organizationName, String telecom, String address,  String exchangeRate,
			String currencyCode);
	
	public void generatePdf(MessageVO messageVO);
}
