package com.ogi.aml.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ogi.factory.annotations.GraphQLMutation;
import com.ogi.factory.annotations.GraphQLQuery;
import com.ogi.factory.annotations.Required;
import com.ogi.factory.enums.Operations;
import com.ogi.factory.interfaces.EntityInterface;
import com.ogi.factory.interfaces.PrincipalService;
import com.ogi.factory.interfaces.Workflowinterface;
import com.ogi.factory.pojo.BaseEntity;
import com.ogi.factory.pojo.FilterCriteria;
import com.ogi.factory.pojo.PagedResult;
import com.ogi.factory.pojo.SortCriteria;
import com.ogi.factory.template.BaseResolver;
import com.ogi.aml.Common.Constants;
import com.ogi.aml.Controller.AmlController;
import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.entity.CashTransactionEntity;
import com.ogi.aml.entity.DTO.AlertsDTO;
import com.ogi.aml.repo.AlertRepo;
import com.ogi.aml.response.ResponseCashTransactionData;

@Service
public class AlertService extends BaseResolver<AlertsEntity, String> {

	private Logger LOGGER = LoggerFactory.getLogger(AlertService.class);

	@Autowired
	AlertRepo alertRepo;

	@Autowired
	Workflowinterface workflowService;

	@Autowired
	PrincipalService prinicipal;

	@Autowired
	EntityInterface entityService;

	@Autowired
	ObjectMapper obj;

	@Override
	public String getEntityID() {
		// TODO Auto-generated method stub
		return "ALERTS";
	}

	@Override
	public Set<Operations> getSupportedOperations() {
		// TODO Auto-generated method stub
		return Set.of(Operations.READ, Operations.UPDATE);
	}

	@Override
	public String getAppID() {
		// TODO Auto-generated method stub
		return "AML";
	}

	@GraphQLQuery
	public List<AlertsEntity> findAlertsByParentId(String parentId) {
		System.out.println(parentId);
		return alertRepo.findByAlertParentId(parentId);
	}

	@GraphQLQuery
	public PagedResult<AlertsEntity> findAlertsByPaging(Integer pageNo, Integer pageSize, SortCriteria sort,
			List<FilterCriteria> filter) {
		try {
			LOGGER.info("GraphQL findAlertsByPaging called | pageNo={} | pageSize={}", pageNo, pageSize);

			if (sort != null) {
				sort.setField("alertId");
			}

			CriteriaBuilder cb = entityManager.getCriteriaBuilder();

			// MAIN query to return Alert entities
			CriteriaQuery<AlertsEntity> cq = cb.createQuery(AlertsEntity.class);
			Root<AlertsEntity> root = cq.from(AlertsEntity.class);

			// -------------------------
			// SUBQUERY: one alertId per parentAlertId
			// -------------------------
			Subquery<Long> sq = cq.subquery(Long.class);
			Root<AlertsEntity> subRoot = sq.from(AlertsEntity.class);

			// Apply filters inside subquery - REQUIRED!
			List<Predicate> subPredicates = new ArrayList<>();

			for (FilterCriteria fc : filter) {
				if (fc.getValue() == null)
					continue;

				if (fc.getValue() instanceof String) {
					subPredicates.add(cb.like(cb.lower(subRoot.get(fc.getField())),
							"%" + ((String) fc.getValue()).toLowerCase() + "%"));
				} else {
					subPredicates.add(cb.equal(subRoot.get(fc.getField()), fc.getValue()));
				}
			}

			sq.select(cb.max(subRoot.get("alertId"))); // choose representative
			sq.where(subPredicates.toArray(Predicate[]::new));
			sq.groupBy(subRoot.get("alertParentId"));

			// -------------------------
			// MAIN QUERY filters
			// -------------------------
			List<Predicate> predicates = new ArrayList<>();

			for (FilterCriteria fc : filter) {
				if (fc.getValue() == null)
					continue;

				if (fc.getValue() instanceof String) {
					predicates.add(cb.like(cb.lower(root.get(fc.getField())),
							"%" + ((String) fc.getValue()).toLowerCase() + "%"));
				} else {
					predicates.add(cb.equal(root.get(fc.getField()), fc.getValue()));
				}
			}

			// Only select rows whose alertId is in the grouped set
			predicates.add(root.get("alertId").in(sq));

			cq.where(predicates.toArray(Predicate[]::new));

			// -------------------------
			// SORT
			// -------------------------
			if (sort != null && sort.getField() != null) {

				LOGGER.debug("Applying sorting | field={} | direction={}", sort.getField(), sort.getDirection());

				if ("ASC".equalsIgnoreCase(sort.getDirection())) {
					cq.orderBy(cb.asc(root.get(sort.getField())));
				} else {
					cq.orderBy(cb.desc(root.get(sort.getField())));
				}
			}

			TypedQuery<AlertsEntity> query = entityManager.createQuery(cq);

			// paging
			query.setFirstResult((pageNo - 1) * pageSize);
			query.setMaxResults(pageSize);

			List<AlertsEntity> items = query.getResultList();

			LOGGER.info("Alerts fetched | resultCount={}", items.size());

			CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
			Root<AlertsEntity> countRoot = countQuery.from(AlertsEntity.class);

			List<Predicate> countPreds = new ArrayList<>();
			for (FilterCriteria fc : filter) {
				if (fc.getValue() == null)
					continue;

				if (fc.getValue() instanceof String) {
					countPreds.add(cb.like(cb.lower(countRoot.get(fc.getField())),
							"%" + ((String) fc.getValue()).toLowerCase() + "%"));
				} else {
					countPreds.add(cb.equal(countRoot.get(fc.getField()), fc.getValue()));
				}
			}

			countQuery.select(cb.countDistinct(countRoot.get("alertParentId")));
			countQuery.where(countPreds.toArray(Predicate[]::new));

			Long totalElements = entityManager.createQuery(countQuery).getSingleResult();

			int totalPages = (int) Math.ceil((double) totalElements / pageSize);
			boolean isFirst = pageNo == 1;
			boolean isLast = pageNo >= totalPages;

			LOGGER.info("Paging result | totalElements={} | totalPages={} | currentPage={}", totalElements, totalPages,
					pageNo);

			return new PagedResult<AlertsEntity>(items, totalElements, totalPages, pageNo, isFirst, isLast);
		} catch (Exception ex) {

			LOGGER.error("Exception occurred in findAlertsByPaging", ex);
			throw ex;
		}
	}

