/**
 * 
 */
package com.hin.hl7messaging.cassandra.backup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;


/**
 * @author Administrator
 *
 */
public class CassandraDataExportSchedule {

	private final static Logger LOGGER = Logger.getLogger(CassandraDataExportSchedule.class.getName());

	private static Properties props;
	
	private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy_MM_dd");
	
	private static  BackupConfig config;
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		
		if(args == null || args.length < 2){
			LOGGER.severe("No input parameters");
			return;
		}
		
		try {
			initBackup(args);
			
			setUpDirectories();
			
			createBackup();
			
		} catch (Exception e) {
			LOGGER.log(Level.SEVERE, e.getMessage(), e);
		}
	}

	private static void createBackup() throws Exception {
		for(ColumnFamilyDir dir : config.getColumnFamilyDirs()){
			File backupDir = new File(config.getBackupDir(), dir.getDir().getName());
			if(!backupDir.exists()){
				backupDir.mkdirs();
			}
			for(File ssTable : dir.getSsTables()){
				File backupSsTable = new File(backupDir, ssTable.getName());
				
				LOGGER.log(Level.INFO, "SSTable: " + ssTable.getAbsolutePath());
				LOGGER.log(Level.INFO, "Backup: " + backupSsTable.getAbsolutePath());
				
				String toolPath = config.getHome().getAbsolutePath() + "/bin/sstable2json.bat";
				toolPath += " " + ssTable.getAbsolutePath();
				Process process = Runtime.getRuntime().exec(toolPath);
				
				BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
				PrintWriter writer = new PrintWriter(backupSsTable);
				
				String line = null;
				while((line = reader.readLine()) != null){
					writer.println(line);
				}
				
				writer.flush();
				writer.close();
			}
		}
	}

	private static void setUpDirectories() throws Exception {
		String home  = props.getProperty("backup.cassandra.home");
		String data_dir_path = props.getProperty("backup.cassandra.data_dir_path");
		String keyspace_name = props.getProperty("backup.cassandra.keyspace_name");
		String backup_dir = props.getProperty("backup.cassandra.backup_dir");
		
		if(home == null || home.length() < 1){
			throw new Exception("Variable backup.cassandra.home not set");
		}
		if(data_dir_path == null || data_dir_path.length() < 1){
			throw new Exception("Variable backup.cassandra.data_dir_path not set");
		}
		if(keyspace_name == null || keyspace_name.length() < 1){
			throw new Exception("Variable backup.cassandra.keyspace_name not set");
		}
		if(backup_dir == null || backup_dir.length() < 1){
			throw new Exception("Variable backup.cassandra.backup_dir not set");
		}
		
		data_dir_path += "/" + keyspace_name;
		backup_dir += "/" + keyspace_name + "_" + dateFormat.format(new Date());
		
		LOGGER.log(Level.INFO, "Keyspace Dir: " + data_dir_path);
		LOGGER.log(Level.INFO, "Backup Dir: " + backup_dir);
		
		config = new BackupConfig();
		config.setHome(new File(home));
		config.setKeyspaceName(props.getProperty("backup.cassandra.keyspace_name"));
		config.setDataDir(new File(props.getProperty("backup.cassandra.data_dir_path")));
		config.setKeyspaceDir(new File(data_dir_path));
		config.setBackupDir(new File(backup_dir));
		
		File[] cfs = config.getKeyspaceDir().listFiles();
		config.setColumnFamilyDirs(new ArrayList<ColumnFamilyDir>());
		for(File cf : cfs){
			ColumnFamilyDir dir = new ColumnFamilyDir();
			dir.setDir(cf);
			File[] ssTables = cf.listFiles();
			dir.setSsTables(new ArrayList<File>());
			for(File ssTable : ssTables){
				if(ssTable.getName().endsWith("-Data.db")){
					dir.getSsTables().add(ssTable);
				}
			}
			config.getColumnFamilyDirs().add(dir);
		}
	}

	private static void initBackup(String[] args) throws Exception {
		File confFile = new File(args[0]);
		File logFile = new File(args[1]);
		PrintWriter log = null;
		
		try {
			log = new PrintWriter(logFile);
		} catch (FileNotFoundException e1) {
			throw new Exception("Couldn't open log file: " + args[1], e1);	
		}
		
		FileLogHandler handler = new FileLogHandler(log);
		LOGGER.addHandler(handler);
		
		LOGGER.log(Level.INFO, "Initializing backup");
				
		props = new Properties();
		try {
			props.load(new FileReader(confFile));
		} catch (FileNotFoundException e) {
			throw new Exception("Configuration file not found at: " + args[0], e);			
		} catch (IOException e) {
			throw new Exception("Error reading configuration file", e);
		}

		LOGGER.log(Level.INFO, "Initialization complete");
	}

	private static class FileLogHandler extends Handler {
		
		private PrintWriter logger;
		private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		public FileLogHandler(PrintWriter writer){
			this.logger = writer;
		}
		
		@Override
		public void publish(LogRecord record) {
			Date date = new Date(record.getMillis());
			String formattedDate = dateFormat.format(date);
			logger.println("[" + formattedDate + "] - " + record.getLevel() + ": " + record.getMessage());

			if(record.getThrown() != null){
				record.getThrown().printStackTrace(logger);
			}
		}
		
		@Override
		public void flush() {
			logger.flush();
		}
		
		@Override
		public void close() throws SecurityException {
			logger.close();
		}
	};
}
