package com.ogi.entityHub.repo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.Tuple;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.entityHub.entity.workflow.WorkflowInstanceEntity;


@Repository
public class WorkflowInstanceImplRepo {
	
	private Logger LOGGER = LoggerFactory.getLogger(WorkflowInstanceImplRepo.class);

	@Autowired
	EntityManager em;
	
	
	public Map<String, Long> getAlertDashboardCountData(String range, String user) {

		try {

			LOGGER.info("Fetching dashboard count data | range={} user={}", range, user);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<Tuple> cq = cb.createTupleQuery();

			Root<WorkflowInstanceEntity> root = cq.from(WorkflowInstanceEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			// Date Predicate
			predicates.add(buildDatePredicate(range, cb, root));

			cq.multiselect(cb.count(root).alias("total"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(cb.equal(root.get("status"), "PENDING"),
									cb.equal(root.get("user_assignee"), user)), 1L)
							.otherwise(0L)).alias("opened"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(
									cb.or(cb.equal(root.get("status"), "APPROVED"),
											cb.equal(root.get("status"), "REJECTED")),
									cb.equal(root.get("user_assignee"), user)), 1L)
							.otherwise(0L)).alias("closed"));

			cq.where(predicates.toArray(new Predicate[0]));

			Tuple result = em.createQuery(cq).getSingleResult();

			Map<String, Long> response = new HashMap<>();

			response.put("total", result.get("total", Long.class));
			response.put("opened", result.get("opened", Long.class));
			response.put("closed", result.get("closed", Long.class));

			LOGGER.info("Dashboard count fetched | total={} opened={} closed={}", response.get("total"),
					response.get("opened"), response.get("closed"));

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching dashboard count data | range={} user={}", range, user, ex);

			return Collections.emptyMap();
		}
	}

	private Predicate buildDatePredicate(String range, CriteriaBuilder cb, Root<WorkflowInstanceEntity> root) {

		LocalDateTime now = LocalDateTime.now();

		if (range == null) {
			range = "monthly";
		}

		switch (range.toLowerCase()) {

		case "today":
			LocalDate today = now.toLocalDate();
			return cb.between(root.get("createdAt"), today.atStartOfDay(), today.plusDays(1).atStartOfDay());

		case "weekly":
			return cb.greaterThanOrEqualTo(root.get("createdAt"), now.minusDays(7));

		case "monthly":
			return cb.greaterThanOrEqualTo(root.get("createdAt"), now.minusMonths(1));

		case "6months":
			return cb.greaterThanOrEqualTo(root.get("createdAt"), now.minusMonths(6));

		default:
			throw new IllegalArgumentException("Invalid range type: " + range);
		}
	}
}
