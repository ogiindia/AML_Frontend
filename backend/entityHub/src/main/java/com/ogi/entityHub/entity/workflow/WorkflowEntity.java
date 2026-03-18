package com.ogi.entityHub.entity.workflow;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.ogi.factory.pojo.LongBaseEntity;

@Entity
@Table(name = "NGP_WORKFLOW_MASTER_TB")
public class WorkflowEntity extends LongBaseEntity {

	private String name; // RULE_CREATE, RULE_UPDATE
	private String entityType; // e.g., RULE
	private String workflowType;

	@OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL)
	private List<WorkflowApproverEntity> approvers = new ArrayList<WorkflowApproverEntity>(); // includes level info

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEntityType() {
		return entityType;
	}

	public void setEntityType(String entityType) {
		this.entityType = entityType;
	}

	public List<WorkflowApproverEntity> getApprovers() {
		return approvers;
	}

	public void setApprovers(List<WorkflowApproverEntity> approvers) {
		this.approvers = approvers;
	}

	public String getWorkflowType() {
		return workflowType;
	}

	public void setWorkflowType(String workflowType) {
		this.workflowType = workflowType;
	}

}
