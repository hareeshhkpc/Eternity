package com.hin.hl7messaging.job;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hin.hl7messaging.web.service.api.ISyncService;

/**
 * A synchronous worker
 */
@Component("syncWorker")
public class SyncWorker implements Worker {

	@Autowired
	private ISyncService syncService;

	protected static Logger logger = Logger.getLogger("service");

	public void work() {
		String threadName = Thread.currentThread().getName();
		logger.debug("   " + threadName + " has began working.");
		// System.out.println(threadName + " has began working.");
		try {
			if (syncService.isPause() && !syncService.isQueueEmpty()) {
				logger.debug("Please wait service will be stopping ...");
			} else if (syncService.isPause()) {
				logger.debug("Service is  stopped ...");
			} else if (!syncService.isQueueEmpty()) {
				logger.debug("Please wait synchronization is goining on...");
			} else {
				logger.debug("Ready for the next synchronization...");
			}

			if (syncService.isQueueEmpty() && !syncService.isPause()) {
				logger.debug("Synchronize is called...");
				syncService.doSynchronize();
			}
			/*
			 * else { syncService.addToQueue(); logger.debug("Added to queue");
			 * System.out.println("Added to queue"); }
			 */

			Thread.sleep(100); // simulates work
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			logger.debug("Failed");
		}
		logger.debug("   " + threadName + " has completed work.");
		// System.out.println(threadName + " has completed work.");
	}
}
