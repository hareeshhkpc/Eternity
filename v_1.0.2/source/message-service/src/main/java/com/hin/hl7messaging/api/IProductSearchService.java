/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.vo.ProductVO;

/**
 * @author krishna.lr
 * 
 */
public interface IProductSearchService extends ISearchService {
	List<ProductVO> convertObjectListToProductVOList(Object productVOObjectList);
}
