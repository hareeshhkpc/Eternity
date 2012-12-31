/**
 * 
 */
package com.hin.domain;

import java.util.ArrayList;
import java.util.List;

/**
 * @author s.thamilarasi
 * 
 */
public enum ConceptDataType {
	TEXT("Text", new Concept()), NUMBER("Number", new Concept()), NUMERICRANGE(
			"NumericRange", new NumericRange()), CONCEPT("Concept",
			new Concept()), DATE("Date", new Concept()), DATATIME("DateTime",
			new Concept()),TIME("Time", new Concept()), BOOLEAN("Boolean", new Concept());

	private final String conceptDataType;
	private final DataType dataType;

	ConceptDataType(String conceptDataType, DataType dataType) {
		this.conceptDataType = conceptDataType;
		this.dataType = dataType;
	}

	public String getName() {
		return name();
	}

	public String getValue() {
		return conceptDataType;
	}

	public DataType getType() {
		return dataType;
	}

	public static List<ConceptDataType> getConceptDataTypes() {
		List<ConceptDataType> concept = new ArrayList<ConceptDataType>();
		for (ConceptDataType conceptDataType : values()) {
			concept.add(conceptDataType);
		}
		return concept;
	}

}
