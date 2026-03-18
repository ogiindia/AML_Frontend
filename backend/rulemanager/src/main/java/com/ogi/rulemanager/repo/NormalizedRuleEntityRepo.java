package com.ogi.rulemanager.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.NormalizedRuleEntity;

public interface NormalizedRuleEntityRepo extends JpaRepository<NormalizedRuleEntity, Long> {
	
	Optional<NormalizedRuleEntity> findByRuleName(String ruleName);

}
