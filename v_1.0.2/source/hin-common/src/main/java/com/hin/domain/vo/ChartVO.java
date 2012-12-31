/**
 * 
 */
package com.hin.domain.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author vinaykumar.gk
 * 
 */
public class ChartVO {
	public String testType = "";
	public Date testDateTime = new Date();
	public String patientId;
	/* public Double testRange = 0.0; */
	List<HashMap<String, List<Double>>> plotList = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<Double>>> pathList = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<Double>>> scaleList = new ArrayList<HashMap<String, List<Double>>>();
	/* List<Double> scaleList = new ArrayList<Double>(); */
	List<Double> scalePixel = new ArrayList<Double>();
	List<HashMap<String, List<String>>> testData = new ArrayList<HashMap<String, List<String>>>();
	List<HashMap<String, List<Double>>> testRangeMap = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<HashMap<String, String>>>> titleArray = new ArrayList<HashMap<String, List<HashMap<String, String>>>>();
	List<HashMap<String, List<HashMap<String, List<String>>>>> chartSeries = new ArrayList<HashMap<String, List<HashMap<String, List<String>>>>>();
	List<String> svgArray = new ArrayList<String>();
	/* public Double testRangePixel = 0.0; */
	public Double ymin = 0.0;
	public Double ymax = 0.0;
	public List<ChartDateRange> ChartDateRange = new ArrayList<ChartDateRange>();

	/**
	 * @return the scalePixel
	 */
	public List<Double> getScalePixel() {
		return scalePixel;
	}

	/**
	 * @param scalePixel
	 *            the scalePixel to set
	 */
	public void setScalePixel(List<Double> scalePixel) {
		this.scalePixel = scalePixel;
	}

	/**
	 * @return the ymin
	 */
	public Double getYmin() {
		return ymin;
	}

	/**
	 * @param ymin
	 *            the ymin to set
	 */
	public void setYmin(Double ymin) {
		this.ymin = ymin;
	}

	/**
	 * @return the ymax
	 */
	public Double getYmax() {
		return ymax;
	}

	/**
	 * @param ymax
	 *            the ymax to set
	 */
	public void setYmax(Double ymax) {
		this.ymax = ymax;
	}

	/**
	 * @return the testRangePixel
	 */
	/*
	 * public Double getTestRangePixel() { return testRangePixel; }
	 *//**
	 * @param testRangePixel
	 *            the testRangePixel to set
	 */
	/*
	 * public void setTestRangePixel(Double testRangePixel) {
	 * this.testRangePixel = testRangePixel; }
	 */
	/**
	 * @return the testType
	 */
	public String getTestType() {
		return testType;
	}

	/**
	 * @param testType
	 *            the testType to set
	 */
	public void setTestType(String testType) {
		this.testType = testType;
	}

	/**
	 * @return the testDateTime
	 */
	public Date getTestDateTime() {
		return testDateTime;
	}

	/**
	 * @param testDateTime
	 *            the testDateTime to set
	 */
	public void setTestDateTime(Date testDateTime) {
		this.testDateTime = testDateTime;
	}

	/**
	 * @return the patientId
	 */
	public String getPatientId() {
		return patientId;
	}

	/**
	 * @param patientId
	 *            the patientId to set
	 */
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	/**
	 * @return the testRange
	 */
	/*
	 * public Double getTestRange() { return testRange; }
	 *//**
	 * @param testRange
	 *            the testRange to set
	 */
	/*
	 * public void setTestRange(Double testRange) { this.testRange = testRange;
	 * }
	 */

	/**
	 * @return the scaleList
	 */
	/*
	 * public List<Double> getScaleList() { return scaleList; }
	 *//**
	 * @param scaleList
	 *            the scaleList to set
	 */
	/*
	 * public void setScaleList(List<Double> scaleList) { this.scaleList =
	 * scaleList; }
	 */

	/**
	 * @return the plotList
	 */
	public List<HashMap<String, List<Double>>> getPlotList() {
		return plotList;
	}

	/**
	 * @param plotList
	 *            the plotList to set
	 */
	public void setPlotList(List<HashMap<String, List<Double>>> plotList) {
		this.plotList = plotList;
	}

	/**
	 * @return the pathList
	 */
	public List<HashMap<String, List<Double>>> getPathList() {
		return pathList;
	}

	/**
	 * @param pathList
	 *            the pathList to set
	 */
	public void setPathList(List<HashMap<String, List<Double>>> pathList) {
		this.pathList = pathList;
	}

	/**
	 * @return the testData
	 */
	public List<HashMap<String, List<String>>> getTestData() {
		return testData;
	}

	/**
	 * @param testData
	 *            the testData to set
	 */
	public void setTestData(List<HashMap<String, List<String>>> testData) {
		this.testData = testData;
	}

	/**
	 * @return the scaleList
	 */
	public List<HashMap<String, List<Double>>> getScaleList() {
		return scaleList;
	}

	/**
	 * @param scaleList
	 *            the scaleList to set
	 */
	public void setScaleList(List<HashMap<String, List<Double>>> scaleList) {
		this.scaleList = scaleList;
	}

	/**
	 * @return the testRangeMap
	 */
	public List<HashMap<String, List<Double>>> getTestRangeMap() {
		return testRangeMap;
	}

	/**
	 * @param testRangeMap
	 *            the testRangeMap to set
	 */
	public void setTestRangeMap(List<HashMap<String, List<Double>>> testRangeMap) {
		this.testRangeMap = testRangeMap;
	}

	public List<HashMap<String, List<HashMap<String, List<String>>>>> getChartSeries() {
		return chartSeries;
	}

	public void setChartSeries(
			List<HashMap<String, List<HashMap<String, List<String>>>>> chartSeries) {
		this.chartSeries = chartSeries;
	}

	public List<String> getSvgArray() {
		return svgArray;
	}

	public void setSvgArray(List<String> svgArray) {
		this.svgArray = svgArray;
	}

	public List<HashMap<String, List<HashMap<String, String>>>> getTitleArray() {
		return titleArray;
	}

	public void setTitleArray(
			List<HashMap<String, List<HashMap<String, String>>>> titleArray) {
		this.titleArray = titleArray;
	}

	public List<ChartDateRange> getChartDateRange() {
		return ChartDateRange;
	}

	public void setChartDateRange(List<ChartDateRange> ChartDateRange) {
		this.ChartDateRange = ChartDateRange;
	}

	

}
