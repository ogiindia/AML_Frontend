package com.ogi.rulemanager.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_RULE_GROUPS")
public class RuleGroupsEntity extends UUIDBaseEntity {

	@JsonManagedReference
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "rule_id")
	private RuleEntity rule;

	private String logicalOperator;

	private Integer orderNo;

	@OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<RuleConditionsEntity> conditions = new ArrayList<RuleConditionsEntity>();

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "parent_group_id")
	private List<RuleGroupsEntity> subGroups = new ArrayList<RuleGroupsEntity>();

	public RuleEntity getRule() {
		return rule;
	}

	public void setRule(RuleEntity rule) {
		this.rule = rule;
	}

	public String getLogicalOperator() {
		return logicalOperator;
	}

	public void setLogicalOperator(String logicalOperator) {
		this.logicalOperator = logicalOperator;
	}

	public Integer getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(Integer orderNo) {
		this.orderNo = orderNo;
	}

	public List<RuleConditionsEntity> getConditions() {
		return conditions;
	}

	public void setConditions(List<RuleConditionsEntity> conditions) {
		this.conditions = conditions;
	}

	public List<RuleGroupsEntity> getSubGroups() {
		return subGroups;
	}

	public void setSubGroups(List<RuleGroupsEntity> subGroups) {
		this.subGroups = subGroups;
	}

}
