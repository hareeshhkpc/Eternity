/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.HashMap;
import java.util.List;

import com.hin.domain.ObservationTest;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;

/**
 * @author vinaykumar.gk
 * 
 */
public interface IChartService {
	public ChartVO pixelMap(ChartVO chartVO);

	public String createSvgDocument(ChartVO chartVO, ChartVO chart, List<HashMap<String, String>> titleMap,String seriesName);

	public List<ObservationVO> getObservations(String patientId,
			List<ObservationTest> observationTests,String organizationId);

}
