/**
 * 
 */
package com.hin.service.impl;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import java.io.Serializable;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Status;
import com.hin.service.IBaseService;

/**
 * @author sreekumar.s
 * 
 */
@Service(value = "baseService")
public class BaseService<T> implements IBaseService<T>, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Autowired
	private IBaseRepository<T> baseRepository;

	@Override
	public T save(T t) throws Exception {
		return baseRepository.save(t);
	}

	@Override
	public void update(T t) {
		baseRepository.update(t);
	}

	@Override
	public void delete(T t) {
		baseRepository.delete(t);
	}

	@Override
	public List<T> findAll(Class<T> clazz) {
		return baseRepository.findAll(clazz);
	}

	@Override
	public T findById(Object id, Class<T> clazz) {
		return baseRepository.findById(id, clazz);
	}

	@Override
	public T findByName(String name, Class<T> clazz) {
		return baseRepository.findByName(name, clazz);
	}

	@Override
	public T findByProperty(String key, Object value, Class<T> clazz) {
		return baseRepository.findByProperty(key, value, clazz);
	}

	@Override
	public List<T> findAllByProperty(String key, Object value, Class<T> clazz) {
		return baseRepository.findAllByProperty(key, value, clazz);
	}

	@Override
	public List<T> findByDualProperty(String key1, Object value1, String key2,
			Object value2, Class<T> clazz) {
		return baseRepository.findByDualProperty(key1, value1, key2, value2,
				clazz);
	}
}
