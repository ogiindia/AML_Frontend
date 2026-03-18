package com.ogi.rulemanager.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.rulemanager.entity.RuleEntity;

@Repository
public interface RuleRepository extends JpaRepository<RuleEntity, UUID> {
	
	Optional<RuleEntity> findByRuleName(String ruleName);

}
