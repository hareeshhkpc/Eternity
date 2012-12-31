package com.hin.hl7messaging.utils;


public class TimeLineVO {
	private String start_date;
	private String end_date;
	private String text;// Event name
	private String section_id;
	
	
	public String getStart_date() {
		return start_date;
	}
	public void setStart_date(String start_date) {
		this.start_date = start_date;
	}
	public String getEnd_date() {
		return end_date;
	}
	public void setEnd_date(String end_date) {
		this.end_date = end_date;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getSection_id() {
		return section_id;
	}
	public void setSection_id(String section_id) {
		this.section_id = section_id;
	}
	@Override
	public String toString() {
		return "TimeLineVO [start_date=" + start_date + ", end_date="
				+ end_date + ", text=" + text + ", section_id=" + section_id
				+ "]";
	}
	

}
