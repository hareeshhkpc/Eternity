/**
 * 
 */
package com.hin.service.extraction;

import com.hin.hl7messaging.api.IValueExtractor;

/**
 * @author salam.halley
 * 
 */
public class ValueExtractionFactory {
/*	private static PDFValueExtractor pdfValueExtractor = new PDFValueExtractor();*/
	private static XMLValueExtractor xmlValueExtractor = new XMLValueExtractor();
	private static CSVValueExtractor csvValueExtractor = new CSVValueExtractor();

	public static IValueExtractor getExtractor(EXTRACTOR_TYPE extractor_TYPE) {

		switch (extractor_TYPE) {
	/*	case PDF:
			return pdfValueExtractor;*/

		case XML:
			return xmlValueExtractor;

		case CSV:
			return csvValueExtractor;

		default:
			return null;
		}

	}

}
