package com.ogi.aml.repo;

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

import com.ogi.aml.entity.DiligenceDetailsEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class DiligenceDetailsImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(DiligenceDetailsImplRepo.class);

	@Autowired
	EntityManager em;

	public List<DiligenceDetailsEntity> getDiligenceDetails(String customerId) {
		try {

			LOGGER.info("Fetching diligence details | customerId={}", customerId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<DiligenceDetailsEntity> cq = cb.createQuery(DiligenceDetailsEntity.class);

			Root<DiligenceDetailsEntity> root = cq.from(DiligenceDetailsEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("customerId"), customerId));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<DiligenceDetailsEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Diligence details fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching diligence details | customerId={}", customerId, ex);

			return Collections.emptyList();
		}

	}
}
