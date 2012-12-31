package com.hin.hl7messaging.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.vo.FileUploadMessageVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IFileUploadMessageService;
import com.hin.hl7messaging.api.IMessageService;
import com.hin.hl7messaging.api.IValueExtractor;
import com.hin.service.IPdfExtractorService;
import com.hin.service.extraction.EXTRACTOR_TYPE;
import com.hin.service.extraction.ExtractedValue;
import com.hin.service.extraction.ValueExtractionFactory;

@Controller
public class FileUploadController {

	private Logger logger = Logger.getLogger(FileUploadController.class
			.getName());

	@Autowired
	IMessageService messageService;

	IValueExtractor valueExtractor;

	@Autowired
	IPdfExtractorService pdfExtractorService;

	@Autowired
	IFileUploadMessageService fileUploadMessageService;

	@Value("${FileAttachment.ATTACHMENT_DIR}")
	private String ATTACHMENT_DIR;

	@Value("${FileAttachment.READ_BUFFER_SIZE}")
	private int READ_BUFFER_SIZE = 2048; // Default to 2KB

	@RequestMapping(value = "/FileUploadController", method = RequestMethod.POST)
	public @ResponseBody
	String fileUpload(HttpServletRequest request) throws Exception {
		String effectiveDate = "";
		String fileMetaData = "";
		String fileName = "";
		String fileExtension = "";
		String filePath = "";
		String formName = "";
		String documentType = "";
		UUID uuid = UUID.randomUUID();
		String messageId = uuid.toString();
		FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		// get current date time with Date()
		Date date = new Date();
		System.out.println(dateFormat.format(date));
		effectiveDate = (dateFormat.format(date)).toString();

		String extractedJson = "";

		try {
			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;

				MultipartFile multipartFile = multipartHttpServletRequest
						.getFile("fileUpload");
				String patientId = multipartHttpServletRequest
						.getParameter("patient");
				formName = multipartHttpServletRequest.getParameter("formName");
				documentType = multipartHttpServletRequest
						.getParameter("documentType");

				fileUploadMessageVO.setFileSize(multipartFile.getSize());
				fileUploadMessageVO.setFileName(multipartFile
						.getOriginalFilename());
				fileUploadMessageVO.setFileType(multipartFile.getContentType());
				fileUploadMessageVO.setFileSize(multipartFile.getSize());
				fileUploadMessageVO.setMessageId(messageId);
				fileUploadMessageVO.setDocumentType(documentType);
				fileUploadMessageVO.setFormName(formName);

				fileName = multipartFile.getOriginalFilename();
				int dotPos = fileName.lastIndexOf(".");
				fileExtension = fileName.substring(dotPos);

				File dir = new File(ATTACHMENT_DIR + "/" + patientId);
				dir.mkdirs();
				multipartFile.transferTo(new File(dir + "/" + messageId
						+ fileExtension));
				filePath = ATTACHMENT_DIR + "/" + patientId + "/" + messageId
						+ fileExtension;
				// System.out.println("filePath: " + filePath);

				/*
				 * Xml file generated which contains meta data of the uploaded
				 * file
				 */
				fileMetaData = fileUploadMessageService
						.createFileUploadMessage(fileUploadMessageVO,
								messageId, patientId, effectiveDate,
								fileExtension);

			}
			else {
				throw new Exception("Request is not a file upload");
			}
			
			MessageVO messageVO = messageService.createMessageVO(fileMetaData);
			messageService.saveMessage(messageVO);
			System.out.println(fileUploadMessageVO.getFileName()
					+ " File Uploaded sucessfully " + " message id="
					+ fileUploadMessageVO.getMessageId());

			EXTRACTOR_TYPE extractorType = null;

			String fileType = fileUploadMessageVO.getFileType();
			fileType = fileType.split("\\/")[1];
			// System.out.println("fileExtension: " + fileExtension);
			// System.out.println("fileType: " + fileType);

			if (fileExtension.equals(".txt")) {
				extractorType = EXTRACTOR_TYPE.XML;
				valueExtractor = ValueExtractionFactory
						.getExtractor(extractorType);
			} else if (fileExtension.equals(".csv")) {
				extractorType = EXTRACTOR_TYPE.CSV;
				valueExtractor = ValueExtractionFactory
						.getExtractor(extractorType);
			}
			List<ExtractedValue> extractedList = new ArrayList<ExtractedValue>();
			if (fileExtension.equals(".pdf")) {
				extractedList = pdfExtractorService.extractTextFromPdf(
						formName, filePath);
			} else {
				extractedList = valueExtractor.extractValues(filePath);
			}
			// System.out.println("size of extractedList:"+extractedList.size());

			Gson gson = new GsonBuilder().create();
			String extractedValueJSONFormat = gson.toJson(extractedList);
			fileUploadMessageVO.setExtractedValues(extractedValueJSONFormat);

		} catch (Exception error) {
			logger.error("Error while extracting values: ", error);
		} finally {
			extractedJson = new GsonBuilder().create().toJson(
					fileUploadMessageVO);
		}

