package com.hin.hl7messaging.web.service;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hin.hl7messaging.job.Worker;

/**
 * Scheduler for handling jobs
 */
@Service
public class SchedulerService {

	protected static Logger logger = Logger.getLogger("service");

	@Autowired
	@Qualifier("syncWorker")
	private Worker worker;

	/**
	 * You can opt for cron expression or fixedRate or fixedDelay
	 * <p>
	 * See Spring Framework 3 Reference: Chapter 25.5 Annotation Support for
	 * Scheduling and Asynchronous Execution
	 */

	// @Scheduled(fixedRate=5000)
	// @Scheduled(cron = "*/5 * * * * ?")
	// @Scheduled(fixedDelay = 10000)
	public void doSchedule() {
		logger.debug("Cron schedule started ");
		worker.work();
		logger.debug("Cron schedule ended ");
	}

}
