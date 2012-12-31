/**
 * 
 */
package com.hin.domain.vo;


public class StatisticsVO {

	private String month = "";
	private String year = "";
	private int[] dayArray;
	private int[] monthArray;
	private int dayCount = 0;
	private int monthCount = 0;
	private int yearCount = 0;
	private String type = "";
	private String program = "";
	private String status = "";
	private String facility = "";
	
	public int[] getDayArray() {
		return dayArray;
	}

	public void setDayArray(int[] dayArray) {
		this.dayArray = dayArray;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public int getDayCount() {
		return dayCount;
	}

	public void setDayCount(int dayCount) {
		this.dayCount = dayCount;
	}

	public int getMonthCount() {
		return monthCount;
	}

	public void setMonthCount(int monthCount) {
		this.monthCount = monthCount;
	}

	public int getYearCount() {
		return yearCount;
	}

	public void setYearCount(int yearCount) {
		this.yearCount = yearCount;
	}

	public int[] getMonthArray() {
		return monthArray;
	}

	public void setMonthArray(int[] monthArray) {
		this.monthArray = monthArray;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getFacility() {
		return facility;
	}

	public void setFacility(String facility) {
		this.facility = facility;
	}
}
