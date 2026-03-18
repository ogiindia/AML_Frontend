package com.ogi.factory.pojo;

public class FilterCriteria {

	private String field;
	private String operator;
	private Object value;

	public FilterCriteria() {
		// TODO Auto-generated constructor stub
	}

	public FilterCriteria(String field, Object value) {
		this.field = field;
		this.value = value;
	}

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}
	
	

}
