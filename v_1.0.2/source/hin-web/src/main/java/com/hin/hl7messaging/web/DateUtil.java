/**
 * 
 */
package com.hin.hl7messaging.web;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.apache.log4j.Logger;

/**
 * @author kumaran.d
 * 
 * Utility Class used to manipulate 
 *
 */
public class DateUtil {
	
	private static final int INVERSESIGN = -1;
	public static final int MORNING_SESSION = 0;
	public static final int AFTERNOON_SESSION = 1;
	private static Logger logger = Logger.getLogger(DateUtil.class.getName());
	
	public static final String FORMAT_AM_PM = "hh:mm aaa"; // with AM PM 
	public static final String FORMAT_24_HR = "HH:mm";
	public static final String FORMAT_DATE1 = "dd/MM/yyyy"; 
	public static final String FORMAT_DATE2 = "dd-mmm-yyyy";
	
	
	public static Date getDate(Date date, String format) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		try {
			return dateFormat.parse(dateFormat.format(date));
		} catch (ParseException e) {
			logger.error("An error occur in formatting date: "+e.getMessage());
		}
		return null;
	}
	
	public static Timestamp getTimeStamp(Date date, int daySession) {
		if (date != null && daySession > 1 && daySession < 0) {
			throw new IllegalArgumentException(
					"Date and Days session are not valid");
		}
		GregorianCalendar gc = new GregorianCalendar();
		gc.setTime(date);
		if (daySession == MORNING_SESSION) {
			gc.set(Calendar.HOUR_OF_DAY, 0);
			gc.set(Calendar.MINUTE, 0);
			gc.set(Calendar.SECOND, 0);
			gc.set(Calendar.MILLISECOND, 0);
		} else if (daySession == AFTERNOON_SESSION) {
			gc.set(Calendar.HOUR_OF_DAY, 23);
			gc.set(Calendar.MINUTE, 59);
			gc.set(Calendar.SECOND, 59);
			gc.set(Calendar.MILLISECOND, 0);
		}
		return new Timestamp(gc.getTimeInMillis());
	}
	
	public static Calendar getCalendarObj(Date javaUtilDate) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(javaUtilDate);					
		return calendar;
	}

	public static int getDayOfMonth(Calendar calendar) {
		return calendar.get(Calendar.DAY_OF_MONTH);
	}

	public static int getMonth(Calendar calendar) {
		return calendar.get(Calendar.MONTH);
	}
	
	public static int getYear(Calendar calendar) {
		return calendar.get(Calendar.YEAR);
	}
	
	public static void modifyCalendarAttributes(final Calendar calendar, int dayofMonth, int month, int year) {
		if ( dayofMonth > 0 && dayofMonth < 32 && month > 0 && month < 13 && year  > 0) {
			calendar.set(Calendar.DAY_OF_MONTH, dayofMonth);
			calendar.set(Calendar.MONTH,month);
			calendar.set(Calendar.YEAR, year);
		}
	}
	
	public static void modifyCalendarAttributes(final Calendar calendar, int dayofMonth, int month) {
		if ( dayofMonth > 0 && dayofMonth < 32 && month > 0 && month < 13 ) {
			calendar.set(Calendar.DAY_OF_MONTH, dayofMonth);
			calendar.set(Calendar.MONTH,month);
		}
	}
	
	public static void modifyCalendarAttributes(Calendar calendar, int dayofMonth) {
		if ( dayofMonth > 0 && dayofMonth < 32 ) {
			calendar.set(Calendar.DAY_OF_MONTH, dayofMonth);
		}
	}
	
	/**
	 * Returns the <code>date</code> incremented by the <code>value</code>
	 * @param passedDate <code>Date</code> which needs to be incremented
	 * @param value <code>Days</code> to be incremented
	 * @return
	 */
	public static Date getDateAfterSpecifiedDays(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.DATE,value);
		return calendar.getTime();
	}
	
	public static Date getDateAfterSpecifiedYear(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.YEAR,value);
		return calendar.getTime();
	}
	
	public static Date getDateBeforeSpecifiedYear(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.YEAR,inverseSign(value));
		return calendar.getTime();
	}
	
	
	public static Date getDateAfterSpecifiedMonth(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.MONTH,value);
		return calendar.getTime();
	}
	
	public static Date getDateBeforeSpecifiedMonth(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.MONTH,inverseSign(value));
		return calendar.getTime();
	}
	
	/**
	 * Returns the <code>date</code> decremented by the <code>value</code>
	 * @param passedDate <code>Date</code> which needs to be decremented
	 * @param value <code>Days</code> to be decremented
	 * @return
	 */
	public static Date getDateBeforeSpecifiedDays(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.DATE,inverseSign(value));
		return calendar.getTime();
	}

	/**
	 * Returns the <code>date</code> incremented by the <code>value</code>
	 * @param passedDate <code>Date</code> which needs to be incremented
	 * @param value <code>Hour</code> to be incremented
	 * @return
	 */
	public static Date getDateAfterSpecifiedHour(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.HOUR,value);
		return calendar.getTime();
	}
	
	/**
	 * Returns the <code>date</code> decremented by the <code>value</code> 
	 * @param passedDate <code>Date</code> which needs to be decremented
	 * @param value <code>Hour</code> to be decremented
	 * @return
	 */
	public static Date getDateBeforeSpecifiedHour(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.HOUR,inverseSign(value));
		return calendar.getTime();
	}
	
	/**
	 * Returns the <code>date</code> incremented by the <code>value</code>
	 * @param passedDate <code>Date</code> which needs to be incremented
	 * @param value <code>Seconds</code> to be incremented
	 * @return
	 */
	public static Date getDateAfterSpecifiedMinute(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.MINUTE,value);
		return calendar.getTime();
	}
	
	/**
	 * Returns the <code>date</code> decremented by the <code>value</code> for the <code>dateField</code> passed
	 * @param passedDate <code>Date</code> which needs to be decremented
	 * @param value <code>Seconds</code> to be decremented
	 * @return
	 */
	public static Date getDateBeforeSpecifiedMinute(Date passedDate, int value) {
		Calendar calendar = getCalendarObj(passedDate);
		calendar.add(Calendar.MINUTE,inverseSign(value));
		return calendar.getTime();
	}
	
	public static Timestamp getCurrentTimeStamp() {
		return new Timestamp(System.currentTimeMillis());
	}
	
	public static Date getCurrentDate() {
		return new Date(System.currentTimeMillis());
	}
	
	public static boolean isBeforeCurrentDate(Date date){
		Date current = getTimeStamp(new Date(), MORNING_SESSION);
		if(date.before(current))
			return true;
		return false;
	}
	
	public static boolean isAfterCurrentDate(Date date){
		Date current = getTimeStamp(new Date(), AFTERNOON_SESSION);
		if(date.after(current))
			return true;
		return false;
	}
	
	public static long getDaysDifference(Date fromDate, Date toDate) {
		long diffrence = toDate.getTime() - fromDate.getTime();
		return  ( diffrence / (24 * 60 * 60 * 1000) );
	}
	
	public static String DaysDifference(Date fromDate, Date toDate) {
		long diffrence = toDate.getTime() - fromDate.getTime();
		int days = 0;
		int hours = 0;
		int minutes = 0;
		String result = "";
		if (diffrence > 86400000) {
			days = Long.valueOf(diffrence / 86400000).intValue();
			result = days + " days ";
		}
		if (days > 0) {
			hours = Long.valueOf((diffrence % 86400000) / 3600000).intValue();
		} else {
			hours = Long.valueOf(diffrence / 3600000).intValue();
		}
		if (hours > 0) {
			result += hours + " hours ";
		}
		if (days > 0 && hours > 0) {
			minutes = Long.valueOf((diffrence % (86400000 * 3600000)) / 60000)
					.intValue();
		} else if (hours > 0) {
			minutes = Long.valueOf((diffrence % 3600000) / 60000).intValue();
		} else {
			minutes = Long.valueOf(diffrence / 60000).intValue();
		}
		if (minutes > 0) {
			result += minutes + " minutes";
		}
		return result;
	}

	public static String getFormatedDated(Date date, String pattern) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(pattern);
		return dateFormat.format(date);
	}
	
	public static Date getFormatedDateFromString(String date) {
		try {
			DateFormat df = new SimpleDateFormat("dd-MM-yy");
			return df.parse(date);
		} catch (Exception excep) {
			logger.error("Error in formatting date from String: "+excep.getMessage());
		}
		return null;
	}
	
	/*
	 * formatter = new SimpleDateFormat("hh:mm:ss a");
	 * String s = formatter.format(date);    // 01:12:53 AM
	 * 
	 * formatter = new SimpleDateFormat("HH.mm.ss");
	 * s = formatter.format(date); // 14.36.33
	 * 
	 **/
	public static String getTimeAMPM(Date date, String pattern) {
		SimpleDateFormat timeFormat = new SimpleDateFormat("hh:mm:ss a");
		return timeFormat.format(date);
	}
	
	public static final int TIME_FORMAT_24 = 1;
	public static final int TIME_FORMAT_12 = 2;
	
	public static String getTime(Date date, int format) {
		SimpleDateFormat timeFormat = null; 
		if ( format == 1) 
			timeFormat = new SimpleDateFormat("HH:mm:ss");
		else
			timeFormat = new SimpleDateFormat("hh:mm:ss a");
		
		return timeFormat.format(date);
	}
	
	
	private static int inverseSign(int value) {
		return value * INVERSESIGN;
	}
	
	
	public static Date getCalendarDayDueDate(Date srcDate, Integer calDay) {
		Date nextSchDate = null;
		Calendar cal = getCalendarObj(getCurrentDate());
		if(cal.getTime().getDate() >= calDay){
			cal.add(Calendar.DAY_OF_MONTH, +30);
		}
		cal.set(Calendar.DATE, calDay);
		nextSchDate = cal.getTime();
		return nextSchDate;
	}

	public static Date getFrequencyDueDate(Date srcDate, Long days) {
		Date nextSchDate = null;
		Calendar cal = getCalendarObj(srcDate);
		cal.add(Calendar.DAY_OF_MONTH, +days.intValue());
		nextSchDate = cal.getTime();
		return nextSchDate;
	}
	
	public static Date getCalendarWeekDueDate(Date srcDate, Integer calWeek) {
		Date nextSchDate = null;
		Calendar cal = getCalendarObj(srcDate);
		int schCurrentWeek = cal.get(Calendar.WEEK_OF_MONTH);
		int schWeekDay = cal.get(Calendar.DAY_OF_WEEK);
		if(schWeekDay-calWeek >= 0){
			cal.set(Calendar.WEEK_OF_MONTH, schCurrentWeek+1);
		}
		cal.set(Calendar.DAY_OF_WEEK,calWeek);
		nextSchDate =cal.getTime();
		return nextSchDate;
	}
	
	public static Date getCustomDueDate(Date srcDate,Long cusDays){
		Date nextSchDate = null;
		Calendar cal = getCalendarObj(srcDate);
		cal.add(Calendar.DAY_OF_MONTH, +cusDays.intValue());
		nextSchDate = cal.getTime();  
		return nextSchDate;
	}
	
	public static boolean checkTimeInbetween(final Date checkDate, final int startTime, final int endTime) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(checkDate);
		calendar.set(Calendar.HOUR_OF_DAY, startTime);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		Calendar calendar1 = Calendar.getInstance();
		calendar1.setTime(checkDate);
		calendar1.set(Calendar.HOUR_OF_DAY, endTime);
		calendar1.set(Calendar.MINUTE, 0);
		calendar1.set(Calendar.SECOND, 0);
		calendar1.set(Calendar.MILLISECOND, 0);

		Calendar calendar2 = Calendar.getInstance();
		calendar2.setTime(checkDate);

		if (calendar2.after(calendar) && calendar2.before(calendar1)) {
			return true;
		} else
			return false;
	}

	// Check the Two Dates is of same Date with out Time
	public static boolean isSameDate(Date date, Date anotherDate) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);

		Calendar anotherCalendar = Calendar.getInstance();
		anotherCalendar.setTime(anotherDate);
		anotherCalendar.set(Calendar.HOUR_OF_DAY, 0);
		anotherCalendar.set(Calendar.MINUTE, 0);
		anotherCalendar.set(Calendar.SECOND, 0);
		anotherCalendar.set(Calendar.MILLISECOND, 0);
		return calendar.compareTo(anotherCalendar) == 0;
	}

	public static boolean checkTimeBetween(Date checkTime, Date FromDate, Date toDate) {
		return (checkTime.after(FromDate) && checkTime.before(toDate));
	}
	
	public String format(Date date, SimpleDateFormat dateFormat) {
		if (date != null) {
			return dateFormat.format(date);
		}
		return "";
	}
	
	/*
	 * 
	// Made as Singleton Class
	private DateUtil() {
		if ( dateUtil == null )
			throw new IllegalStateException("Singleton instance already created.");  
	}
	
	// To Avoid creating Instance by Reflection.
	//	static {
	//		SecurityManager mgr = new SecurityManager();  
	//		System.setSecurityManager(mgr);  
	//	}
	
	private static final DateUtil dateUtil = new DateUtil();
	
	public static synchronized DateUtil getInstance() {
		//if(dateUtil == null ) 
			//dateUtil = new DateUtil();
		return dateUtil;
	}

	@Override
	protected Object clone() throws CloneNotSupportedException {
		throw new CloneNotSupportedException("Singleton Class - Clone Not Supported ");
	}
	
	// This will fix the de-serialization issue  
	private Object readResolve() {  
		// Return the available instance instead.
		return dateUtil;
	}  
	
	 */
	
	/*
	 *  This method is used to get days difference b/w two dates with out timestamp 
	 */
	public static long getDaysDifferenceWOTime(Date fromDate, Date toDate) {
		Calendar fromDateCal=Calendar.getInstance();
		fromDateCal.setTime(fromDate);
		fromDateCal.set(Calendar.HOUR,0);
		fromDateCal.set(Calendar.MINUTE,0);
		fromDateCal.set(Calendar.SECOND,0);
		Calendar toDateCal=Calendar.getInstance();
		toDateCal.setTime(toDate);
		toDateCal.set(Calendar.HOUR,0);
		toDateCal.set(Calendar.MINUTE,0);
		toDateCal.set(Calendar.SECOND,0);
		long diffrence = toDateCal.getTimeInMillis() - fromDateCal.getTimeInMillis();
		return  ( diffrence / (24 * 60 * 60 * 1000) );
	}
	
}
