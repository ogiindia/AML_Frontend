package com.ogi.entityHub.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.entityHub.entity.workflow.WorkflowEntity;

public interface WorkflowRepo extends JpaRepository<WorkflowEntity, Long> {

	Optional<WorkflowEntity> findByEntityType(String entityType);

}
