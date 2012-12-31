/**
 * 
 */
package com.hin.hl7messaging.cassandra;

/**
 * @author Administrator
 *
 */
public class ColumnFamily {

	private String keySpaceName;
	private String columnFamilyName;
	private String columnFamilyType;
	private String comment;
	private String comparatorType;
	private String defaultValidationClass;
	private String keyValidationClass;
	private String subComparatorType;
	/**
	 * @return the keySpaceName
	 */
	public String getKeySpaceName() {
		return keySpaceName;
	}
	/**
	 * @param keySpaceName the keySpaceName to set
	 */
	public void setKeySpaceName(String keySpaceName) {
		this.keySpaceName = keySpaceName;
	}
	/**
	 * @return the columnFamilyName
	 */
	public String getColumnFamilyName() {
		return columnFamilyName;
	}
	/**
	 * @param columnFamilyName the columnFamilyName to set
	 */
	public void setColumnFamilyName(String columnFamilyName) {
		this.columnFamilyName = columnFamilyName;
	}
	/**
	 * @return the columnFamilyType
	 */
	public String getColumnFamilyType() {
		return columnFamilyType;
	}
	/**
	 * @param columnFamilyType the columnFamilyType to set
	 */
	public void setColumnFamilyType(String columnFamilyType) {
		this.columnFamilyType = columnFamilyType;
	}
	/**
	 * @return the comment
	 */
	public String getComment() {
		return comment;
	}
	/**
	 * @param comment the comment to set
	 */
	public void setComment(String comment) {
		this.comment = comment;
	}
	/**
	 * @return the comparatorType
	 */
	public String getComparatorType() {
		return comparatorType;
	}
	/**
	 * @param comparatorType the comparatorType to set
	 */
	public void setComparatorType(String comparatorType) {
		this.comparatorType = comparatorType;
	}
	/**
	 * @return the defaultValidationClass
	 */
	public String getDefaultValidationClass() {
		return defaultValidationClass;
	}
	/**
	 * @param defaultValidationClass the defaultValidationClass to set
	 */
	public void setDefaultValidationClass(String defaultValidationClass) {
		this.defaultValidationClass = defaultValidationClass;
	}
	/**
	 * @return the keyValidationClass
	 */
	public String getKeyValidationClass() {
		return keyValidationClass;
	}
	/**
	 * @param keyValidationClass the keyValidationClass to set
	 */
	public void setKeyValidationClass(String keyValidationClass) {
		this.keyValidationClass = keyValidationClass;
	}
	/**
	 * @return the subComparatorType
	 */
	public String getSubComparatorType() {
		return subComparatorType;
	}
	/**
	 * @param subComparatorType the subComparatorType to set
	 */
	public void setSubComparatorType(String subComparatorType) {
		this.subComparatorType = subComparatorType;
	}
	
}
