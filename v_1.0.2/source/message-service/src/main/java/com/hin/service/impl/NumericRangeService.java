/**
 * 
 */
package com.hin.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Concept;
import com.hin.domain.NumericRange;
import com.hin.service.INumericRangeService;
import com.hin.service.impl.UnitService;

/**
 * @author krishna.lr and vinaykumar.gk
 * 
 */
@Service(value = "numericRangeService")
public class NumericRangeService extends BaseService<NumericRange> implements
		INumericRangeService {
	private Logger logger = Logger.getLogger(UnitService.class.getName());
	@Autowired
	private IBaseRepository<NumericRange> baseRepository;

	@Override
	public void saveNumericRange(NumericRange numericRange) {
		// TODO Auto-generated method stub
		try {
			baseRepository.save(numericRange);
		} catch (Exception e) {
			logger.error(e);
		}
	}

	@Override
	public List<NumericRange> findAllNumericRange() {
		return baseRepository.findAll(NumericRange.class);
	}

	@Override
	public NumericRange findNumericRangeById(Object id) {
		// TODO Auto-generated method stub
		return (NumericRange) baseRepository.findById(id, NumericRange.class);
	}

	@Override
	public void update(NumericRange numericRange) {
		baseRepository.update(numericRange);

	}
}
