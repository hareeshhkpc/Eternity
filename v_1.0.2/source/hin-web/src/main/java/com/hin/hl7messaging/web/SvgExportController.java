/**
 * 
 */
package com.hin.hl7messaging.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.GsonBuilder;
import com.hin.domain.vo.ClientReportVO;
import com.hin.domain.vo.FileUploadMessageVO;
import com.hin.domain.vo.MessageVO;
import com.hin.hl7messaging.api.IClientReportService;
import com.hin.hl7messaging.api.IFileUploadMessageService;
import com.hin.hl7messaging.api.IMessageService;

@Controller
public class SvgExportController {

	private Logger logger = Logger.getLogger(SvgExportController.class
			.getName());

	@Autowired
	IClientReportService clientService;

	@Value("${FileAttachment.ATTACHMENT_DIR}")
	private String ATTACHMENT_DIR;

	@Value("${FileAttachment.READ_BUFFER_SIZE}")
	private int READ_BUFFER_SIZE = 2048; // Default to 2KB

	@Autowired
	IFileUploadMessageService fileUploadMessageService;

	@Autowired
	IMessageService messageService;

	@RequestMapping(value = "/report/downloadClientReport", method = RequestMethod.GET)
	public void downloadClientReport(@RequestParam String patientId,
			@RequestParam String messageId, HttpServletResponse response)
			throws Exception {

		// Gson gson = new GsonBuilder().create();
		ClientReportVO clientReportVO = new ClientReportVO();
		clientReportVO.setPatientID(patientId);
		clientReportVO.setMessageId(messageId);

		try {

			File file = new File(ATTACHMENT_DIR + "/"
					+ clientReportVO.getPatientID() + "/"
					+ clientReportVO.getMessageId() + ".pdf");
			FileInputStream fstream = null;

			try {

				response.setContentType("application/pdf");

				response.setHeader("Content-Disposition",
						"attachment;filename=ClientReport.pdf");

				fstream = new FileInputStream(file);
				byte[] buffer = new byte[READ_BUFFER_SIZE];

				while (fstream.read(buffer, 0, READ_BUFFER_SIZE) > -1) {
					response.getOutputStream().write(buffer, 0,
							READ_BUFFER_SIZE);
				}

			} catch (Exception e) {// Catch exception if any
				System.err.println("Error reading client report[PatientID="
						+ clientReportVO.getPatientID() + "]: "
						+ e.getMessage());
				logger.error("Error reading client report[PatientID="
						+ clientReportVO.getPatientID() + "]: ", e);
			} finally {
				if (fstream != null) {
					try {
						fstream.close();
					} catch (IOException e) {
						logger.error("Error closing client report[PatientID="
								+ clientReportVO.getPatientID() + "]: ", e);
					}
				}
			}

		} catch (Exception e) {
			logger.error("Error in processing client report export to PDF", e);
			throw new Exception("FAILURE");
		}
	}

	@RequestMapping(value = "/report/svgExportController", method = RequestMethod.POST)
	public @ResponseBody
	String svgToPDF(@RequestParam String json,
			@RequestParam String patientId)
			throws Exception {
		// System.out.println("controller");
		// System.out.println(json);

		// Gson gson = new GsonBuilder().create();
		ClientReportVO clientReportVO = new ClientReportVO();
		clientReportVO.setSvgContent(json);
		clientReportVO.setPatientID(patientId);

		String extractedJson = "";
		FileUploadMessageVO fileUploadMessageVO = null;
		try {

			UUID uuid = UUID.randomUUID();
			String messageId = uuid.toString();
			clientReportVO.setMessageId(messageId);
			clientService.exportToPDF(clientReportVO);

			File file = new File(ATTACHMENT_DIR + "/"
					+ clientReportVO.getPatientID() + "/" + messageId + ".pdf");

			fileUploadMessageVO = new FileUploadMessageVO();
			fileUploadMessageVO.setFileSize(file.length());
			fileUploadMessageVO.setFileName("Client Report.pdf");
			fileUploadMessageVO.setFileType("application/pdf");

			fileUploadMessageVO.setMessageId(messageId);
			fileUploadMessageVO.setDocumentType("Consultation");
			// fileUploadMessageVO.setFormName(formName);

			String fileName = file.getName();
			int dotPos = fileName.lastIndexOf(".");
			String fileExtension = fileName.substring(dotPos);

			File dir = new File(ATTACHMENT_DIR + "/" + patientId);
			String filePath = ATTACHMENT_DIR + "/" + patientId + "/"
					+ messageId + fileExtension;
			DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
			Date date = new Date();
			System.out.println(dateFormat.format(date));
			String effectiveDate = (dateFormat.format(date)).toString();
			String fileMetaData = fileUploadMessageService
					.createFileUploadMessage(fileUploadMessageVO, messageId,
							patientId, effectiveDate, fileExtension);

			MessageVO messageVO = messageService.createMessageVO(fileMetaData);
			messageService.saveMessage(messageVO);
			System.out.println(fileUploadMessageVO.getFileName()
					+ " File Uploaded sucessfully " + " message id="
					+ fileUploadMessageVO.getMessageId());

		} catch (Exception e) {
			logger.error("Error in processing client report export to PDF", e);
			throw new Exception("FAILURE");
		} finally {
			extractedJson = new GsonBuilder().create().toJson(
					fileUploadMessageVO);
		}

		return extractedJson;
	}

}
