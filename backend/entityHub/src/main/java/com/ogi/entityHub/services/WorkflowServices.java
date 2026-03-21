package com.ogi.entityHub.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.management.RuntimeErrorException;
import javax.persistence.Tuple;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Expression;
import javax.persistence.criteria.From;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.PrincipalService;
import com.ogi.factory.interfaces.Workflowinterface;
import com.ogi.factory.pojo.FilterCriteria;
import com.ogi.factory.pojo.PagedResult;
import com.ogi.factory.pojo.SortCriteria;
import com.ogi.factory.template.BaseResolver;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.entityHub.EntityBuilder;
import com.ogi.entityHub.entity.workflow.WorkflowApproverEntity;
import com.ogi.entityHub.entity.workflow.WorkflowEntity;
import com.ogi.entityHub.entity.workflow.WorkflowInstanceEntity;
import com.ogi.entityHub.entity.workflow.WorkflowInstanceHistoryEntity;
import com.ogi.entityHub.entity.workflow.WorkflowPayload;
import com.ogi.entityHub.entity.workflow.WorkflowStagingEntity;
import com.ogi.entityHub.repo.WorkflowApproversRepo;
import com.ogi.entityHub.repo.WorkflowDataRepo;
import com.ogi.entityHub.repo.WorkflowInstanceHistory;
import com.ogi.entityHub.repo.WorkflowInstanceImplRepo;
import com.ogi.entityHub.repo.WorkflowInstanceRepo;
import com.ogi.entityHub.repo.WorkflowRepo;

@Service
public class WorkflowServices extends BaseResolver<WorkflowEntity, Long> implements Workflowinterface {

	private final EntityBuilder entityBuilder;

	@Autowired
	WorkflowInstanceRepo workflowInstanceRepo;

	@Autowired
	WorkflowInstanceHistory workflowInstanceHistoryRepo;

	@Autowired
	WorkflowRepo workflowRepo;

	@Autowired
	WorkflowDataRepo workflowDataRepo;

	@Autowired
	PrincipalService principal;

	@Autowired
	WorkflowApproversRepo workflowApproverRepo;
	
	@Autowired
	WorkflowInstanceImplRepo workflowinstanceimplrepo;

