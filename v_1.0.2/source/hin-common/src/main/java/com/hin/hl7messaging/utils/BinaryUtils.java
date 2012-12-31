package com.hin.hl7messaging.utils;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.codec.binary.Base64;

public class BinaryUtils {

	public static String convertInputStreamToBase64(InputStream sourceStream, int length) throws IOException {
	
		byte[] imageData = new byte[length];
		
		sourceStream.read(imageData);
		
		byte[] encoded = Base64.encodeBase64(imageData);//ncodeBase64(imageData);
		String base64EncodedData = new String(encoded);
		return base64EncodedData;
	}
	public static byte[] decodeInputStreamToBase64(String imageString) throws IOException {
		byte[] decode=null;
		if(imageString!=null){
		decode = new sun.misc.BASE64Decoder().decodeBuffer(imageString);//Base64.decodeBase64(imageString);
		}
		
		//String base64DecodedData = new String(decode);
		
		return decode;
	}
	public static String convertInputStreamToBase64(byte[] bs, int size) {
		byte[] encoded = Base64.encodeBase64(bs);
		String base64EncodedData = new String(encoded);
		return base64EncodedData;
	}
}
