/**
 * 
 */
package com.hin.service;

import java.util.List;
import com.hin.domain.Unit;

/**
 * @author krishna.lr and vinaykumar.gk
 * 
 */
public interface IUnitService extends IBaseService<Unit> {

	public Unit findById(Unit unit) throws Exception;

	public List<Unit> getUnits();

	public List<Unit> findAllUnit() throws Exception;

}
