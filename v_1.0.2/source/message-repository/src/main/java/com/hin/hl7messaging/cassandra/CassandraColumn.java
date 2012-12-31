/**
 * 
 */
package com.hin.hl7messaging.cassandra;

import java.nio.ByteBuffer;

/**
 * @author Administrator
 *
 */
public class CassandraColumn {
	
	private ByteBuffer name;
	private String indexName;
	private String indexType;
	private String validationClass;
	/**
	 * @return the name
	 */
	public ByteBuffer getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(ByteBuffer name) {
		this.name = name;
	}
	/**
	 * @return the indexName
	 */
	public String getIndexName() {
		return indexName;
	}
	/**
	 * @param indexName the indexName to set
	 */
	public void setIndexName(String indexName) {
		this.indexName = indexName;
	}
	/**
	 * @return the indexType
	 */
	public String getIndexType() {
		return indexType;
	}
	/**
	 * @param indexType the indexType to set
	 */
	public void setIndexType(String indexType) {
		this.indexType = indexType;
	}
	/**
	 * @return the validationClass
	 */
	public String getValidationClass() {
		return validationClass;
	}
	/**
	 * @param validationClass the validationClass to set
	 */
	public void setValidationClass(String validationClass) {
		this.validationClass = validationClass;
	}
}
