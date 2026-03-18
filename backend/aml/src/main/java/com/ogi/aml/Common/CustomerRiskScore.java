package com.ogi.aml.Common;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.repo.AlertImplRepo;

@Component
public class CustomerRiskScore {

	@Autowired
	AlertImplRepo alertimplrepo;

	public Integer getScore(String customerId, String transactionId) {
	    try {

	        List<AlertsEntity> lstScore = alertimplrepo.getCustTranRiskScore(customerId, transactionId);

	        if (lstScore != null && !lstScore.isEmpty()) {

	            String score = lstScore.stream()
	                    .findFirst()
	                    .map(AlertsEntity::getCust_risk_score)
	                    .orElse(null);

	            if (score != null) {
	                return Double.valueOf(score).intValue();
	            }
	        }

	    } catch (Exception ex) {
	        ex.printStackTrace();
	    }

	    return 0;
	}
}
