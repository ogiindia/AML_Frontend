package com.ogi.entityHub.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.entityHub.entity.workflow.WorkflowInstanceEntity;
import com.ogi.entityHub.entity.workflow.WorkflowStagingEntity;

public interface WorkflowInstanceRepo extends JpaRepository<WorkflowInstanceEntity, Long> {

	List<WorkflowInstanceEntity> findByWorkflowIdInAndStatus(List<Long> workflowIds, String string);
	
	List<WorkflowInstanceEntity> findByEntityIdIn(List<String> entityIds);
	

}
