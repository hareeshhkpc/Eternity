/**
 * 
 */
package com.hin.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.User;
import com.hin.service.IRegistrationService;

/**
 * @author sreekumar.s
 * 
 */
@Service(value = "registrationService")
public class RegistrationService implements IRegistrationService {

	@Autowired
	private IBaseRepository<User> baseRepository;

	@Override
	public void register(User user) throws Exception {
		baseRepository.save(user);
	}

}
