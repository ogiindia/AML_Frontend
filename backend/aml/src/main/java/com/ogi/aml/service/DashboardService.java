package com.ogi.aml.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.OffsetDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.Controller.AmlController;
import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.entity.BranchMaster;
import com.ogi.aml.entity.BranchMasterEntity;
import com.ogi.aml.entity.CashTransactionEntity;
import com.ogi.aml.entity.CountFietTransactionEntity;
import com.ogi.aml.entity.CrossBorderTransactionEntity;
import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.NonProfitOrgEntity;
import com.ogi.aml.entity.RuleCategoryEntity;
import com.ogi.aml.entity.SuspiciousTransactionEntity;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.repo.AlertImplRepo;
import com.ogi.aml.repo.BranchMasterRepo;
import com.ogi.aml.repo.CashTransactionImplRepo;
import com.ogi.aml.repo.CountFietTransactionImplRepo;
import com.ogi.aml.repo.CrossBorderTransactionImplRepo;
import com.ogi.aml.repo.CustomerRepo;
import com.ogi.aml.repo.KycAlertsDetailsImplRepo;
import com.ogi.aml.repo.NonProfitOrgImplRepo;
import com.ogi.aml.repo.RuleCategoryImplRepo;
import com.ogi.aml.repo.SuspiciousTransactionImplRepo;
import com.ogi.aml.repo.TransactionImplRepo;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;

@Service
public class DashboardService {

	private Logger LOGGER = LoggerFactory.getLogger(DashboardService.class);

	@Autowired
	TransactionImplRepo transactionimplrepo;

	@Autowired
	CustomerRepo customerrepo;

	@Autowired
	BranchMasterRepo branchmasterrepo;

	@Autowired
	KycAlertsDetailsImplRepo kycalertsdetailsimplrepo;

	@Autowired
	SuspiciousTransactionImplRepo suspicioustransactionimplrepo;

	@Autowired
	CashTransactionImplRepo cashtransactionimplrepo;

	@Autowired
	NonProfitOrgImplRepo nonprofitorgimplrepo;

	@Autowired
	CrossBorderTransactionImplRepo crossbordertransactionimplrepo;

	@Autowired
	CountFietTransactionImplRepo countfiettransactionimplrepo;

	public List<Map<String, Object>> getDashboardRuleCount() {
		try {
			LOGGER.info("Service getDashboardRuleCount called");

			LocalDate today = LocalDate.now();
			LocalDateTime startOfDay = today.atStartOfDay();
			LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

			List<SuspiciousTransactionEntity> lstStrRule = suspicioustransactionimplrepo
					.getSuspiciousTransactionImplRepo(startOfDay, endOfDay, "");

			List<CashTransactionEntity> lstCtrRule = cashtransactionimplrepo.getCashTransactionImplRepo(startOfDay,
					endOfDay, "");

			List<NonProfitOrgEntity> lstNtrRule = nonprofitorgimplrepo.getNonProfitOrgRepo(startOfDay, endOfDay, "");

			List<CrossBorderTransactionEntity> lstCbwtrRule = crossbordertransactionimplrepo
					.getCrossBorderTransactionRepo(startOfDay, endOfDay, "");

			List<CountFietTransactionEntity> lstCftrRule = countfiettransactionimplrepo
					.getCountFietTransactionRepo(startOfDay, endOfDay, "");

			int totalStr = lstStrRule == null ? 0
					: (int) lstStrRule.stream().filter(e -> e.getTransactionid() != null).count();

			int totalCtr = lstCtrRule == null ? 0
					: (int) lstCtrRule.stream().filter(e -> e.getTransactionid() != null).count();

			int totalNtr = lstNtrRule == null ? 0
					: (int) lstNtrRule.stream().filter(e -> e.getTransactionid() != null).count();

			int totalCbwtr = lstCbwtrRule == null ? 0
					: (int) lstCbwtrRule.stream().filter(e -> e.getTransactionid() != null).count();

			int totalCftr = lstCftrRule == null ? 0
					: (int) lstCftrRule.stream().filter(e -> e.getTransactionid() != null).count();

			List<Map<String, Object>> response = new ArrayList<>();

			response.add(createDashboardItem("STR", totalStr));
			response.add(createDashboardItem("CTR", totalCtr));
			response.add(createDashboardItem("NTR", totalNtr));
			response.add(createDashboardItem("CBWTR", totalCbwtr));
			response.add(createDashboardItem("CFTR", totalCftr));

			LOGGER.info("Dashboard rule count generated successfully");

			return response;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getDashboardRuleCount", ex);
			return Collections.emptyList();
		}
	}

