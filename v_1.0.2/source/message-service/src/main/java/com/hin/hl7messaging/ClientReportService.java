package com.hin.hl7messaging;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.commons.io.IOUtils;
import org.apache.fop.svg.PDFTranscoder;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hin.domain.vo.ClientReportVO;
import com.hin.hl7messaging.api.IClientReportService;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfImportedPage;
import com.lowagie.text.pdf.PdfReader;
import com.lowagie.text.pdf.PdfWriter;

@Service(value = "clientReportService")
public class ClientReportService implements IClientReportService {

	private Logger logger = Logger.getLogger(ClientReportService.class
			.getName());

	@Value("${FileAttachment.ATTACHMENT_DIR}")
	private String ATTACHMENT_DIR;

	@Override
	public void exportToPDF(ClientReportVO clientReportVO) throws Exception {
		List<File> list = new ArrayList<File>();
		String content = clientReportVO.getSvgContent();
		List<String> svgList = new ArrayList<String>();
		List<String> svgToPdfList = new ArrayList<String>();

		/*
		 * try { File uploadedReportContent = new File(ATTACHMENT_DIR,
		 * "page2.xml"); PrintWriter pw = new
		 * PrintWriter(uploadedReportContent); pw.print(content); pw.flush();
		 * pw.close(); } catch (Exception e) { System.out.println(e); return; }
		 */

		String[] svgContentList = content.split("SVGSPLITTER");
		for (String svgContent : svgContentList) {
			svgList.add(svgContent);
		}

		svgToPdfList.add(svgList.get(0));
		svgToPdfList.add(svgList.get(1));
		svgToPdfList.add(svgList.get(10));
		for (int i = 2; i < 22; i++) {
			if (i != 10) {
				svgToPdfList.add(svgList.get(i));
			}
		}

		File dir = null;
		try {
			String patientId = clientReportVO.getPatientID();
			dir = new File(ATTACHMENT_DIR + "/" + patientId);
			dir.mkdirs();
		} catch (Exception e) {
			logger.error(
					"Error in creating patient's folder. Can't create Client Report PDF.",
					e);
			throw e;
		}

		for (int pageIndex = 0; pageIndex < 22; pageIndex++) {
			try {
				Transcoder transcoder = new PDFTranscoder();
				java.io.InputStream in = null;

				String svgPdfContent = svgToPdfList.get(pageIndex);
				in = IOUtils.toInputStream(svgPdfContent, "UTF-8");
				TranscoderInput input = new TranscoderInput(in);

				// Setup output
				File pdfPage = new File(dir, pageIndex + ".pdf");
				OutputStream out = new FileOutputStream(pdfPage);
				out = new BufferedOutputStream(out);
				TranscoderOutput output = new TranscoderOutput(out);

				transcoder.transcode(input, output);

				out.close();

				list.add(pdfPage);

				System.out.println("converted");
			} catch (Exception e) {
				System.out.println(e);
				e.printStackTrace();
			}
		}

		try {
			OutputStream out = new FileOutputStream(new File(dir,
					clientReportVO.getMessageId()+".pdf"));
			doMergePDFs(list, out);
		} catch (IOException e) {
			logger.error("Error in merging individual Client Report pages: ", e);
			throw e;
		}

		// Delete all temporary PDF files
		for (File file : list) {
			file.delete();
		}

	}

	public static void doMergePDFs(List<File> list, OutputStream outputStream)
			throws DocumentException, IOException {
		Document document = new Document();
		PdfWriter writer = PdfWriter.getInstance(document, outputStream);
		document.open();
		PdfContentByte cb = writer.getDirectContent();

		for (File file : list) {
			PdfReader reader = new PdfReader(new FileInputStream(file));
			for (int i = 1; i <= reader.getNumberOfPages(); i++) {
				document.newPage();
				// import the page from source pdf
				PdfImportedPage page = writer.getImportedPage(reader, i);
				// add the page to the destination pdf
				cb.addTemplate(page, 0, 0);
			}
		}

		outputStream.flush();
		document.close();
		outputStream.close();
	}

	@Override
	public ClientReportVO fetchData(ClientReportVO clientReportVO) {
		// TODO Auto-generated method stub
		return null;
	}

}
