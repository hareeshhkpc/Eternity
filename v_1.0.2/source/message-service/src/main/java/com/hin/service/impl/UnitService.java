/**
 * 
 */
package com.hin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.ConceptClass;
import com.hin.domain.Unit;
import com.hin.service.IUnitService;

/**
 * @author krishna.lr and vinaykumar.gk
 * 
 */
@Service(value = "unitService")
public class UnitService extends BaseService<Unit> implements IUnitService {

	@Autowired
	private IBaseRepository<Unit> baseRepository;

	public Unit findById(Unit unit) throws Exception {
		return findById(unit.getId(), Unit.class);
	}

	public List<Unit> getUnits() {
		List<Unit> units = findAll(Unit.class);
		if (units == null) {
			return new ArrayList<Unit>();
		}
		return units;

	}

	@Override
	public List<Unit> findAllUnit() throws Exception {

		return baseRepository.findAll(Unit.class);
	}

}
