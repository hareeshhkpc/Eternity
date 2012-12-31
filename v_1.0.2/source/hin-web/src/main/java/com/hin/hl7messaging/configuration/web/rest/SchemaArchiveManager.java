/**
 * 
 */
package com.hin.hl7messaging.configuration.web.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.TreeSet;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import javax.xml.xpath.XPathConstants;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.hin.domain.config.HL7SchemaNamespaceContext;
import com.hin.hl7messaging.utils.XMLHelper;

/**
 * @author Administrator
 *
 */
public class SchemaArchiveManager {

	public void extractZipContents(File zipFile, File targetFile)
			throws IOException, FileNotFoundException {
		ZipInputStream zipinputstream = new ZipInputStream(new FileInputStream(
				zipFile));
		ZipEntry zipentry = zipinputstream.getNextEntry();
		TreeSet<String> dirsMade = new TreeSet<String>();
		byte[] b = new byte[8092];
		File extractLocation = null;
		
		while (zipentry != null) {
			String zipName = zipentry.getName();
			if (zipName.startsWith("/")) {

				zipName = zipName.substring(1);
			}

			// if a directory, just return. We mkdir for every file,
			// since some widely-used Zip creators don't put out
			// any directory entries, or put them in the wrong place.
			if (zipName.endsWith("/")) {
				zipinputstream.closeEntry();
				zipentry = zipinputstream.getNextEntry();
				continue;
			}

			// Else must be a file; open the file for output
			// Get the directory part.
			int ix = zipName.lastIndexOf('/');
			if (ix > 0) {
				String dirName = zipName.substring(0, ix);
				if (!dirsMade.contains(dirName)) {
					extractLocation = new File(targetFile, dirName);
					// If it already exists as a dir, don't do anything
					if (!(extractLocation.exists() && extractLocation
							.isDirectory())) {
						// Try to create the directory, warn if it fails
						System.out.println("Creating Directory: " + dirName);
						if (!extractLocation.mkdirs()) {
							System.err.println("Warning: unable to mkdir "
									+ dirName);
						}
						dirsMade.add(dirName);
					}
				}
			}
			File fileToCreate = new File(extractLocation,
					zipName.substring(ix + 1));
			System.err.println("Creating " + fileToCreate);
			FileOutputStream os = new FileOutputStream(fileToCreate);
			InputStream is = zipinputstream;
			int n = 0;
			while ((n = is.read(b)) > 0)
				os.write(b, 0, n);
			os.close();

			zipinputstream.closeEntry();
			zipentry = zipinputstream.getNextEntry();
		}
		zipinputstream.close();
	}
	
	public File createZipFile(File zipOut, File messageSchema, File coreSchema) throws Exception{
		
		ArrayList<String> list = new ArrayList<String>();
		list.add(messageSchema.getAbsolutePath());
		
		getIncludes(messageSchema, list);
		System.out.println(list);		
		
		ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipOut));
		
		out.putNextEntry(new ZipEntry("schemas/"));
		out.flush();
		out.closeEntry();
		out.putNextEntry(new ZipEntry("coreschemas/"));
		out.flush();
		out.closeEntry();		
		
		compressFileListToZip(list, out, "schemas/");
		
		File[] files = coreSchema.listFiles();
		ArrayList<String> coreSchemas = new ArrayList<String>();
		for(File file : files){
			coreSchemas.add(file.getAbsolutePath());
		}
		compressFileListToZip(coreSchemas, out, "coreschemas/");
	    
		// Flush unwritten data to disk
	    out.flush();
	    
	    // Complete the ZIP file
	    out.close();
	    
	    return zipOut;
	}

	private void compressFileListToZip(ArrayList<String> fileList,
			ZipOutputStream out, String parentFolder) throws FileNotFoundException, IOException {
		// Create a buffer for reading the files
		byte[] buf = new byte[1024];
		
	    // Compress the files
	    for (int i=0; i <fileList.size(); i++) {
	        FileInputStream in = new FileInputStream(fileList.get(i));

	        String filePath = fileList.get(i);
	        filePath = filePath.substring(filePath.lastIndexOf('\\') + 1);
	        
	        // Add ZIP entry to output stream.
	        out.putNextEntry(new ZipEntry(parentFolder + filePath));

	        // Transfer bytes from the file to the ZIP file
	        int len;
	        while ((len = in.read(buf)) > 0) {
	            out.write(buf, 0, len);
	        }

	        // Complete the entry
	        out.closeEntry();
	        in.close();
	    }
	}
	
	public ArrayList<String> getIncludes(File messageSchema, ArrayList<String> list){
		ArrayList<String> tempList = getIncludedSchemas(messageSchema);
			
		for(String path : tempList){
			if(!list.contains(path)){
				list.add(path);
				getIncludes(new File(path), list);
			}
		}		
		return list;
	}

	public ArrayList<String> getIncludedSchemas(File messageSchema) {
		ArrayList<String> tempList = new ArrayList<String>();
		Document document = XMLHelper.getXMLDocument(messageSchema, true);
		NodeList nodeList = (NodeList) XMLHelper.read(document, "//xs:include", XPathConstants.NODESET, new HL7SchemaNamespaceContext());
		if(nodeList != null){
			for(int i = 0; i < nodeList.getLength(); i++){
				Node include = nodeList.item(i);
				String path = include.getAttributes().getNamedItem("schemaLocation").getNodeValue();
				path = (path.lastIndexOf('/') > -1) ? path.substring(path.lastIndexOf('/') + 1) : path;
				File schema = new File(messageSchema.getParentFile(), path);
				if(schema.exists()){
					tempList.add(schema.getAbsolutePath());
				}
			}
		}
		return tempList;
	}
	
}
