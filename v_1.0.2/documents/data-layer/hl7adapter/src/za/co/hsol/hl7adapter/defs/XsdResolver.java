package za.co.hsol.hl7adapter.defs;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.ls.LSResourceResolver;

import za.co.hsol.hl7adapter.defs.helper.ResourceResolver;

public class XsdResolver {
	private static final String SCHEMAS = "test/artifacts/schemas/PRPA_MT410001HT02";
	private static final String TYPE_IDX = "type.idx";
	private static final String MIF_IDX = "mif.idx";

	private static final String REPOSITORY = "/home/schalk/workspacextend/HL7Adapter/test/artifacts/schemas";
	private static final String COREMIF = REPOSITORY + "/mifs/DEFN=UV=DT=1.0.coremif";
	private static final Map<String,String> typeIndex = readIndex(TYPE_IDX);
	private static final Map<String,String> mifIndex = readIndex(MIF_IDX);


	public static void buildIndexes() {
		try {
			String folder = "/home/schalk/workspacextend/HL7Adapter/test/artifacts/schemas";
			buildIndex(folder, TYPE_IDX, new String[] { "//xs:complexType",
					"//xs:simpleType","//xs:group",
					"//xs:attributeGroup" },".xsd", false);
			buildIndex(folder, MIF_IDX, new String[] { "//mif:class" },".mif", true);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void buildIndex(String folder, String indexFileName,
			String[] searchList, String filepattern, boolean appendFileName) throws Exception, IOException {
		HashMap<String, String> map = new HashMap<String, String>();
		PrintWriter out = new PrintWriter(folder + "/" + indexFileName);
		walkin(new File(folder), map, searchList, filepattern, appendFileName);
		for (String key : map.keySet()) {
			out.write(key + "=" + map.get(key) + "\n");
		}

		out.close();
	}

	private static void walkin(File dir, Map<String, String> map,
			String[] searchList, String filepattern, boolean appendFileName) throws Exception {
		File listFile[] = dir.listFiles();
		if (listFile != null) {
			for (int i = 0; i < listFile.length; i++) {
				if (listFile[i].isDirectory()) {
					walkin(listFile[i], map, searchList, filepattern,appendFileName);
				} else {
					if (listFile[i].getName().endsWith(filepattern)) {
						FileInputStream in = new FileInputStream(listFile[i]);
						XsdDocument xsd = XsdDocument.loadConfigFile(in);
						for (int k = 0; k < searchList.length; k++) {
							NodeList nl = xsd.findNode(searchList[k]);
							for (int j = 0; j < nl.getLength(); j++) {
								Element e = (Element) nl.item(j);
								String name = e.getAttribute("name");
								
								if(appendFileName) {
									String filename = listFile[i].getPath().substring(listFile[i].getPath().lastIndexOf(File.separatorChar)+1);
									filename = filename.substring(0,filename.indexOf('.'));
									name = filename+"."+name;
								}
								if(map.containsKey(name)){
									throw new Exception("duplicate key found: "+name + "\nFound in "+map.get(name) + " and " +listFile[i].getPath());
								}
								if (name != "") {
									map.put(name,
											listFile[i].getPath());
								}
							}
						}
					}
				}
			}
		}
	}

	public static Map<String, String> readIndex(String indexFile) {
		HashMap<String, String> result = new HashMap<String, String>();
		try {
			BufferedReader br;

			br = new BufferedReader(new FileReader(new File(REPOSITORY + File.separator +indexFile)));
			String line;
			while ((line = br.readLine()) != null) {
				String[] arr = line.split("=");
  			    result.put(arr[0],arr[1]);
			}
			br.close();

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	
	public static String getMifDocumentPath(String elementType) {
			String searchType = elementType; //.substring(mElementType.indexOf(".")+1);
			String searchName = mifIndex.containsKey(searchType) ? mifIndex.get(searchType) : null;
			if(searchName == null) searchName = COREMIF;
			
		return searchName;
	}

	public static String getXsdDocumentPath(String elementType) {
		return typeIndex.containsKey(elementType) ? typeIndex.get(elementType) : null;
	}

	public static LSResourceResolver getResourceResolver() {
		// TODO Auto-generated method stub
		return new ResourceResolver(SCHEMAS);
	}
}
