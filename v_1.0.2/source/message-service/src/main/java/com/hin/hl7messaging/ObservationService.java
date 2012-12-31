/**
 * 
 */
package com.hin.hl7messaging;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.cassandra.cli.CliParser.comparator_return;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.ObservationTest;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.domain.vo.ObservationValue;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IChartService;
import com.hin.hl7messaging.cassandra.CassandraConnector;

/**
 * @author vinaykumar.gk
 * 
 */
@Service(value = "observationsService")
public class ObservationService implements IChartService {

	private Logger logger = Logger.getLogger(AuthenticationService.class
			.getName());
/*	@Resource(name = "identityMessageRepository")
	private IIdentityRepository identityRepository;*/
	
	@Autowired
	private CassandraConnector cassandraConnector;

	@Override
	public List<ObservationVO> getObservations(String patientId,
			List<ObservationTest> observationTests,String organizationId) {

		List<ObservationVO> observationVOs = new ArrayList<ObservationVO>();

		for (ObservationTest observationTest : observationTests) {
			String messageType = observationTest.getMessageType();
			String testName = observationTest.getTestName();
			String subscriberId = patientId + "_" + messageType
					+ "_observationTest_" + testName + "";
			ObservationVO observationVO = new ObservationVO();
			observationVO.setMessageType(messageType);
			observationVO.setTestName(testName);
			try {
				Map<String, HashMap<String, String>> ObservationsMap = cassandraConnector
						.retrieveStandardColumnFamily("PATIENT_OBSERVATIONS",
								subscriberId,organizationId);
				Iterator<Entry<String, HashMap<String, String>>> keyName = ObservationsMap
						.entrySet().iterator();

				while (keyName.hasNext()) {
					List<Date> dates = new ArrayList();
					List<ObservationValue> list = new ArrayList<ObservationValue>();
					HashMap<String, String> testMap = ObservationsMap
							.get(keyName.next().getKey());
					Iterator<Entry<String, String>> testKey = testMap
							.entrySet().iterator();
					while (testKey.hasNext()) {
						Entry<String, String> key = testKey.next();
						String varKey = key.getKey();
						ObservationValue observationValue = new ObservationValue();
						/* if (varKey.toString().contains("observationTest")) { */
						if (!varKey.toString().contains("KEY")
								&& !varKey.toString().contains("PATIENT_ID")
								&& !varKey.toString().contains("MESSAGE")) {
							String testValue = testMap.get(varKey);
							long testDate = Long.parseLong(varKey);
							Date date = new Date(testDate);
							observationValue.setTestDate(date);
							/* dates.add(date); */
							observationValue.setTestValue(testValue);
							list.add(observationValue);
						}
						Collections.sort(list,
								new Comparator<ObservationValue>() {
									public int compare(ObservationValue o1,
											ObservationValue o2) {
										return o1.getTestDate().compareTo(
												o2.getTestDate());
									}
								});
						Collections.reverse(list);
					}
					observationVO.setObservationVO(list);
					/* Collections.sort(list, comparator); */
				}

				observationVOs.add(observationVO);
			}

			catch (Exception e) {
				e.printStackTrace();
			}

		}
		return observationVOs;
	}

	@Override
	public ChartVO pixelMap(ChartVO chartVO) {
		// TODO Auto-generated method stub
		return null;
	}

	Comparator<ObservationValue> comparator = new Comparator<ObservationValue>() {
		@Override
		public int compare(ObservationValue o1, ObservationValue o2) {
			// TODO Auto-generated method stub
			return o1.toString().compareToIgnoreCase(o2.toString());
		}
	};

	@Override
	public String createSvgDocument(ChartVO chartVO, ChartVO chart,
			List<HashMap<String, String>> titleMap, String seriesName) {
		// TODO Auto-generated method stub
		return null;
	}

}
