package com.ogi.rulemanager.repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.RuleConditionsEntity;

public interface RuleConditionRepository extends JpaRepository<RuleConditionsEntity, UUID> {

}
