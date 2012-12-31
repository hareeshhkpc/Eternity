package com.hin.hl7messaging.web;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.hin.hl7messaging.api.IIdentityMessageService;
import com.hin.hl7messaging.api.IIdentityService;
import com.hin.hl7messaging.vo.MultipartHandler;
import com.hin.hl7messaging.vo.ViewEditResponse;

@Controller
@RequestMapping("/SaveProfileController")

public class SaveProfileController {
	
	@Resource(name="identityMessageService")
	private IIdentityMessageService messageService;
	
	@RequestMapping(method = RequestMethod.POST)
	public @ResponseBody ViewEditResponse saveProfile(HttpServletRequest request)
	{		
		String requestType = "";
		String profileId = "";
		String message = "";
		ViewEditResponse resp = new ViewEditResponse();		

		MultipartHandler handler = null;
		if (request.getAttribute("handler") != null) {
			handler = (MultipartHandler) request.getAttribute("handler");

		} else if (handler == null) {
			handler = new MultipartHandler(request);
			if (!ServletFileUpload.isMultipartContent(request)) {
				//out.println("Only multipart content is supported.");
			}
			try {
				handler.parse();
			} catch (Exception e) {
				System.out.println("Error in parsing multipart request: ");
				//logger.error("Error in parsing multipart request: "+e.getMessage());
			}

		}
		try {
			requestType = handler.getParameter("requestType");
			profileId = handler.getParameter("profileId");
			message = handler.getParameter("message");
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(requestType.equals("saveProfile"))
		{
			System.out.println(message);
			messageService.saveSubscriberProfile(profileId,message);
		}
		
			
		return resp;
	}	

}
