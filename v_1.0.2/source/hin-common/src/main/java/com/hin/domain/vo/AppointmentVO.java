package com.hin.domain.vo;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * 
 * @author madhu.murmu
 *
 */
public class AppointmentVO {

	private Long id;
	private UserVO userVO;
	private PatientVO patientVO;
	private Date start;
	private Date end;
	private String startStr;
	private String endStr;
	
	public AppointmentVO(Long id,UserVO userVO,PatientVO patientVO,String startStr,String endStr) {
		super();
		this.id = id;
		this.userVO = userVO;
		this.patientVO = patientVO;
		this.startStr = startStr;
		this.endStr = endStr;
		
	}
	
	
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @return the userVO
	 */
	public UserVO getUserVO() {
		return userVO;
	}
	/**
	 * @param userVO the userVO to set
	 */
	public void setUserVO(UserVO userVO) {
		this.userVO = userVO;
	}
	/**
	 * @return the start
	 */
	public Date getStart() {
		if(start ==null){
			DateFormat formatter = null;
			try {
				formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				start = (Date)formatter.parse(startStr);
			} catch (Exception e) {
				e.printStackTrace();
			}			 
		}
		return start;
	}
	/**
	 * @param start the start to set
	 */
	public void setStart(Date start) {
		this.start = start;
	}
	/**
	 * @return the end
	 */
	public Date getEnd() {
		if(end ==null){
			DateFormat formatter = null;
			try {
				formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
				end = (Date)formatter.parse(endStr);
			} catch (Exception e) {
				e.printStackTrace();
			}			 
		}
		return end;
	}
	/**
	 * @param end the end to set
	 */
	public void setEnd(Date end) {
		this.end = end;
	}
	/**
	 * @return the patientVO
	 */
	public PatientVO getPatientVO() {
		return patientVO;
	}
	/**
	 * @param patientVO the patientVO to set
	 */
	public void setPatientVO(PatientVO patientVO) {
		this.patientVO = patientVO;
	}


	/**
	 * @return the startStr
	 */
	public String getStartStr() {
		return startStr;
	}


	/**
	 * @param startStr the startStr to set
	 */
	public void setStartStr(String startStr) {
		this.startStr = startStr;
	}


	/**
	 * @return the endStr
	 */
	public String getEndStr() {
		return endStr;
	}


	/**
	 * @param endStr the endStr to set
	 */
	public void setEndStr(String endStr) {
		this.endStr = endStr;
	}
}
