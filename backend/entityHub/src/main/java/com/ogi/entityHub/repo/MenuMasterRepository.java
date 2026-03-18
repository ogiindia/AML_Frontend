package com.ogi.entityHub.repo;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.entityHub.entity.MenuMaster;

@Repository
public interface MenuMasterRepository extends JpaRepository<MenuMaster, Long> {

	Set<MenuMaster> findByEntIn(Set<EntityMaster> entities);
	
	Optional<MenuMaster> findByPath(String tId);

}
