package com.ogi.rulemanager.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.rulemanager.entity.RuleFolderEntity;

@Repository
public interface RuleFolderRepository extends JpaRepository<RuleFolderEntity, UUID> {
	
	Optional<RuleFolderEntity> findByFolderName(String name);

	List<RuleFolderEntity> findByParentId(UUID id);

	ArrayList<RuleFolderEntity> findByParentIsNull();

}