	private Map<String, Object> createDashboardItem(String name, int value) {

		Map<String, Object> map = new HashMap<>();
		map.put("name", name);
		map.put("value", value);

		return map;
	}

	public List<Map<String, Object>> getRecurringCustomerCount() {
		try {

			LOGGER.info("Service getRecurringCustomerCount called");

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);
			String today = LocalDate.now().format(formatter);

			List<TransactionEntity> lsttrans = transactionimplrepo.getTransactionDetailsImplRepo(today, today, "","");

			if (lsttrans == null || lsttrans.isEmpty()) {

				LOGGER.warn("No transaction data found for today");
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | recordCount={}", lsttrans.size());

			Map<Long, Long> result = lsttrans.stream().filter(x -> x.getCustomerid() != null)
					.collect(Collectors.groupingBy(TransactionEntity::getCustomerid, Collectors.counting()));

			List<Map<String, Object>> response = result.entrySet().stream()
					.sorted(Map.Entry.<Long, Long>comparingByValue().reversed()).limit(10).map(e -> {

						Optional<CustomerEntity> customer = customerrepo.findByIdFromParquet(String.valueOf(e.getKey()));

						Map<String, Object> map = new HashMap<>();

						if (customer.isPresent()) {
							map.put("name", customer.get().getCustomername());
						} else {
							map.put("name", e.getKey());
						}

						map.put("total", e.getValue());

						return map;
					}).collect(Collectors.toList());

			LOGGER.info("Recurring customer dashboard generated | topCustomers={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getRecurringCustomerCount", ex);

			return Collections.emptyList();
		}
	}

