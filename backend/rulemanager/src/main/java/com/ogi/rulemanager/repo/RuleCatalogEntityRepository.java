package com.ogi.rulemanager.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ogi.rulemanager.entity.CatalogEntity;

public interface RuleCatalogEntityRepository extends JpaRepository<CatalogEntity, Long> {

//	Optional<CatalogEntity> findByNameAndSchemaName(String name, String schemaName);

	List<CatalogEntity> findBySchema_Id(Long schemaId);

}
