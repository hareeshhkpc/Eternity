/**
 * 
 */
package com.hin.hl7messaging;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hin.domain.ObservationTest;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.domain.vo.ChartDateRange;
import com.hin.hl7messaging.api.IChartService;

/**
 * @author vinaykumar.gk
 * 
 */
@Service(value = "chartService")
public class ChartService implements IChartService {

	double pixelMapValue = 0.0;
	Double testRangePixel = 0.0;
	/* Double testRange = 0.0; */
	ChartVO chart = new ChartVO();
	List<HashMap<String, List<Double>>> plotListMap = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<Double>>> pathListMap = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<Double>>> scaleListMap = new ArrayList<HashMap<String, List<Double>>>();
	List<HashMap<String, List<Double>>> testRangeMap = new ArrayList<HashMap<String, List<Double>>>();
	List<ChartDateRange> chartDateRange = new ArrayList<ChartDateRange>();

	@Override
	public ChartVO pixelMap(ChartVO chartVO) {
		plotListMap.clear();
		pathListMap.clear();
		scaleListMap.clear();
		testRangeMap.clear();
		chartDateRange.clear();
		List<Double> tempList = new ArrayList<Double>();
		List<Double> defaultScaleList = new ArrayList<Double>();
		List<HashMap<String, List<String>>> listHashMaps = chartVO
				.getTestData();
		Iterator<HashMap<String, List<String>>> iterator = listHashMaps
				.iterator();
		HashMap<String, List<String>> hashMap = new HashMap<String, List<String>>();
		try {
			while (iterator.hasNext()) {
				tempList.clear();
				defaultScaleList.clear();
				hashMap = iterator.next();
				Iterator hashMapIterator = hashMap.entrySet().iterator();
				String key = "";
				List<String> list = new ArrayList<String>();
				List<Double> rangelist = new ArrayList<Double>();
				while (hashMapIterator.hasNext()) {
					Map.Entry hashMapEntry = (Map.Entry) hashMapIterator.next();
					key = (String) hashMapEntry.getKey();
					list = (List<String>) hashMapEntry.getValue();

					if (key.equals("data")) {
						for (String s : list) {
							tempList.add(Double.parseDouble(s));
						}
					}

					if (key.equals("range")) {
						for (String s : list) {
							rangelist.add(Double.parseDouble(s));
						}
					}
					if (key.equals("scale")) {
						for (String s : list) {
							defaultScaleList.add(Double.parseDouble(s));
						}
					}
					if (key.equals("xAxisData")) {
						List<String> xAxisDataList = new ArrayList<String>();
						for (String s : list) {
							xAxisDataList.add(s);
						}
						tempList = calculateXScaleValues(xAxisDataList,
								tempList);
						/* System.out.println("Xaxisdata" + tempList); */
					}
				}
				for (int index = 0; index < tempList.size(); index++) {
					if (tempList.get(index) == null) {
						tempList.set(index, 0.0);
					}
				}
				if (defaultScaleList.size() > 0
						&& (Collections.max(tempList) <= Collections
								.max(defaultScaleList))) {
					defaultScaleCalculation(roundDecimals(defaultScaleList),
							chartVO.getYmin(), chartVO.getYmax(), chartVO,
							rangelist);
				} else {
					scaleCalculation(roundDecimals(tempList),
							chartVO.getYmin(), chartVO.getYmax(), chartVO,
							rangelist);
				}

				pixelCalculation(roundDecimals(tempList), chartVO.getYmin(),
						chartVO.getYmax());

			}
		} catch (Exception e) {
			System.out.println(e);
			// TODO: handle exception
		}
		chart.setPlotList(plotListMap);
		chart.setPathList(pathListMap);
		chart.setTestData(listHashMaps);
		chart.setScaleList(scaleListMap);
		chart.setTestRangeMap(testRangeMap);
		chart.setChartDateRange(chartDateRange);
		return chart;
	}

	// Calculates pixel for Path,Plot and Scale values
	private void pixelCalculation(List<Double> chartData, Double yMin,
			Double yMax) {
		List<Double> plotList = new ArrayList<Double>();
		List<Double> pathList = new ArrayList<Double>();

		for (Double i : chartData) {
			plotList.add((yMax - (i * pixelMapValue)) + 2);
			pathList.add(yMax - (i * pixelMapValue));
		}

		HashMap<String, List<Double>> plotMap = new HashMap<String, List<Double>>();
		plotMap.put("data", plotList);
		plotListMap.add(plotMap);

		HashMap<String, List<Double>> pathMap = new HashMap<String, List<Double>>();
		pathMap.put("data", pathList);
		pathListMap.add(pathMap);

	}

