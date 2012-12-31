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
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.lang.time.DateUtils;
import org.apache.log4j.Logger;
import org.junit.Test;
import org.springframework.test.context.ContextConfiguration;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.domain.vo.ChartDateRange;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author vinaykumar.gk
 * 
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml",
		"classpath:spring/mongodb-test.xml" })
public class SvgChartTest {

	int x = 0;
	int verticleValue = 0;
	int verticleXvalueSpace = 0;
	Double midPoint = 0.0;
	int referenceRangewidthValue = 600;
	String themeColor = "#56004e";
	String chartTestColor = "";
	String scaleColor = "#000000";

	private DateFormat chartDateTextFormat = new SimpleDateFormat(
			"dd MMM, yyyy");

	/*
	 * @Autowired IChartService chartService;
	 */

	@Test 
	public void findAllByName() {

		// 1351362600000=11, 2012-11-15 02:00:33.551

		// 1351449000000=33, 2012-11-15 02:00:33.551

		// 1352140200000=16, 2012-11-15 02:00:33.551

		// 1352917800000=74, 2012-11-15 02:00:33.411

		// 1351483801204=4, 2012-10-29 09:40:01.282
		Date minDate = new Date();
		Calendar addDays = Calendar.getInstance();
		addDays.clear();
		addDays.set(Calendar.MONTH, 9);
		addDays.set(Calendar.DATE, 5);
		addDays.set(Calendar.YEAR, 2012);
		// addDays.roll(Calendar.DATE, 1);
		minDate = addDays.getTime();
		System.out.println(addDays.getTimeInMillis());

		Date onlyDate = addDays.getTime();

		String fullDate = Long.toString(onlyDate.getTime());

		long testDate = Long.parseLong("1351483801204");
		Date date = new Date(testDate);
		System.out.println(date);

		System.out.println(onlyDate);
		

		ChartService chartService = new ChartService();
		ChartSvgService chartSvgService = new ChartSvgService();
		/*
		 * ObservationService observationsService = new ObservationService();
		 * String observ =
		 * "{'patientId':'e9fbb4fb-3eea-9765-43a8-40ba16bb4c1d','testName':'','testValue':0,'messageType':'','observationTests':[{'messageType':'POLB_MT004000HT01_CAC','testName':'CACCalciumScore'},{'messageType':'POLB_MT004000HT01_MCG','testName':'MCGScore'},{'messageType':'POLB_MT004000HT01_SphygmoCor','testName':'SphygmoCor_AorticPP'},{'messageType':'POLB_MT004000HT01_IMT','testName':'imtPercentile'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_CRP'},{'messageType':'POLB_MT004000HT01_PAI1','testName':''},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Testosterone'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Cholesterol'},{'messageType':'POLB_MT004000HT01_Biospace','testName':'biospace_BodyFat'},{'messageType':'POLB_MT004000HT01_FitnessTest','testName':'FitnessTest_Male_StrengthPushUps'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Glycosylated Haemoglobin'},{'messageType':'POLB_MT004000HT01_FitnessTest','testName':'FitnessTest_Male_BoneDensity'},{'messageType':'POLB_MT004000HT01_Thyroflex','testName':'Thyroflex_Thyroid-Sulfate'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Vitamin_B12'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Magnesium'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Dehydroepiandrosterone-Sulfate'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Estrogen'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_VitD3'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_PAI-1'},{'messageType':'POLB_MT004000HT01_BloodTest','testName':'bloodTest_Progesterone'},{'messageType':'POLB_MT004000HT01_Heartmath','testName':'heartMat_HighValue'},{'messageType':'POLB_MT004000HT01_ToxinePanel','testName':'toxine_Aluminum'},{'messageType':'POLB_MT004000HT01_ToxinePanel','testName':'toxine_Cadmium'},{'messageType':'POLB_MT004000HT01_ToxinePanel','testName':'toxine_Lead'},{'messageType':'POLB_MT004000HT01_Biospace','testName':'biospace_Weight'}],'observationValue':[]}"
		 * ; Gson gson1 = new GsonBuilder().create(); ObservationVO
		 * observationVO = gson1.fromJson(observ, ObservationVO.class);
		 * List<ObservationVO> observations = new ArrayList<ObservationVO>();
		 * observations = observationsService.getObservations(
		 * observationVO.getPatientId(), observationVO.getObservationTests());
		 * System.out.println("end");
		 */

		Gson gson = new GsonBuilder().create();
		String json = "{'testType':'Testosterone','patientId':'1234','testDate':'2012-10-25T18:42:15.817Z','testData':[{'data':[0],'color':['orange'],'title':['Weight'],'range':['0','40']}],'plotList':[],'pathList':[],'scaleList':[],'scalePixel':[],'titleArray':[{'chart1':[{'title':'Inflammation control','value':'3'}],'chart2':[{'title':'Nutrition and metabolism','value':'3'},{'title':'Toxin reduction','value':'3'}],'chart3':[{'title':'Exercise','value':'3'},{'title':'Genetics and aesthetics','value':'3'}],'chart4':[{'title':'Restoration of male hormones','value':'4'}],'chart5':[{'title':'Restoration of female hormones','value':'4'}],'chart6':[{'title':'Advanced supplementation','value':'3'},{'title':'Lifelong (mind-body) learning','value':'3'}]}],'testRangeMap':[],'ymin':70,'ymax':170,'chartSeries':[{'chart1':[{'data':['7','30',0,'4','8','17','21'],'color':['orange'],'title':['CAC'],'range':['0','9'],'xAxisData':['Dec 7, 2012 7:42:03 AM','Oct 11, 2012 9:52:43 AM','Oct 20, 2012 4:30:02 AM','Oct 20, 2012 7:37:21 AM','Oct 20, 2012 7:38:58 AM','Oct 22, 2012 2:19:04 PM','Oct 22, 2012 2:21:04 PM'],'scale':['0','150']},{'data':['6',0,'9','6','7','4'],'color':['#92d050'],'title':['MCG'],'xAxisData':['Oct 2, 2012 1:16:55 PM','Oct 20, 2012 4:29:59 AM','Oct 22, 2012 1:03:58 PM','Sep 14, 2012 1:05:50 PM','Sep 14, 2012 1:08:48 PM','Sep 14, 2012 1:09:37 PM'],'range':['0','1'],'scale':['0','10']},{'data':[0],'color':['#3b618e'],'title':['SphygmoCor'],'xAxisData':['Oct 20, 2012 4:30:01 AM'],'range':['60','80'],'scale':['0','120']},{'data':[0],'color':['#f37122'],'title':['IMT'],'xAxisData':['Oct 20, 2012 4:29:51 AM'],'range':['0','25'],'scale':['0','100']},{'data':[0],'color':['#8dc642'],'title':['CRP'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['0','1'],'scale':['0','10']},{'data':[0],'color':['#4881be'],'title':['PAI1'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['0','235'],'scale':['0','450']}],'chart2':[{'data':[0],'color':['orange'],'title':['% Body fat'],'xAxisData':['Oct 20, 2012 4:30:04 AM'],'range':['5','20'],'scale':['0','40']},{'data':[0],'color':['#92d050'],'title':['HbA1C'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['3','5'],'scale':['0','10']},{'data':[0],'color':['#3b618e'],'title':['LDL-Cholesterol'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['0','100'],'scale':['0','180']},{'data':[0],'color':['#f37122'],'title':['Aluminum'],'xAxisData':['Oct 20, 2012 4:30:05 AM'],'range':['0','35'],'scale':['0','200']},{'data':[0],'color':['#8dc642'],'title':['Lead'],'xAxisData':['Oct 20, 2012 4:30:05 AM'],'range':['0','2'],'scale':['0','20']},{'data':[0],'color':['#4881be'],'title':['Cadmium'],'xAxisData':['Oct 20, 2012 4:30:05 AM'],'range':['0','1'],'scale':['0','5']}],'chart3':[{'data':[0],'color':['orange'],'title':['Weight'],'xAxisData':['Oct 20, 2012 4:30:04 AM'],'range':['0','0.5']},{'data':[0],'color':['#92d050'],'title':['Strength'],'xAxisData':['Oct 20, 2012 4:30:07 AM'],'range':['0','12'],'scale':['0','30']},{'data':[0],'color':['#3b618e'],'title':['Bone density'],'xAxisData':['Oct 20, 2012 4:30:07 AM'],'range':['0','0.5']},{'data':[0],'color':['#3b618e'],'title':['Bone density'],'xAxisData':['Oct 20, 2012 4:30:07 AM'],'range':['0','0.5']},{'data':[0],'color':['#3b618e'],'title':['Bone density'],'xAxisData':['Oct 20, 2012 4:30:07 AM'],'range':['0','0.5']},{'data':[0],'color':['#3b618e'],'title':['Bone density'],'xAxisData':['Oct 20, 2012 4:30:07 AM'],'range':['0','0.5']}],'chart4':[{'data':[0],'color':['orange'],'title':['Testosterone'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['700','1100'],'scale':['0','1250']},{'data':[0],'color':['#92d050'],'title':['Estrogen'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['10','50'],'scale':['0','80']},{'data':[0],'color':['#3b618e'],'title':['DHEA'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['350','449'],'scale':['0','550']},{'data':[0],'color':['#f37122'],'title':['Thyroid'],'xAxisData':['Oct 20, 2012 4:29:57 AM'],'range':['0','100'],'scale':['0','200']}],'chart5':[{'data':[0],'color':['orange'],'title':['Testosterone'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['5','84'],'scale':['0','100']},{'data':[0],'color':['#92d050'],'title':['Estrogen'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['90','950'],'scale':['0','1250']},{'data':[0],'color':['#3b618e'],'title':['Progesterone'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['2','86'],'scale':['0','100']},{'data':[0],'color':['#f37122'],'title':['Thyroid'],'xAxisData':['Oct 20, 2012 4:29:57 AM'],'range':['0','100'],'scale':['0','200']}],'chart6':[{'data':[0],'color':['orange'],'title':['VitD3'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['75','100'],'scale':['0','200']},{'data':[0],'color':['#92d050'],'title':['Magnesium'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['2','8'],'scale':['0','8']},{'data':[0],'color':['#3b618e'],'title':['Vit B12'],'xAxisData':['Oct 20, 2012 4:30:09 AM'],'range':['900','1000'],'scale':['0','1300']}]}],'svgArray':[]}";
		ChartVO chartVO = gson.fromJson(json, ChartVO.class);

		List<HashMap<String, List<HashMap<String, List<String>>>>> chartsList = chartVO
				.getChartSeries();
		List<HashMap<String, List<HashMap<String, String>>>> titleList = chartVO
				.getTitleArray();
		Iterator<HashMap<String, List<HashMap<String, List<String>>>>> chartsIterator = chartsList
				.iterator();
		List<String> svgArray = new ArrayList<String>();
		while (chartsIterator.hasNext()) {
			HashMap<String, List<HashMap<String, List<String>>>> chartsMap = chartsIterator
					.next();
			Iterator<String> chartsMapkey = chartsMap.keySet().iterator();

			while (chartsMapkey.hasNext()) {
				ChartVO chart = new ChartVO();
				chart = chartVO;
				String key = chartsMapkey.next();
				List<HashMap<String, String>> titleMap = titleList.get(0).get(
						key);
				List<HashMap<String, List<String>>> chartsListMap = chartsMap
						.get(key);
				chart.setTestData(chartsListMap);
				String svgDocument;
				try {
					svgDocument = createSvgDocument(
							chartService.pixelMap(chart), chart, titleMap, key);
					svgArray.add(svgDocument);
					System.out.println(svgDocument);
				} catch (Exception e) {
					System.out.println("error" + e.getMessage());
					e.printStackTrace();
				}

			}
		}
		ChartVO chartSvg = new ChartVO();
		chartSvg.setSvgArray(svgArray);

		/*
		 * for (String chartVOs : chart.getCharts()) { ChartVO chartPixelMap =
		 * chartService.pixelMap(chartVOs); svgDocument =
		 * chartSvgService.createSvgDocument(chartPixelMap, chartVOs); }
		 */

	}

