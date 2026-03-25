package com.ogi.aml.repo;

import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.aml.parquet.SearchFieldsDTO;

@Repository
public class TransactionImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(TransactionImplRepo.class);

	@Autowired
	EntityManager em;

	@Autowired
	private ParquetService parquetService;

	public List<TransactionEntity> getTransactionDetailsImplRepo(String startDate, String endDate, String customerId,
			String transId) {

		try {

			LOGGER.info("Fetching transactions | startDate={} endDate={} customerId={} transId={}", startDate, endDate,
					customerId, transId);

			// ✅ Trim inputs
			customerId = (customerId != null) ? customerId.trim() : null;
			transId = (transId != null) ? transId.trim() : null;
			startDate = (startDate != null) ? startDate.trim() : null;
			endDate = (endDate != null) ? endDate.trim() : null;

			// ✅ Validate date range (only if both present)
			if (startDate != null && endDate != null) {
				if (startDate.compareTo(endDate) > 0) {
					LOGGER.error("Invalid date range | startDate > endDate");
					return Collections.emptyList();
				}
			}

			// ✅ Build DTO
			SearchFieldsDTO srcField = new SearchFieldsDTO(customerId, null, startDate, endDate, transId, null);

			// ✅ Execute query
			List<TransactionEntity> list = parquetService.executeQueryReturnEntity("TRANSACTIONS",
					TransactionEntity.class, srcField);

			// ✅ Handle null safely
			if (list == null) {
				return Collections.emptyList();
			}

			// 🔥 IMPORTANT: prevent huge response
			if (isAllParamsEmpty(customerId, transId, startDate, endDate)) {

				LOGGER.warn("No filters provided → limiting result to 100 records");

				return list.stream().limit(100) // 👈 limit results
						.toList();
			}

			LOGGER.info("Transactions fetched successfully | count={}", list.size());

			return list;

			/*
			 * CriteriaBuilder cb = em.getCriteriaBuilder();
			 * CriteriaQuery<TransactionEntity> cq =
			 * cb.createQuery(TransactionEntity.class);
			 * 
			 * Root<TransactionEntity> root = cq.from(TransactionEntity.class);
			 * 
			 * List<Predicate> predicates = new ArrayList<>();
			 * 
			 * if (startDate != null && !startDate.isEmpty()) {
			 * 
			 * Expression<java.sql.Date> txnDateAsDate = cb.function("to_Date",
			 * java.sql.Date.class, root.get("transactiondate"), cb.literal("YYYY-MM-DD"));
			 * 
			 * Predicate betweenDates = cb.between(txnDateAsDate,
			 * java.sql.Date.valueOf(startDate), java.sql.Date.valueOf(endDate));
			 * 
			 * predicates.add(betweenDates); }
			 * 
			 * if (customerId != null && !customerId.isEmpty()) {
			 * predicates.add(cb.equal(root.get("customerid"), customerId)); }
			 * 
			 * if (transId != null && !transId.isEmpty()) {
			 * predicates.add(cb.equal(root.get("transactionid"), transId)); }
			 * 
			 * cq.where(predicates.toArray(new Predicate[0]));
			 * 
			 * List<TransactionEntity> result = em.createQuery(cq).getResultList();
			 * 
			 * LOGGER.info("Transactions fetched | count={}", result.size());
			 */

		} catch (Exception ex) {

			LOGGER.error("Error fetching transactions | customerId={} transId={}", customerId, transId, ex);

			return Collections.emptyList();
		}

	}

	private boolean isAllParamsEmpty(String customerId, String transId, String startDate, String endDate) {

		return (customerId == null || customerId.isEmpty()) && (transId == null || transId.isEmpty())
				&& (startDate == null || endDate == null);
	}

}
