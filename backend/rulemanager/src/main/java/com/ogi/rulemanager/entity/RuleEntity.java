package com.ogi.rulemanager.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_RULES")
public class RuleEntity extends UUIDBaseEntity {

	private String ruleName;

	@Column(length = 1000)
	private String description;

	private Integer priority;

	private Boolean status = true;

	private String offsetValue = "1";

	private String offsetUnit = "DAY";

	private String txnMode;

	private String alertCategory;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "folder_id")
	private RuleFolderEntity folder;

	@OneToOne(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
	private RuleGroupsEntity groups;

	@JsonBackReference
	@OneToMany(mappedBy = "rule", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RuleActionsEntity> actions;

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getPriority() {
		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public RuleGroupsEntity getGroups() {
		return groups;
	}

	public void setGroups(RuleGroupsEntity groups) {
		this.groups = groups;
	}

	public List<RuleActionsEntity> getActions() {
		return actions;
	}

	public void setActions(List<RuleActionsEntity> actions) {
		this.actions = actions;
	}

	public RuleFolderEntity getFolder() {
		return folder;
	}

	public void setFolder(RuleFolderEntity folder) {
		this.folder = folder;
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

}
