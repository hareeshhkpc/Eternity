package org.jwebsocket.chat;

import java.util.Calendar;
import java.util.GregorianCalendar;

public class MessageRequest {

	private String requestType;
	private String profileId;
	private String messages;
	GregorianCalendar gc = new GregorianCalendar();
    String directory = gc.get(Calendar.YEAR)+"-"+(gc.get(Calendar.MONTH)+1)+"-"+gc.get(Calendar.DATE); 
    String fileName = gc.get(Calendar.HOUR)+"-"+gc.get(Calendar.MINUTE)+"-"+gc.get(Calendar.MILLISECOND)+".xml";
    String path = "c:/chat/";
    
	public String getRequestType() {
		return requestType;
	}
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}
	public String getProfileId() {
		return profileId;
	}
	public void setProfileId(String profileId) {
		this.profileId = profileId;
	}
	public String getDirectory() {
		return directory;
	}
	public void setDirectory(String directory) {
		this.directory = directory;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getMessages() {
		return messages;
	}
	public void setMessages(String messages) {
		this.messages = messages;
	}
}
