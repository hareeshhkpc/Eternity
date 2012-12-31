/**
 * 
 */
package com.hin.core.repo.indexing.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hin.core.repo.indexing.IMessageIndexRepository;
import com.hin.domain.index.IndexBase;

/**
 * @author Administrator
 *
 */
@Repository
public class MessageIndexRepository implements IMessageIndexRepository {

	// Injected database connection:
    @PersistenceContext private EntityManager em;

	@Override
	@Transactional
	public void updateIndex(IndexBase index) throws Exception {
		em.persist(index);
	}


	@Override
	public <T> List<T> queryIndex(Class<T> indexClass) {
		Query query = em.createQuery("select count(*) from " + indexClass.getName());
		return query.getResultList();
	}
	
	/*public List<MessageIndex> fetchDayCountStatisticsData(String program,Long indexAttribute,Long month,Long year){
		//Query query = em.createQuery("FROM ");
		Query query = em.createQuery("SELECT count(*) FROM "+MessageIndex.class.getName()+" s where s.PROGRAM='"+program+"'");//' and s.INDEX_ATTRIBUTE_ID='"+indexAttribute+"' and month(s.EFFECTIVETIME)="+month+" and year(s.EFFECTIVETIME)="+year+" group by s.EFFECTIVETIME");
		System.out.println(query.getResultList());
		return query.getResultList();
	}*/
	
	@Override
	@Transactional
	public <T> void updateIndexDetails(IndexBase index, String indexClass) throws Exception {
		Query query = em.createQuery("from " + indexClass+" s where s.program='"+index.getProgram()+"' and s.month="+index.getMonth()+" and s.year="+index.getYear()+" and s.day="+index.getDay()+" and s.status='"+index.getStatus()+"'");
		List<IndexBase> resultSet = query.getResultList();
		if(resultSet!=null&&(!resultSet.isEmpty())){
			String messageIds = new String(resultSet.get(0).getMessageIds());
			messageIds = messageIds+","+new String(index.getMessageIds());
			resultSet.get(0).setCount(resultSet.get(0).getCount()+1);
			resultSet.get(0).setMessageIds(messageIds.toCharArray());
			em.merge(resultSet.get(0));
		}else {
			em.persist(index);
		}
	}
	
	@Override
	public <T> List queryIndexForMonth(String indexClass,String messageType,String program, int month, int year, String status, String facility) {
		Query query = em.createQuery("SELECT s.count,s.day FROM "+indexClass+" s where s.facility like '"+facility+"' and s.program like '"+program+"' and s.month="+month+" and s.year="+year+" and s.status='"+status+"' group by s.year,s.month,s.day");
		List resultSet = query.getResultList();
		return resultSet;
	}
	
	@Override
	public <T> int queryIndexForMonthCount(String indexClass,String messageType,String program, int month, int year, String status, String facility) {
		Query query = em.createQuery("SELECT sum(s.count) FROM "+indexClass+" s where s.facility like '"+facility+"' and s.program like '"+program+"' and s.month="+month+" and s.year="+year+" and s.status='"+status+"'");
		Object resultSet = query.getSingleResult();
		int set=0;
		if(resultSet!=null){
			set = Integer.parseInt(resultSet.toString());
			}else{
				
			} 
		return set;
	}
	
}
