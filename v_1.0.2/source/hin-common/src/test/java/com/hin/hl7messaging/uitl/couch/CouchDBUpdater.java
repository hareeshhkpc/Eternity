/**
 * 
 */
package com.hin.hl7messaging.uitl.couch;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.Revision;
import org.ektorp.http.HttpClient;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;

import com.hin.hl7messaging.utils.BinaryUtils;

/**
 * @author Administrator
 * 
 */
public class CouchDBUpdater {

	private HttpClient httpClient;
	private Boolean connected = false;
	private CouchDbInstance dbInstance;
	private CouchDbConnector db;
	private ArrayList<String> fileList;

	public void connectToCouchDB(String url, String databaseName, Boolean create)
			throws MalformedURLException {
		httpClient = new StdHttpClient.Builder().url(url).build();

		dbInstance = new StdCouchDbInstance(httpClient);
		db = new StdCouchDbConnector(databaseName, dbInstance);

		if (create == Boolean.TRUE)
			db.createDatabaseIfNotExists();

		connected = true;
	}

	public ArrayList<String> getFileList(File dir) {
		return fileList = getFileListInternal(dir);
	}

	private ArrayList<String> getFileListInternal(File dir) {
		ArrayList<String> list = new ArrayList<String>();
		if (!dir.isDirectory()) {
			return list;
		}

		File[] files = dir.listFiles();
		for (File file : files) {
			if (!file.isDirectory()) {
				list.add(file.getAbsolutePath());
			} else {
				list.addAll(getFileList(file));
			}
		}

		return list;
	}

	public ArrayList<String> updateFileListToCouch(File parentFile,
			ArrayList<String> files) throws Exception {
		if (files == null) {
			throw new Exception("File list is null");
		}
		ArrayList<String> revs = new ArrayList<String>();

		int parentFilePathLength = parentFile.getAbsolutePath().length();
		for (String file : files) {
			File fileObj = new File(file);
			String objectId = fileObj.getAbsolutePath().substring(
					parentFilePathLength);
			String rev = updateCouch(objectId, fileObj, null);
			revs.add(rev);
		}
		return revs;
	}

	public ArrayList<String> updateFileListToCouch(File parentFile, File[] files)
			throws Exception {
		if (files == null) {
			throw new Exception("File list is null");
		}

		ArrayList<String> revs = new ArrayList<String>();

		int parentFilePathLength = parentFile.getAbsolutePath().length();
		for (File file : files) {
			String objectId = file.getAbsolutePath().substring(
					parentFilePathLength);
			String rev = updateCouch(objectId, file, null);
			revs.add(rev);
		}
		return revs;
	}

	public String updateCouch(String objectId, File file,
			HashMap<String, String> extraParams) throws Exception {
		if (this.connected == Boolean.FALSE) {
			throw new Exception("Not connected");
		}

		objectId = objectId.replace("\\", "-");
		String name = file.getName().toLowerCase();

		StringBuffer content = null;
		
		if (name.lastIndexOf(".") < 0
				|| (name.endsWith(".jpg") || name.endsWith(".png")
						|| name.endsWith(".gif") || name.endsWith(".bmp") || name
							.endsWith(".tif"))) {
			
			content = getFileContentsAsBinary(file);
			
		} else {
			content = getFileContents(file);
		}
		
		List<Revision> revs = this.db.getRevisions(objectId);
		ConfigFile cf = new ConfigFile();
		cf.setId(objectId);
		if (revs != null && revs.size() > 0) {
			cf.setRevision(revs.get(0).getRev());
		}
		cf.setContent(content.toString());
		cf.setModifiedDate(new Date());

		this.db.update(cf);

		return cf.getRevision();
	}

	public StringBuffer getFileContentsAsBinary(File file) throws IOException {
		StringBuffer content = new StringBuffer();
		
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		byte[] buffer = new byte[2048];
		
		FileInputStream fis = new FileInputStream(file);
		int readLen = -1;
		while((readLen = fis.read(buffer, 0, buffer.length)) > -1){
			baos.write(buffer, 0, readLen);
		}
		
		String contentEncoded = BinaryUtils.convertByteArrayToBase64(baos.toByteArray());
		content.append(contentEncoded);
		
		return content;
	}
	
	public StringBuffer getFileContents(File file) {
		StringBuffer content = new StringBuffer();
		String line = null;
		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(file));
			while ((line = br.readLine()) != null) {
				content.append(line + "\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return content;
	}

	/**
	 * @return the fileList
	 */
	public ArrayList<String> getFileList() {
		return fileList;
	}

}
