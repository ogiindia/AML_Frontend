package com.ogi.aml.request;

public class RequestSanctionConfigData {
	private String sanction_name;

	private String country;

	private String list_type;

	public String getSanction_name() {
		return sanction_name;
	}

	public void setSanction_name(String sanction_name) {
		this.sanction_name = sanction_name;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getList_type() {
		return list_type;
	}

	public void setList_type(String list_type) {
		this.list_type = list_type;
	}


}
