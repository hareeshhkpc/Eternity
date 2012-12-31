/**
 * 
 */
package com.hin.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.User;
import com.hin.service.IUserService;

/**
 * @author sreekumar.s
 * 
 */
@Service(value = "userService")
public class UserService implements IUserService {

	@Autowired
	private IBaseRepository<User> baseRepository;
	
	

	@Override
	public User findUserById(Object id) {
		return (User) baseRepository.findById(id, User.class);
	}

	@Override
	public User findUserByProperty(String key, Object value) {
		return (User) baseRepository.findByProperty(key, value, User.class);
	}

	@Override
	public User save(User user) throws Exception {
		return baseRepository.save(user);
	}
}
