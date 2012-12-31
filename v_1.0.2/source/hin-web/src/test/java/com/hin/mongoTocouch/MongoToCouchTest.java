package com.hin.mongoTocouch;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.http.HttpClient;
import org.ektorp.http.StdHttpClient;
import org.ektorp.impl.StdCouchDbConnector;
import org.ektorp.impl.StdCouchDbInstance;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.hin.domain.Concept;
import com.hin.domain.ConceptClass;

import com.hin.service.impl.ConceptClassService;
import com.hin.service.impl.ConceptService;

@ContextConfiguration(locations = {
		"classpath:spring/applicationContext-core.xml",
		"classpath:spring/mongodb.xml" })
public class MongoToCouchTest extends AbstractJUnit4SpringContextTests {

	@Autowired
	ConceptService conceptService;

	@Autowired
	ConceptClassService conceptClassService;

	private Logger logger = Logger.getLogger(MongoToCouchTest.class.getName());

	@Test
	public void putConceptsFromMongoToCouch() throws MalformedURLException,
			Exception {
		Gson gson = new GsonBuilder().create();
		try {
			HttpClient httpClient = new StdHttpClient.Builder().url(
					"http://127.0.0.1:5984").build();
			CouchDbInstance dbInstance = new StdCouchDbInstance(httpClient);
			CouchDbConnector db = new StdCouchDbConnector("lookups", dbInstance);
			
			List<ConceptClass> conceptList = conceptClassService
					.findAll(ConceptClass.class);
			Iterator<ConceptClass> iterator = conceptList.iterator();
			while (iterator.hasNext()) {
				ConceptClass conceptClass = iterator.next();
				List<Concept> conceptLists = new ArrayList<Concept>();
				conceptLists = conceptService.findAllConceptsByProperty(
						"conceptClasses.name", conceptClass.getName());
				Collections.sort(conceptLists, new Comparator<Concept>() {
					@Override
					public int compare(Concept o1, Concept o2) {
						if (o1.getDescription() == null
								|| o2.getDescription() == null) {
							return -1;
						}
						return o1.getDescription().compareToIgnoreCase(
								o2.getDescription());
					}
				});

				Iterator<Concept> conceptIterator = conceptLists.iterator();
				while (conceptIterator.hasNext()) {
					Concept concept = (Concept) conceptIterator.next();
						Document document = new Document();
						UUID uuid = UUID.randomUUID();
						String docId = uuid.toString();
						System.out.println(docId + "---------"
								+ concept.getName() + "--------"
								+ gson.toJson(concept));
						document.setId(docId);
						document.setModifiedDate(new Date());
						document.setContent(concept);
						db.update(document);
				}
			}
		} catch (Exception e) {
			logger.error("Exception:" + e.getMessage());
		}
	}
}