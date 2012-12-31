/**
 * 
 */
package com.hin.hl7messaging.api;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.hin.service.extraction.ExtractedValue;

/**
 * @author salam.halley
 * 
 */
public interface IValueExtractor {
	public List<ExtractedValue> extractValues(String filePath);
}
