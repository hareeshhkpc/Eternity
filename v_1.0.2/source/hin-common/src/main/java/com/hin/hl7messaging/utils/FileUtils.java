/**
 * 
 */
package com.hin.hl7messaging.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

/**
 * @author Administrator
 *
 */
public class FileUtils {

	public static String getContentsAsJavaString(File file){
		StringBuffer content = new StringBuffer();
		
		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(file));
			
			String line = null;
			
			while((line = br.readLine()) != null){
				line = line.replace("\"", "\\\"");
				content.append(line);
				//content.append("\n");
			}
		} catch (Exception e) {
			
		}
		
		return content.toString();
	}
	
	public static String getContents(File file){
		StringBuffer content = new StringBuffer();
		
		BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(file));
			
			String line = null;
			
			while((line = br.readLine()) != null){
				content.append(line);
				content.append("\n");
			}
		} catch (Exception e) {
			
		}
		
		return content.toString();
	}
	
}
