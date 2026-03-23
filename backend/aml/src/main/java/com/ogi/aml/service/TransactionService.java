package com.ogi.aml.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.aml.entity.TransactionEntity;
import com.ogi.aml.repo.TransactionRepo;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.errors.RecordNotFoundException;
import com.ogi.factory.template.BaseResolver;

@Service
public class TransactionService extends BaseResolver<TransactionEntity, String> {

	
	 @Autowired
	    private TransactionRepo transactionrepo;
	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "TRANSACTION";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ_BY_ID);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "AML";
	}
	
	@GraphQLQuery
	public TransactionEntity findTransactionById(String id) {
		return transactionrepo.findByTransDtlsFromParquet(id).orElseThrow(() -> new RecordNotFoundException("Record not found: " + id));
	
	}

}
