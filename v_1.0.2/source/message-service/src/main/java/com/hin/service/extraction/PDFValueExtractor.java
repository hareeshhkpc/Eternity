/**
 * 
 */
package com.hin.service.extraction;

import java.awt.geom.Rectangle2D;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.util.PDFTextStripperByArea;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hin.domain.Concept;
import com.hin.domain.ConceptAttribute;
import com.hin.hl7messaging.api.IValueExtractor;
import com.hin.service.IConceptService;

/**
 * @author salam.halley
 * 
 */

public class PDFValueExtractor implements IValueExtractor {
	

	
	public List<ExtractedValue> extractValues(String filePath) {
		List<ExtractedValue> extractedValues = new ArrayList<ExtractedValue>();
		try {
			//extractedValues = extractTextFromPdf("PDFCAC", filePath);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return extractedValues;
	}

	
}
