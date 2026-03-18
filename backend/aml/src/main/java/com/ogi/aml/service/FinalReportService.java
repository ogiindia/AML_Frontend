package com.ogi.aml.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.entity.CashTransactionEntity;
import com.ogi.aml.entity.CountFietTransactionEntity;
import com.ogi.aml.entity.CrossBorderTransactionEntity;
import com.ogi.aml.entity.NonProfitOrgEntity;
import com.ogi.aml.entity.SuspiciousTransactionEntity;
import com.ogi.aml.repo.AlertImplRepo;
import com.ogi.aml.repo.CashTransactionImplRepo;
import com.ogi.aml.repo.CountFietTransactionImplRepo;
import com.ogi.aml.repo.CrossBorderTransactionImplRepo;
import com.ogi.aml.repo.NonProfitOrgImplRepo;
import com.ogi.aml.repo.SuspiciousTransactionImplRepo;
import com.ogi.aml.repo.SuspiciousTransactionRepo;
import com.ogi.aml.response.ResponseCashTransactionData;
import com.ogi.aml.response.ResponseCountFietTransactionData;
import com.ogi.aml.response.ResponseCrossBorderTransactionData;
import com.ogi.aml.response.ResponseNonProfitOrgData;
import com.ogi.aml.response.ResponseSuspiciousTransactionData;

@Service
public class FinalReportService {

	private Logger LOGGER = LoggerFactory.getLogger(FinalReportService.class);

	@Autowired
	SuspiciousTransactionRepo suspicioustransactionrepo;

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

	@Autowired
	AlertImplRepo alertimplrepo;

