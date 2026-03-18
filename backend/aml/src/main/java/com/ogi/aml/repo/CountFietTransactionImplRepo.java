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

import com.ogi.aml.entity.CountFietTransactionEntity;
import com.ogi.aml.entity.SuspiciousTransactionEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class CountFietTransactionImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(CountFietTransactionImplRepo.class);

	@Autowired
	EntityManager em;

	public List<CountFietTransactionEntity> getCountFietTransactionRepo(LocalDateTime fromDate, LocalDateTime toDate,
			String reportType) {
		 try {

		        LOGGER.info("Fetching count fiat transactions | fromDate={} toDate={} reportType={}",
		                fromDate, toDate, reportType);

		        CriteriaBuilder cb = em.getCriteriaBuilder();
		        CriteriaQuery<CountFietTransactionEntity> cq = cb.createQuery(CountFietTransactionEntity.class);

		        Root<CountFietTransactionEntity> root = cq.from(CountFietTransactionEntity.class);

		        List<Predicate> predicates = new ArrayList<>();

		        if (fromDate != null) {
		            predicates.add(cb.greaterThanOrEqualTo(root.get("created_date"), fromDate));
		        }

		        if (toDate != null) {
		            predicates.add(cb.lessThanOrEqualTo(root.get("created_date"), toDate));
		        }

		        if (reportType != null && !reportType.isBlank()) {
		            predicates.add(cb.equal(root.get("report_type"), reportType));
		        }

		        cq.select(root)
		          .where(predicates.toArray(new Predicate[0]))
		          .orderBy(cb.desc(root.get("created_date"))); // optional sorting

		        List<CountFietTransactionEntity> result = em.createQuery(cq).getResultList();

		        LOGGER.info("Count fiat transactions fetched | count={}", result.size());

		        return result;

		    } catch (Exception ex) {

		        LOGGER.error("Error fetching count fiat transactions | fromDate={} toDate={} reportType={}",
		                fromDate, toDate, reportType, ex);

		        return Collections.emptyList();
		    }
	}
}
