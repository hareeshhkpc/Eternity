<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<%@ page import="java.io.*,java.util.*,javax.mail.*,com.sun.mail.smtp.*"%>
<%@ page import="javax.mail.internet.*,javax.activation.*"%>
<%@ page import="javax.servlet.http.*,javax.servlet.*" %>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Send Email</title>
</head>
<body>
<%
   String to = "vineeth.ng@icthealth.com";
   final String from = "dulkar123123@gmail.com";
   final String authPassword = "beet552beet552";

   Properties props = new java.util.Properties();
   
	props.put("mail.smtp.host", "smtp.gmail.com");
	//props.setProperty("mail.smtp.port", "587");
	props.put("mail.smtp.port", "465");
	props.put("mail.smtps.auth", "true");
	props.put("mail.smtp.starttls.enable", "true");
	props.put("mail.transport.protocol", "smtps");
	props.put("mail.smtp.user", from);
	//props.setProperty("mail.smtp.password", authPassword);
	
	props.put("mail.smtp.socketFactory.port", "465");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.socketFactory.fallback", "false");
	
	Session mailSession = Session.getInstance(props, new Authenticator() {
protected PasswordAuthentication getPasswordAuthentication() {
return new PasswordAuthentication(from, authPassword);
}});
	
   try{
	   
	  MimeMessage message = new MimeMessage(mailSession);
      message.setFrom(new InternetAddress(from));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSentDate(new Date());
      message.setSubject("This is the Subject Line!");
	  
	  MimeBodyPart body = new MimeBodyPart();
			body.setContent("This is actual message", "text/html");
			
			Multipart multipart = new MimeMultipart();
			multipart.addBodyPart(body);
			MimeBodyPart attachMent = new MimeBodyPart();
			File file = new File(application.getRealPath("Test/Email.html"));
			attachMent.attachFile(file);
			attachMent.setFileName("Email");
			multipart.addBodyPart(attachMent);
			message.setContent(multipart);
      
      message.saveChanges(); 

	 Transport transport = mailSession.getTransport("smtps");
	 transport.connect("smtp.gmail.com",from ,authPassword);
	 transport.sendMessage(message,message.getAllRecipients());
	 
	 transport.close();
   }catch (MessagingException mex) {
      out.println(mex);
   }
%>

</body>
</html>