package com.hin.hl7messaging;

/**
 * @author krishna.lr
 * 
 */
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.lucene.document.Document;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.EntityState;
import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.IEntitySearchService;
import com.hin.service.IEntityStateService;

@Service(value = "entitySearchService")
public class EntitySearchService extends SearchService implements
		IEntitySearchService {
	@Autowired
	private IEntityStateService entityStateService;

	private Logger logger = Logger.getLogger(SearchService.class.getName());

	public Object fillData(ScoreDoc[] hits, IndexSearcher searcher,
			SearchVO searchVO) throws Exception {
		List<ProfileVO> profileVOList = new ArrayList<ProfileVO>();
		for (int i = 0; i < hits.length; i++) {
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);
			ProfileVO profileVO = new ProfileVO();
			profileVO.setFamilyName(d.get("familyName"));
			profileVO.setGivenName(d.get("givenName"));
			profileVO.setPrefixName(d.get("prefixName"));
			profileVO.setSuffixName(d.get("suffixName"));
			profileVO.setName(profileVO.getFullName());
			profileVO.setSubscriberId(d.get("subscriberId"));
			profileVO.setImageBase64(d.get("image"));
			profileVO.setState(getEntityState(d, searchVO));
			profileVO.setRole(d.get("Role"));
			profileVO.setMembershipId(d.get("membership"));
			profileVO.setOrganizationId(d.get("organizationId"));
			profileVOList.add(profileVO);
		}
		return profileVOList;
	}

	private String getEntityState(Document d, SearchVO searchVO) {
		EntityState entityState = new EntityState();
		String organizationId = searchVO.getAssigningOrganizationID();
		try {
			entityState = entityStateService.getState(d.get("subscriberId"),d.get("organizationId"));
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}

		if (organizationId.equals(d.get("organizationId"))
				|| organizationId.equals(entityState
						.getAssigningOrganizationID())) {
			if (entityState != null && entityState.getStatevalue() != null
					&& entityState.getAssigningOrganizationID() != null) {
				return entityState.getStatevalue();
			} else {
				return "false";
			}
		} else {
			return "transfer";
		}

	}

	@Override
	public List<ProfileVO> convertObjectListToProfileVoList(
			Object profilesObjectList) {
		List<ProfileVO> profiles = new ArrayList<ProfileVO>();
		for (Object profileVOObject : (List<ProfileVO>) profilesObjectList) {
			profiles.add((ProfileVO) profileVOObject);
		}
		return profiles;
	}

	@Override
	public void updateTime(List<ProfileVO> profiles,
			List<EntityState> entityStateList) {
		for (ProfileVO profileVO : profiles) {
			for (EntityState entityState : entityStateList) {
				if (profileVO.getSubscriberId().equals(
						entityState.getEntityid())) {
					profileVO.setTimeLapse(entityState.getTime());
					break;
				}
			}
		}

	}

}
