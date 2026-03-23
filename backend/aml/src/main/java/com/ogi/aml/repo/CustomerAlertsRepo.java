package com.ogi.aml.repo;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.AlertsEntity;

@Repository
public class CustomerAlertsRepo {

	private Logger LOGGER = LoggerFactory.getLogger(CustomerAlertsRepo.class);

	@Autowired
	EntityManager em;

	public List<AlertsEntity> getTransctionRuleTypeDetailsImplRepo(String startDate, String endDate, String customerId,
			String ruleType, String alertParentId, List<String> status) {
		try {

			LOGGER.info(
					"Fetching transaction rule details | startDate={} endDate={} customerId={} ruleType={} alertParentId={}",
					startDate, endDate, customerId, ruleType, alertParentId);

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

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("custId"), customerId));
			}

			if (ruleType != null && !ruleType.isEmpty()) {
				predicates.add(cb.equal(root.get("riskCategory"), ruleType));
			}

			if (alertParentId != null && !alertParentId.isEmpty()) {
				predicates.add(cb.equal(root.get("alertParentId"), alertParentId));
			}

			if (status != null && !status.isEmpty()) {
				predicates.add(root.get("alertStatus").in(status));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			TypedQuery<AlertsEntity> query = em.createQuery(cq);

			List<AlertsEntity> result = query.getResultList();

			LOGGER.info("Transaction rule details fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching transaction rule details", ex);

			return Collections.emptyList();
		}

	}
}
