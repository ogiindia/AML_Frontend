package com.ogi.aml.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.errors.RecordNotFoundException;
import com.ogi.factory.template.BaseResolver;
import com.ogi.aml.entity.CustomerEntity;
import com.ogi.aml.repo.CustomerRepo;

@Service
public class CustomerService extends BaseResolver<CustomerEntity, String> {
	
	 @Autowired
	    private CustomerRepo customerRepo;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "CUSTOMER";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of();
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "AML";
	}
	
	@GraphQLQuery
	public CustomerEntity findCustomerById(String customerId) {
		return customerRepo.findByIdFromParquet(customerId).orElseThrow(() -> new RecordNotFoundException("Record not found: " + customerId));
	
	}

}
