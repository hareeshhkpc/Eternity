/**
 * 
 */
package com.hin.hl7messaging;

import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.springframework.stereotype.Service;
import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import com.hin.domain.ObservationTest;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.domain.vo.ChartDateRange;
import com.hin.hl7messaging.api.IChartService;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author vinaykumar.gk
 * 
 */
@Service(value = "chartSvgService")
public class ChartSvgService implements IChartService {
	int x = 0;
	int verticleValue = 0;
	int verticleXvalueSpace = 0;
	Double midPoint = 0.0;
	int referenceRangewidthValue = 455;
	String themeColor = "#56004e";
	String chartTestColor = "";
	String scaleColor = "#000000";
	private DateFormat chartDateTextFormat = new SimpleDateFormat(
			"dd MMM, yyyy");

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
		try {
			while (seriesList.hasNext()) {
				themeColor = "#56004e";
				scaleColor = "#000000";
				HashMap<String, List<Double>> plotArray = chart.getPlotList()
						.get(seriesList.nextIndex());
				HashMap<String, List<Double>> testRange = chart
						.getTestRangeMap().get(seriesList.nextIndex());
				HashMap<String, List<Double>> pathArray = chart.getPathList()
						.get(seriesList.nextIndex());
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
					Element titleElement = createHeaderTitleElement(document,
							subG, chart, tittleArrayMap.get("title"));
					Element mainHeaderTitleElement = createMainHeaderTitleElement(
							document, subG, chart, tittleArrayMap.get("title"));
					g.appendChild(titleElement);
					g.appendChild(mainHeaderTitleElement);
				}
				g.setAttribute("stroke", "none");
				/* g.setAttribute("stroke-width", "2"); */
				subG.setAttribute("id", "transformId");
				String translate = "translate(0," + transformValue + ")";
				subG.setAttribute("transform", translate);
				transformValue += 150;

				// list Represents series of charts i.e one list contains six
				// charts
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
				Element horizontalElement = createHorizontalLine(document,
						subG, chart);
				Element pathElement = createCurvePathElement(document, subG,
						chart, pathArray.get("data"), seriesList.nextIndex());
				Element plotElement = createPlotElement(document, subG, chart,
						plotArray.get("data"), seriesList.nextIndex());
				Element scaleMarkerElement = createScaleMarkerElement(document,
						subG, chart, chart.getScalePixel());
				Element scaleValueElement = createScaleValueElement(document,
						subG, chart, scaleArray.get("scaleList"),
						chart.getScalePixel());

				Element xAxisDataElement = createxAxisDataElement(document,
						subG, chart, seriesList.nextIndex());

				Element yValuesOnPathElement = createyValuesOnPathElement(
						document, subG, chart, list.get("data"),
						plotArray.get("data"), seriesList.nextIndex());

				/*
				 * Element arrowRangeElement = createArrowRangeElement(document,
				 * subG, chart, testRange.get("range"));
				 */

				Element optimumRangeElement = createOptimumRangeElement(
						document, subG, chart, testRange.get("range"));
				Element optimumTitleElement = createOptimumTitleElement(
						document, subG, chart, testRange.get("range"));

				Element legendSymbolElement = createLegendSymbolElement(
						document, subG, chart, testRange.get("range"));

				Element testTitleElement = createTestTitleElement(document,
						subG, chart, list.get("title"), testRange.get("range"));

				if (seriesName.equals("chart1") && seriesList.nextIndex() == 1) {
					Element leftTitleElement = createLeftHeaderElement(
							document, subG);
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
		} catch (Exception e) {
			System.out.println("chart svg creation file" + e);
			e.printStackTrace();
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
		rootElement.setAttribute("width", "744.09448819");
		rootElement.setAttribute("height", "1052.3622047");
		return rootElement;
	}

	// creatingVerticalLine
	public Element createVerticleLines(Document document, Element subG,
			ChartVO chartVo, List<String> data, int index) {
		try {
			double xval = 100;
			List<ChartDateRange> chartDateRangeList = chartVo
					.getChartDateRange();
			ChartDateRange chartDateRange = chartDateRangeList.get(index - 1);
			double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
			double space = chartDateRange.getTotalNoOfDayes() / 4;
			for (int i = 0; i <= chartDateRange.getTotalNoOfDayes(); i++) {
				String dString = "M " + xval + "," + chartVo.getYmin() + " "
						+ xval + "," + chartVo.getYmax() + "";
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

		} catch (DOMException e) {
			System.out.println("vertical lines" + e);
			e.printStackTrace();
		}
		return subG;
	}

	// creating horizontalLine
	public Element createHorizontalLine(Document document, Element subG,
			ChartVO chartVo) {
		Element path = document.createElement("path");
		path.setAttribute("id", "horizontalLine");
		String dString = "m " + (x - 10) + "," + chartVo.getYmax() + " " + 485
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
		for (int i = 0; i <= plotlist.size() - 1; i++) {
			Element path = document.createElement("path");
			path.setAttribute("id", "plot");
			String dString = "m "
					+ xval
					+ ","
					+ plotlist.get(i)
					+ " c 1.042,0 1.887,-0.88 1.887,-1.98 0,-1.09 -0.845,-1.98 -1.887,-1.98 -1.043,0 -1.887,0.89 -1.887,1.98 0,1.1 0.844,1.98 1.887,1.98 z";
			if (chartDateRange.getPlotValues().get(i) == null) {
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
				if (chartDateRange.getPlotValues().get(i) != null) {
					dString = "M " + xval + " " + value + "";
				} else {
					dString = "M ";
				}

			} else {
				if (chartDateRange.getPlotValues().get(i) != null) {
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
		double xAxisSpace = 456.0 / chartDateRange.getTotalNoOfDayes();
		double xVal = 100;
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
			tspan.setAttribute("x", "" + (xVal-3) + "");
			tspan.setAttribute("y", "" + (plotlist.get(i) - 10) + "");
			tspan.setAttribute(
					"style",
					"font-size:13px;font-variant:normal;font-weight:bold;writing-mode:lr-tb;fill:"
							+ chartTestColor
							+ ";fill-opacity:2;fill-rule:nonzero;stroke:none;font-family:Myriad Pro Light;-inkscape-font-specification:Myriad Pro Light");
			DecimalFormat decimalFormat = new DecimalFormat("#.#");
			Double value = chartDateRange.getPlotValues().get(i);
			if (value == null) {
				plotValue = "";
			} else {
				plotValue = decimalFormat.format(value);
			}
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
		path.setAttribute("y", "" + 116 + "");
		subG.appendChild(path);
		return subG;
	}

	public Element createOptimumTitleElement(Document document, Element subG,
			ChartVO chartVo, List<Double> rangeList) {
		Element text = document.createElement("text");
		text.setAttribute("x", "45");
		text.setAttribute("y", "50");
		text.setAttribute("id", "eZoneTitleHeader");
		Element tspan = document.createElement("tspan");
		tspan.setAttribute("id", "eZoneTitle");
		tspan.setAttribute("x", "" + (referenceRangewidthValue + 179) + "");
		tspan.setAttribute("y", "" + 135 + "");
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
		path.setAttribute("width", "45");
		path.setAttribute("height", "15");
		path.setAttribute("rx", "1");
		path.setAttribute("fill", chartTestColor);
		path.setAttribute("x", "" + (referenceRangewidthValue + 115 + ""));
		path.setAttribute("y", "" + 88 + "");
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
		tspan.setAttribute("x", "" + (referenceRangewidthValue + 169 + ""));
		tspan.setAttribute("y", "" + 100 + "");
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
		titleXValue.add("-209");
		titleXValue.add("-501");
		titleXValue.add("-797");
		for (int i = 0; i < 3; i++) {
			Element text = document.createElement("text");
			text.setAttribute("transform", "rotate(270 30,60)");
			text.setAttribute("style", "font-color:#54184f;");
			Element tspan = document.createElement("tspan");
			tspan.setAttribute("id", "leftTitle");
			tspan.setAttribute("x", "" + titleXValue.get(i) + "");
			tspan.setAttribute("y", "90");
			tspan.setAttribute(
					"style",
					"font-size:30px;fill:#56004e;font-family:Myriad Pro Light;fill-rule:nonzero;stroke:none");
			tspan.setTextContent(leftTitleList.get(i));
			text.appendChild(tspan);
			subG.appendChild(text);
		}
		return subG;
	}

	public ChartVO pixelMap(ChartVO chartVO) {
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
