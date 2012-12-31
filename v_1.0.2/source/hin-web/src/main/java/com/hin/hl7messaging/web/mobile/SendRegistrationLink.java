package com.hin.hl7messaging.web.mobile;

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

public class SendRegistrationLink {
	
public static void main(String[] args) {
	String to = "salam.halley@icthealth.com";
	String from = "krishna.lr@icthealth.com";
	String url = "http://172.25.250.163:8081/hin-web/mobile/register/html/LinkedProfile.html/1019";
	sendMail(to, from, url);
}

public static void sendMail(String to, String from, String url){
	String host = "mail.icthealth.com";
	String subject = "Register with us";
	String messageText = "A registration has been submitted on your behalf, link it with your existing profile or"
	+ " or use it to create new account if you don't have one\n\n Please find the below link:\n "+ url;
	boolean sessionDebug = false;
	// Create some properties and get the default Session.
	Properties props = System.getProperties();
	props.put("mail.host", host);
	props.put("mail.transport.protocol", "smtp");
	Session session = Session.getDefaultInstance(props, null);
	// Set debug on the Session so we can see what is going on
	// Passing false will not echo debug info, and passing true
	// will.
	session.setDebug(sessionDebug);
	try {
	// Instantiate a new MimeMessage and fill it with the
	// required information.
	Message msg = new MimeMessage(session);
	msg.setFrom(new InternetAddress(from));
	InternetAddress[] address = {new InternetAddress(to)};
	msg.setRecipients(Message.RecipientType.TO, address);
	msg.setSubject(subject);
	msg.setSentDate(new Date());
	msg.setText(messageText);
	// Hand the message to the default transport service
	// for delivery.
	Transport.send(msg);
	}
	catch (MessagingException mex) {
	mex.printStackTrace();
	}
}
}
