package com.ogi.rulemanager.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.CatalogTypeEntity;

public interface RuleCatalogTypesRespository extends JpaRepository<CatalogTypeEntity, Long> {

	Optional<CatalogTypeEntity> findByName(String name);

}
