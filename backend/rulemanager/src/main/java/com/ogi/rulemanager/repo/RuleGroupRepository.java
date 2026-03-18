package com.ogi.rulemanager.repo;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.RuleGroupsEntity;

public interface RuleGroupRepository extends JpaRepository<RuleGroupsEntity, UUID> {

}
