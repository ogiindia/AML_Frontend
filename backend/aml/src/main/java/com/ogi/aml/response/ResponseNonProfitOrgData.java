package com.ogi.aml.response;

import java.sql.Timestamp;

import javax.persistence.Column;

public class ResponseNonProfitOrgData {
	private String transactionid;
	private String parentid;
	private String customerid;
	private String report_type;
	private String entity_id;
	private String ngo_name;
	private String fcra_registration_number;
	private String donor_name;
	private String donor_country;
	private String transaction_date;
	private String transaction_amount;
	private String currency;
	private String purpose_of_funds;
	private String remarks;
	
	
	public String getCustomerid() {
		return customerid;
	}
	public void setCustomerid(String customerid) {
		this.customerid = customerid;
	}
	public String getParentid() {
		return parentid;
	}
	public void setParentid(String parentid) {
		this.parentid = parentid;
	}
	public String getTransactionid() {
		return transactionid;
	}
	public void setTransactionid(String transactionid) {
		this.transactionid = transactionid;
	}
	public String getReport_type() {
		return report_type;
	}
	public void setReport_type(String report_type) {
		this.report_type = report_type;
	}
	public String getEntity_id() {
		return entity_id;
	}
	public void setEntity_id(String entity_id) {
		this.entity_id = entity_id;
	}
	public String getNgo_name() {
		return ngo_name;
	}
	public void setNgo_name(String ngo_name) {
		this.ngo_name = ngo_name;
	}
	public String getFcra_registration_number() {
		return fcra_registration_number;
	}
	public void setFcra_registration_number(String fcra_registration_number) {
		this.fcra_registration_number = fcra_registration_number;
	}
	public String getDonor_name() {
		return donor_name;
	}
	public void setDonor_name(String donor_name) {
		this.donor_name = donor_name;
	}
	public String getDonor_country() {
		return donor_country;
	}
	public void setDonor_country(String donor_country) {
		this.donor_country = donor_country;
	}
	public String getTransaction_date() {
		return transaction_date;
	}
	public void setTransaction_date(String transaction_date) {
		this.transaction_date = transaction_date;
	}
	public String getTransaction_amount() {
		return transaction_amount;
	}
	public void setTransaction_amount(String transaction_amount) {
		this.transaction_amount = transaction_amount;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public String getPurpose_of_funds() {
		return purpose_of_funds;
	}
	public void setPurpose_of_funds(String purpose_of_funds) {
		this.purpose_of_funds = purpose_of_funds;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	

}
