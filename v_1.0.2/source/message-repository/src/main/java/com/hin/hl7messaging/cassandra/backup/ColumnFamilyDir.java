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
public class ColumnFamilyDir {

	private File dir;
	
	private ArrayList<File> ssTables;

	/**
	 * @return the dir
	 */
	public File getDir() {
		return dir;
	}

	/**
	 * @param dir the dir to set
	 */
	public void setDir(File dir) {
		this.dir = dir;
	}

	/**
	 * @return the ssTables
	 */
	public ArrayList<File> getSsTables() {
		return ssTables;
	}

	/**
	 * @param ssTables the ssTables to set
	 */
	public void setSsTables(ArrayList<File> ssTables) {
		this.ssTables = ssTables;
	}
	
}
