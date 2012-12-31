/**
 * 
 */
package com.hin.service;

import java.util.List;

import com.hin.domain.Concept;
import com.hin.domain.NumericRange;

/**
 * @author krishna.lr and vinaykumar.gk
 * 
 */
public interface INumericRangeService extends IBaseService<NumericRange> {
	public void saveNumericRange(NumericRange numericRange);

	public List<NumericRange> findAllNumericRange();

	public NumericRange findNumericRangeById(Object id);

	public void update(NumericRange numericRange);
}
