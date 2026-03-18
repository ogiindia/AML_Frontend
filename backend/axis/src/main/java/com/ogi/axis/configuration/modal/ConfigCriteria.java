package com.ogi.axis.configuration.modal;

import java.util.UUID;

public class ConfigCriteria {
	

	private String field;
	private String value;
	private UUID insId;
	private UUID divId;
	
	
	public ConfigCriteria() {
		// TODO Auto-generated constructor stub
	}
	
	ConfigCriteria(String field,String value){
		this.field = field;
		this.value = value;
	}
	

	public String getField() {
		return field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public UUID getInsId() {
		return insId;
	}

	public void setInsId(UUID insId) {
		this.insId = insId;
	}

	public UUID getDivId() {
		return divId;
	}

	public void setDivId(UUID divId) {
		this.divId = divId;
	}	
	

}
