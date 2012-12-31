/**
 * 
 */
package com.hin.hl7messaging.repository;

import java.util.ArrayList;
import java.util.List;

/**
 * @author shilpa.rao
 *
 */
public class MessageStorageConfig {

	private ColumnFamily columnFamily;
	private List<IndexColumnFamily> indexes;
	
	/**
	 * 
	 */
	public MessageStorageConfig() {
		indexes = new ArrayList<IndexColumnFamily>();
	}
	/**
	 * @return the columnFamily
	 */
	public ColumnFamily getColumnFamily() {
		return columnFamily;
	}
	/**
	 * @param columnFamily the columnFamily to set
	 */
	public void setColumnFamily(ColumnFamily columnFamily) {
		this.columnFamily = columnFamily;
	}
	/**
	 * @return the indexes
	 */
	public List<IndexColumnFamily> getIndexes() {
		return indexes;
	}
	/**
	 * @param indexes the indexes to set
	 */
	public void setIndexes(List<IndexColumnFamily> indexes) {
		this.indexes = indexes;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MessageStorageConfig [columnFamily=" + columnFamily
				+ ", indexes=" + indexes + "]";
	}
	
}
