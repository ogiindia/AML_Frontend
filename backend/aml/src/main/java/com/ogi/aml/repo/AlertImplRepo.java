package com.ogi.aml.repo;

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
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.DTO.AlertParentDTO;
import com.ogi.aml.service.DashboardService;

@Repository
public class AlertImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(AlertImplRepo.class);

	@Autowired
	EntityManager em;

	public List<AlertsEntity> getAlertsDetails(String startDate, String endDate, String transId) {
		try {

			LOGGER.info("Fetching alerts | startDate={} endDate={} transId={}", startDate, endDate, transId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<AlertsEntity> cq = cb.createQuery(AlertsEntity.class);

			Root<AlertsEntity> root = cq.from(AlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (startDate != null && !startDate.isEmpty()) {

				startDate = startDate + Constants.START_TIME;
				endDate = endDate + Constants.END_TIME;

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN);

				LocalDateTime ldtFrom = LocalDateTime.parse(startDate, formatter);
				LocalDateTime ldtTo = LocalDateTime.parse(endDate, formatter);

				predicates.add(cb.between(root.get("alertDT"), ldtFrom, ldtTo));
			}

			if (transId != null && !transId.isEmpty()) {
				predicates.add(cb.equal(root.get("transactionId"), transId));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			TypedQuery<AlertsEntity> query = em.createQuery(cq);

			List<AlertsEntity> result = query.getResultList();

			LOGGER.info("Alerts fetched successfully | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching alerts | startDate={} endDate={} transId={}", startDate, endDate, transId, ex);

			return Collections.emptyList();
		}

	}

	public Map<String, Long> getDashboardCountData(String range, String user) {

		try {

			LOGGER.info("Fetching dashboard count data | range={} user={}", range, user);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<Tuple> cq = cb.createTupleQuery();

			Root<AlertsEntity> root = cq.from(AlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			// Date Predicate
			predicates.add(buildDatePredicate(range, cb, root));

			cq.multiselect(
			        cb.count(root).alias("total"),

			        cb.sum(cb.<Long>selectCase()
			                .when(
			                    cb.or(
			                        cb.equal(root.get("alertStatus"), Constants.OPEN_ALERT),
			                        cb.like(root.get("alertStatus"), "%LEVEL%")
			                    ),
			                    1L
			                )
			                .otherwise(0L)
			        ).alias("opened"),

			        cb.sum(cb.<Long>selectCase()
			                .when(
			                        cb.or(
			                                cb.equal(root.get("alertStatus"), Constants.APPROVED_ALERTS),
			                                cb.equal(root.get("alertStatus"), Constants.REJECTED_ALERTS)
			                        ),
			                        1L
			                )
			                .otherwise(0L)
			        ).alias("closed")
			);

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

	private Predicate buildDatePredicate(String range, CriteriaBuilder cb, Root<AlertsEntity> root) {

		LocalDateTime now = LocalDateTime.now();

		if (range == null) {
			range = "monthly";
		}

		switch (range.toLowerCase()) {

		case "today":
			LocalDate today = now.toLocalDate();
			return cb.between(root.get("alertDT"), today.atStartOfDay(), today.plusDays(1).atStartOfDay());

		case "weekly":
			return cb.greaterThanOrEqualTo(root.get("alertDT"), now.minusDays(7));

		case "monthly":
			return cb.greaterThanOrEqualTo(root.get("alertDT"), now.minusMonths(1));

		case "6months":
			return cb.greaterThanOrEqualTo(root.get("alertDT"), now.minusMonths(6));

		default:
			throw new IllegalArgumentException("Invalid range type: " + range);
		}
	}

	public Page<AlertParentDTO> getAlertsDetails(String custId, Pageable pageable) {

		CriteriaBuilder cb = em.getCriteriaBuilder();
		CriteriaQuery<AlertParentDTO> query = cb.createQuery(AlertParentDTO.class);

		Root<AlertsEntity> root = query.from(AlertsEntity.class);

		List<Predicate> predicates = new ArrayList<>();

		if (custId != null && !custId.isEmpty()) {
			predicates.add(cb.equal(root.get("alertAssignee"), custId));
		}

		Expression<String> statusCase = cb.<String>selectCase()
				.when(root.get("alertStatus").in("APPROVED", "REJECTED"), "CLOSED").otherwise(root.get("alertStatus"));

		query.select(cb.construct(AlertParentDTO.class, root.get("alertParentId"), cb.count(root.get("alertId")),
				root.get("custId"), root.get("transactionId"), cb.max(root.get("alertDT")), cb.greatest(statusCase),
				cb.max(root.get("id"))));

		query.where(predicates.toArray(new Predicate[0]));
		query.groupBy(root.get("alertParentId"), root.get("custId"), root.get("transactionId"));

		Expression<Integer> statusOrder = cb.<Integer>selectCase().when(cb.equal(cb.greatest(statusCase), "OPEN"), 1)
				.when(cb.equal(cb.greatest(statusCase), "CLOSED"), 2).otherwise(3);

		query.orderBy(cb.desc(cb.max(root.get("alertDT"))), cb.desc(cb.max(root.get("id"))), cb.asc(statusOrder));

		TypedQuery<AlertParentDTO> typedQuery = em.createQuery(query);

		typedQuery.setFirstResult((int) pageable.getOffset());
		typedQuery.setMaxResults(pageable.getPageSize());

		List<AlertParentDTO> results = typedQuery.getResultList();

		// count query
		CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
		Root<AlertsEntity> countRoot = countQuery.from(AlertsEntity.class);

		countQuery.select(cb.countDistinct(countRoot.get("alertParentId")));
		countQuery.where(predicates.toArray(new Predicate[0]));

		Long total = em.createQuery(countQuery).getSingleResult();

		return new PageImpl<>(results, pageable, total);
	}

	public List<AlertsEntity> getCustTranRiskScore(String customerId, String transactionId) {

		try {

			LOGGER.info("Fetching customer transaction risk score | customerId={} transactionId={}", customerId,
					transactionId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<AlertsEntity> cq = cb.createQuery(AlertsEntity.class);

			Root<AlertsEntity> root = cq.from(AlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("custId"), customerId));
			}

			if (transactionId != null && !transactionId.isEmpty()) {
				predicates.add(cb.equal(root.get("transactionId"), transactionId));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			// latest alert first
			cq.orderBy(cb.desc(root.get("alertDT")));

			TypedQuery<AlertsEntity> query = em.createQuery(cq);

			query.setMaxResults(1);

			List<AlertsEntity> result = query.getResultList();

			LOGGER.info("Risk score query executed | recordsFound={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching customer transaction risk score | customerId={} transactionId={}", customerId,
					transactionId, ex);

			return Collections.emptyList();
		}
	}

}
