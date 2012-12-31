package com.hin.hl7messaging;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.lucene.document.Document;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.ScoreDoc;
import org.springframework.stereotype.Service;

import com.hin.domain.ProcessList;
import com.hin.domain.vo.SearchVO;
import com.hin.hl7messaging.api.IProcessSearchService;

@Service(value = "processSearchService")
public class ProcessSearchService extends SearchService implements IProcessSearchService {
	public Object fillData(ScoreDoc[] hits,IndexSearcher searcher,SearchVO searchVO) throws Exception{
			
			HashMap<String, ProcessList> prosessListMap=new HashMap<String, ProcessList>();
			ProcessList processList;
			for (int i = 0; i < hits.length; ++i) {
				processList=null;
				int docId = hits[i].doc;
				Document document = searcher.doc(docId);
				if(prosessListMap.containsKey(document.get("processName"))){
					processList=prosessListMap.get(document.get("processName"));
				}else{
					processList=new ProcessList();
					processList.setProcessName(document.get("processName"));
					prosessListMap.put(document.get("processName"), processList);
				}
				processList.getProcessIdList().add(document.get("id"));
				
			}
			return prosessListMap;
	}

}
