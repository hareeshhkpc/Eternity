/**
 * 
 */
package com.hin.hl7messaging.cassandra;

import java.nio.ByteBuffer;

/**
 * @author Administrator
 *
 */
public class ColumnEntry {

	private ByteBuffer name;
	private ByteBuffer value;
	private long time;
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
	 * @return the value
	 */
	public ByteBuffer getValue() {
		return value;
	}
	/**
	 * @param value the value to set
	 */
	public void setValue(ByteBuffer value) {
		this.value = value;
	}
	/**
	 * @return the time
	 */
	public long getTime() {
		return time;
	}
	/**
	 * @param time the time to set
	 */
	public void setTime(long time) {
		this.time = time;
	}
}