	public void scaleCalculation(List<Double> chartData, Double yMin,
			Double yMax, ChartVO chartVO, List<Double> rangeList) {

		/*
		 * if (referenceRange > 600.0) { referenceRange = 1000.0; }
		 * chartData.add(referenceRange);
		 */

		Double maxNumber = 0.0;
		Object object = Collections.max(chartData);
		if (chartVO.getTestType().equalsIgnoreCase("Elastometer")) {
			maxNumber = 100.00;
		} else {
			maxNumber = (Double) object;
		}
		if (maxNumber <= 10) {
			scaleGeneration(2, 2, 1, chartData, yMin, yMax, false, chartVO,
					rangeList);// Numbers
			// below 10
		} else {
			scaleGeneration(4, 3, 10, chartData, yMin, yMax, true, chartVO,
					rangeList);// numbers
			// greater
			// than 10
		}
	}

	// Scale generation for decimal and integer values
	public void scaleGeneration(int ceilingValue, int subStringValue,
			int ceilingIncrementValue, List<Double> chartData, Double yMin,
			Double yMax, Boolean inputType, ChartVO chartVO,
			List<Double> testRange) {
		List<Double> scaleList = new ArrayList<Double>();
		List<Double> scalePixel = new ArrayList<Double>();
		Double doubleQuotient = 0.0;
		Double doubleCeiling = 0.0;
		Object object = Collections.max(chartData);
		Double maxDoubleNumber = (Double) object;
		String numb = object.toString();
		String onesPos = numb.substring(numb.length() - subStringValue,
				numb.length());
		if (chartVO.getTestType().equalsIgnoreCase("Elastometer")) {
			doubleCeiling = 100.00;
		} else {
			doubleCeiling = ((maxDoubleNumber - Double.parseDouble(onesPos)) + ceilingIncrementValue);
		}

		HashMap<String, List<Double>> scaleMap = new HashMap<String, List<Double>>();
		Boolean end = true;
		do {
			if (doubleCeiling % ceilingValue == 0) {
				scaleList.add(doubleQuotient);
				doubleQuotient = doubleCeiling / 4.0;
				for (int i = 1; i <= 4; i++) {

					scaleList.add(i * doubleQuotient);

				}
				end = !inputType;
			}
			doubleCeiling += ceilingIncrementValue;
		} while (doubleCeiling % ceilingValue == 0 && end);
		Double difference = yMax - yMin;
		pixelMapValue = difference / Collections.max(scaleList);
		for (Double i : scaleList) {
			scalePixel.add(yMax - (i * pixelMapValue));
		}

		/* testRangePixel = (yMax - (testRange * pixelMapValue)); */
		HashMap<String, List<Double>> rangeMap = new HashMap<String, List<Double>>();
		List<Double> rangeList = new ArrayList<Double>();
		for (Double range : testRange) {
			Double rangePixel = (yMax - (range * pixelMapValue));
			rangeList.add(rangePixel);
		}
		rangeList.add(testRangePixel);
		rangeMap.put("range", rangeList);
		testRangeMap.add(rangeMap);

		scaleMap.put("scaleList", scaleList);
		scaleListMap.add(scaleMap);
		chart.setScalePixel(scalePixel);

	}

	public List<Double> roundDecimals(List<Double> chartData) {
		List<Double> roundedDecimalList = new ArrayList<Double>();
		for (Double decimalValue : chartData) {
			roundedDecimalList.add(roundOneDecimal(decimalValue));
		}
		return roundedDecimalList;
	}

	double roundOneDecimal(double d) {
		DecimalFormat oneDecimal = new DecimalFormat("#.#");
		return Double.valueOf(oneDecimal.format(d));
	}

