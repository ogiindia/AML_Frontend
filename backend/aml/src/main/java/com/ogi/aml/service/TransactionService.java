package com.ogi.aml.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.ogi.factory.enums.Operations;
import com.ogi.factory.template.BaseResolver;
import com.ogi.aml.entity.TransactionEntity;

@Service
public class TransactionService extends BaseResolver<TransactionEntity, String> {

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

}
