package com.hin.hl7messaging;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.commons.codec.binary.Base64;
import org.junit.Test;

public class Base64Test {

	@Test
	public void testBase64() throws IOException {
		
		File imageFile = new File("src/test/java/com/hin/hl7messaging/Shweta Icon.jpg");
		System.out.println(imageFile.getAbsolutePath());
		
		FileInputStream fis = new FileInputStream(imageFile);
		byte[] imageData = new byte[(int) imageFile.length()];
		
		fis.read(imageData);
		
		byte[] encoded = Base64.encodeBase64(imageData);
		System.out.println(new String(encoded));
		
		File imageFileTarget = new File("src/test/java/com/hin/hl7messaging/Shweta Icon1.jpg");
		if(imageFileTarget.exists()){
			imageFileTarget.delete();
		}
		
		FileOutputStream fos = new FileOutputStream(imageFileTarget);
		fos.write(Base64.decodeBase64(encoded));
		fos.close();
	}

}
