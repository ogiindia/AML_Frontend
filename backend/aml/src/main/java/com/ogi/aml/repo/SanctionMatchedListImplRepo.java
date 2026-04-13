package com.ogi.aml.repo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
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

import com.ogi.aml.entity.SanctionMatchedListEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class SanctionMatchedListImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(SanctionMatchedListImplRepo.class);

	@Autowired
	EntityManager em;

	public List<SanctionMatchedListEntity> getSanctionMatchedListImplRepo(List<String> statusList, String threshold,
			String customerId, String processType) {
		try {

			LOGGER.info("Fetching sanction matched list | customerId={} threshold={} | processType={}", customerId,
					threshold, processType);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<SanctionMatchedListEntity> cq = cb.createQuery(SanctionMatchedListEntity.class);

			Root<SanctionMatchedListEntity> root = cq.from(SanctionMatchedListEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (statusList != null && !statusList.isEmpty()) {
				predicates.add(root.get("sanction_name").in(statusList));
			}

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("customerid"), customerId));
			}
			if (processType != null && !processType.isEmpty()) {
				predicates.add(cb.equal(root.get("process_type"), processType));
			}

			if (threshold != null && !threshold.isEmpty()) {

				Double thresholdValue = Double.parseDouble(threshold) * 100;

				LOGGER.debug("Threshold value calculated | thresholdValue={}", thresholdValue);

				Expression<Double> confidenceAsDouble = cb.toDouble(root.get("confidence_percentage"));

				predicates.add(cb.greaterThanOrEqualTo(confidenceAsDouble, thresholdValue));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<SanctionMatchedListEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Sanction matched list fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction matched list | customerId={} threshold={}", customerId, threshold,
					ex);

			return Collections.emptyList();
		}
	}
}
