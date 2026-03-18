package com.ogi.entityHub.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ogi.entityHub.entity.workflow.WorkflowApproverEntity;

public interface WorkflowApproversRepo extends JpaRepository<WorkflowApproverEntity, Long> {

	@Query("SELECT wa.workflow.id\r\n" + "    FROM WorkflowApproverEntity wa\r\n" + "    WHERE \r\n"
			+ "       (wa.approverType = 'USER' AND wa.approverId = :userId)\r\n" + "       OR\r\n"
			+ "       (wa.approverType = 'GROUP' AND wa.approverId IN :groups)")
	List<Long> findWorkflowEntityIdsForUser(Long userId, List<Long> groups);

	List<WorkflowApproverEntity> findByworkflowIdAndLevelNumber(Long workflowEntityId, int level);

}
