package com.hin.hl7messaging.api;

import com.hin.domain.DiscountDetails;
import com.hin.domain.InvoiceDetails;

public interface IInvoiceService {
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails)
			throws Exception;

	public InvoiceDetails getInvoiceDetails(String messageId) throws Exception;

	public void saveDiscountDetails(DiscountDetails discountDetails)
			throws Exception;

	public DiscountDetails getDiscountDetails(String messageId)
			throws Exception;

}
