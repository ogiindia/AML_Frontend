package com.ogi.entityHub.repo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.entityHub.entity.EntityMaster;

@Repository
public interface EntityMasterRepository extends JpaRepository<EntityMaster, Long> {

	Optional<EntityMaster> findByTid(String tid);

	EntityMaster findByEntityActionAndModule(String action, String name);

//	List<EntityMaster> findByMenuIsNull();

}