package com.ogi.aml.entity;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.Table;

import javax.persistence.Column;
import javax.persistence.Id;

@Entity
@Table(name = "NGP_DILIGENCE_DETAILS")
public class DiligenceDetailsEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "REFID")
	private String refid;
	
	@Column(name = "PARENTID")
	private String parentId;
	
	@Column(name = "CUSTOMERID")
	private String customerId;
	
	@Column(name = "CDD")
	private String cdd;
	
	@Column(name = "EDD")
	private String edd;
	
	@Column(name = "FILENAMES")
	private String fileNames;
	
	@Column(name = "CREATEDTIME")
	private Timestamp createdTime;

	public String getRefid() {
		return refid;
	}

	public void setRefid(String refid) {
		this.refid = refid;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getCdd() {
		return cdd;
	}

	public void setCdd(String cdd) {
		this.cdd = cdd;
	}

	public String getEdd() {
		return edd;
	}

	public void setEdd(String edd) {
		this.edd = edd;
	}

	public String getFileNames() {
		return fileNames;
	}

	public void setFileNames(String fileNames) {
		this.fileNames = fileNames;
	}

	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}
	
	
	
}
