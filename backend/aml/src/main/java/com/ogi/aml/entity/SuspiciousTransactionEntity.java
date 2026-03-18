package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_FIU_STR")
public class SuspiciousTransactionEntity {
	@Id
	@Column(name = "TRANSACTIONID")
	private String transactionid;

	@Column(name = "REPORT_TYPE")
	private String reportType;
	
	@Column(name = "ENTITY_ID")
	private String entity_id;

	@Column(name = "ACCOUNT_NO")
	private String account_no;
	
	@Column(name = "CUSTOMER_NAME")
	private String customer_name;
	
	@Column(name = "PAN")
	private String pan;

	@Column(name = "TRANSACTION_DATE")
	private String transaction_date;

	@Column(name = "TRANSACTION_AMOUNT")
	private String transaction_amount;

	@Column(name = "CURRENCY")
	private String currency;

	@Column(name = "TRANSACTION_TYPE")
	private String transaction_type;

	@Column(name = "SUSPICION_INDICATOR")
	private String suspicion_indicator;

	@Column(name = "NARRATIVE_REMARKS")
	private String narrative_remarks;
	
	@Column(name = "CREATED_DATE")
	private LocalDateTime createdDate;

	@Column(name = "REMARKS")
	private String remarks;

	@Column(name = "PARENT_ID")
	private String parent_id;

	@Column(name = "CUSTOMER_ID")
	private String customer_id;

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

	public String getEntity_id() {
		return entity_id;
	}

	public void setEntity_id(String entity_id) {
		this.entity_id = entity_id;
	}

	public String getAccount_no() {
		return account_no;
	}

	public void setAccount_no(String account_no) {
		this.account_no = account_no;
	}

	public String getCustomer_name() {
		return customer_name;
	}

	public void setCustomer_name(String customer_name) {
		this.customer_name = customer_name;
	}

	public String getPan() {
		return pan;
	}

	public void setPan(String pan) {
		this.pan = pan;
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

	public String getTransaction_type() {
		return transaction_type;
	}

	public void setTransaction_type(String transaction_type) {
		this.transaction_type = transaction_type;
	}

	public String getSuspicion_indicator() {
		return suspicion_indicator;
	}

	public void setSuspicion_indicator(String suspicion_indicator) {
		this.suspicion_indicator = suspicion_indicator;
	}

	public String getNarrative_remarks() {
		return narrative_remarks;
	}

	public void setNarrative_remarks(String narrative_remarks) {
		this.narrative_remarks = narrative_remarks;
	}	

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public String getReportType() {
		return reportType;
	}

	public void setReportType(String reportType) {
		this.reportType = reportType;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}
