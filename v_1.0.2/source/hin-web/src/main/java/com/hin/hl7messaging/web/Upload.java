package com.hin.hl7messaging.web;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import java.util.*;

public class Upload extends HttpServlet {
	private Logger logger = Logger.getLogger(Upload.class.getName());
	  protected void processRequest(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		   
		  response.setContentType("text/plain;charset=UTF-8");
		   PrintWriter out=null;
		   String var;
		   try{
			   out = response.getWriter(); 
			 
			   var =request.getParameter("a");
			  out.println("stored in server");
			  String result =URLDecoder.decode(var, "UTF-8");
			  
			  boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			  
			// Create a factory for disk-based file items
			  FileItemFactory factory = new DiskFileItemFactory();
			
			  
			// Set factory constraints
			  ((DiskFileItemFactory) factory).setSizeThreshold(1*1024*1024);
			//  factory.setRepository(yourTempDirectory);
			  
			// Create a new file upload handler
			  ServletFileUpload upload = new ServletFileUpload(factory);
			  

			  
			// Parse the request
			  List /* FileItem */ items = upload.parseRequest(request);


			   // System.out.println("Varibleeee"+var);
			   out.println(result);
		 
		   }catch(Exception e){
			 logger.error("Process Request Failed: "+e.getMessage());
		   }
		   finally{
			   out.close();
		   }
	  }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);

		
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		processRequest(request, response);

	}

}