	public String createSvgDocument(ChartVO chart, ChartVO chartVO,
			List<HashMap<String, String>> titleMap, String seriesName) {
		x = 100;
		verticleValue = x;
		verticleXvalueSpace = 57;
		midPoint = ((x * 2.0) + verticleXvalueSpace) / 2.0;
		int index = 0;
		int transformValue = 0;
		boolean status = true;
		themeColor = "#56004e";
		scaleColor = "#000000";
		chart.setYmin(chartVO.getYmin());
		chart.setYmax(chartVO.getYmax());
		chart.setTitleArray(chartVO.getTitleArray());
		chart.setTestType(chartVO.getTestType());

		String stringData = "";
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = null;

		try {
			db = dbf.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Document document = db.newDocument();
		Element rootElement = createRootElement(document);
		Element g = document.createElement("g");

		List<HashMap<String, List<String>>> series = chart.getTestData();
		// seriesList contains pages of charts,each page contains six charts
		ListIterator<HashMap<String, List<String>>> seriesList = series
				.listIterator();
		List<HashMap<String, List<HashMap<String, String>>>> titleArrayMap = chart
				.getTitleArray();
		int top = 0;
		while (seriesList.hasNext()) {
			top++;
			themeColor = "#56004e";
			scaleColor = "#000000";
			HashMap<String, List<Double>> plotArray = chart.getPlotList().get(
					seriesList.nextIndex());
			HashMap<String, List<Double>> testRange = chart.getTestRangeMap()
					.get(seriesList.nextIndex());
			HashMap<String, List<Double>> pathArray = chart.getPathList().get(
					seriesList.nextIndex());
			HashMap<String, List<Double>> scaleArray = chart.getScaleList()
					.get(seriesList.nextIndex());
			if (titleMap.size() > 1) {
				status = true;
			}
			/* x = 60; */
			verticleValue = x;
			midPoint = ((x * 2.0) + verticleXvalueSpace) / 2.0;
			Element subG = document.createElement("g");
			HashMap<String, String> tittleArrayMap = titleMap.get(index);

			if ((seriesList.nextIndex() % Integer.parseInt(tittleArrayMap
					.get("value"))) == 0 && status) {
				/* transformValue += 50; */
				if (seriesList.nextIndex() == 0)
					transformValue += 0;
				else
					transformValue += 60;
				if (titleMap.size() == 1) {
					index = 0;
					status = false;
				} else {
					index = 1;
				}
				Element titleElement = createHeaderTitleElement(document, subG,
						chart, tittleArrayMap.get("title"));
				Element mainHeaderTitleElement = createMainHeaderTitleElement(
						document, subG, chart, tittleArrayMap.get("title"));
				g.appendChild(titleElement);
				g.appendChild(mainHeaderTitleElement);
			}
			g.setAttribute("stroke", "");
			g.setAttribute("stroke-width", "2");
			subG.setAttribute("id", "transformId");
			String translate = "translate(0," + transformValue + ")";
			subG.setAttribute("transform", translate);
			transformValue += 150;

			// list Represents series of charts i.e one list contains six charts
			// of data
			HashMap<String, List<String>> list = seriesList.next();

			List<String> grayedOutColor = list.get("grayedOutColor");
			List<String> chartColor = list.get("color");

			if (chartColor.size() > 0) {
				chartTestColor = chartColor.get(0);
			}
			if (grayedOutColor != null && grayedOutColor.size() > 0) {
				themeColor = grayedOutColor.get(0);
				chartTestColor = grayedOutColor.get(0);
				scaleColor = grayedOutColor.get(0);
			}

			Element referenceRangeElement = createReferenceRangeElement(
					document, subG, chart, testRange.get("range"));
			Element verticaleElement = createVerticleLines(document, subG,
					chart, list.get("data"), seriesList.nextIndex());
			Element horizontalElement = createHorizontalLine(document, subG,
					chart);
			Element pathElement = createCurvePathElement(document, subG, chart,
					pathArray.get("data"), seriesList.nextIndex());
			Element plotElement = createPlotElement(document, subG, chart,
					plotArray.get("data"), seriesList.nextIndex());
			Element scaleMarkerElement = createScaleMarkerElement(document,
					subG, chart, chart.getScalePixel());
			Element scaleValueElement = createScaleValueElement(document, subG,
					chart, scaleArray.get("scaleList"), chart.getScalePixel());

			Element xAxisDataElement = createxAxisDataElement(document, subG,
					chart, seriesList.nextIndex());

			Element yValuesOnPathElement = createyValuesOnPathElement(document,
					subG, chart, list.get("data"), plotArray.get("data"),
					seriesList.nextIndex());

			/*
			 * Element arrowRangeElement = createArrowRangeElement(document,
			 * subG, chart, testRange.get("range"));
			 */

			Element optimumRangeElement = createOptimumRangeElement(document,
					subG, chart, testRange.get("range"));
			Element optimumTitleElement = createOptimumTitleElement(document,
					subG, chart, testRange.get("range"));

			Element legendSymbolElement = createLegendSymbolElement(document,
					subG, chart, testRange.get("range"));

			Element testTitleElement = createTestTitleElement(document, subG,
					chart, list.get("title"), testRange.get("range"));

			if (seriesName.equals("chart1") && seriesList.nextIndex() == 1) {
				Element leftTitleElement = createLeftHeaderElement(document,
						subG);
				g.appendChild(leftTitleElement);
			}

			g.appendChild(referenceRangeElement);
			g.appendChild(verticaleElement);
			g.appendChild(horizontalElement);
			g.appendChild(plotElement);
			g.appendChild(pathElement);
			g.appendChild(scaleMarkerElement);
			g.appendChild(scaleValueElement);
			g.appendChild(xAxisDataElement);
			g.appendChild(yValuesOnPathElement);
			/* g.appendChild(arrowRangeElement); */
			g.appendChild(optimumRangeElement);
			g.appendChild(optimumTitleElement);
			g.appendChild(legendSymbolElement);
			g.appendChild(testTitleElement);
		}
		rootElement.appendChild(g);
		document.appendChild(rootElement);
		stringData = XMLHelper.getXMLDocumentAsString(document);
		return stringData;
	}

	// creating RootElement
	public Element createRootElement(Document document) {
		Element rootElement = document.createElement("svg");
		rootElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		rootElement.setAttribute("width", "1500");
		rootElement.setAttribute("height", "1500");
		return rootElement;
	}

	// creatingVerticalLine
	public Element createVerticleLines(Document document, Element subG,
			ChartVO chartVo, List<String> data, int index) {
		double xval = 100;
		List<ChartDateRange> chartDateRangeList = chartVo.getChartDateRange();
		System.out.println("size=============" + chartDateRangeList.size()
				+ "index================" + index);
		ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
		double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
		double space = chartDateRange.getTotalNoOfDayes() / 4;
		for (int i = 0; i <= chartDateRange.getTotalNoOfDayes(); i++) {
			String dString = "M " + xval + "," + chartVo.getYmin() + " " + xval
					+ "," + chartVo.getYmax() + "";
			Element path = document.createElement("path");
			path.setAttribute("id", "verticalLine");
			path.setAttribute("d", dString);
			path.setAttribute(
					"style",
					"#fill:none;stroke:#c0c0c0;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
			if (i % space == 0) {
				subG.appendChild(path);
			}
			xval += xAxisSpace;
			verticleValue += verticleXvalueSpace;
		}
		return subG;
	}

	// creating horizontalLine
	public Element createHorizontalLine(Document document, Element subG,
			ChartVO chartVo) {
		Element path = document.createElement("path");
		path.setAttribute("id", "horizontalLine");
		String dString = "m " + (x - 10) + "," + chartVo.getYmax() + " " + 600
				+ ",0";
		path.setAttribute("d", dString);
		path.setAttribute(
				"style",
				"fill:none;stroke:#c0c0c0;stroke-width:2.75;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		subG.appendChild(path);
		return subG;
	}

	// creating plotElement
	public Element createPlotElement(Document document, Element subG,
			ChartVO chartVo, List<Double> plotlist, int index) {
		List<ChartDateRange> chartDateRangeList = chartVo.getChartDateRange();
		ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
		double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
		midPoint = (double) ((x + (x + verticleXvalueSpace)) / 2);
		double xval = 100;
		for (Double plotValue : plotlist) {
			Element path = document.createElement("path");
			path.setAttribute("id", "plot");
			String dString = "m "
					+ xval
					+ ","
					+ plotValue
					+ " c 1.042,0 1.887,-0.88 1.887,-1.98 0,-1.09 -0.845,-1.98 -1.887,-1.98 -1.043,0 -1.887,0.89 -1.887,1.98 0,1.1 0.844,1.98 1.887,1.98 z";
			if (plotValue.doubleValue() == (chartVo.ymax + 2)) {
				dString = "";
			} else {
				path.setAttribute("d", dString);
			}
			path.setAttribute("style", "fill:" + chartTestColor
					+ ";fill-opacity:1;fill-rule:evenodd;stroke:none");
			subG.appendChild(path);
			xval += xAxisSpace;
			midPoint += verticleXvalueSpace;
		}
		return subG;
	}

	public Element createCurvePathElement(Document document, Element subG,
			ChartVO chartVo, List<Double> pathlist, int index) {
		List<ChartDateRange> chartDateRangeList = chartVo.getChartDateRange();
		ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
		double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
		midPoint = (double) ((x + (x + verticleXvalueSpace)) / 2);
		Element path = document.createElement("path");
		path.setAttribute("id", "curvePath");
		String dString = "";
		double xval = 100;
		for (int i = 0; i <= pathlist.size() - 1; i++) {

			double value = pathlist.get(i);
			double midpoint = 0.0;

			if (i == 0) {
				if (value != chartVo.getYmax().doubleValue()) {
					dString = "M " + xval + " " + value + "";
				} else {
					dString = "M ";
				}

			} else {
				if (value != chartVo.getYmax().doubleValue()) {
					midPoint += (verticleXvalueSpace + 2);
					xval += xAxisSpace;
					dString += " " + xval + " " + value + "";
				} else {
					midPoint += (verticleXvalueSpace + 2);
					xval += xAxisSpace;
				}
			}
		}

		path.setAttribute("d", dString);
		path.setAttribute(
				"style",
				"fill:none;stroke:"
						+ chartTestColor
						+ ";stroke-width:2;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none");
		if (dString.length() > 2) {
			subG.appendChild(path);
		}
		midPoint += verticleXvalueSpace;
		return subG;
	}

	public Element createScaleMarkerElement(Document document, Element subG,
			ChartVO chartVo, List<Double> scalePixel) {
		for (Double scaleMark : scalePixel) {
			Element path = document.createElement("path");
			path.setAttribute("id", "scaleMarker");
			String dString = "m " + (x - 5) + "," + scaleMark + " 3.317,0.01";
			path.setAttribute("d", dString);
			subG.appendChild(path);
		}
		return subG;
	}

	public Element createScaleValueElement(Document document, Element subG,
			ChartVO chartVo, List<Double> scaleValue, List<Double> scalePixel) {
		for (int i = 0; i <= scalePixel.size() - 1; i++) {
			Element text = document.createElement("text");
			text.setAttribute("x", "45");
			text.setAttribute("y", "50");
			text.setAttribute("id", "scale");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "yAxisScale");
			tspan.setAttribute("x", "" + (x - 30) + "");
			tspan.setAttribute("y", "" + (scalePixel.get(i) + 3) + "");
			tspan.setAttribute(
					"style",
					"font-size:13px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:"
							+ scaleColor
							+ ";fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
			Double value = scaleValue.get(i);
			if (value.intValue() == value) {
				tspan.setTextContent("" + value.intValue() + "");
			} else {
				tspan.setTextContent("" + value + "");
			}
			text.appendChild(tspan);
			subG.appendChild(text);
		}
		return subG;
	}

	public Element createxAxisDataElement(Document document, Element subG,
			ChartVO chartVo, int index) {
		List<ChartDateRange> chartDateRangeList = chartVo.getChartDateRange();
		ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
		double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
		double space = chartDateRange.getTotalNoOfDayes() / 4;
		double xVal = 100;
		int j = 0;
		midPoint = (double) ((x + (x + verticleXvalueSpace)) / 2);
		for (Date xAxis : chartDateRange.getxAxisDateRanges()) {
			Element text = document.createElement("text");
			text.setAttribute("x", "45");
			text.setAttribute("y", "50");
			text.setAttribute("id", "xAxis");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "xAxisData");
			tspan.setAttribute("x", "" + (xVal) + "");
			tspan.setAttribute("y", "" + (chartVo.getYmax() + 20) + "");
			tspan.setAttribute(
					"style",
					"font-size:12px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:"
							+ scaleColor
							+ ";fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
			if (j % space == 0) {
				chartDateTextFormat.format(xAxis);
				tspan.setTextContent("" + chartDateTextFormat.format(xAxis)
						+ "");
			}
			text.appendChild(tspan);
			subG.appendChild(text);
			xVal += xAxisSpace;
			midPoint += verticleXvalueSpace;
			j++;
		}
		return subG;
	}

	public Element createyValuesOnPathElement(Document document, Element subG,
			ChartVO chartVo, List<String> data, List<Double> plotlist, int index) {
		List<ChartDateRange> chartDateRangeList = chartVo.getChartDateRange();
		ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
		double xAxisSpace = 456 / chartDateRange.getTotalNoOfDayes();
		int xVal = 100;
		String plotValue = "";
		midPoint = (double) ((x + (x + verticleXvalueSpace)) / 2);
		int j = 0;
		for (int i = 0; i <= plotlist.size() - 1; i++) {
			Element text = document.createElement("text");
			text.setAttribute("x", "45");
			text.setAttribute("y", "50");
			text.setAttribute("id", "plotingValue");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "yAxisScaleData");
			tspan.setAttribute("x", "" + xVal + "");
			tspan.setAttribute("y", "" + (plotlist.get(i) - 10) + "");
			tspan.setAttribute(
					"style",
					"font-size:13px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:"
							+ chartTestColor
							+ ";fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");

			DecimalFormat decimalFormat = new DecimalFormat("#.#");
			String value = decimalFormat.format(chartDateRange.getPlotValues()
					.get(i));
			plotValue = (value.equals("0.0")) ? "" : value;

			tspan.setTextContent("" + plotValue + "");
			text.appendChild(tspan);
			subG.appendChild(text);
			xVal += xAxisSpace;
			midPoint += verticleXvalueSpace;

		}
		return subG;
	}

	public Element createReferenceRangeElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		Element innerG = document.createElement("g");
		/* int widthValue = (verticleValue - verticleXvalueSpace) - x; */
		double referenceRangeHeight = (rangeList.get(0) - rangeList.get(1));
		Element path = document.createElement("rect");
		path.setAttribute("id", "referenceRange");
		path.setAttribute("x", "" + x + "");
		path.setAttribute("y", "" + rangeList.get(1) + "");
		path.setAttribute("width", "" + referenceRangewidthValue + "");
		path.setAttribute("height", "" + referenceRangeHeight + "");
		path.setAttribute("rx", "3");
		path.setAttribute("fill", "" + themeColor + "");
		innerG.appendChild(path);
		subG.appendChild(innerG);
		return subG;
	}

	public Element createArrowRangeElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		int widthValue = (verticleValue - verticleXvalueSpace) - x;
		double referenceRangeHeight = (rangeList.get(0) - rangeList.get(1));
		Element path = document.createElement("path");
		path.setAttribute("id", "arrowRange");
		String dString = "m" + (referenceRangewidthValue + 30) + ","
				+ (rangeList.get(0) + 16) + " 0,-14.4 -26.98,0 0,-"
				+ referenceRangeHeight + " 26.98,0 0,-"
				+ (referenceRangeHeight / 2) + " 35.68," + referenceRangeHeight
				+ " -36.68," + referenceRangeHeight + " z";
		path.setAttribute("style", "fill:" + themeColor
				+ ";fill-opacity:1;fill-rule:evenodd;stroke:none");
		path.setAttribute("d", dString);
		subG.appendChild(path);

		return subG;
	}

