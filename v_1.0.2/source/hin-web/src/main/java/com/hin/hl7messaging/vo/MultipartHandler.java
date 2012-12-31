package com.hin.hl7messaging.vo;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

public class MultipartHandler {
	HttpServletRequest request;
	HashMap<String, FileItem> uploadMessageMap = new HashMap<String, FileItem>();
	private List<?> items = null;
	private Logger logger = Logger.getLogger(MultipartHandler.class.getName());

	public MultipartHandler(HttpServletRequest request) {
		this.request = request;
	}
	
	public static boolean isMultipartRequest(HttpServletRequest request){
		return ServletFileUpload.isMultipartContent(request);
	}

	public void parse() throws Exception {
		DiskFileItemFactory fileItemFactory = new DiskFileItemFactory();
		/*
		 * Set the size threshold, above which content will be stored on disk.
		 */
		fileItemFactory.setSizeThreshold(1 * 1024 * 1024); // 1 MB
		/*
		 * Set the temporary directory to store the uploaded files of size above
		 * threshold.
		 */
		// fileItemFactory.setRepository(tmpDir);

		ServletFileUpload uploadHandler = new ServletFileUpload(fileItemFactory);

		try {
			/*
			 * Parse the request
			 */
			items = uploadHandler.parseRequest(request);
			if(!items.isEmpty()){
				Iterator<?> itr = items.iterator();
				while (itr.hasNext()) {
					FileItem item = (FileItem) itr.next();
					uploadMessageMap.put(item.getFieldName(), item);
				}
			}

		} catch (FileUploadException ex) {
			//throw new Exception("Could not get uploaded data", ex);
			logger.error("An error occurred while uploading the file: "+ex.getMessage());
		} catch (Exception ex) {
			//throw new Exception("Could not get uploaded data", ex);
			logger.error("An error occured in parsing the file"+ex.getMessage());
		}
	}

	private StringBuffer extractUploadedFile(FileItem item) throws IOException {
		StringBuffer fileData = new StringBuffer();
		byte[] buffer = new byte[2048];
		InputStream in = item.getInputStream();
		int readLen = -1;
		while ((readLen = in.read(buffer)) > -1) {
			fileData.append(new String(buffer, 0, readLen));
		}
		in.close();
		return fileData;
	}

	public String getParameter(String param) throws IOException {
		FileItem item = uploadMessageMap.get(param);
		String value = "";
		if(item == null) return null;
		if (item.isFormField())
		{
			value = item.getString();
		} else {
			// Handle Uploaded files.
			//System.out.println("handle uploaded file");
			//System.out.println(" size" + item.getSize());
			//System.out.println("Field Name = " + item.getFieldName()+ ", File Name = " + item.getName()+ ", Content type = " + item.getContentType()+ ", File Size = " + item.getSize());

			StringBuffer fileData = extractUploadedFile(item);
			value = fileData.toString();
		}
		return value;
	}
	public FileItem getFileParameter(String param) throws IOException{
		FileItem item = uploadMessageMap.get(param);
		return item;
	}
	
}
