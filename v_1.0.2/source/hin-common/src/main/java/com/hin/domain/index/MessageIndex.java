/**
 * 
 */
package com.hin.domain.index;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;



/**
 * @author Administrator
 *
 */
@Entity
public class MessageIndex {

	 @Id
	 @GeneratedValue(strategy = GenerationType.AUTO)
	 private Long id;
	 
	 private String messageType;
	 
	 private Date effectiveTime;
	 
	 private String program;
	 
	 private float transaction_amount;
	 
	 @ManyToOne
	 private IndexAttribute index_attribute_id;
	 
	/**
	 * @return the id
	 */
	public Long getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(Long id) {
		this.id = id;
	}
	/**
	 * @return the messageType
	 */
	public String getMessageType() {
		return messageType;
	}
	/**
	 * @param messageType the messageType to set
	 */
	public void setMessageType(String messageType) {
		this.messageType = messageType;
	}
	/**
	 * @return the effectiveTime
	 */
	public Date getEffectiveTime() {
		return effectiveTime;
	}
	/**
	 * @param effectiveTime the effectiveTime to set
	 */
	public void setEffectiveTime(Date effectiveTime) {
		this.effectiveTime = effectiveTime;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "MessageIndex [id=" + id + ", messageType=" + messageType
				+ ", effectiveTime=" + effectiveTime + "]";
	}
	public String getProgram() {
		return program;
	}
	public void setProgram(String program) {
		this.program = program;
	}
	public float getTransaction_amount() {
		return transaction_amount;
	}
	public void setTransaction_amount(float transaction_amount) {
		this.transaction_amount = transaction_amount;
	}
	public IndexAttribute getIndex_attribute_id() {
		return index_attribute_id;
	}
	public void setIndex_attribute_id(IndexAttribute index_attribute_id) {
		this.index_attribute_id = index_attribute_id;
	}
	 
}
