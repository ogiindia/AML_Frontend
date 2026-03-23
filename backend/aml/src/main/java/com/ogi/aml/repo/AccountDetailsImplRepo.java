package com.ogi.aml.repo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.AccountDetailsEntity;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.aml.parquet.SearchFieldsDTO;

@Repository
public class AccountDetailsImplRepo {

	private Logger LOGGER = LoggerFactory.getLogger(AccountDetailsImplRepo.class);

	@Autowired
	private ParquetService perquetservice;
	// @Autowired
	// EntityManager em;

	public List<AccountDetailsEntity> getAccountDetails(String customerId) {
		try {

			List<AccountDetailsEntity> list = new ArrayList<>();

			SearchFieldsDTO srcField=new SearchFieldsDTO(customerId,null,null,null,null,null);
			
			list = perquetservice.executeQueryReturnEntity("Accounts", AccountDetailsEntity.class,srcField);

			return list;

		} catch (Exception ex) {
			LOGGER.error("Error fetching account details | customerId={}", customerId, ex);
			return Collections.emptyList();
		}
	}

}
