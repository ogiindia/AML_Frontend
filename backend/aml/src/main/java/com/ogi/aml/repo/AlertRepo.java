package com.ogi.aml.repo;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ogi.aml.entity.AlertsEntity;
import com.ogi.aml.entity.DTO.AlertsDTO;

public interface AlertRepo extends JpaRepository<AlertsEntity, String> {

	@Query("SELECT a.alertParentId as parentId, COUNT(a.alertId) as alertId, a.custId as customerId,a.alertStatus as status,a.transactionId as transactionId FROM AlertsEntity a where alertStatus = :status GROUP BY a.alertParentId,a.custId,a.alertStatus,a.transactionId")
	List<Object[]> findAlertsByStatus(String status);

	@Query("SELECT a.alertParentId as parentId, COUNT(a.alertId) as alertId, a.custId as customerId,a.alertStatus as status FROM AlertsEntity a where alertStatus NOT IN ( :statuses ) GROUP BY a.alertParentId,a.custId,a.alertStatus")
	List<Object[]> findAlertsByStatusNotIn(List<String> statuses);

	List<AlertsEntity> findByAlertParentId(String parentId);

	@Transactional
	@Modifying
	@Query("UPDATE AlertsEntity e SET e.alertStatus = :status WHERE e.alertParentId = :parentId")
	int updateStatusByParentId(@Param("status") String status, @Param("parentId") String parentId);
	
	
}
