/**
 * 
 */
package com.hin.service.extraction;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import au.com.bytecode.opencsv.CSVReader;

import com.hin.hl7messaging.api.IValueExtractor;

/**
 * @author salam.halley
 * 
 */
public class CSVValueExtractor implements IValueExtractor {

	@Override
	public List<ExtractedValue> extractValues(String filePath) {
		//System.out.println("CSV extractor");
		List<ExtractedValue> extractedValues = new ArrayList<ExtractedValue>();
		Boolean label = false;
		List<String> labelNames = new ArrayList<String>();
		List<String> values = new ArrayList<String>();
		List<DATA_TYPE> dataTypes = new ArrayList<DATA_TYPE>();

		int dataLength = 0;

		CSVReader reader = null;
		
		try {
			reader = new CSVReader(new FileReader(filePath));
			try {
				List<String[]> testEntries = reader.readAll();
				for(int i=0; i<testEntries.size(); i++){
					String[] lineEntries = testEntries.get(i);
					dataLength = lineEntries.length;
					for(int j=0; j<dataLength; j++){
							if(lineEntries[j].length()>0){
								if(label!=true){
									String labelName = lineEntries[j];
									labelName = labelName.split("\\.")[1];
									//System.out.println("label: "+labelName);
									labelNames.add(labelName);
								}else {
									String value = lineEntries[j];
									//System.out.println("value: "+value);
									values.add(value);

									Class<? extends String> classType = value.getClass();
									String type = classType.toString();
									type = type.split("\\.")[2];
									//System.out.println("DataType:\n"+type);
									if (type.equals("String")) {
										dataTypes.add(DATA_TYPE.TEXT);
									} else if (type.equals("Integer")
											|| type.equals("Double")
											|| type.equals("Float")) {
										dataTypes.add(DATA_TYPE.NUMERIC);
									} else if (type.equals("Date")) {
										dataTypes.add(DATA_TYPE.DATE);
									}
								}
								
							}
					
					}
					label = true;
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		} catch (FileNotFoundException e) {
			System.out.println("File not found Exception");
			e.printStackTrace();
		}
		
		for (int index = 0; index < dataLength; index++) {
			ExtractedValue exValue = new ExtractedValue();
			exValue.setName(labelNames.get(index));
			exValue.setValue(values.get(index));
			exValue.setDataType(dataTypes.get(index));
			extractedValues.add(exValue);
		}

		return extractedValues;
	}
}
