/**
 * 
 */
package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.ProfileVO;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.ILicenseeSearchService;

/**
 * @author krishna.lr
 * 
 */
@Service(value = "licenseeSearchService")
public class LicenseeSearchService extends SearchService implements
		ILicenseeSearchService {
	public Object fillData(ScoreDoc[] hits, IndexSearcher searcher,
			SearchVO searchVO) throws Exception {
		List<ProfileVO> profileVOList = new ArrayList<ProfileVO>();
		for (int i = 0; i < hits.length; i++) {
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);
			ProfileVO profileVO = new ProfileVO();
			profileVO.setPrefixName(d.get("namePrefix"));
			profileVO.setSuffixName(d.get("nameSuffix"));
			profileVO.setName(profileVO.getFullName());
			profileVO.setSubscriberId(d.get("subscriberId"));
			profileVO.setImageBase64(d.get("image"));
			profileVO.setRole(d.get("Role"));
			profileVO.setTelecom(d.get("telecom"));
			profileVOList.add(profileVO);
		}
		return profileVOList;
	}
}
