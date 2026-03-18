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

import com.ogi.aml.entity.AccountDetailsEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class AccountDetailsImplRepo {
	
	private Logger LOGGER = LoggerFactory.getLogger(AccountDetailsImplRepo.class);
	
	@Autowired
	EntityManager em;
	
	public List<AccountDetailsEntity> getAccountDetails(String customerId) {
		try {

	        LOGGER.info("Fetching account details | customerId={}", customerId);

	        CriteriaBuilder cb = em.getCriteriaBuilder();
	        CriteriaQuery<AccountDetailsEntity> cq = cb.createQuery(AccountDetailsEntity.class);

	        Root<AccountDetailsEntity> root = cq.from(AccountDetailsEntity.class);

	        List<Predicate> predicates = new ArrayList<>();

	        if (customerId != null && !customerId.isEmpty()) {
	            predicates.add(cb.equal(root.get("customerid"), Long.parseLong(customerId)));
	        }

	        cq.where(predicates.toArray(new Predicate[0]));

	        TypedQuery<AccountDetailsEntity> query = em.createQuery(cq);

	        List<AccountDetailsEntity> result = query.getResultList();

	        LOGGER.info("Account details fetched | customerId={} count={}", customerId, result.size());

	        return result;

	    } catch (Exception ex) {

	        LOGGER.error("Error fetching account details | customerId={}", customerId, ex);
	        return Collections.emptyList();
	    }

	}
}
