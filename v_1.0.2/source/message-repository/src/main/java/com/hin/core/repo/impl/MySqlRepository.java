/**
 * 
 */
package com.hin.core.repo.impl;

import java.io.Serializable;
import java.util.List;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.utils.SearchCriteria;

/**
 * @author vineeth.ng
 *
 */
public class MySqlRepository<T> implements IBaseRepository<T>, Serializable {

	@Override
	public T save(T t) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void update(T t) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void delete(T t) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<T> findAll(Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public T findById(Object id, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public T findByProperty(String key, Object value, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<T> findAllByProperty(String key, Object value, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<T> findAllByName(String key, Object value, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<T> findByCriteria(List<SearchCriteria> searchCriteria,
			Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<T> findByDualProperty(String key1, Object value1, String key2,
			Object value2, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public T findByName(String name, Class<T> clazz) {
		// TODO Auto-generated method stub
		return null;
	}

}
