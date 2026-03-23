package com.ogi.aml.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.Common.CustomerRiskScore;
import com.ogi.aml.Common.RandomIdGenerate;
import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.RuleCategoryEntity;
import com.ogi.aml.entity.SanctionMatchedListEntity;
import com.ogi.aml.entity.SuspiciousTransactionEntity;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.entity.DTO.AlertParentDTO;
import com.ogi.aml.repo.AlertImplRepo;
import com.ogi.aml.repo.AlertRepo;
import com.ogi.aml.repo.CustomerAlertsRepo;
import com.ogi.aml.repo.CustomerRepo;
import com.ogi.aml.repo.KycAlertsDetailsImplRepo;
import com.ogi.aml.repo.KycAlertsDetailsRepo;
import com.ogi.aml.repo.RuleCategoryImplRepo;
import com.ogi.aml.repo.SanctionMatchedListImplRepo;
import com.ogi.aml.repo.SuspiciousTransactionRepo;
import com.ogi.aml.repo.TransactionImplRepo;
import com.ogi.aml.request.RequestKycAlertsDetailsData;
import com.ogi.aml.response.ResponseAlertDetailsData;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;
import com.ogi.aml.response.ResponseSanctionMatchedListData;
import com.ogi.aml.response.ResponseTransactionDetailsData;
import com.ogi.factory.interfaces.Workflowinterface;

@Service
public class ScreeningService {

	private Logger LOGGER = LoggerFactory.getLogger(ScreeningService.class);

	@Autowired
	TransactionImplRepo transactionimplrepo;

	@Autowired
	CustomerAlertsRepo customeralertsrepo;

	@Autowired
	KycAlertsDetailsImplRepo kycalertsdetailsimplrepo;

	@Autowired
	SanctionMatchedListImplRepo sanctionmatchedlistimplrepo;

	@Autowired
	CustomerRepo customerrepo;

	@Autowired
	KycAlertsDetailsRepo kycalertsdetailsrepo;

	@Autowired
	CustomerRiskScore CustomerRiskScore;

	@Autowired
	RuleCategoryImplRepo rulecategoryimplrepo;

	@Autowired
	SuspiciousTransactionRepo suspicioustransactionrepo;

	@Autowired
	AlertImplRepo alertimplrepo;

	@Autowired
	AlertRepo alertrepo;

	@Autowired
	Workflowinterface workflowService;

	public List<Map<String, Object>> getCustomerRuleCount(String customerId, String parentId) {
		try {

			LOGGER.info("Fetching customer rule count | customerId={} parentId={}", customerId, parentId);

			List<AlertsEntity> lstAuditDtlsCount = customeralertsrepo.getTransctionRuleTypeDetailsImplRepo("", "",
					customerId, "", parentId, null);

			if (lstAuditDtlsCount == null || lstAuditDtlsCount.isEmpty()) {
				LOGGER.warn("No rule data found | customerId={} parentId={}", customerId, parentId);
				return Collections.emptyList();
			}

			LOGGER.info("Rule records fetched | count={}", lstAuditDtlsCount.size());

			Map<String, Long> result = lstAuditDtlsCount.stream()
					.collect(Collectors.groupingBy(AlertsEntity::getRiskCategory, Collectors.counting()));

			List<Map<String, Object>> response = result.entrySet().stream().map(e -> {
				Map<String, Object> map = new HashMap<>();
				map.put("name", e.getKey());
				map.put("value", e.getValue());
				return map;
			}).collect(Collectors.toList());

			LOGGER.debug("Customer rule count prepared | resultSize={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching customer rule count | customerId={} parentId={}", customerId, parentId, ex);
		}

		return Collections.emptyList();
	}

