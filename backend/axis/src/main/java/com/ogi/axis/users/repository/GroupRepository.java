package com.ogi.axis.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ogi.entityHub.entity.EntityMaster;
import com.ogi.axis.users.entity.GroupEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<GroupEntity, Long> {

	Optional<GroupEntity> findByGroupName(String groupName);

	@Query("SELECT c from GroupEntity g JOIN g.entities c where g.id = :groupId")
	List<EntityMaster> findAllByGroupId(@Param("groupId") Long groupId);

	List<GroupEntity> findByUsers_Id(Long userId);
}
