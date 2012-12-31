package com.hin.service.integrationtest;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.EntityState;
import com.hin.service.impl.EntityStateService;



/**
 * @author Hari krishnan p.c
 *
 */

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class EntityServiceTest extends AbstractJUnit4SpringContextTests {
	
	@Autowired
	private EntityStateService entService;
	
	private EntityState setValues(String id, String state, String value){
		EntityState ett = new EntityState();
		ett.setEntityid(id);
		ett.setState(state);
		ett.setStatevalue(value);
		Calendar calendar = Calendar.getInstance();
		Date date = new Date();
		date.parse("2012/03/12 11:25:06");
		calendar.setTime(date);
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		ett.setTime(dateFormat.format(calendar.getTime()));
		return ett;
	}	
	
	@Test
	public void testChangeStatus(){
		EntityState obj;
		obj = setValues("12344", "active", "true");
		entService.changeState(obj);
		obj = setValues("332332", "checkedin", "true");
		entService.changeState(obj);
		obj = setValues("332332", "online", "false");
		entService.changeState(obj);
		obj = setValues("332432", "checkedin", "true");
		entService.changeState(obj);
	}
	
	@Test
	public void testgetStates(){
		EntityState e = new EntityState();
		e.setState("active");
		e.setStatevalue("true");
		List<EntityState> obj =  entService.getStates(e);
		System.out.println(obj);
		
	}
	
	@Test
	public void testgetSingleState() throws Exception{
		
		EntityState obj =  entService.getState("12344", "active");
		System.out.println(obj);
		
		
	}
}