	private void defaultScaleCalculation(List<Double> roundDecimals,
			Double ymin, Double ymax, ChartVO chartVO, List<Double> testRange) {
		List<Double> scaleList = new ArrayList<Double>();
		List<Double> scalePixel = new ArrayList<Double>();
		HashMap<String, List<Double>> scaleMap = new HashMap<String, List<Double>>();
		Double doubleCeiling = 0.0;
		doubleCeiling = (Collections.max(roundDecimals) / 4);
		scaleList.add(0.0);
		for (int index = 1; index <= 4; index++) {
			scaleList.add(doubleCeiling * index);
		}
		Double difference = ymax - ymin;
		pixelMapValue = difference / Collections.max(scaleList);
		for (Double i : scaleList) {
			scalePixel.add(ymax - (i * pixelMapValue));
		}
		/* testRangePixel = (ymax - (testRange * pixelMapValue)); */
		HashMap<String, List<Double>> rangeMap = new HashMap<String, List<Double>>();
		List<Double> rangeList = new ArrayList<Double>();
		for (Double range : testRange) {
			Double rangePixel = (ymax - (range * pixelMapValue));
			rangeList.add(rangePixel);
		}
		rangeList.add(testRangePixel);
		rangeMap.put("range", rangeList);
		testRangeMap.add(rangeMap);

		scaleMap.put("scaleList", scaleList);
		scaleListMap.add(scaleMap);
		chart.setScalePixel(scalePixel);

	}

	public List<Double> calculateXScaleValues(List<String> list,
			List<Double> tempList) {
		ChartDateRange dateRange = new ChartDateRange();
		// dates for a perticular test
		List<Date> originalDates = new ArrayList<Date>();
		// date range from min date to max date
		List<Date> xAxisDateRanges = new ArrayList<Date>();
		// actual xScale valus
		List<Double> dataList = new ArrayList<Double>();
		Date minDate = new Date();
		Date maxDate = new Date();
		for (String dateString : list) {
			try {
				DateFormat formatter = new SimpleDateFormat("MMM dd,yy");
				originalDates.add(formatter.parse(dateString));
				/*
				 * long testDate = Long.parseLong(dateString); Date date = new
				 * Date(testDate); originalDates.add(date);
				 */

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		// calculates min and max date
		for (int index = 0; index < originalDates.size(); index++) {
			if (index == 0) {
				minDate = maxDate = originalDates.get(index);
			}
			if (originalDates.get(index).before(minDate))
				minDate = originalDates.get(index);
			if (originalDates.get(index).after(maxDate))
				maxDate = originalDates.get(index);
		}

		// decrementing 1 day from min date
		Calendar decreaseDays = Calendar.getInstance();
		decreaseDays.setTime(minDate);
		decreaseDays.add(Calendar.DATE, -1);
		minDate = decreaseDays.getTime();

		// incrementing 1 day from max date
		Calendar increaseDays = Calendar.getInstance();
		increaseDays.setTime(maxDate);
		increaseDays.add(Calendar.DATE, 1);
		maxDate = increaseDays.getTime();

		long t1 = maxDate.getTime(), t2 = minDate.getTime();
		long day = 1000 * 60 * 60 * 24;
		long days = (t1 - t2) / day;
		if (days < 10) {
			days = 10;
		}
		/* System.out.println("days=" + days); */
		Date newdate = minDate;
		xAxisDateRanges.add(minDate);
		/* System.out.println("MinDate" + minDate + "MaxDate" + maxDate); */
		for (int i = 0; i < days; i++) {
			Calendar c = Calendar.getInstance();
			c.setTime(newdate);
			c.add(Calendar.DATE, 1);
			newdate = c.getTime();
			xAxisDateRanges.add(newdate);

		}
		// dates from starting date to end date
		try {
			int var = 0;
			for (int i = 0; i < xAxisDateRanges.size(); i++) {
				Boolean status = false;
				for (int j = 0; j < originalDates.size(); j++) {
					if (originalDates.get(j).getTime() == xAxisDateRanges
							.get(i).getTime()) {
						if (tempList.get(var) != null && var <= tempList.size()) {
							status = true;
							dataList.add(tempList.get(j));
							var++;
						}
					}
				}
				if (!status) {
					dataList.add(null);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println("charts error" + e);
		}
		/* System.out.println("XAxisDateRanges"+xAxisDateRanges); */
		tempList.clear();
		tempList = dataList;
		dateRange.setMinDate(minDate);
		dateRange.setMaxDate(maxDate);
		dateRange.setTotalNoOfDayes(days);
		dateRange.setxAxisDateRanges(xAxisDateRanges);
		dateRange.getPlotValues().addAll(tempList);
		chartDateRange.add(dateRange);

		return tempList;
	}

	@Override
	public String createSvgDocument(ChartVO chartVO, ChartVO chart,
			List<HashMap<String, String>> titleMap, String seriesName) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<ObservationVO> getObservations(String patientId,
			List<ObservationTest> observationTests,String organizationId) {
		// TODO Auto-generated method stub
		return null;
	}

}
