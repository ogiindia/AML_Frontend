package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_FIU_CBWTR")
public class CrossBorderTransactionEntity {
	@Id
	@Column(name = "TRANSACTIONID")
	private String transactionid;
	
	@Column(name = "PARENT_ID")
	private String parent_id;
	
	@Column(name = "CUSTOMER_ID")
	private String customer_id;
	
	@Column(name = "REPORT_TYPE")
	private String report_type;

	@Column(name = "ENTITY_ID")
	private String entity_id;
	
	@Column(name = "SENDER_NAME")
	private String sender_name;
	
	@Column(name = "SENDER_COUNTRY")
	private String sender_country;
	
	@Column(name = "RECEIVER_NAME")
	private String receiver_name;
	
	@Column(name = "RECEIVER_COUNTRY")
	private String receiver_country;
	
	@Column(name = "TRANSACTION_DATE")
	private String transaction_date;
	
	@Column(name = "TRANSACTION_AMOUNT")
	private String transaction_amount;
	
	@Column(name = "CURRENCY")
	private String currency;
	
	@Column(name = "SWIFT_PURPOSE_CODE")
	private String swift_purpose_code;
	
	@Column(name = "CREATED_DATE")
	private LocalDateTime created_date;
	
	@Column(name = "REMARKS")
	private String remarks;

	
	
	public String getCustomer_id() {
		return customer_id;
	}

	public void setCustomer_id(String customer_id) {
		this.customer_id = customer_id;
	}

	public String getParent_id() {
		return parent_id;
	}

	public void setParent_id(String parent_id) {
		this.parent_id = parent_id;
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

	public LocalDateTime getCreated_date() {
		return created_date;
	}

	public void setCreated_date(LocalDateTime created_date) {
		this.created_date = created_date;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
	
	
}
