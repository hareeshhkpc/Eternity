package com.hin.hl7messaging.web;


import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

public class Transformer extends HttpServlet 
{
	  private Logger logger = Logger.getLogger(Transformer.class.getName());
	  protected void processRequest(HttpServletRequest request, HttpServletResponse response)throws ServletException, IOException {
		   response.setContentType("text/plain;charset=UTF-8");
		   PrintWriter out=null;
		   String var;
		   try
		   {
			   out = response.getWriter(); 
			   var =request.getParameter("a");
			   String result =URLDecoder.decode(var, "UTF-8");
			   out.print(result);
		   }
		   catch(Exception e)
		   {
			  logger.error("Procees Request failed: "+e.getMessage());
		   }
		   finally
		   {
			   //out.close();
		   }
	  }

	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		processRequest(request, response);
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
		processRequest(request, response);
	}

}
