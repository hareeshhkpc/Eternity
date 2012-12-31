/**
 * 
 */
package com.hin.domain.vo;

/**
 * @author madhu.murmu
 *
 */
public class PatientVO {
	
	private Long id;
	private String mrn;
	private String firstName;
	private String middleName;
	private String lastName;
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
	 * @return the mrn
	 */
	public String getMrn() {
		return mrn;
	}
	/**
	 * @param mrn the mrn to set
	 */
	public void setMrn(String mrn) {
		this.mrn = mrn;
	}
	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}
	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	/**
	 * @return the middleName
	 */
	public String getMiddleName() {
		return middleName;
	}
	/**
	 * @param middleName the middleName to set
	 */
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}
	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

}
