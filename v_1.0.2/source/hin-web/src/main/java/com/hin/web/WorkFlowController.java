package com.hin.web;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.http.HttpServletRequest;
import javax.mail.PasswordAuthentication;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.ListItem;
import com.hin.domain.ProcessMessageFilterCondition;
import com.hin.domain.vo.MessageVO;
import com.hin.domain.vo.TaskVO;
import com.hin.domain.vo.UserVO;
import com.hin.hl7messaging.WorkFlowTask;
import com.hin.hl7messaging.api.IAuthenticationService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.ISearchService;
import com.hin.hl7messaging.service.IWorkFlowTask;
import com.hin.messaging.IWorkFlowProvider;

@Controller
public class WorkFlowController {

	private Logger logger = Logger.getLogger(WorkFlowController.class.getName());
	
	@Autowired
	IWorkFlowProvider workFlowProvider;

	@Autowired
	IMessageService messageService;

	@Autowired
	ISearchService searchService;

	@Value("${attachment.file}")
	String filePath;
	
	@Value("${emailTemplate.file}")
	String emailTemplate;
	
	@Value("${FileAttachment.ATTACHMENT_DIR}")
	String fileAttachmentPath;

	@Value("${tomcat.path}")
	String tomcatPath;
	


	@RequestMapping(value = "/createNewTask", method = RequestMethod.POST)
	public @ResponseBody
	String createNewTask(HttpServletRequest request) throws Exception {
		String data = "";
		Gson gson = new GsonBuilder().create();
		IWorkFlowTask workFlowtask = null;
		String  message = "", userId="";
		MessageVO messageVO=new MessageVO();
		try {

			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				try {
					MultipartFile multipartFile = multipartHttpServletRequest
							.getFile("message");
					message = new String(multipartFile.getBytes());
					messageVO=messageService.createMessageVO(message);
				} catch (Exception ex) {
					ex.printStackTrace();
					return data;				}
				if(multipartHttpServletRequest.getParameter("signUp").equals("true")){
					userId=messageVO.getId();
				}else{
					UserVO user = (UserVO) RequestContextHolder.getRequestAttributes()
							.getAttribute(IAuthenticationService.LOGGED_IN_USER,
									RequestAttributes.SCOPE_SESSION);
					if(user==null){
						throw new Exception("Login Session expired.");
					}
					userId=user.getSubscriberId();
				}
			}
			/*Job job=new Job();
			job.setMessageService(messageService);
			job.setWorkFlowProvider(workFlowProvider);
			job.setMessage(message);
			job.setUserId(userId);
			HINApplicationContext.getHINApplicationContext().getJobExecutor().execute(job);*/
			workFlowtask = workFlowProvider.createNewTask(
					userId, messageVO);
			System.out.println("Message created sucessfully");

		} catch (Exception ex) {
			logger.error("Error creating new task :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		if (workFlowtask != null) {
			data = gson.toJson(workFlowtask);
		}

		return data;
	}



