package com.ogi.factory.pojo;

public class SortCriteria {
	

	private String field = "id";
	private String direction = "DESC";
	
	
	public SortCriteria() {
		// TODO Auto-generated constructor stub
	}
	
	SortCriteria(String field,String direction){
		this.field = field;
		this.direction = direction;
	}
	

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}
	
	

}