	public List<Map<String, Object>> getRepeatedCustomerCount() {
		try {

			LOGGER.info("Service getRepeatedCustomerCount called");

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDate today = LocalDate.now();
			String fromDate = today.minusMonths(1).format(formatter);
			String toDate = today.format(formatter);

			List<TransactionEntity> lsttrans = transactionimplrepo.getTransactionDetailsImplRepo(fromDate, toDate, "","");

			if (lsttrans == null || lsttrans.isEmpty()) {

				LOGGER.warn("No transaction data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | recordCount={}", lsttrans.size());

			Map<Long, Long> result = lsttrans.stream().filter(x -> x.getCustomerid() != null)
					.collect(Collectors.groupingBy(TransactionEntity::getCustomerid, Collectors.counting()));

			List<Map<String, Object>> response = result.entrySet().stream()
					.sorted(Map.Entry.<Long, Long>comparingByValue().reversed()).limit(10).map(e -> {

						Optional<CustomerEntity> customer = customerrepo.findByIdFromParquet(String.valueOf(e.getKey()));

						Map<String, Object> map = new HashMap<>();

						if (customer.isPresent()) {
							map.put("name", customer.get().getCustomername());
						} else {
							map.put("name", e.getKey());
						}

						map.put("total", e.getValue());

						return map;
					}).collect(Collectors.toList());

			LOGGER.info("Repeated customer dashboard generated | topCustomers={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getRepeatedCustomerCount", ex);

			return Collections.emptyList();
		}
	}

	public List<Map<String, Object>> getSuspiciousTxnCount() {
		try {

			LOGGER.info("Service getSuspiciousTxnCount called");

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);
			String today = LocalDate.now().format(formatter);

			List<TransactionEntity> lsttrans = transactionimplrepo.getTransactionDetailsImplRepo(today, today, "","");

			if (lsttrans == null || lsttrans.isEmpty()) {

				LOGGER.warn("No transaction data found for date={}", today);
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | recordCount={}", lsttrans.size());

			Map<String, Long> result = lsttrans.stream().filter(x -> x.getCustomerid() != null)
					.collect(Collectors.groupingBy(TransactionEntity::getChanneltype, Collectors.counting()));

			List<Map<String, Object>> response = result.entrySet().stream().map(e -> {

				Map<String, Object> map = new HashMap<>();
				map.put("channel", e.getKey());
				map.put("transactions", e.getValue());

				return map;
			}).collect(Collectors.toList());

			LOGGER.info("Suspicious transaction dashboard generated | channels={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getSuspiciousTxnCount", ex);

			return Collections.emptyList();
		}
	}

	public List<Map<String, Object>> getTopBranchCount() {
		try {

			LOGGER.info("Service getTopBranchCount called");

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);
			String today = LocalDate.now().format(formatter);

			List<TransactionEntity> lsttrans = transactionimplrepo.getTransactionDetailsImplRepo(today, today, "","");

			if (lsttrans == null || lsttrans.isEmpty()) {

				LOGGER.warn("No transaction data found for date={}", today);
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | recordCount={}", lsttrans.size());

			Map<String, Long> result = lsttrans.stream().filter(x -> x.getCustomerid() != null)
					.collect(Collectors.groupingBy(TransactionEntity::getBranchcode, Collectors.counting()));

			List<Map<String, Object>> response = result.entrySet().stream()
					.sorted(Map.Entry.<String, Long>comparingByValue().reversed()).limit(10).map(e -> {

						Optional<BranchMasterEntity> branch = branchmasterrepo.findById(e.getKey());

						Map<String, Object> map = new HashMap<>();

						if (branch.isPresent()) {
							map.put("name", branch.get().getBranchname());
						} else {
							map.put("name", e.getKey());
						}

						map.put("total", e.getValue());

						return map;
					}).collect(Collectors.toList());

			LOGGER.info("Top branch dashboard generated | branches={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getTopBranchCount", ex);

			return Collections.emptyList();
		}
	}

	public List<Map<String, Object>> getRuleVsTransaction() {
		try {

			LOGGER.info("Service getRuleVsTransaction called");
			DateTimeFormatter formatter = new DateTimeFormatterBuilder()
			        .parseCaseInsensitive()   // ✅ IMPORTANT
			        .appendPattern(Constants.PARQUET_DATE_PATTERN)
			        .toFormatter(Locale.ENGLISH);
			
			DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSSXXX");

			Year currentYear = Year.now();

			LocalDate startDate = currentYear.atDay(1);
			LocalDate endDate = currentYear.atMonth(12).atEndOfMonth();

			String fromDate = startDate.minusMonths(1).format(formatter);
			String toDate = endDate.format(formatter);

			List<TransactionEntity> lsttransaction = transactionimplrepo.getTransactionDetailsImplRepo(fromDate, toDate,
					"","");

			if (lsttransaction == null || lsttransaction.isEmpty()) {

				LOGGER.warn("No transaction data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | recordCount={}", lsttransaction.size());

			

				Map<Month, Map<String, Long>> result = lsttransaction.stream()
				    .filter(t -> t.getTransactiondate() != null && !t.getTransactiondate().isEmpty())
				    .collect(Collectors.groupingBy(
				        t -> LocalDate.parse(
				                t.getTransactiondate().toUpperCase(),
				                formatter
				            ).getMonth(),
				        TreeMap::new,
				        Collectors.groupingBy(
				            t -> t.getDepositorwithdrawal() != null ? t.getDepositorwithdrawal() : "UNKNOWN",
				            Collectors.counting()
				        )
				    ));
				
			List<Map<String, Object>> output = new ArrayList<>();

			for (Map.Entry<Month, Map<String, Long>> entry : result.entrySet()) {

				Month month = entry.getKey();
				Map<String, Long> counts = entry.getValue();

				Long totalCount = counts.values().stream().mapToLong(Long::longValue).sum();

				Map<String, Object> map = new HashMap<>();
				map.put("date", month.name().substring(0, 3));
				map.put("count", totalCount);

				output.add(map);
			}

			LOGGER.info("Rule vs Transaction dashboard generated | monthsProcessed={}", output.size());

			return output;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getRuleVsTransaction", ex);

			return Collections.emptyList();
		}
	}

}
