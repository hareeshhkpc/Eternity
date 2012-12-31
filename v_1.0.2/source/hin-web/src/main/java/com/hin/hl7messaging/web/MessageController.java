package com.hin.hl7messaging.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IGenerateSubscriberIdService;
import com.hin.hl7messaging.api.IMessageService;

@Controller
public class MessageController {
	
	@Autowired
	IMessageService messageService;
	
	
	
	@RequestMapping(value = "/newRegistration", method = RequestMethod.POST)
	public @ResponseBody
	String multi(HttpServletRequest request) {
		String data = "";
		MessageVO messageVO = new MessageVO();
		if (request instanceof MultipartHttpServletRequest) {
			// process the uploaded file
			MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
			System.out.println("multipart "
					+ multipartHttpServletRequest.getFileMap());
			String id = multipartHttpServletRequest.getParameter("id");
			String type = multipartHttpServletRequest.getParameter("type");

			try {
				MultipartFile multipartFile = multipartHttpServletRequest
						.getFile("message");
				String message=new String(multipartFile.getBytes());
				messageVO.setMessage(message);
				messageService.saveMessage(messageVO);
				System.out.println(messageVO.getId());
				
			} catch (IOException e1) {
				e1.printStackTrace();
			}catch(Exception e){
				e.printStackTrace();
			}

		} else {
			// other logic
		}

		return data;
	}
	
	@Autowired
	IGenerateSubscriberIdService generateSubscriberIdService;
	public String generateNumber(){
		String subscriberId="";
		subscriberId = generateSubscriberIdService.generateSubscriberId();
		return subscriberId;
	}

	
}