	@GraphQLMutation
	public boolean updateAlertsViaReview(AlertsDTO alert) {
		try {

			LOGGER.info("GraphQL updateAlertsViaReview called | parentId={} | instanceId={} | approved={}",
					alert.getParentId(), alert.getInstanceId(), alert.isApproved());

			if (alert.getParentId() == null || alert.getInstanceId() == null) {

				LOGGER.warn("Invalid alert review request | parentId={} | instanceId={}", alert.getParentId(),
						alert.getInstanceId());

				return false;
			}

			List<Integer> result = workflowService.approveInstance(Long.valueOf(alert.getInstanceId()),
					alert.getComments(), alert.isApproved());

			if (result != null && result.size() == 3) {

				int currentlevel = result.get(0);
				int nextlevel = result.get(1);
				int maxLevel = result.get(2);

				String status = "LEVEL " + currentlevel;

				if (!alert.isApproved()) {
					status = "REJECTED";
				} else if (nextlevel > maxLevel) {
					status = "APPROVED";
				}

				LOGGER.info("Updating alert status | parentId={} | status={}", alert.getParentId(), status);

				alertRepo.updateStatusByParentId(status, alert.getParentId());

			} else {

				LOGGER.warn("Unexpected workflow response | instanceId={} | result={}", alert.getInstanceId(), result);
			}

			return true;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in updateAlertsViaReview | parentId={} | instanceId={}",
					alert.getParentId(), alert.getInstanceId(), ex);

			return false;
		}
	}

	@GraphQLMutation
	public boolean updateUserAssignProcess(AlertsDTO alert) {
		try {

			LOGGER.info("GraphQL updateUserAssignProcess called | entityIds={} | userAssignee={}", alert.getEntityIds(),
					alert.getUserAssignee());

			if (alert.getEntityIds() == null || alert.getUserAssignee() == null) {

				LOGGER.warn("Invalid assignment request | entityIds={} | userAssignee={}", alert.getEntityIds(),
						alert.getUserAssignee());

				return false;
			}

			boolean result = workflowService.updateUserAssigneeByParentId(alert.getEntityIds(),
					alert.getUserAssignee());

			LOGGER.info("User assignment updated | entityIds={} | userAssignee={} | result={}", alert.getEntityIds(),
					alert.getUserAssignee(), result);

			return result;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in updateUserAssignProcess | entityIds={} | userAssignee={}",
					alert.getEntityIds(), alert.getUserAssignee(), ex);

			return false;
		}
	}

	@GraphQLQuery
	public List<AlertsDTO> findClutchedAlerts() {

		try {

			LOGGER.info("GraphQL findClutchedAlerts called");

			List<Object[]> alertsList = alertRepo
					.findAlertsByStatusNotIn(Arrays.asList("PENDING", "REVIEW", "APPROVED", "REJECTED"));

			if (alertsList == null || alertsList.isEmpty()) {
				LOGGER.warn("No clutched alerts found");
				return Collections.emptyList();
			}

			LOGGER.info("Clutched alerts fetched | recordCount={}", alertsList.size());

			List<AlertsDTO> alerts = new ArrayList<>();

			for (Object[] obj : alertsList) {

				String parentId = (String) obj[0];
				Long alertId = (Long) obj[1];
				String customerId = (String) obj[2];
				String status = (String) obj[3];

				AlertsDTO dto = new AlertsDTO(parentId, customerId, alertId, "-", status);

				alerts.add(dto);

				LOGGER.debug("Mapped alert | parentId={} | alertId={} | status={}", parentId, alertId, status);
			}

			return alerts;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in findClutchedAlerts", ex);
			return Collections.emptyList();
		}
	}

	@GraphQLQuery
	public List<AlertsDTO> findAlertsByStatus(String status) {

		try {

			LOGGER.info("GraphQL findAlertsByStatus called | status={}", status);

			List<Object[]> alertsList = alertRepo.findAlertsByStatus(status);

			if (alertsList == null || alertsList.isEmpty()) {

				LOGGER.warn("No alerts found for status={}", status);
				return Collections.emptyList();
			}

			LOGGER.info("Alerts fetched | status={} | recordCount={}", status, alertsList.size());

			List<AlertsDTO> alerts = new ArrayList<>();

			for (Object[] obj : alertsList) {

				String parentId = (String) obj[0];
				Long alertId = (Long) obj[1];
				String customerId = (String) obj[2];
				String tstatus = (String) obj[3];

				AlertsDTO dto = new AlertsDTO(parentId, customerId, alertId, "-", tstatus);

				alerts.add(dto);

				LOGGER.debug("Mapped alert | parentId={} | alertId={} | status={}", parentId, alertId, tstatus);
			}

			return alerts;

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in findAlertsByStatus | status={}", status, ex);
			return Collections.emptyList();
		}

	}

	//@Scheduled(fixedDelay = 8000000) // 1 min wait for the previous thread and starts at next minute
	@Scheduled(fixedDelay = 20000)
	public void ParseAlerts() throws JsonProcessingException {
		try {

			LOGGER.info("Scheduled job ParseAlerts started");

			String status = "PENDING";
			String entityAction = "UPDATE";
			String entityModule = getEntityID();

			if (!entityService.isEntityexists(entityModule, entityAction)) {

				LOGGER.warn("Entity not found | module={} | action={}", entityModule, entityAction);
				return;
			}

			String entityId = Long.toString(entityService.getEntityById(entityModule, entityAction));

			LOGGER.info("Entity found | entityId={}", entityId);

			if (!workflowService.isWorkflowPresent(entityId)) {

				LOGGER.warn("Workflow not present | entityId={}", entityId);
				return;
			}

			Long workflowId = workflowService.getWorkflowId(entityId);

			LOGGER.info("Workflow found | workflowId={}", workflowId);

			List<Object[]> alertsList = alertRepo.findAlertsByStatus(status);

			if (alertsList == null || alertsList.isEmpty()) {

				LOGGER.info("No alerts found with status={}", status);
				return;
			}

			LOGGER.info("Alerts marked for workflow | count={}", alertsList.size());

			for (Object[] object : alertsList) {

				String parentId = (String) object[0];
				Long alertId = (Long) object[1];
				String customerId = (String) object[2];
				String rstatus = (String) object[3];
				String txnId = (String) object[4];

				AlertsDTO dto = new AlertsDTO(parentId, customerId, alertId, "-", rstatus, txnId);

				String payload = obj.writeValueAsString(dto);

				LOGGER.debug("Processing alert | parentId={} | alertId={}", parentId, alertId);

				if (!workflowService.isEntityPresentinData(parentId, entityId)) {

					workflowService.SubmitDataToWorkflow(workflowId, payload, "system", parentId, entityId);

					LOGGER.info("Alert submitted to workflow | parentId={} | workflowId={}", parentId, workflowId);
				}

				alertRepo.updateStatusByParentId("OPEN", parentId);

				LOGGER.debug("Alert status updated to OPEN | parentId={}", parentId);
			}

			LOGGER.info("Scheduled job ParseAlerts completed");

		} catch (Exception ex) {

			LOGGER.error("Exception occurred in ParseAlerts scheduled job", ex);
		}
	}

}
