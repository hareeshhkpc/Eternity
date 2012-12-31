/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.vo.SearchVO;

/**
 * @author krishna.lr
 * 
 */
public interface ISearchService {

	public Object search(SearchVO searchVO);

	List<Object> searchLookup(String className) throws Exception;

}
