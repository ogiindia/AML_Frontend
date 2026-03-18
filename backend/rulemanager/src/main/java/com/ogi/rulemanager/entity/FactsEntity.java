package com.ogi.rulemanager.entity;

import java.util.Date;

import javax.persistence.Entity;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

@Entity
@Immutable
@Subselect("SELECT * FROM fs_factset_master")
public class FactsEntity {

	@javax.persistence.Id
	private String factId;

	private String factName;

	private String factDatatype;

	private String factDesc;

	private String factType;

	private Date createdDate;

	private Date updateDate;

	public String getFactId() {
		return factId;
	}

	public void setFactId(String factId) {
		this.factId = factId;
	}

	public String getFactName() {
		return factName;
	}

	public void setFactName(String factName) {
		this.factName = factName;
	}

	public String getFactDatatype() {
		return factDatatype;
	}

	public void setFactDatatype(String factDatatype) {
		this.factDatatype = factDatatype;
	}

	public String getFactDesc() {
		return factDesc;
	}

	public void setFactDesc(String factDesc) {
		this.factDesc = factDesc;
	}

	public String getFactType() {
		return factType;
	}

	public void setFactType(String factType) {
		this.factType = factType;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

}
