package com.hin.web;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.richfaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.hin.hl7messaging.web.LookupUpdateStatus;
import com.hin.web.base.BaseBean;

/**
 * @author sreekumar.s
 * 
 */

@Component("processUploadBean")
@Scope("session")
public class ProcessUploadBean extends BaseBean {

	/**
	 * 
	 */
	
	@Autowired
	LookupUpdateController lookupUpdateController;
	
	List<LookupUpdateStatus> updatedProcessList = new ArrayList<LookupUpdateStatus>();
	
	private static final long serialVersionUID = 1L;

	private Logger logger = Logger.getLogger(ProcessUploadBean.class.getName());

	public void fileUploaded(FileUploadEvent event) {
		try {
			InputStream inp = event.getUploadedFile().getInputStream();
			updatedProcessList.clear();
			updatedProcessList = lookupUpdateController.readProcessFile(inp);
		} catch (Exception e) {
			logger.error("Error: ", e);
		}
	}

	public List<LookupUpdateStatus> getUpdatedProcessList() {
		return updatedProcessList;
	}

	public void setUpdatedProcessList(List<LookupUpdateStatus> updatedProcessList) {
		this.updatedProcessList = updatedProcessList;
	}

	


}
