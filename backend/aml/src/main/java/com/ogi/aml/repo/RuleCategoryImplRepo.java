package com.ogi.aml.repo;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.RuleCategoryEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class RuleCategoryImplRepo {
	
	private Logger LOGGER = LoggerFactory.getLogger(RuleCategoryImplRepo.class);
	
	@Autowired
	EntityManager em;

	public List<RuleCategoryEntity> getRuleCategoryImplRepo(LocalDateTime fromDate, LocalDateTime toDate,
			String transactionId) {
		 try {

		        LOGGER.info("Fetching rule category | fromDate={} toDate={} transactionId={}",
		                fromDate, toDate, transactionId);

		        CriteriaBuilder cb = em.getCriteriaBuilder();
		        CriteriaQuery<RuleCategoryEntity> cq = cb.createQuery(RuleCategoryEntity.class);

		        Root<RuleCategoryEntity> root = cq.from(RuleCategoryEntity.class);

		        List<Predicate> predicates = new ArrayList<>();

		        if (fromDate != null && toDate != null) {
		            predicates.add(cb.between(root.get("created_date"), fromDate, toDate));
		        }

		        if (transactionId != null && !transactionId.isEmpty()) {
		            predicates.add(cb.equal(root.get("transactionid"), transactionId));
		        }

		        cq.where(predicates.toArray(new Predicate[0]));

		        List<RuleCategoryEntity> result = em.createQuery(cq).getResultList();

		        LOGGER.info("Rule category records fetched | count={}", result.size());

		        return result;

		    } catch (Exception ex) {

		        LOGGER.error("Error fetching rule category | transactionId={}", transactionId, ex);

		        return Collections.emptyList();
		    }

	}
}
