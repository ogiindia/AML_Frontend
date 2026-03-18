package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_FIU_CFTR")
public class CountFietTransactionEntity {
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
	
	@Column(name = "BRANCH_CODE")
	private String branch_code;
	
	@Column(name = "DETECTION_DATE")
	private String detection_date;
	
	@Column(name = "DENOMINATION")
	private String denomination;
	
	@Column(name = "QUANTITY")
	private String quantity;
	
	@Column(name = "CUSTOMER_NAME")
	private String customer_name;
	
	@Column(name = "PAN")
	private String pan;
	
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

	public String getBranch_code() {
		return branch_code;
	}

	public void setBranch_code(String branch_code) {
		this.branch_code = branch_code;
	}

	public String getDetection_date() {
		return detection_date;
	}

	public void setDetection_date(String detection_date) {
		this.detection_date = detection_date;
	}

	public String getDenomination() {
		return denomination;
	}

	public void setDenomination(String denomination) {
		this.denomination = denomination;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
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
