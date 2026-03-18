package com.ogi.entityHub.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ogi.entityHub.entity.workflow.WorkflowStagingEntity;
import com.ogi.factory.annotations.Param;

public interface WorkflowDataRepo extends JpaRepository<WorkflowStagingEntity, Long> {

	Optional<WorkflowStagingEntity> findByEntityIdAndEntityType(String entityId, String entityType);

	
	/*
	 * @Modifying
	 * 
	 * @Query("UPDATE WorkflowStagingEntity w SET w.user_assignee = :userAssignee WHERE w.entityId IN :parentIds"
	 * ) int updateUserAssigneeByParentId(@Param("parentIds") List<String>
	 * parentIds,
	 * 
	 * @Param("userAssignee") String userAssignee);
	 */
}
