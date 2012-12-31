/**
 * 
 */
package com.hin.hl7messaging.api;

import java.util.HashMap;
import java.util.List;

import com.hin.domain.ObservationTest;
import com.hin.domain.ObservationVO;
import com.hin.domain.vo.ChartVO;
import com.hin.domain.vo.RoleDefinitionVO;

/**
 * @author vinaykumar.gk
 * 
 */
public interface IRoleDefinitionService {
	public List<String> retrieveAllRoleNames();

}
