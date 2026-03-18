package com.ogi.rulemanager.entity;

import java.util.UUID;

public class GroupConditionDTO {

	private UUID id;
	private String fieldName;

	private String operator; // e.g. "=", ">", "<", "IN"

	private String valueType;

	private String value; // right-hand value or expression reference

	private String conditionType;

	private GroupInputDTO group;

	private String offsetValue;

	private String offsetUnit;

	private String fact;

	private String listType;

	private String listField;

	private String range;

	private String condition;

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
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

	public GroupInputDTO getGroup() {
		return group;
	}

	public void setGroup(GroupInputDTO group) {
		this.group = group;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getConditionType() {
		return conditionType;
	}

	public void setConditionType(String conditionType) {
		this.conditionType = conditionType;
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

	public String getFact() {
		return fact;
	}

	public void setFact(String fact) {
		this.fact = fact;
	}

	public String getListType() {
		return listType;
	}

	public void setListType(String listType) {
		this.listType = listType;
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
