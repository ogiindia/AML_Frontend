package com.ogi.aml.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_SANCTION_AUDIT")
public class SanctionAuditEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "SANCATION_NAME")
	private String sancation_name;

	@Column(name = "UPLOAD_FILE_NAME")
	private String upload_file_name;

	@Column(name = "FILE_TYPE")
	private String file_type;

	@Column(name = "CREATED_DATE")
	private Timestamp created_date;

	public String getSancation_name() {
		return sancation_name;
	}

	public void setSancation_name(String sancation_name) {
		this.sancation_name = sancation_name;
	}

	public String getUpload_file_name() {
		return upload_file_name;
	}

	public void setUpload_file_name(String upload_file_name) {
		this.upload_file_name = upload_file_name;
	}

	public String getFile_type() {
		return file_type;
	}

	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}

	public Timestamp getCreated_date() {
		return created_date;
	}

	public void setCreated_date(Timestamp created_date) {
		this.created_date = created_date;
	}

}
