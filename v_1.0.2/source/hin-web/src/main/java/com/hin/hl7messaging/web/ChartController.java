/**
 * 
 */
package com.hin.hl7messaging.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.google.gson.GsonBuilder;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.hl7messaging.api.IChartService;

/**
 * @author vinaykumar.gk
 * 
 */
@Controller
public class ChartController {

	@Autowired
	IChartService chartService;
	@Autowired
	IChartService chartSvgService;
	@Autowired
	IChartService observationsService;

	@RequestMapping(value = "/chart/chartController", method = RequestMethod.GET)
	public @ResponseBody
	String loadChart(@RequestParam String json) {
		ChartVO chart = new ChartVO();
		try {
			Gson gson = new GsonBuilder().create();
			ChartVO chartVO = gson.fromJson(json, ChartVO.class);
			chart = chartService.pixelMap(chartVO);
		} catch (Exception e) {
			System.out.println("chart pixel map exception" + e);
			// TODO: handle exception
		}
		return new GsonBuilder().create().toJson(chart);

	}

	@RequestMapping(value = "/chart/chartSvgController", method = RequestMethod.POST)
	public @ResponseBody
	List<String> loadSvgChart(@RequestParam String json) {
		List<String> svgArray = new ArrayList<String>();
		try {
			Gson gson = new GsonBuilder().create();
			ChartVO chartVO = gson.fromJson(json, ChartVO.class);

			List<HashMap<String, List<HashMap<String, List<String>>>>> chartsList = chartVO
					.getChartSeries();
			List<HashMap<String, List<HashMap<String, String>>>> titleList = chartVO
					.getTitleArray();
			Iterator<HashMap<String, List<HashMap<String, List<String>>>>> chartsIterator = chartsList
					.iterator();
			while (chartsIterator.hasNext()) {
				HashMap<String, List<HashMap<String, List<String>>>> chartsMap = chartsIterator
						.next();
				Iterator<String> chartsMapkey = chartsMap.keySet().iterator();

				while (chartsMapkey.hasNext()) {
					ChartVO chart = new ChartVO();
					chart = chartVO;
					String key = chartsMapkey.next();
					List<HashMap<String, String>> titleMap = titleList.get(0)
							.get(key);
					List<HashMap<String, List<String>>> chartsListMap = chartsMap
							.get(key);
					chart.setTestData(chartsListMap);
					String svgDocument = chartSvgService.createSvgDocument(
							chartService.pixelMap(chart), chart, titleMap, key);
					svgArray.add(svgDocument);
				}
			}
			ChartVO chartSvg = new ChartVO();
			chartSvg.setSvgArray(svgArray);
			/*
			 * for (String chartVO : chart.getCharts()) { ChartVO chartPixelMap
			 * = chartService.pixelMap(chartVO); svgDocument =
			 * chartSvgService.createSvgDocument(chartPixelMap, chartVO); }
			 */} catch (Exception e) {
			System.out.println("chart svg creation exception" + e);
			// TODO: handle exception
		}
		return svgArray;
	}

	@RequestMapping(value = "/chart/observations", method = RequestMethod.GET)
	public @ResponseBody
	String getObservations(@RequestParam String json) {
		List<ObservationVO> observations = new ArrayList<ObservationVO>();
		try {
			Gson gson = new GsonBuilder().create();
			ObservationVO observationVO = gson.fromJson(json,
					ObservationVO.class);
					/*
			 * observation=observationsService.getObservations(observationVO.
			 * getPatientId(), observationVO.getTestValueName(),
			 * observationVO.getMessageType());
			 */

			observations = observationsService.getObservations(
					observationVO.getPatientId(),
					observationVO.getObservationTests(),observationVO.getOrganizationId());

		} catch (Exception e) {
			System.out.println("chart obvservations exception" + e);
			// TODO: handle exception
		}
		return new GsonBuilder().create().toJson(observations);
	}
}
