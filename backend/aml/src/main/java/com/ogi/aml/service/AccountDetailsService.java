package com.ogi.aml.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.Common.Constants;
import com.ogi.aml.Controller.AmlController;
import com.ogi.aml.entity.AccountDetailsEntity;
import com.ogi.aml.entity.DiligenceDetailsEntity;
import com.ogi.aml.entity.KycAlertsEntity;
import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.repo.AccountDetailsImplRepo;
import com.ogi.aml.repo.DiligenceDetailsImplRepo;
import com.ogi.aml.repo.DiligenceDetailsRepo;
import com.ogi.aml.repo.TransactionImplRepo;
import com.ogi.aml.response.ResponseAccountDetailsData;
import com.ogi.aml.response.ResponseKycAlertsDetailsData;

@Service
public class AccountDetailsService {
	private Logger LOGGER = LoggerFactory.getLogger(AccountDetailsService.class);

	@Autowired
	AccountDetailsImplRepo accountdetailsimplrepo;

	@Autowired
	TransactionImplRepo transactionimplrepo;

	public List<ResponseAccountDetailsData> getAccountDetails(String customerId) {
		try {

			LOGGER.info("Service getAccountDetails called | customerId={}", customerId);

			List<ResponseAccountDetailsData> resp = new ArrayList<>();

			List<AccountDetailsEntity> respMenuMapping = accountdetailsimplrepo.getAccountDetails(customerId,"");

			if (respMenuMapping != null && !respMenuMapping.isEmpty()) {

				LOGGER.info("Account records found | customerId={} | recordCount={}", customerId,
						respMenuMapping.size());

				resp = getAccountDetailsResult(respMenuMapping);

			} else {

				LOGGER.warn("No account details found | customerId={}", customerId);
			}

			return resp;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getAccountDetails service | customerId={}", customerId, ex);

			return Collections.emptyList();
		}
	}

	public List<ResponseAccountDetailsData> getAccountDetailsResult(List<AccountDetailsEntity> resp) {
		try {

			LOGGER.info("Mapping account details | inputRecordCount={}", resp != null ? resp.size() : 0);

			List<ResponseAccountDetailsData> listData = new ArrayList<>();

			for (AccountDetailsEntity entity : resp) {

				ResponseAccountDetailsData res = new ResponseAccountDetailsData();

				res.setAccountno(entity.getAccountno());
				res.setCustomerid(entity.getCustomerid());
				res.setAccounttype(entity.getAccounttype());
				res.setBranchcode(entity.getBranchcode());

				listData.add(res);

				LOGGER.debug("Mapped account | accountNo={}", entity.getAccountno());
			}

			LOGGER.info("Account details mapping completed | outputRecordCount={}", listData.size());

			return listData;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getAccountDetailsResult", ex);

			return Collections.emptyList();
		}
	}

	public List<Map<String, Object>> getTransactionDetails(String customerId) {

		try {

			LOGGER.info("Service getTransactionDetails called | customerId={}", customerId);

			List<Map<String, Object>> output = new ArrayList<>();

			List<TransactionEntity> lsttransaction = transactionimplrepo.getTransactionDetailsImplRepo("", "",
					customerId,"");

			if (lsttransaction == null || lsttransaction.isEmpty()) {

				LOGGER.warn("No transaction data found | customerId={}", customerId);
				return Collections.emptyList();
			}

			LOGGER.info("Transaction records fetched | customerId={} | recordCount={}", customerId,
					lsttransaction.size());

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern(Constants.DATE_PATTERN);

			
			
			Map<Month, Map<String, Long>> result = lsttransaction.stream()
				    .collect(Collectors.groupingBy(t -> {
				        String value = t.getTransactiondate();

				        return OffsetDateTime
				                .parse(value.replace(" ", "T")) // Fix format
				                .toLocalDate()
				                .getMonth();

				    }, TreeMap::new,
				       Collectors.groupingBy(
				           TransactionEntity::getDepositorwithdrawal,
				           Collectors.counting()
				       )
				));

			for (Month month : result.keySet()) {

				Map<String, Long> counts = result.get(month);

				Map<String, Object> map = new HashMap<>();
				map.put("date", month.name().substring(0, 3));
				map.put("deposit", counts.getOrDefault("D", 0L));
				map.put("withdraw", counts.getOrDefault("W", 0L));

				output.add(map);
			}

			LOGGER.info("Transaction summary generated | customerId={} | monthsProcessed={}", customerId,
					output.size());

			return output;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in getTransactionDetails | customerId={}", customerId, ex);

			return Collections.emptyList();
		}
	}
}
