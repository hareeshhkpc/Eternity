/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.domain.NumericRange;
import com.hin.domain.Unit;
import com.hin.service.INumericRangeService;
import com.hin.web.base.BaseBean;

/**
 * @author krishna.lr
 * 
 */
@Component("numericRangeBean")
@Scope("session")
public class NumericRangeBean extends BaseBean {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Boolean unitTypeExists = false;
	@Autowired
	private INumericRangeService numericRangeService;

	private Unit unit = new Unit();
	private NumericRange numericRange = new NumericRange();

	private List<NumericRange> numericRangeList = new ArrayList<NumericRange>();

	public String saveNumericRange() {
		try {
			numericRange.setUnit(unit);
			//checkUnitExist(unit);
			if (!unitTypeExists) {
				numericRangeService.saveNumericRange(numericRange);
				return "viewNumericRange";
			} else {

				errorMessage("" + unit.getAbbreviation() + " Already Exists!");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public void checkUnitExist(Unit unit) {
		/*getNumericRangeList();
		String unitType = unit.getUnitType();
		for (NumericRange numericRange : numericRangeList) {
			if (unitType.equalsIgnoreCase(numericRange.getUnit().getUnitType())) {
				unitTypeExists = true;
			}
		}*/

	}

	public void modify() {
		String id = getRequest().getParameter("objId");
		/*
		 * numericRange = numericRangeService return "viewconcept";
		 */
		NumericRange numericRange = numericRangeService
				.findNumericRangeById(id);
		numericRangeService.update(numericRange);
		/* mongoTemplate.updateFirst(query, update, entityClass); */

	}

	public INumericRangeService getNumericRangeService() {
		return numericRangeService;
	}

	public void setNumericRangeService(INumericRangeService numericRangeService) {
		this.numericRangeService = numericRangeService;
	}

	public NumericRange getNumericRange() {
		return numericRange;
	}

	public void setNumericRange(NumericRange numericRange) {
		this.numericRange = numericRange;
	}

	public List<NumericRange> getNumericRangeList() {
		numericRangeList.clear();
		numericRangeList = numericRangeService.findAllNumericRange();
		return numericRangeList;
	}

	public void setNumericRangeList(List<NumericRange> numericRangeList) {
		this.numericRangeList = numericRangeList;
	}

	public Unit getUnit() {
		return unit;
	}

	public void setUnit(Unit unit) {
		this.unit = unit;
	}

}
