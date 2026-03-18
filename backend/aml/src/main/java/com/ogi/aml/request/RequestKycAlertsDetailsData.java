package com.ogi.aml.request;

import java.sql.Timestamp;

public class RequestKycAlertsDetailsData {
	private String alert_id;
	private String accno;
	private String alert_desc;
	private String alert_name;	
	private String cust_id;	
	private String risk_category;
	private String alert_status;
	
    private String transactionId;
    private String cdd_edd;
    private String parentId;
	
    
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getAlert_id() {
		return alert_id;
	}
	public void setAlert_id(String alert_id) {
		this.alert_id = alert_id;
	}
	public String getAccno() {
		return accno;
	}
	public void setAccno(String accno) {
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
	public String getCust_id() {
		return cust_id;
	}
	public void setCust_id(String cust_id) {
		this.cust_id = cust_id;
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
	public String getTransactionId() {
		return transactionId;
	}
	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}
	public String getCdd_edd() {
		return cdd_edd;
	}
	public void setCdd_edd(String cdd_edd) {
		this.cdd_edd = cdd_edd;
	}
	
	
}
