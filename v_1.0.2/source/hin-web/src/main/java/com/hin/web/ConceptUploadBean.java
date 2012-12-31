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

@Component("conceptUploadBean")
@Scope("session")
public class ConceptUploadBean extends BaseBean {

	/**
	 * 
	 */
	
	@Autowired
	LookupUpdateController lookupUpdateController;
	
	List<LookupUpdateStatus> updatedConceptsList = new ArrayList<LookupUpdateStatus>();
	
	private static final long serialVersionUID = 1L;

	private Logger logger = Logger.getLogger(ConceptUploadBean.class.getName());

	public void fileUploaded(FileUploadEvent event) {
		try {
			InputStream inp = event.getUploadedFile().getInputStream();
			updatedConceptsList.clear();
			updatedConceptsList = lookupUpdateController.readConceptFile(inp);
		} catch (Exception e) {
			logger.error("Error: ", e);
		}
	}

	public List<LookupUpdateStatus> getUpdatedConceptsList() {
		return updatedConceptsList;
	}

	public void setUpdatedConceptsList(List<LookupUpdateStatus> updatedConceptsList) {
		this.updatedConceptsList = updatedConceptsList;
	}


}
