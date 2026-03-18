package com.ogi.aml.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.persistence.Convert;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ogi.aml.Common.Constants;
import com.ogi.aml.Common.CustomerRiskScore;
import com.ogi.aml.Common.RandomIdGenerate;
import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.entity.DTO.AlertsDTO;
import com.ogi.aml.repo.CustomerRepo;
import com.ogi.aml.repo.DiligenceDetailsRepo;
import com.ogi.aml.repo.KycAlertsDetailsImplRepo;
import com.ogi.aml.repo.KycAlertsDetailsRepo;
import com.ogi.aml.repo.TransactionImplRepo;
import com.ogi.aml.repo.TransactionRepo;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;

@Service
public class KYCAlertsService {

	private Logger LOGGER = LoggerFactory.getLogger(KYCAlertsService.class);

	@Autowired
	KycAlertsDetailsImplRepo kycalertsdetailsimplrepo;

	@Autowired
	TransactionRepo transactionrepo;

	@Autowired
	TransactionImplRepo transactionimplrepo;

	@Autowired
	CustomerRepo customerrepo;

	@Autowired
	KycAlertsDetailsRepo kycalertsdetailsrepo;

	@Autowired
	CustomerRiskScore customerriskscore;

	public List<ResponseKycAlertsDetailsData> getKycAlertsDetails(String risk_category, String cust_id, String accno) {
		try {

			List<KycAlertsEntity> alerts = kycalertsdetailsimplrepo.getKycAlertsDetails(risk_category, null, null,
					cust_id, accno);

			if (alerts != null && !alerts.isEmpty()) {
				return getKycAlertsDetailsResult(alerts);
			}

			return Collections.emptyList();

		} catch (Exception ex) {
			LOGGER.error("Error fetching KYC alert details | risk_category={} cust_id={} accno={}", risk_category,
					cust_id, accno, ex);
			return Collections.emptyList();
		}
	}

	public List<ResponseKycAlertsDetailsData> getKycAlerts(String source, String cust_id, String accno) {
		try {

			LOGGER.info("Fetching KYC Alerts | source={} cust_id={} accno={}", source, cust_id, accno);

			List<ResponseKycAlertsDetailsData> resp = new ArrayList<>();

			List<KycAlertsEntity> respMenuMapping = kycalertsdetailsimplrepo.getKycAlerts(source, cust_id, accno);

			if (respMenuMapping != null && respMenuMapping.size() > 0) {
				LOGGER.info("KYC Alerts fetched successfully | recordCount={}", respMenuMapping.size());
				resp = getKycAlertsDetailsResult(respMenuMapping);
			} else {
				LOGGER.warn("No KYC Alerts found | source={} cust_id={} accno={}", source, cust_id, accno);
			}

			return resp;

		} catch (Exception ex) {
			LOGGER.error("Error fetching KYC Alerts | source={} cust_id={} accno={}", source, cust_id, accno, ex);
			return Collections.emptyList();
		}

	}

	public List<ResponseKycAlertsDetailsData> getKycAlertsDetailsResult(List<KycAlertsEntity> resp) {
		try {

			LOGGER.info("Mapping KYC Alerts entity to response | recordCount={}", resp.size());

			List<ResponseKycAlertsDetailsData> listData = new ArrayList<>();

			for (KycAlertsEntity entity : resp) {

				ResponseKycAlertsDetailsData res = new ResponseKycAlertsDetailsData();

				res.setAlert_id(entity.getAlert_id());
				res.setAccno(entity.getAccno());
				res.setAlert_desc(entity.getAlert_desc());
				res.setAlert_name(entity.getAlert_name());
				res.setCust_id(entity.getCust_id());
				res.setRisk_score(entity.getRisk_score());
				res.setRisk_category(entity.getRisk_category());
				res.setAlert_status(entity.getAlert_status());

				listData.add(res);

				LOGGER.debug("Mapped Alert ID: {}", entity.getAlert_id());
			}

			LOGGER.info("KYC Alerts mapping completed | totalMapped={}", listData.size());

			return listData;

		} catch (Exception ex) {
			LOGGER.error("Exception occurred while mapping KYC Alerts", ex);
		}

		return Collections.emptyList();
	}

	public Map<String, Long> getKycAlertRangeCount(String range) {
		try {

			LOGGER.info("Fetching KYC Alert range count | range={}", range);

			Map<String, Long> resp = kycalertsdetailsimplrepo.getKycDashboardCountData(range);

			if (resp == null || resp.isEmpty()) {
				LOGGER.warn("No KYC dashboard count data found | range={}", range);
				return Collections.emptyMap();
			}

			LOGGER.info("KYC dashboard count fetched successfully | resultSize={}", resp.size());

			return resp;

		} catch (Exception ex) {
			LOGGER.error("Error fetching KYC dashboard count | range={}", range, ex);
			throw new RuntimeException("Dashboard service error");
		}
	}

	// @Scheduled(fixedDelay = 6000000) // 60000 - 1 min wait for the previous
	// thread and starts at next minute

