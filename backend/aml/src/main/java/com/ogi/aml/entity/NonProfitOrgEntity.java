package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_FIU_NTR")
public class NonProfitOrgEntity {
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
	
	@Column(name = "NGO_NAME")
	private String ngo_name;
	
	@Column(name = "FCRA_REGISTRATION_NUMBER")
	private String fcra_registration_number;
	
	@Column(name = "DONOR_NAME")
	private String donor_name;
	
	@Column(name = "DONOR_COUNTRY")
	private String donor_country;
	
	@Column(name = "TRANSACTION_DATE")
	private String transaction_date;
	
	@Column(name = "TRANSACTION_AMOUNT")
	private String transaction_amount;
	
	@Column(name = "CURRENCY")
	private String currency;
	
	@Column(name = "PURPOSE_OF_FUNDS")
	private String purpose_of_funds;
	
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
