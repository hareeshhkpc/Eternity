/**
 * 
 */
package com.hin.service;



import java.util.List;

import com.hin.domain.ConceptClass;
import com.hin.domain.ConceptLocale;

/**
 * @author thanveer.aqthar
 * 
 */
public interface IConceptLocaleService extends IBaseService<ConceptLocale>{

	public List<ConceptLocale> findByName(ConceptLocale conceptLocale);

	public ConceptLocale save(ConceptLocale conceptLocale) throws Exception;
	
	/*public void  delete(ConceptLocale conceptLocale) throws Exception;*/
	
	public ConceptLocale findById(ConceptLocale conceptLocale);
	public List<ConceptLocale> findAllConceptLocale();
	public List<ConceptLocale> getConcepts();
}
