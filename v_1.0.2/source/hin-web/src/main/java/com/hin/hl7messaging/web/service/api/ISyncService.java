package com.hin.hl7messaging.web.service.api;

import java.util.Queue;
import java.util.Stack;

import com.hin.hl7messaging.vo.CouchChange;

public interface ISyncService {

	public boolean isQueueEmpty();

	public void doSynchronize();

	public boolean addToQueue();

	public boolean clearQueue();

	public int getLastSequence();

	public int resetSequence(int sequence);

	public Queue<CouchChange> getQueue();

	public Stack<CouchChange> getSuccessQueue();

	public Stack<CouchChange> getPendingQueue();

	public Stack<CouchChange> getFailedQueue();

	public boolean isPause();

	public void start();

	public void stop();

	public boolean isStopped();

}
