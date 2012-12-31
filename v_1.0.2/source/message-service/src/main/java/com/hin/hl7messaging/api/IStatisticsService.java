/**
 * 
 */
package com.hin.hl7messaging.api;

import com.hin.domain.vo.StatisticsVO;


/**
 * @author vineeth.ng
 * 
 */
public interface IStatisticsService {
	public void insertIntoIndex(String message,String messageId, String program, String responsiblePartyName) throws Exception;
	public StatisticsVO fetchStatisticsDetails(int year, int month, String messageType, String program, String status, String facility) throws ClassNotFoundException;
}