	WorkflowServices(EntityBuilder entityBuilder) {
		this.entityBuilder = entityBuilder;
	}

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "WORKFLOW";
	}

	@Override
	@Transactional
	public WorkflowEntity save(WorkflowEntity entity) {
		System.out.println("into reference");
		List<WorkflowApproverEntity> existing = entity.getApprovers();
		List<WorkflowApproverEntity> adding = new ArrayList<>();
		for (WorkflowApproverEntity workflowApproverEntity : existing) {

			workflowApproverEntity.setWorkflow(entity);
			adding.add(workflowApproverEntity);
		}
		return super.save(entity);

	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ_BY_PAGING, Operations.READ_BY_ID, Operations.SAVE, Operations.UPDATE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "CORE";
	}

	@Override
	public Boolean isWorkflowPresent(String entityType) {

		Optional<WorkflowEntity> optionalWorkflowEntity = workflowRepo.findByEntityType(entityType);

		if (optionalWorkflowEntity.isPresent())
			return true;

		return false;
	}

	@Override
	public Long getWorkflowId(String entityType) {

		WorkflowEntity optionalWorkflowEntity = workflowRepo.findByEntityType(entityType)
				.orElseThrow(() -> new RuntimeException("Workflow not found"));

		return optionalWorkflowEntity.getId();

	}

	@Override
	public Boolean isEntityPresentinData(String entityId, String entityType) {
		Optional<WorkflowStagingEntity> optionalWorklowData = workflowDataRepo.findByEntityIdAndEntityType(entityId,
				entityType);

		if (optionalWorklowData.isPresent()) {
			return true;
		}

		return false;
	}

	@Override
	public void SubmitDataToWorkflow(Long workflowId, String payload, String createdBy, String entityId,
			String entityType) {
		String status = "PENDING";
		Integer currentLevel = 1;

		WorkflowStagingEntity pendingData = new WorkflowStagingEntity();

		pendingData.setPayload(payload);
		pendingData.setEntityId(entityId);
		pendingData.setEntityType(entityType);
		pendingData.setCreatedBy(createdBy);
		pendingData.setStatus(status);

		pendingData = workflowDataRepo.save(pendingData);

		WorkflowInstanceEntity instance = new WorkflowInstanceEntity();

		// get workflow
		WorkflowEntity workflow = workflowRepo.findById(workflowId)
				.orElseThrow(() -> new RuntimeException("Workflow does not exists"));

		String customerId = "", transactionId = "";
		try {
			ObjectMapper mapper = new ObjectMapper();

			WorkflowPayload payloadObj = mapper.readValue(payload, WorkflowPayload.class);

			customerId = payloadObj.getCustomerId();
			transactionId = payloadObj.getTransactionId();

		} catch (Exception e) {
			throw new RuntimeException("Invalid payload JSON", e);
		}

		instance.setWorkflow(workflow);
		instance.setPendingData(pendingData);
		instance.setEntityId(entityId);
		instance.setEntityType(entityType);
		instance.setCurrentLevel(currentLevel);
		instance.setStatus(status);
		instance.setCustomerId(customerId);
		instance.setTransactionId(transactionId);

		workflowInstanceRepo.save(instance);

	}

	@GraphQLQuery
	public List<WorkflowInstanceHistoryEntity> getWorflowHistoryByParentId(String id) {
		return workflowInstanceHistoryRepo.findByWorkflowInstanceEntityId(id);
	}
	
	
	public String getWorflowHistoryByParentIdWithComments(String id) {
		 List<WorkflowInstanceHistoryEntity> lstComments =
		            workflowInstanceHistoryRepo.findByWorkflowInstanceEntityId(id);

		    if (lstComments == null || lstComments.isEmpty()) {
		        return "";
		    }

		    return lstComments.stream()
		            .map(WorkflowInstanceHistoryEntity::getComment)
		            .filter(comment -> comment != null && !comment.trim().isEmpty())
		            .collect(Collectors.joining(";"));
	}
	
	public Map<String, Long> getAlertDashboardCountData(String range, String user) {
		 Map<String, Long> lstAltCount =
				 workflowinstanceimplrepo.getAlertDashboardCountData(range,user);

		    if (lstAltCount == null || lstAltCount.isEmpty()) {
		        return null;
		    }

		    return lstAltCount;
	}
	
	

	@GraphQLQuery
	public List<WorkflowInstanceEntity> findEntitiesPendingForApproval() {

		Long userId = principal.getuserId();
		List<Long> groups = principal.getGroupsIds();

		List<Long> workflowIds = workflowApproverRepo.findWorkflowEntityIdsForUser(userId, groups);

		if (workflowIds.isEmpty())
			return List.of();

		// 3. fetch workflow instances in PENDING status
		List<WorkflowInstanceEntity> pendingInstances = workflowInstanceRepo.findByWorkflowIdInAndStatus(workflowIds,
				"PENDING");

		// 4. retain only instances where user is approver for CURRENT level
		List<WorkflowInstanceEntity> pendingItesm = pendingInstances.stream().filter(inst -> {

			boolean allowed = isUserAllowedForLevel(userId, inst.getWorkflow().getId(), inst.getCurrentLevel());
//			System.out.println("Filter check for " + inst.getEntityId() + " = " + allowed);
			return allowed;
		}).collect(Collectors.toList());

		return pendingItesm;
	}

	@GraphQLQuery
	public PagedResult<WorkflowInstanceEntity> findEntitiesPendingForApprovalByPaging(Integer pageNo, Integer pageSize,
			SortCriteria sort, List<FilterCriteria> filter) {

		int safePageNo = (pageNo == null || pageNo < 1) ? 1 : pageNo;
		int safePageSize = (pageSize == null || pageSize < 1) ? 10 : pageSize;

		Long userId = principal.getuserId();
		List<Long> groups = principal.getGroupsIds();

		CriteriaBuilder cb = entityManager.getCriteriaBuilder();

		CriteriaQuery<WorkflowInstanceEntity> cq = cb.createQuery(WorkflowInstanceEntity.class);
		Root<WorkflowInstanceEntity> root = cq.from(WorkflowInstanceEntity.class);
		Join<WorkflowInstanceEntity, WorkflowEntity> workflowJoin = root.join("workflow", JoinType.INNER);
		Join<WorkflowEntity, WorkflowApproverEntity> approverJoin = workflowJoin.join("approvers", JoinType.INNER);

		// Fetch pendingData to avoid N+1 query problem
		root.fetch("pendingData", JoinType.LEFT);

		Map<String, From<?, ?>> joins = new HashMap<>();
		joins.put("workflow", workflowJoin);

		List<Predicate> predicates = new ArrayList<>();
		// predicates.add(cb.equal(root.get("status"), "PENDING"));
		predicates.add(cb.equal(approverJoin.get("levelNumber"), root.get("currentLevel")));

		Predicate userPredicate = cb.and(cb.equal(approverJoin.get("approverType"), "USER"),
				cb.equal(approverJoin.get("approverId"), userId));

		Predicate groupPredicate = cb.disjunction();
		if (groups != null && !groups.isEmpty()) {
			groupPredicate = cb.and(cb.equal(approverJoin.get("approverType"), "GROUP"),
					approverJoin.get("approverId").in(groups));
		}

		predicates.add(cb.or(userPredicate, groupPredicate));

		if (filter != null) {
			for (FilterCriteria fc : filter) {
				if (fc == null || fc.getField() == null || fc.getValue() == null) {
					continue;
				}

				Path<?> fieldPath = resolvePath(root, joins, fc.getField());
				if (fieldPath == null) {
					continue;
				}

				/*
				 * if (fc.getValue() instanceof String) {
				 * predicates.add(cb.like(cb.lower(fieldPath.as(String.class)), "%" + ((String)
				 * fc.getValue()).toLowerCase() + "%")); } else {
				 * predicates.add(cb.equal(fieldPath, fc.getValue())); }
				 */

				String operator = fc.getOperator();
				Object value = fc.getValue();

				if ("EQUAL".equalsIgnoreCase(operator)) {
					predicates.add(cb.equal(fieldPath, value));
				}

				else if ("LIKE".equalsIgnoreCase(operator)) {
					predicates.add(
							cb.like(cb.lower(fieldPath.as(String.class)), "%" + value.toString().toLowerCase() + "%"));
				}

				else if ("IN".equalsIgnoreCase(operator)) {

					List<String> values = Arrays.stream(value.toString().split(",")).map(String::trim)
							.collect(Collectors.toList());

					predicates.add(fieldPath.in(values));
				}
			}
		}

		// cq.select(root).distinct(true).where(predicates.toArray(Predicate[]::new));
		cq.select(root).where(predicates.toArray(Predicate[]::new));

		Expression<Integer> statusOrder = cb.<Integer>selectCase().when(cb.equal(root.get("status"), "PENDING"), 1)
				.when(cb.equal(root.get("status"), "REVIEW"), 2).when(cb.equal(root.get("status"), "APPROVED"), 3)
				.when(cb.equal(root.get("status"), "REJECTED"), 4).otherwise(5);

		if (sort != null && sort.getField() != null) {
			Path<?> sortPath = resolvePath(root, joins, sort.getField());
			if (sortPath != null) {
				if ("ASC".equalsIgnoreCase(sort.getDirection())) {
					cq.orderBy(cb.asc(statusOrder), cb.asc(sortPath));
				} else {
					cq.orderBy(cb.asc(statusOrder), cb.desc(sortPath));
				}
			}
		} else {
			cq.orderBy(cb.asc(statusOrder));
		}

		TypedQuery<WorkflowInstanceEntity> query = entityManager.createQuery(cq);
		query.setFirstResult((safePageNo - 1) * safePageSize);
		query.setMaxResults(safePageSize);
		List<WorkflowInstanceEntity> items = query.getResultList();

		CriteriaQuery<Long> countCq = cb.createQuery(Long.class);
		Root<WorkflowInstanceEntity> countRoot = countCq.from(WorkflowInstanceEntity.class);
		Join<WorkflowInstanceEntity, WorkflowEntity> countWorkflowJoin = countRoot.join("workflow", JoinType.INNER);
		Join<WorkflowEntity, WorkflowApproverEntity> countApproverJoin = countWorkflowJoin.join("approvers",
				JoinType.INNER);

		Map<String, From<?, ?>> countJoins = new HashMap<>();
		countJoins.put("workflow", countWorkflowJoin);

		List<Predicate> countPredicates = new ArrayList<>();
		// countPredicates.add(cb.equal(countRoot.get("status"), "PENDING"));
		countPredicates.add(cb.equal(countApproverJoin.get("levelNumber"), countRoot.get("currentLevel")));

		Predicate countUserPredicate = cb.and(cb.equal(countApproverJoin.get("approverType"), "USER"),
				cb.equal(countApproverJoin.get("approverId"), userId));

		Predicate countGroupPredicate = cb.disjunction();
		if (groups != null && !groups.isEmpty()) {
			countGroupPredicate = cb.and(cb.equal(countApproverJoin.get("approverType"), "GROUP"),
					countApproverJoin.get("approverId").in(groups));
		}

		countPredicates.add(cb.or(countUserPredicate, countGroupPredicate));

		if (filter != null) {
			for (FilterCriteria fc : filter) {
				if (fc == null || fc.getField() == null || fc.getValue() == null) {
					continue;
				}

				Path<?> fieldPath = resolvePath(countRoot, countJoins, fc.getField());
				if (fieldPath == null) {
					continue;
				}

				/*
				 * if (fc.getValue() instanceof String) {
				 * countPredicates.add(cb.like(cb.lower(fieldPath.as(String.class)), "%" +
				 * ((String) fc.getValue()).toLowerCase() + "%")); } else {
				 * countPredicates.add(cb.equal(fieldPath, fc.getValue())); }
				 */

				String operator = fc.getOperator();
				Object value = fc.getValue();

				if ("EQUAL".equalsIgnoreCase(operator)) {
					countPredicates.add(cb.equal(fieldPath, value));
				}

				else if ("LIKE".equalsIgnoreCase(operator)) {
					countPredicates.add(
							cb.like(cb.lower(fieldPath.as(String.class)), "%" + value.toString().toLowerCase() + "%"));
				}

				else if ("IN".equalsIgnoreCase(operator)) {

					List<String> values = Arrays.stream(value.toString().split(",")).map(String::trim)
							.collect(Collectors.toList());

					countPredicates.add(fieldPath.in(values));
				}
			}
		}

		countCq.select(cb.countDistinct(countRoot.get("id"))).where(countPredicates.toArray(Predicate[]::new));
		Long totalElements = entityManager.createQuery(countCq).getSingleResult();

		int totalPages = (int) Math.ceil((double) totalElements / safePageSize);

		boolean isFirst = safePageNo == 1;
		boolean isLast = totalPages == 0 || safePageNo >= totalPages;

		return new PagedResult<>(items, totalElements, totalPages, safePageNo, isFirst, isLast);
	}

	private Path<?> resolvePath(Root<WorkflowInstanceEntity> root, Map<String, From<?, ?>> joins, String fieldPath) {
		if (fieldPath == null || fieldPath.isBlank()) {
			return null;
		}

		String[] parts = fieldPath.split("\\.");
		if (parts.length == 1) {
			return root.get(fieldPath);
		}

		From<?, ?> current = root;
		StringBuilder joinKey = new StringBuilder();
		for (int i = 0; i < parts.length - 1; i++) {
			if (joinKey.length() > 0) {
				joinKey.append('.');
			}
			joinKey.append(parts[i]);
			String key = joinKey.toString();

			From<?, ?> existing = joins.get(key);
			if (existing == null) {
				existing = current.join(parts[i], JoinType.LEFT);
				joins.put(key, existing);
			}
			current = existing;
		}

		return current.get(parts[parts.length - 1]);
	}

	private boolean isUserAllowedForLevel(Long userId, Long workflowEntityId, int level) {

		List<Long> groups = principal.getGroupsIds();
		List<WorkflowApproverEntity> approvers = workflowApproverRepo.findByworkflowIdAndLevelNumber(workflowEntityId,
				level);
		return approvers.stream().anyMatch(a -> (a.getApproverType().equals("USER") && a.getApproverId().equals(userId))
				|| (a.getApproverType().equals("GROUP") && groups.contains(a.getApproverId())));
	}

	@Override
	@GraphQLMutation
	public List<Integer> approveInstance(Long workflowInstanceId, String comments, boolean isApproved) {

		WorkflowInstanceEntity instance = workflowInstanceRepo.findById(workflowInstanceId)
				.orElseThrow(() -> new RuntimeException("Workflow instance not found"));

		if (!instance.getStatus().equals("PENDING"))
			throw new RuntimeException("Already Processed");

		int currentLevel = instance.getCurrentLevel();
		int maxLevel = instance.getWorkflow().getApprovers().size();

		WorkflowInstanceHistoryEntity history = new WorkflowInstanceHistoryEntity();
		history.setWorkflowInstance(instance);
		history.setLevelNumber(currentLevel);
		history.setAction(isApproved ? "APPROVED" : "REJECTED");
		history.setApprover(principal.getuserId());
		history.setApproverName(principal.getLoginUser());
		history.setComment(comments);

		workflowInstanceHistoryRepo.save(history);

		if (currentLevel < maxLevel) {
			instance.setStatus(isApproved ? "PENDING" : "REJECTED");
			if (isApproved)
				instance.setCurrentLevel(currentLevel + 1);
		} else {
			instance.setStatus(isApproved ? "APPROVED" : "REJECTED");
			instance.getPendingData().setStatus(isApproved ? "APPROVED" : "REJECTED");
		}

		workflowInstanceRepo.save(instance);

		return Arrays.asList(currentLevel, currentLevel + 1, maxLevel);

	}

	@GraphQLMutation
	@Override
	public boolean escalateRejectedWorkflow(Long instanceId, String comments) {

		WorkflowInstanceEntity instance = workflowInstanceRepo.findById(instanceId)
				.orElseThrow(() -> new RuntimeException("Workflow instance not found"));

		if (!instance.getStatus().equals("REJECTED"))
			throw new RuntimeException("Entity not eligible for escalation");

		WorkflowInstanceHistoryEntity history = new WorkflowInstanceHistoryEntity();
		history.setWorkflowInstance(instance);
		history.setLevelNumber(instance.getCurrentLevel());
		history.setAction("ESCALATED");
		history.setApprover(principal.getuserId());
		history.setApproverName(principal.getLoginUser());
		history.setComment(comments);

		workflowInstanceHistoryRepo.save(history);

		instance.setCurrentLevel(1); // restart workflow
		instance.setStatus("PENDING"); // back to pending
		instance.getPendingData().setStatus("PENDING");

		workflowInstanceRepo.save(instance);

		return true;

	}

	@GraphQLMutation
	public boolean updateUserAssigneeByParentId(List<String> entityIds, String userAssignee) {
		try {

			List<WorkflowInstanceEntity> workflowList = workflowInstanceRepo.findByEntityIdIn(entityIds);

			if (workflowList == null || workflowList.isEmpty()) {
				return false;
			}

			for (WorkflowInstanceEntity workflowData : workflowList) {
				workflowData.setUser_assignee(userAssignee);
			}

			workflowInstanceRepo.saveAll(workflowList);

			return true;

		} catch (Exception ex) {
			return false;
		}
	}

}
