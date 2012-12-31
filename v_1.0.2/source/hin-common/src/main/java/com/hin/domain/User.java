/**
 * 
 */
package com.hin.domain;

import java.util.Date;

import com.hin.domain.core.BaseDomain;

/**
 * @author sreekumar.s
 * 
 */
public class User extends BaseDomain {

	private String name;
	private int age;
	private String place;
	private boolean active = true;
	private Date dob = new Date();

	public User() {

	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getPlace() {
		return place;
	}

	public void setPlace(String place) {
		this.place = place;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
