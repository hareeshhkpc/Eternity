package com.hin.web;

import java.util.Collections;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.data.annotation.Transient;
import org.springframework.stereotype.Component;

import com.hin.hl7messaging.vo.CouchChange;
import com.hin.hl7messaging.web.service.api.ISyncService;
import com.hin.web.base.BaseBean;

/**
 * @author sreekumar.s
 * 
 */

@Component("syncBean")
@Scope("session")
public class SyncBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Logger logger = Logger.getLogger(SyncBean.class.getName());

	@Transient
	@Autowired
	private ISyncService syncService;

	private Queue<CouchChange> couchChangeList = new LinkedList<CouchChange>();
	private Stack<CouchChange> couchSuccessList = new Stack<CouchChange>();
	private Stack<CouchChange> couchPendingList = new Stack<CouchChange>();
	private Stack<CouchChange> couchFailureList = new Stack<CouchChange>();

	private int sequence = 0;
	private boolean running = true;

	/**
	 * @return the logger
	 */
	public Logger getLogger() {
		return logger;
	}

	/**
	 * @param logger
	 *            the logger to set
	 */
	public void setLogger(Logger logger) {
		this.logger = logger;
	}

	/**
	 * @return the syncService
	 */
	public ISyncService getSyncService() {
		return syncService;
	}

	/**
	 * @param syncService
	 *            the syncService to set
	 */
	public void setSyncService(ISyncService syncService) {
		this.syncService = syncService;
	}

	/**
	 * @return the couchChangeList
	 */
	public Queue<CouchChange> getCouchChangeList() {
		couchChangeList = syncService.getQueue();
		return couchChangeList;
	}

	/**
	 * @param couchChangeList
	 *            the couchChangeList to set
	 */
	public void setCouchChangeList(Queue<CouchChange> couchChangeList) {
		this.couchChangeList = couchChangeList;
	}

	/**
	 * @return the couchSuccessList
	 */
	public Stack<CouchChange> getCouchSuccessList() {
		couchSuccessList = syncService.getSuccessQueue();
		return couchSuccessList;

	}

	/**
	 * @param couchSuccessList
	 *            the couchSuccessList to set
	 */
	public void setCouchSuccessList(Stack<CouchChange> couchSuccessList) {
		this.couchSuccessList = couchSuccessList;
	}

	/**
	 * @return the couchFailureList
	 */
	public Stack<CouchChange> getCouchFailureList() {
		couchFailureList = syncService.getFailedQueue();
		// Collections.reverse(couchFailureList);
		return couchFailureList;
	}

	/**
	 * @param couchFailureList
	 *            the couchFailureList to set
	 */
	public void setCouchFailureList(Stack<CouchChange> couchFailureList) {
		this.couchFailureList = couchFailureList;
	}

	public String viewSync() {
		return "synclist";
	}

	/**
	 * @return the couchPendingList
	 */
	public Stack<CouchChange> getCouchPendingList() {
		couchPendingList = syncService.getPendingQueue();
		// Collections.reverse(couchPendingList);
		return couchPendingList;
	}

	/**
	 * @param couchPendingList
	 *            the couchPendingList to set
	 */
	public void setCouchPendingList(Stack<CouchChange> couchPendingList) {
		this.couchPendingList = couchPendingList;
	}

	public int resetSequence() {
		return syncService.resetSequence(sequence);
	}

	public boolean clearQueue() {
		return syncService.clearQueue();
	}

	/**
	 * @return the sequence
	 */
	public int getSequence() {
		return sequence;
	}

	/**
	 * @param sequence
	 *            the sequence to set
	 */
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public void startService() {
		syncService.start();
	}

	public void stopService() {
		syncService.stop();
	}

	/**
	 * @return the running
	 */
	public boolean isRunning() {
		// if (!syncService.isStopped())
		sequence = syncService.getLastSequence();
		running = !syncService.isStopped();
		return running;
	}

	/**
	 * @param running
	 *            the running to set
	 */
	public void setRunning(boolean running) {
		this.running = running;
	}

}
