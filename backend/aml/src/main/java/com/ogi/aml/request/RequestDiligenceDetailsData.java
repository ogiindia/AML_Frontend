package com.ogi.aml.request;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class RequestDiligenceDetailsData {
	private String refid;
	private String parentId;
	private String customerId;
	private String cdd;	
	private String edd;	
	private String fileNames;
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
