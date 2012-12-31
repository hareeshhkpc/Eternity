package com.hin.hl7messaging.vo;

import java.util.List;

public class Statistics {

	private String name;
	private List<Integer> data;

	public List<Integer> getData() {
		return data;
	}

	public void setData(List<Integer> data) {
		this.data = data;
	}

	public Statistics(String name, List<Integer> data) {
		this.name = name;
		this.data = data;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	

}
