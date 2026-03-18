package com.ogi.rulemanager.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.FactsEntity;

public interface RuleFactRepository extends JpaRepository<FactsEntity, String> {

}
