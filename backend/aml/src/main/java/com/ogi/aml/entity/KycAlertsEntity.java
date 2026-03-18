package com.ogi.aml.entity;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "FS_KYC_ALERTS")
public class KycAlertsEntity {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "CUST_ID")
	private Long cust_id;
	
	@Column(name = "ALERT_ID")
	private String alert_id;
	
	@Column(name = "ACCNO")
	private Long accno;
		
	@Column(name = "ALERT_DT")
	private LocalDateTime alert_dt;
	
	@Column(name = "ALERT_DESC")
	private String alert_desc;
	
	@Column(name = "ALERT_NAME")
	private String alert_name;
			
	@Column(name = "MODIFIED_DT")
	private LocalDateTime modified_dt;
	
	@Column(name = "RISK_CATEGORY")
	private String risk_category;
	
	@Column(name = "RISK_SCORE")
	private String risk_score;
	
	@Column(name = "ALERT_STATUS")
	private String alert_status;
	
	@Column(name = "SOURCE")
	private String source;

	
	
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getRisk_score() {
		return risk_score;
	}

	public void setRisk_score(String risk_score) {
		this.risk_score = risk_score;
	}

	
	public String getAlert_id() {
		return alert_id;
	}

	public void setAlert_id(String alert_id) {
		this.alert_id = alert_id;
	}

	public Long getAccno() {
		return accno;
	}

	public void setAccno(Long accno) {
		this.accno = accno;
	}

	public LocalDateTime getAlert_dt() {
		return alert_dt;
	}

	public void setAlert_dt(LocalDateTime alert_dt) {
		this.alert_dt = alert_dt;
	}

	public String getAlert_desc() {
		return alert_desc;
	}

	public void setAlert_desc(String alert_desc) {
		this.alert_desc = alert_desc;
	}

	public String getAlert_name() {
		return alert_name;
	}

	public void setAlert_name(String alert_name) {
		this.alert_name = alert_name;
	}

	public Long getCust_id() {
		return cust_id;
	}

	public void setCust_id(Long cust_id) {
		this.cust_id = cust_id;
	}

	public LocalDateTime getModified_dt() {
		return modified_dt;
	}

	public void setModified_dt(LocalDateTime modified_dt) {
		this.modified_dt = modified_dt;
	}

	public String getRisk_category() {
		return risk_category;
	}

	public void setRisk_category(String risk_category) {
		this.risk_category = risk_category;
	}

	public String getAlert_status() {
		return alert_status;
	}

	public void setAlert_status(String alert_status) {
		this.alert_status = alert_status;
	}
	

}
