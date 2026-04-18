package com.ogi.aml.repo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.SanctionListWeightageEntity;

@Repository
public class SanctionListWeightageImplRepo {
	private Logger LOGGER = LoggerFactory.getLogger(SanctionListWeightageImplRepo.class);

	@Autowired
	EntityManager em;

	public List<SanctionListWeightageEntity> getSanctionListWeightageImplRepo(String customerId) {
		try {

			LOGGER.info("Fetching sanction list weightage | customerId={}", customerId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<SanctionListWeightageEntity> cq = cb.createQuery(SanctionListWeightageEntity.class);

			Root<SanctionListWeightageEntity> root = cq.from(SanctionListWeightageEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			
			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("customerid"), customerId));
			}
			
			Expression<Double> confidenceAsDouble = cb.toDouble(root.get("ptg"));

			

			cq.where(predicates.toArray(new Predicate[0]));

			cq.orderBy(cb.desc(confidenceAsDouble));

			List<SanctionListWeightageEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Sanction list weightage fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction list weightage | customerId={} ", customerId,
					ex);

			return Collections.emptyList();
		}
	}
}
