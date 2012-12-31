/**
 * 
 */
package com.hin.hl7messaging.api;



import java.util.List;

import com.hin.domain.IIndexable;
import com.hin.domain.vo.IndexFieldsVO;
import com.hin.domain.vo.MessageVO;



/**
 * @author krishna.lr
 * 
 */
public interface IIndexService {
	public void createIndex(String messageXML);

	public void updateIndex(String messageXML);
	
	public void createIndex(IIndexable indexableObject);
	
	public void createIndex(IndexFieldsVO indexFieldsVO,String indexDirName);
	
	public String getIndexDirectory(String messageXML);
	
	public void createIndex(String messageXML,IndexFieldsVO roleIndexFieldsVO);
	
	public void deleteIndex(String id, String indexDirectoryName);
	
	public void updateIndex(String messageXML,IndexFieldsVO indexFieldVo);
	
	public  List<IndexFieldsVO> getIndexFields(String messageXml);
	
	public void createIndexForMessageVo(MessageVO  messageVo) ;
	
	public void updateIndexForMessageVo(MessageVO  messageVo);
}
