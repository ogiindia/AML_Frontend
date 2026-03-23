package com.ogi.aml.repo;

import java.util.List;
import java.util.Optional;

import com.ogi.aml.entity.TransactionEntity;

public interface TransactionCustomRepo {
	
	Optional<TransactionEntity> findByTransDtlsFromParquet(String transId);

}
