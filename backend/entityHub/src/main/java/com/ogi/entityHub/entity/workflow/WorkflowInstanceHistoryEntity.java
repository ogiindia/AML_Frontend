package com.ogi.entityHub.entity.workflow;

import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_WORKFLOW_INSTANCE_HISTORY_TB")
public class WorkflowInstanceHistoryEntity extends LongBaseEntity {

	@ManyToOne
	@JoinColumn(name = "workflow_instance_id")
	private WorkflowInstanceEntity workflowInstance;

	private Integer levelNumber; // records which level this approval belongs to

	private Long approver;

	private String approverGroup;

	private String approverName;

	private String action; // APPROVED / REJECTED

	private String comment; // optional comment provided by approver

	public WorkflowInstanceEntity getWorkflowInstance() {
		return workflowInstance;
	}

	public void setWorkflowInstance(WorkflowInstanceEntity workflowInstance) {
		this.workflowInstance = workflowInstance;
	}

	public Integer getLevelNumber() {
		return levelNumber;
	}

	public void setLevelNumber(Integer levelNumber) {
		this.levelNumber = levelNumber;
	}

	public Long getApprover() {
		return approver;
	}

	public void setApprover(Long approver) {
		this.approver = approver;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getApproverGroup() {
		return approverGroup;
	}

	public void setApproverGroup(String approverGroup) {
		this.approverGroup = approverGroup;
	}

	public String getApproverName() {
		return approverName;
	}

	public void setApproverName(String approverName) {
		this.approverName = approverName;
	}

}
