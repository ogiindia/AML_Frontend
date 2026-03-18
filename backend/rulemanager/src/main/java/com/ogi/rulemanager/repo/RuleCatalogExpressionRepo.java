package com.ogi.rulemanager.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.rulemanager.entity.CatalogExpressionsEntity;

@Repository
public interface RuleCatalogExpressionRepo extends JpaRepository<CatalogExpressionsEntity, Long> {

}
