package com.ogi.aml.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_ACCOUNT_DETAILS")
public class AccountDetailsEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "ACCOUNTNO")
	private String accountno;
	
	@Column(name = "CUSTOMERID")
	private String customerid;
	
	@Column(name = "ACCOUNTTYPE")
	private String accounttype;
	
	@Column(name = "BRANCHCODE")
	private String branchcode;

	public String getAccountno() {
		return accountno;
	}

	public void setAccountno(String accountno) {
		this.accountno = accountno;
	}

	public String getCustomerid() {
		return customerid;
	}

	public void setCustomerid(String customerid) {
		this.customerid = customerid;
	}

	public String getAccounttype() {
		return accounttype;
	}

	public void setAccounttype(String accounttype) {
		this.accounttype = accounttype;
	}

	public String getBranchcode() {
		return branchcode;
	}

	public void setBranchcode(String branchcode) {
		this.branchcode = branchcode;
	}
	
	
}
