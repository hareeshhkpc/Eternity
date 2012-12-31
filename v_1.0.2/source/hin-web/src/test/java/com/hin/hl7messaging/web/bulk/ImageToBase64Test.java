/**
 * 
 */
package com.hin.hl7messaging.web.bulk;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;

import org.junit.Test;

import com.hin.hl7messaging.utils.BinaryUtils;

/**
 * @author Administrator
 *
 */
public class ImageToBase64Test {

	@Test
	public void testImageToBase64() throws IOException{
		File file = new File("src/test/java/com/hin/hl7messaging/web/bulk/resource");
		FileInputStream in = null;
		FileOutputStream out = null;
		File[] images = file.listFiles(new FilenameFilter() {
			
			@Override
			public boolean accept(File dir, String name) {
				return !name.endsWith(".txt");
			}
		});
		for(File image : images){			
			in = new FileInputStream(image);			
			String base64 = BinaryUtils.convertInputStreamToBase64(in, (int) image.length());
			in.close();
			//System.out.println(base64);
			File base64File = new File(image.getParentFile(), image.getName().replace('.', '_').concat(".txt"));
			out = new FileOutputStream(base64File);
			out.write(base64.getBytes());
			out.close();
		}
	}
	
}
