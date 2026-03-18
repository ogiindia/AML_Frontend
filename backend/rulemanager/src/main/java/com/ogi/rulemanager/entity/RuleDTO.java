package com.ogi.rulemanager.entity;

import java.util.List;
import java.util.UUID;

public class RuleDTO {

	private UUID ruleId;

	private String ruleName;

	private UUID folderId;

	private String description;

	private String offsetValue;

	private String offsetUnit;

	private String alertCategory;

	private String priority;

	private String txnMode;

	private String ruleMode;

	private GroupInputDTO group;

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public UUID getFolderId() {
		return folderId;
	}

	public void setFolderId(UUID folderId) {
		this.folderId = folderId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public GroupInputDTO getGroup() {
		return group;
	}

	public void setGroup(GroupInputDTO group) {
		this.group = group;
	}

	public UUID getRuleId() {
		return ruleId;
	}

	public void setRuleId(UUID ruleId) {
		this.ruleId = ruleId;
	}

	public String getOffsetValue() {
		return offsetValue;
	}

	public void setOffsetValue(String offsetValue) {
		this.offsetValue = offsetValue;
	}

	public String getOffsetUnit() {
		return offsetUnit;
	}

	public void setOffsetUnit(String offsetUnit) {
		this.offsetUnit = offsetUnit;
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

	public String getRuleMode() {
		return ruleMode;
	}

	public void setRuleMode(String ruleMode) {
		this.ruleMode = ruleMode;
	}
	
	

}
