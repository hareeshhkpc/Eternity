/**
 * 
 */
package com.hin.hl7messaging;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.ProductVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.IProductSearchService;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "productSearchService")
public class ProductSearchService extends SearchService implements
		IProductSearchService {
	@Autowired
	IMessageService messageService;
	
	private Logger logger = Logger.getLogger(SearchService.class.getName());

	public Object fillData(ScoreDoc[] hits, IndexSearcher searcher,
			SearchVO searchVO) {
		Gson gson = new GsonBuilder().create();
		List<ProductVO> productVOList = new ArrayList<ProductVO>();
		try {
			for (int i = 0; i < hits.length; i++) {
				int docId = hits[i].doc;
				Document d;
				d = searcher.doc(docId);
				ProductVO productVO = new ProductVO();
				productVO.setMessageId(d.get("messageId"));
				productVO.setMessageTitle(d.get("messageTitle"));
				productVO.setMessageStatus(d.get("messageStatus"));
				productVO.setCreatedDate(d.get("createddate"));
				productVO.setIsActive(d.get("ISACTIVE"));
				productVO.setMessage(getMessage(d.get("messageId"),d.get("organizationId")));
				productVOList.add(productVO);
			}
		} catch (CorruptIndexException cie) {
			logger.error("CorruptIndexException:" + cie.getMessage());
		} catch (IOException ioe) {
			logger.error("CorruptIndexException:" + ioe.getMessage());
		}
		return  gson.toJson(productVOList);

	}
	
	private String getMessage(String messageId,String organizationId){
		String message = "";
		try {
			if(messageId !=null && messageId.length() > 0 ){
				message = messageService.getMessage(messageId,organizationId);
			}
		} catch (Exception ex) {
			logger.error("Error while getting message :"+ex.getMessage(), ex);
		}
		return message;
	}

	@Override
	public List<ProductVO> convertObjectListToProductVOList(
			Object productVOObjectList) {
		List<ProductVO> products = new ArrayList<ProductVO>();
		for (Object productVOObject : (List<ProductVO>) productVOObjectList) {
			products.add((ProductVO) productVOObject);
		}
		return products;
	}
	
}
