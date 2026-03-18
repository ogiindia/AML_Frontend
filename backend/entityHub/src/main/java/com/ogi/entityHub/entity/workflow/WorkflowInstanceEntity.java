package com.ogi.entityHub.entity.workflow;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_WORKFLOW_INSTANCE_TB")
public class WorkflowInstanceEntity extends LongBaseEntity {

	private String entityId; // ID of actual entity
	private String entityType;
	private String status; // PENDING / APPROVED / REJECTED
	
	private String user_assignee;
	private String customerId;
	private String transactionId;
	
	
	
	public String getUser_assignee() {
		return user_assignee;
	}

	public void setUser_assignee(String user_assignee) {
		this.user_assignee = user_assignee;
	}

	@ManyToOne
	@JoinColumn(name = "workflow_id")
	private WorkflowEntity workflow;

	

	private Integer currentLevel; // tracks current workflow level

	@OneToMany(mappedBy = "workflowInstance", cascade = CascadeType.ALL)
	private List<WorkflowInstanceHistoryEntity> approvalHistory;

	@OneToOne
	@JoinColumn(name = "pending_data_id")
	private WorkflowStagingEntity pendingData;
	
	
	
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

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getEntityType() {
		return entityType;
	}

	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public WorkflowEntity getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowEntity workflow) {
		this.workflow = workflow;
	}

	public Integer getCurrentLevel() {
		return currentLevel;
	}

	public void setCurrentLevel(Integer currentLevel) {
		this.currentLevel = currentLevel;
	}

	public List<WorkflowInstanceHistoryEntity> getApprovalHistory() {
		return approvalHistory;
	}

	public void setApprovalHistory(List<WorkflowInstanceHistoryEntity> approvalHistory) {
		this.approvalHistory = approvalHistory;
	}

	public WorkflowStagingEntity getPendingData() {
		return pendingData;
	}

	public void setPendingData(WorkflowStagingEntity pendingData) {
		this.pendingData = pendingData;
	}
	
	

}
