/**
 * 
 */
package com.hin.hl7messaging.uitl;

import java.io.File;

import org.junit.Test;

import com.hin.hl7messaging.utils.FileUtils;

/**
 * @author Administrator
 *
 */
public class FileTest {

	@Test
	public void testFileToJSString(){
		File file = new File("src/test/resources/iso-21090_hl7-r2_datatypes.xsd");
		String contents = FileUtils.getContentsAsJavaString(file);
		System.out.println(contents);
	}
	
}
