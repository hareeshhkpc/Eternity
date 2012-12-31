/*package com.hin.hl7messaging.web;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.xpath.XPathConstants;

import org.apache.log4j.Logger;
import org.w3c.dom.Document;

import com.hin.hl7messaging.IdentityEngine.IdentityProcessor;
import com.hin.hl7messaging.context.HINApplicationContext;
import com.hin.hl7messaging.utils.BinaryUtils;
import com.hin.hl7messaging.utils.GMap;
import com.hin.hl7messaging.utils.XMLHelper;
import com.hin.hl7messaging.vo.HINResponse;
import com.hin.hl7messaging.web.service.PresentationService;

public class ImageServlet extends HttpServlet {
	private IdentityProcessor identityProcessor = null;
	private Logger logger = Logger.getLogger(ImageServlet.class.getName());

	protected void processRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		HashMap<String, String> defaultImages = new HashMap<String, String>();
		defaultImages.put("PRPA_IN000001", "Registration.png");
		defaultImages.put("PRPA_IN410001", "Appointment.png");
		defaultImages.put("PRPA_IN400000", "Encounter.png");
		defaultImages.put("POXX_IN121001", "lab.png");
		defaultImages.put("POSA_IN000001", "Drug.png");
		defaultImages.put("COCT_MT150000", "organization.png");

		if (request.getParameter("action") != null
				&& request.getParameter("action").equals("loadProfileImage")) {
			response.setContentType("image/jpeg");
			String messageType = request.getParameter("messageType");
			String profileID = request.getParameter("profileID");
			String messageXML = "";
			HINResponse hinResponse = new HINResponse();

			 Check for the profile 
			PresentationService service = new PresentationService();
			if(profileID!=null && profileID.length() > 0)
			messageXML = service.retreiveLoggedInUserProfileMessage(
					hinResponse, profileID);

			 If profile is available 
			if ( messageXML != null && !(messageXML.trim().equals(""))) {
				String imageXpath = "";
				if (messageType.equals("COCT_MT150000")) {
					imageXpath = "//COCT_MT150000/desc";
				} else if (messageType.equals("PRPA_IN000001")) {
					imageXpath = "//controlActProcess/subject/registrationEvent/subject/identifiedEntity/identifiedPerson/desc";
				}

				Document messageDoc = XMLHelper.getXMLDocument(messageXML);
				imageXpath = (String) XMLHelper.read(messageDoc, imageXpath,
						XPathConstants.STRING);
				// System.out.println("Image: " + imageXpath);
				BinaryUtils binaryUtil = new BinaryUtils();
				byte[] imageBytes = binaryUtil
						.decodeInputStreamToBase64(imageXpath);
				if (imageBytes!=null && imageBytes.length > 0) {
					response.getOutputStream().write(imageBytes);
				} else {
					FileInputStream fis = loadDefaultImage(response,
							defaultImages, messageType);
					fis.close();

				}
			}
			 If profile is not available 
			else {
				FileInputStream fis = loadDefaultImage(response, defaultImages,
						messageType);
				fis.close();
			}
			response.flushBuffer();
		}

		else if (request.getParameter("action") != null
				&& request.getParameter("action")
						.equals("convertimagefrombyte")) {
			convertImageFromBytes(request, response);

			
			 * String bytedata = request.getParameter("bytedata").toString();
			 * byte[] imageInByte = Base64.decodeBase64(bytedata);
			 * //response.getOutputStream().write(imageInByte);
			 * 
			 * InputStream in = new ByteArrayInputStream(imageInByte);
			 * BufferedImage bImageFromConvert = ImageIO.read(in);
			 * //response.setContentType("image/jpeg"); OutputStream op = null;
			 * ImageIO.write(bImageFromConvert, "jpg",new OutputStream() {
			 * 
			 * @Override public void write(int b) throws IOException {
			 * 
			 * } }); //response.getOutputStream().println(op);
			 
		} else {
			loadImageFromPath(request, response);
		}

	}

	private FileInputStream loadDefaultImage(HttpServletResponse response,
			HashMap<String, String> defaultImages, String messageType)
			throws FileNotFoundException, IOException {
		String imagePath = "/main-screen/images";
		imagePath = HINApplicationContext.getHINApplicationContext()
				.getRealPath(imagePath);
		imagePath = imagePath.concat("/")
				.concat(defaultImages.get(messageType));

		File file = new File(imagePath);
		FileInputStream fis = new FileInputStream(file);
		byte[] buff = new byte[2048];
		while (fis.read(buff) != -1) {
			response.getOutputStream().write(buff);
		}
		return fis;
	}

	private void loadImageFromPath(HttpServletRequest request,
			HttpServletResponse response) throws FileNotFoundException,
			IOException {
		response.setContentType("image/jpeg");

		String imageName = request.getParameter("imageName");

		File file = new File(request.getSession(true).getServletContext()
				.getRealPath("/images/" + imageName));
		FileInputStream fis = new FileInputStream(file);
		byte[] buff = new byte[2048];
		while (fis.read(buff) != -1) {
			response.getOutputStream().write(buff);
		}
		fis.close();
	}

	private void convertImageFromBytes(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		response.setContentType("image/jpeg");
		// System.out.println("ORGID : "+request.getParameter("orgId"));
		// call the method to retrive the details with orgid and assign to gmap
		// the icon and set that image to the response

		List<GMap> gmapList = identityProcessor.fetchGmapLocation(request
				.getParameter("orgId"));
		// System.out.println(gmapList.get(0).getIcon());
		if (request.getParameter("fileType").equals("icon")) {
			byte[] icon = null;
			if(gmapList.get(0).getIcon()!=null && gmapList.get(0).getIcon().length()>0){
				icon = BinaryUtils.decodeInputStreamToBase64(gmapList.get(0).getIcon());
				response.getOutputStream().write(icon);
			}else{
				HashMap<String, String> defaultImages = new HashMap<String, String>();
				defaultImages.put("gmapdefault", "gmapdefault.png");
				FileInputStream fis = loadDefaultImage(response, defaultImages,"gmapdefault");
				fis.close();
			}
		} else if (request.getParameter("fileType").equals("logo")) {
			byte[] logo = BinaryUtils.decodeInputStreamToBase64(gmapList.get(0)
					.getLogo());
			response.getOutputStream().write(logo);

		}
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("Process request failed: "+e.getMessage());
		}
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			logger.error("Process request failed: "+e.getMessage());
		}
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		identityProcessor = new IdentityProcessor();
	}

}
*/