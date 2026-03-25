package com.ogi.rulemanager.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.rulemanager.entity.SchemaMaster;

@Repository
public interface SchemaMasterEntityRepo extends JpaRepository<SchemaMaster, Long> {

	List<SchemaMaster> findByschemaType(String type);
	
	Optional<SchemaMaster> findByschemaName(String shortName);

}
