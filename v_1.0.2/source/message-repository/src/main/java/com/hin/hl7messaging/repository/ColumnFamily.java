/**
 * 
 */
package com.hin.hl7messaging.repository;

/**
 * @author shilpa.rao
 *
 */
public class ColumnFamily {

	public enum ColumnFamilyType {		
		STANDARD("STANDARD"), SUPER("SUPER");
		private String name;
		private ColumnFamilyType(String typeName){
			this.setName(typeName);
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
	};
	
	private String name;
	private ColumnFamilyType type;
	private RowKey rowKey;
	private Column column;
	
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public ColumnFamilyType getType() {
		return type;
	}
	public void setType(ColumnFamilyType type) {
		this.type = type;
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
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ColumnFamily [name=" + name + ", type=" + type + ", rowKey="
				+ rowKey + ", column=" + column + "]";
	}
}
