/**
 * 
 */
package com.hin.hl7messaging.repository;

/**
 * @author shilpa.rao
 *
 */
public class IndexColumnFamily {

	private String name;
	private String type;
	private RowKey rowKey;
	private Column column;
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the rowKey
	 */
	public RowKey getRowKey() {
		return rowKey;
	}
	/**
	 * @param rowKey the rowKey to set
	 */
	public void setRowKey(RowKey rowKey) {
		this.rowKey = rowKey;
	}
	/**
	 * @return the column
	 */
	public Column getColumn() {
		return column;
	}
	/**
	 * @param column the column to set
	 */
	public void setColumn(Column column) {
		this.column = column;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "IndexColumnFamily [name=" + name + ", type=" + type
				+ ", rowKey=" + rowKey + ", column=" + column + "]";
	}
	
}
