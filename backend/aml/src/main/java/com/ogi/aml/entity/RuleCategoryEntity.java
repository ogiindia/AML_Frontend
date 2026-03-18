package com.ogi.aml.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_FINSEC_TXN")
public class RuleCategoryEntity {
	@Id
	@Column(name = "transactionid")
	private String transactionid;

	
	@Column(name = "created_date")
	private Timestamp created_date;

	public String getTransactionid() {
		return transactionid;
	}

	public void setTransactionid(String transactionid) {
		this.transactionid = transactionid;
	}

	
	public Timestamp getCreated_date() {
		return created_date;
	}

	public void setCreated_date(Timestamp created_date) {
		this.created_date = created_date;
	}

	
}
