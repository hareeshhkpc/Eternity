/**
 * 
 */
package com.hin.service.integrationtest;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.User;
import com.hin.domain.utils.SearchCriteria;

/**
 * @author s.thamilarasi
 * 
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class SearchCriteriaTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	private IBaseRepository<User> baseRepository;
	
	@Test
	public void testSearchCriteria() {
		//createUser();
		List<SearchCriteria> searchList = new ArrayList<SearchCriteria>();
		List<User> userList=new ArrayList<User>();
		SearchCriteria sCriteria = new SearchCriteria();
		/*sCriteria.setProperty("age");
		sCriteria.setCondition(">=");
		sCriteria.setValue(new Integer(18));		
		searchList.add(sCriteria); */
		
		 sCriteria = new SearchCriteria();
			sCriteria.setProperty("age");
			sCriteria.setCondition("=");
			sCriteria.setValue(new Integer(24));		
			searchList.add(sCriteria);
		
		sCriteria = new SearchCriteria(); 
		sCriteria.setProperty("place");
		sCriteria.setCondition("=");
		sCriteria.setValue("^c");
		searchList.add(sCriteria);
		
		/*sCriteria = new SearchCriteria();
		sCriteria.setProperty("name");
		sCriteria.setCondition("=");
		sCriteria.setValue("T");
		searchList.add(sCriteria);*/
		
		try {
		print(baseRepository.findByCriteria(searchList, User.class));
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	@SuppressWarnings("unused")
	private void createUser(){
		User user=new User();
		user.setAge(25);
		user.setName("Thamil");
		user.setPlace("Bangalore");
		try {
			baseRepository.save(user);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	private static void print(List<User> userList){
		if(userList.isEmpty() || userList.size()==0){
			System.out.println("No records ");
		}
		for(User user:userList){
			System.out.println("Id: "+user.getId()+" Name: "+user.getName()+" place: "+user.getPlace()+" age: "+user.getAge());
		}
		
	}
	

}
