package com.hin.domain;

import java.util.List;

import com.hin.domain.vo.IndexFieldsVO;

public interface IIndexable {
	public String getIndexingDirectory();
	public List<IndexFieldsVO> getIndexFieldList();

}
