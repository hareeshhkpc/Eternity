/**
 * 
 */
package com.hin.domain.utils;

import java.util.Comparator;

/**
 * @author s.thamilarasi
 *
 */
public class SearchCriteriaComparator implements Comparator<SearchCriteria>{

	@Override
	public int compare(SearchCriteria criteria1, SearchCriteria criteria2) {
		 String property1=criteria1.getProperty();
		 String property2=criteria2.getProperty();
	 	return property1.compareTo(property2);
	}

}
