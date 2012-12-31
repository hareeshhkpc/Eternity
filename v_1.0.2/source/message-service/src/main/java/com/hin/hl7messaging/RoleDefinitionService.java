/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import com.hin.hl7.messaging.api.IIdentityRepository;
import com.hin.hl7messaging.api.IRoleDefinitionService;

/**
 * @author vinaykumar.gk
 * 
 */
@Service(value = "rolDefinitionService")
public class RoleDefinitionService implements IRoleDefinitionService {

	@Resource(name = "identityMessageRepository")
	private IIdentityRepository identityRepository;

	@Override
	public List<String> retrieveAllRoleNames() {
		List<String> roleNames = new ArrayList<String>();
		try {
			Map<String, HashMap<String, String>> roleDefinitionMap = identityRepository.retrieveStandardColumnFamily("ROLE_DEFINITION1", "");
					
			Iterator<Entry<String, HashMap<String, String>>> keyName = roleDefinitionMap
					.entrySet().iterator();
			while (keyName.hasNext()) {
				String roleName = keyName.next().getKey();
				roleNames.add(roleName);

			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return roleNames;
	}

}
