/**
 * 
 */
package com.hin.hl7messaging.cassandra.backup;

import java.io.File;
import java.util.ArrayList;

/**
 * @author Administrator
 *
 */
public class BackupConfig {

	private File home;
	
	private String keyspaceName;
	
	private File dataDir;
	
	private File keyspaceDir;
	
	private File backupDir;
	
	private ArrayList<ColumnFamilyDir> columnFamilyDirs;

	/**
	 * @return the keyspaceName
	 */
	public String getKeyspaceName() {
		return keyspaceName;
	}

	/**
	 * @param keyspaceName the keyspaceName to set
	 */
	public void setKeyspaceName(String keyspaceName) {
		this.keyspaceName = keyspaceName;
	}

	/**
	 * @return the dataDir
	 */
	public File getDataDir() {
		return dataDir;
	}

	/**
	 * @param dataDir the dataDir to set
	 */
	public void setDataDir(File dataDir) {
		this.dataDir = dataDir;
	}

	/**
	 * @return the keyspaceDir
	 */
	public File getKeyspaceDir() {
		return keyspaceDir;
	}

	/**
	 * @param keyspaceDir the keyspaceDir to set
	 */
	public void setKeyspaceDir(File keyspaceDir) {
		this.keyspaceDir = keyspaceDir;
	}

	/**
	 * @return the backupDir
	 */
	public File getBackupDir() {
		return backupDir;
	}

	/**
	 * @param backupDir the backupDir to set
	 */
	public void setBackupDir(File backupDir) {
		this.backupDir = backupDir;
	}

	/**
	 * @return the columnFamilyDirs
	 */
	public ArrayList<ColumnFamilyDir> getColumnFamilyDirs() {
		return columnFamilyDirs;
	}

	/**
	 * @param columnFamilyDirs the columnFamilyDirs to set
	 */
	public void setColumnFamilyDirs(ArrayList<ColumnFamilyDir> columnFamilyDirs) {
		this.columnFamilyDirs = columnFamilyDirs;
	}

	/**
	 * @return the home
	 */
	public File getHome() {
		return home;
	}

	/**
	 * @param home the home to set
	 */
	public void setHome(File home) {
		this.home = home;
	}
	
	
}
