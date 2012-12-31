/**
 * 
 */
package com.hin.domain;

/**
 * @author vinaykumar.gk and Krishna L.R
 * 
 */
public class NumericRange extends DataType implements Type {
	private double absoluteHigh;
	private double criticalHigh;
	private double normalHigh;
	private double absoluteLow;
	private double criticalLow;
	private double normalLow;

	/**
	 * @return the absoluteHigh
	 */
	public double getAbsoluteHigh() {
		return absoluteHigh;
	}

	/**
	 * @param absoluteHigh
	 *            the absoluteHigh to set
	 */
	public void setAbsoluteHigh(double absoluteHigh) {
		this.absoluteHigh = absoluteHigh;
	}

	/**
	 * @return the criticalHigh
	 */
	public double getCriticalHigh() {
		return criticalHigh;
	}

	/**
	 * @param criticalHigh
	 *            the criticalHigh to set
	 */
	public void setCriticalHigh(double criticalHigh) {
		this.criticalHigh = criticalHigh;
	}

	/**
	 * @return the normalHigh
	 */
	public double getNormalHigh() {
		return normalHigh;
	}

	/**
	 * @param normalHigh
	 *            the normalHigh to set
	 */
	public void setNormalHigh(double normalHigh) {
		this.normalHigh = normalHigh;
	}

	/**
	 * @return the absoluteLow
	 */
	public double getAbsoluteLow() {
		return absoluteLow;
	}

	/**
	 * @param absoluteLow
	 *            the absoluteLow to set
	 */
	public void setAbsoluteLow(double absoluteLow) {
		this.absoluteLow = absoluteLow;
	}

	/**
	 * @return the criticalLow
	 */
	public double getCriticalLow() {
		return criticalLow;
	}

	/**
	 * @param criticalLow
	 *            the criticalLow to set
	 */
	public void setCriticalLow(double criticalLow) {
		this.criticalLow = criticalLow;
	}

	/**
	 * @return the normalLow
	 */
	public double getNormalLow() {
		return normalLow;
	}

	/**
	 * @param normalLow
	 *            the normalLow to set
	 */
	public void setNormalLow(double normalLow) {
		this.normalLow = normalLow;
	}

	private Unit unit = new Unit();

	public Unit getUnit() {
		return unit;
	}

	public void setUnit(Unit unit) {
		this.unit = unit;
	}

	@Override
	public DataType getType() {
		return this;
	}

	@Override
	public void handler() {
		System.out.println("NumericRange Handler");

	}

}
