package com.ogi.aml.response;


public class ResponseCrossBorderTransactionData {
	private String transactionid;
	private String parentid;
	private String customerid;
	private String report_type;
	private String entity_id;
	private String sender_name;
	private String sender_country;
	private String receiver_name;
	private String receiver_country;
	private String transaction_date;
	private String transaction_amount;
	private String currency;
	private String swift_purpose_code;
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
	public String getSender_name() {
		return sender_name;
	}
	public void setSender_name(String sender_name) {
		this.sender_name = sender_name;
	}
	public String getSender_country() {
		return sender_country;
	}
	public void setSender_country(String sender_country) {
		this.sender_country = sender_country;
	}
	public String getReceiver_name() {
		return receiver_name;
	}
	public void setReceiver_name(String receiver_name) {
		this.receiver_name = receiver_name;
	}
	public String getReceiver_country() {
		return receiver_country;
	}
	public void setReceiver_country(String receiver_country) {
		this.receiver_country = receiver_country;
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
	public String getSwift_purpose_code() {
		return swift_purpose_code;
	}
	public void setSwift_purpose_code(String swift_purpose_code) {
		this.swift_purpose_code = swift_purpose_code;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	

}
