/**
 * 
 */
package com.hin.domain.index;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.MappedSuperclass;

/**
 * @author Administrator
 * 
 */
@MappedSuperclass
public class IndexBase {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Integer day;
	private Integer month;
	private Integer year;
	private String program;
	private Integer count;
	private String status;
	private String facility;
	
	@Lob
	private char[] messageIds;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getDay() {
		return day;
	}

	public void setDay(Integer day) {
		this.day = day;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	/**
	 * @return the messageIds
	 */
	public char[] getMessageIds() {
		return messageIds;
	}

	/**
	 * @param messageIds the messageIds to set
	 */
	public void setMessageIds(char[] messageIds) {
		this.messageIds = messageIds;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "IndexBase [id=" + id + ", day=" + day + ", month=" + month
				+ ", year=" + year + "]";
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
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
