package com.ogi.rulemanager.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.rulemanager.entity.SchemaMaster;

@Repository
public interface SchemaMasterEntityRepo extends JpaRepository<SchemaMaster, Long> {

	List<SchemaMaster> findByschemaType(String type);

}
