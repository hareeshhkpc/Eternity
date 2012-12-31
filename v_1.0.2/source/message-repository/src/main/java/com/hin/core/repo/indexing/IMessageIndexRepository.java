/**
 * 
 */
package com.hin.core.repo.indexing;

import java.util.List;

import com.hin.domain.index.IndexBase;

/**
 * @author Administrator
 *
 */
public interface IMessageIndexRepository {

	void updateIndex(IndexBase index) throws Exception;

	<T> List<T> queryIndex(Class<T> indexClass);

	<T> void updateIndexDetails(IndexBase index, String indexClass)throws Exception;
	
	<T> List queryIndexForMonth(String indexClass,String messageType,String program, int month, int year, String status, String facility);
	
	<T> int queryIndexForMonthCount(String indexClass,String messageType,String program, int month, int year, String status, String facility);
	
}
