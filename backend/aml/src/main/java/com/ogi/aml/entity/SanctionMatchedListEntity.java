package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_SANCTION_MATCHED_LIST")
public class SanctionMatchedListEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ID")
	private String id;

	@Column(name = "CUSTOMERID")
	private String customerid;

	@Column(name = "CUSTOMERNAME")
	private String customername;

	@Column(name = "CONFIDENCE_SCORE")
	private String confidence_score;

	@Column(name = "CONFIDENCE_PERCENTAGE")
	private String confidence_percentage;

	@Column(name = "SANCTION_NAME")
	private String sanction_name;

	@Column(name = "SANCTION_CODE")
	private String sanction_code;

	@Column(name = "COUNTRYNAME")
	private String countryname;

	@Column(name = "STATUS")
	private String status;

	@Column(name = "CREATED_DATE")
	private LocalDateTime created_date;

	@Column(name = "MODIFY_DATE")
	private LocalDateTime modify_date;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCustomerid() {
		return customerid;
	}

	public void setCustomerid(String customerid) {
		this.customerid = customerid;
	}

	public String getCustomername() {
		return customername;
	}

	public void setCustomername(String customername) {
		this.customername = customername;
	}

	public String getSanction_name() {
		return sanction_name;
	}

	public void setSanction_name(String sanction_name) {
		this.sanction_name = sanction_name;
	}

	public String getSanction_code() {
		return sanction_code;
	}

	public void setSanction_code(String sanction_code) {
		this.sanction_code = sanction_code;
	}

	public String getCountryname() {
		return countryname;
	}

	public void setCountryname(String countryname) {
		this.countryname = countryname;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreated_date() {
		return created_date;
	}

	public void setCreated_date(LocalDateTime created_date) {
		this.created_date = created_date;
	}

	public String getConfidence_score() {
		return confidence_score;
	}

	public void setConfidence_score(String confidence_score) {
		this.confidence_score = confidence_score;
	}

	public String getConfidence_percentage() {
		return confidence_percentage;
	}

	public void setConfidence_percentage(String confidence_percentage) {
		this.confidence_percentage = confidence_percentage;
	}

	public LocalDateTime getModify_date() {
		return modify_date;
	}

	public void setModify_date(LocalDateTime modify_date) {
		this.modify_date = modify_date;
	}

}
