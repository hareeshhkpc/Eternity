/**
 * 
 */
package com.hin.hl7messaging.configuration;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.junit.Before;
import org.junit.Test;

/**
 * @author Administrator
 *
 */
public class RecordWriting {

	byte[] record = new byte[256];
	
	private InputStream inStream;
	private OutputStream outStream;
	
	@Before
	public void init() throws FileNotFoundException{
		inStream = new FileInputStream(new File("src/test/java/com/hin/hl7messaging/configuration/out.txt"));
		//outStream = new FileOutputStream(new File("src/test/java/com/hin/hl7messaging/configuration/out.txt"));
	}
	
	@Test
	public void testRead() throws IOException{
		inStream.read(record);
		inStream.close();
		
		ByteArrayInputStream bais = new ByteArrayInputStream(record);
		DataInputStream din = new DataInputStream(bais);
		System.out.println(din.readUTF());
		System.out.println(din.readUTF());
		System.out.println(din.readUTF());
		System.out.println(din.readDouble());
		din.close();
	}
	
	@Test
	public void testWrite() throws IOException{
		ByteArrayOutputStream baos = new ByteArrayOutputStream(256);
		DataOutputStream dos = new DataOutputStream(baos);
		
		dos.writeUTF("201202261705");
		dos.writeUTF("Cafe charges");
		dos.writeUTF("Internet Cafe");
		dos.writeDouble(30.50);
		
		dos.flush();
		dos.close();
		
		outStream.write(baos.toByteArray());
		outStream.flush();
		outStream.close();
	}
	
}
