package com.ogi.entityHub.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ogi.entityHub.entity.AppEntity;
import com.ogi.entityHub.entity.EntityMaster;

@Repository
public interface AppEntityRepository extends JpaRepository<AppEntity, Long> {
	
	AppEntity findByAppId(String appId);
	
	List<AppEntity> findByActive(boolean active);

	List<AppEntity> findByActiveTrue();

}
