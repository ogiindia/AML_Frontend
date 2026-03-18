package com.ogi.entityHub.entity.workflow;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_WORKFLOW_APPROVERS_TB")
public class WorkflowApproverEntity extends LongBaseEntity {

	@ManyToOne
	@JoinColumn(name = "workflow_id")
	private WorkflowEntity workflow;

	private Integer levelNumber; // e.g., 1, 2, 3 – represents the order in workflow

	private String approverType; // USER or GROUP

	private Long approverId; // FK to User or Group depending on type

	public WorkflowEntity getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkflowEntity workflow) {
		this.workflow = workflow;
	}

	public Integer getLevelNumber() {
		return levelNumber;
	}

	public void setLevelNumber(Integer levelNumber) {
		this.levelNumber = levelNumber;
	}

	public String getApproverType() {
		return approverType;
	}

	public void setApproverType(String approverType) {
		this.approverType = approverType;
	}

	public Long getApproverId() {
		return approverId;
	}

	public void setApproverId(Long approverId) {
		this.approverId = approverId;
	}

}
