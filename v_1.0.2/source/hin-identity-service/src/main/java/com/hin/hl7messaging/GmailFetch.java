package com.hin.hl7messaging;

import java.net.URL;
import java.util.Properties;

import javax.mail.FetchProfile;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.URLName;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.sun.mail.pop3.POP3SSLStore;

public class GmailFetch {

	public static void main(String args[]) throws Exception {
		// Security.addProvider(new com.sun.net.ssl.internal.ssl.Provider());
		final String SSL_FACTORY = "javax.net.ssl.SSLSocketFactory";

		// Get a Properties object
		Properties props = System.getProperties();
		props.setProperty("mail.pop3.socketFactory.class", SSL_FACTORY);
		props.setProperty("mail.pop3.socketFactory.fallback", "false");
		props.setProperty("mail.pop3.port", "995");
		props.setProperty("mail.pop3.socketFactory.port", "995");
		props.setProperty("mail.pop3.host", "pop.gmail.com");
		props.setProperty("mail.pop3.user", args[0]);
		props.setProperty("mail.pop3.passwd", args[1]);
		props.setProperty("mail.pop3.ssl", "true");

		Session session = Session.getInstance(props, null);
		URLName urln = new URLName("pop3", "pop.gmail.com", 995, null, args[0],
				args[1]);
		Store store = new POP3SSLStore(session, urln);
		// session.setDebug(true);

		store.connect("pop.gmail.com", args[0], args[1]);
		Folder folder = store.getDefaultFolder();
		folder = folder.getFolder("INBOX");
		folder.open(Folder.READ_ONLY);

		//System.out.println("Message Count " + folder.getMessageCount());
		//System.out.println("New Message Count " + folder.getNewMessageCount());
		//System.out.println("=========================================");

		Message[] messages = folder.getMessages();

		FetchProfile fp = new FetchProfile();
		fp.add(FetchProfile.Item.ENVELOPE);
		folder.fetch(messages, fp);

		for (int i = 0; i < messages.length; i++) {
			//System.out.println("From:" + messages[i].getFrom());
		}
		folder.close(true);
		store.close();
	}
	
	public void sendmail(URL url,String fromEmailID, String toEmailID) throws Exception{
		String host = "mail.imtacict.com";
		String from = fromEmailID;
		String to = toEmailID;
		Properties properties = System.getProperties();
		properties.setProperty("mail.smtp.host", host);
		Session session = Session.getDefaultInstance(properties);
		MimeMessage message = new MimeMessage(session);
		message.setFrom(new InternetAddress(from));
		message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
		message.setSubject("Register with the Organisation");
		message.setText(url.toString());
		Transport.send(message);
		//System.out.println("Message Send.....");
		}
	}