package com.ogi.entityHub.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.entityHub.entity.workflow.WorkflowInstanceHistoryEntity;

public interface WorkflowInstanceHistory extends JpaRepository<WorkflowInstanceHistoryEntity, Long> {

	List<WorkflowInstanceHistoryEntity> findByWorkflowInstanceEntityId(String entityId);

}
