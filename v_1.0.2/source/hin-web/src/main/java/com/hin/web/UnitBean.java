/**
 * 
 */
package com.hin.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.domain.Unit;
import com.hin.service.IUnitService;
import com.hin.web.base.BaseBean;

/**
 * @author s.thamilarasi
 * 
 */
@Component("unitBean")
@Scope("session")
public class UnitBean extends BaseBean {
	private static final long serialVersionUID = 1L;

	@Autowired
	private IUnitService unitService;

	private List<Unit> units = new ArrayList<Unit>();
	private Unit unit = new Unit();
	private String unitId;
	private String searchByName;

	public String addUnit() {
		unit = new Unit();
		return "addunit";
	}

	public String loadUnits() {
		return "viewunits";
	}

	public void search() {
		units.clear();
		if (searchByName != null && searchByName.length() != 0) {
			units.addAll(unitService.findAllByProperty("name", "^"
					+ searchByName, Unit.class));
		} else {
			units.addAll(unitService.findAll(Unit.class));
		}
	}

	public String viewUnit() {
		unit = unitService.findById(unitId, Unit.class);
		return "addunit";
	}

	public String saveUnit() {
		try {
			unit.setName(unit.getName().toString().trim());
			unit.setAbbreviation(unit.getAbbreviation().toString().trim());
			unit.setDescription(unit.getDescription().toString().trim());
			unit.setSymbol(unit.getSymbol().toString().trim());
			unitService.save(unit);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "viewunits";
	}

	public String updateUnit() {
		try {
			unitService.update(unit);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "viewunits";
	}

	public String removeUnit() {
		try {
			unit = unitService.findById(unitId, Unit.class);
			unitService.delete(unit);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "viewunits";
	}

	public List<Unit> getUnits() {
		search();
		return units;
	}

	public void setUnits(List<Unit> units) {
		this.units = units;
	}

	public Unit getUnit() {
		return unit;
	}

	public void setUnit(Unit unit) {
		this.unit = unit;
	}

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getSearchByName() {
		return searchByName;
	}

	public void setSearchByName(String searchByName) {
		this.searchByName = searchByName;
	}
}