	public List<ResponseSuspiciousTransactionData> getFinalStrReport(String fromDate, String toDate,
			String reportType) {
		try {

			LOGGER.info("Service getFinalStrReport called | fromDate={} | toDate={} | reportType={}", fromDate, toDate,
					reportType);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDateTime from = LocalDate.parse(fromDate, formatter).atStartOfDay();
			LocalDateTime to = LocalDate.parse(toDate, formatter).atTime(LocalTime.MAX);

			List<SuspiciousTransactionEntity> entities = suspicioustransactionimplrepo
					.getSuspiciousTransactionImplRepo(from, to, reportType);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No STR report data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("STR report records fetched | recordCount={}", entities.size());

			return getStrDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getFinalStrReport | fromDate={} | toDate={}", fromDate, toDate, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseSuspiciousTransactionData> getStrDetailsResult(List<SuspiciousTransactionEntity> resp) {
		LOGGER.debug("Mapping suspicious transaction entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseSuspiciousTransactionData> listData = new ArrayList<>();

		for (SuspiciousTransactionEntity entity : resp) {

			ResponseSuspiciousTransactionData res = new ResponseSuspiciousTransactionData();

			res.setTransactionid(entity.getTransactionid());
			res.setParentid(entity.getParent_id());
			res.setCustomerid(entity.getCustomer_id());
			res.setReport_type(entity.getReportType());
			res.setEntity_id(entity.getEntity_id());
			res.setAccount_no(entity.getAccount_no());
			res.setCustomer_name(entity.getCustomer_name());
			res.setPan(entity.getPan());
			res.setTransaction_date(entity.getTransaction_date());
			res.setTransaction_amount(entity.getTransaction_amount());
			res.setCurrency(entity.getCurrency());
			res.setTransaction_type(entity.getTransaction_type());
			res.setSuspicion_indicator(entity.getSuspicion_indicator());
			res.setNarrative_remarks(entity.getNarrative_remarks());

			listData.add(res);
		}

		return listData;
	}

	public List<ResponseCashTransactionData> getFinalCtrReport(String fromDate, String toDate, String reportType) {
		try {

			LOGGER.info("Service getFinalCtrReport called | fromDate={} | toDate={} | reportType={}", fromDate, toDate,
					reportType);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDateTime from = LocalDate.parse(fromDate, formatter).atStartOfDay();
			LocalDateTime to = LocalDate.parse(toDate, formatter).atTime(LocalTime.MAX);

			List<CashTransactionEntity> entities = cashtransactionimplrepo.getCashTransactionImplRepo(from, to,
					reportType);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No CTR report data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("CTR report records fetched | recordCount={}", entities.size());

			return getCtrDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getFinalCtrReport | fromDate={} | toDate={}", fromDate, toDate, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseCashTransactionData> getCtrDetailsResult(List<CashTransactionEntity> resp) {
		LOGGER.debug("Mapping CTR entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseCashTransactionData> listData = new ArrayList<>();

		for (CashTransactionEntity entity : resp) {

			ResponseCashTransactionData res = new ResponseCashTransactionData();

			res.setTransactionid(entity.getTransactionid());
			res.setParentid(entity.getParent_id());
			res.setCustomerid(entity.getCustomer_id());
			res.setReport_type(entity.getReport_type());
			res.setEntity_id(entity.getEntity_id());
			res.setBranch_code(entity.getBranch_code());
			res.setAccount_no(entity.getAccount_no());
			res.setCustomer_name(entity.getCustomer_name());
			res.setPan(entity.getPan());
			res.setTransaction_date(entity.getTransaction_date());
			res.setTransaction_amount(entity.getTransaction_amount());
			res.setCurrency(entity.getCurrency());
			res.setTransaction_type(entity.getTransaction_type());
			res.setRemarks(entity.getRemarks());

			listData.add(res);
		}

		return listData;
	}

	public List<ResponseNonProfitOrgData> getFinalNtrReport(String fromDate, String toDate, String reportType) {
		try {

			LOGGER.info("Service getFinalNtrReport called | fromDate={} | toDate={} | reportType={}", fromDate, toDate,
					reportType);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDateTime from = LocalDate.parse(fromDate, formatter).atStartOfDay();
			LocalDateTime to = LocalDate.parse(toDate, formatter).atTime(LocalTime.MAX);

			List<NonProfitOrgEntity> entities = nonprofitorgimplrepo.getNonProfitOrgRepo(from, to, reportType);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No NTR report data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("NTR report records fetched | recordCount={}", entities.size());

			return getNtrDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getFinalNtrReport | fromDate={} | toDate={}", fromDate, toDate, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseNonProfitOrgData> getNtrDetailsResult(List<NonProfitOrgEntity> resp) {
		LOGGER.debug("Mapping NTR entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseNonProfitOrgData> listData = new ArrayList<>();

		for (NonProfitOrgEntity entity : resp) {

			ResponseNonProfitOrgData res = new ResponseNonProfitOrgData();

			res.setTransactionid(entity.getTransactionid());
			res.setParentid(entity.getParent_id());
			res.setCustomerid(entity.getCustomer_id());
			res.setReport_type(entity.getReport_type());
			res.setEntity_id(entity.getEntity_id());
			res.setNgo_name(entity.getNgo_name());
			res.setFcra_registration_number(entity.getFcra_registration_number());
			res.setDonor_name(entity.getDonor_name());
			res.setDonor_country(entity.getDonor_country());
			res.setTransaction_date(entity.getTransaction_date());
			res.setTransaction_amount(entity.getTransaction_amount());
			res.setCurrency(entity.getCurrency());
			res.setPurpose_of_funds(entity.getPurpose_of_funds());
			res.setRemarks(entity.getRemarks());

			listData.add(res);
		}

		return listData;
	}

	public List<ResponseCrossBorderTransactionData> getFinalCbwtrReport(String fromDate, String toDate,
			String reportType) {
		try {

			LOGGER.info("Service getFinalCbwtrReport called | fromDate={} | toDate={} | reportType={}", fromDate,
					toDate, reportType);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDateTime from = LocalDate.parse(fromDate, formatter).atStartOfDay();
			LocalDateTime to = LocalDate.parse(toDate, formatter).atTime(LocalTime.MAX);

			List<CrossBorderTransactionEntity> entities = crossbordertransactionimplrepo
					.getCrossBorderTransactionRepo(from, to, reportType);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No CBWTR report data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("CBWTR report records fetched | recordCount={}", entities.size());

			return getCbwtrDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getFinalCbwtrReport | fromDate={} | toDate={}", fromDate, toDate, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseCrossBorderTransactionData> getCbwtrDetailsResult(List<CrossBorderTransactionEntity> resp) {
		LOGGER.debug("Mapping CBWTR entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseCrossBorderTransactionData> listData = new ArrayList<>();

		for (CrossBorderTransactionEntity entity : resp) {

			ResponseCrossBorderTransactionData res = new ResponseCrossBorderTransactionData();

			res.setTransactionid(entity.getTransactionid());
			res.setParentid(entity.getParent_id());
			res.setCustomerid(entity.getCustomer_id());
			res.setReport_type(entity.getReport_type());
			res.setEntity_id(entity.getEntity_id());
			res.setSender_name(entity.getSender_name());
			res.setSender_country(entity.getSender_country());
			res.setReceiver_name(entity.getReceiver_name());
			res.setReceiver_country(entity.getReceiver_country());
			res.setTransaction_date(entity.getTransaction_date());
			res.setTransaction_amount(entity.getTransaction_amount());
			res.setCurrency(entity.getCurrency());
			res.setSwift_purpose_code(entity.getSwift_purpose_code());
			res.setRemarks(entity.getRemarks());

			listData.add(res);
		}

		return listData;
	}

	public List<ResponseCountFietTransactionData> getFinalCftrReport(String fromDate, String toDate,
			String reportType) {
		try {

			LOGGER.info("Service getFinalCftrReport called | fromDate={} | toDate={} | reportType={}", fromDate, toDate,
					reportType);

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			LocalDateTime from = LocalDate.parse(fromDate, formatter).atStartOfDay();
			LocalDateTime to = LocalDate.parse(toDate, formatter).atTime(LocalTime.MAX);

			List<CountFietTransactionEntity> entities = countfiettransactionimplrepo.getCountFietTransactionRepo(from,
					to, reportType);

			if (entities == null || entities.isEmpty()) {

				LOGGER.warn("No CFTR report data found | fromDate={} | toDate={}", fromDate, toDate);
				return Collections.emptyList();
			}

			LOGGER.info("CFTR report records fetched | recordCount={}", entities.size());

			return getCftrDetailsResult(entities);

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getFinalCftrReport | fromDate={} | toDate={}", fromDate, toDate, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseCountFietTransactionData> getCftrDetailsResult(List<CountFietTransactionEntity> resp) {
		LOGGER.debug("Mapping CFTR entities | recordCount={}", resp != null ? resp.size() : 0);

		List<ResponseCountFietTransactionData> listData = new ArrayList<>();

		for (CountFietTransactionEntity entity : resp) {

			ResponseCountFietTransactionData res = new ResponseCountFietTransactionData();

			res.setTransactionid(entity.getTransactionid());
			res.setParentid(entity.getParent_id());
			res.setCustomerid(entity.getCustomer_id());
			res.setReport_type(entity.getReport_type());
			res.setEntity_id(entity.getEntity_id());
			res.setBranch_code(entity.getBranch_code());
			res.setDetection_date(entity.getDetection_date());
			res.setDenomination(entity.getDenomination());
			res.setQuantity(entity.getQuantity());
			res.setCustomer_name(entity.getCustomer_name());
			res.setPan(entity.getPan());
			res.setRemarks(entity.getRemarks());

			listData.add(res);
		}

		return listData;
	}

}
