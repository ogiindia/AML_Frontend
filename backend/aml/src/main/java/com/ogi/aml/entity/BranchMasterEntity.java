package com.ogi.aml.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "fs_branch")
public class BranchMasterEntity {
	private static final long serialVersionUID = 1L;
	
	@Id
	@Column(name = "BRANCHCODE")
	private String branchcode;

	@Column(name = "BRANCHNAME")
	private String branchname;

	@Column(name = "BANKCODE")
	private String bankcode;

	public String getBranchcode() {
		return branchcode;
	}

	public void setBranchcode(String branchcode) {
		this.branchcode = branchcode;
	}

	public String getBranchname() {
		return branchname;
	}

	public void setBranchname(String branchname) {
		this.branchname = branchname;
	}

	public String getBankcode() {
		return bankcode;
	}

	public void setBankcode(String bankcode) {
		this.bankcode = bankcode;
	}


}
