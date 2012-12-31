package com.hin.service.integrationtest;

import java.util.Date;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.User;
import com.hin.domain.core.BaseDomain;
import com.hin.service.IBaseService;

@ContextConfiguration(locations = {
			"classpath:spring/applicationContext-core-test.xml", 
			"classpath:spring/mongodb-test.xml"})
public class BaseServiceTest extends  AbstractJUnit4SpringContextTests {
	
	@Autowired
	IBaseRepository<BaseDomain> baseRepository;
	
	@Autowired
	IBaseService<BaseDomain> baseService;
	
	@Before
	public void setUpTest(){
		
	}
	
	@After
	public void cleanUp(){
		
	}
	
	@Test
	public void testInit(){
		System.out.println(baseRepository);
	}
	
	@Test
	public void testBaseService(){
		BaseDomain bd = new BaseDomain();
		User u = new User();
		u.setName("Intel");
		u.setVersion(1);
		u.setCreatedDate(new Date());
		
		bd.setCreatedBy(u);
		bd.setCreatedDate(new Date());
		bd.setVersion(1);
		
		try {
			baseService.save(u);
			System.out.println(u.getId());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<BaseDomain> list = baseService.findAll(BaseDomain.class);
		System.out.println("Number of BaseDomain objects: " + list.size());
	}
	
	@Test
	public void testSaveAndRetrieve(){
		BaseDomain bd = new BaseDomain();
		User u = new User();
		u.setName("abdul");
		u.setVersion(1);
		u.setCreatedDate(new Date());
		
		bd.setCreatedBy(u);
		bd.setCreatedDate(new Date());
		bd.setVersion(1);
		
		try {
			baseRepository.save(bd);
			System.out.println(bd.getId());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		List<BaseDomain> list = baseRepository.findAll(BaseDomain.class);
		System.out.println("Number of BaseDomain objects: " + list.size());
	}
	
	@Test
	public void listRecords(){
		List<BaseDomain> list = baseRepository.findAll(BaseDomain.class);
		System.out.println("Number of BaseDomain objects: " + list.size());
	}
}
