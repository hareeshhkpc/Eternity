/**
 * 
 */
package com.hin.hl7messaging.utils;

import java.util.Date;

/**
 * @author sreekumar.s
 * 
 */
public class CalendarVO {

	private String id;
	private String title;
	private Date start;// '2012-01-18 10:54',
	boolean allDay = false;// : false
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	/**
	 * @param id
	 * @param title
	 * @param start
	 * @param allDay
	 */
	public CalendarVO(String id, String name, String title, Date start,
			boolean allDay) {
		super();
		this.id = id;
		this.title = title;
		this.start = start;
		this.allDay = allDay;
		this.name = name;
	}

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @param title
	 *            the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}

	/**
	 * @return the start
	 */
	public Date getStart() {
		return start;
	}

	/**
	 * @param start
	 *            the start to set
	 */
	public void setStart(Date start) {
		this.start = start;
	}

	/**
	 * @return the allDay
	 */
	public boolean isAllDay() {
		return allDay;
	}

	/**
	 * @param allDay
	 *            the allDay to set
	 */
	public void setAllDay(boolean allDay) {
		this.allDay = allDay;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "CalendarVO [id=" + id + ", title=" + title + ", start=" + start
				+ ", allDay=" + allDay + "]";
	}

}
