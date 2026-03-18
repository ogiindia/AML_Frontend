package com.ogi.rulemanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ogi.factory.annotations.GraphQLQuery;

@Component
public class RuleAppRunner implements ApplicationListener<ContextRefreshedEvent> {

	@Autowired
	RuleServices ruleService;

	@Autowired
	CatalogServices cataServices;

	@Override
	public void onApplicationEvent(ContextRefreshedEvent event) {
		// TODO Auto-generated method stub
		System.out.println("into rule runner");

		cataServices.createinitalTypes();

//		try {
////			ruleService.syncRule();
//		} catch (JsonProcessingException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}

//		ruleService.CreateDummyRule("TEST");

//		cataServices.createCatalog("txn_id", "Transaction Id", "TRANSACTION", "TRANSACTION.csv", null, "STRING");
//		cataServices.createCatalog("txn_amt", "Transaction Amount", "TRANSACTION", "TRANSACTION.csv", null, "NUMBER");
//		cataServices.createCatalog("cust_name", "Customer Name", "CUSTOMER", "CUSTOMER.csv", null, "STRING");
//		cataServices.createCatalog("cust_age", "Customer Age", "CUSTOMER", null, "diff(curdate,cust_dob)", "FUNCTION");
	}

}
