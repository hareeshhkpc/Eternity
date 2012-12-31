/**
 * 
 */
package com.hin.domain.core;

import java.util.ArrayList;
import java.util.List;

/**
 * @author sreekumar.s
 * 
 */
public class DataDomain extends BaseDomain {

	private List<Attribute> attributes = new ArrayList<Attribute>();

	public boolean addAttribute(Attribute attribute) {
		return attributes.add(attribute);
	}

}
