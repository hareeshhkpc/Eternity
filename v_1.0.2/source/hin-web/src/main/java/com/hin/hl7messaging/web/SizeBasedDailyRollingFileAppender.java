package com.hin.hl7messaging.web;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.apache.log4j.RollingFileAppender;
import org.apache.log4j.spi.LoggingEvent;

public class SizeBasedDailyRollingFileAppender extends RollingFileAppender {

	private Date today = DateUtil.getDate(new Date(), "dd/MM/yyyy");
	
	private long nextCheckTime;
	
	private String datePattern = "-dd-MM-yyyy";
	
	SimpleDateFormat sdf;
	
	private String specifiedFileName;
	
	private Logger logger = Logger.getLogger(SizeBasedDailyRollingFileAppender.class.getName());
	
	protected void rolloverforDate() {
		if (datePattern == null) {
		    errorHandler.error("Missing DatePattern option in rollOver().");
		    return;
		}

		String datedFilename = specifiedFileName+sdf.format(today)+".log";
		// It is too early to roll over because we are still within the
		// bounds of the current interval. Rollover will occur once the
		// next interval is reached.
		    if (fileName.equals(datedFilename)) {
		      return;
		    }

		    // close current file, and rename it to datedFilename
		    this.closeFile();

		    File target  = new File(datedFilename);
		    if (target.exists()) {
		      target.delete();
		    }

		    try {
		      // This will also close the file. This is OK since multiple
		      // close operations are safe.
		      this.setFile(datedFilename, false, this.bufferedIO, this.bufferSize);
		    } catch(IOException e) {
		      errorHandler.error("setFile("+fileName+", false) call failed.");
		      logger.error("setFile("+fileName+", false) call failed. "+e.getMessage());
		    }
//		    maxBackupIndex = 1;
	}

	@Override
	protected void subAppend(LoggingEvent event) {
		long currentTime = System.currentTimeMillis();
		if (currentTime > nextCheckTime) {
			nextCheckTime = DateUtil.getDateAfterSpecifiedDays(today, 1).getTime();
			today.setTime(currentTime);
			rolloverforDate();
		}
		super.subAppend(event);
	}

	public String getDatePattern() {
		return datePattern;
	}

	public void setDatePattern(String datePattern) {
		this.datePattern = datePattern;
		 sdf = new SimpleDateFormat(datePattern);
		 nextCheckTime = DateUtil.getDateAfterSpecifiedDays(today, 1).getTime();
	}
	
	@Override
	public void setFile(String file) {
		specifiedFileName = file;
		if(sdf == null){
			sdf = new SimpleDateFormat(datePattern);
		}
		super.setFile(file+sdf.format(today)+".log");
	}

}
