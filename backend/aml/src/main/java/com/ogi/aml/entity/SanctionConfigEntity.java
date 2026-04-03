package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_SANCTION_CONF")
public class SanctionConfigEntity {
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "SANCTION_CODE")
	private String sanction_code;
	
	@Column(name = "SANCTION_NAME", unique = true)
	private String sanction_name;
	
	@Column(name = "COUNTRY")
	private String country;
	
	@Column(name = "STATUS")
	private String status;
	
	@Column(name = "LIST_TYPE")
	private String list_type;
	
	
	@Column(name = "CREATED_DATE")
	private Timestamp created_date;

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

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getList_type() {
		return list_type;
	}

	public void setList_type(String list_type) {
		this.list_type = list_type;
	}

	public Timestamp getCreated_date() {
		return created_date;
	}

	public void setCreated_date(Timestamp created_date) {
		this.created_date = created_date;
	}

	
}
