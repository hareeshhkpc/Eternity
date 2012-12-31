/**
 * 
 */
package com.hin.hl7messaging.web;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;
import com.hin.domain.ProcessDefinition;
import com.hin.domain.Step;
import com.hin.service.IConceptService;
import com.hin.service.IProcessDefinitionService;
import com.hin.web.LookupUpdateController;

/**
 * @author vineeth.ng
 *
 */
@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core-test.xml", 
		"classpath:spring/mongodb-test.xml"})
public class XcelTest  extends  AbstractJUnit4SpringContextTests  {
	@Autowired
	LookupUpdateController lookupUpdateController;
	
	@Autowired
	private IProcessDefinitionService processDefinitionService;
	
	@Autowired
	private IConceptService conceptService;
	
	@Test
	public void importFromXcelFile() throws InvalidFormatException, IOException{
		InputStream inp = new FileInputStream("src/test/resources/workbook.xls");

	    Workbook wb = WorkbookFactory.create(inp);
	    Sheet sheet = wb.getSheetAt(0);
	    Row row = sheet.getRow(2);
	    Cell cell = row.getCell(3);
	    if (cell == null)
	        cell = row.createCell(3);
	    cell.setCellType(Cell.CELL_TYPE_STRING);
	    cell.setCellValue("a test");

	    // Write the output to a file
	    FileOutputStream fileOut = new FileOutputStream("src/test/resources/workbook.xls");
	    wb.write(fileOut);
	    fileOut.close();
	}
	
	@Test
	public void readConceptFromExcel() throws Exception{
		InputStream inp = new FileInputStream(
				"src/test/resources/worksheet.xls");
		lookupUpdateController.readConceptFile(inp);
		getUpdatedConcept();
	}
	
	@Test
	public void readProcessFromExcel() throws Exception{
		InputStream inp = new FileInputStream(
				"src/test/resources/processTest.xls");
		lookupUpdateController.readProcessFile(inp);
		getUpdatedProcess();
	}
	
	private void getUpdatedConcept() throws Exception{
		InputStream inp = new FileInputStream("src/test/resources/worksheet.xls");
		Workbook wb = WorkbookFactory.create(inp);
		Sheet sheet;
		sheet = wb.getSheet("concept");
		for(int i=sheet.getFirstRowNum();i<=sheet.getLastRowNum();i++){
			Row row = sheet.getRow(i);
		    String name = row.getCell(0).getRichStringCellValue().getString();
		    Concept concept = conceptService.findByName(name);
		    System.out.println("Concept Name : "+concept.getName());
		    System.out.println("Concept Description : "+concept.getDescription());
		    System.out.println("Concept Short Name : "+concept.getShortName());
		    for(ConceptClass conceptClass: concept.getConceptClasses()){
		    	System.out.println("Concept Class Name : "+conceptClass.getName());
		    	System.out.println("Concept Class Description : "+conceptClass.getDescription());
		    }
		}
	}
	
	private void getUpdatedProcess() throws Exception{
		InputStream inp = new FileInputStream("src/test/resources/processTest.xls");
		Workbook wb = WorkbookFactory.create(inp);
		Sheet sheet;
		sheet = wb.getSheet("processDefinition");
		for(int i=sheet.getFirstRowNum()+1;i<=sheet.getLastRowNum();i++){
			Row row = sheet.getRow(i);
		    String name = row.getCell(0).getRichStringCellValue().getString();
		    ProcessDefinition processDefinition = processDefinitionService.findByProcessName(name);
		    System.out.println("Process Definition Name : "+processDefinition.getProcessName());
		    System.out.println("Process Script : "+processDefinition.getInitializeScript());
		    for(Step ps: processDefinition.getSteps()){
		    	System.out.println("Step Details: "+ps);
		    	System.out.println("\n============================================================\n");
		    }
		}
	}
	
}
