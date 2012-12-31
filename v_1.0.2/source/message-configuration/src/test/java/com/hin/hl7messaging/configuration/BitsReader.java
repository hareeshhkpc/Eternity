/**
 * 
 */
package com.hin.hl7messaging.configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.junit.Before;
import org.junit.Test;

/**
 * @author Administrator
 *
 */
public class BitsReader {

	private InputStream inStream;
	
	@Before
	public void init() throws FileNotFoundException{
		inStream = new FileInputStream(new File("src/test/java/com/hin/hl7messaging/configuration/bits.txt"));
	}
	
	@Test
	public void testReadBits() throws IOException{
		byte[] b = new byte[10];
		inStream.read(b);
		System.out.println(b);
		
		printBytes(b);
	}
	
	private void printBytes(byte[] array){
		for(byte b : array){
			System.out.print(b);
			System.out.print(" = ");
			for(int m = 128, i = 1; i < 8 ; i++){
				m = m / 2;				
				//System.out.print("(" + m + ")");
				System.out.print((b & m) == m ? "1" : "0");				
				//System.out.print(" ");
			}
			System.out.println();
		}
	}
}
