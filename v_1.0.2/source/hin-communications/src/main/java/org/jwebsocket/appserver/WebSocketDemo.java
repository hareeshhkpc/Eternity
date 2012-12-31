/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.jwebsocket.appserver;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.apache.log4j.Logger;
import org.jwebsocket.api.WebSocketPacket;
import org.jwebsocket.chat.MessageRequest;
import org.jwebsocket.factory.JWebSocketFactory;
import org.jwebsocket.kit.WebSocketServerEvent;
import org.jwebsocket.listener.WebSocketServerTokenEvent;
import org.jwebsocket.listener.WebSocketServerTokenListener;
import org.jwebsocket.logging.Logging;
import org.jwebsocket.server.TokenServer;
import org.jwebsocket.token.Token;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author aschulze
 * @author madhu.murmu
 */
public class WebSocketDemo extends HttpServlet implements WebSocketServerTokenListener {

	private static Logger log = null;
	private Map<String, List<Object[]>> messages = new HashMap<String, List<Object[]>>();
	private static Logger logger = Logger.getLogger(WebSocketDemo.class.getName());

	/**
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/plain;charset=UTF-8");
		PrintWriter out = response.getWriter();

		try {
			out.println("This session: " + request.getSession().getId());
			out.println("Http sessions: " + WebSocketHttpSessionMerger.getHttpSessionsCSV());
			out.println("WebSocket sessions: " + WebSocketHttpSessionMerger.getWebSocketSessionsCSV());
		} finally {
			out.close();
		}
	}

	@Override
	public void init() {
		log = Logging.getLogger(WebSocketDemo.class);
		log.info("Adding servlet '" + getClass().getSimpleName() + "' to WebSocket listeners...");
		TokenServer lServer = (TokenServer) JWebSocketFactory.getServer("ts0");
		if (lServer != null) {
			lServer.addListener(this);
		}
	}

	@Override
	public void processOpened(WebSocketServerEvent aEvent) {
		log.info("Opened WebSocket session: " + aEvent.getSession().getSessionId());
		// if a new web socket connection has been started,
		// update the session tables accordingly
		WebSocketHttpSessionMerger.addWebSocketSession(aEvent.getSession());
	}

	@Override
	public void processPacket(WebSocketServerEvent aEvent, WebSocketPacket aPacket) {
		log.info("Received WebSocket packet: " + aPacket.getASCII());
	}

	@Override
	public void processToken(WebSocketServerTokenEvent aEvent, Token aToken) {
		log.info("Received WebSocket token: " + aToken.toString());
		//System.out.println(":::::::::::::::::::::>>>"+aToken.getType());
		try{
			if(aToken.getType().equals("broadcast") && aToken.getString("sourceId") != null){
				if(aToken.getString("pool") != null){
					String targetData = aToken.getString("data") !=null ? aToken.getString("data") : "";
					if(targetData.equals("OLD_SESSIONS")){
						//System.out.println("Inside OLD_SESSIONS");
						return;
					}
					String[] keys = aToken.getString("targetUsers").split("#");				
					if(keys.length==2){
						String key = (keys[0]+keys[1]).toString();
						String key2 = (keys[1]+keys[0]).toString();
						String sender = null;
						String msg = null;
						//System.out.println("Create New Key Payer "+key+"--"+key2);
						if(messages.containsKey(key) || messages.containsKey(key2)){
							String messageKey = messages.containsKey(key)?key:key2;
							//System.out.println("Key for Message "+messageKey); 
							sender = aToken.getString("sender");					
							msg = aToken.getString("data");	
							messages.get(messageKey).add(new Object[]{sender,msg})	;
							//System.out.println(" Messages From key \n\n"+messageKey);
							/*List<Object[]> list = messages.get(messageKey);
							for(Object[] obj : list){
								System.out.println(obj[0] +": "+ obj[1]); 
							}*/
						}else{
							//System.out.println("Create New Key for Chat "+key);
							sender = aToken.getString("sender");	
							msg = aToken.getString("data");
							Object[] object = new Object[]{sender,msg};
							List<Object[]> array = new ArrayList<Object[]>();
							array.add(object);
							messages.put(key, array);
						}
					}else if(keys.length==3){
						String key = (keys[0]+keys[1]).toString();
						String key2 = (keys[1]+keys[0]).toString();
						if(messages.containsKey(key)){
							String messageKey = messages.containsKey(key)?key:key2;
							DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
					        DocumentBuilder docBuilder = builderFactory.newDocumentBuilder();
					        Document doc = docBuilder.newDocument();
					        MessageRequest msgreq = new MessageRequest();
					        GregorianCalendar gc = new GregorianCalendar();
					        String directory = gc.get(Calendar.YEAR)+"-"+(gc.get(Calendar.MONTH)+1)+"-"+gc.get(Calendar.DATE); 
					        String fileName = aToken.getString("sender")+"-"+msgreq.getFileName();
					        String path = msgreq.getPath()+"/"+msgreq.getDirectory()+ "/"+fileName;
					       
					        
					        boolean success = (new File("c:\\\\chat\\"+directory+"\\")).mkdirs();
					        File file = new File(path);
					        boolean flag = file.createNewFile();
					        log.info("\nCreated File Status "+ flag + " Path is : " + path);					      
					        if(flag){
					        	
					        	createXmlFile(doc,messages.get(messageKey),path);
					        	messages.remove(messageKey);
					        	//System.out.println("Remove the Id "+messageKey);
					        	log.info("\n\nXml File is Created Successfully.\n"+path+"\n\n"); 
					        } else{
					        	log.error("Unable to Create the directory "+path);
					        }
						}else{
							log.info("You are not the right persion to end the chatting");
						}
					}
								
				}			
				//System.out.println(":::::::::::::::::::::>>> aToken.getType()"+aToken.getString("sender"));
			}
		}catch(Exception e){
			logger.error("An error occured while recieving websocket: "+e.getMessage());
		}
	}

	@Override
	public void processClosed(WebSocketServerEvent aEvent) {
		log.info("Closed WebSocket session: " + aEvent.getSession().getSessionId());
		// if a web socket connection has been terminated,
		// update the session tables accordingly
		WebSocketHttpSessionMerger.removeWebSocketSession(aEvent.getSession());
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP <code>GET</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/**
	 * Returns a short description of the servlet.
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "Short description";
	}// </editor-fold>
	
	public static void createXmlFile(Document doc,List<Object[]> messageObj,String fileName) throws Exception {
		try{
			 Element root = doc.createElement("messages");
		        doc.appendChild(root);
		        for(Object[] array : messageObj){
		        	
		        	Element charting = doc.createElement("charting");
		    		root.appendChild(charting);
		             
		            Element firstname = doc.createElement("sender");
		    		firstname.appendChild(doc.createTextNode(array[0]!=null?array[0].toString():""));
		    		charting.appendChild(firstname);
		    		
		    		Element lastname = doc.createElement("message");
		    		lastname.appendChild(doc.createTextNode(array[1]!=null?array[1].toString():""));
		    		charting.appendChild(lastname);
		  
		        }
		        TransformerFactory factory = TransformerFactory.newInstance();
		        Transformer transformer = factory.newTransformer();
		        transformer.setOutputProperty(OutputKeys.INDENT, "yes");

		        StringWriter sw = new StringWriter();
		        StreamResult result = new StreamResult(sw);
		        DOMSource source = new DOMSource(doc);
		        transformer.transform(source, result);
		        String xmlString = sw.toString();
		        File file = new File(fileName);
		        log.info("Saved Files Name is "+fileName);
		        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file,true)));
		        bw.write(xmlString);
		        bw.flush();
		        bw.close();
		}catch (Exception e) {
			logger.error("An error occured while creating XML doc:"+e.getMessage());
		}
       
      }
}
