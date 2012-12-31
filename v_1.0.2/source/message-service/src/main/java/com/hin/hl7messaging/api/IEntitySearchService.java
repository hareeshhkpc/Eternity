package com.hin.hl7messaging.api;

import java.util.List;

import com.hin.domain.EntityState;
import com.hin.domain.vo.ProfileVO;

public interface IEntitySearchService extends ISearchService {
	List<ProfileVO> convertObjectListToProfileVoList(
			Object profilesObjectList);
	void updateTime(List<ProfileVO> profiles,
			List<EntityState> entityStateList);
}
