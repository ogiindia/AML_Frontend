package com.ogi.rulemanager.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_NORMALIZED_RULE_TB")
public class NormalizedRuleEntity extends LongBaseEntity {

	private String ruleName;

	private Integer priority;

	@Column(length = 1000)
	private String ruleDescription;

	@Column(length = 2000)
	private String payload;

	private String offsetUnit;

	private String offsetValue;

	private String alertCategory;

	private String txnMode;
	private String status;

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public String getRuleDescription() {
		return ruleDescription;
	}

	public void setRuleDescription(String ruleDescription) {
		this.ruleDescription = ruleDescription;
	}

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}

	public String getOffsetUnit() {
		return offsetUnit;
	}

	public void setOffsetUnit(String offsetUnit) {
		this.offsetUnit = offsetUnit;
	}

	public String getOffsetValue() {
		return offsetValue;
	}

	public void setOffsetValue(String offsetValue) {
		this.offsetValue = offsetValue;
	}

	public String getAlertCategory() {
		return alertCategory;
	}

	public void setAlertCategory(String alertCategory) {
		this.alertCategory = alertCategory;
	}

	public String getTxnMode() {
		return txnMode;
	}

	public void setTxnMode(String txnMode) {
		this.txnMode = txnMode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