	public Element createOptimumRangeElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		int widthValue = (verticleValue - verticleXvalueSpace) - x;
		Element path = document.createElement("rect");
		path.setAttribute("id", "arrowRangeId");
		path.setAttribute("width", "80");
		path.setAttribute("height", "30");
		path.setAttribute("rx", "6");
		path.setAttribute("fill", "" + themeColor + "");
		path.setAttribute("x", "" + (referenceRangewidthValue + 165) + "");
		path.setAttribute("y", "" + rangeList.get(1) + "");
		subG.appendChild(path);
		return subG;
	}

	public Element createOptimumTitleElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		Element text = document.createElement("text");
		text.setAttribute("x", "45");
		text.setAttribute("y", "50");
		text.setAttribute("id", "optimumTitleHead");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "optimumTitle");
		tspan.setAttribute("x", "" + referenceRangewidthValue + 159 + "");
		tspan.setAttribute("y", "" + (rangeList.get(1) + 20) + "");
		tspan.setAttribute(
				"style",
				"font-size:16px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:#ffffff;fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
		tspan.setTextContent("E-Zone");
		text.appendChild(tspan);
		subG.appendChild(text);
		return subG;
	}

	public Element createLegendSymbolElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		double referenceRangeHeight = (rangeList.get(0) - rangeList.get(1));

		// Double legend=chartVo.getYmax()-rangeList.get(1);
		Element path = document.createElement("rect");
		path.setAttribute("id", "legendSymbol");
		path.setAttribute("width", "50");
		path.setAttribute("height", "15");
		path.setAttribute("rx", "1");
		path.setAttribute("fill", chartTestColor);
		path.setAttribute("x", "" + (referenceRangewidthValue + 115 + ""));
		path.setAttribute("y", "" + ((rangeList.get(1) + 39) - 69) + "");
		subG.appendChild(path);
		return subG;
	}

	public Element createTestTitleElement(Document document, Element subG,
			ChartVO chartVo, List<String> title, List<Double> rangeList) {
		Element text = document.createElement("text");
		text.setAttribute("x", "45");
		text.setAttribute("y", "50");
		text.setAttribute("id", "legendTitle");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "optimumTitle");
		tspan.setAttribute("x", "" + (referenceRangewidthValue + 175 + ""));
		tspan.setAttribute("y", "" + (rangeList.get(1) - 18) + "");
		tspan.setAttribute(
				"style",
				"font-size:14px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:"
						+ themeColor
						+ ";fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
		tspan.setTextContent(title.get(0));
		text.appendChild(tspan);
		subG.appendChild(text);
		return subG;
	}

	private Element createHeaderTitleElement(Document document, Element subG,
			ChartVO chart, String string) {
		int widthValue = (verticleValue - verticleXvalueSpace) - x;
		Element path = document.createElement("rect");
		path.setAttribute("id", "titleHead");
		path.setAttribute("width", "670");
		path.setAttribute("height", "44");
		path.setAttribute("rx", "0");
		path.setAttribute("fill", "#54184f");
		path.setAttribute("x", "45");
		path.setAttribute("y", "" + (chart.getYmin() - 60) + "");
		subG.appendChild(path);
		return subG;
	}

	public Element createMainHeaderTitleElement(Document document,
			Element subG, ChartVO chart, String title) {
		Element text = document.createElement("text");
		text.setAttribute("x", "45");
		text.setAttribute("y", "50");
		text.setAttribute("id", "optimumTitleHead");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "optimumTitle");
		tspan.setAttribute("x", "" + (x - 50) + "");
		tspan.setAttribute("y", "" + (chart.getYmin() - 25.0) + "");
		tspan.setAttribute(
				"style",
				"font-size:31.97357368px;font-variant:normal;font-weight:300;font-stretch:normal;writing-mode:lr-tb;fill:#ffffff;fill-opacity:1;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:MyriadPro-Light");
		tspan.setTextContent(title);
		text.appendChild(tspan);
		subG.appendChild(text);
		return subG;
	}

	public Element createLeftHeaderElement(Document document, Element subG) {
		List<String> leftTitleList = new ArrayList<String>();
		List<String> titleXValue = new ArrayList<String>();
		leftTitleList.add("Vulnerable Heart");
		leftTitleList.add("Vulnerable Vessel");
		leftTitleList.add("Vulnerable Blood");
		titleXValue.add("-230");
		titleXValue.add("-533");
		titleXValue.add("-830");
		for (int i = 0; i < 3; i++) {
			Element text = document.createElement("text");
			text.setAttribute("transform", "rotate(270 30,60)");
			text.setAttribute("style", "font-color:#54184f;");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "leftTitle");
			tspan.setAttribute("x", "" + titleXValue.get(i) + "");
			tspan.setAttribute("y", "88");
			tspan.setAttribute("style",
					"font-size:38px;fill:#56004e;fill-opacity:1;fill-rule:nonzero;stroke:none");
			tspan.setTextContent(leftTitleList.get(i));
			text.appendChild(tspan);
			subG.appendChild(text);
		}
		return subG;
	}

	Comparator<Date> comparator = new Comparator<Date>() {

		@Override
		public int compare(Date o1, Date o2) {

			return 0;
		}
	};

}
