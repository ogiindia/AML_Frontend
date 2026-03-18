package com.ogi.rulemanager.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.FactConditionEntity;

import java.util.List;

public interface FactConditionRepo extends JpaRepository<FactConditionEntity, Integer> {

	List<FactConditionEntity> findByStatus(String status);

}