	public void getKYCAlerts() throws JsonProcessingException {

		try {

			LOGGER.info("KYC Alert job started");

			LocalDate today = LocalDate.now();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			String todayStr = today.format(formatter);

			LocalDate fromDateLocal = today.minusMonths(Constants.PREVIOUS_MONTHS);
			LocalDate toDateLocal = fromDateLocal.minusMonths(Constants.PREVIOUS_MONTHS);

			String fromDate = toDateLocal.format(formatter);
			String toDate = fromDateLocal.format(formatter);

			LOGGER.info("Processing transactions for date range | today={}", todayStr);

			List<TransactionEntity> lstAlert = transactionimplrepo.getKycAlertsDetailsImplRepo(todayStr, todayStr, "");

			if (lstAlert != null && !lstAlert.isEmpty()) {

				LOGGER.info("Transactions fetched for KYC alert generation | count={}", lstAlert.size());

				for (TransactionEntity entity : lstAlert) {

					Integer score = customerriskscore.getScore(String.valueOf(entity.getCustomerid()),
							entity.getTransactionid());

					if (score == null) {
						LOGGER.warn("Risk score not found | customerId={} transactionId={}", entity.getCustomerid(),
								entity.getTransactionid());
						continue;
					}

					if (score >= Constants.CDD_START_RISK_SCORE && score < Constants.CDD_END_RISK_SCORE) {

						kycalertsdetailsrepo.save(setKycAlert(entity, Constants.CDD_DESC));

						LOGGER.debug("CDD alert created | customerId={} transactionId={} score={}",
								entity.getCustomerid(), entity.getTransactionid(), score);

					} else if (score >= Constants.EDD_START_RISK_SCORE && score <= Constants.EDD_END_RISK_SCORE) {

						kycalertsdetailsrepo.save(setKycAlert(entity, Constants.EDD_DESC));

						LOGGER.debug("EDD alert created | customerId={} transactionId={} score={}",
								entity.getCustomerid(), entity.getTransactionid(), score);
					}
				}

			} else {
				LOGGER.info("No transactions found for KYC alert generation");
			}

			LOGGER.info("Updating old KYC alerts | fromDate={} toDate={}", fromDate, toDate);

			List<KycAlertsEntity> lstUpdateAlert = kycalertsdetailsimplrepo.getKycAlertsDetails("", fromDate, toDate,
					"", "");

			if (lstUpdateAlert != null && !lstUpdateAlert.isEmpty()) {

				LOGGER.info("KYC alerts to update | count={}", lstUpdateAlert.size());

				for (KycAlertsEntity entity : lstUpdateAlert) {
					kycalertsdetailsrepo.save(updateKycAlert(entity));
				}

			} else {
				LOGGER.info("No KYC alerts found for update");
			}

			LOGGER.info("KYC Alert job completed successfully");

		} catch (Exception ex) {
			LOGGER.error("Error occurred while processing KYC alerts job", ex);
			throw ex;
		}
	}

	public KycAlertsEntity setKycAlert(TransactionEntity req, String riskCategory) {
		try {

			LOGGER.debug("Creating KYC alert | customerId={} transactionId={} riskCategory={}", req.getCustomerid(),
					req.getTransactionid(), riskCategory);

			Optional<CustomerEntity> custDetails = customerrepo.findById(String.valueOf(req.getCustomerid()));

			if (custDetails.isPresent()) {

				CustomerEntity customer = custDetails.get();

				KycAlertsEntity entity = new KycAlertsEntity();

				String guid = RandomIdGenerate.RandomDigit("KYC");

				Integer score = customerriskscore.getScore(customer.getCustomerid(), req.getTransactionid());

				entity.setAlert_id(guid);
				entity.setAccno(req.getAccountno());
				entity.setAlert_dt(LocalDateTime.now());
				entity.setAlert_desc(customer.getCustomername() + " " + riskCategory + " " + Constants.KYC_DESC);
				entity.setAlert_name(riskCategory + " " + Constants.KYC_NAME);
				entity.setCust_id(req.getCustomerid());
				entity.setRisk_category(riskCategory);
				entity.setSource("A");
				entity.setRisk_score(score != null ? String.valueOf(score) : null);
				entity.setModified_dt(LocalDateTime.now());
				entity.setAlert_status(Constants.KYC_UNVERIFIED);

				LOGGER.debug("KYC alert entity created | alertId={}", guid);

				return entity;

			} else {
				LOGGER.warn("Customer not found while creating KYC alert | customerId={}", req.getCustomerid());
			}

		} catch (Exception ex) {
			LOGGER.error("Error creating KYC alert | customerId={} transactionId={}", req.getCustomerid(),
					req.getTransactionid(), ex);
		}

		return null;
	}

	public KycAlertsEntity updateKycAlert(KycAlertsEntity req) {
		try {

			if (req == null) {
				LOGGER.warn("updateKycAlert called with null request");
				return null;
			}

			LOGGER.debug("Updating KYC alert | alertId={} customerId={}", req.getAlert_id(), req.getCust_id());

			KycAlertsEntity entity = new KycAlertsEntity();

			entity.setAlert_id(req.getAlert_id());
			entity.setAccno(req.getAccno());
			entity.setAlert_dt(req.getAlert_dt());
			entity.setAlert_desc(req.getAlert_desc());
			entity.setAlert_name(req.getAlert_name());
			entity.setCust_id(req.getCust_id());
			entity.setRisk_category(req.getRisk_category());
			entity.setRisk_score(req.getRisk_score());
			entity.setModified_dt(LocalDateTime.now());
			entity.setAlert_status(Constants.KYC_UNVERIFIED);
			entity.setSource("K");

			LOGGER.debug("KYC alert updated successfully | alertId={}", req.getAlert_id());

			return entity;

		} catch (Exception ex) {

			LOGGER.error("Error updating KYC alert | alertId={} customerId={}", req.getAlert_id(), req.getCust_id(),
					ex);
		}

		return null;

	}

}
