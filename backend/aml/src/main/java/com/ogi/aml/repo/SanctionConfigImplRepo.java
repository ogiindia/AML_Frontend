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

import com.ogi.aml.entity.SanctionConfigEntity;

@Repository
public class SanctionConfigImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(SanctionConfigImplRepo.class);

	@Autowired
	EntityManager em;

	public List<SanctionConfigEntity> getSanctionListImplRepo(String sanctionName, List<String> statusList) {
		try {

			LOGGER.info("Fetching sanction list | sanctionName={} statusList={}", sanctionName, statusList);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<SanctionConfigEntity> cq = cb.createQuery(SanctionConfigEntity.class);

			Root<SanctionConfigEntity> root = cq.from(SanctionConfigEntity.class);

			List<Predicate> predicates = new ArrayList<Predicate>();

			if (sanctionName != null && sanctionName != "") {
				predicates.add(root.get("sanction_name").in(statusList));
			}
			cq.where(predicates.toArray(new Predicate[] {}));

			TypedQuery<SanctionConfigEntity> query = em.createQuery(cq);
			return query.getResultList();

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction list", ex);

			return Collections.emptyList();
		}

	}

}