	@RequestMapping(value = "/getMessageStatus", method = RequestMethod.GET)
	public @ResponseBody
	String getMessageStatus(@RequestParam String messageID) throws Exception{
		String data = "";
		Gson gson = new GsonBuilder().create();
		IWorkFlowTask workFlowtask = null;
		try {
/*			workFlowtask = workFlowProvider.createNewTask("userId", "message",
					"", messageID);*/
		} catch (Exception ex) {
			logger.error("Error getting message status :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		if (workFlowtask != null) {
			data = gson.toJson(workFlowtask);
		}

		return data;
	}

	@RequestMapping(value = "/getMessage", method = RequestMethod.GET)
	public @ResponseBody
	String getMessage(@RequestParam String messageId,@RequestParam String organizationId) throws Exception {
		/*
		 * String data = ""; Gson gson = new GsonBuilder().create();
		 */
		String message = "";
		try {
			message = messageService.getMessage(messageId,organizationId);
		} catch (Exception ex) {
			logger.error("Error while getting message :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		/*
		 * if (Message != null) { data = gson.toJson(Message); }
		 */

		return message;
	}

	@RequestMapping(value = "/getNewId", method = RequestMethod.GET)
	public @ResponseBody
	String getNewId() {
		String data = "";
		Gson gson = new GsonBuilder().create();
		String messageKey = "";
		try {
			messageKey = workFlowProvider.getNewMessageKey();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (messageKey != null) {
			data = gson.toJson(messageKey);
		}

		return data;
	}

/*	@RequestMapping(value = "/emailContent", method = RequestMethod.GET)
	public @ResponseBody
	String emailContent() {
		String data = "", files = "";
		Gson gson = new GsonBuilder().create();
		File folder = new File(tomcatPath + filePath);
		File[] listOfFiles = folder.listFiles();

		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isFile()) {
				files = listOfFiles[i].getName();
				if (files.endsWith(".txt") || files.endsWith(".TXT")) {
					File file = new File(tomcatPath + filePath + "//" + files);
					StringBuilder fileContents = new StringBuilder(
							(int) file.length());
					Scanner scanner = null;
					try {
						scanner = new Scanner(file);
					} catch (FileNotFoundException e) {
						logger.error("Error :" + e);
					}
					String lineSeparator = System.getProperty("line.separator");

					try {
						while (scanner.hasNextLine()) {
							fileContents.append(scanner.nextLine()
									+ lineSeparator);
						}
						data = fileContents.toString();
					} finally {
						scanner.close();
					}
				}
			}
		}
		data = gson.toJson(data);
		return data;
	}*/
	
	@RequestMapping(value = "/emailTemplate", method = RequestMethod.GET)
	public @ResponseBody String emailTemplate(@RequestParam String emailType) {
		
		File file = new File(tomcatPath + emailTemplate + "/" + emailType + ".txt");
		Gson gson = new GsonBuilder().create();
		BufferedReader reader;
		String data="";
		try {
			reader = new BufferedReader( new FileReader (file));
		
		    String line = null;
		    StringBuilder  stringBuilder = new StringBuilder();
		    String ls = System.getProperty("line.separator");
	
		    while( ( line = reader.readLine() ) != null ) {
		        stringBuilder.append( line );
		        stringBuilder.append( ls );
		    }
		    
		    data = stringBuilder.toString();
		} catch (FileNotFoundException e) {
			logger.error("Email Template Not Found :" + e);
		} catch (IOException e) {
			logger.error("Email Template Error :" + e);
		}
		data = gson.toJson(data);
		return data;
	}


	@RequestMapping(value = "/sendEmail", method = RequestMethod.GET)
	public @ResponseBody
	String sendEmail(@RequestParam String email,
			@RequestParam String messageText, @RequestParam String from,
			@RequestParam String authPassword, @RequestParam String subject, @RequestParam HashMap<String, String> licenseeAttachment) {

		String data = "success", fileId, fileAttachmentName;
		Gson gson = new GsonBuilder().create();
		final String mailAuthPassword = authPassword; 
		final String mailAuthId = from; 
		
		ProcessMessageFilterCondition processMessageFilterCondition = gson
				.fromJson(licenseeAttachment.get("licenseeAttachment"),
						ProcessMessageFilterCondition.class);
		List<ListItem> conditionMaps = processMessageFilterCondition.getMaps();
		
		String host = "smtp.gmail.com";
		
		Properties props = new java.util.Properties();
		
		props.put("mail.smtp.host", host);
		props.put("mail.smtp.port", "465");
		props.put("mail.smtps.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.transport.protocol", "smtps");
		props.put("mail.smtp.user", from);
		props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.fallback", "false");
		
        Session mailSession = Session.getInstance(props, new Authenticator() {
	    	protected PasswordAuthentication getPasswordAuthentication() {
	    		return new PasswordAuthentication(mailAuthId, mailAuthPassword);
	    	}
	    });
		
		String[] emailAddress = gson.fromJson(email, String[].class);

		try {
			Message msg = new MimeMessage(mailSession);
			msg.setFrom(new InternetAddress(from));

			InternetAddress[] address = new InternetAddress[emailAddress.length];
			
			for (int i = 0; i < emailAddress.length; i++){
			    address[i] =  new InternetAddress(emailAddress[i]);
			}
			
			msg.setRecipients(Message.RecipientType.TO, address);
			msg.setSentDate(new Date());
			msg.setSubject(subject);
			
			MimeBodyPart body = new MimeBodyPart();
			body.setContent(messageText, "text/html");
			
			Multipart multipart = new MimeMultipart("mixed");
			multipart.addBodyPart(body);
			
			// for attachment
			for (ListItem listItem : conditionMaps) {
				if (!listItem.getKey().isEmpty() && !listItem.getValue().isEmpty()) {
					fileId = listItem.getKey().toString();
					fileAttachmentName = (listItem.getValue().toString()).split("\\.")[1];
					MimeBodyPart attachMent = new MimeBodyPart();
					File file = new File(fileAttachmentPath + "//" + fileId + "." + fileAttachmentName);
					Boolean exist = file.exists();
					if(exist){
						attachMent.attachFile(file);
						attachMent.setFileName(listItem.getValue().toString());
						multipart.addBodyPart(attachMent);
						msg.setContent(multipart);
					}
				}
			}
			
			msg.setContent(multipart);
			
			Transport transport = mailSession.getTransport("smtps");
			transport.connect(host, from, authPassword);
			transport.sendMessage(msg, msg.getAllRecipients());
			transport.close();
			data = gson.toJson(data);
			return data;
			
		} catch (Exception mex) {
			logger.error("Error :" + mex);
			data = "fail";
			data = gson.toJson(data);
			return data;
		}
	}

	@RequestMapping(value = "/completeTask", method = RequestMethod.POST)
	public @ResponseBody
	String completeTask(HttpServletRequest request) throws Exception {

		String taskId = "";
		String outCome = "";
		String AssigneId = "";
		String message = "";
		if (request instanceof MultipartHttpServletRequest) {
			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
			taskId = multipartHttpServletRequest.getParameter("taskId");
			outCome = multipartHttpServletRequest.getParameter("outCome");
			AssigneId = multipartHttpServletRequest.getParameter("AssigneId");

			try {
				MultipartFile multipartFile = multipartHttpServletRequest
						.getFile("message");
				message = new String(multipartFile.getBytes());
			} catch (Exception ex) {
				logger.error("Message not received from client :"+ex.getMessage(), ex);
				ex.printStackTrace();
				throw ex;
			}
		}
		// temporary
		UserVO user = (UserVO) RequestContextHolder.getRequestAttributes()
				.getAttribute(IAuthenticationService.LOGGED_IN_USER,
						RequestAttributes.SCOPE_SESSION);
		AssigneId = user.getSubscriberId();
		String data = "";
		Gson gson = new GsonBuilder().create();
		Boolean taskCompleted = Boolean.FALSE;
		try {
			taskCompleted = workFlowProvider.taskDone(taskId, outCome,
					AssigneId, message);
			System.out.println("Message saved sucessfully");
		} catch (Exception ex) {
			logger.error("Error while compeleting message :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		data = gson.toJson(taskCompleted);
		return data;
	}

	@RequestMapping(value = "/getUserTaskForMessageId", method = RequestMethod.GET)
	public @ResponseBody
	String getUserTaskForMessageId(@RequestParam String messageId) throws Exception {
		String data = "";
		Gson gson = new GsonBuilder().create();
		IWorkFlowTask workFlowtask = null;
		try {
			UserVO user = (UserVO) RequestContextHolder.getRequestAttributes()
					.getAttribute(IAuthenticationService.LOGGED_IN_USER,
							RequestAttributes.SCOPE_SESSION);
			if (user != null) {
				workFlowtask = workFlowProvider.getUserTask(
						user.getSubscriberId(), messageId);
				
			}

		} catch (Exception ex) {
			logger.error("Geting task for messageID :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		if (workFlowtask != null) {
			data = gson.toJson(convertToTaskVO(workFlowtask));
		}

		return data;
	}
/*
	private List<WorkFlowTask> setAssignableUsersForWorkFlowList(
			List<WorkFlowTask> workFlowTasks) {
		for (WorkFlowTask workFlowTask : workFlowTasks) {
			setAssignableUsers(workFlowTask);
		}
		return workFlowTasks;
	}*/

	

	private List<TaskVO> convertToTaskVOList(List<WorkFlowTask> workFlowTasks) {
		List<TaskVO> taskVOList = new ArrayList<TaskVO>();
		for (WorkFlowTask workFlowTask : workFlowTasks) {
			TaskVO taskVo = convertToTaskVO(workFlowTask);
			taskVOList.add(taskVo);
		}
		return taskVOList;
	}

	private TaskVO convertToTaskVO(IWorkFlowTask workFlowtask) {
		TaskVO taskVo = new TaskVO();
		taskVo.setAssignablePeople(workFlowtask.getAssignablePeople());
		taskVo.setMessageID(workFlowtask.getUserProcessKey());
		taskVo.setTaskId(workFlowtask.getTaskId());
		taskVo.setTaskOutComes(workFlowtask.getTaskOutComes());
		return taskVo;
	}

	@RequestMapping(value = "/getMessageList", method = RequestMethod.GET)
	public @ResponseBody
	String getMessageList(@RequestParam String patientId,
			@RequestParam HashMap<String, String> conditionMap,
			@RequestParam boolean messageRequired,@RequestParam String organizationId)throws Exception {
		String data = "";
		Gson gson = new GsonBuilder().create();
		List<com.hin.domain.Message> messageList = null;
		try {
			/*
			 * UserVO user = (UserVO)
			 * RequestContextHolder.getRequestAttributes()
			 * .getAttribute(IAuthenticationService.LOGGED_IN_USER,
			 * RequestAttributes.SCOPE_SESSION);
			 */
			if (patientId != null) {
				ProcessMessageFilterCondition processMessageFilterCondition = gson
						.fromJson(conditionMap.get("conditionMap"),
								ProcessMessageFilterCondition.class);
				messageList = messageService.getUserMessagesForCondition(
						patientId, processMessageFilterCondition,
						messageRequired,organizationId);
			}

		} catch (Exception ex) {
			logger.error("Error while querying message for conditions :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		if (messageList != null) {
			data = gson.toJson(messageList);
		}

		return data;
	}

	@RequestMapping(value = "/finishTask", method = RequestMethod.POST)
	public @ResponseBody
	String finishTask(HttpServletRequest request) throws Exception {
		String taskId = "";
		String data = "";
		if (request instanceof MultipartHttpServletRequest) {
			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
			taskId = multipartHttpServletRequest.getParameter("taskId");
			if (taskId == null || taskId.length() <= 0)
				return createNewTask(request);
			else
				return completeTask(request);
		}
		return data;
	}
	
	
	@RequestMapping(value = "/createUser", method = RequestMethod.POST)
	public @ResponseBody
	String createUser(HttpServletRequest request) throws Exception {
		String data = "";
		String message = "", messageId = "",role="patient",userId="";
		try {

			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				messageId = multipartHttpServletRequest
						.getParameter("messageId");

				try {
					MultipartFile multipartFile = multipartHttpServletRequest
							.getFile("message");
					message = new String(multipartFile.getBytes());
					role = multipartHttpServletRequest.getParameter("role");
					userId = multipartHttpServletRequest.getParameter("userId");
					/* id=getMessageId(message); */
				} catch (Exception ex) {
					ex.printStackTrace();
					return data;
				}
			}
			MessageVO messageVO = messageService.createMessageVO(message);
			messageService.createUser(messageVO);
			System.out.println("USer created sucessfully");

		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
		return data;
	}
	
	@RequestMapping(value = "/updateMessage", method = RequestMethod.POST)
	public @ResponseBody
	String updateMessage(HttpServletRequest request) throws Exception {
		String message = "",messageId="";
		if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				messageId = multipartHttpServletRequest
						.getParameter("messageId");

				try {
					MultipartFile multipartFile = multipartHttpServletRequest
							.getFile("message");
					message = new String(multipartFile.getBytes());
/*					MessageVO messageVO=new MessageVO();
					messageVO.setId(messageId);
					messageVO.setMessage(message);
					workFlowProvider.updateMessage(messageVO);*/
					MessageVO messageVO = messageService.createMessageVO(message);
					messageService.updateMessage(messageVO);
				} catch (Exception ex) {
					ex.printStackTrace();
					throw ex;
				}
			}
			
		return message;
	}
	
	@RequestMapping(value = "/signUp", method = RequestMethod.POST)
	public @ResponseBody
	String signUpUser(HttpServletRequest request) throws Exception {
		String data = "";
		String message = "";
		try {

			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				try {
					MultipartFile multipartFile = multipartHttpServletRequest
							.getFile("message");
					message = new String(multipartFile.getBytes());
				} catch (Exception ex) {
					ex.printStackTrace();
					return data;
				}
			}
			MessageVO messageVO = messageService.createMessageVO(message);
			messageService.saveMessage(messageVO);
			System.out.println("USer created sucessfully");

		} catch (Exception ex) {
			logger.error("Error while saving sign up message :"+ex.getMessage(), ex);
			ex.printStackTrace();
			throw ex;
		}
		return data;
	}
	
	@RequestMapping(value = "/getNewUserId", method = RequestMethod.GET)
	public @ResponseBody
	String getNewUserId(String organizationId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		String newUserId = "";
		try {
			newUserId = messageService.getNewPatientCode(organizationId);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (newUserId != null) {
			data = gson.toJson(newUserId);
		}

		return data;
	}
	
	@RequestMapping(value = "/getNewInvoiceId", method = RequestMethod.GET)
	public @ResponseBody
	String getNewInvoiceId(String organizationId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		String newInvoiceId = "";
		try {
			newInvoiceId = messageService.getNewInvoiceCode(organizationId);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (newInvoiceId != null) {
			data = gson.toJson(newInvoiceId);
		}

		return data;
	}
	
	@RequestMapping(value = "/getNewReceiptId", method = RequestMethod.GET)
	public @ResponseBody
	String getNewReceiptId(String organizationId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		String newInvoiceId = "";
		try {
			newInvoiceId = messageService.getNewReceiptCode(organizationId);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (newInvoiceId != null) {
			data = gson.toJson(newInvoiceId);
		}

		return data;
	}
	
	@RequestMapping(value = "/getNewLicenseeInvoiceId", method = RequestMethod.GET)
	public @ResponseBody
	String getNewLicenseeInvoiceId(String organizationId) {
		String data = "";
		Gson gson = new GsonBuilder().create();
		String newInvoiceId = "";
		try {
			newInvoiceId = messageService.getNewLicenseeInvoiceCode(organizationId);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		if (newInvoiceId != null) {
			data = gson.toJson(newInvoiceId);
		}

		return data;
	}
}
