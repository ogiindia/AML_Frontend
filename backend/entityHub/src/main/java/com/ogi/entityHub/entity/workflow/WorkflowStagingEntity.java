package com.ogi.entityHub.entity.workflow;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_WORKFLOW_DATA_TB")
public class WorkflowStagingEntity extends LongBaseEntity {

	private String entityType;

	private String entityId;

	private String payload;

	private Long requestedBy;

	private String Status;
	
	private String user_assignee;

	@OneToOne(mappedBy = "pendingData", cascade = CascadeType.ALL)
	private WorkflowInstanceEntity workflowInstance;

	
	
	public String getUser_assignee() {
		return user_assignee;
	}

	public void setUser_assignee(String user_assignee) {
		this.user_assignee = user_assignee;
	}

	public String getEntityType() {
		return entityType;
	}

	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}

	public String getEntityId() {
		return entityId;
	}

	public void setEntityId(String entityId) {
		this.entityId = entityId;
	}

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}

	public Long getRequestedBy() {
		return requestedBy;
	}

	public void setRequestedBy(Long requestedBy) {
		this.requestedBy = requestedBy;
	}

	public String getStatus() {
		return Status;
	}

	public void setStatus(String status) {
		Status = status;
	}

	public WorkflowInstanceEntity getWorkflowInstance() {
		return workflowInstance;
	}

	public void setWorkflowInstance(WorkflowInstanceEntity workflowInstance) {
		this.workflowInstance = workflowInstance;
	}

}
