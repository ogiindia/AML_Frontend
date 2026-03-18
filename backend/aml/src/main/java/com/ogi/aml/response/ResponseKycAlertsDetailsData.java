package com.ogi.aml.response;

import java.sql.Timestamp;

public class ResponseKycAlertsDetailsData {
	private String alert_id;
	private Long accno;
	private String alert_desc;
	private String alert_name;	
	private Long cust_id;	
	
	private String risk_score;	
	private String alert_dt;	
	private String modified_dt;	
	
	private String risk_category;	
	private String alert_status;	
	
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
	public String getRisk_score() {
		return risk_score;
	}
	public void setRisk_score(String risk_score) {
		this.risk_score = risk_score;
	}
	public String getAlert_dt() {
		return alert_dt;
	}
	public void setAlert_dt(String alert_dt) {
		this.alert_dt = alert_dt;
	}
	public String getModified_dt() {
		return modified_dt;
	}
	public void setModified_dt(String modified_dt) {
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
