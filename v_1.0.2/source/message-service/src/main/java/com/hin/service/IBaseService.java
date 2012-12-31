/**
 * 
 */
package com.hin.service;

import java.util.List;

/**
 * @author sreekumar.s
 * 
 */
public interface IBaseService<T> {

	public T save(T t) throws Exception;

	public void update(T t);

	public void delete(T t);

	public List<T> findAll(Class<T> clazz);

	public T findById(Object id, Class<T> clazz);

	public T findByName(String name, Class<T> clazz);

	public T findByProperty(String key, Object value, Class<T> clazz);

	public List<T> findAllByProperty(String key, Object value, Class<T> clazz);

	public List<T> findByDualProperty(String key1, Object value1, String key2,
			Object value2, Class<T> clazz);

}