		return extractedJson;
	}

	@RequestMapping(value = "/getFileAttachment", method = RequestMethod.GET)
	public void getFile(@RequestParam String messageId,@RequestParam String organizationId,
			HttpServletResponse response) throws Exception {
		FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();

		String messageXml;
		try {
			messageXml = messageService.getMessage(messageId,organizationId);
			fileUploadMessageVO = fileUploadMessageService
					.createMessageVO(messageXml);
		} catch (Exception e) {
			System.err
					.println("Error getting message from Cassandra[MessageID="
							+ messageId + "]: " + e.getMessage());
			logger.error("Error getting message from Cassandra[MessageID="
					+ messageId + "]: ", e);
			return;
		}

		File file = new File(ATTACHMENT_DIR + "/"
				+ fileUploadMessageVO.getPatientId() + "/" + messageId
				+ fileUploadMessageVO.getFileExtension());
		FileInputStream fstream = null;

		try {

			response.setContentType(fileUploadMessageVO.getFileType());

			fstream = new FileInputStream(file);
			byte[] buffer = new byte[READ_BUFFER_SIZE];

			while (fstream.read(buffer, 0, READ_BUFFER_SIZE) > -1) {
				response.getOutputStream().write(buffer, 0, READ_BUFFER_SIZE);
			}

		} catch (Exception e) {// Catch exception if any
			System.err.println("Error reading file attachment[MessageID="
					+ messageId + "]: " + e.getMessage());
			logger.error("Error reading file attachment[MessageID=" + messageId
					+ "]: ", e);
		} finally {
			if (fstream != null) {
				try {
					fstream.close();
				} catch (IOException e) {
					logger.error("Error closing file attachment[MessageID="
							+ messageId + "]: ", e);
				}
			}
		}

	}

	@RequestMapping(value = "/downloadFileAttachment", method = RequestMethod.POST)
	public void downloadFileAttachment(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String messageId = "";
		String messageXml;
		String organizationId="";
		FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();

		try {
			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				try {
					messageId = multipartHttpServletRequest
							.getParameter("message");
					organizationId = multipartHttpServletRequest
							.getParameter("organizationId");

				} catch (Exception ex) {
					ex.printStackTrace();
					/* return data; */
				}
			} else {
				messageId = request.getParameter("message");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}

		try {
			messageXml = messageService.getMessage(messageId,organizationId);
			fileUploadMessageVO = fileUploadMessageService
					.createMessageVO(messageXml);
		} catch (Exception e) {
			System.err
					.println("Error getting message from Cassandra[MessageID="
							+ messageId + "]: " + e.getMessage());
			logger.error("Error getting message from Cassandra[MessageID="
					+ messageId + "]: ", e);
			return;
		}

		File file = new File(ATTACHMENT_DIR + "/"
				+ fileUploadMessageVO.getPatientId() + "/" + messageId
				+ fileUploadMessageVO.getFileExtension());

		FileInputStream fstream = null;
		try {
			response.setContentType(fileUploadMessageVO.getFileType());
			response.setHeader("Content-Disposition", "attachment;filename="
					+ messageId + "." + fileUploadMessageVO.getFileExtension());

			fstream = new FileInputStream(file);
			byte[] buffer = new byte[READ_BUFFER_SIZE];

			while (fstream.read(buffer, 0, READ_BUFFER_SIZE) > -1) {
				response.getOutputStream().write(buffer, 0, READ_BUFFER_SIZE);
			}

		} catch (Exception e) {// Catch exception if any
			System.err.println("Error reading file attachment[MessageID="
					+ messageId + "]: " + e.getMessage());
			logger.error("Error reading file attachment[MessageID=" + messageId
					+ "]: ", e);
		} finally {
			if (fstream != null) {
				try {
					fstream.close();
				} catch (IOException e) {
					logger.error("Error closing file attachment[MessageID="
							+ messageId + "]: ", e);
				}
			}
		}

	}
	
	
	@RequestMapping(value = "/downloadDocumentFileAttachment", method = RequestMethod.POST)
	public void downloadDocumentFileAttachment(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		String messageId = "";
		String organizationId = "";
		String messageXml;
		FileUploadMessageVO fileUploadMessageVO = new FileUploadMessageVO();

		try {
			if (request instanceof MultipartHttpServletRequest) {
				MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
				try {
					messageId = multipartHttpServletRequest
							.getParameter("message");
					organizationId = multipartHttpServletRequest
							.getParameter("organizationId");

				} catch (Exception ex) {
					ex.printStackTrace();
					/* return data; */
				}
			} else {
				messageId = request.getParameter("message");
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}

		try {
			
			messageXml = fileUploadMessageService.getFileUploadMessage(messageId,organizationId);
			
			if(messageXml.isEmpty() || messageXml.length() < 1){
				messageXml = messageService.getMessage(messageId,organizationId);
				fileUploadMessageVO = fileUploadMessageService.createMessageVO(messageXml);
			}else{
				fileUploadMessageVO = fileUploadMessageService.createMessageVO(messageXml);
			}
			
		} catch (Exception e) {
			System.err
					.println("Error getting message from Cassandra[MessageID="
							+ messageId + "]: " + e.getMessage());
			logger.error("Error getting message from Cassandra[MessageID="
					+ messageId + "]: ", e);
			return;
		}

		File file = new File(ATTACHMENT_DIR + "/"
				+ fileUploadMessageVO.getPatientId() + "/" + messageId
				+ fileUploadMessageVO.getFileExtension());

		FileInputStream fstream = null;
		try {
			response.setContentType(fileUploadMessageVO.getFileType());
			response.setHeader("Content-Disposition", "attachment;filename="
					+ messageId + fileUploadMessageVO.getFileExtension());

			fstream = new FileInputStream(file);
			byte[] buffer = new byte[READ_BUFFER_SIZE];

			while (fstream.read(buffer, 0, READ_BUFFER_SIZE) > -1) {
				response.getOutputStream().write(buffer, 0, READ_BUFFER_SIZE);
			}

		} catch (Exception e) {// Catch exception if any
			System.err.println("Error reading file attachment[MessageID="
					+ messageId + "]: " + e.getMessage());
			logger.error("Error reading file attachment[MessageID=" + messageId
					+ "]: ", e);
		} finally {
			if (fstream != null) {
				try {
					fstream.close();
				} catch (IOException e) {
					logger.error("Error closing file attachment[MessageID="
							+ messageId + "]: ", e);
				}
			}
		}

	}

}
