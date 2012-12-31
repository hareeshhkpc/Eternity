
package com.hin.service.unittest;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import junit.framework.TestCase;

import org.junit.Test;


/**
 * @author Administrator
 *
 */
public class DateRangeUnitTest extends TestCase{

	@Test
	public void testMonthsInYear(){
		int year = 2011;
		
		List<String> dayList = getDateList(-1, year);
		for(String day : dayList){
			System.out.println("Day: " + day);
		}
	}
	
	@Test
	public void testDaysInMonth(){
		int year = 2011;
		int month = 0; // JAN
		List<String> dayList = getDateList(month, year);
		for(String day : dayList){
			System.out.println("Day: " + day);
		}
	}
	
	private List<String> getDateList(int month, int year){
		List<String> list = new ArrayList<String>();
		
		if(month > -1){
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, year);
			c.set(Calendar.MONTH, month);
			
			int days = c.getActualMaximum(Calendar.DAY_OF_MONTH);
			System.out.println("days: " + days);
			SimpleDateFormat sdf = new SimpleDateFormat("ddMMyyyy");
			
			for(int day = 1; day <= days; day++){
				c.set(Calendar.DAY_OF_MONTH, day);
				Date d = c.getTime();
				String rowKey = sdf.format(d);
				list.add(rowKey);
			}
		}
		else {
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, year);
			c.set(Calendar.MONTH, month);
			SimpleDateFormat sdf = new SimpleDateFormat("MMyyyy");
			for(int m = 0; m < 12; m++){
				c.set(Calendar.MONTH, m);
				Date d = c.getTime();
				String rowKey = sdf.format(d);
				list.add(rowKey);
			}
		}
		
		return list;
	}
	
		
	public void testRetrieveDate(){
		Calendar c = Calendar.getInstance();
		String rowKey="";
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		Date creationDate = null;
	
		try {
			c.setTime(format.parse("20120719140010"));
			creationDate = c.getTime();
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		int year = c.get(Calendar.YEAR);
		int month = c.get(Calendar.MONTH) + 1;
		int day = c.get(Calendar.DAY_OF_MONTH);
		
		DecimalFormat myFormatter = new DecimalFormat("00");
		String monthStr = myFormatter.format(month);
		
		String dayStr = myFormatter.format(day);
		
		if(creationDate == null){
			System.out.println("No creation time is given, skipping updating statistics.");
			return;
		}
		else{
			if(day > 0){
				rowKey = (dayStr).concat(monthStr).concat(Integer.toString(year));
				System.out.println("Date: " + rowKey);
			}
			if(month > 0){
				rowKey = monthStr.concat(Integer.toString(year));
				System.out.println("Month: " + rowKey);
			}
			if(year > 0){
				rowKey = Integer.toString(year);
				System.out.println("Year: " + rowKey);
			}
		}
	}
	
	@Test
	public void testDateFormat(){
		Calendar c = Calendar.getInstance();
		String rowKey="";
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
		Date creationDate = null;
	
		try {
			c.setTime(format.parse("20120719140010"));
			creationDate = c.getTime();
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			rowKey = dateFormat.format(creationDate);
			System.out.println("here: " + rowKey);
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
	}
	
}
