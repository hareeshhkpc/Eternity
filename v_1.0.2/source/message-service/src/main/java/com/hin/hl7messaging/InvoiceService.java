package com.hin.hl7messaging;

import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;

import com.hin.domain.DiscountDetails;
import com.hin.domain.InvoiceDetails;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IInvoiceService;
import com.hin.hl7messaging.cassandra.CassandraConnector;

public class InvoiceService  implements IInvoiceService{
	
/*	@Resource(name = "identityMessageRepository")
	private IIdentityRepository repository;*/

	@Autowired
	private CassandraConnector cassandraConnector;
	
	@Override
	public void saveInvoiceDetails(InvoiceDetails invoiceDetails)
			throws Exception {
		// TODO Auto-generated method stub
		String columnFamily="";
		String organizationId="";
		HashMap<String, Object> columnValueMap = new HashMap<String, Object>();
		cassandraConnector.saveStandardColumnFamily(columnValueMap, columnFamily,organizationId);
	}

	@Override
	public InvoiceDetails getInvoiceDetails(String messageId) throws Exception {
		// TODO Auto-generated method stub
	
		return null;
	}

	@Override
	public void saveDiscountDetails(DiscountDetails discountDetails)
			throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public DiscountDetails getDiscountDetails(String messageId)
			throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

}
