/**
 * 
 */
package com.hin.core.repo.impl;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import java.io.Serializable;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import com.hin.core.repo.IBaseRepository;
import com.hin.domain.Status;
import com.hin.domain.core.BaseDomain;
import com.hin.domain.utils.Operators;
import com.hin.domain.utils.SearchCriteria;
import com.hin.domain.utils.SearchCriteriaComparator;

/**
 * @author sreekumar.s
 * 
 */
@Repository
public class BaseRepository<T> implements IBaseRepository<T>, Serializable {

	/* private Logger logger = Logger.getLogger(BaseRepository.class.getName()); */

	@Transient
	@Autowired
	private MongoTemplate mongoTemplate;
	private Criteria criteria;

	@Override
	public T save(T t) throws Exception {
		try {
			mongoTemplate.save(t);
			return t;
		} catch (Exception e) {
			// logger.error(e);
			throw e;

		}
	}

	@Override
	public void update(T t) {
		mongoTemplate.save(t);
	}

	@Override
	public void delete(T t) {
		if (t instanceof BaseDomain) {
			((BaseDomain) t).markAsObsolete();
		}
		mongoTemplate.save(t);
	}

	@Override
	public List<T> findAll(Class<T> clazz) {
		return findAllByProperty("status", Status.ACTIVE.name(), clazz);

	}

	@Override
	public T findById(Object id, Class<T> clazz) {
		return (T) mongoTemplate.findById(id, clazz);
	}

	@Override
	public T findByName(String name, Class<T> clazz) {
		return (T) mongoTemplate.findOne(query(new Criteria().andOperator(
				(where("name").is(name)),
				(where("status").is(Status.ACTIVE.name().toString())))), clazz);
	}

	@Override
	public T findByProperty(String key, Object value, Class<T> clazz) {
		if (value instanceof String) {
			return (T) mongoTemplate.findOne(query(new Criteria().andOperator(
					(where(key).regex(value.toString(), "i")),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		} else {
			return (T) mongoTemplate.findOne(query(new Criteria().andOperator(
					(where(key).is(value)),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		}

	}

	@Override
	public List<T> findAllByProperty(String key, Object value, Class<T> clazz) {
		if (value instanceof String && key != "status") {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key).regex(value.toString(), "i")),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		} else {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key).is(value)),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		}

	}

	@Override
	public List<T> findAllByName(String key, Object value, Class<T> clazz) {
		if (value instanceof String) {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key).regex(value.toString(), "i")),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		} else {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key).is(value)),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		}

	}

	@Override
	public List<T> findByDualProperty(String key1, Object value1, String key2,
			Object value2, Class<T> clazz) {
		if (value1 instanceof String && key1 != "status"
				&& value2 instanceof String && key2 != "status") {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key1).regex(value1.toString(), "i")),
					(where(key2).regex(value2.toString(), "i")),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		} else {
			return mongoTemplate.find(query(new Criteria().andOperator(
					(where(key1).is(value1)), (where(key2).is(value2)),
					(where("status").is(Status.ACTIVE.name().toString())))),
					clazz);
		}
	}

	/**
	 * find records based on multiple searchCriterias
	 */
	public List<T> findByCriteria(List<SearchCriteria> searchCriteria,
			Class<T> clazz) {
		return mongoTemplate.find(query(doBeforeSearch(searchCriteria)), clazz);
	}

	/**
	 * To create Criteria,based on the list of searchCriteria
	 */
	private Criteria doBeforeSearch(List<SearchCriteria> searchCriteria) {
		Collections.sort(searchCriteria, new SearchCriteriaComparator());
		String property = "";
		for (SearchCriteria search : searchCriteria) {
			if ("".equals(property)) {
				criteria = createCriteria(criteria, search, true, false);
			} else if (property.equals(search.getProperty())) {
				criteria = createCriteria(criteria, search, false, true);
			} else {
				criteria = createCriteria(criteria, search, false, false);
			}
			property = search.getProperty();
		}
		System.out.println("query" + criteria.getCriteriaObject().toString());
		return criteria;
	}

	/**
	 * To append the criteria based on different condition
	 * 
	 * @param criteria
	 * @param search
	 * @param flag
	 *            - true when we create a Criteria at first, otherwise false
	 * @param added
	 *            - true when we are appending the different condition for the
	 *            same property, otherwise false
	 */

	private Criteria createCriteria(Criteria criteria, SearchCriteria search,
			Boolean flag, Boolean added) {
		Operators operators = Operators.fromOperatorSymbol(search
				.getCondition());
		/*
		 * System.out.println("operators.getName    " + operators.getName());
		 * System.out.println("operators.getName    " + operators.getValue());
		 */
		switch (operators) {
		case GT: {
			if (flag) {
				criteria = Criteria.where(search.getProperty()).gt(
						search.getValue());
			} else if (added) {
				criteria.gt(search.getValue());
			} else {
				criteria.and(search.getProperty()).gt(search.getProperty());
			}
			break;
		}
		case GTE: {
			if (flag) {
				criteria = Criteria.where(search.getProperty()).gte(
						search.getValue());
			} else if (added) {
				criteria.gte(search.getValue());
			} else {
				criteria.and(search.getProperty()).gte(search.getProperty());
			}
			break;
		}
		case LT: {
			if (flag) {
				criteria = Criteria.where(search.getProperty()).lt(
						search.getValue());
			} else if (added) {
				criteria.lt(search.getValue());
			} else {
				criteria.and(search.getProperty()).lt(search.getProperty());
			}
			break;
		}
		case LTE: {
			if (flag) {
				criteria = Criteria.where(search.getProperty()).lte(
						search.getValue());
			} else if (added) {
				criteria.lte(search.getValue());
			} else {
				criteria.and(search.getProperty()).lte(search.getProperty());
			}
			break;
		}

		case IS: {
			if (flag) {
				if (search.getValue() instanceof String) {
					criteria = Criteria.where(search.getProperty()).regex(
							search.getValue().toString());
				} else if (search.getValue() instanceof Number) {
					criteria = Criteria.where(search.getProperty()).is(
							search.getValue());
				} else if (search.getValue() instanceof Date) {
					criteria = Criteria.where(search.getProperty())
							.is(search.getValue()).type(9);
					// Double 1 ,String 2 ,Object 3 ,Array 4 ,Binary data 5
					// ,Object id 7 ,,Boolean 8 ,Date 9 ,Null 10 , Timestamp 17

				}
			} else if (added) {
				criteria.is(search.getValue());
			} else {
				if (search.getValue() instanceof String) {

					criteria = criteria.and(search.getProperty()).regex(
							search.getValue().toString());
					// criteria.andOperator(Criteria.where(search.getProperty()).regex(search.getValue().toString()));
					// criteria=criteria.and(search.getProperty()).regex(search.getValue().toString());
					// Criteria.where(search.getProperty()).regex(search.getValue().toString())

				} else if (search.getValue() instanceof Number) {
					criteria.and(search.getProperty()).is(search.getValue());
				}

			}
			break;
		}
		}
		System.out.println("query" + criteria.getCriteriaObject().toString());
		return criteria;
	}

}
