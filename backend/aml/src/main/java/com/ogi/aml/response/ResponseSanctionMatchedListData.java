package com.ogi.aml.response;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;

public class ResponseSanctionMatchedListData {

	private String customername;

	private String sanction_name;

	private String countryname;

	private String confidence_score;
	private String confidence_percentage;

	private LocalDateTime created_date;

	private String status;

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

	public String getCountryname() {
		return countryname;
	}

	public void setCountryname(String countryname) {
		this.countryname = countryname;
	}

	public String getConfidence_percentage() {
		return confidence_percentage;
	}

	public void setConfidence_percentage(String confidence_percentage) {
		this.confidence_percentage = confidence_percentage;
	}

	public LocalDateTime getCreated_date() {
		return created_date;
	}

	public void setCreated_date(LocalDateTime created_date) {
		this.created_date = created_date;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getConfidence_score() {
		return confidence_score;
	}

	public void setConfidence_score(String confidence_score) {
		this.confidence_score = confidence_score;
	}

}
