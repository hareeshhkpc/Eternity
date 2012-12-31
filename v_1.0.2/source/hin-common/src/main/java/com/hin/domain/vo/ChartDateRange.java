/**
 * 
 */
package com.hin.domain.vo;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author vinaykumar.gk
 * 
 */
public class ChartDateRange {
	long totalNoOfDayes = 0;
	private Date minDate;
	private Date maxDate;
	private List<Date> xAxisDateRanges=new ArrayList<Date>();
	private List<Double> plotValues=new ArrayList<Double>();

	public long getTotalNoOfDayes() {
		return totalNoOfDayes;
	}

	public void setTotalNoOfDayes(long totalNoOfDayes) {
		this.totalNoOfDayes = totalNoOfDayes;
	}

	public Date getMinDate() {
		return minDate;
	}

	public void setMinDate(Date minDate) {
		this.minDate = minDate;
	}

	public Date getMaxDate() {
		return maxDate;
	}

	public void setMaxDate(Date maxDate) {
		this.maxDate = maxDate;
	}

	public List<Date> getxAxisDateRanges() {
		return xAxisDateRanges;
	}

	public void setxAxisDateRanges(List<Date> xAxisDateRanges) {
		this.xAxisDateRanges = xAxisDateRanges;
	}

	public List<Double> getPlotValues() {
		return plotValues;
	}

	public void setPlotValues(List<Double> plotValues) {
		this.plotValues = plotValues;
	}

}
