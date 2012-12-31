package com.hin.service;

import java.util.List;

import com.hin.service.extraction.ExtractedValue;

public interface IPdfExtractorService {
	public List<ExtractedValue> extractTextFromPdf(String fileClass, String fileName) throws Exception ;
}
