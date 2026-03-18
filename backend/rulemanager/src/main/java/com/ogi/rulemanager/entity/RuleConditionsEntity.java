package com.ogi.rulemanager.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.UUIDBaseEntity;

@Entity
@Table(name = "AIS_RULE_CONDITIONS")
public class RuleConditionsEntity extends UUIDBaseEntity {

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "group_id")
	private RuleGroupsEntity group;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "field_id")
	private CatalogEntity field;

	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "operator_id")
	private CatalogExpressionsEntity operator; // e.g. "=", ">", "<", "IN"

	private String valueType;

	private String value; // right-hand value or expression reference

	@Column(length = 1000)
	private String parserExpression;

	private Integer orderNo;

	private String conditionType;

	private String fact;

	private String ListType;

	private String listField;

	private String range;

	private String condition;

	public RuleGroupsEntity getGroup() {
		return group;
	}

	public void setGroup(RuleGroupsEntity group) {
		this.group = group;
	}

	public CatalogEntity getField() {
		return field;
	}

	public void setField(CatalogEntity field) {
		this.field = field;
	}

	public CatalogExpressionsEntity getOperator() {
		return operator;
	}

	public void setOperator(CatalogExpressionsEntity operator) {
		this.operator = operator;
	}

	public String getValueType() {
		return valueType;
	}

	public void setValueType(String valueType) {
		this.valueType = valueType;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getParserExpression() {
		return parserExpression;
	}

	public void setParserExpression(String parserExpression) {
		this.parserExpression = parserExpression;
	}

	public Integer getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(Integer orderNo) {
		this.orderNo = orderNo;
	}

	public String getConditionType() {
		return conditionType;
	}

	public void setConditionType(String conditionType) {
		this.conditionType = conditionType;
	}

	public String getFact() {
		return fact;
	}

	public void setFact(String fact) {
		this.fact = fact;
	}

	public String getListType() {
		return ListType;
	}

	public void setListType(String listType) {
		ListType = listType;
	}

	public String getListField() {
		return listField;
	}

	public void setListField(String listField) {
		this.listField = listField;
	}

	public String getRange() {
		return range;
	}

	public void setRange(String range) {
		this.range = range;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

}
