/**
 * 
 */
package com.hin.hl7messaging.configuration.generator;

import java.io.File;

/**
 * @author Administrator
 *
 */
public class MessageTypeSchemaDescriptor {
	
	private String messageTypeIdentifier;
	private String messageDisplayName;
	private String createdByWhom;
	private File baseDiractory;
	private String coreSchemaDirName;
	private String schemaDirName;
	private File abrigedSchemaGenXsl;
	private File outputFile;
	private File sourceSchemaFile;	
	
	public String getMessageTypeIdentifier() {
		return messageTypeIdentifier;
	}
	public void setMessageTypeIdentifier(String messageTypeIdentifier) {
		this.messageTypeIdentifier = messageTypeIdentifier;
	}
	public String getMessageDisplayName() {
		return messageDisplayName;
	}
	public void setMessageDisplayName(String messageDisplayName) {
		this.messageDisplayName = messageDisplayName;
	}
	public String getCreatedByWhom() {
		return createdByWhom;
	}
	public void setCreatedByWhom(String createdByWhom) {
		this.createdByWhom = createdByWhom;
	}
	public File getBaseDiractory() {
		return baseDiractory;
	}
	public void setBaseDiractory(File baseDiractory) {
		this.baseDiractory = baseDiractory;
	}
	public String getCoreSchemaDirName() {
		return coreSchemaDirName;
	}
	public void setCoreSchemaDirName(String coreSchemaDirName) {
		this.coreSchemaDirName = coreSchemaDirName;
	}
	public String getSchemaDirName() {
		return schemaDirName;
	}
	public void setSchemaDirName(String schemaDirName) {
		this.schemaDirName = schemaDirName;
	}
	public File getAbrigedSchemaGenXsl() {
		return abrigedSchemaGenXsl;
	}
	public void setAbrigedSchemaGenXsl(File abrigedSchemaGenXsl) {
		this.abrigedSchemaGenXsl = abrigedSchemaGenXsl;
	}
	public File getOutputFile() {
		return outputFile;
	}
	public void setOutputFile(File outputFile) {
		this.outputFile = outputFile;
	}
	public File getSourceSchemaFile() {
		return sourceSchemaFile;
	}
	public void setSourceSchemaFile(File sourceSchemaFile) {
		this.sourceSchemaFile = sourceSchemaFile;
	}
	@Override
	public String toString() {
		return "MessageTypeSchemaDescriptor [messageTypeIdentifier="
				+ messageTypeIdentifier + ", messageDisplayName="
				+ messageDisplayName + ", createdByWhom=" + createdByWhom
				+ ", baseDiractory=" + baseDiractory + ", coreSchemaDirName="
				+ coreSchemaDirName + ", schemaDirName=" + schemaDirName
				+ ", abrigedSchemaGenXsl=" + abrigedSchemaGenXsl
				+ ", outputFile=" + outputFile + ", sourceSchemaFile="
				+ sourceSchemaFile + "]";
	}
}
