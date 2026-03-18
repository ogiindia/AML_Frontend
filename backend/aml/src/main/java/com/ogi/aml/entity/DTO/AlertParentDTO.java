package com.ogi.aml.entity.DTO;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class AlertParentDTO {
	private String parentId;
	private long alertCount;
	private String customerId;
	private String transactionId;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime alertDT;

	private String alertStatus;
	private String instanceId;

	public AlertParentDTO(String parentId, long alertCount, String customerId, String transactionId,
			LocalDateTime alertDT, String alertStatus, String instanceId) {

		this.parentId = parentId;
		this.alertCount = alertCount;
		this.customerId = customerId;
		this.transactionId = transactionId;
		this.alertDT = alertDT;
		this.alertStatus = alertStatus;
		this.instanceId = instanceId;
	}

	
	public String getInstanceId() {
		return instanceId;
	}


	public void setInstanceId(String instanceId) {
		this.instanceId = instanceId;
	}


	public String getAlertStatus() {
		return alertStatus;
	}

	public void setAlertStatus(String alertStatus) {
		this.alertStatus = alertStatus;
	}

	public void setAlertCount(long alertCount) {
		this.alertCount = alertCount;
	}

	

	public Long getAlertCount() {
		return alertCount;
	}

	public void setAlertCount(Long alertCount) {
		this.alertCount = alertCount;
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

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public LocalDateTime getAlertDT() {
		return alertDT;
	}

	public void setAlertDT(LocalDateTime alertDT) {
		this.alertDT = alertDT;
	}

}
