package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

import junit.framework.TestCase;

public class GSonTest extends TestCase {

	private Employee employee;
	private static String json;
	
	protected void setUp() throws Exception {
		super.setUp();
		employee = new Employee();
		employee.setName("Ram");
		employee.setAge(28);
		List<String> phones = new ArrayList<String>();
		phones.add("988776557");
		phones.add("977654488");
		employee.setPhones(phones);
	}

	public void testGson(){
		Gson gson = new Gson();
		json = gson.toJson(employee);
		System.out.println(json);
	}
	
	public void testJson(){
		Gson gson = new Gson();
		Employee emp = gson.fromJson(json, Employee.class);
		System.out.println(emp);
	}
}

class Employee {
	private String name;
	private int age;
	private List<String> phones;
	
	@Override
	public String toString() {
		return "Employee [age=" + age + ", name=" + name + ", phones=" + phones
				+ "]";
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public List<String> getPhones() {
		return phones;
	}
	public void setPhones(List<String> phones) {
		this.phones = phones;
	}
}