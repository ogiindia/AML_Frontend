package com.ogi.aml.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_CUST_SANCTIONLST_WTG_DTLS")
public class SanctionListWeightageEntity {
	private static final long serialVersionUID = 1L;

	@Id
	private Long id;

	@Column(name = "CUSTOMERID")
	private String customerid;

	@Column(name = "PARAM_DETAILS")
	private String paramDetails;

	@Column(name = "PTG")
	private Double ptg;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCustomerid() {
		return customerid;
	}

	public void setCustomerid(String customerid) {
		this.customerid = customerid;
	}

	public String getParamDetails() {
		return paramDetails;
	}

	public void setParamDetails(String paramDetails) {
		this.paramDetails = paramDetails;
	}

	public Double getPtg() {
		return ptg;
	}

	public void setPtg(Double ptg) {
		this.ptg = ptg;
	}
	
	

}
