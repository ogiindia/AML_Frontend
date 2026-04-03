package com.ogi.aml.response;


public class ResponseSanctionConfigData {
	private String sanction_code;

	private String sanction_name;
	
	private String list_type;

	public String getSanction_code() {
		return sanction_code;
	}

	public void setSanction_code(String sanction_code) {
		this.sanction_code = sanction_code;
	}

	public String getSanction_name() {
		return sanction_name;
	}

	public void setSanction_name(String sanction_name) {
		this.sanction_name = sanction_name;
	}

	public String getList_type() {
		return list_type;
	}

	public void setList_type(String list_type) {
		this.list_type = list_type;
	}
	
}
