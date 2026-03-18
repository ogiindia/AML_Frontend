package com.ogi.factory.interfaces;

import java.util.List;

public interface Workflowinterface {

	void SubmitDataToWorkflow(Long workflowId, String payload, String createdBy, String entityId, String entityType);

	Boolean isWorkflowPresent(String entityType);

	Long getWorkflowId(String entityType);

	Boolean isEntityPresentinData(String entityId, String entityType);

	List<Integer> approveInstance(Long workflowInstanceId, String comments, boolean isApproved);

	boolean escalateRejectedWorkflow(Long instanceId, String comments);
	
	boolean updateUserAssigneeByParentId(List<String> entityIds, String userAssignee);
	
	String getWorflowHistoryByParentIdWithComments(String parentId);
	

}
