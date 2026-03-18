package com.ogi.aml.entity.DTO;

import java.util.List;

public class AlertsDTO {

	private String parentId;

	private String customerId;

	private Long alertId;

	private String customerAccountType;

	private String instanceId;

	private String comments;

	private boolean isApproved;

	private String status;

	private String transactionId;
	
	
	private List<String> entityIds;
	private String userAssignee;

	public AlertsDTO() {
	}

	
	public AlertsDTO(String parentId, String customerId, Long alertId, String customerAccountType, String status) {
		this.parentId = parentId;
		this.customerId = customerId;
		this.alertId = alertId;
		this.customerAccountType = customerAccountType;
		this.status = status;
	}
	
	public AlertsDTO(String parentId, String customerId, Long alertId, String customerAccountType, String status,String transactionId) {
		this.parentId = parentId;
		this.customerId = customerId;
		this.alertId = alertId;
		this.customerAccountType = customerAccountType;
		this.status = status;
		this.transactionId = transactionId;
	}

	


	public List<String> getEntityIds() {
		return entityIds;
	}


	public void setEntityIds(List<String> entityIds) {
		this.entityIds = entityIds;
	}


	public String getUserAssignee() {
		return userAssignee;
	}


	public void setUserAssignee(String userAssignee) {
		this.userAssignee = userAssignee;
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

	public String getCustomerAccountType() {
		return customerAccountType;
	}

	public void setCustomerAccountType(String customerAccountType) {
		this.customerAccountType = customerAccountType;
	}

	public Long getAlertId() {
		return alertId;
	}

	public void setAlertId(Long alertId) {
		this.alertId = alertId;
	}

	public String getInstanceId() {
		return instanceId;
	}

	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public boolean isApproved() {
		return isApproved;
	}

	public void setApproved(boolean isApproved) {
		this.isApproved = isApproved;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

}
