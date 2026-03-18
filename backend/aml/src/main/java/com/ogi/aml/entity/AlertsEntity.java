package com.ogi.aml.entity;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import com.ogi.factory.annotations.SharedTable;

@Entity
@Immutable
@SharedTable
@Table(name = "FS_ALERTS")
public class AlertsEntity {
	@Column(name = "ALERT_ID")
	@Id
	private String alertId;
	
	@Column(name = "ID")
	private String id;

	@Column(name = "ALERT_NAME")
	private String alertName;

	@Column(name = "ALERT_DESC")
	private String alertDesc;

	@Column(name = "TRANSACTION_ID")
	private String transactionId;

	@Column(name = "ALERT_DT")
	private LocalDateTime alertDT;

	@Column(name = "ALERT_ASSIGNEE")
	private String alertAssignee;

	@Column(name = "RULE_ID")
	private String ruleId;

	@Column(name = "CUST_ID")
	private String custId;

	@Column(name = "ALERT_PARENT_ID")
	private String alertParentId;

	@Column(name = "ALERT_STATUS")
	private String alertStatus;

	@Column(name = "MODIFIED_DT")
	private LocalDateTime modifiedDt;

	@Column(name = "ACCNO")
	private String accNo;

	@Column(name = "ALERT_RANGE")
	private String alertRange;

	@Column(name = "RISK_CATEGORY")
	private String riskCategory;

	@Column(name = "FACT_VALUE")
	private String factValue;

	@Column(name = "FACT_NAME")
	private String factName;

	@Column(name = "THRESHOLD_VALUE")
	private String thresholdValue;
	
	@Column(name = "CUST_RISK_SCORE")
	private String cust_risk_score;
	
	@Column(name = "TRAN_RISK_SCORE")
	private String tran_risk_score;
	

	public String getAlertId() {
		return alertId;
	}

	public void setAlertId(String alertId) {
		this.alertId = alertId;
	}

	public String getAlertName() {
		return alertName;
	}

	public void setAlertName(String alertName) {
		this.alertName = alertName;
	}

	public String getAlertDesc() {
		return alertDesc;
	}

	public void setAlertDesc(String alertDesc) {
		this.alertDesc = alertDesc;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getAlertAssignee() {
		return alertAssignee;
	}

	public void setAlertAssignee(String alertAssignee) {
		this.alertAssignee = alertAssignee;
	}

	public String getRuleId() {
		return ruleId;
	}

	public void setRuleId(String ruleId) {
		this.ruleId = ruleId;
	}

	public String getCustId() {
		return custId;
	}

	public void setCustId(String custId) {
		this.custId = custId;
	}

	public String getAlertParentId() {
		return alertParentId;
	}

	public void setAlertParentId(String alertParentId) {
		this.alertParentId = alertParentId;
	}

	public String getAlertStatus() {
		return alertStatus;
	}

	public void setAlertStatus(String alertStatus) {
		this.alertStatus = alertStatus;
	}

	public String getAccNo() {
		return accNo;
	}

	public void setAccNo(String accNo) {
		this.accNo = accNo;
	}

	public String getAlertRange() {
		return alertRange;
	}

	public void setAlertRange(String alertRange) {
		this.alertRange = alertRange;
	}

	public String getRiskCategory() {
		return riskCategory;
	}

	public void setRiskCategory(String riskCategory) {
		this.riskCategory = riskCategory;
	}

	public String getFactValue() {
		return factValue;
	}

	public void setFactValue(String factValue) {
		this.factValue = factValue;
	}

	public String getFactName() {
		return factName;
	}

	public void setFactName(String factName) {
		this.factName = factName;
	}

	public String getThresholdValue() {
		return thresholdValue;
	}

	public void setThresholdValue(String thresholdValue) {
		this.thresholdValue = thresholdValue;
	}

	public LocalDateTime getAlertDT() {
		return alertDT;
	}

	public void setAlertDT(LocalDateTime alertDT) {
		this.alertDT = alertDT;
	}

	public LocalDateTime getModifiedDt() {
		return modifiedDt;
	}

	public void setModifiedDt(LocalDateTime modifiedDt) {
		this.modifiedDt = modifiedDt;
	}

	public String getCust_risk_score() {
		return cust_risk_score;
	}

	public void setCust_risk_score(String cust_risk_score) {
		this.cust_risk_score = cust_risk_score;
	}

	public String getTran_risk_score() {
		return tran_risk_score;
	}

	public void setTran_risk_score(String tran_risk_score) {
		this.tran_risk_score = tran_risk_score;
	}

}
