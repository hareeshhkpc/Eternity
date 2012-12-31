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
import com.hin.domain.Unit;

/**
 * @author s.thamilarasi
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class UnitTest  extends AbstractJUnit4SpringContextTests {
	@Autowired
	private IBaseRepository<Unit> baseRepository;
	
	@Test
	public void testUnit(){
		List<Unit> unitList=new ArrayList<Unit>();
		unitList.addAll(baseRepository.findAllByProperty("symbol", "^m", Unit.class));
		//unitList.addAll(baseRepository.findAll(Unit.class));
		print(unitList);
	}
	
	private static void print(List<Unit> userList){
		if(userList.isEmpty() || userList.size()==0|| userList==null){
			System.out.println("No records ");
		}
		for(Unit user:userList){
			System.out.println(" Name: "+user.getName()+" desc : "+user.getDescription()+" symbol: "+user.getSymbol());
			
		}
		
	}

}
