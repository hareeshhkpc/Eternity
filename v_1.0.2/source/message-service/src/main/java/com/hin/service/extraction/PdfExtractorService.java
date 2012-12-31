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
import com.hin.domain.ConceptClass;
import com.hin.service.IConceptService;
import com.hin.service.IPdfExtractorService;

@Service(value = "PdfExtractorService")
public class PdfExtractorService implements IPdfExtractorService {
	
	@Autowired
	private IConceptService conceptService;
	
	public List<ExtractedValue> extractTextFromPdf(String fileClass, String fileName) throws Exception {
		List<ExtractedValue> extractedValues = new ArrayList<ExtractedValue>();
		List<String> labelCheckList = new ArrayList<String>();
		List<Concept> regionList = new ArrayList<Concept>();
		regionList = conceptService.findAllByProperty("conceptClasses.name",fileClass, Concept.class);
		PDDocument pd;
		File input = new File(fileName);
		pd = PDDocument.load(input);
		List allPages = pd.getDocumentCatalog().getAllPages();
		PDFTextStripperByArea textStripperByArea = new PDFTextStripperByArea();
		for (Concept region : regionList) {
			//extractedValues = new ArrayList<ExtractedValue>();
			List<Concept> labelValueList = new ArrayList<Concept>();
			List<Concept> abcdList = new ArrayList<Concept>();
			abcdList = conceptService.findAllByProperty("conceptClasses.name", region.getName(), Concept.class);
			
			for(Concept c:abcdList){
				List<ConceptClass> ccs = c.getConceptClasses();
				for(ConceptClass cc : ccs){
					if(cc.getName().equals(region.getName())){
						labelValueList.add(c);
						break;
					}
				}
			}
			
			String flag = "";
			ExtractedValue extractedValue = new ExtractedValue();
			for (Concept labelValue : labelValueList) {
				Float x = 0f, y = 0f, width = 0f, height = 0f;
				PDPage page = new PDPage();//(PDPage) allPages.get(0);
				int pageNo=0;
				String AdditionalInfo = null;
				List<ConceptAttribute> conceptAttributes = labelValue.getConceptAttributes();
				for (ConceptAttribute conceptAttribute : conceptAttributes) {
					if (conceptAttribute.getKey().equals("TYPE")&& conceptAttribute.getValue().equals("LABEL")) {
						flag = "label";
					}
					if (conceptAttribute.getKey().equals("X")) {
						x = Float.parseFloat(conceptAttribute.getValue());
					} else if (conceptAttribute.getKey().equals("Y")) {
						y = Float.parseFloat(conceptAttribute.getValue());
					} else if (conceptAttribute.getKey().equals("WIDTH")) {
						width = Float.parseFloat(conceptAttribute.getValue());
					} else if (conceptAttribute.getKey().equals("HEIGHT")) {
						height = Float.parseFloat(conceptAttribute.getValue());
					}else if(conceptAttribute.getKey().equals("PAGE")){
						pageNo=(int) Float.parseFloat(conceptAttribute.getValue());
					}else if(conceptAttribute.getKey().equals("AdditionalInfo")){
						AdditionalInfo=conceptAttribute.getValue();
					}
				}
				Rectangle2D.Float rectRegion = new Rectangle2D.Float(x, y, width, height);
				textStripperByArea.addRegion("region", rectRegion);
				page = (PDPage) allPages.get(pageNo);
				textStripperByArea.extractRegions(page);
				String textFromRegion = textStripperByArea.getTextForRegion("region").replaceAll("(\\r|\\n)", "");
				if(textFromRegion!=null){
					String textFromRegion1 = textFromRegion.replaceAll("(\\r|\\n)", "");
					textFromRegion = textFromRegion1.trim();
				}
				/*if (flag.equals("label")) {
					extractedValue.setName(textFromRegion);
				} else {
					extractedValue.setValue(textFromRegion);
				}*/
				
				if (flag.equals("label")) {
					int count=0;
					for(String ev : labelCheckList){
						if(ev.equals(textFromRegion)){
							count+=1;
						}
					}
					if(AdditionalInfo != null){
						textFromRegion = textFromRegion+AdditionalInfo;
						labelCheckList.add(textFromRegion);
					}else{
						labelCheckList.add(textFromRegion);
					}
					
					if(count!=0){
						extractedValue.setName(textFromRegion+count);
					}else{
						extractedValue.setName(textFromRegion);
					}
				} else {
					// if not label
					extractedValue.setValue(textFromRegion);
				}
				
				flag="";
			}
			extractedValues.add(extractedValue);
		}
		return extractedValues;
	}
}
