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
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class KycAlertsDetailsImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(KycAlertsDetailsImplRepo.class);

	@Autowired
	EntityManager em;

	public List<KycAlertsEntity> getKycAlertsDetails(String riskCategory, String startDate, String endDate,
			String customerId, String accountNo) {
		try {

			LOGGER.info("Fetching KYC alerts | riskCategory={} customerId={} accountNo={}", riskCategory, customerId,
					accountNo);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<KycAlertsEntity> cq = cb.createQuery(KycAlertsEntity.class);

			Root<KycAlertsEntity> root = cq.from(KycAlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (accountNo != null && !accountNo.isEmpty()) {
				predicates.add(cb.equal(root.get("accno"), accountNo));
			}

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("cust_id"), Long.parseLong(customerId)));
			}

			if (riskCategory != null && !riskCategory.isEmpty()) {
				predicates.add(cb.equal(root.get("alert_status"), "unverified"));
				predicates.add(cb.equal(root.get("risk_category"), riskCategory));
			}

			if (startDate != null && !startDate.isEmpty()) {

				predicates.add(cb.equal(root.get("alert_status"), "verified"));

				startDate = startDate + Constants.START_TIME;
				endDate = endDate + Constants.END_TIME;

				DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN);

				LocalDateTime ldtFrom = LocalDateTime.parse(startDate, formatter);
				LocalDateTime ldtTo = LocalDateTime.parse(endDate, formatter);

				predicates.add(cb.between(root.get("alert_dt"), ldtFrom, ldtTo));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<KycAlertsEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("KYC alerts fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching KYC alerts", ex);

			return Collections.emptyList();
		}

	}

	public List<KycAlertsEntity> getKycAlerts(String source, String custId, String accno) {
		try {

			LOGGER.info("Fetching KYC alerts | source={} custId={} accno={}", source, custId, accno);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<KycAlertsEntity> cq = cb.createQuery(KycAlertsEntity.class);

			Root<KycAlertsEntity> root = cq.from(KycAlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (source != null && !source.isEmpty()) {
				predicates.add(cb.equal(root.get("source"), source));
			}

			if (custId != null && !custId.isEmpty()) {
				predicates.add(cb.equal(root.get("cust_id"), custId));
			}

			if (accno != null && !accno.isEmpty()) {
				predicates.add(cb.equal(root.get("accno"), accno));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<KycAlertsEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("KYC alerts fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching KYC alerts | source={} custId={} accno={}", source, custId, accno, ex);

			return Collections.emptyList();
		}

	}

	public Map<String, Long> getKycDashboardCountData(String range) {

		try {

			LOGGER.info("Fetching KYC dashboard data | range={}", range);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<Tuple> cq = cb.createTupleQuery();

			Root<KycAlertsEntity> root = cq.from(KycAlertsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			// Date predicate
			predicates.add(buildDatePredicate(range, cb, root));

			// Risk category conditions
			predicates.add(cb.isNotNull(root.get("risk_category")));
			predicates.add(cb.notEqual(root.get("risk_category"), "NONE"));

			cq.multiselect(

					cb.count(root).alias("total"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(cb.equal(root.get("source"), "A"), cb.equal(root.get("risk_category"), "CDD")),
									1L)
							.otherwise(0L)).alias("autoCDD"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(cb.equal(root.get("source"), "M"), cb.equal(root.get("risk_category"), "CDD")),
									1L)
							.otherwise(0L)).alias("manualCDD"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(cb.equal(root.get("source"), "A"), cb.equal(root.get("risk_category"), "EDD")),
									1L)
							.otherwise(0L)).alias("autoEDD"),

					cb.sum(cb.<Long>selectCase()
							.when(cb.and(cb.equal(root.get("source"), "M"), cb.equal(root.get("risk_category"), "EDD")),
									1L)
							.otherwise(0L)).alias("manualEDD"),

					cb.sum(cb.<Long>selectCase().when(cb.equal(root.get("source"), "K"), 1L).otherwise(0L)).alias("kyc")

			);

			cq.where(predicates.toArray(new Predicate[0]));

			Tuple result = em.createQuery(cq).getSingleResult();

			Map<String, Long> response = new HashMap<>();

			response.put("total", result.get("total", Long.class));
			response.put("autoCDD", result.get("autoCDD", Long.class));
			response.put("manualCDD", result.get("manualCDD", Long.class));
			response.put("autoEDD", result.get("autoEDD", Long.class));
			response.put("manualEDD", result.get("manualEDD", Long.class));
			response.put("kyc", result.get("kyc", Long.class));

			LOGGER.info("KYC dashboard fetched | total={}", response.get("total"));

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching KYC dashboard data | range={}", range, ex);

			return Collections.emptyMap();
		}
	}

	private Predicate buildDatePredicate(String range, CriteriaBuilder cb, Root<KycAlertsEntity> root) {

		LocalDateTime now = LocalDateTime.now();

		if (range == null || range.isBlank()) {
			range = "monthly"; // default
		}

		switch (range.toLowerCase()) {

		case "today":
			LocalDate today = now.toLocalDate();
			return cb.between(root.get("alert_dt"), today.atStartOfDay(), today.plusDays(1).atStartOfDay());

		case "weekly":
			return cb.greaterThanOrEqualTo(root.get("alert_dt"), now.minusDays(7));

		case "monthly":
			return cb.greaterThanOrEqualTo(root.get("alert_dt"), now.minusMonths(1));

		case "6months":
			return cb.greaterThanOrEqualTo(root.get("alert_dt"), now.minusMonths(6));

		default:
			throw new IllegalArgumentException("Invalid range type: " + range);
		}
	}

}
