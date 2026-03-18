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

import com.ogi.aml.entity.SuspiciousTransactionEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class SuspiciousTransactionImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(SuspiciousTransactionImplRepo.class);

	@Autowired
	EntityManager em;

	public List<SuspiciousTransactionEntity> getSuspiciousTransactionImplRepo(LocalDateTime fromDate,
			LocalDateTime toDate, String reportType) {

		try {

			LOGGER.info("Fetching suspicious transactions | fromDate={} toDate={} reportType={}", fromDate, toDate,
					reportType);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<SuspiciousTransactionEntity> cq = cb.createQuery(SuspiciousTransactionEntity.class);

			Root<SuspiciousTransactionEntity> root = cq.from(SuspiciousTransactionEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (fromDate != null) {
				predicates.add(cb.greaterThanOrEqualTo(root.get("createdDate"), fromDate));
			}

			if (toDate != null) {
				predicates.add(cb.lessThanOrEqualTo(root.get("createdDate"), toDate));
			}

			if (reportType != null && !reportType.isBlank()) {
				predicates.add(cb.equal(root.get("reportType"), reportType));
			}

			cq.select(root).where(predicates.toArray(new Predicate[0])).orderBy(cb.desc(root.get("createdDate"))); // optional
																													// sorting

			List<SuspiciousTransactionEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Suspicious transactions fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching suspicious transactions | fromDate={} toDate={} reportType={}", fromDate,
					toDate, reportType, ex);

			return Collections.emptyList();
		}
	}
}