	public Map<String, String> getCustomerScore(String customerId, String transactionId) {

		Map<String, String> response = new HashMap<>();

		try {

			LOGGER.info("Fetching customer risk score | customerId={} transactionId={}", customerId, transactionId);

			List<AlertsEntity> lstScore = alertimplrepo.getCustTranRiskScore(customerId, transactionId);

			if (lstScore == null || lstScore.isEmpty()) {
				LOGGER.warn("No risk score found | customerId={} transactionId={}", customerId, transactionId);
				return response;
			}

			AlertsEntity alert = lstScore.stream().findFirst().orElse(null);

			if (alert != null) {

				String custScore = alert.getCust_risk_score();
				String tranScore = alert.getTran_risk_score();

				response.put("custRiskScore", custScore);
				response.put("tranRiskScore", tranScore);

				LOGGER.debug("Risk scores fetched | custScore={} tranScore={}", custScore, tranScore);
			}

		} catch (Exception ex) {

			LOGGER.error("Error fetching customer risk score | customerId={} transactionId={}", customerId,
					transactionId, ex);
		}

		return response;
	}

	public List<ResponseAlertDetailsData> getCustomerRuleDetails(String customerId, String ruleType,
			String alertParentId) {
		try {

			LOGGER.info("Fetching customer rule details | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId);

			List<AlertsEntity> lstAuditDtls = customeralertsrepo.getTransctionRuleTypeDetailsImplRepo("", "",
					customerId, ruleType, alertParentId, null);

			if (lstAuditDtls == null || lstAuditDtls.isEmpty()) {

				LOGGER.warn("No rule details found | customerId={} ruleType={} parentId={}", customerId, ruleType,
						alertParentId);

				return Collections.emptyList();
			}

			LOGGER.info("Rule details fetched successfully | recordCount={}", lstAuditDtls.size());

			List<ResponseAlertDetailsData> response = getCustomerRuleDetailsResult(lstAuditDtls);

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching customer rule details | customerId={} ruleType={} parentId={}", customerId,
					ruleType, alertParentId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseAlertDetailsData> getCustomerRuleDetailsResult(List<AlertsEntity> resp) {
		try {

			LOGGER.debug("Mapping alert entities to response | recordCount={}", resp.size());

			List<ResponseAlertDetailsData> listData = new ArrayList<>();

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_TIME_PATTERN);

			for (AlertsEntity entity : resp) {

				ResponseAlertDetailsData res = new ResponseAlertDetailsData();

				res.setAlert_id(entity.getAlertId());
				res.setAlert_name(entity.getAlertName());
				res.setAlert_desc(entity.getAlertDesc());
				res.setAccno(entity.getAccNo());
				res.setAlert_status(entity.getAlertStatus());
				res.setCust_id(entity.getCustId());
				res.setRisk_category(entity.getRiskCategory());
				res.setAlert_dt(entity.getAlertDT().format(formatter));

				listData.add(res);

				// LOGGER.debug("Mapped alert | alertId={}", entity.getAlertId());
			}

			LOGGER.info("Alert mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping customer rule details", ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseAlertDetailsData> getOpenedAlerts(String customerId, String ruleType, String alertParentId) {
		try {

			LOGGER.info("Fetching opened alerts | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId);

			String alert = Constants.OPEN_ALERT;
			List<String> alertType = Arrays.asList(alert.split(","));

			List<ResponseAlertDetailsData> response = getAlertsDetails(customerId, ruleType, alertParentId, alertType);

			if (response == null || response.isEmpty()) {
				LOGGER.warn("No opened alerts found | customerId={} ruleType={} parentId={}", customerId, ruleType,
						alertParentId);
				return Collections.emptyList();
			}

			LOGGER.info("Opened alerts fetched successfully | count={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching opened alerts | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseAlertDetailsData> getClosedAlerts(String customerId, String ruleType, String alertParentId) {
		try {

			LOGGER.info("Fetching closed alerts | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId);

			String alert = Constants.APPROVED_ALERTS + "," + Constants.REJECTED_ALERTS;
			List<String> alertType = Arrays.asList(alert.split(","));

			List<ResponseAlertDetailsData> response = getAlertsDetails(customerId, ruleType, alertParentId, alertType);

			if (response == null || response.isEmpty()) {
				LOGGER.warn("No closed alerts found | customerId={} ruleType={} parentId={}", customerId, ruleType,
						alertParentId);
				return Collections.emptyList();
			}

			LOGGER.info("Closed alerts fetched successfully | count={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching closed alerts | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseAlertDetailsData> getTriggedAlerts(String customerId, String ruleType, String alertParentId) {
		try {

			LOGGER.info("Fetching triggered alerts | customerId={} ruleType={} parentId={}", customerId, ruleType,
					alertParentId);

			List<ResponseAlertDetailsData> response = getAlertsDetails(customerId, ruleType, alertParentId, null);

			if (response == null || response.isEmpty()) {
				LOGGER.warn("No triggered alerts found | customerId={} ruleType={} parentId={}", customerId, ruleType,
						alertParentId);
				return Collections.emptyList();
			}

			LOGGER.info("Triggered alerts fetched successfully | count={}", response.size());

			return response;

		} catch (Exception ex) {

			LOGGER.error("Error fetching triggered alerts | customerId={} ruleType={} parentId={}", customerId,
					ruleType, alertParentId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseAlertDetailsData> getAlertsDetails(String customerId, String ruleType, String alertParentId,
			List<String> alter_type) {
		try {

			LOGGER.info("Fetching alerts | customerId={} ruleType={} parentId={} alertType={}", customerId, ruleType,
					alertParentId, alter_type);

			LocalDate today = LocalDate.now();
			LocalDate last30Days = today.minusDays(Constants.LAST_30_DAYS);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			String startDate = last30Days.format(formatter);
			String endDate = today.format(formatter);

			LOGGER.debug("Alert search date range | startDate={} endDate={}", startDate, endDate);

			List<AlertsEntity> lstAuditDtls = customeralertsrepo.getTransctionRuleTypeDetailsImplRepo(startDate,
					endDate, customerId, "", alertParentId, alter_type);

			if (lstAuditDtls == null || lstAuditDtls.isEmpty()) {

				LOGGER.warn("No alerts found | customerId={} parentId={}", customerId, alertParentId);

				return Collections.emptyList();
			}

			LOGGER.info("Alerts fetched successfully | recordCount={}", lstAuditDtls.size());

			return getCustomerRuleDetailsResult(lstAuditDtls);

		} catch (Exception ex) {

			LOGGER.error("Error fetching alerts | customerId={} parentId={}", customerId, alertParentId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseTransactionDetailsData> getPreviousTransactions(String customerId) {
		try {

			LOGGER.info("Fetching previous transactions | customerId={}", customerId);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDate today = LocalDate.now();
			LocalDate previousMonthsDate = today.minusMonths(Constants.PREVIOUS_MONTHS);

			String fromDate = previousMonthsDate.format(formatter);
			String toDate = today.format(formatter);

			LOGGER.debug("Transaction date range | fromDate={} toDate={}", fromDate, toDate);

			List<TransactionEntity> lstTrans = transactionimplrepo.getKycAlertsDetailsImplRepo(fromDate, toDate,
					customerId);

			if (lstTrans == null || lstTrans.isEmpty()) {

				LOGGER.warn("No transactions found | customerId={}", customerId);

				return Collections.emptyList();
			}

			LOGGER.info("Transactions fetched successfully | recordCount={}", lstTrans.size());

			return getPreviousTransactionsResult(lstTrans);

		} catch (Exception ex) {

			LOGGER.error("Error fetching previous transactions | customerId={}", customerId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseTransactionDetailsData> getPreviousTransactionsResult(List<TransactionEntity> resp) {
		try {

			LOGGER.debug("Mapping transaction entities | recordCount={}", resp.size());

			List<ResponseTransactionDetailsData> listData = new ArrayList<>();

			for (TransactionEntity entity : resp) {

				ResponseTransactionDetailsData res = new ResponseTransactionDetailsData();

				res.setCustomerid(entity.getCustomerid());
				res.setAccountno(entity.getAccountno());
				res.setBranchcode(entity.getBranchcode());
				res.setTransactiontype(entity.getTransactiontype());
				res.setChanneltype(entity.getChanneltype());
				res.setTransactiondate(entity.getTransactiondate());
				res.setCreated_date(entity.getTransactiondate());

				listData.add(res);

				// LOGGER.debug("Mapped transaction | customerId={}", entity.getCustomerid());
			}

			LOGGER.info("Transaction mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping transaction details", ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseKycAlertsDetailsData> getKycScoreAndDate(String customerId) {
		try {

			LOGGER.info("Fetching KYC score and date | customerId={}", customerId);

			List<KycAlertsEntity> respMenuMapping = kycalertsdetailsimplrepo.getKycAlertsDetails("", "", "", customerId,
					"");

			if (respMenuMapping == null || respMenuMapping.isEmpty()) {

				LOGGER.warn("No KYC alert records found | customerId={}", customerId);

				return Collections.emptyList();
			}

			LOGGER.info("KYC alert records fetched | count={}", respMenuMapping.size());

			return getKycScoreAndDateResult(respMenuMapping);

		} catch (Exception ex) {

			LOGGER.error("Error fetching KYC score and date | customerId={}", customerId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseKycAlertsDetailsData> getKycScoreAndDateResult(List<KycAlertsEntity> resp) {
		try {

			LOGGER.debug("Mapping KYC score and date | recordCount={}", resp.size());

			List<ResponseKycAlertsDetailsData> listData = new ArrayList<>();

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			for (KycAlertsEntity entity : resp) {

				ResponseKycAlertsDetailsData res = new ResponseKycAlertsDetailsData();

				res.setRisk_score(entity.getRisk_score());
				res.setRisk_category(entity.getRisk_category());
				res.setAlert_status(entity.getAlert_status());
				res.setAlert_dt(entity.getAlert_dt().format(formatter));
				res.setModified_dt(entity.getModified_dt().format(formatter));

				listData.add(res);

				LOGGER.debug("Mapped KYC alert | alertId={}", entity.getAlert_id());
			}

			LOGGER.info("KYC score/date mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping KYC score and date", ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseSanctionMatchedListData> getSanctionScore(String customerId) {
		try {

			LOGGER.info("Fetching sanction score | customerId={}", customerId);

			List<SanctionMatchedListEntity> respSanctionMatched = sanctionmatchedlistimplrepo
					.getSanctionMatchedListImplRepo(null, "", customerId);

			if (respSanctionMatched == null || respSanctionMatched.isEmpty()) {

				LOGGER.warn("No sanction score records found | customerId={}", customerId);

				return Collections.emptyList();
			}

			LOGGER.info("Sanction score records fetched | count={}", respSanctionMatched.size());

			return getSanctionScoreResult(respSanctionMatched);

		} catch (Exception ex) {

			LOGGER.error("Error fetching sanction score | customerId={}", customerId, ex);
		}

		return Collections.emptyList();
	}

	public List<ResponseSanctionMatchedListData> getSanctionScoreResult(List<SanctionMatchedListEntity> resp) {
		try {

			LOGGER.debug("Mapping sanction score results | recordCount={}", resp.size());

			List<ResponseSanctionMatchedListData> listData = new ArrayList<>();

			for (SanctionMatchedListEntity entity : resp) {

				ResponseSanctionMatchedListData res = new ResponseSanctionMatchedListData();

				res.setSanction_name(entity.getSanction_name());
				res.setConfidence_score(entity.getConfidence_score());
				res.setConfidence_percentage(entity.getConfidence_percentage());

				listData.add(res);

				LOGGER.debug("Mapped sanction score | customerName={}", entity.getCustomername());
			}

			LOGGER.info("Sanction score mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Error mapping sanction score results", ex);
		}

		return Collections.emptyList();
	}

	public String setKYCAlertGenerated(String customerId, String transId, String cdd_edd, String status) {
		try {

			LOGGER.info("Generating KYC alert | customerId={} transId={} riskType={} status={}", customerId, transId,
					cdd_edd, status);

			List<TransactionEntity> lstAlert = transactionimplrepo.getTransDetailsImplRepo(customerId, transId);

			if (lstAlert == null || lstAlert.isEmpty()) {

				LOGGER.warn("No transaction found for KYC alert generation | customerId={} transId={}", customerId,
						transId);

				return Constants.SUCCESS;
			}

			LOGGER.info("Transactions fetched for alert generation | count={}", lstAlert.size());

			for (TransactionEntity entity : lstAlert) {

				String riskType = cdd_edd;

				if (Constants.CDD_DESC.equals(cdd_edd)) {
					riskType = Constants.CDD_DESC;
				} else if (Constants.EDD_DESC.equals(cdd_edd)) {
					riskType = Constants.EDD_DESC;
				}

				KycAlertsEntity alertDtls = setKycAlert(entity, riskType, status);

				kycalertsdetailsrepo.save(alertDtls);

				LOGGER.debug("KYC alert saved | customerId={} transactionId={} riskType={}", entity.getCustomerid(),
						entity.getTransactionid(), riskType);
			}

			LOGGER.info("KYC alert generation completed | customerId={} transId={}", customerId, transId);

			return Constants.SUCCESS;

		} catch (Exception ex) {

			LOGGER.error("Error generating KYC alert | customerId={} transId={}", customerId, transId, ex);
		}

		return Constants.FAILURE;
	}

	public KycAlertsEntity setKycAlert(TransactionEntity req, String riskCategory, String status) {
		try {

			LOGGER.debug("Creating KYC alert | customerId={} transactionId={} riskCategory={} status={}",
					req.getCustomerid(), req.getTransactionid(), riskCategory, status);

			Optional<CustomerEntity> custDetails = customerrepo.findByIdFromParquet(String.valueOf(req.getCustomerid()));

			if (custDetails.isEmpty()) {

				LOGGER.warn("Customer not found while creating KYC alert | customerId={}", req.getCustomerid());

				return null;
			}

			CustomerEntity customer = custDetails.get();

			KycAlertsEntity entity = new KycAlertsEntity();

			String guid = RandomIdGenerate.RandomDigit("KYC");

			entity.setAlert_id(guid);
			entity.setAccno(req.getAccountno());
			entity.setAlert_dt(LocalDateTime.now());
			entity.setAlert_desc(customer.getCustomername() + Constants.KYC_DESC);
			entity.setAlert_name(Constants.KYC_NAME);
			entity.setCust_id(req.getCustomerid());
			entity.setRisk_category(riskCategory);
			entity.setSource("M");

			Integer score = CustomerRiskScore.getScore(customer.getCustomerid(), req.getTransactionid());

			entity.setRisk_score(score != null ? String.valueOf(score) : null);
			entity.setModified_dt(LocalDateTime.now());

			if ("VERIFIED".equals(status)) {
				entity.setAlert_status(Constants.KYC_VERIFIED);
			} else if ("UN_VERIFIED".equals(status)) {
				entity.setAlert_status(Constants.KYC_UNVERIFIED);
			}

			LOGGER.debug("KYC alert entity created | alertId={}", guid);

			return entity;

		} catch (Exception ex) {

			LOGGER.error("Error creating KYC alert | customerId={} transactionId={}", req.getCustomerid(),
					req.getTransactionid(), ex);
		}

		return null;
	}

	public String setCaregoryWiseTransaction(RequestKycAlertsDetailsData request) {
		try {

			LOGGER.info("Processing category wise transaction | customerId={} transactionId={} riskType={}",
					request.getCust_id(), request.getTransactionId(), request.getCdd_edd());

			String success = setKYCAlertGenerated(request.getCust_id(), request.getTransactionId(),
					request.getCdd_edd(), request.getAlert_status());

			if (!Constants.SUCCESS.equals(success)) {
				return Constants.FAILURE;
			}

			// 🔹 Fetch transaction
			List<TransactionEntity> lstTrans = transactionimplrepo.getTransDetailsImplRepo("",
					request.getTransactionId());

			if (lstTrans == null || lstTrans.isEmpty()) {
				LOGGER.warn("No transaction found | transactionId={}", request.getTransactionId());
				return Constants.SUCCESS;
			}

			TransactionEntity txn = lstTrans.get(0);

			// 🔹 Fetch customer safely
			Optional<CustomerEntity> customer = customerrepo.findByIdFromParquet(String.valueOf(request.getCust_id()));

			
			//CustomerEntity customer = customerrepo.findById(String.valueOf(request.getCust_id())).orElse(null);

			if (customer == null) {
				LOGGER.warn("Customer not found | customerId={}", request.getCust_id());
				return Constants.FAILURE;
			}

			// 🔹 Fetch alerts
			List<AlertsEntity> lstAlert = alertrepo.findByAlertParentId(request.getParentId());

			String suspicionIndicator = (lstAlert == null ? ""
					: lstAlert.stream().filter(a -> "STR".equalsIgnoreCase(a.getRiskCategory()))
							.map(AlertsEntity::getAlertName).filter(name -> name != null && !name.trim().isEmpty())
							.collect(Collectors.joining(";")));

			if (!suspicionIndicator.isEmpty()) {
				suspicionIndicator = "Multiple rule hits : " + suspicionIndicator;
			}

			// 🔹 Fetch comments
			String comments = workflowService.getWorflowHistoryByParentIdWithComments(request.getParentId());

			// 🔹 Build entity
			SuspiciousTransactionEntity susTrans = new SuspiciousTransactionEntity();

			susTrans.setTransactionid(request.getTransactionId());
			susTrans.setReportType("STR");
			susTrans.setEntity_id(request.getParentId());

			// null-safe conversions
			susTrans.setAccount_no(txn.getAccountno() != null ? txn.getAccountno().toString() : null);

			susTrans.setCustomer_id(customer.get().getCustomerid());
			susTrans.setCustomer_name(customer.get().getCustomername());
			susTrans.setPan(customer.get().getPanno());

			susTrans.setTransaction_date(txn.getTransactiondate());
			susTrans.setTransaction_amount(txn.getAmount() != null ? txn.getAmount().toString() : null);

			susTrans.setCurrency(txn.getCurrencycode());
			susTrans.setTransaction_type(txn.getDepositorwithdrawal());

			susTrans.setSuspicion_indicator(suspicionIndicator);
			susTrans.setNarrative_remarks(comments);

			susTrans.setCreatedDate(LocalDateTime.now());
			susTrans.setParent_id(request.getParentId());

			// 🔹 Save
			suspicioustransactionrepo.save(susTrans);

			LOGGER.info("STR record created successfully | transactionId={}", request.getTransactionId());

			return Constants.SUCCESS;

		} catch (Exception ex) {
			LOGGER.error("Error processing category wise transaction | transactionId={}", request.getTransactionId(),
					ex);
			return Constants.FAILURE;
		}
	}

	public Map<String, Long> getAlertRangeCount(String range, String userName) {
		try {

			LOGGER.info("Fetching alert range count | range={} userName={}", range, userName);

			Map<String, Long> resp = alertimplrepo.getDashboardCountData(range, userName);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No alert range data found | range={} userName={}", range, userName);
				return Collections.emptyMap();
			}

			LOGGER.info("Alert range count fetched successfully | resultSize={}", resp.size());

			return resp;

		} catch (Exception ex) {

			LOGGER.error("Error fetching alert range count | range={} userName={}", range, userName, ex);

			throw new RuntimeException("Dashboard service error");
		}
	}

	public Page<AlertParentDTO> getAlertDetails(String custId, int page, int size) {
		try {

			LOGGER.info("Fetching alert details | custId={} page={} size={}", custId, page, size);

			Pageable pageable = PageRequest.of(page, size);

			Page<AlertParentDTO> result = alertimplrepo.getAlertsDetails(custId, pageable);

			LOGGER.info("Alert details fetched | custId={} totalRecords={}", custId, result.getTotalElements());

			return result;

		} catch (Exception ex) {

			LOGGER.error("Error fetching alert details | custId={} page={} size={}", custId, page, size, ex);

			throw new RuntimeException("Error fetching alert details");
		}
	}
}
