package com.ogi.rulemanager.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_RULE_ACTIONS")
public class RuleActionsEntity extends UUIDBaseEntity {

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rule_id", insertable = false, updatable = false)
	private RuleEntity rule;

	private String actionType;

	@Column(length = 1000)
	private String actionExpression;

	@Column(length = 1000)
	private String parameters; // could be JSON string

	private Integer orderNo;

	public RuleEntity getRule() {
		return rule;
	}

	public void setRule(RuleEntity rule) {
		this.rule = rule;
	}

	public String getActionType() {
		return actionType;
	}

	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	public String getActionExpression() {
		return actionExpression;
	}

	public void setActionExpression(String actionExpression) {
		this.actionExpression = actionExpression;
	}

	public String getParameters() {
		return parameters;
	}

	public void setParameters(String parameters) {
		this.parameters = parameters;
	}

	public Integer getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(Integer orderNo) {
		this.orderNo = orderNo;
	}

}
