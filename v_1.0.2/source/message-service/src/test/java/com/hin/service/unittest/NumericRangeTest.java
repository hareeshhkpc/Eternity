/**
 * 
 */
package com.hin.service.unittest;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.NumericRange;
import com.hin.domain.Unit;
import com.hin.domain.core.BaseDomain;
import com.hin.service.IBaseService;
import com.hin.service.INumericRangeService;

/**
 * @author krishna.lr
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core.xml", 
		"classpath:spring/mongodb.xml"})
public class NumericRangeTest extends AbstractJUnit4SpringContextTests{
	
	
	@Autowired
	INumericRangeService numericRangeService;
	
	@Test
	public void testNumericRange()
	{
		BaseDomain baseDomain =new BaseDomain();
		NumericRange numericRange =new NumericRange();
		Unit unit=new Unit();
		unit.setAbbreviation("Blood UNIT");
		numericRange.setUnit(unit);
		numericRange.setAbsoluteHigh(52);
		numericRange.setAbsoluteLow(100);
		numericRange.setCriticalHigh(39);
		numericRange.setCriticalLow(15);
		numericRange.setNormalHigh(24);
		numericRange.setNormalLow(22);
		try {
			numericRangeService.saveNumericRange(numericRange);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e);
			System.out.println("hello");
		}
		
	}

}
