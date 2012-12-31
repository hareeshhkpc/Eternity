package com.hin.hl7messaging.web.mobile;

import java.util.*;

import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;

public class SendEmail {
	
/*public static void main(String[] args) {
	String to = "soorej.k@imtacict.com";
	String from = "vaidyula.hari@imtacict.com";
	String url = "";
	sendMail(to, from, url);
}*/

public static void sendMailToSubscriber(String to, String from, String url, String username, String password ){
	String host = "mail.imtacict.com";
	String subject = "Activate your account";
	String messageText = "Your account has been successfully registered with us. Please find the below Login link"
	+ " and click to activate your account.\n\n UserName: "+username +"\n Password: "+password+"\n\nActivation link: \n"+ url;
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


public static void sendMailFromORG(String to, String from, String url, String organisation){
	String host = "mail.imtacict.com";
	String subject = "Account Registered";
	String messageText = "We have registered your profile to the HIN Network. Please find the below Login link"
	+ " and click to link your profile with your Existing profile.\n\nOrganisation: "+organisation +"\n\n\nActivation link: \n"+ url+"\n\n\n\t\tThanking you";
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
