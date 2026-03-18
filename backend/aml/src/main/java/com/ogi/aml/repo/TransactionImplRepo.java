package com.ogi.aml.repo;

import java.io.Console;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
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

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.service.DashboardService;

@Repository
public class TransactionImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(TransactionImplRepo.class);

	@Autowired
	EntityManager em;

	public List<TransactionEntity> getKycAlertsDetailsImplRepo(String startDate, String endDate, String customerId) {
		try {

			LOGGER.info("Fetching KYC alert transactions | startDate={} endDate={} customerId={}", startDate, endDate,
					customerId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<TransactionEntity> cq = cb.createQuery(TransactionEntity.class);

			Root<TransactionEntity> root = cq.from(TransactionEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (startDate != null && !startDate.isEmpty()) {

				Expression<java.sql.Date> txnDateAsDate = cb.function("to_Date", java.sql.Date.class,
						root.get("transactiondate"), cb.literal("YYYY-MM-DD"));

				Predicate betweenDates = cb.between(txnDateAsDate, java.sql.Date.valueOf(startDate),
						java.sql.Date.valueOf(endDate));

				predicates.add(betweenDates);
			}

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("customerid"), customerId));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<TransactionEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Transactions fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching KYC alert transactions | customerId={}", customerId, ex);

			return Collections.emptyList();
		}

	}

	public List<TransactionEntity> getTransDetailsImplRepo(String customerId, String transId) {
		try {

			LOGGER.info("Fetching transaction details | customerId={} transId={}", customerId, transId);

			CriteriaBuilder cb = em.getCriteriaBuilder();
			CriteriaQuery<TransactionEntity> cq = cb.createQuery(TransactionEntity.class);

			Root<TransactionEntity> root = cq.from(TransactionEntity.class);

			List<Predicate> predicates = new ArrayList<>();

			if (customerId != null && !customerId.isEmpty()) {
				predicates.add(cb.equal(root.get("customerid"), customerId));
			}

			if (transId != null && !transId.isEmpty()) {
				predicates.add(cb.equal(root.get("transactionid"), transId));
			}

			cq.where(predicates.toArray(new Predicate[0]));

			List<TransactionEntity> result = em.createQuery(cq).getResultList();

			LOGGER.info("Transaction details fetched | count={}", result.size());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching transaction details | customerId={} transId={}", customerId, transId, ex);

			return Collections.emptyList();
		}

	}

}
