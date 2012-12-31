/**
 * 
 */
package com.hin.service;

import com.hin.domain.User;

/**
 * @author sreekumar.s
 * 
 */
public interface IUserService {

	public User save(User user)throws Exception;

	public User findUserById(Object id);

	public User findUserByProperty(String key, Object value);

}
