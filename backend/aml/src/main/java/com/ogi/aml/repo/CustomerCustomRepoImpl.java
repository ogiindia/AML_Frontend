package com.ogi.aml.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.aml.parquet.SearchFieldsDTO;

@Repository
public class CustomerCustomRepoImpl implements CustomerCustomRepo {

	@Autowired
	private ParquetService parquetService;

	@Override
	public Optional<CustomerEntity> findByIdFromParquet(String customerId) {

		SearchFieldsDTO srcField = new SearchFieldsDTO(customerId, null, null, null, null);

		List<CustomerEntity> list = parquetService.executeQueryReturnEntity("Customers", CustomerEntity.class,
				srcField);

		if (list != null && !list.isEmpty()) {
			return Optional.of(list.get(0));
		}

		return Optional.empty();
	}
}
