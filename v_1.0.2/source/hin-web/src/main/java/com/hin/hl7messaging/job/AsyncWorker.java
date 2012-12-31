package com.hin.hl7messaging.job;

import org.apache.log4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * An asynchronous worker
 */
@Component("asyncWorker")
public class AsyncWorker implements Worker {

	protected static Logger logger = Logger.getLogger("service");

	/**
	 * This method will be wrapped in a proxy so that the method is actually
	 * invoked by a TaskExecutor instance
	 */
	@Async
	public void work() {
		String threadName = Thread.currentThread().getName();
		logger.debug("   " + threadName + " has began working.");
		System.out.println("   " + threadName + " has began working.");
		try {
			logger.debug("working...");
			System.out.println("working...");
			Thread.sleep(10000); // simulates work
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
		}
		logger.debug("   " + threadName + " has completed work.");
		System.out.println("   " + threadName + " has completed work.");
	}
}
