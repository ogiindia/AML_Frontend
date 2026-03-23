package com.ogi.aml.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.parquet.ParquetService;
import com.ogi.aml.parquet.SearchFieldsDTO;

@Repository
public class TransactionCustomRepoImpl implements TransactionCustomRepo {
	
	@Autowired
	private ParquetService parquetService;

	@Override
	public Optional<TransactionEntity> findByTransDtlsFromParquet(String transId) {

		SearchFieldsDTO srcField = new SearchFieldsDTO(null, null, null, null, transId,null);

		List<TransactionEntity> list = parquetService.executeQueryReturnEntity("TRANSACTIONS", TransactionEntity.class,
				srcField);

		if (list != null && !list.isEmpty()) {
			return Optional.of(list.get(0));
		}

		return Optional.empty();
	}

}
